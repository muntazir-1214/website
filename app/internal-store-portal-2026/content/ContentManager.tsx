"use client";

import { useCallback, useEffect, useState } from "react";

type SiteContent = Record<string, string>;

type FieldGroup = {
  title: string;
  icon: string;
  fields: { key: string; label: string; type?: "input" | "textarea" }[];
};

const FIELD_GROUPS: FieldGroup[] = [
  {
    title: "Hero Section",
    icon: "🎯",
    fields: [
      { key: "heroTagline", label: "Tagline" },
      { key: "heroTitle1", label: "Title Line 1" },
      { key: "heroTitle2", label: "Title Line 2 (Accent)" },
      { key: "heroDescription", label: "Description", type: "textarea" },
      { key: "heroCTA1", label: "Primary Button" },
      { key: "heroCTA2", label: "Secondary Button" },
    ],
  },
  {
    title: "Hero Stats",
    icon: "📊",
    fields: [
      { key: "heroStat1Value", label: "Stat 1 Value" },
      { key: "heroStat1Label", label: "Stat 1 Label" },
      { key: "heroStat2Value", label: "Stat 2 Value" },
      { key: "heroStat2Label", label: "Stat 2 Label" },
      { key: "heroStat3Value", label: "Stat 3 Value" },
      { key: "heroStat3Label", label: "Stat 3 Label" },
    ],
  },
  {
    title: "Marquee Banner",
    icon: "📰",
    fields: [
      { key: "marqueeWords", label: "Scrolling Words (comma-separated)", type: "textarea" },
    ],
  },
  {
    title: "Section Headings",
    icon: "📝",
    fields: [
      { key: "sectionSubtitle1", label: "Category Section Subtitle" },
      { key: "sectionTitle1", label: "Category Section Title" },
      { key: "sectionSubtitle2", label: "Featured Section Subtitle" },
      { key: "sectionTitle2", label: "Featured Section Title" },
    ],
  },
  {
    title: "Promo Banner",
    icon: "🏷️",
    fields: [
      { key: "promoTitle", label: "Promo Title", type: "textarea" },
      { key: "promoDescription", label: "Promo Description", type: "textarea" },
      { key: "promoCTA", label: "Promo Button" },
    ],
  },
  {
    title: "Footer",
    icon: "📎",
    fields: [
      { key: "footerTagline", label: "Footer Brand Name" },
      { key: "footerDescription", label: "Footer Description", type: "textarea" },
    ],
  },
  {
    title: "Newsletter",
    icon: "✉️",
    fields: [
      { key: "newsletterTitle", label: "Newsletter Title" },
      { key: "newsletterDescription", label: "Newsletter Description", type: "textarea" },
    ],
  },
];

export default function ContentManager() {
  const [content, setContent] = useState<SiteContent>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeGroup, setActiveGroup] = useState(0);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const setField = useCallback((key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    setSuccess("");
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        setSuccess("Content saved! Changes are live on the storefront.");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Save failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }, [content]);

  const resetField = useCallback(
    (key: string) => {
      // Reset to default
      const defaults: Record<string, string> = {
        heroTagline: "New Season Drop — 2026",
        heroTitle1: "WEAR THE",
        heroTitle2: "FUTURE",
        heroDescription: "Heavyweight streetwear built to move with you. Shirts, tees, trousers, hoodies and jackets — dropped weekly, gone fast.",
        heroCTA1: "Shop Now →",
        heroCTA2: "Explore Collection",
        heroStat1Value: "120+",
        heroStat1Label: "Styles",
        heroStat2Value: "24h",
        heroStat2Label: "Dispatch",
        heroStat3Value: "4.9★",
        heroStat3Label: "Rated",
        marqueeWords: "New Drop,Free Worldwide Shipping,Streetwear Culture,Limited Edition,Summer Sale 40% Off,100% Heavyweight Cotton",
        sectionTitle1: "SHOP BY CATEGORY",
        sectionSubtitle1: "Browse",
        sectionTitle2: "FEATURED DROPS",
        sectionSubtitle2: "Handpicked",
        promoTitle: "SUMMER DROP\nUP TO 40% OFF",
        promoDescription: "Clearance on last season's favorites. When it's gone, it's gone.",
        promoCTA: "Shop the Sale →",
        footerTagline: "DARKWEAR",
        footerDescription: "Streetwear for the ones who move different. Heavyweight fabrics, limited drops, worldwide shipping.",
        newsletterTitle: "Join the list",
        newsletterDescription: "Early access to drops and 10% off your first order.",
      };
      if (defaults[key]) {
        setField(key, defaults[key]);
      }
    },
    [setField]
  );

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/60">
        <p className="text-sm text-zinc-500">Loading content…</p>
      </div>
    );
  }

  const group = FIELD_GROUPS[activeGroup];

  return (
    <div className="space-y-4">
      {/* Status bar */}
      <div className="flex items-center gap-3">
        {error && (
          <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm text-red-400 animate-fade-in">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl border border-lime-400/30 bg-lime-400/10 px-4 py-2 text-sm text-lime-300 animate-fade-in">
            ✓ {success}
          </div>
        )}
        <div className="ml-auto">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary text-sm"
          >
            {saving ? "Saving…" : "Save All Changes →"}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-56 shrink-0 space-y-1">
          {FIELD_GROUPS.map((g, i) => (
            <button
              key={g.title}
              onClick={() => setActiveGroup(i)}
              className={`flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all ${
                activeGroup === i
                  ? "bg-lime-400/10 text-lime-300"
                  : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-300"
              }`}
            >
              <span>{g.icon}</span>
              {g.title}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
          <h3 className="flex items-center gap-2 font-semibold text-zinc-100">
            <span>{group.icon}</span>
            {group.title}
          </h3>

          {group.fields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="label">{field.label}</label>
                <button
                  onClick={() => resetField(field.key)}
                  className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  Reset to default
                </button>
              </div>
              {field.type === "textarea" ? (
                <textarea
                  value={content[field.key] ?? ""}
                  onChange={(e) => setField(field.key, e.target.value)}
                  rows={3}
                  className="input resize-none"
                />
              ) : (
                <input
                  value={content[field.key] ?? ""}
                  onChange={(e) => setField(field.key, e.target.value)}
                  className="input"
                />
              )}
              <p className="text-[10px] text-zinc-600 font-mono">{field.key}</p>
            </div>
          ))}

          <div className="pt-4 border-t border-zinc-800">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary text-sm"
            >
              {saving ? "Saving…" : "Save Changes →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
