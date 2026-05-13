"use client";

import { useState } from "react";

import { LessonNote } from "../shared/LessonNote";
import { Verdict } from "../shared/Verdict";

type Mood = "manic" | "neutral" | "depressed";
type Kind = "buy" | "sell";

export type Day = {
  day: number;
  mood: Mood;
  kind: Kind;
  percentTraded: number;
  pricePerPercent: number;
  speech: string;
  verdict: "great-to-buy" | "great-to-sell" | "fair" | "bad-to-buy" | "bad-to-sell";
};

export type MrMarketData = {
  fairValuePerPercent: number;
  playerStartCash: number;
  playerStartShares: number;
  days: Day[];
};

type Decision = {
  day: Day;
  action: "accept" | "decline";
  wasGood: boolean;
};

const MOOD_EMOJI: Record<Mood, string> = {
  manic: "🤩",
  neutral: "😐",
  depressed: "😩",
};

const MOOD_LABEL: Record<Mood, string> = {
  manic: "Manisk",
  neutral: "Neutral",
  depressed: "Deprimerad",
};

function fmt(n: number) {
  return n.toLocaleString("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  });
}

export function MrMarketModule({ data }: { data: MrMarketData }) {
  const [step, setStep] = useState(0);
  const [cash, setCash] = useState(data.playerStartCash);
  const [shares, setShares] = useState(data.playerStartShares);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [showCalc, setShowCalc] = useState(false);

  const current = data.days[step];
  const done = step >= data.days.length;

  function accept() {
    if (!current) return;
    const cost = current.pricePerPercent * current.percentTraded;
    let nextCash = cash;
    let nextShares = shares;
    if (current.kind === "buy") {
      // Mr Market buys from you → you receive cash, lose shares
      nextCash = cash + cost;
      nextShares = shares - current.percentTraded;
    } else {
      // Mr Market sells to you → you pay cash, gain shares
      nextCash = cash - cost;
      nextShares = shares + current.percentTraded;
    }
    const wasGood =
      (current.kind === "buy" && current.verdict === "great-to-sell") ||
      (current.kind === "sell" && current.verdict === "great-to-buy");
    setCash(nextCash);
    setShares(nextShares);
    setDecisions((d) => [...d, { day: current, action: "accept", wasGood }]);
    setStep(step + 1);
    setShowCalc(false);
  }

  function decline() {
    if (!current) return;
    const wasGood =
      current.verdict === "bad-to-buy" || current.verdict === "bad-to-sell";
    setDecisions((d) => [...d, { day: current, action: "decline", wasGood }]);
    setStep(step + 1);
    setShowCalc(false);
  }

  function restart() {
    setStep(0);
    setCash(data.playerStartCash);
    setShares(data.playerStartShares);
    setDecisions([]);
    setShowCalc(false);
  }

  if (done) {
    const goodChoices = decisions.filter((d) => d.wasGood).length;
    const won = goodChoices >= 5;
    const portfolioValue = cash + shares * data.fairValuePerPercent;
    return (
      <Verdict
        won={won}
        title={
          won
            ? `Du läste av Mr Market — ${goodChoices} av ${decisions.length} bra beslut.`
            : `Mr Market vann den här rundan. Bara ${goodChoices} av ${decisions.length} bra beslut.`
        }
        summary={
          <>
            Du har <strong>{fmt(cash)}</strong> i kassan och äger{" "}
            <strong>{shares} %</strong> av pizzerian (värd{" "}
            <strong>
              {fmt(shares * data.fairValuePerPercent)}
            </strong>{" "}
            till verkligt pris). Total förmögenhet: <strong>{fmt(portfolioValue)}</strong>.
          </>
        }
        onRestart={restart}
      >
        <LessonNote
          title="Mr Markets lärdom"
          lessonSlug="02-borsen-och-mr-market"
          lessonLabel="Tillbaka till lektion 2"
          tone={won ? "good" : "default"}
        >
          Det rättvisa priset låg på {fmt(data.fairValuePerPercent)} per procent.
          Maniska dagar erbjöd 70–95 % över, deprimerade dagar 30–50 % under.
          Tålamod att vänta på rätt bud är hela poängen.
        </LessonNote>
      </Verdict>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Dag" value={`${step + 1} / ${data.days.length}`} />
        <Stat label="Kassa" value={fmt(cash)} />
        <Stat label="Ägande" value={`${shares} %`} />
      </div>

      <div className="spel-card p-6 sm:p-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-5xl"
            style={{
              background:
                current.mood === "manic"
                  ? "#fff3d6"
                  : current.mood === "depressed"
                    ? "#e7eef4"
                    : "#f0eee8",
            }}
            aria-hidden
          >
            {MOOD_EMOJI[current.mood]}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
              Dag {current.day} · Mr Market är {MOOD_LABEL[current.mood].toLowerCase()}
            </div>
            <div className="mt-2 rounded-2xl rounded-tl-sm bg-[#f5ebd7] px-4 py-3 text-[15px] text-[var(--spel-ink)]">
              <span className="mr-1 font-semibold">Mr Market:</span> {current.speech}
            </div>
            <div className="mt-3 text-sm text-[var(--spel-ink-muted)]">
              Han vill <strong>{current.kind === "buy" ? "köpa" : "sälja"}</strong>{" "}
              {current.percentTraded} % till{" "}
              <strong>{fmt(current.pricePerPercent)}</strong> per procent
              (totalt {fmt(current.pricePerPercent * current.percentTraded)}).
            </div>
          </div>
        </div>

        {showCalc && (
          <div className="mt-4 rounded-xl border border-[#eadcc1] bg-[#fffaf0] p-4 text-sm">
            <strong>Räknare:</strong> Det rättvisa priset är{" "}
            <strong>{fmt(data.fairValuePerPercent)}</strong> per procent.
            Mr Market erbjuder <strong>{fmt(current.pricePerPercent)}</strong>{" "}
            per procent — det är{" "}
            <strong>
              {((current.pricePerPercent / data.fairValuePerPercent - 1) * 100).toFixed(0)} %
            </strong>{" "}
            {current.pricePerPercent > data.fairValuePerPercent ? "över" : "under"}{" "}
            rättvist värde.
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" className="spel-btn-primary" onClick={accept}>
            {current.kind === "buy" ? "Sälj till honom" : "Köp av honom"} →
          </button>
          <button type="button" className="spel-choice" onClick={decline}>
            Tacka nej · Vänta på imorgon
          </button>
          <button
            type="button"
            className="spel-btn-ghost"
            onClick={() => setShowCalc((v) => !v)}
          >
            {showCalc ? "Stäng räknare" : "🧮 Räkna ut värdet"}
          </button>
        </div>
      </div>

      {decisions.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
            Hittills
          </div>
          <div className="flex flex-wrap gap-2">
            {decisions.map((d, i) => (
              <div
                key={i}
                className="rounded-full border px-2.5 py-0.5 text-xs"
                style={{
                  borderColor: d.wasGood ? "var(--spel-mint)" : "#f1b4b4",
                  color: d.wasGood ? "var(--spel-mint-dark)" : "var(--spel-red)",
                  background: d.wasGood ? "#eaf6f0" : "#ffeaea",
                }}
              >
                Dag {d.day.day}: {d.action === "accept" ? "tog budet" : "tackade nej"} ·{" "}
                {d.wasGood ? "bra" : "miss"}
              </div>
            ))}
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
