type RateLimitEntry = {
  timestamps: number[];
};

const store = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000
): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const entry = store.get(key) ?? { timestamps: [] };
  const recent = entry.timestamps.filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    const oldest = recent[0] ?? now;
    return { allowed: false, retryAfterMs: windowMs - (now - oldest) };
  }

  recent.push(now);
  store.set(key, { timestamps: recent });

  return { allowed: true };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? 'unknown';
  }
  return request.headers.get('x-real-ip') ?? 'unknown';
}
