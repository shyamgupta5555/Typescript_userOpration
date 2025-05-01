import express from 'express';
import dotenv from 'dotenv';
import sessionMiddleware from './config/session';
import authRoutes from './routes/authRoutes';
import connectDB from './config/db';
import logger from './common/utils/logger';
import morgan from 'morgan';
import cors from 'cors';
import './config/redis';
import { setupSwagger } from './config/swagger';

dotenv.config();
const app = express();
connectDB();
app.use(cors({
  origin: 'http://localhost:4000',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(sessionMiddleware);
app.use('/api/auth', authRoutes);
setupSwagger(app);
app.use("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
}
);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err);
   res.status(500).json({ message: 'Internal Server Error' });
});

export default app;



