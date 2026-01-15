import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '@/lib/db'

export interface RedFlag {
  name: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  excerpt: string
  explanation: string
  recommendation: string
}

export interface SuggestedRedline {
  original: string
  revised: string
  explanation: string
  priority: 'must_change' | 'should_change' | 'consider'
}

export interface ContractScanResult {
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

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface AthleteContext {
  school: string
  shortName: string
  conference: string
  sport: string
  state: string
  isInternationalStudent: boolean
  schoolRules: { title: string; description: string }[]
}

export async function scanContract(
  contractText: string,
  athleteContext?: AthleteContext | null
): Promise<ContractScanResult> {
  // First, check against our database patterns
  const dbRedFlags = await checkDatabasePatterns(contractText)

  // Then, use Claude for deeper analysis with athlete context
  const aiAnalysis = await analyzeWithClaude(contractText, athleteContext)

  // Merge results
  const allRedFlags = [...dbRedFlags, ...aiAnalysis.redFlags]

  // Deduplicate by name
  const uniqueRedFlags = allRedFlags.reduce((acc, flag) => {
    if (!acc.find(f => f.name === flag.name)) {
      acc.push(flag)
    }
    return acc
  }, [] as RedFlag[])

  // Determine overall risk
  const criticalCount = uniqueRedFlags.filter(f => f.severity === 'critical').length
  const highCount = uniqueRedFlags.filter(f => f.severity === 'high').length

  let overallRisk: 'low' | 'medium' | 'high' | 'critical' = 'low'
  if (criticalCount > 0) overallRisk = 'critical'
  else if (highCount >= 2) overallRisk = 'high'
  else if (highCount >= 1 || uniqueRedFlags.length >= 3) overallRisk = 'medium'

  return {
    summary: aiAnalysis.summary,
    redFlags: uniqueRedFlags,
    keyTerms: aiAnalysis.keyTerms,
    overallRisk,
    suggestedRedlines: aiAnalysis.suggestedRedlines || [],
  }
}

async function checkDatabasePatterns(contractText: string): Promise<RedFlag[]> {
  const patterns = await prisma.contractRedFlagPattern.findMany()
  const redFlags: RedFlag[] = []

  const textLower = contractText.toLowerCase()

  for (const pattern of patterns) {
    if (pattern.patternType === 'REGEX' || pattern.patternType === 'KEYWORD') {
      try {
        const regex = new RegExp(pattern.patternValue, 'gi')
        const matches = contractText.match(regex)

        if (matches && matches.length > 0) {
          redFlags.push({
            name: pattern.name,
            severity: pattern.severity.toLowerCase() as RedFlag['severity'],
            excerpt: matches[0].substring(0, 100) + (matches[0].length > 100 ? '...' : ''),
            explanation: pattern.explanation,
            recommendation: pattern.recommendation,
          })
        }
      } catch (e) {
        // Invalid regex, skip
        console.error(`Invalid regex pattern: ${pattern.patternValue}`)
      }
    }
  }

  return redFlags
}

async function analyzeWithClaude(
  contractText: string,
  athleteContext?: AthleteContext | null
): Promise<{
  summary: string
  redFlags: RedFlag[]
  keyTerms: ContractScanResult['keyTerms']
  suggestedRedlines: SuggestedRedline[]
}> {
  // Build context-aware prompt
  let contextSection = ''
  if (athleteContext) {
    contextSection = `
ATHLETE CONTEXT:
- School: ${athleteContext.school} (${athleteContext.shortName})
- Conference: ${athleteContext.conference}
- Sport: ${athleteContext.sport}
- State: ${athleteContext.state}
- International Student: ${athleteContext.isInternationalStudent ? 'Yes' : 'No'}

SCHOOL-SPECIFIC RULES TO CONSIDER:
${athleteContext.schoolRules.map((r) => `- ${r.title}: ${r.description}`).join('\n')}

IMPORTANT CONTEXT-SPECIFIC CONSIDERATIONS:
${getSchoolSpecificGuidance(athleteContext)}
`
  }

  const prompt = `You are an expert NIL (Name, Image, Likeness) contract analyst helping college athletes understand their contracts.
${contextSection}
Analyze the following contract and provide:
1. A plain-English summary (2-3 sentences, written for a college student)
2. Any red flags or concerning terms
3. Key terms extracted from the contract

CONTRACT TEXT:
---
${contractText}
---

Respond in this exact JSON format:
{
  "summary": "Brief plain-English summary of what this contract is for and what the athlete is agreeing to",
  "redFlags": [
    {
      "name": "Name of the issue (e.g., 'Perpetual Rights')",
      "severity": "critical|high|medium|low",
      "excerpt": "The exact problematic text from the contract",
      "explanation": "Why this is concerning, in plain English",
      "recommendation": "What the athlete should do about this"
    }
  ],
  "keyTerms": {
    "compensation": "The payment amount and terms, or null if not specified",
    "duration": "How long the agreement lasts, or null if not specified",
    "exclusivity": "Any exclusivity restrictions, or null if none",
    "terminationRights": "How either party can end the agreement, or null if not specified",
    "usageRights": "What rights the brand gets to use the athlete's NIL, or null if not specified"
  },
  "suggestedRedlines": [
    {
      "original": "The exact problematic text from the contract that should be changed",
      "revised": "The suggested replacement text that protects the athlete's interests",
      "explanation": "Brief explanation of why this change matters",
      "priority": "must_change|should_change|consider"
    }
  ]
}

IMPORTANT FOR REDLINES:
- For each red flag, provide a specific redline suggestion with exact replacement language
- Write revised text in professional legal/contract language (not casual)
- "must_change" = critical issues that could harm the athlete
- "should_change" = important protections to negotiate
- "consider" = nice-to-have improvements
- Include redlines for missing clauses (e.g., payment terms, termination rights)
- Make revised text fair to both parties, not one-sided

UNIVERSAL RED FLAGS (check in ALL contracts):
- Perpetual or unlimited usage rights
- Overly broad exclusivity (>6 months or entire categories)
- One-sided termination (brand can exit, athlete cannot)
- Vague moral clauses
- Transfer penalties or clawbacks
- Pay-for-play language (NCAA violation)
- Missing payment terms
- Hidden costs or deductions
${athleteContext ? `- Any conflicts with ${athleteContext.shortName}'s specific NIL policies` : ''}
${athleteContext ? `- ${athleteContext.conference} conference-specific issues` : ''}
${athleteContext?.isInternationalStudent ? '- International student visa/work authorization concerns' : ''}

AGREEMENT-TYPE-SPECIFIC RED FLAGS (identify the agreement type and apply relevant checks):

AGENT REPRESENTATION:
- Commission rates above 15-20% (standard is 10-15% for NIL)
- Exclusive representation without performance guarantees
- Long contract terms (>2 years) with no exit clause
- Agent claiming percentage of deals they didn't source
- Conflicts of interest (agent representing competing athletes)

SOCIAL MEDIA CONTENT:
- Unlimited revisions or content requests
- Rights to repurpose content without additional compensation
- Requiring specific posting times that conflict with athletics
- FTC disclosure requirements not addressed
- Content approval timelines that are too short (<24 hours)

APPEARANCE AGREEMENTS:
- Vague time commitments ("as needed" or "reasonable availability")
- No travel/expense reimbursement terms
- Appearance during competition season without schedule flexibility
- No cancellation policy for athletic conflicts

APPAREL/BRAND ENDORSEMENTS:
- Conflicts with team/school apparel sponsors
- Requiring wear during competition (likely NCAA violation)
- Category exclusivity that's too broad (all "athletic wear" vs specific)
- Image usage extending beyond contract term

LICENSING AGREEMENTS:
- Sublicensing rights without athlete approval
- No audit rights for royalty calculations
- Minimum guarantees that are too low
- Territory too broad (worldwide when local would suffice)

MERCHANDISE/AUTOGRAPHS:
- No limit on signing quantities
- Per-item rates below market ($20+ for autographs is standard)
- Exclusivity on ALL memorabilia vs specific items
- No quality control over merchandise bearing athlete's likeness

MANAGEMENT CONTRACTS:
- Sunset clauses that extend beyond active representation
- Manager taking percentage of non-NIL income (academic scholarships, etc.)
- No clear scope of services
- Non-compete clauses preventing athlete from hiring specialists

REVENUE SHARE/NIL COLLECTIVES:
- Requiring specific social media posts or appearances for "donations"
- Tying payments to athletic performance (potential NCAA issue)
- Unclear payment schedules or conditions
- Collective controlling athlete's other NIL opportunities

MEDIA/PODCAST APPEARANCES:
- Granting rights to ALL future appearances
- No editorial control or approval rights
- Compensation only in "exposure" without monetary value
- Waiving rights to object to editing/context

STREAMING/CONTENT CREATION:
- Platform exclusivity that prevents personal content
- Revenue share below industry standard (50%+ should go to creator)
- Owning content created on personal time
- Non-compete for other streaming platforms

ARTIFICIAL INTELLIGENCE/DIGITAL LIKENESS:
- CRITICAL: AI training rights on voice/likeness without clear limits
- Synthetic media creation rights
- Deepfake or digital avatar rights extending perpetually
- No approval rights over AI-generated content
- Unclear ownership of AI-generated derivative works

DATA AND ANALYTICS:
- Biometric data collection without clear purpose limits
- Selling/sharing data with third parties
- No data deletion rights after contract ends
- Health/performance data that could affect draft stock or future contracts

VIDEO GAMES:
- Group licensing that undervalues individual contribution
- Perpetual likeness rights for future game editions
- No additional compensation for prominent featuring
- Rights extending to future technologies not yet invented

=== CREATOR/INFLUENCER CONTRACTS ===

BRAND SPONSORSHIP/INFLUENCER:
- Whitelisting rights (brand running ads from your account) without extra pay
- Usage rights extending beyond campaign period
- Exclusivity across too many competitor categories
- No kill fee if brand cancels after content creation
- Requiring exclusivity during "consideration" periods before signing

UGC (USER GENERATED CONTENT):
- Rates below market ($150-500+ per video is standard)
- Unlimited revisions or re-shoots
- Rights to use content perpetually for one-time fee
- No credit/attribution requirements
- Broad usage rights (paid ads, TV, OOH) for organic-only pricing

AFFILIATE MARKETING:
- Cookie duration too short (<30 days)
- Commission rates below industry standard
- Clawbacks on returns beyond reasonable period (>60 days)
- Exclusive affiliate arrangements limiting other partnerships
- No transparency on conversion tracking

PLATFORM PARTNERSHIPS (YouTube, TikTok, etc.):
- Revenue share below platform standard (YouTube 55%, TikTok varies)
- Content ownership transferring to platform
- Exclusivity without minimum guarantees
- Penalties for missing upload schedules
- Platform can terminate without notice or cause

=== STREAMER/GAMING CONTRACTS ===

STREAMING PLATFORM EXCLUSIVITY (Twitch, YouTube, Kick):
- Exclusivity without guaranteed minimum payment
- Non-compete extending beyond contract term
- Platform owns VODs/clips perpetually
- Restrictions on other income sources (YouTube, sponsorships)
- No out-clause if platform changes terms

ESPORTS/TEAM CONTRACTS:
- Salary below market for skill level
- Team taking cut of personal streaming revenue
- Org owns your content/brand you built
- Transfer/buyout clauses that trap you
- Prize money splits favoring org (should be 80%+ to player)

TOURNAMENT/COMPETITION:
- Waiving all media rights for participation
- No compensation for broadcast appearances
- Liability waivers that are too broad
- Prize money payment timelines too long (>30 days)

=== MUSIC INDUSTRY CONTRACTS ===

RECORD LABEL (traditional & 360 deals):
- CRITICAL: 360 deals taking cut of touring, merch, sponsorships
- Ownership of masters (try to retain or get reversion)
- Recoupment terms that keep you in debt
- Album commitment requirements (multiple albums locked in)
- Controlled composition clauses reducing your publishing
- Option periods that extend control without new advances

MUSIC DISTRIBUTION:
- Taking ownership vs just distribution rights
- Exclusive distribution when non-exclusive available
- Hidden fees eating into royalties
- Long exclusive terms (>1-2 years is risky)
- No audit rights on streaming calculations

MUSIC PUBLISHING:
- Giving up 100% publishing (50/50 co-pub is better)
- Admin deals taking more than 15-20%
- Sync approval rights - you should have them
- Reversion clauses - when do you get rights back?
- Advances that are actually loans with bad terms

PRODUCER/BEAT LICENSE:
- Exclusive vs non-exclusive terms must be clear
- Streaming caps on non-exclusive licenses
- Producer royalty points (2-4% is standard)
- Who owns the master if it's a collaboration
- Sample clearance responsibility

SYNC LICENSING (TV, Film, Ads):
- Buyout vs ongoing royalties
- Territory and term limitations
- Most Favored Nations (MFN) clauses
- Options for extended use at low rates
- Credit and attribution requirements

BOOKING AGENT:
- Commission above 10-15% for live bookings
- Exclusive booking rights limiting direct deals
- Term length over 1-2 years
- Sunset provisions after contract ends
- Geographic exclusivity that's too broad

COLLABORATION/FEATURES:
- Credit and billing order
- Revenue split clarity
- Who controls distribution
- Sample clearance responsibilities
- Approval rights on final mix

=== GENERAL CREATOR CONTRACTS ===

WORK FOR HIRE:
- No backend/royalties on successful content
- Giving up all rights including credit
- Rates below market for full buyout
- Scope creep without additional compensation
- Non-compete preventing similar work

GHOSTWRITING/CONTENT CREATION:
- No portfolio rights (can't show work as yours)
- Payment contingent on client approval (should be on delivery)
- Unlimited revisions
- Rush fees not addressed
- Kill fees if project cancelled

NDA/CONFIDENTIALITY:
- Term too long (>2-3 years for most situations)
- Definition of confidential too broad
- Penalties disproportionate to potential harm
- Restricting you from discussing publicly available info
- No carve-outs for legal requirements

NON-COMPETE:
- Duration too long (>6-12 months)
- Geographic scope too broad
- Industry definition too wide
- No compensation during non-compete period
- Triggered even if they terminate you

COLLABORATION/JOINT VENTURE:
- Ownership of IP created together
- Revenue split and accounting transparency
- Exit provisions if partnership sours
- Decision-making authority
- Who controls the brand/accounts

PLATFORM CREATOR FUNDS:
- Opaque calculation methods
- Unilateral right to change payment terms
- Content requirements to qualify
- Data usage rights buried in terms
- Exclusivity implied but not compensated

=== ANCILLARY/SUPPLEMENTAL DOCUMENTS ===

AMENDMENTS/ADDENDUMS:
- Changes that materially worsen original terms
- Not clearly referencing which sections are modified
- New obligations without new consideration/payment
- Extending term or exclusivity without consent
- Waiving rights you had in original agreement

SIDE LETTERS:
- Contradicting main agreement (which controls?)
- Informal language that creates ambiguity
- Promises not legally binding
- Confidentiality preventing you from discussing terms
- Expiration that doesn't match main agreement

EXHIBITS/SCHEDULES:
- Scope of work broader than discussed
- Deliverables list that's open-ended
- Rate cards that can be changed unilaterally
- Territory or platform lists that are too broad
- Vague descriptions that allow scope creep

RELEASES/WAIVERS:
- Waiving rights you don't understand
- Releasing future claims (not just past)
- Waiving right to join class actions
- No consideration for signing release
- Perpetual releases for one-time payment

ASSIGNMENT/TRANSFER NOTICES:
- Your contract being assigned without consent rights
- New party has worse reputation/financials
- Terms changing upon assignment
- No right to terminate if assigned

TERMINATION/SETTLEMENT AGREEMENTS:
- Giving up more than necessary to end relationship
- Non-disparagement that's one-sided
- Releasing future claims unrelated to dispute
- Confidentiality about settlement terms you need to disclose
- Payment timelines that are too long

LETTERS OF INTENT (LOI) / TERM SHEETS:
- Binding obligations in "non-binding" document
- Exclusivity periods without compensation
- Break-up fees if deal doesn't close
- Confidentiality surviving failed deal
- Missing key terms that will be decided later

First, identify what type of document this is (main agreement vs ancillary), then apply relevant checks.
Only flag actual issues found in the contract. If the contract is reasonable, the redFlags array can be empty.`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    // Extract text from response
    const textContent = response.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude')
    }

    // Parse JSON from response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from Claude response')
    }

    const result = JSON.parse(jsonMatch[0])

    return {
      summary: result.summary || 'Unable to generate summary.',
      redFlags: (result.redFlags || []).map((flag: Record<string, string>) => ({
        name: flag.name,
        severity: flag.severity as RedFlag['severity'],
        excerpt: flag.excerpt,
        explanation: flag.explanation,
        recommendation: flag.recommendation,
      })),
      keyTerms: {
        compensation: result.keyTerms?.compensation || null,
        duration: result.keyTerms?.duration || null,
        exclusivity: result.keyTerms?.exclusivity || null,
        terminationRights: result.keyTerms?.terminationRights || null,
        usageRights: result.keyTerms?.usageRights || null,
      },
      suggestedRedlines: (result.suggestedRedlines || []).map((redline: Record<string, string>) => ({
        original: redline.original,
        revised: redline.revised,
        explanation: redline.explanation,
        priority: redline.priority as SuggestedRedline['priority'],
      })),
    }
  } catch (error) {
    console.error('Error analyzing contract with Claude:', error)

    // Return empty analysis on error
    return {
      summary: 'Unable to analyze contract. Please review manually.',
      redFlags: [],
      keyTerms: {
        compensation: null,
        duration: null,
        exclusivity: null,
        terminationRights: null,
        usageRights: null,
      },
      suggestedRedlines: [],
    }
  }
}

// Extract text from PDF (basic implementation - would use pdf-parse in production)
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  // Dynamic import to avoid issues in edge runtime
  const pdfParse = (await import('pdf-parse')).default
  const data = await pdfParse(buffer)
  return data.text
}

// School and conference-specific guidance for the AI
function getSchoolSpecificGuidance(context: AthleteContext): string {
  const guidance: string[] = []

  // Conference-specific guidance
  switch (context.conference) {
    case 'WCC':
      guidance.push(
        '- WCC schools (like Santa Clara) often have closer relationships with local businesses. Watch for deals that might conflict with university partnerships.',
        '- WCC is a smaller conference - be aware that NIL market values may differ from Power 5 schools.',
        '- Santa Clara has specific pre-approval requirements through their compliance department.'
      )
      break
    case 'ACC':
      guidance.push(
        '- ACC schools (Stanford, Cal) are subject to conference-wide media rights deals. Check for conflicts with ACC Network obligations.',
        '- ACC schools have more structured NIL collectives - ensure this deal doesn\'t conflict with collective agreements.',
        '- Stanford and Cal recently joined ACC - be aware of any transition-period restrictions.'
      )
      break
    case 'Mountain West':
      guidance.push(
        '- Mountain West schools (San Jose State) may have different NIL market dynamics than Power conferences.',
        '- SJSU uses Opendorse for NIL marketplace - consider whether this deal should go through official channels.',
        '- Check for any Mountain West conference sponsor conflicts.'
      )
      break
  }

  // School-specific guidance
  switch (context.shortName) {
    case 'Stanford':
      guidance.push(
        '- Stanford has strict rules about using university marks, logos, or cardinal red in NIL content.',
        '- Stanford requires disclosure through the ARMS compliance system.',
        '- Stanford prohibits NIL activities in university facilities without express written consent.'
      )
      break
    case 'Cal':
      guidance.push(
        '- Cal uses INFLCR/Golden Exchange for NIL tracking - ensure proper disclosure.',
        '- Cal has specific guidelines for boosters participating in NIL deals.',
        '- UC Berkeley has additional considerations for deals involving campus imagery.'
      )
      break
    case 'San Jose State':
      guidance.push(
        '- SJSU prohibits using university marks without written consent from Michael Smoose.',
        '- SJSU prohibits NIL activities on campus without facility approval from Cottrell Hill.',
        '- SJSU athletes cannot sell school-provided items (awards, apparel) until eligibility is exhausted.'
      )
      break
    case 'Santa Clara':
      guidance.push(
        '- Santa Clara REQUIRES pre-approval from Athletics Compliance before signing any NIL deal.',
        '- Santa Clara uses The Mission NIL Collective - check if this deal should go through them.',
        '- SCU has specific WCC compliance considerations as a smaller program.'
      )
      break
  }

  // International student guidance
  if (context.isInternationalStudent) {
    guidance.push(
      '- CRITICAL: As an international student, NIL income may affect your visa status.',
      '- Consult with your international student office before signing ANY NIL deal.',
      '- Some NIL activities may be considered "employment" under immigration law.',
      '- You may need CPT/OPT authorization for certain NIL activities.'
    )
  }

  // Sport-specific guidance
  if (context.sport.includes('Basketball')) {
    guidance.push(
      '- Basketball players often have higher NIL values - ensure you\'re being compensated fairly.',
      '- Watch for conflicts with basketball shoe/apparel deals and team sponsors.'
    )
  } else if (context.sport === 'Football') {
    guidance.push(
      '- Football NIL deals often involve appearance requirements during season - check scheduling conflicts.',
      '- Be aware of team equipment sponsor exclusivity (Nike, Adidas, Under Armour).'
    )
  }

  return guidance.join('\n')
}
