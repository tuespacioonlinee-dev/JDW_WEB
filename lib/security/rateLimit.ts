import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

function createRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    // Return null in dev/test if Redis is not configured
    return null;
  }

  return new Redis({ url, token });
}

function createRatelimiter(requests: number, window: string) {
  const redis = createRedis();
  if (!redis) return null;

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window as `${number} ${'s' | 'm' | 'h' | 'd'}`),
    analytics: false,
  });
}

// 3 lead submissions per hour per IP
export const leadRateLimit = createRatelimiter(3, '1 h');

// 30 content updates per minute per authenticated user
export const contentRateLimit = createRatelimiter(30, '1 m');

// 5 admin login requests per hour per IP
export const adminLoginRateLimit = createRatelimiter(5, '1 h');

// 60 requests per minute per IP (global public default)
export const globalRateLimit = createRatelimiter(60, '1 m');

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
};

export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string,
): Promise<RateLimitResult> {
  if (!limiter) {
    // If Redis not configured (dev), allow all requests
    return { success: true, remaining: 999, reset: 0 };
  }

  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}
