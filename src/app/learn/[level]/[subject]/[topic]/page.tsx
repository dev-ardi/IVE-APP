import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSubjectBySlug } from "@/modules/subjects/service";
import { getTopicBySlug } from "@/modules/topics/service";
import { listLessonsByTopic } from "@/modules/lessons/service";
import { Card } from "@/components/products/card";
import { DifficultyBadge } from "@/components/products/difficulty-badge";

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

  const topicData = await getTopicBySlug(subjectData.id || subject, topic);
  if (!topicData) notFound();

  const lessons = await listLessonsByTopic(topicData.id || topic);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground transition">
          Beranda
        </Link>
        <span>/</span>
        <Link href={`/learn/${level}`} className="hover:text-foreground transition">
          {subjectData.educationLevel.name}
        </Link>
        <span>/</span>
        <Link
          href={`/learn/${level}/${subject}`}
          className="hover:text-foreground transition"
        >
          {subjectData.name}
        </Link>
        <span>/</span>
        <span className="font-semibold text-foreground">{topicData.name}</span>
      </nav>

      {/* Topic Header */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-6 sm:p-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Topik Pembelajaran • {subjectData.name}
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {topicData.name}
        </h1>
        {topicData.description && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            {topicData.description}
          </p>
        )}
      </div>

      {/* Lessons in this Topic */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Pelajaran dalam Topik Ini
        </h2>

        {lessons.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            Belum ada materi untuk topik ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
              <Card
                key={lesson.id}
                href={`/learn/${level}/${subject}/${topic}/${lesson.slug}`}
                icon={subjectData.icon ?? "📖"}
                badge={
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Interaktif
                    </span>
                    <DifficultyBadge difficulty={lesson.difficulty} />
                  </div>
                }
                title={lesson.title}
                description={lesson.description}
                footer={
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>⏱️ {lesson.durationMinutes} menit</span>
                    <span className="font-semibold text-primary">Mulai Belajar →</span>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}