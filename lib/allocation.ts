import type { Portfolio } from "@/lib/portfolio";
import type { Instrument } from "@/lib/prices";

/**
 * Klassifiera ett instrument som kärna (bred globalfond), Sverigefond eller krydda.
 */
export type AllocationCategory = "kärna" | "sverige" | "krydda";

export function categorize(instrument: Instrument): AllocationCategory {
  if (instrument.type === "fund") {
    const name = instrument.name.toLowerCase();
    if (name.includes("global")) return "kärna";
    if (name.includes("sverige")) return "sverige";
    return "krydda";
  }
  return "krydda";
}

export type AllocationBreakdown = {
  totalMarketValue: number;
  byCategory: Record<AllocationCategory, number>;
  pctCore: number;
  pctSverige: number;
  pctKrydda: number;
};

export function breakdownAllocation(
  p: Portfolio,
  instruments: Instrument[],
): AllocationBreakdown {
  const byTicker = new Map(instruments.map((i) => [i.ticker, i]));
  const byCategory: Record<AllocationCategory, number> = {
    kärna: 0,
    sverige: 0,
    krydda: 0,
  };
  let total = 0;
  for (const pos of p.positions) {
    const inst = byTicker.get(pos.ticker);
    if (!inst) continue;
    const value = inst.currentPrice * pos.shares;
    const cat = categorize(inst);
    byCategory[cat] += value;
    total += value;
  }
  return {
    totalMarketValue: total,
    byCategory,
    pctCore: total > 0 ? (byCategory["kärna"] / total) * 100 : 0,
    pctSverige: total > 0 ? (byCategory["sverige"] / total) * 100 : 0,
    pctKrydda: total > 0 ? (byCategory["krydda"] / total) * 100 : 0,
  };
}

/**
 * Approximerade volatilitets- och avkastningsparametrar per kategori.
 * Värdena är historiska snitt för svenska sparare över ~20 år.
 */
const VOL_RETURN: Record<
  AllocationCategory,
  { expectedReturn: number; volatility: number }
> = {
  kärna: { expectedReturn: 0.08, volatility: 0.14 },
  sverige: { expectedReturn: 0.085, volatility: 0.18 },
  krydda: { expectedReturn: 0.08, volatility: 0.25 },
};

/**
 * Förenklad portfölj-Sharpe utan riskfri ränta-justering (alltså egentligen
 * `expectedReturn / volatility`, som är ett rimligt pedagogiskt approximation
 * för att jämföra portföljer mot varandra).
 *
 * Antaganden:
 * - Korrelationer mellan kategorier sätts till 1 (worst case). En riktig
 *   diversifieringseffekt skulle ge bättre Sharpe i blandade portföljer; det
 *   adresserar vi i en framtida bunt med faktisk historisk data.
 */
export function portfolioSharpe(b: AllocationBreakdown): number {
  if (b.totalMarketValue <= 0) return 0;
  const weights = {
    kärna: b.byCategory["kärna"] / b.totalMarketValue,
    sverige: b.byCategory["sverige"] / b.totalMarketValue,
    krydda: b.byCategory["krydda"] / b.totalMarketValue,
  };
  const expReturn =
    weights.kärna * VOL_RETURN.kärna.expectedReturn +
    weights.sverige * VOL_RETURN.sverige.expectedReturn +
    weights.krydda * VOL_RETURN.krydda.expectedReturn;
  const vol =
    weights.kärna * VOL_RETURN.kärna.volatility +
    weights.sverige * VOL_RETURN.sverige.volatility +
    weights.krydda * VOL_RETURN.krydda.volatility;
  return vol > 0 ? expReturn / vol : 0;
}

/**
 * Föreslå en rebalansering mot 80 % kärna / 20 % krydda.
 */
export type RebalanceHint = {
  needCoreIncrease: number;
  needCoreDecrease: number;
  message: string;
};

export function rebalanceHint(b: AllocationBreakdown): RebalanceHint {
  const targetCore = b.totalMarketValue * 0.8;
  const currentCore = b.byCategory["kärna"];
  const diff = targetCore - currentCore;
  if (b.totalMarketValue === 0) {
    return {
      needCoreIncrease: 0,
      needCoreDecrease: 0,
      message: "Köp något först — då kan vi räkna allokering.",
    };
  }
  if (diff > 0) {
    return {
      needCoreIncrease: diff,
      needCoreDecrease: 0,
      message: `Köp för cirka ${Math.round(diff).toLocaleString("sv-SE")} kr i en bred globalfond för att nå 80 % kärna.`,
    };
  }
  if (diff < -1000) {
    return {
      needCoreIncrease: 0,
      needCoreDecrease: -diff,
      message: `Du har överallokerat kärnan. Du kan flytta ${Math.round(-diff).toLocaleString("sv-SE")} kr till krydda om du vill.`,
    };
  }
  return {
    needCoreIncrease: 0,
    needCoreDecrease: 0,
    message: "Du ligger nära 80/20 — bra balans för en ung sparare.",
  };
}
