// Synthetic Athlete Generation for California D1 Schools
// MVP-1 Prototype - Generates ~9,000 realistic athlete profiles

import { californiaSchools, sportCeilings, TRANSFER_PREMIUM, AGENT_PREMIUM, CaliforniaSchool } from './california-schools'

// ============================================
// TYPES
// ============================================

export interface SyntheticAthlete {
  id: string
  firstName: string
  lastName: string
  school: string
  schoolShortName: string
  conference: string
  conferenceType: string
  sport: string
  position: string | null
  classYear: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Grad'
  performanceTier: PerformanceTier
  followerCount: number
  followerTier: string
  isTransfer: boolean
  hasAgent: boolean
  estimatedNILValue: {
    low: number
    median: number
    high: number
    annual: number
  }
  nilMultipliers: {
    school: number
    sport: number
    performance: number
    followers: number
    transfer: number
    agent: number
    total: number
  }
  marketability: number // 1-100 score
  generatedAt: string
}

export type PerformanceTier =
  | 'elite'           // All-American, National Champion, Top 10 Recruit
  | 'all_conference'  // All-Conference, Conference Champion
  | 'starter'         // Starter, Key Contributor
  | 'rotation'        // Rotation Player, Regular Contributor
  | 'developing'      // Developing, Limited Playing Time
  | 'walkon'          // Walk-on, Bench

// ============================================
// ROSTER CONFIGURATIONS
// ============================================

interface SportRoster {
  name: string
  avgRosterSize: number
  positions: string[]
  genderRequired: 'male' | 'female' | 'mixed'
}

