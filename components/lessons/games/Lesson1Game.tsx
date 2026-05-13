"use client";

import { useMemo, useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";

type ShareClass = "A" | "B";

type Shareholder = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  shares: number;
  shareClass: ShareClass;
  isPlayer?: boolean;
};

const COLORS = {
  you: "#16a34a",
  sara: "#3b82f6",
  erik: "#f59e0b",
  stina: "#ec4899",
  investor: "#8b5cf6",
  public: "#06b6d4",
};

const FOUNDING: Shareholder[] = [
  { id: "you", name: "Du", emoji: "🧑‍🍳", color: COLORS.you, shares: 10, shareClass: "A", isPlayer: true },
  { id: "sara", name: "Sara", emoji: "👩‍🍳", color: COLORS.sara, shares: 10, shareClass: "A" },
  { id: "erik", name: "Erik", emoji: "👨‍🍳", color: COLORS.erik, shares: 10, shareClass: "A" },
  { id: "stina", name: "Stina", emoji: "💼", color: COLORS.stina, shares: 70, shareClass: "A" },
];

type Step =
  | "intro"
  | "founding"
  | "emission"
  | "voting"
  | "ipo"
  | "dividend"
  | "recap";

const STEPS: Step[] = [
  "intro",
  "founding",
  "emission",
  "voting",
  "ipo",
  "dividend",
  "recap",
];

export function Lesson1Game() {
  const [step, setStep] = useState<Step>("intro");
  const [holders, setHolders] = useState<Shareholder[]>(FOUNDING);
  const [emissionAnswer, setEmissionAnswer] = useState<string | null>(null);
  const [vote, setVote] = useState<"yes" | "no" | null>(null);
  const [yearlyDividend, setYearlyDividend] = useState(0);

  const totals = useMemo(() => {
    const totalShares = holders.reduce((s, h) => s + h.shares, 0);
    const totalVotes = holders.reduce(
      (s, h) => s + h.shares * (h.shareClass === "A" ? 1 : 0.1),
      0,
    );
    const you = holders.find((h) => h.isPlayer)!;
    return {
      totalShares,
      totalVotes,
      you,
      yourSharePct: (you.shares / totalShares) * 100,
      yourVotePct: ((you.shares * (you.shareClass === "A" ? 1 : 0.1)) / totalVotes) * 100,
    };
  }, [holders]);

  function go(next: Step) {
    setStep(next);
  }

  function restart() {
    setHolders(FOUNDING);
    setEmissionAnswer(null);
    setVote(null);
    setYearlyDividend(0);
    setStep("intro");
  }

  function applyEmission() {
    setHolders((prev) => [
      ...prev,
      {
        id: "investor1",
        name: "VC-fond",
        emoji: "🏢",
        color: COLORS.investor,
        shares: 50,
        shareClass: "A",
      },
    ]);
  }

  function applyIPO() {
    setHolders((prev) => [
      ...prev,
      {
        id: "public",
        name: "Allmänheten",
        emoji: "📈",
        color: COLORS.public,
        shares: 1000,
        shareClass: "B",
      },
    ]);
  }

  function applyDividend() {
    const profitKr = 5_000_000;
    const payoutRatio = 0.5;
    const totalDiv = profitKr * payoutRatio;
    const perShare = totalDiv / totals.totalShares;
    const yours = perShare * totals.you.shares;
    setYearlyDividend(yours);
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-br from-amber-50 via-white to-amber-50 shadow-sm">
      <div className="border-b border-neutral-200 bg-white/60 px-6 py-4 backdrop-blur sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">
              Spel · Lektion 1
            </div>
            <div className="mt-0.5 text-base font-bold tracking-tight text-neutral-900 sm:text-lg">
              🍕 Pizza-Ägaren
            </div>
          </div>
          <ProgressDots
            current={STEPS.indexOf(step)}
            total={STEPS.length - 1}
          />
        </div>
      </div>

      <div className="p-6 sm:p-10">
        {step === "intro" && <Intro onStart={() => go("founding")} />}

        {step === "founding" && (
          <Founding
            holders={holders}
            totals={totals}
            onNext={() => go("emission")}
          />
        )}

        {step === "emission" && (
          <Emission
            holders={holders}
            totals={totals}
            answer={emissionAnswer}
            onAnswer={(a) => setEmissionAnswer(a)}
            onApply={() => {
              applyEmission();
              go("voting");
            }}
          />
        )}

        {step === "voting" && (
          <Voting
            holders={holders}
            totals={totals}
            vote={vote}
            onVote={setVote}
            onNext={() => go("ipo")}
          />
        )}

        {step === "ipo" && (
          <IPO
            holders={holders}
            totals={totals}
            onApply={() => {
              applyIPO();
              go("dividend");
            }}
          />
        )}

        {step === "dividend" && (
          <Dividend
            holders={holders}
            totals={totals}
            yearlyDividend={yearlyDividend}
            onCompute={applyDividend}
            onNext={() => go("recap")}
          />
        )}

        {step === "recap" && (
          <Recap totals={totals} yearlyDividend={yearlyDividend} onRestart={restart} />
        )}
      </div>
    </div>
  );
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 w-6 rounded-full transition-colors",
            i < current
              ? "bg-amber-600"
              : i === current
                ? "bg-amber-500"
                : "bg-neutral-200",
          )}
        />
      ))}
    </div>
  );
}

