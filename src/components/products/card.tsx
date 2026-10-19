import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  href?: string;
  badge?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

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
  const base =
    "group relative flex flex-col justify-between rounded-3xl border-2 border-stone-900/10 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-stone-900 hover:shadow-[3.5px_3.5px_0px_0px_rgba(24,24,27,0.9)] dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-200 dark:hover:shadow-[3.5px_3.5px_0px_0px_rgba(255,255,255,0.7)] cursor-pointer";

  const content = (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        {icon ? (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-stone-900/10 bg-stone-50 transition-colors group-hover:border-stone-900/20 group-hover:bg-blue-50/60 dark:border-stone-700 dark:bg-stone-800 dark:group-hover:bg-stone-700/60 shadow-2xs">
            {icon}
          </div>
        ) : null}
        {badge ? <div className="shrink-0">{badge}</div> : null}
      </div>

      {title ? (
        <h3 className="text-base font-black tracking-tight text-stone-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
          {title}
        </h3>
      ) : null}

      {description ? (
        <p className="text-[13.5px] font-medium leading-relaxed text-stone-600 line-clamp-3 dark:text-stone-300">
          {description}
        </p>
      ) : null}

      {children}
      {footer ? (
        <div className="mt-auto border-t border-stone-100 pt-3 dark:border-stone-800">
          {footer}
        </div>
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={cn(base, className)}>
        {content}
      </Link>
    );
  }

  return <div className={cn(base, className)}>{content}</div>;
}
