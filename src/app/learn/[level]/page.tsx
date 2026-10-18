import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLevelBySlug } from "@/modules/levels/service";
import { listSubjectsByLevel as listSubjects } from "@/modules/subjects/service";
import { Card } from "@/components/products/card";
import { SectionTitle } from "@/components/products/section-title";

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
    title: levelData ? levelData.name : "Jenjang",
    description: levelData?.description ?? `Mata pelajaran untuk jenjang ${level}.`,
  };
}

export default async function LevelPage({ params }: LevelPageProps) {
  const { level } = await params;
  const levelData = await getLevelBySlug(level);
  if (!levelData) notFound();

  const subjects = await listSubjects(level);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link href="/learn" className="transition hover:text-foreground">
          Belajar
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{levelData.name}</span>
      </nav>

      <SectionTitle
        eyebrow="Jenjang"
        title={levelData.name}
        description={levelData.description ?? undefined}
      />

      {subjects.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Belum ada mata pelajaran untuk jenjang ini.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              href={`/learn/${level}/${subject.slug}`}
              title={
                subject.icon ? (
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true">{subject.icon}</span>
                    {subject.name}
                  </span>
                ) : (
                  subject.name
                )
              }
              description={subject.description}
              footer={
                <span className="text-sm text-muted-foreground">
                  {subject.lessonCount} materi
                </span>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}