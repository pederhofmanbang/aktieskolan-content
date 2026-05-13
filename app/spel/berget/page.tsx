import { ModuleHeader } from "@/components/spel/shared/ModuleHeader";
import { SpelLayout } from "@/components/spel/SpelLayout";
import {
  BergetModule,
  type BergetData,
} from "@/components/spel/modul-5-berget/BergetModule";
import data from "@/content/spel/data/modul-5-berget.json";

export const metadata = { title: "Bergsbestigningen – Aktieskolan Spel" };

export default function BergetPage() {
  return (
    <SpelLayout backHref="/spel" backLabel="Alla spelmoduler">
      <ModuleHeader
        moduleNumber={5}
        emoji="⛰️"
        title="Bergsbestigningen"
        intro="Tre leder. Tre risknivåer. Vilken klarar du? Risk är priset för avkastning — den som väljer Skåne kommer fram men aldrig högt, den som väljer Everest har 25 % konkursrisk."
      />
      <div className="mt-10">
        <BergetModule data={data as BergetData} />
      </div>
    </SpelLayout>
  );
}
