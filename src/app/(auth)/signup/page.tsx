'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { californiaSchools } from '@/lib/data/california-schools'

const sports = [
  'Football',
  "Men's Basketball",
  "Women's Basketball",
  "Women's Gymnastics",
  "Women's Volleyball",
  'Baseball',
  'Softball',
  'Track and Field',
  "Men's Soccer",
  "Women's Soccer",
  'Swimming and Diving',
  "Men's Tennis",
  "Women's Tennis",
  "Men's Golf",
  "Women's Golf",
  'Wrestling',
  "Men's Volleyball",
  "Water Polo",
  'Rowing',
  'Beach Volleyball',
]

const classYears = [
  { value: 'Freshman', label: 'Freshman' },
  { value: 'Sophomore', label: 'Sophomore' },
  { value: 'Junior', label: 'Junior' },
  { value: 'Senior', label: 'Senior' },
  { value: 'Grad', label: 'Graduate Student' },
]

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [schoolShortName, setSchoolShortName] = useState('')
  const [sport, setSport] = useState('')
  const [classYear, setClassYear] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const selectedSchool = californiaSchools.find(s => s.shortName === schoolShortName)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Create auth user with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName,
            lastName,
            schoolShortName,
            sport,
            classYear,
          },
        },
      })

      if (authError) throw authError

      // Create profile in our database
      if (authData.user) {
        const profileResponse = await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: authData.user.id,
            firstName,
            lastName,
            email,
            schoolShortName,
            sport,
            classYear,
          }),
        })

        if (!profileResponse.ok) {
          console.error('Failed to create profile')
        }
      }

      // Redirect to dashboard
      router.push('/dashboard')
      router.refresh()
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

      <main className="relative z-10 max-w-xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3">Create Your Account</h1>
          <p className="text-white/50">
            Join Fair Play to protect your NIL deals and connect with other athletes.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-white/50 mb-2">First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="John"
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50"
              />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-2">Last Name *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Doe"
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50"
              />
            </div>
          </div>

          {/* School */}
          <div className="mb-6">
            <label className="block text-sm text-white/50 mb-2">School *</label>
            <select
              value={schoolShortName}
              onChange={(e) => setSchoolShortName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400/50"
            >
              <option value="">Select your school</option>
              <optgroup label="Power Four">
                {californiaSchools
                  .filter(s => s.conferenceType === 'POWER_FOUR')
                  .map(school => (
                    <option key={school.shortName} value={school.shortName}>
                      {school.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Group of Five">
                {californiaSchools
                  .filter(s => s.conferenceType === 'GROUP_OF_FIVE')
                  .map(school => (
                    <option key={school.shortName} value={school.shortName}>
                      {school.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Mid-Major">
                {californiaSchools
                  .filter(s => s.conferenceType === 'MID_MAJOR')
                  .map(school => (
                    <option key={school.shortName} value={school.shortName}>
                      {school.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="FCS">
                {californiaSchools
                  .filter(s => s.conferenceType === 'FCS')
                  .map(school => (
                    <option key={school.shortName} value={school.shortName}>
                      {school.name}
                    </option>
                  ))}
              </optgroup>
            </select>
            {selectedSchool && (
              <p className="mt-2 text-sm text-emerald-400/70">
                {selectedSchool.conference} | {selectedSchool.nilTier} NIL Activity
              </p>
            )}
          </div>

          {/* Sport & Class Year */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-white/50 mb-2">Sport *</label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400/50"
              >
                <option value="">Select your sport</option>
                {sports.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-2">Class Year *</label>
              <select
                value={classYear}
                onChange={(e) => setClassYear(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400/50"
              >
                <option value="">Select year</option>
                {classYears.map(year => (
                  <option key={year.value} value={year.value}>{year.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm text-white/50 mb-2">Email *</label>
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
            <label className="block text-sm text-white/50 mb-2">Password *</label>
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
            disabled={loading || !firstName || !lastName || !schoolShortName || !sport || !classYear || !email || !password}
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
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300">
              Sign in
            </Link>
          </p>
        </form>

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
