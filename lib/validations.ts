import { z } from "zod";

// ── Sanitization helpers ──────────────────────────────────────────────────────

/** Strip HTML tags and dangerous characters to prevent XSS. */
function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/[<>"'&]/g, (ch) => {
      // encode remaining dangerous chars that could slip into attribute contexts
      const map: Record<string, string> = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "&": "&amp;",
      };
      return map[ch] ?? ch;
    });
}

/** Sanitize a single string value. */
function sanitizeString(input: string): string {
  return stripHtml(input).trim();
}

/** Recursively sanitize all string values in an object/array. */
function sanitizeDeep<T>(input: T): T {
  if (typeof input === "string") return sanitizeString(input) as T;
  if (Array.isArray(input)) return input.map(sanitizeDeep) as T;
  if (input !== null && typeof input === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
      out[k] = sanitizeDeep(v);
    }
    return out as T;
  }
  return input;
}

export { sanitizeDeep, sanitizeString };

// ── Shared primitives ─────────────────────────────────────────────────────────

const CATEGORIES = [
  "shirts",
  "t-shirts",
  "trousers",
  "shorts",
  "hoodies",
  "jackets",
] as const;

const ORDER_STATUSES = [
  "pending",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const BADGES = ["NEW", "SALE", "HOT"] as const;

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"] as const;

// ── Product schemas ───────────────────────────────────────────────────────────

const colorSchema = z.object({
  name: z.string().min(1).max(50),
  hex: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid hex color"),
});

export const createProductSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "ID must be kebab-case"),
  name: z.string().min(1).max(200),
  category: z.enum(CATEGORIES),
  price: z.number().min(0).max(999_999),
  oldPrice: z.number().min(0).max(999_999).optional(),
  rating: z.number().min(0).max(5).default(0),
  reviews: z.number().int().min(0).default(0),
  description: z.string().max(5000).default(""),
  details: z.array(z.string().max(200)).max(20).default([]),
  colors: z.array(colorSchema).max(20).default([]),
  sizes: z.array(z.enum(SIZE_OPTIONS)).max(10).default(["S", "M", "L", "XL"]),
  badge: z.enum(BADGES).optional(),
  featured: z.boolean().optional(),
  image: z.string().max(500).optional(),
  gallery: z.array(z.string().max(500)).max(20).optional(),
});

export const updateProductSchema = createProductSchema.partial();

// ── Order schemas ─────────────────────────────────────────────────────────────

const orderItemSchema = z.object({
  productId: z.string().min(1).max(100),
  name: z.string().min(1).max(200),
  qty: z.number().int().min(1).max(10_000),
  price: z.number().min(0).max(999_999),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(1).max(200),
  email: z.string().email().max(254),
  items: z.array(orderItemSchema).min(1).max(100),
  status: z.enum(ORDER_STATUSES).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

// ── Category schemas ──────────────────────────────────────────────────────────

const categoryEntrySchema = z.object({
  id: z.string().min(1).max(100),
  label: z.string().min(1).max(100),
  slug: z.string().max(100),
  description: z.string().max(500).default(""),
  sortOrder: z.number().int().min(0).default(0),
  visible: z.boolean().default(true),
});

export const addCategorySchema = z.object({
  id: z.string().min(1).max(100),
  label: z.string().min(1).max(100),
  slug: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  sortOrder: z.number().int().min(0).optional(),
  visible: z.boolean().optional(),
});

export const saveCategoriesSchema = z.object({
  categories: z.array(categoryEntrySchema).max(50),
});

export const updateCategorySchema = categoryEntrySchema.partial();

// ── Bulk product schemas ──────────────────────────────────────────────────────

export const bulkProductSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("delete"),
    ids: z.array(z.string().min(1).max(100)).min(1).max(100),
  }),
  z.object({
    action: z.literal("updateCategory"),
    ids: z.array(z.string().min(1).max(100)).min(1).max(100),
    category: z.enum(CATEGORIES),
  }),
]);

// ── Import schema ─────────────────────────────────────────────────────────────

export const importProductsSchema = z.object({
  content: z.string().min(1),
  format: z.enum(["json", "csv"]),
  mode: z.enum(["replace", "merge"]),
});

// ── Content schema ────────────────────────────────────────────────────────────

export const siteContentSchema = z.object({
  heroTagline: z.string().max(200).default(""),
  heroTitle1: z.string().max(200).default(""),
  heroTitle2: z.string().max(200).default(""),
  heroDescription: z.string().max(1000).default(""),
  heroCTA1: z.string().max(100).default(""),
  heroCTA2: z.string().max(100).default(""),
  heroStat1Value: z.string().max(50).default(""),
  heroStat1Label: z.string().max(50).default(""),
  heroStat2Value: z.string().max(50).default(""),
  heroStat2Label: z.string().max(50).default(""),
  heroStat3Value: z.string().max(50).default(""),
  heroStat3Label: z.string().max(50).default(""),
  marqueeWords: z.string().max(1000).default(""),
  sectionTitle1: z.string().max(200).default(""),
  sectionSubtitle1: z.string().max(200).default(""),
  sectionTitle2: z.string().max(200).default(""),
  sectionSubtitle2: z.string().max(200).default(""),
  promoTitle: z.string().max(300).default(""),
  promoDescription: z.string().max(1000).default(""),
  promoCTA: z.string().max(100).default(""),
  footerTagline: z.string().max(100).default(""),
  footerDescription: z.string().max(500).default(""),
  newsletterTitle: z.string().max(200).default(""),
  newsletterDescription: z.string().max(500).default(""),
});

// ── Auth schema ───────────────────────────────────────────────────────────────

export const authLoginSchema = z.object({
  password: z.string().min(1).max(256),
});

// ── Email test schema ─────────────────────────────────────────────────────────

export const emailTestSchema = z.object({
  to: z.string().email().max(254),
  status: z.enum(ORDER_STATUSES),
});

// ── Upload helpers ────────────────────────────────────────────────────────────

export const uploadDeleteSchema = z.object({
  filename: z.string().min(1).max(255),
});

// ── Export format ─────────────────────────────────────────────────────────────

export const exportFormatSchema = z.object({
  format: z.enum(["json", "csv"]).default("json"),
});

// ── Generic parse helper ──────────────────────────────────────────────────────

/** Parse JSON body and validate against a Zod schema. Sanitizes strings. */
export async function parseBody<T extends z.ZodType>(
  request: Request,
  schema: T
): Promise<z.infer<T>> {
  const raw = await request.json();
  const sanitized = sanitizeDeep(raw);
  return schema.parse(sanitized);
}
