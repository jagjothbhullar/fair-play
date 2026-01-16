'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ScanRedirectPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAuthAndRedirect() {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Authenticated users go to dashboard scan
        router.replace('/dashboard/scan')
      } else {
        // Non-authenticated users go to signup
        router.replace('/signup')
      }
    }

    checkAuthAndRedirect()
  }, [router, supabase.auth])

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full" />
    </div>
  )
}
