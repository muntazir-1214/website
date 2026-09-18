import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdmin } from "@/lib/adminAuth";
import { getCategories, addCategory, saveCategories } from "@/lib/adminStore";
import { addCategorySchema, saveCategoriesSchema, parseBody } from "@/lib/validations";
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
    const body = await parseBody(request, addCategorySchema);
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

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await parseBody(request, saveCategoriesSchema);
    await saveCategories(body.categories);
    return NextResponse.json({ success: true });
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
