import type { ReactNode } from "react";

export function Faktaruta({ children }: { children: ReactNode }) {
  return (
    <aside className="not-prose my-6 rounded-xl border-l-4 border-primary bg-neutral-50 p-5 sm:p-6">
      <div className="prose prose-neutral max-w-none prose-headings:mt-0 prose-p:my-2 prose-ul:my-2">
        {children}
      </div>
    </aside>
  );
}
