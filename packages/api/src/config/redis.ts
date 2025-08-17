/**
 * 🚀 REDIS CACHE CONFIGURATION
 * 
 * High-performance caching with ioredis
 */

import Redis from 'ioredis';

// Redis configuration
const REDIS_CONFIG = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keyPrefix: 'aijobchommie:',
  connectTimeout: 10000,
  commandTimeout: 5000,
};

// Create Redis client
export const redis = new Redis(REDIS_CONFIG);

// Redis event handlers
redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redis.on('error', (error) => {
  console.error('❌ Redis connection error:', error);
});

redis.on('ready', () => {
  console.log('🚀 Redis is ready for operations');
});

// Cache utility functions
export class CacheService {
  
  /**
   * Set cache with expiration
   */
  static async set(key: string, value: any, expirationInSeconds: number = 3600): Promise<void> {
    try {
      await redis.setex(key, expirationInSeconds, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Get cached value
   */
  static async get(key: string): Promise<any | null> {
    try {
      const cached = await redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Delete cache key
   */
  static async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  /**
   * Check if key exists
   */
  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  /**
   * Set cache with pattern-based expiration
   */
  static async setPattern(pattern: string, data: any, expirationInSeconds: number = 3600): Promise<void> {
    try {
      await redis.setex(pattern, expirationInSeconds, JSON.stringify(data));
    } catch (error) {
      console.error('Cache pattern set error:', error);
    }
  }

  /**
   * Get all keys matching pattern
   */
  static async getPattern(pattern: string): Promise<any[]> {
    try {
      const keys = await redis.keys(pattern);
      const results = [];
      
      for (const key of keys) {
        const value = await this.get(key.replace('aijobchommie:', ''));
        if (value) results.push(value);
      }
      
      return results;
    } catch (error) {
      console.error('Cache pattern get error:', error);
      return [];
    }
  }

  /**
   * Clear cache by pattern
   */
  static async clearPattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(`aijobchommie:${pattern}`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache clear pattern error:', error);
    }
  }

  /**
   * Cache health check
   */
  static async healthCheck(): Promise<boolean> {
    try {
      await redis.ping();
      return true;
    } catch (error) {
      console.error('Redis health check failed:', error);
      return false;
    }
  }
}

// Initialize Redis connection
export async function initializeRedis(): Promise<void> {
  try {
    console.log('🔗 Initializing Redis connection...');
    await redis.connect();
    const isHealthy = await CacheService.healthCheck();
    if (!isHealthy) {
      throw new Error('Redis health check failed');
    }
    console.log('✅ Redis initialized successfully');
  } catch (error) {
    console.error('❌ Redis initialization failed:', error);
    // Don't throw error to allow app to continue without cache
    console.log('⚠️ Continuing without Redis cache...');
  }
}
