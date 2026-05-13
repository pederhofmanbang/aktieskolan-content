"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  INITIAL_PIZZA,
  INITIAL_PROGRESS,
  type Effect,
  type GameProgress,
  type ModuleId,
  type PizzaState,
} from "./types";

type SpelStore = {
  progress: GameProgress;
  pizza: PizzaState;
  applyEffects: (effects: Effect[]) => void;
  resetPizza: () => void;
  completeModule: (moduleId: ModuleId, victory: boolean) => void;
  unlockLesson: (slug: string) => void;
  resetAll: () => void;
};

function applyEffectsToPizza(state: PizzaState, effects: Effect[]): PizzaState {
  const next = { ...state };
  for (const e of effects) {
    switch (e.field) {
      case "capital":
        next.capital += e.delta;
        break;
      case "debt":
        next.debt += e.delta;
        break;
      case "monthlyCost":
        next.monthlyCost += e.delta;
        break;
      case "monthlyRevenue":
        next.monthlyRevenue += e.delta;
        break;
      case "ownership":
        next.ownership = Math.max(0, Math.min(100, next.ownership + e.delta));
        break;
      case "voteShare":
        next.voteShare = Math.max(0, Math.min(100, next.voteShare + e.delta));
        break;
      case "time":
        next.monthsElapsed += e.delta;
        break;
    }
  }
  return next;
}

export const useSpel = create<SpelStore>()(
  persist(
    (set) => ({
      progress: INITIAL_PROGRESS,
      pizza: INITIAL_PIZZA,
      applyEffects: (effects) =>
        set((s) => ({ pizza: applyEffectsToPizza(s.pizza, effects) })),
      resetPizza: () => set({ pizza: INITIAL_PIZZA }),
      completeModule: (moduleId, victory) =>
        set((s) => ({
          progress: {
            ...s.progress,
            completedModules: s.progress.completedModules.includes(moduleId)
              ? s.progress.completedModules
              : [...s.progress.completedModules, moduleId],
            runs: {
              ...s.progress.runs,
              [moduleId]: {
                moduleId,
                completedAt: new Date().toISOString(),
                history: s.progress.runs[moduleId]?.history ?? [],
                state: s.pizza,
                victory,
              },
            },
          },
        })),
      unlockLesson: (slug) =>
        set((s) => ({
          progress: {
            ...s.progress,
            unlockedLessons: s.progress.unlockedLessons.includes(slug)
              ? s.progress.unlockedLessons
              : [...s.progress.unlockedLessons, slug],
          },
        })),
      resetAll: () =>
        set({ pizza: INITIAL_PIZZA, progress: INITIAL_PROGRESS }),
    }),
    {
      name: "aktieskolan-spel",
      version: 1,
    },
  ),
);
