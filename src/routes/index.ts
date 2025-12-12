import { Router } from 'express';
import videoRoutes from './video.routes';
import noteRoutes from './note.routes';
import categoryRoutes from './category.routes';
import userRoutes from './user.routes';
import searchRoutes from './search.routes';
import exportRoutes from './export.routes';

const router = Router();

router.use('/videos', videoRoutes);
router.use('/notes', noteRoutes);
router.use('/categories', categoryRoutes);
router.use('/users', userRoutes);
router.use('/search', searchRoutes);
router.use('/export', exportRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: "Pargo's Chest API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
