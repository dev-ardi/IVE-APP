import type { ReactNode } from "react";
import { ModularCard } from "@/components/ui/modular-card";

export interface CardProps {
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  href?: string;
  badge?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/**
 * Card
 * Legacy bridge wrapper powered by ModularCard.
 * Ensures 100% unified styling and behavior across all existing views.
 */
export function Card({
  title,
  description,
  footer,
  href,
  badge,
  icon,
  children,
  className,
}: CardProps) {
  return (
    <ModularCard
      variant="default"
      href={href}
      heading={title}
      text={description}
      icon={
        icon ? (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-stone-900/10 bg-stone-50 transition-colors group-hover:border-stone-900/20 group-hover:bg-blue-50/60 dark:border-stone-700 dark:bg-stone-800 dark:group-hover:bg-stone-700/60 shadow-2xs">
            {icon}
          </div>
        ) : undefined
      }
      badge={badge}
      footer={footer}
      className={className}
      headingClassName="text-base font-black tracking-tight text-stone-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
      textClassName="text-[13.5px] font-medium leading-relaxed text-stone-600 line-clamp-3 dark:text-stone-300"
    >
      {children}
    </ModularCard>
  );
}
