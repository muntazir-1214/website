"use client";

// ─── Bar Chart (vertical) ────────────────────────────────────────────

type BarChartProps = {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  showValues?: boolean;
};

export function BarChart({ data, height = 200, showValues = true }: BarChartProps) {
  if (data.length === 0) return <EmptyChart />;
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const barWidth = Math.min(48, Math.floor(400 / data.length));
  const gap = Math.max(6, Math.floor((400 - barWidth * data.length) / (data.length + 1)));
  const totalWidth = barWidth * data.length + gap * (data.length + 1);
  const defaultColors = [
    "#a3e635", "#22d3ee", "#f472b6", "#fb923c", "#a78bfa",
    "#34d399", "#f87171", "#fbbf24", "#60a5fa", "#e879f9",
  ];

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${totalWidth} ${height + 40}`}
        className="w-full"
        style={{ minWidth: totalWidth, maxHeight: height + 40 }}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
          <line
            key={frac}
            x1={0}
            y1={height - height * frac}
            x2={totalWidth}
            y2={height - height * frac}
            stroke="#27272a"
            strokeWidth="1"
          />
        ))}

        {/* Bars */}
        {data.map((d, i) => {
          const barH = maxVal > 0 ? (d.value / maxVal) * (height - 10) : 0;
          const x = gap + i * (barWidth + gap);
          const y = height - barH;
          const color = d.color || defaultColors[i % defaultColors.length];

          return (
            <g key={`bar-${i}`}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx={4}
                fill={color}
                opacity={0.85}
              />
              {showValues && (
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  className="fill-zinc-400"
                  fontSize="10"
                >
                  {d.value}
                </text>
              )}
              <text
                x={x + barWidth / 2}
                y={height + 16}
                textAnchor="middle"
                className="fill-zinc-500"
                fontSize="9"
              >
                {d.label.length > 8 ? d.label.slice(0, 7) + "…" : d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Horizontal Bar ──────────────────────────────────────────────────

type HorizontalBarProps = {
  data: { label: string; value: number; color?: string }[];
  height?: number;
};

export function HorizontalBar({ data, height = 30 }: HorizontalBarProps) {
  if (data.length === 0) return <EmptyChart />;
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const defaultColors = [
    "#a3e635", "#22d3ee", "#f472b6", "#fb923c", "#a78bfa",
    "#34d399", "#f87171", "#fbbf24", "#60a5fa", "#e879f9",
  ];

  return (
    <div className="space-y-2">
      {data.map((d, i) => {
        const pct = maxVal > 0 ? (d.value / maxVal) * 100 : 0;
        const color = d.color || defaultColors[i % defaultColors.length];
        return (
          <div key={`hbar-${i}`} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs text-zinc-400 truncate text-right">
              {d.label}
            </span>
            <div className="relative flex-1">
              <div className="h-6 rounded-md bg-zinc-800/50">
                <div
                  className="h-full rounded-md transition-all duration-700 ease-out"
                  style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.8 }}
                />
              </div>
            </div>
            <span className="w-12 shrink-0 text-xs font-semibold text-zinc-300 text-right">
              {d.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Donut Chart ─────────────────────────────────────────────────────

type DonutChartProps = {
  data: { label: string; value: number; color?: string }[];
  size?: number;
  thickness?: number;
  innerLabel?: string;
  innerSublabel?: string;
};

export function DonutChart({
  data,
  size = 180,
  thickness = 24,
  innerLabel,
  innerSublabel,
}: DonutChartProps) {
  if (data.length === 0) return <EmptyChart />;
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <EmptyChart />;

  const radius = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const defaultColors = [
    "#a3e635", "#22d3ee", "#f472b6", "#fb923c", "#a78bfa",
    "#34d399", "#f87171", "#fbbf24",
  ];

  let cumulative = 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width={size} height={size}>
          {data.map((d, i) => {
            const pct = d.value / total;
            const dashLength = pct * circumference;
            const dashOffset = -cumulative * circumference;
            cumulative += pct;
            const color = d.color || defaultColors[i % defaultColors.length];

            return (
              <circle
                key={`donut-${i}`}
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={thickness}
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${cx} ${cy})`}
                opacity={0.85}
              />
            );
          })}
        </svg>
        {innerLabel && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl tracking-wide text-zinc-50">
              {innerLabel}
            </span>
            {innerSublabel && (
              <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                {innerSublabel}
              </span>
            )}
          </div>
        )}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3">          {data.map((d, i) => {
          const color = d.color || defaultColors[i % defaultColors.length];
          return (
            <div key={`legend-${i}`} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-[11px] text-zinc-400">
                {d.label} ({d.value})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Line / Area Chart ───────────────────────────────────────────────

type LineChartProps = {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  showArea?: boolean;
  showDots?: boolean;
};

export function LineChart({
  data,
  height = 160,
  color = "#a3e635",
  showArea = true,
  showDots = true,
}: LineChartProps) {
  if (data.length === 0) return <EmptyChart />;
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const padding = { top: 20, right: 10, bottom: 28, left: 40 };
  const w = 500;
  const h = height;
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  const points = data.map((d, i) => ({
    x: padding.left + (i / Math.max(data.length - 1, 1)) * chartW,
    y: padding.top + chartH - (d.value / maxVal) * chartH,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  // Y-axis ticks
  const yTicks = [0, 0.5, 1].map((f, i) => ({
    y: padding.top + chartH - f * chartH,
    label: Math.round(maxVal * f),
    key: i,
  }));

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h + 10}`} className="w-full" style={{ maxHeight: h + 10 }}>
        {/* Grid */}
        {yTicks.map((t) => (
          <g key={t.key}>
            <line
              x1={padding.left}
              y1={t.y}
              x2={w - padding.right}
              y2={t.y}
              stroke="#27272a"
              strokeWidth="1"
            />
            <text
              x={padding.left - 6}
              y={t.y + 3}
              textAnchor="end"
              className="fill-zinc-600"
              fontSize="9"
            >
              {t.label}
            </text>
          </g>
        ))}

        {/* Area */}
        {showArea && (
          <path
            d={areaD}
            fill={color}
            opacity={0.12}
          />
        )}

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Dots */}
        {showDots &&
          points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={3}
              fill={color}
              stroke="#09090b"
              strokeWidth="1.5"
            />
          ))}

        {/* X-axis labels */}
        {points.map((p, i) => {
          const show = data.length <= 14 || i % Math.ceil(data.length / 7) === 0;
          if (!show) return null;
          return (
            <text
              key={i}
              x={p.x}
              y={h + 14}
              textAnchor="middle"
              className="fill-zinc-500"
              fontSize="8"
            >
              {data[i].label.slice(5)}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────

export function StatCard({
  label,
  value,
  sub,
  icon,
  color = "text-lime-400",
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: string;
  color?: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition-all hover:border-zinc-700">
      <div className="flex items-center justify-between">
        <span className="text-xl">{icon}</span>
      </div>
      <p className={`mt-3 font-display text-3xl tracking-wide text-zinc-50`}>
        {value}
      </p>
      <p className="text-xs uppercase tracking-widest text-zinc-500">{label}</p>
      {sub && <p className="mt-1 text-xs text-zinc-600">{sub}</p>}
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────

function EmptyChart() {
  return (
    <div className="flex h-32 items-center justify-center rounded-xl border border-zinc-800/50 bg-zinc-900/30">
      <p className="text-sm text-zinc-600">No data available</p>
    </div>
  );
}
