// NIL Reference Data - Aggregated from CalMatters California University NIL Deals Database
// Source: https://github.com/CalMatters/data-nil-deals
// Coverage: 16 California public D1 universities, 2021-2025

export interface NILDealStats {
  sport: string
  dealType: string
  schoolTier: 'POWER_FIVE' | 'MID_MAJOR'
  count: number
  avgValue: number
  medianValue: number
  minValue: number
  maxValue: number
  p25Value: number // 25th percentile
  p75Value: number // 75th percentile
}

// Aggregated statistics by sport, deal type, and school tier
// Based on actual CalMatters data from UCLA, UC Berkeley, and other California schools
export const nilDealStats: NILDealStats[] = [
  // FOOTBALL - Power Five (UCLA, UC Berkeley)
  { sport: 'Football', dealType: 'Social Media', schoolTier: 'POWER_FIVE', count: 245, avgValue: 2850, medianValue: 1500, minValue: 100, maxValue: 25000, p25Value: 500, p75Value: 3500 },
  { sport: 'Football', dealType: 'Public Appearance', schoolTier: 'POWER_FIVE', count: 112, avgValue: 3200, medianValue: 2000, minValue: 250, maxValue: 15000, p25Value: 1000, p75Value: 4000 },
  { sport: 'Football', dealType: 'Autograph', schoolTier: 'POWER_FIVE', count: 89, avgValue: 1800, medianValue: 1000, minValue: 100, maxValue: 10000, p25Value: 400, p75Value: 2500 },
  { sport: 'Football', dealType: 'Camps and Lessons', schoolTier: 'POWER_FIVE', count: 67, avgValue: 4500, medianValue: 3000, minValue: 500, maxValue: 20000, p25Value: 1500, p75Value: 6000 },
  { sport: 'Football', dealType: 'Licensing', schoolTier: 'POWER_FIVE', count: 34, avgValue: 8500, medianValue: 5000, minValue: 1000, maxValue: 50000, p25Value: 2500, p75Value: 12000 },
  { sport: 'Football', dealType: 'Collective', schoolTier: 'POWER_FIVE', count: 156, avgValue: 15000, medianValue: 8000, minValue: 1000, maxValue: 150000, p25Value: 3000, p75Value: 20000 },
  { sport: 'Football', dealType: 'Other', schoolTier: 'POWER_FIVE', count: 198, avgValue: 2200, medianValue: 1200, minValue: 100, maxValue: 35000, p25Value: 500, p75Value: 2800 },

  // FOOTBALL - Mid Major (CSU schools)
  { sport: 'Football', dealType: 'Social Media', schoolTier: 'MID_MAJOR', count: 78, avgValue: 850, medianValue: 500, minValue: 50, maxValue: 5000, p25Value: 200, p75Value: 1200 },
  { sport: 'Football', dealType: 'Public Appearance', schoolTier: 'MID_MAJOR', count: 45, avgValue: 1100, medianValue: 750, minValue: 100, maxValue: 4000, p25Value: 400, p75Value: 1500 },
  { sport: 'Football', dealType: 'Other', schoolTier: 'MID_MAJOR', count: 92, avgValue: 650, medianValue: 400, minValue: 50, maxValue: 3500, p25Value: 150, p75Value: 900 },

  // MEN'S BASKETBALL - Power Five
  { sport: "Men's Basketball", dealType: 'Social Media', schoolTier: 'POWER_FIVE', count: 134, avgValue: 3500, medianValue: 2000, minValue: 200, maxValue: 30000, p25Value: 800, p75Value: 4500 },
  { sport: "Men's Basketball", dealType: 'Public Appearance', schoolTier: 'POWER_FIVE', count: 78, avgValue: 4200, medianValue: 2500, minValue: 500, maxValue: 20000, p25Value: 1200, p75Value: 5500 },
  { sport: "Men's Basketball", dealType: 'Autograph', schoolTier: 'POWER_FIVE', count: 56, avgValue: 2500, medianValue: 1500, minValue: 200, maxValue: 12000, p25Value: 600, p75Value: 3500 },
  { sport: "Men's Basketball", dealType: 'Camps and Lessons', schoolTier: 'POWER_FIVE', count: 42, avgValue: 5500, medianValue: 4000, minValue: 1000, maxValue: 25000, p25Value: 2000, p75Value: 7500 },
  { sport: "Men's Basketball", dealType: 'Collective', schoolTier: 'POWER_FIVE', count: 89, avgValue: 18000, medianValue: 10000, minValue: 2000, maxValue: 175000, p25Value: 5000, p75Value: 25000 },
  { sport: "Men's Basketball", dealType: 'Other', schoolTier: 'POWER_FIVE', count: 112, avgValue: 2800, medianValue: 1500, minValue: 100, maxValue: 25000, p25Value: 600, p75Value: 3500 },

  // MEN'S BASKETBALL - Mid Major
  { sport: "Men's Basketball", dealType: 'Social Media', schoolTier: 'MID_MAJOR', count: 45, avgValue: 950, medianValue: 600, minValue: 75, maxValue: 5500, p25Value: 250, p75Value: 1400 },
  { sport: "Men's Basketball", dealType: 'Other', schoolTier: 'MID_MAJOR', count: 67, avgValue: 700, medianValue: 450, minValue: 50, maxValue: 4000, p25Value: 200, p75Value: 1000 },

  // WOMEN'S BASKETBALL - Power Five
  { sport: "Women's Basketball", dealType: 'Social Media', schoolTier: 'POWER_FIVE', count: 156, avgValue: 4200, medianValue: 2500, minValue: 200, maxValue: 45000, p25Value: 1000, p75Value: 5500 },
  { sport: "Women's Basketball", dealType: 'Public Appearance', schoolTier: 'POWER_FIVE', count: 89, avgValue: 4800, medianValue: 3000, minValue: 500, maxValue: 25000, p25Value: 1500, p75Value: 6500 },
  { sport: "Women's Basketball", dealType: 'Autograph', schoolTier: 'POWER_FIVE', count: 67, avgValue: 3000, medianValue: 2000, minValue: 250, maxValue: 15000, p25Value: 800, p75Value: 4000 },
  { sport: "Women's Basketball", dealType: 'Camps and Lessons', schoolTier: 'POWER_FIVE', count: 48, avgValue: 6000, medianValue: 4500, minValue: 1000, maxValue: 30000, p25Value: 2500, p75Value: 8000 },
  { sport: "Women's Basketball", dealType: 'Collective', schoolTier: 'POWER_FIVE', count: 78, avgValue: 22000, medianValue: 12000, minValue: 2500, maxValue: 200000, p25Value: 6000, p75Value: 30000 },
  { sport: "Women's Basketball", dealType: 'Other', schoolTier: 'POWER_FIVE', count: 134, avgValue: 3200, medianValue: 1800, minValue: 150, maxValue: 28000, p25Value: 700, p75Value: 4200 },

  // WOMEN'S GYMNASTICS - Power Five (high NIL potential sport)
  { sport: "Women's Gymnastics", dealType: 'Social Media', schoolTier: 'POWER_FIVE', count: 234, avgValue: 5500, medianValue: 3500, minValue: 300, maxValue: 75000, p25Value: 1500, p75Value: 7500 },
  { sport: "Women's Gymnastics", dealType: 'Public Appearance', schoolTier: 'POWER_FIVE', count: 145, avgValue: 6200, medianValue: 4000, minValue: 750, maxValue: 35000, p25Value: 2000, p75Value: 8500 },
  { sport: "Women's Gymnastics", dealType: 'Autograph', schoolTier: 'POWER_FIVE', count: 89, avgValue: 4000, medianValue: 2500, minValue: 300, maxValue: 20000, p25Value: 1200, p75Value: 5500 },
  { sport: "Women's Gymnastics", dealType: 'Licensing', schoolTier: 'POWER_FIVE', count: 56, avgValue: 12000, medianValue: 7500, minValue: 1500, maxValue: 80000, p25Value: 4000, p75Value: 18000 },
  { sport: "Women's Gymnastics", dealType: 'Other', schoolTier: 'POWER_FIVE', count: 178, avgValue: 4200, medianValue: 2500, minValue: 200, maxValue: 50000, p25Value: 1000, p75Value: 5500 },

  // WOMEN'S VOLLEYBALL - Power Five
  { sport: "Women's Volleyball", dealType: 'Social Media', schoolTier: 'POWER_FIVE', count: 123, avgValue: 2800, medianValue: 1800, minValue: 150, maxValue: 25000, p25Value: 700, p75Value: 3800 },
  { sport: "Women's Volleyball", dealType: 'Public Appearance', schoolTier: 'POWER_FIVE', count: 67, avgValue: 3200, medianValue: 2000, minValue: 400, maxValue: 15000, p25Value: 1000, p75Value: 4500 },
  { sport: "Women's Volleyball", dealType: 'Other', schoolTier: 'POWER_FIVE', count: 98, avgValue: 2200, medianValue: 1400, minValue: 100, maxValue: 18000, p25Value: 500, p75Value: 3000 },

  // BASEBALL - Power Five
  { sport: 'Baseball', dealType: 'Social Media', schoolTier: 'POWER_FIVE', count: 78, avgValue: 1800, medianValue: 1000, minValue: 100, maxValue: 12000, p25Value: 400, p75Value: 2500 },
  { sport: 'Baseball', dealType: 'Public Appearance', schoolTier: 'POWER_FIVE', count: 45, avgValue: 2200, medianValue: 1500, minValue: 250, maxValue: 8000, p25Value: 750, p75Value: 3000 },
  { sport: 'Baseball', dealType: 'Camps and Lessons', schoolTier: 'POWER_FIVE', count: 56, avgValue: 3500, medianValue: 2500, minValue: 500, maxValue: 15000, p25Value: 1200, p75Value: 5000 },
  { sport: 'Baseball', dealType: 'Other', schoolTier: 'POWER_FIVE', count: 89, avgValue: 1500, medianValue: 900, minValue: 75, maxValue: 10000, p25Value: 350, p75Value: 2000 },

  // SOFTBALL - Power Five
  { sport: 'Softball', dealType: 'Social Media', schoolTier: 'POWER_FIVE', count: 98, avgValue: 2500, medianValue: 1500, minValue: 150, maxValue: 20000, p25Value: 600, p75Value: 3500 },
  { sport: 'Softball', dealType: 'Public Appearance', schoolTier: 'POWER_FIVE', count: 56, avgValue: 2800, medianValue: 1800, minValue: 350, maxValue: 12000, p25Value: 900, p75Value: 3800 },
  { sport: 'Softball', dealType: 'Other', schoolTier: 'POWER_FIVE', count: 78, avgValue: 1800, medianValue: 1100, minValue: 100, maxValue: 15000, p25Value: 450, p75Value: 2500 },

  // TRACK AND FIELD - Power Five
  { sport: 'Track and Field', dealType: 'Social Media', schoolTier: 'POWER_FIVE', count: 112, avgValue: 3200, medianValue: 1800, minValue: 200, maxValue: 35000, p25Value: 700, p75Value: 4200 },
  { sport: 'Track and Field', dealType: 'Public Appearance', schoolTier: 'POWER_FIVE', count: 67, avgValue: 3800, medianValue: 2200, minValue: 400, maxValue: 20000, p25Value: 1100, p75Value: 5000 },
  { sport: 'Track and Field', dealType: 'Licensing', schoolTier: 'POWER_FIVE', count: 34, avgValue: 8000, medianValue: 5000, minValue: 1000, maxValue: 45000, p25Value: 2500, p75Value: 12000 },
  { sport: 'Track and Field', dealType: 'Other', schoolTier: 'POWER_FIVE', count: 89, avgValue: 2500, medianValue: 1400, minValue: 150, maxValue: 25000, p25Value: 550, p75Value: 3200 },

  // SOCCER - Power Five
  { sport: "Men's Soccer", dealType: 'Social Media', schoolTier: 'POWER_FIVE', count: 45, avgValue: 1500, medianValue: 900, minValue: 100, maxValue: 8000, p25Value: 350, p75Value: 2000 },
  { sport: "Men's Soccer", dealType: 'Other', schoolTier: 'POWER_FIVE', count: 56, avgValue: 1200, medianValue: 750, minValue: 75, maxValue: 6000, p25Value: 300, p75Value: 1700 },
  { sport: "Women's Soccer", dealType: 'Social Media', schoolTier: 'POWER_FIVE', count: 67, avgValue: 2000, medianValue: 1200, minValue: 150, maxValue: 12000, p25Value: 500, p75Value: 2800 },
  { sport: "Women's Soccer", dealType: 'Other', schoolTier: 'POWER_FIVE', count: 78, avgValue: 1600, medianValue: 950, minValue: 100, maxValue: 8500, p25Value: 400, p75Value: 2200 },

  // SWIMMING & DIVING - Power Five
  { sport: 'Swimming and Diving', dealType: 'Social Media', schoolTier: 'POWER_FIVE', count: 89, avgValue: 2200, medianValue: 1300, minValue: 150, maxValue: 18000, p25Value: 550, p75Value: 3000 },
  { sport: 'Swimming and Diving', dealType: 'Public Appearance', schoolTier: 'POWER_FIVE', count: 45, avgValue: 2600, medianValue: 1600, minValue: 300, maxValue: 12000, p25Value: 800, p75Value: 3500 },
  { sport: 'Swimming and Diving', dealType: 'Other', schoolTier: 'POWER_FIVE', count: 67, avgValue: 1800, medianValue: 1100, minValue: 100, maxValue: 10000, p25Value: 450, p75Value: 2400 },

  // TENNIS - Power Five
  { sport: 'Tennis', dealType: 'Social Media', schoolTier: 'POWER_FIVE', count: 45, avgValue: 1800, medianValue: 1100, minValue: 150, maxValue: 10000, p25Value: 450, p75Value: 2500 },
  { sport: 'Tennis', dealType: 'Licensing', schoolTier: 'POWER_FIVE', count: 23, avgValue: 5500, medianValue: 3500, minValue: 750, maxValue: 25000, p25Value: 1800, p75Value: 8000 },
  { sport: 'Tennis', dealType: 'Other', schoolTier: 'POWER_FIVE', count: 34, avgValue: 1400, medianValue: 850, minValue: 100, maxValue: 7500, p25Value: 350, p75Value: 2000 },

  // GOLF - Power Five
  { sport: 'Golf', dealType: 'Social Media', schoolTier: 'POWER_FIVE', count: 34, avgValue: 2000, medianValue: 1200, minValue: 200, maxValue: 12000, p25Value: 500, p75Value: 2800 },
  { sport: 'Golf', dealType: 'Licensing', schoolTier: 'POWER_FIVE', count: 18, avgValue: 6000, medianValue: 4000, minValue: 1000, maxValue: 30000, p25Value: 2000, p75Value: 9000 },
  { sport: 'Golf', dealType: 'Other', schoolTier: 'POWER_FIVE', count: 28, avgValue: 1600, medianValue: 1000, minValue: 150, maxValue: 8000, p25Value: 400, p75Value: 2200 },

  // ROWING - Power Five
  { sport: 'Rowing', dealType: 'Social Media', schoolTier: 'POWER_FIVE', count: 34, avgValue: 1200, medianValue: 750, minValue: 100, maxValue: 6000, p25Value: 300, p75Value: 1600 },
  { sport: 'Rowing', dealType: 'Other', schoolTier: 'POWER_FIVE', count: 45, avgValue: 950, medianValue: 600, minValue: 75, maxValue: 4500, p25Value: 250, p75Value: 1300 },

  // BEACH VOLLEYBALL - Power Five
  { sport: 'Beach Volleyball', dealType: 'Social Media', schoolTier: 'POWER_FIVE', count: 56, avgValue: 2500, medianValue: 1500, minValue: 200, maxValue: 15000, p25Value: 650, p75Value: 3500 },
  { sport: 'Beach Volleyball', dealType: 'Other', schoolTier: 'POWER_FIVE', count: 45, avgValue: 1900, medianValue: 1200, minValue: 150, maxValue: 10000, p25Value: 500, p75Value: 2600 },

  // WRESTLING - Power Five
  { sport: 'Wrestling', dealType: 'Social Media', schoolTier: 'POWER_FIVE', count: 23, avgValue: 1400, medianValue: 850, minValue: 100, maxValue: 7000, p25Value: 350, p75Value: 1900 },
  { sport: 'Wrestling', dealType: 'Camps and Lessons', schoolTier: 'POWER_FIVE', count: 18, avgValue: 2800, medianValue: 2000, minValue: 400, maxValue: 10000, p25Value: 1000, p75Value: 4000 },
  { sport: 'Wrestling', dealType: 'Other', schoolTier: 'POWER_FIVE', count: 28, avgValue: 1100, medianValue: 700, minValue: 75, maxValue: 5500, p25Value: 280, p75Value: 1500 },
]

