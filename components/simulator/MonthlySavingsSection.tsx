"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import { formatKr, formatPct } from "@/lib/format";
import type { MonthlyPurchase } from "@/lib/portfolio";
import type { Instrument } from "@/lib/prices";

export function MonthlySavingsSection({
  monthlies,
  funds,
  onAdd,
  onToggle,
  onRemove,
}: {
  monthlies: MonthlyPurchase[];
  funds: Instrument[];
  onAdd: (args: { ticker: string; amount: number; dayOfMonth: number }) =>
    | { ok: true }
    | { ok: false; reason: string };
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const [ticker, setTicker] = useState(funds[0]?.ticker ?? "");
  const [amountText, setAmountText] = useState("1000");
  const [dayText, setDayText] = useState("25");
  const [error, setError] = useState<string | null>(null);

  const amount = Number(amountText.replace(/\s/g, "").replace(",", "."));
  const day = Number(dayText);
  const canAdd =
    !!ticker &&
    Number.isFinite(amount) &&
    amount > 0 &&
    Number.isInteger(day) &&
    day >= 1 &&
    day <= 28;

  const totalMonthly = monthlies
    .filter((m) => m.active)
    .reduce((s, m) => s + m.amount, 0);

  const handleAdd = () => {
    if (!canAdd) return;
    const result = onAdd({ ticker, amount, dayOfMonth: day });
    if (result.ok) {
      setAmountText("1000");
      setError(null);
    } else {
      setError(result.reason);
    }
  };

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-neutral-900">Månadssparande</h2>
      <p className="mt-1 text-sm leading-relaxed text-neutral-500">
        Sätter upp ett <strong>återkommande automatiskt köp</strong> samma dag
        varje månad. Pedagogiskt mest värde med en bred globalfond — då
        utnyttjar du både diversifiering (lektion 6) och ränta-på-ränta
        (lektion 4). I simulatorn kör månadssparandet inte i bakgrunden — det
        materialiseras när du kör <em>Tidsmaskinen</em>.
      </p>

      <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-xs text-neutral-600">
            <span>Fond</span>
            <select
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-sm text-neutral-900 focus:border-primary focus:outline-none"
            >
              {funds.map((f) => (
                <option key={f.ticker} value={f.ticker}>
                  {f.name}
                  {f.fee != null && ` (${formatPct(f.fee * 100, 2)} avgift)`}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-neutral-600">
            <span>Belopp per månad</span>
            <span className="flex items-center gap-1">
              <input
                type="text"
                inputMode="numeric"
                value={amountText}
                onChange={(e) =>
                  setAmountText(e.target.value.replace(/[^\d ,]/g, ""))
                }
                className="w-24 rounded-lg border border-neutral-200 px-2 py-1.5 text-sm tabular-nums focus:border-primary focus:outline-none"
              />
              <span className="text-neutral-500">kr</span>
            </span>
          </label>
          <label className="flex flex-col gap-1 text-xs text-neutral-600">
            <span>Dag i månaden (1–28)</span>
            <input
              type="text"
              inputMode="numeric"
              value={dayText}
              onChange={(e) =>
                setDayText(e.target.value.replace(/[^\d]/g, "").slice(0, 2))
              }
              className="w-16 rounded-lg border border-neutral-200 px-2 py-1.5 text-sm tabular-nums focus:border-primary focus:outline-none"
            />
          </label>
          <button
            type="button"
            disabled={!canAdd}
            onClick={handleAdd}
            className="ml-auto rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            Aktivera
          </button>
        </div>
        {error && (
          <div
            role="alert"
            className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </div>
        )}
      </div>

      {monthlies.length > 0 && (
        <>
          <ul className="mt-4 space-y-2">
            {monthlies.map((m) => {
              const inst = funds.find((f) => f.ticker === m.ticker);
              return (
                <li
                  key={m.id}
                  className={cn(
                    "flex flex-col gap-2 rounded-xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between",
                    m.active
                      ? "border-neutral-200"
                      : "border-neutral-200 opacity-60",
                  )}
                >
                  <div>
                    <div className="font-semibold text-neutral-900">
                      {inst?.name ?? m.ticker}
                    </div>
                    <div className="text-sm text-neutral-500">
                      {formatKr(m.amount)} per månad · dag {m.dayOfMonth} ·{" "}
                      <span
                        className={
                          m.active ? "text-primary-dark" : "text-neutral-400"
                        }
                      >
                        {m.active ? "aktivt" : "pausat"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onToggle(m.id)}
                      className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-400"
                    >
                      {m.active ? "Pausa" : "Återuppta"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(m.id)}
                      className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-400"
                    >
                      Ta bort
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs text-neutral-500">
            Totalt aktivt månadssparande:{" "}
            <span className="font-medium text-neutral-700">
              {formatKr(totalMonthly)}/månad
            </span>{" "}
            = {formatKr(totalMonthly * 12)}/år.
          </p>
        </>
      )}
    </section>
  );
}
