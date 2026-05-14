"use client";

import { useMemo, useState } from "react";

import { Term } from "@/components/simulator/Term";
import { cn } from "@/lib/cn";
import { CRASH_SCENARIOS, simulateCrash } from "@/lib/crashScenarios";
import { formatKr, formatPct, formatSignedKr } from "@/lib/format";
import type { Portfolio } from "@/lib/portfolio";
import type { Instrument } from "@/lib/prices";

export function CrashTestSection({
  portfolio,
  instruments,
  embedded = false,
}: {
  portfolio: Portfolio;
  instruments: Instrument[];
  embedded?: boolean;
}) {
  const [scenarioId, setScenarioId] = useState<string>(CRASH_SCENARIOS[1].id);
  const scenario = useMemo(
    () => CRASH_SCENARIOS.find((s) => s.id === scenarioId) ?? CRASH_SCENARIOS[1],
    [scenarioId],
  );
  const points = useMemo(() => simulateCrash(scenario), [scenario]);

  const byTicker = new Map(instruments.map((i) => [i.ticker, i]));
  const startingMarketValue = portfolio.positions.reduce((sum, pos) => {
    const inst = byTicker.get(pos.ticker);
    return sum + (inst ? inst.currentPrice * pos.shares : 0);
  }, 0);
  const trough = points.find((p) => p.phase === "trough");
  const back = points[points.length - 1];

  const valueAtMult = (mult: number) => startingMarketValue * mult + portfolio.cash;
  const startingTotal = startingMarketValue + portfolio.cash;
  const troughTotal = trough ? valueAtMult(trough.marketValueMultiplier) : startingTotal;
  const troughLoss = troughTotal - startingTotal;
  const backTotal = valueAtMult(back?.marketValueMultiplier ?? 1);

  const hasPositions = portfolio.positions.length > 0;
  const showcase = points.filter((_, i, arr) =>
    [
      0,
      Math.floor(scenario.durationMonths / 2),
      scenario.durationMonths,
      scenario.durationMonths + Math.floor(scenario.recoveryMonths / 2),
      arr.length - 1,
    ].includes(i),
  );

  return (
    <section className="mt-12">
      {!embedded && (
        <>
        <h2 className="text-xl font-semibold text-neutral-900">Krasch-läge</h2>
      <p className="mt-1 text-sm leading-relaxed text-neutral-500">
        Applicera en historisk börskrasch på din nuvarande portfölj (lektion 5).
        Pedagogiken: <strong>de som sålde på botten blev fattigare</strong>. De
        som satt kvar (eller köpte mer) fick tillbaka allt — och mer därtill.
        Kassan rör sig inte i scenariot, bara investerat värde.
      </p>
        </>
      )}

      {!hasPositions && (
        <p className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
          Köp något i din portfölj först — annars finns inget att krascha.
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-1">
        {CRASH_SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setScenarioId(s.id)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
              s.id === scenarioId
                ? "border-primary bg-primary/10 text-primary-dark"
                : "border-neutral-200 text-neutral-600 hover:border-neutral-400",
            )}
          >
            {s.name}{" "}
            <span className="text-xs text-neutral-500">{s.year}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
        <div className="text-sm text-neutral-600">
          <strong>{scenario.name}</strong> ({scenario.year}): {scenario.description}
        </div>
        <div className="mt-2 text-xs text-neutral-500">
          Max <Term termKey="drawdown">drawdown</Term>{" "}
          {formatPct(scenario.drawdown * 100, 0)} · botten efter{" "}
          {scenario.durationMonths} månader · återhämtning under{" "}
          {scenario.recoveryMonths} månader.
        </div>
      </div>

      {hasPositions && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:grid-cols-3">
            <Cell label="Startvärde" value={formatKr(Math.round(startingTotal))} />
            <Cell
              label="På botten"
              value={formatKr(Math.round(troughTotal))}
              tone="negative"
              hint={`${formatSignedKr(Math.round(troughLoss))} (${formatPct(
                (troughLoss / startingTotal) * 100,
                0,
              )})`}
            />
            <Cell
              label="När det är över"
              value={formatKr(Math.round(backTotal))}
              tone="positive"
              hint={`${scenario.durationMonths + scenario.recoveryMonths} månader totalt`}
            />
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Tidpunkt</th>
                  <th className="px-4 py-2 font-medium tabular-nums">
                    Totalt värde
                  </th>
                  <th className="px-4 py-2 font-medium tabular-nums">Resultat</th>
                  <th className="px-4 py-2 font-medium">Fas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {showcase.map((p) => {
                  const total = valueAtMult(p.marketValueMultiplier);
                  const diff = total - startingTotal;
                  return (
                    <tr key={p.monthIndex}>
                      <td className="px-4 py-2 text-neutral-700">
                        +{p.monthIndex} mån
                      </td>
                      <td className="px-4 py-2 tabular-nums text-neutral-900">
                        {formatKr(Math.round(total))}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-2 tabular-nums",
                          diff >= 0 ? "text-primary-dark" : "text-red-600",
                        )}
                      >
                        {formatSignedKr(Math.round(diff))}
                      </td>
                      <td className="px-4 py-2 text-xs uppercase tracking-wider text-neutral-500">
                        {phaseLabel(p.phase)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-neutral-500">
            Hade du sålt på botten hade du tappat{" "}
            <span className="font-medium text-red-600">
              {formatKr(Math.round(-troughLoss))}
            </span>{" "}
            i förlust. Höll du fast återhämtade du dig till{" "}
            <span className="font-medium text-primary-dark">
              {formatKr(Math.round(backTotal))}
            </span>{" "}
            efter {scenario.durationMonths + scenario.recoveryMonths} månader.
            Det är hela lektion 5 sammanfattad i ett experiment.
          </p>
        </>
      )}
    </section>
  );
}

function phaseLabel(phase: string): string {
  switch (phase) {
    case "before":
      return "Innan";
    case "down":
      return "Faller";
    case "trough":
      return "Botten";
    case "recovery":
      return "Återhämtning";
    case "back":
      return "Återställd";
    default:
      return "";
  }
}

function Cell({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-neutral-500">
        {label}
      </div>
      <div
        className={cn(
          "mt-1 text-xl font-semibold tabular-nums",
          tone === "positive" && "text-primary-dark",
          tone === "negative" && "text-red-600",
          tone === "neutral" && "text-neutral-900",
        )}
      >
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-neutral-500">{hint}</div>}
    </div>
  );
}
