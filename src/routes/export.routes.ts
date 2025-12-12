import { Router } from 'express';
import exportController from '../controllers/export.controller';
import { asyncHandler } from '../middleware/validation';

const router = Router();

router.get('/', asyncHandler(exportController.exportData.bind(exportController)));

router.post('/', asyncHandler(exportController.importData.bind(exportController)));

export default router;
