import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getProducts, saveProducts } from "@/lib/adminStore";
import type { Product, Category } from "@/lib/products";

const VALID_CATEGORIES: Category[] = [
  "shirts", "t-shirts", "trousers", "shorts", "hoodies", "jackets",
];

function parseCsvRow(row: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (inQuotes) {
      if (ch === '"' && row[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        fields.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
  }
  fields.push(current);
  return fields;
}

function csvToProduct(row: string): Product | null {
  const fields = parseCsvRow(row);
  if (fields.length < 13) return null;

  const id = fields[0].trim();
  const name = fields[1].trim();
  const category = fields[2].trim() as Category;

  if (!id || !name) return null;
  if (!VALID_CATEGORIES.includes(category)) return null;

  const product: Product = {
    id,
    name,
    category,
    price: Number(fields[3]) || 0,
    rating: Number(fields[5]) || 0,
    reviews: Number(fields[6]) || 0,
    description: fields[7].trim(),
    details: fields[8]
      .split("|")
      .map((d) => d.trim())
      .filter(Boolean),
    colors: fields[9]
      .split(";")
      .map((c) => {
        const [colorName, hex] = c.trim().split(":");
        return { name: (colorName ?? "").trim(), hex: (hex ?? "#000000").trim() };
      })
      .filter((c) => c.name),
    sizes: fields[10]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    badge: (fields[11]?.trim() || undefined) as Product["badge"],
    featured: fields[12]?.trim() === "true",
  };

  if (fields[3] && Number(fields[4])) {
    product.oldPrice = Number(fields[4]);
  }
  if (fields[13]?.trim()) {
    product.image = fields[13].trim();
  }
  if (fields[14]?.trim()) {
    product.gallery = fields[14]
      .split(";")
      .map((g) => g.trim())
      .filter(Boolean);
  }

  return product;
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.json();
    const { content, format, mode } = formData as {
      content: string;
      format: "json" | "csv";
      mode: "replace" | "merge";
    };

    if (!content?.trim()) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    let incoming: Product[];

    if (format === "json") {
      try {
        const parsed = JSON.parse(content);
        incoming = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return NextResponse.json(
          { error: "Invalid JSON format" },
          { status: 400 }
        );
      }
    } else {
      // CSV
      const lines = content.split("\n").filter((l) => l.trim());
      if (lines.length < 2) {
        return NextResponse.json(
          { error: "CSV must have a header row and at least one data row" },
          { status: 400 }
        );
      }
      // Skip header
      const products: Product[] = [];
      for (let i = 1; i < lines.length; i++) {
        const product = csvToProduct(lines[i]);
        if (product) products.push(product);
      }
      incoming = products;
    }

    if (incoming.length === 0) {
      return NextResponse.json(
        { error: "No valid products found in the file" },
        { status: 400 }
      );
    }

    // Validate all products
    const errors: string[] = [];
    for (const p of incoming) {
      if (!p.id) errors.push(`Missing id for product "${p.name}"`);
      if (!p.name) errors.push(`Missing name for product "${p.id}"`);
      if (!VALID_CATEGORIES.includes(p.category)) {
        errors.push(`Invalid category "${p.category}" for "${p.id}"`);
      }
    }
    if (errors.length > 0) {
      return NextResponse.json(
        { error: `Validation errors:\n${errors.join("\n")}` },
        { status: 400 }
      );
    }

    let final: Product[];

    if (mode === "replace") {
      final = incoming;
    } else {
      // Merge: existing products get updated, new ones get added
      const existing = await getProducts();
      const existingMap = new Map(existing.map((p) => [p.id, p]));
      for (const p of incoming) {
        existingMap.set(p.id, p);
      }
      final = Array.from(existingMap.values());
    }

    await saveProducts(final);

    return NextResponse.json({
      success: true,
      imported: incoming.length,
      total: final.length,
      mode,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Import failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
