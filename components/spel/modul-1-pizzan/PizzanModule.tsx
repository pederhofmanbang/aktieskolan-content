"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useSpel } from "@/lib/spel/state";
import type { Choice, Scenario } from "@/lib/spel/types";

import { Coach } from "../shared/Coach";
import { ScenarioBox } from "../shared/ScenarioBox";
import { StatsBar } from "../shared/StatsBar";
import { OwnershipMeter } from "./OwnershipMeter";
import { PizzaCanvas } from "./PizzaCanvas";

export function PizzanModule({ scenarios }: { scenarios: Scenario[] }) {
  const pizza = useSpel((s) => s.pizza);
  const applyEffects = useSpel((s) => s.applyEffects);
  const resetPizza = useSpel((s) => s.resetPizza);
  const completeModule = useSpel((s) => s.completeModule);
  const unlockLesson = useSpel((s) => s.unlockLesson);

  const [step, setStep] = useState(0);
  const [history, setHistory] = useState<{ scenario: Scenario; choice: Choice }[]>([]);
  const [done, setDone] = useState(false);

  // Reset module run when this component mounts fresh (only once on mount).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    resetPizza();
    setStep(0);
    setHistory([]);
    setDone(false);
  }, []);

  const current = scenarios[step];

  function handleChoose(choice: Choice) {
    if (!current) return;
    applyEffects(choice.effects);
    setHistory((h) => [...h, { scenario: current, choice }]);
    if (step + 1 >= scenarios.length) {
      const victory = pizza.ownership >= 51 || true; // generous for MVP
      completeModule("pizzan", victory);
      unlockLesson("02-borsen-och-mr-market");
      setDone(true);
    } else {
      setStep(step + 1);
    }
  }

  function restart() {
    resetPizza();
    setStep(0);
    setHistory([]);
    setDone(false);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[300px,1fr] lg:items-start">
      <aside className="space-y-5 lg:sticky lg:top-6">
        <div className="flex justify-center">
          <PizzaCanvas ownership={pizza.ownership} />
        </div>
        <div className="spel-card p-5">
          <OwnershipMeter
            ownership={pizza.ownership}
            voteShare={pizza.voteShare}
          />
        </div>
      </aside>

      <div className="min-w-0 space-y-6">
        <StatsBar state={pizza} />

        {!done && current && (
          <ScenarioBox
            scenario={current}
            step={step + 1}
            total={scenarios.length}
            onChoose={handleChoose}
          />
        )}

        {done && (
          <Recap
            history={history}
            ownershipEnd={pizza.ownership}
            capitalEnd={pizza.capital}
            onRestart={restart}
          />
        )}
      </div>
    </div>
  );
}

function Recap({
  history,
  ownershipEnd,
  capitalEnd,
  onRestart,
}: {
  history: { scenario: Scenario; choice: Choice }[];
  ownershipEnd: number;
  capitalEnd: number;
  onRestart: () => void;
}) {
  const optimalCount = history.filter((h) => h.choice.isOptimal).length;
  const wonControl = ownershipEnd >= 51;

  return (
    <div className="spel-rise space-y-6">
      <div className="spel-card p-6 sm:p-8">
        <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--spel-red)" }}>
          Akt 1 · Pizzan klar
        </div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--spel-ink)] sm:text-3xl">
          {wonControl ? "Du är kvar som majoritetsägare." : "Du tappade kontrollen."}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--spel-ink-muted)]">
          Du började med 50 000 kr och 100 % ägande. Du slutar med{" "}
          <strong className="text-[var(--spel-ink)]">
            {capitalEnd.toLocaleString("sv-SE")} kr i kassan
          </strong>{" "}
          och{" "}
          <strong className="text-[var(--spel-ink)]">
            {ownershipEnd.toFixed(0)} % ägande
          </strong>
          . {optimalCount > 0 && (
            <>
              <strong className="text-[var(--spel-ink)]">{optimalCount}</strong> av dina val var lektion-optimala.
            </>
          )}
        </p>
      </div>

      <div className="space-y-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
          Dina val
        </div>
        {history.map(({ scenario, choice }) => (
          <div key={scenario.id} className="spel-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
              {scenario.title}
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm">
              <span className="font-medium text-[var(--spel-ink)]">
                {choice.label}
              </span>
              {choice.isOptimal && (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{ background: "var(--spel-mint)", color: "white" }}
                >
                  Optimalt
                </span>
              )}
            </div>
            {choice.outcome && (
              <div className="mt-1 text-xs text-[var(--spel-ink-muted)]">
                {choice.outcome}
              </div>
            )}
          </div>
        ))}
      </div>

      <Coach
        choice={{
          id: "next",
          label: "",
          effects: [],
          outcome:
            "Akt 2 (Kedjan) låses upp när du läst lektion 3 — fonder och diversifiering.",
          pedagogicalNote:
            "Du fattar nu skillnaden mellan lån och eget kapital, vad A-/B-aktier är, och varför värderingen vid emission spelar roll. Det är fundamentet för resten av kursen.",
        }}
      />

      <div className="flex flex-wrap items-center justify-end gap-3">
        <button type="button" onClick={onRestart} className="spel-btn-ghost">
          ↺ Spela om
        </button>
        <Link href="/spel" className="spel-btn-primary inline-block">
          Tillbaka till spelöversikten →
        </Link>
      </div>
    </div>
  );
}
