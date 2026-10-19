import { redirect } from "next/navigation";
import { requireAuthz } from "@/server/auth";
import { listAllSubjects, listAllTopics, listAllSources } from "@/modules/admin/service";
import { LessonEditor } from "@/components/admin/lessons/lesson-editor";

export const metadata = {
  title: "Tambah Materi Baru — Admin CMS",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function NewLessonPage() {
  const auth = await requireAuthz("content:write");
  if (!auth.ok) redirect("/login");

  const [subjects, topics, allSources] = await Promise.all([
    listAllSubjects(),
    listAllTopics(),
    listAllSources(),
  ]);

  return (
    <LessonEditor
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