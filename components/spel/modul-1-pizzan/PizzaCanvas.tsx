"use client";

import { useMemo } from "react";

type Slice = {
  id: string;
  start: number;
  end: number;
  color: string;
  label: string;
};

export function PizzaCanvas({
  ownership,
  size = 280,
}: {
  ownership: number;
  size?: number;
}) {
  const yours = Math.max(0, Math.min(100, ownership));
  const others = 100 - yours;

  const slices: Slice[] = useMemo(() => {
    if (yours >= 100) {
      return [
        {
          id: "you",
          start: 0,
          end: 100,
          color: "var(--spel-red)",
          label: "Du",
        },
      ];
    }
    if (yours <= 0) {
      return [
        {
          id: "others",
          start: 0,
          end: 100,
          color: "#c5beb3",
          label: "Andra",
        },
      ];
    }
    return [
      { id: "you", start: 0, end: yours, color: "var(--spel-red)", label: "Du" },
      {
        id: "others",
        start: yours,
        end: 100,
        color: "#c5beb3",
        label: "Andra ägare",
      },
    ];
  }, [yours]);

  const r = 42;
  const center = 50;

  function arcPath(start: number, end: number): string {
    // start/end in 0..100
    if (end - start >= 99.999) {
      return `M ${center - r} ${center} A ${r} ${r} 0 1 1 ${center + r} ${center} A ${r} ${r} 0 1 1 ${center - r} ${center} Z`;
    }
    const startAngle = (start / 100) * 2 * Math.PI - Math.PI / 2;
    const endAngle = (end / 100) * 2 * Math.PI - Math.PI / 2;
    const x1 = center + r * Math.cos(startAngle);
    const y1 = center + r * Math.sin(startAngle);
    const x2 = center + r * Math.cos(endAngle);
    const y2 = center + r * Math.sin(endAngle);
    const largeArc = end - start > 50 ? 1 : 0;
    return `M ${center} ${center} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  }

  // 10 slice guides (visual texture — pizza cut into 10)
  const guides = Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * 2 * Math.PI - Math.PI / 2;
    return {
      x1: center,
      y1: center,
      x2: center + r * Math.cos(angle),
      y2: center + r * Math.sin(angle),
    };
  });

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="block h-full w-full">
        <defs>
          <radialGradient id="crust" cx="50%" cy="50%" r="50%">
            <stop offset="85%" stopColor="#e9b949" stopOpacity="0" />
            <stop offset="100%" stopColor="#a06621" stopOpacity="0.5" />
          </radialGradient>
        </defs>
        {/* crust shadow */}
        <circle cx={center} cy={center} r={r + 3} fill="#c8941f" />
        {/* base */}
        <circle cx={center} cy={center} r={r} fill="#f9d77b" />
        {/* slices */}
        {slices.map((s) => (
          <path
            key={s.id}
            d={arcPath(s.start, s.end)}
            fill={s.color}
            opacity={s.id === "others" ? 0.55 : 1}
            style={{ transition: "all 600ms ease-out" }}
          />
        ))}
        {/* slice guides (dividers between 10 bitar) */}
        {guides.map((g, i) => (
          <line
            key={i}
            x1={g.x1}
            y1={g.y1}
            x2={g.x2}
            y2={g.y2}
            stroke="#a06621"
            strokeWidth="0.25"
            opacity="0.35"
          />
        ))}
        {/* crust ring */}
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="#a06621"
          strokeWidth="1.5"
        />
        <circle cx={center} cy={center} r={r} fill="url(#crust)" />
        {/* center label */}
        <circle cx={center} cy={center} r="11" fill="white" stroke="#eadcc1" strokeWidth="0.5" />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
          Din andel
        </div>
        <div
          className="text-xl font-bold tabular-nums"
          style={{ color: yours < 51 ? "var(--spel-gold-dark)" : "var(--spel-red)" }}
        >
          {yours.toFixed(0)} %
        </div>
      </div>
      {/* legend */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs">
        <Legend color="var(--spel-red)" label={`Du · ${yours.toFixed(0)} %`} />
        {others > 0 && (
          <Legend color="#c5beb3" label={`Andra · ${others.toFixed(0)} %`} />
        )}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[var(--spel-ink-muted)]">
      <span
        className="inline-block h-2.5 w-2.5 rounded-sm"
        style={{ background: color }}
      />
      <span>{label}</span>
    </div>
  );
}
