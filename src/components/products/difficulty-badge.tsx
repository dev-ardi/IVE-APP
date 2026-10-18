const DIFFICULTY_CONFIG: Record<string, { label: string; className: string }> = {
  BEGINNER: {
    label: "Pemula",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  INTERMEDIATE: {
    label: "Menengah",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  },
  ADVANCED: {
    label: "Lanjutan",
    className: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
  },
};

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const config = DIFFICULTY_CONFIG[difficulty] ?? DIFFICULTY_CONFIG.BEGINNER;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
