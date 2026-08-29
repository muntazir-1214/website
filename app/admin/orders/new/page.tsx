import { redirect } from "next/navigation";
import { verifyAdmin } from "@/lib/adminAuth";
import { getProducts } from "@/lib/adminStore";
import NewOrderForm from "./NewOrderForm";

export default async function NewOrderPage() {
  if (!(await verifyAdmin())) {
    redirect("/admin");
  }

  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-wide text-zinc-50">
          NEW ORDER
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Create a manual order for a customer.
        </p>
      </div>
      <NewOrderForm products={products} />
    </div>
  );
}
