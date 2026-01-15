'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import AuthModal from '@/components/AuthModal'
import AssistantChat from '@/components/AssistantChat'
import type { User } from '@supabase/supabase-js'

interface RedFlag {
  name: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  excerpt: string
  explanation: string
  recommendation: string
}

interface SuggestedRedline {
  original: string
  revised: string
  explanation: string
  priority: 'must_change' | 'should_change' | 'consider'
}

interface ScanResult {
  summary: string
  redFlags: RedFlag[]
  keyTerms: {
    compensation: string | null
    duration: string | null
    exclusivity: string | null
    terminationRights: string | null
    usageRights: string | null
  }
  overallRisk: 'low' | 'medium' | 'high' | 'critical'
  suggestedRedlines: SuggestedRedline[]
}

type PageState = 'scanner' | 'scanning' | 'results' | 'limit_reached'

export default function Home() {
  const [pageState, setPageState] = useState<PageState>('scanner')
  const [email, setEmail] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const [hasScanned, setHasScanned] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signup')

  const supabase = createClient()

  useEffect(() => {
    // Check auth state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        setEmail(user.email || '')
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        setEmail(session.user.email || '')
      }
    })

    // Check localStorage for free scan (only matters if not logged in)
    const scanned = localStorage.getItem('fairplay_scanned')
    if (scanned === 'true') {
      setHasScanned(true)
    }

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  async function handleScan() {
    // For non-authenticated users, check scan limit
    if (!user && hasScanned) {
      setPageState('limit_reached')
      return
    }

    // Non-authenticated users need email
    if (!user && (!email || !email.includes('@'))) {
      setError('Please enter your email to receive your results')
      return
    }

    setError(null)
    setPageState('scanning')

    try {
      // Only register free scan for non-authenticated users
      if (!user) {
        const registerResponse = await fetch('/api/free-scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, action: 'use' }),
        })
        const registerData = await registerResponse.json()

        if (registerData.error && registerResponse.status === 403) {
          setPageState('limit_reached')
          return
        }
      }

      const formData = new FormData()
      if (inputMode === 'file' && file) {
        formData.append('file', file)
      } else if (inputMode === 'text' && text) {
        formData.append('text', text)
      } else {
        throw new Error('Please provide a contract to scan')
      }

      // Include email for results delivery
      if (email) {
        formData.append('email', email)
      }

      // For authenticated users, include auth flag and user ID
      if (user) {
        formData.append('authenticated', 'true')
        formData.append('userId', user.id)
      }

      const response = await fetch('/api/scan', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to scan contract')
      }

      const data = await response.json()
      setResult(data)

      // Only set localStorage for non-authenticated users
      if (!user) {
        localStorage.setItem('fairplay_scanned', 'true')
        setHasScanned(true)
      }

      setPageState('results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setPageState('scanner')
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Subtle grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      {/* Gradient orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[128px] pointer-events-none" />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          // Refresh user state handled by onAuthStateChange listener
        }}
        defaultMode={authModalMode}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">FP</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">Fair Play</span>
          </Link>
          <nav className="flex items-center gap-6">
            {user ? (
              <>
                <Link href="/market" className="text-sm text-white/70 hover:text-white transition-colors">
                  NIL Market
                </Link>
                <Link href="/water-cooler" className="text-sm text-white/70 hover:text-white transition-colors">
                  Water Cooler
                </Link>
                <Link href="/scans" className="text-sm text-white/70 hover:text-white transition-colors">
                  My Scans
                </Link>
                <div className="flex items-center gap-2 pl-4 border-l border-white/10">
                  <span className="text-sm text-white/50">
                    {user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setAuthModalMode('signin')
                    setAuthModalOpen(true)
                  }}
                  className="px-5 py-2.5 text-sm text-white/70 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('signup')
                    setAuthModalOpen(true)
                  }}
                  className="px-5 py-2.5 text-sm bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
                >
                  Create Account
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {/* Scanner State */}
        {pageState === 'scanner' && (
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Hero Content */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white/60 mb-8">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Trusted by 500+ athletes & creators
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
                  Protect your
                  <span className="block bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                    future.
                  </span>
                </h1>

                <p className="text-xl text-white/50 leading-relaxed mb-10 max-w-lg">
                  AI-powered contract analysis for athletes, creators, and artists.
                  Spot red flags before you sign.
                </p>

                <div className="flex flex-wrap gap-8 text-sm text-white/40">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Bank-level security
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Results in 30 seconds
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {user ? 'Unlimited scans' : 'First scan free'}
                  </div>
                </div>
              </div>

              {/* Right: Scanner Card */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/20 to-transparent rounded-3xl blur-2xl" />
                <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                  {/* Email Input - only show for non-authenticated users */}
                  {!user && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-white/40 mb-3 uppercase tracking-wider">
                        Your Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@email.com"
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 focus:bg-white/[0.07] transition-all"
                      />
                    </div>
                  )}

                  {/* Input Mode Toggle */}
                  <div className="flex gap-2 p-1 bg-white/5 rounded-xl mb-6">
                    <button
                      onClick={() => setInputMode('file')}
                      className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        inputMode === 'file'
                          ? 'bg-white text-black'
                          : 'text-white/50 hover:text-white'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      onClick={() => setInputMode('text')}
                      className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        inputMode === 'text'
                          ? 'bg-white text-black'
                          : 'text-white/50 hover:text-white'
                      }`}
                    >
                      Paste Text
                    </button>
                  </div>

                  {/* File Upload or Text Input */}
                  {inputMode === 'file' ? (
                    <label className="block cursor-pointer group">
                      <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center hover:border-emerald-400/30 hover:bg-white/[0.02] transition-all">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 flex items-center justify-center">
                          <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-white/70 mb-1">
                          {file ? file.name : 'Drop your contract here'}
                        </p>
                        <p className="text-sm text-white/30">PDF or TXT up to 10MB</p>
                        <input
                          type="file"
                          accept=".pdf,.txt"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                      </div>
                    </label>
                  ) : (
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={6}
                      placeholder="Paste your contract text here..."
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 resize-none"
                    />
                  )}

                  {/* Error */}
                  {error && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Scan Button */}
                  <button
                    onClick={handleScan}
                    disabled={(!user && !email) || (inputMode === 'file' ? !file : !text.trim())}
                    className="mt-6 w-full py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black rounded-xl font-semibold text-lg hover:from-emerald-300 hover:to-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all disabled:hover:from-emerald-400 disabled:hover:to-emerald-500"
                  >
                    Analyze Contract
                  </button>

                  <p className="mt-4 text-center text-white/30 text-sm">
                    {user ? 'Unlimited scans with your account.' : 'Free analysis. No credit card required.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom: Legal Note */}
            <div className="mt-16 pt-8 border-t border-white/5">
              <p className="text-sm text-white/30 text-center">
                Fair Play provides educational analysis only and is not a substitute for professional legal advice.
              </p>
            </div>
          </div>
        )}

        {/* Scanning State */}
        {pageState === 'scanning' && <LoadingState />}

        {/* Limit Reached State */}
        {pageState === 'limit_reached' && (
          <div className="max-w-lg mx-auto px-6 py-24 text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold mb-4">
              You&apos;ve used your free scan
            </h2>
            <p className="text-white/50 mb-10 text-lg">
              Create an account to unlock unlimited scans and premium features.
            </p>

            <div className="space-y-3">
              <Link
                href="/signup"
                className="block w-full py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black rounded-xl font-semibold hover:from-emerald-300 hover:to-emerald-400 transition-all"
              >
                Create Free Account
              </Link>
              <Link
                href="/login"
                className="block w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 transition-all"
              >
                Already have an account? Sign in
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-white/30 text-sm mb-6">Premium features include:</p>
              <div className="grid grid-cols-2 gap-4 text-left">
                {[
                  'Unlimited scans',
                  'Brand recommendations',
                  'Outreach templates',
                  'Compliance alerts',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-white/60 text-sm">
                    <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results State */}
        {pageState === 'results' && result && (
          <div className="max-w-4xl mx-auto px-6 py-16">
            {/* Success Banner */}
            <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-green-400">
                  {user ? 'Analysis complete!' : <>Results sent to <span className="font-medium">{email}</span></>}
                </span>
              </div>
              {!user && (
                <button
                  onClick={() => {
                    setAuthModalMode('signup')
                    setAuthModalOpen(true)
                  }}
                  className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-colors"
                >
                  Get Unlimited Scans
                </button>
              )}
            </div>

            {/* Risk Level */}
            <div className={`rounded-2xl p-8 mb-6 ${getRiskStyles(result.overallRisk).bg}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-wider text-white/50 mb-2">Overall Risk Assessment</p>
                  <h2 className="text-2xl font-bold">{getRiskStyles(result.overallRisk).label}</h2>
                </div>
                <div className={`text-5xl font-bold ${getRiskStyles(result.overallRisk).text}`}>
                  {result.overallRisk.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/50 mb-4">Summary</h3>
              <p className="text-lg text-white/80 leading-relaxed">{result.summary}</p>
            </div>

            {/* Red Flags */}
            {result.redFlags.length > 0 && (
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 mb-6">
                <h3 className="text-sm uppercase tracking-wider text-white/50 mb-6">
                  Red Flags ({result.redFlags.length})
                </h3>
                <div className="space-y-4">
                  {result.redFlags.map((flag, index) => (
                    <RedFlagCard key={index} flag={flag} />
                  ))}
                </div>
              </div>
            )}

            {/* Key Terms */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/50 mb-6">Key Terms</h3>
              <div className="grid gap-4">
                {Object.entries({
                  'Compensation': result.keyTerms.compensation,
                  'Duration': result.keyTerms.duration,
                  'Exclusivity': result.keyTerms.exclusivity,
                  'Termination': result.keyTerms.terminationRights,
                  'Usage Rights': result.keyTerms.usageRights,
                }).map(([label, value]) => (
                  <div key={label} className="flex items-start gap-4 py-3 border-b border-white/5 last:border-0">
                    <span className="w-32 text-white/40 text-sm">{label}</span>
                    <span className="flex-1 text-white/80">{value || 'Not specified'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Redlines */}
            {result.suggestedRedlines && result.suggestedRedlines.length > 0 && (
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-white/50 mb-1">
                      Suggested Revisions
                    </h3>
                    <p className="text-white/30 text-sm">{result.suggestedRedlines.length} changes recommended</p>
                  </div>
                  <button
                    onClick={() => {
                      copyAllRedlines(result.suggestedRedlines)
                      setCopiedAll(true)
                      setTimeout(() => setCopiedAll(false), 2000)
                    }}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                      copiedAll
                        ? 'bg-green-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {copiedAll ? 'Copied!' : 'Copy All'}
                  </button>
                </div>
                <div className="space-y-4">
                  {result.suggestedRedlines.map((redline, index) => (
                    <RedlineCard key={index} redline={redline} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* CTA - only show for non-authenticated users */}
            {!user && (
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold mb-3">Need more scans?</h3>
                <p className="text-white/50 mb-8">
                  Create a free account for unlimited access.
                </p>
                <button
                  onClick={() => {
                    setAuthModalMode('signup')
                    setAuthModalOpen(true)
                  }}
                  className="inline-flex px-8 py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black rounded-full font-semibold hover:from-emerald-300 hover:to-emerald-400 transition-all"
                >
                  Create Free Account
                </button>
              </div>
            )}

            {/* Scan Again button for authenticated users */}
            {user && (
              <div className="text-center py-12">
                <button
                  onClick={() => {
                    setPageState('scanner')
                    setResult(null)
                    setFile(null)
                    setText('')
                  }}
                  className="inline-flex px-8 py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black rounded-full font-semibold hover:from-emerald-300 hover:to-emerald-400 transition-all"
                >
                  Scan Another Contract
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">&copy; 2025 Fair Play. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-white/30">
            <Link href="/privacy" className="hover:text-white/50 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white/50 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>

      {/* Quick Question Assistant */}
      <AssistantChat
        scanContext={result ? {
          summary: result.summary,
          overallRisk: result.overallRisk,
          redFlagsCount: result.redFlags.length,
        } : null}
      />
    </div>
  )
}

// Components
function RedFlagCard({ flag }: { flag: RedFlag }) {
  const severityConfig: Record<string, { border: string; badge: string; badgeText: string }> = {
    critical: { border: 'border-l-red-500', badge: 'bg-red-500', badgeText: 'text-white' },
    high: { border: 'border-l-orange-500', badge: 'bg-orange-500', badgeText: 'text-white' },
    medium: { border: 'border-l-yellow-500', badge: 'bg-yellow-500', badgeText: 'text-black' },
    low: { border: 'border-l-blue-500', badge: 'bg-blue-500', badgeText: 'text-white' },
  }

  const config = severityConfig[flag.severity] || severityConfig.medium

  return (
    <div className={`border-l-4 ${config.border} bg-white/[0.02] rounded-r-xl p-5`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <h4 className="font-medium">{flag.name}</h4>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.badge} ${config.badgeText}`}>
          {flag.severity.toUpperCase()}
        </span>
      </div>
      {flag.excerpt && (
        <div className="mb-3 p-3 bg-black/30 rounded-lg text-sm text-white/50 font-mono">
          &ldquo;{flag.excerpt}&rdquo;
        </div>
      )}
      <p className="text-sm text-white/60 mb-3">{flag.explanation}</p>
      <p className="text-sm">
        <span className="text-emerald-400">Recommendation:</span>{' '}
        <span className="text-white/60">{flag.recommendation}</span>
      </p>
    </div>
  )
}

function RedlineCard({ redline, index }: { redline: SuggestedRedline; index: number }) {
  const [copied, setCopied] = useState(false)

  const priorityConfig: Record<string, { label: string; color: string }> = {
    must_change: { label: 'MUST CHANGE', color: 'text-red-400 bg-red-500/20' },
    should_change: { label: 'SHOULD CHANGE', color: 'text-orange-400 bg-orange-500/20' },
    consider: { label: 'CONSIDER', color: 'text-blue-400 bg-blue-500/20' },
  }

  const config = priorityConfig[redline.priority] || priorityConfig.consider

  const copyRedline = async () => {
    const text = `ORIGINAL:\n${redline.original}\n\nREVISED:\n${redline.revised}\n\nREASON: ${redline.explanation}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-white/[0.02] border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-white/30 text-sm">#{index + 1}</span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${config.color}`}>
            {config.label}
          </span>
        </div>
        <button
          onClick={copyRedline}
          className="text-sm text-white/40 hover:text-white transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-5">
        <div className="p-4 bg-black/30 rounded-lg border-l-2 border-white/10">
          <span className="line-through text-red-400/80">{redline.original}</span>
          <span className="mx-2 text-white/20">&rarr;</span>
          <span className="text-green-400/80">{redline.revised}</span>
        </div>
        <p className="mt-4 text-sm text-white/50">{redline.explanation}</p>
      </div>
    </div>
  )
}

function copyAllRedlines(redlines: SuggestedRedline[]) {
  const text = redlines.map((r, i) => {
    const labels: Record<string, string> = {
      must_change: 'MUST CHANGE',
      should_change: 'SHOULD CHANGE',
      consider: 'CONSIDER',
    }
    return `--- CHANGE ${i + 1} [${labels[r.priority] || 'CONSIDER'}] ---\n\nORIGINAL:\n${r.original}\n\nREVISED:\n${r.revised}\n\nREASON: ${r.explanation}`
  }).join('\n\n')
  navigator.clipboard.writeText(text)
}

function getRiskStyles(risk: string) {
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    low: {
      bg: 'bg-green-500/10 border border-green-500/20',
      text: 'text-green-400',
      label: 'This contract looks reasonable'
    },
    medium: {
      bg: 'bg-yellow-500/10 border border-yellow-500/20',
      text: 'text-yellow-400',
      label: 'Some concerns detected'
    },
    high: {
      bg: 'bg-orange-500/10 border border-orange-500/20',
      text: 'text-orange-400',
      label: 'Multiple issues found'
    },
    critical: {
      bg: 'bg-red-500/10 border border-red-500/20',
      text: 'text-red-400',
      label: 'Serious red flags detected'
    },
  }
  return styles[risk] || styles.medium
}

function LoadingState() {
  return (
    <div className="max-w-lg mx-auto px-6 py-24">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-white/10" />
          <div className="absolute inset-0 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-3">Analyzing your contract</h3>
        <p className="text-white/50 mb-8">
          Our AI is reviewing the document for potential issues...
        </p>

        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="text-green-400 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Reading
          </span>
          <span className="w-8 h-px bg-white/20" />
          <span className="text-emerald-400 flex items-center gap-2 animate-pulse">
            <span className="w-2 h-2 bg-emerald-400 rounded-full" />
            Analyzing
          </span>
          <span className="w-8 h-px bg-white/20" />
          <span className="text-white/30">Summarizing</span>
        </div>
      </div>
    </div>
  )
}
