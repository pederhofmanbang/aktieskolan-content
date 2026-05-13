import { ModuleHeader } from "@/components/spel/shared/ModuleHeader";
import { SpelLayout } from "@/components/spel/SpelLayout";
import {
  MrMarketModule,
  type MrMarketData,
} from "@/components/spel/modul-2-mr-market/MrMarketModule";
import data from "@/content/spel/data/modul-2-mr-market.json";

export const metadata = {
  title: "Mr Markets dörrknack – Aktieskolan Spel",
};

export default function MrMarketPage() {
  return (
    <SpelLayout backHref="/spel" backLabel="Alla spelmoduler">
      <ModuleHeader
        moduleNumber={2}
        act="Akt 2"
        emoji="🚪"
        title="Mr Markets dörrknack"
        intro={
          <>
            Pizzerian är värd 5 miljoner kr. Mr Market — din fiktive granne med
            20 % aktier — knackar varje dag med ett bud. Vissa dagar manisk,
            andra deprimerad. Tio dagar. Hur många bra beslut hinner du?
          </>
        }
      />
      <div className="mt-10">
        <MrMarketModule data={data as MrMarketData} />
      </div>
    </SpelLayout>
  );
}
