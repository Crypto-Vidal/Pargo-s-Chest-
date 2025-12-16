import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cache } from '@/lib/cache'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // Revalidate every 5 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const rarity = searchParams.get('rarity')
    const userId = searchParams.get('userId')

    // Generate cache key based on query parameters
    const cacheKey = `treasures:${category || 'all'}:${rarity || 'all'}:${userId || 'all'}`

    // Try to get from cache first
    const cached = cache.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'X-Cache': 'HIT',
        },
      })
    }

    // Build query with optimized indexes
    const where: any = {}
    if (category) where.category = category
    if (rarity) where.rarity = rarity
    if (userId) where.userId = userId

    const treasures = await prisma.treasure.findMany({
      where,
      orderBy: {
        discoveredAt: 'desc',
      },
      take: 50, // Limit to prevent large payloads
      include: {
        tags: {
          select: {
            name: true,
          },
        },
      },
    })

    // Cache the result for 5 minutes
    cache.set(cacheKey, treasures, 300000)

    return NextResponse.json(treasures, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Error fetching treasures:', error)
    return NextResponse.json(
      { error: 'Failed to fetch treasures' },
      { status: 500 }
    )
  }
}
