import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getProducts, addProduct } from "@/lib/adminStore";
import type { Product } from "@/lib/products";

export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Product;

    // Basic validation
    if (!body.id || !body.name || !body.category) {
      return NextResponse.json(
        { error: "id, name, and category are required" },
        { status: 400 }
      );
    }

    // Normalise defaults
    const product: Product = {
      ...body,
      rating: body.rating ?? 0,
      reviews: body.reviews ?? 0,
      description: body.description ?? "",
      details: body.details ?? [],
      colors: body.colors ?? [],
      sizes: body.sizes ?? ["S", "M", "L", "XL"],
    };

    const created = await addProduct(product);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
