import Link from "next/link";
import type { ReactNode } from "react";

import "@/app/spel/spel.css";

export function SpelLayout({
  children,
  backHref,
  backLabel,
}: {
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="spel-root">
      <header className="border-b border-[#eadcc1]/60 bg-[#f5ebd7]/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <Link
            href={backHref ?? "/"}
            className="text-sm font-medium text-[var(--spel-ink-muted)] transition-colors hover:text-[var(--spel-ink)]"
          >
            ← {backLabel ?? "Tillbaka"}
          </Link>
          <Link
            href="/spel"
            className="text-sm font-semibold tracking-tight text-[var(--spel-ink)]"
          >
            Aktieskolan · <span style={{ color: "var(--spel-red)" }}>Spel</span>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10 sm:py-14">{children}</main>
    </div>
  );
}
