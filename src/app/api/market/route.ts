import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sport = searchParams.get('sport')
    const dealType = searchParams.get('dealType')
    const schoolTier = searchParams.get('schoolTier')
    const brandTier = searchParams.get('brandTier')

    // Build where clause
    const where: Record<string, unknown> = {}
    if (sport) where.sport = sport
    if (dealType) where.dealType = dealType
    if (schoolTier) where.schoolTier = schoolTier
    if (brandTier) where.brandTier = brandTier

    // Fetch deals
    const deals = await prisma.nILDealReport.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    // Calculate stats
    const allDeals = await prisma.nILDealReport.findMany({
      where,
      select: { totalValue: true, sport: true, dealType: true },
    })

    const values = allDeals.map(d => d.totalValue).sort((a, b) => a - b)
    const avgDealValue = values.length > 0
      ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
      : 0
    const medianDealValue = values.length > 0
      ? values[Math.floor(values.length / 2)]
      : 0

    // Get top sport and deal type
    const sportCounts: Record<string, number> = {}
    const dealTypeCounts: Record<string, number> = {}
    allDeals.forEach(d => {
      sportCounts[d.sport] = (sportCounts[d.sport] || 0) + 1
      dealTypeCounts[d.dealType] = (dealTypeCounts[d.dealType] || 0) + 1
    })

    const topSport = Object.entries(sportCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
    const topDealType = Object.entries(dealTypeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

    return NextResponse.json({
      deals,
      stats: {
        totalDeals: allDeals.length,
        avgDealValue,
        medianDealValue,
        topSport,
        topDealType,
      },
    })
  } catch (error) {
    console.error('Market API error:', error)
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 })
  }
}