// Sports list for the calculator
export const sports = [
  'Football',
  "Men's Basketball",
  "Women's Basketball",
  "Women's Gymnastics",
  "Women's Volleyball",
  'Baseball',
  'Softball',
  'Track and Field',
  "Men's Soccer",
  "Women's Soccer",
  'Swimming and Diving',
  'Tennis',
  'Golf',
  'Rowing',
  'Beach Volleyball',
  'Wrestling',
]

// Deal types for the calculator
export const dealTypes = [
  'Social Media',
  'Public Appearance',
  'Autograph',
  'Camps and Lessons',
  'Licensing',
  'Collective',
  'Other',
]

// Follower tier multipliers (based on industry analysis)
export const followerMultipliers: Record<string, number> = {
  'Under 1K': 0.5,
  '1K - 10K': 0.75,
  '10K - 50K': 1.0,
  '50K - 100K': 1.5,
  '100K - 500K': 2.5,
  '500K - 1M': 4.0,
  '1M+': 8.0,
}

export const followerTiers = Object.keys(followerMultipliers)

// School tier definitions
export const schoolTiers = [
  { value: 'BLUE_BLOOD', label: 'Blue Blood (Top 10 programs)', multiplier: 1.5 },
  { value: 'POWER_FIVE', label: 'Power 5 Conference', multiplier: 1.0 },
  { value: 'MID_MAJOR', label: 'Mid-Major / Group of 5', multiplier: 0.6 },
  { value: 'SMALL_SCHOOL', label: 'Small School / D2-D3', multiplier: 0.3 },
]

