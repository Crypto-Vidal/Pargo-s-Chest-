import rateLimit from 'express-rate-limit';
import { config } from '../config/env';

export const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.nodeEnv === 'production' ? 100 : 1000, // Limit each IP
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Stricter limit for sensitive endpoints
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const createRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: config.nodeEnv === 'production' ? 10 : 100,
  message: {
    status: 'error',
    message: 'Too many creation requests, please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
