'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import NILCalculator, { type CalculatorInputs } from '@/components/NILCalculator'
import SimilarAthletes from '@/components/SimilarAthletes'
import type { User } from '@supabase/supabase-js'

export default function NILMarketPage() {
  const [user, setUser] = useState<User | null>(null)
  const [authChecking, setAuthChecking] = useState(true)
  const [calculatorInputs, setCalculatorInputs] = useState<CalculatorInputs | null>(null)
  const [hasCalculated, setHasCalculated] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/?feature=market')
        return
      }
      setUser(user)
      setAuthChecking(false)
    }
    checkAuth()
  }, [supabase.auth, router])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  function handleCalculate(inputs: CalculatorInputs) {
    setCalculatorInputs(inputs)
    setHasCalculated(true)
  }

  // Show loading while checking auth
  if (authChecking) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      <div className="fixed top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">FP</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">Fair Play</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm text-white/70 hover:text-white transition-colors">
              Scanner
            </Link>
            <span className="text-sm text-emerald-400 font-medium">NIL Market</span>
            <Link href="/water-cooler" className="text-sm text-white/70 hover:text-white transition-colors">
              Water Cooler
            </Link>
            <Link href="/scans" className="text-sm text-white/70 hover:text-white transition-colors">
              My Scans
            </Link>
            <div className="flex items-center gap-2 pl-4 border-l border-white/10">
              <span className="text-sm text-white/50">
                {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm text-emerald-400 mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Powered by real NIL data
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Know Your Worth
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            Calculate your NIL value and see how you compare to similar athletes.
            Get the data you need to negotiate fair deals.
          </p>
        </div>

        {/* NIL Value Calculator */}
        <NILCalculator onCalculate={handleCalculate} />

        {/* Similar Athletes - Shows after calculation */}
        <SimilarAthletes
          inputs={calculatorInputs}
          visible={hasCalculated}
        />

        {/* Info Cards - Always visible */}
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-2">Real Data</h3>
            <p className="text-white/50 text-sm">
              Based on CalMatters NIL Database, Opendorse Reports, and verified deal data.
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-2">Smart Matching</h3>
            <p className="text-white/50 text-sm">
              See athletes with similar profiles - same sport, school tier, and following.
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-2">Negotiate Better</h3>
            <p className="text-white/50 text-sm">
              Walk into negotiations with data-backed confidence about your value.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-3">Have a contract to review?</h3>
            <p className="text-white/50 mb-6">
              Use our AI-powered scanner to spot red flags before you sign.
            </p>
            <Link
              href="/"
              className="inline-flex px-8 py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black rounded-full font-semibold hover:from-emerald-300 hover:to-emerald-400 transition-all"
            >
              Scan a Contract
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
