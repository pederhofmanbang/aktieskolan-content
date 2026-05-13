"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import type { Choice, Scenario } from "@/lib/spel/types";

import { Coach } from "./Coach";

export function ScenarioBox({
  scenario,
  step,
  total,
  onChoose,
}: {
  scenario: Scenario;
  step: number;
  total: number;
  onChoose: (choice: Choice) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const pickedChoice = scenario.choices.find((c) => c.id === picked) ?? null;

  function handlePick(choice: Choice) {
    if (picked) return;
    setPicked(choice.id);
  }

  function handleContinue() {
    if (!pickedChoice) return;
    onChoose(pickedChoice);
    setPicked(null);
  }

  return (
    <section className="spel-rise" key={scenario.id}>
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
          Scen {step} av {total}
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
          🍕 Pizzan
        </div>
      </div>

      <div className="spel-card mt-3 p-6 sm:p-8">
        <h2 className="text-xl font-bold tracking-tight text-[var(--spel-ink)] sm:text-2xl">
          {scenario.title}
        </h2>
        {scenario.speaker && (
          <div className="mt-2 flex items-center gap-2 text-sm text-[var(--spel-ink-muted)]">
            <span className="text-base" aria-hidden>
              {scenario.speaker.emoji}
            </span>
            <span>{scenario.speaker.name}</span>
          </div>
        )}
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--spel-ink)] sm:text-base">
          {scenario.situation}
        </p>
      </div>

      <div className="mt-6 space-y-2.5">
        {scenario.choices.map((choice) => {
          const isPicked = picked === choice.id;
          const isDisabled = !!picked && !isPicked;
          return (
            <button
              key={choice.id}
              type="button"
              disabled={!!picked && !isPicked}
              onClick={() => handlePick(choice)}
              className={cn(
                "spel-choice block",
                isPicked && "spel-choice-picked",
                isDisabled && "opacity-50",
              )}
            >
              <span className="font-medium">{choice.label}</span>
            </button>
          );
        })}
      </div>

      {pickedChoice && (
        <div className="spel-rise mt-6">
          <Coach choice={pickedChoice} />
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleContinue}
              className="spel-btn-primary"
            >
              {step === total ? "Avsluta modulen →" : "Fortsätt →"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
