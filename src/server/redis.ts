import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Upstash / Redis connection
const redisUrl = process.env.UPSTASH_REDIS_URL || process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null, // Required by BullMQ
});

export default redis;
