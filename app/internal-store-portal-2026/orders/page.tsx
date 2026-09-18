"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type Order = {
  id: string;
  customerName: string;
  email: string;
  items: { productId: string; name: string; qty: number; price: number }[];
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-400/15 text-yellow-400",
  shipped: "bg-blue-400/15 text-blue-400",
  delivered: "bg-green-400/15 text-green-400",
  cancelled: "bg-red-400/15 text-red-400",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId: string, status: Order["status"]) => {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="font-display text-4xl tracking-wide text-zinc-50">
            ORDERS
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {orders.length} total orders
          </p>
        </div>
        <Link href="/internal-store-portal-2026/orders/new" className="btn btn-primary text-sm">
          + New Order
        </Link>
      </motion.div>

      {loading ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-16 text-center">
          <p className="text-sm text-zinc-500">Loading orders…</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-16 text-center">
          <p className="text-3xl mb-3">📋</p>
          <p className="text-sm text-zinc-500">
            No orders yet. Create one manually or wait for customer orders.
          </p>
          <Link href="/internal-store-portal-2026/orders/new" className="btn btn-primary mt-4 text-sm">
            + Create Order
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Order
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-widest text-zinc-500">
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
                  visible: { transition: { staggerChildren: 0.05 } },
                }}
              >
                {orders.map((order) => (
                  <motion.tr
                    key={order.id}
                    className="transition-colors hover:bg-zinc-800/30"
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                    }}
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-mono text-zinc-300">
                        #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-zinc-200">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-zinc-500">{order.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-zinc-300">
                        {order.items.length} item{order.items.length !== 1 && "s"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-zinc-100">
                        ${order.total}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                          STATUS_STYLES[order.status] ?? ""
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {(
                          ["pending", "shipped", "delivered", "cancelled"] as const
                        ).map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(order.id, s)}
                            disabled={order.status === s}
                            className={`rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
                              order.status === s
                                ? "bg-zinc-700 text-zinc-400 cursor-default"
                                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                            }`}
                          >
                            {s.slice(0, 4)}
                          </button>
                        ))}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
