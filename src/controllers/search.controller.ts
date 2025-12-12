import { Request, Response } from 'express';
import searchService from '../services/search.service';
import { getPaginationParams } from '../utils/pagination';

export class SearchController {
  async searchVideos(req: Request, res: Response) {
    const userId = req.headers['x-user-id'] as string;
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required',
      });
    }

    const pagination = getPaginationParams(
      req.query.page as string,
      req.query.limit as string
    );

    const result = await searchService.searchVideos(q, userId, pagination);

    res.json({
      status: 'success',
      ...result,
    });
  }

  async searchNotes(req: Request, res: Response) {
    const userId = req.headers['x-user-id'] as string;
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required',
      });
    }

    const pagination = getPaginationParams(
      req.query.page as string,
      req.query.limit as string
    );

    const result = await searchService.searchNotes(q, userId, pagination);

    res.json({
      status: 'success',
      ...result,
    });
  }

  async searchAll(req: Request, res: Response) {
    const userId = req.headers['x-user-id'] as string;
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required',
      });
    }

    const pagination = getPaginationParams(
      req.query.page as string,
      req.query.limit as string
    );

    const result = await searchService.searchAll(q, userId, pagination);

    res.json({
      status: 'success',
      data: result,
    });
  }
}

export default new SearchController();
