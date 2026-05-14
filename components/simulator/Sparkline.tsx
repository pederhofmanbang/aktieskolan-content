"use client";

import { cn } from "@/lib/cn";

/**
 * Liten radvis kurva av senaste priser. Inga axlar, ingen interaktivitet —
 * bara en vink om riktningen. Färgkodas grön/röd beroende på om sista
 * priset är högre än första.
 */
export function Sparkline({
  data,
  width = 96,
  height = 28,
  className,
}: {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
}) {
  if (data.length < 2) {
    return (
      <div
        style={{ width, height }}
        className={cn("text-xs text-neutral-400", className)}
        aria-hidden="true"
      />
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const isUp = data[data.length - 1] >= data[0];
  const colorClass = isUp ? "text-primary-dark" : "text-red-600";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", colorClass, className)}
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
