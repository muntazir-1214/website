"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/products";

type FooterContent = {
  footerTagline: string;
  footerDescription: string;
  newsletterTitle: string;
  newsletterDescription: string;
};

export default function Footer({ content }: { content: FooterContent }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  };

  return (
    <footer className="mt-24 border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="font-display text-3xl tracking-widest">
            <span className="text-lime-400">✦</span> {content.footerTagline}
          </Link>
          <p className="max-w-xs text-sm leading-6 text-zinc-500">
            {content.footerDescription}
          </p>
        </div>

        <div>
          <p className="label">Shop</p>
          <ul className="space-y-2.5">
            <li>
              <Link href="/shop" className="text-sm text-zinc-400 transition-colors hover:text-lime-300">
                Shop All
              </Link>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/shop?category=${c.id}`}
                  className="text-sm text-zinc-400 transition-colors hover:text-lime-300"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label">Support</p>
          <ul className="space-y-2.5 text-sm text-zinc-400">
            <li className="transition-colors hover:text-lime-300 cursor-pointer">Shipping & Returns</li>
            <li className="transition-colors hover:text-lime-300 cursor-pointer">Size Guide</li>
            <li className="transition-colors hover:text-lime-300 cursor-pointer">Track Order</li>
            <li className="transition-colors hover:text-lime-300 cursor-pointer">Contact Us</li>
          </ul>
        </div>

        <div>
          <p className="label">{content.newsletterTitle}</p>
          <p className="mb-3 text-sm text-zinc-500">
            {content.newsletterDescription}
          </p>
          {done ? (
            <p className="rounded-xl border border-lime-400/40 bg-lime-400/10 px-4 py-3 text-sm font-semibold text-lime-300 animate-pop-in">
              ✓ You&apos;re on the list!
            </p>
          ) : (
            <form onSubmit={subscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="input"
              />
              <button type="submit" className="btn btn-primary !px-5">
                →
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="border-t border-zinc-800/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-zinc-600 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} {content.footerTagline}. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span className="cursor-pointer transition-colors hover:text-lime-300">Instagram</span>
            <span className="cursor-pointer transition-colors hover:text-lime-300">TikTok</span>
            <span className="cursor-pointer transition-colors hover:text-lime-300">X</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
