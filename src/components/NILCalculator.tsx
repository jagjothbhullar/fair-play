'use client'

import { useState } from 'react'
import { californiaSchools, conferenceTierMultipliers, sportCeilings, TRANSFER_PREMIUM, AGENT_PREMIUM } from '@/lib/data/california-schools'

interface CalculatorResult {
  estimation: {
    low: number
    median: number
    high: number
    ceiling: number
  }
  annualValue: {
    low: number
    median: number
    high: number
  }
  comparableDeals: number
  confidence: 'high' | 'medium' | 'low'
  multipliers: {
    school: number
    followers: number
    transfer: number
    agent: number
    total: number
  }
  schoolInfo?: {
    name: string
    nilTier: string
    conference: string
  }
}

export interface CalculatorInputs {
  sport: string
  dealType: string
  school: string
  followerTier: string
  isTransfer: boolean
  hasAgent: boolean
  conferenceType?: string
}

interface NILCalculatorProps {
  onCalculate?: (inputs: CalculatorInputs, result: CalculatorResult) => void
}

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
  'Tennis',
  'Golf',
  'Rowing',
  'Beach Volleyball',
  'Wrestling',
  "Men's Volleyball",
  "Water Polo",
]

const dealTypes = [
  { value: 'Social Media', label: 'Social Media Post' },
  { value: 'Public Appearance', label: 'Public Appearance' },
  { value: 'Autograph', label: 'Autograph Signing' },
  { value: 'Camps and Lessons', label: 'Camps & Lessons' },
  { value: 'Licensing', label: 'Licensing Deal' },
  { value: 'Collective', label: 'Collective Payment' },
  { value: 'Other', label: 'Other' },
]

// Generate school options from California schools + generic tiers
const schoolOptions = [
  { value: 'CUSTOM_POWER_FOUR', label: '--- Power Four (SEC, Big Ten, Big 12, ACC) ---', group: 'tier' },
  { value: 'CUSTOM_GROUP_OF_FIVE', label: '--- Group of Five (MW, AAC, Sun Belt, etc.) ---', group: 'tier' },
  { value: 'CUSTOM_MID_MAJOR', label: '--- Mid-Major (WCC, Big West, etc.) ---', group: 'tier' },
  { value: 'CUSTOM_FCS', label: '--- FCS (Big Sky, CAA, etc.) ---', group: 'tier' },
  ...californiaSchools
    .sort((a, b) => b.nilMultiplier - a.nilMultiplier)
    .map(s => ({
      value: s.shortName,
      label: `${s.shortName} - ${s.conference}`,
      group: 'california'
    }))
]

const followerTiers = [
  { value: 'under_1k', label: 'Under 1K', multiplier: 0.5 },
  { value: '1k_10k', label: '1K - 10K', multiplier: 0.75 },
  { value: '10k_50k', label: '10K - 50K', multiplier: 1.0 },
  { value: '50k_100k', label: '50K - 100K', multiplier: 1.5 },
  { value: '100k_500k', label: '100K - 500K', multiplier: 2.5 },
  { value: '500k_1m', label: '500K - 1M', multiplier: 4.0 },
  { value: '1m_plus', label: '1M+', multiplier: 8.0 },
]

// Athlete performance/ranking tiers
const performanceTiers = [
  { value: 'elite', label: 'Elite (All-American, National Champion, Top 10 Recruit)', multiplier: 3.0 },
  { value: 'all_conference', label: 'All-Conference / Conference Champion', multiplier: 2.0 },
  { value: 'starter', label: 'Starter / Key Contributor', multiplier: 1.25 },
  { value: 'rotation', label: 'Rotation Player / Regular Contributor', multiplier: 1.0 },
  { value: 'developing', label: 'Developing / Limited Playing Time', multiplier: 0.6 },
  { value: 'walkon', label: 'Walk-on / Bench', multiplier: 0.3 },
]

// Base deal values by type - Updated with 2025 influencer marketing benchmarks
// Athletes get 2.3x higher engagement than regular influencers (5.6% vs 2.4% avg engagement)
// Average sponsored post for college athlete = $220 (but varies widely by following)
const baseDealValues: Record<string, { low: number; median: number; high: number }> = {
  'Social Media': { low: 100, median: 500, high: 2500 },      // Per-post; scales heavily with followers
  'Public Appearance': { low: 500, median: 1500, high: 5000 },
  'Autograph': { low: 200, median: 750, high: 2000 },
  'Camps and Lessons': { low: 1000, median: 3000, high: 10000 },
  'Licensing': { low: 2500, median: 7500, high: 25000 },
  'Collective': { low: 5000, median: 15000, high: 50000 },    // Monthly collective payments
  'Other': { low: 300, median: 1000, high: 3000 },
}

