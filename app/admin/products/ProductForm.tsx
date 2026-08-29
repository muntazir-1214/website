"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, Category } from "@/lib/products";
import ImageUpload from "@/components/admin/ImageUpload";

const CATEGORY_OPTIONS: { id: Category; label: string }[] = [
  { id: "shirts", label: "Shirts" },
  { id: "t-shirts", label: "T-Shirts" },
  { id: "trousers", label: "Trousers" },
  { id: "shorts", label: "Shorts" },
  { id: "hoodies", label: "Hoodies" },
  { id: "jackets", label: "Jackets" },
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

type FormData = {
  id: string;
  name: string;
  category: Category;
  price: string;
  oldPrice: string;
  rating: string;
  reviews: string;
  description: string;
  details: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  badge: "" | "NEW" | "SALE" | "HOT";
  featured: boolean;
  image: string;
  gallery: string[];
};

function toFormData(product?: Product): FormData {
  if (!product) {
    return {
      id: "",
      name: "",
      category: "t-shirts",
      price: "",
      oldPrice: "",
      rating: "4.5",
      reviews: "0",
      description: "",
      details: "",
      colors: [{ name: "Black", hex: "#18181b" }],
      sizes: ["S", "M", "L", "XL"],
      badge: "",
      featured: false,
      image: "",
      gallery: [],
    };
  }
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: String(product.price),
    oldPrice: product.oldPrice ? String(product.oldPrice) : "",
    rating: String(product.rating),
    reviews: String(product.reviews),
    description: product.description,
    details: product.details.join("\n"),
    colors: product.colors,
    sizes: product.sizes,
    badge: product.badge ?? "",
    featured: product.featured ?? false,
    image: product.image ?? "",
    gallery: product.gallery ?? [],
  };
}

function toProduct(data: FormData): Product {
  return {
    id: data.id,
    name: data.name,
    category: data.category,
    price: Number(data.price) || 0,
    ...(data.oldPrice ? { oldPrice: Number(data.oldPrice) } : {}),
    rating: Number(data.rating) || 0,
    reviews: Number(data.reviews) || 0,
    description: data.description,
    details: data.details
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean),
    colors: data.colors,
    sizes: data.sizes,
    ...(data.badge ? { badge: data.badge as Product["badge"] } : {}),
    ...(data.featured ? { featured: true } : {}),
    ...(data.image ? { image: data.image } : {}),
    ...(data.gallery.length > 0 ? { gallery: data.gallery } : {}),
  };
}

export default function ProductForm({
  product,
  mode = "create",
}: {
  product?: Product;
  mode?: "create" | "edit";
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(toFormData(product));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key: keyof FormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const addColor = () => {
    setForm((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: "", hex: "#000000" }],
    }));
  };

  const updateColor = (
    index: number,
    key: "name" | "hex",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.map((c, i) =>
        i === index ? { ...c, [key]: value } : c
      ),
    }));
  };

  const removeColor = (index: number) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.id.trim()) {
      setError("Product ID is required.");
      return;
    }
    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      setError("Valid price is required.");
      return;
    }

    setLoading(true);

    try {
      const productData = toProduct(form);
      const url =
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${form.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
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

      {/* Image Upload */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
        <h3 className="font-semibold text-zinc-100">Product Image</h3>
        <ImageUpload
          value={form.image || undefined}
          onChange={(path) => set("image", path ?? "")}
          label="Main product image"
        />
      </section>

      {/* Basic Info */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
        <h3 className="font-semibold text-zinc-100">Basic Information</h3>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label">Product ID *</label>
            <input
              value={form.id}
              onChange={(e) => set("id", e.target.value)}
              placeholder="e.g. onyx-oversized-tee"
              disabled={mode === "edit"}
              className={`input ${mode === "edit" ? "opacity-60" : ""}`}
            />
            {mode === "create" && (
              <p className="mt-1 text-xs text-zinc-600">
                Use kebab-case. This is the URL slug.
              </p>
            )}
          </div>
          <div>
            <label className="label">Product Name *</label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Onyx Oversized Tee"
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            placeholder="Product description..."
            className="input resize-none"
          />
        </div>

        <div>
          <label className="label">Details (one per line)</label>
          <textarea
            value={form.details}
            onChange={(e) => set("details", e.target.value)}
            rows={3}
            placeholder={"240gsm heavyweight cotton\nOversized boxy silhouette\nPre-shrunk, enzyme washed"}
            className="input resize-none"
          />
        </div>
      </section>

      {/* Pricing */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
        <h3 className="font-semibold text-zinc-100">Pricing & Rating</h3>
        <div className="grid gap-5 sm:grid-cols-4">
          <div>
            <label className="label">Price *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="39"
              className="input"
            />
          </div>
          <div>
            <label className="label">Old Price (optional)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.oldPrice}
              onChange={(e) => set("oldPrice", e.target.value)}
              placeholder="49"
              className="input"
            />
          </div>
          <div>
            <label className="label">Rating</label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={(e) => set("rating", e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="label">Reviews</label>
            <input
              type="number"
              min="0"
              value={form.reviews}
              onChange={(e) => set("reviews", e.target.value)}
              className="input"
            />
          </div>
        </div>
      </section>

      {/* Category & Badge */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
        <h3 className="font-semibold text-zinc-100">Category & Badge</h3>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="label">Category *</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="input appearance-none"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Badge</label>
            <select
              value={form.badge}
              onChange={(e) => set("badge", e.target.value)}
              className="input appearance-none"
            >
              <option value="">None</option>
              <option value="NEW">NEW</option>
              <option value="SALE">SALE</option>
              <option value="HOT">HOT</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer rounded-xl border border-zinc-700 px-4 py-3 transition-all hover:border-lime-400/50 w-full">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="h-4 w-4 rounded accent-lime-400"
              />
              <span className="text-sm text-zinc-300">Featured product</span>
            </label>
          </div>
        </div>
      </section>

      {/* Colors */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-zinc-100">Colors</h3>
          <button
            type="button"
            onClick={addColor}
            className="text-xs font-medium text-lime-400 hover:text-lime-300"
          >
            + Add color
          </button>
        </div>
        <div className="space-y-3">
          {form.colors.map((color, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="color"
                value={color.hex}
                onChange={(e) => updateColor(i, "hex", e.target.value)}
                className="h-10 w-10 cursor-pointer rounded-lg border border-zinc-700 bg-transparent"
              />
              <input
                value={color.name}
                onChange={(e) => updateColor(i, "name", e.target.value)}
                placeholder="Color name"
                className="input flex-1"
              />
              <span className="text-xs text-zinc-500 font-mono">
                {color.hex}
              </span>
              {form.colors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeColor(i)}
                  className="text-zinc-500 hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Sizes */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
        <h3 className="font-semibold text-zinc-100">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                form.sizes.includes(size)
                  ? "border-lime-400/60 bg-lime-400/10 text-lime-300"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                <path d="M14 8A6 6 0 0 0 8 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Saving…
            </span>
          ) : mode === "create" ? (
            "Create Product →"
          ) : (
            "Save Changes →"
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
