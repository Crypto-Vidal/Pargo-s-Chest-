import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cache } from '@/lib/cache'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json([])
    }

    // Cache search results
    const cacheKey = `search:${query.toLowerCase()}`
    const cached = cache.get(cacheKey)

    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'X-Cache': 'HIT',
        },
      })
    }

    // Optimized search query using indexed fields
    const results = await prisma.treasure.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      take: 10, // Limit results for performance
      orderBy: {
        discoveredAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        description: true,
        rarity: true,
        value: true,
        imageUrl: true,
      },
    })

    // Cache for 2 minutes
    cache.set(cacheKey, results, 120000)

    return NextResponse.json(results, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=120',
      },
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
