import Link from "next/link";
import {
  ArrowRight,
  FlaskConical,
  Compass,
  Sparkles,
  Zap,
  BookOpenCheck,
  Bot,
  GraduationCap,
} from "lucide-react";
import { HeroInteractivePreview } from "@/components/products/hero-interactive-preview";
import { HeroShowcase } from "@/components/products/hero-showcase";
import { Card } from "@/components/products/card";
import { DifficultyBadge } from "@/components/products/difficulty-badge";
import { listSubjectsByLevel } from "@/modules/subjects/service";
import { listAllPublishedLessons } from "@/modules/lessons/service";
import { SubjectIcon, getSubjectTheme } from "@/components/ui/subject-theme";
import { ActiveLearningWhy } from "@/components/home/active-learning-why";
import { LearningLoopPillars } from "@/components/home/learning-loop-pillars";
import { SubjectShowcaseSection } from "@/components/home/subject-showcase-section";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [subjects, featuredLessons] = await Promise.all([
    listSubjectsByLevel("umum"),
    listAllPublishedLessons(),
  ]);

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section (Left-aligned 2-Column with Parallax Interactive Teaser) */}
      <section className="relative overflow-hidden border-b-2 border-stone-900/10 bg-[#FAF9F5] pt-12 pb-20 dark:border-stone-800 dark:bg-[#121316] sm:pt-18 sm:pb-28">
        {/* Subtle geometric dot grid pattern */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(#d6d3cb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 dark:bg-[radial-gradient(#2d3139_1px,transparent_1px)] dark:opacity-30"
        />

        <div className="relative mx-auto w-full max-w-[1400px] px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
            {/* Left Column: Authoritative EdTech Headline, Value Prop & Productive CTAs */}
            <div className="flex flex-col items-start gap-6 lg:col-span-7">
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-blue-600/30 bg-blue-100/70 px-3.5 py-1 text-xs font-black tracking-wide text-blue-900 shadow-[2px_2px_0px_0px_rgba(37,99,235,0.25)] dark:border-blue-500/40 dark:bg-blue-950/70 dark:text-blue-300">
                <Sparkles className="h-3.5 w-3.5 text-blue-700 dark:text-blue-400" />
                <span>IVE-APP · PLATFORM EDUKASI SAINS & MATEMATIKA</span>
              </div>

              {/* High-Impact Left-Aligned Headline */}
              <h1 className="text-4xl font-black tracking-tight text-stone-900 sm:text-5xl lg:text-[56px] lg:leading-[1.12] dark:text-white">
                Bangun Intuisi Nyata.{" "}
                <span className="relative inline-block text-blue-700 dark:text-blue-400">
                  Eksplorasi Sains
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full text-blue-500/30 dark:text-blue-400/30"
                    height="8"
                    viewBox="0 0 100 8"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M0 7 C 20 0, 40 8, 60 2 C 80 -4, 90 7, 100 3"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      fill="none"
                    />
                  </svg>
                </span>{" "}
                Tanpa Batas Teori.
              </h1>

              {/* Clear Value Proposition */}
              <p className="max-w-2xl text-[16px] font-medium leading-relaxed text-stone-700 sm:text-lg dark:text-stone-300">
                IVE-APP menolak hafalan rumus mati. Di sini, Anda menggeser parameter gerak parabola, mengendalikan reaksi fisi nuklir, atau memutar lingkaran trigonometri secara langsung dalam lingkungan interaktif berbahasa Indonesia.
              </p>

              {/* Refined EdTech CTA Group */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/explore"
                  className="inline-flex cursor-pointer items-center gap-2.5 rounded-xl border-2 border-stone-900 bg-blue-600 px-6 py-3.5 text-sm font-black text-white shadow-[3px_3px_0px_0px_rgba(24,24,27,0.9)] transition-all hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0.5 dark:border-white dark:bg-blue-500"
                >
                  <span>Mulai Eksplorasi Konsep</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/lab"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-stone-900 bg-white px-5 py-3.5 text-sm font-bold text-stone-900 shadow-[2.5px_2.5px_0px_0px_rgba(24,24,27,0.9)] transition-all hover:-translate-y-0.5 hover:bg-stone-50 dark:border-stone-200 dark:bg-stone-900 dark:text-white"
                >
                  <FlaskConical className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  <span>Buka Lab Simulasi</span>
                </Link>
              </div>

              {/* Productivity & Trust Indicators */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 border-t border-stone-200/80 pt-5 text-xs font-bold text-stone-700 dark:border-stone-800 dark:text-stone-300">
                <div className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span>100% Interaktif Tanpa Login Wajib</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpenCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Sumber Terverifikasi & Terstruktur</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Tanya AI Kontekstual Per Materi</span>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Concept Preview Card with Parallax */}
            <div className="flex justify-center lg:col-span-5">
              <HeroInteractivePreview />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Educational & Marketing Section: "Mengapa Belajar Secara Interaktif?" (Soothing Sage/Mint) */}
      <ActiveLearningWhy />

      {/* 3. Instructional Methodology: 4 Pilar Alur Belajar IVE-APP (Soothing Lavender/Lilac) */}
      <LearningLoopPillars />

      {/* 4. Subject Showcase Section: 5 Mata Pelajaran dengan Identitas Warna Masing-masing (Soothing Cream/Chamois) */}
      <SubjectShowcaseSection subjects={subjects} />

      {/* 5. Dedicated Section: Laboratorium Simulasi Langsung (Interactive Sandboxes with clear context & urgency) */}
      <section className="relative overflow-hidden border-b-2 border-stone-900/10 bg-[#EDF2FA] py-20 dark:border-stone-800 dark:bg-[#121824]">
        <div className="relative mx-auto w-full max-w-[1400px] px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  <FlaskConical className="h-4 w-4" />
                  LABORATORIUM SIMULASI MANDIRI
                </span>
                <h2 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl dark:text-white">
                  Sentuh Variabel, Pahami Intuisi di Balik Rumus
                </h2>
              </div>
              <p className="max-w-md text-sm font-medium text-stone-600 dark:text-stone-300">
                Pilih laboratorium di bawah ini untuk menguji bagaimana perubahan satu variabel memicu respon fisik dan matematis secara instan.
              </p>
            </div>

            <HeroShowcase />
          </div>
        </div>
      </section>

      {/* 6. Featured Interactive Lessons Grid (Warm Canvas) */}
      <section className="relative overflow-hidden border-b-2 border-stone-900/10 bg-[#FAF9F5] py-20 dark:border-stone-800 dark:bg-[#121316]">
        <div className="relative mx-auto w-full max-w-[1400px] px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  MATERI TERPOPULER
                </span>
                <h2 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl dark:text-white">
                  Pilih Topik & Mulai Bereksperimen
                </h2>
              </div>
              <p className="max-w-md text-sm font-medium text-stone-600 dark:text-stone-300">
                Setiap materi disusun lengkap dengan simulasi mandiri, video penjelasan konsep, rumus LaTeX, dan latihan berumpan balik.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {featuredLessons.map((lesson) => {
                const subj = subjects.find((s) => s.slug === lesson.subjectSlug);
                const subjectSlug = lesson.subjectSlug ?? "umum";
                const theme = getSubjectTheme(subjectSlug);

                return (
                  <Card
                    key={lesson.slug}
                    href={`/learn/${lesson.levelSlug}/${lesson.subjectSlug}/${lesson.topicSlug}/${lesson.slug}`}
                    icon={<SubjectIcon slug={subjectSlug} size={22} />}
                    badge={
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Interaktif
                        </span>
                        <DifficultyBadge difficulty={lesson.difficulty} />
                      </div>
                    }
                    title={lesson.title}
                    description={lesson.description}
                    footer={
                      <div className="flex items-center justify-between text-xs font-semibold text-stone-600 dark:text-stone-400">
                        <span className={`rounded-md border px-2 py-0.5 ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                          {subj?.name ?? lesson.subjectSlug}
                        </span>
                        <span>⏱️ {lesson.durationMinutes} menit</span>
                      </div>
                    }
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call to Action Banner (High contrast Neobrutalism) */}
      <section className="bg-[#FAF9F5] py-20 dark:bg-[#121316]">
        <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border-2 border-stone-900 bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 p-8 text-white shadow-[4px_4px_0px_0px_rgba(24,24,27,0.9)] dark:border-white sm:p-12">
            <div className="relative z-10 flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex flex-col gap-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 self-center rounded-full bg-white/10 px-3 py-1 text-xs font-bold tracking-wide text-white backdrop-blur-sm sm:self-start">
                  <GraduationCap className="h-4 w-4" />
                  <span>MULAI BELAJAR HARI INI</span>
                </div>
                <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                  Siap Membangun Intuisi Sains & Matematika Anda?
                </h2>
                <p className="max-w-xl text-sm font-medium text-white/90">
                  Semua materi jenjang Umum terbuka penuh dan bebas diakses. Eksplorasi konsep dari Gerak Parabola hingga Fisi Nuklir sekarang.
                </p>
              </div>

              <Link
                href="/explore"
                className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border-2 border-stone-900 bg-white px-7 py-4 text-sm font-black text-stone-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,0.9)] transition-all hover:-translate-y-0.5 hover:bg-stone-100 active:translate-y-0.5"
              >
                <Compass className="h-4 w-4 text-blue-600" />
                <span>Buka Katalog Materi</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}