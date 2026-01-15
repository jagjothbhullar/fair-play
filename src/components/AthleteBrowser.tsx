'use client'

import { useState, useEffect, useCallback } from 'react'
import type { SyntheticAthlete } from '@/lib/data/synthetic-athletes'

interface AthleteFilters {
  schools: string[]
  sports: string[]
  conferences: string[]
  performanceTiers: string[]
  classYears: string[]
}

interface AthleteSummary {
  totalMatching: number
  avgNILValue: number
  totalAnnualValue: number
  transferCount: number
  agentCount: number
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

interface QuickStats {
  total: number
  schools: number
  sports: number
  totalNILValue: number
  eliteAthletes: number
  transfers: number
  withAgents: number
}

export default function AthleteBrowser() {
  const [athletes, setAthletes] = useState<SyntheticAthlete[]>([])
  const [filters, setFilters] = useState<AthleteFilters | null>(null)
  const [summary, setSummary] = useState<AthleteSummary | null>(null)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedAthlete, setSelectedAthlete] = useState<SyntheticAthlete | null>(null)

  // Filter state
  const [selectedSchool, setSelectedSchool] = useState('')
  const [selectedSport, setSelectedSport] = useState('')
  const [selectedPerformance, setSelectedPerformance] = useState('')
  const [selectedClassYear, setSelectedClassYear] = useState('')
  const [showTransfersOnly, setShowTransfersOnly] = useState(false)
  const [showAgentsOnly, setShowAgentsOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'nilValue' | 'followers' | 'marketability' | 'name'>('nilValue')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch quick stats on mount
  useEffect(() => {
    fetch('/api/athletes?stats=quick')
      .then(res => res.json())
      .then(data => setQuickStats(data))
      .catch(console.error)
  }, [])

  // Fetch athletes with filters
  const fetchAthletes = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedSchool) params.set('school', selectedSchool)
      if (selectedSport) params.set('sport', selectedSport)
      if (selectedPerformance) params.set('performanceTier', selectedPerformance)
      if (selectedClassYear) params.set('classYear', selectedClassYear)
      if (showTransfersOnly) params.set('isTransfer', 'true')
      if (showAgentsOnly) params.set('hasAgent', 'true')
      params.set('sortBy', sortBy)
      params.set('sortDirection', sortDirection)
      params.set('page', currentPage.toString())
      params.set('limit', '24')

      const response = await fetch(`/api/athletes?${params}`)
      const data = await response.json()

