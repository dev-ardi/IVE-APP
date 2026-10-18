import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSubjectBySlug } from "@/modules/subjects/service";
import { getTopicBySlug } from "@/modules/topics/service";
import { getPublishedLesson } from "@/modules/lessons/service";
import { LessonContentRenderer } from "@/modules/content/renderer";
import { DifficultyBadge } from "@/components/products/difficulty-badge";

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
    title: lessonData ? lessonData.title : "Materi",
    description: lessonData?.description ?? undefined,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { level, subject, topic, lesson } = await params;
  const lessonData = await getPublishedLesson({
    levelSlug: level,
    subjectSlug: subject,
    topicSlug: topic,
    lessonSlug: lesson,
  });
  if (!lessonData) notFound();

  const subjectData = await getSubjectBySlug(level, subject);
  const topicData = topic ? await getTopicBySlug(subjectData?.id ?? "", topic) : null;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-12 sm:px-6 sm:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link href="/learn" className="transition hover:text-foreground">
          Belajar
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/learn/${level}`} className="transition hover:text-foreground">
          {lessonData.educationLevel.name}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/learn/${level}/${subject}`}
          className="transition hover:text-foreground"
        >
          {lessonData.subject.name}
        </Link>
        {topicData ? (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/learn/${level}/${subject}/${topic}`}
              className="transition hover:text-foreground"
            >
              {topicData.name}
            </Link>
          </>
        ) : null}
        <span className="mx-2">/</span>
        <span className="truncate text-foreground">{lessonData.title}</span>
      </nav>

      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <DifficultyBadge difficulty={lessonData.difficulty} />
          {lessonData.durationMinutes != null ? (
            <span className="text-sm text-muted-foreground">
              {lessonData.durationMinutes} menit
            </span>
          ) : null}
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {lessonData.title}
        </h1>
        {lessonData.description ? (
          <p className="text-base text-muted-foreground sm:text-lg">
            {lessonData.description}
          </p>
        ) : null}
      </header>

      <article>
        <LessonContentRenderer blocks={lessonData.content} />
      </article>
    </div>
  );
}