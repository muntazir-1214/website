/**
 * Server-side admin store — reads / writes products from data/products.json.
 *
 * This module is ONLY imported from server components / API routes (never from
 * client components) so it can safely use Node fs.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { products as seedProducts } from "@/lib/products";
import type { Product } from "@/lib/products";

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");

// ─── Products ──────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  try {
    const raw = await readFile(PRODUCTS_FILE, "utf-8");
    return JSON.parse(raw) as Product[];
  } catch {
    // First run — seed from the hardcoded list
    await saveProducts(seedProducts);
    return seedProducts;
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const all = await getProducts();
  return all.find((p) => p.id === id);
}

export async function saveProducts(products: Product[]): Promise<void> {
  await writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
}

export async function addProduct(
  product: Product
): Promise<Product> {
  const all = await getProducts();
  // ensure unique id
  if (all.some((p) => p.id === product.id)) {
    throw new Error("A product with this ID already exists.");
  }
  all.push(product);
  await saveProducts(all);
  return product;
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product> {
  const all = await getProducts();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Product not found.");
  all[idx] = { ...all[idx], ...updates, id };
  await saveProducts(all);
  return all[idx];
}

export async function deleteProduct(id: string): Promise<void> {
  const all = await getProducts();
  const filtered = all.filter((p) => p.id !== id);
  if (filtered.length === all.length) throw new Error("Product not found.");
  await saveProducts(filtered);
}

// ─── Orders (simple JSON store) ────────────────────────────────────────

export type Order = {
  id: string;
  customerName: string;
  email: string;
  items: { productId: string; name: string; qty: number; price: number }[];
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
};

export async function getOrders(): Promise<Order[]> {
  try {
    const raw = await readFile(ORDERS_FILE, "utf-8");
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

export async function createOrder(
  order: Omit<Order, "id" | "createdAt">
): Promise<Order> {
  const orders = await getOrders();
  const newOrder: Order = {
    ...order,
    id: `ord-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  await writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  return newOrder;
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<Order> {
  const orders = await getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) throw new Error("Order not found.");
  orders[idx].status = status;
  await writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  return orders[idx];
}

// ─── Categories ──────────────────────────────────────────────────────

export type CategoryEntry = {
  id: string;
  label: string;
  slug: string;
  description: string;
  sortOrder: number;
  visible: boolean;
};

const DEFAULT_CATEGORIES: CategoryEntry[] = [
  { id: "shirts", label: "Shirts", slug: "shirts", description: "Button-downs, oxfords, and camp shirts", sortOrder: 0, visible: true },
  { id: "t-shirts", label: "T-Shirts", slug: "t-shirts", description: "Heavyweight tees and graphic tops", sortOrder: 1, visible: true },
  { id: "trousers", label: "Trousers", slug: "trousers", description: "Cargos, denim, and wide-leg pants", sortOrder: 2, visible: true },
  { id: "shorts", label: "Shorts", slug: "shorts", description: "Cargo shorts and beach shorts", sortOrder: 3, visible: true },
  { id: "hoodies", label: "Hoodies", slug: "hoodies", description: "Pullovers, zips, and heavy fleece", sortOrder: 4, visible: true },
  { id: "jackets", label: "Jackets", slug: "jackets", description: "Bombers, truckers, and varsity jackets", sortOrder: 5, visible: true },
];

export async function getCategories(): Promise<CategoryEntry[]> {
  try {
    const raw = await readFile(CATEGORIES_FILE, "utf-8");
    return JSON.parse(raw) as CategoryEntry[];
  } catch {
    await saveCategories(DEFAULT_CATEGORIES);
    return DEFAULT_CATEGORIES;
  }
}

export async function saveCategories(categories: CategoryEntry[]): Promise<void> {
  await writeFile(CATEGORIES_FILE, JSON.stringify(categories, null, 2), "utf-8");
}

export async function addCategory(cat: CategoryEntry): Promise<CategoryEntry> {
  const all = await getCategories();
  if (all.some((c) => c.id === cat.id)) throw new Error("A category with this ID already exists.");
  all.push(cat);
  all.sort((a, b) => a.sortOrder - b.sortOrder);
  await saveCategories(all);
  return cat;
}

export async function updateCategory(id: string, updates: Partial<CategoryEntry>): Promise<CategoryEntry> {
  const all = await getCategories();
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Category not found.");
  all[idx] = { ...all[idx], ...updates, id };
  all.sort((a, b) => a.sortOrder - b.sortOrder);
  await saveCategories(all);
  return all[idx];
}

export async function deleteCategory(id: string): Promise<void> {
  const all = await getCategories();
  const filtered = all.filter((c) => c.id !== id);
  if (filtered.length === all.length) throw new Error("Category not found.");
  await saveCategories(filtered);
}

// ─── Site Content ─────────────────────────────────────────────────────

export type SiteContent = {
  heroTagline: string;
  heroTitle1: string;
  heroTitle2: string;
  heroDescription: string;
  heroCTA1: string;
  heroCTA2: string;
  heroStat1Value: string;
  heroStat1Label: string;
  heroStat2Value: string;
  heroStat2Label: string;
  heroStat3Value: string;
  heroStat3Label: string;
  marqueeWords: string;
  sectionTitle1: string;
  sectionSubtitle1: string;
  sectionTitle2: string;
  sectionSubtitle2: string;
  promoTitle: string;
  promoDescription: string;
  promoCTA: string;
  footerTagline: string;
  footerDescription: string;
  newsletterTitle: string;
  newsletterDescription: string;
};

const DEFAULT_CONTENT: SiteContent = {
  heroTagline: "New Season Drop — 2026",
  heroTitle1: "WEAR THE",
  heroTitle2: "FUTURE",
  heroDescription: "Heavyweight streetwear built to move with you. Shirts, tees, trousers, hoodies and jackets — dropped weekly, gone fast.",
  heroCTA1: "Shop Now →",
  heroCTA2: "Explore Collection",
  heroStat1Value: "120+",
  heroStat1Label: "Styles",
  heroStat2Value: "24h",
  heroStat2Label: "Dispatch",
  heroStat3Value: "4.9★",
  heroStat3Label: "Rated",
  marqueeWords: "New Drop,Free Worldwide Shipping,Streetwear Culture,Limited Edition,Summer Sale 40% Off,100% Heavyweight Cotton",
  sectionTitle1: "SHOP BY CATEGORY",
  sectionSubtitle1: "Browse",
  sectionTitle2: "FEATURED DROPS",
  sectionSubtitle2: "Handpicked",
  promoTitle: "SUMMER DROP\nUP TO 40% OFF",
  promoDescription: "Clearance on last season's favorites. When it's gone, it's gone.",
  promoCTA: "Shop the Sale →",
  footerTagline: "DARKWEAR",
  footerDescription: "Streetwear for the ones who move different. Heavyweight fabrics, limited drops, worldwide shipping.",
  newsletterTitle: "Join the list",
  newsletterDescription: "Early access to drops and 10% off your first order.",
};

export async function getContent(): Promise<SiteContent> {
  try {
    const raw = await readFile(CONTENT_FILE, "utf-8");
    return { ...DEFAULT_CONTENT, ...JSON.parse(raw) };
  } catch {
    await saveContent(DEFAULT_CONTENT);
    return DEFAULT_CONTENT;
  }
}

export async function saveContent(content: SiteContent): Promise<void> {
  await writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), "utf-8");
}

// ─── Stats helper ──────────────────────────────────────────────────────

export async function getStats() {
  const products = await getProducts();
  const orders = await getOrders();
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  return {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    categories: [...new Set(products.map((p) => p.category))].length,
    avgRating:
      products.length > 0
        ? +(products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1)
        : 0,
  };
}
