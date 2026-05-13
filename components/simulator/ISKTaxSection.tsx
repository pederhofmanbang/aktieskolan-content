"use client";

import { cn } from "@/lib/cn";
import { formatKr, formatPct } from "@/lib/format";
import {
  calculateAFTax,
  calculateISK,
  ISK_BREAKEVEN_RETURN,
  ISK_FRIBELOPP_2026,
  ISK_PAFLAGG,
  ISK_STATSLANERANTA_2026,
} from "@/lib/iskTax";
import type { Portfolio } from "@/lib/portfolio";
import type { Instrument } from "@/lib/prices";

export function ISKTaxSection({
  portfolio,
  instruments,
  embedded = false,
}: {
  portfolio: Portfolio;
  instruments: Instrument[];
  embedded?: boolean;
}) {
  const byTicker = new Map(instruments.map((i) => [i.ticker, i]));
  const marketValue = portfolio.positions.reduce((sum, pos) => {
    const inst = byTicker.get(pos.ticker);
    return sum + (inst ? inst.currentPrice * pos.shares : 0);
  }, 0);
  const totalCost = portfolio.positions.reduce((s, p) => s + p.totalCost, 0);
  const kapitalunderlag = marketValue + portfolio.cash;
  const isk = calculateISK(kapitalunderlag);
  const realizedGain = Math.max(0, marketValue - totalCost);
  const afTax = calculateAFTax(realizedGain);
  const savings = afTax - isk.schablonskatt;

  return (
    <section className="mt-12">
      {!embedded && (
        <>
        <h2 className="text-xl font-semibold text-neutral-900">ISK-skattevy 2026</h2>
      <p className="mt-1 text-sm leading-relaxed text-neutral-500">
        Så här räknas <strong>schablonskatten</strong> på ditt ISK 2026
        (lektion 7). På ett riktigt ISK görs detta automatiskt av banken.
        Schablonintäkten är{" "}
        {formatPct(
          (ISK_STATSLANERANTA_2026 + ISK_PAFLAGG) * 100,
          2,
        )}{" "}
        (statslåneräntan{" "}
        {formatPct(ISK_STATSLANERANTA_2026 * 100, 2)} + 1 procentenhet) på
        kapital över fribeloppet. Skatten på schablonintäkten är 30 %.
      </p>
        </>
      )}

      <div className="mt-4 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-4 py-2 font-medium">Steg</th>
              <th className="px-4 py-2 font-medium tabular-nums">Värde</th>
              <th className="px-4 py-2 font-medium">Förklaring</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            <Row
              step="1. Kapitalunderlag"
              value={formatKr(Math.round(isk.kapitalunderlag))}
              note="Snittet av kontots värde kvartalvis + halva insättningar (här förenklat till nuvärdet)"
            />
            <Row
              step="2. Minus fribeloppet"
              value={`− ${formatKr(isk.fribelopp)}`}
              note="2026 års fribelopp per person (höjt från 150 000 kr 2025)"
            />
            <Row
              step="3. Skattegrund"
              value={formatKr(Math.round(isk.skattegrund))}
              note={isk.skattegrund > 0 ? "Det är detta du betalar skatt på" : "Du är under fribeloppet — ingen skatt"}
              highlight={isk.skattegrund > 0}
            />
            <Row
              step="4. Schablonintäkt"
              value={`× ${formatPct(isk.schablonintaktRate * 100, 2)} = ${formatKr(Math.round(isk.schablonintakt))}`}
              note="Räknas som om dina pengar växte med statslåneränta + 1 procentenhet"
            />
            <Row
              step="5. Schablonskatt"
              value={`× 30 % = ${formatKr(Math.round(isk.schablonskatt))}`}
              note={`Effektivt ${formatPct(isk.skattRate * 100, 3)} av kapitalet över fribeloppet`}
              highlight
            />
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:grid-cols-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-neutral-500">
            Du betalar på ISK
          </div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-neutral-900">
            {formatKr(Math.round(isk.schablonskatt))}
          </div>
          <div className="mt-1 text-xs text-neutral-500">per år, oavsett vinst eller förlust</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-neutral-500">
            Om kontot vore AF
          </div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-neutral-900">
            {formatKr(Math.round(afTax))}
          </div>
          <div className="mt-1 text-xs text-neutral-500">
            {realizedGain > 0
              ? `30 % på orealiserad vinst ${formatKr(Math.round(realizedGain))} om du sålde allt nu`
              : "Ingen vinst att skatta på"}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-neutral-500">
            ISK-fördel
          </div>
          <div
            className={cn(
              "mt-1 text-2xl font-bold tabular-nums",
              savings >= 0 ? "text-primary-dark" : "text-red-600",
            )}
          >
            {savings >= 0 ? "+" : ""}
            {formatKr(Math.round(savings))}
          </div>
          <div className="mt-1 text-xs text-neutral-500">
            {savings >= 0
              ? "Så mycket sparar du på att ha valt ISK"
              : "Just nu vinner AF — ovanligt, blir ISK-fördel vid tillväxt"}
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-neutral-500">
        <strong>Brytpunkt:</strong> ISK är billigare än AF när pengarna växer
        mer än ~{formatPct(ISK_BREAKEVEN_RETURN * 100, 2)} per år. Globala
        aktiemarknaden har historiskt gett 7–9 % — där är ISK tydligt bättre.
        Vid förlust eller stillastående portfölj är AF billigare (där betalar
        du inget alls på en förlust). Förenkling i denna vy: kapitalunderlaget
        beräknas på nuvärdet, inte snittet vid Q1/Q2/Q3/Q4 som banken gör.
      </p>
    </section>
  );
}

function Row({
  step,
  value,
  note,
  highlight,
}: {
  step: string;
  value: string;
  note: string;
  highlight?: boolean;
}) {
  return (
    <tr className={highlight ? "bg-primary/5" : undefined}>
      <td className="px-4 py-2 text-neutral-700">{step}</td>
      <td className={cn("px-4 py-2 tabular-nums", highlight ? "font-semibold text-neutral-900" : "text-neutral-900")}>{value}</td>
      <td className="px-4 py-2 text-xs text-neutral-500">{note}</td>
    </tr>
  );
}
