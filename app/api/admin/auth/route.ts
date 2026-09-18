import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminPassword, COOKIE_CONFIG } from "@/lib/adminAuth";
import { cookies } from "next/headers";
import { checkApiRateLimit, resetRateLimit } from "@/lib/rateLimit";
import { authLoginSchema } from "@/lib/validations";

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed, retryAfterSec } = checkApiRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { success: false, error: "Too many login attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
    );
  }

  const { password } = authLoginSchema.parse(await request.json());

  if (password === getAdminPassword()) {
    resetRateLimit(ip); // clear failed attempts on success
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_CONFIG.name, password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_CONFIG.maxAge,
      path: "/",
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_CONFIG.name, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return NextResponse.json({ success: true });
}