export const sportRosters: SportRoster[] = [
  { name: 'Football', avgRosterSize: 105, positions: ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S', 'K', 'P'], genderRequired: 'male' },
  { name: "Men's Basketball", avgRosterSize: 15, positions: ['PG', 'SG', 'SF', 'PF', 'C'], genderRequired: 'male' },
  { name: "Women's Basketball", avgRosterSize: 15, positions: ['PG', 'SG', 'SF', 'PF', 'C'], genderRequired: 'female' },
  { name: "Women's Gymnastics", avgRosterSize: 18, positions: ['All-Around', 'Vault', 'Bars', 'Beam', 'Floor'], genderRequired: 'female' },
  { name: "Women's Volleyball", avgRosterSize: 18, positions: ['Setter', 'Outside Hitter', 'Middle Blocker', 'Opposite', 'Libero'], genderRequired: 'female' },
  { name: 'Baseball', avgRosterSize: 35, positions: ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'], genderRequired: 'male' },
  { name: 'Softball', avgRosterSize: 25, positions: ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'], genderRequired: 'female' },
  { name: "Men's Soccer", avgRosterSize: 28, positions: ['GK', 'CB', 'FB', 'CDM', 'CM', 'CAM', 'W', 'ST'], genderRequired: 'male' },
  { name: "Women's Soccer", avgRosterSize: 28, positions: ['GK', 'CB', 'FB', 'CDM', 'CM', 'CAM', 'W', 'ST'], genderRequired: 'female' },
  { name: 'Track and Field', avgRosterSize: 45, positions: ['Sprinter', 'Distance', 'Hurdles', 'Jumps', 'Throws', 'Multi'], genderRequired: 'mixed' },
  { name: 'Swimming and Diving', avgRosterSize: 30, positions: ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'IM', 'Diver'], genderRequired: 'mixed' },
  { name: "Men's Tennis", avgRosterSize: 10, positions: ['Singles', 'Doubles'], genderRequired: 'male' },
  { name: "Women's Tennis", avgRosterSize: 10, positions: ['Singles', 'Doubles'], genderRequired: 'female' },
  { name: "Men's Golf", avgRosterSize: 10, positions: [], genderRequired: 'male' },
  { name: "Women's Golf", avgRosterSize: 10, positions: [], genderRequired: 'female' },
  { name: 'Wrestling', avgRosterSize: 30, positions: ['125', '133', '141', '149', '157', '165', '174', '184', '197', '285'], genderRequired: 'male' },
  { name: "Women's Rowing", avgRosterSize: 50, positions: ['Coxswain', 'Port', 'Starboard'], genderRequired: 'female' },
  { name: "Men's Volleyball", avgRosterSize: 18, positions: ['Setter', 'Outside Hitter', 'Middle Blocker', 'Opposite', 'Libero'], genderRequired: 'male' },
  { name: "Women's Water Polo", avgRosterSize: 25, positions: ['GK', 'Center', 'Driver', 'Wing', 'Point'], genderRequired: 'female' },
  { name: "Men's Water Polo", avgRosterSize: 25, positions: ['GK', 'Center', 'Driver', 'Wing', 'Point'], genderRequired: 'male' },
  { name: 'Beach Volleyball', avgRosterSize: 12, positions: ['Blocker', 'Defender'], genderRequired: 'female' },
  { name: 'Cross Country', avgRosterSize: 15, positions: [], genderRequired: 'mixed' },
]

// School to sport mapping (which sports each school offers)
const schoolSportsMapping: Record<string, string[]> = {
  // Power Four - Full programs
  'UCLA': ['Football', "Men's Basketball", "Women's Basketball", "Women's Gymnastics", "Women's Volleyball", 'Baseball', 'Softball', "Men's Soccer", "Women's Soccer", 'Track and Field', 'Swimming and Diving', "Men's Tennis", "Women's Tennis", "Men's Golf", "Women's Golf", "Women's Water Polo", "Men's Water Polo", "Women's Rowing", 'Cross Country'],
  'USC': ['Football', "Men's Basketball", "Women's Basketball", "Women's Volleyball", 'Baseball', "Women's Soccer", 'Track and Field', 'Swimming and Diving', "Men's Tennis", "Women's Tennis", "Men's Golf", "Women's Golf", "Women's Water Polo", "Men's Water Polo", "Women's Rowing", 'Beach Volleyball', 'Cross Country'],
  'Stanford': ['Football', "Men's Basketball", "Women's Basketball", "Women's Gymnastics", "Women's Volleyball", 'Baseball', 'Softball', "Men's Soccer", "Women's Soccer", 'Track and Field', 'Swimming and Diving', "Men's Tennis", "Women's Tennis", "Men's Golf", "Women's Golf", "Women's Water Polo", "Women's Rowing", 'Wrestling', 'Cross Country'],
  'Cal': ['Football', "Men's Basketball", "Women's Basketball", "Women's Gymnastics", 'Baseball', 'Softball', "Men's Soccer", "Women's Soccer", 'Track and Field', 'Swimming and Diving', "Men's Tennis", "Women's Tennis", "Women's Golf", "Men's Golf", "Women's Water Polo", "Women's Rowing", 'Cross Country'],

  // Group of Five - FBS with most sports
  'SDSU': ['Football', "Men's Basketball", "Women's Basketball", "Women's Volleyball", 'Baseball', 'Softball', "Men's Soccer", "Women's Soccer", 'Track and Field', 'Swimming and Diving', "Men's Tennis", "Women's Tennis", "Men's Golf", "Women's Golf", "Women's Rowing", 'Cross Country'],
  'Fresno State': ['Football', "Men's Basketball", "Women's Basketball", "Women's Volleyball", 'Baseball', 'Softball', "Women's Soccer", 'Track and Field', 'Swimming and Diving', "Women's Tennis", "Men's Golf", "Women's Golf", 'Cross Country'],
  'SJSU': ['Football', "Men's Basketball", "Women's Basketball", "Women's Volleyball", 'Baseball', 'Softball', "Men's Soccer", "Women's Soccer", 'Track and Field', 'Swimming and Diving', "Men's Tennis", "Women's Tennis", "Men's Golf", "Women's Golf", "Women's Water Polo", 'Cross Country'],

  // Big West (most without football)
  'Long Beach State': ["Men's Basketball", "Women's Basketball", "Women's Volleyball", 'Baseball', 'Softball', "Men's Soccer", "Women's Soccer", 'Track and Field', "Men's Volleyball", "Women's Water Polo", 'Beach Volleyball', 'Cross Country'],
  'Cal State Fullerton': ["Men's Basketball", "Women's Basketball", "Women's Volleyball", 'Baseball', 'Softball', "Men's Soccer", "Women's Soccer", 'Track and Field', "Women's Tennis", 'Wrestling', 'Cross Country'],
  'UCSB': ["Men's Basketball", "Women's Basketball", "Women's Volleyball", 'Baseball', 'Softball', "Men's Soccer", "Women's Soccer", 'Track and Field', 'Swimming and Diving', "Men's Tennis", "Women's Tennis", "Women's Water Polo", 'Cross Country'],
  'UC Irvine': ["Men's Basketball", "Women's Basketball", "Women's Volleyball", 'Baseball', "Men's Soccer", "Women's Soccer", 'Track and Field', "Men's Tennis", "Women's Tennis", "Men's Golf", "Men's Volleyball", "Women's Water Polo", 'Cross Country'],
  'UC Riverside': ["Men's Basketball", "Women's Basketball", "Women's Volleyball", 'Baseball', 'Softball', "Men's Soccer", "Women's Soccer", 'Track and Field', "Men's Tennis", "Women's Tennis", "Men's Golf", "Women's Golf", 'Cross Country'],
  'UCSD': ["Men's Basketball", "Women's Basketball", "Women's Volleyball", 'Baseball', 'Softball', "Men's Soccer", "Women's Soccer", 'Track and Field', 'Swimming and Diving', "Men's Tennis", "Women's Tennis", "Men's Volleyball", "Women's Water Polo", "Women's Rowing", 'Cross Country'],
  'UC Davis': ['Football', "Men's Basketball", "Women's Basketball", "Women's Volleyball", 'Baseball', 'Softball', "Men's Soccer", "Women's Soccer", 'Track and Field', "Men's Tennis", "Women's Tennis", "Men's Golf", "Women's Golf", 'Cross Country'],
  'CSUN': ["Men's Basketball", "Women's Basketball", "Women's Volleyball", 'Baseball', 'Softball', "Men's Soccer", "Women's Soccer", 'Track and Field', 'Swimming and Diving', "Men's Volleyball", 'Cross Country'],
  'CSUB': ["Men's Basketball", "Women's Basketball", "Women's Volleyball", 'Baseball', 'Softball', "Women's Soccer", 'Track and Field', 'Swimming and Diving', "Women's Tennis", 'Wrestling', 'Cross Country'],
  'CBU': ['Football', "Men's Basketball", "Women's Basketball", "Women's Volleyball", 'Baseball', 'Softball', "Men's Soccer", "Women's Soccer", 'Track and Field', 'Swimming and Diving', "Men's Tennis", "Women's Tennis", 'Wrestling', 'Cross Country'],
  'Cal Poly': ['Football', "Men's Basketball", "Women's Basketball", "Women's Volleyball", 'Baseball', 'Softball', "Men's Soccer", "Women's Soccer", 'Track and Field', 'Swimming and Diving', "Men's Tennis", "Women's Tennis", 'Wrestling', 'Cross Country'],

  // WCC (no football, smaller programs)
  'USF': ["Men's Basketball", "Women's Basketball", "Women's Volleyball", 'Baseball', "Men's Soccer", "Women's Soccer", 'Track and Field', "Men's Tennis", "Women's Tennis", "Men's Golf", "Women's Golf", 'Cross Country'],
  'Santa Clara': ["Men's Basketball", "Women's Basketball", "Women's Volleyball", 'Baseball', "Men's Soccer", "Women's Soccer", "Women's Water Polo", "Women's Rowing", 'Cross Country'],
  "Saint Mary's": ["Men's Basketball", "Women's Basketball", "Women's Volleyball", 'Baseball', 'Softball', "Men's Soccer", "Women's Soccer", "Men's Tennis", "Women's Tennis", 'Cross Country'],
  'Pepperdine': ["Men's Basketball", "Women's Basketball", "Women's Volleyball", 'Baseball', "Men's Tennis", "Women's Tennis", "Men's Golf", "Women's Golf", "Men's Volleyball", 'Beach Volleyball', 'Swimming and Diving', "Women's Water Polo", 'Cross Country'],
  'LMU': ["Men's Basketball", "Women's Basketball", "Women's Volleyball", 'Baseball', 'Softball', "Men's Soccer", "Women's Soccer", 'Track and Field', 'Swimming and Diving', "Men's Tennis", "Women's Tennis", "Women's Water Polo", "Women's Rowing", 'Cross Country'],
  'San Diego': ['Football', "Men's Basketball", "Women's Basketball", "Women's Volleyball", 'Baseball', 'Softball', "Men's Soccer", "Women's Soccer", 'Track and Field', 'Swimming and Diving', "Men's Tennis", "Women's Tennis", "Women's Rowing", 'Cross Country'],

  // FCS
  'Sacramento State': ['Football', "Men's Basketball", "Women's Basketball", "Women's Volleyball", 'Baseball', 'Softball', "Men's Soccer", "Women's Soccer", 'Track and Field', "Men's Tennis", "Women's Tennis", "Men's Golf", "Women's Golf", "Women's Rowing", 'Cross Country'],

  // Independent/Other
  'Pacific': ["Men's Basketball", "Women's Basketball", "Women's Volleyball", 'Baseball', 'Softball', "Women's Soccer", 'Swimming and Diving', "Women's Tennis", "Men's Water Polo", "Women's Water Polo", 'Cross Country'],
}

// ============================================
// DISTRIBUTION CONFIGURATIONS
// ============================================

// Performance tier distribution (realistic pyramid)
const performanceTierDistribution: Record<PerformanceTier, number> = {
  'elite': 0.02,           // 2% - All-Americans, etc.
  'all_conference': 0.08,  // 8% - All-Conference
  'starter': 0.25,         // 25% - Starters
  'rotation': 0.30,        // 30% - Rotation players
  'developing': 0.25,      // 25% - Developing
  'walkon': 0.10,          // 10% - Walk-ons
}

const performanceMultipliers: Record<PerformanceTier, number> = {
  'elite': 3.0,
  'all_conference': 2.0,
  'starter': 1.25,
  'rotation': 1.0,
  'developing': 0.6,
  'walkon': 0.3,
}

// Follower distribution (power-law - most have few, few have many)
const followerDistribution = [
  { range: [0, 500], probability: 0.30, tier: 'under_1k', multiplier: 0.5 },
  { range: [500, 1000], probability: 0.20, tier: 'under_1k', multiplier: 0.5 },
  { range: [1000, 5000], probability: 0.25, tier: '1k_10k', multiplier: 0.75 },
  { range: [5000, 10000], probability: 0.12, tier: '1k_10k', multiplier: 0.75 },
  { range: [10000, 25000], probability: 0.07, tier: '10k_50k', multiplier: 1.0 },
  { range: [25000, 50000], probability: 0.03, tier: '10k_50k', multiplier: 1.0 },
  { range: [50000, 100000], probability: 0.02, tier: '50k_100k', multiplier: 1.5 },
  { range: [100000, 500000], probability: 0.008, tier: '100k_500k', multiplier: 2.5 },
  { range: [500000, 1000000], probability: 0.0015, tier: '500k_1m', multiplier: 4.0 },
  { range: [1000000, 5000000], probability: 0.0005, tier: '1m_plus', multiplier: 8.0 },
]

// Class year distribution
const classYearDistribution: Record<SyntheticAthlete['classYear'], number> = {
  'Freshman': 0.25,
  'Sophomore': 0.25,
  'Junior': 0.22,
  'Senior': 0.20,
  'Grad': 0.08,
}

// Transfer probability by class year
const transferProbability: Record<SyntheticAthlete['classYear'], number> = {
  'Freshman': 0.02,  // Rare for freshmen
  'Sophomore': 0.15,
  'Junior': 0.20,
  'Senior': 0.12,
  'Grad': 0.35,      // Grad transfers common
}

// Agent probability by performance tier
const agentProbability: Record<PerformanceTier, number> = {
  'elite': 0.60,
  'all_conference': 0.25,
  'starter': 0.08,
  'rotation': 0.02,
  'developing': 0.01,
  'walkon': 0.005,
}

// ============================================
// NAME GENERATION
// ============================================

const maleFirstNames = [
  'James', 'John', 'Michael', 'David', 'Chris', 'Daniel', 'Matthew', 'Anthony', 'Marcus', 'Joshua',
  'Brandon', 'Justin', 'Tyler', 'Ryan', 'Kevin', 'Austin', 'Jordan', 'Dylan', 'Kyle', 'Nathan',
  'Jaylen', 'Malik', 'DeShawn', 'Terrance', 'Andre', 'Marcus', 'Darius', 'Jamal', 'Tyrone', 'Devin',
  'Cameron', 'Cole', 'Blake', 'Ethan', 'Logan', 'Mason', 'Aiden', 'Jackson', 'Carter', 'Lucas',
  'Caleb', 'Isaiah', 'Elijah', 'Owen', 'Sebastian', 'Gabriel', 'Mateo', 'Diego', 'Carlos', 'Miguel',
  'Angel', 'Jose', 'Luis', 'Alejandro', 'Ricardo', 'Bryan', 'Eric', 'Steven', 'Timothy', 'Brian',
  'Kai', 'Tanner', 'Chase', 'Hunter', 'Colton', 'Wyatt', 'Jaxon', 'Bryce', 'Brayden', 'Landon',
  'Tre', 'Quincy', 'Rashad', 'DeMarcus', 'Jalen', 'Kobe', 'Kyrie', 'Zion', 'Lamelo', 'Ja',
]

const femaleFirstNames = [
  'Emma', 'Olivia', 'Sophia', 'Ava', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn',
  'Ashley', 'Jessica', 'Sarah', 'Taylor', 'Madison', 'Morgan', 'Alexis', 'Samantha', 'Lauren', 'Kayla',
  'Jasmine', 'Aaliyah', 'Destiny', 'Diamond', 'Ebony', 'Imani', 'Jada', 'Kiara', 'Maya', 'Nia',
  'Brooklyn', 'Kennedy', 'Peyton', 'Riley', 'Sydney', 'Avery', 'Bailey', 'Mackenzie', 'Addison', 'Aubrey',
  'Camila', 'Sofia', 'Valentina', 'Luna', 'Aria', 'Scarlett', 'Elena', 'Natalia', 'Gabriella', 'Victoria',
  'Maria', 'Ana', 'Isabel', 'Catalina', 'Carmen', 'Rosa', 'Adriana', 'Daniela', 'Andrea', 'Paola',
  'Jade', 'Sierra', 'Autumn', 'Savannah', 'Alexis', 'Jordan', 'Cameron', 'Dylan', 'Parker', 'Quinn',
  'Simone', 'Brianna', 'Tiffany', 'Dominique', 'Monique', 'Cheyenne', 'Raven', 'Jazmine', 'Aliyah', 'Tatiana',
]

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
  'Turner', 'Phillips', 'Evans', 'Parker', 'Edwards', 'Collins', 'Stewart', 'Morris', 'Morales', 'Murphy',
  'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly',
  'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood',
  'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders',
]

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Seeded random for reproducibility
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
}

