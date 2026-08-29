"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

export type ThemeMode = "dark" | "light";

export type AccentColor = {
  name: string;
  value: string;
  soft: string;
  muted: string;
};

export const ACCENT_COLORS: AccentColor[] = [
  { name: "Lime", value: "#a3e635", soft: "#d9f99d", muted: "#65a30d" },
  { name: "Cyan", value: "#22d3ee", soft: "#a5f3fc", muted: "#0891b2" },
  { name: "Rose", value: "#fb7185", soft: "#fecdd3", muted: "#e11d48" },
  { name: "Violet", value: "#a78bfa", soft: "#ddd6fe", muted: "#7c3aed" },
  { name: "Amber", value: "#fbbf24", soft: "#fde68a", muted: "#d97706" },
  { name: "Teal", value: "#2dd4bf", soft: "#99f6e4", muted: "#0d9488" },
  { name: "Blue", value: "#60a5fa", soft: "#bfdbfe", muted: "#2563eb" },
  { name: "Orange", value: "#fb923c", soft: "#fed7aa", muted: "#ea580c" },
];

const STORAGE_KEY_THEME = "darkwear-admin-theme";
const STORAGE_KEY_ACCENT = "darkwear-admin-accent";

type ThemeContextType = {
  mode: ThemeMode;
  accent: AccentColor;
  toggleMode: () => void;
  setAccent: (color: AccentColor) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function AdminThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [accent, setAccentState] = useState<AccentColor>(ACCENT_COLORS[0]);
  const [mounted, setMounted] = useState(false);

  // Load saved preferences
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem(STORAGE_KEY_THEME) as ThemeMode | null;
      if (savedMode === "light" || savedMode === "dark") {
        setMode(savedMode);
      }
      const savedAccent = localStorage.getItem(STORAGE_KEY_ACCENT);
      if (savedAccent) {
        const found = ACCENT_COLORS.find((c) => c.name === savedAccent);
        if (found) setAccentState(found);
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.setAttribute("data-theme", mode);

    // Apply accent color CSS variables
    root.style.setProperty("--admin-accent", accent.value);
    root.style.setProperty("--admin-accent-soft", accent.soft);
    root.style.setProperty("--admin-accent-muted", accent.muted);

    // Also set for Tailwind compatibility
    root.style.setProperty("--color-admin-accent", accent.value);

    try {
      localStorage.setItem(STORAGE_KEY_THEME, mode);
      localStorage.setItem(STORAGE_KEY_ACCENT, accent.name);
    } catch {
      // ignore
    }
  }, [mode, accent, mounted]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const setAccent = useCallback((color: AccentColor) => {
    setAccentState(color);
  }, []);

  const value = useMemo(
    () => ({ mode, accent, toggleMode, setAccent }),
    [mode, accent, toggleMode, setAccent]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useAdminTheme must be used inside AdminThemeProvider");
  return ctx;
}
