import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

/**
 * Enhanced logging middleware for debugging and monitoring
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log request
  if (config.nodeEnv === 'development') {
    console.log(`[${req.requestId}] ${req.method} ${req.path}`);
  }

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'ERROR' : 'INFO';

    if (config.nodeEnv === 'development' || res.statusCode >= 400) {
      console.log(
        `[${req.requestId}] [${logLevel}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
      );
    }
  });

  next();
};