function weightedRandom<T>(items: { item: T; weight: number }[], random: () => number): T {
  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0)
  let r = random() * totalWeight
  for (const { item, weight } of items) {
    r -= weight
    if (r <= 0) return item
  }
  return items[items.length - 1].item
}

function randomFromArray<T>(arr: T[], random: () => number): T {
  return arr[Math.floor(random() * arr.length)]
}

function randomInRange(min: number, max: number, random: () => number): number {
  return Math.floor(random() * (max - min + 1)) + min
}

function generateId(school: string, sport: string, index: number): string {
  const schoolCode = school.substring(0, 3).toUpperCase()
  const sportCode = sport.replace(/[^A-Z]/gi, '').substring(0, 3).toUpperCase()
  return `${schoolCode}-${sportCode}-${String(index).padStart(4, '0')}`
}

// ============================================
// MAIN GENERATION FUNCTION
// ============================================

export function generateSyntheticAthletes(seed: number = 42): SyntheticAthlete[] {
  const random = seededRandom(seed)
  const athletes: SyntheticAthlete[] = []

  for (const school of californiaSchools) {
    const schoolSports = schoolSportsMapping[school.shortName] || []

    for (const sportName of schoolSports) {
      const sportConfig = sportRosters.find(s => s.name === sportName)
      if (!sportConfig) continue

      // Vary roster size slightly
      const rosterSize = Math.floor(sportConfig.avgRosterSize * (0.9 + random() * 0.2))

      for (let i = 0; i < rosterSize; i++) {
        // Generate basic info
        const isFemale = sportConfig.genderRequired === 'female' ||
          (sportConfig.genderRequired === 'mixed' && random() < 0.5)

        const firstName = isFemale
          ? randomFromArray(femaleFirstNames, random)
          : randomFromArray(maleFirstNames, random)
        const lastName = randomFromArray(lastNames, random)

        // Performance tier
        const performanceTier = weightedRandom(
          Object.entries(performanceTierDistribution).map(([tier, weight]) => ({
            item: tier as PerformanceTier,
            weight,
          })),
          random
        )

        // Class year
        const classYear = weightedRandom(
          Object.entries(classYearDistribution).map(([year, weight]) => ({
            item: year as SyntheticAthlete['classYear'],
            weight,
          })),
          random
        )

        // Follower count (power-law distribution, boosted by performance)
        const followerBoost = performanceTier === 'elite' ? 1.5 :
          performanceTier === 'all_conference' ? 1.2 : 1.0

        const followerRoll = random() / followerBoost
        let followerCount = 0
        let followerTier = 'under_1k'
        let followerMultiplier = 0.5

        let cumulative = 0
        for (const dist of followerDistribution) {
          cumulative += dist.probability
          if (followerRoll < cumulative) {
            followerCount = randomInRange(dist.range[0], dist.range[1], random)
            followerTier = dist.tier
            followerMultiplier = dist.multiplier
            break
          }
        }

        // Special boost for high-profile sports + elite performance
        if ((sportName === "Women's Gymnastics" || sportName === 'Football' || sportName.includes('Basketball'))
            && performanceTier === 'elite') {
          followerCount = Math.min(followerCount * 3, 2000000)
          if (followerCount > 100000) followerMultiplier = 2.5
          if (followerCount > 500000) followerMultiplier = 4.0
        }

        // Transfer status
        const isTransfer = random() < transferProbability[classYear]

        // Agent status
        const hasAgent = random() < agentProbability[performanceTier]

        // Calculate NIL value
        const baseValue = 1000 // Base deal value
        const sportMultiplier = (sportCeilings[sportName] || 5000) / 50000 // Normalize to ~0.1-7x
        const performanceMultiplier = performanceMultipliers[performanceTier]
        const transferMultiplier = isTransfer ? TRANSFER_PREMIUM : 1.0
        const agentMultiplier = hasAgent ? AGENT_PREMIUM : 1.0

        const totalMultiplier = school.nilMultiplier * sportMultiplier * performanceMultiplier *
          followerMultiplier * transferMultiplier * agentMultiplier

        const medianValue = Math.round(baseValue * totalMultiplier)
        const lowValue = Math.round(medianValue * 0.4)
        const highValue = Math.round(medianValue * 2.5)
        const annualValue = Math.round(medianValue * 4) // ~4 deals per year average

        // Marketability score (1-100)
        const marketability = Math.min(100, Math.round(
          (performanceMultipliers[performanceTier] / 3 * 30) + // Performance: 0-30
          (followerMultiplier / 8 * 30) + // Followers: 0-30
          (school.nilMultiplier / 1.5 * 20) + // School: 0-20
          (sportMultiplier * 3) + // Sport: 0-15
          (isTransfer ? 3 : 0) + // Transfer bonus
          (hasAgent ? 2 : 0) // Agent bonus
        ))

        const athlete: SyntheticAthlete = {
          id: generateId(school.shortName, sportName, i),
          firstName,
          lastName,
          school: school.name,
          schoolShortName: school.shortName,
          conference: school.conference,
          conferenceType: school.conferenceType,
          sport: sportName,
          position: sportConfig.positions.length > 0
            ? randomFromArray(sportConfig.positions, random)
            : null,
          classYear,
          performanceTier,
          followerCount,
          followerTier,
          isTransfer,
          hasAgent,
          estimatedNILValue: {
            low: lowValue,
            median: medianValue,
            high: highValue,
            annual: annualValue,
          },
          nilMultipliers: {
            school: school.nilMultiplier,
            sport: sportMultiplier,
            performance: performanceMultiplier,
            followers: followerMultiplier,
            transfer: transferMultiplier,
            agent: agentMultiplier,
            total: totalMultiplier,
          },
          marketability,
          generatedAt: new Date().toISOString(),
        }

        athletes.push(athlete)
      }
    }
  }

  return athletes
}