function DonutChart({
  holders,
  size = 220,
  highlightPlayer = false,
}: {
  holders: Shareholder[];
  size?: number;
  highlightPlayer?: boolean;
}) {
  const total = holders.reduce((s, h) => s + h.shares, 0);
  let offset = 0;
  const segments = holders.map((h) => {
    const pct = (h.shares / total) * 100;
    const seg = {
      id: h.id,
      pct,
      offset,
      color: h.color,
      isPlayer: !!h.isPlayer,
    };
    offset += pct;
    return seg;
  });

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r="35" fill="none" stroke="#f5f5f4" strokeWidth="14" />
        {segments.map((s) => (
          <circle
            key={s.id}
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke={s.color}
            strokeWidth={highlightPlayer && !s.isPlayer ? 12 : 14}
            opacity={highlightPlayer && !s.isPlayer ? 0.45 : 1}
            pathLength="100"
            strokeDasharray={`${s.pct} 100`}
            strokeDashoffset={-s.offset}
            strokeLinecap="butt"
            className="transition-all duration-700 ease-out"
          />
        ))}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl">🍕</div>
        <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
          La Bella
        </div>
        <div className="text-sm font-bold tabular-nums text-neutral-900">
          {total} aktier
        </div>
      </div>
    </div>
  );
}

