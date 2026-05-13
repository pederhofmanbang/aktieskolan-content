import type { ReactNode } from "react";

export function ModuleHeader({
  moduleNumber,
  act,
  emoji,
  title,
  intro,
}: {
  moduleNumber: number;
  act?: string;
  emoji: string;
  title: string;
  intro: ReactNode;
}) {
  return (
    <header className="max-w-2xl">
      <div
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--spel-red)" }}
      >
        Modul {moduleNumber}
        {act ? ` · ${act}` : ""}
      </div>
      <h1
        className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
        style={{ color: "var(--spel-ink)" }}
      >
        <span className="mr-2" aria-hidden>
          {emoji}
        </span>
        {title}
      </h1>
      <p className="mt-3 text-base" style={{ color: "var(--spel-ink-muted)" }}>
        {intro}
      </p>
    </header>
  );
}
