"use client";

export function OnboardingBanner({
  onDismiss,
  onJumpToTrade,
}: {
  onDismiss: () => void;
  onJumpToTrade: () => void;
}) {
  return (
    <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-primary-dark">
          Välkommen
        </div>
        <p className="mt-1 text-sm text-neutral-800">
          Börja som lektion 1 säger: <strong>köp Investor B för ungefär 5
          000 kr</strong>. Sök upp den, tryck på 25 %-knappen (= 25 000 kr) och
          se hur snabbvalen funkar — eller skriv ett eget belopp. Lugn, det är
          låtsaspengar.
        </p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onJumpToTrade}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Gör mitt första köp →
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full border border-neutral-200 px-3 py-2 text-xs text-neutral-600 transition-colors hover:border-neutral-400"
        >
          Stäng
        </button>
      </div>
    </div>
  );
}
