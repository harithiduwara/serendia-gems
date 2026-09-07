/**
 * Fixed-window rate limiter.
 *
 * KNOWN LIMITATION (docs/02-architecture.md §7): state is per-process and
 * in-memory, so on a multi-instance or serverless deployment this degrades to
 * per-instance limiting. That is acceptable at 1.0 enquiry volumes. The
 * signature is deliberately shaped so a shared store (Redis/Upstash) can be
 * dropped in without touching callers.
 */
interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export const rateLimit = (
  key: string,
  limit = 5,
  windowMs = 10 * 60 * 1000,
): RateLimitResult => {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    const fresh = { count: 1, resetAt: now + windowMs };
    windows.set(key, fresh);
    // Opportunistic sweep so the map cannot grow without bound.
    if (windows.size > 5_000) {
      for (const [k, w] of windows) if (w.resetAt <= now) windows.delete(k);
    }
    return { allowed: true, remaining: limit - 1, resetAt: fresh.resetAt };
  }

  existing.count += 1;
  return {
    allowed: existing.count <= limit,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
  };
};

/** Test seam. */
export const __resetRateLimits = (): void => windows.clear();
