import type { ReactNode } from "react";

export function Metafor({
  titel,
  children,
}: {
  titel: string;
  children: ReactNode;
}) {
  return (
    <aside className="not-prose my-8 rounded-2xl border border-primary/20 bg-primary-light p-6 sm:p-8">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-dark">
        <span aria-hidden>✦</span>
        Metafor
      </div>
      <h3 className="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl">
        {titel}
      </h3>
      <div className="prose prose-neutral mt-4 max-w-none prose-p:my-3">
        {children}
      </div>
    </aside>
  );
}
