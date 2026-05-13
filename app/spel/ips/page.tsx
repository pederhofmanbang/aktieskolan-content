import { ModuleHeader } from "@/components/spel/shared/ModuleHeader";
import { SpelLayout } from "@/components/spel/SpelLayout";
import {
  IpsModule,
  type IpsData,
} from "@/components/spel/modul-10-ips/IpsModule";
import data from "@/content/spel/data/modul-10-ips.json";

export const metadata = { title: "Bygg din IPS – Aktieskolan Spel" };

export default function IpsPage() {
  return (
    <SpelLayout backHref="/spel" backLabel="Alla spelmoduler">
      <ModuleHeader
        moduleNumber={10}
        emoji="📜"
        title="Bygg din IPS"
        intro="Investment Policy Statement: din egen regelbok. Du får välja 6 regler av 12. Sen simulerar vi 40 år (35–75) med dotcom, finanskris, pandemi, inflation och en fiktiv framtida kris. Hur klarar DIN plan livet?"
      />
      <div className="mt-10">
        <IpsModule data={data as unknown as IpsData} />
      </div>
    </SpelLayout>
  );
}
