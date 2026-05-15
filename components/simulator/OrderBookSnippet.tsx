"use client";

import { Speech, type Character } from "@/components/simulator/Speech";
import { cn } from "@/lib/cn";
import { formatKr } from "@/lib/format";

/**
 * Mini-orderbok: 3 nivåer bid + 3 nivåer ask runt nuvarande pris.
 * Spread skalas mot handelsvolym — låg volym = stor spread.
 * Detta är illustrativt, ej riktig orderbook-data.
 */
export function OrderBookSnippet({
  currentPrice,
  avgDailyVolume,
}: {
  currentPrice: number;
  avgDailyVolume?: number;
}) {
  const spreadPct = computeSpread(avgDailyVolume);
  const halfSpread = (currentPrice * spreadPct) / 2;
  const tick = Math.max(0.01, currentPrice * 0.001);

  const bids = [0, 1, 2].map((i) => ({
    price: currentPrice - halfSpread - i * tick,
    qty: 500 + i * 800 + Math.round(i * 400),
  }));
  const asks = [0, 1, 2].map((i) => ({
    price: currentPrice + halfSpread + i * tick,
    qty: 500 + i * 800 + Math.round(i * 400),
  }));

  const spreadKr = asks[0].price - bids[0].price;
  const mood = marketMood(spreadPct);

  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs">
      <div className="mb-2 flex items-center justify-between text-neutral-500">
        <span>Exempel-orderbok</span>
        <span className="tabular-nums">
          spread {formatKr(spreadKr, 2)} ({(spreadPct * 100).toFixed(2)} %)
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1 text-[10px] uppercase tracking-wider text-neutral-500">
            Köpare vill betala
          </div>
          {bids.map((b, i) => (
            <BookRow
              key={i}
              price={b.price}
              qty={b.qty}
              side="bid"
              topRow={i === 0}
            />
          ))}
        </div>
        <div>
          <div className="mb-1 text-[10px] uppercase tracking-wider text-neutral-500">
            Säljare vill ha
          </div>
          {asks.map((a, i) => (
            <BookRow
              key={i}
              price={a.price}
              qty={a.qty}
              side="ask"
              topRow={i === 0}
            />
          ))}
        </div>
      </div>
      <Speech character={mood.character} className="mt-3">
        {mood.quote}
      </Speech>
    </div>
  );
}

function marketMood(spreadPct: number): { character: Character; quote: string } {
  if (spreadPct >= 0.015) {
    return {
      character: "mr-market-depressed",
      quote:
        "Ingen vill köpa det här just nu… spreaden är vid. Du betalar dyrt för att komma in och får billigt om du vill ut. Småbolag, säger jag bara.",
    };
  }
  if (spreadPct <= 0.002) {
    return {
      character: "mr-market-manic",
      quote:
        "Massor av kö på båda sidor — spreaden är minimal! Likvid aktie. Du kan handla för 100 000 kr utan att flytta priset.",
    };
  }
  return {
    character: "mr-market-neutral",
    quote:
      "Normal spread för storbolag — ~0,5 %. Du tappar inte mycket på att handla nu, men kvitto­hubbet kostar alltid något.",
  };
}

function BookRow({
  price,
  qty,
  side,
  topRow,
}: {
  price: number;
  qty: number;
  side: "bid" | "ask";
  topRow: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between tabular-nums",
        topRow ? "font-semibold" : "text-neutral-600",
      )}
    >
      <span
        className={cn(
          side === "bid" ? "text-primary-dark" : "text-red-600",
        )}
      >
        {formatKr(price, 2)}
      </span>
      <span className="text-neutral-500">{qty.toLocaleString("sv-SE")}</span>
    </div>
  );
}

function computeSpread(avgDailyVolume?: number): number {
  if (!avgDailyVolume || avgDailyVolume <= 0) return 0.003;
  // Heuristik: 5 M aktier/dag ger ~0.05 %, 100 k/dag ger ~2 %
  const pct = Math.max(0.0005, Math.min(0.03, 1000 / avgDailyVolume));
  return pct;
}
