/**
 * Notification utility for order status changes.
 *
 * Supports multiple transport backends:
 * - Console logging (default / dev)
 * - Webhook (configurable via NOTIFY_WEBHOOK_URL)
 * - Resend API (configurable via RESEND_API_KEY + RESEND_FROM)
 *
 * Set SEND_NOTIFICATIONS=true to enable actual sending.
 * Without it, notifications are only logged to console.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { Order } from "./adminStore";
import { renderOrderEmail } from "./emailTemplates";

export type NotificationResult = {
  channel: string;
  success: boolean;
  error?: string;
};

// ─── Log store (file-based, persists across restarts) ────────────────

export type NotificationLog = {
  id: string;
  orderId: string;
  recipient: string;
  subject: string;
  status: "sent" | "failed" | "skipped";
  channel: string;
  timestamp: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const LOG_FILE = path.join(DATA_DIR, "notifications.json");

async function readLog(): Promise<NotificationLog[]> {
  try {
    const raw = await readFile(LOG_FILE, "utf-8");
    return JSON.parse(raw) as NotificationLog[];
  } catch {
    return [];
  }
}

async function appendLog(entry: NotificationLog): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  const log = await readLog();
  log.push(entry);
  // Keep last 200 entries
  const trimmed = log.slice(-200);
  await writeFile(LOG_FILE, JSON.stringify(trimmed, null, 2), "utf-8");
}

export async function getNotificationLog(): Promise<NotificationLog[]> {
  return readLog();
}

export async function clearNotificationLog(): Promise<void> {
  await writeFile(LOG_FILE, "[]", "utf-8");
}

// ─── Main send function ──────────────────────────────────────────────

export async function sendOrderNotification(
  order: Order,
  newStatus: Order["status"]
): Promise<NotificationResult[]> {
  const { subject, html, text } = renderOrderEmail(order, newStatus);
  const results: NotificationResult[] = [];

  // 1. Console log (always)
  console.log(`📧 Email notification: "${subject}" → ${order.email}`);
  await appendLog({
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    orderId: order.id,
    recipient: order.email,
    subject,
    status: "skipped",
    channel: "console",
    timestamp: new Date().toISOString(),
  });

  // Check if notifications are enabled
  if (process.env.SEND_NOTIFICATIONS !== "true") {
    return results;
  }

  // 2. Webhook
  const webhookUrl = process.env.NOTIFY_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "order_status_change",
          orderId: order.id,
          customerEmail: order.email,
          customerName: order.customerName,
          status: newStatus,
          subject,
          html,
          text,
          total: order.total,
        }),
      });
      results.push({
        channel: "webhook",
        success: res.ok,
        error: res.ok ? undefined : `HTTP ${res.status}`,
      });
    } catch (err) {
      results.push({
        channel: "webhook",
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  // 3. Resend API
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM || `DARKWEAR <notifications@darkwear.com>`;
  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: resendFrom,
          to: [order.email],
          subject,
          html,
          text,
        }),
      });
      const data = await res.json();
      results.push({
        channel: "resend",
        success: res.ok,
        error: res.ok ? undefined : data.message || "Failed",
      });
    } catch (err) {
      results.push({
        channel: "resend",
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  // If no transport configured, log as skipped
  if (results.length === 0) {
    results.push({
      channel: "console",
      success: true,
    });
  }

  return results;
}
