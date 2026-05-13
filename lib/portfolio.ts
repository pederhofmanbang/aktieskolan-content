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

export type ActiveOrder = {
  id: string;
  ts: string;
  ticker: string;
  side: "buy";
  limitPrice: number;
  amount: number;
};

export type MonthlyPurchase = {
  id: string;
  ts: string;
  ticker: string;
  amount: number;
  dayOfMonth: number;
  active: boolean;
};

export type Portfolio = {
  cash: number;
  positions: Position[];
  transactions: Transaction[];
  unlocks: string[];
  activeOrders: ActiveOrder[];
  monthlyPurchases: MonthlyPurchase[];
};

const STORAGE_KEY = "aktieskolan_portfolio_v1";
const INITIAL_CASH = 100_000;

export function initialPortfolio(): Portfolio {
  return {
    cash: INITIAL_CASH,
    positions: [],
    transactions: [],
    unlocks: [],
    activeOrders: [],
    monthlyPurchases: [],
  };
}

export function loadPortfolio(): Portfolio {
  if (typeof window === "undefined") return initialPortfolio();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialPortfolio();
    const parsed = JSON.parse(raw);
    return {
      ...initialPortfolio(),
      ...parsed,
      activeOrders: parsed.activeOrders ?? [],
      monthlyPurchases: parsed.monthlyPurchases ?? [],
    };
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

function roundOre(n: number): number {
  return Math.round(n * 100) / 100;
}

function newId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
}

function newTransaction(args: {
  ticker: string;
  side: "buy" | "sell";
  shares: number;
  price: number;
  total: number;
}): Transaction {
  return { id: newId(), ts: new Date().toISOString(), ...args };
}

export function buy(
  p: Portfolio,
  args: { ticker: string; shares: number; price: number },
): Portfolio {
  if (args.shares <= 0) throw new Error("Antal måste vara större än 0");
  const total = roundOre(args.shares * args.price);
  if (total > p.cash) throw new Error("Inte tillräckligt med kassa");

  const existing = p.positions.find((x) => x.ticker === args.ticker);
  const positions = existing
    ? p.positions.map((x) =>
        x.ticker === args.ticker
          ? {
              ...x,
              shares: x.shares + args.shares,
              totalCost: roundOre(x.totalCost + total),
            }
          : x,
      )
    : [
        ...p.positions,
        { ticker: args.ticker, shares: args.shares, totalCost: total },
      ];

  const tx = newTransaction({
    ticker: args.ticker,
    side: "buy",
    shares: args.shares,
    price: args.price,
    total,
  });

  const unlocks = new Set(p.unlocks);
  unlocks.add("simulator.kop_aktie");

  return {
    ...p,
    cash: roundOre(p.cash - total),
    positions,
    transactions: [tx, ...p.transactions],
    unlocks: Array.from(unlocks),
  };
}

export function sell(
  p: Portfolio,
  args: { ticker: string; shares: number; price: number },
): Portfolio {
  if (args.shares <= 0) throw new Error("Antal måste vara större än 0");
  const existing = p.positions.find((x) => x.ticker === args.ticker);
  if (!existing) throw new Error("Du äger inte detta innehav");
  if (args.shares > existing.shares + 1e-6) {
    throw new Error("Du äger inte så många andelar");
  }

  const total = roundOre(args.shares * args.price);
  const remainingShares = existing.shares - args.shares;
  const gavPerShare = existing.totalCost / existing.shares;
  const costReduction = roundOre(gavPerShare * args.shares);

  const positions =
    remainingShares < 1e-6
      ? p.positions.filter((x) => x.ticker !== args.ticker)
      : p.positions.map((x) =>
          x.ticker === args.ticker
            ? {
                ...x,
                shares: remainingShares,
                totalCost: roundOre(existing.totalCost - costReduction),
              }
            : x,
        );

  const tx = newTransaction({
    ticker: args.ticker,
    side: "sell",
    shares: args.shares,
    price: args.price,
    total,
  });

  return {
    ...p,
    cash: roundOre(p.cash + total),
    positions,
    transactions: [tx, ...p.transactions],
  };
}

export function placeLimitOrder(
  p: Portfolio,
  args: { ticker: string; limitPrice: number; amount: number },
): Portfolio {
  if (args.limitPrice <= 0) throw new Error("Limit-pris måste vara större än 0");
  if (args.amount <= 0) throw new Error("Belopp måste vara större än 0");
  if (args.amount > p.cash) {
    throw new Error("Inte tillräckligt med kassa för att täcka ordern");
  }

  const order: ActiveOrder = {
    id: newId(),
    ts: new Date().toISOString(),
    ticker: args.ticker,
    side: "buy",
    limitPrice: args.limitPrice,
    amount: args.amount,
  };

  const unlocks = new Set(p.unlocks);
  unlocks.add("simulator.limitorder");

  return {
    ...p,
    activeOrders: [...p.activeOrders, order],
    unlocks: Array.from(unlocks),
  };
}

export function cancelLimitOrder(p: Portfolio, id: string): Portfolio {
  return {
    ...p,
    activeOrders: p.activeOrders.filter((o) => o.id !== id),
  };
}

export function addMonthlyPurchase(
  p: Portfolio,
  args: { ticker: string; amount: number; dayOfMonth: number },
): Portfolio {
  if (args.amount <= 0) throw new Error("Belopp måste vara större än 0");
  if (args.dayOfMonth < 1 || args.dayOfMonth > 28) {
    throw new Error("Dag måste vara mellan 1 och 28");
  }

  const mp: MonthlyPurchase = {
    id: newId(),
    ts: new Date().toISOString(),
    ticker: args.ticker,
    amount: args.amount,
    dayOfMonth: args.dayOfMonth,
    active: true,
  };

  const unlocks = new Set(p.unlocks);
  unlocks.add("simulator.fondkop_manadssparande");

  return {
    ...p,
    monthlyPurchases: [...p.monthlyPurchases, mp],
    unlocks: Array.from(unlocks),
  };
}

export function toggleMonthlyPurchase(p: Portfolio, id: string): Portfolio {
  return {
    ...p,
    monthlyPurchases: p.monthlyPurchases.map((m) =>
      m.id === id ? { ...m, active: !m.active } : m,
    ),
  };
}

export function removeMonthlyPurchase(p: Portfolio, id: string): Portfolio {
  return {
    ...p,
    monthlyPurchases: p.monthlyPurchases.filter((m) => m.id !== id),
  };
}

export function unlockFeature(p: Portfolio, key: string): Portfolio {
  if (p.unlocks.includes(key)) return p;
  return { ...p, unlocks: [...p.unlocks, key] };
}

export function hasUnlock(p: Portfolio, key: string): boolean {
  return p.unlocks.includes(key);
}
