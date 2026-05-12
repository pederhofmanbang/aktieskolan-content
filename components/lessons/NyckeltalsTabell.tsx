import type { ReactNode } from "react";

export function NyckeltalsTabell({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-neutral-200">
      <div className="prose prose-sm max-w-none prose-table:my-0 prose-table:w-full prose-thead:bg-neutral-50 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold prose-td:border-t prose-td:border-neutral-200 prose-td:px-4 prose-td:py-3">
        {children}
      </div>
    </div>
  );
}
