"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/cn";
import {
  formatKr,
  formatPct,
  formatShares,
  formatSignedKr,
  formatVolume,
} from "@/lib/format";
import {
  buy,
  initialPortfolio,
  loadPortfolio,
  resetPortfolio,
  savePortfolio,
  sell,
  type Portfolio,
  type Transaction,
} from "@/lib/portfolio";
import type { Instrument } from "@/lib/prices";

const ISK_FRIBELOPP_2026 = 300_000;

const UNLOCK_LABELS: Record<string, { label: string; lesson: number }> = {
  "simulator.kop_aktie": { label: "Köpa aktier och fonder", lesson: 1 },
  "simulator.limitorder": { label: "Limitorder", lesson: 2 },
  "simulator.fondkop_manadssparande": { label: "Månadssparande", lesson: 3 },
  "simulator.tidsmaskin": { label: "Tidsmaskin", lesson: 4 },
  "simulator.riskmatt_kraschlage": { label: "Krasch-läge", lesson: 5 },
  "simulator.omallokering": { label: "Omallokering & Sharpe", lesson: 6 },
  "simulator.isk_skattevy": { label: "ISK-skattevy", lesson: 7 },
  "simulator.screener": { label: "Aktiescreener", lesson: 8 },
  "simulator.stresstest": { label: "Stresstest", lesson: 9 },
  certifikat: { label: "Min plan & certifikat", lesson: 10 },
};

const UNLOCK_ORDER = Object.keys(UNLOCK_LABELS);

