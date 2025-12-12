import prisma from '../config/database';
import { PaginationParams, SortParams, PaginatedResponse } from '../types';
import { createPaginatedResponse } from '../utils/pagination';
import { fetchYoutubeMetadata } from '../utils/videoMetadata';
import { AppError } from '../middleware/errorHandler';
import { Prisma, Video, WatchStatus } from '@prisma/client';

export class VideoService {
  async createVideo(data: {
    url: string;
    title?: string;
    description?: string;
    thumbnail?: string;
    duration?: number;
    channel?: string;
    channelUrl?: string;
    publishedAt?: Date;
    userId: string;
    categoryId?: string;
    tags?: string[];
  }): Promise<Video> {
    let videoData = { ...data };

    if (!data.title) {
      const metadata = await fetchYoutubeMetadata(data.url);
      if (metadata) {
        videoData = { ...videoData, ...metadata };
      }
    }

    const video = await prisma.video.create({
      data: {
        url: videoData.url,
        title: videoData.title || 'Untitled Video',
        description: videoData.description,
        thumbnail: videoData.thumbnail,
        duration: videoData.duration,
        channel: videoData.channel,
        channelUrl: videoData.channelUrl,
        publishedAt: videoData.publishedAt,
        userId: videoData.userId,
        categoryId: videoData.categoryId,
        tags: videoData.tags || [],
      },
      include: {
        category: true,
        notes: true,
      },
    });

    return video;
  }

  async getVideos(
    userId: string,
    pagination: PaginationParams,
    sort: SortParams,
    filters?: {
      categoryId?: string;
      watchStatus?: WatchStatus;
      isFavorite?: boolean;
      tags?: string[];
    }
  ): Promise<PaginatedResponse<Video>> {
    const where: Prisma.VideoWhereInput = {
      userId,
      ...(filters?.categoryId && { categoryId: filters.categoryId }),
      ...(filters?.watchStatus && { watchStatus: filters.watchStatus }),
      ...(filters?.isFavorite !== undefined && { isFavorite: filters.isFavorite }),
      ...(filters?.tags && filters.tags.length > 0 && {
        tags: {
          hasSome: filters.tags,
        },
      }),
    };

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: {
          [sort.sortBy]: sort.sortOrder,
        },
        include: {
          category: true,
          notes: {
            orderBy: {
              timestamp: 'asc',
            },
          },
        },
      }),
      prisma.video.count({ where }),
    ]);

    return createPaginatedResponse(videos, total, pagination.page, pagination.limit);
  }

  async getVideoById(id: string, userId: string): Promise<Video> {
    const video = await prisma.video.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        category: true,
        notes: {
          orderBy: {
            timestamp: 'asc',
          },
        },
      },
    });

    if (!video) {
      throw new AppError('Video not found', 404);
    }

    return video;
  }

  async updateVideo(
    id: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
      categoryId?: string | null;
      tags?: string[];
      isFavorite?: boolean;
    }
  ): Promise<Video> {
    const video = await this.getVideoById(id, userId);

    const updatedVideo = await prisma.video.update({
      where: { id: video.id },
      data,
      include: {
        category: true,
        notes: true,
      },
    });

    return updatedVideo;
  }

  async updateWatchStatus(
    id: string,
    userId: string,
    data: {
      watchStatus?: WatchStatus;
      watchProgress?: number;
    }
  ): Promise<Video> {
    const video = await this.getVideoById(id, userId);

    const updatedVideo = await prisma.video.update({
      where: { id: video.id },
      data: {
        ...data,
        lastWatchedAt: new Date(),
      },
      include: {
        category: true,
        notes: true,
      },
    });

    return updatedVideo;
  }

  async deleteVideo(id: string, userId: string): Promise<void> {
    const video = await this.getVideoById(id, userId);

    await prisma.video.delete({
      where: { id: video.id },
    });
  }

  async fetchMetadata(url: string) {
    const metadata = await fetchYoutubeMetadata(url);

    if (!metadata) {
      throw new AppError('Unable to fetch video metadata', 400);
    }

    return metadata;
  }
}

export default new VideoService();
