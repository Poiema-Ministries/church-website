// Copyright 2026 Poiema Ministries. All Rights Reserved.

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

/**
 * Best-effort limiter for a single server instance. Enough to blunt form
 * abuse; it is not a global lock across every deploy region.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

export function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first.slice(0, 80);
  }
  return req.headers.get('x-real-ip')?.slice(0, 80) ?? 'unknown';
}
