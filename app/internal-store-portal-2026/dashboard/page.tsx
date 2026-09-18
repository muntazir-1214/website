import { redirect } from "next/navigation";
import { verifyAdmin } from "@/lib/adminAuth";
import { getStats, getProducts, getOrders } from "@/lib/adminStore";
import DashboardContent from "./DashboardContent";

export default async function AdminDashboard() {
  if (!(await verifyAdmin())) {
    redirect("/internal-store-portal-2026");
  }

  const [stats, products, orders] = await Promise.all([
    getStats(),
    getProducts(),
    getOrders(),
  ]);

  const recentOrders = orders.slice(-5).reverse();
  const lowStockProducts = products.filter((p) => p.reviews < 100).slice(0, 5);

  return (
    <DashboardContent
      stats={stats}
      recentOrders={recentOrders}
      lowStockProducts={lowStockProducts}
    />
  );
}
