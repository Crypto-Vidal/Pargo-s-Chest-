import { Router } from 'express';
import searchController from '../controllers/search.controller';
import { asyncHandler } from '../middleware/validation';

const router = Router();

router.get('/videos', asyncHandler(searchController.searchVideos.bind(searchController)));

router.get('/notes', asyncHandler(searchController.searchNotes.bind(searchController)));

router.get('/', asyncHandler(searchController.searchAll.bind(searchController)));

export default router;
