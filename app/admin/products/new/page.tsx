import { redirect } from "next/navigation";
import { verifyAdmin } from "@/lib/adminAuth";
import ProductForm from "../ProductForm";

export default async function NewProductPage() {
  if (!(await verifyAdmin())) {
    redirect("/admin");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-wide text-zinc-50">
          NEW PRODUCT
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Fill in the details to add a new product to your store.
        </p>
      </div>
      <ProductForm mode="create" />
    </div>
  );
}
