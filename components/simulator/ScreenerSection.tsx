"use client";

import { useMemo, useState } from "react";

import { Term } from "@/components/simulator/Term";
import { cn } from "@/lib/cn";
import { formatKr, formatPct } from "@/lib/format";
import type { Instrument } from "@/lib/prices";

export type ScreenerFilter = {
  peMin: number;
  peMax: number;
  yieldMin: number;
  yieldMax: number;
  solidityMin: number;
  roeMin: number;
};

const DEFAULT_FILTER: ScreenerFilter = {
  peMin: 10,
  peMax: 20,
  yieldMin: 2,
  yieldMax: 5,
  solidityMin: 30,
  roeMin: 10,
};

export function ScreenerSection({
  stocks,
  embedded = false,
}: {
  stocks: Instrument[];
  embedded?: boolean;
}) {
  const [filter, setFilter] = useState<ScreenerFilter>(DEFAULT_FILTER);

  const results = useMemo(() => {
    return stocks.filter((s) => {
      const f = s.fundamentals;
      if (!f) return false;
      if (f.pe < filter.peMin || f.pe > filter.peMax) return false;
      if (f.directYield < filter.yieldMin || f.directYield > filter.yieldMax) return false;
      if (f.solidity < filter.solidityMin) return false;
      if (f.roe < filter.roeMin) return false;
      return true;
    });
  }, [stocks, filter]);

  const update = (key: keyof ScreenerFilter, value: string) => {
    const n = Number(value.replace(",", "."));
    if (Number.isFinite(n)) {
      setFilter({ ...filter, [key]: n });
    }
  };

  return (
    <section className="mt-12">
      {!embedded && (
        <>
        <h2 className="text-xl font-semibold text-neutral-900">Aktiescreener</h2>
      <p className="mt-1 text-sm leading-relaxed text-neutral-500">
        Filtrera de 16 aktierna efter <strong>fundamentala nyckeltal</strong>{" "}
        (lektion 8). Använd den för att <em>sortera bort uppenbart dåliga val</em>,
        inte för att hitta en garanterad vinnare. Nyckeltalen är historiska —
        de säger inget om framtiden. Defaultfilter visar Large Cap-snittet:
        P/E 10–20, direktavkastning 2–5 %, soliditet &gt; 30 %, ROE &gt; 10 %.
      </p>
        </>
      )}

      <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <RangeFilter
            label={<Term termKey="pe">P/E</Term>}
            hint="pris / vinst per aktie"
            min={filter.peMin}
            max={filter.peMax}
            onMinChange={(v) => update("peMin", v)}
            onMaxChange={(v) => update("peMax", v)}
          />
          <RangeFilter
            label={<Term termKey="direktavkastning">Direktavkastning</Term>}
            hint="årlig utdelning / kurs"
            suffix=" %"
            min={filter.yieldMin}
            max={filter.yieldMax}
            onMinChange={(v) => update("yieldMin", v)}
            onMaxChange={(v) => update("yieldMax", v)}
          />
          <SingleFilter
            label={<><Term termKey="soliditet">Soliditet</Term> ≥</>}
            hint="eget kapital / tillgångar"
            suffix=" %"
            value={filter.solidityMin}
            onChange={(v) => update("solidityMin", v)}
          />
          <SingleFilter
            label="ROE ≥"
            hint="vinst / eget kapital"
            suffix=" %"
            value={filter.roeMin}
            onChange={(v) => update("roeMin", v)}
          />
          <button
            type="button"
            onClick={() => setFilter(DEFAULT_FILTER)}
            className="self-end rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-700 transition-colors hover:border-neutral-400"
          >
            Återställ filter
          </button>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-neutral-500">
          {results.length} aktie{results.length === 1 ? "" : "r"} matchar dina
          kriterier (av {stocks.length} totalt).
        </p>
        {results.length > 0 ? (
          <div className="mt-3 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="px-3 py-2 font-medium">Bolag</th>
                  <th className="px-3 py-2 font-medium tabular-nums">Kurs</th>
                  <th className="px-3 py-2 font-medium tabular-nums">P/E</th>
                  <th className="px-3 py-2 font-medium tabular-nums">Direktavk.</th>
                  <th className="px-3 py-2 font-medium tabular-nums">Soliditet</th>
                  <th className="px-3 py-2 font-medium tabular-nums">ROE</th>
                  <th className="px-3 py-2 font-medium">Sektor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {results.map((s) => (
                  <tr key={s.ticker}>
                    <td className="px-3 py-2 text-neutral-900">
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-neutral-500">
                        {s.ticker.replace(".ST", "")}
                      </div>
                    </td>
                    <td className="px-3 py-2 tabular-nums text-neutral-900">
                      {formatKr(s.currentPrice, 2)}
                    </td>
                    <td className="px-3 py-2 tabular-nums text-neutral-700">
                      {s.fundamentals?.pe.toFixed(1)}
                    </td>
                    <td className="px-3 py-2 tabular-nums text-neutral-700">
                      {s.fundamentals
                        ? formatPct(s.fundamentals.directYield, 1)
                        : "—"}
                    </td>
                    <td className="px-3 py-2 tabular-nums text-neutral-700">
                      {s.fundamentals?.solidity} %
                    </td>
                    <td className="px-3 py-2 tabular-nums text-neutral-700">
                      {s.fundamentals?.roe} %
                    </td>
                    <td className="px-3 py-2 text-neutral-500">{s.sector}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Inga aktier matchar — prova vidare gränser. Banker har t.ex. mycket
            låg soliditet (~5 %), så ett filter ovan 30 % filtrerar bort dem.
          </p>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-neutral-500">
        <strong>Pedagogiska tips:</strong> Sätt P/E max på 12 — du får främst
        banker (lågt P/E, hög direktavkastning, låg soliditet). Sätt soliditet
        över 50 % — bankerna försvinner och du får mest industribolag och
        investmentbolag. För nybörjare: använd screenern för att{" "}
        <em>förstå skillnader mellan branscher</em>, inte för att välja
        favoritaktie. Förvalt: 95 % av kapitalet i en globalfond, resten som
        krydda från screener-resultaten.
      </p>
    </section>
  );
}

function RangeFilter({
  label,
  hint,
  min,
  max,
  onMinChange,
  onMaxChange,
  suffix = "",
}: {
  label: React.ReactNode;
  hint: string;
  min: number;
  max: number;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-neutral-700">{label}</span>
      <span className="text-xs text-neutral-400">{hint}</span>
      <div className="mt-1 flex items-center gap-1">
        <input
          type="text"
          inputMode="decimal"
          value={min}
          onChange={(e) => onMinChange(e.target.value)}
          className="w-16 rounded-md border border-neutral-200 px-2 py-1 text-sm tabular-nums focus:border-primary focus:outline-none"
        />
        <span className="text-xs text-neutral-400">–</span>
        <input
          type="text"
          inputMode="decimal"
          value={max}
          onChange={(e) => onMaxChange(e.target.value)}
          className="w-16 rounded-md border border-neutral-200 px-2 py-1 text-sm tabular-nums focus:border-primary focus:outline-none"
        />
        <span className="text-xs text-neutral-500">{suffix}</span>
      </div>
    </div>
  );
}

function SingleFilter({
  label,
  hint,
  value,
  onChange,
  suffix = "",
}: {
  label: React.ReactNode;
  hint: string;
  value: number;
  onChange: (v: string) => void;
  suffix?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1")}>
      <span className="text-xs font-medium text-neutral-700">{label}</span>
      <span className="text-xs text-neutral-400">{hint}</span>
      <div className="mt-1 flex items-center gap-1">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 rounded-md border border-neutral-200 px-2 py-1 text-sm tabular-nums focus:border-primary focus:outline-none"
        />
        <span className="text-xs text-neutral-500">{suffix}</span>
      </div>
    </div>
  );
}
