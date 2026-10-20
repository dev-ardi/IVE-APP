import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { listQuestionsForLesson } from "@/modules/quiz/service";
import { QuizRunner } from "@/components/quiz/quiz-runner";
import { DUMMY_DATA } from "@/data/dummy-data";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface QuizPageProps {
  params: Promise<{ lesson: string }>;
}

export async function generateMetadata({
  params,
}: QuizPageProps): Promise<Metadata> {
  const { lesson } = await params;
  const dbLesson = await prisma.lesson.findFirst({
    where: {
      OR: [{ slug: lesson }, { id: lesson }],
      status: "PUBLISHED",
    },
    select: { title: true },
  });

  if (dbLesson) {
    return {
      title: `Latihan Kuis: ${dbLesson.title} — IVE-APP`,
      description: "Uji pemahaman sains dan matematika Anda melalui soal interaktif dengan umpan balik konsep.",
    };
  }

  const dummyLesson = DUMMY_DATA.lessons.find((l) => l.slug === lesson || l.id === lesson);
  return {
    title: dummyLesson ? `Latihan Kuis: ${dummyLesson.title} — IVE-APP` : "Latihan Kuis — IVE-APP",
    description: "Uji pemahaman sains dan matematika Anda melalui soal interaktif dengan umpan balik konsep.",
  };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { lesson } = await params;

  // Find real lesson from DB
  const dbLesson = await prisma.lesson.findFirst({
    where: {
      OR: [{ slug: lesson }, { id: lesson }],
      status: "PUBLISHED",
    },
    include: {
      subject: true,
      topic: true,
      educationLevel: true,
    },
  });

  const dummyLesson = !dbLesson
    ? DUMMY_DATA.lessons.find((l) => l.slug === lesson || l.id === lesson)
    : null;

  const questions = await listQuestionsForLesson(lesson);

  if (!dbLesson && !dummyLesson && questions.length === 0) {
    notFound();
  }

  let title = "Materi Pelajaran";
  let lessonUrl = "/explore";
  let lessonSlug = lesson;

  if (dbLesson) {
    title = dbLesson.title;
    lessonSlug = dbLesson.slug;
    const levelSlug = dbLesson.educationLevel.slug || "umum";
    const topicSlug = dbLesson.topic?.slug || "umum";
    lessonUrl = `/learn/${levelSlug}/${dbLesson.subject.slug}/${topicSlug}/${dbLesson.slug}`;
  } else if (dummyLesson) {
    title = dummyLesson.title;
    lessonSlug = dummyLesson.slug;
    lessonUrl = `/learn/${dummyLesson.levelSlug}/${dummyLesson.subjectSlug}/${dummyLesson.topicSlug}/${dummyLesson.slug}`;
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-12">
      {/* Top back navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Link
          href={lessonUrl}
          className="hover:text-foreground transition flex items-center gap-1.5 font-bold"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Pelajaran:</span>
          <span className="font-extrabold text-foreground truncate max-w-md">{title}</span>
        </Link>
      </nav>

      {/* Quiz Runner */}
      <QuizRunner
        lessonSlug={lessonSlug}
        lessonTitle={title}
        lessonUrl={lessonUrl}
        questions={questions}
      />
    </div>
  );
}
