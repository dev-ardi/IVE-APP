/**
 * Lab (experiment) detail skeleton loader.
 * Mirrors the lab page: hero header card + full-width interactive sandbox area.
 */
export default function LabSlugLoading() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-3 py-8 sm:px-6 sm:py-12">
      {/* Back link skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <div className="h-4 w-4 animate-pulse rounded-full bg-stone-200/80 dark:bg-stone-800/60" />
        <div className="h-4 w-32 animate-pulse rounded-lg bg-stone-200/80 dark:bg-stone-800/60" />
      </div>

      {/* Header card */}
      <div className="mb-6 rounded-2xl border-2 border-stone-200 bg-[#FCFAF6] p-6 dark:border-stone-800 dark:bg-[#191B20]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-1 flex-col gap-3">
            {/* Subject badge */}
            <div className="h-6 w-20 animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
            {/* Title */}
            <div className="h-8 w-3/4 animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
            {/* Description */}
            <div className="flex flex-col gap-2">
              <div className="h-4 w-full animate-pulse rounded-lg bg-stone-200/60 dark:bg-stone-800/40" />
              <div className="h-4 w-4/5 animate-pulse rounded-lg bg-stone-200/60 dark:bg-stone-800/40" />
            </div>
          </div>
          {/* Action button area */}
          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            <div className="h-10 w-36 animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
          </div>
        </div>
      </div>

      {/* Interactive sandbox placeholder — tall card */}
      <div className="rounded-2xl border-2 border-stone-200 bg-[#FCFAF6] dark:border-stone-800 dark:bg-[#191B20]">
        {/* Toolbar strip */}
        <div className="flex items-center gap-3 border-b-2 border-stone-200 px-5 py-3 dark:border-stone-800">
          <div className="h-4 w-4 animate-pulse rounded-full bg-stone-200/80 dark:bg-stone-800/60" />
          <div className="h-4 w-28 animate-pulse rounded-lg bg-stone-200/80 dark:bg-stone-800/60" />
          <div className="ml-auto flex gap-2">
            <div className="h-7 w-20 animate-pulse rounded-lg bg-stone-200/60 dark:bg-stone-800/40" />
            <div className="h-7 w-16 animate-pulse rounded-lg bg-stone-200/60 dark:bg-stone-800/40" />
          </div>
        </div>

        {/* Main simulation area */}
        <div className="flex flex-col gap-0 lg:flex-row">
          {/* Controls panel */}
          <div className="flex flex-col gap-5 border-b-2 border-stone-200 p-5 dark:border-stone-800 lg:w-72 lg:border-b-0 lg:border-r-2">
            <div className="h-5 w-24 animate-pulse rounded-lg bg-stone-200/80 dark:bg-stone-800/60" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-4 w-32 animate-pulse rounded-lg bg-stone-200/60 dark:bg-stone-800/40" />
                <div className="h-8 w-full animate-pulse rounded-xl bg-stone-200/60 dark:bg-stone-800/40" />
                <div className="flex justify-between">
                  <div className="h-3 w-6 animate-pulse rounded-md bg-stone-200/40 dark:bg-stone-800/30" />
                  <div className="h-3 w-8 animate-pulse rounded-md bg-stone-200/40 dark:bg-stone-800/30" />
                </div>
              </div>
            ))}
            <div className="h-10 w-full animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
          </div>

          {/* Visualization canvas */}
          <div className="relative flex-1 animate-pulse bg-stone-100/60 dark:bg-stone-900/60" style={{ minHeight: 360 }}>
            {/* Axis guides */}
            <div className="absolute bottom-8 left-8 right-8 h-px bg-stone-300/60 dark:bg-stone-700/60" />
            <div className="absolute bottom-8 left-8 top-8 w-px bg-stone-300/60 dark:bg-stone-700/60" />
            {/* Simulated arc/curve */}
            <div className="absolute left-1/4 top-1/3 h-32 w-1/2 rounded-full border-2 border-dashed border-stone-300/50 dark:border-stone-700/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
