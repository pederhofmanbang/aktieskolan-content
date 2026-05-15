"use client";

import { useMemo, useState } from "react";

import { Speech } from "@/components/simulator/Speech";
import { cn } from "@/lib/cn";
import { formatKr, formatPct } from "@/lib/format";
import type { Portfolio } from "@/lib/portfolio";
import type { Instrument } from "@/lib/prices";
import { projectForward, totalMonthlyInflow } from "@/lib/projection";

const PRESETS = [5, 10, 20, 40];
const RETURNS = [
  { value: 0.05, label: "5 %", note: "Försiktigt" },
  { value: 0.07, label: "7 %", note: "Globalfond historiskt" },
  { value: 0.09, label: "9 %", note: "Optimistiskt" },
];

export function TimeMachineSection({
  portfolio,
  instruments,
  embedded = false,
}: {
  portfolio: Portfolio;
  instruments: Instrument[];
  embedded?: boolean;
}) {
  const [years, setYears] = useState<number>(10);
  const [annualReturn, setAnnualReturn] = useState<number>(0.07);

  const projection = useMemo(
    () => projectForward(portfolio, instruments, { years, annualReturn }),
    [portfolio, instruments, years, annualReturn],
  );
  const start = projection[0];
  const end = projection[projection.length - 1];

  const monthlyInflow = totalMonthlyInflow(portfolio.monthlyPurchases);
  const totalInjected = monthlyInflow * 12 * years;
  const growthPct =
    start.totalValue > 0 ? (end.growth / start.totalValue) * 100 : 0;

  const milestones = [5, 10, 20, 40]
    .filter((y) => y <= years)
    .map((y) => projection.find((p) => p.year === y))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  const hasPositions =
    portfolio.positions.length > 0 || portfolio.cash < 100_000;

  return (
    <section className="mt-12">
      {!embedded && (
        <>
        <h2 className="text-xl font-semibold text-neutral-900">Tidsmaskinen</h2>
      <p className="mt-1 text-sm leading-relaxed text-neutral-500">
        Rulla portföljen framåt och se vad <strong>ränta-på-ränta</strong> gör
        med pengarna över tid (lektion 4). Projektionen är{" "}
        <strong>deterministisk</strong> — den antar samma avkastning varje år,
        utan börssvängningar. Verkligheten är skakigare, men snittet över
        decennier ligger nära den här kurvan.
      </p>
        </>
      )}

      {!hasPositions && (
        <p className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
          Köp något i din portfölj först — eller sätt upp ett månadssparande
          — så har tidsmaskinen något att räkna på.
        </p>
      )}

      <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-neutral-500">
              Antal år framåt
            </span>
            <div className="flex flex-wrap gap-1">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setYears(p)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-sm font-medium tabular-nums transition-colors",
                    years === p
                      ? "border-primary bg-primary/10 text-primary-dark"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-400",
                  )}
                >
                  {p} år
                </button>
              ))}
              <label className="flex items-center gap-1 text-sm text-neutral-600">
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={years}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (Number.isFinite(v) && v >= 1 && v <= 60) setYears(v);
                  }}
                  className="w-16 rounded-md border border-neutral-200 px-2 py-1 text-sm tabular-nums focus:border-primary focus:outline-none"
                  aria-label="Antal år"
                />
                <span className="text-xs text-neutral-500">år</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-neutral-500">
              Antagen årlig avkastning
            </span>
            <div className="flex flex-wrap gap-1">
              {RETURNS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setAnnualReturn(r.value)}
                  title={r.note}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-sm font-medium tabular-nums transition-colors",
                    annualReturn === r.value
                      ? "border-primary bg-primary/10 text-primary-dark"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-400",
                  )}
                >
                  {r.label}
                  <span className="ml-1 text-xs text-neutral-500">
                    ({r.note})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:grid-cols-4">
        <Cell
          label={`Värde idag`}
          value={formatKr(Math.round(start.totalValue))}
        />
        <Cell
          label={`Värde om ${years} år`}
          value={formatKr(Math.round(end.totalValue))}
          emphasis
        />
        <Cell
          label="Tillväxt"
          value={`${formatKr(Math.round(end.growth))} (${formatPct(growthPct, 0)})`}
          tone={end.growth >= 0 ? "positive" : "negative"}
        />
        <Cell
          label="Insatt under perioden"
          value={formatKr(Math.round(totalInjected))}
          hint={
            monthlyInflow > 0
              ? `${formatKr(monthlyInflow)} × 12 mån × ${years} år`
              : "Ingen aktiv månadsspar"
          }
        />
      </div>

      {milestones.length > 1 && (
        <div className="mt-4 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-4 py-2 font-medium">År framåt</th>
                <th className="px-4 py-2 font-medium tabular-nums">
                  Totalt värde
                </th>
                <th className="px-4 py-2 font-medium tabular-nums">Tillväxt</th>
                <th className="px-4 py-2 font-medium tabular-nums">
                  Tillväxt / startvärde
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {milestones.map((m) => {
                const pct =
                  start.totalValue > 0
                    ? (m.growth / start.totalValue) * 100
                    : 0;
                return (
                  <tr key={m.year}>
                    <td className="px-4 py-2 text-neutral-700">+{m.year} år</td>
                    <td className="px-4 py-2 tabular-nums text-neutral-900">
                      {formatKr(Math.round(m.totalValue))}
                    </td>
                    <td
                      className={cn(
                        "px-4 py-2 tabular-nums",
                        m.growth >= 0 ? "text-primary-dark" : "text-red-600",
                      )}
                    >
                      {formatKr(Math.round(m.growth))}
                    </td>
                    <td className="px-4 py-2 tabular-nums text-neutral-500">
                      {formatPct(pct, 0)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {years >= 30 && (
        <Speech character="anna-snowball" className="mt-4">
          Snöbollen rullar fett nu! Vid {years} år har ränta-på-ränta gjort
          mer än hälften av jobbet — pengarna föder sina egna pengar. Det här
          är därför Buffett tjänade 99 % av sin förmögenhet efter 50.
        </Speech>
      )}
      {years <= 5 && (
        <Speech character="anna-snowball" className="mt-4">
          {years} år är kort. På den här tidshorisonten är det främst dina
          insättningar som syns — snöbollen har inte hunnit få fart. Rulla
          fram till 20–30 år och se vad som händer.
        </Speech>
      )}

      <p className="mt-3 text-xs text-neutral-500">
        Tidsmaskinen ändrar inte din portfölj — den visar bara vad som{" "}
        <em>skulle</em> kunna hända. Kom tillbaka när du har lagt till
        månadssparande och se hur kurvan kröker uppåt.
      </p>
    </section>
  );
}

function Cell({
  label,
  value,
  emphasis,
  tone = "neutral",
  hint,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  tone?: "neutral" | "positive" | "negative";
  hint?: string;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-neutral-500">
        {label}
      </div>
      <div
        className={cn(
          "mt-1 tabular-nums",
          emphasis ? "text-2xl font-bold" : "text-xl font-semibold",
          tone === "positive" && "text-primary-dark",
          tone === "negative" && "text-red-600",
          tone === "neutral" && "text-neutral-900",
        )}
      >
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-neutral-400">{hint}</div>}
    </div>
  );
}
