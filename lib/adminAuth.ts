import { cookies } from "next/headers";

const COOKIE_NAME = "admin_token";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function verifyAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return token === ADMIN_PASSWORD;
}

export function getAdminPassword(): string | undefined {
  return ADMIN_PASSWORD;
}

export const COOKIE_CONFIG = {
  name: COOKIE_NAME,
  maxAge: 60 * 60 * 8, // 8 hours
} as const;
