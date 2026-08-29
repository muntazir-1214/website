import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getNotificationLog, clearNotificationLog } from "@/lib/notifications";

export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const log = await getNotificationLog();
  // Return newest first
  return NextResponse.json(log.reverse());
}

export async function DELETE() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await clearNotificationLog();
  return NextResponse.json({ success: true });
}
