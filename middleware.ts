import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "admin_token";
const PORTAL_PREFIX = "/internal-store-portal-2026";

// ── Request size limits (bytes) ─────────────────────────────────────────────
const GENERAL_MAX_BYTES = 1 * 1024 * 1024; // 1 MB — most API payloads
const UPLOAD_MAX_BYTES = 5 * 1024 * 1024; // 5 MB — file uploads

const BODY_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// ── Rate limiting (in-memory, per-IP) ────────────────────────────────────────
// Tracks login attempts per IP. Blocks after MAX_ATTEMPTS within WINDOW_MS.
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_MS = 30 * 60 * 1000; // 30 minute block after exceeding limit

type RateEntry = { count: number; windowStart: number; blockedUntil: number };
const rateLimitStore = new Map<string, RateEntry>();

// Periodic cleanup to prevent memory leaks (runs on each middleware invocation
// when the map grows large — cheap guard).
function cleanupStore() {
  if (rateLimitStore.size > 10_000) {
    const now = Date.now();
    for (const [ip, entry] of rateLimitStore) {
      if (now > entry.blockedUntil && now - entry.windowStart > WINDOW_MS) {
        rateLimitStore.delete(ip);
      }
    }
  }
}

function getClientIp(req: NextRequest): string {
  // Prefer X-Forwarded-For (set by reverse proxies / load balancers),
  // fall back to a synthetic key so the map never stores `undefined`.
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  // Still blocked from a previous violation
  if (entry && now < entry.blockedUntil) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((entry.blockedUntil - now) / 1000),
    };
  }

  // Outside the window — reset
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, windowStart: now, blockedUntil: 0 });
    return { allowed: true };
  }

  // Inside the window — increment
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

// ── Middleware entry point ────────────────────────────────────────────────────
function checkRequestSize(req: NextRequest): NextResponse | null {
  // Only check methods that carry a body
  if (!BODY_METHODS.has(req.method)) return null;

  const contentLength = req.headers.get("content-length");
  if (!contentLength) return null; // streaming uploads handled differently

  const size = parseInt(contentLength, 10);
  if (isNaN(size) || size < 0) {
    return NextResponse.json(
      { error: "Invalid Content-Length header" },
      { status: 400 }
    );
  }

  // Use stricter limit for upload endpoints
  const maxBytes = req.nextUrl.pathname.includes("/upload")
    ? UPLOAD_MAX_BYTES
    : GENERAL_MAX_BYTES;

  if (size > maxBytes) {
    const maxMB = (maxBytes / 1024 / 1024).toFixed(0);
    return NextResponse.json(
      { error: `Payload too large. Maximum size: ${maxMB}MB` },
      { status: 413 }
    );
  }

  return null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Global request size guard (all POST/PUT/PATCH/DELETE) ───────────────
  if (BODY_METHODS.has(req.method)) {
    const sizeError = checkRequestSize(req);
    if (sizeError) return sizeError;
  }

  // Only protect the admin portal routes
  if (!pathname.startsWith(PORTAL_PREFIX)) {
    return NextResponse.next();
  }

  // The login page itself is public — but rate-limit it
  if (pathname === PORTAL_PREFIX || pathname === PORTAL_PREFIX + "/") {
    cleanupStore();
    const ip = getClientIp(req);
    const { allowed, retryAfterSec } = checkRateLimit(ip);

    if (!allowed) {
      const res = NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
      res.headers.set("Retry-After", String(retryAfterSec));
      return res;
    }

    return NextResponse.next();
  }

  // All other /internal-store-portal-2026/* routes require a valid cookie
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const password = process.env.ADMIN_PASSWORD;

  if (!token || !password || token !== password) {
    // Redirect unauthenticated users to the login page
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = PORTAL_PREFIX;
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply to all routes for size limiting + admin portal protection
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
