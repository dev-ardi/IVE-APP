const DIFFICULTY_CONFIG: Record<string, { label: string; className: string }> = {
  BEGINNER: {
    label: "Pemula",
    className:
      "border border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  },
  INTERMEDIATE: {
    label: "Menengah",
    className:
      "border border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  },
  ADVANCED: {
    label: "Lanjutan",
    className:
      "border border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300",
  },
};

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const config = DIFFICULTY_CONFIG[difficulty] ?? DIFFICULTY_CONFIG.BEGINNER;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
