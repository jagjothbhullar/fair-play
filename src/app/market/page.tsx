'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import NILCalculator from '@/components/NILCalculator'
import AthleteBrowser from '@/components/AthleteBrowser'
import type { User } from '@supabase/supabase-js'

interface NILDeal {
  id: string
  sport: string
  sportCategory: string
  division: string
  conference: string | null
  schoolTier: string
  followerCount: number | null
  followerTier: string | null
  classYear: string | null
  isStarter: boolean | null
  dealType: string
  compensationCash: number
  compensationProduct: number | null
  totalValue: number
  brandIndustry: string | null
  brandTier: string
  deliverables: string | null
  hoursWorked: number | null
  satisfactionRating: number | null
  wouldDoAgain: boolean | null
  notes: string | null
  isVerified: boolean
  createdAt: string
}

interface MarketStats {
  totalDeals: number
  avgDealValue: number
  medianDealValue: number
  topSport: string
  topDealType: string
}

export default function NILMarketPage() {
  const [deals, setDeals] = useState<NILDeal[]>([])
  const [stats, setStats] = useState<MarketStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [authChecking, setAuthChecking] = useState(true)
  const [filters, setFilters] = useState({
    sport: '',
    dealType: '',
    schoolTier: '',
    brandTier: '',
  })

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/?feature=market')
        return
      }
      setUser(user)
      setAuthChecking(false)
    }
    checkAuth()
  }, [supabase.auth, router])

  useEffect(() => {
    if (!authChecking && user) {
      fetchDeals()
    }
  }, [filters, authChecking, user])

  async function fetchDeals() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.sport) params.set('sport', filters.sport)
      if (filters.dealType) params.set('dealType', filters.dealType)
      if (filters.schoolTier) params.set('schoolTier', filters.schoolTier)
      if (filters.brandTier) params.set('brandTier', filters.brandTier)

      const response = await fetch(`/api/market?${params}`)
      const data = await response.json()
      setDeals(data.deals)
      setStats(data.stats)
    } catch (error) {
      console.error('Failed to fetch deals:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`
    }
    return `$${value}`
  }

  const sportCategories = [
    "Men's Basketball", "Women's Basketball", "Football", "Women's Volleyball",
    "Baseball", "Softball", "Men's Soccer", "Women's Soccer", "Women's Gymnastics",
    "Wrestling", "Swimming & Diving", "Track & Field"
  ]

  const dealTypes = [
    { value: "SOCIAL_POST", label: "Social Post" },
    { value: "APPEARANCE", label: "Appearance" },
    { value: "AUTOGRAPH", label: "Autograph" },
    { value: "CAMP", label: "Camp" },
    { value: "LICENSING", label: "Licensing" },
    { value: "MERCHANDISE", label: "Merchandise" },
  ]

  const schoolTiers = [
    { value: "BLUE_BLOOD", label: "Blue Blood" },
    { value: "POWER_FIVE", label: "Power 5" },
    { value: "MID_MAJOR", label: "Mid-Major" },
    { value: "SMALL_SCHOOL", label: "Small School" },
  ]

  const brandTiers = [
    { value: "GLOBAL", label: "Global Brand" },
    { value: "NATIONAL", label: "National" },
    { value: "REGIONAL", label: "Regional" },
    { value: "LOCAL", label: "Local" },
  ]

  // Show loading while checking auth
  if (authChecking) {
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
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">FP</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">Fair Play</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm text-white/70 hover:text-white transition-colors">
              Scanner
            </Link>
            <span className="text-sm text-emerald-400 font-medium">NIL Market</span>
            <Link href="/water-cooler" className="text-sm text-white/70 hover:text-white transition-colors">
              Water Cooler
            </Link>
            <Link href="/scans" className="text-sm text-white/70 hover:text-white transition-colors">
              My Scans
            </Link>
            <div className="flex items-center gap-2 pl-4 border-l border-white/10">
              <span className="text-sm text-white/50">
                {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm text-emerald-400 mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            {stats?.totalDeals || 0}+ verified deal reports
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            NIL Market
          </h1>
          <p className="text-xl text-white/50 max-w-2xl">
            Real compensation data from real athletes. See what deals are actually worth before you negotiate.
          </p>
        </div>

        {/* NIL Value Calculator */}
        <div className="mb-12">
          <NILCalculator />
        </div>

        {/* Athlete Database Browser */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">California D1 Athlete Database</h2>
              <p className="text-white/50 text-sm">Browse estimated NIL values for all California Division 1 athletes</p>
            </div>
          </div>
          <AthleteBrowser />
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <p className="text-white/40 text-sm mb-1">Average Deal</p>
              <p className="text-3xl font-bold text-emerald-400">{formatCurrency(stats.avgDealValue)}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <p className="text-white/40 text-sm mb-1">Median Deal</p>
              <p className="text-3xl font-bold">{formatCurrency(stats.medianDealValue)}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <p className="text-white/40 text-sm mb-1">Top Sport</p>
              <p className="text-xl font-bold truncate">{stats.topSport}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <p className="text-white/40 text-sm mb-1">Top Deal Type</p>
              <p className="text-xl font-bold">{stats.topDealType.replace('_', ' ')}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <select
            value={filters.sport}
            onChange={(e) => setFilters({ ...filters, sport: e.target.value })}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400/50"
          >
            <option value="">All Sports</option>
            {sportCategories.map((sport) => (
              <option key={sport} value={sport}>{sport}</option>
            ))}
          </select>

          <select
            value={filters.dealType}
            onChange={(e) => setFilters({ ...filters, dealType: e.target.value })}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400/50"
          >
            <option value="">All Deal Types</option>
            {dealTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <select
            value={filters.schoolTier}
            onChange={(e) => setFilters({ ...filters, schoolTier: e.target.value })}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400/50"
          >
            <option value="">All School Tiers</option>
            {schoolTiers.map((tier) => (
              <option key={tier.value} value={tier.value}>{tier.label}</option>
            ))}
          </select>

          <select
            value={filters.brandTier}
            onChange={(e) => setFilters({ ...filters, brandTier: e.target.value })}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400/50"
          >
            <option value="">All Brand Tiers</option>
            {brandTiers.map((tier) => (
              <option key={tier.value} value={tier.value}>{tier.label}</option>
            ))}
          </select>

          {(filters.sport || filters.dealType || filters.schoolTier || filters.brandTier) && (
            <button
              onClick={() => setFilters({ sport: '', dealType: '', schoolTier: '', brandTier: '' })}
              className="px-4 py-3 text-white/60 hover:text-white transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Deals Table */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-white/50">Loading deals...</div>
          ) : deals.length === 0 ? (
            <div className="p-12 text-center text-white/50">No deals found matching your filters</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-6 py-4 text-white/40 text-sm font-medium">Sport</th>
                    <th className="text-left px-6 py-4 text-white/40 text-sm font-medium">Deal Type</th>
                    <th className="text-left px-6 py-4 text-white/40 text-sm font-medium">Total Value</th>
                    <th className="text-left px-6 py-4 text-white/40 text-sm font-medium">School Tier</th>
                    <th className="text-left px-6 py-4 text-white/40 text-sm font-medium">Brand Tier</th>
                    <th className="text-left px-6 py-4 text-white/40 text-sm font-medium">Followers</th>
                    <th className="text-left px-6 py-4 text-white/40 text-sm font-medium">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal) => (
                    <tr key={deal.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium">{deal.sport}</div>
                        <div className="text-sm text-white/40">{deal.conference}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-white/10 rounded-full text-sm">
                          {deal.dealType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xl font-bold text-emerald-400">
                          {formatCurrency(deal.totalValue)}
                        </div>
                        {deal.compensationProduct && deal.compensationProduct > 0 && (
                          <div className="text-xs text-white/40">
                            +{formatCurrency(deal.compensationProduct)} product
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSchoolTierColor(deal.schoolTier)}`}>
                          {deal.schoolTier.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getBrandTierColor(deal.brandTier)}`}>
                          {deal.brandTier}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/60">
                        {deal.followerCount ? `${(deal.followerCount / 1000).toFixed(0)}k` : '-'}
                      </td>
                      <td className="px-6 py-4">
                        {deal.satisfactionRating && (
                          <div className="flex items-center gap-1">
                            <span className="text-emerald-400">{'★'.repeat(deal.satisfactionRating)}</span>
                            <span className="text-white/20">{'★'.repeat(5 - deal.satisfactionRating)}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-3">Have a deal to report?</h3>
            <p className="text-white/50 mb-6">
              Help other athletes by anonymously sharing your NIL deal data.
            </p>
            <button
              className="inline-flex px-8 py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black rounded-full font-semibold hover:from-emerald-300 hover:to-emerald-400"
            >
              Submit Your Deal
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

function getSchoolTierColor(tier: string): string {
  const colors: Record<string, string> = {
    BLUE_BLOOD: 'bg-purple-500/20 text-purple-400',
    POWER_FIVE: 'bg-blue-500/20 text-blue-400',
    MID_MAJOR: 'bg-emerald-500/20 text-emerald-400',
    SMALL_SCHOOL: 'bg-white/10 text-white/60',
  }
  return colors[tier] || colors.MID_MAJOR
}

function getBrandTierColor(tier: string): string {
  const colors: Record<string, string> = {
    GLOBAL: 'bg-emerald-500/20 text-emerald-400',
    NATIONAL: 'bg-blue-500/20 text-blue-400',
    REGIONAL: 'bg-teal-500/20 text-teal-400',
    LOCAL: 'bg-white/10 text-white/60',
  }
  return colors[tier] || colors.LOCAL
}
