'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface RedFlag {
  name: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  excerpt: string
  explanation: string
  recommendation: string
}

interface KeyTerms {
  compensation: string | null
  duration: string | null
  exclusivity: string | null
  terminationRights: string | null
  usageRights: string | null
}

interface ScanHistoryItem {
  id: string
  fileName: string | null
  inputType: string
  pageCount: number | null
  summary: string
  overallRisk: string
  redFlagsCount: number
  redFlags: RedFlag[] | null
  keyTerms: KeyTerms | null
  createdAt: string
}

export default function ScansPage() {
  const [scans, setScans] = useState<ScanHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedScan, setExpandedScan] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
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

  function getSeverityColor(severity: string) {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20'
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20'
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'low': return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      default: return 'text-white/50 bg-white/5 border-white/10'
    }
  }

  function getRiskMeterFill(currentRisk: string, level: string): boolean {
    const order = ['low', 'medium', 'high', 'critical']
    const currentIndex = order.indexOf(currentRisk.toLowerCase())
    const levelIndex = order.indexOf(level)
    return levelIndex <= currentIndex
  }

  function getRiskMeterColor(risk: string): string {
    const colors: Record<string, string> = {
      low: 'bg-emerald-500',
      medium: 'bg-yellow-500',
      high: 'bg-orange-500',
      critical: 'bg-red-500',
    }
    return colors[risk.toLowerCase()] || colors.medium
  }

  function sortRedFlagsBySeverity(flags: RedFlag[]): RedFlag[] {
    const severityOrder: Record<string, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    }
    return [...flags].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
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
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
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
                <div className="px-6 pb-6 border-t border-white/10 pt-6 space-y-6">
                  {/* Risk Meter + Summary Combined */}
                  <div className={`rounded-xl p-6 ${getRiskColor(scan.overallRisk)}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-white/50 mb-1">Risk Assessment</p>
                        <h4 className="text-xl font-bold">
                          {scan.overallRisk.charAt(0).toUpperCase() + scan.overallRisk.slice(1)} Risk
                        </h4>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-1">
                          {['low', 'medium', 'high', 'critical'].map((level) => (
                            <div
                              key={level}
                              className={`w-6 h-6 rounded transition-all ${
                                getRiskMeterFill(scan.overallRisk, level)
                                  ? getRiskMeterColor(scan.overallRisk)
                                  : 'bg-white/10'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-white/40">
                          {scan.redFlagsCount} issue{scan.redFlagsCount !== 1 ? 's' : ''} found
                        </span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-white/70 leading-relaxed">{scan.summary}</p>
                    </div>
                  </div>

                  {/* Key Terms */}
                  {scan.keyTerms && (
                    <div>
                      <h4 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">Key Terms</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {scan.keyTerms.compensation && (
                          <div className="bg-white/[0.03] rounded-xl p-4">
                            <p className="text-xs text-white/40 mb-1">Compensation</p>
                            <p className="text-white font-medium">{scan.keyTerms.compensation}</p>
                          </div>
                        )}
                        {scan.keyTerms.duration && (
                          <div className="bg-white/[0.03] rounded-xl p-4">
                            <p className="text-xs text-white/40 mb-1">Duration</p>
                            <p className="text-white font-medium">{scan.keyTerms.duration}</p>
                          </div>
                        )}
                        {scan.keyTerms.exclusivity && (
                          <div className="bg-white/[0.03] rounded-xl p-4">
                            <p className="text-xs text-white/40 mb-1">Exclusivity</p>
                            <p className="text-white font-medium">{scan.keyTerms.exclusivity}</p>
                          </div>
                        )}
                        {scan.keyTerms.terminationRights && (
                          <div className="bg-white/[0.03] rounded-xl p-4">
                            <p className="text-xs text-white/40 mb-1">Termination Rights</p>
                            <p className="text-white font-medium">{scan.keyTerms.terminationRights}</p>
                          </div>
                        )}
                        {scan.keyTerms.usageRights && (
                          <div className="bg-white/[0.03] rounded-xl p-4 md:col-span-2">
                            <p className="text-xs text-white/40 mb-1">Usage Rights</p>
                            <p className="text-white font-medium">{scan.keyTerms.usageRights}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Red Flags */}
                  {scan.redFlags && scan.redFlags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">
                        Issues to Address ({scan.redFlags.length})
                      </h4>
                      <div className="space-y-3">
                        {sortRedFlagsBySeverity(scan.redFlags).map((flag, index) => (
                          <div
                            key={index}
                            className={`rounded-xl p-4 border ${getSeverityColor(flag.severity)}`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h5 className="font-medium">{flag.name}</h5>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(flag.severity)}`}>
                                {flag.severity.charAt(0).toUpperCase() + flag.severity.slice(1)}
                              </span>
                            </div>
                            {flag.excerpt && (
                              <div className="bg-black/20 rounded-lg p-3 mb-3">
                                <p className="text-sm text-white/60 italic">&quot;{flag.excerpt}&quot;</p>
                              </div>
                            )}
                            <p className="text-sm text-white/70 mb-2">{flag.explanation}</p>
                            <div className="flex items-start gap-2">
                              <span className="text-emerald-400 text-xs font-medium mt-0.5">Recommendation:</span>
                              <p className="text-sm text-emerald-400/80">{flag.recommendation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <p className="text-xs text-white/30">Scan ID: {scan.id}</p>
                    <Link
                      href="/"
                      className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Scan another contract →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
