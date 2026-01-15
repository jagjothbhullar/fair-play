import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { checkRateLimit, rateLimiters } from '@/lib/rate-limit'

// Check if email can scan (GET) or register/use a scan (POST)
// Rate limited: 10 requests per hour per IP
export async function POST(request: NextRequest) {
  // Check rate limit first
  const { success, response } = await checkRateLimit(request, rateLimiters.freeScan)
  if (!success && response) {
    return response
  }

  try {
    const { email, action } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    if (action === 'check') {
      // Just check if they can scan
      const freeUser = await prisma.freeUser.findUnique({
        where: { email: normalizedEmail },
      })

      if (!freeUser) {
        // New user, can scan
        return NextResponse.json({ canScan: true, scansRemaining: 1 })
      }

      const canScan = freeUser.scansUsed < freeUser.scanLimit
      return NextResponse.json({
        canScan,
        scansRemaining: Math.max(0, freeUser.scanLimit - freeUser.scansUsed),
        scansUsed: freeUser.scansUsed,
      })
    }

    if (action === 'use') {
      // Register email and use a scan
      const freeUser = await prisma.freeUser.upsert({
        where: { email: normalizedEmail },
        update: {
          scansUsed: { increment: 1 },
          lastScanAt: new Date(),
        },
        create: {
          email: normalizedEmail,
          scansUsed: 1,
          lastScanAt: new Date(),
        },
      })

      // Check if they exceeded limit (race condition protection)
      if (freeUser.scansUsed > freeUser.scanLimit) {
        return NextResponse.json({
          error: 'Scan limit reached',
          canScan: false,
          scansRemaining: 0,
        }, { status: 403 })
      }

      return NextResponse.json({
        success: true,
        canScan: freeUser.scansUsed < freeUser.scanLimit,
        scansRemaining: Math.max(0, freeUser.scanLimit - freeUser.scansUsed),
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Free scan error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
