import type { ReactNode } from "react";

export function Forsoksjalv({ children }: { children: ReactNode }) {
  return (
    <aside className="not-prose my-6 rounded-2xl border border-primary/30 bg-primary-light/60 p-5 sm:p-6">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-dark">
        <span aria-hidden>→</span>
        Försök själv
      </div>
      <div className="prose prose-neutral mt-3 max-w-none prose-p:my-2">
        {children}
      </div>
    </aside>
  );
}
