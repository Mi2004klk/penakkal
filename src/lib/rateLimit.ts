import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// For the mock phase, we just export a dummy interface if Redis is not configured
// In production, Redis.fromEnv() will throw if env vars are missing, so we wrap it
let redis: Redis | null = null;
try {
  redis = Redis.fromEnv();
} catch (error) {
  console.warn("Upstash Redis not configured. Rate limiting will be disabled.");
}

// Dummy fallback limiter that always allows traffic
const dummyLimiter = {
  limit: async (identifier: string) => ({ success: true, limit: 100, remaining: 99, reset: 0 }),
} as any;

export const rateLimiters = {
  auth: redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '15m') }) : dummyLimiter,
  search: redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, '1m') }) : dummyLimiter,
  contact: redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '1h') }) : dummyLimiter,
  newsletter: redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '1h') }) : dummyLimiter,
  upload: redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, '10m') }) : dummyLimiter,
  preview: redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '1m') }) : dummyLimiter,
};
