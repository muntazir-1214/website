import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getProducts } from "@/lib/adminStore";
import type { Product } from "@/lib/products";

function productToCsvRow(p: Product): string {
  const escape = (val: string) => `"${val.replace(/"/g, '""')}"`;
  return [
    p.id,
    escape(p.name),
    p.category,
    p.price,
    p.oldPrice ?? "",
    p.rating,
    p.reviews,
    escape(p.description),
    escape(p.details.join(" | ")),
    escape(p.colors.map((c) => `${c.name}:${c.hex}`).join("; ")),
    escape(p.sizes.join(", ")),
    p.badge ?? "",
    p.featured ? "true" : "false",
    p.image ?? "",
    escape((p.gallery ?? []).join("; ")),
  ].join(",");
}

const CSV_HEADER =
  "id,name,category,price,oldPrice,rating,reviews,description,details,colors,sizes,badge,featured,image,gallery";

export async function GET(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "json";
  const products = await getProducts();

  if (format === "csv") {
    const rows = [CSV_HEADER, ...products.map(productToCsvRow)];
    const csv = rows.join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="darkwear-products-${Date.now()}.csv"`,
      },
    });
  }

  // Default: JSON
  const json = JSON.stringify(products, null, 2);
  return new NextResponse(json, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="darkwear-products-${Date.now()}.json"`,
    },
  });
}
