import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Fetch user's profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const profile = await prisma.athleteProfile.findUnique({
      where: { supabaseUserId: userId },
    })

    if (!profile) {
      return NextResponse.json({ profile: null, hasProfile: false })
    }

    return NextResponse.json({ profile, hasProfile: true })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// POST - Create or update profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      firstName,
      lastName,
      email,
      schoolShortName,
      sport,
      position,
      jerseyNumber,
      classYear,
      instagramHandle,
      twitterHandle,
      tiktokHandle,
      followerCount,
    } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (!firstName || !lastName || !schoolShortName || !sport || !classYear) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, school, sport, classYear' },
        { status: 400 }
      )
    }

    // Upsert profile (create or update)
    const profile = await prisma.athleteProfile.upsert({
      where: { supabaseUserId: userId },
      update: {
        firstName,
        lastName,
        email,
        schoolShortName,
        sport,
        position: position || null,
        jerseyNumber: jerseyNumber || null,
        classYear,
        instagramHandle: instagramHandle || null,
        twitterHandle: twitterHandle || null,
        tiktokHandle: tiktokHandle || null,
        followerCount: followerCount ? parseInt(followerCount) : null,
        isProfileComplete: true,
        updatedAt: new Date(),
      },
      create: {
        supabaseUserId: userId,
        firstName,
        lastName,
        email,
        schoolShortName,
        sport,
        position: position || null,
        jerseyNumber: jerseyNumber || null,
        classYear,
        instagramHandle: instagramHandle || null,
        twitterHandle: twitterHandle || null,
        tiktokHandle: tiktokHandle || null,
        followerCount: followerCount ? parseInt(followerCount) : null,
        isProfileComplete: true,
      },
    })

    return NextResponse.json({ profile, success: true })
  } catch (error) {
    console.error('Error saving profile:', error)
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    )
  }
}
