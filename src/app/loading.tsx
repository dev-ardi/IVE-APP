export default function HomeLoading() {
  return (
    <div className="flex flex-col gap-16 overflow-hidden">
      {/* Hero section skeleton */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 py-20 text-center">
        <div className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto">
          <div className="h-8 w-40 animate-pulse rounded-full bg-stone-200/80 dark:bg-stone-800/60" />
          <div className="h-16 w-full animate-pulse rounded-2xl bg-stone-200/80 dark:bg-stone-800/60" />
          <div className="h-16 w-4/5 animate-pulse rounded-2xl bg-stone-200/80 dark:bg-stone-800/60" />
          <div className="h-5 w-full max-w-xl animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
          <div className="h-5 w-3/4 max-w-md animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
          <div className="flex gap-3 mt-2">
            <div className="h-12 w-40 animate-pulse rounded-2xl bg-stone-200/80 dark:bg-stone-800/60" />
            <div className="h-12 w-40 animate-pulse rounded-2xl bg-stone-200/80 dark:bg-stone-800/60" />
          </div>
        </div>
      </section>
      {/* Subject showcase skeleton */}
      <section className="mx-auto w-full max-w-[1400px] px-3 sm:px-6">
        <div className="h-8 w-56 animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60 mb-8" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4 rounded-3xl border-2 border-stone-200 p-6 dark:border-stone-800">
              <div className="h-12 w-12 animate-pulse rounded-2xl bg-stone-200/80 dark:bg-stone-800/60" />
              <div className="h-7 w-2/3 animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
              <div className="h-4 w-full animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
              <div className="h-4 w-5/6 animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
              <div className="h-48 w-full animate-pulse rounded-2xl bg-stone-200/80 dark:bg-stone-800/60" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
