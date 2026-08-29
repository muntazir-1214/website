import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { updateOrderStatus } from "@/lib/adminStore";
import type { Order } from "@/lib/adminStore";
import { sendOrderNotification } from "@/lib/notifications";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = (await request.json()) as { status: Order["status"] };
    const updated = await updateOrderStatus(id, body.status);

    // Send email notification
    const notifResults = await sendOrderNotification(updated, body.status);

    return NextResponse.json({ ...updated, notifications: notifResults });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
