import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper functions
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomChoice<T>(arr: readonly T[] | T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomDate(daysBack: number): Date {
  const date = new Date()
  date.setDate(date.getDate() - randomInt(0, daysBack))
  return date
}

// Data arrays
const sports = [
  { name: "Men's Basketball", category: "basketball" },
  { name: "Women's Basketball", category: "basketball" },
  { name: "Football", category: "football" },
  { name: "Women's Volleyball", category: "volleyball" },
  { name: "Baseball", category: "baseball" },
  { name: "Softball", category: "softball" },
  { name: "Men's Soccer", category: "soccer" },
  { name: "Women's Soccer", category: "soccer" },
  { name: "Women's Gymnastics", category: "gymnastics" },
  { name: "Wrestling", category: "wrestling" },
  { name: "Swimming & Diving", category: "swimming" },
  { name: "Track & Field", category: "track" },
  { name: "Women's Tennis", category: "tennis" },
  { name: "Men's Tennis", category: "tennis" },
  { name: "Golf", category: "golf" },
  { name: "Lacrosse", category: "lacrosse" },
]

const conferences = [
  "SEC", "Big Ten", "ACC", "Big 12", "Pac-12",
  "Big East", "American", "Mountain West", "WCC",
  "A-10", "MVC", "CAA", "Ivy League", "Patriot League"
]

const brandIndustries = [
  "apparel", "food_beverage", "tech", "automotive",
  "fitness", "gaming", "beauty", "finance", "retail",
  "sports_equipment", "supplements", "media", "local_business"
]

const dealTypes = [
  "SOCIAL_POST", "APPEARANCE", "AUTOGRAPH", "CAMP", "LICENSING", "MERCHANDISE", "OTHER"
] as const

const classYears = ["FR", "SO", "JR", "SR", "GR"] as const
const schoolTiers = ["BLUE_BLOOD", "POWER_FIVE", "MID_MAJOR", "SMALL_SCHOOL"] as const
const followerTiers = ["MICRO", "SMALL", "MEDIUM", "LARGE", "MASSIVE"] as const
const brandTiers = ["LOCAL", "REGIONAL", "NATIONAL", "GLOBAL"] as const
const divisions = ["D1", "D2", "D3"] as const

// Generate realistic deal value based on factors
function generateDealValue(
  sportCategory: string,
  schoolTier: string,
  brandTier: string,
  followerTier: string,
  dealType: string
): { cash: number; product: number } {
  let baseValue = 500

  // Sport multiplier
  if (sportCategory === "football") baseValue *= 3
  else if (sportCategory === "basketball") baseValue *= 2.5
  else if (sportCategory === "volleyball" || sportCategory === "gymnastics") baseValue *= 1.5

  // School tier multiplier
  if (schoolTier === "BLUE_BLOOD") baseValue *= 4
  else if (schoolTier === "POWER_FIVE") baseValue *= 2.5
  else if (schoolTier === "MID_MAJOR") baseValue *= 1.2

  // Brand tier multiplier
  if (brandTier === "GLOBAL") baseValue *= 5
  else if (brandTier === "NATIONAL") baseValue *= 2.5
  else if (brandTier === "REGIONAL") baseValue *= 1.5

  // Follower multiplier
  if (followerTier === "MASSIVE") baseValue *= 4
  else if (followerTier === "LARGE") baseValue *= 2
  else if (followerTier === "MEDIUM") baseValue *= 1.3

  // Deal type adjustment
  if (dealType === "LICENSING") baseValue *= 2
  else if (dealType === "CAMP") baseValue *= 1.5
  else if (dealType === "SOCIAL_POST") baseValue *= 0.5

  // Add variance
  baseValue *= (0.7 + Math.random() * 0.6)

  const cash = Math.round(baseValue)
  const product = Math.random() > 0.5 ? Math.round(baseValue * 0.2 * Math.random()) : 0

  return { cash, product }
}

// NIL Deal Reports seed data
async function seedNILMarket() {
  console.log('Seeding NIL Market data...')

  const nilDeals = []

  for (let i = 0; i < 120; i++) {
    const sport = randomChoice(sports)
    const schoolTier = randomChoice(schoolTiers)
    const brandTier = randomChoice(brandTiers)
    const followerTier = randomChoice(followerTiers)
    const dealType = randomChoice(dealTypes)

    const { cash, product } = generateDealValue(
      sport.category,
      schoolTier,
      brandTier,
      followerTier,
      dealType
    )

    const followerRanges: Record<string, { min: number; max: number }> = {
      MICRO: { min: 1000, max: 10000 },
      SMALL: { min: 10000, max: 50000 },
      MEDIUM: { min: 50000, max: 100000 },
      LARGE: { min: 100000, max: 500000 },
      MASSIVE: { min: 500000, max: 2000000 },
    }

    const range = followerRanges[followerTier]

    nilDeals.push({
      sport: sport.name,
      sportCategory: sport.category,
      division: randomChoice(divisions),
      conference: randomChoice(conferences),
      schoolTier: schoolTier as any,
      followerCount: randomInt(range.min, range.max),
      followerTier: followerTier as any,
      classYear: randomChoice(classYears) as any,
      isStarter: Math.random() > 0.4,
      dealType: dealType as any,
      compensationCash: cash,
      compensationProduct: product,
      totalValue: cash + product,
      isRecurring: Math.random() > 0.8,
      dealLengthMonths: Math.random() > 0.5 ? randomInt(1, 12) : null,
      brandIndustry: randomChoice(brandIndustries),
      brandTier: brandTier as any,
      deliverables: randomChoice([
        "1 Instagram post",
        "2 Instagram posts, 1 story",
        "TikTok video",
        "2-hour appearance",
        "Autograph session (2 hrs)",
        "Camp coaching (1 day)",
        "3 posts over 3 months",
        "Product review video",
        "Meet & greet event",
        "Photo shoot + 2 posts",
      ]),
      hoursWorked: randomInt(1, 20),
      satisfactionRating: randomInt(3, 5),
      wouldDoAgain: Math.random() > 0.2,
      notes: Math.random() > 0.6 ? randomChoice([
        "Brand was super professional and paid on time.",
        "Easy money, took 30 minutes.",
        "Had to negotiate up from their initial offer.",
        "Would recommend this brand to others.",
        "A bit more work than expected but worth it.",
        "Great experience, they want to work together again.",
        "Payment took longer than promised.",
        "Product quality was better than expected.",
        "Required too many revisions on content.",
        "Perfect for building my portfolio.",
      ]) : null,
      isVerified: Math.random() > 0.3,
      createdAt: randomDate(180),
    })
  }

  await prisma.nILDealReport.createMany({ data: nilDeals })
  console.log(`Created ${nilDeals.length} NIL deal reports`)
}

// Water Cooler posts seed data
async function seedWaterCooler() {
  console.log('Seeding Water Cooler data...')

  const posts = [
    // DEALS category
    {
      authorSport: "Football",
      authorDivision: "D1" as const,
      authorConference: "SEC",
      isVerifiedAthlete: true,
      title: "Local car dealership wants to give me a truck - good deal?",
      content: "They're offering a free F-150 for 1 year in exchange for 2 appearances and some social posts. Is this typical? Truck is worth like $50k but I'm not sure about the exposure.",
      category: "DEALS" as const,
      upvotes: 234,
      viewCount: 1820,
    },
    {
      authorSport: "Women's Basketball",
      authorDivision: "D1" as const,
      authorConference: "Big Ten",
      isVerifiedAthlete: true,
      title: "Getting lowballed by national brands?",
      content: "I have 150k followers and brands keep offering me $500 for posts. My teammate with 30k followers got offered $2k from the same brand. Is this normal? How do I negotiate better?",
      category: "DEALS" as const,
      upvotes: 567,
      viewCount: 4200,
    },
    {
      authorSport: "Men's Basketball",
      authorDivision: "D1" as const,
      authorConference: "ACC",
      isVerifiedAthlete: true,
      title: "Just signed my first 5-figure deal - here's what I learned",
      content: "Took me 8 months of smaller deals to build up to this. Key things: 1) Always counter their first offer 2) Ask for performance bonuses 3) Keep exclusivity windows short 4) Get everything in writing. Happy to answer questions.",
      category: "DEALS" as const,
      upvotes: 892,
      viewCount: 6500,
      isPinned: true,
    },
    {
      authorSport: "Women's Volleyball",
      authorDivision: "D1" as const,
      authorConference: "Pac-12",
      isVerifiedAthlete: true,
      title: "Product-only deals - worth it or waste of time?",
      content: "I keep getting offers for 'free products' in exchange for posts. No cash. Some of these products are nice ($500+ value) but feels like I'm underselling myself. Thoughts?",
      category: "DEALS" as const,
      upvotes: 345,
      viewCount: 2100,
    },

    // COMPLIANCE category
    {
      authorSport: "Football",
      authorDivision: "D1" as const,
      authorConference: "Big 12",
      isVerifiedAthlete: true,
      title: "Compliance office taking forever to approve deals",
      content: "My school requires pre-approval for all NIL deals over $500. Problem is they take 2-3 weeks to approve anything. Already lost 2 deals because brands couldn't wait. Anyone else dealing with this?",
      category: "COMPLIANCE" as const,
      upvotes: 445,
      viewCount: 2800,
    },
    {
      authorSport: "Men's Soccer",
      authorDivision: "D1" as const,
      authorConference: "American",
      isVerifiedAthlete: true,
      title: "International student NIL restrictions?",
      content: "I'm on a student visa. My compliance office says there might be restrictions on how much I can earn from NIL. Anyone else an international student who's figured this out?",
      category: "COMPLIANCE" as const,
      upvotes: 223,
      viewCount: 1500,
    },
    {
      authorSport: "Women's Gymnastics",
      authorDivision: "D1" as const,
      authorConference: "SEC",
      isVerifiedAthlete: true,
      title: "Do I need to report free products to compliance?",
      content: "Got some free shoes and workout gear from a brand. Nothing signed, they just sent it. Do I need to report this? It's maybe $300 worth of stuff.",
      category: "COMPLIANCE" as const,
      upvotes: 178,
      viewCount: 1200,
    },

    // AGENTS category
    {
      authorSport: "Men's Basketball",
      authorDivision: "D1" as const,
      authorConference: "Big East",
      isVerifiedAthlete: true,
      title: "Agent taking 20% - is this normal?",
      content: "Just got an agent for NIL deals. They're taking 20% of everything. Seemed high but they said it's industry standard. Is this actually normal or am I getting ripped off?",
      category: "AGENTS" as const,
      upvotes: 567,
      viewCount: 3800,
    },
    {
      authorSport: "Football",
      authorDivision: "D1" as const,
      authorConference: "SEC",
      isVerifiedAthlete: true,
      title: "Do I even need an agent?",
      content: "I'm a starter at a P5 school with 50k followers. Brands reach out to me directly. Is there any reason to get an agent or am I better off handling it myself?",
      category: "AGENTS" as const,
      upvotes: 334,
      viewCount: 2400,
    },

    // BRAND_REVIEWS category
    {
      authorSport: "Women's Basketball",
      authorDivision: "D1" as const,
      authorConference: "WCC",
      isVerifiedAthlete: true,
      title: "Barstool NIL deals - anyone have experience?",
      content: "Barstool reached out about joining their athlete program. Anyone here worked with them? What was the experience like? Compensation fair?",
      category: "BRAND_REVIEWS" as const,
      upvotes: 289,
      viewCount: 2100,
    },
    {
      authorSport: "Football",
      authorDivision: "D1" as const,
      authorConference: "ACC",
      isVerifiedAthlete: true,
      title: "Warning about [Brand Name] - didn't pay",
      content: "Completed a deal with a supplement company 3 months ago. Still haven't been paid despite multiple follow-ups. They keep making excuses. Be careful out there.",
      category: "BRAND_REVIEWS" as const,
      upvotes: 678,
      viewCount: 4500,
    },

    // TRANSFERS category
    {
      authorSport: "Men's Basketball",
      authorDivision: "D1" as const,
      authorConference: "Mountain West",
      isVerifiedAthlete: true,
      title: "Transfer portal and existing NIL deals?",
      content: "Thinking about entering the portal. I have 2 active NIL deals with local businesses. What happens to these if I transfer? Do I need to disclose this to new schools?",
      category: "TRANSFERS" as const,
      upvotes: 234,
      viewCount: 1800,
    },

    // SCHOOL_LIFE category
    {
      authorSport: "Women's Soccer",
      authorDivision: "D1" as const,
      authorConference: "Pac-12",
      isVerifiedAthlete: true,
      title: "Teammates getting jealous of NIL success?",
      content: "I've been doing well with NIL - probably made $30k this year. Some teammates have made comments and the vibe is getting weird. Anyone else experienced this?",
      category: "SCHOOL_LIFE" as const,
      upvotes: 445,
      viewCount: 3200,
    },
    {
      authorSport: "Baseball",
      authorDivision: "D1" as const,
      authorConference: "SEC",
      isVerifiedAthlete: true,
      title: "Balancing NIL work with actual practice",
      content: "Between classes, practice, games, and now NIL commitments, I'm completely burned out. How do you all manage your time? I can't keep saying no to deals but I'm exhausted.",
      category: "SCHOOL_LIFE" as const,
      upvotes: 556,
      viewCount: 3800,
    },

    // ADVICE category
    {
      authorSport: "Women's Volleyball",
      authorDivision: "D1" as const,
      authorConference: "Big Ten",
      isVerifiedAthlete: true,
      title: "How to grow social media as an athlete?",
      content: "I'm a freshman with only 2k followers. I see upperclassmen with 50k+ getting all the deals. What's the best way to grow my following? Any tips?",
      category: "ADVICE" as const,
      upvotes: 334,
      viewCount: 2600,
    },
    {
      authorSport: "Wrestling",
      authorDivision: "D1" as const,
      authorConference: "Big Ten",
      isVerifiedAthlete: true,
      title: "NIL opportunities for non-revenue sports?",
      content: "Wrestling doesn't get the same attention as football/basketball. Are there NIL opportunities out there for us? What's worked for other non-revenue sport athletes?",
      category: "ADVICE" as const,
      upvotes: 445,
      viewCount: 2900,
    },
    {
      authorSport: "Track & Field",
      authorDivision: "D1" as const,
      authorConference: "ACC",
      isVerifiedAthlete: true,
      title: "Tax implications of NIL - help!",
      content: "Made about $15k from NIL this year. Do I need to pay taxes on this? Set anything aside? Never dealt with this before and my parents don't know either.",
      category: "ADVICE" as const,
      upvotes: 678,
      viewCount: 4800,
    },

    // GENERAL category
    {
      authorSport: "Football",
      authorDivision: "D1" as const,
      authorConference: "Pac-12",
      isVerifiedAthlete: true,
      title: "NIL is changing college sports forever",
      content: "Just thinking about how different things are now vs even 3 years ago. Some guys on my team are making more than entry-level jobs while still in school. Wild times.",
      category: "GENERAL" as const,
      upvotes: 789,
      viewCount: 5200,
    },
    {
      authorSport: "Women's Basketball",
      authorDivision: "D1" as const,
      authorConference: "SEC",
      isVerifiedAthlete: true,
      title: "Grateful for this community",
      content: "Just want to say thanks to everyone here. The advice I've gotten has helped me negotiate better deals and avoid scams. This is what NIL should be about - athletes helping athletes.",
      category: "GENERAL" as const,
      upvotes: 567,
      viewCount: 3100,
    },
  ]

  // Create posts with varied timestamps
  for (const post of posts) {
    const createdPost = await prisma.waterCoolerPost.create({
      data: {
        ...post,
        createdAt: randomDate(60),
      },
    })

    // Add some comments to each post
    const numComments = randomInt(2, 8)
    const comments = []

    const commentTemplates = [
      "This is exactly my experience too.",
      "Thanks for sharing! Really helpful.",
      "I had the opposite experience actually...",
      "DM me, I can help with this.",
      "Your school's compliance is way stricter than mine.",
      "This should be pinned tbh",
      "Following for the responses",
      "Curious what others think about this",
      "Same situation here. It's frustrating.",
      "Have you tried reaching out to [popular NIL agency]?",
      "The market for our sport is tough but there are opportunities",
      "I made about the same and it worked out fine tax-wise",
      "Definitely get everything in writing next time",
      "Your agent should be helping with this",
      "That brand is known for this - avoid them",
      "Wish I had known this last year",
      "Great advice, saving this post",
      "This is why we need better education around NIL",
    ]

    for (let i = 0; i < numComments; i++) {
      const sport = randomChoice(sports)
      comments.push({
        postId: createdPost.id,
        authorSport: sport.name,
        authorDivision: randomChoice(divisions),
        isVerifiedAthlete: Math.random() > 0.3,
        isOP: i === 0 && Math.random() > 0.7,
        content: randomChoice(commentTemplates),
        upvotes: randomInt(0, 50),
        createdAt: randomDate(30),
      })
    }

    await prisma.waterCoolerComment.createMany({ data: comments })
  }

  console.log(`Created ${posts.length} Water Cooler posts with comments`)
}

async function main() {
  console.log('Starting seed...')

  // Clear existing data
  await prisma.waterCoolerComment.deleteMany()
  await prisma.waterCoolerPost.deleteMany()
  await prisma.nILDealReport.deleteMany()

  await seedNILMarket()
  await seedWaterCooler()

  console.log('Seed complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
