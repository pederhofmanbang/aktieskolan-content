"use client";

import { cn } from "@/lib/cn";
import { formatKr, formatShares } from "@/lib/format";
import type { Transaction } from "@/lib/portfolio";
import type { Instrument } from "@/lib/prices";

export function TransactionRow({
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
