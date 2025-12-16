import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/**
 * Adds a unique request ID to each request for tracking and debugging
 */
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] as string || randomUUID();

  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);

  next();
};
