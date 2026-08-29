"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import ProductImage from "./ProductImage";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, subtotal } = useCart();

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-zinc-800 bg-zinc-950 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
          <h2 className="font-display text-2xl tracking-widest">
            YOUR CART <span className="text-lime-400">({items.length})</span>
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 transition-all hover:border-lime-400/60 hover:rotate-90 active:scale-90"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 text-4xl">
              🛍️
            </div>
            <p className="text-lg font-semibold text-zinc-200">Your cart is empty</p>
            <p className="text-sm text-zinc-500">
              Add something fresh from the latest drop.
            </p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="btn btn-primary mt-2"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {items.map((item, i) => (
                <div
                  key={`${item.product.id}-${item.size}-${item.color}`}
                  className="flex gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 animate-fade-up"
                >
                  <div className="flex w-20 shrink-0 items-center justify-center rounded-xl bg-linear-to-b from-zinc-800/60 to-zinc-900">
                    <ProductImage
                      category={item.product.category}
                      color={item.product.colors[0].hex}
                      image={item.product.image}
                      className="w-14"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-zinc-100">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {item.size} · {item.color}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(i)}
                        aria-label="Remove item"
                        className="text-zinc-600 transition-colors hover:text-red-400 active:scale-90"
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 rounded-full border border-zinc-700 px-1 py-0.5">
                        <button
                          onClick={() => updateQty(i, item.qty - 1)}
                          aria-label="Decrease quantity"
                          className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-lime-300 active:scale-90"
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-sm font-semibold">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(i, item.qty + 1)}
                          aria-label="Increase quantity"
                          className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-lime-300 active:scale-90"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-bold text-zinc-50">
                        ${item.product.price * item.qty}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-zinc-800 px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Subtotal</span>
                <span className="text-xl font-bold text-zinc-50">
                  ${subtotal}
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Shipping and taxes calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="btn btn-primary w-full"
              >
                Checkout →
              </Link>
              <button onClick={closeCart} className="btn btn-dark w-full">
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
