/**
 * Quiz page skeleton loader.
 * Mirrors the quiz runner layout: question card + answer choices + progress bar.
 */
export default function QuizLoading() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-3 py-10 sm:px-6 sm:py-14">
      {/* Back link skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 animate-pulse rounded-full bg-stone-200/80 dark:bg-stone-800/60" />
        <div className="h-4 w-36 animate-pulse rounded-lg bg-stone-200/80 dark:bg-stone-800/60" />
      </div>

      {/* Progress bar strip */}
      <div className="rounded-2xl border-2 border-stone-200 bg-[#FCFAF6] p-4 dark:border-stone-800 dark:bg-[#191B20]">
        <div className="mb-2 flex items-center justify-between">
          <div className="h-4 w-24 animate-pulse rounded-lg bg-stone-200/80 dark:bg-stone-800/60" />
          <div className="h-4 w-16 animate-pulse rounded-lg bg-stone-200/60 dark:bg-stone-800/40" />
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-stone-200/60 dark:bg-stone-800/40">
          <div className="h-3 w-1/4 animate-pulse rounded-full bg-stone-300/80 dark:bg-stone-700/60" />
        </div>
      </div>

      {/* Question card */}
      <div className="rounded-2xl border-2 border-stone-200 bg-[#FCFAF6] p-6 dark:border-stone-800 dark:bg-[#191B20]">
        {/* Question number badge */}
        <div className="mb-4 h-6 w-24 animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
        {/* Question text */}
        <div className="flex flex-col gap-2.5">
          <div className="h-5 w-full animate-pulse rounded-lg bg-stone-200/80 dark:bg-stone-800/60" />
          <div className="h-5 w-11/12 animate-pulse rounded-lg bg-stone-200/80 dark:bg-stone-800/60" />
          <div className="h-5 w-3/4 animate-pulse rounded-lg bg-stone-200/80 dark:bg-stone-800/60" />
        </div>

        {/* Optional image placeholder */}
        <div className="mt-5 h-36 animate-pulse rounded-xl bg-stone-200/60 dark:bg-stone-800/40" />
      </div>

      {/* Answer choices */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-2xl border-2 border-stone-200 bg-[#FCFAF6] p-4 dark:border-stone-800 dark:bg-[#191B20]"
          >
            {/* Choice marker */}
            <div className="flex h-8 w-8 shrink-0 animate-pulse items-center justify-center rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
            {/* Choice text */}
            <div
              className="h-4 animate-pulse rounded-lg bg-stone-200/60 dark:bg-stone-800/40"
              style={{ width: `${[70, 55, 65, 50][i]}%` }}
            />
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <div className="h-10 w-28 animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
        <div className="h-10 w-32 animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
      </div>
    </div>
  );
}
