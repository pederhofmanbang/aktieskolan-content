"use client";

const STORAGE_KEY = "aktieskolan_lesson_progress_v1";

export type LessonProgress = {
  completed: string[];
};

export const ALL_LESSON_SLUGS = [
  "01-vad-ar-en-aktie",
  "02-borsen-och-mr-market",
  "03-fonder-lasagne",
  "04-ranta-pa-ranta",
  "05-risk",
  "06-diversifiering",
  "07-isk-vs-af-vs-kf",
  "08-nyckeltal",
  "09-psykologi",
  "10-din-egen-plan",
];

export function loadProgress(): LessonProgress {
  if (typeof window === "undefined") return { completed: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completed: [] };
    const parsed = JSON.parse(raw);
    return { completed: Array.isArray(parsed.completed) ? parsed.completed : [] };
  } catch {
    return { completed: [] };
  }
}

export function saveProgress(p: LessonProgress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function markComplete(slug: string): LessonProgress {
  const p = loadProgress();
  if (!p.completed.includes(slug)) {
    p.completed.push(slug);
    saveProgress(p);
  }
  return p;
}

export function markIncomplete(slug: string): LessonProgress {
  const p = loadProgress();
  p.completed = p.completed.filter((s) => s !== slug);
  saveProgress(p);
  return p;
}

export function isComplete(progress: LessonProgress, slug: string): boolean {
  return progress.completed.includes(slug);
}

export function completedCount(progress: LessonProgress): number {
  return progress.completed.filter((s) => ALL_LESSON_SLUGS.includes(s)).length;
}
