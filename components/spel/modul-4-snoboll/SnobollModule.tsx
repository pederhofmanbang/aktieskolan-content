"use client";

import { useEffect, useRef, useState } from "react";

import { LessonNote } from "../shared/LessonNote";
import { Verdict } from "../shared/Verdict";

const ANNUAL_RETURN = 0.08;
const MAX_YEARS = 30;
const TICK_MS = 1000;
const PUSH_AMOUNT = 12000;
const PUSH_COOLDOWN_MS = 4000;
const TEMPTATION_INTERVAL_MS = 5500;
const TEMPTATION_LIFETIME_MS = 4000;

type Temptation = {
  id: number;
  headline: string;
  goodChoice: string;
  badChoice: string;
  badPenalty: number;
};

const TEMPTATIONS: Omit<Temptation, "id">[] = [
  {
    headline: "Sociala medier: 'Tesla går 3x — sälj allt och köp!'",
    goodChoice: "Avstå · håll planen",
    badChoice: "Sälj och köp Tesla",
    badPenalty: 0.5,
  },
  {
    headline: "Granne påstår att kryptot ska 5x:a på 3 månader.",
    goodChoice: "Tacka nej",
    badChoice: "Investera halva snöbollen",
    badPenalty: 0.4,
  },
  {
    headline: "Expert i tidningen: 'Börsen ska krascha — gå till räntor nu.'",
    goodChoice: "Ignorera",
    badChoice: "Sälj allt och vänta",
    badPenalty: 0.35,
  },
  {
    headline: "Influencer säljer ett 'hemligt' aktietips.",
    goodChoice: "Skippa",
    badChoice: "Köp tipset",
    badPenalty: 0.45,
  },
  {
    headline: "Vänner berättar om en värsta-grej-bolaget-just-stiger-50 %.",
    goodChoice: "Le och nicka",
    badChoice: "Hoppa på tåget",
    badPenalty: 0.45,
  },
  {
    headline: "Marknaden faller 20 % på en vecka. Panik i media.",
    goodChoice: "Sov gott",
    badChoice: "Sälj allt nu!",
    badPenalty: 0.5,
  },
  {
    headline: "En guru lovar 'kursdubbling på 6 månader'.",
    goodChoice: "Skratta åt det",
    badChoice: "Skriv upp dig",
    badPenalty: 0.4,
  },
];

