/**
 * Kopplar varje lektion till en djuplänk in i simulatorn.
 * Används av lektion-sidans "Öppna i simulatorn"-knapp.
 */
export type SimulatorLink = {
  href: string;
  label: string;
};

export const LESSON_TO_SIMULATOR: Record<string, SimulatorLink> = {
  "01-vad-ar-en-aktie": {
    href: "/simulator?tab=trade&sub=stocks",
    label: "Öppna Köp & sälj i simulatorn",
  },
  "02-borsen-och-mr-market": {
    href: "/simulator?tab=trade&sub=stocks",
    label: "Öppna Köp & sälj — testa limitorder",
  },
  "03-fonder-lasagne": {
    href: "/simulator?tab=trade&sub=monthly",
    label: "Sätt upp månadssparande i simulatorn",
  },
  "04-ranta-pa-ranta": {
    href: "/simulator?tab=analysis&expand=tidsmaskin",
    label: "Öppna Tidsmaskinen i simulatorn",
  },
  "05-risk": {
    href: "/simulator?tab=analysis&expand=crash",
    label: "Öppna Krasch-läget i simulatorn",
  },
  "06-diversifiering": {
    href: "/simulator?tab=analysis&expand=allocation",
    label: "Öppna Allokering & Sharpe",
  },
  "07-isk-vs-af-vs-kf": {
    href: "/simulator?tab=analysis&expand=isk",
    label: "Öppna ISK-skattevy",
  },
  "08-nyckeltal": {
    href: "/simulator?tab=analysis&expand=screener",
    label: "Öppna Aktiescreener",
  },
  "09-psykologi": {
    href: "/simulator?tab=analysis&expand=stresstest",
    label: "Öppna Stresstest",
  },
  "10-din-egen-plan": {
    href: "/simulator?tab=plan",
    label: "Skriv din IPS i simulatorn",
  },
};