// ============================================
// FILTERING & SORTING UTILITIES
// ============================================

export function filterAthletes(
  athletes: SyntheticAthlete[],
  filters: {
    school?: string
    sport?: string
    performanceTier?: PerformanceTier
    minFollowers?: number
    maxFollowers?: number
    isTransfer?: boolean
    hasAgent?: boolean
    minNILValue?: number
    maxNILValue?: number
    classYear?: string
    conference?: string
  }
): SyntheticAthlete[] {
  return athletes.filter(a => {
    if (filters.school && a.schoolShortName !== filters.school) return false
    if (filters.sport && a.sport !== filters.sport) return false
    if (filters.performanceTier && a.performanceTier !== filters.performanceTier) return false
    if (filters.minFollowers && a.followerCount < filters.minFollowers) return false
    if (filters.maxFollowers && a.followerCount > filters.maxFollowers) return false
    if (filters.isTransfer !== undefined && a.isTransfer !== filters.isTransfer) return false
    if (filters.hasAgent !== undefined && a.hasAgent !== filters.hasAgent) return false
    if (filters.minNILValue && a.estimatedNILValue.median < filters.minNILValue) return false
    if (filters.maxNILValue && a.estimatedNILValue.median > filters.maxNILValue) return false
    if (filters.classYear && a.classYear !== filters.classYear) return false
    if (filters.conference && a.conference !== filters.conference) return false
    return true
  })
}

