import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSubjectBySlug } from "@/modules/subjects/service";
import { getTopicBySlug } from "@/modules/topics/service";
import { listLessonsByTopic } from "@/modules/lessons/service";
import { Card } from "@/components/products/card";
import { SectionTitle } from "@/components/products/section-title";
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
  const topicData = await getTopicBySlug(subjectData.id, topic);
  return {
    title: topicData ? topicData.name : "Topik",
    description: topicData?.description ?? `Materi untuk topik ${topic}.`,
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { level, subject, topic } = await params;
  const subjectData = await getSubjectBySlug(level, subject);
  if (!subjectData) notFound();

  const topicData = await getTopicBySlug(subjectData.id, topic);
  if (!topicData) notFound();

  const lessons = await listLessonsByTopic(topicData.id);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link href="/learn" className="transition hover:text-foreground">
          Belajar
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/learn/${level}`} className="transition hover:text-foreground">
          {subjectData.educationLevel.name}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/learn/${level}/${subject}`}
          className="transition hover:text-foreground"
        >
          {subjectData.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{topicData.name}</span>
      </nav>

      <SectionTitle
        eyebrow="Topik"
        title={topicData.name}
        description={topicData.description ?? undefined}
      />

      {lessons.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada materi untuk topik ini.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <Card
              key={lesson.id}
              href={`/learn/${level}/${subject}/${topic}/${lesson.slug}`}
              title={lesson.title}
              description={lesson.description}
              footer={
                <div className="flex items-center justify-between">
                  <DifficultyBadge difficulty={lesson.difficulty} />
                  {lesson.durationMinutes != null ? (
                    <span className="text-xs text-muted-foreground">
                      {lesson.durationMinutes} menit
                    </span>
                  ) : null}
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}