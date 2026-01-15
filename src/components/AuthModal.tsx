'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  defaultMode?: 'signin' | 'signup'
}

export default function AuthModal({ isOpen, onClose, onSuccess, defaultMode = 'signup' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  // Reset state when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setError(null)
      setSuccess(false)
    }
  }, [isOpen])

  useEffect(() => {
    setMode(defaultMode)
  }, [defaultMode])

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error

        // Check if email confirmation is required
        if (data.user && !data.session) {
          // Email confirmation is required
          setSuccess(true)
          setLoading(false)
          return
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) {
          // Provide more helpful error messages
          if (error.message.includes('Email not confirmed')) {
            throw new Error('Please check your email and click the confirmation link before signing in.')
          }
          throw error
        }
      }

      // Success - refresh to update auth state
      onSuccess()
      onClose()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-zinc-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Success State - Email Confirmation Required */}
        {success ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
            <p className="text-white/50 mb-6">
              We sent a confirmation link to <span className="text-white font-medium">{email}</span>
            </p>
            <p className="text-white/40 text-sm mb-6">
              Click the link in your email to activate your account, then come back and sign in.
            </p>
            <button
              onClick={() => {
                setSuccess(false)
                setMode('signin')
              }}
              className="w-full py-4 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-black font-bold text-xl">FP</span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-white/50 mt-2">
                {mode === 'signup'
                  ? 'Get unlimited contract scans'
                  : 'Sign in to continue scanning'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 focus:bg-white/[0.07] transition-all"
                  placeholder="you@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 focus:bg-white/[0.07] transition-all"
                  placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black rounded-xl font-semibold hover:from-emerald-300 hover:to-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                {loading
                  ? (mode === 'signup' ? 'Creating...' : 'Signing in...')
                  : (mode === 'signup' ? 'Create Account' : 'Sign In')}
              </button>
            </form>

            {/* Toggle mode */}
            <p className="mt-6 text-center text-white/40 text-sm">
              {mode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('signin')}
                    className="text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    Create one
                  </button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
