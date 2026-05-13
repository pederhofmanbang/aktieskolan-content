"use client";

import { useState } from "react";

import { LessonNote } from "../shared/LessonNote";
import { Verdict } from "../shared/Verdict";

export type Apartment = {
  id: string;
  name: string;
  subtitle: string;
  emoji: string;
  blurb: string;
};

export type Bag = {
  id: string;
  label: string;
  correct: string;
  explanation: string;
};

export type LagenheterData = { apartments: Apartment[]; bags: Bag[] };

export function LagenheterModule({ data }: { data: LagenheterData }) {
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);

  const allPicked = data.bags.every((b) => picks[b.id]);
  const correctCount = data.bags.filter((b) => picks[b.id] === b.correct).length;

  function set(bagId: string, aptId: string) {
    if (revealed) return;
    setPicks((p) => ({ ...p, [bagId]: aptId }));
  }

  function restart() {
    setPicks({});
    setRevealed(false);
  }

  if (revealed) {
    const won = correctCount >= 6;
    return (
      <Verdict
        won={won}
        title={`Du fick ${correctCount} av ${data.bags.length} rätt.`}
        summary={
          won
            ? "Du fattar principen: ISK för långsiktigt, KF för utländska utdelningar och förmånstagare, AF för onoterat och kortsiktigt."
            : "Inte illa — men flera placeringar kostar onödig skatt. Kolla genomgången."
        }
        onRestart={restart}
      >
        <div className="space-y-3">
          {data.bags.map((b) => {
            const pick = picks[b.id];
            const right = pick === b.correct;
            const correctApt = data.apartments.find((a) => a.id === b.correct);
            const pickedApt = data.apartments.find((a) => a.id === pick);
            return (
              <div key={b.id} className="spel-card p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="font-medium text-[var(--spel-ink)]">{b.label}</div>
                  <div className="text-xs font-bold uppercase tracking-wider">
                    {right ? (
                      <span style={{ color: "var(--spel-mint-dark)" }}>
                        ✓ rätt: {correctApt?.name}
                      </span>
                    ) : (
                      <span style={{ color: "var(--spel-red)" }}>
                        ✗ du valde {pickedApt?.name}, rätt: {correctApt?.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-1 text-sm text-[var(--spel-ink-muted)]">
                  {b.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </Verdict>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {data.apartments.map((a) => (
          <div key={a.id} className="spel-card p-5">
            <div className="text-3xl" aria-hidden>
              {a.emoji}
            </div>
            <div className="mt-2 text-lg font-bold text-[var(--spel-ink)]">
              {a.name}
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
              {a.subtitle}
            </div>
            <p className="mt-2 text-xs text-[var(--spel-ink-muted)]">{a.blurb}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
          Påsar att sortera ({data.bags.length})
        </div>
        {data.bags.map((b) => (
          <div key={b.id} className="spel-card p-4">
            <div className="font-medium text-[var(--spel-ink)]">{b.label}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.apartments.map((a) => {
                const active = picks[b.id] === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => set(b.id, a.id)}
                    className={`rounded-full border px-3 py-1 text-sm transition-all ${
                      active
                        ? "border-[var(--spel-red)] bg-[#ffeaea] text-[var(--spel-red)]"
                        : "border-[#eadcc1] bg-white text-[var(--spel-ink-muted)] hover:border-[var(--spel-red)]"
                    }`}
                  >
                    {a.emoji} {a.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="spel-btn-primary"
          disabled={!allPicked}
          onClick={() => setRevealed(true)}
        >
          Stäng året och facit →
        </button>
      </div>
    </div>
  );
}
