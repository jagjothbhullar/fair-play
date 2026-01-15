import { NextRequest, NextResponse } from 'next/server'
import { calculateNILValue, sports, dealTypes, followerTiers, schoolTiers } from '@/lib/data/nil-reference-data'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sport, dealType, schoolTier, followerTier } = body

    // Validate inputs
    if (!sport || !dealType || !schoolTier || !followerTier) {
      return NextResponse.json(
        { error: 'Missing required fields: sport, dealType, schoolTier, followerTier' },
        { status: 400 }
      )
    }

    if (!sports.includes(sport)) {
      return NextResponse.json(
        { error: 'Invalid sport', validOptions: sports },
        { status: 400 }
      )
    }

    if (!dealTypes.includes(dealType)) {
      return NextResponse.json(
        { error: 'Invalid deal type', validOptions: dealTypes },
        { status: 400 }
      )
    }

    if (!schoolTiers.find(t => t.value === schoolTier)) {
      return NextResponse.json(
        { error: 'Invalid school tier', validOptions: schoolTiers.map(t => t.value) },
        { status: 400 }
      )
    }

    if (!followerTiers.includes(followerTier)) {
      return NextResponse.json(
        { error: 'Invalid follower tier', validOptions: followerTiers },
        { status: 400 }
      )
    }

    // Calculate NIL value
    const result = calculateNILValue({
      sport,
      dealType,
      schoolTier,
      followerTier,
    })

    return NextResponse.json({
      success: true,
      estimation: {
        low: result.estimatedLow,
        median: result.estimatedMedian,
        high: result.estimatedHigh,
      },
      comparableDeals: result.comparableDeals,
      confidence: result.confidence,
      methodology: 'Based on CalMatters NIL Deals Database (16 California D1 universities, 2021-2025)',
      disclaimer: 'These estimates are for informational purposes only. Actual deal values may vary based on individual circumstances, market conditions, and negotiation.',
    })
  } catch (error) {
    console.error('Error calculating NIL value:', error)
    return NextResponse.json(
      { error: 'Failed to calculate NIL value' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve options
export async function GET() {
  return NextResponse.json({
    sports,
    dealTypes,
    schoolTiers: schoolTiers.map(t => ({ value: t.value, label: t.label })),
    followerTiers,
  })
}
