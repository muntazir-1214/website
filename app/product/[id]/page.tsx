import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryLabel, products } from "@/lib/products";
import ProductImage from "@/components/ProductImage";
import ProductActions from "@/components/ProductActions";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Product — DARKWEAR",
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="transition-colors hover:text-lime-300">Home</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`} className="transition-colors hover:text-lime-300">
            {categoryLabel(product.category)}
          </Link>
          <span>/</span>
          <span className="text-zinc-300">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Image */}
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-linear-to-b from-zinc-800/50 to-zinc-900 p-10">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${product.colors[0].hex}22, transparent 65%)`,
                }}
              />
              {product.badge && (
                <span className="absolute left-5 top-5 z-10 rounded-full bg-lime-400 px-3 py-1 text-[11px] font-extrabold tracking-widest text-black">
                  {product.badge}
                </span>
              )}
              <ProductImage
                category={product.category}
                color={product.colors[0].hex}
                className="mx-auto w-full max-w-md drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)] animate-floaty"
              />
            </div>
          </Reveal>

          {/* Info */}
          <Reveal delay={120}>
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-lime-400">
                  {categoryLabel(product.category)}
                </p>
                <h1 className="mt-2 font-display text-5xl leading-none tracking-wide text-zinc-50 sm:text-6xl">
                  {product.name}
                </h1>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-sm font-semibold text-lime-300">
                    ★ {product.rating}
                  </span>
                  <span className="text-sm text-zinc-500">
                    ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-zinc-50">
                  ${product.price}
                </span>
                {product.oldPrice && (
                  <>
                    <span className="text-xl text-zinc-500 line-through">
                      ${product.oldPrice}
                    </span>
                    <span className="rounded-full bg-red-400/15 px-2.5 py-1 text-xs font-bold text-red-400">
                      Save ${product.oldPrice - product.price}
                    </span>
                  </>
                )}
              </div>

              <p className="leading-7 text-zinc-400">{product.description}</p>

              <ProductActions product={product} />

              {/* Details */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
                <p className="label">Details</p>
                <ul className="space-y-2">
                  {product.details.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm text-zinc-400">
                      <span className="mt-0.5 text-lime-400">✦</span> {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24">
            <Reveal>
              <h2 className="mb-8 font-display text-4xl tracking-wide text-zinc-50 sm:text-5xl">
                MORE {categoryLabel(product.category).toUpperCase()}
              </h2>
            </Reveal>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={(i % 4) * 80} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
