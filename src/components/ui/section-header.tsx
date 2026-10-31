import React from "react";
import { cn } from "@/lib/utils";

export type SectionHeaderBadgeVariant =
  | "default"
  | "blue"
  | "emerald"
  | "purple"
  | "amber"
  | "sky";

export interface SectionHeaderProps {
  /** Optional badge/pill text or node at the very top */
  badge?: React.ReactNode;
  /** Optional icon to render inside the badge */
  badgeIcon?: React.ComponentType<{ className?: string }>;
  /** Visual variant for the badge styling */
  badgeVariant?: SectionHeaderBadgeVariant;
  /** Main section heading (e.g. h2) */
  heading?: React.ReactNode;
  /** Subheading or secondary title */
  subheading?: React.ReactNode;
  /** Descriptive body text / paragraph */
  text?: React.ReactNode;
  /** Alignment: "left" | "center" | "between" (default: "left") */
  align?: "left" | "center" | "between";
  /** Optional action slot (e.g., CTA link or button placed to the right or bottom) */
  action?: React.ReactNode;
  /** Additional wrapper classes */
  className?: string;
  /** Specific classes for the heading */
  headingClassName?: string;
  /** Specific classes for the text */
  textClassName?: string;
  /** Custom children injected underneath */
  children?: React.ReactNode;
}

const badgeVariants: Record<SectionHeaderBadgeVariant, string> = {
  default:
    "border-stone-900/20 bg-stone-100 text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200",
  blue: "border-blue-600/30 bg-blue-100/80 text-blue-900 dark:border-blue-500/40 dark:bg-blue-950/70 dark:text-blue-300",
  emerald:
    "border-emerald-600/30 bg-emerald-100/80 text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-950/70 dark:text-emerald-300",
  purple:
    "border-purple-600/30 bg-purple-100/90 text-purple-900 dark:border-purple-500/40 dark:bg-purple-950/70 dark:text-purple-300",
  amber:
    "border-amber-600/30 bg-amber-100/80 text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/70 dark:text-amber-300",
  sky: "border-sky-600/30 bg-sky-100/80 text-sky-900 dark:border-sky-500/40 dark:bg-sky-950/70 dark:text-sky-300",
};

/**
 * SectionHeader
 * Reusable, semantic, DRY header component for any section.
 * Renders HTML elements ONLY when the corresponding prop is provided.
 */
export function SectionHeader({
  badge,
  badgeIcon: BadgeIcon,
  badgeVariant = "default",
  heading,
  subheading,
  text,
  align = "left",
  action,
  className,
  headingClassName,
  textClassName,
  children,
}: SectionHeaderProps) {
  const isCentered = align === "center";
  const isBetween = align === "between";

  const content = (
    <div
      className={cn(
        "flex flex-col gap-2.5",
        isCentered && "items-center text-center",
        !isCentered && "items-start text-left"
      )}
    >
      {/* 1. Optional Badge */}
      {badge && (
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full border-2 px-3.5 py-1 text-xs font-black tracking-wide shadow-xs",
            badgeVariants[badgeVariant]
          )}
        >
          {BadgeIcon && <BadgeIcon className="h-3.5 w-3.5 shrink-0" />}
          <span>{badge}</span>
        </div>
      )}

      {/* 2. Optional Subheading */}
      {subheading && (
        <span className="neo-section-label text-stone-500 dark:text-stone-400">
          {subheading}
        </span>
      )}

      {/* 3. Optional Heading */}
      {heading && (
        <h2
          className={cn(
            "text-3xl font-black tracking-tight text-stone-900 sm:text-4xl lg:text-5xl dark:text-white",
            headingClassName
          )}
        >
          {heading}
        </h2>
      )}

      {/* 4. Optional Text */}
      {text && (
        <p
          className={cn(
            "max-w-2xl text-[15.5px] font-medium leading-relaxed text-stone-600 sm:text-base dark:text-stone-300",
            textClassName
          )}
        >
          {text}
        </p>
      )}

      {children}
    </div>
  );

  if (isBetween && action) {
    return (
      <header
        className={cn(
          "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
          className
        )}
      >
        {content}
        <div className="shrink-0">{action}</div>
      </header>
    );
  }

  return (
    <header
      className={cn(
        "flex flex-col gap-4",
        isCentered && "mx-auto max-w-3xl items-center",
        className
      )}
    >
      {content}
      {action && <div>{action}</div>}
    </header>
  );
}
