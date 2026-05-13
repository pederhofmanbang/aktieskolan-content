"use client";

import { useState } from "react";

import { LessonNote } from "../shared/LessonNote";
import { Verdict } from "../shared/Verdict";

type Tone = "good" | "warn" | "danger";

type Metric = { value: string | number; tone: Tone; note: string };

export type Company = {
  id: string;
  name: string;
  sector: string;
  blurb: string;
  metrics: Record<string, Metric>;
  twoYearOutcome: number;
  risk: "low" | "medium" | "high";
};

export type BilbesiktningData = {
  capital: number;
  pickCount: number;
  companies: Company[];
  metricLabels: Record<string, string>;
};

function fmt(n: number) {
  return n.toLocaleString("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  });
}

export function BilbesiktningModule({ data }: { data: BilbesiktningData }) {
  const [picks, setPicks] = useState<string[]>([]);
  const [inspected, setInspected] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function togglePick(id: string) {
    if (done) return;
    setPicks((p) => {
      if (p.includes(id)) return p.filter((x) => x !== id);
      if (p.length >= data.pickCount) return p;
      return [...p, id];
    });
  }

  function restart() {
    setPicks([]);
    setInspected(null);
    setDone(false);
  }

  const perBolag = data.capital / data.pickCount;
  const pickedCompanies = picks
    .map((id) => data.companies.find((c) => c.id === id))
    .filter((c): c is Company => !!c);

  if (done) {
    const endValues = pickedCompanies.map((c) => perBolag * c.twoYearOutcome);
    const totalEnd = endValues.reduce((a, b) => a + b, 0);
    const change = totalEnd - data.capital;
    const anyMajorLoss = pickedCompanies.some((c) => c.twoYearOutcome < 0.7);
    const won = !anyMajorLoss && totalEnd > data.capital;
    return (
      <Verdict
        won={won}
        title={
          won
            ? `Din portfölj steg till ${fmt(totalEnd)} efter 2 år.`
            : anyMajorLoss
              ? "Minst ett bolag tappade över 30 %."
              : "Portföljen står still eller backar."
        }
        summary={
          <>
            Du investerade {fmt(data.capital)}, slutar med <strong>{fmt(totalEnd)}</strong>{" "}
            (
            <span style={{ color: change >= 0 ? "var(--spel-mint-dark)" : "var(--spel-red)" }}>
              {change >= 0 ? "+" : ""}
              {fmt(change)}
            </span>
            ).
          </>
        }
        onRestart={restart}
      >
        <div className="space-y-3">
          {pickedCompanies.map((c, i) => {
            const end = endValues[i];
            const ret = (c.twoYearOutcome - 1) * 100;
            return (
              <div key={c.id} className="spel-card p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <div className="font-bold text-[var(--spel-ink)]">{c.name}</div>
                    <div className="text-xs text-[var(--spel-ink-muted)]">{c.sector}</div>
                  </div>
                  <div
                    className="text-sm font-bold tabular-nums"
                    style={{
                      color:
                        ret >= 0 ? "var(--spel-mint-dark)" : "var(--spel-red)",
                    }}
                  >
                    {ret >= 0 ? "+" : ""}
                    {ret.toFixed(0)} % · {fmt(end)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <LessonNote
          title="Nyckeltal är ledtrådar, inte facit"
          lessonSlug="08-nyckeltal"
          lessonLabel="Tillbaka till lektion 8"
        >
          En extremt hög direktavkastning + låg soliditet + krympande omsättning
          är en klassisk värdefälla (Bruksbolaget). En P/E på 120 + förlust + 0
          % utdelning är spekulation, oavsett hur kul tillväxten ser ut (DrömTech).
          Bolag som Verkstad och GlobalHem är tråkiga — och oftast vinnare.
        </LessonNote>
      </Verdict>
    );
  }

  const company = inspected
    ? data.companies.find((c) => c.id === inspected)
    : null;
  const enoughPicked = picks.length === data.pickCount;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Kapital" value={fmt(data.capital)} />
        <Stat label="Bolag att välja" value={`${data.pickCount}`} />
        <Stat label="Per bolag" value={fmt(perBolag)} />
        <Stat label="Valda" value={`${picks.length} / ${data.pickCount}`} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {data.companies.map((c) => {
          const isPicked = picks.includes(c.id);
          return (
            <div
              key={c.id}
              className={`spel-card cursor-pointer p-4 transition-all hover:-translate-y-0.5 ${
                isPicked ? "ring-2 ring-[var(--spel-red)]" : ""
              }`}
              onClick={() => setInspected(c.id)}
            >
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <div className="font-bold text-[var(--spel-ink)]">{c.name}</div>
                  <div className="text-xs text-[var(--spel-ink-muted)]">
                    {c.sector}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePick(c.id);
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all ${
                    isPicked
                      ? "bg-[var(--spel-red)] text-white"
                      : "border border-[#eadcc1] bg-white text-[var(--spel-ink-muted)] hover:border-[var(--spel-red)]"
                  }`}
                >
                  {isPicked ? "Vald ✓" : "Välj"}
                </button>
              </div>
              <p className="mt-2 text-sm text-[var(--spel-ink-muted)]">{c.blurb}</p>
              <button
                type="button"
                className="mt-2 text-xs font-semibold"
                style={{ color: "var(--spel-red)" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setInspected(c.id);
                }}
              >
                🔦 Inspektera nyckeltal →
              </button>
            </div>
          );
        })}
      </div>

      {company && (
        <div className="spel-card spel-rise p-5">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
                Nyckeltal
              </div>
              <div className="text-lg font-bold text-[var(--spel-ink)]">
                {company.name}
              </div>
            </div>
            <button
              type="button"
              className="spel-btn-ghost"
              onClick={() => setInspected(null)}
            >
              Stäng ✕
            </button>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {Object.entries(company.metrics).map(([key, m]) => (
              <div
                key={key}
                className="rounded-xl border p-3"
                style={{
                  borderColor:
                    m.tone === "good"
                      ? "#bfe1cd"
                      : m.tone === "warn"
                        ? "#eadcc1"
                        : "#f1b4b4",
                  background:
                    m.tone === "good"
                      ? "#eaf6f0"
                      : m.tone === "warn"
                        ? "#fffaf0"
                        : "#ffeaea",
                }}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
                    {data.metricLabels[key]}
                  </div>
                  <div
                    className="text-base font-bold tabular-nums"
                    style={{
                      color:
                        m.tone === "good"
                          ? "var(--spel-mint-dark)"
                          : m.tone === "warn"
                            ? "var(--spel-gold-dark)"
                            : "var(--spel-red)",
                    }}
                  >
                    {m.value}
                  </div>
                </div>
                <div className="mt-1 text-xs text-[var(--spel-ink-muted)]">
                  {m.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          className="spel-btn-primary"
          disabled={!enoughPicked}
          onClick={() => setDone(true)}
        >
          Köp och simulera 2 år →
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="spel-card px-3 py-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
        {label}
      </div>
      <div className="mt-0.5 text-base font-bold tabular-nums text-[var(--spel-ink)]">
        {value}
      </div>
    </div>
  );
}
