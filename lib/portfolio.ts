export type Position = {
  ticker: string;
  shares: number;
  totalCost: number;
};

export type Transaction = {
  id: string;
  ts: string;
  ticker: string;
  side: "buy" | "sell";
  shares: number;
  price: number;
  total: number;
};

export type Portfolio = {
  cash: number;
  positions: Position[];
  transactions: Transaction[];
  unlocks: string[];
};

const STORAGE_KEY = "aktieskolan_portfolio_v1";
const INITIAL_CASH = 100_000;

export function initialPortfolio(): Portfolio {
  return { cash: INITIAL_CASH, positions: [], transactions: [], unlocks: [] };
}

export function loadPortfolio(): Portfolio {
  if (typeof window === "undefined") return initialPortfolio();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialPortfolio();
    return { ...initialPortfolio(), ...JSON.parse(raw) };
  } catch {
    return initialPortfolio();
  }
}

export function savePortfolio(p: Portfolio): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function resetPortfolio(): Portfolio {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  return initialPortfolio();
}

export function buy(
  p: Portfolio,
  args: { ticker: string; shares: number; price: number },
): Portfolio {
  if (args.shares <= 0) throw new Error("Antal måste vara minst 1");
  const total = args.shares * args.price;
  if (total > p.cash) throw new Error("Inte tillräckligt med kassa");

  const existing = p.positions.find((x) => x.ticker === args.ticker);
  const positions = existing
    ? p.positions.map((x) =>
        x.ticker === args.ticker
          ? {
              ...x,
              shares: x.shares + args.shares,
              totalCost: x.totalCost + total,
            }
          : x,
      )
    : [
        ...p.positions,
        { ticker: args.ticker, shares: args.shares, totalCost: total },
      ];

  const tx: Transaction = {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
    ts: new Date().toISOString(),
    ticker: args.ticker,
    side: "buy",
    shares: args.shares,
    price: args.price,
    total,
  };

  const unlocks = new Set(p.unlocks);
  unlocks.add("simulator.kop_aktie");

  return {
    cash: Math.round((p.cash - total) * 100) / 100,
    positions,
    transactions: [tx, ...p.transactions],
    unlocks: Array.from(unlocks),
  };
}

export function hasUnlock(p: Portfolio, key: string): boolean {
  return p.unlocks.includes(key);
}
