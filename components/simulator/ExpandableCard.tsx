"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";

export function ExpandableCard({
  title,
  subtitle,
  icon,
  badge,
  defaultOpen = false,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: string;
  badge?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          {icon && (
            <span aria-hidden="true" className="text-xl">
              {icon}
            </span>
          )}
          <div>
            <div className="font-semibold text-neutral-900">{title}</div>
            {subtitle && (
              <div className="text-sm text-neutral-500">{subtitle}</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700">
              {badge}
            </span>
          )}
          <span
            aria-hidden="true"
            className={cn(
              "text-neutral-400 transition-transform",
              open && "rotate-180",
            )}
          >
            ▾
          </span>
        </div>
      </button>
      {open && (
        <div className="border-t border-neutral-100 px-5 py-5">{children}</div>
      )}
    </div>
  );
}
