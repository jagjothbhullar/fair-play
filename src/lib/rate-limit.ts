import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Redis client (will be null if env vars not set)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

// Different rate limiters for different use cases
export const rateLimiters = {
  // Contract scan - expensive API call, strict limit
  // 5 requests per hour per IP
  scan: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '1 h'),
        analytics: true,
        prefix: 'ratelimit:scan',
      })
    : null,

  // Free scan registration - prevent email spam
  // 10 requests per hour per IP
  freeScan: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '1 h'),
        analytics: true,
        prefix: 'ratelimit:free-scan',
      })
    : null,

  // Public API endpoints - general protection
  // 100 requests per minute per IP
  api: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '1 m'),
        analytics: true,
        prefix: 'ratelimit:api',
      })
    : null,
}

// Get client IP from request
export function getClientIP(request: NextRequest): string {
  // Try various headers that might contain the real IP
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  // Fallback to a default (shouldn't happen in production)
  return '127.0.0.1'
}

// Rate limit check function
export async function checkRateLimit(
  request: NextRequest,
  limiter: Ratelimit | null,
  identifier?: string
): Promise<{ success: boolean; response?: NextResponse }> {
  // If rate limiting not configured, allow request but log warning
  if (!limiter) {
    console.warn('Rate limiting not configured - UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN missing')
    return { success: true }
  }

  const ip = identifier || getClientIP(request)
  const { success, limit, remaining, reset } = await limiter.limit(ip)

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000)

    return {
      success: false,
      response: NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': retryAfter.toString(),
          },
        }
      ),
    }
  }

  return { success: true }
}

// Middleware-style rate limit wrapper
export function withRateLimit(
  limiter: Ratelimit | null,
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const { success, response } = await checkRateLimit(request, limiter)

    if (!success && response) {
      return response
    }

    return handler(request)
  }
}
