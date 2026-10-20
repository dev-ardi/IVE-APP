export default function LabLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-3 py-10 sm:px-6 sm:py-14">
      {/* Hero header */}
      <div className="flex flex-col gap-4">
        <div className="h-4 w-36 animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
        <div className="h-12 w-3/4 animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
      </div>
      {/* Experiment cards grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4 rounded-2xl border-2 border-stone-200 bg-[#FCFAF6] p-5 dark:border-stone-800 dark:bg-[#191B20]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
                <div className="flex flex-col gap-2">
                  <div className="h-3.5 w-16 animate-pulse rounded-full bg-stone-200/80 dark:bg-stone-800/60" />
                  <div className="h-5 w-40 animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
                </div>
              </div>
              <div className="h-5 w-20 animate-pulse rounded-full bg-stone-200/80 dark:bg-stone-800/60" />
            </div>
            <div className="h-3.5 w-full animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
            <div className="h-3.5 w-5/6 animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
