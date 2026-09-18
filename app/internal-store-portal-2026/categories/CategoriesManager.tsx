"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

type CategoryEntry = {
  id: string;
  label: string;
  slug: string;
  description: string;
  sortOrder: number;
  visible: boolean;
};

export default function CategoriesManager() {
  const [categories, setCategories] = useState<CategoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Add form
  const [newId, setNewId] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const save = useCallback(
    async (next: CategoryEntry[]) => {
      setSaving(true);
      setError("");
      try {
        const res = await fetch("/api/admin/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categories: next }),
        });
        if (res.ok) {
          setCategories(next);
          setSuccess("Saved!");
          setTimeout(() => setSuccess(""), 2000);
        } else {
          const data = await res.json();
          setError(data.error || "Save failed");
        }
      } catch {
        setError("Network error");
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const addCategory = useCallback(async () => {
    if (!newId.trim() || !newLabel.trim()) {
      setError("ID and Label are required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newId.trim(),
          label: newLabel.trim(),
          description: newDesc.trim(),
          sortOrder: categories.length,
          visible: true,
        }),
      });
      if (res.ok) {
        const cat = await res.json();
        setCategories((prev) => [...prev, cat]);
        setNewId("");
        setNewLabel("");
        setNewDesc("");
        setShowAdd(false);
        setSuccess("Category added!");
        setTimeout(() => setSuccess(""), 2000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to add");
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }, [newId, newLabel, newDesc, categories.length]);

  const deleteCategory = useCallback(
    async (id: string) => {
      if (!confirm(`Delete category "${id}"? Products in this category won't be deleted.`)) return;
      setSaving(true);
      try {
        const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
        if (res.ok) {
          setCategories((prev) => prev.filter((c) => c.id !== id));
          setSuccess("Category deleted");
          setTimeout(() => setSuccess(""), 2000);
        } else {
          const data = await res.json();
          setError(data.error || "Failed to delete");
        }
      } catch {
        setError("Network error");
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const toggleVisible = useCallback(
    (id: string) => {
      const next = categories.map((c) =>
        c.id === id ? { ...c, visible: !c.visible } : c
      );
      save(next);
    },
    [categories, save]
  );

  const moveUp = useCallback(
    (idx: number) => {
      if (idx === 0) return;
      const next = [...categories];
      const temp = next[idx];
      next[idx] = next[idx - 1];
      next[idx - 1] = temp;
      // Update sortOrder
      next.forEach((c, i) => (c.sortOrder = i));
      save(next);
    },
    [categories, save]
  );

  const moveDown = useCallback(
    (idx: number) => {
      if (idx >= categories.length - 1) return;
      const next = [...categories];
      const temp = next[idx];
      next[idx] = next[idx + 1];
      next[idx + 1] = temp;
      next.forEach((c, i) => (c.sortOrder = i));
      save(next);
    },
    [categories, save]
  );

  const updateLabel = useCallback(
    (id: string, label: string) => {
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, label } : c)));
    },
    []
  );

  const updateDescription = useCallback(
    (id: string, description: string) => {
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, description } : c)));
    },
    []
  );

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/60">
        <p className="text-sm text-zinc-500">Loading categories…</p>
      </div>
    );
  }

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
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-zinc-500">
            {categories.length} categories · {saving ? "Saving…" : "Saved"}
          </span>
          <button
            onClick={() => setShowAdd(true)}
            className="btn btn-primary text-sm"
          >
            + Add Category
          </button>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="rounded-2xl border border-zinc-700 bg-zinc-900/80 p-5 space-y-4 animate-fade-in">
          <h3 className="font-semibold text-zinc-100">New Category</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label">ID *</label>
              <input
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                placeholder="e.g. accessories"
                className="input"
              />
              <p className="mt-1 text-[10px] text-zinc-600">
                Unique kebab-case ID
              </p>
            </div>
            <div>
              <label className="label">Display Name *</label>
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Accessories"
                className="input"
              />
            </div>
            <div>
              <label className="label">Description</label>
              <input
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Short description"
                className="input"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={addCategory}
              disabled={saving || !newId.trim() || !newLabel.trim()}
              className="btn btn-primary text-sm"
            >
              Add Category
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="btn btn-ghost text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Categories list */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="w-12 px-4 py-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Description
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Visible
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Actions
                </th>
              </tr>
            </thead>
            <motion.tbody
              className="divide-y divide-zinc-800/50"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.04 } },
              }}
            >
              {categories.map((cat, i) => (
                <motion.tr
                  key={cat.id}
                  className="transition-colors hover:bg-zinc-800/30"
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                  }}
                >
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-center gap-0.5">
                      <button
                        onClick={() => moveUp(i)}
                        disabled={i === 0}
                        className="text-zinc-600 hover:text-zinc-300 disabled:opacity-30 transition-colors"
                      >
                        ▲
                      </button>
                      <span className="text-xs text-zinc-500">{i + 1}</span>
                      <button
                        onClick={() => moveDown(i)}
                        disabled={i === categories.length - 1}
                        className="text-zinc-600 hover:text-zinc-300 disabled:opacity-30 transition-colors"
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {editingId === cat.id ? (
                      <input
                        value={cat.label}
                        onChange={(e) => updateLabel(cat.id, e.target.value)}
                        className="input !py-1.5 !px-2 text-sm"
                        autoFocus
                        onBlur={() => setEditingId(null)}
                        onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                      />
                    ) : (
                      <button
                        onClick={() => setEditingId(cat.id)}
                        className="text-sm font-medium text-zinc-200 hover:text-lime-300 transition-colors text-left"
                      >
                        {cat.label}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-zinc-500">{cat.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      value={cat.description}
                      onChange={(e) => updateDescription(cat.id, e.target.value)}
                      onBlur={() => save(categories)}
                      placeholder="No description"
                      className="w-full bg-transparent border-none text-xs text-zinc-400 outline-none placeholder:text-zinc-700 focus:text-zinc-300"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleVisible(cat.id)}
                      className={`inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        cat.visible ? "bg-lime-400" : "bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                          cat.visible ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all hover:border-red-400/50 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>

        {categories.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-3xl mb-3">📁</p>
            <p className="text-sm text-zinc-500">No categories yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
