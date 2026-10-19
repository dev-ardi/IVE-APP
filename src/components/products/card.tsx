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

export function Card({ title, description, footer, href, badge, icon, children, className }: CardProps) {
  const base =
    "group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md";

  const content = (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-start justify-between gap-2">
        {icon ? (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/80 text-xl transition-transform group-hover:scale-105">
            {icon}
          </span>
        ) : null}
        {badge ? <div>{badge}</div> : null}
      </div>

      {title ? (
        <h3 className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
      ) : null}

      {description ? (
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {description}
        </p>
      ) : null}

      {children}
      {footer ? <div className="mt-auto pt-3 border-t border-border/50">{footer}</div> : null}
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
