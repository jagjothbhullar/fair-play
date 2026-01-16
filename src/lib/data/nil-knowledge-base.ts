// NIL Knowledge Base - Current as of January 2026
// Sources: ESPN, On3, Opendorse, CSC/NIL Go, CNBC, Yahoo Sports, Washington Post
// This file contains current NIL landscape data for AI-powered analysis

// ============================================================================
// MARKET DATA (2025-2026)
// ============================================================================

export const nilMarketData = {
  // Opendorse NIL at 3 Report projections
  marketSize: {
    fy2024: 1_170_000_000,     // $1.17B
    fy2025: 1_900_000_000,     // $1.9B (football alone)
    fy2026Projected: 2_750_000_000, // $2.75B total
  },

  // Where the money comes from
  collectiveShare: 0.816, // 81.6% of all NIL compensation comes from collectives

  // Premium multipliers from Opendorse data
  transferPremium: 1.7,  // Athletes who transfer earn 1.7x more
  agentPremium: 5.3,     // Athletes with agents earn 5.3x more

  // Key insight: Huge gap between average and median
  averageNIL: 53643,
  medianNIL: 3371,
  percentEarningOver50k: 0.01, // Only 1% earn >$50K
}

// ============================================================================
// TOP ATHLETE VALUATIONS (On3 Data, January 2026)
// ============================================================================

export const topAthleteValuations = [
  { name: 'Arch Manning', sport: 'Football (QB)', school: 'Texas', valuation: 6_600_000, followers: 415_000 },
  { name: 'Shedeur Sanders', sport: 'Football (QB)', school: 'Colorado', valuation: 6_200_000, followers: 2_800_000 },
  { name: 'Travis Hunter', sport: 'Football (CB/WR)', school: 'Colorado', valuation: 5_100_000, followers: 3_300_000 },
  { name: 'Livvy Dunne', sport: 'Gymnastics', school: 'LSU', valuation: 4_200_000, followers: 13_700_000 },
  { name: 'Jeremiah Smith', sport: 'Football (WR)', school: 'Ohio State', valuation: 4_200_000, followers: 875_000 },
  { name: 'AJ Dybantsa', sport: 'Basketball', school: 'BYU', valuation: 7_000_000, followers: 500_000 }, // Pre-college record
]

// ============================================================================
// REVENUE SHARING CAP & STRUCTURE
// ============================================================================

export const revenueSharing = {
  // House v. NCAA Settlement (approved June 6, 2025, effective July 1, 2025)
  currentCap: 20_500_000, // $20.5M per school for 2025-26
  capGrowthRate: 0.04,    // 4% annual increase
  projectedCap2035: 33_000_000, // ~$33M by 2035

  // CRITICAL: Third-party NIL has NO CAP
  thirdPartyNILCapped: false,

  // What counts against cap vs exempt
  countsAgainstCap: [
    'Direct school revenue sharing payments',
    'First $2.5M of additional athletic scholarships',
  ],
  exemptFromCap: [
    'Third-party NIL deals (collectives)',
    'MMR partner deals (Playfly, Learfield)',
    'Corporate sponsorships directly to athletes',
    'Traditional NIL activities (autographs, appearances)',
  ],

  // Reality check: Schools are spending $25M+ while claiming compliance
  actualSpendingEstimate: 25_000_000, // Big football programs
}

// ============================================================================
// COLLEGE SPORTS COMMISSION (CSC) / NIL GO DATA
// ============================================================================

export const cscData = {
  // As of January 1, 2026
  totalDealsCleared: 17_321,
  totalValueCleared: 127_210_000, // $127.21M
  totalDealsRejected: 524,
  totalValueRejected: 14_940_000, // $14.94M
  rejectionRate: 0.10, // ~10% by value

  // Processing times
  resolvedWithin24Hours: 0.52, // 52%
  resolvedWithin7Days: 0.73,   // 73%

  // Athletes with deals
  athletesWithDeals: 10_848,
  footballMBBShare: 0.56, // 56% play football or men's basketball

  // Top rejection reasons
  rejectionReasons: [
    'No valid business purpose',
    'NIL rights "warehousing" without activation',
    'Payment not commensurate with fair market value (FMV)',
    'Payor association issues',
  ],

  // Disclosure threshold
  disclosureThreshold: 600, // $600+ must be reported
  disclosureDeadline: 30,   // 30 days after signing
}

// ============================================================================
// PROBLEMATIC CONTRACT CLAUSES (From ESPN Investigation)
// ============================================================================