export function sortAthletes(
  athletes: SyntheticAthlete[],
  sortBy: 'nilValue' | 'followers' | 'marketability' | 'name' | 'school',
  direction: 'asc' | 'desc' = 'desc'
): SyntheticAthlete[] {
  const sorted = [...athletes].sort((a, b) => {
    let comparison = 0
    switch (sortBy) {
      case 'nilValue':
        comparison = a.estimatedNILValue.median - b.estimatedNILValue.median
        break
      case 'followers':
        comparison = a.followerCount - b.followerCount
        break
      case 'marketability':
        comparison = a.marketability - b.marketability
        break
      case 'name':
        comparison = `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`)
        break
      case 'school':
        comparison = a.school.localeCompare(b.school)
        break
    }
    return direction === 'desc' ? -comparison : comparison
  })
  return sorted
}

// ============================================
// STATISTICS FUNCTIONS
// ============================================

export function getAthleteStatistics(athletes: SyntheticAthlete[]) {
  const totalAthletes = athletes.length
  const totalNILValue = athletes.reduce((sum, a) => sum + a.estimatedNILValue.annual, 0)
  const avgNILValue = totalNILValue / totalAthletes

  const bySchool = new Map<string, SyntheticAthlete[]>()
  const bySport = new Map<string, SyntheticAthlete[]>()
  const byPerformance = new Map<PerformanceTier, SyntheticAthlete[]>()

  for (const athlete of athletes) {
    if (!bySchool.has(athlete.schoolShortName)) bySchool.set(athlete.schoolShortName, [])
    bySchool.get(athlete.schoolShortName)!.push(athlete)

    if (!bySport.has(athlete.sport)) bySport.set(athlete.sport, [])
    bySport.get(athlete.sport)!.push(athlete)

    if (!byPerformance.has(athlete.performanceTier)) byPerformance.set(athlete.performanceTier, [])
    byPerformance.get(athlete.performanceTier)!.push(athlete)
  }

  const topAthletes = sortAthletes(athletes, 'nilValue', 'desc').slice(0, 100)
  const transferAthletes = athletes.filter(a => a.isTransfer)
  const agentAthletes = athletes.filter(a => a.hasAgent)

  return {
    totalAthletes,
    totalNILValue,
    avgNILValue,
    medianNILValue: athletes.sort((a, b) => a.estimatedNILValue.median - b.estimatedNILValue.median)[Math.floor(totalAthletes / 2)]?.estimatedNILValue.median || 0,
    athletesBySchool: Object.fromEntries(bySchool),
    athletesBySport: Object.fromEntries(bySport),
    athletesByPerformance: Object.fromEntries(byPerformance),
    topAthletes,
    transferAthletes: transferAthletes.length,
    transferPercentage: (transferAthletes.length / totalAthletes * 100).toFixed(1),
    agentAthletes: agentAthletes.length,
    agentPercentage: (agentAthletes.length / totalAthletes * 100).toFixed(1),
    schoolCount: bySchool.size,
    sportCount: bySport.size,
  }
}

// ============================================
// PRE-GENERATED DATA (for instant loading)
// ============================================

// Generate once with fixed seed for consistency
let _cachedAthletes: SyntheticAthlete[] | null = null

export function getCachedAthletes(): SyntheticAthlete[] {
  if (!_cachedAthletes) {
    _cachedAthletes = generateSyntheticAthletes(42)
  }
  return _cachedAthletes
}

// Export statistics for quick access
export function getQuickStats() {
  const athletes = getCachedAthletes()
  return {
    total: athletes.length,
    schools: Array.from(new Set(athletes.map(a => a.schoolShortName))).length,
    sports: Array.from(new Set(athletes.map(a => a.sport))).length,
    totalNILValue: athletes.reduce((sum, a) => sum + a.estimatedNILValue.annual, 0),
    eliteAthletes: athletes.filter(a => a.performanceTier === 'elite').length,
    transfers: athletes.filter(a => a.isTransfer).length,
    withAgents: athletes.filter(a => a.hasAgent).length,
  }
}
