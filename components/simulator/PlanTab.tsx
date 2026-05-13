"use client";

import { MyPlanSection } from "@/components/simulator/MyPlanSection";
import type { MyPlan, Portfolio } from "@/lib/portfolio";

export function PlanTab({
  portfolio,
  onSave,
}: {
  portfolio: Portfolio;
  onSave: (plan: MyPlan) => void;
}) {
  return (
    <div className="py-2">
      <MyPlanSection portfolio={portfolio} onSave={onSave} />
    </div>
  );
}
