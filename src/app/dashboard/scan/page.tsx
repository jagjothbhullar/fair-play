'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import AssistantChat from '@/components/AssistantChat'
import type { User } from '@supabase/supabase-js'

interface RedFlag {
  name: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  excerpt: string
  explanation: string
  recommendation: string
}

interface ScanResult {
  summary: string
  redFlags: RedFlag[]
  keyTerms: {
    compensation: string | null
    duration: string | null
    exclusivity: string | null
    terminationRights: string | null
    usageRights: string | null
  }
  overallRisk: 'low' | 'medium' | 'high' | 'critical'
}

type PageState = 'scanner' | 'scanning' | 'results'

export default function DashboardScanPage() {
  const [pageState, setPageState] = useState<PageState>('scanner')
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [user, setUser] = useState<User | null>(null)

  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [supabase.auth])

  async function handleScan() {
    setError(null)
    setPageState('scanning')

    try {
      const formData = new FormData()
      if (inputMode === 'file' && file) {
        formData.append('file', file)
      } else if (inputMode === 'text' && text) {
        formData.append('text', text)
      } else {
        throw new Error('Please provide a contract to scan')
      }

      if (user) {
        formData.append('authenticated', 'true')
        formData.append('userId', user.id)
        formData.append('email', user.email || '')
      }

      const response = await fetch('/api/scan', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to scan contract')
      }

      const data = await response.json()
      setResult(data)
      setPageState('results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setPageState('scanner')
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const maxSize = 10 * 1024 * 1024
      if (selectedFile.size > maxSize) {
        setError('File too large. Maximum size is 10MB.')
        return
      }
      setFile(selectedFile)
      setError(null)
    }
  }

  function getSeverityColor(severity: string) {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default: return 'bg-white/10 text-white/70 border-white/20'
    }
  }

  function getRiskColor(risk: string) {
    switch (risk) {
      case 'critical': return 'text-red-400'
      case 'high': return 'text-orange-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-emerald-400'
      default: return 'text-white/70'
    }
  }

  // Scanner State
  if (pageState === 'scanner') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Scan Contract</h1>
          <p className="text-white/50">Upload your NIL contract for AI-powered analysis</p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
          {/* Input Mode Toggle */}
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl mb-6">
            <button
              onClick={() => setInputMode('file')}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                inputMode === 'file'
                  ? 'bg-white text-black'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setInputMode('text')}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                inputMode === 'text'
                  ? 'bg-white text-black'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Paste Text
            </button>
          </div>

          {/* File Upload or Text Input */}
          {inputMode === 'file' ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/40 mb-3 uppercase tracking-wider">
                Contract File
              </label>
              <label className="block">
                <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  file
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                }`}>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                  />
                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-white font-medium">{file.name}</span>
                      <button
                        onClick={(e) => { e.preventDefault(); setFile(null) }}
                        className="text-white/40 hover:text-white"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg className="w-10 h-10 text-white/30 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-white/50 mb-1">Drop your contract here or click to browse</p>
                      <p className="text-white/30 text-sm">PDF, DOC, DOCX, or TXT (max 10MB)</p>
                    </>
                  )}
                </div>
              </label>
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/40 mb-3 uppercase tracking-wider">
                Contract Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your contract text here..."
                rows={10}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 focus:bg-white/[0.07] transition-all resize-none"
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleScan}
            disabled={inputMode === 'file' ? !file : !text.trim()}
            className="w-full py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black font-semibold rounded-xl hover:from-emerald-300 hover:to-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Analyze Contract
          </button>

          <p className="text-center text-white/30 text-sm mt-4">
            Unlimited scans with your account
          </p>

          {/* Scanner Disclaimer */}
          <div className="mt-6 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
            <p className="text-white/30 text-xs text-center leading-relaxed">
              This analysis is for educational purposes only and is not legal advice.
              Fair Play is not a law firm or licensed agent. Always consult a qualified
              attorney before signing any contract.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Scanning State
  if (pageState === 'scanning') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-12 text-center">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-emerald-400 rounded-full animate-spin" />
            <div className="absolute inset-3 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-3">Analyzing Your Contract</h2>
          <p className="text-white/50 mb-8">Our AI is reviewing every clause for potential issues...</p>
          <div className="flex justify-center gap-8 text-sm text-white/40">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Encrypted processing
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              No data stored
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Results State
  if (pageState === 'results' && result) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analysis Results</h1>
            <p className="text-white/50">Review the findings from your contract scan</p>
          </div>
          <button
            onClick={() => {
              setPageState('scanner')
              setFile(null)
              setText('')
              setResult(null)
            }}
            className="px-6 py-3 bg-emerald-500 text-black rounded-xl font-medium hover:bg-emerald-400 transition-colors"
          >
            Scan Another
          </button>
        </div>

        {/* Risk Overview */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm mb-1">Overall Risk Level</p>
              <p className={`text-2xl font-bold capitalize ${getRiskColor(result.overallRisk)}`}>
                {result.overallRisk} Risk
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-sm mb-1">Issues Found</p>
              <p className="text-2xl font-bold">{result.redFlags.length}</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Summary</h2>
          <p className="text-white/70 leading-relaxed">{result.summary}</p>
        </div>

        {/* Key Terms */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Key Terms</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(result.keyTerms).map(([key, value]) => (
              <div key={key} className="bg-white/5 rounded-xl p-4">
                <p className="text-white/40 text-sm mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-white font-medium">{value || 'Not specified'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Red Flags */}
        {result.redFlags.length > 0 && (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Issues Found</h2>
            <div className="space-y-4">
              {result.redFlags.map((flag, index) => (
                <div key={index} className={`border rounded-xl p-5 ${getSeverityColor(flag.severity)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold">{flag.name}</h3>
                    <span className="text-xs uppercase tracking-wider px-2 py-1 rounded-full bg-black/20">
                      {flag.severity}
                    </span>
                  </div>
                  {flag.excerpt && (
                    <div className="bg-black/20 rounded-lg p-3 mb-3 text-sm italic">
                      "{flag.excerpt}"
                    </div>
                  )}
                  <p className="text-sm mb-3 opacity-90">{flag.explanation}</p>
                  <div className="bg-black/20 rounded-lg p-3 text-sm">
                    <span className="font-medium">Recommendation:</span> {flag.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Assistant */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Ask Questions About Your Contract</h2>
          <AssistantChat scanContext={{
            summary: result.summary,
            overallRisk: result.overallRisk,
            redFlagsCount: result.redFlags.length
          }} />
        </div>

        {/* Results Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
          <p className="text-yellow-400/70 text-xs text-center leading-relaxed">
            <span className="font-medium">Important:</span> This analysis is AI-generated for educational purposes only.
            Fair Play is not a law firm, sports agent, or financial advisor. This is not legal advice.
            Always have contracts reviewed by a qualified attorney before signing.
          </p>
        </div>
      </div>
    )
  }

  return null
}
