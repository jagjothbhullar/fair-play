'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to landing page - sign in is now a modal
    router.replace('/')
  }, [router])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full" />
    </div>
  )
}
