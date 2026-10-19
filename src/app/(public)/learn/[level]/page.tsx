import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLevelBySlug } from "@/modules/levels/service";
import { listSubjectsByLevel } from "@/modules/subjects/service";
import { listLessonsBySubject } from "@/modules/lessons/service";
import { Card } from "@/components/products/card";

export const dynamic = "force-dynamic";

interface LevelPageProps {
  params: Promise<{ level: string }>;
}

export async function generateMetadata({
  params,
}: LevelPageProps): Promise<Metadata> {
  const { level } = await params;
  const levelData = await getLevelBySlug(level);
  return {
    title: levelData ? `Jenjang ${levelData.name}` : "Jenjang",
    description: levelData?.description ?? `Mata pelajaran untuk jenjang ${level}.`,
  };
}

export default async function LevelPage({ params }: LevelPageProps) {
  const { level } = await params;
  const levelData = await getLevelBySlug(level);
  if (!levelData) notFound();

  const subjects = await listSubjectsByLevel(level);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition">
          Beranda
        </Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-foreground">{levelData.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-border pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Jenjang Pendidikan
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {levelData.name}
        </h1>
        {levelData.description && (
          <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
            {levelData.description}
          </p>
        )}
      </div>

      {/* Subjects Grid */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Pilih Mata Pelajaran
        </h2>

        {subjects.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada mata pelajaran untuk jenjang ini.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <Card
                key={subject.id}
                href={`/learn/${level}/${subject.slug}`}
                icon={subject.icon ?? "📚"}
                title={subject.name}
                description={subject.description}
                footer={
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-primary">
                      {subject.lessonCount} materi tersedia
                    </span>
                    <span>Buka Pelajaran →</span>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Access to Recommended Lessons */}
      <div className="flex flex-col gap-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Materi Populer di Jenjang Ini
          </h2>
          <Link href="/explore" className="text-xs font-semibold text-primary hover:underline">
            Semua Materi →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {await Promise.all(
            subjects.slice(0, 3).map(async (subj) => {
              const lessons = await listLessonsBySubject(subj.slug);
              const firstLesson = lessons[0];
              if (!firstLesson) return null;
              return (
                <Card
                  key={firstLesson.slug}
                  href={`/learn/${level}/${subj.slug}/${firstLesson.topicSlug}/${firstLesson.slug}`}
                  icon={subj.icon ?? "📖"}
                  badge={
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {subj.name}
                    </span>
                  }
                  title={firstLesson.title}
                  description={firstLesson.description}
                  footer={
                    <span className="text-xs text-muted-foreground">
                      ⏱️ {firstLesson.durationMinutes} menit
                    </span>
                  }
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}