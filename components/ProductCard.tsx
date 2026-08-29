"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { categoryLabel } from "@/lib/products";
import { useCart } from "@/lib/CartContext";
import ProductImage from "./ProductImage";
import Reveal from "./Reveal";

const BADGE_STYLES: Record<string, string> = {
  SALE: "bg-red-400 text-black",
  NEW: "bg-lime-400 text-black",
  HOT: "bg-orange-400 text-black",
};

export default function ProductCard({
  product,
  delay = 0,
}: {
  product: Product;
  delay?: number;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const color = product.colors[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.sizes[0], color.name, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <Reveal delay={delay} className="h-full">
      <Link
        href={`/product/${product.id}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 transition-all duration-300 hover:-translate-y-1.5 hover:border-lime-400/40 hover:shadow-[0_24px_60px_-24px_rgba(163,230,53,0.3)]"
      >
        <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-linear-to-b from-zinc-800/60 to-zinc-900">
          {product.badge && (
            <span
              className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-widest ${BADGE_STYLES[product.badge]}`}
            >
              {product.badge}
            </span>
          )}
          <ProductImage
            category={product.category}
            color={color.hex}
            image={product.image}
            className="w-4/5 drop-shadow-[0_18px_25px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
          />
          <button
            onClick={handleQuickAdd}
            aria-label={`Quick add ${product.name} to cart`}
            className="absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-lime-400 text-lg font-bold text-black opacity-0 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 group-hover:opacity-100"
          >
            {added ? "✓" : "+"}
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-lime-400/80">
            {categoryLabel(product.category)}
          </span>
          <h3 className="font-semibold text-zinc-100 transition-colors group-hover:text-lime-300">
            {product.name}
          </h3>
          <div className="mt-auto flex items-center justify-between pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-zinc-50">
                ${product.price}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-zinc-500 line-through">
                  ${product.oldPrice}
                </span>
              )}
            </div>
            <span className="text-xs font-medium text-zinc-400">
              ★ {product.rating}
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
