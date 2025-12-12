import { Request, Response } from 'express';
import noteService from '../services/note.service';

export class NoteController {
  async createNote(req: Request, res: Response) {
    const userId = req.headers['x-user-id'] as string;

    const note = await noteService.createNote({
      ...req.body,
      userId,
    });

    res.status(201).json({
      status: 'success',
      data: note,
    });
  }

  async getNotesByVideo(req: Request, res: Response) {
    const userId = req.headers['x-user-id'] as string;
    const { videoId } = req.params;

    const notes = await noteService.getNotesByVideo(videoId, userId);

    res.json({
      status: 'success',
      data: notes,
    });
  }

  async getNoteById(req: Request, res: Response) {
    const userId = req.headers['x-user-id'] as string;
    const { id } = req.params;

    const note = await noteService.getNoteById(id, userId);

    res.json({
      status: 'success',
      data: note,
    });
  }

  async updateNote(req: Request, res: Response) {
    const userId = req.headers['x-user-id'] as string;
    const { id } = req.params;

    const note = await noteService.updateNote(id, userId, req.body);

    res.json({
      status: 'success',
      data: note,
    });
  }

  async deleteNote(req: Request, res: Response) {
    const userId = req.headers['x-user-id'] as string;
    const { id } = req.params;

    await noteService.deleteNote(id, userId);

    res.status(204).send();
  }
}

export default new NoteController();
