import { prisma } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatDate } from '@/lib/utils/format'

export default async function CompliancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const athlete = await prisma.athlete.findFirst({
    where: { supabaseUserId: user?.id },
    include: { school: true },
  })

  // Get school-specific rules
  const schoolRules = athlete
    ? await prisma.complianceRule.findMany({
        where: {
          OR: [
            { scope: 'SCHOOL', schoolId: athlete.schoolId },
            { scope: 'NCAA' },
            { scope: 'STATE', stateCode: 'CA' },
          ],
          isActive: true,
        },
        orderBy: [{ scope: 'asc' }, { severity: 'desc' }],
      })
    : []

  // Get deals needing disclosure
  const dealsNeedingDisclosure = athlete
    ? await prisma.deal.findMany({
        where: {
          athleteId: athlete.id,
          requiresNcaaDisclosure: true,
          disclosedToNcaaAt: null,
          status: { not: 'DRAFT' },
        },
      })
    : []

  // Group rules by scope
  const ncaaRules = schoolRules.filter(r => r.scope === 'NCAA')
  const stateRules = schoolRules.filter(r => r.scope === 'STATE')
  const schoolSpecificRules = schoolRules.filter(r => r.scope === 'SCHOOL')

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Compliance Center</h1>
        <p className="text-slate-500">
          Stay eligible by understanding and following these rules.
        </p>
      </div>

      {/* Pending Disclosures Alert */}
      {dealsNeedingDisclosure.length > 0 && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
          <h2 className="font-medium text-red-800 mb-2">
            Action Required: {dealsNeedingDisclosure.length} deal(s) need NCAA disclosure
          </h2>
          <p className="text-red-700 text-sm mb-3">
            Deals worth $600+ must be reported to NIL Go within 5 business days.
            Failure to disclose can result in immediate ineligibility.
          </p>
          <div className="space-y-2">
            {dealsNeedingDisclosure.map((deal) => (
              <div key={deal.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                <div>
                  <span className="font-medium text-slate-900">{deal.title}</span>
                  <span className="text-slate-500 text-sm ml-2">
                    Created {formatDate(deal.createdAt)}
                  </span>
                </div>
                <Link
                  href={`/deals/${deal.id}`}
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  Disclose Now →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Your School */}
      {athlete?.school && (
        <div className="mb-8 p-6 bg-white rounded-xl border border-slate-200">
          <h2 className="text-lg font-medium text-slate-900 mb-4">Your School</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-900">{athlete.school.name}</div>
              <div className="text-slate-500 text-sm">
                Conference: {athlete.school.conferenceId} • Platform: {athlete.school.compliancePlatform || 'N/A'}
              </div>
            </div>
            {athlete.school.nilPolicyUrl && (
              <a
                href={athlete.school.nilPolicyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                View NIL Policy →
              </a>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Pre-approval required:</span>{' '}
              <span className={athlete.school.requiresPreApproval ? 'text-red-600 font-medium' : 'text-green-600'}>
                {athlete.school.requiresPreApproval ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Disclosure deadline:</span>{' '}
              <span className="text-slate-900">{athlete.school.disclosureDeadlineDays} business days</span>
            </div>
          </div>
        </div>
      )}

      {/* Rules Sections */}
      <div className="space-y-8">
        {/* NCAA Rules */}
        <RulesSection
          title="NCAA Rules"
          description="These rules apply to all Division I student-athletes."
          rules={ncaaRules}
          color="blue"
        />

        {/* California State Rules */}
        <RulesSection
          title="California State Law"
          description="California-specific NIL regulations under SB 26."
          rules={stateRules}
          color="yellow"
        />

        {/* School-Specific Rules */}
        {schoolSpecificRules.length > 0 && (
          <RulesSection
            title={`${athlete?.school?.shortName || 'School'} Specific Rules`}
            description="Additional rules specific to your institution."
            rules={schoolSpecificRules}
            color="purple"
          />
        )}
      </div>

      {/* Quick Tips */}
      <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
        <h2 className="text-lg font-medium text-slate-900 mb-4">Quick Compliance Tips</h2>
        <ul className="space-y-3 text-slate-600">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Always disclose deals to your school&apos;s compliance office before signing</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Report deals over $600 to NIL Go within 5 business days</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Never accept pay tied to athletic performance (no per-touchdown bonuses)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Don&apos;t use school logos, marks, or facilities without written approval</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Include #ad or #sponsored disclosure on all sponsored social posts</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

interface Rule {
  id: string
  title: string
  description: string
  severity: string
}

function RulesSection({
  title,
  description,
  rules,
  color,
}: {
  title: string
  description: string
  rules: Rule[]
  color: 'blue' | 'yellow' | 'purple'
}) {
  const colors = {
    blue: 'bg-blue-50 border-blue-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    purple: 'bg-purple-50 border-purple-200',
  }

  const headerColors = {
    blue: 'text-blue-900',
    yellow: 'text-yellow-900',
    purple: 'text-purple-900',
  }

  if (rules.length === 0) return null

  return (
    <div className={`rounded-xl border ${colors[color]} overflow-hidden`}>
      <div className="p-4 border-b border-inherit">
        <h2 className={`text-lg font-medium ${headerColors[color]}`}>{title}</h2>
        <p className="text-slate-600 text-sm">{description}</p>
      </div>
      <div className="divide-y divide-inherit">
        {rules.map((rule) => (
          <div key={rule.id} className="p-4 bg-white/50">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-slate-900">{rule.title}</h3>
                <p className="text-slate-600 text-sm mt-1">{rule.description}</p>
              </div>
              <SeverityBadge severity={rule.severity} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    ERROR: 'bg-red-100 text-red-700',
    WARNING: 'bg-yellow-100 text-yellow-700',
    INFO: 'bg-blue-100 text-blue-700',
  }

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[severity] || colors.INFO}`}>
      {severity === 'ERROR' ? 'Required' : severity === 'WARNING' ? 'Important' : 'Info'}
    </span>
  )
}
