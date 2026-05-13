"use client";

export function OwnershipMeter({
  ownership,
  voteShare,
}: {
  ownership: number;
  voteShare: number;
}) {
  return (
    <div className="space-y-3">
      <Bar
        label="Ägande"
        value={ownership}
        helper={
          ownership >= 51
            ? "Du är fortfarande majoritetsägare."
            : "Du är inte längre majoritetsägare."
        }
        good={ownership >= 51}
      />
      <Bar
        label="Röststyrka"
        value={voteShare}
        helper={
          voteShare >= 51
            ? "Du har röstmajoritet på stämman."
            : "Andra kan rösta över dig på stämman."
        }
        good={voteShare >= 51}
      />
    </div>
  );
}

function Bar({
  label,
  value,
  helper,
  good,
}: {
  label: string;
  value: number;
  helper: string;
  good: boolean;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const color = good ? "var(--spel-mint)" : "var(--spel-gold-dark)";
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-semibold uppercase tracking-wider text-[var(--spel-ink-muted)]">
          {label}
        </span>
        <span
          className="text-sm font-bold tabular-nums"
          style={{ color }}
        >
          {pct.toFixed(0)} %
        </span>
      </div>
      <div
        className="relative mt-1 h-2.5 overflow-hidden rounded-full"
        style={{ background: "#eadcc1" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: color,
            transition: "width 700ms ease-out, background 200ms",
          }}
        />
        <div
          className="absolute top-0 h-full"
          style={{
            left: "51%",
            width: "1px",
            background: "var(--spel-ink)",
            opacity: 0.35,
          }}
          aria-hidden
        />
      </div>
      <div className="mt-1 text-[11px] text-[var(--spel-ink-muted)]">{helper}</div>
    </div>
  );
}
