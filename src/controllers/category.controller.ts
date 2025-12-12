import { Request, Response } from 'express';
import categoryService from '../services/category.service';

export class CategoryController {
  async createCategory(req: Request, res: Response) {
    const userId = req.headers['x-user-id'] as string;

    const category = await categoryService.createCategory({
      ...req.body,
      userId,
    });

    res.status(201).json({
      status: 'success',
      data: category,
    });
  }

  async getCategories(req: Request, res: Response) {
    const userId = req.headers['x-user-id'] as string;

    const categories = await categoryService.getCategories(userId);

    res.json({
      status: 'success',
      data: categories,
    });
  }

  async getCategoryById(req: Request, res: Response) {
    const userId = req.headers['x-user-id'] as string;
    const { id } = req.params;

    const category = await categoryService.getCategoryById(id, userId);

    res.json({
      status: 'success',
      data: category,
    });
  }

  async updateCategory(req: Request, res: Response) {
    const userId = req.headers['x-user-id'] as string;
    const { id } = req.params;

    const category = await categoryService.updateCategory(id, userId, req.body);

    res.json({
      status: 'success',
      data: category,
    });
  }

  async deleteCategory(req: Request, res: Response) {
    const userId = req.headers['x-user-id'] as string;
    const { id } = req.params;

    await categoryService.deleteCategory(id, userId);

    res.status(204).send();
  }
}

export default new CategoryController();
