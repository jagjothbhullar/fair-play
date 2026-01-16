'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { californiaSchools } from '@/lib/data/california-schools'
import type { User } from '@supabase/supabase-js'

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

export default function ProfileSetupPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [schoolShortName, setSchoolShortName] = useState('')
  const [sport, setSport] = useState('')
  const [position, setPosition] = useState('')
  const [jerseyNumber, setJerseyNumber] = useState('')
  const [classYear, setClassYear] = useState('')
  const [instagramHandle, setInstagramHandle] = useState('')
  const [twitterHandle, setTwitterHandle] = useState('')
  const [tiktokHandle, setTiktokHandle] = useState('')

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      // Check if profile already exists
      const response = await fetch(`/api/profile?userId=${user.id}`)
      const data = await response.json()

      if (data.hasProfile) {
        // Profile exists, redirect to dashboard
        router.push('/dashboard')
        return
      }

      setLoading(false)
    }
    checkAuth()
  }, [supabase.auth, router])

  // Get available sports for selected school
  const selectedSchool = californiaSchools.find(s => s.shortName === schoolShortName)
  const schoolSports = selectedSchool?.topSports || sports

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!firstName || !lastName || !schoolShortName || !sport || !classYear) {
      setError('Please fill in all required fields')
      return
    }

    setSaving(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          firstName,
          lastName,
          email: user?.email,
          schoolShortName,
          sport,
          position: position || null,
          jerseyNumber: jerseyNumber || null,
          classYear,
          instagramHandle: instagramHandle || null,
          twitterHandle: twitterHandle || null,
          tiktokHandle: tiktokHandle || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save profile')
      }

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
      setSaving(false)
    }
  }

  if (loading) {
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
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">FP</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">Fair Play</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-3">Complete Your Profile</h1>
          <p className="text-white/50">
            Help us personalize your experience and connect you with relevant opportunities.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/50 mb-2">First Name *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm text-white/50 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-black/50 border border-white/5 rounded-xl text-white/50 cursor-not-allowed"
              />
            </div>
          </div>

          {/* School & Sport */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">School & Sport</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/50 mb-2">School *</label>
                <select
                  value={schoolShortName}
                  onChange={(e) => setSchoolShortName(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400/50"
                  required
                >
                  <option value="">Select your school</option>
                  <optgroup label="Power Four">
                    {californiaSchools
                      .filter(s => s.conferenceType === 'POWER_FOUR')
                      .map(school => (
                        <option key={school.shortName} value={school.shortName}>
                          {school.name} ({school.conference})
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Group of Five">
                    {californiaSchools
                      .filter(s => s.conferenceType === 'GROUP_OF_FIVE')
                      .map(school => (
                        <option key={school.shortName} value={school.shortName}>
                          {school.name} ({school.conference})
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Mid-Major">
                    {californiaSchools
                      .filter(s => s.conferenceType === 'MID_MAJOR')
                      .map(school => (
                        <option key={school.shortName} value={school.shortName}>
                          {school.name} ({school.conference})
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="FCS">
                    {californiaSchools
                      .filter(s => s.conferenceType === 'FCS')
                      .map(school => (
                        <option key={school.shortName} value={school.shortName}>
                          {school.name} ({school.conference})
                        </option>
                      ))}
                  </optgroup>
                </select>
                {selectedSchool && (
                  <p className="mt-2 text-sm text-white/40">
                    {selectedSchool.nilTier} NIL Activity | {selectedSchool.nilCollectives.join(', ')}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/50 mb-2">Sport *</label>
                  <select
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400/50"
                    required
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
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400/50"
                    required
                  >
                    <option value="">Select year</option>
                    {classYears.map(year => (
                      <option key={year.value} value={year.value}>{year.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/50 mb-2">Position</label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. Point Guard, QB"
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-2">Jersey Number</label>
                  <input
                    type="text"
                    value={jerseyNumber}
                    onChange={(e) => setJerseyNumber(e.target.value)}
                    placeholder="e.g. 23"
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-2">Social Media</h2>
            <p className="text-white/40 text-sm mb-4">
              Optional - helps us estimate your NIL value and find relevant opportunities
            </p>
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-white/50 mb-2">Instagram</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">@</span>
                    <input
                      type="text"
                      value={instagramHandle}
                      onChange={(e) => setInstagramHandle(e.target.value.replace('@', ''))}
                      placeholder="username"
                      className="w-full pl-8 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-2">Twitter/X</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">@</span>
                    <input
                      type="text"
                      value={twitterHandle}
                      onChange={(e) => setTwitterHandle(e.target.value.replace('@', ''))}
                      placeholder="username"
                      className="w-full pl-8 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-2">TikTok</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">@</span>
                    <input
                      type="text"
                      value={tiktokHandle}
                      onChange={(e) => setTiktokHandle(e.target.value.replace('@', ''))}
                      placeholder="username"
                      className="w-full pl-8 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black rounded-xl font-semibold text-lg hover:from-emerald-300 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : (
              'Complete Profile'
            )}
          </button>

          <p className="text-center text-white/30 text-sm">
            You can update your profile anytime from your dashboard.
          </p>
        </form>
      </main>
    </div>
  )
}
