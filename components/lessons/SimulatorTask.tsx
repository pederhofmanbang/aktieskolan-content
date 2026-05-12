import type { ReactNode } from "react";

export function SimulatorTask({ children }: { children: ReactNode }) {
  return (
    <section className="not-prose my-12 overflow-hidden rounded-2xl bg-neutral-900 text-white shadow-lg">
      <div className="border-b border-neutral-800 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-primary">
        Uppdrag i simulatorn
      </div>
      <div className="prose prose-invert max-w-none px-6 py-6 prose-strong:text-white prose-headings:text-white sm:px-8 sm:py-8">
        {children}
      </div>
      <div className="flex flex-col gap-3 border-t border-neutral-800 bg-neutral-950 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-sm text-neutral-300">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-neutral-600 bg-neutral-800 text-primary focus:ring-primary"
          />
          Markera som klart
        </label>
        <a
          href="/simulator"
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:bg-primary-dark hover:text-white"
        >
          Öppna simulator →
        </a>
      </div>
    </section>
  );
}
