"use client";

import Link from "next/link";

import { AllocationSection } from "@/components/simulator/AllocationSection";
import { CrashTestSection } from "@/components/simulator/CrashTestSection";
import { ExpandableCard } from "@/components/simulator/ExpandableCard";
import { ISKTaxSection } from "@/components/simulator/ISKTaxSection";
import { ScreenerSection } from "@/components/simulator/ScreenerSection";
import { StressTestSection } from "@/components/simulator/StressTestSection";
import { TimeMachineSection } from "@/components/simulator/TimeMachineSection";
import type { Portfolio } from "@/lib/portfolio";
import type { Instrument } from "@/lib/prices";

export function AnalysisTab({
  portfolio,
  instruments,
  stocks,
  initialExpand,
  onSavePledge,
}: {
  portfolio: Portfolio;
  instruments: Instrument[];
  stocks: Instrument[];
  initialExpand?: string;
  onSavePledge?: (text: string) => void;
}) {
  const openByDefault = (id: string) =>
    initialExpand ? id === initialExpand : id === "tidsmaskin";

  return (
    <div className="space-y-8 py-2">
      <p className="text-sm text-neutral-500">
        Verktygen är grupperade i <strong>Förstå risk</strong> (lektion 4–6)
        och <strong>Strategier &amp; planering</strong> (lektion 7–9). Alla är
        icke-destruktiva — de ändrar inte din portfölj.
      </p>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Förstå risk
        </h2>
        <div className="space-y-3">
          <ExpandableCard
            title="Tidsmaskinen"
            subtitle="Rulla portföljen framåt och se ränta-på-ränta över decennier"
            icon="⏩"
            badge="Lektion 4"
            lessonHref="/lektioner/04-ranta-pa-ranta"
            defaultOpen={openByDefault("tidsmaskin")}
          >
            <TimeMachineSection
              portfolio={portfolio}
              instruments={instruments}
              embedded
            />
            <SpelLinkRow
              href="/spel/snoboll"
              label="Spela 'Snöbollsbacken'"
              hint="Släpp snöbollen — stå emot frestelserna i 30 år."
            />
          </ExpandableCard>

          <ExpandableCard
            title="Krasch-läge"
            subtitle="Applicera en historisk börskrasch på din portfölj"
            icon="📉"
            badge="Lektion 5"
            lessonHref="/lektioner/05-risk"
            defaultOpen={openByDefault("crash")}
          >
            <CrashTestSection
              portfolio={portfolio}
              instruments={instruments}
              onSavePledge={onSavePledge}
              embedded
            />
            <SpelLinkRow
              href="/spel/berget"
              label="Spela 'Bergsbestigningen'"
              hint="Skåne, Kebnekaise eller Everest — hur högt vågar du?"
            />
          </ExpandableCard>

          <ExpandableCard
            title="Allokering & Sharpe"
            subtitle="Hur är din kärna/krydda-balans — och vad ger den i Sharpe?"
            icon="🥧"
            badge="Lektion 6"
            lessonHref="/lektioner/06-diversifiering"
            defaultOpen={openByDefault("allocation")}
          >
            <AllocationSection
              portfolio={portfolio}
              instruments={instruments}
              embedded
            />
            <SpelLinkRow
              href="/spel/lagdraften"
              label="Spela 'Lagdraften'"
              hint="Drafta 11 bolag — försvar, mittfält, anfall."
            />
          </ExpandableCard>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Strategier &amp; planering
        </h2>
        <div className="space-y-3">
          <ExpandableCard
            title="ISK-skattevy"
            subtitle="Räkna fram din schablonskatt och jämför med AF"
            icon="🧾"
            badge="Lektion 7"
            lessonHref="/lektioner/07-isk-vs-af-vs-kf"
            defaultOpen={openByDefault("isk")}
          >
            <ISKTaxSection
              portfolio={portfolio}
              instruments={instruments}
              embedded
            />
            <SpelLinkRow
              href="/spel/lagenheter"
              label="Spela 'Tre lägenheter'"
              hint="Sortera pengar mellan ISK, KF och AF."
            />
          </ExpandableCard>

          <ExpandableCard
            title="Aktiescreener"
            subtitle="Filtrera de 16 aktierna efter fundamentala nyckeltal"
            icon="🔎"
            badge="Lektion 8"
            lessonHref="/lektioner/08-nyckeltal"
            defaultOpen={openByDefault("screener")}
          >
            <ScreenerSection stocks={stocks} embedded />
            <SpelLinkRow
              href="/spel/bilbesiktning"
              label="Spela 'Bilbesiktningen'"
              hint="Lys upp nyckeltalen — vilka 3 bolag köper du?"
            />
          </ExpandableCard>

          <ExpandableCard
            title="Stresstest"
            subtitle="Träna på att inte sälja på fel ställe"
            icon="🧠"
            badge="Lektion 9"
            lessonHref="/lektioner/09-psykologi"
            defaultOpen={openByDefault("stresstest")}
          >
            <StressTestSection
              portfolio={portfolio}
              instruments={instruments}
              embedded
            />
            <SpelLinkRow
              href="/spel/panik"
              label="Spela 'Motstå panik-knappen'"
              hint="Skärmen blir röd — klickar du?"
            />
          </ExpandableCard>
        </div>
      </section>
    </div>
  );
}

function SpelLinkRow({
  href,
  label,
  hint,
}: {
  href: string;
  label: string;
  hint: string;
}) {
  return (
    <Link
      href={href}
      className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 transition-colors hover:bg-amber-100"
    >
      <div>
        <div className="text-sm font-semibold text-amber-900">🎮 {label}</div>
        <div className="text-xs text-amber-800">{hint}</div>
      </div>
      <span aria-hidden="true" className="text-amber-700">
        →
      </span>
    </Link>
  );
}
