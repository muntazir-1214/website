import type { Order } from "./adminStore";

type OrderStatus = Order["status"];

// ─── Branding ────────────────────────────────────────────────────────

const BRAND = {
  name: "DARKWEAR",
  color: "#a3e635",
  colorDark: "#65a30d",
  bg: "#09090b",
  surface: "#18181b",
  border: "#27272a",
  text: "#fafafa",
  textMuted: "#a1a1aa",
  url: process.env.SITE_URL || "http://localhost:3000",
};

// ─── Status Config ───────────────────────────────────────────────────

type StatusConfig = {
  title: string;
  headline: string;
  message: string;
  accent: string;
  icon: string;
};

const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  pending: {
    title: "Order Confirmed",
    headline: "We've received your order",
    message:
      "Your order has been confirmed and is being prepared. We'll notify you once it ships.",
    accent: "#fbbf24",
    icon: "✅",
  },
  shipped: {
    title: "Order Shipped",
    headline: "Your order is on its way!",
    message:
      "Great news — your order has been shipped and is headed your way. Track your delivery for updates.",
    accent: "#60a5fa",
    icon: "🚚",
  },
  delivered: {
    title: "Order Delivered",
    headline: "Your order has arrived",
    message:
      "Your order has been delivered. We hope you love your new gear! If anything isn't right, reach out to us.",
    accent: "#34d399",
    icon: "📦",
  },
  cancelled: {
    title: "Order Cancelled",
    headline: "Your order has been cancelled",
    message:
      "Your order has been cancelled as requested. If this was a mistake, please contact us or place a new order.",
    accent: "#f87171",
    icon: "❌",
  },
};

// ─── Template Renderer ───────────────────────────────────────────────

function renderItem(item: Order["items"][0]): string {
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid ${BRAND.border};">
        <span style="color:${BRAND.text};font-weight:600;font-size:14px;">${item.name}</span>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid ${BRAND.border};text-align:center;">
        <span style="color:${BRAND.textMuted};font-size:14px;">${item.qty}</span>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid ${BRAND.border};text-align:right;">
        <span style="color:${BRAND.text};font-weight:600;font-size:14px;">$${(item.price * item.qty).toFixed(2)}</span>
      </td>
    </tr>`;
}

export function renderOrderEmail(
  order: Order,
  status: OrderStatus
): { subject: string; html: string; text: string } {
  const config = STATUS_CONFIG[status];
  const itemsHtml = order.items.map(renderItem).join("");
  const itemsText = order.items
    .map((i) => `  ${i.name} x${i.qty} — $${(i.price * i.qty).toFixed(2)}`)
    .join("\n");

  const subject = `[${BRAND.name}] ${config.title} — Order #${order.id.slice(0, 8)}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${config.title}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <!-- Header -->
          <tr>
            <td style="text-align:center;padding-bottom:32px;">
              <span style="font-size:28px;font-weight:800;letter-spacing:0.15em;color:${BRAND.text};">
                <span style="color:${BRAND.color};">✦</span> ${BRAND.name}
              </span>
            </td>
          </tr>

          <!-- Status Card -->
          <tr>
            <td style="background:${BRAND.surface};border:1px solid ${BRAND.border};border-radius:16px;padding:40px 36px;text-align:center;">
              <span style="font-size:48px;display:block;margin-bottom:16px;">${config.icon}</span>
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:${config.accent};letter-spacing:0.05em;">
                ${config.headline}
              </h1>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${BRAND.textMuted};">
                ${config.message}
              </p>

              <!-- Order Badge -->
              <div style="display:inline-block;background:${BRAND.bg};border:1px solid ${BRAND.border};border-radius:9999px;padding:8px 20px;">
                <span style="font-size:12px;letter-spacing:0.1em;color:${BRAND.textMuted};text-transform:uppercase;">Order</span>
                <span style="font-size:13px;font-weight:700;color:${BRAND.text};margin-left:8px;">#${order.id.slice(0, 8)}</span>
              </div>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="padding:24px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.surface};border:1px solid ${BRAND.border};border-radius:12px;padding:20px 24px;">
                <tr>
                  <td colspan="3" style="padding-bottom:12px;">
                    <span style="font-size:12px;font-weight:700;letter-spacing:0.15em;color:${BRAND.textMuted};text-transform:uppercase;">Order Summary</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.1em;color:${BRAND.textMuted};text-transform:uppercase;">Product</td>
                  <td style="padding:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.1em;color:${BRAND.textMuted};text-transform:uppercase;text-align:center;">Qty</td>
                  <td style="padding:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.1em;color:${BRAND.textMuted};text-transform:uppercase;text-align:right;">Price</td>
                </tr>
                ${itemsHtml}
                <!-- Total -->
                <tr>
                  <td colspan="2" style="padding:16px 0 0;font-size:13px;font-weight:700;color:${BRAND.textMuted};text-transform:uppercase;letter-spacing:0.1em;">Total</td>
                  <td style="padding:16px 0 0;text-align:right;font-size:18px;font-weight:800;color:${BRAND.color};">$${order.total.toFixed(2)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:28px 0;text-align:center;">
              <a href="${BRAND.url}/checkout" style="display:inline-block;background:${BRAND.color};color:${BRAND.bg};font-weight:700;font-size:14px;letter-spacing:0.04em;padding:14px 32px;border-radius:9999px;text-decoration:none;">
                View Order →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="text-align:center;padding:24px 0;border-top:1px solid ${BRAND.border};">
              <p style="margin:0 0 8px;font-size:12px;color:${BRAND.textMuted};">
                ${BRAND.name} — Streetwear for the ones who move different.
              </p>
              <p style="margin:0;font-size:11px;color:#52525b;">
                Questions? Reply to this email or visit ${BRAND.url}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `
${config.icon} ${config.headline}

Order #${order.id.slice(0, 8)}
Status: ${config.title.toUpperCase()}

${config.message}

Order Summary
─────────────
${itemsText}
─────────────
Total: $${order.total.toFixed(2)}

View your order: ${BRAND.url}/checkout

—
${BRAND.name}
${BRAND.url}
`.trim();

  return { subject, html, text };
}
