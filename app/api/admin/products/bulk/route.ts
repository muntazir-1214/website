import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdmin } from "@/lib/adminAuth";
import { getProducts, saveProducts } from "@/lib/adminStore";
import { bulkProductSchema, parseBody } from "@/lib/validations";

export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await parseBody(request, bulkProductSchema);
    const products = await getProducts();
    const idSet = new Set(body.ids);
    let affected = 0;

    if (body.action === "delete") {
      const remaining = products.filter((p) => !idSet.has(p.id));
      affected = products.length - remaining.length;
      await saveProducts(remaining);
    } else {
      const updated = products.map((p) => {
        if (idSet.has(p.id)) {
          affected++;
          return { ...p, category: body.category };
        }
        return p;
      });
      await saveProducts(updated);
    }

    return NextResponse.json({ success: true, affected });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.issues },
        { status: 400 }
      );
    }
    const message = err instanceof Error ? err.message : "Bulk operation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
