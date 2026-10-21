import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { requireAuthz } from "@/server/auth";
import { listAllSubjects } from "@/modules/admin/service";
import { CmsPanel } from "@/components/admin/ui/panel";
import { CmsButton } from "@/components/admin/ui/button";
import { SubjectList } from "./subject-list";

export const metadata = { title: "Mata Pelajaran — Admin CMS", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminSubjectsPage() {
  const auth = await requireAuthz("content:read");
  if (!auth.ok) redirect("/login");

  const subjects = await listAllSubjects();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1E2024] dark:text-[#F4F1EA]">
            Kelola Mata Pelajaran
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Daftar bidang keilmuan yang dipetakan langsung dengan tema visual dan URL publik.
          </p>
        </div>
        <Link href="/admin/subjects/new">
          <CmsButton variant="primary" icon={<Plus className="h-4 w-4" />}>
            Tambah Mata Pelajaran
          </CmsButton>
        </Link>
      </div>

      {/* Table Panel */}
      <CmsPanel title="Daftar Mata Pelajaran Terdaftar" eyebrow="DATA DATABASE" bodyClassName="p-0">
        <SubjectList subjects={subjects} />
      </CmsPanel>
    </div>
  );
}