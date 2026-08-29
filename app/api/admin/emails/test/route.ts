import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { renderOrderEmail } from "@/lib/emailTemplates";
import type { Order } from "@/lib/adminStore";

const DEMO_ORDER: Order = {
  id: "ord-test-demo123",
  customerName: "Test Customer",
  email: "",
  items: [
    { productId: "onyx-oversized-tee", name: "Onyx Oversized Tee", qty: 2, price: 39 },
    { productId: "heavyweight-hoodie", name: "Heavyweight Hoodie", qty: 1, price: 85 },
  ],
  total: 163,
  status: "pending",
  createdAt: new Date().toISOString(),
};

export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { to, status } = body as { to: string; status: Order["status"] };

  if (!to?.trim()) {
    return NextResponse.json({ error: "Recipient email is required" }, { status: 400 });
  }

  // Check Resend is configured
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "RESEND_API_KEY not configured. Add it to your .env file to send emails.",
      },
      { status: 400 }
    );
  }

  const order = { ...DEMO_ORDER, email: to.trim() };
  const { subject, html, text } = renderOrderEmail(order, status);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || `DARKWEAR <notifications@darkwear.com>`,
        to: [to.trim()],
        subject,
        html,
        text,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      return NextResponse.json({ success: true, id: data.id });
    }

    return NextResponse.json(
      { error: data.message || "Failed to send email" },
      { status: 400 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
