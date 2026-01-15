import { NextRequest, NextResponse } from 'next/server'
import {
  getCachedAthletes,
  filterAthletes,
  sortAthletes,
  getAthleteStatistics,
  getQuickStats,
  type SyntheticAthlete,
  type PerformanceTier,
} from '@/lib/data/synthetic-athletes'
import { californiaSchools } from '@/lib/data/california-schools'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  // Check if requesting stats only
  if (searchParams.get('stats') === 'quick') {
    return NextResponse.json(getQuickStats())
  }

  // Get all athletes
  const allAthletes = getCachedAthletes()

  // If requesting full stats
  if (searchParams.get('stats') === 'full') {
    return NextResponse.json(getAthleteStatistics(allAthletes))
  }

  // Parse filters
  const filters: Parameters<typeof filterAthletes>[1] = {}

  const school = searchParams.get('school')
  if (school) filters.school = school

  const sport = searchParams.get('sport')
  if (sport) filters.sport = sport

  const performanceTier = searchParams.get('performanceTier')
  if (performanceTier) filters.performanceTier = performanceTier as PerformanceTier

  const minFollowers = searchParams.get('minFollowers')
  if (minFollowers) filters.minFollowers = parseInt(minFollowers)

  const maxFollowers = searchParams.get('maxFollowers')
  if (maxFollowers) filters.maxFollowers = parseInt(maxFollowers)

  const isTransfer = searchParams.get('isTransfer')
  if (isTransfer !== null) filters.isTransfer = isTransfer === 'true'

  const hasAgent = searchParams.get('hasAgent')
  if (hasAgent !== null) filters.hasAgent = hasAgent === 'true'

  const minNILValue = searchParams.get('minNILValue')
  if (minNILValue) filters.minNILValue = parseInt(minNILValue)

  const maxNILValue = searchParams.get('maxNILValue')
  if (maxNILValue) filters.maxNILValue = parseInt(maxNILValue)

  const classYear = searchParams.get('classYear')
  if (classYear) filters.classYear = classYear

  const conference = searchParams.get('conference')
  if (conference) filters.conference = conference

  // Apply filters
  let athletes = filterAthletes(allAthletes, filters)

  // Parse sorting
  const sortBy = (searchParams.get('sortBy') || 'nilValue') as 'nilValue' | 'followers' | 'marketability' | 'name' | 'school'
  const sortDirection = (searchParams.get('sortDirection') || 'desc') as 'asc' | 'desc'

  athletes = sortAthletes(athletes, sortBy, sortDirection)

  // Pagination
  const page = parseInt(searchParams.get('page') || '1')
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
  const offset = (page - 1) * limit

  const paginatedAthletes = athletes.slice(offset, offset + limit)

  // Get unique values for filter dropdowns
  const uniqueSchools = [...new Set(allAthletes.map(a => a.schoolShortName))].sort()
  const uniqueSports = [...new Set(allAthletes.map(a => a.sport))].sort()
  const uniqueConferences = [...new Set(allAthletes.map(a => a.conference))].sort()

  return NextResponse.json({
    athletes: paginatedAthletes,
    pagination: {
      page,
      limit,
      total: athletes.length,
      totalPages: Math.ceil(athletes.length / limit),
      hasMore: offset + limit < athletes.length,
    },
    filters: {
      schools: uniqueSchools,
      sports: uniqueSports,
      conferences: uniqueConferences,
      performanceTiers: ['elite', 'all_conference', 'starter', 'rotation', 'developing', 'walkon'],
      classYears: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Grad'],
    },
    summary: {
      totalMatching: athletes.length,
      avgNILValue: Math.round(athletes.reduce((sum, a) => sum + a.estimatedNILValue.median, 0) / athletes.length) || 0,
      totalAnnualValue: athletes.reduce((sum, a) => sum + a.estimatedNILValue.annual, 0),
      transferCount: athletes.filter(a => a.isTransfer).length,
      agentCount: athletes.filter(a => a.hasAgent).length,
    },
  })
}

// Get single athlete by ID
export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Athlete ID required' }, { status: 400 })
    }

    const allAthletes = getCachedAthletes()
    const athlete = allAthletes.find(a => a.id === id)

    if (!athlete) {
      return NextResponse.json({ error: 'Athlete not found' }, { status: 404 })
    }

    // Get school details
    const school = californiaSchools.find(s => s.shortName === athlete.schoolShortName)

    // Get similar athletes (same school + sport, different performance tiers)
    const similarAthletes = allAthletes
      .filter(a => a.schoolShortName === athlete.schoolShortName && a.sport === athlete.sport && a.id !== athlete.id)
      .slice(0, 5)

    // Get top athletes in same sport
    const topInSport = sortAthletes(
      allAthletes.filter(a => a.sport === athlete.sport),
      'nilValue',
      'desc'
    ).slice(0, 10)

    return NextResponse.json({
      athlete,
      school,
      similarAthletes,
      topInSport,
      ranking: {
        inSchool: allAthletes
          .filter(a => a.schoolShortName === athlete.schoolShortName)
          .sort((a, b) => b.estimatedNILValue.median - a.estimatedNILValue.median)
          .findIndex(a => a.id === athlete.id) + 1,
        inSport: topInSport.findIndex(a => a.id === athlete.id) + 1 || 'N/A',
        overall: sortAthletes(allAthletes, 'nilValue', 'desc')
          .findIndex(a => a.id === athlete.id) + 1,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
