import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';

const app: Application = express();

app.use(helmet());

app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
