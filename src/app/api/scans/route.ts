import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { checkRateLimit, rateLimiters } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  // Rate limit
  const { success, response } = await checkRateLimit(request, rateLimiters.api)
  if (!success && response) {
    return response
  }

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const scans = await prisma.scanHistory.findMany({
      where: { supabaseUserId: userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fileName: true,
        inputType: true,
        pageCount: true,
        summary: true,
        overallRisk: true,
        redFlagsCount: true,
        redFlags: true,
        keyTerms: true,
        suggestedRedlines: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ scans })
  } catch (error) {
    console.error('Error fetching scans:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scans' },
      { status: 500 }
    )
  }
}
