import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cache } from '@/lib/cache'

export const dynamic = 'force-dynamic'
export const revalidate = 600 // Revalidate every 10 minutes

export async function GET() {
  try {
    const cacheKey = 'statistics:global'

    // Try cache first
    const cached = cache.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'X-Cache': 'HIT',
        },
      })
    }

    // Run aggregation queries in parallel for better performance
    const [totalTreasures, totalValue, totalUsers] = await Promise.all([
      prisma.treasure.count(),
      prisma.treasure.aggregate({
        _sum: {
          value: true,
        },
      }),
      prisma.user.count(),
    ])

    const statistics = {
      totalTreasures,
      totalValue: totalValue._sum.value || 0,
      totalUsers,
      generatedAt: new Date().toISOString(),
    }

    // Cache for 10 minutes
    cache.set(cacheKey, statistics, 600000)

    return NextResponse.json(statistics, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=600, stale-while-revalidate=1200',
      },
    })
  } catch (error) {
    console.error('Statistics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