// Platform-specific per-post rates by follower tier (2025 influencer marketing data)
// Athletes typically command premium due to 2.3x higher engagement
const socialMediaRates: Record<string, Record<string, { low: number; high: number }>> = {
  'Instagram': {
    'under_1k': { low: 20, high: 100 },
    '1k_10k': { low: 100, high: 500 },      // Nano-influencer tier
    '10k_50k': { low: 250, high: 1500 },    // Micro-influencer tier
    '50k_100k': { low: 500, high: 3000 },
    '100k_500k': { low: 1500, high: 7500 }, // Mid-tier
    '500k_1m': { low: 5000, high: 15000 },  // Macro
    '1m_plus': { low: 10000, high: 100000 }, // Mega
  },
  'TikTok': {
    'under_1k': { low: 5, high: 50 },
    '1k_10k': { low: 25, high: 300 },
    '10k_50k': { low: 200, high: 1000 },
    '50k_100k': { low: 500, high: 2500 },
    '100k_500k': { low: 1000, high: 5000 },
    '500k_1m': { low: 2500, high: 12000 },
    '1m_plus': { low: 10000, high: 50000 },
  },
  'YouTube': {
    'under_1k': { low: 50, high: 200 },
    '1k_10k': { low: 200, high: 1000 },
    '10k_50k': { low: 500, high: 3000 },
    '50k_100k': { low: 2000, high: 8000 },
    '100k_500k': { low: 5000, high: 15000 },
    '500k_1m': { low: 10000, high: 30000 },
    '1m_plus': { low: 25000, high: 75000 },
  },
}

// Annual NIL value base estimates by follower tier
// Research shows: Average NIL = $53,643, but Median = $3,371 (huge gap!)
// Only 1% of athletes earn >$50,000 annually
// These ranges reflect realistic expectations across the distribution
function getFollowerAnnualBase(tier: string): { low: number; median: number; high: number } {
  const bases: Record<string, { low: number; median: number; high: number }> = {
    'under_1k': { low: 0, median: 500, high: 2000 },           // Most athletes here
    '1k_10k': { low: 500, median: 3000, high: 10000 },         // Median athlete range
    '10k_50k': { low: 5000, median: 20000, high: 50000 },      // Above average
    '50k_100k': { low: 20000, median: 50000, high: 120000 },   // Top 10%
    '100k_500k': { low: 50000, median: 150000, high: 400000 }, // Top 5%
    '500k_1m': { low: 150000, median: 400000, high: 1000000 }, // Top 1%
    '1m_plus': { low: 400000, median: 1200000, high: 5000000 }, // Elite tier
  }
  return bases[tier] || { low: 500, median: 3000, high: 10000 }
}

// Sport multiplier for annual value - Updated with 2024-25 research data
// Top 25 athletes by sport: Men's BB $349K, Football $294K, Women's BB $89K
// Average by sport: Men's BB $65,853, Football $40,179, Women's BB $16,222
function getSportAnnualMultiplier(sport: string): number {
  const multipliers: Record<string, number> = {
    "Men's Basketball": 1.6,    // Highest per-player average ($65,853)
    'Football': 1.4,            // 41% of all NIL deals, but diluted by roster size
    "Women's Basketball": 1.3,  // 85% YoY growth, rising fast
    "Women's Gymnastics": 1.5,  // Exceptional social media engagement
    "Women's Volleyball": 1.1,  // Growing - 90 commercial deals/year for top earners
    'Baseball': 0.9,            // Top 25 avg: $47,710
    'Softball': 0.8,            // 18.5% of Power 4 women's deals
    'Track and Field': 0.6,
    "Men's Soccer": 0.65,
    "Women's Soccer": 0.7,
    'Swimming and Diving': 0.6,
    'Tennis': 0.7,
    'Golf': 0.75,
    'Wrestling': 0.55,
    'Beach Volleyball': 1.0,    // High social media potential
    'Rowing': 0.4,
    "Men's Volleyball": 0.6,
    "Water Polo": 0.5,
  }
  return multipliers[sport] || 0.65
}

