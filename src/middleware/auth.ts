import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

/**
 * Authentication middleware
 *
 * IMPORTANT: This is a temporary header-based authentication for development.
 * In production, replace this with proper JWT/OAuth authentication.
 *
 * For production implementation:
 * 1. Use JWT tokens (jsonwebtoken package)
 * 2. Implement token verification
 * 3. Add token refresh mechanism
 * 4. Consider OAuth providers (Google, GitHub, etc.)
 * 5. Add proper session management
 */
export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const userId = req.headers['x-user-id'] as string;

  if (!userId) {
    throw new AppError('Authentication required. Please provide x-user-id header.', 401);
  }

  // In production, validate the user ID against database or JWT
  // For now, we trust the header value
  req.userId = userId;
  next();
};

// Optional auth - doesn't fail if no auth provided
export const optionalAuth = (req: Request, _res: Response, next: NextFunction) => {
  const userId = req.headers['x-user-id'] as string;

  if (userId) {
    req.userId = userId;
  }

  next();
};

// Add userId to Request type
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      requestId?: string;
    }
  }
}
