"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

export type TermDef = {
  short: string;
  description: string;
  lessonSlug?: string;
  lessonLabel?: string;
};

export const TERM_DEFS: Record<string, TermDef> = {
  gav: {
    short: "GAV — genomsnittligt anskaffningsvärde",
    description:
      "Snittpris per aktie/andel du har betalat. Räknas som ditt totala inköpsbelopp delat med antal andelar.",
    lessonSlug: "01-vad-ar-en-aktie",
    lessonLabel: "Lektion 1",
  },
  isk: {
    short: "ISK — investeringssparkonto",
    description:
      "Svenskt sparkontoformat för aktier och fonder med schablonskatt: du betalar en låg årlig skatt på kapitalet över fribeloppet (300 000 kr 2026), oavsett vinst eller förlust.",
    lessonSlug: "07-isk-vs-af-vs-kf",
    lessonLabel: "Lektion 7",
  },
  schablonskatt: {
    short: "Schablonskatt",
    description:
      "Årlig skatt på ISK och KF som beräknas på kapitalet, inte vinsten. 2026: ungefär 1,065 % på kapital över 300 000 kr (statslåneräntan + 1 procentenhet × 30 %).",
    lessonSlug: "07-isk-vs-af-vs-kf",
    lessonLabel: "Lektion 7",
  },
  fribelopp: {
    short: "Fribelopp",
    description:
      "Den del av ISK-kapitalet som är skattefri. 2026 är fribeloppet 300 000 kr per person — höjt från 150 000 kr 2025.",
    lessonSlug: "07-isk-vs-af-vs-kf",
    lessonLabel: "Lektion 7",
  },
  sharpe: {
    short: "Sharpe-kvot",
    description:
      "Mått på avkastning per enhet risk. Förenklat: förväntad avkastning delat med volatilitet. Högre är bättre — en diversifierad portfölj har högre Sharpe än enstaka aktier.",
    lessonSlug: "05-risk",
    lessonLabel: "Lektion 5",
  },
  drawdown: {
    short: "Drawdown",
    description:
      "Hur mycket en investering har tappat från sin senaste topp. Max drawdown = det värsta som hänt historiskt. Säger något om smärtan du måste tåla i en krasch.",
    lessonSlug: "05-risk",
    lessonLabel: "Lektion 5",
  },
  spread: {
    short: "Spread",
    description:
      "Skillnaden mellan högsta köpkurs och lägsta säljkurs. Stor spread = svårare att handla snabbt utan att förlora pengar.",
    lessonSlug: "02-borsen-och-mr-market",
    lessonLabel: "Lektion 2",
  },
  pe: {
    short: "P/E-tal",
    description:
      "Pris delat med vinst per aktie. Hur många år tar det innan bolagets vinst betalar det du betalade? Stockholmsbörsens snitt: ~16–18.",
    lessonSlug: "08-nyckeltal",
    lessonLabel: "Lektion 8",
  },
  direktavkastning: {
    short: "Direktavkastning",
    description:
      "Årlig utdelning delat med aktiekurs. 2–4 % normalt för svenska Large Cap. Över 7 % är ofta en varningssignal (utdelningsfälla).",
    lessonSlug: "08-nyckeltal",
    lessonLabel: "Lektion 8",
  },
  soliditet: {
    short: "Soliditet",
    description:
      "Eget kapital delat med totala tillgångar. Mått på finansiell styrka. >50 % är starkt; bank/fastighet ligger ofta under 10 %.",
    lessonSlug: "08-nyckeltal",
    lessonLabel: "Lektion 8",
  },
  ipss: {
    short: "IPS — Investment Policy Statement",
    description:
      "Skriftlig investeringspolicy som du gör när du är lugn, för att läsa när du är panikslagen. Innehåller mål, allokering och regler.",
    lessonSlug: "10-din-egen-plan",
    lessonLabel: "Lektion 10",
  },
};

export function Term({
  termKey,
  children,
  className,
}: {
  termKey: keyof typeof TERM_DEFS | string;
  children: React.ReactNode;
  className?: string;
}) {
  const def = TERM_DEFS[termKey as keyof typeof TERM_DEFS];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!def) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span ref={ref} className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="cursor-help border-b border-dotted border-neutral-400 text-inherit transition-colors hover:border-neutral-700"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        {children}
      </button>
      {open && (
        <span
          role="dialog"
          className="absolute left-0 top-full z-20 mt-1 w-72 max-w-[90vw] rounded-lg border border-neutral-200 bg-white p-3 text-left text-xs leading-relaxed text-neutral-700 shadow-lg"
        >
          <span className="block text-sm font-semibold text-neutral-900">
            {def.short}
          </span>
          <span className="mt-1 block">{def.description}</span>
          {def.lessonSlug && def.lessonLabel && (
            <Link
              href={`/lektioner/${def.lessonSlug}`}
              className="mt-2 inline-block text-xs font-medium text-primary-dark hover:underline"
            >
              → Läs {def.lessonLabel.toLowerCase()}
            </Link>
          )}
        </span>
      )}
    </span>
  );
}
