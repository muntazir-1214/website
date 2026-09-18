"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

export default function NewOrderForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"pending" | "shipped" | "delivered" | "cancelled">("pending");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const addItem = () => {
    if (!selectedProductId) return;

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    // Check if already added — increment qty
    const existing = items.findIndex((i) => i.productId === product.id);
    if (existing >= 0) {
      setItems((prev) =>
        prev.map((item, i) =>
          i === existing ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setItems((prev) => [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
        },
      ]);
    }
    setSelectedProductId("");
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQty = (index: number, qty: number) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, qty } : item))
    );
  };

  const updatePrice = (index: number, price: number) => {
    if (price < 0) return;
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, price } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!customerName.trim()) {
      setError("Customer name is required.");
      return;
    }
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (items.length === 0) {
      setError("Add at least one product to the order.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          email: email.trim(),
          items,
          status,
        }),
      });

      if (res.ok) {
        router.push("/internal-store-portal-2026/orders");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create order.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400 animate-fade-in">
          {error}
        </div>
      )}

      {/* Customer Info */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
        <h3 className="font-semibold text-zinc-100">Customer Information</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label">Customer Name *</label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="John Doe"
              className="input"
            />
          </div>
          <div>
            <label className="label">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="input"
            />
          </div>
        </div>
        <div>
          <label className="label">Order Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="input max-w-xs appearance-none"
          >
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </section>

      {/* Add Products */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
        <h3 className="font-semibold text-zinc-100">Add Products</h3>
        <div className="flex gap-3">
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="input flex-1 appearance-none"
          >
            <option value="">Select a product…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — ${p.price}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addItem}
            disabled={!selectedProductId}
            className="btn btn-primary text-sm shrink-0"
          >
            + Add
          </button>
        </div>

        {/* Items list */}
        {items.length > 0 ? (
          <div className="space-y-3">
            {/* Header */}
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 px-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              <span>Product</span>
              <span className="w-20 text-center">Price</span>
              <span className="w-16 text-center">Qty</span>
              <span className="w-20 text-right">Subtotal</span>
              <span className="w-8" />
            </div>

            {items.map((item, i) => (
              <div
                key={item.productId}
                className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-3 rounded-xl border border-zinc-800/50 bg-zinc-800/20 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-200">{item.name}</p>
                  <p className="text-xs text-zinc-500">{item.productId}</p>
                </div>
                <div className="w-20">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => updatePrice(i, Number(e.target.value))}
                    className="input !py-1.5 !px-2 text-center text-sm"
                  />
                </div>
                <div className="w-16">
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => updateQty(i, Number(e.target.value))}
                    className="input !py-1.5 !px-2 text-center text-sm"
                  />
                </div>
                <div className="w-20 text-right">
                  <span className="text-sm font-semibold text-zinc-200">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="w-8 flex items-center justify-center text-zinc-500 hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Total */}
            <div className="flex items-center justify-end gap-6 border-t border-zinc-800 pt-4">
              <span className="text-sm text-zinc-400">
                {items.reduce((s, i) => s + i.qty, 0)} item{items.length !== 1 && "s"}
              </span>
              <span className="font-display text-2xl tracking-wide text-zinc-50">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-zinc-500">
            <p className="text-2xl mb-2">🛒</p>
            Select a product above and click Add.
          </div>
        )}
      </section>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || items.length === 0}
          className="btn btn-primary"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                <path d="M14 8A6 6 0 0 0 8 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Creating…
            </span>
          ) : (
            `Create Order — $${total.toFixed(2)}`
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-ghost"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
