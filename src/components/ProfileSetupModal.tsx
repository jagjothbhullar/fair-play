'use client'

import { useState } from 'react'
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

interface ProfileSetupModalProps {
  userId: string
  userEmail: string
  onComplete: () => void
}

export default function ProfileSetupModal({ userId, userEmail, onComplete }: ProfileSetupModalProps) {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [schoolShortName, setSchoolShortName] = useState('')
  const [sport, setSport] = useState('')
  const [classYear, setClassYear] = useState('')
  const [instagramHandle, setInstagramHandle] = useState('')
  const [twitterHandle, setTwitterHandle] = useState('')
  const [tiktokHandle, setTiktokHandle] = useState('')

  const selectedSchool = californiaSchools.find(s => s.shortName === schoolShortName)

  async function handleSubmit() {
    if (!firstName || !lastName || !schoolShortName || !sport || !classYear) {
      setError('Please fill in all required fields')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          firstName,
          lastName,
          email: userEmail,
          schoolShortName,
          sport,
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

      onComplete()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-black font-bold">FP</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Welcome to Fair Play!</h2>
              <p className="text-white/50 text-sm">Let's set up your athlete profile</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2">
            <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-white/10'}`} />
            <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-white/10'}`} />
          </div>
          <p className="text-white/40 text-xs mt-2">Step {step} of 2</p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-white/70 text-sm mb-4">
                Tell us about yourself so we can personalize your experience.
              </p>

              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-white/50 mb-1.5">First Name *</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-1.5">Last Name *</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 text-sm"
                  />
                </div>
              </div>

              {/* School */}
              <div>
                <label className="block text-sm text-white/50 mb-1.5">School *</label>
                <select
                  value={schoolShortName}
                  onChange={(e) => setSchoolShortName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400/50 text-sm"
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
                  <p className="mt-1.5 text-xs text-emerald-400/70">
                    {selectedSchool.conference} | {selectedSchool.nilTier} NIL Activity
                  </p>
                )}
              </div>

              {/* Sport & Class Year */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-white/50 mb-1.5">Sport *</label>
                  <select
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400/50 text-sm"
                  >
                    <option value="">Select sport</option>
                    {sports.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-1.5">Class Year *</label>
                  <select
                    value={classYear}
                    onChange={(e) => setClassYear(e.target.value)}
                    className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400/50 text-sm"
                  >
                    <option value="">Select year</option>
                    {classYears.map(year => (
                      <option key={year.value} value={year.value}>{year.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-white/70 text-sm mb-4">
                Add your social media to help us estimate your NIL value. (Optional)
              </p>

              {/* Social Media */}
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Instagram</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">@</span>
                  <input
                    type="text"
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value.replace('@', ''))}
                    placeholder="username"
                    className="w-full pl-7 pr-3 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/50 mb-1.5">Twitter / X</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">@</span>
                  <input
                    type="text"
                    value={twitterHandle}
                    onChange={(e) => setTwitterHandle(e.target.value.replace('@', ''))}
                    placeholder="username"
                    className="w-full pl-7 pr-3 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/50 mb-1.5">TikTok</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">@</span>
                  <input
                    type="text"
                    value={tiktokHandle}
                    onChange={(e) => setTiktokHandle(e.target.value.replace('@', ''))}
                    placeholder="username"
                    className="w-full pl-7 pr-3 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 text-sm"
                  />
                </div>
              </div>

              <p className="text-white/30 text-xs">
                Your social media helps us find relevant NIL opportunities and estimate your value.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 border border-white/10 rounded-xl text-white/70 hover:text-white hover:border-white/20 transition-colors"
            >
              Back
            </button>
          )}

          {step === 1 ? (
            <button
              onClick={() => {
                if (!firstName || !lastName || !schoolShortName || !sport || !classYear) {
                  setError('Please fill in all required fields')
                  return
                }
                setError(null)
                setStep(2)
              }}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black rounded-xl font-semibold hover:from-emerald-300 hover:to-emerald-400 transition-all"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black rounded-xl font-semibold hover:from-emerald-300 hover:to-emerald-400 disabled:opacity-50 transition-all"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Setting up...
                </span>
              ) : (
                "Complete Setup"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
