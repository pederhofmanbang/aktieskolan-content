"use client";

import Link from "next/link";

import { MyPlanSection } from "@/components/simulator/MyPlanSection";
import type { MyPlan, Portfolio } from "@/lib/portfolio";

export function PlanTab({
  portfolio,
  onSave,
  lesson10Read = false,
}: {
  portfolio: Portfolio;
  onSave: (plan: MyPlan) => void;
  lesson10Read?: boolean;
}) {
  return (
    <div className="py-2">
      {!lesson10Read && !portfolio.myPlan?.signedAt && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Tips:</strong> Den här fliken är till för att skriva din
          investeringspolicy efter att du läst <em>lektion 10 — Din egen plan</em>.
          Den ger sammanhanget för alla val i formuläret. Du kan såklart fylla i
          formuläret ändå.{" "}
          <Link
            href="/lektioner/10-din-egen-plan"
            className="font-semibold underline hover:no-underline"
          >
            Gå till lektion 10
          </Link>
          .
        </div>
      )}
      <MyPlanSection portfolio={portfolio} onSave={onSave} />
    </div>
  );
}
