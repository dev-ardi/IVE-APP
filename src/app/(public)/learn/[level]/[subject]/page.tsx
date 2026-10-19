import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowRight, BookOpen, Layers } from "lucide-react";
import { getSubjectBySlug } from "@/modules/subjects/service";
import { listTopicsBySubject } from "@/modules/topics/service";
import { listLessonsBySubject } from "@/modules/lessons/service";
import { Card } from "@/components/products/card";
import { DifficultyBadge } from "@/components/products/difficulty-badge";
import { getSubjectTheme, SubjectIcon } from "@/components/ui/subject-theme";

export const dynamic = "force-dynamic";

interface SubjectPageProps {
  params: Promise<{ level: string; subject: string }>;
}

export async function generateMetadata({
  params,
}: SubjectPageProps): Promise<Metadata> {
  const { level, subject } = await params;
  const subjectData = await getSubjectBySlug(level, subject);
  return {
    title: subjectData ? `${subjectData.name} — IVE-APP` : "Mata Pelajaran",
    description: subjectData?.description ?? `Materi untuk mata pelajaran ${subject}.`,
  };
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { level, subject } = await params;
  const subjectData = await getSubjectBySlug(level, subject);
  if (!subjectData) notFound();

  const subjectKey = subjectData.slug || subjectData.id || subject;
  const [topics, lessons] = await Promise.all([
    listTopicsBySubject(subjectKey),
    listLessonsBySubject(subjectKey),
  ]);

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
          <span className="font-extrabold text-stone-900 dark:text-white">{subjectData.name}</span>
        </nav>

        {/* Subject Header Card */}
        <div
          className={`flex flex-col gap-4 rounded-3xl border-2 ${theme.cardBorder} ${theme.cardBg} p-6 ${theme.shadowColor} sm:p-8`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 ${theme.badgeBorder} ${theme.iconBg} shadow-2xs`}
              >
                <SubjectIcon slug={subject} size={32} />
              </div>
              <div>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-black ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                  Mata Pelajaran • {subjectData.educationLevel.name}
                </span>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-stone-900 sm:text-4xl dark:text-white">
                  {subjectData.name}
                </h1>
              </div>
            </div>

            <span className={`hidden sm:inline-flex rounded-full border px-3 py-1 text-xs font-bold ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
              {topics.length} Topik • {lessons.length} Materi
            </span>
          </div>

          {subjectData.description && (
            <p className="max-w-3xl text-sm font-medium leading-relaxed text-stone-700 sm:text-base dark:text-stone-300">
              {subjectData.description}
            </p>
          )}
        </div>

        {topics.length === 0 && lessons.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-stone-300 bg-white/60 p-12 text-center text-sm font-medium text-stone-600 dark:border-stone-700 dark:bg-stone-900/60 dark:text-stone-400">
            Belum ada materi untuk mata pelajaran ini.
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {/* Topics List */}
            {topics.length > 0 && (
              <section className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-stone-700 dark:text-stone-300" />
                  <h2 className="text-xl font-black tracking-tight text-stone-900 dark:text-white">
                    Pilih Topik Pembahasan
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {topics.map((topic) => (
                    <Card
                      key={topic.id}
                      href={`/learn/${level}/${subject}/${topic.slug}`}
                      title={topic.name}
                      description={topic.description}
                      footer={
                        <div className="flex items-center justify-between text-xs font-bold text-stone-600 dark:text-stone-400">
                          <span className={`rounded-md border px-2 py-0.5 ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                            {topic.lessonCount} materi
                          </span>
                          <span className="flex items-center gap-1 text-stone-900 hover:underline dark:text-white">
                            <span>Buka Topik</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      }
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Lessons List */}
            {lessons.length > 0 && (
              <section className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-stone-700 dark:text-stone-300" />
                  <h2 className="text-xl font-black tracking-tight text-stone-900 dark:text-white">
                    Semua Materi Interaktif {subjectData.name}
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {lessons.map((lesson) => {
                    const targetTopicSlug = lesson.topicSlug || (topics[0]?.slug ?? "umum");
                    return (
                      <Card
                        key={lesson.id}
                        href={`/learn/${level}/${subject}/${targetTopicSlug}/${lesson.slug}`}
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
                          <div className="flex items-center justify-between text-xs font-bold text-stone-600 dark:text-stone-400">
                            <span>⏱️ {lesson.durationMinutes ?? 15} menit</span>
                            <span className="flex items-center gap-1 text-blue-700 hover:underline dark:text-blue-400">
                              <span>Mulai Belajar</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        }
                      />
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}