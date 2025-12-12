import { Request, Response } from 'express';
import exportService from '../services/export.service';

export class ExportController {
  async exportData(req: Request, res: Response) {
    const userId = req.headers['x-user-id'] as string;

    const data = await exportService.exportUserData(userId);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="pargos-chest-export-${new Date().toISOString().split('T')[0]}.json"`
    );

    res.json(data);
  }

  async importData(req: Request, res: Response) {
    const userId = req.headers['x-user-id'] as string;

    const result = await exportService.importUserData(userId, req.body);

    res.json({
      status: 'success',
      data: result,
    });
  }
}

export default new ExportController();
