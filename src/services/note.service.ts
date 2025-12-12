import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { Note } from '@prisma/client';

export class NoteService {
  async createNote(data: {
    content: string;
    timestamp?: number;
    videoId: string;
    userId: string;
  }): Promise<Note> {
    const video = await prisma.video.findFirst({
      where: {
        id: data.videoId,
        userId: data.userId,
      },
    });

    if (!video) {
      throw new AppError('Video not found', 404);
    }

    const note = await prisma.note.create({
      data: {
        content: data.content,
        timestamp: data.timestamp,
        videoId: data.videoId,
      },
    });

    return note;
  }

  async getNotesByVideo(videoId: string, userId: string): Promise<Note[]> {
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        userId,
      },
    });

    if (!video) {
      throw new AppError('Video not found', 404);
    }

    const notes = await prisma.note.findMany({
      where: {
        videoId,
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    return notes;
  }

  async getNoteById(id: string, userId: string): Promise<Note> {
    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        video: true,
      },
    });

    if (!note || note.video.userId !== userId) {
      throw new AppError('Note not found', 404);
    }

    return note;
  }

  async updateNote(
    id: string,
    userId: string,
    data: {
      content?: string;
      timestamp?: number;
    }
  ): Promise<Note> {
    await this.getNoteById(id, userId);

    const updatedNote = await prisma.note.update({
      where: { id },
      data,
    });

    return updatedNote;
  }

  async deleteNote(id: string, userId: string): Promise<void> {
    await this.getNoteById(id, userId);

    await prisma.note.delete({
      where: { id },
    });
  }
}

export default new NoteService();
