"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function LessonNote({
  emoji = "💡",
  title,
  children,
  lessonSlug,
  lessonLabel,
  tone = "default",
}: {
  emoji?: string;
  title?: string;
  children: ReactNode;
  lessonSlug?: string;
  lessonLabel?: string;
  tone?: "default" | "danger" | "good";
}) {
  const bg =
    tone === "danger"
      ? "#ffeaea"
      : tone === "good"
        ? "#eaf6f0"
        : "#fffaf0";
  const border =
    tone === "danger"
      ? "#f1b4b4"
      : tone === "good"
        ? "#bfe1cd"
        : "#eadcc1";
  const dotBg =
    tone === "danger"
      ? "var(--spel-red)"
      : tone === "good"
        ? "var(--spel-mint)"
        : "var(--spel-gold)";
  return (
    <div
      className="rounded-2xl border p-5 sm:p-6"
      style={{ background: bg, borderColor: border }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg"
          style={{ background: dotBg, color: "white" }}
          aria-hidden
        >
          {emoji}
        </div>
        <div className="min-w-0">
          {title && (
            <div className="text-[13px] font-bold uppercase tracking-wider text-[var(--spel-ink)]">
              {title}
            </div>
          )}
          <div className="text-sm leading-relaxed text-[var(--spel-ink)]">
            {children}
          </div>
          {lessonSlug && lessonLabel && (
            <Link
              href={`/lektioner/${lessonSlug}`}
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold"
              style={{ color: "var(--spel-red)" }}
            >
              → {lessonLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
