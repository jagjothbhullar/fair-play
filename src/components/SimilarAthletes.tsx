'use client'

import { useState, useEffect } from 'react'
import type { CalculatorInputs } from './NILCalculator'

interface SyntheticAthlete {
  id: string
  sport: string
  schoolShortName: string
  conference: string
  followerCount: number
  performanceTier: string
  isTransfer: boolean
  hasAgent: boolean
  estimatedNILValue: {
    low: number
    median: number
    high: number
    annual: number
  }
  marketability: number
}

interface SimilarAthletesProps {
  inputs: CalculatorInputs | null
  visible: boolean
}

export default function SimilarAthletes({ inputs, visible }: SimilarAthletesProps) {
  const [athletes, setAthletes] = useState<SyntheticAthlete[]>([])
  const [loading, setLoading] = useState(false)
  const [totalMatching, setTotalMatching] = useState(0)

  useEffect(() => {
    if (!visible || !inputs?.sport) {
      setAthletes([])
      return
    }

    // Capture inputs for use in async function (TypeScript narrowing)
    const currentInputs = inputs

    async function fetchSimilarAthletes() {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          similar: 'true',
          sport: currentInputs.sport,
          limit: '5',
        })

        if (currentInputs.conferenceType) {
          params.set('conferenceType', currentInputs.conferenceType)
        }
        if (currentInputs.followerTier) {
          params.set('followerTier', currentInputs.followerTier)
        }

        const response = await fetch(`/api/athletes?${params}`)
        const data = await response.json()

        setAthletes(data.athletes || [])
        setTotalMatching(data.totalMatching || 0)
      } catch (error) {
        console.error('Failed to fetch similar athletes:', error)
        setAthletes([])
      } finally {
        setLoading(false)
      }
    }

    fetchSimilarAthletes()
  }, [inputs, visible])

  if (!visible) return null

  function formatCurrency(value: number): string {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`
    }
    return `$${value.toLocaleString()}`
  }

  function formatFollowers(count: number): string {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}k`
    }
    return count.toString()
  }

  function getPerformanceTierLabel(tier: string): string {
    const labels: Record<string, string> = {
      elite: 'Elite',
      all_conference: 'All-Conference',
      starter: 'Starter',
      rotation: 'Rotation',
      developing: 'Developing',
      walkon: 'Walk-on',
    }
    return labels[tier] || tier
  }

  function getSchoolTierLabel(schoolShortName: string): string {
    // Map school short names to tier labels for anonymization
    const powerFourSchools = ['USC', 'UCLA', 'Cal', 'Stanford']
    const groupOfFiveSchools = ['SDSU', 'Fresno State', 'San Jose State', 'UNLV']

    if (powerFourSchools.includes(schoolShortName)) {
      return 'Power 4 Program'
    }
    if (groupOfFiveSchools.includes(schoolShortName)) {
      return 'Group of 5 Program'
    }
    return 'D1 Program'
  }

  function getAnonymizedTitle(athlete: SyntheticAthlete): string {
    const sportName = athlete.sport.replace("Men's ", '').replace("Women's ", '')
    const prefix = athlete.sport.includes("Women's") ? "Women's" : athlete.sport.includes("Men's") ? "Men's" : ""
    return `${prefix} ${sportName} Athlete`.trim()
  }

  function getAnonymizedId(id: string): string {
    const num = id.split('-').pop() || '0000'
    return `#${num}`
  }

  return (
    <div className="mt-8 pt-8 border-t border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Similar Athletes</h3>
          <p className="text-white/50 text-sm">
            Athletes with comparable profiles to help you benchmark
          </p>
        </div>
        {totalMatching > 0 && (
          <span className="text-white/40 text-sm">
            {totalMatching} matches found
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full" />
        </div>
      ) : athletes.length === 0 ? (
        <div className="text-center py-8 bg-white/[0.02] rounded-xl border border-white/10">
          <p className="text-white/40">No similar athletes found for your profile</p>
          <p className="text-white/30 text-sm mt-1">Try adjusting your inputs for more matches</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {athletes.map((athlete) => (
            <div
              key={athlete.id}
              className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-white">
                      {getAnonymizedTitle(athlete)} {getAnonymizedId(athlete.id)}
                    </h4>
                    {athlete.isTransfer && (
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                        Transfer
                      </span>
                    )}
                    {athlete.hasAgent && (
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                        Agent
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-white/50">
                    <span>{getSchoolTierLabel(athlete.schoolShortName)}</span>
                    <span className="text-white/20">|</span>
                    <span>{getPerformanceTierLabel(athlete.performanceTier)}</span>
                    <span className="text-white/20">|</span>
                    <span>{formatFollowers(athlete.followerCount)} followers</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40 mb-1">Est. NIL Value</p>
                  <p className="text-xl font-bold text-emerald-400">
                    {formatCurrency(athlete.estimatedNILValue.median)}
                  </p>
                  <p className="text-xs text-white/30">
                    {formatCurrency(athlete.estimatedNILValue.low)} - {formatCurrency(athlete.estimatedNILValue.high)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-white/30 text-xs text-center">
        Athlete data is anonymized. Values are estimates based on publicly available NIL data.
      </p>
    </div>
  )
}
