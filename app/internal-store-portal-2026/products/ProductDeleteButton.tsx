"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductDeleteButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete product");
      }
    } catch {
      alert("Failed to delete product");
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-red-400">Delete?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded-lg bg-red-500/20 px-2 py-1 text-[10px] font-bold text-red-400 transition-all hover:bg-red-500/30"
        >
          {loading ? "..." : "Yes"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-lg bg-zinc-700/50 px-2 py-1 text-[10px] font-bold text-zinc-400 transition-all hover:bg-zinc-700"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all hover:border-red-400/50 hover:text-red-400"
    >
      Delete
    </button>
  );
}
