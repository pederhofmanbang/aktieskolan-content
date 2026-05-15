"use client";

import { useState } from "react";

import {
  InstrumentRow,
  type ActionResult,
} from "@/components/simulator/InstrumentRow";
import { MonthlySavingsSection } from "@/components/simulator/MonthlySavingsSection";
import { StockList } from "@/components/simulator/StockList";
import { Tabs, type TabDef } from "@/components/simulator/Tabs";
import type { MonthlyPurchase } from "@/lib/portfolio";
import type { Instrument } from "@/lib/prices";

const SUB_TABS: TabDef[] = [
  { id: "stocks", label: "Aktier", icon: "📈" },
  { id: "funds", label: "Fonder", icon: "🏦" },
  { id: "monthly", label: "Månadssparande", icon: "🔁" },
];

export function TradeTab({
  cash,
  stocks,
  funds,
  monthlies,
  onBuy,
  onPlaceLimit,
  onAddMonthly,
  onToggleMonthly,
  onRemoveMonthly,
  setError,
  initialSub,
  allowLimitOrder = true,
}: {
  cash: number;
  stocks: Instrument[];
  funds: Instrument[];
  monthlies: MonthlyPurchase[];
  onBuy: (ticker: string, sek: number) => ActionResult;
  onPlaceLimit: (args: {
    ticker: string;
    limitPrice: number;
    amount: number;
  }) => ActionResult;
  onAddMonthly: (args: {
    ticker: string;
    amount: number;
    dayOfMonth: number;
  }) => ActionResult;
  onToggleMonthly: (id: string) => void;
  onRemoveMonthly: (id: string) => void;
  setError: (msg: string | null) => void;
  initialSub?: string;
  allowLimitOrder?: boolean;
}) {
  const [sub, setSub] = useState<string>(
    initialSub && ["stocks", "funds", "monthly"].includes(initialSub)
      ? initialSub
      : "stocks",
  );

  return (
    <div className="py-2">
      <Tabs tabs={SUB_TABS} active={sub} onChange={setSub} variant="secondary" />

      <div className="mt-6">
        {sub === "stocks" && (
          <section>
            <h2 className="text-xl font-semibold text-neutral-900">
              Köp aktier
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-neutral-500">
              16 svenska bolag · senaste kurser från Yahoo Finance. Skriv ett
              belopp i kr, eller använd snabbvalen (10 / 25 / 50 % av din
              kassa). Aktier handlas i orderbok — välj{" "}
              <strong>marknadsorder</strong> (köp nu) eller{" "}
              <strong>limitorder</strong> (köp bara om priset når ditt maxpris).
              Klicka på <em>Visa orderbok</em> för att se köpare och säljare
              just nu.
            </p>
            {!allowLimitOrder && (
              <p className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-600">
                💡 <strong>Limitorder visas efter lektion 2.</strong> När du
                markerat lektion 2 som läst kan du välja mellan marknadsorder
                och limitorder.
              </p>
            )}
            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
              💡 <strong>I verkligheten kostar aktieköp courtage:</strong>{" "}
              1–9 kr för små ordrar (under ~15&nbsp;000 kr) och 39 kr för större
              ordrar hos Avanza/Nordnet. Plus spread (osynlig kostnad). Vi
              förenklar i simulatorn och tar inget courtage.
            </p>
            <div className="mt-4">
              <StockList
                stocks={stocks}
                cash={cash}
                onBuy={onBuy}
                onPlaceLimit={onPlaceLimit}
                setError={setError}
                allowLimit={allowLimitOrder}
              />
            </div>
          </section>
        )}

        {sub === "funds" && (
          <section>
            <h2 className="text-xl font-semibold text-neutral-900">
              Köp fonder
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-neutral-500">
              Fonder köps i kr-belopp — du får ofta del av en andel (t.ex.{" "}
              <span className="tabular-nums">3,4521</span> andelar). Pedagogisk
              10-årshistorik (riktiga avgifter, syntetisk kursutveckling).
            </p>
            <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs leading-relaxed text-emerald-900">
              💡 <strong>Fonder är oftast gratis att köpa</strong> hos
              Avanza/Nordnet — inget courtage på vare sig engångsköp eller
              månadssparande. Den löpande kostnaden är fondens årliga avgift
              (visas per rad nedan).
            </p>
            <ul className="mt-4 space-y-2">
              {funds.map((inst) => (
                <InstrumentRow
                  key={inst.ticker}
                  instrument={inst}
                  cash={cash}
                  onBuy={onBuy}
                  onPlaceLimit={onPlaceLimit}
                  setError={setError}
                />
              ))}
            </ul>
          </section>
        )}

        {sub === "monthly" && (
          <MonthlySavingsSection
            monthlies={monthlies}
            funds={funds}
            onAdd={onAddMonthly}
            onToggle={onToggleMonthly}
            onRemove={onRemoveMonthly}
          />
        )}
      </div>
    </div>
  );
}
