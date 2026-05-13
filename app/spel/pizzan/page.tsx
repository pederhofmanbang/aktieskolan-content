import { SpelLayout } from "@/components/spel/SpelLayout";
import { PizzanModule } from "@/components/spel/modul-1-pizzan/PizzanModule";
import scenarioData from "@/content/spel/scenarios/modul-1-pizzan.json";
import type { Scenario } from "@/lib/spel/types";

export const metadata = {
  title: "Pizzan – Aktieskolan Spel",
  description:
    "Du är 25 år, har 50 000 kr och en idé. Hur finansierar du din pizzeria?",
};

const scenarios = scenarioData.scenarios as Scenario[];

export default function PizzanPage() {
  return (
    <SpelLayout backHref="/spel" backLabel="Alla spelmoduler">
      <header className="max-w-2xl">
        <div
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--spel-red)" }}
        >
          Modul 1 · Akt 1
        </div>
        <h1
          className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
          style={{ color: "var(--spel-ink)" }}
        >
          🍕 Dela pizzan
        </h1>
        <p
          className="mt-3 text-base"
          style={{ color: "var(--spel-ink-muted)" }}
        >
          Du är 25 år. Du har 50 000 kr i sparpengar. Du vill starta en pizzeria
          i Hammarby Sjöstad. Sex beslut väntar — varje val förändrar ditt
          ägande, kassan och röststyrkan.
        </p>
      </header>

      <div className="mt-10">
        <PizzanModule scenarios={scenarios} />
      </div>
    </SpelLayout>
  );
}
