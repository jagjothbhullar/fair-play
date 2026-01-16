'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { californiaSchools, type CaliforniaSchool } from '@/lib/data/california-schools'
import { agentRegulation, cscData, revenueSharing } from '@/lib/data/nil-knowledge-base'

interface AthleteProfile {
  schoolShortName: string
}

// NIL Policy data by school - comprehensive research data
const schoolPolicies: Record<string, {
  compliancePortal?: string
  complianceEmail?: string
  disclosureDeadline: string
  disclosurePlatform?: string
  requiredEducation?: string
  nilMarketplace?: string
  sponsorConflicts?: string[]
  restrictions: string[]
  tips: string[]
}> = {
  // === POWER FOUR ===
  'UCLA': {
    compliancePortal: 'https://uclabruins.com/sports/2021/7/1/nil-name-image-likeness',
    complianceEmail: 'djensen@athletics.ucla.edu',
    disclosureDeadline: '5 business days for deals $600+',
    disclosurePlatform: 'NIL Go (NILGo.com)',
    nilMarketplace: 'Westwood Exchange (via INFLCR)',
    requiredEducation: 'UCLA NIL Education Module',
    restrictions: [
      'Cannot use UCLA logos, trademarks, or facilities without written approval',
      'Cannot promote alcohol, tobacco, gambling, or cannabis',
      'Cannot conflict with UCLA/Big Ten sponsor agreements',
      'Must report all deals $600+ to NIL Go within 5 business days',
    ],
    tips: [
      'Champion of Westwood is the umbrella collective (Men of Westwood, Champions Fund, Bruins for Life)',
      'Big Ten conference = premium national exposure',
      'LA market offers diverse brand opportunities across entertainment and lifestyle',
    ],
  },
  'USC': {
    compliancePortal: 'https://usctrojans.com/sports/compliance',
    complianceEmail: 'compliance@usc.edu',
    disclosureDeadline: 'Before finalizing - all contracts regardless of amount',
    disclosurePlatform: 'INFLCR software application',
    nilMarketplace: 'Trojan Marketplace (via INFLCR)',
    requiredEducation: 'USC NIL Education Program',
    sponsorConflicts: ['Nike', 'Coca-Cola', 'Powerade', 'Muscle Milk', 'United Airlines'],
    restrictions: [
      'Written license required from TLS office for USC marks/logos',
      'Cannot promote illegal substances, sports wagering, or banned supplements',
      'Cannot use USC facilities for commercial purposes without approval',
      'All oral AND written contracts must be disclosed',
    ],
    tips: [
      'House of Victory (merged with Conquest Collective) is the primary collective',
      'Check sponsor conflicts before signing - Nike, Coca-Cola, Powerade are off-limits',
      'Learfield corporate partnership (starting 2026) may create new opportunities',
    ],
  },
  'Stanford': {
    compliancePortal: 'https://gostanford.com/sports/2022/11/10/nil-disclosures',
    complianceEmail: 'nil@stanford.edu',
    disclosureDeadline: 'Recommended before signing; required by CA law',
    disclosurePlatform: 'INFLCR Verified App',
    requiredEducation: 'Financial literacy and branding education (Altius Sports Partners)',
    restrictions: [
      'Must obtain permission for Stanford marks/logos',
      'Contracts cannot conflict with Stanford NIL Policy or NCAA rules',
      'Professional service providers must be California-licensed',
      'Boosters must follow extra benefit legislation',
    ],
    tips: [
      'Lifetime Cardinal is the official NIL collective',
      'In-house NIL GM (Lindsey Jones) available for guidance',
      'Silicon Valley connections = unique tech/startup brand opportunities',
      'Stanford brand carries significant premium nationally',
    ],
  },
  'Cal': {
    compliancePortal: 'https://calbears.com/sports/2023/7/13/NIL.aspx',
    complianceEmail: 'compliance@berkeley.edu',
    disclosureDeadline: 'Per NCAA rules - 5 business days for $600+',
    disclosurePlatform: 'INFLCR Verified Compliance Ledger',
    nilMarketplace: 'Golden Exchange (via INFLCR)',
    requiredEducation: 'GOLDEN Program (Haas School of Business, Berkeley Law)',
    restrictions: [
      'UC Berkeley marks require separate licensing approval',
      'Must follow NCAA extra benefit rules',
      'Cannot use Cal facilities for commercial shoots without approval',
    ],
    tips: [
      'California Legends Collective (partnership with Marshawn Lynch/Beastmode Marketing)',
      '850+ student-athletes registered on Golden Exchange',
      'Cameron Institute for Student-Athlete Development provides support',
      'Bay Area tech and sustainability brands are good targets',
    ],
  },
  // === GROUP OF FIVE ===
  'SDSU': {
    compliancePortal: 'https://goaztecs.com/aztec-nil',
    complianceEmail: 'compliance@sdsu.edu',
    disclosureDeadline: 'Before NIL agreement',
    disclosurePlatform: 'Contact compliance office',
    restrictions: [
      'Written agreement required from SDSU for marks/logos',
      'Cannot use athletic facilities without proper rental/approval',
      'Cannot sell items provided by institution until eligibility exhausted',
      'Staff prohibited from donations to collectives',
    ],
    tips: [
      'Aztec Link is the official NIL collective',
      'Student-Athlete Recruitment and Retention Fund available',
      'Joining Pac-12 (2024) = increased exposure and opportunities',
      'San Diego tourism/hospitality brands are active in NIL space',
    ],
  },
  'Fresno State': {
    compliancePortal: 'https://gobulldogs.com/sports/compliance',
    complianceEmail: 'compliance@csufresno.edu',
    disclosureDeadline: '30 days (NCAA) / 5 days for $600+ (NIL Go)',
    disclosurePlatform: 'Opendorse',
    nilMarketplace: '559 Exchange (via Opendorse)',
    restrictions: [
      'Fresno State branding requires approval',
      'Cannot promote products conflicting with CSU policies',
      'Must complete required NIL education',
    ],
    tips: [
      'Bulldog Bread Collective is primary collective',
      'First California university on Opendorse Ready (2020)',
      'Central Valley agriculture/ag-tech brands are opportunities',
      'Strong alumni network for local deals',
    ],
  },
  'SJSU': {
    compliancePortal: 'https://sjsuspartans.com/name-image-and-likeness-policy',
    complianceEmail: 'compliance@sjsu.edu',
    disclosureDeadline: 'Automatic via Opendorse',
    disclosurePlatform: 'Opendorse (automatic compliance disclosure)',
    nilMarketplace: 'SJSU Marketplace (via Opendorse)',
    restrictions: [
      'Cannot wear university apparel/logos in NIL activities',
      'No use of SJSU facilities without written consent',
      'Cannot sell institutionally provided items until eligibility exhausted',
      'Cannot use institutionally produced content',
    ],
    tips: [
      'Silicon Valley location = premium tech brand access',
      'Opendorse handles compliance automatically',
      'Football success creating more NIL momentum',
    ],
  },
  // === BIG WEST ===
  'UC Davis': {
    compliancePortal: 'https://ucdavisaggies.com/sports/compliance',
    complianceEmail: 'compliance@ucdavis.edu',
    disclosureDeadline: '5 business days for $600+',
    disclosurePlatform: 'COMPASS by CLC',
    restrictions: [
      'UC Davis marks require licensing',
      'Must follow Big West and NCAA guidelines',
      'Cannot conflict with university sponsors',
    ],
    tips: [
      'Aggie Edge is the NIL collective',
      'Sacramento market access for local deals',
      'FCS football = different NIL landscape than FBS',
    ],
  },
  'UCSB': {
    compliancePortal: 'https://ucsbgauchos.com/sports/compliance',
    complianceEmail: 'compliance@ucsb.edu',
    disclosureDeadline: '5 business days for $600+',
    disclosurePlatform: 'COMPASS by CLC',
    restrictions: [
      'UCSB marks require approval',
      'Must follow Big West conference policies',
      'Cannot use athletic facilities without permission',
    ],
    tips: [
      'Gaucho NIL collective available',
      'Santa Barbara tourism/lifestyle brands are natural fits',
      'Strong soccer and water polo programs = niche opportunities',
    ],
  },
  'UC Irvine': {
    compliancePortal: 'https://ucirvinesports.com/sports/compliance',
    complianceEmail: 'compliance@uci.edu',
    disclosureDeadline: '5 business days for $600+',
    disclosurePlatform: 'COMPASS by CLC',
    restrictions: [
      'UCI marks require licensing',
      'Must follow Big West and NCAA guidelines',
    ],
    tips: [
      'Anteater Athletics NIL collective',
      'Orange County market = lifestyle and tech brands',
      'Strong volleyball and basketball programs',
    ],
  },
  'Long Beach State': {
    compliancePortal: 'https://longbeachstate.com/sports/compliance',
    complianceEmail: 'compliance@csulb.edu',
    disclosureDeadline: '5 business days for $600+',
    disclosurePlatform: 'COMPASS by CLC',
    restrictions: [
      'Long Beach State marks require approval',
      'Must follow CSU system guidelines',
    ],
    tips: [
      'Beach NIL Collective available',
      'LA/Long Beach market access',
      'Men\'s volleyball program has strong following',
    ],
  },
  'Cal State Fullerton': {
    compliancePortal: 'https://fullertontitans.com/sports/compliance',
    complianceEmail: 'compliance@fullerton.edu',
    disclosureDeadline: '5 business days for $600+',
    disclosurePlatform: 'COMPASS by CLC',
    restrictions: [
      'Titan marks require approval',
      'Must follow CSU system guidelines',
    ],
    tips: [
      'Titan NIL Network collective',
      'Orange County market access',
      'Baseball program historically strong = niche opportunities',
    ],
  },
  'Cal Poly': {
    compliancePortal: 'https://gopoly.com/sports/compliance',
    complianceEmail: 'compliance@calpoly.edu',
    disclosureDeadline: 'Consult compliance before any outside business',
    disclosurePlatform: 'COMPASS by CLC',
    requiredEducation: 'The Athlete Lab (student-run marketing course)',
    restrictions: [
      'Cal Poly marks require approval',
      'Must follow CSU system guidelines',
      'Consult compliance before any NIL activity',
    ],
    tips: [
      'Players Trust is the NIL collective',
      'Boot Barn NIL deal available for rodeo athletes',
      'Central Coast lifestyle brands are opportunities',
      'The Athlete Lab course helps with personal branding',
    ],
  },
  // === WEST COAST CONFERENCE ===
  'USF': {
    compliancePortal: 'https://usfdons.com/sports/compliance',
    complianceEmail: 'compliance@usfca.edu',
    disclosureDeadline: 'Per NCAA guidelines',
    restrictions: [
      'USF marks require approval',
      'Must follow WCC and NCAA guidelines',
    ],
    tips: [
      'Dons NIL collective',
      'San Francisco market = tech and lifestyle brands',
      'Basketball program has strong following',
    ],
  },
  'Santa Clara': {
    compliancePortal: 'https://santaclarabroncos.com/sports/compliance',
    complianceEmail: 'compliance@scu.edu',
    disclosureDeadline: 'Per NCAA guidelines',
    restrictions: [
      'Santa Clara marks require approval',
      'Must follow WCC and NCAA guidelines',
    ],
    tips: [
      'Bronco NIL collective',
      'Silicon Valley location = tech brand access',
      'Women\'s soccer program nationally recognized',
    ],
  },
  "Saint Mary's": {
    compliancePortal: 'https://smcgaels.com/sports/compliance',
    complianceEmail: 'compliance@stmarys-ca.edu',
    disclosureDeadline: 'Per NCAA guidelines',
    restrictions: [
      'Saint Mary\'s marks require approval',
      'Must follow WCC and NCAA guidelines',
    ],
    tips: [
      'Gael Force NIL collective',
      'Bay Area market access',
      'Men\'s basketball program has strong national following',
    ],
  },
  'Pepperdine': {
    compliancePortal: 'https://pepperdinewaves.com/sports/compliance',
    complianceEmail: 'compliance@pepperdine.edu',
    disclosureDeadline: 'Per NCAA guidelines',
    restrictions: [
      'Pepperdine marks require approval',
      'Must follow WCC and NCAA guidelines',
    ],
    tips: [
      'Waves NIL collective',
      'Malibu location = lifestyle and luxury brands',
      'Men\'s volleyball and beach volleyball programs are strong',
    ],
  },
  'LMU': {
    compliancePortal: 'https://lmulions.com/sports/compliance',
    complianceEmail: 'compliance@lmu.edu',
    disclosureDeadline: 'Per NCAA guidelines',
    restrictions: [
      'LMU marks require approval',
      'Must follow WCC and NCAA guidelines',
    ],
    tips: [
      'Lion NIL collective',
      'LA market = entertainment and lifestyle brands',
      'Basketball program building momentum',
    ],
  },
  'San Diego': {
    compliancePortal: 'https://usdtoreros.com/sports/compliance',
    complianceEmail: 'compliance@sandiego.edu',
    disclosureDeadline: 'Per NCAA guidelines',
    restrictions: [
      'USD marks require approval',
      'Must follow WCC and NCAA guidelines',
    ],
    tips: [
      'Torero NIL collective',
      'San Diego tourism/lifestyle brands available',
      'FCS football program',
    ],
  },
  'Pacific': {
    compliancePortal: 'https://pacifictigers.com/sports/compliance',
    complianceEmail: 'compliance@pacific.edu',
    disclosureDeadline: 'Per NCAA guidelines',
    restrictions: [
      'Pacific marks require approval',
      'Must follow WCC and NCAA guidelines',
    ],
    tips: [
      'Tiger NIL collective',
      'Stockton/Central Valley market',
      'Basketball and water polo programs',
    ],
  },
  // === OTHER ===
  'Sacramento State': {
    compliancePortal: 'https://hornetsports.com/sports/compliance',
    complianceEmail: 'compliance@csus.edu',
    disclosureDeadline: 'Per NCAA guidelines',
    restrictions: [
      'Sacramento State marks require approval',
      'Must follow Big Sky and NCAA guidelines',
    ],
    tips: [
      'Sac-12 and Hornet NIL collectives',
      'Massive $35M fundraising for Pac-12 bid = growing program',
      'Sacramento market = state government and tech brands',
      'Football program on the rise',
    ],
  },
}

