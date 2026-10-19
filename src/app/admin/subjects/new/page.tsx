import { redirect } from "next/navigation";
import { requireAuthz } from "@/server/auth";
import { listLevels } from "@/modules/admin/service";
import { SubjectForm } from "@/components/admin/subjects/subject-form";

export const metadata = { title: "Tambah Mata Pelajaran — Admin CMS", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function NewSubjectPage() {
  const auth = await requireAuthz("content:write");
  if (!auth.ok) redirect("/login");

  const levels = await listLevels();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight text-[#1E2024] dark:text-[#F4F1EA]">
          Tambah Mata Pelajaran Baru
        </h1>
      </div>
      <SubjectForm levels={levels} />
    </div>
  );
}