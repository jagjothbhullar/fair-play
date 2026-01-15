// California Division 1 Schools Database
// Sources: CalMatters, On3, Opendorse, nil-ncaa.com, public records
// Last updated: January 2025

export interface CaliforniaSchool {
  name: string
  shortName: string
  city: string
  conference: string
  conferenceType: 'POWER_FOUR' | 'GROUP_OF_FIVE' | 'MID_MAJOR' | 'FCS'
  type: 'public' | 'private'
  system: 'UC' | 'CSU' | 'private' | null
  nilCollectives: string[]
  estimatedNILBudget: number | null // Annual estimate in dollars
  nilTier: 'ELITE' | 'HIGH' | 'MODERATE' | 'EMERGING' | 'LIMITED'
  nilMultiplier: number // Multiplier for calculator (1.0 = baseline)
  topSports: string[]
  notablNILDeals: { sport: string; amount: number; year: number }[]
  hasFootball: boolean
  footballLevel: 'FBS' | 'FCS' | null
  enrollment: number
}

export const californiaSchools: CaliforniaSchool[] = [
  // === POWER FOUR SCHOOLS ===
  {
    name: 'University of California, Los Angeles',
    shortName: 'UCLA',
    city: 'Los Angeles',
    conference: 'Big Ten',
    conferenceType: 'POWER_FOUR',
    type: 'public',
    system: 'UC',
    nilCollectives: ['Champion of Westwood', 'Men of Westwood', 'Bruins for Life', 'Champions Fund'],
    estimatedNILBudget: 12000000, // $12M+ estimated
    nilTier: 'ELITE',
    nilMultiplier: 1.4,
    topSports: ["Women's Gymnastics", "Men's Basketball", "Women's Basketball", 'Football'],
    notablNILDeals: [
      { sport: 'Football', amount: 450000, year: 2024 },
      { sport: "Women's Gymnastics", amount: 250000, year: 2024 },
      { sport: "Women's Gymnastics", amount: 210000, year: 2024 },
      { sport: "Men's Basketball", amount: 450000, year: 2024 },
    ],
    hasFootball: true,
    footballLevel: 'FBS',
    enrollment: 46000,
  },
  {
    name: 'University of Southern California',
    shortName: 'USC',
    city: 'Los Angeles',
    conference: 'Big Ten',
    conferenceType: 'POWER_FOUR',
    type: 'private',
    system: null,
    nilCollectives: ['House of Victory'], // Private - less public data
    estimatedNILBudget: 15000000, // Estimated $15M+ (private, not disclosed)
    nilTier: 'ELITE',
    nilMultiplier: 1.5,
    topSports: ['Football', "Women's Basketball", "Women's Volleyball", 'Baseball'],
    notablNILDeals: [
      { sport: 'Football', amount: 603000, year: 2024 }, // Jayden Maiava On3 estimate
    ],
    hasFootball: true,
    footballLevel: 'FBS',
    enrollment: 47000,
  },
  {
    name: 'Stanford University',
    shortName: 'Stanford',
    city: 'Stanford',
    conference: 'ACC',
    conferenceType: 'POWER_FOUR',
    type: 'private',
    system: null,
    nilCollectives: ['The Collective for Stanford Athletics'],
    estimatedNILBudget: 10000000, // Estimated (private, not disclosed)
    nilTier: 'ELITE',
    nilMultiplier: 1.3,
    topSports: ['Swimming', "Women's Volleyball", "Women's Basketball", 'Golf'],
    notablNILDeals: [
      { sport: "Men's Basketball", amount: 1500000, year: 2024 }, // Maxime Raynaud On3 estimate
    ],
    hasFootball: true,
    footballLevel: 'FBS',
    enrollment: 17000,
  },
  {
    name: 'University of California, Berkeley',
    shortName: 'Cal',
    city: 'Berkeley',
    conference: 'ACC',
    conferenceType: 'POWER_FOUR',
    type: 'public',
    system: 'UC',
    nilCollectives: ['Cal Legends NIL', 'Bear Backers'],
    estimatedNILBudget: 5000000, // ~$5M based on public records
    nilTier: 'HIGH',
    nilMultiplier: 1.1,
    topSports: ["Men's Basketball", 'Swimming', 'Rugby', "Women's Basketball"],
    notablNILDeals: [
      { sport: "Men's Basketball", amount: 390000, year: 2024 }, // Jaylon Tyson
    ],
    hasFootball: true,
    footballLevel: 'FBS',
    enrollment: 45000,
  },

  // === GROUP OF FIVE / MOUNTAIN WEST ===
  {
    name: 'San Diego State University',
    shortName: 'SDSU',
    city: 'San Diego',
    conference: 'Mountain West (joining Pac-12 2026)',
    conferenceType: 'GROUP_OF_FIVE',
    type: 'public',
    system: 'CSU',
    nilCollectives: ['Mesa Foundation', 'Aztec Link'],
    estimatedNILBudget: 4000000,
    nilTier: 'MODERATE',
    nilMultiplier: 0.8,
    topSports: ["Men's Basketball", 'Football', "Women's Basketball"],
    notablNILDeals: [],
    hasFootball: true,
    footballLevel: 'FBS',
    enrollment: 36000,
  },
  {
    name: 'San Jose State University',
    shortName: 'SJSU',
    city: 'San Jose',
    conference: 'Mountain West',
    conferenceType: 'GROUP_OF_FIVE',
    type: 'public',
    system: 'CSU',
    nilCollectives: ['Blue & Gold Unlimited'],
    estimatedNILBudget: 1500000,
    nilTier: 'EMERGING',
    nilMultiplier: 0.5,
    topSports: ['Football', "Women's Golf", 'Judo'],
    notablNILDeals: [],
    hasFootball: true,
    footballLevel: 'FBS',
    enrollment: 37000,
  },
  {
    name: 'California State University, Fresno',
    shortName: 'Fresno State',
    city: 'Fresno',
    conference: 'Mountain West (joining Pac-12 2026)',
    conferenceType: 'GROUP_OF_FIVE',
    type: 'public',
    system: 'CSU',
    nilCollectives: ['Bulldog Bread'],
    estimatedNILBudget: 3000000,
    nilTier: 'MODERATE',
    nilMultiplier: 0.7,
    topSports: ['Football', "Women's Basketball", 'Softball', 'Baseball'],
    notablNILDeals: [
      { sport: "Women's Basketball", amount: 1100000, year: 2022 }, // Team total
    ],
    hasFootball: true,
    footballLevel: 'FBS',
    enrollment: 25000,
  },

  // === BIG WEST CONFERENCE (MID-MAJOR) ===
  {
    name: 'California State University, Long Beach',
    shortName: 'Long Beach State',
    city: 'Long Beach',
    conference: 'Big West',
    conferenceType: 'MID_MAJOR',
    type: 'public',
    system: 'CSU',
    nilCollectives: ['Beach NIL Collective'],
    estimatedNILBudget: 500000,
    nilTier: 'LIMITED',
    nilMultiplier: 0.35,
    topSports: ["Men's Volleyball", "Women's Basketball", 'Baseball'],
    notablNILDeals: [
      { sport: 'Track and Field', amount: 390, year: 2024 }, // Mekhi Mays
    ],
    hasFootball: false,
    footballLevel: null,
    enrollment: 39000,
  },
  {
    name: 'California State University, Fullerton',
    shortName: 'Cal State Fullerton',
    city: 'Fullerton',
    conference: 'Big West',
    conferenceType: 'MID_MAJOR',
    type: 'public',
    system: 'CSU',
    nilCollectives: ['Titan NIL Network'],
    estimatedNILBudget: 400000,
    nilTier: 'LIMITED',
    nilMultiplier: 0.3,
    topSports: ['Baseball', 'Softball', "Men's Basketball"],
    notablNILDeals: [],
    hasFootball: false,
    footballLevel: null,
    enrollment: 41000,
  },
  {
    name: 'University of California, Santa Barbara',
    shortName: 'UCSB',
    city: 'Santa Barbara',
    conference: 'Big West',
    conferenceType: 'MID_MAJOR',
    type: 'public',
    system: 'UC',
    nilCollectives: ['Gaucho NIL'],
    estimatedNILBudget: 600000,
    nilTier: 'LIMITED',
    nilMultiplier: 0.35,
    topSports: ["Men's Soccer", "Women's Basketball", "Men's Basketball", "Women's Water Polo"],
    notablNILDeals: [],
    hasFootball: false,
    footballLevel: null,
    enrollment: 26000,
  },
  {
    name: 'University of California, Irvine',
    shortName: 'UC Irvine',
    city: 'Irvine',
    conference: 'Big West',
    conferenceType: 'MID_MAJOR',
    type: 'public',
    system: 'UC',
    nilCollectives: ['Anteater Athletics NIL'],
    estimatedNILBudget: 500000,
    nilTier: 'LIMITED',
    nilMultiplier: 0.35,
    topSports: ["Men's Volleyball", "Men's Basketball", 'Baseball', "Women's Water Polo"],
    notablNILDeals: [],
    hasFootball: false,
    footballLevel: null,
    enrollment: 36000,
  },
  {
    name: 'University of California, Riverside',
    shortName: 'UC Riverside',
    city: 'Riverside',
    conference: 'Big West',
    conferenceType: 'MID_MAJOR',
    type: 'public',
    system: 'UC',
    nilCollectives: ['Highlander NIL'],
    estimatedNILBudget: 300000,
    nilTier: 'LIMITED',
    nilMultiplier: 0.25,
    topSports: ["Men's Basketball", 'Baseball', "Women's Basketball"],
    notablNILDeals: [],
    hasFootball: false,
    footballLevel: null,
    enrollment: 26000,
  },
  {
    name: 'University of California, San Diego',
    shortName: 'UCSD',
    city: 'San Diego',
    conference: 'Big West (joining WCC 2027)',
    conferenceType: 'MID_MAJOR',
    type: 'public',
    system: 'UC',
    nilCollectives: ['Triton Athletics NIL'],
    estimatedNILBudget: 400000,
    nilTier: 'LIMITED',
    nilMultiplier: 0.3,
    topSports: ["Men's Volleyball", 'Swimming', "Women's Basketball", "Men's Soccer"],
    notablNILDeals: [],
    hasFootball: false,
    footballLevel: null,
    enrollment: 42000,
  },
  {
    name: 'University of California, Davis',
    shortName: 'UC Davis',
    city: 'Davis',
    conference: 'Big West',
    conferenceType: 'MID_MAJOR',
    type: 'public',
    system: 'UC',
    nilCollectives: ['Aggie Edge'],
    estimatedNILBudget: 800000,
    nilTier: 'EMERGING',
    nilMultiplier: 0.4,
    topSports: ['Football', "Men's Basketball", "Women's Basketball", 'Track and Field'],
    notablNILDeals: [
      { sport: "Men's Basketball", amount: 50000, year: 2024 }, // TY Johnson
      { sport: 'Football', amount: 25000, year: 2024 }, // Lan Larison
    ],
    hasFootball: true,
    footballLevel: 'FCS',
    enrollment: 40000,
  },
  {
    name: 'California State University, Northridge',
    shortName: 'CSUN',
    city: 'Northridge',
    conference: 'Big West',
    conferenceType: 'MID_MAJOR',
    type: 'public',
    system: 'CSU',
    nilCollectives: ['Matador NIL'],
    estimatedNILBudget: 200000,
    nilTier: 'LIMITED',
    nilMultiplier: 0.2,
    topSports: ["Men's Volleyball", "Women's Basketball", 'Baseball'],
    notablNILDeals: [],
    hasFootball: false,
    footballLevel: null,
    enrollment: 38000,
  },
  {
    name: 'California State University, Bakersfield',
    shortName: 'CSUB',
    city: 'Bakersfield',
    conference: 'Big West',
    conferenceType: 'MID_MAJOR',
    type: 'public',
    system: 'CSU',
    nilCollectives: ['Runner NIL'],
    estimatedNILBudget: 150000,
    nilTier: 'LIMITED',
    nilMultiplier: 0.15,
    topSports: ['Wrestling', "Men's Basketball", "Women's Basketball"],
    notablNILDeals: [],
    hasFootball: false,
    footballLevel: null,
    enrollment: 11000,
  },
  {
    name: 'California Baptist University',
    shortName: 'CBU',
    city: 'Riverside',
    conference: 'Big West (joining 2026)',
    conferenceType: 'MID_MAJOR',
    type: 'private',
    system: null,
    nilCollectives: ['Lancer NIL'],
    estimatedNILBudget: 300000,
    nilTier: 'LIMITED',
    nilMultiplier: 0.25,
    topSports: ["Men's Basketball", "Women's Basketball", 'Swimming'],
    notablNILDeals: [],
    hasFootball: true,
    footballLevel: 'FCS',
    enrollment: 12000,
  },
  {
    name: 'California Polytechnic State University',
    shortName: 'Cal Poly',
    city: 'San Luis Obispo',
    conference: 'Big West',
    conferenceType: 'MID_MAJOR',
    type: 'public',
    system: 'CSU',
    nilCollectives: ['Mustang NIL Collective'],
    estimatedNILBudget: 600000,
    nilTier: 'EMERGING',
    nilMultiplier: 0.4,
    topSports: ['Football', 'Wrestling', "Women's Basketball", 'Baseball'],
    notablNILDeals: [],
    hasFootball: true,
    footballLevel: 'FCS',
    enrollment: 22000,
  },

  // === WEST COAST CONFERENCE (MID-MAJOR PRIVATE) ===
  {
    name: 'University of San Francisco',
    shortName: 'USF',
    city: 'San Francisco',
    conference: 'West Coast Conference',
    conferenceType: 'MID_MAJOR',
    type: 'private',
    system: null,
    nilCollectives: ['Dons NIL'],
    estimatedNILBudget: 500000,
    nilTier: 'EMERGING',
    nilMultiplier: 0.4,
    topSports: ["Men's Basketball", "Women's Basketball", "Men's Soccer"],
    notablNILDeals: [],
    hasFootball: false,
    footballLevel: null,
    enrollment: 11000,
  },
  {
    name: 'Santa Clara University',
    shortName: 'Santa Clara',
    city: 'Santa Clara',
    conference: 'West Coast Conference',
    conferenceType: 'MID_MAJOR',
    type: 'private',
    system: null,
    nilCollectives: ['Bronco NIL'],
    estimatedNILBudget: 400000,
    nilTier: 'EMERGING',
    nilMultiplier: 0.35,
    topSports: ["Women's Soccer", "Men's Basketball", "Women's Basketball"],
    notablNILDeals: [],
    hasFootball: false,
    footballLevel: null,
    enrollment: 9000,
  },
  {
    name: "Saint Mary's College of California",
    shortName: "Saint Mary's",
    city: 'Moraga',
    conference: 'West Coast Conference',
    conferenceType: 'MID_MAJOR',
    type: 'private',
    system: null,
    nilCollectives: ['Gael Force NIL'],
    estimatedNILBudget: 600000,
    nilTier: 'EMERGING',
    nilMultiplier: 0.45,
    topSports: ["Men's Basketball", "Women's Basketball", "Women's Volleyball"],
    notablNILDeals: [],
    hasFootball: false,
    footballLevel: null,
    enrollment: 4000,
  },
  {
    name: 'Pepperdine University',
    shortName: 'Pepperdine',
    city: 'Malibu',
    conference: 'West Coast Conference',
    conferenceType: 'MID_MAJOR',
    type: 'private',
    system: null,
    nilCollectives: ['Waves NIL'],
    estimatedNILBudget: 500000,
    nilTier: 'EMERGING',
    nilMultiplier: 0.4,
    topSports: ["Men's Volleyball", "Women's Beach Volleyball", "Men's Tennis", "Women's Golf"],
    notablNILDeals: [],
    hasFootball: false,
    footballLevel: null,
    enrollment: 9000,
  },
  {
    name: 'Loyola Marymount University',
    shortName: 'LMU',
    city: 'Los Angeles',
    conference: 'West Coast Conference',
    conferenceType: 'MID_MAJOR',
    type: 'private',
    system: null,
    nilCollectives: ['Lion NIL'],
    estimatedNILBudget: 400000,
    nilTier: 'LIMITED',
    nilMultiplier: 0.35,
    topSports: ["Men's Basketball", "Women's Basketball", "Women's Tennis"],
    notablNILDeals: [],
    hasFootball: false,
    footballLevel: null,
    enrollment: 10000,
  },
  {
    name: 'University of San Diego',
    shortName: 'San Diego',
    city: 'San Diego',
    conference: 'West Coast Conference',
    conferenceType: 'MID_MAJOR',
    type: 'private',
    system: null,
    nilCollectives: ['Torero NIL'],
    estimatedNILBudget: 500000,
    nilTier: 'EMERGING',
    nilMultiplier: 0.4,
    topSports: ['Football', "Women's Basketball", "Men's Basketball", "Women's Rowing"],
    notablNILDeals: [],
    hasFootball: true,
    footballLevel: 'FCS',
    enrollment: 9000,
  },

  // === FCS (Big Sky Conference) ===
  {
    name: 'California State University, Sacramento',
    shortName: 'Sacramento State',
    city: 'Sacramento',
    conference: 'Big Sky',
    conferenceType: 'FCS',
    type: 'public',
    system: 'CSU',
    nilCollectives: ['Sac-12', 'Hornet NIL'],
    estimatedNILBudget: 35000000, // Massive fundraising for Pac-12 bid
    nilTier: 'HIGH', // Elevated due to Pac-12 ambitions
    nilMultiplier: 0.9, // Higher due to FBS transition plans
    topSports: ['Football', "Men's Basketball", "Women's Basketball", 'Track and Field'],
    notablNILDeals: [],
    hasFootball: true,
    footballLevel: 'FCS',
    enrollment: 31000,
  },

  // === INDEPENDENT ===
  {
    name: 'University of the Pacific',
    shortName: 'Pacific',
    city: 'Stockton',
    conference: 'West Coast Conference',
    conferenceType: 'MID_MAJOR',
    type: 'private',
    system: null,
    nilCollectives: ['Tiger NIL'],
    estimatedNILBudget: 300000,
    nilTier: 'LIMITED',
    nilMultiplier: 0.25,
    topSports: ["Men's Basketball", "Women's Volleyball", "Women's Water Polo"],
    notablNILDeals: [],
    hasFootball: false,
    footballLevel: null,
    enrollment: 6000,
  },
]