// California state law requirements (SB 206)
const californiaLaw = {
  name: 'California Fair Pay to Play Act (SB 206)',
  effective: 'January 1, 2023',
  keyPoints: [
    'Athletes can earn money from their name, image, and likeness',
    'Schools cannot prevent athletes from obtaining NIL representation',
    'Schools cannot punish athletes for earning NIL income',
    'Athletes must disclose NIL contracts to their school',
    'Professional representation is allowed for NIL deals',
    'NIL income does not affect athletic scholarship eligibility',
  ],
}

// NCAA guidelines
const ncaaGuidelines = {
  name: 'NCAA NIL Guidelines',
  lastUpdated: '2024',
  keyPoints: [
    'Athletes can engage in NIL activities without losing eligibility',
    'NIL compensation cannot be used as recruiting inducement',
    'Deals must be for legitimate services at fair market value',
    'Schools can provide NIL education and support services',
    'Boosters/collectives must operate independently from recruiting',
    'Athletes must disclose NIL activities per school policy',
  ],
  prohibited: [
    'Pay-for-play arrangements (payment contingent on enrollment/performance)',
    'Using NIL as recruiting inducement',
    'School employees negotiating NIL deals for athletes',
    'NIL deals that are not at fair market value',
  ],
}

// General tips for all athletes
const generalTips = [
  {
    title: 'Read Every Contract Carefully',
    description: 'Never sign anything without understanding all terms. Use Fair Play\'s contract scanner to spot red flags.',
    icon: '📄',
  },
  {
    title: 'Disclose Everything',
    description: 'Always report NIL activities to your compliance office. Failing to disclose can jeopardize your eligibility.',
    icon: '📋',
  },
  {
    title: 'Keep Records',
    description: 'Save copies of all contracts, payments, and communications. You\'ll need these for taxes and compliance.',
    icon: '📁',
  },
  {
    title: 'Know Your Worth',
    description: 'Use our NIL calculator to understand your market value before negotiating. Don\'t undersell yourself.',
    icon: '💰',
  },
  {
    title: 'Watch for Red Flags',
    description: 'Be wary of long exclusivity periods, unclear payment terms, or deals that seem too good to be true.',
    icon: '🚩',
  },
  {
    title: 'Consider Representation',
    description: 'For larger deals, an agent or attorney can help negotiate better terms and protect your interests.',
    icon: '🤝',
  },
]

