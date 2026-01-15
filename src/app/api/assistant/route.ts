import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { checkRateLimit, rateLimiters } from '@/lib/rate-limit'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ScanContext {
  summary?: string
  overallRisk?: string
  redFlagsCount?: number
}

const SYSTEM_PROMPT = `You are a helpful NIL (Name, Image, Likeness) contract assistant for athletes, creators, streamers, and musicians. Your role is to answer quick questions about contracts, compensation, deals, and industry standards.

GUIDELINES:
- Keep responses brief and conversational (2-4 sentences typically)
- Be direct and practical - these are busy people
- Use plain English, not legal jargon
- If a question requires reviewing a full contract, suggest they use the contract scanner
- Stay focused on NIL, contracts, entertainment, and creator economy topics
- If asked about something outside your scope, politely redirect

KNOWLEDGE AREAS:
- NIL deals and athlete compensation
- Brand sponsorships and influencer rates
- Agent/manager commission standards (10-15% is typical)
- Contract red flags and negotiation tips
- Music industry deals (labels, publishing, sync)
- Streaming/content creator contracts
- Social media and UGC rates
- Exclusivity periods and terms

INDUSTRY BENCHMARKS (use as references):
- NIL agent commission: 10-15% (above 20% is high)
- Social media post rates: $100-500 for micro-influencers, scales with following
- UGC content: $150-500+ per video
- Exclusivity periods: 3-6 months is reasonable, >12 months is long
- Payment terms: Net 30 is standard, Net 60+ is slow

If the user has recently scanned a contract, you may have context about it to reference.`

export async function POST(request: NextRequest) {
  // Rate limit: use the general API limiter
  const { success, response } = await checkRateLimit(request, rateLimiters.api)
  if (!success && response) {
    return response
  }

  try {
    const { message, conversationHistory, scanContext } = await request.json() as {
      message: string
      conversationHistory?: Message[]
      scanContext?: ScanContext
    }

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide a message' },
        { status: 400 }
      )
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: 'Message too long. Please keep questions brief.' },
        { status: 400 }
      )
    }

    // Build messages array with conversation history
    const messages: { role: 'user' | 'assistant'; content: string }[] = []

    // Add conversation history (last 10 messages max)
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10)
      for (const msg of recentHistory) {
        messages.push({
          role: msg.role,
          content: msg.content,
        })
      }
    }

    // Add context about recent scan if available
    let contextPrefix = ''
    if (scanContext && scanContext.summary) {
      contextPrefix = `[Context: User recently scanned a contract. Risk level: ${scanContext.overallRisk || 'unknown'}. ${scanContext.redFlagsCount || 0} red flags found. Summary: ${scanContext.summary}]\n\n`
    }

    // Add current message
    messages.push({
      role: 'user',
      content: contextPrefix + message,
    })

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages,
    })

    const textContent = response.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No response from assistant')
    }

    const reply = textContent.text

    // Check if we should suggest a full scan
    const suggestFullScan = reply.toLowerCase().includes('upload') ||
                           reply.toLowerCase().includes('full contract') ||
                           reply.toLowerCase().includes('scanner')

    return NextResponse.json({
      reply,
      suggestFullScan,
    })
  } catch (error) {
    console.error('Assistant API error:', error)
    return NextResponse.json(
      { error: 'Failed to get response. Please try again.' },
      { status: 500 }
    )
  }
}
