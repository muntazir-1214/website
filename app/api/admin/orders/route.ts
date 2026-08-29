import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getOrders, createOrder } from "@/lib/adminStore";
import type { Order } from "@/lib/adminStore";

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
    const body = (await request.json()) as {
      customerName: string;
      email: string;
      items: Order["items"];
      status?: Order["status"];
    };

    if (!body.customerName?.trim()) {
      return NextResponse.json({ error: "Customer name is required" }, { status: 400 });
    }
    if (!body.email?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: "At least one item is required" }, { status: 400 });
    }

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
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
