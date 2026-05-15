"use client";

import { useMemo, useState } from "react";

const FACTS: string[] = [
  "Tesla-aktien gick upp 740 % under 2020. Och ner 65 % under 2022. Var glad att din globalfond bara har ~1 % Tesla.",
  "Investor delade ut 4,5 miljarder kr 2024. Investmentbolag är klassiska utdelningsmaskiner.",
  "Stockholmsbörsen har gått upp 11 av de senaste 15 åren historiskt.",
  "Japan var världens största börs 1989. Sedan stagnerade Nikkei i 30 år. Diversifiering är försäkringen.",
  "Familjen Wallenberg kontrollerar ~75 % av rösterna i H&M med ~36 % av aktierna. A-aktier är magi.",
  "ISK-fribeloppet höjdes från 150 000 kr (2025) till 300 000 kr (2026). Riksdagen vill att fler ska spara.",
  "Avanza Zero har 0 % avgift och har funnits sedan 2006. Sveriges enda gratisfond.",
  "Att missa de 20 bästa börsdagarna under 20 år halverar din avkastning. De bästa dagarna kommer ofta direkt efter de värsta.",
  "1 000 kr i en globalfond 1928 hade varit värt över 25 miljoner kr idag. Tid + ränta-på-ränta.",
  "Warren Buffett tjänade 99 % av sin förmögenhet EFTER 50-årsåldern. Ränta-på-ränta tar tid.",
  "Småbolag på First North kan ha 5 % spread. Du måste tjäna 5 % bara för att gå plus minus noll.",
  "Genomsnittlig privatsparare får 1,5–2 procentenheter lägre avkastning per år än fonden hen äger — bara på timing-misstag.",
  "Spotify har aldrig delat ut utdelning. De återinvesterar allt i tillväxt — klassisk tillväxtaktie.",
  "I Sverige finns över 4 miljoner ISK-konton. Det är det vanligaste sparkontot för aktier och fonder.",
  "Sharpe-kvot över 2 är mycket sällsynt över lång tid. Om någon lovar det — var skeptisk.",
];

export function DidYouKnow() {
  const [seed, setSeed] = useState(0);
  const fact = useMemo(() => {
    return FACTS[Math.floor(Math.random() * FACTS.length) + seed * 0];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  return (
    <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-lg shadow-sm ring-1 ring-purple-200">
          💡
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-purple-700">
            Visste du?
          </div>
          <p className="mt-1 text-sm leading-relaxed text-neutral-800">
            {fact}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="shrink-0 rounded-full border border-purple-200 px-2 py-1 text-xs text-purple-700 transition-colors hover:border-purple-400 hover:bg-white"
          aria-label="Visa nästa fakta"
        >
          ↻
        </button>
      </div>
    </div>
  );
}
