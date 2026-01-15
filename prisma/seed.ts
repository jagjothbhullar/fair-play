import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // ============================================================================
  // CONFERENCES
  // ============================================================================
  const conferences = await Promise.all([
    prisma.conference.upsert({
      where: { name: 'ACC' },
      update: {},
      create: { name: 'ACC', division: 'D1' },
    }),
    prisma.conference.upsert({
      where: { name: 'Mountain West' },
      update: {},
      create: { name: 'Mountain West', division: 'D1' },
    }),
    prisma.conference.upsert({
      where: { name: 'WCC' },
      update: {},
      create: { name: 'WCC', division: 'D1' },
    }),
  ])

  const [acc, mountainWest, wcc] = conferences
  console.log('Created conferences:', conferences.map(c => c.name))

  // ============================================================================
  // SCHOOLS
  // ============================================================================
  const schools = await Promise.all([
    prisma.school.upsert({
      where: { id: 'stanford' },
      update: {},
      create: {
        id: 'stanford',
        name: 'Stanford University',
        shortName: 'Stanford',
        mascot: 'Cardinal',
        conferenceId: acc.id,
        state: 'CA',
        compliancePlatform: 'ARMS',
        complianceEmail: 'compliance@stanford.edu',
        nilPolicyUrl: 'https://gostanford.com/nil',
        requiresPreApproval: false,
        disclosureDeadlineDays: 5,
        prohibitedCategories: [],
        facilityUsageAllowed: false,
        marksUsageAllowed: false,
      },
    }),
    prisma.school.upsert({
      where: { id: 'cal' },
      update: {},
      create: {
        id: 'cal',
        name: 'University of California, Berkeley',
        shortName: 'Cal',
        mascot: 'Golden Bears',
        conferenceId: acc.id,
        state: 'CA',
        compliancePlatform: 'INFLCR',
        complianceEmail: 'compliance@berkeley.edu',
        nilPolicyUrl: 'https://calbears.com/sports/2023/7/13/NIL.aspx',
        requiresPreApproval: false,
        disclosureDeadlineDays: 5,
        prohibitedCategories: [],
        facilityUsageAllowed: false,
        marksUsageAllowed: false,
      },
    }),
    prisma.school.upsert({
      where: { id: 'sjsu' },
      update: {},
      create: {
        id: 'sjsu',
        name: 'San Jose State University',
        shortName: 'San Jose State',
        mascot: 'Spartans',
        conferenceId: mountainWest.id,
        state: 'CA',
        compliancePlatform: 'Opendorse',
        complianceEmail: 'compliance@sjsu.edu',
        nilPolicyUrl: 'https://sjsuspartans.com/name-image-and-likeness-policy',
        requiresPreApproval: false,
        disclosureDeadlineDays: 5,
        prohibitedCategories: [],
        facilityUsageAllowed: false,
        marksUsageAllowed: false,
      },
    }),
    prisma.school.upsert({
      where: { id: 'santaclara' },
      update: {},
      create: {
        id: 'santaclara',
        name: 'Santa Clara University',
        shortName: 'Santa Clara',
        mascot: 'Broncos',
        conferenceId: wcc.id,
        state: 'CA',
        compliancePlatform: 'INFLCR',
        complianceEmail: 'compliance@scu.edu',
        nilPolicyUrl: 'https://santaclarabroncos.com/information/compliance/index',
        requiresPreApproval: true,
        disclosureDeadlineDays: 5,
        prohibitedCategories: [],
        facilityUsageAllowed: false,
        marksUsageAllowed: false,
      },
    }),
  ])

  console.log('Created schools:', schools.map(s => s.shortName))

  // ============================================================================
  // SPORTS
  // ============================================================================
  const sports = await Promise.all([
    // Basketball
    prisma.sport.upsert({
      where: { name_gender: { name: "Men's Basketball", gender: 'M' } },
      update: {},
      create: { name: "Men's Basketball", gender: 'M', category: 'basketball', isRevenueSport: true },
    }),
    prisma.sport.upsert({
      where: { name_gender: { name: "Women's Basketball", gender: 'F' } },
      update: {},
      create: { name: "Women's Basketball", gender: 'F', category: 'basketball', isRevenueSport: true },
    }),
    // Football
    prisma.sport.upsert({
      where: { name_gender: { name: 'Football', gender: 'M' } },
      update: {},
      create: { name: 'Football', gender: 'M', category: 'football', isRevenueSport: true },
    }),
    // Soccer
    prisma.sport.upsert({
      where: { name_gender: { name: "Men's Soccer", gender: 'M' } },
      update: {},
      create: { name: "Men's Soccer", gender: 'M', category: 'soccer', isRevenueSport: false },
    }),
    prisma.sport.upsert({
      where: { name_gender: { name: "Women's Soccer", gender: 'F' } },
      update: {},
      create: { name: "Women's Soccer", gender: 'F', category: 'soccer', isRevenueSport: false },
    }),
    // Baseball/Softball
    prisma.sport.upsert({
      where: { name_gender: { name: 'Baseball', gender: 'M' } },
      update: {},
      create: { name: 'Baseball', gender: 'M', category: 'baseball', isRevenueSport: false },
    }),
    prisma.sport.upsert({
      where: { name_gender: { name: 'Softball', gender: 'F' } },
      update: {},
      create: { name: 'Softball', gender: 'F', category: 'softball', isRevenueSport: false },
    }),
    // Volleyball
    prisma.sport.upsert({
      where: { name_gender: { name: "Men's Volleyball", gender: 'M' } },
      update: {},
      create: { name: "Men's Volleyball", gender: 'M', category: 'volleyball', isRevenueSport: false },
    }),
    prisma.sport.upsert({
      where: { name_gender: { name: "Women's Volleyball", gender: 'F' } },
      update: {},
      create: { name: "Women's Volleyball", gender: 'F', category: 'volleyball', isRevenueSport: false },
    }),
    // Swimming
    prisma.sport.upsert({
      where: { name_gender: { name: "Men's Swimming", gender: 'M' } },
      update: {},
      create: { name: "Men's Swimming", gender: 'M', category: 'swimming', isRevenueSport: false },
    }),
    prisma.sport.upsert({
      where: { name_gender: { name: "Women's Swimming", gender: 'F' } },
      update: {},
      create: { name: "Women's Swimming", gender: 'F', category: 'swimming', isRevenueSport: false },
    }),
    // Track & Field
    prisma.sport.upsert({
      where: { name_gender: { name: "Men's Track & Field", gender: 'M' } },
      update: {},
      create: { name: "Men's Track & Field", gender: 'M', category: 'track', isRevenueSport: false },
    }),
    prisma.sport.upsert({
      where: { name_gender: { name: "Women's Track & Field", gender: 'F' } },
      update: {},
      create: { name: "Women's Track & Field", gender: 'F', category: 'track', isRevenueSport: false },
    }),
    // Tennis
    prisma.sport.upsert({
      where: { name_gender: { name: "Men's Tennis", gender: 'M' } },
      update: {},
      create: { name: "Men's Tennis", gender: 'M', category: 'tennis', isRevenueSport: false },
    }),
    prisma.sport.upsert({
      where: { name_gender: { name: "Women's Tennis", gender: 'F' } },
      update: {},
      create: { name: "Women's Tennis", gender: 'F', category: 'tennis', isRevenueSport: false },
    }),
    // Golf
    prisma.sport.upsert({
      where: { name_gender: { name: "Men's Golf", gender: 'M' } },
      update: {},
      create: { name: "Men's Golf", gender: 'M', category: 'golf', isRevenueSport: false },
    }),
    prisma.sport.upsert({
      where: { name_gender: { name: "Women's Golf", gender: 'F' } },
      update: {},
      create: { name: "Women's Golf", gender: 'F', category: 'golf', isRevenueSport: false },
    }),
    // Gymnastics
    prisma.sport.upsert({
      where: { name_gender: { name: "Women's Gymnastics", gender: 'F' } },
      update: {},
      create: { name: "Women's Gymnastics", gender: 'F', category: 'gymnastics', isRevenueSport: false },
    }),
    // Water Polo
    prisma.sport.upsert({
      where: { name_gender: { name: "Men's Water Polo", gender: 'M' } },
      update: {},
      create: { name: "Men's Water Polo", gender: 'M', category: 'waterpolo', isRevenueSport: false },
    }),
    prisma.sport.upsert({
      where: { name_gender: { name: "Women's Water Polo", gender: 'F' } },
      update: {},
      create: { name: "Women's Water Polo", gender: 'F', category: 'waterpolo', isRevenueSport: false },
    }),
    // Rowing
    prisma.sport.upsert({
      where: { name_gender: { name: "Women's Rowing", gender: 'F' } },
      update: {},
      create: { name: "Women's Rowing", gender: 'F', category: 'rowing', isRevenueSport: false },
    }),
    // Lacrosse
    prisma.sport.upsert({
      where: { name_gender: { name: "Women's Lacrosse", gender: 'F' } },
      update: {},
      create: { name: "Women's Lacrosse", gender: 'F', category: 'lacrosse', isRevenueSport: false },
    }),
    // Field Hockey
    prisma.sport.upsert({
      where: { name_gender: { name: 'Field Hockey', gender: 'F' } },
      update: {},
      create: { name: 'Field Hockey', gender: 'F', category: 'fieldhockey', isRevenueSport: false },
    }),
    // Cross Country
    prisma.sport.upsert({
      where: { name_gender: { name: "Men's Cross Country", gender: 'M' } },
      update: {},
      create: { name: "Men's Cross Country", gender: 'M', category: 'crosscountry', isRevenueSport: false },
    }),
    prisma.sport.upsert({
      where: { name_gender: { name: "Women's Cross Country", gender: 'F' } },
      update: {},
      create: { name: "Women's Cross Country", gender: 'F', category: 'crosscountry', isRevenueSport: false },
    }),
  ])

  console.log('Created sports:', sports.length)

  // ============================================================================
  // COMPLIANCE RULES
  // ============================================================================
  const complianceRules = await Promise.all([
    // NCAA Rules
    prisma.complianceRule.upsert({
      where: { ruleCode: 'NCAA-NIL-600' },
      update: {},
      create: {
        ruleCode: 'NCAA-NIL-600',
        scope: 'NCAA',
        title: '$600+ Disclosure Requirement',
        description: 'All NIL deals with a total value of $600 or more must be reported to NIL Go within 5 business days.',
        checkLogic: {
          type: 'threshold',
          field: 'compensationTotalValue',
          operator: '>=',
          value: 600,
          action: 'require_ncaa_disclosure',
        },
        severity: 'ERROR',
      },
    }),
    prisma.complianceRule.upsert({
      where: { ruleCode: 'NCAA-NIL-NO-PAY-FOR-PLAY' },
      update: {},
      create: {
        ruleCode: 'NCAA-NIL-NO-PAY-FOR-PLAY',
        scope: 'NCAA',
        title: 'No Pay-for-Play',
        description: 'NIL compensation cannot be directly tied to athletic performance or participation.',
        checkLogic: {
          type: 'contract_scan',
          patterns: ['per touchdown', 'per goal', 'per point', 'performance bonus', 'playing time'],
          action: 'flag_pay_for_play',
        },
        severity: 'ERROR',
      },
    }),
    prisma.complianceRule.upsert({
      where: { ruleCode: 'NCAA-NIL-NO-INDUCEMENT' },
      update: {},
      create: {
        ruleCode: 'NCAA-NIL-NO-INDUCEMENT',
        scope: 'NCAA',
        title: 'No Enrollment Inducements',
        description: 'NIL deals cannot be contingent on attending or remaining at a specific school.',
        checkLogic: {
          type: 'contract_scan',
          patterns: ['must attend', 'enrollment required', 'transfer prohibited', 'remain enrolled'],
          action: 'flag_inducement',
        },
        severity: 'ERROR',
      },
    }),
    prisma.complianceRule.upsert({
      where: { ruleCode: 'NCAA-NIL-5-DAY-DISCLOSURE' },
      update: {},
      create: {
        ruleCode: 'NCAA-NIL-5-DAY-DISCLOSURE',
        scope: 'NCAA',
        title: '5 Business Day Disclosure Deadline',
        description: 'NIL deals must be disclosed within 5 business days of signing.',
        checkLogic: {
          type: 'deadline',
          field: 'createdAt',
          days: 5,
          businessDays: true,
          action: 'warn_disclosure_deadline',
        },
        severity: 'WARNING',
      },
    }),

    // California State Rules
    prisma.complianceRule.upsert({
      where: { ruleCode: 'CA-SB26-DISCLOSURE' },
      update: {},
      create: {
        ruleCode: 'CA-SB26-DISCLOSURE',
        scope: 'STATE',
        stateCode: 'CA',
        title: 'California NIL Disclosure',
        description: 'Athletes must disclose NIL deals to their school or athletic program.',
        checkLogic: {
          type: 'required_disclosure',
          target: 'school',
          action: 'require_school_disclosure',
        },
        severity: 'WARNING',
      },
    }),
    prisma.complianceRule.upsert({
      where: { ruleCode: 'CA-SB26-NO-TEAM-CONFLICT' },
      update: {},
      create: {
        ruleCode: 'CA-SB26-NO-TEAM-CONFLICT',
        scope: 'STATE',
        stateCode: 'CA',
        title: 'No Team Contract Conflicts',
        description: 'NIL deals cannot conflict with provisions of the athlete\'s team contract.',
        checkLogic: {
          type: 'manual_review',
          prompt: 'Does this deal conflict with any team sponsorship agreements?',
          action: 'flag_team_conflict',
        },
        severity: 'WARNING',
      },
    }),

    // School-Specific Rules - Stanford
    prisma.complianceRule.upsert({
      where: { ruleCode: 'STANFORD-NO-MARKS' },
      update: {},
      create: {
        ruleCode: 'STANFORD-NO-MARKS',
        scope: 'SCHOOL',
        schoolId: 'stanford',
        title: 'No Stanford Marks Without Consent',
        description: 'Student-athletes may not use Stanford\'s marks, logos, or name without express written consent.',
        checkLogic: {
          type: 'boolean_check',
          question: 'Does this deal involve using Stanford logos, marks, or branding?',
          action: 'require_marks_approval',
        },
        severity: 'ERROR',
      },
    }),
    prisma.complianceRule.upsert({
      where: { ruleCode: 'STANFORD-NO-APPAREL' },
      update: {},
      create: {
        ruleCode: 'STANFORD-NO-APPAREL',
        scope: 'SCHOOL',
        schoolId: 'stanford',
        title: 'No Stanford Apparel in NIL Content',
        description: 'Student-athletes may not wear apparel containing Stanford\'s name, logos, or marks in NIL activities.',
        checkLogic: {
          type: 'boolean_check',
          question: 'Will you be wearing Stanford apparel in this NIL activity?',
          action: 'flag_apparel_usage',
        },
        severity: 'WARNING',
      },
    }),

    // School-Specific Rules - SJSU
    prisma.complianceRule.upsert({
      where: { ruleCode: 'SJSU-NO-MARKS' },
      update: {},
      create: {
        ruleCode: 'SJSU-NO-MARKS',
        scope: 'SCHOOL',
        schoolId: 'sjsu',
        title: 'No SJSU Marks Without Consent',
        description: 'Student-athletes may not use SJSU marks without express written consent from the University.',
        checkLogic: {
          type: 'boolean_check',
          question: 'Does this deal involve using SJSU logos, marks, or branding?',
          action: 'require_marks_approval',
        },
        severity: 'ERROR',
      },
    }),
    prisma.complianceRule.upsert({
      where: { ruleCode: 'SJSU-NO-FACILITIES' },
      update: {},
      create: {
        ruleCode: 'SJSU-NO-FACILITIES',
        scope: 'SCHOOL',
        schoolId: 'sjsu',
        title: 'No Campus Facilities for NIL',
        description: 'Student-athletes may not use SJSU facilities or campus property for NIL activities without written consent.',
        checkLogic: {
          type: 'boolean_check',
          question: 'Will this NIL activity take place on SJSU campus or facilities?',
          action: 'require_facility_approval',
        },
        severity: 'ERROR',
      },
    }),
    prisma.complianceRule.upsert({
      where: { ruleCode: 'SJSU-NO-SCHOOL-ITEMS' },
      update: {},
      create: {
        ruleCode: 'SJSU-NO-SCHOOL-ITEMS',
        scope: 'SCHOOL',
        schoolId: 'sjsu',
        title: 'No Sale of School-Provided Items',
        description: 'Student-athletes may not sell items provided by the institution until eligibility is exhausted.',
        checkLogic: {
          type: 'boolean_check',
          question: 'Does this deal involve selling items provided by SJSU (awards, apparel, etc.)?',
          action: 'flag_school_items',
        },
        severity: 'ERROR',
      },
    }),

    // School-Specific Rules - Cal
    prisma.complianceRule.upsert({
      where: { ruleCode: 'CAL-INTERNATIONAL-STUDENT' },
      update: {},
      create: {
        ruleCode: 'CAL-INTERNATIONAL-STUDENT',
        scope: 'SCHOOL',
        schoolId: 'cal',
        title: 'International Student NIL Restrictions',
        description: 'International students face additional restrictions under federal visa regulations.',
        checkLogic: {
          type: 'athlete_check',
          field: 'isInternationalStudent',
          value: true,
          action: 'flag_international_review',
        },
        severity: 'WARNING',
      },
    }),

    // School-Specific Rules - Santa Clara
    prisma.complianceRule.upsert({
      where: { ruleCode: 'SCU-PRE-APPROVAL' },
      update: {},
      create: {
        ruleCode: 'SCU-PRE-APPROVAL',
        scope: 'SCHOOL',
        schoolId: 'santaclara',
        title: 'Pre-Approval Required',
        description: 'All NIL partnerships must be approved in advance by the Santa Clara Athletics Compliance department.',
        checkLogic: {
          type: 'required_action',
          action: 'require_pre_approval',
        },
        severity: 'ERROR',
      },
    }),
  ])

  console.log('Created compliance rules:', complianceRules.length)

  // ============================================================================
  // CONTRACT RED FLAG PATTERNS
  // ============================================================================
  const redFlagPatterns = await Promise.all([
    prisma.contractRedFlagPattern.create({
      data: {
        name: 'Perpetual Rights',
        patternType: 'REGEX',
        patternValue: '(in perpetuity|perpetual|forever|unlimited time|indefinite|no expiration)',
        severity: 'ERROR',
        explanation: 'This clause allows the brand to use your name, image, and likeness indefinitely - potentially for the rest of your life - without additional compensation.',
        recommendation: 'Request a specific end date for usage rights, typically 1-2 years. After the contract ends, they should no longer be able to use your content.',
      },
    }),
    prisma.contractRedFlagPattern.create({
      data: {
        name: 'Broad Exclusivity',
        patternType: 'REGEX',
        patternValue: '(exclusive|exclusivity|sole rights|only (brand|company|sponsor))',
        severity: 'WARNING',
        explanation: 'Exclusivity clauses prevent you from working with competing brands. Overly broad exclusivity can severely limit your earning potential.',
        recommendation: 'Ensure exclusivity is narrowly defined (specific product category only), time-limited (6 months max), and compensated appropriately for the restriction.',
      },
    }),
    prisma.contractRedFlagPattern.create({
      data: {
        name: 'One-Sided Termination',
        patternType: 'REGEX',
        patternValue: '(company may terminate|brand may cancel|at (our|company\'s|brand\'s) sole discretion)',
        severity: 'WARNING',
        explanation: 'This allows the brand to end the contract at any time while you remain bound. You should have equal rights to terminate.',
        recommendation: 'Request bilateral termination rights - both parties should have the same ability to end the agreement with reasonable notice.',
      },
    }),
    prisma.contractRedFlagPattern.create({
      data: {
        name: 'Vague Moral Clause',
        patternType: 'REGEX',
        patternValue: '(conduct detrimental|damage.*(reputation|image|brand)|inconsistent with.*values|moral turpitude)',
        severity: 'WARNING',
        explanation: 'Vague moral clauses give brands excessive power to terminate based on subjective interpretations of your behavior.',
        recommendation: 'Request specific definitions of what behaviors trigger termination, and ensure minor incidents don\'t result in contract cancellation.',
      },
    }),
    prisma.contractRedFlagPattern.create({
      data: {
        name: 'Transfer/Clawback Penalty',
        patternType: 'REGEX',
        patternValue: '(transfer.*(repay|return|forfeit)|change school.*(penalty|repayment)|clawback|must remain)',
        severity: 'ERROR',
        explanation: 'This provision would require you to repay money if you transfer schools, which could trap you or create financial hardship.',
        recommendation: 'Remove any language tying payments to your enrollment at a specific school. This may also violate NCAA rules against inducements.',
      },
    }),
    prisma.contractRedFlagPattern.create({
      data: {
        name: 'IP Assignment',
        patternType: 'REGEX',
        patternValue: '(assign.*(all|any) (rights|intellectual property|IP)|work.?for.?hire|we own|brand owns)',
        severity: 'WARNING',
        explanation: 'This transfers ownership of content you create to the brand. They could use or resell it without your approval.',
        recommendation: 'Grant a license to use content rather than assigning ownership. You should retain rights to your own content.',
      },
    }),
    prisma.contractRedFlagPattern.create({
      data: {
        name: 'Missing Payment Terms',
        patternType: 'SEMANTIC',
        patternValue: 'payment_terms_missing',
        severity: 'WARNING',
        explanation: 'The contract doesn\'t clearly specify when and how you\'ll be paid, which could lead to delayed or disputed payments.',
        recommendation: 'Ensure the contract specifies: exact payment amount, payment method, payment timeline (within 30 days of deliverable), and what happens if payment is late.',
      },
    }),
    prisma.contractRedFlagPattern.create({
      data: {
        name: 'Hidden Costs',
        patternType: 'REGEX',
        patternValue: '(athlete.*(responsible|pay|cover).*(expense|cost|fee)|deduct|withhold|at athlete\'s expense)',
        severity: 'WARNING',
        explanation: 'The contract may require you to pay for travel, equipment, or other expenses that reduce your actual compensation.',
        recommendation: 'Clarify all costs upfront. The brand should cover expenses related to their campaign, or these should be deducted from the stated compensation.',
      },
    }),
    prisma.contractRedFlagPattern.create({
      data: {
        name: 'Performance-Based Pay',
        patternType: 'REGEX',
        patternValue: '(bonus.*(score|win|touchdown|goal|point)|per (game|appearance|start)|playing time)',
        severity: 'ERROR',
        explanation: 'Pay tied to athletic performance may violate NCAA pay-for-play rules and could jeopardize your eligibility.',
        recommendation: 'Remove any language tying compensation to on-field performance. NIL compensation must be for marketing services, not athletic achievement.',
      },
    }),
  ])

  console.log('Created red flag patterns:', redFlagPatterns.length)

  // ============================================================================
  // CONTRACT TEMPLATES
  // ============================================================================
  const templates = await Promise.all([
    prisma.contractTemplate.create({
      data: {
        name: 'Social Media Post Agreement',
        dealType: 'SOCIAL_POST',
        description: 'Standard agreement for sponsored social media posts (Instagram, TikTok, Twitter/X)',
        templateContent: `# SOCIAL MEDIA ENDORSEMENT AGREEMENT

This Agreement is entered into as of [DATE] between:

**BRAND:** [BRAND_NAME] ("Company")
**ATHLETE:** [ATHLETE_NAME] ("Athlete")

## 1. SERVICES
Athlete agrees to create and post the following content:
- Platform(s): [PLATFORMS]
- Number of posts: [NUMBER_OF_POSTS]
- Content type: [CONTENT_TYPE]
- Posting deadline: [DEADLINE]

## 2. COMPENSATION
Company agrees to pay Athlete:
- Total compensation: $[AMOUNT]
- Payment terms: Within 30 days of content posting
- Payment method: [PAYMENT_METHOD]

## 3. CONTENT REQUIREMENTS
- Athlete will include #ad or #sponsored disclosure as required by FTC guidelines
- Athlete will tag Company's account: [COMPANY_HANDLE]
- Athlete will not disparage Company or its competitors
- Company will provide any required talking points or hashtags

## 4. CONTENT APPROVAL
- Athlete will submit draft content for Company review before posting
- Company will approve or request revisions within [REVIEW_DAYS] business days
- Athlete retains creative control over tone and style

## 5. USAGE RIGHTS
- Company may repost Athlete's content on Company's owned channels
- Usage rights expire [USAGE_PERIOD] after posting
- Company may not edit or alter Athlete's content without consent

## 6. TERM AND TERMINATION
- This Agreement is effective from [START_DATE] to [END_DATE]
- Either party may terminate with [NOTICE_DAYS] days written notice
- Upon termination, Company's usage rights end per Section 5

## 7. NCAA COMPLIANCE
- Athlete represents they will disclose this Agreement to their school's compliance office
- This Agreement is not contingent on Athlete's athletic performance or enrollment status
- Company acknowledges Athlete's participation in collegiate athletics

## 8. GENERAL PROVISIONS
- This Agreement constitutes the entire understanding between the parties
- Any modifications must be in writing and signed by both parties
- This Agreement shall be governed by the laws of [STATE]

**AGREED AND ACCEPTED:**

___________________________ Date: ___________
[BRAND_NAME]

___________________________ Date: ___________
[ATHLETE_NAME]`,
        version: 1,
      },
    }),
    prisma.contractTemplate.create({
      data: {
        name: 'Personal Appearance Agreement',
        dealType: 'APPEARANCE',
        description: 'Agreement for in-person appearances, meet-and-greets, and promotional events',
        templateContent: `# PERSONAL APPEARANCE AGREEMENT

This Agreement is entered into as of [DATE] between:

**COMPANY:** [COMPANY_NAME] ("Company")
**ATHLETE:** [ATHLETE_NAME] ("Athlete")

## 1. APPEARANCE DETAILS
- Event: [EVENT_NAME]
- Date: [EVENT_DATE]
- Time: [START_TIME] to [END_TIME]
- Location: [VENUE_ADDRESS]
- Activities: [DESCRIPTION_OF_ACTIVITIES]

## 2. COMPENSATION
Company agrees to pay Athlete:
- Appearance fee: $[AMOUNT]
- Payment timing: [PAYMENT_TERMS]

## 3. COMPANY RESPONSIBILITIES
Company will provide:
- Transportation to/from venue (or reimbursement of $[TRAVEL_AMOUNT])
- Meals during the event
- Security if needed
- Any required materials or equipment

## 4. ATHLETE RESPONSIBILITIES
Athlete agrees to:
- Arrive on time and stay for the agreed duration
- Engage positively with attendees
- Wear [ATTIRE_REQUIREMENTS]
- Not wear competitor branding

## 5. CANCELLATION
- If Company cancels within 48 hours, full fee is due
- If Athlete cancels without cause, no fee is due
- Force majeure events excuse both parties

## 6. NCAA COMPLIANCE
Athlete will disclose this Agreement to their school's compliance office as required.

## 7. LIMITATION OF LIABILITY
Neither party shall be liable for indirect or consequential damages.

**AGREED AND ACCEPTED:**

___________________________ Date: ___________
[COMPANY_NAME]

___________________________ Date: ___________
[ATHLETE_NAME]`,
        version: 1,
      },
    }),
    prisma.contractTemplate.create({
      data: {
        name: 'Autograph Session Agreement',
        dealType: 'AUTOGRAPH',
        description: 'Agreement for paid autograph signing sessions',
        templateContent: `# AUTOGRAPH SESSION AGREEMENT

This Agreement is entered into as of [DATE] between:

**ORGANIZER:** [ORGANIZER_NAME] ("Organizer")
**ATHLETE:** [ATHLETE_NAME] ("Athlete")

## 1. SESSION DETAILS
- Date: [SESSION_DATE]
- Duration: [DURATION] hours
- Location: [VENUE]
- Items to sign: [ITEM_TYPES]
- Estimated number of items: [QUANTITY]

## 2. COMPENSATION
- Per-item rate: $[PER_ITEM] OR
- Flat fee: $[FLAT_FEE]
- Payment due: Within [PAYMENT_DAYS] days of session

## 3. SESSION REQUIREMENTS
- Athlete will sign items for the agreed duration
- Athlete may take reasonable breaks
- Athlete may decline to sign inappropriate items
- Organizer will manage the queue and crowd control

## 4. ITEMS AND AUTHENTICATION
- Organizer will provide items to be signed OR
- Items will be provided by purchasers
- Authentication certificates: [YES/NO]

## 5. NCAA COMPLIANCE
Athlete confirms this Agreement complies with NCAA NIL regulations and will be disclosed to their institution.

**AGREED AND ACCEPTED:**

___________________________ Date: ___________
[ORGANIZER_NAME]

___________________________ Date: ___________
[ATHLETE_NAME]`,
        version: 1,
      },
    }),
  ])

  console.log('Created contract templates:', templates.length)

  // ============================================================================
  // OPPORTUNITY BRANDS
  // ============================================================================
  const opportunityBrands = await Promise.all([
    // === NATIONAL BRANDS - FOOD & BEVERAGE ===
    prisma.opportunityBrand.create({
      data: {
        name: 'Celsius',
        description: 'Energy drink brand actively seeking athlete and fitness influencer partnerships.',
        industry: 'food_beverage',
        subcategory: 'energy_drinks',
        websiteUrl: 'https://celsius.com',
        applicationUrl: 'https://celsius.com/pages/ambassador',
        reach: 'NATIONAL',
        headquarters: 'Boca Raton, FL',
        activeStates: ['CA', 'TX', 'FL', 'NY', 'AZ'],
        activeMetros: [],
        schoolPartnerships: [],
        targetCreatorTypes: ['COLLEGE_ATHLETE', 'INFLUENCER'],
        targetSports: ['all'],
        targetNiches: ['fitness', 'health', 'sports'],
        minFollowers: 5000,
        preferredPlatforms: ['instagram', 'tiktok'],
        typicalDealTypes: ['SOCIAL_POST', 'APPEARANCE'],
        budgetTier: 'SMALL',
        avgDealValueMin: 500,
        avgDealValueMax: 3000,
        responseRate: 'MEDIUM',
        paymentReliability: 'GOOD',
        isActive: true,
      },
    }),
    prisma.opportunityBrand.create({
      data: {
        name: 'Gatorade',
        description: 'Sports drink giant with robust NIL program for college athletes.',
        industry: 'food_beverage',
        subcategory: 'sports_drinks',
        websiteUrl: 'https://gatorade.com',
        reach: 'NATIONAL',
        headquarters: 'Chicago, IL',
        activeStates: ['CA', 'TX', 'FL', 'NY', 'OH', 'MI'],
        activeMetros: [],
        schoolPartnerships: ['Stanford', 'Cal'],
        targetCreatorTypes: ['COLLEGE_ATHLETE', 'PRO_ATHLETE'],
        targetSports: ['football', 'basketball', 'soccer', 'track'],
        targetNiches: ['sports', 'fitness'],
        minFollowers: 10000,
        preferredPlatforms: ['instagram', 'tiktok', 'youtube'],
        typicalDealTypes: ['SOCIAL_POST', 'LICENSING'],
        budgetTier: 'MID',
        avgDealValueMin: 2000,
        avgDealValueMax: 15000,
        responseRate: 'LOW',
        paymentReliability: 'EXCELLENT',
        isActive: true,
        isPremiumPartner: true,
      },
    }),
    prisma.opportunityBrand.create({
      data: {
        name: 'PRIME Hydration',
        description: 'Fast-growing hydration brand by Logan Paul & KSI, very creator-friendly.',
        industry: 'food_beverage',
        subcategory: 'sports_drinks',
        websiteUrl: 'https://drinkprime.com',
        reach: 'NATIONAL',
        headquarters: 'Los Angeles, CA',
        activeStates: ['CA', 'TX', 'FL', 'NY'],
        activeMetros: ['Los Angeles', 'San Francisco Bay Area'],
        schoolPartnerships: [],
        targetCreatorTypes: ['COLLEGE_ATHLETE', 'INFLUENCER', 'STREAMER', 'YOUTUBER'],
        targetSports: ['all'],
        targetNiches: ['fitness', 'gaming', 'entertainment'],
        minFollowers: 10000,
        preferredPlatforms: ['instagram', 'tiktok', 'youtube'],
        typicalDealTypes: ['SOCIAL_POST'],
        budgetTier: 'SMALL',
        avgDealValueMin: 500,
        avgDealValueMax: 5000,
        responseRate: 'MEDIUM',
        paymentReliability: 'GOOD',
        isActive: true,
      },
    }),
    prisma.opportunityBrand.create({
      data: {
        name: 'Chipotle',
        description: 'Fast-casual restaurant with active NIL and creator programs.',
        industry: 'food_beverage',
        subcategory: 'restaurants',
        websiteUrl: 'https://chipotle.com',
        reach: 'NATIONAL',
        headquarters: 'Newport Beach, CA',
        activeStates: ['CA', 'TX', 'FL', 'NY', 'CO'],
        activeMetros: [],
        schoolPartnerships: [],
        targetCreatorTypes: ['COLLEGE_ATHLETE', 'INFLUENCER'],
        targetSports: ['all'],
        targetNiches: ['food', 'lifestyle'],
        minFollowers: 5000,
        preferredPlatforms: ['instagram', 'tiktok'],
        typicalDealTypes: ['SOCIAL_POST'],
        budgetTier: 'SMALL',
        avgDealValueMin: 300,
        avgDealValueMax: 2000,
        paysProductOnly: false,
        responseRate: 'MEDIUM',
        paymentReliability: 'EXCELLENT',
        isActive: true,
      },
    }),

    // === NATIONAL BRANDS - APPAREL ===
    prisma.opportunityBrand.create({
      data: {
        name: 'Gymshark',
        description: 'Fitness apparel brand with extensive athlete ambassador program.',
        industry: 'apparel',
        subcategory: 'athletic_wear',
        websiteUrl: 'https://gymshark.com',
        applicationUrl: 'https://gymshark.com/pages/athletes',
        reach: 'INTERNATIONAL',
        headquarters: 'Solihull, UK',
        activeStates: ['CA', 'TX', 'FL', 'NY'],
        activeMetros: [],
        schoolPartnerships: [],
        targetCreatorTypes: ['COLLEGE_ATHLETE', 'INFLUENCER'],
        targetSports: ['all'],
        targetNiches: ['fitness', 'bodybuilding', 'crossfit'],
        minFollowers: 10000,
        preferredPlatforms: ['instagram', 'tiktok', 'youtube'],
        typicalDealTypes: ['SOCIAL_POST', 'LICENSING'],
        budgetTier: 'SMALL',
        avgDealValueMin: 500,
        avgDealValueMax: 3000,
        paysProductOnly: false,
        responseRate: 'MEDIUM',
        paymentReliability: 'GOOD',
        isActive: true,
      },
    }),
    prisma.opportunityBrand.create({
      data: {
        name: 'Lululemon',
        description: 'Premium athletic apparel with ambassador program for athletes.',
        industry: 'apparel',
        subcategory: 'athletic_wear',
        websiteUrl: 'https://lululemon.com',
        reach: 'NATIONAL',
        headquarters: 'Vancouver, BC',
        activeStates: ['CA', 'TX', 'NY', 'CO'],
        activeMetros: ['San Francisco Bay Area', 'Los Angeles'],
        schoolPartnerships: [],
        targetCreatorTypes: ['COLLEGE_ATHLETE', 'INFLUENCER'],
        targetSports: ['track', 'yoga', 'running'],
        targetNiches: ['fitness', 'wellness', 'yoga'],
        minFollowers: 5000,
        preferredPlatforms: ['instagram'],
        typicalDealTypes: ['SOCIAL_POST', 'APPEARANCE'],
        budgetTier: 'MID',
        avgDealValueMin: 1000,
        avgDealValueMax: 5000,
        responseRate: 'LOW',
        paymentReliability: 'EXCELLENT',
        isActive: true,
      },
    }),
    prisma.opportunityBrand.create({
      data: {
        name: 'NOBULL',
        description: 'Training footwear and apparel, official CrossFit sponsor.',
        industry: 'apparel',
        subcategory: 'athletic_wear',
        websiteUrl: 'https://nobullproject.com',
        reach: 'NATIONAL',
        headquarters: 'Boston, MA',
        activeStates: ['CA', 'TX', 'FL', 'NY'],
        activeMetros: [],
        schoolPartnerships: [],
        targetCreatorTypes: ['COLLEGE_ATHLETE', 'INFLUENCER'],
        targetSports: ['crossfit', 'track', 'football'],
        targetNiches: ['fitness', 'crossfit', 'training'],
        minFollowers: 5000,
        preferredPlatforms: ['instagram', 'tiktok'],
        typicalDealTypes: ['SOCIAL_POST'],
        budgetTier: 'SMALL',
        avgDealValueMin: 500,
        avgDealValueMax: 2500,
        responseRate: 'MEDIUM',
        paymentReliability: 'GOOD',
        isActive: true,
      },
    }),

    // === TECH & GAMING ===
    prisma.opportunityBrand.create({
      data: {
        name: 'SteelSeries',
        description: 'Gaming peripherals brand seeking streamers and esports athletes.',
        industry: 'tech',
        subcategory: 'gaming_peripherals',
        websiteUrl: 'https://steelseries.com',
        reach: 'INTERNATIONAL',
        headquarters: 'Chicago, IL',
        activeStates: ['CA', 'TX', 'WA', 'NY'],
        activeMetros: [],
        schoolPartnerships: [],
        targetCreatorTypes: ['STREAMER', 'YOUTUBER', 'COLLEGE_ATHLETE'],
        targetSports: ['esports'],
        targetNiches: ['gaming', 'esports', 'tech'],
        minFollowers: 5000,
        preferredPlatforms: ['twitch', 'youtube', 'tiktok'],
        typicalDealTypes: ['SOCIAL_POST', 'LICENSING'],
        budgetTier: 'SMALL',
        avgDealValueMin: 300,
        avgDealValueMax: 2000,
        paysProductOnly: false,
        responseRate: 'HIGH',
        paymentReliability: 'GOOD',
        isActive: true,
      },
    }),
    prisma.opportunityBrand.create({
      data: {
        name: 'Logitech G',
        description: 'Gaming gear brand with active streamer and creator program.',
        industry: 'tech',
        subcategory: 'gaming_peripherals',
        websiteUrl: 'https://logitechg.com',
        reach: 'INTERNATIONAL',
        headquarters: 'Newark, CA',
        activeStates: ['CA', 'TX', 'WA'],
        activeMetros: ['San Francisco Bay Area', 'Seattle'],
        schoolPartnerships: [],
        targetCreatorTypes: ['STREAMER', 'YOUTUBER'],
        targetSports: ['esports'],
        targetNiches: ['gaming', 'esports', 'tech'],
        minFollowers: 10000,
        preferredPlatforms: ['twitch', 'youtube'],
        typicalDealTypes: ['SOCIAL_POST', 'LICENSING'],
        budgetTier: 'MID',
        avgDealValueMin: 1000,
        avgDealValueMax: 5000,
        responseRate: 'MEDIUM',
        paymentReliability: 'EXCELLENT',
        isActive: true,
      },
    }),
    prisma.opportunityBrand.create({
      data: {
        name: 'Razer',
        description: 'Gaming lifestyle brand for gamers and streamers.',
        industry: 'tech',
        subcategory: 'gaming_peripherals',
        websiteUrl: 'https://razer.com',
        reach: 'INTERNATIONAL',
        headquarters: 'Irvine, CA',
        activeStates: ['CA', 'TX', 'WA', 'NY'],
        activeMetros: [],
        schoolPartnerships: [],
        targetCreatorTypes: ['STREAMER', 'YOUTUBER'],
        targetSports: ['esports'],
        targetNiches: ['gaming', 'esports'],
        minFollowers: 10000,
        preferredPlatforms: ['twitch', 'youtube', 'tiktok'],
        typicalDealTypes: ['SOCIAL_POST'],
        budgetTier: 'MID',
        avgDealValueMin: 1000,
        avgDealValueMax: 8000,
        responseRate: 'MEDIUM',
        paymentReliability: 'GOOD',
        isActive: true,
      },
    }),
    prisma.opportunityBrand.create({
      data: {
        name: 'SCUF Gaming',
        description: 'Custom controllers brand seeking gaming influencers.',
        industry: 'tech',
        subcategory: 'gaming_peripherals',
        websiteUrl: 'https://scufgaming.com',
        reach: 'NATIONAL',
        headquarters: 'Atlanta, GA',
        activeStates: ['CA', 'TX', 'FL', 'GA'],
        activeMetros: [],
        schoolPartnerships: [],
        targetCreatorTypes: ['STREAMER', 'YOUTUBER'],
        targetSports: ['esports'],
        targetNiches: ['gaming', 'esports'],
        minFollowers: 5000,
        preferredPlatforms: ['twitch', 'youtube', 'tiktok'],
        typicalDealTypes: ['SOCIAL_POST'],
        budgetTier: 'MICRO',
        avgDealValueMin: 200,
        avgDealValueMax: 1000,
        paysProductOnly: false,
        responseRate: 'HIGH',
        paymentReliability: 'GOOD',
        isActive: true,
      },
    }),

    // === SUPPLEMENTS & NUTRITION ===
    prisma.opportunityBrand.create({
      data: {
        name: 'Optimum Nutrition',
        description: 'Sports nutrition leader with athlete ambassador program.',
        industry: 'supplements',
        subcategory: 'protein',
        websiteUrl: 'https://optimumnutrition.com',
        reach: 'NATIONAL',
        headquarters: 'Downers Grove, IL',
        activeStates: ['CA', 'TX', 'FL', 'NY'],
        activeMetros: [],
        schoolPartnerships: [],
        targetCreatorTypes: ['COLLEGE_ATHLETE', 'INFLUENCER'],
        targetSports: ['all'],
        targetNiches: ['fitness', 'bodybuilding', 'sports'],
        minFollowers: 5000,
        preferredPlatforms: ['instagram', 'tiktok', 'youtube'],
        typicalDealTypes: ['SOCIAL_POST'],
        budgetTier: 'SMALL',
        avgDealValueMin: 300,
        avgDealValueMax: 2000,
        responseRate: 'MEDIUM',
        paymentReliability: 'GOOD',
        isActive: true,
      },
    }),
    prisma.opportunityBrand.create({
      data: {
        name: 'Ghost Lifestyle',
        description: 'Lifestyle supplement brand known for creative collabs.',
        industry: 'supplements',
        subcategory: 'pre_workout',
        websiteUrl: 'https://ghostlifestyle.com',
        reach: 'NATIONAL',
        headquarters: 'Chicago, IL',
        activeStates: ['CA', 'TX', 'FL', 'NY', 'IL'],
        activeMetros: [],
        schoolPartnerships: [],
        targetCreatorTypes: ['COLLEGE_ATHLETE', 'INFLUENCER', 'STREAMER'],
        targetSports: ['all'],
        targetNiches: ['fitness', 'gaming', 'lifestyle'],
        minFollowers: 5000,
        preferredPlatforms: ['instagram', 'tiktok', 'youtube'],
        typicalDealTypes: ['SOCIAL_POST'],
        budgetTier: 'SMALL',
        avgDealValueMin: 500,
        avgDealValueMax: 3000,
        responseRate: 'HIGH',
        paymentReliability: 'GOOD',
        isActive: true,
      },
    }),

    // === MUSIC & AUDIO ===
    prisma.opportunityBrand.create({
      data: {
        name: 'DistroKid',
        description: 'Music distribution platform partnering with independent artists.',
        industry: 'music',
        subcategory: 'distribution',
        websiteUrl: 'https://distrokid.com',
        reach: 'INTERNATIONAL',
        headquarters: 'New York, NY',
        activeStates: ['CA', 'TX', 'NY', 'FL', 'TN'],
        activeMetros: ['Los Angeles', 'Nashville', 'New York'],
        schoolPartnerships: [],
        targetCreatorTypes: ['MUSICIAN'],
        targetSports: [],
        targetNiches: ['music', 'indie', 'hiphop', 'pop'],
        minFollowers: 1000,
        preferredPlatforms: ['instagram', 'tiktok', 'youtube', 'spotify'],
        typicalDealTypes: ['SOCIAL_POST', 'LICENSING'],
        budgetTier: 'MICRO',
        avgDealValueMin: 100,
        avgDealValueMax: 1000,
        responseRate: 'HIGH',
        paymentReliability: 'GOOD',
        isActive: true,
      },
    }),
    prisma.opportunityBrand.create({
      data: {
        name: 'Splice',
        description: 'Sample and plugin platform seeking music creators.',
        industry: 'music',
        subcategory: 'production',
        websiteUrl: 'https://splice.com',
        reach: 'INTERNATIONAL',
        headquarters: 'New York, NY',
        activeStates: ['CA', 'NY', 'FL', 'TX'],
        activeMetros: ['Los Angeles', 'New York'],
        schoolPartnerships: [],
        targetCreatorTypes: ['MUSICIAN', 'YOUTUBER'],
        targetSports: [],
        targetNiches: ['music', 'production', 'beatmaking'],
        minFollowers: 5000,
        preferredPlatforms: ['youtube', 'instagram', 'tiktok'],
        typicalDealTypes: ['SOCIAL_POST'],
        budgetTier: 'SMALL',
        avgDealValueMin: 300,
        avgDealValueMax: 2000,
        responseRate: 'MEDIUM',
        paymentReliability: 'GOOD',
        isActive: true,
      },
    }),
    prisma.opportunityBrand.create({
      data: {
        name: 'Shure',
        description: 'Professional audio equipment for musicians and podcasters.',
        industry: 'tech',
        subcategory: 'audio_equipment',
        websiteUrl: 'https://shure.com',
        reach: 'INTERNATIONAL',
        headquarters: 'Niles, IL',
        activeStates: ['CA', 'TX', 'NY', 'TN'],
        activeMetros: [],
        schoolPartnerships: [],
        targetCreatorTypes: ['MUSICIAN', 'PODCASTER', 'STREAMER'],
        targetSports: [],
        targetNiches: ['music', 'podcasting', 'streaming'],
        minFollowers: 10000,
        preferredPlatforms: ['youtube', 'twitch', 'instagram'],
        typicalDealTypes: ['SOCIAL_POST', 'LICENSING'],
        budgetTier: 'MID',
        avgDealValueMin: 500,
        avgDealValueMax: 5000,
        responseRate: 'LOW',
        paymentReliability: 'EXCELLENT',
        isActive: true,
      },
    }),

    // === BAY AREA LOCAL/REGIONAL ===
    prisma.opportunityBrand.create({
      data: {
        name: 'Philz Coffee',
        description: 'Bay Area coffee chain seeking local influencers and athletes.',
        industry: 'food_beverage',
        subcategory: 'coffee',
        websiteUrl: 'https://philzcoffee.com',
        reach: 'REGIONAL',
        headquarters: 'San Francisco, CA',
        activeStates: ['CA'],
        activeMetros: ['San Francisco Bay Area', 'Los Angeles'],
        schoolPartnerships: ['Stanford', 'Cal', 'San Jose State', 'Santa Clara'],
        targetCreatorTypes: ['COLLEGE_ATHLETE', 'INFLUENCER'],
        targetSports: ['all'],
        targetNiches: ['lifestyle', 'coffee', 'local'],
        minFollowers: 1000,
        preferredPlatforms: ['instagram', 'tiktok'],
        typicalDealTypes: ['SOCIAL_POST'],
        budgetTier: 'MICRO',
        avgDealValueMin: 100,
        avgDealValueMax: 500,
        paysProductOnly: false,
        responseRate: 'HIGH',
        paymentReliability: 'GOOD',
        isActive: true,
        notes: 'Very receptive to Bay Area college athletes. Often does product + cash deals.',
      },
    }),
    prisma.opportunityBrand.create({
      data: {
        name: 'Equinox Bay Area',
        description: 'Luxury fitness clubs seeking local athlete ambassadors.',
        industry: 'fitness',
        subcategory: 'gyms',
        websiteUrl: 'https://equinox.com',
        reach: 'LOCAL',
        headquarters: 'Palo Alto, CA',
        activeStates: ['CA'],
        activeMetros: ['San Francisco Bay Area'],
        schoolPartnerships: ['Stanford'],
        targetCreatorTypes: ['COLLEGE_ATHLETE', 'INFLUENCER'],
        targetSports: ['all'],
        targetNiches: ['fitness', 'luxury', 'wellness'],
        minFollowers: 2000,
        preferredPlatforms: ['instagram'],
        typicalDealTypes: ['SOCIAL_POST', 'APPEARANCE'],
        budgetTier: 'SMALL',
        avgDealValueMin: 500,
        avgDealValueMax: 2000,
        responseRate: 'MEDIUM',
        paymentReliability: 'EXCELLENT',
        isActive: true,
        notes: 'Often offers free membership + cash for content creation.',
      },
    }),
    prisma.opportunityBrand.create({
      data: {
        name: 'Ikes Love & Sandwiches',
        description: 'Popular sandwich chain with locations near Bay Area campuses.',
        industry: 'food_beverage',
        subcategory: 'restaurants',
        websiteUrl: 'https://ilikeikesplace.com',
        reach: 'REGIONAL',
        headquarters: 'San Francisco, CA',
        activeStates: ['CA', 'AZ'],
        activeMetros: ['San Francisco Bay Area'],
        schoolPartnerships: ['Stanford', 'Cal', 'San Jose State'],
        targetCreatorTypes: ['COLLEGE_ATHLETE'],
        targetSports: ['all'],
        targetNiches: ['food', 'college'],
        minFollowers: 500,
        preferredPlatforms: ['instagram', 'tiktok'],
        typicalDealTypes: ['SOCIAL_POST'],
        budgetTier: 'MICRO',
        avgDealValueMin: 100,
        avgDealValueMax: 400,
        paysProductOnly: false,
        responseRate: 'HIGH',
        paymentReliability: 'GOOD',
        isActive: true,
        notes: 'Known for naming sandwiches after local athletes. Great for building relationship.',
      },
    }),
    prisma.opportunityBrand.create({
      data: {
        name: 'San Jose Sharks',
        description: 'NHL team seeking local athletes for community partnerships.',
        industry: 'sports',
        subcategory: 'professional_teams',
        websiteUrl: 'https://sjsharks.com',
        reach: 'LOCAL',
        headquarters: 'San Jose, CA',
        activeStates: ['CA'],
        activeMetros: ['San Francisco Bay Area'],
        schoolPartnerships: ['San Jose State', 'Santa Clara'],
        targetCreatorTypes: ['COLLEGE_ATHLETE'],
        targetSports: ['hockey', 'basketball', 'football'],
        targetNiches: ['sports', 'local'],
        minFollowers: 1000,
        preferredPlatforms: ['instagram', 'tiktok'],
        typicalDealTypes: ['APPEARANCE', 'SOCIAL_POST'],
        budgetTier: 'SMALL',
        avgDealValueMin: 500,
        avgDealValueMax: 2500,
        responseRate: 'MEDIUM',
        paymentReliability: 'EXCELLENT',
        isActive: true,
      },
    }),
    prisma.opportunityBrand.create({
      data: {
        name: 'Golden State Warriors Foundation',
        description: 'Community arm of GSW seeking Bay Area athletes for events.',
        industry: 'sports',
        subcategory: 'professional_teams',
        websiteUrl: 'https://warriors.com/community',
        reach: 'LOCAL',
        headquarters: 'San Francisco, CA',
        activeStates: ['CA'],
        activeMetros: ['San Francisco Bay Area'],
        schoolPartnerships: ['Stanford', 'Cal'],
        targetCreatorTypes: ['COLLEGE_ATHLETE'],
        targetSports: ['basketball'],
        targetNiches: ['sports', 'community', 'local'],
        minFollowers: 2000,
        preferredPlatforms: ['instagram'],
        typicalDealTypes: ['APPEARANCE'],
        budgetTier: 'MID',
        avgDealValueMin: 1000,
        avgDealValueMax: 5000,
        responseRate: 'LOW',
        paymentReliability: 'EXCELLENT',
        isActive: true,
        isPremiumPartner: true,
      },
    }),

    // === CALIFORNIA REGIONAL ===
    prisma.opportunityBrand.create({
      data: {
        name: 'In-N-Out Burger',
        description: 'Iconic California burger chain occasionally does athlete deals.',
        industry: 'food_beverage',
        subcategory: 'restaurants',
        websiteUrl: 'https://in-n-out.com',
        reach: 'REGIONAL',
        headquarters: 'Irvine, CA',
        activeStates: ['CA', 'NV', 'AZ', 'TX'],
        activeMetros: ['Los Angeles', 'San Francisco Bay Area'],
        schoolPartnerships: [],
        targetCreatorTypes: ['COLLEGE_ATHLETE', 'INFLUENCER'],
        targetSports: ['all'],
        targetNiches: ['food', 'lifestyle'],
        minFollowers: 10000,
        preferredPlatforms: ['instagram', 'tiktok'],
        typicalDealTypes: ['SOCIAL_POST'],
        budgetTier: 'MID',
        avgDealValueMin: 1000,
        avgDealValueMax: 5000,
        responseRate: 'LOW',
        paymentReliability: 'EXCELLENT',
        isActive: true,
        notes: 'Very selective but pays well. Known for low volume, high quality partnerships.',
      },
    }),

    // === FINANCIAL SERVICES ===
    prisma.opportunityBrand.create({
      data: {
        name: 'Current',
        description: 'Mobile banking app targeting Gen Z with creator partnerships.',
        industry: 'finance',
        subcategory: 'banking',
        websiteUrl: 'https://current.com',
        reach: 'NATIONAL',
        headquarters: 'New York, NY',
        activeStates: ['CA', 'TX', 'FL', 'NY'],
        activeMetros: [],
        schoolPartnerships: [],
        targetCreatorTypes: ['COLLEGE_ATHLETE', 'INFLUENCER', 'STREAMER'],
        targetSports: ['all'],
        targetNiches: ['finance', 'lifestyle', 'college'],
        minFollowers: 5000,
        preferredPlatforms: ['instagram', 'tiktok', 'youtube'],
        typicalDealTypes: ['SOCIAL_POST'],
        budgetTier: 'SMALL',
        avgDealValueMin: 500,
        avgDealValueMax: 2500,
        responseRate: 'HIGH',
        paymentReliability: 'GOOD',
        isActive: true,
      },
    }),
    prisma.opportunityBrand.create({
      data: {
        name: 'Cash App',
        description: 'Mobile payment app with active influencer and athlete program.',
        industry: 'finance',
        subcategory: 'payments',
        websiteUrl: 'https://cash.app',
        reach: 'NATIONAL',
        headquarters: 'San Francisco, CA',
        activeStates: ['CA', 'TX', 'FL', 'NY', 'GA'],
        activeMetros: ['San Francisco Bay Area'],
        schoolPartnerships: [],
        targetCreatorTypes: ['COLLEGE_ATHLETE', 'INFLUENCER', 'MUSICIAN', 'STREAMER'],
        targetSports: ['all'],
        targetNiches: ['music', 'sports', 'lifestyle'],
        minFollowers: 10000,
        preferredPlatforms: ['instagram', 'tiktok', 'twitter'],
        typicalDealTypes: ['SOCIAL_POST'],
        budgetTier: 'MID',
        avgDealValueMin: 1000,
        avgDealValueMax: 10000,
        responseRate: 'MEDIUM',
        paymentReliability: 'EXCELLENT',
        isActive: true,
      },
    }),

    // === TRADING CARDS & COLLECTIBLES ===
    prisma.opportunityBrand.create({
      data: {
        name: 'Topps',
        description: 'Trading card company with NIL card deals for college athletes.',
        industry: 'collectibles',
        subcategory: 'trading_cards',
        websiteUrl: 'https://topps.com',
        reach: 'NATIONAL',
        headquarters: 'New York, NY',
        activeStates: ['CA', 'TX', 'FL', 'NY', 'OH'],
        activeMetros: [],
        schoolPartnerships: [],
        targetCreatorTypes: ['COLLEGE_ATHLETE'],
        targetSports: ['baseball', 'football', 'basketball'],
        targetNiches: ['sports', 'collectibles'],
        minFollowers: 5000,
        preferredPlatforms: ['instagram', 'twitter'],
        typicalDealTypes: ['LICENSING', 'AUTOGRAPH'],
        budgetTier: 'MID',
        avgDealValueMin: 1000,
        avgDealValueMax: 10000,
        responseRate: 'MEDIUM',
        paymentReliability: 'EXCELLENT',
        isActive: true,
      },
    }),
    prisma.opportunityBrand.create({
      data: {
        name: 'Panini America',
        description: 'Major trading card company actively signing college athletes.',
        industry: 'collectibles',
        subcategory: 'trading_cards',
        websiteUrl: 'https://paniniamerica.net',
        reach: 'NATIONAL',
        headquarters: 'Irving, TX',
        activeStates: ['CA', 'TX', 'FL', 'OH', 'AL'],
        activeMetros: [],
        schoolPartnerships: [],
        targetCreatorTypes: ['COLLEGE_ATHLETE'],
        targetSports: ['football', 'basketball', 'baseball'],
        targetNiches: ['sports', 'collectibles'],
        minFollowers: 5000,
        preferredPlatforms: ['instagram', 'twitter'],
        typicalDealTypes: ['LICENSING', 'AUTOGRAPH'],
        budgetTier: 'MID',
        avgDealValueMin: 2000,
        avgDealValueMax: 15000,
        responseRate: 'MEDIUM',
        paymentReliability: 'EXCELLENT',
        isActive: true,
        isPremiumPartner: true,
      },
    }),

    // === LIFESTYLE & WELLNESS ===
    prisma.opportunityBrand.create({
      data: {
        name: 'Therabody',
        description: 'Recovery tech brand (Theragun) seeking athlete ambassadors.',
        industry: 'wellness',
        subcategory: 'recovery',
        websiteUrl: 'https://therabody.com',
        reach: 'NATIONAL',
        headquarters: 'Los Angeles, CA',
        activeStates: ['CA', 'TX', 'FL', 'NY'],
        activeMetros: ['Los Angeles', 'San Francisco Bay Area'],
        schoolPartnerships: [],
        targetCreatorTypes: ['COLLEGE_ATHLETE', 'PRO_ATHLETE', 'INFLUENCER'],
        targetSports: ['all'],
        targetNiches: ['fitness', 'recovery', 'wellness'],
        minFollowers: 10000,
        preferredPlatforms: ['instagram', 'tiktok', 'youtube'],
        typicalDealTypes: ['SOCIAL_POST', 'LICENSING'],
        budgetTier: 'MID',
        avgDealValueMin: 1000,
        avgDealValueMax: 8000,
        responseRate: 'MEDIUM',
        paymentReliability: 'EXCELLENT',
        isActive: true,
      },
    }),
    prisma.opportunityBrand.create({
      data: {
        name: 'Hyperice',
        description: 'Recovery and movement technology for athletes.',
        industry: 'wellness',
        subcategory: 'recovery',
        websiteUrl: 'https://hyperice.com',
        reach: 'NATIONAL',
        headquarters: 'Irvine, CA',
        activeStates: ['CA', 'TX', 'FL', 'NY'],
        activeMetros: [],
        schoolPartnerships: [],
        targetCreatorTypes: ['COLLEGE_ATHLETE', 'PRO_ATHLETE'],
        targetSports: ['all'],
        targetNiches: ['fitness', 'recovery', 'sports'],
        minFollowers: 10000,
        preferredPlatforms: ['instagram', 'youtube'],
        typicalDealTypes: ['SOCIAL_POST', 'LICENSING'],
        budgetTier: 'MID',
        avgDealValueMin: 1500,
        avgDealValueMax: 10000,
        responseRate: 'LOW',
        paymentReliability: 'EXCELLENT',
        isActive: true,
      },
    }),

    // === MICRO-INFLUENCER FRIENDLY ===
    prisma.opportunityBrand.create({
      data: {
        name: 'MVMT Watches',
        description: 'Affordable watch brand with extensive micro-influencer program.',
        industry: 'accessories',
        subcategory: 'watches',
        websiteUrl: 'https://mvmt.com',
        applicationUrl: 'https://mvmt.com/pages/ambassador',
        reach: 'NATIONAL',
        headquarters: 'Los Angeles, CA',
        activeStates: ['CA', 'TX', 'FL', 'NY'],
        activeMetros: [],
        schoolPartnerships: [],
        targetCreatorTypes: ['COLLEGE_ATHLETE', 'INFLUENCER'],
        targetSports: ['all'],
        targetNiches: ['fashion', 'lifestyle'],
        minFollowers: 2000,
        maxFollowers: 50000,
        preferredPlatforms: ['instagram'],
        typicalDealTypes: ['SOCIAL_POST'],
        budgetTier: 'MICRO',
        avgDealValueMin: 100,
        avgDealValueMax: 500,
        paysProductOnly: false,
        responseRate: 'HIGH',
        paymentReliability: 'GOOD',
        isActive: true,
        notes: 'Great for building portfolio. Often first brand deal for many creators.',
      },
    }),
    prisma.opportunityBrand.create({
      data: {
        name: 'Daniel Wellington',
        description: 'Watch brand known for working with smaller creators.',
        industry: 'accessories',
        subcategory: 'watches',
        websiteUrl: 'https://danielwellington.com',
        reach: 'INTERNATIONAL',
        headquarters: 'Stockholm, Sweden',
        activeStates: ['CA', 'TX', 'FL', 'NY'],
        activeMetros: [],
        schoolPartnerships: [],
        targetCreatorTypes: ['COLLEGE_ATHLETE', 'INFLUENCER'],
        targetSports: ['all'],
        targetNiches: ['fashion', 'lifestyle'],
        minFollowers: 1000,
        maxFollowers: 100000,
        preferredPlatforms: ['instagram'],
        typicalDealTypes: ['SOCIAL_POST'],
        budgetTier: 'MICRO',
        avgDealValueMin: 50,
        avgDealValueMax: 300,
        paysProductOnly: true,
        responseRate: 'HIGH',
        paymentReliability: 'GOOD',
        isActive: true,
        notes: 'Often product-only but good for portfolio building.',
      },
    }),
  ])

  console.log('Created opportunity brands:', opportunityBrands.length)

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
