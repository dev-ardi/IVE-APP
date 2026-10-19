import { redirect, notFound } from "next/navigation";
import { requireAuthz } from "@/server/auth";
import { getLessonById, listAllSubjects, listAllTopics, listAllSources } from "@/modules/admin/service";
import { LessonEditor } from "@/components/admin/lessons/lesson-editor";

export const metadata = {
  title: "Edit Materi — Admin CMS",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await requireAuthz("content:write");
  if (!auth.ok) redirect("/login");

  const { id } = await params;
  const [lesson, subjects, topics, allSources] = await Promise.all([
    getLessonById(id),
    listAllSubjects(),
    listAllTopics(),
    listAllSources(),
  ]);

  if (!lesson) notFound();

  return (
    <LessonEditor
      isEdit
      initialLesson={{
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        description: lesson.description,
        difficulty: lesson.difficulty,
        kind: lesson.kind,
        durationMinutes: lesson.durationMinutes,
        order: lesson.order,
        status: lesson.status,
        subjectId: lesson.subjectId,
        topicId: lesson.topicId,
        educationLevelId: lesson.educationLevelId,
        contentBlocks: lesson.contentBlocks,
        sources: lesson.sources.map((s) => ({
          sourceId: s.sourceId,
          source: { id: s.source.id, title: s.source.title },
        })),
      }}
      subjects={subjects.map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        educationLevelId: s.educationLevelId,
      }))}
      topics={topics.map((t) => ({
        id: t.id,
        name: t.name,
        subjectId: t.subjectId,
      }))}
      allSources={allSources.map((src) => ({
        id: src.id,
        title: src.title,
        author: src.author,
      }))}
    />
  );
}
