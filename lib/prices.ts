import data from "@/data/prices.json";
import { FUNDAMENTALS, type Fundamentals } from "@/data/fundamentals";
import { VOLUMES } from "@/data/volumes";

export type InstrumentType = "stock" | "fund";

export type Instrument = {
  ticker: string;
  name: string;
  currency: string;
  type: InstrumentType;
  sector?: string;
  fee?: number;
  currentPrice: number;
  asOf: string;
  avgDailyVolume?: number;
  fundamentals?: Fundamentals;
};

type RawPrice = { date: string; close: number };
type RawInstrument = {
  ticker: string;
  name: string;
  currency: string;
  type: InstrumentType;
  sector?: string;
  fee?: number;
  prices: RawPrice[];
};

const raw = data as unknown as {
  lastUpdated: string;
  yearsBack: number;
  instruments: Record<string, RawInstrument>;
};

function toInstrument(r: RawInstrument): Instrument {
  const last = r.prices[r.prices.length - 1];
  return {
    ticker: r.ticker,
    name: r.name,
    currency: r.currency,
    type: r.type,
    sector: r.sector,
    fee: r.fee,
    currentPrice: last.close,
    asOf: last.date,
    avgDailyVolume: VOLUMES[r.ticker]?.avgDailyVolume,
    fundamentals: FUNDAMENTALS[r.ticker],
  };
}

export function listInstruments(): Instrument[] {
  return Object.values(raw.instruments).map(toInstrument);
}

export function getInstrument(ticker: string): Instrument | null {
  const r = raw.instruments[ticker];
  return r ? toInstrument(r) : null;
}

/**
 * Senaste N stängningskurser för ett instrument. Användbart för
 * sparkline-grafer per innehav.
 */
export function recentPrices(ticker: string, days: number): number[] {
  const r = raw.instruments[ticker];
  if (!r) return [];
  return r.prices.slice(-days).map((p) => p.close);
}

export const dataLastUpdated = raw.lastUpdated;
