'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [supabase.auth])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      <div className="fixed top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">FP</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">Fair Play</span>
          </div>
          {!user && (
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-lg mx-auto px-6 py-20">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Protect Your NIL Deals
          </h1>
          <p className="text-xl text-white/50 max-w-md mx-auto">
            AI-powered contract analysis built for student athletes. Know your worth. Spot red flags. Get fair deals.
          </p>
        </div>

        {/* CTA */}
        <div className="max-w-sm mx-auto">
          <Link
            href="/signup"
            className="group block bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 hover:bg-white/[0.05] transition-all text-center"
          >
            <div className="w-12 h-12 mx-auto mb-4 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Create Free Account</h2>
            <p className="text-white/50 text-sm mb-4">
              Join thousands of athletes. Access contract scanner, NIL calculator, and more.
            </p>
            <span className="inline-flex items-center justify-center gap-2 text-emerald-400 text-sm font-medium group-hover:gap-3 transition-all">
              Get Started
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
          <p className="text-center text-white/40 text-sm mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300">
              Sign in
            </Link>
          </p>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-emerald-400 mb-1">$1.67B</div>
            <p className="text-white/40 text-xs">NIL Market 2024-25</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400 mb-1">100K+</div>
            <p className="text-white/40 text-xs">Athletes with NIL Deals</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400 mb-1">AI</div>
            <p className="text-white/40 text-xs">Powered Analysis</p>
          </div>
        </div>

        {/* Trust */}
        <p className="mt-12 text-center text-white/30 text-sm">
          Built for California D1 athletes. Trusted by student athletes nationwide.
        </p>
      </main>
    </div>
  )
}
