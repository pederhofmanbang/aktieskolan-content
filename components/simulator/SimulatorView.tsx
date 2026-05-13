"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AnalysisTab } from "@/components/simulator/AnalysisTab";
import { OnboardingBanner } from "@/components/simulator/OnboardingBanner";
import { PlanTab } from "@/components/simulator/PlanTab";
import { PortfolioTab } from "@/components/simulator/PortfolioTab";
import { Tabs, type TabDef } from "@/components/simulator/Tabs";
import { TradeTab } from "@/components/simulator/TradeTab";
import { cn } from "@/lib/cn";
import { formatKr, formatPct, formatSignedKr } from "@/lib/format";
import {
  addMonthlyPurchase,
  buy,
  cancelLimitOrder,
  initialPortfolio,
  loadPortfolio,
  placeLimitOrder,
  removeMonthlyPurchase,
  resetPortfolio,
  saveMyPlan,
  savePortfolio,
  sell,
  toggleMonthlyPurchase,
  type MyPlan,
  type Portfolio,
} from "@/lib/portfolio";
import type { Instrument } from "@/lib/prices";

const ISK_FRIBELOPP_2026 = 300_000;
const ONBOARDING_KEY = "aktieskolan_onboarding_dismissed_v1";

type ActionResult = { ok: true } | { ok: false; reason: string };