// Position premium for certain sports (QB commands 2-5x other positions)
function getPositionPremium(sport: string): string {
  const premiums: Record<string, string> = {
    'Football': 'QBs earn 2-5x other positions',
    "Men's Basketball": 'Guards typically earn more than bigs',
    "Women's Gymnastics": 'All-around athletes command premium',
  }
  return premiums[sport] || ''
}

export default function NILCalculator({ onCalculate }: NILCalculatorProps) {
  const [sport, setSport] = useState('')
  const [dealType, setDealType] = useState('')
  const [school, setSchool] = useState('')
  const [followerTier, setFollowerTier] = useState('')
  const [isTransfer, setIsTransfer] = useState(false)
  const [hasAgent, setHasAgent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CalculatorResult | null>(null)

  function calculateValue() {
    if (!sport || !dealType || !school || !followerTier) return

    setLoading(true)

    // Get base values for deal type
    const baseValues = baseDealValues[dealType] || baseDealValues['Other']

    // Get school multiplier
    let schoolMultiplier = 1.0
    let schoolInfo = undefined

    if (school.startsWith('CUSTOM_')) {
      // Generic tier selected
      const tierMap: Record<string, number> = {
        'CUSTOM_POWER_FOUR': 1.3,
        'CUSTOM_GROUP_OF_FIVE': 0.7,
        'CUSTOM_MID_MAJOR': 0.4,
        'CUSTOM_FCS': 0.3,
      }
      schoolMultiplier = tierMap[school] || 1.0
    } else {
      // California school selected
      const calSchool = californiaSchools.find(s => s.shortName === school)
      if (calSchool) {
        schoolMultiplier = calSchool.nilMultiplier
        schoolInfo = {
          name: calSchool.name,
          nilTier: calSchool.nilTier,
          conference: calSchool.conference,
        }
      }
    }

    // Get follower multiplier
    const followerData = followerTiers.find(t => t.value === followerTier)
    const followerMultiplier = followerData?.multiplier || 1.0

    // Apply transfer and agent premiums
    const transferMultiplier = isTransfer ? TRANSFER_PREMIUM : 1.0
    const agentMultiplier = hasAgent ? AGENT_PREMIUM : 1.0

    // Calculate total multiplier
    const totalMultiplier = schoolMultiplier * followerMultiplier * transferMultiplier * agentMultiplier

    // Calculate estimated values
    const estimatedLow = Math.round(baseValues.low * totalMultiplier)
    const estimatedMedian = Math.round(baseValues.median * totalMultiplier)
    const estimatedHigh = Math.round(baseValues.high * totalMultiplier)

    // Get sport ceiling
    const ceiling = sportCeilings[sport] || 10000

    // Calculate annual NIL value estimate based on followers + school + sport
    // This estimates what an athlete could earn annually from all NIL activities
    const followerAnnualBase = getFollowerAnnualBase(followerTier)
    const sportAnnualMultiplier = getSportAnnualMultiplier(sport)
    const annualLow = Math.round(followerAnnualBase.low * schoolMultiplier * sportAnnualMultiplier * transferMultiplier * agentMultiplier)
    const annualMedian = Math.round(followerAnnualBase.median * schoolMultiplier * sportAnnualMultiplier * transferMultiplier * agentMultiplier)
    const annualHigh = Math.round(followerAnnualBase.high * schoolMultiplier * sportAnnualMultiplier * transferMultiplier * agentMultiplier)

    // Determine confidence based on school type
    let confidence: 'high' | 'medium' | 'low' = 'medium'
    if (schoolInfo) {
      confidence = 'high' // California school with real data
    } else if (school.startsWith('CUSTOM_POWER_FOUR') || school.startsWith('CUSTOM_GROUP_OF_FIVE')) {
      confidence = 'medium'
    } else {
      confidence = 'low'
    }

    // Determine conference type for similar athlete matching
    let conferenceType = 'MID_MAJOR'
    if (school.startsWith('CUSTOM_')) {
      conferenceType = school.replace('CUSTOM_', '')
    } else if (schoolInfo) {
      const calSchool = californiaSchools.find(s => s.shortName === school)
      if (calSchool) {
        conferenceType = calSchool.conferenceType
      }
    }

    // Simulate loading for UX
    setTimeout(() => {
      const calculatedResult: CalculatorResult = {
        estimation: {
          low: estimatedLow,
          median: estimatedMedian,
          high: estimatedHigh,
          ceiling: ceiling,
        },
        annualValue: {
          low: annualLow,
          median: annualMedian,
          high: annualHigh,
        },
        comparableDeals: schoolInfo ? 150 : 50,
        confidence,
        multipliers: {
          school: schoolMultiplier,
          followers: followerMultiplier,
          transfer: transferMultiplier,
          agent: agentMultiplier,
          total: totalMultiplier,
        },
        schoolInfo,
      }

      setResult(calculatedResult)
      setLoading(false)

      // Call callback with inputs and result
      if (onCalculate) {
        onCalculate({
          sport,
          dealType,
          school,
          followerTier,
          isTransfer,
          hasAgent,
          conferenceType,
        }, calculatedResult)
      }
    }, 500)
  }

  function formatCurrency(value: number): string {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`
    }
    return `$${value.toLocaleString()}`
  }

  function getConfidenceColor(confidence: string): string {
    switch (confidence) {
      case 'high':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      default:
        return 'text-white/50 bg-white/5 border-white/10'
    }
  }

  function getNILTierColor(tier: string): string {
    switch (tier) {
      case 'ELITE':
        return 'text-purple-400 bg-purple-500/10'
      case 'HIGH':
        return 'text-emerald-400 bg-emerald-500/10'
      case 'MODERATE':
        return 'text-blue-400 bg-blue-500/10'
      case 'EMERGING':
        return 'text-yellow-400 bg-yellow-500/10'
      default:
        return 'text-white/40 bg-white/5'
    }
  }

  return (
    <div className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">NIL Value Calculator</h2>
          <p className="text-white/50 text-sm">
            Get personalized deal estimates based on real NIL data from California D1 schools
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Sport */}
        <div>
          <label className="block text-sm text-white/40 mb-2">Sport</label>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400/50"
          >
            <option value="">Select your sport</option>
            {sports.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Deal Type */}
        <div>
          <label className="block text-sm text-white/40 mb-2">Deal Type</label>
          <select
            value={dealType}
            onChange={(e) => setDealType(e.target.value)}
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400/50"
          >
            <option value="">Select deal type</option>
            {dealTypes.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>

        {/* School */}
        <div>
          <label className="block text-sm text-white/40 mb-2">School</label>
          <select
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400/50"
          >
            <option value="">Select your school</option>
            <optgroup label="Generic Tiers (Non-California)">
              {schoolOptions.filter(s => s.group === 'tier').map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </optgroup>
            <optgroup label="California D1 Schools">
              {schoolOptions.filter(s => s.group === 'california').map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Follower Count */}
        <div>
          <label className="block text-sm text-white/40 mb-2">Social Media Following</label>
          <select
            value={followerTier}
            onChange={(e) => setFollowerTier(e.target.value)}
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400/50"
          >
            <option value="">Select follower range</option>
            {followerTiers.map((t) => (
              <option key={t.value} value={t.value}>{t.label} followers</option>
            ))}
          </select>
        </div>
      </div>

      {/* Premium Factors */}
      <div className="flex flex-wrap gap-4 mb-6">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            isTransfer ? 'bg-emerald-500 border-emerald-500' : 'border-white/30 group-hover:border-white/50'
          }`}>
            {isTransfer && (
              <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <input
            type="checkbox"
            checked={isTransfer}
            onChange={(e) => setIsTransfer(e.target.checked)}
            className="hidden"
          />
          <span className="text-white/70 text-sm">Transfer Portal Athlete</span>
          <span className="text-emerald-400 text-xs">(+70% value)</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            hasAgent ? 'bg-emerald-500 border-emerald-500' : 'border-white/30 group-hover:border-white/50'
          }`}>
            {hasAgent && (
              <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <input
            type="checkbox"
            checked={hasAgent}
            onChange={(e) => setHasAgent(e.target.checked)}
            className="hidden"
          />
          <span className="text-white/70 text-sm">Agent Represented</span>
          <span className="text-emerald-400 text-xs">(+430% value)</span>
        </label>
      </div>

      {/* Calculate Button */}
      <button
        onClick={calculateValue}
        disabled={loading || !sport || !dealType || !school || !followerTier}
        className="w-full py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black rounded-xl font-semibold hover:from-emerald-300 hover:to-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Calculating...
          </span>
        ) : (
          'Calculate My NIL Value'
        )}
      </button>

      {/* Results */}
      {result && (
        <div className="mt-6 pt-6 border-t border-white/10">
          {/* School Info */}
          {result.schoolInfo && (
            <div className="mb-6 p-4 bg-black/20 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{result.schoolInfo.name}</p>
                  <p className="text-white/40 text-sm">{result.schoolInfo.conference}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getNILTierColor(result.schoolInfo.nilTier)}`}>
                  {result.schoolInfo.nilTier} NIL
                </span>
              </div>
            </div>
          )}

          {/* ANNUAL NIL VALUE - Primary Result */}
          <div className="mb-8 p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl">
            <div className="text-center">
              <p className="text-emerald-400 text-sm font-medium mb-2">Your Estimated Annual NIL Value</p>
              <div className="mb-4">
                <span className="text-5xl md:text-6xl font-bold text-white">{formatCurrency(result.annualValue.median)}</span>
                <span className="text-white/40 text-lg">/year</span>
              </div>
              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="text-white/50">Low: {formatCurrency(result.annualValue.low)}</span>
                <span className="text-white/20">|</span>
                <span className="text-white/50">High: {formatCurrency(result.annualValue.high)}</span>
              </div>
            </div>
          </div>

          {/* Per-Deal Value */}
          <div className="mb-6 p-4 bg-white/[0.03] border border-white/10 rounded-xl">
            <p className="text-white/40 text-xs mb-3 text-center">Per-Deal Estimate ({dealType})</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-lg text-white/50">{formatCurrency(result.estimation.low)}</span>
              <span className="text-white/30">-</span>
              <span className="text-2xl font-bold text-white">{formatCurrency(result.estimation.median)}</span>
              <span className="text-white/30">-</span>
              <span className="text-lg text-white/50">{formatCurrency(result.estimation.high)}</span>
            </div>
          </div>

          {/* Sport Ceiling */}
          <div className="mb-6 p-4 bg-white/5 rounded-xl text-center">
            <p className="text-white/40 text-xs mb-1">Top 25 Athletes in {sport} Average</p>
            <p className="text-xl font-bold text-white">{formatCurrency(result.estimation.ceiling)}<span className="text-white/40 text-sm">/year</span></p>
          </div>

          {/* Multipliers Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-black/20 rounded-xl p-3 text-center">
              <p className="text-white/40 text-xs mb-1">School</p>
              <p className="text-lg font-bold text-white">{result.multipliers.school.toFixed(2)}x</p>
            </div>
            <div className="bg-black/20 rounded-xl p-3 text-center">
              <p className="text-white/40 text-xs mb-1">Followers</p>
              <p className="text-lg font-bold text-white">{result.multipliers.followers.toFixed(2)}x</p>
            </div>
            {result.multipliers.transfer > 1 && (
              <div className="bg-emerald-500/10 rounded-xl p-3 text-center">
                <p className="text-emerald-400/60 text-xs mb-1">Transfer</p>
                <p className="text-lg font-bold text-emerald-400">{result.multipliers.transfer.toFixed(1)}x</p>
              </div>
            )}
            {result.multipliers.agent > 1 && (
              <div className="bg-emerald-500/10 rounded-xl p-3 text-center">
                <p className="text-emerald-400/60 text-xs mb-1">Agent</p>
                <p className="text-lg font-bold text-emerald-400">{result.multipliers.agent.toFixed(1)}x</p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <p className="text-white/40 text-xs mb-1">Comparable Deals</p>
              <p className="text-xl font-bold text-white">{result.comparableDeals}+</p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <p className="text-white/40 text-xs mb-1">Confidence Level</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getConfidenceColor(result.confidence)}`}>
                {result.confidence.charAt(0).toUpperCase() + result.confidence.slice(1)}
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="mt-4 text-white/30 text-xs text-center">
            Based on On3 NIL Database, Opendorse NIL 3.0 Report, and 2025 influencer marketing benchmarks.
            Note: Average NIL = $53,643 but median = $3,371 — only 1% of athletes earn &gt;$50K.
            Athletes get 2.3x higher engagement than regular influencers.
          </p>
        </div>
      )}
    </div>
  )
}
