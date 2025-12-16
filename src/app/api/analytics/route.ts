import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Endpoint to receive Web Vitals data
export async function POST(request: NextRequest) {
  try {
    const metric = await request.json()

    // Log performance metrics
    console.log('Web Vital:', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    })

    // In production, send to analytics service
    // await sendToAnalyticsService(metric)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to record metric' },
      { status: 500 }
    )
  }
}
