import { NextResponse } from "next/server";
import { getAdminPassword, COOKIE_CONFIG } from "@/lib/adminAuth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = await request.json();
  const { password } = body;

  if (password === getAdminPassword()) {
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
