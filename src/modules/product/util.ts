import { redisClient } from '../../core/utils/redis.client';
import { IProductDocument } from './interfaces';

export class ProductCache {
  private static PREFIX = 'product:';
  private static TTL = 30; // Seconds

  static async get(productId: string): Promise<IProductDocument | null> {
    const data = await redisClient.get(`${this.PREFIX}${productId}`);
    return data ? JSON.parse(data) : null;
  }

  static async set(product: IProductDocument): Promise<void> {
    await redisClient.set(
      `${this.PREFIX}${product._id}`,
      JSON.stringify(product),
      this.TTL,
    );
  }

  static async invalidate(productId: string): Promise<void> {
    await redisClient.del(`${this.PREFIX}${productId}`);
  }
}