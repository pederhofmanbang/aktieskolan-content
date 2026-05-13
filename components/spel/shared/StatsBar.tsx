"use client";

import type { PizzaState } from "@/lib/spel/types";

function fmtKr(value: number) {
  return value.toLocaleString("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  });
}

export function StatsBar({ state }: { state: PizzaState }) {
  const monthlyNet = state.monthlyRevenue - state.monthlyCost;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      <Stat label="Kassa" value={fmtKr(state.capital)} tone={state.capital < 0 ? "danger" : "default"} />
      <Stat label="Skuld" value={fmtKr(state.debt)} tone={state.debt > 0 ? "warn" : "default"} />
      <Stat
        label="Vinst / mån"
        value={fmtKr(monthlyNet)}
        tone={monthlyNet < 0 ? "danger" : monthlyNet > 0 ? "good" : "default"}
      />
      <Stat
        label="Ägande"
        value={`${state.ownership.toFixed(0)} %`}
        tone={state.ownership < 51 ? "warn" : "good"}
      />
      <Stat
        label="Röststyrka"
        value={`${state.voteShare.toFixed(0)} %`}
        tone={state.voteShare < 51 ? "warn" : "good"}
      />
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "good" | "warn" | "danger";
}) {
  const color =
    tone === "good"
      ? "var(--spel-mint-dark)"
      : tone === "warn"
        ? "var(--spel-gold-dark)"
        : tone === "danger"
          ? "var(--spel-red)"
          : "var(--spel-ink)";
  return (
    <div className="spel-card px-3 py-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
        {label}
      </div>
      <div
        className="mt-0.5 text-base font-bold tabular-nums sm:text-lg"
        style={{ color }}
      >
        {value}
      </div>
    </div>
  );
}
