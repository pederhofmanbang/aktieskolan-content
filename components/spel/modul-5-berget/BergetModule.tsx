"use client";

import { useState } from "react";

import { LessonNote } from "../shared/LessonNote";
import { Verdict } from "../shared/Verdict";

export type BergetChoice = {
  id: string;
  label: string;
  altitudeDelta: number;
  isOptimal?: boolean;
  note?: string;
};

export type BergetEvent = {
  id: string;
  situation: string;
  choices: BergetChoice[];
};

export type BergetPath = {
  id: string;
  name: string;
  subtitle: string;
  maxAltitude: number;
  emoji: string;
  description: string;
  events: BergetEvent[];
};

export type BergetData = { paths: BergetPath[] };

export function BergetModule({ data }: { data: BergetData }) {
  const [pathId, setPathId] = useState<string | null>(null);
  const [altitude, setAltitude] = useState(0);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<BergetChoice | null>(null);
  const [done, setDone] = useState(false);

  const path = data.paths.find((p) => p.id === pathId) ?? null;

  function startPath(p: BergetPath) {
    setPathId(p.id);
    setAltitude(0);
    setStep(0);
    setPicked(null);
    setDone(false);
  }

  function pick(c: BergetChoice) {
    if (picked) return;
    setPicked(c);
  }

  function nextStep() {
    if (!path || !picked) return;
    setAltitude((a) => Math.max(0, a + picked.altitudeDelta));
    if (step + 1 >= path.events.length) {
      setDone(true);
    } else {
      setStep(step + 1);
      setPicked(null);
    }
  }

  function restart() {
    setPathId(null);
    setAltitude(0);
    setStep(0);
    setPicked(null);
    setDone(false);
  }

  if (!path) {
    return (
      <div className="space-y-6">
        <div className="text-sm text-[var(--spel-ink-muted)]">
          Välj din led. Varje led ger olika höjd vid toppen. Risken växer med höjden — men det gör belöningen också.
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {data.paths.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => startPath(p)}
              className="spel-card group p-5 text-left transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-2 text-3xl">
                <span aria-hidden>{p.emoji}</span>
              </div>
              <div className="mt-3 text-base font-bold text-[var(--spel-ink)]">
                {p.name}
              </div>
              <div
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--spel-red)" }}
              >
                {p.subtitle}
              </div>
              <div className="mt-2 text-sm text-[var(--spel-ink-muted)]">
                {p.description}
              </div>
              <div className="mt-3 text-xs text-[var(--spel-ink-muted)]">
                Max höjd: <strong>{p.maxAltitude} m</strong>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const event = path.events[step];
  const reachedTop = altitude >= path.maxAltitude * 0.7;

  if (done) {
    const finalPct = Math.round((altitude / path.maxAltitude) * 100);
    const won = altitude >= path.maxAltitude * 0.7;
    return (
      <Verdict
        won={won}
        title={
          won
            ? `Du nådde ${altitude} m på ${path.name.toLowerCase()}.`
            : `Du nådde bara ${altitude} m. Toppen var ${path.maxAltitude} m.`
        }
        summary={
          <>
            Du klarade <strong>{finalPct}%</strong> av toppens höjd.{" "}
            {won
              ? "Du hade tålamodet att stå emot stormarna och fortsätta."
              : "Att vända i kris kostar höjd — på berget och på börsen."}
          </>
        }
        onRestart={restart}
      >
        <LessonNote
          title="Risk = volatilitet, inte fiende"
          lessonSlug="05-risk"
          lessonLabel="Tillbaka till lektion 5"
          tone={won ? "good" : "default"}
        >
          Skåne ger låg avkastning men du kommer alltid fram. Kebnekaise är
          obekvämt ibland — men det är där den långsiktiga avkastningen finns.
          Everest är spekulation. Det är inte fel att välja vilken som — men
          välj medvetet.
        </LessonNote>
      </Verdict>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[280px,1fr]">
      <aside className="space-y-4 lg:sticky lg:top-6">
        <div className="spel-card p-5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
            {path.name}
          </div>
          <div className="mt-1 text-4xl" aria-hidden>
            {path.emoji}
          </div>
          <div className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
            Höjd
          </div>
          <div className="text-3xl font-bold tabular-nums text-[var(--spel-ink)]">
            {altitude} m
          </div>
          <div className="text-xs text-[var(--spel-ink-muted)]">
            av {path.maxAltitude} m
          </div>
          <div className="relative mt-3 h-3 overflow-hidden rounded-full bg-[#eadcc1]">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, (altitude / path.maxAltitude) * 100)}%`,
                background: reachedTop ? "var(--spel-mint)" : "var(--spel-gold)",
              }}
            />
          </div>
        </div>
      </aside>

      <div className="space-y-6">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
          Etapp {step + 1} av {path.events.length}
        </div>
        <div className="spel-card p-6 sm:p-8">
          <p className="text-[15px] leading-relaxed text-[var(--spel-ink)]">
            {event.situation}
          </p>
        </div>
        <div className="space-y-2.5">
          {event.choices.map((c) => {
            const isPicked = picked?.id === c.id;
            return (
              <button
                key={c.id}
                type="button"
                disabled={!!picked && !isPicked}
                onClick={() => pick(c)}
                className={`spel-choice ${isPicked ? "spel-choice-picked" : ""}`}
              >
                <span className="font-medium">{c.label}</span>
              </button>
            );
          })}
        </div>
        {picked && (
          <div className="spel-rise space-y-4">
            <LessonNote
              tone={picked.altitudeDelta >= 0 ? "good" : "danger"}
              emoji={picked.altitudeDelta >= 0 ? "⬆️" : "⬇️"}
              title={
                picked.altitudeDelta >= 0
                  ? `+${picked.altitudeDelta} m`
                  : `${picked.altitudeDelta} m`
              }
            >
              {picked.note ??
                (picked.altitudeDelta >= 0
                  ? "Du tog dig vidare."
                  : "Du tappade höjd.")}
            </LessonNote>
            <div className="flex justify-end">
              <button type="button" className="spel-btn-primary" onClick={nextStep}>
                {step + 1 >= path.events.length ? "Avsluta klättringen" : "Fortsätt →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
