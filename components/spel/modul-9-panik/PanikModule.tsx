"use client";

import { useEffect, useState } from "react";

import { LessonNote } from "../shared/LessonNote";
import { Verdict } from "../shared/Verdict";

const DURATION = 60;
const START_VALUE = 1_000_000;

const HEADLINES = [
  "Sverigebörsen ner 12 % på en dag",
  "Banker rapporterar massiva förluster",
  "Investerare flyr till räntor",
  "VPN-poll: 70 % har sålt allt",
  "Bostadspriser kan falla 30 %",
  "Centralbanken kallar till krismöte",
  "EU diskuterar nödåtgärder",
  "Räntemarknaden fryser",
  "Räddningspaket på väg — eller?",
  "Globala marknader i fritt fall",
];

const FAKE_SMS = [
  "Sålde allt i morse, räddade mig undan 🙏",
  "Min granne tappade 400k på en dag",
  "Du måste sälja NU innan det är försent",
  "Influencern jag följer säger 0% chans återhämtning",
  "Min farsa sa 2008 var värre — alla sa samma då",
];

function fmt(n: number) {
  return n.toLocaleString("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  });
}

type Outcome = "sold" | "held" | "bought" | null;

export function PanikModule() {
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [value, setValue] = useState(START_VALUE);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [headlineIdx, setHeadlineIdx] = useState(0);
  const [smsIdx, setSmsIdx] = useState(0);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        const nt = t - 1;
        if (nt <= 0) {
          setRunning(false);
          if (outcome === null) setOutcome("held");
        }
        return Math.max(0, nt);
      });
      setValue((v) => {
        const elapsed = DURATION - timeLeft;
        const dropTarget = START_VALUE * 0.6;
        const next = Math.max(dropTarget, v * (1 - 0.02 - Math.random() * 0.02));
        return next;
      });
      setHeadlineIdx((i) => (i + 1) % HEADLINES.length);
      if (Math.random() < 0.3) setSmsIdx((i) => (i + 1) % FAKE_SMS.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [running, outcome, timeLeft]);

  function start() {
    setRunning(true);
    setTimeLeft(DURATION);
    setValue(START_VALUE);
    setOutcome(null);
  }

  function sell() {
    if (!running || outcome) return;
    setOutcome("sold");
    setRunning(false);
  }

  function hold() {
    if (!running || outcome) return;
    setOutcome("held");
    setRunning(false);
  }

  function buy() {
    if (!running || outcome) return;
    setOutcome("bought");
    setRunning(false);
  }

  function restart() {
    setRunning(false);
    setTimeLeft(DURATION);
    setValue(START_VALUE);
    setOutcome(null);
  }

  if (outcome) {
    let endValue: number;
    let won: boolean;
    let title: string;
    let summary: string;
    if (outcome === "sold") {
      endValue = value;
      won = false;
      title = `Du sålde på botten. ${fmt(endValue)}.`;
      summary =
        "Tre månader senare hade börsen återhämtat sig 80 %. Du satt utanför. Den gamla portföljen är nu värd 1,3 miljoner. Du har inte ens 700 000.";
    } else if (outcome === "bought") {
      endValue = value * 1.8;
      won = true;
      title = `Du köpte mer på botten. ${fmt(endValue)}.`;
      summary =
        "Tre månader senare hade börsen återhämtat sig 80 %. Du köpte rabatt — och de extra aktierna är nu värda dubbla. Det är så förmögenheter byggs.";
    } else {
      endValue = START_VALUE * 1.05;
      won = true;
      title = `Du stod still. ${fmt(endValue)}.`;
      summary =
        "Du gjorde inget. Tre månader senare hade börsen återhämtat sig 80 %. Din portfölj är 1,05 miljoner kr — en touch över utgångsläget. Att inte göra något är ofta det bästa beslutet.";
    }
    return (
      <Verdict won={won} title={title} summary={summary} onRestart={restart}>
        <LessonNote
          title="Reptilhjärnan vs frontalloben"
          lessonSlug="09-psykologi"
          lessonLabel="Tillbaka till lektion 9"
          tone={won ? "good" : "danger"}
        >
          Att sälja på en krasch är att låsa in förlusten och missa
          återhämtningen. Att stå stilla räcker. Att köpa på botten är hjältens
          plats — men kräver mod när alla andra säljer. Statistiskt vinner den
          som inte gör något.
        </LessonNote>
      </Verdict>
    );
  }

  const dropPct = ((value - START_VALUE) / START_VALUE) * 100;
  const intensity = (DURATION - timeLeft) / DURATION;
  const bgRed = `rgba(214, 40, 40, ${Math.min(0.18, intensity * 0.2)})`;

  if (!running) {
    return (
      <div className="space-y-6">
        <LessonNote title="Det här är den enda spelmodulen med tidspress" tone="default">
          Lektion 9 säger uttryckligen att panik är aktiehandelns största
          fiende. Här testas det direkt. 60 sekunder. Skärmen blir röd.
          Nyheter rullar. En enorm SÄLJ-knapp kommer att pulsera. Frågan är
          enkel: kan du sitta still?
        </LessonNote>
        <button type="button" className="spel-btn-primary" onClick={start}>
          Starta krisen ⚡
        </button>
      </div>
    );
  }

  return (
    <div
      className="space-y-5 rounded-3xl p-4 transition-colors sm:p-6"
      style={{ background: bgRed }}
    >
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Tid kvar" value={`${timeLeft} s`} />
        <Stat label="Portfölj" value={fmt(Math.round(value))} />
        <Stat
          label="Förändring"
          value={`${dropPct.toFixed(1)} %`}
          tone={dropPct < 0 ? "danger" : "good"}
        />
      </div>

      <div
        className="rounded-2xl border p-4 text-sm font-medium"
        style={{
          borderColor: "var(--spel-red)",
          background: "white",
          color: "var(--spel-red)",
        }}
      >
        <div className="text-[10px] font-bold uppercase tracking-wider">
          🔴 Realtid · finansnyheter
        </div>
        <div className="mt-1">{HEADLINES[headlineIdx]}</div>
      </div>

      <div className="rounded-2xl bg-white p-4 text-sm">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
          📱 SMS från vänner
        </div>
        <div className="mt-1 italic text-[var(--spel-ink-muted)]">
          &ldquo;{FAKE_SMS[smsIdx]}&rdquo;
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 pt-4">
        <button
          type="button"
          onClick={sell}
          className="relative flex h-32 w-full max-w-md items-center justify-center rounded-3xl font-black uppercase tracking-wider text-white shadow-2xl"
          style={{
            fontSize: 28,
            background: "var(--spel-red)",
            animation: "spel-panic-pulse 0.8s ease-in-out infinite",
          }}
        >
          SÄLJ ALLT NU
        </button>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={hold}
            className="rounded-full border border-[var(--spel-ink-muted)] bg-white px-4 py-2 text-xs font-medium text-[var(--spel-ink-muted)]"
          >
            håll
          </button>
          <button
            type="button"
            onClick={buy}
            className="rounded-full px-2 py-0.5 text-[10px] font-medium opacity-50"
            style={{ background: "#eaf6f0", color: "var(--spel-mint-dark)" }}
          >
            köp mer
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spel-panic-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 8px 32px rgba(214,40,40,0.4); }
          50% { transform: scale(1.04); box-shadow: 0 12px 48px rgba(214,40,40,0.7); }
        }
      `}</style>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "danger" | "good";
}) {
  const color =
    tone === "danger"
      ? "var(--spel-red)"
      : tone === "good"
        ? "var(--spel-mint-dark)"
        : "var(--spel-ink)";
  return (
    <div className="spel-card px-3 py-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
        {label}
      </div>
      <div
        className="mt-0.5 text-base font-bold tabular-nums sm:text-lg"
        style={{ color }}
      >
        {value}
      </div>
    </div>
  );
}