export function SimulatorView({ instruments }: { instruments: Instrument[] }) {
  const [portfolio, setPortfolio] = useState<Portfolio>(initialPortfolio);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("portfolio");
  const [onboardingDismissed, setOnboardingDismissed] = useState<boolean>(true);

  useEffect(() => {
    setPortfolio(loadPortfolio());
    if (typeof window !== "undefined") {
      setOnboardingDismissed(
        window.localStorage.getItem(ONBOARDING_KEY) === "1",
      );
    }
    setHydrated(true);
  }, []);

  // Auto-unlocka icke-destruktiva pedagogiska vyer.
  useEffect(() => {
    if (!hydrated) return;
    const autoUnlocks = [
      "simulator.tidsmaskin",
      "simulator.riskmatt_kraschlage",
      "simulator.omallokering",
      "simulator.isk_skattevy",
      "simulator.screener",
      "simulator.stresstest",
    ];
    const missing = autoUnlocks.filter((k) => !portfolio.unlocks.includes(k));
    if (missing.length > 0) {
      const updated = {
        ...portfolio,
        unlocks: [...portfolio.unlocks, ...missing],
      };
      setPortfolio(updated);
      savePortfolio(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const instrumentByTicker = useMemo(
    () => Object.fromEntries(instruments.map((i) => [i.ticker, i])),
    [instruments],
  );

  const marketValue = portfolio.positions.reduce((sum, pos) => {
    const inst = instrumentByTicker[pos.ticker];
    return sum + (inst ? inst.currentPrice * pos.shares : 0);
  }, 0);
  const totalValue = portfolio.cash + marketValue;
  const totalCost = portfolio.positions.reduce((s, p) => s + p.totalCost, 0);
  const totalPL = marketValue - totalCost;
  const totalPLPct = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;

  const handleBuy = (ticker: string, sek: number): ActionResult => {
    setError(null);
    const inst = instrumentByTicker[ticker];
    if (!inst) return { ok: false, reason: "Okänt instrument" };
    if (!Number.isFinite(sek) || sek <= 0) {
      return { ok: false, reason: "Ange ett belopp större än 0" };
    }
    if (sek > portfolio.cash + 0.005) {
      return { ok: false, reason: "Inte tillräckligt med kassa" };
    }
    const shares =
      inst.type === "fund"
        ? sek / inst.currentPrice
        : Math.floor(sek / inst.currentPrice);
    if (shares < (inst.type === "fund" ? 1e-6 : 1)) {
      return {
        ok: false,
        reason:
          inst.type === "fund"
            ? "Beloppet är för litet"
            : "För litet belopp för 1 aktie",
      };
    }
    try {
      const updated = buy(portfolio, {
        ticker,
        shares,
        price: inst.currentPrice,
      });
      setPortfolio(updated);
      savePortfolio(updated);
      dismissOnboarding();
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        reason: e instanceof Error ? e.message : "Något gick fel",
      };
    }
  };

  const handlePlaceLimit = (args: {
    ticker: string;
    limitPrice: number;
    amount: number;
  }): ActionResult => {
    setError(null);
    try {
      const updated = placeLimitOrder(portfolio, args);
      setPortfolio(updated);
      savePortfolio(updated);
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        reason: e instanceof Error ? e.message : "Något gick fel",
      };
    }
  };

  const handleCancelOrder = (id: string) => {
    const updated = cancelLimitOrder(portfolio, id);
    setPortfolio(updated);
    savePortfolio(updated);
  };

  const handleAddMonthly = (args: {
    ticker: string;
    amount: number;
    dayOfMonth: number;
  }): ActionResult => {
    try {
      const updated = addMonthlyPurchase(portfolio, args);
      setPortfolio(updated);
      savePortfolio(updated);
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        reason: e instanceof Error ? e.message : "Något gick fel",
      };
    }
  };

  const handleToggleMonthly = (id: string) => {
    const updated = toggleMonthlyPurchase(portfolio, id);
    setPortfolio(updated);
    savePortfolio(updated);
  };

  const handleRemoveMonthly = (id: string) => {
    const updated = removeMonthlyPurchase(portfolio, id);
    setPortfolio(updated);
    savePortfolio(updated);
  };

  const handleSell = (ticker: string, shares: number) => {
    setError(null);
    const inst = instrumentByTicker[ticker];
    if (!inst) {
      setError("Okänt instrument");
      return;
    }
    try {
      const updated = sell(portfolio, {
        ticker,
        shares,
        price: inst.currentPrice,
      });
      setPortfolio(updated);
      savePortfolio(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Något gick fel");
    }
  };

  const handleSaveMyPlan = (plan: MyPlan) => {
    const updated = saveMyPlan(portfolio, plan);
    setPortfolio(updated);
    savePortfolio(updated);
  };

  const handleReset = () => {
    if (!window.confirm("Nollställ portföljen? All historik försvinner.")) return;
    setPortfolio(resetPortfolio());
    setError(null);
  };

  const dismissOnboarding = () => {
    setOnboardingDismissed(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ONBOARDING_KEY, "1");
    }
  };

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="text-neutral-500">Laddar portfölj…</div>
      </main>
    );
  }

  const stocks = instruments.filter((i) => i.type === "stock");
  const funds = instruments.filter((i) => i.type === "fund");

  const showOnboarding =
    !onboardingDismissed && portfolio.positions.length === 0;

  const ordersBadge =
    portfolio.activeOrders.length > 0 ? portfolio.activeOrders.length : undefined;
  const tabs: TabDef[] = [
    {
      id: "portfolio",
      label: "Portfölj",
      icon: "📊",
      badge: ordersBadge,
    },
    { id: "trade", label: "Köp & sälj", icon: "🛒" },
    { id: "analysis", label: "Analys", icon: "🔬" },
    {
      id: "plan",
      label: "Min plan",
      icon: "📜",
      badge: portfolio.myPlan?.signedAt ? "✓" : undefined,
    },
  ];

  return (
    <main className="mx-auto max-w-5xl px-6 py-8 sm:py-10">
      <div className="flex items-center justify-between">
        <Link
          href="/lektioner"
          className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
        >
          ← Tillbaka
        </Link>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-neutral-400 transition-colors hover:text-neutral-700"
        >
          Nollställ portfölj
        </button>
      </div>

      <header className="mt-4">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Simulator
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Simulerat <strong>ISK (Investeringssparkonto)</strong> med 100 000 kr
          i låtsaspengar. Sparas lokalt — påverkar inga riktiga pengar.
        </p>
      </header>

      <div className="sticky top-0 z-10 -mx-6 mt-6 border-b border-neutral-200 bg-white/95 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 sm:items-center">
          <Stat label="Kassa" value={formatKr(portfolio.cash)} />
          <Stat label="Investerat" value={formatKr(marketValue)} />
          <Stat label="Totalt" value={formatKr(totalValue)} emphasis />
          <Stat
            label="Resultat"
            value={
              totalCost > 0
                ? `${formatSignedKr(totalPL)} (${formatPct(totalPLPct, 1)})`
                : "—"
            }
            tone={
              totalCost === 0
                ? "neutral"
                : totalPL >= 0
                  ? "positive"
                  : "negative"
            }
          />
          <ISKPill totalValue={totalValue} fribelopp={ISK_FRIBELOPP_2026} />
        </div>
      </div>

      {showOnboarding && (
        <OnboardingBanner
          onDismiss={dismissOnboarding}
          onJumpToTrade={() => {
            setActiveTab("trade");
            dismissOnboarding();
          }}
        />
      )}

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="mt-6">
        <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      </div>

      <div className="mt-6">
        {activeTab === "portfolio" && (
          <PortfolioTab
            portfolio={portfolio}
            instrumentByTicker={instrumentByTicker}
            onSell={handleSell}
            onCancelOrder={handleCancelOrder}
          />
        )}
        {activeTab === "trade" && (
          <TradeTab
            cash={portfolio.cash}
            stocks={stocks}
            funds={funds}
            monthlies={portfolio.monthlyPurchases}
            onBuy={handleBuy}
            onPlaceLimit={handlePlaceLimit}
            onAddMonthly={handleAddMonthly}
            onToggleMonthly={handleToggleMonthly}
            onRemoveMonthly={handleRemoveMonthly}
            setError={setError}
          />
        )}
        {activeTab === "analysis" && (
          <AnalysisTab
            portfolio={portfolio}
            instruments={instruments}
            stocks={stocks}
          />
        )}
        {activeTab === "plan" && (
          <PlanTab portfolio={portfolio} onSave={handleSaveMyPlan} />
        )}
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  emphasis,
  tone = "neutral",
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  tone?: "neutral" | "positive" | "negative";
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-neutral-500">
        {label}
      </div>
      <div
        className={cn(
          "tabular-nums",
          emphasis ? "text-lg font-bold" : "text-base font-semibold",
          tone === "positive" && "text-primary-dark",
          tone === "negative" && "text-red-600",
          tone === "neutral" && "text-neutral-900",
        )}
      >
        {value}
      </div>
    </div>
  );
}

function ISKPill({
  totalValue,
  fribelopp,
}: {
  totalValue: number;
  fribelopp: number;
}) {
  const under = totalValue < fribelopp;
  const diff = Math.abs(totalValue - fribelopp);
  return (
    <div className="flex flex-col">
      <div className="text-[10px] uppercase tracking-wider text-neutral-500">
        ISK-fribelopp
      </div>
      <div
        className={cn(
          "mt-0.5 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs",
          under
            ? "bg-primary/10 text-primary-dark"
            : "bg-amber-100 text-amber-800",
        )}
        title={
          under
            ? `${formatKr(diff)} kvar under fribeloppet (${formatKr(fribelopp)})`
            : `${formatKr(diff)} över fribeloppet (${formatKr(fribelopp)})`
        }
      >
        {under ? "✓" : "!"} {formatKr(diff)}{" "}
        <span className="text-neutral-500">
          {under ? "kvar" : "över"}
        </span>
      </div>
    </div>
  );
}
