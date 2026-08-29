"use client";

import Link from "next/link";
import { useState } from "react";
import { renderOrderEmail } from "@/lib/emailTemplates";
import type { Order as FullOrder } from "@/lib/adminStore";

type OrderStatus = FullOrder["status"];

const DEMO_ORDER: FullOrder = {
  id: "ord-demo-abc123",
  customerName: "Alex Johnson",
  email: "alex@example.com",
  items: [
    { productId: "onyx-oversized-tee", name: "Onyx Oversized Tee", qty: 2, price: 39 },
    { productId: "heavyweight-hoodie", name: "Heavyweight Hoodie", qty: 1, price: 85 },
  ],
  total: 163,
  status: "pending",
  createdAt: new Date().toISOString(),
};

const STATUSES: OrderStatus[] = ["pending", "shipped", "delivered", "cancelled"];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-400/15 text-yellow-400 border-yellow-400/30",
  shipped: "bg-blue-400/15 text-blue-400 border-blue-400/30",
  delivered: "bg-green-400/15 text-green-400 border-green-400/30",
  cancelled: "bg-red-400/15 text-red-400 border-red-400/30",
};

export default function EmailsPage() {
  const [activeStatus, setActiveStatus] = useState<OrderStatus>("pending");
  const [view, setView] = useState<"preview" | "html" | "text">("preview");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState("");

  const { subject, html, text } = renderOrderEmail(DEMO_ORDER, activeStatus);

  const handleSendTest = async () => {
    if (!testEmail.trim()) return;
    setSending(true);
    setSendResult(null);

    try {
      // Simulate sending via the order API with a test
      const res = await fetch("/api/admin/emails/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: testEmail,
          status: activeStatus,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSendResult(`✓ Test email sent to ${testEmail}`);
      } else {
        setSendResult(`✕ ${data.error || "Failed to send"}`);
      }
    } catch {
      setSendResult("✕ Network error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl tracking-wide text-zinc-50">
          EMAIL TEMPLATES
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Preview and test order notification emails. Templates are automatically
          sent when order status changes.
        </p>
        <Link
          href="/admin/emails/log"
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-lime-400 hover:text-lime-300"
        >
          📋 View Notification Log →
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {/* Preview area */}
        <div className="space-y-4">
          {/* Status tabs */}
          <div className="flex gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setActiveStatus(s)}
                className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                  activeStatus === s
                    ? STATUS_STYLES[s]
                    : "border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-2">
            {(["preview", "html", "text"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  view === v
                    ? "bg-zinc-800 text-zinc-200"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {v === "preview" ? "👁 Preview" : v === "html" ? "</> HTML" : "📝 Text"}
              </button>
            ))}
            <span className="ml-auto text-xs text-zinc-600">
              Subject: <span className="text-zinc-400">{subject}</span>
            </span>
          </div>

          {/* Content */}
          {view === "preview" && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
              <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950">
                {/* eslint-disable-next-line react/no-danger */}
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            </div>
          )}

          {view === "html" && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
              <pre className="overflow-x-auto rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-400 max-h-[600px] overflow-y-auto">
                {html}
              </pre>
            </div>
          )}

          {view === "text" && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
              <pre className="overflow-x-auto rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-400 whitespace-pre-wrap">
                {text}
              </pre>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status info */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
            <h3 className="font-semibold text-zinc-100">Template Info</h3>
            <div className="space-y-3">
              <div>
                <p className="label">Status</p>
                <span
                  className={`inline-block rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest ${
                    STATUS_STYLES[activeStatus]
                  }`}
                >
                  {activeStatus}
                </span>
              </div>
              <div>
                <p className="label">Subject Line</p>
                <p className="text-sm text-zinc-300">{subject}</p>
              </div>
              <div>
                <p className="label">Trigger</p>
                <p className="text-sm text-zinc-400">
                  Sent automatically when an order&apos;s status changes to{" "}
                  <span className="text-zinc-200 font-medium">{activeStatus}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Demo order */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
            <h3 className="font-semibold text-zinc-100">Demo Order</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Order ID</span>
                <span className="text-zinc-300 font-mono text-xs">#{DEMO_ORDER.id.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Customer</span>
                <span className="text-zinc-300">{DEMO_ORDER.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Email</span>
                <span className="text-zinc-300">{DEMO_ORDER.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Items</span>
                <span className="text-zinc-300">{DEMO_ORDER.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Total</span>
                <span className="text-lime-400 font-bold">${DEMO_ORDER.total}</span>
              </div>
            </div>
          </div>

          {/* Send test */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
            <h3 className="font-semibold text-zinc-100">Send Test Email</h3>
            <p className="text-xs text-zinc-500">
              Requires{" "}
              <code className="text-zinc-400">RESEND_API_KEY</code> env var.
            </p>
            <div>
              <label className="label">Recipient Email</label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
                className="input"
              />
            </div>
            <button
              onClick={handleSendTest}
              disabled={sending || !testEmail.trim()}
              className="btn btn-primary w-full text-sm"
            >
              {sending ? "Sending…" : `Send ${activeStatus} Email →`}
            </button>
            {sendResult && (
              <p
                className={`text-sm animate-fade-in ${
                  sendResult.startsWith("✓") ? "text-lime-300" : "text-red-400"
                }`}
              >
                {sendResult}
              </p>
            )}
          </div>

          {/* Env vars reference */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-3">
            <h3 className="font-semibold text-zinc-100">Configuration</h3>
            <div className="space-y-2 text-xs">
              <div>
                <code className="text-lime-400">SEND_NOTIFICATIONS</code>
                <span className="ml-2 text-zinc-500">= true to enable</span>
              </div>
              <div>
                <code className="text-lime-400">RESEND_API_KEY</code>
                <span className="ml-2 text-zinc-500">= your Resend key</span>
              </div>
              <div>
                <code className="text-lime-400">RESEND_FROM</code>
                <span className="ml-2 text-zinc-500">= sender address</span>
              </div>
              <div>
                <code className="text-lime-400">NOTIFY_WEBHOOK_URL</code>
                <span className="ml-2 text-zinc-500">= webhook endpoint</span>
              </div>
              <div>
                <code className="text-lime-400">SITE_URL</code>
                <span className="ml-2 text-zinc-500">= links in emails</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
