import { redirect } from "next/navigation";
import { verifyAdmin } from "@/lib/adminAuth";
import AnalyticsDashboard from "./AnalyticsDashboard";

export default async function AnalyticsPage() {
  if (!(await verifyAdmin())) {
    redirect("/internal-store-portal-2026");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-wide text-zinc-50">
          ANALYTICS
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Insights into your store&apos;s performance, products, and revenue.
        </p>
      </div>
      <AnalyticsDashboard />
    </div>
  );
}
