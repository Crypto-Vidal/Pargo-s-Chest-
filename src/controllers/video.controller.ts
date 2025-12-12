import { Request, Response } from 'express';
import videoService from '../services/video.service';
import { getPaginationParams, getSortParams } from '../utils/pagination';
import { WatchStatus } from '@prisma/client';

const ALLOWED_SORT_FIELDS = ['createdAt', 'updatedAt', 'title', 'lastWatchedAt'];

export class VideoController {
  async createVideo(req: Request, res: Response) {
    const userId = req.headers['x-user-id'] as string; // Temporary auth - replace with real auth

    const video = await videoService.createVideo({
      ...req.body,
      userId,
    });

    res.status(201).json({
      status: 'success',
      data: video,
    });
  }

  async getVideos(req: Request, res: Response) {
    const userId = req.headers['x-user-id'] as string;

    const pagination = getPaginationParams(
      req.query.page as string,
      req.query.limit as string
    );

    const sort = getSortParams(
      req.query.sortBy as string,
      req.query.sortOrder as string,
      ALLOWED_SORT_FIELDS
    );

    const filters = {
      categoryId: req.query.categoryId as string | undefined,
      watchStatus: req.query.watchStatus as WatchStatus | undefined,
      isFavorite: req.query.isFavorite === 'true' ? true : undefined,
      tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
    };

    const result = await videoService.getVideos(userId, pagination, sort, filters);

    res.json({
      status: 'success',
      ...result,
    });
  }

  async getVideoById(req: Request, res: Response) {
    const userId = req.headers['x-user-id'] as string;
    const { id } = req.params;

    const video = await videoService.getVideoById(id, userId);

    res.json({
      status: 'success',
      data: video,
    });
  }

  async updateVideo(req: Request, res: Response) {
    const userId = req.headers['x-user-id'] as string;
    const { id } = req.params;

    const video = await videoService.updateVideo(id, userId, req.body);

    res.json({
      status: 'success',
      data: video,
    });
  }

  async updateWatchStatus(req: Request, res: Response) {
    const userId = req.headers['x-user-id'] as string;
    const { id } = req.params;

    const video = await videoService.updateWatchStatus(id, userId, req.body);

    res.json({
      status: 'success',
      data: video,
    });
  }

  async deleteVideo(req: Request, res: Response) {
    const userId = req.headers['x-user-id'] as string;
    const { id } = req.params;

    await videoService.deleteVideo(id, userId);

    res.status(204).send();
  }

  async fetchMetadata(req: Request, res: Response) {
    const { url } = req.body;

    const metadata = await videoService.fetchMetadata(url);

    res.json({
      status: 'success',
      data: metadata,
    });
  }
}

export default new VideoController();
