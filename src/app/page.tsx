'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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

type PageState = 'scanner' | 'scanning' | 'results' | 'limit_reached'

export default function Home() {
  const [pageState, setPageState] = useState<PageState>('scanner')
  const [email, setEmail] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const [hasScanned, setHasScanned] = useState(false)

  // Check if user has already scanned
  useEffect(() => {
    const scanned = localStorage.getItem('fairplay_scanned')
    const storedEmail = localStorage.getItem('fairplay_email')
    if (scanned === 'true') {
      setHasScanned(true)
    }
    if (storedEmail) {
      setEmail(storedEmail)
    }
  }, [])

  async function handleScan() {
    // Check if already scanned
    if (hasScanned) {
      setPageState('limit_reached')
      return
    }

    if (!email || !email.includes('@')) {
      setError('Please enter your email to get your results')
      return
    }

    setError(null)
    setPageState('scanning')

    try {
      // Register the scan attempt
      const registerResponse = await fetch('/api/free-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, action: 'use' }),
      })
      const registerData = await registerResponse.json()

      if (registerData.error && registerResponse.status === 403) {
        setPageState('limit_reached')
        return
      }

      // Build form data for scan
      const formData = new FormData()
      if (inputMode === 'file' && file) {
        formData.append('file', file)
      } else if (inputMode === 'text' && text) {
        formData.append('text', text)
      } else {
        throw new Error('Please provide a contract to scan')
      }
      formData.append('email', email)

      // Perform the scan
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

      // Mark as scanned
      localStorage.setItem('fairplay_scanned', 'true')
      localStorage.setItem('fairplay_email', email)
      setHasScanned(true)

      setPageState('results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setPageState('scanner')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-white">Fair Play</div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Scan Your Contract
              <br />
              <span className="text-blue-400">In Seconds</span>
            </h1>
            <p className="text-lg text-slate-300">
              Upload any contract and get instant AI-powered analysis.
              <br />
              Spot red flags before you sign.
            </p>
          </div>

          {/* Scanner State */}
          {pageState === 'scanner' && (
            <div className="space-y-6">
              {/* Legal Disclaimer */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <div className="flex gap-3">
                  <span className="text-amber-400 flex-shrink-0">*</span>
                  <p className="text-sm text-amber-200">
                    <span className="font-medium">Not legal advice.</span>{' '}
                    For binding legal matters, consult a licensed attorney.
                  </p>
                </div>
              </div>

              {/* Scanner Card */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                {/* Email Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your email (to receive results)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Input Mode Toggle */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setInputMode('file')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      inputMode === 'file'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    onClick={() => setInputMode('text')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      inputMode === 'text'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    Paste Text
                  </button>
                </div>

                {/* File Upload or Text Input */}
                {inputMode === 'file' ? (
                  <label className="block">
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                      <div className="text-4xl mb-2">📄</div>
                      <p className="text-slate-300 mb-2">
                        {file ? file.name : 'Drop your contract here or click to browse'}
                      </p>
                      <p className="text-sm text-slate-500">PDF or TXT files</p>
                      <input
                        type="file"
                        accept=".pdf,.txt"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </div>
                  </label>
                ) : (
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={8}
                    placeholder="Paste your contract text here..."
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                {/* Error */}
                {error && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Scan Button */}
                <button
                  onClick={handleScan}
                  disabled={!email || (inputMode === 'file' ? !file : !text.trim())}
                  className="mt-6 w-full py-4 bg-blue-500 text-white rounded-lg font-semibold text-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Scan Contract Free
                </button>

                <p className="mt-4 text-center text-slate-500 text-sm">
                  1 free scan per email. No credit card required.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-6 text-slate-400 text-sm">
                <div className="flex items-center gap-2">
                  <span>🔒</span> Your data is encrypted
                </div>
                <div className="flex items-center gap-2">
                  <span>🤖</span> Powered by Claude AI
                </div>
                <div className="flex items-center gap-2">
                  <span>⚡</span> Results in ~30 seconds
                </div>
              </div>
            </div>
          )}

          {/* Scanning State */}
          {pageState === 'scanning' && <LoadingState />}

          {/* Limit Reached State */}
          {pageState === 'limit_reached' && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="text-xl font-semibold text-white mb-2">
                You&apos;ve used your free scan
              </h2>
              <p className="text-slate-400 mb-6">
                Create a free account to get unlimited scans and unlock all features.
              </p>

              <div className="space-y-3">
                <Link
                  href="/signup"
                  className="block w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/login"
                  className="block w-full py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600"
                >
                  Already have an account? Log in
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-700">
                <p className="text-slate-500 text-sm mb-4">With a free account you get:</p>
                <ul className="text-left text-slate-400 text-sm space-y-2 max-w-xs mx-auto">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Unlimited contract scans
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> AI-powered outreach messages
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Brand deal recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Compliance reminders
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Results State */}
          {pageState === 'results' && result && (
            <div className="space-y-6">
              {/* Success + CTA Banner */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-green-400">
                    Scan complete! Results sent to <span className="font-medium">{email}</span>
                  </p>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 whitespace-nowrap"
                  >
                    Get Unlimited Scans
                  </Link>
                </div>
              </div>

              {/* Overall Risk */}
              <div className={`rounded-xl p-6 ${getRiskBgColor(result.overallRisk)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-white">Overall Risk Level</h2>
                    <p className="text-slate-300">{getRiskDescription(result.overallRisk)}</p>
                  </div>
                  <div className={`text-3xl font-bold ${getRiskTextColor(result.overallRisk)}`}>
                    {result.overallRisk.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h2 className="text-lg font-medium text-white mb-3">Plain English Summary</h2>
                <p className="text-slate-300">{result.summary}</p>
              </div>

              {/* Red Flags */}
              {result.redFlags.length > 0 && (
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                  <h2 className="text-lg font-medium text-white mb-4">
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
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h2 className="text-lg font-medium text-white mb-4">Key Terms</h2>
                <div className="grid gap-4">
                  <KeyTerm label="Compensation" value={result.keyTerms.compensation} />
                  <KeyTerm label="Duration" value={result.keyTerms.duration} />
                  <KeyTerm label="Exclusivity" value={result.keyTerms.exclusivity} />
                  <KeyTerm label="Termination" value={result.keyTerms.terminationRights} />
                  <KeyTerm label="Usage Rights" value={result.keyTerms.usageRights} />
                </div>
              </div>

              {/* Suggested Redlines */}
              {result.suggestedRedlines && result.suggestedRedlines.length > 0 && (
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-medium text-white">
                        Suggested Redlines ({result.suggestedRedlines.length})
                      </h2>
                      <p className="text-sm text-slate-400">Copy and send back to the brand</p>
                    </div>
                    <button
                      onClick={() => {
                        copyAllRedlines(result.suggestedRedlines)
                        setCopiedAll(true)
                        setTimeout(() => setCopiedAll(false), 2000)
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        copiedAll
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {copiedAll ? 'Copied!' : 'Copy All'}
                    </button>
                  </div>
                  <div className="space-y-4">
                    {result.suggestedRedlines.map((redline, index) => (
                      <RedlineCard key={index} redline={redline} index={index} />
                    ))}
                  </div>
                </div>
              )}

              {/* Final CTA */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Need to scan more contracts?
                </h3>
                <p className="text-slate-400 mb-4">
                  Create a free account for unlimited scans and premium features.
                </p>
                <Link
                  href="/signup"
                  className="inline-block px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
                >
                  Create Free Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-slate-500 text-sm">
          <p>&copy; 2025 Fair Play. Level the playing field.</p>
        </div>
      </footer>
    </div>
  )
}

// Components
function RedFlagCard({ flag }: { flag: RedFlag }) {
  const severityColors: Record<string, string> = {
    critical: 'border-red-500 bg-red-500/10',
    high: 'border-orange-500 bg-orange-500/10',
    medium: 'border-yellow-500 bg-yellow-500/10',
    low: 'border-blue-500 bg-blue-500/10',
  }

  const severityBadgeColors: Record<string, string> = {
    critical: 'bg-red-500 text-white',
    high: 'bg-orange-500 text-white',
    medium: 'bg-yellow-500 text-black',
    low: 'bg-blue-500 text-white',
  }

  return (
    <div className={`border-l-4 ${severityColors[flag.severity]} rounded-r-lg p-4`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-white">{flag.name}</h3>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${severityBadgeColors[flag.severity]}`}>
          {flag.severity.toUpperCase()}
        </span>
      </div>
      {flag.excerpt && (
        <div className="mb-2 p-2 bg-slate-900/50 rounded text-sm text-slate-400 font-mono">
          &ldquo;{flag.excerpt}&rdquo;
        </div>
      )}
      <p className="text-sm text-slate-400 mb-2">{flag.explanation}</p>
      <div className="text-sm">
        <span className="font-medium text-slate-300">Recommendation:</span>{' '}
        <span className="text-slate-400">{flag.recommendation}</span>
      </div>
    </div>
  )
}

function KeyTerm({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex">
      <div className="w-32 font-medium text-slate-300">{label}</div>
      <div className="flex-1 text-slate-400">{value || 'Not specified'}</div>
    </div>
  )
}

function RedlineCard({ redline, index }: { redline: SuggestedRedline; index: number }) {
  const [copied, setCopied] = useState(false)

  const priorityConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    must_change: { label: 'MUST CHANGE', color: 'text-red-400', bgColor: 'bg-red-500/20' },
    should_change: { label: 'SHOULD CHANGE', color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
    consider: { label: 'CONSIDER', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  }

  const config = priorityConfig[redline.priority] || priorityConfig.consider

  const copyRedline = async () => {
    const text = `ORIGINAL:\n${redline.original}\n\nREVISED:\n${redline.revised}\n\nREASON: ${redline.explanation}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500">#{index + 1}</span>
          <span className={`px-2 py-0.5 rounded text-xs font-bold ${config.bgColor} ${config.color}`}>
            {config.label}
          </span>
        </div>
        <button
          onClick={copyRedline}
          className="text-sm text-blue-400 hover:text-blue-300 font-medium"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-4">
        <div className="font-serif text-base leading-relaxed border-l-4 border-slate-600 pl-4 py-2 bg-slate-900/30 rounded-r">
          <span className="line-through text-red-400 bg-red-500/10 px-1">{redline.original}</span>{' '}
          <span className="underline text-blue-400 bg-blue-500/10 px-1">{redline.revised}</span>
        </div>
        <p className="mt-3 text-sm text-slate-500">{redline.explanation}</p>
      </div>
    </div>
  )
}

function copyAllRedlines(redlines: SuggestedRedline[]) {
  const text = redlines.map((r, i) => {
    const labels: Record<string, string> = {
      must_change: 'MUST CHANGE',
      should_change: 'SHOULD CHANGE',
      consider: 'CONSIDER',
    }
    return `--- CHANGE ${i + 1} [${labels[r.priority] || 'CONSIDER'}] ---\n\nORIGINAL:\n${r.original}\n\nREVISED:\n${r.revised}\n\nREASON: ${r.explanation}`
  }).join('\n\n')
  navigator.clipboard.writeText(text)
}

function getRiskBgColor(risk: string): string {
  const colors: Record<string, string> = {
    low: 'bg-green-500/10 border border-green-500/20',
    medium: 'bg-yellow-500/10 border border-yellow-500/20',
    high: 'bg-orange-500/10 border border-orange-500/20',
    critical: 'bg-red-500/10 border border-red-500/20',
  }
  return colors[risk] || colors.low
}

function getRiskTextColor(risk: string): string {
  const colors: Record<string, string> = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-orange-400',
    critical: 'text-red-400',
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
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">📄</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Analyzing Your Contract</h3>
        <p className="text-slate-400 mb-4 max-w-md">
          Our AI is scanning for red flags, extracting key terms, and preparing your plain-English summary.
        </p>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-green-400">✓ Reading</span>
          <span className="w-8 h-px bg-slate-600"></span>
          <span className="text-blue-400 animate-pulse">● Analyzing</span>
          <span className="w-8 h-px bg-slate-600"></span>
          <span className="text-slate-500">○ Summarizing</span>
        </div>
      </div>
    </div>
  )
}
