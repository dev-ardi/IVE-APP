import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSubjectBySlug } from "@/modules/subjects/service";
import { listTopicsBySubject } from "@/modules/topics/service";
import { listLessonsBySubject } from "@/modules/lessons/service";
import { Card } from "@/components/products/card";
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
    title: subjectData ? `${subjectData.name} — IVE-APP` : "Mata Pelajaran",
    description: subjectData?.description ?? `Materi untuk mata pelajaran ${subject}.`,
  };
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { level, subject } = await params;
  const subjectData = await getSubjectBySlug(level, subject);
  if (!subjectData) notFound();

  const [topics, lessons] = await Promise.all([
    listTopicsBySubject(subjectData.id || subject),
    listLessonsBySubject(subjectData.id || subject),
  ]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition">
          Beranda
        </Link>
        <span>/</span>
        <Link href={`/learn/${level}`} className="hover:text-foreground transition">
          {subjectData.educationLevel.name}
        </Link>
        <span>/</span>
        <span className="font-semibold text-foreground">{subjectData.name}</span>
      </nav>

      {/* Subject Header */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
            {subjectData.icon ?? "📚"}
          </span>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Mata Pelajaran
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {subjectData.name}
            </h1>
          </div>
        </div>
        {subjectData.description && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            {subjectData.description}
          </p>
        )}
      </div>

      {topics.length === 0 && lessons.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          Belum ada materi untuk mata pelajaran ini.
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {/* Topics List */}
          {topics.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Topik Pembahasan
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topics.map((topic) => (
                  <Card
                    key={topic.id}
                    href={`/learn/${level}/${subject}/${topic.slug}`}
                    title={topic.name}
                    description={topic.description}
                    footer={
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium text-primary">
                          {topic.lessonCount} materi
                        </span>
                        <span>Buka Topik →</span>
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
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Daftar Pelajaran Interaktif
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {lessons.map((lesson) => (
                  <Card
                    key={lesson.id}
                    href={
                      lesson.topicSlug
                        ? `/learn/${level}/${subject}/${lesson.topicSlug}/${lesson.slug}`
                        : `/learn/${level}/${subject}`
                    }
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
            </section>
          )}
        </div>
      )}
    </div>
  );
}