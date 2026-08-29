"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError("Invalid password. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-8">
      {/* Logo */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="font-display text-5xl tracking-widest">
          <span className="text-lime-400">✦</span> DARKWEAR
        </h1>
        <p className="mt-2 text-sm text-zinc-500">Admin Portal</p>
      </motion.div>

      {/* Login card */}
      <motion.div
        className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 backdrop-blur"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <h2 className="mb-6 text-center text-lg font-semibold text-zinc-100">
          Sign in to manage your store
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className={`input ${error ? "input-error" : ""}`}
            />
            {error && (
              <p className="mt-2 text-sm text-red-400 animate-fade-in">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                  <path d="M14 8A6 6 0 0 0 8 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Signing in…
              </span>
            ) : (
              "Sign In →"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Default password: <code className="text-zinc-500">darkwear2026</code>
          <br />
          Set <code className="text-zinc-500">ADMIN_PASSWORD</code> env var to
          change it.
        </p>
      </motion.div>
    </div>
  );
}
