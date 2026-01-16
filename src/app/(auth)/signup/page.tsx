'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AuthModal from '@/components/AuthModal'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Create auth user with Supabase (email confirmation disabled in dashboard)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // emailRedirectTo not needed since we disabled email confirmation
          data: {
            signup_source: 'web',
          },
        },
      })

      if (authError) throw authError

      // Check if user was created (not just returned existing)
      if (authData.user) {
        // User is now signed in automatically (since email confirmation is disabled)
        // Redirect to dashboard - the profile popup will handle profile setup
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      <div className="fixed top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">FP</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">Fair Play</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-3">Create Your Account</h1>
          <p className="text-white/50">
            Join thousands of athletes protecting their NIL deals.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm text-white/50 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@school.edu"
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50"
            />
          </div>

          {/* Password */}
          <div className="mb-8">
            <label className="block text-sm text-white/50 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="At least 8 characters"
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black rounded-xl font-semibold text-lg hover:from-emerald-300 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>

          <p className="mt-6 text-center text-white/40 text-sm">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setShowSignInModal(true)}
              className="text-emerald-400 hover:text-emerald-300"
            >
              Sign in
            </button>
          </p>
        </form>

        <AuthModal
          isOpen={showSignInModal}
          onClose={() => setShowSignInModal(false)}
          onSuccess={() => {
            setShowSignInModal(false)
            router.push('/dashboard')
          }}
          defaultMode="signin"
        />

        <p className="mt-6 text-center text-white/30 text-xs">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-white/50">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline hover:text-white/50">Privacy Policy</Link>
        </p>
      </main>
    </div>
  )
}
