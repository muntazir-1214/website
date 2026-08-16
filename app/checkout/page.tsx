"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import ProductImage from "@/components/ProductImage";

type Step = "details" | "processing" | "done";

const PAYMENT_METHODS = [
  { id: "card", label: "Card", icon: "💳" },
  { id: "paypal", label: "PayPal", icon: "🅿️" },
  { id: "cod", label: "Cash on Delivery", icon: "💵" },
];

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [step, setStep] = useState<Step>("details");
  const [payment, setPayment] = useState("card");
  const [orderId, setOrderId] = useState("");
  const [placedItems, setPlacedItems] = useState(items);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "United States",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const required: (keyof typeof form)[] = ["name", "email", "address", "city", "zip"];
    const missing = required.filter((k) => !form[k].trim());
    if (missing.length > 0) {
      setError("Please fill in all required fields (name, email, address, city, zip).");
      return;
    }
    setError("");
    setPlacedItems(items);
    setStep("processing");
    // Simulate processing the payment
    window.setTimeout(() => {
      setOrderId(`DW-${Math.floor(100000 + Math.random() * 900000)}`);
      clear();
      setStep("done");
    }, 1800);
  };

  // ---------- Success screen ----------
  if (step === "done") {
    const total = placedItems.reduce((n, i) => n + i.qty * i.product.price, 0);
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center sm:px-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-lime-400 text-5xl font-bold text-black animate-pop-in">
          ✓
        </div>
        <h1 className="mt-8 font-display text-6xl tracking-wide text-zinc-50 animate-fade-up">
          ORDER PLACED!
        </h1>
        <p className="mt-3 text-zinc-400 animate-fade-up" style={{ animationDelay: "100ms" }}>
          Thanks, {form.name.split(" ")[0] || "friend"}! Your order{" "}
          <span className="font-bold text-lime-300">{orderId}</span> is confirmed
          and on its way to {form.address}.
        </p>
        <div className="mt-8 w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-left animate-fade-up" style={{ animationDelay: "200ms" }}>
          <p className="label">Order summary</p>
          <div className="space-y-3">
            {placedItems.map((it) => (
              <div key={`${it.product.id}-${it.size}-${it.color}`} className="flex items-center justify-between text-sm">
                <span className="text-zinc-300">
                  {it.product.name} <span className="text-zinc-500">× {it.qty}</span>
                </span>
                <span className="font-semibold text-zinc-100">
                  ${it.product.price * it.qty}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-4">
            <span className="font-semibold text-zinc-200">Total</span>
            <span className="text-xl font-extrabold text-lime-300">${total}</span>
          </div>
        </div>
        <div className="mt-8 flex gap-3 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <Link href="/shop" className="btn btn-primary">Continue Shopping</Link>
          <Link href="/" className="btn btn-ghost">Back to Home</Link>
        </div>
      </div>
    );
  }

  // ---------- Processing ----------
  if (step === "processing") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-32 text-center">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-zinc-800 border-t-lime-400" />
        </div>
        <h2 className="mt-8 font-display text-4xl tracking-widest text-zinc-100 animate-fade-up">
          PROCESSING…
        </h2>
        <p className="mt-2 text-sm text-zinc-500 animate-fade-up" style={{ animationDelay: "120ms" }}>
          Securing your payment and confirming your order.
        </p>
      </div>
    );
  }

  // ---------- Empty cart ----------
  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-32 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-900 text-5xl">🛒</div>
        <h1 className="mt-8 font-display text-5xl tracking-wide text-zinc-50">CART IS EMPTY</h1>
        <p className="mt-3 text-zinc-500">
          Add something to your cart before checking out.
        </p>
        <Link href="/shop" className="btn btn-primary mt-8">Start Shopping</Link>
      </div>
    );
  }

  // ---------- Checkout form ----------
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Steps */}
      <div className="mb-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
        <span className="text-lime-400">1 · Cart</span>
        <span className="h-px w-10 bg-zinc-700" />
        <span className="text-zinc-100">2 · Details</span>
        <span className="h-px w-10 bg-zinc-700" />
        <span className="text-zinc-600">3 · Done</span>
      </div>

      <h1 className="mb-10 font-display text-6xl tracking-wide text-zinc-50 sm:text-7xl">
        CHECKOUT
      </h1>

      <form onSubmit={placeOrder} className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          {/* Contact */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="mb-4 font-display text-2xl tracking-widest text-zinc-100">CONTACT</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="name">Full name *</label>
                <input id="name" className="input" placeholder="Jordan Lee" value={form.name} onChange={update("name")} />
              </div>
              <div>
                <label className="label" htmlFor="email">Email *</label>
                <input id="email" type="email" className="input" placeholder="you@email.com" value={form.email} onChange={update("email")} />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="phone">Phone</label>
                <input id="phone" className="input" placeholder="+1 555 000 1234" value={form.phone} onChange={update("phone")} />
              </div>
            </div>
          </section>

          {/* Shipping */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="mb-4 font-display text-2xl tracking-widest text-zinc-100">SHIPPING</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="address">Address *</label>
                <input id="address" className="input" placeholder="123 Street Ave" value={form.address} onChange={update("address")} />
              </div>
              <div>
                <label className="label" htmlFor="city">City *</label>
                <input id="city" className="input" placeholder="New York" value={form.city} onChange={update("city")} />
              </div>
              <div>
                <label className="label" htmlFor="zip">Zip code *</label>
                <input id="zip" className="input" placeholder="10001" value={form.zip} onChange={update("zip")} />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="country">Country</label>
                <select id="country" className="input cursor-pointer" value={form.country} onChange={update("country")}>
                  {["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Other"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="mb-4 font-display text-2xl tracking-widest text-zinc-100">PAYMENT</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {PAYMENT_METHODS.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setPayment(m.id)}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3.5 text-sm font-bold transition-all duration-200 active:scale-95 ${
                    payment === m.id
                      ? "border-lime-400 bg-lime-400/10 text-lime-300 shadow-[0_0_18px_rgba(163,230,53,0.2)]"
                      : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  <span>{m.icon}</span> {m.label}
                </button>
              ))}
            </div>
            {payment === "card" && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 animate-fade-in">
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="card">Card number</label>
                  <input id="card" className="input" placeholder="4242 4242 4242 4242" />
                </div>
                <div>
                  <label className="label" htmlFor="exp">Expiry</label>
                  <input id="exp" className="input" placeholder="MM/YY" />
                </div>
                <div>
                  <label className="label" htmlFor="cvc">CVC</label>
                  <input id="cvc" className="input" placeholder="123" />
                </div>
              </div>
            )}
          </section>

          {error && (
            <p className="rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-400 animate-shake">
              {error}
            </p>
          )}
        </div>

        {/* Order summary */}
        <aside className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 lg:sticky lg:top-24">
          <h2 className="mb-4 font-display text-2xl tracking-widest text-zinc-100">
            YOUR ORDER
          </h2>
          <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
            {items.map((it) => (
              <div key={`${it.product.id}-${it.size}-${it.color}`} className="flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-zinc-900">
                  <ProductImage category={it.product.category} color={it.product.colors[0].hex} className="w-10" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-200">{it.product.name}</p>
                  <p className="text-xs text-zinc-500">{it.size} · {it.color} · ×{it.qty}</p>
                </div>
                <span className="text-sm font-bold text-zinc-100">${it.product.price * it.qty}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2 border-t border-zinc-800 pt-4 text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Shipping</span>
              <span className="text-lime-300 font-semibold">{subtotal >= 99 ? "FREE" : "$8"}</span>
            </div>
            <div className="flex justify-between pt-2 text-base font-extrabold text-zinc-50">
              <span>Total</span>
              <span>${subtotal + (subtotal >= 99 ? 0 : 8)}</span>
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-6 w-full">
            Place Order — ${subtotal + (subtotal >= 99 ? 0 : 8)}
          </button>
          <p className="mt-3 text-center text-xs text-zinc-500">
            🔒 256-bit SSL encrypted · 30-day returns
          </p>
        </aside>
      </form>
    </div>
  );
}
