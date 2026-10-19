import { redirect, notFound } from "next/navigation";
import { requireAuthz } from "@/server/auth";
import { getTopicById, listAllSubjects } from "@/modules/admin/service";
import { TopicForm } from "@/components/admin/topics/topic-form";

export const metadata = { title: "Edit Topik — Admin CMS", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EditTopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await requireAuthz("content:write");
  if (!auth.ok) redirect("/login");

  const { id } = await params;
  const [topic, subjects] = await Promise.all([getTopicById(id), listAllSubjects()]);

  if (!topic) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-black tracking-tight text-[#1E2024] dark:text-[#F4F1EA]">
        Edit Topik: {topic.name}
      </h1>
      <TopicForm
        isEdit
        initialData={{
          id: topic.id,
          name: topic.name,
          slug: topic.slug,
          subjectId: topic.subjectId,
          description: topic.description,
          order: topic.order,
          status: topic.status,
        }}
        subjects={subjects}
      />
    </div>
  );
}
