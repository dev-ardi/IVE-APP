import { cn } from "@/lib/utils";

// ── Base shimmer skeleton block ──────────────────────────────────────────────
interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

import React from "react";

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      style={style}
      className={cn(
        "animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60",
        className
      )}
    />
  );
}

// ── Lesson card skeleton ──────────────────────────────────────────────────────
export function LessonCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border-2 border-stone-200 bg-[#FCFAF6] p-4 shadow-sm dark:border-stone-800 dark:bg-[#191B20]">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-4/5" />
      <div className="mt-1 flex items-center gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="mt-1 h-9 w-full rounded-xl" />
    </div>
  );
}

// ── Lesson card grid skeleton ─────────────────────────────────────────────────
export function LessonGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <LessonCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ── Subject filter chips skeleton ─────────────────────────────────────────────
export function SubjectFilterSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-8 rounded-full" style={{ width: `${60 + i * 12}px` }} />
      ))}
    </div>
  );
}

// ── Page header skeleton ──────────────────────────────────────────────────────
export function PageHeaderSkeleton({ withSubtitle = true }: { withSubtitle?: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-10 w-3/4 sm:w-1/2" />
      {withSubtitle && (
        <>
          <Skeleton className="h-4 w-full max-w-lg" />
          <Skeleton className="h-4 w-4/5 max-w-md" />
        </>
      )}
    </div>
  );
}

// ── Lab experiment card skeleton ──────────────────────────────────────────────
export function ExperimentCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border-2 border-stone-200 bg-[#FCFAF6] p-5 dark:border-stone-800 dark:bg-[#191B20]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3.5 w-16 rounded-full" />
            <Skeleton className="h-5 w-44" />
          </div>
        </div>
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-5/6" />
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}

// ── Lesson content skeleton (for /learn/* pages) ──────────────────────────────
export function LessonContentSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      {/* breadcrumb */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3.5 w-28" />
      </div>
      {/* heading */}
      <Skeleton className="h-10 w-5/6" />
      <Skeleton className="h-5 w-2/3" />
      {/* meta row */}
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      {/* content blocks */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2.5">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-11/12" />
          <Skeleton className="h-3.5 w-4/5" />
        </div>
      ))}
      {/* interactive block placeholder */}
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );
}

// ── My Learning page skeleton ─────────────────────────────────────────────────
export function MyLearningSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-3 py-10 sm:px-6 sm:py-14">
      <PageHeaderSkeleton />
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-2xl border-2 border-stone-200 p-4 dark:border-stone-800">
            <Skeleton className="h-7 w-12" />
            <Skeleton className="h-3.5 w-24" />
          </div>
        ))}
      </div>
      {/* Favorites */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-40" />
        <LessonGridSkeleton count={3} />
      </div>
    </div>
  );
}

// ── Search page skeleton ──────────────────────────────────────────────────────
export function SearchPageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-3 py-10 sm:px-6 sm:py-14">
      <PageHeaderSkeleton />
      <Skeleton className="h-12 w-full max-w-xl rounded-2xl" />
      <LessonGridSkeleton count={6} />
    </div>
  );
}
