import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSubjectBySlug } from "@/modules/subjects/service";
import { getTopicBySlug } from "@/modules/topics/service";
import { getPublishedLesson, listLessonsBySubject } from "@/modules/lessons/service";
import { LessonContentRenderer } from "@/modules/content/renderer";
import { DifficultyBadge } from "@/components/products/difficulty-badge";
import { LessonActions } from "@/components/lesson/lesson-actions";
import { getSessionUser } from "@/server/auth";

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
    title: lessonData ? `${lessonData.title} — ${lessonData.subject.name} | IVE-APP` : "Materi | IVE-APP",
    description: lessonData?.description ?? undefined,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { level, subject, topic, lesson } = await params;
  const user = await getSessionUser();

  const lessonData = await getPublishedLesson({
    levelSlug: level,
    subjectSlug: subject,
    topicSlug: topic,
    lessonSlug: lesson,
  });
  if (!lessonData) notFound();

  const subjectData = await getSubjectBySlug(level, subject);
  const topicData = topic ? await getTopicBySlug(subjectData?.id ?? subject, topic) : null;
  const siblingLessons = await listLessonsBySubject(subjectData?.id ?? subject);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground transition">
          Beranda
        </Link>
        <span>/</span>
        <Link href={`/learn/${level}`} className="hover:text-foreground transition">
          {lessonData.educationLevel.name}
        </Link>
        <span>/</span>
        <Link href={`/learn/${level}/${subject}`} className="hover:text-foreground transition">
          {lessonData.subject.name}
        </Link>
        {topicData ? (
          <>
            <span>/</span>
            <Link
              href={`/learn/${level}/${subject}/${topic}`}
              className="hover:text-foreground transition"
            >
              {topicData.name}
            </Link>
          </>
        ) : null}
        <span>/</span>
        <span className="font-semibold text-foreground truncate max-w-xs">{lessonData.title}</span>
      </nav>

      {/* Lesson Header Card */}
      <header className="flex flex-col gap-4 rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Eksplorasi Interaktif
            </span>
            <DifficultyBadge difficulty={lessonData.difficulty} />
            {lessonData.durationMinutes != null && (
              <span className="text-xs text-muted-foreground font-medium">
                ⏱️ {lessonData.durationMinutes} menit
              </span>
            )}
          </div>

          <LessonActions
            lessonId={lessonData.id || lessonData.slug}
            lessonTitle={lessonData.title}
            isAuthenticated={!!user}
          />
        </div>

        <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {lessonData.title}
        </h1>

        {lessonData.description && (
          <p className="text-base text-muted-foreground sm:text-lg leading-relaxed max-w-3xl">
            {lessonData.description}
          </p>
        )}
      </header>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
        {/* Main Content Body */}
        <article className="lg:col-span-8 flex flex-col gap-10">
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-xs">
            <LessonContentRenderer blocks={lessonData.content} />
          </div>

          {/* Sources & Citations Section (TAD §13, PRD FR-19) */}
          {lessonData.sources && lessonData.sources.length > 0 && (
            <section className="rounded-2xl border border-border/70 bg-muted/20 p-6 sm:p-7">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">📚</span>
                <h2 className="text-base font-bold tracking-tight text-foreground">
                  Sumber Referensi Materi
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Materi ini disusun mengacu pada rujukan pustaka dan standar kurikulum sains yang dapat diverifikasi:
              </p>
              <ul className="flex flex-col gap-3">
                {lessonData.sources.map((src, idx) => (
                  <li
                    key={idx}
                    className="flex flex-col gap-1 rounded-xl border border-border/60 bg-background p-3.5 text-xs text-muted-foreground"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <strong className="text-foreground text-sm font-semibold">
                        {src.title}
                      </strong>
                      {src.year && <span className="text-[11px] font-mono">({src.year})</span>}
                    </div>
                    {src.author && <span>Penulis: {src.author}</span>}
                    {src.publisher && <span>Penerbit: {src.publisher}</span>}
                    {src.citationNote && (
                      <span className="italic text-foreground/80">{src.citationNote}</span>
                    )}
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline self-start mt-1 font-medium"
                      >
                        Tautan Rujukan Resmi ↗
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Bottom Navigation */}
          <div className="flex items-center justify-between border-t border-border pt-6">
            <Link
              href={`/learn/${level}/${subject}`}
              className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition"
            >
              ← Kembali ke {lessonData.subject.name}
            </Link>
            <Link
              href={`/quiz/${lessonData.slug}`}
              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
            >
              Mulai Latihan Kuis →
            </Link>
          </div>
        </article>

        {/* Sticky Sidebar */}
        <aside className="lg:col-span-4 sticky top-24 flex flex-col gap-6">
          {/* Practice Quiz Action Card */}
          <div className="flex flex-col gap-4 rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
                ✍️
              </span>
              <div>
                <h3 className="text-sm font-bold text-foreground">Uji Pemahaman Konsep</h3>
                <span className="text-[11px] text-muted-foreground">Latihan Soal dengan Umpan Balik</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Uji pemahaman Anda terhadap konsep yang baru saja dipelajari melalui pertanyaan interaktif disertai evaluasi jawaban.
            </p>
            <Link
              href={`/quiz/${lessonData.slug}`}
              className="w-full rounded-xl bg-primary py-2.5 text-center text-xs font-bold text-primary-foreground shadow-xs transition hover:bg-primary/90"
            >
              Mulai Kuis Soal ({lessonData.title}) →
            </Link>
          </div>

          {/* Sibling / Other Lessons in Subject */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Materi Lain di {lessonData.subject.name}
            </h3>
            <div className="flex flex-col gap-2">
              {siblingLessons.map((sib) => {
                const isActive = sib.slug === lessonData.slug;
                return (
                  <Link
                    key={sib.slug}
                    href={
                      sib.topicSlug
                        ? `/learn/${level}/${subject}/${sib.topicSlug}/${sib.slug}`
                        : `/learn/${level}/${subject}`
                    }
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                      isActive
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-foreground/80 hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span className="truncate pr-2">{sib.title}</span>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {sib.durationMinutes}m
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}