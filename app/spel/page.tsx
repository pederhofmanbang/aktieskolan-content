import Link from "next/link";

import { SpelLayout } from "@/components/spel/SpelLayout";
import { MODULES } from "@/lib/spel/modules";

export const metadata = {
  title: "Spel – Aktieskolan",
  description:
    "Tio spelmoduler som tar dig från entreprenör till investerare. En per lektion.",
};

export default function SpelOversikt() {
  return (
    <SpelLayout backHref="/" backLabel="Aktieskolan">
      <header className="max-w-2xl">
        <div
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--spel-red)" }}
        >
          Spelmodulen
        </div>
        <h1
          className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl"
          style={{ color: "var(--spel-ink)" }}
        >
          Bli bolagsägare. <br />
          <span style={{ color: "var(--spel-red)" }}>Och sen investerare.</span>
        </h1>
        <p
          className="mt-4 text-base sm:text-lg"
          style={{ color: "var(--spel-ink-muted)" }}
        >
          Tio spelmoduler — en per lektion. Du börjar med att starta en pizzeria,
          slutar som långsiktig investerare. Klara en lektion → lås upp modulen.
        </p>
      </header>

      <ol className="mt-10 grid gap-4 sm:grid-cols-2">
        {MODULES.map((m) => {
          const isAvailable = m.status === "available";
          const card = (
            <div
              className="spel-card group h-full p-5 transition-all sm:p-6"
              style={{
                opacity: isAvailable ? 1 : 0.55,
                borderRadius: "1.25rem",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-2xl"
                    style={{
                      background: isAvailable ? "#fff3d6" : "#eadcc1",
                    }}
                    aria-hidden
                  >
                    {m.emoji}
                  </div>
                  <div className="min-w-0">
                    <div
                      className="text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: "var(--spel-ink-muted)" }}
                    >
                      Modul {m.number} · {m.estMinutes} min
                    </div>
                    <div
                      className="text-base font-bold leading-tight"
                      style={{ color: "var(--spel-ink)" }}
                    >
                      {m.title}
                    </div>
                  </div>
                </div>
                {!isAvailable && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: "#eadcc1", color: "var(--spel-ink-muted)" }}
                  >
                    🔒 Kommer
                  </span>
                )}
              </div>
              <p
                className="mt-3 text-sm"
                style={{ color: "var(--spel-ink-muted)" }}
              >
                {m.subtitle}
              </p>
              <div
                className="mt-4 text-xs"
                style={{ color: "var(--spel-ink-muted)" }}
              >
                Kopplar till{" "}
                <Link
                  href={`/lektioner/${m.lessonSlug}`}
                  className="underline hover:no-underline"
                  style={{ color: "var(--spel-ink)" }}
                >
                  lektion {m.number}
                </Link>
              </div>
            </div>
          );

          return (
            <li key={m.id}>
              {isAvailable ? (
                <Link
                  href={`/spel/${m.id}`}
                  className="block transition-transform hover:-translate-y-0.5"
                >
                  {card}
                </Link>
              ) : (
                <div>{card}</div>
              )}
            </li>
          );
        })}
      </ol>

      <div
        className="spel-card mt-10 p-6 text-sm sm:p-8"
        style={{ color: "var(--spel-ink-muted)" }}
      >
        <div
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--spel-red)" }}
        >
          Akt-strukturen
        </div>
        <p className="mt-2 leading-relaxed">
          Modulerna är samlade i fyra akter som speglar en ekonomisk livsbåge:{" "}
          <strong style={{ color: "var(--spel-ink)" }}>entreprenör</strong> →{" "}
          <strong style={{ color: "var(--spel-ink)" }}>bolagsägare</strong> →{" "}
          <strong style={{ color: "var(--spel-ink)" }}>börsbolag</strong> →{" "}
          <strong style={{ color: "var(--spel-ink)" }}>investerare</strong>. Akt 1
          (Pizzan) är spelbar nu. Resten låses upp i takt med att du tar dig
          igenom lektionerna.
        </p>
      </div>
    </SpelLayout>
  );
}
