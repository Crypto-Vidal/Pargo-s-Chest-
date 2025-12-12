import { Router } from 'express';
import videoController from '../controllers/video.controller';
import { asyncHandler } from '../middleware/validation';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';

const router = Router();

router.post(
  '/',
  validate([
    body('url').isURL().withMessage('Valid URL is required'),
    body('title').optional().isString(),
    body('categoryId').optional().isUUID(),
    body('tags').optional().isArray(),
  ]),
  asyncHandler(videoController.createVideo.bind(videoController))
);

router.get('/', asyncHandler(videoController.getVideos.bind(videoController)));

router.get('/:id', asyncHandler(videoController.getVideoById.bind(videoController)));

router.patch(
  '/:id',
  validate([
    body('title').optional().isString(),
    body('description').optional().isString(),
    body('categoryId').optional().isUUID(),
    body('tags').optional().isArray(),
    body('isFavorite').optional().isBoolean(),
  ]),
  asyncHandler(videoController.updateVideo.bind(videoController))
);

router.patch(
  '/:id/watch-status',
  validate([
    body('watchStatus').optional().isIn(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']),
    body('watchProgress').optional().isInt({ min: 0 }),
  ]),
  asyncHandler(videoController.updateWatchStatus.bind(videoController))
);

router.delete('/:id', asyncHandler(videoController.deleteVideo.bind(videoController)));

router.post(
  '/metadata',
  validate([body('url').isURL().withMessage('Valid URL is required')]),
  asyncHandler(videoController.fetchMetadata.bind(videoController))
);

export default router;
