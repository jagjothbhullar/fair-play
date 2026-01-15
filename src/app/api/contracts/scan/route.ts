import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { scanContract, extractTextFromPdf } from '@/lib/services/contract-scanner'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get athlete context (school, sport, compliance rules)
    const athlete = await prisma.athlete.findFirst({
      where: { supabaseUserId: user.id },
      include: {
        school: {
          include: {
            conference: true,
          },
        },
        sport: true,
      },
    })

    // Get school-specific compliance rules
    const schoolRules = athlete
      ? await prisma.complianceRule.findMany({
          where: {
            OR: [
              { scope: 'SCHOOL', schoolId: athlete.schoolId },
              { scope: 'STATE', stateCode: athlete.school.state },
              { scope: 'CONFERENCE' },
            ],
            isActive: true,
          },
        })
      : []

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const text = formData.get('text') as string | null

    let contractText = ''

    if (file) {
      // Handle file upload
      const buffer = Buffer.from(await file.arrayBuffer())

      if (file.type === 'application/pdf') {
        contractText = await extractTextFromPdf(buffer)
      } else if (file.type === 'text/plain') {
        contractText = buffer.toString('utf-8')
      } else {
        return NextResponse.json(
          { error: 'Unsupported file type. Please upload a PDF or text file.' },
          { status: 400 }
        )
      }
    } else if (text) {
      contractText = text
    } else {
      return NextResponse.json(
        { error: 'Please provide a file or text to scan' },
        { status: 400 }
      )
    }

    if (contractText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Contract text is too short to analyze' },
        { status: 400 }
      )
    }

    // Build athlete context for AI
    const athleteContext = athlete
      ? {
          school: athlete.school.name,
          shortName: athlete.school.shortName,
          conference: athlete.school.conference.name,
          sport: athlete.sport.name,
          state: athlete.school.state,
          isInternationalStudent: athlete.isInternationalStudent,
          schoolRules: schoolRules.map((r) => ({
            title: r.title,
            description: r.description,
          })),
        }
      : null

    const result = await scanContract(contractText, athleteContext)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error scanning contract:', error)
    return NextResponse.json(
      { error: 'Failed to scan contract. Please try again.' },
      { status: 500 }
    )
  }
}
