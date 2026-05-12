"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/cn";
import { formatKr, formatPct, formatSignedKr } from "@/lib/format";
import {
  buy,
  initialPortfolio,
  loadPortfolio,
  resetPortfolio,
  savePortfolio,
  type Portfolio,
} from "@/lib/portfolio";
import type { Instrument } from "@/lib/prices";

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

  const handleBuy = (ticker: string, sek: number) => {
    setError(null);
    const inst = instrumentByTicker[ticker];
    if (!inst) return;
    const shares = Math.floor(sek / inst.currentPrice);
    if (shares < 1) {
      setError("För lågt belopp för att köpa minst 1 aktie.");
      return;
    }
    try {
      const updated = buy(portfolio, {
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
          Övningsportfölj med 100 000 kr i låtsaspengar. Sparas lokalt i din
          webbläsare.
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
          <h2 className="text-xl font-semibold text-neutral-900">Mina innehav</h2>
          <ul className="mt-4 space-y-2">
            {portfolio.positions.map((pos) => {
              const inst = instrumentByTicker[pos.ticker];
              if (!inst) return null;
              const value = pos.shares * inst.currentPrice;
              const pl = value - pos.totalCost;
              const plPct = (pl / pos.totalCost) * 100;
              const gav = pos.totalCost / pos.shares;
              return (
                <li
                  key={pos.ticker}
                  className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="font-semibold text-neutral-900">
                      {inst.name}
                    </div>
                    <div className="text-sm text-neutral-500">
                      {pos.shares} st · GAV {formatKr(gav, 2)}
                    </div>
                  </div>
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
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-neutral-900">Köp aktier</h2>
        <p className="mt-1 text-sm text-neutral-500">
          16 svenska bolag · senaste kurser från Yahoo
        </p>
        <ul className="mt-4 space-y-2">
          {stocks.map((inst) => (
            <InstrumentRow
              key={inst.ticker}
              instrument={inst}
              cash={portfolio.cash}
              onBuy={handleBuy}
            />
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-neutral-900">Köp fonder</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Syntetiska kurser för pedagogiska syften
        </p>
        <ul className="mt-4 space-y-2">
          {funds.map((inst) => (
            <InstrumentRow
              key={inst.ticker}
              instrument={inst}
              cash={portfolio.cash}
              onBuy={handleBuy}
            />
          ))}
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

function InstrumentRow({
  instrument,
  cash,
  onBuy,
}: {
  instrument: Instrument;
  cash: number;
  onBuy: (ticker: string, sek: number) => void;
}) {
  const [amount, setAmount] = useState<number>(5000);
  const shares = Math.floor(amount / instrument.currentPrice);
  const total = shares * instrument.currentPrice;
  const canBuy = shares >= 1 && total <= cash;

  return (
    <li className="rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-neutral-300">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="font-semibold text-neutral-900">{instrument.name}</div>
          <div className="text-xs text-neutral-500">
            {instrument.sector ?? "Fond"} · {instrument.ticker.replace(".ST", "")}
            {instrument.fee != null && (
              <> · avgift {formatPct(instrument.fee * 100, 2)}</>
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
            type="number"
            min={0}
            step={500}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className="w-24 rounded-lg border border-neutral-200 px-2 py-1 text-sm tabular-nums focus:border-primary focus:outline-none"
          />
          kr
        </label>
        <span className="text-sm text-neutral-500">
          → {shares} st = {formatKr(total)}
        </span>
        <button
          type="button"
          disabled={!canBuy}
          onClick={() => onBuy(instrument.ticker, amount)}
          className="ml-auto rounded-full bg-primary px-5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          Köp
        </button>
      </div>
    </li>
  );
}
