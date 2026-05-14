"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import {
  isComplete,
  loadProgress,
  markComplete,
  markIncomplete,
  type LessonProgress,
} from "@/lib/lessonProgress";
import { LESSON_TO_SIMULATOR } from "@/lib/lessonSimulatorLinks";

export function LessonActions({ slug }: { slug: string }) {
  const [progress, setProgress] = useState<LessonProgress>({ completed: [] });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setHydrated(true);
  }, []);

  const link = LESSON_TO_SIMULATOR[slug];
  const done = hydrated && isComplete(progress, slug);

  const toggleComplete = () => {
    const next = done ? markIncomplete(slug) : markComplete(slug);
    setProgress(next);
  };

  return (
    <div className="mt-10 flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleComplete}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
            done
              ? "border-primary-dark bg-primary-dark text-white hover:bg-primary"
              : "border-neutral-300 bg-white text-neutral-800 hover:border-neutral-500",
          )}
        >
          {done ? "✓ Markerad som läst" : "Markera som läst"}
        </button>
        {hydrated && done && (
          <span className="text-xs text-neutral-500">
            Klicka igen för att ångra
          </span>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          {link.label} →
        </Link>
      )}
    </div>
  );
}
