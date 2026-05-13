"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/cn";
import { formatKr, formatPct, formatSignedKr } from "@/lib/format";
import type { Portfolio } from "@/lib/portfolio";
import type { Instrument } from "@/lib/prices";

const SHOCK_PCT = -0.15;

// Ord och fraser som tyder på emotionellt motiv (FOMO, panic selling).
const PANIC_KEYWORDS = [
  "rädd",
  "raed",
  "panik",
  "kris",
  "krasch",
  "går ner",
  "går ned",
  "gar ner",
  "gar ned",
  "förlust",
  "forlust",
  "magkänsla",
  "magkansla",
  "alla säljer",
  "alla saljer",
  "jag tror",
  "känns",
  "kanns",
  "behöver pengar",
  "behover pengar",
  "twitter",
  "reddit",
  "tiktok",
];

// Ord som tyder på rationellt motiv (verksamhetsproblem).
const VALID_KEYWORDS = [
  "verksamhet",
  "fundamenta",
  "ledning",
  "vinst",
  "konkurrens",
  "regulator",
  "rebalans",
  "kärna",
  "karna",
  "krydda",
  "fel allokering",
  "behöver pengar för mål",
  "behover pengar for mal",
  "mål",
  "mal ",
];

type Verdict = "accepted" | "blocked" | "weak";

function evaluateReason(reason: string): { verdict: Verdict; hit?: string } {
  const lower = reason.toLowerCase();
  for (const kw of PANIC_KEYWORDS) {
    if (lower.includes(kw)) return { verdict: "blocked", hit: kw };
  }
  if (reason.trim().length < 20) {
    return { verdict: "weak" };
  }
  for (const kw of VALID_KEYWORDS) {
    if (lower.includes(kw)) return { verdict: "accepted", hit: kw };
  }
  return { verdict: "weak" };
}

export function StressTestSection({
  portfolio,
  instruments,
  embedded = false,
}: {
  portfolio: Portfolio;
  instruments: Instrument[];
  embedded?: boolean;
}) {
  const byTicker = useMemo(
    () => new Map(instruments.map((i) => [i.ticker, i])),
    [instruments],
  );

  const stockPositions = portfolio.positions
    .map((pos) => ({ pos, inst: byTicker.get(pos.ticker) }))
    .filter((x) => x.inst && x.inst.type === "stock");

  const [selectedTicker, setSelectedTicker] = useState<string>(
    stockPositions[0]?.pos.ticker ?? "",
  );
  const [reason, setReason] = useState<string>("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [hitKeyword, setHitKeyword] = useState<string | undefined>();

  const selected = stockPositions.find((x) => x.pos.ticker === selectedTicker);

  const currentValue =
    selected && selected.inst
      ? selected.inst.currentPrice * selected.pos.shares
      : 0;
  const shockedValue = currentValue * (1 + SHOCK_PCT);
  const lossKr = shockedValue - currentValue;

  const handleEvaluate = () => {
    if (!reason.trim()) {
      setVerdict("weak");
      setHitKeyword(undefined);
      return;
    }
    const e = evaluateReason(reason);
    setVerdict(e.verdict);
    setHitKeyword(e.hit);
  };

  const hasStocks = stockPositions.length > 0;

  return (
    <section className="mt-12">
      {!embedded && (
        <>
        <h2 className="text-xl font-semibold text-neutral-900">Stresstest</h2>
      <p className="mt-1 text-sm leading-relaxed text-neutral-500">
        Träna på att <strong>inte sälja på fel ställe</strong> (lektion 9). Vi
        simulerar ett rapportras på {formatPct(SHOCK_PCT * 100, 0)} på en av
        dina aktier. Innan du säljer måste du skriva en motivering — och
        simulatorn vägrar säljordern om den låter som rädsla eller panik. Den
        enda giltiga säljanledningen är att bolagets <em>verksamhet</em> har
        försämrats fundamentalt.
      </p>
        </>
      )}

      {!hasStocks && (
        <p className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
          Köp någon aktie först — fonder kan inte rapport-rasa på samma sätt.
        </p>
      )}

      {hasStocks && (
        <>
          <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
            <label className="flex flex-col gap-1 text-xs text-neutral-600">
              <span>Välj en aktie att stress-testa</span>
              <select
                value={selectedTicker}
                onChange={(e) => {
                  setSelectedTicker(e.target.value);
                  setVerdict(null);
                  setReason("");
                }}
                className="rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-sm text-neutral-900 focus:border-primary focus:outline-none"
              >
                {stockPositions.map(({ pos, inst }) => (
                  <option key={pos.ticker} value={pos.ticker}>
                    {inst?.name} — {pos.shares} st (
                    {formatKr(
                      (inst?.currentPrice ?? 0) * pos.shares,
                    )}
                    )
                  </option>
                ))}
              </select>
            </label>

            {selected && (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Cell label="Värde nu" value={formatKr(Math.round(currentValue))} />
                <Cell
                  label="Efter rapportras"
                  value={formatKr(Math.round(shockedValue))}
                  tone="negative"
                />
                <Cell
                  label="Pappersförlust"
                  value={formatSignedKr(Math.round(lossKr))}
                  tone="negative"
                />
              </div>
            )}
          </div>

          <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
            <label className="flex flex-col gap-1 text-sm text-neutral-700">
              <span className="font-medium">
                Skriv en motivering till varför du vill sälja
              </span>
              <span className="text-xs text-neutral-500">
                Tänk: är det bolagets verksamhet som försämrats, eller är det
                dina känslor? Den enda giltiga säljanledningen är fundamenten,
                inte priset.
              </span>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setVerdict(null);
                }}
                rows={3}
                placeholder="Jag säljer för att..."
                className="mt-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-primary focus:outline-none"
              />
            </label>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleEvaluate}
                disabled={!reason.trim()}
                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                Pröva säljordern
              </button>
              {verdict === "accepted" && (
                <p className="text-sm text-primary-dark">
                  ✓ Godkänd motivering. Du har gjort en rationell bedömning —
                  i den verkliga simulatorn skulle försäljningen gå igenom här.
                </p>
              )}
              {verdict === "blocked" && (
                <p className="text-sm text-red-700">
                  ✗ Vägrad. Din motivering innehåller {hitKeyword ? `"${hitKeyword}"` : "panik-signaler"} —
                  det är reptilhjärnan som pratar. Vänta 24 timmar och skriv om
                  motiveringen baserad på <em>bolagets verksamhet</em>.
                </p>
              )}
              {verdict === "weak" && (
                <p className="text-sm text-amber-700">
                  ? För kort eller otydlig motivering. Förklara vad{" "}
                  <em>i bolagets verksamhet</em> som ändrats — eller låt bli att
                  sälja.
                </p>
              )}
            </div>
          </div>
        </>
      )}

      <p className="mt-3 text-xs leading-relaxed text-neutral-500">
        Detta är pedagogiskt — i simulatorn rörs ingen aktie. Poängen är att
        träna magkänslan: <strong>när det skriker i kroppen att du måste sälja,
        är det nästan alltid fel tillfälle.</strong> Skriv ner ditt eget
        kris-svar i lektion 10:s IPS.
      </p>
    </section>
  );
}

function Cell({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-neutral-500">
        {label}
      </div>
      <div
        className={cn(
          "mt-1 text-xl font-semibold tabular-nums",
          tone === "positive" && "text-primary-dark",
          tone === "negative" && "text-red-600",
          tone === "neutral" && "text-neutral-900",
        )}
      >
        {value}
      </div>
    </div>
  );
}
