import type { ReactNode } from "react";

export function Varning({ children }: { children: ReactNode }) {
  return (
    <aside
      role="note"
      className="not-prose my-6 rounded-xl border border-amber-200 bg-amber-50 p-5 sm:p-6"
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
        <span aria-hidden>⚠</span>
        Varning
      </div>
      <div className="prose prose-neutral mt-2 max-w-none prose-p:my-2">
        {children}
      </div>
    </aside>
  );
}
