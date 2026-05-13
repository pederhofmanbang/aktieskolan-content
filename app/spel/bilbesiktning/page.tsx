import { ModuleHeader } from "@/components/spel/shared/ModuleHeader";
import { SpelLayout } from "@/components/spel/SpelLayout";
import {
  BilbesiktningModule,
  type BilbesiktningData,
} from "@/components/spel/modul-8-bilbesiktning/BilbesiktningModule";
import data from "@/content/spel/data/modul-8-bilbesiktning.json";

export const metadata = { title: "Bilbesiktningen – Aktieskolan Spel" };

export default function BilbesiktningPage() {
  return (
    <SpelLayout backHref="/spel" backLabel="Alla spelmoduler">
      <ModuleHeader
        moduleNumber={8}
        emoji="🔦"
        title="Bilbesiktningen"
        intro="Åtta bolag. 200 000 kr. Du får välja 3. Inspektera nyckeltalen med ficklampan — en röd flagga räcker inte alltid, men flera tillsammans är en värdefälla."
      />
      <div className="mt-10">
        <BilbesiktningModule data={data as BilbesiktningData} />
      </div>
    </SpelLayout>
  );
}
