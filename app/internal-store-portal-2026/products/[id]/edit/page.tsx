import { redirect, notFound } from "next/navigation";
import { verifyAdmin } from "@/lib/adminAuth";
import { getProductById } from "@/lib/adminStore";
import ProductForm from "../../ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await verifyAdmin())) {
    redirect("/internal-store-portal-2026");
  }

  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-wide text-zinc-50">
          EDIT PRODUCT
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Updating <span className="text-zinc-300">{product.name}</span>
        </p>
      </div>
      <ProductForm product={product} mode="edit" />
    </div>
  );
}
