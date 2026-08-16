import type { ReactNode } from "react";
import type { Category } from "@/lib/products";

function TeeIcon(color: string) {
  return (
    <>
      <path
        d="M100 30 C90 24 76 27 68 36 L58 42 L20 62 C12 66 8 74 10 80 L14 88 L32 98 L34 102 L34 178 C34 186 40 192 48 192 L152 192 C160 192 166 186 166 178 L166 102 L168 98 L186 88 L190 80 C192 74 188 66 180 62 L142 42 L132 36 C124 27 110 24 100 30 Z"
        fill={color}
      />
      <path
        d="M86 34 C91 29 109 29 114 34 L110 44 C106 40 94 40 90 44 Z"
        fill="rgba(0,0,0,0.28)"
      />
      <path d="M34 104 L42 102" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M166 104 L158 102" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M42 186 L158 186" stroke="rgba(0,0,0,0.22)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="100" cy="140" r="13" fill="rgba(255,255,255,0.25)" />
    </>
  );
}

function ShirtIcon(color: string) {
  return (
    <>
      <path
        d="M100 30 C90 24 76 27 68 36 L58 42 L20 62 C12 66 8 74 10 80 L14 88 L32 98 L34 102 L34 178 C34 186 40 192 48 192 L152 192 C160 192 166 186 166 178 L166 102 L168 98 L186 88 L190 80 C192 74 188 66 180 62 L142 42 L132 36 C124 27 110 24 100 30 Z"
        fill={color}
      />
      <path d="M80 36 L98 46 L84 52 Z" fill="rgba(0,0,0,0.25)" />
      <path d="M120 36 L102 46 L116 52 Z" fill="rgba(0,0,0,0.25)" />
      <path d="M100 30 L100 60" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
      <path d="M100 46 L100 192" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
      <circle cx="100" cy="72" r="2.2" fill="rgba(0,0,0,0.45)" />
      <circle cx="100" cy="92" r="2.2" fill="rgba(0,0,0,0.45)" />
      <circle cx="100" cy="112" r="2.2" fill="rgba(0,0,0,0.45)" />
      <rect x="92" y="132" width="16" height="14" rx="2" fill="rgba(255,255,255,0.22)" />
      <path d="M42 186 L158 186" stroke="rgba(0,0,0,0.22)" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function HoodieIcon(color: string) {
  return (
    <>
      <path
        d="M100 34 C88 28 74 30 66 38 L56 44 L22 60 C14 64 10 72 12 78 L16 86 L34 96 L36 100 L36 180 C36 188 42 194 50 194 L150 194 C158 194 164 188 164 180 L164 100 L166 96 L184 86 L188 78 C190 72 186 64 178 60 L144 44 L134 38 C126 30 112 28 100 34 Z"
        fill={color}
      />
      <path
        d="M74 42 C66 24 134 24 126 42 C132 52 130 62 120 64 C110 52 90 52 80 64 C70 62 68 52 74 42 Z"
        fill="rgba(0,0,0,0.3)"
      />
      <path d="M96 50 L97 64" stroke="rgba(0,0,0,0.45)" strokeWidth="2" strokeLinecap="round" />
      <path d="M104 50 L103 64" stroke="rgba(0,0,0,0.45)" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M70 132 C70 148 84 156 100 156 C116 156 130 148 130 132 L122 130 L78 130 Z"
        fill="rgba(0,0,0,0.22)"
      />
      <path d="M42 188 L158 188" stroke="rgba(0,0,0,0.2)" strokeWidth="2" strokeLinecap="round" />
      <path d="M40 106 L48 104" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M160 106 L152 104" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" strokeLinecap="round" />
    </>
  );
}

function TrousersIcon(color: string) {
  return (
    <>
      <path
        d="M48 26 C48 20 54 16 60 16 L140 16 C146 16 152 20 152 26 L152 56 L148 56 L148 180 L110 180 L110 98 L90 98 L90 180 L52 180 L52 56 L48 56 Z"
        fill={color}
      />
      <rect x="48" y="16" width="104" height="12" rx="2" fill="rgba(0,0,0,0.28)" />
      <path d="M100 16 L100 44" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
      <path d="M58 92 L86 92" stroke="rgba(0,0,0,0.2)" strokeWidth="2" strokeLinecap="round" />
      <path d="M142 92 L114 92" stroke="rgba(0,0,0,0.2)" strokeWidth="2" strokeLinecap="round" />
      <path d="M56 176 L110 176" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" />
      <path d="M144 176 L90 176" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function ShortsIcon(color: string) {
  return (
    <>
      <path
        d="M48 26 C48 20 54 16 60 16 L140 16 C146 16 152 20 152 26 L152 52 L148 52 L148 100 L110 100 L110 82 L90 82 L90 100 L52 100 L52 52 L48 52 Z"
        fill={color}
      />
      <rect x="48" y="16" width="104" height="12" rx="2" fill="rgba(0,0,0,0.28)" />
      <path d="M100 16 L100 44" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
      <path d="M58 94 L84 94" stroke="rgba(0,0,0,0.2)" strokeWidth="2" strokeLinecap="round" />
      <path d="M142 94 L116 94" stroke="rgba(0,0,0,0.2)" strokeWidth="2" strokeLinecap="round" />
      <path d="M56 96 L110 96" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" />
      <path d="M144 96 L90 96" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function JacketIcon(color: string) {
  return (
    <>
      <path
        d="M100 30 C90 24 76 27 68 36 L58 42 L20 62 C12 66 8 74 10 80 L14 88 L32 98 L34 102 L34 178 C34 186 40 192 48 192 L152 192 C160 192 166 186 166 178 L166 102 L168 98 L186 88 L190 80 C192 74 188 66 180 62 L142 42 L132 36 C124 27 110 24 100 30 Z"
        fill={color}
      />
      <path d="M82 36 L100 48 L86 54 Z" fill="rgba(0,0,0,0.25)" />
      <path d="M118 36 L100 48 L114 54 Z" fill="rgba(0,0,0,0.25)" />
      <path d="M100 30 L100 190" stroke="rgba(0,0,0,0.35)" strokeWidth="2.5" />
      <rect x="96" y="150" width="8" height="14" rx="2" fill="rgba(255,255,255,0.4)" />
      <path d="M100 44 L100 70" stroke="rgba(255,255,255,0.6)" strokeWidth="4" strokeLinecap="round" />
      <path d="M42 186 L158 186" stroke="rgba(0,0,0,0.22)" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

const ICONS: Record<Category, (color: string) => ReactNode> = {
  "t-shirts": TeeIcon,
  shirts: ShirtIcon,
  hoodies: HoodieIcon,
  trousers: TrousersIcon,
  shorts: ShortsIcon,
  jackets: JacketIcon,
};

export default function ProductImage({
  category,
  color,
  className,
}: {
  category: Category;
  color: string;
  className?: string;
}) {
  const icon = ICONS[category] ?? TeeIcon;
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <circle cx="100" cy="104" r="78" fill={color} opacity="0.1" />
      {icon(color)}
    </svg>
  );
}
