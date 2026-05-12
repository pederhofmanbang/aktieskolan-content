"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { LessonMedia } from "@/data/lesson-media";

type TabId = "las" | "film" | "podcast" | "presentation" | "repetition" | "quiz";

const TABS: { id: TabId; label: string }[] = [
  { id: "las", label: "Läs" },
  { id: "film", label: "Film" },
  { id: "podcast", label: "Podcast" },
  { id: "presentation", label: "Presentation" },
  { id: "repetition", label: "Repetition" },
  { id: "quiz", label: "Quiz" },
];

type Props = {
  media: LessonMedia;
  children: ReactNode;
};

export function LessonTabs({ media, children }: Props) {
  const [active, setActive] = useState<TabId>("las");

  return (
    <div className="mt-12">
      <div
        role="tablist"
        aria-label="Lektionsformat"
        className="flex flex-wrap gap-1 border-b border-neutral-200"
      >
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              type="button"
              onClick={() => setActive(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors -mb-px border-b-2",
                isActive
                  ? "border-primary-dark text-primary-dark"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        <TabPanel id="las" active={active}>
          <article className="prose prose-neutral max-w-none prose-headings:tracking-tight prose-h1:hidden prose-a:text-primary-dark prose-strong:text-neutral-900">
            {children}
          </article>
        </TabPanel>

        <TabPanel id="film" active={active}>
          {media.filmEmbedUrl ? (
            <div className="relative w-full overflow-hidden rounded-2xl bg-neutral-900 aspect-video">
              <iframe
                src={media.filmEmbedUrl}
                title="Lektionsfilm"
                allow="encrypted-media; fullscreen;"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          ) : (
            <ComingSoon label="Filmen för den här lektionen kommer snart." />
          )}
        </TabPanel>

        <TabPanel id="podcast" active={active}>
          <ComingSoon label="Podcasten för den här lektionen kommer snart." />
        </TabPanel>

        <TabPanel id="presentation" active={active}>
          <ComingSoon label="Presentationen för den här lektionen kommer snart." />
        </TabPanel>

        <TabPanel id="repetition" active={active}>
          <ComingSoon label="Repetitionsmaterialet kommer snart." />
        </TabPanel>

        <TabPanel id="quiz" active={active}>
          <ComingSoon label="Quizet för den här lektionen kommer snart." />
        </TabPanel>
      </div>
    </div>
  );
}

function TabPanel({
  id,
  active,
  children,
}: {
  id: TabId;
  active: TabId;
  children: ReactNode;
}) {
  if (active !== id) return null;
  return (
    <div
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
    >
      {children}
    </div>
  );
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-600">
      {label}
    </div>
  );
}
