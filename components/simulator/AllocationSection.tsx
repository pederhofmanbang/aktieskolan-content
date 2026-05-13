"use client";

import {
  breakdownAllocation,
  portfolioSharpe,
  rebalanceHint,
} from "@/lib/allocation";
import { cn } from "@/lib/cn";
import { formatKr, formatPct } from "@/lib/format";
import type { Portfolio } from "@/lib/portfolio";
import type { Instrument } from "@/lib/prices";

export function AllocationSection({
  portfolio,
  instruments,
}: {
  portfolio: Portfolio;
  instruments: Instrument[];
}) {
  const breakdown = breakdownAllocation(portfolio, instruments);
  const sharpe = portfolioSharpe(breakdown);
  const hint = rebalanceHint(breakdown);

  const hasPositions = breakdown.totalMarketValue > 0;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-neutral-900">
        Allokering & Sharpe
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-neutral-500">
        En blick på din <strong>kärna/krydda-balans</strong> (lektion 6). Bred
        globalfond räknas som <em>kärna</em>, Sverigefonden som{" "}
        <em>Sverige-tilt</em>, enskilda aktier som <em>krydda</em>.
        <strong> Sharpe-kvoten</strong> visar avkastning per enhet risk —
        högre är bättre. För en ung sparare är 70–100 % kärna ett rimligt mål.
      </p>

      {!hasPositions && (
        <p className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
          Köp något i din portfölj först — då räknar vi ut din allokering.
        </p>
      )}

      {hasPositions && (
        <>
          <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="flex h-8 text-xs font-semibold">
              <div
                className="flex items-center justify-center bg-primary text-white"
                style={{ width: `${breakdown.pctCore}%` }}
                title={`Kärna: ${formatKr(breakdown.byCategory["kärna"])}`}
              >
                {breakdown.pctCore >= 5 && formatPct(breakdown.pctCore, 0)}
              </div>
              <div
                className="flex items-center justify-center bg-primary-dark text-white"
                style={{ width: `${breakdown.pctSverige}%` }}
                title={`Sverige: ${formatKr(breakdown.byCategory["sverige"])}`}
              >
                {breakdown.pctSverige >= 5 && formatPct(breakdown.pctSverige, 0)}
              </div>
              <div
                className="flex items-center justify-center bg-neutral-700 text-white"
                style={{ width: `${breakdown.pctKrydda}%` }}
                title={`Krydda: ${formatKr(breakdown.byCategory["krydda"])}`}
              >
                {breakdown.pctKrydda >= 5 && formatPct(breakdown.pctKrydda, 0)}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 p-4 text-sm">
              <LegendItem
                color="bg-primary"
                label="Kärna (globalfond)"
                value={formatKr(Math.round(breakdown.byCategory["kärna"]))}
                pct={formatPct(breakdown.pctCore, 0)}
              />
              <LegendItem
                color="bg-primary-dark"
                label="Sverige-tilt"
                value={formatKr(Math.round(breakdown.byCategory["sverige"]))}
                pct={formatPct(breakdown.pctSverige, 0)}
              />
              <LegendItem
                color="bg-neutral-700"
                label="Krydda"
                value={formatKr(Math.round(breakdown.byCategory["krydda"]))}
                pct={formatPct(breakdown.pctKrydda, 0)}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 rounded-2xl border border-neutral-200 bg-white p-6">
            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-500">
                Sharpe-kvot (approximation)
              </div>
              <div className="mt-1 text-2xl font-bold tabular-nums text-neutral-900">
                {sharpe.toFixed(2)}
              </div>
              <div className="mt-1 text-xs text-neutral-500">
                {sharpeLabel(sharpe)}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-500">
                Antal innehav
              </div>
              <div className="mt-1 text-2xl font-bold tabular-nums text-neutral-900">
                {portfolio.positions.length}
              </div>
              <div className="mt-1 text-xs text-neutral-500">
                {portfolio.positions.length < 5
                  ? "Få innehav = hög enskild risk"
                  : portfolio.positions.length >= 15
                    ? "Många innehav — bra spridning"
                    : "Ok spridning"}
              </div>
            </div>
          </div>

          <p
            className={cn(
              "mt-3 rounded-xl border px-4 py-3 text-sm",
              hint.needCoreIncrease > 0
                ? "border-amber-200 bg-amber-50 text-amber-900"
                : hint.needCoreDecrease > 0
                  ? "border-blue-200 bg-blue-50 text-blue-900"
                  : "border-neutral-200 bg-neutral-50 text-neutral-700",
            )}
          >
            <strong>Tips:</strong> {hint.message}
          </p>

          <p className="mt-3 text-xs text-neutral-500">
            Sharpe-talen här bygger på historiska genomsnitt för varje kategori
            (kärna ~0,57 · sverige ~0,47 · krydda ~0,32). En portfölj med mer
            kärna har högre Sharpe-kvot eftersom diversifiering minskar risken
            utan att minska den förväntade avkastningen lika mycket. Det är{" "}
            <em>diversifieringens gratislunch</em> i siffror.
          </p>
        </>
      )}
    </section>
  );
}

function LegendItem({
  color,
  label,
  value,
  pct,
}: {
  color: string;
  label: string;
  value: string;
  pct: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className={cn("mt-0.5 h-3 w-3 rounded-sm", color)} />
      <div className="min-w-0">
        <div className="text-xs text-neutral-500">{label}</div>
        <div className="font-medium tabular-nums text-neutral-900">{value}</div>
        <div className="text-xs tabular-nums text-neutral-500">{pct}</div>
      </div>
    </div>
  );
}

function sharpeLabel(s: number): string {
  if (s >= 0.7) return "Mycket bra — bred, diversifierad portfölj";
  if (s >= 0.5) return "Bra balans";
  if (s >= 0.35) return "OK — överväg mer kärna";
  return "Risk i förhållande till avkastning är hög — spridning hjälper";
}
