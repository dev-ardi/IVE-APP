import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listQuestionsForLesson } from "@/modules/quiz/service";
import { QuizRunner } from "@/components/quiz/quiz-runner";
import { DUMMY_DATA } from "@/data/dummy-data";

export const dynamic = "force-dynamic";

interface QuizPageProps {
  params: Promise<{ lesson: string }>;
}

export async function generateMetadata({
  params,
}: QuizPageProps): Promise<Metadata> {
  const { lesson } = await params;
  const dummyLesson = DUMMY_DATA.lessons.find((l) => l.slug === lesson || l.id === lesson);
  return {
    title: dummyLesson ? `Latihan Kuis: ${dummyLesson.title} — IVE-APP` : "Latihan Kuis — IVE-APP",
    description: "Uji pemahaman sains dan matematika Anda melalui soal interaktif dengan umpan balik konsep.",
  };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { lesson } = await params;

  // Find dummy lesson or published lesson
  const dummyLesson = DUMMY_DATA.lessons.find((l) => l.slug === lesson || l.id === lesson);
  const questions = await listQuestionsForLesson(lesson);

  if (!dummyLesson && questions.length === 0) {
    notFound();
  }

  const title = dummyLesson?.title ?? "Materi Pelajaran";
  const lessonUrl = dummyLesson
    ? `/learn/${dummyLesson.levelSlug}/${dummyLesson.subjectSlug}/${dummyLesson.topicSlug}/${dummyLesson.slug}`
    : "/explore";

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-12">
      {/* Top back navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href={lessonUrl} className="hover:text-foreground transition flex items-center gap-1 font-medium">
          <span>← Kembali ke Pelajaran:</span>
          <span className="font-semibold text-foreground truncate max-w-md">{title}</span>
        </Link>
      </nav>

      {/* Quiz Runner */}
      <QuizRunner
        lessonSlug={dummyLesson?.slug ?? lesson}
        lessonTitle={title}
        lessonUrl={lessonUrl}
        questions={questions}
      />
    </div>
  );
}
