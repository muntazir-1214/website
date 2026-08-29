"use client";

import { useState } from "react";

const DEFAULT_SETTINGS = {
  storeName: "DARKWEAR",
  tagline: "Streetwear for the ones who move different.",
  email: "hello@darkwear.com",
  shippingThreshold: "99",
  currency: "USD",
  socialInstagram: "",
  socialTiktok: "",
  socialX: "",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof typeof settings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to a database/file
    // For now, we just show a success message
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-wide text-zinc-50">
          SETTINGS
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your store configuration and preferences.
        </p>
      </div>

      {saved && (
        <div className="rounded-xl border border-lime-400/30 bg-lime-400/10 px-4 py-3 text-sm text-lime-300 animate-fade-in">
          ✓ Settings saved successfully! (Demo mode — changes are not persisted)
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Info */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
          <h3 className="font-semibold text-zinc-100">Store Information</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label">Store Name</label>
              <input
                value={settings.storeName}
                onChange={(e) => set("storeName", e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label">Tagline</label>
              <input
                value={settings.tagline}
                onChange={(e) => set("tagline", e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label">Contact Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => set("email", e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => set("currency", e.target.value)}
                className="input appearance-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Shipping */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
          <h3 className="font-semibold text-zinc-100">Shipping</h3>
          <div>
            <label className="label">Free shipping threshold ($)</label>
            <input
              type="number"
              min="0"
              value={settings.shippingThreshold}
              onChange={(e) => set("shippingThreshold", e.target.value)}
              className="input max-w-xs"
            />
            <p className="mt-1 text-xs text-zinc-600">
              Orders above this amount get free shipping.
            </p>
          </div>
        </section>

        {/* Social */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
          <h3 className="font-semibold text-zinc-100">Social Links</h3>
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="label">Instagram</label>
              <input
                value={settings.socialInstagram}
                onChange={(e) => set("socialInstagram", e.target.value)}
                placeholder="https://instagram.com/..."
                className="input"
              />
            </div>
            <div>
              <label className="label">TikTok</label>
              <input
                value={settings.socialTiktok}
                onChange={(e) => set("socialTiktok", e.target.value)}
                placeholder="https://tiktok.com/@..."
                className="input"
              />
            </div>
            <div>
              <label className="label">X (Twitter)</label>
              <input
                value={settings.socialX}
                onChange={(e) => set("socialX", e.target.value)}
                placeholder="https://x.com/..."
                className="input"
              />
            </div>
          </div>
        </section>

        <div>
          <button type="submit" className="btn btn-primary">
            Save Settings →
          </button>
        </div>
      </form>
    </div>
  );
}
