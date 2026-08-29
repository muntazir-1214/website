"use client";

export default function HeroStats({
  stats,
}: {
  stats: { value: string; label: string }[];
}) {
  return (
    <>
      {stats.map((s) => (
        <div key={s.label}>
          <p className="font-display text-3xl text-lime-400">{s.value}</p>
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            {s.label}
          </p>
        </div>
      ))}
    </>
  );
}