      setAthletes(data.athletes)
      setFilters(data.filters)
      setSummary(data.summary)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Failed to fetch athletes:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedSchool, selectedSport, selectedPerformance, selectedClassYear, showTransfersOnly, showAgentsOnly, sortBy, sortDirection, currentPage])

  useEffect(() => {
    fetchAthletes()
  }, [fetchAthletes])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedSchool, selectedSport, selectedPerformance, selectedClassYear, showTransfersOnly, showAgentsOnly])

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`
    return `$${value.toLocaleString()}`
  }

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`
    return count.toString()
  }

  const getPerformanceColor = (tier: string): string => {
    const colors: Record<string, string> = {
      'elite': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'all_conference': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'starter': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'rotation': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
      'developing': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'walkon': 'bg-white/10 text-white/50 border-white/20',
    }
    return colors[tier] || colors.rotation
  }

  const getPerformanceLabel = (tier: string): string => {
    const labels: Record<string, string> = {
      'elite': 'Elite',
      'all_conference': 'All-Conference',
      'starter': 'Starter',
      'rotation': 'Rotation',
      'developing': 'Developing',
      'walkon': 'Walk-on',
    }
    return labels[tier] || tier
  }

  const clearFilters = () => {
    setSelectedSchool('')
    setSelectedSport('')
    setSelectedPerformance('')
    setSelectedClassYear('')
    setShowTransfersOnly(false)
    setShowAgentsOnly(false)
    setCurrentPage(1)
  }

  const hasActiveFilters = selectedSchool || selectedSport || selectedPerformance || selectedClassYear || showTransfersOnly || showAgentsOnly

  // Filter athletes by search query (client-side)
  const displayedAthletes = searchQuery
    ? athletes.filter(a =>
        `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.sport.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : athletes

  return (
    <div className="space-y-6">
      {/* Quick Stats Banner */}
      {quickStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{quickStats.total.toLocaleString()}</p>
            <p className="text-xs text-white/40">Athletes</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{quickStats.schools}</p>
            <p className="text-xs text-white/40">Schools</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{quickStats.sports}</p>
            <p className="text-xs text-white/40">Sports</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{formatCurrency(quickStats.totalNILValue)}</p>
            <p className="text-xs text-white/40">Total NIL Value</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-400">{quickStats.eliteAthletes}</p>
            <p className="text-xs text-white/40">Elite Athletes</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{quickStats.transfers}</p>
            <p className="text-xs text-white/40">Transfers</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-teal-400">{quickStats.withAgents}</p>
            <p className="text-xs text-white/40">With Agents</p>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 md:p-6">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search athletes, schools, sports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50"
            />
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap gap-3">
          {filters && (
            <>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-400/50"
              >
                <option value="">All Schools</option>
                {filters.schools.map(school => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </select>

              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-400/50"
              >
                <option value="">All Sports</option>
                {filters.sports.map(sport => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>

              <select
                value={selectedPerformance}
                onChange={(e) => setSelectedPerformance(e.target.value)}
                className="px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-400/50"
              >
                <option value="">All Performance</option>
                {filters.performanceTiers.map(tier => (
                  <option key={tier} value={tier}>{getPerformanceLabel(tier)}</option>
                ))}
              </select>

              <select
                value={selectedClassYear}
                onChange={(e) => setSelectedClassYear(e.target.value)}
                className="px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-400/50"
              >
                <option value="">All Years</option>
                {filters.classYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </>
          )}

          <label className="flex items-center gap-2 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm cursor-pointer hover:border-white/20">
            <input
              type="checkbox"
              checked={showTransfersOnly}
              onChange={(e) => setShowTransfersOnly(e.target.checked)}
              className="rounded border-white/30 bg-transparent text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-white/70">Transfers Only</span>
          </label>

          <label className="flex items-center gap-2 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm cursor-pointer hover:border-white/20">
            <input
              type="checkbox"
              checked={showAgentsOnly}
              onChange={(e) => setShowAgentsOnly(e.target.checked)}
              className="rounded border-white/30 bg-transparent text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-white/70">With Agents</span>
          </label>

          <select
            value={`${sortBy}-${sortDirection}`}
            onChange={(e) => {
              const [by, dir] = e.target.value.split('-')
              setSortBy(by as typeof sortBy)
              setSortDirection(dir as typeof sortDirection)
            }}
            className="px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-400/50"
          >
            <option value="nilValue-desc">Highest NIL Value</option>
            <option value="nilValue-asc">Lowest NIL Value</option>
            <option value="followers-desc">Most Followers</option>
            <option value="followers-asc">Least Followers</option>
            <option value="marketability-desc">Most Marketable</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-white/50 hover:text-white transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Results Summary */}
        {summary && (
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 text-sm">
            <span className="text-white/50">
              Showing <span className="text-white font-medium">{displayedAthletes.length}</span> of{' '}
              <span className="text-white font-medium">{summary.totalMatching.toLocaleString()}</span> athletes
            </span>
            <span className="text-white/30">|</span>
            <span className="text-white/50">
              Avg Value: <span className="text-emerald-400 font-medium">{formatCurrency(summary.avgNILValue)}</span>
            </span>
            <span className="text-white/30">|</span>
            <span className="text-white/50">
              Total Annual: <span className="text-emerald-400 font-medium">{formatCurrency(summary.totalAnnualValue)}</span>
            </span>
          </div>
        )}
      </div>

      {/* Athletes Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full" />
        </div>
      ) : displayedAthletes.length === 0 ? (
        <div className="text-center py-20 text-white/50">
          No athletes found matching your criteria
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedAthletes.map((athlete) => (
              <div
                key={athlete.id}
                onClick={() => setSelectedAthlete(athlete)}
                className="bg-white/[0.03] border border-white/10 rounded-xl p-4 hover:border-emerald-500/30 hover:bg-white/[0.05] transition-all cursor-pointer group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                      {athlete.firstName} {athlete.lastName}
                    </h3>
                    <p className="text-sm text-white/50 truncate">{athlete.schoolShortName} - {athlete.sport}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getPerformanceColor(athlete.performanceTier)}`}>
                    {getPerformanceLabel(athlete.performanceTier)}
                  </span>
                </div>

                {/* NIL Value */}
                <div className="mb-3">
                  <p className="text-2xl font-bold text-emerald-400">{formatCurrency(athlete.estimatedNILValue.median)}</p>
                  <p className="text-xs text-white/40">
                    {formatCurrency(athlete.estimatedNILValue.low)} - {formatCurrency(athlete.estimatedNILValue.high)} range
                  </p>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1 text-white/50">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{formatFollowers(athlete.followerCount)}</span>
                  </div>
                  <span className="text-white/20">|</span>
                  <span className="text-white/50">{athlete.classYear}</span>
                  {athlete.position && (
                    <>
                      <span className="text-white/20">|</span>
                      <span className="text-white/50">{athlete.position}</span>
                    </>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {athlete.isTransfer && (
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">Transfer</span>
                  )}
                  {athlete.hasAgent && (
                    <span className="px-2 py-0.5 bg-teal-500/20 text-teal-400 rounded text-xs">Agent Rep</span>
                  )}
                  <span className="px-2 py-0.5 bg-white/10 text-white/50 rounded text-xs">
                    {athlete.marketability}/100 market
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum: number
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-emerald-500 text-black'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Athlete Detail Modal */}
      {selectedAthlete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedAthlete(null)}
        >
          <div
            className="bg-zinc-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedAthlete.firstName} {selectedAthlete.lastName}
                  </h2>
                  <p className="text-white/50">
                    {selectedAthlete.school} - {selectedAthlete.sport}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAthlete(null)}
                  className="p-2 text-white/50 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* NIL Value Card */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-6 text-center">
                <p className="text-white/40 text-sm mb-1">Estimated NIL Value</p>
                <p className="text-4xl font-bold text-emerald-400 mb-2">
                  {formatCurrency(selectedAthlete.estimatedNILValue.median)}
                </p>
                <p className="text-white/50 text-sm">
                  Range: {formatCurrency(selectedAthlete.estimatedNILValue.low)} - {formatCurrency(selectedAthlete.estimatedNILValue.high)}
                </p>
                <p className="text-emerald-400/70 text-sm mt-2">
                  ~{formatCurrency(selectedAthlete.estimatedNILValue.annual)}/year potential
                </p>
              </div>

              {/* Profile Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-white/40 text-xs mb-1">Performance Tier</p>
                  <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${getPerformanceColor(selectedAthlete.performanceTier)}`}>
                    {getPerformanceLabel(selectedAthlete.performanceTier)}
                  </span>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-white/40 text-xs mb-1">Social Following</p>
                  <p className="text-xl font-bold text-white">{formatFollowers(selectedAthlete.followerCount)}</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-white/40 text-xs mb-1">Class Year</p>
                  <p className="text-lg font-medium text-white">{selectedAthlete.classYear}</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-white/40 text-xs mb-1">Position</p>
                  <p className="text-lg font-medium text-white">{selectedAthlete.position || 'N/A'}</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-white/40 text-xs mb-1">Marketability Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full"
                        style={{ width: `${selectedAthlete.marketability}%` }}
                      />
                    </div>
                    <span className="text-white font-medium">{selectedAthlete.marketability}</span>
                  </div>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-white/40 text-xs mb-1">Conference</p>
                  <p className="text-lg font-medium text-white truncate">{selectedAthlete.conference}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {selectedAthlete.isTransfer && (
                  <span className="px-3 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-medium">
                    Transfer Portal (+70% value)
                  </span>
                )}
                {selectedAthlete.hasAgent && (
                  <span className="px-3 py-1.5 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-lg text-sm font-medium">
                    Agent Represented (+430% value)
                  </span>
                )}
              </div>

              {/* Multipliers Breakdown */}
              <div>
                <h3 className="text-sm font-medium text-white/40 mb-3">Value Multipliers</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-black/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-white/40">School</p>
                    <p className="text-lg font-bold text-white">{selectedAthlete.nilMultipliers.school.toFixed(2)}x</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-white/40">Sport</p>
                    <p className="text-lg font-bold text-white">{selectedAthlete.nilMultipliers.sport.toFixed(2)}x</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-white/40">Performance</p>
                    <p className="text-lg font-bold text-white">{selectedAthlete.nilMultipliers.performance.toFixed(2)}x</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-white/40">Followers</p>
                    <p className="text-lg font-bold text-white">{selectedAthlete.nilMultipliers.followers.toFixed(2)}x</p>
                  </div>
                  {selectedAthlete.nilMultipliers.transfer > 1 && (
                    <div className="bg-blue-500/10 rounded-lg p-3 text-center">
                      <p className="text-xs text-blue-400/60">Transfer</p>
                      <p className="text-lg font-bold text-blue-400">{selectedAthlete.nilMultipliers.transfer.toFixed(1)}x</p>
                    </div>
                  )}
                  {selectedAthlete.nilMultipliers.agent > 1 && (
                    <div className="bg-teal-500/10 rounded-lg p-3 text-center">
                      <p className="text-xs text-teal-400/60">Agent</p>
                      <p className="text-lg font-bold text-teal-400">{selectedAthlete.nilMultipliers.agent.toFixed(1)}x</p>
                    </div>
                  )}
                </div>
                <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center">
                  <p className="text-xs text-emerald-400/60">Total Multiplier</p>
                  <p className="text-2xl font-bold text-emerald-400">{selectedAthlete.nilMultipliers.total.toFixed(2)}x</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 bg-white/[0.02]">
              <p className="text-xs text-white/30 text-center">
                ID: {selectedAthlete.id} | Generated synthetic data for prototype demonstration
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
