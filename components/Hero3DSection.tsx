"use client";

import dynamic from "next/dynamic";

const Hero3D = dynamic(() => import("@/components/Hero3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center md:h-[540px]">
      <div className="h-40 w-40 animate-pulse rounded-full bg-lime-400/10 blur-2xl" />
    </div>
  ),
});

export default function Hero3DSection() {
  return <Hero3D />;
}
