import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { User } from '@prisma/client';

export class UserService {
  async createUser(data: {
    email: string;
    name?: string;
    password: string;
  }): Promise<Omit<User, 'password'>> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password, // In production, hash this password!
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async getUserById(id: string): Promise<Omit<User, 'password'>> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async updateUser(
    id: string,
    data: {
      name?: string;
      email?: string;
    }
  ): Promise<Omit<User, 'password'>> {
    await this.getUserById(id);

    if (data.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new AppError('User with this email already exists', 400);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    await this.getUserById(id);

    await prisma.user.delete({
      where: { id },
    });
  }
}

export default new UserService();
