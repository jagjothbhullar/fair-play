'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AuthModal from '@/components/AuthModal'
import type { User } from '@supabase/supabase-js'

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [showSignInModal, setShowSignInModal] = useState(false)
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
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="text-xl font-semibold tracking-tight">Fair Play</span>
          {!user && (
            <button
              onClick={() => setShowSignInModal(true)}
              className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: Hero + Features */}
          <div>
            <div className="w-16 h-16 mb-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Protect Your NIL Deals
            </h1>
            <p className="text-xl text-white/50 mb-10">
              AI-powered analysis built for student athletes. Know your worth. Spot red flags. Get fair deals.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex-shrink-0 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">AI-Powered Contract Analysis</h3>
                  <p className="text-white/50 text-sm">Flag non-standard terms and conditions before you sign</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex-shrink-0 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">School-Specific Compliance Guide</h3>
                  <p className="text-white/50 text-sm">Stay compliant with your school's NIL policies</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex-shrink-0 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Water Cooler Community</h3>
                  <p className="text-white/50 text-sm">Real-time feedback from verified student athletes</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex-shrink-0 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Projected Market Value</h3>
                  <p className="text-white/50 text-sm">Know your worth with our NIL calculator</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: CTA */}
          <div>
            <Link
              href="/signup"
              className="group block bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:border-emerald-500/30 hover:bg-white/[0.05] transition-all text-center"
            >
              <div className="w-14 h-14 mx-auto mb-5 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-3">Create Free Account</h2>
              <p className="text-white/50 text-sm mb-6">
                Join thousands of athletes protecting their NIL deals.
              </p>
              <span className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black rounded-xl font-semibold group-hover:from-emerald-300 group-hover:to-emerald-400 transition-all">
                Get Started
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
            <div className="mt-4 bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-white/40 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => setShowSignInModal(true)}
                  className="text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/[0.02] rounded-xl p-3">
                <div className="text-lg font-bold text-emerald-400">$1.67B</div>
                <p className="text-white/40 text-xs">NIL Market</p>
              </div>
              <div className="bg-white/[0.02] rounded-xl p-3">
                <div className="text-lg font-bold text-emerald-400">100K+</div>
                <p className="text-white/40 text-xs">Athletes</p>
              </div>
              <div className="bg-white/[0.02] rounded-xl p-3">
                <div className="text-lg font-bold text-emerald-400">Free</div>
                <p className="text-white/40 text-xs">To Join</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust */}
        <p className="mt-16 text-center text-white/30 text-sm">
          Built for California D1 athletes. Trusted by student athletes nationwide.
        </p>
      </main>

      {/* Sign In Modal */}
      <AuthModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSuccess={() => {
          setShowSignInModal(false)
          router.push('/dashboard')
        }}
        defaultMode="signin"
      />
    </div>
  )
}
