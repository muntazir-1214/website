import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getStats } from "@/lib/adminStore";

export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const stats = await getStats();
  return NextResponse.json(stats);
}
