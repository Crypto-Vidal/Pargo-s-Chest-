import { Router } from 'express';
import noteController from '../controllers/note.controller';
import { asyncHandler } from '../middleware/validation';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';

const router = Router();

router.post(
  '/',
  validate([
    body('content').isString().notEmpty().withMessage('Content is required'),
    body('videoId').isUUID().withMessage('Valid video ID is required'),
    body('timestamp').optional().isInt({ min: 0 }),
  ]),
  asyncHandler(noteController.createNote.bind(noteController))
);

router.get(
  '/video/:videoId',
  asyncHandler(noteController.getNotesByVideo.bind(noteController))
);

router.get('/:id', asyncHandler(noteController.getNoteById.bind(noteController)));

router.patch(
  '/:id',
  validate([
    body('content').optional().isString().notEmpty(),
    body('timestamp').optional().isInt({ min: 0 }),
  ]),
  asyncHandler(noteController.updateNote.bind(noteController))
);

router.delete('/:id', asyncHandler(noteController.deleteNote.bind(noteController)));

export default router;
