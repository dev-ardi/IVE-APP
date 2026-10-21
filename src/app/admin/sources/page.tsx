import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { requireAuthz } from "@/server/auth";
import { listAllSources } from "@/modules/admin/service";
import { CmsPanel } from "@/components/admin/ui/panel";
import { CmsButton } from "@/components/admin/ui/button";
import { SourceList } from "./source-list";

export const metadata = { title: "Sumber Rujukan — Admin CMS", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminSourcesPage() {
  const auth = await requireAuthz("content:read");
  if (!auth.ok) redirect("/login");

  const sources = await listAllSources();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1E2024] dark:text-[#F4F1EA]">
            Kelola Sumber Rujukan
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Semua materi IVE-APP wajib mencantumkan sumber rujukan valid sebelum dapat dipublikasikan.
          </p>
        </div>
        <Link href="/admin/sources/new">
          <CmsButton variant="primary" icon={<Plus className="h-4 w-4" />}>
            Tambah Sumber
          </CmsButton>
        </Link>
      </div>

      {/* Table Panel */}
      <CmsPanel title={`Daftar Sumber Rujukan (${sources.length})`} eyebrow="DATA RUJUKAN" bodyClassName="p-0">
        <SourceList sources={sources} />
      </CmsPanel>
    </div>
  );
}
