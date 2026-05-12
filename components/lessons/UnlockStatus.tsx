"use client";

import { useEffect, useState } from "react";

import { hasUnlock, loadPortfolio } from "@/lib/portfolio";

export function UnlockStatus({
  unlockKey = "simulator.kop_aktie",
}: {
  unlockKey?: string;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUnlocked(hasUnlock(loadPortfolio(), unlockKey));
    setHydrated(true);
  }, [unlockKey]);

  if (!hydrated) {
    return <span className="text-sm text-neutral-500">…</span>;
  }

  if (unlocked) {
    return (
      <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
        <span aria-hidden>✓</span> Uppdraget klart
      </span>
    );
  }

  return <span className="text-sm text-neutral-400">Inte gjort än</span>;
}
