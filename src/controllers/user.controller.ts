import { Request, Response } from 'express';
import userService from '../services/user.service';

export class UserController {
  async createUser(req: Request, res: Response) {
    const user = await userService.createUser(req.body);

    res.status(201).json({
      status: 'success',
      data: user,
    });
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;

    const user = await userService.getUserById(id);

    res.json({
      status: 'success',
      data: user,
    });
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;

    const user = await userService.updateUser(id, req.body);

    res.json({
      status: 'success',
      data: user,
    });
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    await userService.deleteUser(id);

    res.status(204).send();
  }
}

export default new UserController();