export const problematicClauses = {
  // Transfer restrictions (SEC template)
  transferRestrictions: {
    severity: 'critical',
    redFlagLanguage: [
      'initiate, solicit, entertain, negotiate, accept or discuss',
      'immediately report contact from other schools',
      'failure to disclose',
    ],
    explanation: 'SEC template prohibits athletes from entertaining competing offers and requires reporting contact from other schools.',
    impact: 'Locks athletes in, limits future options, turns them into informants on their own recruitment.',
  },

  // Unilateral termination
  unilateralTermination: {
    severity: 'critical',
    redFlagLanguage: [
      'at any time...in sole and absolute discretion',
      'without penalty',
      'without cause',
    ],
    explanation: 'School can cancel contract at will; athlete bears all financial risk.',
    impact: 'One-sided risk allocation favoring institution.',
  },

  // Asymmetric buyouts
  asymmetricBuyouts: {
    severity: 'high',
    redFlagLanguage: [
      'full previous-year repayment',
      '50% remaining balance if school cancels',
      'repay if you transfer',
    ],
    explanation: 'Athletes must repay if they leave; schools owe nothing if they cut the athlete.',
    realWorldExample: 'UCF contract requires full previous-year repayment before signing elsewhere.',
  },

  // Employment status waivers
  employmentWaivers: {
    severity: 'critical',
    redFlagLanguage: [
      'not an employee',
      'waive future employee status',
      'accept as full compensation',
    ],
    explanation: 'Schools requiring athletes to waive potential employee classification rights.',
    legalRisk: 'May be challenged in future litigation.',
  },

  // Broad NIL rights grants
  broadRightsGrants: {
    severity: 'high',
    redFlagLanguage: [
      'signature, initials, photograph, gifs, visible tattoo artwork, voice',
      'derivative works',
      'sublicense to any and all third parties',
      'perpetual',
    ],
    explanation: 'Overly broad likeness rights that extend beyond reasonable scope.',
  },

  // Performance clauses (potential NCAA violation)
  performanceClauses: {
    severity: 'critical',
    redFlagLanguage: [
      'payment tied to playing time',
      'no redshirting without coaching staff consent',
      'medically cleared but sitting out',
    ],
    explanation: 'Tying compensation to athletic performance is "pay-for-play" - potential NCAA violation.',
    ncaaRule: 'NIL compensation must be tied to NIL activities, not athletic participation.',
  },

  // Confidentiality disparities
  confidentialityDisparities: {
    severity: 'medium',
    redFlagLanguage: [
      'athlete shall not disclose',
      'confidential terms',
    ],
    explanation: 'Athletes forbidden from discussing terms; schools face no such restriction.',
    impact: 'Prevents athletes from comparing deals and knowing market rates.',
  },
}

// ============================================================================
// NOTABLE DEALS & CASE STUDIES
// ============================================================================

export const notableDeals = [
  {
    name: 'Dante Moore',
    sport: 'Football (QB)',
    school: 'Oregon',
    amount: 2_300_000, // Current net worth per On3
    period: 'Ongoing',
    notes: 'Declined 2026 NFL Draft as projected top-2 pick to stay at Oregon. Partners: Nike, Beats by Dr. Dre, Raising Cane\'s. Shows NIL now competitive with NFL rookie contracts.',
    brands: ['Nike', 'Beats by Dr. Dre', 'Raising Cane\'s'],
  },
  {
    name: 'Brendan Sorsby',
    sport: 'Football (QB)',
    from: 'Cincinnati',
    to: 'Texas Tech',
    amount: 5_000_000,
    period: '1 season (2026)',
    notes: 'LSU offered $3.5M through Playfly. Shows elite QB market rate.',
  },
  {
    name: 'Demond Williams Jr.',
    sport: 'Football (QB)',
    school: 'Washington',
    amount: 4_000_000,
    incident: 'Signed $4M+ deal, entered transfer portal one day later, reversed after legal threats.',
    lesson: 'Buyout clauses are enforceable. Multi-year deals carry risk.',
  },
  {
    name: 'JT Toppin',
    sport: 'Basketball',
    school: 'Texas Tech',
    amount: 4_000_000,
    notes: 'Part of Texas Tech spending $10M+ on three athletes.',
  },
  {
    name: 'Bryce Underwood',
    sport: 'Football (QB)',
    school: 'Michigan',
    amount: 10_500_000,
    period: '4 years',
    notes: 'Flipped from LSU commitment. Largest reported college football NIL deal.',
  },
  {
    name: 'Hollywood Smothers',
    sport: 'Football (RB)',
    from: 'Alabama',
    to: 'Texas',
    notes: 'Alabama\'s NIL struggles caused loss of 6 top-100 portal players. Brand mystique no longer enough.',
  },
]

