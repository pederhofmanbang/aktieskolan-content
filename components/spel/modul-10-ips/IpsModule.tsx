"use client";

import { useMemo, useState } from "react";

import { LessonNote } from "../shared/LessonNote";
import { Verdict } from "../shared/Verdict";

export type IpsCard = {
  id: string;
  label: string;
  good: boolean;
  effect: Record<string, number>;
  rationale: string;
};

export type IpsData = {
  pickCount: number;
  startCapital: number;
  monthlySaveDefault: number;
  years: number;
  cards: IpsCard[];
  crises: { year: number; label: string; drop: number }[];
};

function fmt(n: number) {
  return n.toLocaleString("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  });
}

export function IpsModule({ data }: { data: IpsData }) {
  const [picks, setPicks] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  function toggle(id: string) {
    if (done) return;
    setPicks((p) => {
      if (p.includes(id)) return p.filter((x) => x !== id);
      if (p.length >= data.pickCount) return p;
      return [...p, id];
    });
  }

  function restart() {
    setPicks([]);
    setDone(false);
  }

  const simulation = useMemo(() => {
    if (!done) return null;
    const pickedCards = picks
      .map((id) => data.cards.find((c) => c.id === id))
      .filter((c): c is IpsCard => !!c);
    let monthlySave = 0;
    let baseReturn = 0.07;
    let crisisDamageMod = 1;
    let extraReturn = 0;
    let crashRisk = 0;
    let volBoost = 0;
    for (const c of pickedCards) {
      const e = c.effect;
      if (e.monthlySave) monthlySave += e.monthlySave;
      if (e.baseReturnBoost) baseReturn += e.baseReturnBoost;
      if (e.extraReturn) extraReturn += e.extraReturn;
      if (e.taxEfficiency) extraReturn += e.taxEfficiency;
      if (e.crisisLoss !== undefined) crisisDamageMod *= 1 + e.crisisLoss;
      if (e.crashRisk) crashRisk += e.crashRisk;
      if (e.volBoost) volBoost += e.volBoost;
    }
    if (monthlySave === 0) monthlySave = data.monthlySaveDefault;
    crisisDamageMod = Math.max(0.2, crisisDamageMod);
    let value = data.startCapital;
    const yearly: { year: number; value: number; label?: string }[] = [
      { year: 0, value: data.startCapital },
    ];
    const events: string[] = [];
    for (let y = 1; y <= data.years; y++) {
      const annualSave = monthlySave * 12;
      value = value * (1 + baseReturn + extraReturn) + annualSave;
      const crisis = data.crises.find((c) => c.year === y);
      let crisisLabel: string | undefined;
      if (crisis) {
        const damage = crisis.drop * crisisDamageMod;
        value = value * (1 - damage);
        crisisLabel = `${crisis.label} −${(damage * 100).toFixed(0)} %`;
        events.push(crisisLabel);
      }
      if (crashRisk > 0 && Math.random() < crashRisk / data.years) {
        value = value * 0.5;
        events.push(`År ${y}: Småbolagskrasch −50 %`);
      }
      yearly.push({ year: y, value, label: crisisLabel });
    }
    return { yearly, end: value, events };
  }, [done, picks, data]);

  if (done && simulation) {
    const won = simulation.end >= 5_000_000;
    return (
      <Verdict
        won={won}
        title={
          won
            ? `Din plan klarade 40 år: ${fmt(simulation.end)} vid 75 års ålder.`
            : `Din plan slutade på ${fmt(simulation.end)}.`
        }
        summary={
          <>
            Du valde {picks.length} regler. Slutbelopp:{" "}
            <strong>{fmt(simulation.end)}</strong>.{" "}
            {won
              ? "Du har gott om buffert för pensionen."
              : "Du klarar dig men marginalerna är tunna."}
          </>
        }
        onRestart={restart}
      >
        <div className="spel-card p-5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
            Värdets gång över 40 år
          </div>
          <div className="mt-3 flex h-48 items-end gap-[2px]">
            {simulation.yearly.map((p) => {
              const max = Math.max(...simulation.yearly.map((q) => q.value));
              const h = (p.value / max) * 100;
              return (
                <div
                  key={p.year}
                  className="flex-1 rounded-t-sm"
                  style={{
                    height: `${Math.max(2, h)}%`,
                    background: p.label
                      ? "var(--spel-red)"
                      : "var(--spel-mint)",
                  }}
                  title={`År ${p.year}: ${fmt(Math.round(p.value))}${p.label ? " · " + p.label : ""}`}
                />
              );
            })}
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-[var(--spel-ink-muted)]">
            <span>35 år</span>
            <span>55 år</span>
            <span>75 år</span>
          </div>
        </div>
        {simulation.events.length > 0 && (
          <div className="spel-card p-5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
              Kriser längs vägen
            </div>
            <ul className="mt-2 space-y-1 text-sm text-[var(--spel-ink)]">
              {simulation.events.map((e, i) => (
                <li key={i}>· {e}</li>
              ))}
            </ul>
          </div>
        )}
        <LessonNote
          title="Din plan är inte slutmålet — bara början"
          lessonSlug="10-din-egen-plan"
          lessonLabel="Tillbaka till lektion 10"
          tone={won ? "good" : "default"}
        >
          De som vinner spelet vinner inte genom att fatta många smarta beslut —
          de vinner genom att fatta få dumma. Månadsspara, globalfond, ISK,
          aldrig sälja i kris. Det räcker.
        </LessonNote>
      </Verdict>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Startkapital" value={fmt(data.startCapital)} />
        <Stat label="Tid" value={`${data.years} år`} />
        <Stat label="Valda regler" value={`${picks.length} / ${data.pickCount}`} />
      </div>

      <div className="text-sm text-[var(--spel-ink-muted)]">
        Välj {data.pickCount} regler till din plan. Vissa är goda enligt
        lektionsmanus. Andra ser kloka ut men kostar. Plocka klokt.
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {data.cards.map((c) => {
          const picked = picks.includes(c.id);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggle(c.id)}
              className={`spel-choice text-left ${picked ? "spel-choice-picked" : ""}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <div className="font-bold text-[var(--spel-ink)]">{c.label}</div>
                {picked && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: "var(--spel-red)", color: "white" }}
                  >
                    Vald
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="spel-btn-primary"
          disabled={picks.length !== data.pickCount}
          onClick={() => setDone(true)}
        >
          Starta din plan · simulera 40 år →
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="spel-card px-3 py-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
        {label}
      </div>
      <div className="mt-0.5 text-base font-bold tabular-nums text-[var(--spel-ink)]">
        {value}
      </div>
    </div>
  );
}
