"use client";

import { useMemo, useState } from "react";

import { LessonNote } from "../shared/LessonNote";
import { Verdict } from "../shared/Verdict";

type Position = "malvakt" | "forsvar" | "mittfalt" | "anfall";

export type Player = {
  id: string;
  name: string;
  sector: string;
  position: Position;
  stability: number;
  growth: number;
};

export type Match = {
  id: string;
  label: string;
  growthWeight: number;
  stabilityWeight: number;
  techPenalty?: boolean;
};

export type LagdraftData = {
  formation: Record<Position, { label: string; slots: number; icon: string }>;
  players: Player[];
  matches: Match[];
};

const POSITIONS: Position[] = ["malvakt", "forsvar", "mittfalt", "anfall"];

export function LagdraftModule({ data }: { data: LagdraftData }) {
  const positions = POSITIONS;
  const [team, setTeam] = useState<Record<Position, string[]>>({
    malvakt: [],
    forsvar: [],
    mittfalt: [],
    anfall: [],
  });
  const [done, setDone] = useState(false);

  function togglePlayer(p: Player) {
    if (done) return;
    setTeam((t) => {
      const list = t[p.position];
      if (list.includes(p.id)) {
        return { ...t, [p.position]: list.filter((x) => x !== p.id) };
      }
      if (list.length >= data.formation[p.position].slots) return t;
      return { ...t, [p.position]: [...list, p.id] };
    });
  }

  function restart() {
    setTeam({ malvakt: [], forsvar: [], mittfalt: [], anfall: [] });
    setDone(false);
  }

  const totalPlayers = Object.values(team).reduce((a, b) => a + b.length, 0);
  const totalSlots = positions.reduce(
    (a, p) => a + data.formation[p].slots,
    0,
  );
  const ready = totalPlayers === totalSlots;

  const sectorCount = useMemo(() => {
    const sectors = new Set<string>();
    for (const p of positions) {
      for (const id of team[p]) {
        const player = data.players.find((x) => x.id === id);
        if (player) sectors.add(player.sector);
      }
    }
    return sectors.size;
  }, [team, data.players, positions]);

  const matchResults = useMemo(() => {
    if (!done) return null;
    const allSelected = positions
      .flatMap((p) => team[p])
      .map((id) => data.players.find((x) => x.id === id))
      .filter((x): x is Player => !!x);
    return data.matches.map((m) => {
      let score = 0;
      for (const p of allSelected) {
        let contribution =
          m.stabilityWeight * p.stability + m.growthWeight * p.growth;
        if (m.techPenalty && p.sector === "Tech") contribution *= 0.4;
        score += contribution;
      }
      // normalize: max score = 11 players * 1.0
      score = (score / allSelected.length) * 100;
      return { match: m, score };
    });
  }, [done, team, data.matches, data.players, positions]);

  if (done && matchResults) {
    const allWin = matchResults.every((r) => r.score >= 60);
    const avg =
      matchResults.reduce((a, b) => a + b.score, 0) / matchResults.length;
    return (
      <Verdict
        won={allWin}
        title={
          allWin
            ? "Du vann alla 3 matcher."
            : `Du vann ${matchResults.filter((r) => r.score >= 60).length} av ${matchResults.length} matcher.`
        }
        summary={
          <>
            Snittscore: <strong>{avg.toFixed(0)}</strong>. Antal sektorer i
            laget: <strong>{sectorCount}</strong>.
          </>
        }
        onRestart={restart}
      >
        <div className="space-y-3">
          {matchResults.map(({ match, score }) => (
            <div key={match.id} className="spel-card p-4">
              <div className="flex items-baseline justify-between">
                <div className="font-bold text-[var(--spel-ink)]">{match.label}</div>
                <div
                  className="text-sm font-bold tabular-nums"
                  style={{
                    color:
                      score >= 60
                        ? "var(--spel-mint-dark)"
                        : "var(--spel-red)",
                  }}
                >
                  {score.toFixed(0)} {score >= 60 ? "✓ vann" : "✗ förlorade"}
                </div>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eadcc1]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, score)}%`,
                    background:
                      score >= 60
                        ? "var(--spel-mint)"
                        : "var(--spel-red)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <LessonNote
          title="Bredd slår excellens"
          lessonSlug="06-diversifiering"
          lessonLabel="Tillbaka till lektion 6"
          tone={allWin ? "good" : "default"}
        >
          11 anfallare vinner stabila marknader och kraschar i tech-rasade. 11
          målvakter vinner kriserna men kommer aldrig högt. Ett balanserat lag
          med 5+ sektorer vinner oftast i alla tre scenarierna.
        </LessonNote>
      </Verdict>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {positions.map((p) => (
          <Stat
            key={p}
            label={data.formation[p].label}
            value={`${team[p].length} / ${data.formation[p].slots}`}
          />
        ))}
      </div>

      {positions.map((pos) => {
        const def = data.formation[pos];
        const candidates = data.players.filter((p) => p.position === pos);
        return (
          <div key={pos} className="space-y-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
              {def.icon} {def.label} — välj {def.slots}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {candidates.map((p) => {
                const picked = team[pos].includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlayer(p)}
                    className={`spel-choice text-left ${picked ? "spel-choice-picked" : ""}`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <div>
                        <div className="font-bold text-[var(--spel-ink)]">{p.name}</div>
                        <div className="text-xs text-[var(--spel-ink-muted)]">{p.sector}</div>
                      </div>
                      <div className="text-[10px] text-[var(--spel-ink-muted)]">
                        Stabilitet {Math.round(p.stability * 100)}<br />
                        Tillväxt {Math.round(p.growth * 100)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-[var(--spel-ink-muted)]">
          {totalPlayers} av {totalSlots} spelare valda · {sectorCount} sektor(er)
        </div>
        <button
          type="button"
          className="spel-btn-primary"
          disabled={!ready}
          onClick={() => setDone(true)}
        >
          Spela 3 matcher →
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
