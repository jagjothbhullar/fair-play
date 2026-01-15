import { NextRequest, NextResponse } from 'next/server'
import { scanContract, extractTextFromPdf } from '@/lib/services/contract-scanner'

// Public endpoint for free contract scanning (no auth required)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const text = formData.get('text') as string | null

    let contractText = ''

    if (file) {
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

    // Scan without athlete context (public/generic scan)
    const result = await scanContract(contractText, null)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error scanning contract:', error)
    return NextResponse.json(
      { error: 'Failed to scan contract. Please try again.' },
      { status: 500 }
    )
  }
}
