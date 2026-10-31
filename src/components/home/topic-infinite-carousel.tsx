"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Trophy,
  Flame,
  ChevronLeft,
  ChevronRight,
  Clock,
  FlaskConical,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import { SubjectIcon, getSubjectTheme } from "@/components/ui/subject-theme";
import { DifficultyBadge } from "@/components/products/difficulty-badge";
import { ModularCard } from "@/components/ui/modular-card";

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
  /** slug of the most-viewed lesson to feature above the carousel */
  topViewedSlug?: string;
}

// Static top-viewed data (will come from analytics in production)
const TOP_VIEWED = {
  slug: "gerak-parabola",
  viewCount: 3_842,
};

// ─── Featured Top Viewed Card ─────────────────────────────────────────────────

function FeaturedTopCard({ lesson }: { lesson: LessonCard }) {
  const theme = getSubjectTheme(lesson.subjectSlug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link
        href={`/learn/${lesson.levelSlug}/${lesson.subjectSlug}/${lesson.topicSlug}/${lesson.slug}`}
        className="group neo-card block p-5 sm:p-6 transition-all hover:-translate-y-1"
        aria-label={`Buka materi: ${lesson.title}`}
      >
        <div className="flex flex-col gap-4 sm:gap-5">
          {/* Top Row: Pill Badge + View Counter */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="neo-badge-top">
              <Trophy className="h-3 w-3 text-stone-900" />
              <span>Paling Banyak Dilihat</span>
              <Flame className="h-3 w-3 text-red-600" />
            </div>

            <div className="flex items-center gap-1.5 text-xs font-black text-stone-600 dark:text-stone-400">
              <Eye className="h-3.5 w-3.5" />
              <span>{TOP_VIEWED.viewCount.toLocaleString("id-ID")} tayangan</span>
            </div>
          </div>

          {/* Row below pill: Left Icon, Middle Content, Right CTA — equal height on desktop/tablet */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-5 lg:gap-6">
            {/* Left: Icon Tile (stretches to full height of the row on sm+) */}
            <div className="flex shrink-0 sm:self-stretch">
              <div
                className={`flex h-16 w-16 sm:h-auto sm:w-20 md:w-24 items-center justify-center rounded-2xl border-2 border-stone-900/15 shadow-[3px_3px_0px_0px_rgba(24,24,27,0.15)] dark:border-white/15 ${theme.iconBg}`}
              >
                <SubjectIcon slug={lesson.subjectSlug} size={36} />
              </div>
            </div>

            {/* Middle: Badges + Title + Description */}
            <div className="flex flex-1 flex-col justify-between gap-2.5">
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}
                  >
                    {lesson.subjectName}
                  </span>
                  {lesson.kind === "EXPERIMENT" && (
                    <span className="rounded-md border border-blue-300 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
                      <FlaskConical className="mr-0.5 inline h-2.5 w-2.5" />
                      Lab
                    </span>
                  )}
                  <DifficultyBadge difficulty={lesson.difficulty} />
                </div>

                <h3 className="text-lg font-black tracking-tight text-stone-900 transition-colors group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400 sm:text-xl">
                  {lesson.title}
                </h3>
              </div>

              <p className="line-clamp-2 text-sm font-medium leading-relaxed text-stone-600 dark:text-stone-300">
                {lesson.description}
              </p>
            </div>

            {/* Right: Duration + CTA button (stretches to full height, pinning duration top and CTA bottom) */}
            <div className="flex shrink-0 flex-row items-center justify-between pt-3 border-t border-stone-200/80 dark:border-stone-800 sm:flex-col sm:items-end sm:justify-between sm:border-0 sm:pt-0 sm:self-stretch">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600 dark:text-stone-400">
                <Clock className="h-3.5 w-3.5 text-stone-500" />
                <span>{lesson.durationMinutes} menit</span>
              </div>

              <span className="neo-btn-ghost py-2 text-xs">
                Pelajari Sekarang
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Carousel Card ────────────────────────────────────────────────────────────

function CarouselCard({ lesson, idx }: { lesson: LessonCard; idx: number }) {
  const theme = getSubjectTheme(lesson.subjectSlug);

  return (
    <motion.div
      data-card
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: Math.min(idx * 0.06, 0.3) }}
      className="relative shrink-0 w-[260px] sm:w-[300px] md:w-[320px]"
      role="listitem"
    >
      <ModularCard
        id={lesson.slug}
        variant="default"
        href={`/learn/${lesson.levelSlug}/${lesson.subjectSlug}/${lesson.topicSlug}/${lesson.slug}`}
        icon={
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 border-stone-900/10 ${theme.iconBg}`}
          >
            <SubjectIcon slug={lesson.subjectSlug} size={20} />
          </div>
        }
        badge={
          <div className="flex items-center gap-1.5">
            {lesson.kind === "EXPERIMENT" && (
              <span className="rounded-md border border-blue-300 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
                Lab
              </span>
            )}
            <DifficultyBadge difficulty={lesson.difficulty} />
          </div>
        }
        heading={lesson.title}
        text={lesson.description}
        className="h-full p-5 gap-3 group"
        headingClassName="line-clamp-2 text-sm font-black transition-colors group-hover:text-blue-700 dark:group-hover:text-blue-400"
        textClassName="line-clamp-2 text-xs font-medium text-stone-600 dark:text-stone-400"
        footer={
          <div className="flex items-center justify-between text-xs font-semibold">
            <span
              className={`rounded-md border px-2 py-0.5 ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}
            >
              {lesson.subjectName}
            </span>
            <span className="text-stone-500 dark:text-stone-400">
              <Clock className="mr-0.5 inline h-3 w-3" />
              {lesson.durationMinutes} mnt
            </span>
          </div>
        }
      />
    </motion.div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function TopicInfiniteCarousel({ lessons, topViewedSlug }: TopicCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pinSlug = topViewedSlug ?? TOP_VIEWED.slug;
  const topLesson = lessons.find((l) => l.slug === pinSlug) ?? lessons[0];
  // Carousel shows ALL lessons (including the top viewed one)
  const carouselLessons = lessons;

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  // Auto-scroll every 3.5s
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    autoRef.current = setInterval(() => {
      if (isPaused) return;
      const cardW = el.querySelector("[data-card]")?.clientWidth ?? 260;
      const gap = 20;
      const next = el.scrollLeft + cardW + gap;
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
    const cardW = el.querySelector("[data-card]")?.clientWidth ?? 260;
    el.scrollBy({ left: dir === "right" ? cardW + 20 : -(cardW + 20), behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* ── Section header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="neo-section-label text-blue-700 dark:text-blue-400">
            MATERI TERPOPULER
          </span>
          <h2 className="text-2xl font-black tracking-tight text-stone-900 sm:text-3xl lg:text-4xl dark:text-white">
            Pilih Topik &amp; Mulai Bereksperimen
          </h2>
        </div>
        <Link href="/explore" className="neo-btn-ghost self-start py-2 text-xs sm:self-auto">
          <span>Lihat Semua</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* ── Featured Top Viewed Card ───────────────────────────────── */}
      {topLesson && <FeaturedTopCard lesson={topLesson} />}

      {/* ── Carousel ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {/* Carousel controls row */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
            Semua Materi
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="neo-btn-icon"
              aria-label="Geser kiri"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="neo-btn-icon"
              aria-label="Geser kanan"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Track */}
        <div
          ref={trackRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex gap-5 overflow-x-auto scroll-smooth py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="list"
          aria-label="Daftar topik materi"
        >
          {carouselLessons.map((lesson, idx) => (
            <CarouselCard key={lesson.slug} lesson={lesson} idx={idx} />
          ))}
        </div>

        <p className="text-center text-[11px] font-medium text-stone-500 dark:text-stone-500">
          Geser untuk melihat semua topik •{" "}
          <Link href="/explore" className="text-blue-600 underline dark:text-blue-400">
            atau buka katalog lengkap
          </Link>
        </p>
      </div>
    </div>
  );
}
