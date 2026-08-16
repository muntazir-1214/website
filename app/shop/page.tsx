import type { Metadata } from "next";
import { products } from "@/lib/products";
import ShopGrid from "@/components/ShopGrid";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Shop All — DARKWEAR",
  description:
    "Browse the full DARKWEAR collection: shirts, t-shirts, trousers, shorts, hoodies and jackets.",
};

const SORTS: Record<string, (a: (typeof products)[number], b: (typeof products)[number]) => number> = {
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const { q = "", category = "all", sort = "featured" } = await searchParams;

  const query = q.trim().toLowerCase();

  let list = products.filter((p) => {
    const matchesCategory = category === "all" || p.category === category;
    const matchesQuery =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.category.includes(query) ||
      p.colors.some((c) => c.name.toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  });

  const sorter = SORTS[sort];
  if (sorter) list = [...list].sort(sorter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Reveal>
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-lime-400">
            {query ? `Results for "${q}"` : "The full collection"}
          </p>
          <h1 className="font-display text-6xl tracking-wide text-zinc-50 sm:text-7xl">
            {category === "all"
              ? "SHOP ALL"
              : category.toUpperCase().replace("-", " ")}
          </h1>
        </div>
      </Reveal>
      <Reveal delay={120}>
        <ShopGrid products={list} category={category} q={q} sort={sort} />
      </Reveal>
    </div>
  );
}
