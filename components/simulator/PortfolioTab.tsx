"use client";

import { PositionRow } from "@/components/simulator/PositionRow";
import { TransactionRow } from "@/components/simulator/TransactionRow";
import { cn } from "@/lib/cn";
import { formatKr } from "@/lib/format";
import type { Portfolio } from "@/lib/portfolio";
import type { Instrument } from "@/lib/prices";

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

export function PortfolioTab({
  portfolio,
  instrumentByTicker,
  onSell,
  onCancelOrder,
}: {
  portfolio: Portfolio;
  instrumentByTicker: Record<string, Instrument | undefined>;
  onSell: (ticker: string, shares: number) => void;
  onCancelOrder: (id: string) => void;
}) {
  const recentTransactions = portfolio.transactions.slice(0, 10);

  return (
    <div className="space-y-12 py-2">
      <section>
        <h2 className="text-xl font-semibold text-neutral-900">Min portfölj</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Dina nuvarande innehav. <strong>GAV</strong> = genomsnittspris per
          aktie/andel du betalat. <strong>Resultat</strong> = dagens värde
          minus det du satte in.
        </p>
        {portfolio.positions.length === 0 ? (
          <EmptyState>
            Du äger inget ännu. Gå till fliken <strong>Köp &amp; sälj</strong>{" "}
            och börja med exempelvis Investor B (lektion 1).
          </EmptyState>
        ) : (
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
                  onSell={onSell}
                />
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-neutral-900">Aktiva ordrar</h2>
        <p className="mt-1 text-sm leading-relaxed text-neutral-500">
          <strong>Limitorder</strong> = du köper bara om priset når ner till
          ditt maxpris. Ordrar ligger kvar tills kursen träffar gränsen eller
          du avbryter dem.
        </p>
        {portfolio.activeOrders.length === 0 ? (
          <EmptyState>
            Inga väntande limit-ordrar. Lägg en på fliken{" "}
            <strong>Köp &amp; sälj</strong> (lektion 2).
          </EmptyState>
        ) : (
          <ul className="mt-4 space-y-2">
            {portfolio.activeOrders.map((order) => {
              const inst = instrumentByTicker[order.ticker];
              const currentPrice = inst?.currentPrice ?? 0;
              const triggered =
                currentPrice > 0 && currentPrice <= order.limitPrice;
              const distance =
                currentPrice > 0
                  ? ((currentPrice - order.limitPrice) / currentPrice) * 100
                  : 0;
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
                        onClick={() => onCancelOrder(order.id)}
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
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-neutral-900">
          Senaste affärer
        </h2>
        {recentTransactions.length === 0 ? (
          <EmptyState>Inga affärer än. Gör ditt första köp så syns det här.</EmptyState>
        ) : (
          <>
            <p className="mt-1 text-sm text-neutral-500">
              De {Math.min(10, portfolio.transactions.length)} senaste — totalt{" "}
              {portfolio.transactions.length} affärer.
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
          </>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-neutral-900">
          Funktioner i simulatorn
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Lektionerna låser upp nya funktioner. Just nu{" "}
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
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-center text-sm text-neutral-600">
      {children}
    </p>
  );
}