// ============================================================================
// PROGRAM VALUATIONS (CNBC 2025)
// ============================================================================

export const programValuations = [
  { school: 'Texas', valuation: 1_480_000_000, conference: 'SEC', rank: 1 },
  { school: 'Ohio State', valuation: 1_350_000_000, conference: 'Big Ten', rank: 2 },
  { school: 'Texas A&M', valuation: 1_320_000_000, conference: 'SEC', rank: 3 },
  { school: 'Georgia', valuation: 1_160_000_000, conference: 'SEC', rank: 4 },
  { school: 'Tennessee', valuation: 1_120_000_000, conference: 'SEC', rank: 5 },
  { school: 'Alabama', valuation: 1_100_000_000, conference: 'SEC', rank: 6 },
  { school: 'Michigan', valuation: 1_100_000_000, conference: 'Big Ten', rank: 7 },
  { school: 'USC', valuation: 1_100_000_000, conference: 'Big Ten', rank: 8 },
  { school: 'Oklahoma', valuation: 1_080_000_000, conference: 'SEC', rank: 9 },
  { school: 'Nebraska', valuation: 1_060_000_000, conference: 'Big Ten', rank: 10 },
]

// Conference TV money
export const conferenceTVDeals = {
  'Big Ten': { annualValue: 1_150_000_000, perSchool: 63_000_000 },
  'SEC': { annualValue: 710_000_000, perSchool: 52_500_000 },
  'Big 12': { annualValue: 380_000_000, perSchool: 31_666_666 }, // 2024 extension
}

// ============================================================================
// MULTIMEDIA RIGHTS PARTNERS
// ============================================================================

export const mmrPartners = {
  playfly: {
    name: 'Playfly Sports',
    notableDeals: [
      { school: 'Texas A&M', value: 515_000_000, duration: '15 years' },
      { school: 'Nebraska', nilInvestment: 10_250_000 },
      { school: 'LSU', notes: 'Offered $3.5M to Sorsby through Playfly' },
    ],
    partnerSchools: ['Auburn', 'Baylor', 'Penn State', 'LSU', 'Michigan State', 'UCF', 'Maryland', 'Nebraska', 'Virginia', 'Virginia Tech'],
  },
  learfield: {
    name: 'Learfield',
    notableDeals: [
      { school: 'USC', notes: '15-year deal starting 2026' },
    ],
  },
}

// ============================================================================
// AGENT REGULATION
// ============================================================================

export const agentRegulation = {
  // Federal law
  sparta: {
    name: 'Sports Agent Responsibility and Trust Act (2004)',
    prohibits: [
      'Providing false or misleading information',
      'Providing anything of value before entering a contract',
    ],
    enforcement: 'FTC',
  },

  // State laws vary widely
  stateVariation: {
    strict: {
      example: 'California',
      requirements: ['Secretary of State registration', '$100,000 surety bond', 'Miller-Ayala Act compliance'],
    },
    minimal: {
      example: 'Arizona',
      requirements: ['No fees', 'No bond required'],
    },
  },

  // FTC Investigation (January 2026)
  ftcInvestigation: {
    universitiesContacted: 20,
    dataRequested: [
      'When athletes entered contracts',
      'When school was notified by agent',
      'Complaints about agents',
      'Copies of agency contracts (redacted)',
    ],
    periodCovered: 'July 1, 2021 forward',
  },

  // Proposed legislation: HUSTLE Act (December 2025)
  hustleAct: {
    provisions: [
      'Require agents to register with their state',
      'Cap agent fees at 5%',
      'NCAA must create searchable public agent database',
      'Prohibit false/deceptive statements',
    ],
    status: 'Introduced, not yet passed',
  },

  // SCORE Act (House, July 2025) - H.R. 4312
  scoreAct: {
    provisions: [
      'Preserves broad athlete NIL rights',
      'Empowers NCAA to set disclosure and compensation rules',
      'Grants NCAA targeted antitrust immunity',
      'Classifies student-athletes as non-employees',
      '$600+ deals must be in writing with core terms',
      'Caps agent fees at 5%',
      'Schools over $20M revenue must provide comprehensive support',
    ],
    status: 'Introduced, no hearings scheduled',
  },

  // SAFE Act (Senate, September 2025) - S. 2932
  safeAct: {
    provisions: [
      'Athlete-centered approach with enhanced protections',
      'No antitrust immunity to NCAA',
      'Extends Sports Broadcasting Act to college sports',
      'Mandates contract reporting for D1 athletes',
      'Guarantees 5 years post-eligibility health coverage',
      'Allows two transfers without eligibility loss',
      'Caps agent fees at 5%',
    ],
    status: 'Introduced, no hearings scheduled',
  },

  // Warning signs
  agentRedFlags: [
    'Not registered in athlete\'s state',
    'Commission above 15-20% (standard is 10-15% for NIL)',
    'Family member with no credentials',
    'No track record of NIL deals',
    'Pressure to sign quickly',
  ],
}

