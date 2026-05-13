import { ModuleHeader } from "@/components/spel/shared/ModuleHeader";
import { SpelLayout } from "@/components/spel/SpelLayout";
import {
  LasagneModule,
  type LasagneData,
} from "@/components/spel/modul-3-lasagne/LasagneModule";
import data from "@/content/spel/data/modul-3-lasagne.json";

export const metadata = { title: "Bygg lasagnen – Aktieskolan Spel" };

export default function LasagnePage() {
  return (
    <SpelLayout backHref="/spel" backLabel="Alla spelmoduler">
      <ModuleHeader
        moduleNumber={3}
        emoji="🥘"
        title="Bygg lasagnen"
        intro="Du har 50 000 kr. Bygg din fond — välj vikter på bolag och fonder. Sen simuleras 5 år med tre kriser. Vinner du med diversifiering eller spelar du allt på ett kort?"
      />
      <div className="mt-10">
        <LasagneModule data={data as LasagneData} />
      </div>
    </SpelLayout>
  );
}
