import Link from "next/link";
import { CATEGORIES, products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import ProductImage from "@/components/ProductImage";
import Hero3DSection from "@/components/Hero3DSection";

const MARQUEE_WORDS = [
  "New Drop",
  "Free Worldwide Shipping",
  "Streetwear Culture",
  "Limited Edition",
  "Summer Sale 40% Off",
  "100% Heavyweight Cotton",
];

const featured = products.filter((p) => p.featured).slice(0, 8);

export default function Home() {
  return (
    <>
      {/* ---------- HERO with 3D shirt ---------- */}
      <section className="relative overflow-hidden bg-grid">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 70% 40%, rgba(163,230,53,0.14), transparent 60%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(163,230,53,0.07), transparent 60%)",
          }}
        />
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-4 lg:py-24">
          <div className="relative z-10 space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-lime-400/40 bg-lime-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-lime-300 animate-fade-up">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse-glow" />
              New Season Drop — 2026
            </span>
            <h1 className="font-display text-7xl leading-[0.9] tracking-wide text-zinc-50 sm:text-8xl lg:text-9xl animate-fade-up" style={{ animationDelay: "80ms" }}>
              WEAR THE
              <br />
              <span className="text-gradient">FUTURE</span>
            </h1>
            <p className="max-w-md text-lg leading-8 text-zinc-400 animate-fade-up" style={{ animationDelay: "160ms" }}>
              Heavyweight streetwear built to move with you. Shirts, tees,
              trousers, hoodies and jackets — dropped weekly, gone fast.
            </p>
            <div className="flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "240ms" }}>
              <Link href="/shop" className="btn btn-primary">
                Shop Now →
              </Link>
              <Link href="/shop?category=t-shirts" className="btn btn-ghost">
                Explore Collection
              </Link>
            </div>
            <div className="flex gap-8 pt-2 animate-fade-up" style={{ animationDelay: "320ms" }}>
              {[
                ["120+", "Styles"],
                ["24h", "Dispatch"],
                ["4.9★", "Rated"],
              ].map(([n, l]) => (
                <div key={l}>
                  <p className="font-display text-3xl text-lime-400">{n}</p>
                  <p className="text-xs uppercase tracking-widest text-zinc-500">{l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400/15 blur-3xl animate-pulse-glow" />
            <Hero3DSection />
            <span className="absolute right-4 top-8 rounded-full border border-zinc-700 bg-zinc-900/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-zinc-300 backdrop-blur animate-floaty">
              ⬭ 360° — drag it
            </span>
            <span className="absolute bottom-10 left-4 rounded-full border border-lime-400/40 bg-zinc-900/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-lime-300 backdrop-blur animate-floaty" style={{ animationDelay: "1.2s" }}>
              Free shipping $99+
            </span>
          </div>
        </div>
      </section>

      {/* ---------- Marquee ---------- */}
      <div className="overflow-hidden border-y border-zinc-800 bg-zinc-900/50 py-4">
        <div className="marquee-track flex w-max gap-10">
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((w, i) => (
            <span
              key={i}
              className={`flex items-center gap-10 whitespace-nowrap font-display text-2xl tracking-widest ${
                i % 2 === 0 ? "text-zinc-300" : "text-lime-400"
              }`}
            >
              {w} <span className="text-zinc-700">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ---------- Categories ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-lime-400">Browse</p>
              <h2 className="font-display text-5xl tracking-wide text-zinc-50 sm:text-6xl">
                SHOP BY CATEGORY
              </h2>
            </div>
            <Link href="/shop" className="btn btn-ghost hidden sm:inline-flex">
              View All
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c, i) => {
            const count = products.filter((p) => p.category === c.id).length;
            const sample = products.find((p) => p.category === c.id);
            return (
              <Reveal key={c.id} delay={i * 70}>
                <Link
                  href={`/shop?category=${c.id}`}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-lime-400/50 hover:shadow-[0_18px_45px_-20px_rgba(163,230,53,0.3)] active:scale-95"
                >
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-b from-zinc-800 to-zinc-900 transition-transform duration-500 group-hover:scale-110">
                    {sample && (
                      <ProductImage
                        category={c.id}
                        color={sample.colors[0].hex}
                        className="w-16"
                      />
                    )}
                  </div>
                  <p className="font-semibold text-zinc-200 transition-colors group-hover:text-lime-300">
                    {c.label}
                  </p>
                  <p className="text-xs text-zinc-500">{count} items</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ---------- Featured products (4 per row) ---------- */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <Reveal>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-lime-400">Handpicked</p>
              <h2 className="font-display text-5xl tracking-wide text-zinc-50 sm:text-6xl">
                FEATURED DROPS
              </h2>
            </div>
            <Link href="/shop" className="btn btn-ghost hidden sm:inline-flex">
              Shop All →
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} delay={(i % 4) * 80} />
          ))}
        </div>
      </section>

      {/* ---------- Promo banner ---------- */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-lime-400/30 bg-linear-to-r from-lime-400/15 via-lime-400/5 to-transparent px-8 py-16 sm:px-14">
            <div className="bg-grid absolute inset-0 opacity-60" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-lime-400/20 blur-3xl animate-pulse-glow" />
            <div className="relative space-y-5">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-lime-300">
                Limited time
              </p>
              <h2 className="max-w-xl font-display text-6xl leading-[0.9] tracking-wide text-zinc-50 sm:text-7xl">
                SUMMER DROP
                <br />
                <span className="text-gradient">UP TO 40% OFF</span>
              </h2>
              <p className="max-w-md text-zinc-400">
                Clearance on last season&apos;s favorites. When it&apos;s gone,
                it&apos;s gone.
              </p>
              <Link href="/shop" className="btn btn-primary">
                Shop the Sale →
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
