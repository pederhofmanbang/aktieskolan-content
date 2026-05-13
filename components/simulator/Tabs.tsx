"use client";

import { cn } from "@/lib/cn";

export type TabDef = {
  id: string;
  label: string;
  icon?: string;
  badge?: number | string;
};

export function Tabs({
  tabs,
  active,
  onChange,
  variant = "primary",
}: {
  tabs: TabDef[];
  active: string;
  onChange: (id: string) => void;
  variant?: "primary" | "secondary";
}) {
  const isPrimary = variant === "primary";
  return (
    <div
      role="tablist"
      className={cn(
        "flex flex-wrap gap-1",
        isPrimary
          ? "border-b border-neutral-200"
          : "rounded-lg bg-neutral-100 p-1",
      )}
    >
      {tabs.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
              isPrimary
                ? isActive
                  ? "border-b-2 border-primary text-primary-dark -mb-px"
                  : "border-b-2 border-transparent text-neutral-600 hover:text-neutral-900"
                : isActive
                  ? "rounded-md bg-white text-neutral-900 shadow-sm"
                  : "rounded-md text-neutral-600 hover:text-neutral-900",
            )}
          >
            {t.icon && <span aria-hidden="true">{t.icon}</span>}
            <span>{t.label}</span>
            {t.badge != null && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs tabular-nums",
                  isActive
                    ? "bg-primary/20 text-primary-dark"
                    : "bg-neutral-200 text-neutral-700",
                )}
              >
                {t.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
