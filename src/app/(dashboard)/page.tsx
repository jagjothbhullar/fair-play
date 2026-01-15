'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface QuickStats {
  total: number
  schools: number
  sports: number
  totalNILValue: number
  eliteAthletes: number
  transfers: number
  withAgents: number
}

interface RecentScan {
  id: string
  fileName: string
  riskScore: number
  createdAt: string
}

export default function DashboardHome() {
  const [user, setUser] = useState<User | null>(null)
  const [athleteStats, setAthleteStats] = useState<QuickStats | null>(null)
  const [recentScans, setRecentScans] = useState<RecentScan[]>([])
  const [scanCount, setScanCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      // Get user
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      // Get athlete stats
      try {
        const statsRes = await fetch('/api/athletes?stats=quick')
        const stats = await statsRes.json()
        setAthleteStats(stats)
      } catch (e) {
        console.error('Failed to fetch athlete stats:', e)
      }

      // Get recent scans
      if (user) {
        try {
          const scansRes = await fetch('/api/scans?limit=5')
          const scansData = await scansRes.json()
          setRecentScans(scansData.scans || [])
          setScanCount(scansData.total || 0)
        } catch (e) {
          console.error('Failed to fetch scans:', e)
        }
      }

      setLoading(false)
    }

    loadData()
  }, [supabase.auth])

  const formatCurrency = (value: number): string => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`
    return `$${value.toLocaleString()}`
  }

  const getRiskColor = (score: number): string => {
    if (score >= 70) return 'text-red-400 bg-red-500/10'
    if (score >= 40) return 'text-yellow-400 bg-yellow-500/10'
    return 'text-emerald-400 bg-emerald-500/10'
  }

  const getRiskLabel = (score: number): string => {
    if (score >= 70) return 'High Risk'
    if (score >= 40) return 'Medium Risk'
    return 'Low Risk'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}
        </h1>
        <p className="text-white/50">Your NIL command center</p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Scan Contract */}
        <Link
          href="/"
          className="group bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/40 transition-all"
        >
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/30 transition-colors">
            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Scan Contract</h3>
          <p className="text-white/50 text-sm">AI-powered contract analysis</p>
        </Link>

        {/* NIL Market */}
        <Link
          href="/market"
          className="group bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all"
        >
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">NIL Market</h3>
          <p className="text-white/50 text-sm">Browse athlete valuations</p>
        </Link>

        {/* Water Cooler */}
        <Link
          href="/water-cooler"
          className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-all"
        >
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Water Cooler</h3>
          <p className="text-white/50 text-sm">Community discussions</p>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Athlete Database Stats */}
        {athleteStats && (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">California D1 Database</h2>
              <Link href="/market" className="text-sm text-emerald-400 hover:text-emerald-300">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">{athleteStats.total.toLocaleString()}</p>
                <p className="text-xs text-white/40">Athletes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{athleteStats.schools}</p>
                <p className="text-xs text-white/40">Schools</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{athleteStats.sports}</p>
                <p className="text-xs text-white/40">Sports</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">{formatCurrency(athleteStats.totalNILValue)}</p>
                <p className="text-xs text-white/40">Total NIL Value</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-sm">
              <span className="text-white/50">
                <span className="text-purple-400 font-medium">{athleteStats.eliteAthletes}</span> elite athletes
              </span>
              <span className="text-white/50">
                <span className="text-blue-400 font-medium">{athleteStats.transfers}</span> transfers
              </span>
              <span className="text-white/50">
                <span className="text-teal-400 font-medium">{athleteStats.withAgents}</span> with agents
              </span>
            </div>
          </div>
        )}

        {/* Recent Scans */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Scans</h2>
            <Link href="/scans" className="text-sm text-emerald-400 hover:text-emerald-300">
              View all ({scanCount}) →
            </Link>
          </div>
          {recentScans.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-white/50 text-sm mb-4">No contracts scanned yet</p>
              <Link
                href="/"
                className="inline-flex px-4 py-2 bg-emerald-500 text-black rounded-lg text-sm font-medium hover:bg-emerald-400 transition-colors"
              >
                Scan your first contract
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentScans.map((scan) => (
                <Link
                  key={scan.id}
                  href={`/scans/${scan.id}`}
                  className="flex items-center justify-between p-3 bg-black/20 rounded-xl hover:bg-black/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">{scan.fileName}</p>
                      <p className="text-white/40 text-xs">
                        {new Date(scan.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(scan.riskScore)}`}>
                    {getRiskLabel(scan.riskScore)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/deals"
          className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:border-white/20 transition-colors"
        >
          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-medium">My Deals</p>
            <p className="text-white/40 text-xs">Track your NIL deals</p>
          </div>
        </Link>

        <Link
          href="/contracts"
          className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:border-white/20 transition-colors"
        >
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-medium">Contracts</p>
            <p className="text-white/40 text-xs">Manage documents</p>
          </div>
        </Link>

        <Link
          href="/compliance"
          className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:border-white/20 transition-colors"
        >
          <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-medium">Compliance</p>
            <p className="text-white/40 text-xs">Stay NCAA compliant</p>
          </div>
        </Link>

        <Link
          href="/profile"
          className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:border-white/20 transition-colors"
        >
          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-medium">Profile</p>
            <p className="text-white/40 text-xs">Your NIL profile</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
