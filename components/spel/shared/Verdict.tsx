"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function Verdict({
  won,
  title,
  summary,
  next,
  onRestart,
  children,
}: {
  won: boolean;
  title: string;
  summary: ReactNode;
  next?: { href: string; label: string };
  onRestart?: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="spel-rise space-y-6">
      <div className="spel-card p-6 sm:p-8">
        <div
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: won ? "var(--spel-mint-dark)" : "var(--spel-red)" }}
        >
          {won ? "Du klarade det" : "Tappade kontrollen"}
        </div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--spel-ink)] sm:text-3xl">
          {title}
        </h2>
        <div className="mt-3 text-[15px] leading-relaxed text-[var(--spel-ink-muted)]">
          {summary}
        </div>
      </div>
      {children}
      <div className="flex flex-wrap items-center justify-end gap-3">
        {onRestart && (
          <button type="button" onClick={onRestart} className="spel-btn-ghost">
            ↺ Spela om
          </button>
        )}
        <Link href={next?.href ?? "/spel"} className="spel-btn-primary inline-block">
          {next?.label ?? "Tillbaka till spelöversikten →"}
        </Link>
      </div>
    </div>
  );
}
