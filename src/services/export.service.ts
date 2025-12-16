import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export interface ExportData {
  exportDate: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
  categories: Array<{
    id: string;
    name: string;
    description: string | null;
    color: string | null;
  }>;
  videos: Array<{
    id: string;
    url: string;
    title: string;
    description: string | null;
    thumbnail: string | null;
    duration: number | null;
    channel: string | null;
    channelUrl: string | null;
    publishedAt: string | null;
    watchStatus: string;
    watchProgress: number | null;
    isFavorite: boolean;
    tags: string[];
    categoryName: string | null;
    notes: Array<{
      id: string;
      content: string;
      timestamp: number | null;
      createdAt: string;
    }>;
    createdAt: string;
    lastWatchedAt: string | null;
  }>;
}

export class ExportService {
  async exportUserData(userId: string): Promise<ExportData> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const [categories, videos] = await Promise.all([
      prisma.category.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          description: true,
          color: true,
        },
      }),
      prisma.video.findMany({
        where: { userId },
        include: {
          category: {
            select: {
              name: true,
            },
          },
          notes: {
            select: {
              id: true,
              content: true,
              timestamp: true,
              createdAt: true,
            },
            orderBy: {
              timestamp: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    const exportData: ExportData = {
      exportDate: new Date().toISOString(),
      user,
      categories,
      videos: videos.map((video: any) => ({
        id: video.id,
        url: video.url,
        title: video.title,
        description: video.description,
        thumbnail: video.thumbnail,
        duration: video.duration,
        channel: video.channel,
        channelUrl: video.channelUrl,
        publishedAt: video.publishedAt?.toISOString() || null,
        watchStatus: video.watchStatus,
        watchProgress: video.watchProgress,
        isFavorite: video.isFavorite,
        tags: video.tags,
        categoryName: video.category?.name || null,
        notes: video.notes.map((note: any) => ({
          id: note.id,
          content: note.content,
          timestamp: note.timestamp,
          createdAt: note.createdAt.toISOString(),
        })),
        createdAt: video.createdAt.toISOString(),
        lastWatchedAt: video.lastWatchedAt?.toISOString() || null,
      })),
    };

    return exportData;
  }

  async importUserData(userId: string, data: ExportData): Promise<{ imported: number }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const categoryMap = new Map<string, string>();

    for (const category of data.categories) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          name: category.name,
          userId,
        },
      });

      if (existingCategory) {
        categoryMap.set(category.name, existingCategory.id);
      } else {
        const newCategory = await prisma.category.create({
          data: {
            name: category.name,
            description: category.description,
            color: category.color,
            userId,
          },
        });
        categoryMap.set(category.name, newCategory.id);
      }
    }

    let importedCount = 0;

    for (const video of data.videos) {
      const existingVideo = await prisma.video.findFirst({
        where: {
          url: video.url,
          userId,
        },
      });

      if (existingVideo) {
        continue;
      }

      const categoryId = video.categoryName ? categoryMap.get(video.categoryName) : null;

      const createdVideo = await prisma.video.create({
        data: {
          url: video.url,
          title: video.title,
          description: video.description,
          thumbnail: video.thumbnail,
          duration: video.duration,
          channel: video.channel,
          channelUrl: video.channelUrl,
          publishedAt: video.publishedAt ? new Date(video.publishedAt) : null,
          watchStatus: video.watchStatus as any,
          watchProgress: video.watchProgress,
          isFavorite: video.isFavorite,
          tags: video.tags,
          userId,
          categoryId: categoryId || undefined,
          lastWatchedAt: video.lastWatchedAt ? new Date(video.lastWatchedAt) : null,
        },
      });

      for (const note of video.notes) {
        await prisma.note.create({
          data: {
            content: note.content,
            timestamp: note.timestamp,
            videoId: createdVideo.id,
          },
        });
      }

      importedCount++;
    }

    return { imported: importedCount };
  }
}

export default new ExportService();
