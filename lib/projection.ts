import type { MonthlyPurchase, Portfolio } from "@/lib/portfolio";
import type { Instrument } from "@/lib/prices";

export type ProjectionPoint = {
  year: number;
  totalValue: number;
  marketValue: number;
  cash: number;
  growth: number;
  invested: number;
};

export type ProjectionParams = {
  years: number;
  annualReturn: number;
};

/**
 * Deterministisk projektion av portföljen N år framåt.
 *
 * Antaganden (medvetna förenklingar för pedagogiken):
 * - Alla aktier och fonder växer med samma `annualReturn` per år.
 * - Fondavgifter dras inte separat (de är inbakade i annualReturn).
 * - Månadssparande utförs den 1:a varje månad och flyttar pengar från kassa
 *   till marknadsvärde. När kassan tar slut pausas inflödet automatiskt.
 * - Limit-ordrar simuleras inte i denna projektion (de behandlas som passiva
 *   i tidsmaskinen).
 *
 * Returnerar en datapunkt per år, inklusive år 0 (nuläget).
 */
export function projectForward(
  p: Portfolio,
  instruments: Instrument[],
  { years, annualReturn }: ProjectionParams,
): ProjectionPoint[] {
  const priceByTicker = new Map(
    instruments.map((i) => [i.ticker, i.currentPrice]),
  );

  const startingMarketValue = p.positions.reduce((sum, pos) => {
    const price = priceByTicker.get(pos.ticker) ?? 0;
    return sum + price * pos.shares;
  }, 0);
  const startingTotal = startingMarketValue + p.cash;
  const startingInvested = p.positions.reduce((s, pos) => s + pos.totalCost, 0);

  const monthlyInflow = p.monthlyPurchases
    .filter((m) => m.active)
    .reduce((s, m) => s + m.amount, 0);

  const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1;

  let marketValue = startingMarketValue;
  let cash = p.cash;
  let invested = startingInvested;

  const points: ProjectionPoint[] = [
    {
      year: 0,
      totalValue: startingTotal,
      marketValue,
      cash,
      growth: 0,
      invested,
    },
  ];

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      marketValue = marketValue * (1 + monthlyReturn);
      if (monthlyInflow > 0) {
        if (cash >= monthlyInflow) {
          cash -= monthlyInflow;
          marketValue += monthlyInflow;
          invested += monthlyInflow;
        } else if (cash > 0) {
          marketValue += cash;
          invested += cash;
          cash = 0;
        }
      }
    }
    const totalValue = marketValue + cash;
    points.push({
      year: y,
      totalValue,
      marketValue,
      cash,
      growth: totalValue - startingTotal,
      invested,
    });
  }

  return points;
}

/**
 * Summera aktiva månadssparanden till ett totalt månadsbelopp.
 */
export function totalMonthlyInflow(monthlies: MonthlyPurchase[]): number {
  return monthlies.filter((m) => m.active).reduce((s, m) => s + m.amount, 0);
}
