"use client";

import Link from "next/link";

import { cn } from "@/lib/cn";
import {
  ALL_LESSON_SLUGS,
  completedCount,
  type LessonProgress,
} from "@/lib/lessonProgress";

export function ProgressIndicator({
  progress,
}: {
  progress: LessonProgress;
}) {
  const done = completedCount(progress);
  const total = ALL_LESSON_SLUGS.length;
  const pct = total > 0 ? (done / total) * 100 : 0;

  return (
    <Link
      href="/lektioner"
      className="group block w-full"
      title={`${done} av ${total} lektioner markerade lästa`}
    >
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <span className="hidden sm:inline">Din väg:</span>
        <span className="font-medium text-neutral-700">
          {done}/{total} lektioner
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
        <div
          className={cn(
            "h-full rounded-full bg-primary transition-all",
            done === total && "bg-primary-dark",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </Link>
  );
}
