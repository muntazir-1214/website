"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { Product, Category } from "@/lib/products";
import { CATEGORIES } from "@/lib/products";
import ProductDeleteButton from "./ProductDeleteButton";

const BADGE_STYLES: Record<string, string> = {
  SALE: "bg-red-400/20 text-red-400",
  NEW: "bg-lime-400/20 text-lime-400",
  HOT: "bg-orange-400/20 text-orange-400",
};

export default function ProductFilters({
  products,
}: {
  products: Product[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [badge, setBadge] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "price" | "rating" | "reviews">("name");

  // ── Selection ───────────────────────────────────────────────
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    if (badge !== "all") {
      result = result.filter((p) => p.badge === badge);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviews - a.reviews;
      }
    });

    return result;
  }, [products, search, category, badge, sortBy]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    for (const p of products) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [products]);

  // ── Selection helpers ───────────────────────────────────────
  const allFilteredSelected =
    filtered.length > 0 && filtered.every((p) => selected.has(p.id));

  const toggleAll = useCallback(() => {
    if (allFilteredSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((p) => p.id)));
    }
  }, [allFilteredSelected, filtered]);

  const toggleOne = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // ── Bulk actions ────────────────────────────────────────────
  const bulkDelete = useCallback(async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    if (!confirm(`Delete ${ids.length} product${ids.length > 1 ? "s" : ""}? This cannot be undone.`)) return;

    setBulkLoading(true);
    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", ids }),
      });
      if (res.ok) {
        setSelected(new Set());
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete products");
      }
    } catch {
      alert("Network error");
    } finally {
      setBulkLoading(false);
    }
  }, [selected, router]);

  const bulkChangeCategory = useCallback(
    async (newCategory: Category) => {
      const ids = Array.from(selected);
      if (ids.length === 0) return;

      setBulkLoading(true);
      try {
        const res = await fetch("/api/admin/products/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "updateCategory",
            ids,
            category: newCategory,
          }),
        });
        if (res.ok) {
          setSelected(new Set());
          setShowCategoryModal(false);
          router.refresh();
        } else {
          const data = await res.json();
          alert(data.error || "Failed to update categories");
        }
      } catch {
        alert("Network error");
      } finally {
        setBulkLoading(false);
      }
    },
    [selected, router]
  );

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
          >
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, or description…"
            className="input pl-10"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="input w-auto min-w-[160px] appearance-none text-sm"
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="rating">Sort by Rating</option>
          <option value="reviews">Sort by Reviews</option>
        </select>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategory("all")}
          className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
            category === "all"
              ? "border-lime-400/60 bg-lime-400/15 text-lime-300"
              : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
          }`}
        >
          All ({categoryCounts.all})
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
              category === c.id
                ? "border-lime-400/60 bg-lime-400/15 text-lime-300"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
            }`}
          >
            {c.label} ({categoryCounts[c.id] || 0})
          </button>
        ))}
      </div>

      {/* Badge filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500">Badge:</span>
        {["all", "NEW", "SALE", "HOT"].map((b) => (
          <button
            key={b}
            onClick={() => setBadge(b)}
            className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-all ${
              badge === b
                ? b === "all"
                  ? "border-zinc-400 bg-zinc-400/15 text-zinc-300"
                  : BADGE_STYLES[b]
                  ? `border-current ${BADGE_STYLES[b]}`
                  : "border-lime-400/60 bg-lime-400/15 text-lime-300"
                : "border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400"
            }`}
          >
            {b === "all" ? "All" : b}
          </button>
        ))}
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-lime-400/30 bg-lime-400/10 px-4 py-3 animate-fade-in">
          <span className="text-sm font-semibold text-lime-300">
            {selected.size} selected
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowCategoryModal(true)}
              disabled={bulkLoading}
              className="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-all hover:border-lime-400/50 hover:text-lime-300 disabled:opacity-50"
            >
              Change Category
            </button>
            <button
              onClick={bulkDelete}
              disabled={bulkLoading}
              className="rounded-lg border border-red-400/40 bg-red-400/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-all hover:bg-red-400/20 disabled:opacity-50"
            >
              {bulkLoading ? "Working…" : `Delete (${selected.size})`}
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-500 transition-all hover:text-zinc-300"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-xs text-zinc-500">
        Showing {filtered.length} of {products.length} products
      </p>

      {/* Products table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="w-12 px-4 py-4">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded accent-lime-400 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Rating
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Badge
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className={`transition-colors hover:bg-zinc-800/30 ${
                    selected.has(product.id) ? "bg-lime-400/5" : ""
                  }`}
                >
                  <td className="w-12 px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selected.has(product.id)}
                      onChange={() => toggleOne(product.id)}
                      className="h-4 w-4 rounded accent-lime-400 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-800">
                        {product.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-lg">📦</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-200">
                          {product.name}
                        </p>
                        <p className="text-xs text-zinc-500">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300 capitalize">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-zinc-200">
                        ${product.price}
                      </span>
                      {product.oldPrice && (
                        <span className="text-xs text-zinc-500 line-through">
                          ${product.oldPrice}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-zinc-300">
                      ★ {product.rating}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {product.badge ? (
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-widest ${
                          BADGE_STYLES[product.badge] ?? ""
                        }`}
                      >
                        {product.badge}
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/internal-store-portal-2026/products/${product.id}/edit`}
                        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-all hover:border-lime-400/50 hover:text-lime-300"
                      >
                        Edit
                      </a>
                      <ProductDeleteButton productId={product.id} productName={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && products.length > 0 && (
          <div className="py-16 text-center">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-sm text-zinc-500">No products match your filters.</p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("all");
                setBadge("all");
              }}
              className="btn btn-ghost mt-4 text-sm"
            >
              Clear filters
            </button>
          </div>
        )}

        {products.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-3xl mb-3">📦</p>
            <p className="text-sm text-zinc-500">No products yet.</p>
            <a
              href="/internal-store-portal-2026/products/new"
              className="btn btn-primary mt-4 text-sm"
            >
              Add your first product
            </a>
          </div>
        )}
      </div>

      {/* Category change modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            onClick={() => setShowCategoryModal(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl tracking-wide text-zinc-50">
                CHANGE CATEGORY
              </h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition-all hover:border-lime-400/60 hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-zinc-400">
              Change category for <span className="font-semibold text-zinc-200">{selected.size}</span> selected product{selected.size > 1 && "s"}:
            </p>

            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => bulkChangeCategory(c.id)}
                  disabled={bulkLoading}
                  className="rounded-xl border border-zinc-700 px-4 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-lime-400/60 hover:bg-lime-400/5 hover:text-lime-300 disabled:opacity-50"
                >
                  {c.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCategoryModal(false)}
              className="btn btn-ghost w-full text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
