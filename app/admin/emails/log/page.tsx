"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type LogEntry = {
  id: string;
  orderId: string;
  recipient: string;
  subject: string;
  status: "sent" | "failed" | "skipped";
  channel: string;
  timestamp: string;
};

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: string }> = {
  sent: { bg: "bg-green-400/15", text: "text-green-400", icon: "✓" },
  failed: { bg: "bg-red-400/15", text: "text-red-400", icon: "✕" },
  skipped: { bg: "bg-zinc-400/15", text: "text-zinc-400", icon: "—" },
};

export default function NotificationLogPage() {
  const [log, setLog] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [filter, setFilter] = useState<"all" | "sent" | "failed" | "skipped">("all");

  const fetchLog = useCallback(() => {
    fetch("/api/admin/emails")
      .then((r) => r.json())
      .then((data) => {
        setLog(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchLog();
  }, [fetchLog]);

  const clearLog = useCallback(async () => {
    if (!confirm("Clear all notification history?")) return;
    setClearing(true);
    try {
      await fetch("/api/admin/emails", { method: "DELETE" });
      setLog([]);
    } finally {
      setClearing(false);
    }
  }, []);

  const filtered = filter === "all" ? log : log.filter((e) => e.status === filter);

  const counts = {
    all: log.length,
    sent: log.filter((e) => e.status === "sent").length,
    failed: log.filter((e) => e.status === "failed").length,
    skipped: log.filter((e) => e.status === "skipped").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-wide text-zinc-50">
            NOTIFICATION LOG
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            History of all email notifications sent from the admin.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/emails"
            className="btn btn-ghost text-sm"
          >
            ← Templates
          </Link>
          <button
            onClick={clearLog}
            disabled={clearing || log.length === 0}
            className="btn btn-ghost text-sm border-red-400/30 text-red-400 hover:bg-red-400/10 hover:border-red-400/50"
          >
            {clearing ? "Clearing…" : "Clear Log"}
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {(["all", "sent", "failed", "skipped"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all ${
              filter === f
                ? f === "sent"
                  ? "border-green-400/60 bg-green-400/15 text-green-400"
                  : f === "failed"
                  ? "border-red-400/60 bg-red-400/15 text-red-400"
                  : f === "skipped"
                  ? "border-zinc-400/60 bg-zinc-400/15 text-zinc-400"
                  : "border-lime-400/60 bg-lime-400/15 text-lime-300"
                : "border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400"
            }`}
          >
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Log table */}
      {loading ? (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/60">
          <p className="text-sm text-zinc-500">Loading log…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/60 py-16">
          <p className="text-3xl mb-3">📭</p>
          <p className="text-sm text-zinc-500">
            {log.length === 0
              ? "No notifications sent yet. They'll appear here when orders change status."
              : "No entries match this filter."}
          </p>
          {log.length === 0 && (
            <Link
              href="/admin/emails"
              className="btn btn-ghost mt-4 text-sm"
            >
              View Email Templates →
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Recipient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Subject
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Order
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Channel
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filtered.map((entry) => {
                  const style = STATUS_STYLES[entry.status] ?? STATUS_STYLES.skipped;
                  const date = new Date(entry.timestamp);
                  return (
                    <tr
                      key={entry.id}
                      className="transition-colors hover:bg-zinc-800/30"
                    >
                      <td className="px-6 py-3">
                        <div>
                          <p className="text-sm text-zinc-300">
                            {date.toLocaleDateString()}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {date.toLocaleTimeString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${style.bg} ${style.text}`}
                        >
                          {style.icon} {entry.status}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-sm text-zinc-300">{entry.recipient}</p>
                      </td>
                      <td className="px-6 py-3">
                        <p className="max-w-xs truncate text-sm text-zinc-400">
                          {entry.subject}
                        </p>
                      </td>
                      <td className="px-6 py-3">
                        <span className="font-mono text-xs text-zinc-500">
                          #{entry.orderId.slice(0, 8)}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-[10px] font-semibold text-zinc-400 capitalize">
                          {entry.channel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
