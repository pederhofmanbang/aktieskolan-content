import Link from "next/link";
import { allLessons, type Lesson } from "contentlayer/generated";

export const metadata = {
  title: "Lektioner – Aktieskolan",
  description: "10 lektioner från grunderna till din egen investeringsplan.",
};

export default function LektionerPage() {
  const lessons = [...allLessons].sort((a, b) => a.nummer - b.nummer);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <header className="mb-10 sm:mb-12">
        <Link
          href="/"
          className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
        >
          ← Tillbaka
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Lektioner
        </h1>
        <p className="mt-3 text-base text-neutral-600 sm:text-lg">
          10 lektioner som tar dig från noll till en egen investeringsplan.
          Vardera 5–10 minuter.
        </p>
      </header>
      <ol className="space-y-4">
        {lessons.map((lesson) => (
          <li key={lesson.slug}>
            <LessonCard lesson={lesson} unlocked />
          </li>
        ))}
      </ol>
    </main>
  );
}

function LessonCard({
  lesson,
  unlocked,
}: {
  lesson: Lesson;
  unlocked: boolean;
}) {
  const card = (
    <div className="flex items-start gap-4 sm:gap-6">
      <div className="select-none text-3xl font-bold tabular-nums text-neutral-300 sm:text-4xl">
        {String(lesson.nummer).padStart(2, "0")}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span className="inline-flex rounded-full bg-primary-light px-2.5 py-0.5 font-medium text-primary-dark">
            {lesson.metafor}
          </span>
          <span className="text-neutral-500">
            {lesson.beraknad_tid_minuter} min
          </span>
          <span className="text-neutral-400">
            · {unlocked ? "Upplåst" : "Låst"}
          </span>
        </div>
        <h2 className="mt-2 text-lg font-semibold text-neutral-900 sm:text-xl">
          {lesson.titel}
        </h2>
        <p className="mt-1 text-sm text-neutral-600 sm:text-base">
          {lesson.underrubrik}
        </p>
      </div>
    </div>
  );

  if (!unlocked) {
    return (
      <div
        aria-disabled
        className="block cursor-not-allowed rounded-2xl border border-neutral-200 bg-neutral-50 p-5 opacity-60 sm:p-6"
      >
        {card}
      </div>
    );
  }

  return (
    <Link
      href={lesson.url}
      className="group block rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md sm:p-6"
    >
      {card}
    </Link>
  );
}
