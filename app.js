import express, { json, urlencoded } from 'express';
import cors from 'cors';
import createLogger from './src/config/logger.js';
import morgan from 'morgan';
import helmet from 'helmet';
import errorHandler from './src/controllers/errorController.js';
import AppError from './src/utils/appError.js';

const corsOptions = {
  origin: '*',
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  optionsSuccessfulStatus: 204,
};

const app = express();

global.createLogger = createLogger({ label: 'SangaBooks' });

app.use(helmet());
app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('combined', { stream: createLogger.stream }));

app.use((req, res, next) => {
  console.log('Body:', req.body);
  next();
});

import authRouter from './src/routes/authRoutes.js';
import adminRouter from './src/routes/adminRoutes.js';
import roleRouter from './src/routes/roleRoutes.js';

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/roles', roleRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `The requested page: ${req.originalUrl} using the method: ${req.method} not found on this server`,
      404
    )
  );
});

app.use(errorHandler);

export default app;
