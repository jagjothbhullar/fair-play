'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface ScanHistoryItem {
  id: string
  fileName: string | null
  inputType: string
  pageCount: number | null
  summary: string
  overallRisk: string
  redFlagsCount: number
  createdAt: string
}

export default function ScansPage() {
  const [user, setUser] = useState<User | null>(null)
  const [scans, setScans] = useState<ScanHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedScan, setExpandedScan] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const response = await fetch(`/api/scans?userId=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          setScans(data.scans)
        }
      }
      setLoading(false)
    }
    loadData()
  }, [supabase.auth])

  function getRiskColor(risk: string) {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/20'
      default: return 'text-white/50 bg-white/5 border-white/10'
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sign in to view your scans</h1>
          <Link href="/" className="text-emerald-400 hover:text-emerald-300">
            Go to homepage
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
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
            <Link href="/market" className="text-sm text-white/70 hover:text-white transition-colors">
              NIL Market
            </Link>
            <Link href="/water-cooler" className="text-sm text-white/70 hover:text-white transition-colors">
              Water Cooler
            </Link>
            <span className="text-sm text-emerald-400 font-medium">
              My Scans
            </span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Scans</h1>
          <p className="text-white/50">Your contract analysis history</p>
        </div>

        {scans.length === 0 ? (
          <div className="text-center py-16 bg-white/[0.02] border border-white/10 rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">No scans yet</h3>
            <p className="text-white/40 mb-6">Scan your first contract to see it here</p>
            <Link
              href="/"
              className="inline-flex px-6 py-3 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black rounded-xl font-semibold hover:from-emerald-300 hover:to-emerald-400 transition-all"
            >
              Scan a Contract
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {scans.map((scan) => (
              <div
                key={scan.id}
                className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors"
              >
                <button
                  onClick={() => setExpandedScan(expandedScan === scan.id ? null : scan.id)}
                  className="w-full p-6 text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(scan.overallRisk)}`}>
                          {scan.overallRisk.charAt(0).toUpperCase() + scan.overallRisk.slice(1)} Risk
                        </span>
                        {scan.redFlagsCount > 0 && (
                          <span className="text-red-400 text-sm">
                            {scan.redFlagsCount} red flag{scan.redFlagsCount !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium text-white truncate">
                        {scan.fileName || 'Text input'}
                      </h3>
                      <p className="text-white/40 text-sm mt-1">
                        {formatDate(scan.createdAt)}
                        {scan.pageCount && ` • ${scan.pageCount} page${scan.pageCount !== 1 ? 's' : ''}`}
                      </p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-white/40 transition-transform ${expandedScan === scan.id ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {expandedScan === scan.id && (
                  <div className="px-6 pb-6 border-t border-white/10 pt-4">
                    <h4 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-2">Summary</h4>
                    <p className="text-white/70 leading-relaxed">{scan.summary}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