// Helper function to get school by short name
export function getSchoolByShortName(shortName: string): CaliforniaSchool | undefined {
  return californiaSchools.find(s => s.shortName.toLowerCase() === shortName.toLowerCase())
}

// Helper function to get schools by conference type
export function getSchoolsByConferenceType(type: CaliforniaSchool['conferenceType']): CaliforniaSchool[] {
  return californiaSchools.filter(s => s.conferenceType === type)
}

// Helper function to get NIL multiplier for a school
export function getNILMultiplier(shortName: string): number {
  const school = getSchoolByShortName(shortName)
  return school?.nilMultiplier || 0.5 // Default to 0.5 if not found
}

// Conference tier multipliers (for non-California schools)
export const conferenceTierMultipliers: Record<string, number> = {
  // Power Four (formerly Power Five)
  'SEC': 1.6,
  'Big Ten': 1.4,
  'Big 12': 1.2,
  'ACC': 1.1,

  // Group of Five
  'Mountain West': 0.7,
  'American Athletic': 0.65,
  'Sun Belt': 0.55,
  'MAC': 0.5,
  'Conference USA': 0.5,

  // Mid-Major Basketball
  'Big East': 1.0, // Basketball strong
  'West Coast Conference': 0.45,
  'Big West': 0.35,
  'Atlantic 10': 0.4,
  'Missouri Valley': 0.35,

  // FCS
  'Big Sky': 0.3,
  'CAA': 0.35,
  'Missouri Valley FCS': 0.3,

  // Other
  'Independent': 0.3,
}

