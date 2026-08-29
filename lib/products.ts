export type Category =
  | "shirts"
  | "t-shirts"
  | "trousers"
  | "shorts"
  | "hoodies"
  | "jackets";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "shirts", label: "Shirts" },
  { id: "t-shirts", label: "T-Shirts" },
  { id: "trousers", label: "Trousers" },
  { id: "shorts", label: "Shorts" },
  { id: "hoodies", label: "Hoodies" },
  { id: "jackets", label: "Jackets" },
];

export const categoryLabel = (id: Category) =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id;

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  description: string;
  details: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  badge?: "NEW" | "SALE" | "HOT";
  featured?: boolean;
  /** Optional uploaded image path relative to public/, e.g. "/uploads/foo.webp" */
  image?: string;
  /** Additional gallery images */
  gallery?: string[];
};

export const products: Product[] = [
  // ---------------- Shirts ----------------
  {
    id: "shadow-plaid-overshirt",
    name: "Shadow Plaid Overshirt",
    category: "shirts",
    price: 79,
    oldPrice: 99,
    rating: 4.7,
    reviews: 214,
    description:
      "A heavyweight brushed-cotton overshirt in a muted shadow plaid. Layer it over a tee or wear it buttoned up — it does both.",
    details: [
      "100% brushed cotton, 340gsm",
      "Relaxed oversize fit",
      "Tonal corozo buttons",
    ],
    colors: [
      { name: "Charcoal", hex: "#3f3f46" },
      { name: "Olive", hex: "#4d7c0f" },
      { name: "Bone", hex: "#e7e5e4" },
    ],
    sizes: ["S", "M", "L", "XL"],
    badge: "SALE",
    featured: true,
  },
  {
    id: "midnight-oxford-shirt",
    name: "Midnight Oxford Shirt",
    category: "shirts",
    price: 69,
    rating: 4.6,
    reviews: 132,
    description:
      "Garment-dyed oxford cloth in deep midnight blue. A crisp everyday shirt with a slightly dropped shoulder.",
    details: [
      "100% cotton oxford weave",
      "Garment-dyed, soft hand feel",
      "Mother-of-pearl buttons",
    ],
    colors: [
      { name: "Midnight", hex: "#1e293b" },
      { name: "Bone", hex: "#e7e5e4" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "graphic-camp-shirt",
    name: "Graphic Camp Shirt",
    category: "shirts",
    price: 59,
    rating: 4.5,
    reviews: 98,
    description:
      "Vintage-inspired camp collar shirt with an all-over distressed graphic print. Short sleeves, boxy cut.",
    details: ["Viscose-cotton blend", "Camp collar, boxy cut", "All-over print"],
    colors: [
      { name: "Sand", hex: "#d6c9a8" },
      { name: "Charcoal", hex: "#3f3f46" },
    ],
    sizes: ["S", "M", "L", "XL"],
    badge: "NEW",
  },
  // ---------------- T-Shirts ----------------
  {
    id: "onyx-oversized-tee",
    name: "Onyx Oversized Tee",
    category: "t-shirts",
    price: 39,
    rating: 4.8,
    reviews: 512,
    description:
      "The one that started it all. A heavy, boxy, oversized tee in jet black that keeps its shape wash after wash.",
    details: [
      "240gsm heavyweight cotton",
      "Oversized boxy silhouette",
      "Pre-shrunk, enzyme washed",
    ],
    colors: [
      { name: "Black", hex: "#18181b" },
      { name: "Bone", hex: "#e7e5e4" },
      { name: "Olive", hex: "#4d7c0f" },
    ],
    sizes: ["S", "M", "L", "XL"],
    badge: "HOT",
    featured: true,
  },
  {
    id: "neon-district-tee",
    name: "Neon District Tee",
    category: "t-shirts",
    price: 35,
    rating: 4.7,
    reviews: 289,
    description:
      "Graphic tee with a neon street-map print on the back and a small chest logo. Built for the night.",
    details: ["220gsm cotton jersey", "Screen-printed graphic", "Ribbed collar"],
    colors: [
      { name: "Lime", hex: "#a3e635" },
      { name: "Black", hex: "#18181b" },
    ],
    sizes: ["S", "M", "L", "XL"],
    badge: "NEW",
    featured: true,
  },
  {
    id: "ghost-logo-tee",
    name: "Ghost Logo Tee",
    category: "t-shirts",
    price: 42,
    rating: 4.6,
    reviews: 176,
    description:
      "A minimal tonal logo print on heavyweight cotton. The quiet flex — looks black on black until the light hits it.",
    details: ["250gsm combed cotton", "Tonal puff print", "Dropped shoulders"],
    colors: [
      { name: "Charcoal", hex: "#3f3f46" },
      { name: "Bone", hex: "#e7e5e4" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "acid-wash-tee",
    name: "Acid Wash Tee",
    category: "t-shirts",
    price: 45,
    rating: 4.4,
    reviews: 121,
    description:
      "One-of-one acid wash finish means no two tees are the same. Oversized fit, vintage feel.",
    details: ["Unique acid wash finish", "Relaxed oversize fit", "220gsm cotton"],
    colors: [
      { name: "Crimson", hex: "#b91c1c" },
      { name: "Denim", hex: "#1d4ed8" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  // ---------------- Trousers ----------------
  {
    id: "cargo-combat-trousers",
    name: "Cargo Combat Trousers",
    category: "trousers",
    price: 89,
    rating: 4.8,
    reviews: 341,
    description:
      "Six-pocket combat cargos in ripstop fabric with an adjustable ankle strap. Utility done right.",
    details: [
      "Cotton ripstop twill",
      "6-pocket utility layout",
      "Adjustable ankle straps",
    ],
    colors: [
      { name: "Olive", hex: "#4d7c0f" },
      { name: "Black", hex: "#18181b" },
    ],
    sizes: ["S", "M", "L", "XL"],
    featured: true,
  },
  {
    id: "pleated-wide-leg-trouser",
    name: "Pleated Wide-Leg Trouser",
    category: "trousers",
    price: 95,
    rating: 4.7,
    reviews: 158,
    description:
      "Double-pleated, wide-leg trousers in a drapey cotton-blend. Elevated basics for the streets.",
    details: ["Cotton-twill blend", "Double front pleats", "Wide straight leg"],
    colors: [
      { name: "Black", hex: "#18181b" },
      { name: "Sand", hex: "#d6c9a8" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "carpenter-denim-pants",
    name: "Carpenter Denim Pants",
    category: "trousers",
    price: 75,
    oldPrice: 95,
    rating: 4.5,
    reviews: 203,
    description:
      "Workwear-inspired carpenter denim with a hammer loop and bar-tacked pocket. Broken-in from day one.",
    details: ["14oz rigid denim", "Carpenter pocket + loop", "Relaxed taper"],
    colors: [
      { name: "Denim", hex: "#1d4ed8" },
      { name: "Charcoal", hex: "#3f3f46" },
    ],
    sizes: ["S", "M", "L", "XL"],
    badge: "SALE",
  },
  // ---------------- Shorts ----------------
  {
    id: "relaxed-cargo-shorts",
    name: "Relaxed Cargo Shorts",
    category: "shorts",
    price: 55,
    rating: 4.6,
    reviews: 187,
    description:
      "Above-the-knee cargos with four utility pockets and an elastic drawstring waist. Summer ready.",
    details: ["Cotton twill, garment washed", "4 utility pockets", "Drawstring waist"],
    colors: [
      { name: "Sand", hex: "#d6c9a8" },
      { name: "Olive", hex: "#4d7c0f" },
    ],
    sizes: ["S", "M", "L", "XL"],
    featured: true,
  },
  {
    id: "tie-dye-beach-shorts",
    name: "Tie-Dye Beach Shorts",
    category: "shorts",
    price: 45,
    rating: 4.3,
    reviews: 89,
    description:
      "Vibrant tie-dye shorts in quick-dry fabric with a zip pocket. From the beach to the block.",
    details: ["Quick-dry polyester blend", "Zip security pocket", "7\" inseam"],
    colors: [
      { name: "Crimson", hex: "#b91c1c" },
      { name: "Denim", hex: "#1d4ed8" },
    ],
    sizes: ["S", "M", "L", "XL"],
    badge: "NEW",
  },
  // ---------------- Hoodies ----------------
  {
    id: "heavyweight-hoodie",
    name: "Heavyweight Hoodie",
    category: "hoodies",
    price: 85,
    rating: 4.9,
    reviews: 428,
    description:
      "A 450gsm brushed-fleece hoodie that stands up on its own. Boxed silhouette, double-lined hood, roomy pocket.",
    details: [
      "450gsm brushed fleece",
      "Double-lined hood",
      "Kangaroo pocket, ribbed cuffs",
    ],
    colors: [
      { name: "Black", hex: "#18181b" },
      { name: "Charcoal", hex: "#3f3f46" },
      { name: "Bone", hex: "#e7e5e4" },
    ],
    sizes: ["S", "M", "L", "XL"],
    badge: "HOT",
    featured: true,
  },
  {
    id: "embroidered-zip-hoodie",
    name: "Embroidered Zip Hoodie",
    category: "hoodies",
    price: 99,
    rating: 4.7,
    reviews: 142,
    description:
      "Full-zip hoodie with embroidered back graphic and matte metal hardware. The layer that finishes the fit.",
    details: ["380gsm loopback fleece", "Embroidered back graphic", "YKK matte zipper"],
    colors: [
      { name: "Olive", hex: "#4d7c0f" },
      { name: "Black", hex: "#18181b" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "oversized-pullover",
    name: "Oversized Pullover",
    category: "hoodies",
    price: 79,
    oldPrice: 99,
    rating: 4.5,
    reviews: 231,
    description:
      "Baguette-fit pullover hoodie with dropped shoulders and a clean tonal chest print. Streetwear staple.",
    details: ["360gsm brushed fleece", "Dropped shoulders", "Tonal chest print"],
    colors: [
      { name: "Bone", hex: "#e7e5e4" },
      { name: "Charcoal", hex: "#3f3f46" },
    ],
    sizes: ["S", "M", "L", "XL"],
    badge: "SALE",
  },
  // ---------------- Jackets ----------------
  {
    id: "bomber-jacket",
    name: "Bomber Jacket",
    category: "jackets",
    price: 129,
    rating: 4.8,
    reviews: 167,
    description:
      "Satin bomber with ribbed collar, cuffs and hem, plus a fully lined interior. Classic silhouette, modern fit.",
    details: ["Satin shell, quilted lining", "Ribbed collar, cuffs, hem", "Two-way front zipper"],
    colors: [
      { name: "Black", hex: "#18181b" },
      { name: "Olive", hex: "#4d7c0f" },
    ],
    sizes: ["S", "M", "L", "XL"],
    featured: true,
  },
  {
    id: "varsity-jacket",
    name: "Varsity Jacket",
    category: "jackets",
    price: 149,
    rating: 4.7,
    reviews: 118,
    description:
      "Wool-blend body with leather-look sleeves and embroidered lettering. A certified classic reissued.",
    details: ["Wool-blend body", "Faux-leather sleeves", "Embroidered lettering"],
    colors: [
      { name: "Charcoal", hex: "#3f3f46" },
      { name: "Bone", hex: "#e7e5e4" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "utility-trucker-jacket",
    name: "Utility Trucker Jacket",
    category: "jackets",
    price: 119,
    rating: 4.6,
    reviews: 94,
    description:
      "Rugged cotton canvas trucker with utility pockets and a corduroy collar. Built to be worn in.",
    details: ["Heavy cotton canvas", "Corduroy collar", "6 utility pockets"],
    colors: [
      { name: "Sand", hex: "#d6c9a8" },
      { name: "Black", hex: "#18181b" },
    ],
    sizes: ["S", "M", "L", "XL"],
    badge: "NEW",
  },
];
