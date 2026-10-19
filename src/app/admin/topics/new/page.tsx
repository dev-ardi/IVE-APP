import { redirect } from "next/navigation";
import { requireAuthz } from "@/server/auth";
import { listAllSubjects } from "@/modules/admin/service";
import { TopicForm } from "@/components/admin/topics/topic-form";

export const metadata = { title: "Tambah Topik — Admin CMS", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function NewTopicPage() {
  const auth = await requireAuthz("content:write");
  if (!auth.ok) redirect("/login");

  const subjects = await listAllSubjects();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-black tracking-tight text-[#1E2024] dark:text-[#F4F1EA]">
        Tambah Topik Baru
      </h1>
      <TopicForm subjects={subjects} />
    </div>
  );
}
