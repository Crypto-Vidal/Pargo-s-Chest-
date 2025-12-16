import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractYouTubeId, fetchVideoInfo } from '@/lib/youtube'

// GET all videos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')

    let videos

    if (search) {
      videos = await prisma.video.findMany({
        where: {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        },
        include: {
          notes: {
            include: {
              tags: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else {
      videos = await prisma.video.findMany({
        include: {
          notes: {
            include: {
              tags: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }

    return NextResponse.json(videos)
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}

// POST create new video
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      )
    }

    const youtubeId = extractYouTubeId(url)

    if (!youtubeId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      )
    }

    // Check if video already exists
    const existingVideo = await prisma.video.findUnique({
      where: { youtubeId },
    })

    if (existingVideo) {
      return NextResponse.json(
        { error: 'Video already exists', video: existingVideo },
        { status: 409 }
      )
    }

    // Fetch video info from YouTube
    const videoInfo = await fetchVideoInfo(youtubeId)

    const video = await prisma.video.create({
      data: {
        youtubeId,
        title: videoInfo?.title || 'Untitled Video',
        thumbnail: videoInfo?.thumbnail,
        description: videoInfo?.author || null,
      },
    })

    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error('Error creating video:', error)
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    )
  }
}
