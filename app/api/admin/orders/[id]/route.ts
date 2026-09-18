import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdmin } from "@/lib/adminAuth";
import { updateOrderStatus } from "@/lib/adminStore";
import { updateOrderStatusSchema, parseBody } from "@/lib/validations";
import { sendOrderNotification } from "@/lib/notifications";

const paramSchema = z.object({ id: z.string().min(1).max(100) });

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = paramSchema.parse(await params);
    const body = await parseBody(request, updateOrderStatusSchema);
    const updated = await updateOrderStatus(id, body.status);

    const notifResults = await sendOrderNotification(updated, body.status);

    return NextResponse.json({ ...updated, notifications: notifResults });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.issues },
        { status: 400 }
      );
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
