import Link from 'next/link'

export default function Home() {
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

      {/* Hero */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Your NIL deals.
            <br />
            <span className="text-blue-400">Your protection.</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            The athlete-first platform for managing NIL deals, staying compliant,
            and protecting your eligibility. Built for Bay Area student-athletes.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-blue-500 text-white rounded-lg font-semibold text-lg hover:bg-blue-600 transition-colors"
          >
            Get Started - It&apos;s Free
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <FeatureCard
            title="Deal Tracker"
            description="Manage all your NIL deals in one place. Track deliverables, payments, and deadlines."
            icon="📋"
          />
          <FeatureCard
            title="Compliance Checker"
            description="Instant checks against NCAA, state, and school-specific rules. Never risk your eligibility."
            icon="✅"
          />
          <FeatureCard
            title="Contract Scanner"
            description="AI-powered contract analysis. Spot red flags before you sign."
            icon="🔍"
          />
        </div>

        {/* Schools */}
        <div className="mt-20 text-center">
          <p className="text-slate-400 mb-6">Built for athletes at</p>
          <div className="flex flex-wrap justify-center gap-8">
            <SchoolBadge name="Stanford" color="bg-stanford" />
            <SchoolBadge name="Cal" color="bg-cal" />
            <SchoolBadge name="San Jose State" color="bg-sjsu" />
            <SchoolBadge name="Santa Clara" color="bg-santaclara" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-slate-400">
          <p>&copy; 2025 Fair Play. Level the playing field.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: string
}) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  )
}

function SchoolBadge({ name, color }: { name: string; color: string }) {
  return (
    <div className={`${color} px-4 py-2 rounded-lg text-white font-medium`}>
      {name}
    </div>
  )
}
