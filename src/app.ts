import dotenv from 'dotenv';
dotenv.config();
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './exceptions/ErrorHandler';
import connectTimeout from 'connect-timeout';

const app = express();

app.use(
  cors({
    origin: '*',
  }),
);
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: false }));
app.use(connectTimeout('60s'));

app.use('/', routes);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler.handleError(err, res);
});

export default app;
