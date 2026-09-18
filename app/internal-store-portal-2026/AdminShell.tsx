"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AdminThemeProvider, useAdminTheme, ACCENT_COLORS } from "@/lib/AdminThemeContext";

const NAV = [
  {
    label: "Dashboard",
    href: "/internal-store-portal-2026/dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: "Products",
    href: "/internal-store-portal-2026/products",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 5.5L9 1.5L16 5.5V12.5L9 16.5L2 12.5V5.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 16.5V8.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 5.5L9 8.5L2 5.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: "Orders",
    href: "/internal-store-portal-2026/orders",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5.5 6.5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5.5 9.5H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5.5 12.5H8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Analytics",
    href: "/internal-store-portal-2026/analytics",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 16V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M6 16V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10 16V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M14 16V2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Emails",
    href: "/internal-store-portal-2026/emails",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 6L9 10L16 6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Categories",
    href: "/internal-store-portal-2026/categories",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 4.5H7V9.5H2V4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M11 4.5H16V9.5H11V4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M2 11.5H7V16.5H2V11.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M11 11.5H16V16.5H11V11.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Content",
    href: "/internal-store-portal-2026/content",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 4.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 9H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 13.5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/internal-store-portal-2026/settings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 1.5V3.5M9 14.5V16.5M1.5 9H3.5M14.5 9H16.5M3.2 3.2L4.6 4.6M13.4 13.4L14.8 14.8M14.8 3.2L13.4 4.6M4.6 13.4L3.2 14.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

function Sidebar() {
  const pathname = usePathname();
  const { mode, accent, toggleMode, setAccent } = useAdminTheme();
  const [showAccentPicker, setShowAccentPicker] = useState(false);

  return (
    <aside
      className="sticky top-0 flex h-screen w-64 flex-col border-r transition-colors duration-300"
      style={{
        borderColor: mode === "dark" ? "#27272a" : "#e4e4e7",
        backgroundColor: mode === "dark" ? "#09090b" : "#ffffff",
      }}
    >
      {/* Logo */}
      <div
        className="flex h-16 items-center gap-2 border-b px-6 transition-colors duration-300"
        style={{
          borderColor: mode === "dark" ? "#27272a" : "#e4e4e7",
        }}
      >
        <Link href="/" className="font-display text-xl tracking-widest">
          <span style={{ color: accent.value }}>✦</span>{" "}
          <span style={{ color: mode === "dark" ? "#fafafa" : "#09090b" }}>
            DARKWEAR
          </span>
        </Link>
        <span
          className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
          style={{
            backgroundColor: `${accent.value}20`,
            color: accent.value,
          }}
        >
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-4">
        {NAV.map((item) => {
          const isActive =
            item.href === "/internal-store-portal-2026"
              ? pathname === "/internal-store-portal-2026"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all"
              style={{
                color: isActive ? accent.value : mode === "dark" ? "#a1a1aa" : "#71717a",
                backgroundColor: isActive
                  ? `${accent.value}15`
                  : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor =
                    mode === "dark" ? "rgba(39,39,42,0.6)" : "rgba(228,228,231,0.6)";
                  e.currentTarget.style.color = accent.value;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color =
                    mode === "dark" ? "#a1a1aa" : "#71717a";
                }
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Theme controls */}
      <div
        className="space-y-3 border-t p-4 transition-colors duration-300"
        style={{ borderColor: mode === "dark" ? "#27272a" : "#e4e4e7" }}
      >
        {/* Accent color picker */}
        <div className="relative">
          <button
            onClick={() => setShowAccentPicker(!showAccentPicker)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
            style={{
              color: mode === "dark" ? "#a1a1aa" : "#71717a",
            }}
          >
            <div
              className="h-4 w-4 rounded-full border-2 border-white/30"
              style={{ backgroundColor: accent.value }}
            />
            Accent: {accent.name}
          </button>

          {showAccentPicker && (
            <div
              className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border p-3 shadow-xl animate-fade-in"
              style={{
                backgroundColor: mode === "dark" ? "#18181b" : "#ffffff",
                borderColor: mode === "dark" ? "#27272a" : "#e4e4e7",
              }}
            >
              <p
                className="mb-2 text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: mode === "dark" ? "#71717a" : "#a1a1aa" }}
              >
                Accent Color
              </p>
              <div className="grid grid-cols-4 gap-2">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setAccent(c);
                      setShowAccentPicker(false);
                    }}
                    className="flex flex-col items-center gap-1 rounded-lg p-2 transition-all hover:scale-110"
                    style={{
                      backgroundColor:
                        accent.name === c.name ? `${c.value}20` : "transparent",
                    }}
                  >
                    <div
                      className="h-6 w-6 rounded-full border-2"
                      style={{
                        backgroundColor: c.value,
                        borderColor:
                          accent.name === c.name ? "#ffffff" : "transparent",
                      }}
                    />
                    <span
                      className="text-[9px] font-medium"
                      style={{
                        color: mode === "dark" ? "#a1a1aa" : "#71717a",
                      }}
                    >
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dark/light toggle */}
        <button
          onClick={toggleMode}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
          style={{ color: mode === "dark" ? "#a1a1aa" : "#71717a" }}
        >
          {mode === "dark" ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9 1.5V3.5M9 14.5V16.5M1.5 9H3.5M14.5 9H16.5M3.2 3.2L4.6 4.6M13.4 13.4L14.8 14.8M14.8 3.2L13.4 4.6M4.6 13.4L3.2 14.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M15.5 10.5A6.5 6.5 0 0 1 7.5 2.5a7 7 0 1 0 8 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {mode === "dark" ? "Light Mode" : "Dark Mode"}
        </button>

        {/* Back to site */}
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
          style={{ color: mode === "dark" ? "#71717a" : "#a1a1aa" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 9H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M2 4V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Back to site
        </Link>

        {/* Logout */}
        <form action="/api/admin/auth" method="DELETE">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all hover:bg-red-500/10 hover:text-red-400"
            style={{ color: mode === "dark" ? "#71717a" : "#a1a1aa" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M6.5 16H3.5C2.95 16 2.479 15.802 2.121 15.464C1.763 15.126 1.563 14.667 1.563 14.188V3.813C1.563 3.333 1.763 2.874 2.121 2.536C2.479 2.198 2.95 2 3.5 2H6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 13L16 9L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 9H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { mode } = useAdminTheme();

  return (
    <div
      className="flex min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: mode === "dark" ? "#09090b" : "#fafafa",
      }}
    >
      <Sidebar />
      <main
        className="flex-1 overflow-y-auto p-8 transition-colors duration-300"
        style={{
          color: mode === "dark" ? "#fafafa" : "#09090b",
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminThemeProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminThemeProvider>
  );
}
