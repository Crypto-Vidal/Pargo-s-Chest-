import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { config } from '../config/env';

const router = Router();

/**
 * Basic health check endpoint
 * Returns 200 if the API is running
 */
router.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: "Pargo's Chest API is running",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

/**
 * Detailed health check with database status
 * Returns comprehensive system health information
 */
router.get('/detailed', async (_req: Request, res: Response) => {
  const healthCheck = {
    status: 'success',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: 'MB',
    },
    database: {
      status: 'unknown',
      connected: false,
    },
    version: '1.0.0',
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    healthCheck.database.status = 'healthy';
    healthCheck.database.connected = true;
  } catch (error) {
    healthCheck.status = 'degraded';
    healthCheck.database.status = 'unhealthy';
    healthCheck.database.connected = false;
  }

  const statusCode = healthCheck.database.connected ? 200 : 503;
  res.status(statusCode).json(healthCheck);
});

/**
 * Readiness probe for Kubernetes/orchestration
 * Returns 200 only if all dependencies are ready
 */
router.get('/ready', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'not_ready',
      message: 'Database connection unavailable',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Liveness probe for Kubernetes/orchestration
 * Returns 200 if the process is alive
 */
router.get('/live', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
  });
});

export default router;
