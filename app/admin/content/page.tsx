import { redirect } from "next/navigation";
import { verifyAdmin } from "@/lib/adminAuth";
import ContentManager from "./ContentManager";

export default async function ContentPage() {
  if (!(await verifyAdmin())) {
    redirect("/admin");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-wide text-zinc-50">
          SITE CONTENT
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Edit all text on your storefront — hero, sections, promo, footer, and newsletter.
        </p>
      </div>
      <ContentManager />
    </div>
  );
}