export function SimulatorView({ instruments }: { instruments: Instrument[] }) {
  const [portfolio, setPortfolio] = useState<Portfolio>(initialPortfolio);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPortfolio(loadPortfolio());
    setHydrated(true);
  }, []);

  const instrumentByTicker = useMemo(
    () => Object.fromEntries(instruments.map((i) => [i.ticker, i])),
    [instruments],
  );

  const marketValue = portfolio.positions.reduce((sum, pos) => {
    const inst = instrumentByTicker[pos.ticker];
    return sum + (inst ? inst.currentPrice * pos.shares : 0);
  }, 0);
  const totalValue = portfolio.cash + marketValue;
  const totalCost = portfolio.positions.reduce((s, p) => s + p.totalCost, 0);
  const totalPL = marketValue - totalCost;
  const totalPLPct = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;
  const fribeloppKvar = Math.max(0, ISK_FRIBELOPP_2026 - totalValue);

  const handleBuy = (
    ticker: string,
    sek: number,
  ): { ok: true } | { ok: false; reason: string } => {
    setError(null);
    const inst = instrumentByTicker[ticker];
    if (!inst) return { ok: false, reason: "Okänt instrument" };
    if (!Number.isFinite(sek) || sek <= 0) {
      return { ok: false, reason: "Ange ett belopp större än 0" };
    }
    if (sek > portfolio.cash + 0.005) {
      return { ok: false, reason: "Inte tillräckligt med kassa" };
    }
    const shares =
      inst.type === "fund" ? sek / inst.currentPrice : Math.floor(sek / inst.currentPrice);
    if (shares < (inst.type === "fund" ? 1e-6 : 1)) {
      return {
        ok: false,
        reason:
          inst.type === "fund" ? "Beloppet är för litet" : "För litet belopp för 1 aktie",
      };
    }
    try {
      const updated = buy(portfolio, {
        ticker,
        shares,
        price: inst.currentPrice,
      });
      setPortfolio(updated);
      savePortfolio(updated);
      return { ok: true };
    } catch (e) {
      return { ok: false, reason: e instanceof Error ? e.message : "Något gick fel" };
    }
  };

  const handleSell = (ticker: string, shares: number) => {
    setError(null);
    const inst = instrumentByTicker[ticker];
    if (!inst) {
      setError("Okänt instrument");
      return;
    }
    try {
      const updated = sell(portfolio, {
        ticker,
        shares,
        price: inst.currentPrice,
      });
      setPortfolio(updated);
      savePortfolio(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Något gick fel");
    }
  };

  const handleReset = () => {
    if (!window.confirm("Nollställ portföljen? All historik försvinner.")) return;
    setPortfolio(resetPortfolio());
    setError(null);
  };

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="text-neutral-500">Laddar portfölj…</div>
      </main>
    );
  }

  const stocks = instruments.filter((i) => i.type === "stock");
  const funds = instruments.filter((i) => i.type === "fund");
  const recentTransactions = portfolio.transactions.slice(0, 10);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 sm:py-12">
      <div className="flex items-center justify-between">
        <Link
          href="/lektioner"
          className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
        >
          ← Tillbaka
        </Link>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-neutral-400 transition-colors hover:text-neutral-700"
        >
          Nollställ portfölj
        </button>
      </div>

      <header className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Simulator
        </h1>
        <p className="mt-2 text-neutral-600">
          Simulerat{" "}
          <span className="font-semibold">ISK (Investeringssparkonto)</span> med
          100 000 kr i låtsaspengar. Sparas lokalt i din webbläsare och påverkar
          inga riktiga pengar. Skattereglerna för ISK gås igenom utförligt i
          lektion 7.
        </p>
      </header>

      <section className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:grid-cols-4">
        <Stat label="Kassa" value={formatKr(portfolio.cash)} />
        <Stat label="Investerat värde" value={formatKr(marketValue)} />
        <Stat label="Totalt" value={formatKr(totalValue)} emphasis />
        <Stat
          label="Resultat"
          value={
            totalCost > 0
              ? `${formatSignedKr(totalPL)} (${formatPct(totalPLPct)})`
              : "—"
          }
          tone={totalCost === 0 ? "neutral" : totalPL >= 0 ? "positive" : "negative"}
        />
      </section>

      <p className="mt-3 text-xs leading-relaxed text-neutral-500">
        På ett riktigt ISK betalar du en liten årlig skatt (schablonskatt) på
        kapital över <strong>fribeloppet</strong> — 2026 är fribeloppet{" "}
        {formatKr(ISK_FRIBELOPP_2026)} per person.{" "}
        {totalValue < ISK_FRIBELOPP_2026 ? (
          <>
            Du ligger just nu{" "}
            <span className="font-medium text-neutral-700">
              {formatKr(fribeloppKvar)}
            </span>{" "}
            under fribeloppet — helt skattefri. Räkneexempel i lektion 7.
          </>
        ) : (
          <>
            Du ligger{" "}
            <span className="font-medium text-neutral-700">
              {formatKr(totalValue - ISK_FRIBELOPP_2026)}
            </span>{" "}
            över fribeloppet. Räkneexempel på schablonskatten i lektion 7.
          </>
        )}
      </p>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {portfolio.positions.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-neutral-900">Min portfölj</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Dina nuvarande innehav. <strong>GAV</strong> = genomsnittspris per
            aktie/andel du betalat. <strong>Resultat</strong> = dagens värde
            minus det du satte in.
          </p>
          <ul className="mt-4 space-y-2">
            {portfolio.positions.map((pos) => {
              const inst = instrumentByTicker[pos.ticker];
              if (!inst) return null;
              return (
                <PositionRow
                  key={pos.ticker}
                  instrument={inst}
                  shares={pos.shares}
                  totalCost={pos.totalCost}
                  onSell={handleSell}
                />
              );
            })}
          </ul>
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-neutral-900">Köp aktier</h2>
        <p className="mt-1 text-sm leading-relaxed text-neutral-500">
          16 svenska bolag · senaste kurser från Yahoo Finance. Skriv ett belopp
          i kr, eller använd snabbvalen (10 / 25 / 50 % av din kassa) för att
          öva på <strong>positionsstorlek</strong>.{" "}
          <span className="block sm:inline">
            <strong>Handelsvolym</strong> visar hur många aktier som byter ägare
            en typisk dag — låg volym = svårare att handla snabbt och större
            spread.
          </span>
        </p>
        <ul className="mt-4 space-y-2">
          {stocks.map((inst) => (
            <InstrumentRow
              key={inst.ticker}
              instrument={inst}
              cash={portfolio.cash}
              onBuy={handleBuy}
              setError={setError}
            />
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-neutral-900">Köp fonder</h2>
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
              cash={portfolio.cash}
              onBuy={handleBuy}
              setError={setError}
            />
          ))}
        </ul>
      </section>

      {recentTransactions.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-neutral-900">
            Senaste affärer
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            De {Math.min(10, portfolio.transactions.length)} senaste — totalt{" "}
            {portfolio.transactions.length} affärer
          </p>
          <ul className="mt-4 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
            {recentTransactions.map((tx) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                instrument={instrumentByTicker[tx.ticker]}
              />
            ))}
          </ul>
        </section>
      )}

      <section className="mt-12 mb-8">
        <h2 className="text-xl font-semibold text-neutral-900">
          Funktioner i simulatorn
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Lektionerna låser upp nya funktioner. Just nu är{" "}
          {portfolio.unlocks.length} av {UNLOCK_ORDER.length} upplåsta.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {UNLOCK_ORDER.map((key) => {
            const info = UNLOCK_LABELS[key];
            const isUnlocked = portfolio.unlocks.includes(key);
            return (
              <li
                key={key}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-sm",
                  isUnlocked
                    ? "border-primary/30 bg-primary/5 text-neutral-900"
                    : "border-neutral-200 bg-white text-neutral-400",
                )}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">{isUnlocked ? "✓" : "🔒"}</span>
                  <span className={isUnlocked ? "font-medium" : ""}>
                    {info.label}
                  </span>
                </span>
                <span className="text-xs">Lektion {info.lesson}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
  emphasis,
  tone = "neutral",
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  tone?: "neutral" | "positive" | "negative";
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
    </div>
  );
}

