'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const DEAL_TYPES = [
  { value: 'SOCIAL_POST', label: 'Social Media Post' },
  { value: 'APPEARANCE', label: 'Personal Appearance' },
  { value: 'AUTOGRAPH', label: 'Autograph Session' },
  { value: 'CAMP', label: 'Camp/Clinic' },
  { value: 'LICENSING', label: 'Licensing' },
  { value: 'MERCHANDISE', label: 'Merchandise' },
  { value: 'OTHER', label: 'Other' },
]

export default function NewDealPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [brandName, setBrandName] = useState('')
  const [dealType, setDealType] = useState('SOCIAL_POST')
  const [description, setDescription] = useState('')
  const [compensationCash, setCompensationCash] = useState('')
  const [compensationProducts, setCompensationProducts] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isExclusive, setIsExclusive] = useState(false)
  const [exclusivityCategory, setExclusivityCategory] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          brandNameOverride: brandName,
          dealType,
          description,
          compensationCash: compensationCash ? parseFloat(compensationCash) : 0,
          compensationProducts,
          startDate: startDate || null,
          endDate: endDate || null,
          isExclusive,
          exclusivityCategory: isExclusive ? exclusivityCategory : null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create deal')
      }

      const data = await response.json()
      router.push(`/deals/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/deals" className="text-blue-500 hover:text-blue-600 text-sm">
          &larr; Back to Deals
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Add New Deal</h1>
        <p className="text-slate-500">Enter the details of your NIL agreement</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6">
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-medium text-slate-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Deal Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g., Instagram Post for Local Pizza Shop"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Brand/Company Name *
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  required
                  placeholder="e.g., Tony's Pizza"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Deal Type *
                </label>
                <select
                  value={dealType}
                  onChange={(e) => setDealType(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DEAL_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe what you'll be doing for this deal..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Compensation */}
          <div>
            <h2 className="text-lg font-medium text-slate-900 mb-4">Compensation</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Cash Payment ($)
                </label>
                <input
                  type="number"
                  value={compensationCash}
                  onChange={(e) => setCompensationCash(e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Products/Services (if any)
                </label>
                <input
                  type="text"
                  value={compensationProducts}
                  onChange={(e) => setCompensationProducts(e.target.value)}
                  placeholder="e.g., Free merchandise, gym membership"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {parseFloat(compensationCash || '0') >= 600 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                  <strong>Note:</strong> Deals worth $600+ must be reported to the NCAA within 5 business days.
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h2 className="text-lg font-medium text-slate-900 mb-4">Timeline</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Exclusivity */}
          <div>
            <h2 className="text-lg font-medium text-slate-900 mb-4">Exclusivity</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isExclusive}
                  onChange={(e) => setIsExclusive(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-slate-700">This deal has exclusivity terms</span>
              </label>

              {isExclusive && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Exclusivity Category
                  </label>
                  <input
                    type="text"
                    value={exclusivityCategory}
                    onChange={(e) => setExclusivityCategory(e.target.value)}
                    placeholder="e.g., Energy drinks, Athletic apparel"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <Link
              href="/deals"
              className="flex-1 py-3 text-center bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Deal'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
