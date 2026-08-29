import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getContent, saveContent } from "@/lib/adminStore";
import type { SiteContent } from "@/lib/adminStore";

export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const content = await getContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as SiteContent;
    await saveContent(body);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
