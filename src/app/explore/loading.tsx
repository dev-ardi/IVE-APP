export default function ExploreLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-3 py-10 sm:px-6 sm:py-14">
      {/* Page header skeleton */}
      <div className="flex flex-col gap-3">
        <div className="h-4 w-32 animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
        <div className="h-10 w-2/3 animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
        <div className="h-4 w-full max-w-lg animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
        <div className="h-4 w-4/5 max-w-md animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
      </div>
      {/* Search + filter bar */}
      <div className="flex flex-wrap gap-3">
        <div className="h-10 w-full max-w-xs animate-pulse rounded-2xl bg-stone-200/80 dark:bg-stone-800/60" />
        <div className="h-10 w-28 animate-pulse rounded-2xl bg-stone-200/80 dark:bg-stone-800/60" />
        <div className="h-10 w-28 animate-pulse rounded-2xl bg-stone-200/80 dark:bg-stone-800/60" />
      </div>
      {/* Subject filter chips */}
      <div className="flex flex-wrap gap-2">
        {[72, 84, 96, 68, 100, 80].map((w, i) => (
          <div
            key={i}
            className="h-8 animate-pulse rounded-full bg-stone-200/80 dark:bg-stone-800/60"
            style={{ width: w }}
          />
        ))}
      </div>
      {/* Card grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-2xl border-2 border-stone-200 bg-[#FCFAF6] p-4 dark:border-stone-800 dark:bg-[#191B20]">
            <div className="h-5 w-2/3 animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
            <div className="h-3.5 w-full animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
            <div className="h-3.5 w-4/5 animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
            <div className="mt-1 flex gap-2">
              <div className="h-5 w-16 animate-pulse rounded-full bg-stone-200/80 dark:bg-stone-800/60" />
              <div className="h-5 w-20 animate-pulse rounded-full bg-stone-200/80 dark:bg-stone-800/60" />
            </div>
            <div className="mt-1 h-9 w-full animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
