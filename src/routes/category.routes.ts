import { Router } from 'express';
import categoryController from '../controllers/category.controller';
import { asyncHandler } from '../middleware/validation';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';

const router = Router();

router.post(
  '/',
  validate([
    body('name').isString().notEmpty().withMessage('Category name is required'),
    body('description').optional().isString(),
    body('color').optional().isString(),
  ]),
  asyncHandler(categoryController.createCategory.bind(categoryController))
);

router.get('/', asyncHandler(categoryController.getCategories.bind(categoryController)));

router.get(
  '/:id',
  asyncHandler(categoryController.getCategoryById.bind(categoryController))
);

router.patch(
  '/:id',
  validate([
    body('name').optional().isString().notEmpty(),
    body('description').optional().isString(),
    body('color').optional().isString(),
  ]),
  asyncHandler(categoryController.updateCategory.bind(categoryController))
);

router.delete(
  '/:id',
  asyncHandler(categoryController.deleteCategory.bind(categoryController))
);

export default router;
