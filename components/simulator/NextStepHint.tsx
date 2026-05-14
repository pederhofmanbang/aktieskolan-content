"use client";

import type { Portfolio } from "@/lib/portfolio";

type Hint = {
  title: string;
  text: string;
  actionLabel: string;
  targetTab: "portfolio" | "trade" | "analysis" | "plan";
};

function computeHint(p: Portfolio): Hint | null {
  // 0: ingen handling — onboarding-banner tar hand om det
  if (p.positions.length === 0) return null;

  const activeMonthlies = p.monthlyPurchases.filter((m) => m.active).length;

  // 1: gjort köp men inget månadssparande
  if (activeMonthlies === 0) {
    return {
      title: "Bra — första köpet är gjort.",
      text: "Nästa steg är ofta det viktigaste: sätt upp ett månadssparande till en bred globalfond (lektion 3). Det är knappen som ger dig ränta-på-ränta automatiskt.",
      actionLabel: "Lägg upp månadssparande",
      targetTab: "trade",
    };
  }

  // 2: har månadssparande men har inte signerat sin IPS
  if (activeMonthlies > 0 && !p.myPlan?.signedAt) {
    return {
      title: "Du har ett månadssparande — fint jobb.",
      text: "Skriv klart din investeringspolicy i 'Min sparplan' (lektion 10). Den är skydd mot panik-säljningar i framtiden.",
      actionLabel: "Skriv min plan",
      targetTab: "plan",
    };
  }

  return null;
}

export function NextStepHint({
  portfolio,
  onAction,
}: {
  portfolio: Portfolio;
  onAction: (tab: string) => void;
}) {
  const hint = computeHint(portfolio);
  if (!hint) return null;

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-blue-800">
          Nästa steg
        </div>
        <div className="mt-1 text-sm font-medium text-neutral-900">
          {hint.title}
        </div>
        <p className="mt-1 text-sm text-neutral-700">{hint.text}</p>
      </div>
      <button
        type="button"
        onClick={() => onAction(hint.targetTab)}
        className="self-start rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:self-auto"
      >
        {hint.actionLabel} →
      </button>
    </div>
  );
}
