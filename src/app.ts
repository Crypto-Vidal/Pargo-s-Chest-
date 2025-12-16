import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { globalRateLimit } from './middleware/rateLimit';
import { requestIdMiddleware } from './middleware/requestId';
import { requestLogger } from './middleware/logging';

const app: Application = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: config.nodeEnv === 'production' ? undefined : false,
}));

// Request tracking
app.use(requestIdMiddleware);

// CORS configuration
const corsOrigins = config.corsOrigin.split(',').map(origin => origin.trim());
app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-request-id'],
}));

// Logging
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(requestLogger);

// Rate limiting (only in production)
if (config.nodeEnv === 'production') {
  app.use(globalRateLimit);
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Routes
app.use('/api/v1', routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