export default function NILGuidePage() {
  const [profile, setProfile] = useState<AthleteProfile | null>(null)
  const [school, setSchool] = useState<CaliforniaSchool | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<'school' | 'california' | 'ncaa' | 'agents' | 'tips'>('school')

  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const response = await fetch(`/api/profile?userId=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.profile) {
            setProfile(data.profile)
            const foundSchool = californiaSchools.find(s => s.shortName === data.profile.schoolShortName)
            setSchool(foundSchool || null)
          }
        }
      }
      setLoading(false)
    }
    loadProfile()
  }, [supabase.auth])

  const schoolPolicy = school ? schoolPolicies[school.shortName] : null

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm text-emerald-400 mb-6">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Stay compliant, stay eligible
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">NIL Guide</h1>
        <p className="text-xl text-white/50 max-w-2xl">
          Everything you need to know about NIL rules, your school's policies, and how to stay compliant.
        </p>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { id: 'school', label: school?.shortName || 'Your School', icon: '🏫' },
          { id: 'california', label: 'California Law', icon: '📜' },
          { id: 'ncaa', label: 'NCAA Rules', icon: '🏆' },
          { id: 'agents', label: 'Agent Guide', icon: '🤝' },
          { id: 'tips', label: 'Tips & Best Practices', icon: '💡' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as typeof activeSection)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeSection === tab.id
                ? 'bg-white text-black'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* School-Specific Section */}
      {activeSection === 'school' && (
        <div className="space-y-6">
          {school && schoolPolicy ? (
            <>
              {/* School Header */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-black font-bold text-xl">
                    {school.shortName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{school.name}</h2>
                    <p className="text-white/50">{school.conference}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-xs text-white/40 uppercase">NIL Tier</p>
                    <p className="font-medium text-emerald-400">{school.nilTier}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase">Est. Budget</p>
                    <p className="font-medium">${(school.estimatedNILBudget || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase">Collectives</p>
                    <p className="font-medium">{school.nilCollectives.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase">Disclosure</p>
                    <p className="font-medium text-sm">{schoolPolicy.disclosureDeadline}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-4">
                {schoolPolicy.compliancePortal && (
                  <a
                    href={schoolPolicy.compliancePortal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.06] hover:border-emerald-500/30 transition-all group"
                  >
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium group-hover:text-emerald-400 transition-colors">Compliance Portal</p>
                      <p className="text-sm text-white/50">Submit disclosures online</p>
                    </div>
                    <svg className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                {schoolPolicy.complianceEmail && (
                  <a
                    href={`mailto:${schoolPolicy.complianceEmail}`}
                    className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.06] hover:border-emerald-500/30 transition-all group"
                  >
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium group-hover:text-emerald-400 transition-colors">Email Compliance</p>
                      <p className="text-sm text-white/50">{schoolPolicy.complianceEmail}</p>
                    </div>
                    <svg className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>

              {/* Key Info Cards */}
              <div className="grid md:grid-cols-2 gap-4">
                {schoolPolicy.disclosurePlatform && (
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                    <p className="text-xs text-white/40 uppercase mb-1">Disclosure Platform</p>
                    <p className="font-medium text-emerald-400">{schoolPolicy.disclosurePlatform}</p>
                  </div>
                )}
                {schoolPolicy.nilMarketplace && (
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                    <p className="text-xs text-white/40 uppercase mb-1">NIL Marketplace</p>
                    <p className="font-medium">{schoolPolicy.nilMarketplace}</p>
                  </div>
                )}
                {schoolPolicy.requiredEducation && (
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                    <p className="text-xs text-white/40 uppercase mb-1">Required Education</p>
                    <p className="font-medium">{schoolPolicy.requiredEducation}</p>
                  </div>
                )}
              </div>

              {/* Sponsor Conflicts Warning */}
              {schoolPolicy.sponsorConflicts && schoolPolicy.sponsorConflicts.length > 0 && (
                <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="text-orange-400">🚫</span> Sponsor Conflicts - Cannot Partner With
                  </h3>
                  <p className="text-sm text-white/50 mb-3">
                    These brands have exclusive deals with your school. You cannot promote competitors.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {schoolPolicy.sponsorConflicts.map((sponsor) => (
                      <span
                        key={sponsor}
                        className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-sm text-orange-400"
                      >
                        {sponsor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Collectives */}
              {school.nilCollectives.length > 0 && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Official NIL Collectives</h3>
                  <div className="flex flex-wrap gap-2">
                    {school.nilCollectives.map((collective) => (
                      <span
                        key={collective}
                        className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm text-emerald-400"
                      >
                        {collective}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Restrictions */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-red-400">⚠️</span> School Restrictions
                </h3>
                <ul className="space-y-3">
                  {schoolPolicy.restrictions.map((restriction, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                      </span>
                      <span className="text-white/70">{restriction}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tips */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-emerald-400">💡</span> School-Specific Tips
                </h3>
                <ul className="space-y-3">
                  {schoolPolicy.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      </span>
                      <span className="text-white/70">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : school ? (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏫</span>
              </div>
              <h3 className="text-xl font-medium mb-2">{school.name}</h3>
              <p className="text-white/50 mb-4">
                We're still gathering detailed policy information for your school.
              </p>
              <p className="text-sm text-white/40">
                In the meantime, contact your athletics compliance office for NIL guidance.
              </p>
            </div>
          ) : (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Complete Your Profile</h3>
              <p className="text-white/50">
                Add your school to see school-specific NIL policies and guidance.
              </p>
            </div>
          )}
        </div>
      )}

      {/* California Law Section */}
      {activeSection === 'california' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">📜</span>
              <div>
                <h2 className="text-2xl font-bold">{californiaLaw.name}</h2>
                <p className="text-white/50">Effective: {californiaLaw.effective}</p>
              </div>
            </div>
            <p className="text-white/70">
              California was the first state to pass NIL legislation, giving student-athletes the right to profit from their name, image, and likeness.
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Your Rights Under California Law</h3>
            <ul className="space-y-3">
              {californiaLaw.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-white/80">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* NCAA Rules Section */}
      {activeSection === 'ncaa' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🏆</span>
              <div>
                <h2 className="text-2xl font-bold">{ncaaGuidelines.name}</h2>
                <p className="text-white/50">Last Updated: {ncaaGuidelines.lastUpdated}</p>
              </div>
            </div>
            <p className="text-white/70">
              The NCAA allows athletes to monetize their NIL while maintaining eligibility, with some important guardrails.
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-emerald-400">✓</span> What's Allowed
            </h3>
            <ul className="space-y-3">
              {ncaaGuidelines.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  </span>
                  <span className="text-white/70">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-red-400">✗</span> What's Prohibited
            </h3>
            <ul className="space-y-3">
              {ncaaGuidelines.prohibited.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  </span>
                  <span className="text-white/70">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Agents Section */}
      {activeSection === 'agents' && (
        <div className="space-y-6">
          {/* Warning Banner */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <h2 className="text-xl font-bold text-orange-400 mb-2">NIL Agent Warning</h2>
                <p className="text-white/70">
                  Unlike traditional sports agents, <span className="text-orange-400 font-medium">NIL agents are largely unregulated</span>.
                  Many are family members, friends, or individuals with no credentials. The FTC is currently
                  investigating 20+ universities for agent law violations. Protect yourself.
                </p>
              </div>
            </div>
          </div>

          {/* Federal Law */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-blue-400">🏛️</span> Federal Law: {agentRegulation.sparta.name}
            </h3>
            <p className="text-white/50 text-sm mb-4">This federal law prohibits agents from:</p>
            <ul className="space-y-2">
              {agentRegulation.sparta.prohibits.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  </span>
                  <span className="text-white/70">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-white/40 text-xs mt-4">Enforcement: Federal Trade Commission (FTC)</p>
          </div>

          {/* State Variation */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="text-emerald-400">✓</span> California (Strict)
              </h3>
              <ul className="space-y-2 text-sm">
                {agentRegulation.stateVariation.strict.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/70">
                    <span className="text-emerald-400">•</span> {req}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="text-red-400">✗</span> Arizona (Minimal)
              </h3>
              <ul className="space-y-2 text-sm">
                {agentRegulation.stateVariation.minimal.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/70">
                    <span className="text-red-400">•</span> {req}
                  </li>
                ))}
              </ul>
              <p className="text-red-400/70 text-xs mt-3">Anyone can call themselves an NIL agent in states like Arizona</p>
            </div>
          </div>

          {/* Red Flags */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-red-400">🚩</span> Agent Red Flags
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {agentRegulation.agentRedFlags.map((flag, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-red-500/5 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-400 text-xs font-bold">{i + 1}</span>
                  </span>
                  <span className="text-white/70 text-sm">{flag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Commission Guide */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Standard Commission Rates</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-emerald-500/5 rounded-xl">
                <span className="text-white/70">NIL deals (standard)</span>
                <span className="text-emerald-400 font-bold">10-15%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-500/5 rounded-xl">
                <span className="text-white/70">Maximum reasonable</span>
                <span className="text-yellow-400 font-bold">15-20%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-500/5 rounded-xl">
                <span className="text-white/70">Red flag territory</span>
                <span className="text-red-400 font-bold">&gt;20%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <span className="text-white/70">HUSTLE Act proposed cap</span>
                <span className="text-emerald-400 font-bold">5%</span>
              </div>
            </div>
            <p className="text-white/40 text-xs mt-4">
              The HUSTLE Act (introduced Dec 2025) would cap agent fees at 5% if passed.
            </p>
          </div>

          {/* Questions to Ask */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-blue-400">❓</span> Questions to Ask Any Agent
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-400 text-xs font-bold">1</span>
                <span className="text-white/70">Are you registered as an agent in my state (California)?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-400 text-xs font-bold">2</span>
                <span className="text-white/70">What is your commission rate, and how is it calculated?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-400 text-xs font-bold">3</span>
                <span className="text-white/70">How many NIL deals have you closed? Can I see references?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-400 text-xs font-bold">4</span>
                <span className="text-white/70">Do you represent other athletes at my school? Any conflicts?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-400 text-xs font-bold">5</span>
                <span className="text-white/70">How can I terminate our relationship if needed?</span>
              </li>
            </ul>
          </div>

          {/* CSC Stats */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Current NIL Landscape (CSC Data)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">{cscData.athletesWithDeals.toLocaleString()}</p>
                <p className="text-xs text-white/40">Athletes with deals</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">${(cscData.totalValueCleared / 1_000_000).toFixed(0)}M</p>
                <p className="text-xs text-white/40">Total cleared</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">{(cscData.rejectionRate * 100).toFixed(0)}%</p>
                <p className="text-xs text-white/40">Rejection rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">${(revenueSharing.currentCap / 1_000_000).toFixed(1)}M</p>
                <p className="text-xs text-white/40">School cap</p>
              </div>
            </div>
            <p className="text-white/40 text-xs mt-4 text-center">
              Note: School cap is $20.5M, but third-party collective deals have NO cap
            </p>
          </div>
        </div>
      )}

      {/* Tips Section */}
      {activeSection === 'tips' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {generalTips.map((tip, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{tip.icon}</span>
                  <div>
                    <h3 className="font-semibold mb-2">{tip.title}</h3>
                    <p className="text-sm text-white/60">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-white/10 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">Have a contract to review?</h3>
            <p className="text-white/50 mb-6">
              Use our AI-powered scanner to spot red flags before you sign.
            </p>
            <a
              href="/"
              className="inline-flex px-8 py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black rounded-full font-semibold hover:from-emerald-300 hover:to-emerald-400 transition-all"
            >
              Scan a Contract
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
