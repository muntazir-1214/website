import { redirect } from "next/navigation";
import { verifyAdmin } from "@/lib/adminAuth";
import CategoriesManager from "./CategoriesManager";

export default async function CategoriesPage() {
  if (!(await verifyAdmin())) {
    redirect("/admin");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-wide text-zinc-50">
          CATEGORIES
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your store categories. Drag to reorder, toggle visibility, add or remove categories.
        </p>
      </div>
      <CategoriesManager />
    </div>
  );
}
