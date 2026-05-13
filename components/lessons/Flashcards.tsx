"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import type { Flashcard } from "@/data/lesson-flashcards";

export function Flashcards({ cards }: { cards: Flashcard[] }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const total = cards.length;
  const card = cards[idx];

  const goPrev = () => {
    setIdx((i) => (i - 1 + total) % total);
    setFlipped(false);
  };
  const goNext = () => {
    setIdx((i) => (i + 1) % total);
    setFlipped(false);
  };
  const flip = () => setFlipped((f) => !f);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        flip();
      } else if (e.key === "ArrowLeft") {
        goPrev();
      } else if (e.key === "ArrowRight") {
        goNext();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  if (total === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary-dark">
          Flashcards · {idx + 1} / {total}
        </div>
        <div className="text-xs text-neutral-500">
          Mellanslag vänder · ←/→ navigerar
        </div>
      </div>

      <button
        type="button"
        onClick={flip}
        aria-label={flipped ? "Visa framsida" : "Visa baksida"}
        className={cn(
          "mt-4 flex min-h-[260px] w-full flex-col items-center justify-center rounded-2xl border p-8 text-center transition-colors sm:min-h-[320px]",
          flipped
            ? "border-primary bg-primary-light/60"
            : "border-neutral-200 bg-white hover:border-primary hover:bg-primary-light/30",
        )}
      >
        <div
          className={cn(
            "text-[10px] font-semibold uppercase tracking-wider",
            flipped ? "text-primary-dark" : "text-neutral-500",
          )}
        >
          {flipped ? "Svar" : "Fråga"}
        </div>
        <div className="mt-4 text-lg font-medium text-neutral-900 sm:text-xl">
          {flipped ? card.back : card.front}
        </div>
        <div className="mt-6 text-xs text-neutral-500">
          Klicka för att {flipped ? "se frågan" : "vända kortet"}
        </div>
      </button>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-900"
        >
          ← Föregående
        </button>
        <div className="flex gap-1.5" aria-hidden>
          {cards.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                i === idx ? "bg-primary-dark" : "bg-neutral-300",
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={goNext}
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
        >
          Nästa →
        </button>
      </div>
    </div>
  );
}
