"use client";

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
}: {
  portfolio: Portfolio;
  instruments: Instrument[];
  stocks: Instrument[];
}) {
  return (
    <div className="space-y-3 py-2">
      <p className="text-sm text-neutral-500">
        Klicka på ett kort för att öppna verktyget. Alla analyser är{" "}
        <strong>icke-destruktiva</strong> — de ändrar inte din portfölj.
      </p>

      <ExpandableCard
        title="Tidsmaskinen"
        subtitle="Rulla portföljen framåt och se ränta-på-ränta över decennier"
        icon="⏩"
        badge="Lektion 4"
        defaultOpen
      >
        <TimeMachineSection portfolio={portfolio} instruments={instruments} embedded />
      </ExpandableCard>

      <ExpandableCard
        title="Krasch-läge"
        subtitle="Applicera en historisk börskrasch på din portfölj"
        icon="📉"
        badge="Lektion 5"
      >
        <CrashTestSection portfolio={portfolio} instruments={instruments} embedded />
      </ExpandableCard>

      <ExpandableCard
        title="Allokering & Sharpe"
        subtitle="Hur är din kärna/krydda-balans — och vad ger den i Sharpe?"
        icon="🥧"
        badge="Lektion 6"
      >
        <AllocationSection portfolio={portfolio} instruments={instruments} embedded />
      </ExpandableCard>

      <ExpandableCard
        title="ISK-skattevy"
        subtitle="Räkna fram din schablonskatt och jämför med AF"
        icon="🧾"
        badge="Lektion 7"
      >
        <ISKTaxSection portfolio={portfolio} instruments={instruments} embedded />
      </ExpandableCard>

      <ExpandableCard
        title="Aktiescreener"
        subtitle="Filtrera de 16 aktierna efter fundamentala nyckeltal"
        icon="🔎"
        badge="Lektion 8"
      >
        <ScreenerSection stocks={stocks} embedded />
      </ExpandableCard>

      <ExpandableCard
        title="Stresstest"
        subtitle="Träna på att inte sälja på fel ställe"
        icon="🧠"
        badge="Lektion 9"
      >
        <StressTestSection portfolio={portfolio} instruments={instruments} embedded />
      </ExpandableCard>
    </div>
  );
}
