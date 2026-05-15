"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

/**
 * Visar en celebration-overlay i 3 sekunder med konfetti-emojis och text.
 * Triggas via `show`-prop. När den slutar visa kallar den `onDone`.
 */
export function Celebration({
  show,
  title,
  message,
  onDone,
}: {
  show: boolean;
  title: string;
  message: string;
  onDone?: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        onDone?.();
      }, 3500);
      return () => clearTimeout(t);
    }
  }, [show, onDone]);

  if (!visible) return null;

  const confettis = ["🎉", "🎊", "✨", "⭐", "🌟", "💫", "🥳", "🎈"];

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="relative">
        <div className="pointer-events-auto rounded-2xl border-2 border-primary/40 bg-white px-8 py-6 text-center shadow-2xl">
          <div className="text-4xl">🎉</div>
          <div className="mt-2 text-xl font-bold text-neutral-900">{title}</div>
          <div className="mt-1 max-w-sm text-sm text-neutral-600">{message}</div>
        </div>
        {/* Confetti scattered around */}
        {confettis.map((emoji, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={cn(
              "absolute text-2xl",
              "animate-bounce",
            )}
            style={{
              top: `${-30 + (i * 13) % 80}%`,
              left: `${-20 + (i * 19) % 120}%`,
              animationDelay: `${(i * 100) % 800}ms`,
              animationDuration: `${1500 + (i * 100) % 600}ms`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
}
