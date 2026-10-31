import React from "react";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ModularCardVariant = "default" | "lg" | "soft" | "flat" | "elevated" | "none";

export interface CardFeatureItem {
  id: string;
  text: string;
  positive?: boolean;
}

export interface ModularCardProps {
  /** Unique identifier for keying or tracking */
  id?: string;
  /** Primary heading / title */
  heading?: React.ReactNode;
  /** Subheading, category, or contextual kicker */
  subheading?: React.ReactNode;
  /** Paragraph / descriptive body text */
  text?: React.ReactNode;
  /** Quantitative highlight (e.g. "3.2×", "100%", "Zero-Cost") */
  metric?: string | number;
  /** Optional custom color class for the metric (e.g. "text-emerald-700") */
  metricColor?: string;
  /** Icon component or custom ReactNode */
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  /** Background / styling for the icon container */
  iconBg?: string;
  /** Optional badge node or string */
  badge?: React.ReactNode;
  /** Feature checklist (positive vs negative items) */
  features?: CardFeatureItem[];
  /** Custom classes for the checklist container box */
  checklistClassName?: string;
  /** Card styling variant */
  variant?: ModularCardVariant;
  /** Layout orientation: "vertical" (default), "horizontal" (left text col, right side/features col), or "none" (unconstrained) */
  layout?: "vertical" | "horizontal" | "none";
  /** Optional side content slot (placed alongside the text content in horizontal mode) */
  sideContent?: React.ReactNode;
  /** Optional link destination (renders card as Link) */
  href?: string;
  /** Optional click handler (renders card as interactive element) */
  onClick?: () => void;
  /** Active / selected state for interactive cards */
  isActive?: boolean;
  /** Footer slot */
  footer?: React.ReactNode;
  /** Action slot (e.g. button or custom link) */
  action?: React.ReactNode;
  /** Semantic HTML element to render as (default: "article") */
  as?: React.ElementType;
  /** Additional custom classes for outer card wrapper */
  className?: string;
  /** Custom classes for the main text column wrapper (subheading + heading + text) */
  contentClassName?: string;
  /** Custom heading class */
  headingClassName?: string;
  /** Custom text class */
  textClassName?: string;
  /** Freeform children injected inside the card */
  children?: React.ReactNode;
}

const variantClasses: Record<ModularCardVariant, string> = {
  default: "neo-card",
  lg: "neo-card-lg",
  soft: "neo-card-soft",
  flat: "rounded-2xl border-2 border-stone-900/10 bg-white dark:border-stone-800 dark:bg-stone-900",
  elevated:
    "rounded-3xl border-2 border-stone-900 bg-white shadow-[4px_4px_0px_0px_rgba(24,24,27,0.9)] dark:border-white dark:bg-stone-900 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.7)]",
  none: "",
};

/**
 * ModularCard
 * Highly reusable, DRY base card component.
 * Renders HTML elements ONLY when the corresponding prop has a truthy value.
 *
 * Layout modes:
 * - "vertical" (default): Content stacks in a flex-col layout.
 * - "horizontal": Groups text (subheading, heading, text) in a left flex-col,
 *                 placing features / sideContent in a right column on md+ screens.
 * - "none": Leaves layout fully to the caller's `className`.
 */
export function ModularCard({
  id,
  heading,
  subheading,
  text,
  metric,
  metricColor,
  icon,
  iconBg,
  badge,
  features,
  checklistClassName,
  variant = "default",
  layout = "vertical",
  sideContent,
  href,
  onClick,
  isActive,
  footer,
  action,
  as: Tag = "article",
  className,
  contentClassName,
  headingClassName,
  textClassName,
  children,
}: ModularCardProps) {
  // Determine icon element
  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    const IconComponent = icon as React.ComponentType<{ className?: string }>;
    return <IconComponent className="h-5 w-5 shrink-0" />;
  };

  const hasTopRow = Boolean(icon || metric || badge);
  const hasTextGroup = Boolean(subheading || heading || text || children);
  const hasSideArea = Boolean((features && features.length > 0) || sideContent);

  // Top header row (icon, metric, badge)
  const topRow = hasTopRow ? (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        {icon && (
          <div
            className={cn(
              "flex items-center justify-center rounded-xl",
              iconBg ? iconBg : "text-stone-900 dark:text-white"
            )}
          >
            {renderIcon()}
          </div>
        )}
        {metric && (
          <span
            className={cn(
              "text-2xl font-black tracking-tight",
              metricColor ? metricColor : "text-stone-900 dark:text-white"
            )}
          >
            {metric}
          </span>
        )}
      </div>
      {badge && <div>{badge}</div>}
    </div>
  ) : null;

  // Main text group: Subheading + Heading + Text ALWAYS stay grouped in a vertical column!
  const textGroup = hasTextGroup ? (
    <div className={cn("flex flex-1 flex-col gap-2.5", contentClassName)}>
      {subheading && (
        <div className="font-mono text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
          {subheading}
        </div>
      )}
      {heading && (
        <h3
          className={cn(
            "text-base font-black tracking-tight text-stone-900 dark:text-white sm:text-lg",
            headingClassName
          )}
        >
          {heading}
        </h3>
      )}
      {text && (
        <p
          className={cn(
            "text-xs font-medium leading-relaxed text-stone-600 dark:text-stone-300 sm:text-sm",
            textClassName
          )}
        >
          {text}
        </p>
      )}
      {children}
    </div>
  ) : null;

  // Features / Side area
  const sideArea = hasSideArea ? (
    <>
      {features && features.length > 0 && (
        <div
          className={cn(
            "shrink-0 space-y-2.5 rounded-2xl border p-4",
            checklistClassName
          )}
        >
          <ul className="space-y-2" role="list">
            {features.map((item) => {
              const isPositive = item.positive !== false;
              return (
                <li
                  key={item.id}
                  className="flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200"
                >
                  {isPositive ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 text-rose-500 dark:text-rose-400" />
                  )}
                  <span>{item.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {sideContent}
    </>
  ) : null;

  // Assemble card body based on layout
  const cardBody = (
    <>
      {topRow}

      {layout === "horizontal" ? (
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {textGroup}
          {sideArea}
        </div>
      ) : (
        <>
          {textGroup}
          {sideArea}
        </>
      )}

      {action && <div className="pt-2">{action}</div>}

      {footer && (
        <div className="mt-auto border-t border-stone-100 pt-3 dark:border-stone-800">
          {footer}
        </div>
      )}
    </>
  );

  const baseClasses = cn(
    variantClasses[variant],
    "p-6 transition-all duration-200",
    layout !== "none" && "flex flex-col gap-3",
    isActive !== undefined &&
      (isActive
        ? "border-stone-900 bg-white shadow-[4px_4px_0px_0px_rgba(24,24,27,0.9)] dark:border-white dark:bg-stone-900"
        : "opacity-80 hover:opacity-100"),
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        id={id}
        className={cn(baseClasses, "cursor-pointer hover:-translate-y-1")}
        onClick={onClick}
      >
        {cardBody}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        id={id}
        onClick={onClick}
        className={cn(baseClasses, "cursor-pointer text-left")}
      >
        {cardBody}
      </button>
    );
  }

  return (
    <Tag id={id} className={baseClasses}>
      {cardBody}
    </Tag>
  );
}