function CapTable({ holders }: { holders: Shareholder[] }) {
  const total = holders.reduce((s, h) => s + h.shares, 0);
  return (
    <ul className="space-y-1.5">
      {holders.map((h) => {
        const pct = (h.shares / total) * 100;
        return (
          <li
            key={h.id}
            className={cn(
              "flex items-center justify-between rounded-lg px-3 py-2 text-sm",
              h.isPlayer
                ? "bg-emerald-50 ring-1 ring-emerald-200"
                : "bg-white/70",
            )}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ background: h.color }}
              />
              <span className="text-base">{h.emoji}</span>
              <span className={cn("font-medium", h.isPlayer && "text-emerald-900")}>
                {h.name}
              </span>
              <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-600">
                {h.shareClass}-aktier
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold tabular-nums text-neutral-900">
                {h.shares.toLocaleString("sv-SE")} st
              </div>
              <div className="text-[11px] tabular-nums text-neutral-500">
                {pct.toFixed(pct < 10 ? 1 : 0)} %
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function SceneLayout({
  chart,
  children,
}: {
  chart: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[auto,1fr] lg:items-start lg:gap-12">
      <div className="flex flex-col items-center gap-4">{chart}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function StoryHeader({
  year,
  title,
  intro,
}: {
  year: string;
  title: string;
  intro: string;
}) {
  return (
    <>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">
        {year}
      </div>
      <h3 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
        {title}
      </h3>
      <p className="mt-3 text-base text-neutral-700">{intro}</p>
    </>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full px-6 py-3 text-sm font-semibold text-white transition-all",
        disabled
          ? "cursor-not-allowed bg-neutral-300"
          : "bg-neutral-900 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-lg",
      )}
    >
      {children}
    </button>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/80 px-4 py-2 ring-1 ring-neutral-200">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
        {label}
      </div>
      <div className="mt-0.5 text-base font-bold tabular-nums text-neutral-900">
        {value}
      </div>
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="text-6xl">🍕</div>
      <h3 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
        Pizza-Ägaren
      </h3>
      <p className="mt-4 text-base text-neutral-700 sm:text-lg">
        Du och två vänner ska starta pizzerian <strong>La Bella</strong>. Spelet tar dig från grundande till börsnotering — och du lär dig hur aktier, emissioner, rösträtt och utdelning fungerar på riktigt.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-2 text-xs text-neutral-600 sm:text-sm">
        <div className="rounded-lg bg-white/70 p-3 ring-1 ring-neutral-200">
          <div>🍕</div>
          <div className="mt-1 font-medium">6 scener</div>
        </div>
        <div className="rounded-lg bg-white/70 p-3 ring-1 ring-neutral-200">
          <div>🎓</div>
          <div className="mt-1 font-medium">~5 minuter</div>
        </div>
        <div className="rounded-lg bg-white/70 p-3 ring-1 ring-neutral-200">
          <div>🧠</div>
          <div className="mt-1 font-medium">Lär aktivt</div>
        </div>
      </div>
      <div className="mt-8">
        <PrimaryButton onClick={onStart}>Starta spelet →</PrimaryButton>
      </div>
    </div>
  );
}

type Totals = ReturnType<
  () => {
    totalShares: number;
    totalVotes: number;
    you: Shareholder;
    yourSharePct: number;
    yourVotePct: number;
  }
>;

function Founding({
  holders,
  totals,
  onNext,
}: {
  holders: Shareholder[];
  totals: Totals;
  onNext: () => void;
}) {
  return (
    <SceneLayout chart={<DonutChart holders={holders} />}>
      <StoryHeader
        year="År 1 · 2025"
        title="Grundandet"
        intro="Du, Sara och Erik vill öppna pizzerian La Bella i Stockholm. Ni behöver 1 000 000 kr för lokal, ugn och inredning, men har bara 300 000 kr tillsammans. Stina, en lokal investerare, går in med 700 000 kr."
      />
      <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
        <strong>Ni delar bolaget i 100 aktier.</strong> En aktie kostar 10 000 kr.
        Den som betalar mer får fler aktier.
      </div>
      <div className="mt-5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
          Ägarbild
        </div>
        <div className="mt-2">
          <CapTable holders={holders} />
        </div>
      </div>
      <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900 ring-1 ring-emerald-200">
        Du äger <strong>{totals.you.shares} aktier av {totals.totalShares}</strong> ={" "}
        <strong>{totals.yourSharePct.toFixed(0)} %</strong> av La Bella.
      </div>
      <div className="mt-6 flex justify-end">
        <PrimaryButton onClick={onNext}>Nästa: Expansion →</PrimaryButton>
      </div>
    </SceneLayout>
  );
}

function Emission({
  holders,
  totals,
  answer,
  onAnswer,
  onApply,
}: {
  holders: Shareholder[];
  totals: Totals;
  answer: string | null;
  onAnswer: (a: string) => void;
  onApply: () => void;
}) {
  const options = [
    { id: "up", text: "Den ökar — fler aktier i bolaget = jag äger mer." },
    { id: "same", text: "Den är oförändrad — mina aktier räknas i procent." },
    {
      id: "down",
      text: "Den minskar — jag har lika många aktier men de utgör mindre del av totalen.",
      correct: true,
    },
  ];

  const newTotal = totals.totalShares + 50;
  const newPct = (totals.you.shares / newTotal) * 100;

  return (
    <SceneLayout chart={<DonutChart holders={holders} />}>
      <StoryHeader
        year="År 2 · 2026"
        title="Emission av nya aktier"
        intro="La Bella går i taket. Ni vill öppna 3 filialer till — men det kostar 2 000 000 kr. Styrelsen beslutar att göra en nyemission: 50 nya aktier säljs till en VC-fond för 40 000 kr per aktie. Bolaget får in 2 mkr — utan skuld."
      />

      <div className="mt-6">
        <div className="text-sm font-semibold text-neutral-900">
          Vad händer med din ägarandel?
        </div>
        <div className="mt-3 space-y-2">
          {options.map((opt) => {
            const isAnswered = answer !== null;
            const isChosen = answer === opt.id;
            const showCorrect = isAnswered && opt.correct;
            const showWrong = isChosen && !opt.correct;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={isAnswered}
                onClick={() => onAnswer(opt.id)}
                className={cn(
                  "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                  !isAnswered &&
                    "border-neutral-200 bg-white hover:border-amber-400 hover:bg-amber-50",
                  isAnswered &&
                    !showCorrect &&
                    !showWrong &&
                    "border-neutral-200 bg-neutral-50 text-neutral-500",
                  showCorrect &&
                    "border-emerald-400 bg-emerald-50 text-emerald-900",
                  showWrong && "border-red-300 bg-red-50 text-red-800",
                )}
              >
                {opt.text}
                {showCorrect && " ✓"}
              </button>
            );
          })}
        </div>
      </div>

      {answer && (
        <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900 ring-1 ring-emerald-200">
          <strong>Korrekt princip:</strong> Du har fortfarande {totals.you.shares} aktier, men nu finns {newTotal} aktier totalt. Din andel: {totals.you.shares}/{newTotal} ≈ {newPct.toFixed(1)} %. Det här kallas <strong>utspädning</strong>.
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div className="text-xs text-neutral-500">
          Bolaget får 2 mkr i kassan — utan att låna.
        </div>
        <PrimaryButton onClick={onApply} disabled={!answer}>
          Genomför emissionen →
        </PrimaryButton>
      </div>
    </SceneLayout>
  );
}

function Voting({
  holders,
  totals,
  vote,
  onVote,
  onNext,
}: {
  holders: Shareholder[];
  totals: Totals;
  vote: "yes" | "no" | null;
  onVote: (v: "yes" | "no") => void;
  onNext: () => void;
}) {
  const yesVoters = holders.filter((h) => ["stina", "investor1"].includes(h.id));
  const noVoters = holders.filter((h) => !["stina", "investor1"].includes(h.id) && h.id !== "you");
  const yesVotes = yesVoters.reduce((s, h) => s + h.shares, 0);
  const noVotesBase = noVoters.reduce((s, h) => s + h.shares, 0);
  const yourVotes = totals.you.shares;
  const finalYes = yesVotes + (vote === "yes" ? yourVotes : 0);
  const finalNo = noVotesBase + (vote === "no" ? yourVotes : 0);
  const yesWins = finalYes > finalNo;

  return (
    <SceneLayout chart={<DonutChart holders={holders} highlightPlayer />}>
      <StoryHeader
        year="År 3 · 2027"
        title="Bolagsstämma"
        intro="Det är dags för årets bolagsstämma. Styrelsen föreslår att VD:n ska få en bonus på 500 000 kr. Alla aktier är A-aktier med 1 röst styck."
      />

      <div className="mt-5 rounded-xl bg-white p-4 ring-1 ring-neutral-200">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
          Din röstvikt
        </div>
        <div className="mt-1 text-sm text-neutral-700">
          Du har <strong>{yourVotes} röster</strong> av totalt{" "}
          <strong>{totals.totalShares}</strong> röster ={" "}
          <strong>{totals.yourVotePct.toFixed(1)} %</strong> av röststyrkan.
        </div>
      </div>

      {vote === null ? (
        <div className="mt-6">
          <div className="text-sm font-semibold text-neutral-900">
            Hur röstar du?
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onVote("yes")}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-4 text-left text-sm transition-all hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-50 hover:shadow"
            >
              <div className="text-lg">✅</div>
              <div className="mt-1 font-semibold">Ja till bonus</div>
              <div className="mt-0.5 text-xs text-neutral-500">
                VD:n förtjänar det.
              </div>
            </button>
            <button
              type="button"
              onClick={() => onVote("no")}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-4 text-left text-sm transition-all hover:-translate-y-0.5 hover:border-red-400 hover:bg-red-50 hover:shadow"
            >
              <div className="text-lg">❌</div>
              <div className="mt-1 font-semibold">Nej till bonus</div>
              <div className="mt-0.5 text-xs text-neutral-500">
                Pengarna gör mer nytta i bolaget.
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-white p-4 ring-1 ring-neutral-200">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
              Resultat
            </div>
            <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-emerald-700">
                  <strong>Ja:</strong> {finalYes} röster
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  Stina + VC-fond
                  {vote === "yes" && " + du"}
                </div>
              </div>
              <div>
                <div className="text-red-700">
                  <strong>Nej:</strong> {finalNo} röster
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  Sara + Erik
                  {vote === "no" && " + du"}
                </div>
              </div>
            </div>
            <div
              className={cn(
                "mt-3 rounded-lg px-3 py-2 text-sm font-semibold",
                yesWins
                  ? "bg-emerald-100 text-emerald-900"
                  : "bg-red-100 text-red-900",
              )}
            >
              {yesWins ? "Bonusen godkänns." : "Bonusen avslås."}
            </div>
          </div>
          <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
            <strong>Lärdom:</strong> Storägare (Stina + VC-fonden) har{" "}
            {(((yesVoters.reduce((s, h) => s + h.shares, 0)) / totals.totalShares) * 100).toFixed(0)} % av rösterna och kan därför styra besluten. Din röst på {yourVotes} aktier är värdefull men begränsad.
          </div>
          <div className="flex justify-end">
            <PrimaryButton onClick={onNext}>Nästa: Börsnotering →</PrimaryButton>
          </div>
        </div>
      )}
    </SceneLayout>
  );
}

function IPO({
  holders,
  totals,
  onApply,
}: {
  holders: Shareholder[];
  totals: Totals;
  onApply: () => void;
}) {
  const afterTotalShares = totals.totalShares + 1000;
  const afterTotalVotes = totals.totalVotes + 1000 * 0.1;
  const insiderVotes = totals.totalVotes;
  const insiderVotePctAfter = (insiderVotes / afterTotalVotes) * 100;
  const insiderShareAfter = (totals.totalShares / afterTotalShares) * 100;

  return (
    <SceneLayout chart={<DonutChart holders={holders} />}>
      <StoryHeader
        year="År 4 · 2028"
        title="Börsnoteringen"
        intro="La Bella är värt 100 mkr och har 18 filialer. Bolaget ska börsnoteras. För att grundarna ska behålla kontrollen införs två aktieslag."
      />

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-4 ring-1 ring-neutral-200">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
            A-aktier
          </div>
          <div className="mt-1 text-lg font-bold text-neutral-900">
            1 röst / aktie
          </div>
          <div className="mt-1 text-xs text-neutral-600">
            Grundarna (du, Sara, Erik, Stina, VC-fonden) behåller sina aktier som A.
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 ring-1 ring-neutral-200">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-sky-700">
            B-aktier
          </div>
          <div className="mt-1 text-lg font-bold text-neutral-900">
            1/10 röst / aktie
          </div>
          <div className="mt-1 text-xs text-neutral-600">
            1 000 nya B-aktier säljs till allmänheten på börsen.
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
        <strong>Magin med A/B:</strong> Efter noteringen finns{" "}
        {afterTotalShares.toLocaleString("sv-SE")} aktier totalt, men bara{" "}
        {afterTotalVotes.toLocaleString("sv-SE")} röster (B-aktiernas röster väger lägre). Insiders har <strong>{insiderShareAfter.toFixed(0)} %</strong> av aktierna men fortfarande <strong>{insiderVotePctAfter.toFixed(0)} %</strong> av rösterna. Det är därför H&M, Investor och många andra svenska bolag har A/B-struktur.
      </div>

      <div className="mt-6 flex justify-end">
        <PrimaryButton onClick={onApply}>Genomför noteringen →</PrimaryButton>
      </div>
    </SceneLayout>
  );
}

function Dividend({
  holders,
  totals,
  yearlyDividend,
  onCompute,
  onNext,
}: {
  holders: Shareholder[];
  totals: Totals;
  yearlyDividend: number;
  onCompute: () => void;
  onNext: () => void;
}) {
  const profit = 5_000_000;
  const payout = profit * 0.5;
  const perShare = payout / totals.totalShares;

  return (
    <SceneLayout chart={<DonutChart holders={holders} />}>
      <StoryHeader
        year="År 5 · 2029"
        title="Utdelning"
        intro="La Bella gör 5 mkr i vinst. Styrelsen föreslår att 50 % av vinsten delas ut till ägarna. Resten investeras i nya filialer."
      />

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <StatPill label="Vinst" value={`${(profit / 1_000_000).toFixed(1)} mkr`} />
        <StatPill
          label="Utdelningsgrad"
          value="50 %"
        />
        <StatPill
          label="Totalt utdelat"
          value={`${(payout / 1_000_000).toFixed(2)} mkr`}
        />
      </div>

      <div className="mt-5 rounded-xl bg-white p-4 ring-1 ring-neutral-200">
        <div className="text-sm text-neutral-700">
          Utdelningen delas lika på <strong>varje aktie</strong>, oavsett A eller B:
        </div>
        <div className="mt-2 font-mono text-sm text-neutral-900">
          {payout.toLocaleString("sv-SE")} kr ÷{" "}
          {totals.totalShares.toLocaleString("sv-SE")} aktier ={" "}
          <strong>{perShare.toFixed(2)} kr / aktie</strong>
        </div>
      </div>

      {yearlyDividend === 0 ? (
        <div className="mt-6 flex justify-end">
          <PrimaryButton onClick={onCompute}>
            Räkna ut din utdelning →
          </PrimaryButton>
        </div>
      ) : (
        <>
          <div className="mt-5 rounded-xl bg-emerald-50 p-5 text-emerald-900 ring-1 ring-emerald-200">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
              Din utdelning i år
            </div>
            <div className="mt-1 text-3xl font-bold tabular-nums">
              {Math.round(yearlyDividend).toLocaleString("sv-SE")} kr
            </div>
            <div className="mt-1 text-sm">
              {totals.you.shares} aktier × {perShare.toFixed(2)} kr ={" "}
              {yearlyDividend.toFixed(2)} kr
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <PrimaryButton onClick={onNext}>Slutsumma →</PrimaryButton>
          </div>
        </>
      )}
    </SceneLayout>
  );
}

function Recap({
  totals,
  yearlyDividend,
  onRestart,
}: {
  totals: Totals;
  yearlyDividend: number;
  onRestart: () => void;
}) {
  const lessons = [
    "En aktie är en ägarandel i ett riktigt företag.",
    "Vid emission späds din procentandel ut — du har lika många aktier, men de utgör en mindre del av totalen.",
    "Rösträtt = din andel av makten på bolagsstämman. Stora ägare bestämmer.",
    "A-aktier ger mer röst per aktie än B-aktier; utdelningen är densamma.",
    "Utdelning är din andel av vinsten — fördelas per aktie, inte per ägare.",
  ];

  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="text-5xl">🎉</div>
      <h3 className="mt-3 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
        Du har spelat klart Pizza-Ägaren
      </h3>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <StatPill
          label="Din andel nu"
          value={`${totals.yourSharePct.toFixed(2)} %`}
        />
        <StatPill
          label="Din röststyrka"
          value={`${totals.yourVotePct.toFixed(1)} %`}
        />
        <StatPill
          label="Årets utdelning"
          value={`${Math.round(yearlyDividend).toLocaleString("sv-SE")} kr`}
        />
      </div>

      <div className="mt-6 rounded-2xl bg-white p-5 text-left ring-1 ring-neutral-200 sm:p-6">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">
          Vad du lärde dig
        </div>
        <ul className="mt-3 space-y-2 text-sm text-neutral-800">
          {lessons.map((l) => (
            <li key={l} className="flex gap-2">
              <span aria-hidden className="text-emerald-600">
                ✓
              </span>
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-900"
        >
          ↺ Spela igen
        </button>
        <PrimaryButton onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Tillbaka till lektionen
        </PrimaryButton>
      </div>
    </div>
  );
}
