import { Router } from 'express';
import videoRoutes from './video.routes';
import noteRoutes from './note.routes';
import categoryRoutes from './category.routes';
import userRoutes from './user.routes';
import searchRoutes from './search.routes';
import exportRoutes from './export.routes';
import healthRoutes from './health.routes';

const router = Router();

// Health check routes (no auth required)
router.use('/health', healthRoutes);

// API routes
router.use('/videos', videoRoutes);
router.use('/notes', noteRoutes);
router.use('/categories', categoryRoutes);
router.use('/users', userRoutes);
router.use('/search', searchRoutes);
router.use('/export', exportRoutes);

export default router;
