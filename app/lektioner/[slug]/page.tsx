import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { allLessons } from "contentlayer/generated";

import { LessonTabs } from "@/components/lessons/LessonTabs";
import { lessonMedia } from "@/data/lesson-media";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return allLessons.map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const lesson = allLessons.find((l) => l.slug === params.slug);
  if (!lesson) return {};
  return {
    title: `${lesson.titel} – Aktieskolan`,
    description: lesson.underrubrik,
  };
}

export default function LessonPage({ params }: { params: Params }) {
  const lesson = allLessons.find((l) => l.slug === params.slug);
  if (!lesson) notFound();

  const next = lesson.nasta_lektion
    ? allLessons.find((l) => l.slug === lesson.nasta_lektion)
    : null;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <Link
        href="/lektioner"
        className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        ← Alla lektioner
      </Link>

      <header className="mt-8">
        <div className="text-sm font-medium text-neutral-500">
          Lektion {lesson.nummer} · {lesson.beraknad_tid_minuter} min
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          {lesson.titel}
        </h1>
        <p className="mt-3 text-lg text-neutral-600">{lesson.underrubrik}</p>
        <div className="mt-4 inline-flex rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary-dark">
          Metafor: {lesson.metafor}
        </div>
      </header>

      <aside className="mt-8 rounded-2xl border border-primary/20 bg-primary-light/40 p-5 sm:p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary-dark">
          Lärandemål
        </div>
        <ul className="mt-3 space-y-1.5 text-sm text-neutral-800 sm:text-base">
          {lesson.mal.map((mal, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-primary-dark" aria-hidden>
                ✓
              </span>
              <span>{mal}</span>
            </li>
          ))}
        </ul>
      </aside>

      <LessonTabs media={lessonMedia[lesson.slug] ?? {}} code={lesson.body.code} />

      <nav className="mt-12">
        {next ? (
          <Link
            href={next.url}
            className="group flex items-center justify-between gap-4 rounded-2xl bg-neutral-900 px-6 py-5 text-white transition-colors hover:bg-neutral-800"
          >
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-wider text-neutral-400">
                Nästa lektion
              </div>
              <div className="mt-1 truncate text-lg font-semibold">
                {next.titel}
              </div>
            </div>
            <div className="text-2xl text-primary transition-transform group-hover:translate-x-1">
              →
            </div>
          </Link>
        ) : (
          <div className="rounded-2xl bg-primary-light p-6 text-center sm:p-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary-dark">
              Klart!
            </div>
            <div className="mt-2 text-xl font-semibold text-neutral-900">
              Du har gått igenom alla 10 lektioner
            </div>
            <p className="mt-2 text-sm text-neutral-700">
              Du har låst upp ditt certifikat. Bra jobbat.
            </p>
          </div>
        )}
      </nav>
    </main>
  );
}
