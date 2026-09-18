import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdmin } from "@/lib/adminAuth";
import { updateCategory, deleteCategory } from "@/lib/adminStore";
import { updateCategorySchema } from "@/lib/validations";

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
    const body = updateCategorySchema.parse(await request.json());
    const updated = await updateCategory(id, body);
    return NextResponse.json(updated);
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = paramSchema.parse(await params);
    await deleteCategory(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
