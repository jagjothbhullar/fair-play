import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const where: Record<string, unknown> = { isApproved: true }
    if (category) where.category = category

    const posts = await prisma.waterCoolerPost.findMany({
      where,
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        comments: {
          orderBy: { upvotes: 'desc' },
          take: 10,
        },
        _count: {
          select: { comments: true },
        },
      },
      take: 50,
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Water Cooler API error:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}
