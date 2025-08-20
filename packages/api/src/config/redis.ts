import Redis from 'ioredis';

export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379')
});

export class CacheService {
  static async set(key: string, value: any, expirationInSeconds = 3600) {
    await redis.setex(key, expirationInSeconds, JSON.stringify(value));
  }
  static async get(key: string) {
    const v = await redis.get(key);
    return v ? JSON.parse(v) : null;
  }
  static async del(key: string) {
    await redis.del(key);
  }
  static async deletePattern(pattern: string) {
    // map to clearPattern
    await this.clearPattern(pattern.replace('*', ''));
  }
  static async clearPattern(pattern: string) {
    const keys = await redis.keys(`aijobchommie:${pattern}`);
    if (keys.length) await redis.del(...keys);
  }
}
