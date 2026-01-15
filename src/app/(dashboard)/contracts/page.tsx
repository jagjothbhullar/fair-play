'use client'

import { useState } from 'react'

interface RedFlag {
  name: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  excerpt: string
  explanation: string
  recommendation: string
}

interface SuggestedRedline {
  original: string
  revised: string
  explanation: string
  priority: 'must_change' | 'should_change' | 'consider'
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
  suggestedRedlines: SuggestedRedline[]
}

export default function ContractsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file')
  const [copiedAll, setCopiedAll] = useState(false)

  async function handleScan() {
    setError(null)
    setLoading(true)
    setResult(null)

    try {
      const formData = new FormData()

      if (inputMode === 'file' && file) {
        formData.append('file', file)
      } else if (inputMode === 'text' && text) {
        formData.append('text', text)
      } else {
        throw new Error('Please provide a file or paste contract text')
      }

      const response = await fetch('/api/contracts/scan', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to scan contract')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Contract Scanner</h1>
        <p className="text-slate-500">
          Upload a contract or paste the text to scan for red flags and get a plain-English summary.
        </p>
      </div>

      {/* Legal Disclaimer */}
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex gap-3">
          <span className="text-amber-600 text-lg flex-shrink-0">*</span>
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">This is not legal advice</p>
            <p>
              This tool is for educational purposes only and does not constitute legal advice.
              Results are based on common contract patterns and historical precedent in NIL deals.
              For binding legal matters, consult a licensed attorney.
            </p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        {/* Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setInputMode('file')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              inputMode === 'file'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setInputMode('text')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              inputMode === 'text'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Paste Text
          </button>
        </div>

        {inputMode === 'file' ? (
          <div>
            <label className="block">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <div className="text-4xl mb-2">📄</div>
                <p className="text-slate-600 mb-2">
                  {file ? file.name : 'Drop your contract here or click to browse'}
                </p>
                <p className="text-sm text-slate-400">PDF or TXT files supported</p>
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </div>
            </label>
          </div>
        ) : (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder="Paste your contract text here..."
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleScan}
          disabled={loading || (inputMode === 'file' ? !file : !text.trim())}
          className="mt-6 w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Scanning...' : 'Scan Contract'}
        </button>
      </div>

      {/* Loading State */}
      {loading && <LoadingState />}

      {/* Results Section */}
      {result && !loading && (
        <div className="space-y-6">
          {/* Overall Risk */}
          <div className={`rounded-xl p-6 ${getRiskBgColor(result.overallRisk)}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-slate-900">Overall Risk Level</h2>
                <p className="text-slate-600">{getRiskDescription(result.overallRisk)}</p>
              </div>
              <div className={`text-3xl font-bold ${getRiskTextColor(result.overallRisk)}`}>
                {result.overallRisk.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-medium text-slate-900 mb-3">Plain English Summary</h2>
            <p className="text-slate-600">{result.summary}</p>
          </div>

          {/* Red Flags */}
          {result.redFlags.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-medium text-slate-900 mb-4">
                Red Flags ({result.redFlags.length})
              </h2>
              <div className="space-y-4">
                {result.redFlags.map((flag, index) => (
                  <RedFlagCard key={index} flag={flag} />
                ))}
              </div>
            </div>
          )}

          {/* Key Terms */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-medium text-slate-900 mb-4">Key Terms</h2>
            <div className="grid gap-4">
              <KeyTerm label="Compensation" value={result.keyTerms.compensation} />
              <KeyTerm label="Duration" value={result.keyTerms.duration} />
              <KeyTerm label="Exclusivity" value={result.keyTerms.exclusivity} />
              <KeyTerm label="Termination Rights" value={result.keyTerms.terminationRights} />
              <KeyTerm label="Usage Rights" value={result.keyTerms.usageRights} />
            </div>
          </div>

          {/* Suggested Redlines */}
          {result.suggestedRedlines && result.suggestedRedlines.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-medium text-slate-900">
                    Suggested Redlines ({result.suggestedRedlines.length})
                  </h2>
                  <p className="text-sm text-slate-500">
                    Copy these changes and send back to the brand for negotiation
                  </p>
                </div>
                <button
                  onClick={() => {
                    copyAllRedlines(result.suggestedRedlines)
                    setCopiedAll(true)
                    setTimeout(() => setCopiedAll(false), 2000)
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    copiedAll
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  <span>{copiedAll ? 'Copied to Clipboard!' : 'Copy All Redlines'}</span>
                </button>
              </div>
              <div className="space-y-4">
                {result.suggestedRedlines.map((redline, index) => (
                  <RedlineCard key={index} redline={redline} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function RedFlagCard({ flag }: { flag: RedFlag }) {
  const severityColors: Record<string, string> = {
    critical: 'border-red-500 bg-red-50',
    high: 'border-orange-500 bg-orange-50',
    medium: 'border-yellow-500 bg-yellow-50',
    low: 'border-blue-500 bg-blue-50',
  }

  const severityBadgeColors: Record<string, string> = {
    critical: 'bg-red-500 text-white',
    high: 'bg-orange-500 text-white',
    medium: 'bg-yellow-500 text-white',
    low: 'bg-blue-500 text-white',
  }

  return (
    <div className={`border-l-4 ${severityColors[flag.severity]} rounded-r-lg p-4`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-slate-900">{flag.name}</h3>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${severityBadgeColors[flag.severity]}`}>
          {flag.severity.toUpperCase()}
        </span>
      </div>
      {flag.excerpt && (
        <div className="mb-2 p-2 bg-white/50 rounded text-sm text-slate-600 font-mono">
          &ldquo;{flag.excerpt}&rdquo;
        </div>
      )}
      <p className="text-sm text-slate-600 mb-2">{flag.explanation}</p>
      <div className="text-sm">
        <span className="font-medium text-slate-900">Recommendation:</span>{' '}
        <span className="text-slate-600">{flag.recommendation}</span>
      </div>
    </div>
  )
}

function KeyTerm({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex">
      <div className="w-40 font-medium text-slate-900">{label}</div>
      <div className="flex-1 text-slate-600">{value || 'Not specified'}</div>
    </div>
  )
}

function RedlineCard({ redline, index }: { redline: SuggestedRedline; index: number }) {
  const [copied, setCopied] = useState(false)

  const priorityConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    must_change: { label: 'MUST CHANGE', color: 'text-red-700', bgColor: 'bg-red-100' },
    should_change: { label: 'SHOULD CHANGE', color: 'text-orange-700', bgColor: 'bg-orange-100' },
    consider: { label: 'CONSIDER', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  }

  const config = priorityConfig[redline.priority] || priorityConfig.consider

  const copyRedline = async () => {
    const text = `ORIGINAL:\n${redline.original}\n\nREVISED:\n${redline.revised}\n\nREASON: ${redline.explanation}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500">#{index + 1}</span>
          <span className={`px-2 py-0.5 rounded text-xs font-bold ${config.bgColor} ${config.color}`}>
            {config.label}
          </span>
        </div>
        <button
          onClick={copyRedline}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Word-style Redline Content */}
      <div className="p-4 bg-white">
        {/* Track Changes Style Box */}
        <div className="font-serif text-base leading-relaxed border-l-4 border-slate-300 pl-4 py-2 bg-slate-50 rounded-r">
          {/* Original - Strikethrough in Red */}
          <span className="line-through text-red-600 bg-red-50 px-1 decoration-red-600 decoration-2">
            {redline.original}
          </span>
          {' '}
          {/* Revised - Underlined in Blue */}
          <span className="underline text-blue-700 bg-blue-50 px-1 decoration-blue-700 decoration-2">
            {redline.revised}
          </span>
        </div>

        {/* Explanation */}
        <div className="mt-3 text-sm text-slate-600 flex items-start gap-2">
          <span className="text-slate-400 mt-0.5">*</span>
          <span>{redline.explanation}</span>
        </div>
      </div>
    </div>
  )
}

function copyAllRedlines(redlines: SuggestedRedline[]) {
  const text = redlines.map((r, i) => {
    const priorityLabels: Record<string, string> = {
      must_change: 'MUST CHANGE',
      should_change: 'SHOULD CHANGE',
      consider: 'CONSIDER',
    }
    return `--- CHANGE ${i + 1} [${priorityLabels[r.priority] || 'CONSIDER'}] ---

ORIGINAL TEXT:
${r.original}

PROPOSED REVISION:
${r.revised}

REASON FOR CHANGE:
${r.explanation}
`
  }).join('\n\n')

  navigator.clipboard.writeText(text)
}

function getRiskBgColor(risk: string): string {
  const colors: Record<string, string> = {
    low: 'bg-green-50 border border-green-200',
    medium: 'bg-yellow-50 border border-yellow-200',
    high: 'bg-orange-50 border border-orange-200',
    critical: 'bg-red-50 border border-red-200',
  }
  return colors[risk] || colors.low
}

function getRiskTextColor(risk: string): string {
  const colors: Record<string, string> = {
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-orange-600',
    critical: 'text-red-600',
  }
  return colors[risk] || colors.low
}

function getRiskDescription(risk: string): string {
  const descriptions: Record<string, string> = {
    low: 'This contract looks reasonable. Review the terms before signing.',
    medium: 'Some concerns detected. Review the flagged items carefully.',
    high: 'Multiple concerning terms found. Consider negotiating or seeking legal advice.',
    critical: 'Serious red flags detected. Do not sign without legal review.',
  }
  return descriptions[risk] || descriptions.low
}

function LoadingState() {
  return (
    <div className="space-y-6">
      {/* Scanning Animation */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8">
        <div className="flex flex-col items-center text-center">
          {/* Animated Icon */}
          <div className="relative mb-4">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">📄</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Analyzing Your Contract
          </h3>
          <p className="text-slate-600 mb-4 max-w-md">
            Our AI is reviewing the contract for red flags, extracting key terms, and preparing a plain-English summary.
          </p>

          {/* Progress Steps */}
          <div className="flex items-center gap-3 text-sm">
            <Step label="Reading" done />
            <StepConnector />
            <Step label="Analyzing" active />
            <StepConnector />
            <Step label="Summarizing" />
          </div>
        </div>
      </div>

      {/* Skeleton Cards */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
        <div className="h-5 bg-slate-200 rounded w-32 mb-4"></div>
        <div className="h-4 bg-slate-100 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-100 rounded w-3/4"></div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
        <div className="h-5 bg-slate-200 rounded w-24 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-slate-100 rounded"></div>
          <div className="h-20 bg-slate-100 rounded"></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
        <div className="h-5 bg-slate-200 rounded w-28 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-100 rounded w-full"></div>
          <div className="h-4 bg-slate-100 rounded w-full"></div>
          <div className="h-4 bg-slate-100 rounded w-full"></div>
        </div>
      </div>
    </div>
  )
}

function Step({ label, done, active }: { label: string; done?: boolean; active?: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 ${
      done ? 'text-green-600' : active ? 'text-blue-600' : 'text-slate-400'
    }`}>
      {done ? (
        <span className="text-green-500">✓</span>
      ) : active ? (
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
      ) : (
        <span className="w-2 h-2 bg-slate-300 rounded-full"></span>
      )}
      <span className={`font-medium ${active ? 'text-blue-600' : ''}`}>{label}</span>
    </div>
  )
}

function StepConnector() {
  return <div className="w-8 h-px bg-slate-300"></div>
}
