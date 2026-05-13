"use client";

import { useMemo, useState } from "react";

import {
  InstrumentRow,
  type ActionResult,
} from "@/components/simulator/InstrumentRow";
import { cn } from "@/lib/cn";
import type { Instrument } from "@/lib/prices";

export function StockList({
  stocks,
  cash,
  onBuy,
  onPlaceLimit,
  setError,
}: {
  stocks: Instrument[];
  cash: number;
  onBuy: (ticker: string, sek: number) => ActionResult;
  onPlaceLimit: (args: {
    ticker: string;
    limitPrice: number;
    amount: number;
  }) => ActionResult;
  setError: (msg: string | null) => void;
}) {
  const [search, setSearch] = useState<string>("");
  const [sector, setSector] = useState<string>("Alla");
  const [groupBySector, setGroupBySector] = useState<boolean>(false);

  const sectors = useMemo(() => {
    const set = new Set<string>();
    for (const s of stocks) if (s.sector) set.add(s.sector);
    return ["Alla", ...Array.from(set).sort()];
  }, [stocks]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return stocks.filter((s) => {
      if (sector !== "Alla" && s.sector !== sector) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.ticker.toLowerCase().includes(q)
      );
    });
  }, [stocks, search, sector]);

  const groups = useMemo(() => {
    if (!groupBySector) return null;
    const map = new Map<string, Instrument[]>();
    for (const s of filtered) {
      const key = s.sector ?? "Övrigt";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered, groupBySector]);

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-neutral-200 bg-white p-3">
        <label className="flex flex-1 flex-col gap-1 text-xs text-neutral-600">
          <span>Sök bolag eller ticker</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="t.ex. Investor, VOLV, bank…"
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-neutral-600">
          <span>Sektor</span>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="rounded-lg border border-neutral-200 bg-white px-2 py-2 text-sm focus:border-primary focus:outline-none"
          >
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => setGroupBySector((v) => !v)}
          className={cn(
            "rounded-md border px-3 py-2 text-sm transition-colors",
            groupBySector
              ? "border-primary bg-primary/10 text-primary-dark"
              : "border-neutral-200 text-neutral-600 hover:border-neutral-400",
          )}
        >
          Gruppera per sektor
        </button>
      </div>

      <p className="mt-2 text-xs text-neutral-500">
        Visar {filtered.length} av {stocks.length} aktier.
      </p>

      {filtered.length === 0 ? (
        <p className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-6 text-center text-sm text-neutral-600">
          Inga aktier matchar din sökning.
        </p>
      ) : groups ? (
        <div className="mt-3 space-y-5">
          {groups.map(([sectorName, items]) => (
            <div key={sectorName}>
              <h3 className="mb-2 text-sm font-semibold text-neutral-700">
                {sectorName} ({items.length})
              </h3>
              <ul className="space-y-2">
                {items.map((inst) => (
                  <InstrumentRow
                    key={inst.ticker}
                    instrument={inst}
                    cash={cash}
                    onBuy={onBuy}
                    onPlaceLimit={onPlaceLimit}
                    setError={setError}
                    allowLimit
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <ul className="mt-3 space-y-2">
          {filtered.map((inst) => (
            <InstrumentRow
              key={inst.ticker}
              instrument={inst}
              cash={cash}
              onBuy={onBuy}
              onPlaceLimit={onPlaceLimit}
              setError={setError}
              allowLimit
            />
          ))}
        </ul>
      )}
    </div>
  );
}
