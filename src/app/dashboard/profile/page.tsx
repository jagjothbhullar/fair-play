'use client'

import { useState, useEffect } from 'react'
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

interface AthleteProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  schoolShortName: string
  sport: string
  position: string | null
  jerseyNumber: string | null
  classYear: string
  instagramHandle: string | null
  twitterHandle: string | null
  tiktokHandle: string | null
  followerCount: number | null
  isProfileComplete: boolean
  isVerified: boolean
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<AthleteProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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
  const [followerCount, setFollowerCount] = useState('')

  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUser(user)

      try {
        const response = await fetch(`/api/profile?userId=${user.id}`)
        const data = await response.json()

        if (data.profile) {
          const p = data.profile
          setProfile(p)
          setFirstName(p.firstName || '')
          setLastName(p.lastName || '')
          setSchoolShortName(p.schoolShortName || '')
          setSport(p.sport || '')
          setPosition(p.position || '')
          setJerseyNumber(p.jerseyNumber || '')
          setClassYear(p.classYear || '')
          setInstagramHandle(p.instagramHandle || '')
          setTwitterHandle(p.twitterHandle || '')
          setTiktokHandle(p.tiktokHandle || '')
          setFollowerCount(p.followerCount?.toString() || '')
        }
      } catch (e) {
        console.error('Error loading profile:', e)
      }

      setLoading(false)
    }
    loadProfile()
  }, [supabase.auth])

  const selectedSchool = californiaSchools.find(s => s.shortName === schoolShortName)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

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
          followerCount: followerCount || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save profile')
      }

      setProfile(data.profile)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">My Profile</h1>
        <p className="text-white/50">
          Update your athlete profile and social media information.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Success Message */}
        {success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Profile updated successfully!
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

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
            <p className="mt-1 text-xs text-white/30">Email cannot be changed here</p>
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
                <p className="mt-2 text-sm text-emerald-400/70">
                  {selectedSchool.conference} | {selectedSchool.nilTier} NIL Activity
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
            Helps us estimate your NIL value and find relevant opportunities
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

            <div>
              <label className="block text-sm text-white/50 mb-2">Total Followers (approximate)</label>
              <input
                type="number"
                value={followerCount}
                onChange={(e) => setFollowerCount(e.target.value)}
                placeholder="e.g. 15000"
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50"
              />
              <p className="mt-1 text-xs text-white/30">Combined followers across all platforms</p>
            </div>
          </div>
        </div>

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
            'Save Changes'
          )}
        </button>
      </form>
    </div>
  )
}