// Sport-specific ceiling values from Opendorse data (Top 25 athletes annual average)
export const sportCeilings: Record<string, number> = {
  'Football': 294000,
  "Men's Basketball": 349000,
  "Women's Basketball": 88975,
  "Women's Gymnastics": 150000, // High social media value
  "Women's Volleyball": 5868,
  'Baseball': 47710,
  'Softball': 8545,
  'Track and Field': 15000,
  "Women's Soccer": 8000,
  "Men's Soccer": 5000,
  'Swimming and Diving': 10000,
  'Tennis': 8000,
  'Golf': 12000,
  'Wrestling': 6000,
  'Beach Volleyball': 10000, // Social media potential
  'Rowing': 3000,
  "Men's Volleyball": 5000,
  "Water Polo": 4000,
}

// Transfer portal premium multiplier
export const TRANSFER_PREMIUM = 1.7

// Agent representation premium multiplier
export const AGENT_PREMIUM = 5.3

// Summary statistics
export const californiaNILSummary = {
  totalSchools: californiaSchools.length, // 26
  powerFourSchools: californiaSchools.filter(s => s.conferenceType === 'POWER_FOUR').length, // 4
  groupOfFiveSchools: californiaSchools.filter(s => s.conferenceType === 'GROUP_OF_FIVE').length, // 3
  midMajorSchools: californiaSchools.filter(s => s.conferenceType === 'MID_MAJOR').length, // 18
  fcsSchools: californiaSchools.filter(s => s.conferenceType === 'FCS').length, // 1
  schoolsWithFootball: californiaSchools.filter(s => s.hasFootball).length, // 12
  fbsSchools: californiaSchools.filter(s => s.footballLevel === 'FBS').length, // 7
  fcsFootballSchools: californiaSchools.filter(s => s.footballLevel === 'FCS').length, // 5
  publicSchools: californiaSchools.filter(s => s.type === 'public').length, // 18
  privateSchools: californiaSchools.filter(s => s.type === 'private').length, // 8
  ucSchools: californiaSchools.filter(s => s.system === 'UC').length, // 9
  csuSchools: californiaSchools.filter(s => s.system === 'CSU').length, // 9
  totalEstimatedNILBudget: californiaSchools.reduce((sum, s) => sum + (s.estimatedNILBudget || 0), 0), // ~$87M+
}
