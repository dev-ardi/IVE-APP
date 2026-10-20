"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Trophy,
  Flame,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { SubjectIcon, getSubjectTheme } from "@/components/ui/subject-theme";
import { DifficultyBadge } from "@/components/products/difficulty-badge";

interface LessonCard {
  slug: string;
  title: string;
  description: string;
  subjectSlug: string;
  subjectName: string;
  topicSlug: string;
  levelSlug: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  durationMinutes: number;
  kind: "LESSON" | "EXPERIMENT";
}

interface TopicCarouselProps {
  lessons: LessonCard[];
  topViewedSlug?: string; // slug of the most-viewed lesson to pin first
}

// Static "top viewed" metadata (in production this would come from analytics)
const TOP_VIEWED: { slug: string; viewCount: number } = {
  slug: "gerak-parabola",
  viewCount: 3_842,
};

export function TopicInfiniteCarousel({ lessons, topViewedSlug }: TopicCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Identify the top-viewed lesson
  const pinSlug = topViewedSlug ?? TOP_VIEWED.slug;
  const topLesson = lessons.find((l) => l.slug === pinSlug) ?? lessons[0];
  const rest = lessons.filter((l) => l.slug !== topLesson?.slug);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  // Auto-scroll by one card width every 3.5s
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    autoRef.current = setInterval(() => {
      if (isPaused) return;
      const cardW = el.querySelector("[data-card]")?.clientWidth ?? 320;
      const gap = 20;
      const next = el.scrollLeft + cardW + gap;
      // wrap around
      if (next >= el.scrollWidth - el.clientWidth - 8) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollTo({ left: next, behavior: "smooth" });
      }
    }, 3500);

    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [isPaused]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const cardW = el.querySelector("[data-card]")?.clientWidth ?? 320;
    el.scrollBy({ left: dir === "right" ? cardW + 20 : -(cardW + 20), behavior: "smooth" });
  };

  const allCards = [topLesson, ...rest].filter(Boolean) as LessonCard[];

  return (
    <div className="flex flex-col gap-6">
      {/* Section header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-400">
            MATERI TERPOPULER
          </span>
          <h2 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl dark:text-white">
            Pilih Topik &amp; Mulai Bereksperimen
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {/* Scroll controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border-2 border-stone-900 bg-white shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800"
              aria-label="Geser kiri"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border-2 border-stone-900 bg-white shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800"
              aria-label="Geser kanan"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Lihat Semua */}
          <Link
            href="/explore"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border-2 border-stone-900 bg-white px-4 py-2 text-xs font-black text-stone-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] transition hover:-translate-y-0.5 hover:bg-stone-50 dark:border-stone-200 dark:bg-stone-900 dark:text-white"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Carousel track */}
      <div
        ref={trackRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label="Daftar topik materi"
      >
        {allCards.map((lesson, idx) => {
          const theme = getSubjectTheme(lesson.subjectSlug);
          const isTopViewed = lesson.slug === pinSlug;

          return (
            <motion.div
              key={lesson.slug}
              data-card
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: Math.min(idx * 0.06, 0.3) }}
              className="relative shrink-0 w-[300px] sm:w-[320px]"
              role="listitem"
            >
              {/* TOP VIEWED badge ribbon */}
              {isTopViewed && (
                <div className="absolute -top-3 left-4 z-10 flex items-center gap-1 rounded-full border-2 border-stone-900 bg-amber-400 px-3 py-1 text-[11px] font-black text-stone-950 shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)]">
                  <Trophy className="h-3 w-3" />
                  <span>#{TOP_VIEWED.viewCount.toLocaleString("id-ID")} Dilihat</span>
                  <Flame className="h-3 w-3 text-red-600" />
                </div>
              )}

              <Link
                href={`/learn/${lesson.levelSlug}/${lesson.subjectSlug}/${lesson.topicSlug}/${lesson.slug}`}
                className={`group flex h-full flex-col gap-3 rounded-3xl border-2 border-stone-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(24,24,27,0.9)] transition-all hover:-translate-y-1 dark:border-stone-100 dark:bg-stone-900 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.7)] ${isTopViewed ? "pt-6" : ""}`}
              >
                {/* Subject icon + badge row */}
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 border-stone-900/10 ${theme.iconBg}`}>
                    <SubjectIcon slug={lesson.subjectSlug} size={20} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {lesson.kind === "EXPERIMENT" && (
                      <span className="rounded-md border border-blue-300 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
                        Lab
                      </span>
                    )}
                    <DifficultyBadge difficulty={lesson.difficulty} />
                  </div>
                </div>

                {/* Title + desc */}
                <div className="flex flex-col gap-1.5 flex-1">
                  <h3 className="line-clamp-2 text-sm font-black tracking-tight text-stone-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="line-clamp-2 text-xs font-medium leading-relaxed text-stone-600 dark:text-stone-400">
                    {lesson.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-stone-100 pt-2.5 text-xs font-semibold dark:border-stone-800">
                  <span className={`rounded-md border px-2 py-0.5 ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                    {lesson.subjectName}
                  </span>
                  <span className="text-stone-500 dark:text-stone-400">⏱ {lesson.durationMinutes} mnt</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Scroll fade hints on edges */}
      <p className="text-center text-[11px] font-medium text-stone-500 dark:text-stone-500">
        Geser untuk melihat semua topik •{" "}
        <Link href="/explore" className="text-blue-600 underline dark:text-blue-400">
          atau buka katalog lengkap
        </Link>
      </p>
    </div>
  );
}
