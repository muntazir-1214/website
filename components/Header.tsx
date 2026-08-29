"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { CATEGORIES } from "@/lib/products";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=t-shirts", label: "T-Shirts" },
  { href: "/shop?category=trousers", label: "Trousers" },
  { href: "/shop?category=hoodies", label: "Hoodies" },
];

export default function Header() {
  const { count, openCart } = useCart();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const pathname = usePathname();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
    setSearchOpen(false);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          {/* Menu (hamburger) button */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 transition-all hover:border-lime-400/60 active:scale-90"
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <path d="M1 1.5H17M1 7H17M1 12.5H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="group flex items-center gap-1 font-display text-2xl tracking-widest">
            <span className="text-lime-400 transition-transform duration-300 group-hover:rotate-12">✦</span>
            DARKWEAR
          </Link>

          {/* Desktop nav */}
          <nav className="ml-8 hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-lime-300"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {/* Admin link */}
            <Link
              href="/admin"
              className="hidden md:flex h-10 items-center gap-1.5 rounded-full border border-zinc-800 px-3.5 text-xs font-semibold text-zinc-500 transition-all hover:border-lime-400/60 hover:text-lime-300 active:scale-95"
              title="Admin Portal"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              Admin
            </Link>
            {/* Search */}
            <div className="hidden md:block">
              <form onSubmit={submitSearch} role="search" className="relative">
                <svg
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  width="15" height="15" viewBox="0 0 15 15" fill="none"
                >
                  <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  name="q"
                  placeholder="Search products…"
                  className="input w-44 rounded-full py-2 pl-9 text-sm transition-all focus:w-56"
                />
              </form>
            </div>
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Toggle search"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 transition-all hover:border-lime-400/60 active:scale-90 md:hidden"
            >
              <svg width="16" height="16" viewBox="0 0 15 15" fill="none">
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            {/* Cart button */}
            <button
              onClick={openCart}
              aria-label="Open cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 transition-all hover:border-lime-400/60 active:scale-90"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M3 2.5h2l2 9h7.5l1.5-6H6.5"
                  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                />
                <circle cx="8" cy="15" r="1.3" fill="currentColor" />
                <circle cx="13.5" cy="15" r="1.3" fill="currentColor" />
              </svg>
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-lime-400 px-1 text-[10px] font-extrabold text-black animate-pop-in">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="border-t border-zinc-800/80 px-4 py-3 md:hidden animate-fade-in">
            <form onSubmit={submitSearch} role="search" className="flex gap-2">
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                name="q"
                placeholder="Search products…"
                className="input"
              />
              <button type="submit" className="btn btn-primary !px-5">Go</button>
            </form>
          </div>
        )}
      </header>

      {/* Full-screen menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-zinc-950/97 backdrop-blur-xl animate-fade-in">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
            <span className="font-display text-2xl tracking-widest">
              <span className="text-lime-400">✦</span> DARKWEAR
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 transition-all hover:border-lime-400/60 hover:rotate-90 active:scale-90"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="mx-auto grid w-full max-w-7xl flex-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1fr]">
            <div className="flex flex-col justify-center gap-2">
              {[
                { href: "/", label: "Home" },
                { href: "/shop", label: "Shop All" },
                { href: "/checkout", label: "Checkout" },
              ].map((l, i) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className={`font-display text-6xl leading-none tracking-wide text-zinc-200 transition-all duration-300 hover:text-lime-400 hover:translate-x-2 sm:text-7xl animate-fade-up ${
                    pathname === l.href ? "text-lime-400" : ""
                  }`}
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col justify-center gap-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                Categories
              </p>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((c, i) => (
                  <Link
                    key={c.id}
                    href={`/shop?category=${c.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl border border-zinc-800 px-4 py-3 text-sm font-semibold text-zinc-300 transition-all duration-300 hover:border-lime-400/60 hover:bg-lime-400/5 hover:text-lime-300 active:scale-95 animate-fade-up"
                    style={{ animationDelay: `${150 + i * 60}ms` }}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
              <p className="text-xs text-zinc-500 animate-fade-up" style={{ animationDelay: "550ms" }}>
                Free worldwide shipping on orders over $99.
              </p>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
