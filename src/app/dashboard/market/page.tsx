'use client'

import { useState } from 'react'
import NILCalculator, { type CalculatorInputs } from '@/components/NILCalculator'
import SimilarAthletes from '@/components/SimilarAthletes'

const recentDeals = [
  { type: 'Social Post', value: '$2,500', schoolTier: 'Power Five', followers: '50K-100K', sport: 'Football' },
  { type: 'Appearance', value: '$5,000', schoolTier: 'Blue Blood', followers: '100K-500K', sport: "Men's Basketball" },
  { type: 'Licensing', value: '$15,000', schoolTier: 'Power Five', followers: '500K+', sport: 'Football' },
  { type: 'Social Post', value: '$800', schoolTier: 'Mid-Major', followers: '10K-50K', sport: "Women's Volleyball" },
  { type: 'Camp', value: '$3,500', schoolTier: 'Power Five', followers: '50K-100K', sport: "Men's Basketball" },
  { type: 'Autograph', value: '$1,200', schoolTier: 'Blue Blood', followers: '100K-500K', sport: 'Football' },
  { type: 'Social Post', value: '$1,500', schoolTier: 'Power Five', followers: '50K-100K', sport: "Women's Gymnastics" },
  { type: 'Merchandise', value: '$8,000', schoolTier: 'Blue Blood', followers: '500K+', sport: "Men's Basketball" },
  { type: 'Appearance', value: '$2,000', schoolTier: 'Mid-Major', followers: '10K-50K', sport: "Women's Basketball" },
  { type: 'Social Post', value: '$500', schoolTier: 'Small School', followers: '1K-10K', sport: 'Baseball' },
]

export default function NILMarketPage() {
  const [calculatorInputs, setCalculatorInputs] = useState<CalculatorInputs | null>(null)
  const [hasCalculated, setHasCalculated] = useState(false)

  function handleCalculate(inputs: CalculatorInputs) {
    setCalculatorInputs(inputs)
    setHasCalculated(true)
  }

  return (
    <div className="max-w-4xl mx-auto">
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

      {/* Info Cards */}
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

      {/* Recent Deals Table */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold mb-6">Recent NIL Deals</h3>
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-6 py-4 text-sm font-medium text-white/50">Deal Type</th>
                  <th className="px-6 py-4 text-sm font-medium text-white/50">Value</th>
                  <th className="px-6 py-4 text-sm font-medium text-white/50">School Tier</th>
                  <th className="px-6 py-4 text-sm font-medium text-white/50">Followers</th>
                  <th className="px-6 py-4 text-sm font-medium text-white/50">Sport</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentDeals.map((deal, index) => (
                  <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-white/5 rounded text-sm">{deal.type}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-400">{deal.value}</td>
                    <td className="px-6 py-4 text-white/70">{deal.schoolTier}</td>
                    <td className="px-6 py-4 text-white/70">{deal.followers}</td>
                    <td className="px-6 py-4 text-white/70">{deal.sport}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-4 text-center text-white/30 text-sm">
          Anonymized data from verified athlete-reported deals
        </p>
      </div>
    </div>
  )
}
