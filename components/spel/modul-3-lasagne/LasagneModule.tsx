"use client";

import { useMemo, useState } from "react";

import { LessonNote } from "../shared/LessonNote";
import { Verdict } from "../shared/Verdict";

export type Holding = {
  id: string;
  name: string;
  ticker: string;
  sector: string;
  expectedReturn: number;
  techShock: number;
  rateShock: number;
  oilShock: number;
};

export type Crisis = { id: string; label: string; field: keyof Holding };

export type LasagneData = {
  capital: number;
  holdings: Holding[];
  crises: Crisis[];
};

function fmt(n: number) {
  return n.toLocaleString("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  });
}

export function LasagneModule({ data }: { data: LasagneData }) {
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  const sectorCount = useMemo(() => {
    const set = new Set<string>();
    for (const [id, w] of Object.entries(weights)) {
      if (w > 0) {
        const h = data.holdings.find((x) => x.id === id);
        if (h) set.add(h.sector);
      }
    }
    return set.size;
  }, [weights, data.holdings]);

  function changeWeight(id: string, delta: number) {
    if (done) return;
    setWeights((w) => {
      const cur = w[id] ?? 0;
      const next = Math.max(0, Math.min(100, cur + delta));
      const otherTotal = total - cur;
      if (otherTotal + next > 100) return w;
      return { ...w, [id]: next };
    });
  }

  function restart() {
    setWeights({});
    setDone(false);
  }

  const result = useMemo(() => {
    if (!done) return null;
    const years = 5;
    let value = data.capital;
    const yearlyValues: number[] = [value];
    let minDrawdownValue = value;
    let peak = value;
    const crisesHit = data.crises.slice(0, 3);
    for (let y = 0; y < years; y++) {
      let yearMultiplier = 1;
      // base annual return
      let baseReturn = 0;
      for (const h of data.holdings) {
        const w = (weights[h.id] ?? 0) / 100;
        baseReturn += w * (h.expectedReturn / 100);
      }
      yearMultiplier += baseReturn;
      // crisis hits in years 2, 3, 4
      if (y === 1 || y === 2 || y === 3) {
        const crisis = crisesHit[y - 1];
        let crisisMultiplier = 0;
        for (const h of data.holdings) {
          const w = (weights[h.id] ?? 0) / 100;
          const mult = h[crisis.field] as number;
          crisisMultiplier += w * mult;
        }
        // crisis multiplier applied on top of base return
        yearMultiplier = crisisMultiplier;
      }
      value = value * yearMultiplier;
      yearlyValues.push(value);
      peak = Math.max(peak, value);
      minDrawdownValue = Math.min(minDrawdownValue, value);
    }
    const drawdown = (peak - minDrawdownValue) / peak;
    return { yearlyValues, end: value, drawdown };
  }, [done, weights, data]);

  if (done && result) {
    const won = result.end > data.capital && result.drawdown < 0.3;
    return (
      <Verdict
        won={won}
        title={
          won
            ? `Din fond steg till ${fmt(result.end)} efter 5 år.`
            : result.drawdown >= 0.3
              ? `Drawdown över 30 % — för koncentrerad fond.`
              : `Din fond backade.`
        }
        summary={
          <>
            Slut: <strong>{fmt(result.end)}</strong>. Max drawdown:{" "}
            <strong>{(result.drawdown * 100).toFixed(0)} %</strong>. Antal
            sektorer: <strong>{sectorCount}</strong>.
          </>
        }
        onRestart={restart}
      >
        <div className="spel-card p-5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
            Värdets gång (start → år 5)
          </div>
          <div className="mt-3 flex items-end gap-2 sm:gap-4">
            {result.yearlyValues.map((v, i) => {
              const max = Math.max(...result.yearlyValues);
              const h = (v / max) * 100;
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md"
                    style={{
                      height: `${h}px`,
                      minHeight: 12,
                      background:
                        i === 0
                          ? "#c5beb3"
                          : v >= result.yearlyValues[i - 1]
                            ? "var(--spel-mint)"
                            : "var(--spel-red)",
                    }}
                  />
                  <div className="text-[10px] text-[var(--spel-ink-muted)]">
                    {i === 0 ? "Start" : `År ${i}`}
                  </div>
                  <div className="text-[10px] tabular-nums text-[var(--spel-ink)]">
                    {fmt(v)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <LessonNote
          title="Lasagnens poäng"
          lessonSlug="03-fonder-lasagne"
          lessonLabel="Tillbaka till lektion 3"
          tone={won ? "good" : "default"}
        >
          En globalfond är 1 600 bolag i 1 köp. Spelar du allt på 1–2 aktier
          kan en kris i deras sektor radera halva fonden. Spelar du över 5+
          sektorer planar volatiliteten ut.
        </LessonNote>
      </Verdict>
    );
  }

  const sumOk = total === 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Kapital" value={fmt(data.capital)} />
        <Stat
          label="Allokerat"
          value={`${total} %`}
          tone={sumOk ? "good" : total > 100 ? "danger" : "default"}
        />
        <Stat
          label="Sektorer"
          value={`${sectorCount}`}
          tone={sectorCount >= 4 ? "good" : "warn"}
        />
      </div>

      <div className="space-y-2">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
          Bolag och fonder ({data.holdings.length})
        </div>
        {data.holdings.map((h) => {
          const w = weights[h.id] ?? 0;
          return (
            <div key={h.id} className="spel-card flex items-center gap-3 p-3 sm:p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-[var(--spel-ink)]">{h.name}</span>
                  <span className="text-xs text-[var(--spel-ink-muted)]">{h.sector}</span>
                </div>
                <div className="text-xs text-[var(--spel-ink-muted)]">
                  Förväntad avkastning {h.expectedReturn} % / år
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="h-8 w-8 rounded-full border border-[#eadcc1] bg-white text-base font-bold text-[var(--spel-ink)] disabled:opacity-30"
                  disabled={w === 0}
                  onClick={() => changeWeight(h.id, -5)}
                >
                  −
                </button>
                <div className="w-12 text-center text-sm font-bold tabular-nums text-[var(--spel-ink)]">
                  {w}%
                </div>
                <button
                  type="button"
                  className="h-8 w-8 rounded-full border border-[#eadcc1] bg-white text-base font-bold text-[var(--spel-ink)] disabled:opacity-30"
                  disabled={total >= 100}
                  onClick={() => changeWeight(h.id, 5)}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-[var(--spel-ink-muted)]">
          Allokera exakt 100 %. Sprid över minst 4 sektorer för låg drawdown.
        </div>
        <button
          type="button"
          className="spel-btn-primary"
          disabled={!sumOk}
          onClick={() => setDone(true)}
        >
          Stäng fonden, simulera 5 år →
        </button>
      </div>
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
