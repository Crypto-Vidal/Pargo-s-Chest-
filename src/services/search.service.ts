import prisma from '../config/database';
import { PaginationParams, PaginatedResponse } from '../types';
import { createPaginatedResponse } from '../utils/pagination';
import { Video, Note } from '@prisma/client';

export class SearchService {
  async searchVideos(
    query: string,
    userId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Video>> {
    const where = {
      userId,
      OR: [
        { title: { contains: query, mode: 'insensitive' as const } },
        { description: { contains: query, mode: 'insensitive' as const } },
        { channel: { contains: query, mode: 'insensitive' as const } },
        { tags: { has: query } },
      ],
    };

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          category: true,
          notes: true,
        },
      }),
      prisma.video.count({ where }),
    ]);

    return createPaginatedResponse(videos, total, pagination.page, pagination.limit);
  }

  async searchNotes(
    query: string,
    userId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Note & { video: Video }>> {
    const where = {
      video: {
        userId,
      },
      content: {
        contains: query,
        mode: 'insensitive' as const,
      },
    };

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          video: true,
        },
      }),
      prisma.note.count({ where }),
    ]);

    return createPaginatedResponse(notes, total, pagination.page, pagination.limit);
  }

  async searchAll(
    query: string,
    userId: string,
    pagination: PaginationParams
  ): Promise<{
    videos: PaginatedResponse<Video>;
    notes: PaginatedResponse<Note & { video: Video }>;
  }> {
    const [videos, notes] = await Promise.all([
      this.searchVideos(query, userId, pagination),
      this.searchNotes(query, userId, pagination),
    ]);

    return { videos, notes };
  }
}

export default new SearchService();
