import logger from "../core/utils/logger";
import { redisClient } from "../core/utils/redis.client";

const initializeRedis = async () => {
  try {
    await redisClient.connect();
    logger.info('Redis connected successfully');
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    process.exit(1)
  }
};

export default initializeRedis