import { prisma } from '@/lib/db'
import type { Deal, Athlete, ComplianceRule, ComplianceCheckStatus } from '@prisma/client'

export interface ComplianceCheckResult {
  ruleId: string
  ruleCode: string
  title: string
  status: ComplianceCheckStatus
  message: string
  severity: 'ERROR' | 'WARNING' | 'INFO'
}

export interface ComplianceReport {
  dealId: string
  athleteId: string
  overallStatus: 'PASS' | 'FAIL' | 'WARNING'
  checks: ComplianceCheckResult[]
  requiresNcaaDisclosure: boolean
  requiresSchoolDisclosure: boolean
  disclosureDeadline: Date | null
}

export async function runComplianceChecks(
  deal: Deal & { athlete: Athlete }
): Promise<ComplianceReport> {
  const checks: ComplianceCheckResult[] = []

  // Get all applicable rules
  const rules = await prisma.complianceRule.findMany({
    where: {
      isActive: true,
      OR: [
        { scope: 'NCAA' },
        { scope: 'STATE', stateCode: 'CA' }, // Hardcoded for now, all 4 schools are in CA
        { scope: 'SCHOOL', schoolId: deal.athlete.schoolId },
      ],
    },
  })

  for (const rule of rules) {
    const result = await evaluateRule(rule, deal)
    checks.push(result)
  }

  // Determine overall status
  const hasError = checks.some(c => c.status === 'FAIL')
  const hasWarning = checks.some(c => c.status === 'WARNING')

  const overallStatus = hasError ? 'FAIL' : hasWarning ? 'WARNING' : 'PASS'

  // Calculate disclosure requirements
  const compensationValue = deal.compensationTotalValue
    ? parseFloat(deal.compensationTotalValue.toString())
    : 0
  const requiresNcaaDisclosure = compensationValue >= 600

  // Calculate deadline (5 business days from deal creation)
  const disclosureDeadline = requiresNcaaDisclosure
    ? addBusinessDays(deal.createdAt, 5)
    : null

  return {
    dealId: deal.id,
    athleteId: deal.athleteId,
    overallStatus,
    checks,
    requiresNcaaDisclosure,
    requiresSchoolDisclosure: true, // Always required in CA
    disclosureDeadline,
  }
}

async function evaluateRule(
  rule: ComplianceRule,
  deal: Deal & { athlete: Athlete }
): Promise<ComplianceCheckResult> {
  const checkLogic = rule.checkLogic as Record<string, unknown>

  let status: ComplianceCheckStatus = 'PASS'
  let message = ''

  switch (checkLogic.type) {
    case 'threshold': {
      const field = checkLogic.field as string
      const operator = checkLogic.operator as string
      const threshold = checkLogic.value as number

      let value = 0
      if (field === 'compensationTotalValue' && deal.compensationTotalValue) {
        value = parseFloat(deal.compensationTotalValue.toString())
      }

      const exceeded = operator === '>=' ? value >= threshold : value > threshold

      if (exceeded) {
        status = 'WARNING'
        message = `Deal value ($${value}) exceeds $${threshold} threshold. NCAA disclosure required within 5 business days.`
      } else {
        message = `Deal value ($${value}) is below $${threshold} threshold.`
      }
      break
    }

    case 'athlete_check': {
      const field = checkLogic.field as string
      const expectedValue = checkLogic.value as boolean

      if (field === 'isInternationalStudent' && deal.athlete.isInternationalStudent === expectedValue) {
        status = 'WARNING'
        message = 'International students face additional NIL restrictions under federal visa regulations. Consult with your school\'s international student office.'
      } else {
        message = 'No international student restrictions apply.'
      }
      break
    }

    case 'boolean_check': {
      // These require user input - mark as needs review
      status = 'NEEDS_REVIEW'
      message = checkLogic.question as string
      break
    }

    case 'required_action': {
      if (checkLogic.action === 'require_pre_approval') {
        status = 'WARNING'
        message = 'Your school requires pre-approval for all NIL deals. Submit to compliance before signing.'
      }
      break
    }

    case 'deadline': {
      const days = checkLogic.days as number
      const deadline = addBusinessDays(deal.createdAt, days)
      const now = new Date()

      if (now > deadline) {
        status = 'FAIL'
        message = `Disclosure deadline has passed (was ${formatDate(deadline)}). Disclose immediately to avoid eligibility issues.`
      } else {
        const daysRemaining = getBusinessDaysBetween(now, deadline)
        status = daysRemaining <= 2 ? 'WARNING' : 'PASS'
        message = `Disclosure due by ${formatDate(deadline)} (${daysRemaining} business days remaining).`
      }
      break
    }

    case 'required_disclosure': {
      if (!deal.disclosedToSchoolAt) {
        status = 'WARNING'
        message = 'This deal must be disclosed to your school\'s compliance office.'
      } else {
        message = `Disclosed to school on ${formatDate(deal.disclosedToSchoolAt)}.`
      }
      break
    }

    default:
      message = 'Rule evaluation not implemented.'
  }

  return {
    ruleId: rule.id,
    ruleCode: rule.ruleCode,
    title: rule.title,
    status,
    message,
    severity: rule.severity,
  }
}

// Helper functions
function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date)
  let added = 0

  while (added < days) {
    result.setDate(result.getDate() + 1)
    const dayOfWeek = result.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      added++
    }
  }

  return result
}

function getBusinessDaysBetween(start: Date, end: Date): number {
  let count = 0
  const current = new Date(start)

  while (current < end) {
    current.setDate(current.getDate() + 1)
    const dayOfWeek = current.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++
    }
  }

  return count
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
