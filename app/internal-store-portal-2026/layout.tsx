import { redirect } from "next/navigation";
import { verifyAdmin } from "@/lib/adminAuth";
import AdminShell from "./AdminShell";

export const metadata = {
  title: "Admin — DARKWEAR",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthed = await verifyAdmin();

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        {children}
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
