# NIL Platform

An athlete-first NIL (Name, Image, Likeness) management platform built for Bay Area student-athletes.

## Features

- **Deal Tracker** - Manage all your NIL deals in one place
- **Compliance Checker** - Instant checks against NCAA, state, and school-specific rules
- **Contract Scanner** - AI-powered contract analysis to spot red flags before you sign
- **School-Specific Rules** - Pre-loaded compliance rules for Stanford, Cal, San Jose State, and Santa Clara

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **AI**: Anthropic Claude API for contract analysis

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Supabase account)
- Anthropic API key (for contract scanning)

### Installation

1. Clone the repository:
```bash
cd nil-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
```

4. Set up the database:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Database Schema

The platform includes pre-seeded data for:

- **4 Schools**: Stanford, Cal, San Jose State, Santa Clara
- **25+ Sports**: Basketball, Football, Soccer, and more
- **NCAA Rules**: $600 disclosure threshold, pay-for-play restrictions
- **State Rules**: California SB 26 requirements
- **School Rules**: Institution-specific policies
- **Contract Red Flags**: 9 patterns to detect problematic contract terms

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login/signup pages
│   ├── (dashboard)/      # Protected dashboard pages
│   │   ├── deals/        # Deal management
│   │   ├── contracts/    # Contract scanner
│   │   ├── compliance/   # Compliance center
│   │   └── profile/      # User profile
│   └── api/              # API routes
├── components/           # Reusable UI components
├── lib/
│   ├── db/              # Prisma client
│   ├── services/        # Business logic
│   │   ├── compliance-checker.ts
│   │   └── contract-scanner.ts
│   ├── supabase/        # Supabase client
│   └── utils/           # Helper functions
└── types/               # TypeScript types
```

## Key Features

### Compliance Checker

The compliance engine evaluates deals against:
- NCAA rules (e.g., $600 disclosure threshold)
- California state law (SB 26)
- School-specific policies

### Contract Scanner

AI-powered analysis detects:
- Perpetual usage rights
- Overly broad exclusivity clauses
- One-sided termination rights
- Vague moral clauses
- Transfer penalties/clawbacks
- Pay-for-play language (NCAA violation)
- Missing payment terms
- Hidden costs

## Future Roadmap

- [ ] Brand marketplace (Phase 2)
- [ ] E-signature integration
- [ ] Mobile app (React Native)
- [ ] Disclosure form auto-generation
- [ ] Integration with school compliance platforms (INFLCR, Opendorse)

## License

Private - All rights reserved