function fmt(n: number) {
  return n.toLocaleString("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  });
}

export function SnobollModule() {
  const [running, setRunning] = useState(false);
  const [year, setYear] = useState(0);
  const [value, setValue] = useState(10000);
  const [peak, setPeak] = useState(10000);
  const [bigDrawdown, setBigDrawdown] = useState(false);
  const [pushCooldown, setPushCooldown] = useState(0);
  const [temptation, setTemptation] = useState<Temptation | null>(null);
  const [score, setScore] = useState({ resisted: 0, fell: 0 });
  const [done, setDone] = useState(false);

  const nextIdRef = useRef(1);
  const lastTemptationRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setYear((y) => {
        const ny = y + 1;
        if (ny >= MAX_YEARS) {
          setRunning(false);
          setDone(true);
        }
        return ny;
      });
      setValue((v) => {
        const nv = v * (1 + ANNUAL_RETURN);
        setPeak((p) => Math.max(p, nv));
        return nv;
      });
      setPushCooldown((c) => Math.max(0, c - TICK_MS));
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      const now = Date.now();
      if (now - lastTemptationRef.current < TEMPTATION_INTERVAL_MS) return;
      if (temptation) return;
      const tdef = TEMPTATIONS[Math.floor(Math.random() * TEMPTATIONS.length)];
      const newT: Temptation = { ...tdef, id: nextIdRef.current++ };
      setTemptation(newT);
      lastTemptationRef.current = now;
      setTimeout(() => {
        setTemptation((cur) => {
          if (cur && cur.id === newT.id) {
            setScore((s) => ({ ...s, resisted: s.resisted + 1 }));
            return null;
          }
          return cur;
        });
      }, TEMPTATION_LIFETIME_MS);
    }, 500);
    return () => clearInterval(t);
  }, [running, temptation]);

  function start() {
    setRunning(true);
  }

  function pushSnowball() {
    if (pushCooldown > 0 || !running) return;
    setValue((v) => v + PUSH_AMOUNT);
    setPushCooldown(PUSH_COOLDOWN_MS);
  }

  function handleResist() {
    if (!temptation) return;
    setScore((s) => ({ ...s, resisted: s.resisted + 1 }));
    setTemptation(null);
  }

  function handleFall() {
    if (!temptation) return;
    const penalty = temptation.badPenalty;
    setValue((v) => {
      const after = v * (1 - penalty);
      if (after / peak < 0.7) setBigDrawdown(true);
      return after;
    });
    setScore((s) => ({ ...s, fell: s.fell + 1 }));
    setTemptation(null);
  }

  function restart() {
    setRunning(false);
    setYear(0);
    setValue(10000);
    setPeak(10000);
    setBigDrawdown(false);
    setPushCooldown(0);
    setTemptation(null);
    setScore({ resisted: 0, fell: 0 });
    setDone(false);
    lastTemptationRef.current = 0;
  }

  const size = Math.min(280, 60 + Math.log10(Math.max(1, value)) * 35);
  const won = done && value >= 1_000_000 && !bigDrawdown;

  if (done) {
    return (
      <Verdict
        won={won}
        title={
          won
            ? `Snöbollen blev ${fmt(value)} på 30 år.`
            : value >= 1_000_000
              ? `Snöbollen är värd ${fmt(value)} — men du tappade över 30 % en gång.`
              : `Snöbollen växte bara till ${fmt(value)}.`
        }
        summary={
          <>
            Du <strong>stod emot {score.resisted}</strong> frestelser och föll
            för <strong>{score.fell}</strong>. Snöbollen växer exponentiellt —
            ett enda klick på en frestelse kan kasta 5 års sparande.
          </>
        }
        onRestart={restart}
      >
        <LessonNote
          title="Snöbollens hemlighet"
          lessonSlug="04-ranta-pa-ranta"
          lessonLabel="Tillbaka till lektion 4"
          tone={won ? "good" : "default"}
        >
          Med 10 000 kr som startkapital, 8 % avkastning per år och
          1 000 kr/mån sparat → snöbollen växer till över 1,5 miljoner på
          30 år. Utan att klicka på en enda frestelse. Det är hela tricket.
        </LessonNote>
      </Verdict>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="År" value={`${year} / ${MAX_YEARS}`} />
        <Stat label="Snöboll" value={fmt(Math.round(value))} />
        <Stat
          label="Motstått"
          value={`${score.resisted} ↑ / ${score.fell} ↓`}
        />
      </div>

      <div className="spel-card flex flex-col items-center gap-4 p-6 sm:p-8">
        <div className="relative flex h-72 w-full items-end justify-center">
          {/* hill */}
          <svg viewBox="0 0 200 100" className="absolute bottom-0 left-0 h-full w-full">
            <path d="M 0 100 L 0 60 Q 100 40 200 95 L 200 100 Z" fill="#eadcc1" />
            <path d="M 0 100 L 0 60 Q 100 40 200 95" fill="none" stroke="#c8941f" strokeWidth="0.5" />
          </svg>
          <div
            className="relative z-10 flex items-center justify-center rounded-full transition-all"
            style={{
              width: size,
              height: size,
              background: "white",
              boxShadow: "0 8px 32px -8px rgba(0,0,0,0.15)",
              border: "2px solid #eadcc1",
              transitionDuration: "800ms",
            }}
          >
            <div className="text-center">
              <div className="text-3xl" aria-hidden>
                ❄️
              </div>
              <div className="text-xs font-bold tabular-nums text-[var(--spel-ink)]">
                {fmt(Math.round(value))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {!running && (
            <button type="button" className="spel-btn-primary" onClick={start}>
              Släpp snöbollen →
            </button>
          )}
          {running && (
            <button
              type="button"
              className="spel-btn-primary"
              onClick={pushSnowball}
              disabled={pushCooldown > 0}
            >
              {pushCooldown > 0
                ? `Vila ${Math.ceil(pushCooldown / 1000)} s`
                : `+ ${fmt(PUSH_AMOUNT)} månadsspar`}
            </button>
          )}
        </div>
      </div>

      {temptation && (
        <div
          className="spel-rise rounded-2xl border-2 p-5"
          style={{ borderColor: "var(--spel-red)", background: "#ffeaea" }}
        >
          <div
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--spel-red)" }}
          >
            🚨 Frestelse
          </div>
          <div className="mt-2 text-[15px] font-medium text-[var(--spel-ink)]">
            {temptation.headline}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-full border border-[#bfe1cd] bg-white px-4 py-2 text-sm font-semibold"
              style={{ color: "var(--spel-mint-dark)" }}
              onClick={handleResist}
            >
              ✓ {temptation.goodChoice}
            </button>
            <button
              type="button"
              className="spel-btn-primary"
              onClick={handleFall}
            >
              {temptation.badChoice}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="spel-card px-3 py-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
        {label}
      </div>
      <div className="mt-0.5 text-base font-bold tabular-nums text-[var(--spel-ink)] sm:text-lg">
        {value}
      </div>
    </div>
  );
}
