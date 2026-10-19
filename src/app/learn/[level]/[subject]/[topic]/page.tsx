import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowRight, BookOpen, Clock } from "lucide-react";
import { getSubjectBySlug } from "@/modules/subjects/service";
import { getTopicBySlug } from "@/modules/topics/service";
import { listLessonsByTopic } from "@/modules/lessons/service";
import { Card } from "@/components/products/card";
import { DifficultyBadge } from "@/components/products/difficulty-badge";
import { getSubjectTheme, SubjectIcon } from "@/components/ui/subject-theme";

export const dynamic = "force-dynamic";

interface TopicPageProps {
  params: Promise<{ level: string; subject: string; topic: string }>;
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { level, subject, topic } = await params;
  const subjectData = await getSubjectBySlug(level, subject);
  if (!subjectData) return { title: "Topik" };
  const topicData = await getTopicBySlug(subjectData.id || subject, topic);
  return {
    title: topicData ? `${topicData.name} — ${subjectData.name} | IVE-APP` : "Topik",
    description: topicData?.description ?? `Materi untuk topik ${topic}.`,
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { level, subject, topic } = await params;
  const subjectData = await getSubjectBySlug(level, subject);
  if (!subjectData) notFound();

  const topicData = await getTopicBySlug(subjectData.slug || subjectData.id || subject, topic);
  if (!topicData) notFound();

  // Look up lessons by slug first, then ID
  const lessons = await listLessonsByTopic(topicData.slug || topicData.id || topic);
  const theme = getSubjectTheme(subject);

  return (
    <div className={`min-h-screen ${theme.bgTint} pb-20 transition-colors duration-300`}>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-3 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-400">
          <Link href="/" className="transition hover:text-stone-900 dark:hover:text-white">
            Beranda
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
          <Link href={`/learn/${level}`} className="transition hover:text-stone-900 dark:hover:text-white">
            {subjectData.educationLevel.name}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
          <Link
            href={`/learn/${level}/${subject}`}
            className="inline-flex items-center gap-1 transition hover:text-stone-900 dark:hover:text-white"
          >
            <SubjectIcon slug={subject} size={14} />
            <span className="font-bold">{subjectData.name}</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
          <span className="font-extrabold text-stone-900 dark:text-white">{topicData.name}</span>
        </nav>

        {/* Topic Header Card */}
        <div
          className={`flex flex-col gap-4 rounded-3xl border-2 ${theme.cardBorder} ${theme.cardBg} p-6 ${theme.shadowColor} sm:p-8`}
        >
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
              <SubjectIcon slug={subject} size={14} />
              <span>Topik Pembelajaran • {subjectData.name}</span>
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl dark:text-white">
            {topicData.name}
          </h1>

          {topicData.description && (
            <p className="max-w-3xl text-base font-medium leading-relaxed text-stone-700 dark:text-stone-300">
              {topicData.description}
            </p>
          )}
        </div>

        {/* Lessons in this Topic */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-stone-700 dark:text-stone-300" />
              <h2 className="text-xl font-black tracking-tight text-stone-900 dark:text-white">
                Pelajaran dalam Topik Ini
              </h2>
            </div>
            <span className="text-xs font-bold text-stone-600 dark:text-stone-400">
              {lessons.length} Materi Tersedia
            </span>
          </div>

          {lessons.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-stone-300 bg-white/60 p-12 text-center text-sm font-medium text-stone-600 dark:border-stone-700 dark:bg-stone-900/60 dark:text-stone-400">
              Belum ada materi untuk topik ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {lessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  href={`/learn/${level}/${subject}/${topic}/${lesson.slug}`}
                  icon={<SubjectIcon slug={subject} size={22} />}
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
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {lesson.durationMinutes} menit
                      </span>
                      <span className={`inline-flex items-center gap-1 font-bold ${theme.iconColor}`}>
                        <span>Mulai Belajar</span>
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}