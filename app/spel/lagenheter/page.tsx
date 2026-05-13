import { ModuleHeader } from "@/components/spel/shared/ModuleHeader";
import { SpelLayout } from "@/components/spel/SpelLayout";
import {
  LagenheterModule,
  type LagenheterData,
} from "@/components/spel/modul-7-lagenheter/LagenheterModule";
import data from "@/content/spel/data/modul-7-lagenheter.json";

export const metadata = { title: "Tre lägenheter – Aktieskolan Spel" };

export default function LagenheterPage() {
  return (
    <SpelLayout backHref="/spel" backLabel="Alla spelmoduler">
      <ModuleHeader
        moduleNumber={7}
        emoji="🏠"
        title="Tre lägenheter"
        intro="Tre kontotyper, åtta påsar med pengar. Sortera dem rätt — du bestämmer vilken skatt du betalar de kommande åren."
      />
      <div className="mt-10">
        <LagenheterModule data={data as LagenheterData} />
      </div>
    </SpelLayout>
  );
}
