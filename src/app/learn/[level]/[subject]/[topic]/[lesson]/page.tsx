import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Clock,
  BookOpen,
  PenTool,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { getSubjectBySlug } from "@/modules/subjects/service";
import { getTopicBySlug } from "@/modules/topics/service";
import { getPublishedLesson, listLessonsBySubject } from "@/modules/lessons/service";
import { LessonContentRenderer } from "@/modules/content/renderer";
import { DifficultyBadge } from "@/components/products/difficulty-badge";
import { LessonActions } from "@/components/lesson/lesson-actions";
import { getSessionUser } from "@/server/auth";
import { getSubjectTheme, SubjectIcon } from "@/components/ui/subject-theme";

export const dynamic = "force-dynamic";

interface LessonPageProps {
  params: Promise<{ level: string; subject: string; topic: string; lesson: string }>;
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { level, subject, topic, lesson } = await params;
  const lessonData = await getPublishedLesson({
    levelSlug: level,
    subjectSlug: subject,
    topicSlug: topic,
    lessonSlug: lesson,
  });
  return {
    title: lessonData ? `${lessonData.title} — ${lessonData.subject.name} | IVE-APP` : "Materi | IVE-APP",
    description: lessonData?.description ?? undefined,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { level, subject, topic, lesson } = await params;
  const user = await getSessionUser();

  const lessonData = await getPublishedLesson({
    levelSlug: level,
    subjectSlug: subject,
    topicSlug: topic,
    lessonSlug: lesson,
  });
  if (!lessonData) notFound();

  const subjectData = await getSubjectBySlug(level, subject);
  const topicData = topic ? await getTopicBySlug(subjectData?.id ?? subject, topic) : null;
  const siblingLessons = await listLessonsBySubject(subjectData?.id ?? subject);
  const theme = getSubjectTheme(subject);

  return (
    <div className={`min-h-screen ${theme.bgTint} pb-20 transition-colors duration-300`}>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-3 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-400">
          <Link href="/" className="transition hover:text-stone-900 dark:hover:text-white">
            Beranda
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
          <Link href={`/learn/${level}`} className="transition hover:text-stone-900 dark:hover:text-white">
            {lessonData.educationLevel.name}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
          <Link
            href={`/learn/${level}/${subject}`}
            className="inline-flex items-center gap-1 transition hover:text-stone-900 dark:hover:text-white"
          >
            <SubjectIcon slug={subject} size={14} />
            <span className="font-bold">{lessonData.subject.name}</span>
          </Link>
          {topicData ? (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
              <Link
                href={`/learn/${level}/${subject}/${topic}`}
                className="transition hover:text-stone-900 dark:hover:text-white"
              >
                {topicData.name}
              </Link>
            </>
          ) : null}
          <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
          <span className="max-w-xs truncate font-extrabold text-stone-900 dark:text-white">{lessonData.title}</span>
        </nav>

        {/* Lesson Header Card with Subject-Specific Theme & Soft Neobrutalism */}
        <header
          className={`flex flex-col gap-5 rounded-3xl border-2 ${theme.cardBorder} ${theme.cardBg} p-6 ${theme.shadowColor} sm:p-8`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                <SubjectIcon slug={subject} size={14} />
                <span>Mata Pelajaran {theme.name}</span>
              </span>

              <DifficultyBadge difficulty={lessonData.difficulty} />

              {lessonData.durationMinutes != null && (
                <span className="inline-flex items-center gap-1 rounded-full border border-stone-300 bg-white/80 px-2.5 py-0.5 text-xs font-bold text-stone-700 dark:border-stone-700 dark:bg-stone-900/80 dark:text-stone-300">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{lessonData.durationMinutes} menit</span>
                </span>
              )}
            </div>

            <LessonActions
              lessonId={lessonData.id || lessonData.slug}
              lessonTitle={lessonData.title}
              isAuthenticated={!!user}
            />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl lg:text-5xl dark:text-white">
            {lessonData.title}
          </h1>

          {lessonData.description && (
            <p className="max-w-3xl text-base font-medium leading-relaxed text-stone-700 sm:text-lg dark:text-stone-300">
              {lessonData.description}
            </p>
          )}
        </header>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* Main Content Body */}
          <article className="flex flex-col gap-10 lg:col-span-8">
            <div className="rounded-3xl border-2 border-stone-900/15 bg-[#FCFAF6] p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-10">
              <LessonContentRenderer blocks={lessonData.content} />
            </div>

            {/* Sources & Citations Section */}
            {lessonData.sources && lessonData.sources.length > 0 && (
              <section className="rounded-3xl border-2 border-stone-900/10 bg-white/70 p-6 backdrop-blur-sm dark:border-stone-800 dark:bg-stone-900/60 sm:p-7">
                <div className="mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-stone-700 dark:text-stone-300" />
                  <h2 className="text-base font-black tracking-tight text-stone-900 dark:text-white">
                    Sumber & Referensi Ilmiah Terverifikasi
                  </h2>
                </div>
                <p className="mb-4 text-xs font-medium text-stone-600 dark:text-stone-400">
                  Materi ini disusun mengacu pada rujukan pustaka ilmiah dan kurikulum sains yang dapat diverifikasi:
                </p>
                <ul className="flex flex-col gap-3">
                  {lessonData.sources.map((src, idx) => (
                    <li
                      key={idx}
                      className="flex flex-col gap-1 rounded-2xl border border-stone-200 bg-white p-4 text-xs text-stone-600 shadow-2xs dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <strong className="text-sm font-extrabold text-stone-900 dark:text-white">
                          {src.title}
                        </strong>
                        {src.year && <span className="font-mono text-xs text-stone-500">({src.year})</span>}
                      </div>
                      {src.author && <span>Penulis: {src.author}</span>}
                      {src.publisher && <span>Penerbit: {src.publisher}</span>}
                      {src.citationNote && (
                        <span className="italic text-stone-800 dark:text-stone-200">{src.citationNote}</span>
                      )}
                      {src.url && (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 self-start font-bold text-blue-700 hover:underline dark:text-blue-400"
                        >
                          <span>Tautan Rujukan Resmi</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between border-t border-stone-900/10 pt-6 dark:border-stone-800">
              <Link
                href={`/learn/${level}/${subject}`}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-stone-900/20 bg-white px-4 py-2.5 text-xs font-bold text-stone-800 shadow-2xs transition hover:border-stone-900 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Kembali ke {lessonData.subject.name}</span>
              </Link>
              <Link
                href={`/quiz/${lessonData.slug}`}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-stone-900 px-5 py-2.5 text-xs font-black shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] transition-all hover:opacity-95 active:translate-y-0.5 ${theme.accentBg}`}
              >
                <span>Mulai Latihan Kuis ({theme.name})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>

          {/* Sticky Sidebar */}
          <aside className="sticky top-24 flex flex-col gap-6 lg:col-span-4">
            {/* Practice Quiz Action Card themed to current subject */}
            <div
              className={`flex flex-col gap-4 rounded-3xl border-2 ${theme.cardBorder} ${theme.cardBg} p-6 ${theme.shadowColor}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${theme.badgeBorder} ${theme.iconBg} shadow-2xs`}
                >
                  <PenTool className={`h-5 w-5 ${theme.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-stone-900 dark:text-white">Uji Pemahaman Konsep</h3>
                  <span className={`text-[11.5px] font-bold ${theme.badgeText}`}>Latihan Interaktif {theme.name}</span>
                </div>
              </div>
              <p className="text-xs font-medium leading-relaxed text-stone-700 dark:text-stone-300">
                Uji pemahaman Anda terhadap konsep yang baru saja dipelajari melalui pertanyaan terstruktur dengan evaluasi langsung.
              </p>
              <Link
                href={`/quiz/${lessonData.slug}`}
                className={`inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border-2 border-stone-900 py-3 text-center text-xs font-black shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] transition-all hover:opacity-95 active:translate-y-0.5 ${theme.accentBg}`}
              >
                <span>Mulai Kuis Soal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Sibling / Other Lessons in Subject */}
            <div className="flex flex-col gap-3 rounded-3xl border-2 border-stone-900/10 bg-white/90 p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
              <div className="flex items-center gap-2">
                <SubjectIcon slug={subject} size={16} />
                <h3 className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Materi Lain di {lessonData.subject.name}
                </h3>
              </div>
              <div className="flex flex-col gap-2">
                {siblingLessons.map((sib) => {
                  const isActive = sib.slug === lessonData.slug;
                  return (
                    <Link
                      key={sib.slug}
                      href={
                        sib.topicSlug
                          ? `/learn/${level}/${subject}/${sib.topicSlug}/${sib.slug}`
                          : `/learn/${level}/${subject}`
                      }
                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition ${
                        isActive
                          ? `border-2 ${theme.cardBorder} ${theme.badgeBg} ${theme.badgeText}`
                          : "text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
                      }`}
                    >
                      <span className="truncate pr-2">{sib.title}</span>
                      <span className="whitespace-nowrap font-mono text-[10.5px] opacity-75">
                        {sib.durationMinutes}m
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}