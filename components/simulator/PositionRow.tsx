"use client";

import { useState } from "react";

import { Sparkline } from "@/components/simulator/Sparkline";
import { Term } from "@/components/simulator/Term";
import { cn } from "@/lib/cn";
import {
  formatKr,
  formatPct,
  formatShares,
  formatSignedKr,
} from "@/lib/format";
import { recentPrices, type Instrument } from "@/lib/prices";

export function PositionRow({
  instrument,
  shares,
  totalCost,
  onSell,
}: {
  instrument: Instrument;
  shares: number;
  totalCost: number;
  onSell: (ticker: string, shares: number) => void;
}) {
  const [sellOpen, setSellOpen] = useState(false);
  const [sellText, setSellText] = useState<string>("");
  const isFund = instrument.type === "fund";
  const value = shares * instrument.currentPrice;
  const pl = value - totalCost;
  const plPct = totalCost > 0 ? (pl / totalCost) * 100 : 0;
  const gav = totalCost / shares;

  const sellAmount = Number(sellText.replace(/\s/g, "").replace(",", "."));
  const sellShares =
    Number.isFinite(sellAmount) && sellAmount > 0 ? sellAmount : 0;
  const sellValid = sellShares > 0 && sellShares <= shares + 1e-6;

  const handleSellAll = () => {
    onSell(instrument.ticker, shares);
    setSellOpen(false);
    setSellText("");
  };

  const handleSellPart = () => {
    if (!sellValid) return;
    onSell(instrument.ticker, sellShares);
    setSellText("");
    setSellOpen(false);
  };

  return (
    <li className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-semibold text-neutral-900">{instrument.name}</div>
          <div className="text-sm text-neutral-500">
            {formatShares(shares, isFund)} · <Term termKey="gav">GAV</Term>{" "}
            {formatKr(gav, 2)}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Sparkline
            data={recentPrices(instrument.ticker, 60)}
            className="hidden sm:block"
          />
          <div className="text-right">
            <div className="font-semibold tabular-nums text-neutral-900">
              {formatKr(value)}
            </div>
            <div
              className={cn(
                "text-sm tabular-nums",
                pl >= 0 ? "text-primary-dark" : "text-red-600",
              )}
            >
              {formatSignedKr(pl)} ({formatPct(plPct)})
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSellOpen((v) => !v)}
            className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-400"
          >
            {sellOpen ? "Stäng" : "Sälj"}
          </button>
        </div>
      </div>
      {sellOpen && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-3">
          <label className="flex items-center gap-2 text-sm text-neutral-600">
            <input
              type="text"
              inputMode={isFund ? "decimal" : "numeric"}
              placeholder={isFund ? "andelar" : "antal"}
              value={sellText}
              onChange={(e) =>
                setSellText(e.target.value.replace(/[^\d ,.]/g, ""))
              }
              className="w-24 rounded-lg border border-neutral-200 px-2 py-1 text-sm tabular-nums focus:border-primary focus:outline-none"
              aria-label={`Antal att sälja av ${instrument.name}`}
            />
            <span className="text-neutral-500">
              av {formatShares(shares, isFund)}
            </span>
          </label>
          <button
            type="button"
            onClick={handleSellPart}
            disabled={!sellValid}
            className="rounded-full bg-neutral-900 px-4 py-1 text-xs font-semibold text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            Sälj{" "}
            {sellShares > 0
              ? formatKr(sellShares * instrument.currentPrice)
              : ""}
          </button>
          <button
            type="button"
            onClick={handleSellAll}
            className="rounded-full border border-neutral-300 px-4 py-1 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            Sälj allt
          </button>
        </div>
      )}
    </li>
  );
}
