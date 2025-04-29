import express from 'express';
import connectDB from './config/db';
import settings from './config/settings';
import productRoutes from './modules/product/routes';
import cartRoutes from './modules/cart/routes';
import orderRoutes from './modules/order/routes';
import http from 'http';
import cors, { CorsOptions } from 'cors';
import errorHandlerMiddleware from './core/errors/errorHandler';
import logger from './core/utils/logger';
import initializeRedis from './config/redis';

const app = express();
const server = http.createServer(app);


const startServer = async () => {
  try {
    await connectDB();
    await initializeRedis();

    const corsOptions: CorsOptions = {
      origin: settings.CORS_ORIGINS.split(','),
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    app.use('/api/products', productRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/orders', orderRoutes);
    app.use(errorHandlerMiddleware);

    server.listen(settings.PORT, () => {
      logger.info(`Server running on port ${settings.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to initialize application:', error);
    process.exit(1);
  }
};

startServer();