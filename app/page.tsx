import Link from "next/link";
import { products } from "@/lib/products";
import { getContent } from "@/lib/adminStore";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import ProductImage from "@/components/ProductImage";
import Marquee from "@/components/Marquee";
import EditHero from "@/components/EditHero";

const featured = products.filter((p) => p.featured).slice(0, 8);

const CATEGORY_LIST = [
  { id: "shirts" as const, label: "Shirts" },
  { id: "t-shirts" as const, label: "T-Shirts" },
  { id: "trousers" as const, label: "Trousers" },
  { id: "shorts" as const, label: "Shorts" },
  { id: "hoodies" as const, label: "Hoodies" },
  { id: "jackets" as const, label: "Jackets" },
];

export default async function Home() {
  const content = await getContent();

  return (
    <>
      {/* ---------- Hero (client-side inline edit) ---------- */}
      <EditHero content={content} />

      {/* ---------- Marquee ---------- */}
      <Marquee words={content.marqueeWords.split(",")} />

      {/* ---------- Categories ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-lime-400">{content.sectionSubtitle1}</p>
              <h2 className="font-display text-5xl tracking-wide text-zinc-50 sm:text-6xl">
                {content.sectionTitle1}
              </h2>
            </div>
            <Link href="/shop" className="btn btn-ghost hidden sm:inline-flex">
              View All
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORY_LIST.map((c, i) => {
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
                        image={sample.image}
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
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-lime-400">{content.sectionSubtitle2}</p>
              <h2 className="font-display text-5xl tracking-wide text-zinc-50 sm:text-6xl">
                {content.sectionTitle2}
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
    </>
  );
}
