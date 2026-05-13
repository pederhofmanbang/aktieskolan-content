import { ModuleHeader } from "@/components/spel/shared/ModuleHeader";
import { SpelLayout } from "@/components/spel/SpelLayout";
import {
  LagdraftModule,
  type LagdraftData,
} from "@/components/spel/modul-6-lagdraft/LagdraftModule";
import data from "@/content/spel/data/modul-6-lagdraft.json";

export const metadata = { title: "Lagdraften – Aktieskolan Spel" };

export default function LagdraftenPage() {
  return (
    <SpelLayout backHref="/spel" backLabel="Alla spelmoduler">
      <ModuleHeader
        moduleNumber={6}
        emoji="⚽"
        title="Lagdraften"
        intro="Drafta 11 bolag i 4 positioner. Sen spelas 3 matcher: stabil tillväxt, räntechock och tech-ras. Vinner du alla tre med samma lag?"
      />
      <div className="mt-10">
        <LagdraftModule data={data as LagdraftData} />
      </div>
    </SpelLayout>
  );
}
