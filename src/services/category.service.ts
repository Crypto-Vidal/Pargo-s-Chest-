import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { Category } from '@prisma/client';

export class CategoryService {
  async createCategory(data: {
    name: string;
    description?: string;
    color?: string;
    userId: string;
  }): Promise<Category> {
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: data.name,
        userId: data.userId,
      },
    });

    if (existingCategory) {
      throw new AppError('Category with this name already exists', 400);
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        color: data.color,
        userId: data.userId,
      },
    });

    return category;
  }

  async getCategories(userId: string): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      where: {
        userId,
      },
      include: {
        _count: {
          select: {
            videos: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return categories as any;
  }

  async getCategoryById(id: string, userId: string): Promise<Category> {
    const category = await prisma.category.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category as any;
  }

  async updateCategory(
    id: string,
    userId: string,
    data: {
      name?: string;
      description?: string;
      color?: string;
    }
  ): Promise<Category> {
    const category = await this.getCategoryById(id, userId);

    if (data.name && data.name !== category.name) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          name: data.name,
          userId,
        },
      });

      if (existingCategory) {
        throw new AppError('Category with this name already exists', 400);
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id: category.id },
      data,
    });

    return updatedCategory;
  }

  async deleteCategory(id: string, userId: string): Promise<void> {
    const category = await this.getCategoryById(id, userId);

    await prisma.category.delete({
      where: { id: category.id },
    });
  }
}

export default new CategoryService();
