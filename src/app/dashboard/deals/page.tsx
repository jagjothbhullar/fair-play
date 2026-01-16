'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Deal {
  id: string
  brandName: string
  dealType: string
  value: number
  status: 'active' | 'completed' | 'pending'
  startDate: string
  endDate?: string
}

export default function MyDealsPage() {
  const [deals] = useState<Deal[]>([])

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">My Deals</h1>
        <p className="text-xl text-white/50">
          Track and manage your NIL deals in one place.
        </p>
      </div>

      {/* Add Deal CTA */}
      <div className="mb-8 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold mb-1">Track a new deal</h3>
          <p className="text-white/50 text-sm">
            Add your NIL deals to keep everything organized.
          </p>
        </div>
        <button
          className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black rounded-xl font-semibold hover:from-emerald-300 hover:to-emerald-400 transition-all"
        >
          Add Deal
        </button>
      </div>

      {/* Deals List */}
      {deals.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No deals yet</h3>
          <p className="text-white/50 mb-6">
            Start tracking your NIL deals to see them here.
          </p>
          <button
            className="px-6 py-3 bg-emerald-500 text-black rounded-xl font-semibold hover:bg-emerald-400 transition-colors"
          >
            Add Your First Deal
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{deal.brandName}</h3>
                  <p className="text-white/50 text-sm">{deal.dealType}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold text-lg">
                    ${deal.value.toLocaleString()}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    deal.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                    deal.status === 'completed' ? 'bg-white/10 text-white/50' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="mt-12 bg-white/[0.03] border border-white/10 rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Tips for tracking deals</h3>
        <ul className="space-y-2 text-white/50 text-sm">
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Keep records of all communications with brands
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Track deliverables and deadlines
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Report deals to your compliance office as required
          </li>
        </ul>
      </div>
    </div>
  )
}
