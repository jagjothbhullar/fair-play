import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const athlete = await prisma.athlete.findFirst({
      where: { supabaseUserId: user.id },
    })

    if (!athlete) {
      return NextResponse.json({ deals: [] })
    }

    const deals = await prisma.deal.findMany({
      where: { athleteId: athlete.id },
      orderBy: { createdAt: 'desc' },
      include: {
        brand: true,
        deliverables: true,
        payments: true,
      },
    })

    return NextResponse.json({ deals })
  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get or create athlete
    let athlete = await prisma.athlete.findFirst({
      where: { supabaseUserId: user.id },
    })

    if (!athlete) {
      // Create athlete from user metadata
      const metadata = user.user_metadata || {}

      // Get default school and sport
      const school = await prisma.school.findFirst()
      const sport = await prisma.sport.findFirst()

      if (!school || !sport) {
        return NextResponse.json({ error: 'Database not seeded' }, { status: 500 })
      }

      athlete = await prisma.athlete.create({
        data: {
          email: user.email!,
          firstName: metadata.firstName || 'Unknown',
          lastName: metadata.lastName || 'Athlete',
          schoolId: school.id,
          sportId: sport.id,
          classYear: 'JR',
          supabaseUserId: user.id,
        },
      })
    }

    const body = await request.json()

    // Calculate total compensation value
    const cashValue = body.compensationCash || 0
    const totalValue = cashValue // Could add estimated product value

    const deal = await prisma.deal.create({
      data: {
        athleteId: athlete.id,
        title: body.title,
        brandNameOverride: body.brandNameOverride,
        dealType: body.dealType,
        description: body.description || null,
        compensationCash: cashValue,
        compensationProducts: body.compensationProducts || null,
        compensationTotalValue: totalValue,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        isExclusive: body.isExclusive || false,
        exclusivityCategory: body.exclusivityCategory || null,
        status: 'DRAFT',
        complianceStatus: 'NOT_SUBMITTED',
        requiresNcaaDisclosure: totalValue >= 600,
      },
    })

    return NextResponse.json(deal)
  } catch (error) {
    console.error('Error creating deal:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
