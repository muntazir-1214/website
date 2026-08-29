import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getProducts, getOrders } from "@/lib/adminStore";
import type { Category } from "@/lib/products";

export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [products, orders] = await Promise.all([getProducts(), getOrders()]);

  // ── Category breakdown ──────────────────────────────────────
  const categoryMap: Record<string, number> = {};
  for (const p of products) {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
  }
  const categoryBreakdown = Object.entries(categoryMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // ── Revenue by status ───────────────────────────────────────
  const statusMap: Record<string, number> = {};
  for (const o of orders) {
    statusMap[o.status] = (statusMap[o.status] || 0) + o.total;
  }
  const revenueByStatus = Object.entries(statusMap)
    .map(([status, revenue]) => ({ status, revenue: +revenue.toFixed(2) }))
    .sort((a, b) => b.revenue - a.revenue);

  // ── Top products by reviews ─────────────────────────────────
  const topProducts = [...products]
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 10)
    .map((p) => ({
      id: p.id,
      name: p.name,
      reviews: p.reviews,
      rating: p.rating,
      revenue: orders.reduce(
        (sum, o) =>
          sum + o.items.filter((i) => i.productId === p.id).reduce((s, i) => s + i.price * i.qty, 0),
        0
      ),
    }));

  // ── Price range distribution ────────────────────────────────
  const ranges = [
    { label: "$0–39", min: 0, max: 39 },
    { label: "$40–69", min: 40, max: 69 },
    { label: "$70–99", min: 70, max: 99 },
    { label: "$100–129", min: 100, max: 129 },
    { label: "$130+", min: 130, max: Infinity },
  ];
  const priceDistribution = ranges.map((r) => ({
    label: r.label,
    count: products.filter((p) => p.price >= r.min && p.price <= r.max).length,
  }));

  // ── Badge distribution ──────────────────────────────────────
  const badgeMap: Record<string, number> = { none: 0 };
  for (const p of products) {
    const key = p.badge ?? "none";
    badgeMap[key] = (badgeMap[key] || 0) + 1;
  }
  const badgeDistribution = Object.entries(badgeMap)
    .map(([badge, count]) => ({ badge, count }))
    .sort((a, b) => b.count - a.count);

  // ── Simulated daily sales (based on order timestamps) ───────
  // Group orders by day for the last 14 days
  const now = new Date();
  const dailySales: { date: string; orders: number; revenue: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayStr = d.toISOString().slice(0, 10);
    const dayOrders = orders.filter((o) => o.createdAt.startsWith(dayStr));
    dailySales.push({
      date: dayStr,
      orders: dayOrders.length,
      revenue: +dayOrders.reduce((s, o) => s + o.total, 0).toFixed(2),
    });
  }

  // ── Rating distribution ─────────────────────────────────────
  const ratingBuckets = [
    { label: "4.0–4.2", min: 4.0, max: 4.2 },
    { label: "4.3–4.5", min: 4.3, max: 4.5 },
    { label: "4.6–4.7", min: 4.6, max: 4.7 },
    { label: "4.8–5.0", min: 4.8, max: 5.0 },
  ];
  const ratingDistribution = ratingBuckets.map((r) => ({
    label: r.label,
    count: products.filter((p) => p.rating >= r.min && p.rating <= r.max).length,
  }));

  // ── Summary stats ───────────────────────────────────────────
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const totalItemsSold = orders.reduce(
    (s, o) => s + o.items.reduce((is, i) => is + i.qty, 0),
    0
  );

  return NextResponse.json({
    summary: {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue: +totalRevenue.toFixed(2),
      avgOrderValue: +avgOrderValue.toFixed(2),
      totalItemsSold,
      avgRating: products.length
        ? +(products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(2)
        : 0,
    },
    categoryBreakdown,
    revenueByStatus,
    topProducts,
    priceDistribution,
    badgeDistribution,
    dailySales,
    ratingDistribution,
  });
}