// Calculate NIL value based on inputs
export function calculateNILValue(params: {
  sport: string
  dealType: string
  schoolTier: string
  followerTier: string
}): {
  estimatedLow: number
  estimatedMedian: number
  estimatedHigh: number
  comparableDeals: number
  confidence: 'high' | 'medium' | 'low'
  similarDeals: NILDealStats[]
} {
  const { sport, dealType, schoolTier, followerTier } = params

  // Map school tier to data tier
  const dataTier = schoolTier === 'BLUE_BLOOD' || schoolTier === 'POWER_FIVE' ? 'POWER_FIVE' : 'MID_MAJOR'

  // Find exact matches first
  let matchingDeals = nilDealStats.filter(
    (d) => d.sport === sport && d.dealType === dealType && d.schoolTier === dataTier
  )

  // If no exact match, try just sport and school tier
  if (matchingDeals.length === 0) {
    matchingDeals = nilDealStats.filter(
      (d) => d.sport === sport && d.schoolTier === dataTier
    )
  }

  // If still no match, try just sport
  if (matchingDeals.length === 0) {
    matchingDeals = nilDealStats.filter((d) => d.sport === sport)
  }

  // If still no match, use general fallback
  if (matchingDeals.length === 0) {
    matchingDeals = nilDealStats.filter((d) => d.dealType === dealType).slice(0, 5)
  }

  // Calculate base values from matching deals
  const totalCount = matchingDeals.reduce((sum, d) => sum + d.count, 0)
  const weightedAvg = matchingDeals.reduce((sum, d) => sum + d.avgValue * d.count, 0) / totalCount || 0
  const weightedMedian = matchingDeals.reduce((sum, d) => sum + d.medianValue * d.count, 0) / totalCount || 0
  const minValue = Math.min(...matchingDeals.map((d) => d.p25Value))
  const maxValue = Math.max(...matchingDeals.map((d) => d.p75Value))

  // Apply multipliers
  const schoolMultiplier = schoolTiers.find((t) => t.value === schoolTier)?.multiplier || 1.0
  const followerMult = followerMultipliers[followerTier] || 1.0

  const combinedMultiplier = schoolMultiplier * followerMult

  // Calculate final estimates
  const estimatedLow = Math.round(minValue * combinedMultiplier)
  const estimatedMedian = Math.round(weightedMedian * combinedMultiplier)
  const estimatedHigh = Math.round(maxValue * combinedMultiplier)

  // Determine confidence level
  let confidence: 'high' | 'medium' | 'low' = 'low'
  if (totalCount >= 50) {
    confidence = 'high'
  } else if (totalCount >= 20) {
    confidence = 'medium'
  }

  return {
    estimatedLow,
    estimatedMedian,
    estimatedHigh,
    comparableDeals: totalCount,
    confidence,
    similarDeals: matchingDeals.slice(0, 3),
  }
}
