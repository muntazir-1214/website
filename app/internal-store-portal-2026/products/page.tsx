import Link from "next/link";
import { redirect } from "next/navigation";
import { verifyAdmin } from "@/lib/adminAuth";
import { getProducts } from "@/lib/adminStore";
import ProductFilters from "./ProductFilters";
import ImportExport from "./ImportExport";

export default async function AdminProductsPage() {
  if (!(await verifyAdmin())) {
    redirect("/internal-store-portal-2026");
  }

  const products = await getProducts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-wide text-zinc-50">
            PRODUCTS
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {products.length} products in your store
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ImportExport productCount={products.length} />
          <Link href="/internal-store-portal-2026/products/new" className="btn btn-primary text-sm">
            + Add Product
          </Link>
        </div>
      </div>

      <ProductFilters products={products} />
    </div>
  );
}
