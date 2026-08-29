"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  HorizontalBar,
  DonutChart,
  LineChart,
  StatCard,
} from "@/components/admin/Charts";

type AnalyticsData = {
  summary: {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    totalItemsSold: number;
    avgRating: number;
  };
  categoryBreakdown: { name: string; count: number }[];
  revenueByStatus: { status: string; revenue: number }[];
  topProducts: {
    id: string;
    name: string;
    reviews: number;
    rating: number;
    revenue: number;
  }[];
  priceDistribution: { label: string; count: number }[];
  badgeDistribution: { badge: string; count: number }[];
  dailySales: { date: string; orders: number; revenue: number }[];
  ratingDistribution: { label: string; count: number }[];
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#fbbf24",
  shipped: "#60a5fa",
  delivered: "#34d399",
  cancelled: "#f87171",
};

const BADGE_COLORS: Record<string, string> = {
  none: "#52525b",
  NEW: "#a3e635",
  SALE: "#f87171",
  HOT: "#fb923c",
};

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/60">
        <p className="text-sm text-zinc-500">Loading analytics…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/60">
        <p className="text-sm text-zinc-500">Failed to load analytics.</p>
      </div>
    );
  }

  const { summary } = data;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Products"
          value={summary.totalProducts}
          icon="📦"
          color="text-blue-400"
        />
        <StatCard
          label="Orders"
          value={summary.totalOrders}
          icon="🛒"
          color="text-lime-400"
        />
        <StatCard
          label="Revenue"
          value={`$${summary.totalRevenue.toLocaleString()}`}
          icon="💰"
          color="text-yellow-400"
        />
        <StatCard
          label="Avg Order"
          value={`$${summary.avgOrderValue.toFixed(0)}`}
          icon="🧾"
          color="text-cyan-400"
        />
        <StatCard
          label="Items Sold"
          value={summary.totalItemsSold}
          icon="👕"
          color="text-pink-400"
        />
        <StatCard
          label="Avg Rating"
          value={summary.avgRating}
          icon="⭐"
          sub="out of 5.0"
          color="text-orange-400"
        />
      </div>

      {/* Row: Sales Trend + Revenue by Status */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h3 className="mb-4 font-semibold text-zinc-100">Sales Trend (14 days)</h3>
          <LineChart
            data={data.dailySales.map((d) => ({
              label: d.date,
              value: d.revenue,
            }))}
            height={200}
            color="#a3e635"
            showArea
            showDots
          />
          <div className="mt-3 flex items-center gap-6 text-xs text-zinc-500">
            <span>
              📈 Total:{" "}
              <span className="text-zinc-300">
                ${summary.totalRevenue.toLocaleString()}
              </span>
            </span>
            <span>
              📦 Orders:{" "}
              <span className="text-zinc-300">{summary.totalOrders}</span>
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h3 className="mb-4 font-semibold text-zinc-100">Revenue by Status</h3>
          <DonutChart
            data={data.revenueByStatus.map((d) => ({
              label: d.status,
              value: d.revenue,
              color: STATUS_COLORS[d.status],
            }))}
            innerLabel={`$${summary.totalRevenue.toLocaleString()}`}
            innerSublabel="total revenue"
          />
        </div>
      </div>

      {/* Row: Category Breakdown + Price Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h3 className="mb-4 font-semibold text-zinc-100">Products by Category</h3>
          <HorizontalBar
            data={data.categoryBreakdown.map((d) => ({
              label: d.name.charAt(0).toUpperCase() + d.name.slice(1),
              value: d.count,
            }))}
          />
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h3 className="mb-4 font-semibold text-zinc-100">Price Distribution</h3>
          <BarChart
            data={data.priceDistribution.map((d) => ({
              label: d.label,
              value: d.count,
              color: "#22d3ee",
            }))}
            height={160}
          />
        </div>
      </div>

      {/* Row: Badge Distribution + Rating Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h3 className="mb-4 font-semibold text-zinc-100">Badge Distribution</h3>
          <DonutChart
            data={data.badgeDistribution.map((d) => ({
              label: d.badge === "none" ? "No Badge" : d.badge,
              value: d.count,
              color: BADGE_COLORS[d.badge],
            }))}
            size={160}
            thickness={20}
          />
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h3 className="mb-4 font-semibold text-zinc-100">Rating Distribution</h3>
          <BarChart
            data={data.ratingDistribution.map((d) => ({
              label: d.label,
              value: d.count,
              color: "#fbbf24",
            }))}
            height={140}
          />
        </div>
      </div>

      {/* Top Products Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <h3 className="mb-4 font-semibold text-zinc-100">Top Products by Reviews</h3>
        {data.topProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Reviews
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Revenue
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Reviews Bar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {data.topProducts.map((p, i) => {
                  const maxReviews = data.topProducts[0]?.reviews || 1;
                  return (
                    <tr key={p.id} className="transition-colors hover:bg-zinc-800/30">
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-zinc-500">
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-zinc-200">{p.name}</p>
                        <p className="text-xs text-zinc-500">{p.id}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-zinc-300">
                          {p.reviews.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-orange-400">
                          ★ {p.rating}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-lime-400">
                          ${p.revenue.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 w-40">
                        <div className="h-2 rounded-full bg-zinc-800">
                          <div
                            className="h-full rounded-full bg-lime-400/70 transition-all duration-700"
                            style={{
                              width: `${(p.reviews / maxReviews) * 100}%`,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-zinc-500">
            No product data available yet.
          </p>
        )}
      </div>
    </div>
  );
}
