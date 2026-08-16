"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORIES } from "@/lib/products";
import type { Product } from "@/lib/products";
import ProductCard from "./ProductCard";

const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low → High" },
  { id: "price-desc", label: "Price: High → Low" },
  { id: "rating", label: "Top Rated" },
];

export default function ShopGrid({
  products,
  category,
  q,
  sort,
}: {
  products: Product[];
  category: string;
  q: string;
  sort: string;
}) {
  const router = useRouter();

  const buildQs = (extra: Record<string, string>) => {
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (q) params.set("q", q);
    Object.entries(extra).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const s = params.toString();
    return s ? `/shop?${s}` : "/shop";
  };

  const isActiveCat = (id: string) =>
    id === "all" ? category === "all" : category === id;

  return (
    <div className="space-y-8">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          <Link
            href={buildQs({ category: "" })}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-95 ${
              isActiveCat("all")
                ? "bg-lime-400 text-black shadow-[0_0_18px_rgba(163,230,53,0.35)]"
                : "border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-lime-400/50 hover:text-lime-300"
            }`}
          >
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={buildQs({ category: c.id })}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-95 ${
                isActiveCat(c.id)
                  ? "bg-lime-400 text-black shadow-[0_0_18px_rgba(163,230,53,0.35)]"
                  : "border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-lime-400/50 hover:text-lime-300"
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <p className="text-sm text-zinc-500">
            {products.length} {products.length === 1 ? "item" : "items"}
          </p>
          <select
            value={sort}
            onChange={(e) => router.push(buildQs({ sort: e.target.value }))}
            className="input w-auto cursor-pointer rounded-full py-2 text-sm"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid — 4 columns on desktop */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-zinc-800 py-24 text-center">
          <span className="text-5xl">🔍</span>
          <p className="text-xl font-semibold text-zinc-200">No products found</p>
          <p className="max-w-sm text-sm text-zinc-500">
            {q
              ? `Nothing matches "${q}". Try a different search.`
              : "Nothing in this category yet. Check back soon."}
          </p>
          <Link href="/shop" className="btn btn-primary mt-2">
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} delay={(i % 4) * 80} />
          ))}
        </div>
      )}
    </div>
  );
}
