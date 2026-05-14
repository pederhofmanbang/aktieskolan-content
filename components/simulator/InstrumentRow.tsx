"use client";

import { useState } from "react";

import { OrderBookSnippet } from "@/components/simulator/OrderBookSnippet";
import { cn } from "@/lib/cn";
import { COMPANY_INFO } from "@/data/companies";
import {
  formatKr,
  formatPct,
  formatShares,
  formatVolume,
} from "@/lib/format";
import type { Instrument } from "@/lib/prices";
import { sectorColors } from "@/lib/sectors";

export type ActionResult = { ok: true } | { ok: false; reason: string };

export function InstrumentRow({
  instrument,
  cash,
  onBuy,
  onPlaceLimit,
  setError,
  allowLimit = false,
}: {
  instrument: Instrument;
  cash: number;
  onBuy: (ticker: string, sek: number) => ActionResult;
  onPlaceLimit: (args: {
    ticker: string;
    limitPrice: number;
    amount: number;
  }) => ActionResult;
  setError: (msg: string | null) => void;
  allowLimit?: boolean;
}) {
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [amountText, setAmountText] = useState<string>("");
  const [limitPriceText, setLimitPriceText] = useState<string>("");
  const [showOrderBook, setShowOrderBook] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const info = COMPANY_INFO[instrument.ticker];

  const amount = Number(amountText.replace(/\s/g, "").replace(",", "."));
  const limitPrice = Number(
    limitPriceText.replace(/\s/g, "").replace(",", "."),
  );
  const isFund = instrument.type === "fund";
  const effectivePrice =
    orderType === "limit" && limitPrice > 0
      ? limitPrice
      : instrument.currentPrice;
  const sharesRaw =
    Number.isFinite(amount) && amount > 0 ? amount / effectivePrice : 0;
  const shares = isFund ? sharesRaw : Math.floor(sharesRaw);
  const total = shares * effectivePrice;
  const minShares = isFund ? 1e-6 : 1;

  const canMarket =
    orderType === "market" &&
    shares >= minShares &&
    total <= cash + 0.005 &&
    total > 0;
  const canLimit =
    orderType === "limit" &&
    allowLimit &&
    Number.isFinite(amount) &&
    amount > 0 &&
    amount <= cash + 0.005 &&
    Number.isFinite(limitPrice) &&
    limitPrice > 0;

  const handlePercent = (pct: number) => {
    const value = Math.floor(cash * pct);
    setAmountText(String(value));
  };

  const handleAction = () => {
    if (orderType === "market") {
      const result = onBuy(instrument.ticker, amount);
      if (result.ok) {
        setAmountText("");
        setError(null);
      } else {
        setError(result.reason);
      }
    } else {
      const result = onPlaceLimit({
        ticker: instrument.ticker,
        limitPrice,
        amount,
      });
      if (result.ok) {
        setAmountText("");
        setLimitPriceText("");
        setError(null);
      } else {
        setError(result.reason);
      }
    }
  };

  return (
    <li className="rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-neutral-300">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900">
              {instrument.name}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                sectorColors(instrument.sector).bg,
                sectorColors(instrument.sector).text,
              )}
            >
              {instrument.sector ?? "Fond"}
            </span>
          </div>
          <div className="text-xs text-neutral-500">
            ticker {instrument.ticker.replace(".ST", "")}
            {instrument.fee != null && (
              <> · årlig avgift {formatPct(instrument.fee * 100, 2)}</>
            )}
            {instrument.avgDailyVolume != null && (
              <> · handelsvolym {formatVolume(instrument.avgDailyVolume)}</>
            )}
          </div>
        </div>
        <div className="flex items-start gap-2">
          {info && (
            <button
              type="button"
              onClick={() => setShowInfo((v) => !v)}
              title="Om bolaget"
              aria-label="Visa information om bolaget"
              className="rounded-full border border-neutral-200 px-2 py-0.5 text-xs text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-800"
            >
              {showInfo ? "Stäng" : "i"}
            </button>
          )}
          <div className="text-right">
            <div className="font-semibold tabular-nums text-neutral-900">
              {formatKr(instrument.currentPrice, 2)}
            </div>
            <div className="text-xs text-neutral-400">{instrument.asOf}</div>
          </div>
        </div>
      </div>

      {showInfo && info && (
        <div className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-700">
          <p>{info.description}</p>
          <p className="mt-2 text-neutral-600">
            <strong>Pedagogisk poäng:</strong> {info.why}
          </p>
        </div>
      )}

      {allowLimit && (
        <div className="mt-3 flex flex-wrap items-center gap-1 text-xs">
          <OrderTypeButton
            active={orderType === "market"}
            onClick={() => setOrderType("market")}
            label="Marknadsorder"
            hint="köp nu till aktuell kurs"
          />
          <OrderTypeButton
            active={orderType === "limit"}
            onClick={() => setOrderType("limit")}
            label="Limitorder"
            hint="köp bara om priset når mitt maxpris"
          />
          <button
            type="button"
            onClick={() => setShowOrderBook((v) => !v)}
            className="ml-auto rounded-md border border-neutral-200 px-2 py-1 text-xs text-neutral-600 transition-colors hover:border-neutral-400"
            title="Visa orderbok (köpare och säljare just nu)"
          >
            {showOrderBook ? "Dölj orderbok" : "Visa orderbok"}
          </button>
        </div>
      )}

      {allowLimit && showOrderBook && (
        <div className="mt-2">
          <OrderBookSnippet
            currentPrice={instrument.currentPrice}
            avgDailyVolume={instrument.avgDailyVolume}
          />
        </div>
      )}

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
        {orderType === "limit" && (
          <label className="flex items-center gap-2 text-sm text-neutral-600">
            <span className="text-neutral-500">max</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder={instrument.currentPrice.toFixed(2)}
              value={limitPriceText}
              onChange={(e) =>
                setLimitPriceText(e.target.value.replace(/[^\d ,.]/g, ""))
              }
              className="w-24 rounded-lg border border-neutral-200 px-2 py-1 text-sm tabular-nums focus:border-primary focus:outline-none"
              aria-label={`Limit-pris för ${instrument.name}`}
            />
            kr/aktie
          </label>
        )}
        {orderType === "market" && (
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
        )}
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
          disabled={orderType === "market" ? !canMarket : !canLimit}
          onClick={handleAction}
          className="ml-auto rounded-full bg-primary px-5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {orderType === "market" ? "Köp" : "Lägg limitorder"}
        </button>
      </div>
    </li>
  );
}

function OrderTypeButton({
  active,
  onClick,
  label,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={hint}
      className={cn(
        "rounded-md border px-3 py-1 transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary-dark"
          : "border-neutral-200 text-neutral-600 hover:border-neutral-400",
      )}
    >
      <span className="font-medium">{label}</span>
    </button>
  );
}
