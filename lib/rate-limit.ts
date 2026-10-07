interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * In-memory sliding window rate limiter
 * @param key unique identifier (e.g. IP + endpoint)
 * @param limit maximum requests allowed in window
 * @param windowMs time window in milliseconds
 */
export function checkRateLimit(
  key: string,
  limit: number = 20,
  windowMs: number = 60 * 1000
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.resetTime) {
    const record: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, record);
    return { success: true, remaining: limit - 1, resetTime: record.resetTime };
  }

  if (existing.count >= limit) {
    return { success: false, remaining: 0, resetTime: existing.resetTime };
  }

  existing.count += 1;
  return {
    success: true,
    remaining: limit - existing.count,
    resetTime: existing.resetTime,
  };
}

// Clean up stale rate limits every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((value, key) => {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}
