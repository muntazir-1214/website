"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import Hero3DSection from "@/components/Hero3DSection";

type Content = Record<string, string>;

function InlineField({
  value,
  field,
  content,
  onSaved,
  className = "",
  tag: Tag = "span",
  rows,
}: {
  value: string;
  field: string;
  content: React.MutableRefObject<Content>;
  onSaved: () => void;
  className?: string;
  tag?: "span" | "p" | "h1" | "h2" | "h3";
  rows?: number;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = useCallback(async () => {
    if (draft === value) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      const updated = { ...content.current, [field]: draft };
      content.current = updated;
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setSaved(true);
        onSaved();
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      // silent
    } finally {
      setSaving(false);
      setEditing(false);
    }
  }, [draft, value, field, content, onSaved]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      save();
    }
    if (e.key === "Escape") {
      setDraft(value);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <span className="relative inline-block">
        {rows ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={save}
            onKeyDown={handleKeyDown}
            autoFocus
            rows={rows}
            className={`bg-transparent border-b-2 border-lime-400 outline-none resize-none ${className}`}
          />
        ) : (
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={save}
            onKeyDown={handleKeyDown}
            autoFocus
            className={`bg-transparent border-b-2 border-lime-400 outline-none ${className}`}
            style={{ width: `${Math.max(draft.length, 4)}ch` }}
          />
        )}
        <span className="absolute -top-5 right-0 text-[9px] text-lime-400 whitespace-nowrap">
          {saving ? "Saving…" : "Enter save · Esc cancel"}
        </span>
      </span>
    );
  }

  return (
    <Tag
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      className={`${className} cursor-pointer transition-all hover:outline hover:outline-1 hover:outline-dashed hover:outline-lime-400/50 relative group inline-block`}
      title="Click to edit"
    >
      {value}
      <span className="absolute -top-4 right-0 text-[9px] text-lime-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        ✎ edit
      </span>
      {saved && (
        <span className="absolute -top-4 right-0 text-[9px] text-green-400 animate-fade-in whitespace-nowrap pointer-events-none">
          ✓ saved
        </span>
      )}
    </Tag>
  );
}

export default function EditHero({ content: initialContent }: { content: Content }) {
  const contentRef = useRef(initialContent);
  const [, forceUpdate] = useState(0);
  const [, setVersion] = useState(0);

  const onSaved = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  const c = contentRef.current;
  const promoLines = c.promoTitle?.split("\n") ?? ["SUMMER DROP", "UP TO 40% OFF"];

  return (
    <>
      {/* HERO — read-only */}
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
              {c.heroTagline}
            </span>
            <h1 className="font-display text-7xl leading-[0.9] tracking-wide text-zinc-50 sm:text-8xl lg:text-9xl animate-fade-up" style={{ animationDelay: "80ms" }}>
              {c.heroTitle1}
              <br />
              <span className="text-gradient">
                {c.heroTitle2}
              </span>
            </h1>
            <p className="max-w-md text-lg leading-8 text-zinc-400 animate-fade-up" style={{ animationDelay: "160ms" }}>
              {c.heroDescription}
            </p>
            <div className="flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "240ms" }}>
              <Link href="/shop" className="btn btn-primary">
                {c.heroCTA1}
              </Link>
              <Link href="/shop?category=t-shirts" className="btn btn-ghost">
                {c.heroCTA2}
              </Link>
            </div>
            <div className="flex gap-8 pt-2 animate-fade-up" style={{ animationDelay: "320ms" }}>
              {[
                { val: c.heroStat1Value, lbl: c.heroStat1Label },
                { val: c.heroStat2Value, lbl: c.heroStat2Label },
                { val: c.heroStat3Value, lbl: c.heroStat3Label },
              ].map((s, i) => (
                <div key={i}>
                  <p className="font-display text-3xl text-lime-400">
                    {s.val}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-zinc-500">
                    {s.lbl}
                  </p>
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

      {/* Promo banner — still editable */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-lime-400/30 bg-linear-to-r from-lime-400/15 via-lime-400/5 to-transparent px-8 py-16 sm:px-14">
          <div className="bg-grid absolute inset-0 opacity-60" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-lime-400/20 blur-3xl animate-pulse-glow" />
          <div className="relative space-y-5">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-lime-300">
              Limited time
            </p>
            <h2 className="max-w-xl font-display text-6xl leading-[0.9] tracking-wide text-zinc-50 sm:text-7xl">
              <InlineField value={promoLines[0]} field="promoTitle" content={contentRef} onSaved={onSaved} tag="span" />
              {promoLines[1] && (
                <>
                  <br />
                  <span className="text-gradient">
                    <InlineField value={promoLines[1]} field="promoTitle_line2" content={contentRef} onSaved={onSaved} tag="span" />
                  </span>
                </>
              )}
            </h2>
            <p className="max-w-md text-zinc-400">
              <InlineField value={c.promoDescription} field="promoDescription" content={contentRef} onSaved={onSaved} tag="span" rows={2} />
            </p>
            <Link href="/shop" className="btn btn-primary">
              <InlineField value={c.promoCTA} field="promoCTA" content={contentRef} onSaved={onSaved} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
