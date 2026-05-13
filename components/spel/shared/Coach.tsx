"use client";

import Link from "next/link";

import type { Choice } from "@/lib/spel/types";

export function Coach({ choice }: { choice: Choice }) {
  return (
    <div className="rounded-2xl border border-[#eadcc1] bg-[#fffaf0] p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg"
          style={{ background: "var(--spel-gold)" }}
          aria-hidden
        >
          💡
        </div>
        <div className="min-w-0">
          {choice.outcome && (
            <p className="text-[15px] font-medium leading-snug text-[var(--spel-ink)]">
              {choice.outcome}
            </p>
          )}
          {choice.pedagogicalNote && (
            <p className="mt-2 text-sm leading-relaxed text-[var(--spel-ink-muted)]">
              {choice.pedagogicalNote}
            </p>
          )}
          {choice.lessonLink && (
            <Link
              href={`/lektioner/${choice.lessonLink.lessonSlug}`}
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold"
              style={{ color: "var(--spel-red)" }}
            >
              → {choice.lessonLink.label}
            </Link>
          )}
          {choice.isOptimal && (
            <div
              className="mt-3 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{ background: "var(--spel-mint)", color: "white" }}
            >
              Lektion-optimalt
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
