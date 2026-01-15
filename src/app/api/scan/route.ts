import { NextRequest, NextResponse } from 'next/server'
import { scanContract } from '@/lib/services/contract-scanner'
import { sendScanResultsEmail } from '@/lib/services/email'
import { checkRateLimit, rateLimiters } from '@/lib/rate-limit'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/db'

// Page limit for PDF files
const MAX_PDF_PAGES = 25

// Lazy-initialize Supabase client (only when needed at runtime)
let supabase: SupabaseClient | null = null
function getSupabase(): SupabaseClient | null {
  if (!supabase && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  }
  return supabase
}

// Track authenticated user scans for throttling
const userScanCounts = new Map<string, { count: number; lastReset: number }>()

function getUserScanCount(userId: string): number {
  const now = Date.now()
  const hourInMs = 60 * 60 * 1000
  const userScans = userScanCounts.get(userId)

  if (!userScans || now - userScans.lastReset > hourInMs) {
    userScanCounts.set(userId, { count: 0, lastReset: now })
    return 0
  }

  return userScans.count
}

function incrementUserScanCount(userId: string): void {
  const current = userScanCounts.get(userId)
  if (current) {
    current.count++
  } else {
    userScanCounts.set(userId, { count: 1, lastReset: Date.now() })
  }
}

// Public endpoint for contract scanning
// Rate limited: 5 requests per hour per IP (for anonymous users)
// Authenticated users: unlimited but throttled after 3rd scan
export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const isAuthenticated = formData.get('authenticated') === 'true'

  // For non-authenticated users, apply strict rate limiting
  if (!isAuthenticated) {
    const { success, response } = await checkRateLimit(request, rateLimiters.scan)
    if (!success && response) {
      return response
    }
  }

  try {
    const file = formData.get('file') as File | null
    const text = formData.get('text') as string | null
    const email = formData.get('email') as string | null

    let contractText = ''
    let pageCount = 0

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer())

      if (file.type === 'application/pdf') {
        // Check page count before processing
        const pdfParse = (await import('pdf-parse')).default
        const pdfData = await pdfParse(buffer)
        pageCount = pdfData.numpages

        if (pageCount > MAX_PDF_PAGES) {
          return NextResponse.json(
            { error: `PDF too long. Maximum ${MAX_PDF_PAGES} pages allowed. Your document has ${pageCount} pages.` },
            { status: 400 }
          )
        }

        contractText = pdfData.text
      } else if (file.type === 'text/plain') {
        contractText = buffer.toString('utf-8')

        // Estimate pages for text files (roughly 3000 chars per page)
        pageCount = Math.ceil(contractText.length / 3000)
        if (pageCount > MAX_PDF_PAGES) {
          return NextResponse.json(
            { error: `Document too long. Maximum ~${MAX_PDF_PAGES * 3000} characters allowed.` },
            { status: 400 }
          )
        }
      } else {
        return NextResponse.json(
          { error: 'Unsupported file type. Please upload a PDF or text file.' },
          { status: 400 }
        )
      }
    } else if (text) {
      contractText = text

      // Check text length
      pageCount = Math.ceil(text.length / 3000)
      if (pageCount > MAX_PDF_PAGES) {
        return NextResponse.json(
          { error: `Text too long. Maximum ~${MAX_PDF_PAGES * 3000} characters allowed.` },
          { status: 400 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'Please provide a file or text to scan' },
        { status: 400 }
      )
    }

    if (contractText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Contract text is too short to analyze' },
        { status: 400 }
      )
    }

    // For authenticated users, add throttling after 3rd scan
    let userId: string | null = null
    if (isAuthenticated) {
      // Get user from auth header if available
      const authHeader = request.headers.get('authorization')
      const supabaseClient = getSupabase()
      if (authHeader && supabaseClient) {
        const token = authHeader.replace('Bearer ', '')
        const { data: { user } } = await supabaseClient.auth.getUser(token)
        userId = user?.id || null
      }

      // Use IP as fallback identifier
      if (!userId) {
        const forwardedFor = request.headers.get('x-forwarded-for')
        userId = forwardedFor?.split(',')[0].trim() || 'anonymous'
      }

      const scanCount = getUserScanCount(userId)

      // After 3rd scan in an hour, add a 5-second delay (throttling)
      if (scanCount >= 3) {
        await new Promise(resolve => setTimeout(resolve, 5000))
      }

      incrementUserScanCount(userId)
    }

    // Scan without athlete context (public/generic scan)
    const result = await scanContract(contractText, null)

    // Save scan history for authenticated users
    const userIdFromForm = formData.get('userId') as string | null
    if (isAuthenticated && userIdFromForm) {
      try {
        await prisma.scanHistory.create({
          data: {
            supabaseUserId: userIdFromForm,
            fileName: file?.name || null,
            inputType: file ? 'file' : 'text',
            pageCount: pageCount || null,
            summary: result.summary,
            overallRisk: result.overallRisk,
            redFlagsCount: result.redFlags.length,
            redFlags: JSON.parse(JSON.stringify(result.redFlags)),
            keyTerms: JSON.parse(JSON.stringify(result.keyTerms)),
            suggestedRedlines: result.suggestedRedlines ? JSON.parse(JSON.stringify(result.suggestedRedlines)) : null,
          },
        })
      } catch (err) {
        console.error('Failed to save scan history:', err)
        // Don't fail the request if saving history fails
      }
    }

    // Send email with results (non-blocking)
    if (email && email.includes('@')) {
      sendScanResultsEmail({
        email,
        summary: result.summary,
        overallRisk: result.overallRisk,
        redFlagsCount: result.redFlags.length,
        redFlags: result.redFlags,
        keyTerms: result.keyTerms,
        suggestedRedlinesCount: result.suggestedRedlines?.length || 0,
      }).catch(err => console.error('Email send failed:', err))
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error scanning contract:', error)
    return NextResponse.json(
      { error: 'Failed to scan contract. Please try again.' },
      { status: 500 }
    )
  }
}
