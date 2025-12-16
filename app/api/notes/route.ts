import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all notes (with optional search)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const videoId = searchParams.get('videoId')

    let notes

    const where: any = {}

    if (videoId) {
      where.videoId = videoId
    }

    if (search) {
      where.OR = [
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { some: { name: { contains: search, mode: 'insensitive' } } } },
      ]
    }

    notes = await prisma.note.findMany({
      where,
      include: {
        tags: true,
        video: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

// POST create new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, videoId, timestamp, tags } = body

    if (!content || !videoId) {
      return NextResponse.json(
        { error: 'Content and videoId are required' },
        { status: 400 }
      )
    }

    // Handle tags
    const tagConnections = []
    if (tags && Array.isArray(tags)) {
      for (const tagName of tags) {
        // Find or create tag
        const tag = await prisma.tag.upsert({
          where: { name: tagName.toLowerCase().trim() },
          update: {},
          create: { name: tagName.toLowerCase().trim() },
        })
        tagConnections.push({ id: tag.id })
      }
    }

    const note = await prisma.note.create({
      data: {
        content,
        videoId,
        timestamp: timestamp || null,
        tags: {
          connect: tagConnections,
        },
      },
      include: {
        tags: true,
        video: true,
      },
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    )
  }
}
