"use client";

import { cn } from "@/lib/cn";

export type Character =
  | "mr-market-manic"
  | "mr-market-neutral"
  | "mr-market-depressed"
  | "buffett"
  | "anna-snowball"
  | "wallenberg";

type CharacterStyle = {
  emoji: string;
  name: string;
  bg: string;
  border: string;
  text: string;
  ring: string;
};

const STYLES: Record<Character, CharacterStyle> = {
  "mr-market-manic": {
    emoji: "🤩",
    name: "Mr Market",
    bg: "bg-pink-50",
    border: "border-pink-300",
    text: "text-pink-900",
    ring: "ring-pink-300",
  },
  "mr-market-neutral": {
    emoji: "😐",
    name: "Mr Market",
    bg: "bg-neutral-50",
    border: "border-neutral-300",
    text: "text-neutral-900",
    ring: "ring-neutral-300",
  },
  "mr-market-depressed": {
    emoji: "😩",
    name: "Mr Market",
    bg: "bg-blue-50",
    border: "border-blue-300",
    text: "text-blue-900",
    ring: "ring-blue-300",
  },
  buffett: {
    emoji: "🎩",
    name: "Warren Buffett",
    bg: "bg-amber-50",
    border: "border-amber-300",
    text: "text-amber-900",
    ring: "ring-amber-300",
  },
  "anna-snowball": {
    emoji: "❄️",
    name: "Anna (snöbollen)",
    bg: "bg-sky-50",
    border: "border-sky-300",
    text: "text-sky-900",
    ring: "ring-sky-300",
  },
  wallenberg: {
    emoji: "🎩",
    name: "Familjen Wallenberg",
    bg: "bg-emerald-50",
    border: "border-emerald-300",
    text: "text-emerald-900",
    ring: "ring-emerald-300",
  },
};

/**
 * Pratbubbla från en av Aktieskolans återkommande karaktärer.
 * Använd för att förklara, varna eller kommentera pedagogiskt.
 */
export function Speech({
  character,
  children,
  className,
}: {
  character: Character;
  children: React.ReactNode;
  className?: string;
}) {
  const s = STYLES[character];
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3",
        s.bg,
        s.border,
        className,
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-lg shadow-sm ring-1",
          s.ring,
        )}
        aria-hidden="true"
      >
        {s.emoji}
      </div>
      <div className={cn("flex-1 text-sm leading-relaxed", s.text)}>
        <div className="text-xs font-semibold uppercase tracking-wider opacity-70">
          {s.name}
        </div>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  );
}
