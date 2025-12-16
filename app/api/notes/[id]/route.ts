import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single note
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const note = await prisma.note.findUnique({
      where: { id: params.id },
      include: {
        tags: true,
        video: true,
      },
    })

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(note)
  } catch (error) {
    console.error('Error fetching note:', error)
    return NextResponse.json(
      { error: 'Failed to fetch note' },
      { status: 500 }
    )
  }
}

// PUT update note
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { content, timestamp, tags } = body

    // Handle tags
    let tagConnections = []
    if (tags && Array.isArray(tags)) {
      // First, disconnect all existing tags
      await prisma.note.update({
        where: { id: params.id },
        data: {
          tags: {
            set: [],
          },
        },
      })

      // Then create/connect new tags
      for (const tagName of tags) {
        const tag = await prisma.tag.upsert({
          where: { name: tagName.toLowerCase().trim() },
          update: {},
          create: { name: tagName.toLowerCase().trim() },
        })
        tagConnections.push({ id: tag.id })
      }
    }

    const note = await prisma.note.update({
      where: { id: params.id },
      data: {
        content: content || undefined,
        timestamp: timestamp !== undefined ? timestamp : undefined,
        tags: tags ? {
          connect: tagConnections,
        } : undefined,
      },
      include: {
        tags: true,
        video: true,
      },
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error('Error updating note:', error)
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    )
  }
}

// DELETE note
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.note.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting note:', error)
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    )
  }
}
