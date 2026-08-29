import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getCategories, addCategory, saveCategories } from "@/lib/adminStore";
import type { CategoryEntry } from "@/lib/adminStore";

export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const categories = await getCategories();
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as CategoryEntry;

    if (!body.id?.trim() || !body.label?.trim()) {
      return NextResponse.json(
        { error: "id and label are required" },
        { status: 400 }
      );
    }

    const existing = await getCategories();
    const cat: CategoryEntry = {
      id: body.id.trim().toLowerCase().replace(/\s+/g, "-"),
      label: body.label.trim(),
      slug: body.slug || body.id.trim().toLowerCase().replace(/\s+/g, "-"),
      description: body.description ?? "",
      sortOrder: body.sortOrder ?? existing.length,
      visible: body.visible ?? true,
    };

    const created = await addCategory(cat);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { categories: CategoryEntry[] };
    if (!body.categories) {
      return NextResponse.json({ error: "categories array required" }, { status: 400 });
    }
    await saveCategories(body.categories);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
