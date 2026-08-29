import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getProducts, saveProducts } from "@/lib/adminStore";
import type { Category } from "@/lib/products";

const VALID_CATEGORIES: Category[] = [
  "shirts", "t-shirts", "trousers", "shorts", "hoodies", "jackets",
];

export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, ids } = body as {
      action: "delete" | "updateCategory";
      ids: string[];
      category?: Category;
    };

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "No product IDs provided" },
        { status: 400 }
      );
    }

    const products = await getProducts();
    const idSet = new Set(ids);
    let affected = 0;

    if (action === "delete") {
      const remaining = products.filter((p) => !idSet.has(p.id));
      affected = products.length - remaining.length;
      await saveProducts(remaining);
    } else if (action === "updateCategory") {
      const category = body.category as Category;
      if (!VALID_CATEGORIES.includes(category)) {
        return NextResponse.json(
          { error: `Invalid category: ${category}` },
          { status: 400 }
        );
      }
      const updated = products.map((p) => {
        if (idSet.has(p.id)) {
          affected++;
          return { ...p, category };
        }
        return p;
      });
      await saveProducts(updated);
    } else {
      return NextResponse.json(
        { error: `Unknown action: ${action}` },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, affected });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bulk operation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
