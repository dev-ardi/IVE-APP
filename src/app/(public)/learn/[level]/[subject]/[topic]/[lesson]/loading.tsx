/**
 * Lesson detail skeleton loader.
 * Matches the two-column layout: main content (left) + actions sidebar (right).
 */
export default function LessonLoading() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-3 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="h-3.5 animate-pulse rounded-lg bg-stone-200/80 dark:bg-stone-800/60"
              style={{ width: `${[56, 72, 64, 80][i]}px` }}
            />
            {i < 3 && (
              <div className="h-3 w-3 animate-pulse rounded-full bg-stone-200/60 dark:bg-stone-800/40" />
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        {/* ── Main content column ── */}
        <div className="flex flex-1 flex-col gap-6">
          {/* Header card */}
          <div className="rounded-2xl border-2 border-stone-200 bg-[#FCFAF6] p-6 dark:border-stone-800 dark:bg-[#191B20]">
            {/* Subject badge + difficulty */}
            <div className="mb-4 flex items-center gap-2">
              <div className="h-6 w-20 animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
              <div className="h-6 w-16 animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
            </div>
            {/* Title */}
            <div className="mb-3 h-9 w-3/4 animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
            {/* Description */}
            <div className="flex flex-col gap-2">
              <div className="h-4 w-full animate-pulse rounded-lg bg-stone-200/60 dark:bg-stone-800/40" />
              <div className="h-4 w-5/6 animate-pulse rounded-lg bg-stone-200/60 dark:bg-stone-800/40" />
            </div>
            {/* Meta row */}
            <div className="mt-5 flex gap-4">
              <div className="h-5 w-24 animate-pulse rounded-lg bg-stone-200/60 dark:bg-stone-800/40" />
              <div className="h-5 w-20 animate-pulse rounded-lg bg-stone-200/60 dark:bg-stone-800/40" />
            </div>
          </div>

          {/* Content blocks */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border-2 border-stone-200 bg-[#FCFAF6] p-5 dark:border-stone-800 dark:bg-[#191B20]"
            >
              {/* Block heading */}
              <div
                className="mb-4 h-5 animate-pulse rounded-lg bg-stone-200/80 dark:bg-stone-800/60"
                style={{ width: `${[45, 60, 35, 55][i]}%` }}
              />
              {/* Block body lines */}
              <div className="flex flex-col gap-2.5">
                <div className="h-3.5 w-full animate-pulse rounded-lg bg-stone-200/60 dark:bg-stone-800/40" />
                <div className="h-3.5 w-11/12 animate-pulse rounded-lg bg-stone-200/60 dark:bg-stone-800/40" />
                <div className="h-3.5 w-4/5 animate-pulse rounded-lg bg-stone-200/60 dark:bg-stone-800/40" />
                {i % 2 === 0 && (
                  <div className="h-3.5 w-3/4 animate-pulse rounded-lg bg-stone-200/60 dark:bg-stone-800/40" />
                )}
              </div>
              {/* Interactive / image placeholder */}
              {i === 1 && (
                <div className="mt-4 h-40 animate-pulse rounded-xl bg-stone-200/60 dark:bg-stone-800/40" />
              )}
            </div>
          ))}

          {/* Sources skeleton */}
          <div className="rounded-2xl border-2 border-stone-200 bg-[#FCFAF6] p-5 dark:border-stone-800 dark:bg-[#191B20]">
            <div className="mb-3 h-5 w-28 animate-pulse rounded-lg bg-stone-200/80 dark:bg-stone-800/60" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="mt-2 flex flex-col gap-1.5">
                <div className="h-4 w-2/3 animate-pulse rounded-lg bg-stone-200/60 dark:bg-stone-800/40" />
                <div className="h-3.5 w-1/3 animate-pulse rounded-lg bg-stone-200/60 dark:bg-stone-800/40" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Sidebar column ── */}
        <div className="flex flex-col gap-4 lg:w-72 xl:w-80">
          {/* Progress / actions card */}
          <div className="rounded-2xl border-2 border-stone-200 bg-[#FCFAF6] p-5 dark:border-stone-800 dark:bg-[#191B20]">
            <div className="mb-4 h-5 w-32 animate-pulse rounded-lg bg-stone-200/80 dark:bg-stone-800/60" />
            <div className="mb-3 h-2.5 w-full animate-pulse rounded-full bg-stone-200/60 dark:bg-stone-800/40" />
            <div className="flex flex-col gap-2">
              <div className="h-10 w-full animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-stone-200/60 dark:bg-stone-800/40" />
            </div>
          </div>

          {/* Related lessons */}
          <div className="rounded-2xl border-2 border-stone-200 bg-[#FCFAF6] p-5 dark:border-stone-800 dark:bg-[#191B20]">
            <div className="mb-3 h-5 w-36 animate-pulse rounded-lg bg-stone-200/80 dark:bg-stone-800/60" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="mt-3 flex flex-col gap-1.5">
                <div className="h-4 w-full animate-pulse rounded-lg bg-stone-200/60 dark:bg-stone-800/40" />
                <div className="h-3 w-2/3 animate-pulse rounded-lg bg-stone-200/60 dark:bg-stone-800/40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
