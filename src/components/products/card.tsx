import Link from "next/link";
import type { ReactNode } from "react";

interface CardProps {
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  href?: string;
  children?: ReactNode;
  className?: string;
}

export function Card({ title, description, footer, href, children, className }: CardProps) {
  const base =
    "flex flex-col gap-2 rounded-xl border border-border bg-card p-5 transition-colors";
  const content = (
    <>
      {title ? <h3 className="font-semibold tracking-tight">{title}</h3> : null}
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      {children}
      {footer ? <div className="mt-auto pt-3">{footer}</div> : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`${base} hover:border-primary/50 hover:bg-muted/40 ${className ?? ""}`}
      >
        {content}
      </Link>
    );
  }

  return <div className={`${base} ${className ?? ""}`}>{content}</div>;
}
