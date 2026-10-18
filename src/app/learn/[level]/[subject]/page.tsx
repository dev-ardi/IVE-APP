import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSubjectBySlug } from "@/modules/subjects/service";
import { listTopicsBySubject } from "@/modules/topics/service";
import { listLessonsBySubject } from "@/modules/lessons/service";
import { Card } from "@/components/products/card";
import { SectionTitle } from "@/components/products/section-title";
import { DifficultyBadge } from "@/components/products/difficulty-badge";

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
    title: subjectData ? subjectData.name : "Mata Pelajaran",
    description: subjectData?.description ?? `Materi untuk mata pelajaran ${subject}.`,
  };
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { level, subject } = await params;
  const subjectData = await getSubjectBySlug(level, subject);
  if (!subjectData) notFound();

  const [topics, lessons] = await Promise.all([
    listTopicsBySubject(subjectData.id),
    listLessonsBySubject(subjectData.id),
  ]);

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
        <span className="text-foreground">{subjectData.name}</span>
      </nav>

      <SectionTitle
        eyebrow="Mata Pelajaran"
        title={subjectData.name}
        description={subjectData.description ?? undefined}
      />

      {topics.length === 0 && lessons.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Belum ada materi untuk mata pelajaran ini.
        </p>
      ) : (
        <div className="flex flex-col gap-10">
          {topics.length > 0 ? (
            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold tracking-tight">Topik</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topics.map((topic) => (
                  <Card
                    key={topic.id}
                    href={`/learn/${level}/${subject}/${topic.slug}`}
                    title={topic.name}
                    description={topic.description}
                    footer={
                      <span className="text-sm text-muted-foreground">
                        {topic.lessonCount} materi
                      </span>
                    }
                  />
                ))}
              </div>
            </section>
          ) : null}

          {lessons.length > 0 ? (
            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold tracking-tight">Materi</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {lessons.map((lesson) => (
                  <Card
                    key={lesson.id}
                    href={lesson.topicSlug
                      ? `/learn/${level}/${subject}/${lesson.topicSlug}/${lesson.slug}`
                      : `/learn/${level}/${subject}`}
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
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}