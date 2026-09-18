import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdmin } from "@/lib/adminAuth";
import { getOrders, createOrder } from "@/lib/adminStore";
import { createOrderSchema, parseBody } from "@/lib/validations";

export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await getOrders();
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await parseBody(request, createOrderSchema);
    const total = body.items.reduce((sum, item) => sum + item.price * item.qty, 0);

    const order = await createOrder({
      customerName: body.customerName.trim(),
      email: body.email.trim(),
      items: body.items,
      total,
      status: body.status ?? "pending",
    });

    return NextResponse.json(order, { status: 201 });
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
