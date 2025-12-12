import { Router } from 'express';
import userController from '../controllers/user.controller';
import { asyncHandler } from '../middleware/validation';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';

const router = Router();

router.post(
  '/',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').optional().isString(),
  ]),
  asyncHandler(userController.createUser.bind(userController))
);

router.get('/:id', asyncHandler(userController.getUserById.bind(userController)));

router.patch(
  '/:id',
  validate([
    body('email').optional().isEmail(),
    body('name').optional().isString(),
  ]),
  asyncHandler(userController.updateUser.bind(userController))
);

router.delete('/:id', asyncHandler(userController.deleteUser.bind(userController)));

export default router;
