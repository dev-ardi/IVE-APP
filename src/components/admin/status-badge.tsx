import { ContentStatus, Difficulty } from "@prisma/client";

const statusStyles: Record<ContentStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  PUBLISHED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  ARCHIVED: "bg-destructive/10 text-destructive",
};

const statusLabels: Record<ContentStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Dipublikasikan",
  ARCHIVED: "Diarsipkan",
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

const difficultyLabels: Record<Difficulty, string> = {
  BEGINNER: "Pemula",
  INTERMEDIATE: "Menengah",
  ADVANCED: "Lanjutan",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground">
      {difficultyLabels[difficulty]}
    </span>
  );
}