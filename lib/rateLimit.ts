/**
 * Simple in-memory rate limiter for API routes (Node.js runtime).
 * Not shared with the Edge middleware — they have separate memory spaces.
 */

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_MS = 30 * 60 * 1000; // 30 minute block

type Entry = { count: number; windowStart: number; blockedUntil: number };
const store = new Map<string, Entry>();

function cleanup() {
  if (store.size > 10_000) {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.blockedUntil && now - entry.windowStart > WINDOW_MS) {
        store.delete(key);
      }
    }
  }
}

export function checkApiRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSec?: number;
} {
  cleanup();
  const now = Date.now();
  const entry = store.get(ip);

  if (entry && now < entry.blockedUntil) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((entry.blockedUntil - now) / 1000),
    };
  }

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    store.set(ip, { count: 1, windowStart: now, blockedUntil: 0 });
    return { allowed: true };
  }

  entry.count += 1;

  if (entry.count > MAX_ATTEMPTS) {
    entry.blockedUntil = now + BLOCK_MS;
    return {
      allowed: false,
      retryAfterSec: Math.ceil(BLOCK_MS / 1000),
    };
  }

  return { allowed: true };
}

export function resetRateLimit(ip: string) {
  store.delete(ip);
}
