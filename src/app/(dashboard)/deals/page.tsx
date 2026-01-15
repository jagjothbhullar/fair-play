import Link from 'next/link'
import { prisma } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate, formatDealStatus, formatDealType } from '@/lib/utils/format'

export default async function DealsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get athlete by supabase user id
  const athlete = await prisma.athlete.findFirst({
    where: { supabaseUserId: user?.id },
  })

  // Get deals for this athlete
  const deals = athlete
    ? await prisma.deal.findMany({
        where: { athleteId: athlete.id },
        orderBy: { createdAt: 'desc' },
        include: {
          brand: true,
          deliverables: true,
          payments: true,
        },
      })
    : []

  // Calculate stats
  const activeDeals = deals.filter(d => d.status === 'ACTIVE').length
  const totalEarnings = deals
    .filter(d => d.status === 'COMPLETED' || d.status === 'ACTIVE')
    .reduce((sum, d) => sum + (d.compensationTotalValue ? parseFloat(d.compensationTotalValue.toString()) : 0), 0)
  const pendingPayments = deals.reduce((sum, d) => {
    return sum + d.payments.filter(p => p.status === 'PENDING').length
  }, 0)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Deals</h1>
          <p className="text-slate-500">Manage and track all your NIL deals</p>
        </div>
        <Link
          href="/deals/new"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          + Add New Deal
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Active Deals" value={activeDeals.toString()} />
        <StatCard label="Total Earnings" value={formatCurrency(totalEarnings)} />
        <StatCard label="Pending Payments" value={pendingPayments.toString()} />
      </div>

      {/* Deals Table */}
      {deals.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">Deal</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">Type</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">Value</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">Compliance</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">Created</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => (
                <tr key={deal.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <Link href={`/deals/${deal.id}`} className="font-medium text-slate-900 hover:text-blue-500">
                      {deal.title}
                    </Link>
                    <div className="text-sm text-slate-500">
                      {deal.brand?.name || deal.brandNameOverride || 'Unknown brand'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {formatDealType(deal.dealType)}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {formatCurrency(deal.compensationTotalValue)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={deal.status} />
                  </td>
                  <td className="px-6 py-4">
                    <ComplianceBadge status={deal.complianceStatus} />
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {formatDate(deal.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="text-sm text-slate-500 mb-1">{label}</div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    DRAFT: 'bg-slate-100 text-slate-600',
    PENDING_REVIEW: 'bg-yellow-100 text-yellow-700',
    ACTIVE: 'bg-green-100 text-green-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
    TERMINATED: 'bg-red-100 text-red-700',
    EXPIRED: 'bg-slate-100 text-slate-600',
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.DRAFT}`}>
      {formatDealStatus(status)}
    </span>
  )
}

function ComplianceBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    NOT_SUBMITTED: 'bg-slate-100 text-slate-600',
    PENDING: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-green-100 text-green-700',
    FLAGGED: 'bg-orange-100 text-orange-700',
    REJECTED: 'bg-red-100 text-red-700',
  }

  const labels: Record<string, string> = {
    NOT_SUBMITTED: 'Not Submitted',
    PENDING: 'Pending',
    APPROVED: 'Approved',
    FLAGGED: 'Flagged',
    REJECTED: 'Rejected',
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.NOT_SUBMITTED}`}>
      {labels[status] || status}
    </span>
  )
}

function EmptyState() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
      <div className="text-4xl mb-4">📋</div>
      <h3 className="text-lg font-medium text-slate-900 mb-2">No deals yet</h3>
      <p className="text-slate-500 mb-6">
        Add your first NIL deal to start tracking your earnings and compliance.
      </p>
      <Link
        href="/deals/new"
        className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
      >
        + Add Your First Deal
      </Link>
    </div>
  )
}
