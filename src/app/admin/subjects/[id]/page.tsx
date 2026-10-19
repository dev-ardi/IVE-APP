import { redirect, notFound } from "next/navigation";
import { requireAuthz } from "@/server/auth";
import { getSubjectById, listLevels } from "@/modules/admin/service";
import { SubjectForm } from "@/components/admin/subjects/subject-form";

export const metadata = { title: "Edit Mata Pelajaran — Admin CMS", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EditSubjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await requireAuthz("content:write");
  if (!auth.ok) redirect("/login");

  const { id } = await params;
  const [subject, levels] = await Promise.all([getSubjectById(id), listLevels()]);

  if (!subject) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight text-[#1E2024] dark:text-[#F4F1EA]">
          Edit Mata Pelajaran: {subject.name}
        </h1>
      </div>
      <SubjectForm
        isEdit
        initialData={{
          id: subject.id,
          name: subject.name,
          slug: subject.slug,
          description: subject.description,
          icon: subject.icon,
          coverImage: subject.coverImage,
          educationLevelId: subject.educationLevelId,
          order: subject.order,
          status: subject.status,
        }}
        levels={levels}
      />
    </div>
  );
}
