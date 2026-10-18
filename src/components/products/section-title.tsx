import type { ReactNode } from "react";

interface SectionTitleProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  as?: "h1" | "h2";
}

export function SectionTitle({ eyebrow, title, description, as = "h2" }: SectionTitleProps) {
  const Tag = as;
  return (
    <div className="flex flex-col gap-2">
      {eyebrow ? (
        <span className="text-sm font-semibold uppercase tracking-wide text-primary">
          {eyebrow}
        </span>
      ) : null}
      <Tag className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</Tag>
      {description ? (
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}
