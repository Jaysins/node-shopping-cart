// core/cache/redis.client.ts
import { createClient, RedisClientType } from 'redis';
import settings from '../../config/settings';
import logger from './logger';

class RedisClient {
  private client: RedisClientType;
  private static instance: RedisClient;

  private constructor() {
    this.client = createClient({
      url: settings.REDIS_URI,
      pingInterval: 1000 * 60 * 4 // 4 minutes
    });

    this.client.on('error', (err: any) => 
      logger.error(`Redis Client Error: ${err}`));
  }

  static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  async connect(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
      logger.info('Connected to Redis');
    }
  }
  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const options = ttl ? { EX: ttl } : undefined;
    await this.client.set(key, value, options);
  }

  async decrby(key: string, decrement: number): Promise<number> {
    return this.client.decrBy(key, decrement);
  }

  async incrby(key: string, increment: number): Promise<number> {
    return this.client.incrBy(key, increment);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async multi() {
    return this.client.multi();
  }

  async quit(): Promise<void> {
    await this.client.quit();
  }
}

export const redisClient = RedisClient.getInstance();