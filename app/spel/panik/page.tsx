import { ModuleHeader } from "@/components/spel/shared/ModuleHeader";
import { SpelLayout } from "@/components/spel/SpelLayout";
import { PanikModule } from "@/components/spel/modul-9-panik/PanikModule";

export const metadata = { title: "Motstå panik-knappen – Aktieskolan Spel" };

export default function PanikPage() {
  return (
    <SpelLayout backHref="/spel" backLabel="Alla spelmoduler">
      <ModuleHeader
        moduleNumber={9}
        emoji="🚨"
        title="Motstå panik-knappen"
        intro="Det här är spelets enda modul med tidspress — och det är pedagogiskt korrekt. Panik är den vuxna investerarens största fiende. Sextio sekunder. Stora röda knappen pulserar. Kan du sitta still?"
      />
      <div className="mt-10">
        <PanikModule />
      </div>
    </SpelLayout>
  );
}
