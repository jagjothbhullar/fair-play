import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Check if user has a profile
      try {
        const profile = await prisma.athleteProfile.findUnique({
          where: { supabaseUserId: data.user.id },
        })

        if (!profile) {
          // No profile - redirect to profile setup
          return NextResponse.redirect(`${origin}/profile/setup`)
        }
      } catch (e) {
        // If DB check fails, still let them through to dashboard
        console.error('Profile check error:', e)
      }

      // Has profile - redirect to dashboard or next
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If there's an error or no code, redirect to home with error indicator
  return NextResponse.redirect(`${origin}/?auth_error=true`)
}