// ============================================================================
// GOVERNANCE & ENFORCEMENT
// ============================================================================

export const governance = {
  // Current enforcement reality
  enforcement: {
    cscStaffSize: 10, // Including at least one former FBI investigator
    tamperingCasesProcessed: 95, // This year
    quote: '"The CSC is probably a little gun shy to enforce things at Power Four schools because we basically just fired the NCAA" - Danny White, Tennessee AD',
  },

  // Potential SEC breakaway
  secBreakaway: {
    quote: '"If the CSC is not going to enforce the House settlement, if the NCAA is not going to enforce tampering rules and if Congress is not going to pass the SCORE Act, then it leaves the SEC in a position that we have to go our own way." - Jere Morehead, UGA President',
    status: 'Being discussed',
  },

  // Money laundering concern
  capCircumvention: {
    quote: '"We are money laundering" - Big Ten school administrator',
    reality: 'Schools spending $25M+ while claiming $20.5M cap compliance',
    methods: [
      'Third-party collective deals (exempt from cap)',
      'MMR partner deals through Playfly/Learfield',
      'Apparel brand deals (Nike, Adidas, Under Armour)',
      'Guaranteeing money before CSC clearance',
    ],
  },
}

// ============================================================================
// DISCLOSURE REQUIREMENTS BY SCHOOL TYPE
// ============================================================================

export const disclosureRequirements = {
  stanford: {
    platform: 'INFLCR Verified',
    timing: 'Recommends before signing',
    contact: 'ljones9@stanford.edu',
    notes: 'Compliance reviews for NCAA/CA law/Stanford policy only - not contract terms',
  },
  cal: {
    platform: 'INFLCR (Golden Exchange)',
    timing: '5 days before or 3 days after',
    program: 'GOLDEN Program with Haas School of Business partnership',
    legalHelp: 'Berkeley NIL Initiative - free legal support for non-revenue sports',
  },
  santaClara: {
    platform: 'Contact compliance office',
    timing: 'REQUIRES pre-approval before signing',
    collective: 'The Mission NIL Collective',
  },
  ncaaWide: {
    platform: 'NIL Go (CSC)',
    threshold: '$600+',
    timing: '30 days after signing',
  },
}

// ============================================================================
// KEY EXPERT QUOTES
// ============================================================================

export const expertQuotes = [
  {
    quote: 'These deals are absolutely worthless to athletes.',
    author: 'Darren Heitner',
    context: 'NIL attorney on revenue sharing contracts',
  },
  {
    quote: 'Employment on its face. There\'s no masking it.',
    author: 'Michael LeRoy',
    affiliation: 'University of Illinois',
    context: 'On revenue sharing contract terms',
  },
  {
    quote: 'The athlete and the agent are expected to get paid. Whatever that number is, whatever source it comes from, they don\'t really care.',
    author: 'Mit Winter',
    context: 'NIL attorney on agent/athlete priorities',
  },
  {
    quote: 'A decade ago, Alabama could land everyone they wanted. They could be like a dragon sitting on a chest of gold. There\'s nothing you could do about it.',
    author: 'Chris Hummer',
    context: 'On how NIL has changed recruiting power dynamics',
  },
  {
    quote: 'I don\'t even know if they\'re licensed to be agents, and all of a sudden, they get to be agents because we have no certification process in college football... It might be their college roommate their freshman year who\'s their agent right now.',
    author: 'Steve Sarkisian',
    affiliation: 'Texas Head Coach',
    context: 'On unregulated NIL agents (January 2026)',
  },
]

// ============================================================================
// FAIR PLAY POSITIONING
// ============================================================================

export const fairPlayContext = {
  // The gap we fill
  complianceGap: {
    inflcr: 'Disclosure tracking - not contract review',
    universityCompliance: 'NCAA/state law check - cannot provide legal services',
    csc: 'FMV and inducement check - not contract terms',
    lawyers: 'Full legal review - but most athletes can\'t afford',
    fairPlay: 'AI-powered contract literacy for ALL athletes',
  },

  // What we are NOT
  disclaimer: {
    notAgent: true,
    notLawyer: true,
    notFinancialAdvisor: true,
    educationalOnly: true,
  },

  // Our value prop
  valueProp: 'We help unrepresented athletes understand their contracts and spot red flags - filling the gap between compliance tracking and full legal review.',
}
