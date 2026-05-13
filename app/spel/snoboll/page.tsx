import { ModuleHeader } from "@/components/spel/shared/ModuleHeader";
import { SpelLayout } from "@/components/spel/SpelLayout";
import { SnobollModule } from "@/components/spel/modul-4-snoboll/SnobollModule";

export const metadata = { title: "Snöbollsbacken – Aktieskolan Spel" };

export default function SnobollPage() {
  return (
    <SpelLayout backHref="/spel" backLabel="Alla spelmoduler">
      <ModuleHeader
        moduleNumber={4}
        emoji="❄️"
        title="Snöbollsbacken"
        intro="Du har 10 000 kr. Tiden går. Snöbollen växer 8 % per år. Med jämna mellanrum dyker frestelser upp — 'sälj nu', 'kryptotips', 'expertvarning'. Klicka på en så halveras snöbollen. Klicka inte så fortsätter den växa."
      />
      <div className="mt-10">
        <SnobollModule />
      </div>
    </SpelLayout>
  );
}
