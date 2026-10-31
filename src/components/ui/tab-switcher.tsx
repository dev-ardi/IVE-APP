"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  [key: string]: unknown;
}

export interface TabSwitcherProps<T extends TabItem = TabItem> {
  items: T[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: "pill" | "button";
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

/**
 * TabSwitcher
 * Semantic, accessible, DRY tab switcher component.
 */
export function TabSwitcher<T extends TabItem = TabItem>({
  items,
  activeId,
  onChange,
  variant = "button",
  className,
  activeClassName,
  inactiveClassName,
}: TabSwitcherProps<T>) {
  if (!items || items.length === 0) return null;

  return (
    <div
      role="tablist"
      aria-label="Tab navigation"
      className={cn(
        "flex items-center gap-2 overflow-x-auto py-1",
        variant === "pill" &&
          "rounded-2xl border-2 border-stone-900/90 bg-white p-1.5 shadow-xs dark:border-stone-700 dark:bg-stone-900",
        className
      )}
    >
      {items.map((tab) => {
        const isActive = activeId === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-black transition-all",
              isActive
                ? cn(
                    "border-2 border-stone-900 bg-blue-600 text-white shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] dark:border-white",
                    activeClassName
                  )
                : cn(
                    "border-2 border-transparent text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white",
                    inactiveClassName
                  )
            )}
          >
            {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-bold text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