type BuyResult = { ok: true } | { ok: false; reason: string };

function InstrumentRow({
  instrument,
  cash,
  onBuy,
  setError,
}: {
  instrument: Instrument;
  cash: number;
  onBuy: (ticker: string, sek: number) => BuyResult;
  setError: (msg: string | null) => void;
}) {
  const [amountText, setAmountText] = useState<string>("");
  const amount = Number(amountText.replace(/\s/g, "").replace(",", "."));
  const isFund = instrument.type === "fund";
  const sharesRaw =
    Number.isFinite(amount) && amount > 0 ? amount / instrument.currentPrice : 0;
  const shares = isFund ? sharesRaw : Math.floor(sharesRaw);
  const total = shares * instrument.currentPrice;
  const minShares = isFund ? 1e-6 : 1;
  const canBuy = shares >= minShares && total <= cash + 0.005 && total > 0;

  const handlePercent = (pct: number) => {
    const value = Math.floor(cash * pct);
    setAmountText(String(value));
  };

  const handleBuyClick = () => {
    const result = onBuy(instrument.ticker, amount);
    if (result.ok) {
      setAmountText("");
      setError(null);
    } else {
      setError(result.reason);
    }
  };

  return (
    <li className="rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-neutral-300">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="font-semibold text-neutral-900">{instrument.name}</div>
          <div className="text-xs text-neutral-500">
            {instrument.sector ?? "Fond"} · ticker{" "}
            {instrument.ticker.replace(".ST", "")}
            {instrument.fee != null && (
              <> · årlig avgift {formatPct(instrument.fee * 100, 2)}</>
            )}
            {instrument.avgDailyVolume != null && (
              <> · handelsvolym {formatVolume(instrument.avgDailyVolume)}</>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold tabular-nums text-neutral-900">
            {formatKr(instrument.currentPrice, 2)}
          </div>
          <div className="text-xs text-neutral-400">{instrument.asOf}</div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-neutral-600">
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={amountText}
            onChange={(e) =>
              setAmountText(e.target.value.replace(/[^\d ,]/g, ""))
            }
            className="w-24 rounded-lg border border-neutral-200 px-2 py-1 text-sm tabular-nums focus:border-primary focus:outline-none"
            aria-label={`Belopp i kr för ${instrument.name}`}
          />
          kr
        </label>
        <div className="flex gap-1">
          {[0.1, 0.25, 0.5].map((p) => {
            const pctLabel = `${Math.round(p * 100)} %`;
            const krValue = Math.floor(cash * p);
            return (
              <button
                key={p}
                type="button"
                onClick={() => handlePercent(p)}
                disabled={cash <= 0}
                title={`${pctLabel} av din kassa = ${formatKr(krValue)}`}
                className="rounded-md border border-neutral-200 px-2 py-1 text-xs tabular-nums text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {formatKr(krValue)}
                <span className="ml-1 text-neutral-400">({pctLabel})</span>
              </button>
            );
          })}
        </div>
        <span className="text-sm text-neutral-500">
          {shares > 0 ? (
            <>
              → {formatShares(shares, isFund)} = {formatKr(total)}
            </>
          ) : (
            <>→ —</>
          )}
        </span>
        <button
          type="button"
          disabled={!canBuy}
          onClick={handleBuyClick}
          className="ml-auto rounded-full bg-primary px-5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          Köp
        </button>
      </div>
    </li>
  );
}

function PositionRow({
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
  const sellShares = Number.isFinite(sellAmount) && sellAmount > 0 ? sellAmount : 0;
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
            {formatShares(shares, isFund)} · GAV {formatKr(gav, 2)}
          </div>
        </div>
        <div className="flex items-center gap-3">
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
            {sellShares > 0 ? formatKr(sellShares * instrument.currentPrice) : ""}
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

function TransactionRow({
  tx,
  instrument,
}: {
  tx: Transaction;
  instrument: Instrument | undefined;
}) {
  const isFund = instrument?.type === "fund";
  const date = new Date(tx.ts);
  const dateStr = date.toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const timeStr = date.toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <li className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
      <div className="min-w-0">
        <div className="font-medium text-neutral-900">
          {instrument?.name ?? tx.ticker}
        </div>
        <div className="text-xs text-neutral-500">
          {dateStr} {timeStr}
        </div>
      </div>
      <div className="text-right tabular-nums">
        <div
          className={cn(
            "text-xs font-semibold uppercase tracking-wider",
            tx.side === "buy" ? "text-primary-dark" : "text-red-600",
          )}
        >
          {tx.side === "buy" ? "Köp" : "Sälj"} {formatShares(tx.shares, isFund)}
        </div>
        <div className="text-xs text-neutral-500">
          @ {formatKr(tx.price, 2)} · {formatKr(tx.total)}
        </div>
      </div>
    </li>
  );
}
