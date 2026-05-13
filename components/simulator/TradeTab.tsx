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
}) {
  const [sub, setSub] = useState<string>("stocks");

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
            <div className="mt-4">
              <StockList
                stocks={stocks}
                cash={cash}
                onBuy={onBuy}
                onPlaceLimit={onPlaceLimit}
                setError={setError}
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
