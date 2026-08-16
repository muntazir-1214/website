"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/CartContext";

export default function ProductActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [size, setSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [color, setColor] = useState(product.colors[0].name);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const pickSize = (s: string) => {
    setSize(s);
    setSizeError(false);
  };

  const validate = () => {
    if (!size) {
      setSizeError(true);
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    if (!validate()) return;
    addItem(product, size as string, color, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (!validate()) return;
    addItem(product, size as string, color, qty);
    router.push("/checkout");
  };

  return (
    <div className="space-y-6">
      {/* Colors */}
      <div>
        <p className="label">
          Color — <span className="text-zinc-300 normal-case">{color}</span>
        </p>
        <div className="flex gap-2.5">
          {product.colors.map((c) => (
            <button
              key={c.name}
              onClick={() => setColor(c.name)}
              aria-label={`Color ${c.name}`}
              title={c.name}
              className={`h-9 w-9 rounded-full border-2 transition-all duration-200 active:scale-90 ${
                color === c.name
                  ? "border-lime-400 ring-2 ring-lime-400/30 scale-110"
                  : "border-zinc-700 hover:border-zinc-400"
              }`}
              style={{ background: c.hex }}
            />
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className="label">Size</p>
        <div className={`flex gap-2.5 ${sizeError ? "animate-shake" : ""}`}>
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => pickSize(s)}
              className={`h-11 w-12 rounded-xl border text-sm font-bold transition-all duration-200 active:scale-90 ${
                size === s
                  ? "border-lime-400 bg-lime-400 text-black shadow-[0_0_18px_rgba(163,230,53,0.35)]"
                  : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {sizeError && (
          <p className="mt-2 text-xs font-semibold text-red-400 animate-fade-in">
            Please select a size first.
          </p>
        )}
      </div>

      {/* Quantity + buttons */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-zinc-700 px-2 py-1.5">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-lime-300 active:scale-90"
          >
            −
          </button>
          <span className="w-6 text-center font-bold">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(9, q + 1))}
            aria-label="Increase quantity"
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-lime-300 active:scale-90"
          >
            +
          </button>
        </div>
        <button onClick={handleAdd} className="btn btn-dark flex-1">
          {added ? "✓ Added to Cart" : "Add to Cart"}
        </button>
      </div>
      <button onClick={handleBuyNow} className="btn btn-primary w-full">
        Buy Now — Checkout
      </button>
      <p className="text-center text-xs text-zinc-500">
        Free shipping over $99 · 30-day returns · Secure checkout
      </p>
    </div>
  );
}
