import Link from "next/link";
import { redirect } from "next/navigation";
import { verifyAdmin } from "@/lib/adminAuth";
import { getStats, getProducts, getOrders } from "@/lib/adminStore";

export default async function AdminDashboard() {
  if (!(await verifyAdmin())) {
    redirect("/admin");
  }

  const [stats, products, orders] = await Promise.all([
    getStats(),
    getProducts(),
    getOrders(),
  ]);

  const recentOrders = orders.slice(-5).reverse();
  const lowStockProducts = products.filter((p) => p.reviews < 100).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl tracking-wide text-zinc-50">
          DASHBOARD
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Welcome back. Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Products",
            value: stats.totalProducts,
            icon: "📦",
            color: "text-blue-400",
            bg: "bg-blue-400/10",
          },
          {
            label: "Total Orders",
            value: stats.totalOrders,
            icon: "🛒",
            color: "text-lime-400",
            bg: "bg-lime-400/10",
          },
          {
            label: "Revenue",
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: "💰",
            color: "text-yellow-400",
            bg: "bg-yellow-400/10",
          },
          {
            label: "Avg Rating",
            value: stats.avgRating,
            icon: "⭐",
            color: "text-orange-400",
            bg: "bg-orange-400/10",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition-all hover:border-zinc-700"
          >
            <div className="flex items-center justify-between">
              <span className={`text-2xl ${stat.bg} rounded-xl p-2`}>
                {stat.icon}
              </span>
            </div>
            <p className="mt-4 font-display text-3xl tracking-wide text-zinc-50">
              {stat.value}
            </p>
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-zinc-100">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-xs font-medium text-lime-400 hover:text-lime-300"
            >
              View all →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="py-8 text-center text-sm text-zinc-500">
              <p className="text-2xl mb-2">📋</p>
              No orders yet. They&apos;ll appear here once customers start ordering.
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-800/50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-zinc-500">{order.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-zinc-100">
                      ${order.total}
                    </p>
                    <span
                      className={`text-xs font-medium ${
                        order.status === "delivered"
                          ? "text-green-400"
                          : order.status === "shipped"
                          ? "text-blue-400"
                          : order.status === "cancelled"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Products needing attention */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-zinc-100">
              Products Needing Attention
            </h2>
            <Link
              href="/admin/products"
              className="text-xs font-medium text-lime-400 hover:text-lime-300"
            >
              View all →
            </Link>
          </div>
          {lowStockProducts.length === 0 ? (
            <div className="py-8 text-center text-sm text-zinc-500">
              <p className="text-2xl mb-2">✨</p>
              All products are performing well!
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-800/50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      {product.name}
                    </p>
                    <p className="text-xs text-zinc-500 capitalize">
                      {product.category} · ★ {product.rating}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-zinc-100">
                      ${product.price}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {product.reviews} reviews
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <h2 className="mb-4 font-semibold text-zinc-100">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="btn btn-primary text-sm"
          >
            + Add New Product
          </Link>
          <Link
            href="/admin/products"
            className="btn btn-ghost text-sm"
          >
            Manage Products
          </Link>
          <Link
            href="/admin/orders/new"
            className="btn btn-primary text-sm"
          >
            + Create Order
          </Link>
          <Link
            href="/admin/orders"
            className="btn btn-ghost text-sm"
          >
            View Orders
          </Link>
          <Link
            href="/shop"
            target="_blank"
            className="btn btn-ghost text-sm"
          >
            View Store ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
