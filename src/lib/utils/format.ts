export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return '$0.00'
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num)
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

export function formatClassName(classYear: string): string {
  const map: Record<string, string> = {
    FR: 'Freshman',
    SO: 'Sophomore',
    JR: 'Junior',
    SR: 'Senior',
    GR: 'Graduate',
    RS_FR: 'Redshirt Freshman',
    RS_SO: 'Redshirt Sophomore',
    RS_JR: 'Redshirt Junior',
    RS_SR: 'Redshirt Senior',
  }
  return map[classYear] || classYear
}

export function formatDealType(dealType: string): string {
  const map: Record<string, string> = {
    SOCIAL_POST: 'Social Media Post',
    APPEARANCE: 'Personal Appearance',
    AUTOGRAPH: 'Autograph Session',
    CAMP: 'Camp/Clinic',
    LICENSING: 'Licensing',
    MERCHANDISE: 'Merchandise',
    OTHER: 'Other',
  }
  return map[dealType] || dealType
}

export function formatDealStatus(status: string): string {
  const map: Record<string, string> = {
    DRAFT: 'Draft',
    PENDING_REVIEW: 'Pending Review',
    ACTIVE: 'Active',
    COMPLETED: 'Completed',
    TERMINATED: 'Terminated',
    EXPIRED: 'Expired',
  }
  return map[status] || status
}

export function formatComplianceStatus(status: string): string {
  const map: Record<string, string> = {
    NOT_SUBMITTED: 'Not Submitted',
    PENDING: 'Pending Review',
    APPROVED: 'Approved',
    FLAGGED: 'Flagged',
    REJECTED: 'Rejected',
  }
  return map[status] || status
}
