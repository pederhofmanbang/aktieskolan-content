"use client";

import { cn } from "@/lib/cn";
import { formatKr } from "@/lib/format";
import type { ActiveOrder } from "@/lib/portfolio";
import type { Instrument } from "@/lib/prices";

export function ActiveOrdersSection({
  orders,
  instrumentByTicker,
  onCancel,
}: {
  orders: ActiveOrder[];
  instrumentByTicker: Record<string, Instrument | undefined>;
  onCancel: (id: string) => void;
}) {
  if (orders.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-neutral-900">Aktiva ordrar</h2>
      <p className="mt-1 text-sm leading-relaxed text-neutral-500">
        <strong>Limitorder</strong> = du köper bara om priset når ner till ditt
        maxpris. Ordern ligger kvar tills kursen träffar din gräns (vanligen via{" "}
        <em>Tidsmaskinen</em>) eller du avbryter den. På ett riktigt konto
        reserveras dina pengar — i simulatorn räknas kassan vid fyllningen.
      </p>
      <ul className="mt-4 space-y-2">
        {orders.map((order) => {
          const inst = instrumentByTicker[order.ticker];
          const currentPrice = inst?.currentPrice ?? 0;
          const triggered = currentPrice > 0 && currentPrice <= order.limitPrice;
          const distance =
            currentPrice > 0
              ? ((currentPrice - order.limitPrice) / currentPrice) * 100
              : 0;
          const ts = new Date(order.ts);
          return (
            <li
              key={order.id}
              className="rounded-xl border border-neutral-200 bg-white p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-semibold text-neutral-900">
                    {inst?.name ?? order.ticker}
                  </div>
                  <div className="text-sm text-neutral-500">
                    Köp för {formatKr(order.amount)} när priset är{" "}
                    <span className="font-medium text-neutral-700">
                      ≤ {formatKr(order.limitPrice, 2)}
                    </span>
                    <span className="ml-2 text-xs text-neutral-400">
                      lagd{" "}
                      {ts.toLocaleDateString("sv-SE", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-neutral-500">
                      Aktuell kurs
                    </div>
                    <div className="font-semibold tabular-nums text-neutral-900">
                      {formatKr(currentPrice, 2)}
                    </div>
                    <div
                      className={cn(
                        "text-xs tabular-nums",
                        triggered ? "text-primary-dark" : "text-neutral-400",
                      )}
                    >
                      {triggered
                        ? "✓ inom gränsen"
                        : `${distance.toFixed(1)} % över din gräns`}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCancel(order.id)}
                    className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-400"
                  >
                    Avbryt
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
