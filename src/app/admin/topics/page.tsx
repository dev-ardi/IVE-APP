import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { requireAuthz } from "@/server/auth";
import { listAllTopics, listAllSubjects } from "@/modules/admin/service";
import { CmsPanel } from "@/components/admin/ui/panel";
import { CmsButton } from "@/components/admin/ui/button";
import { TopicList } from "./topic-list";

export const metadata = { title: "Topik — Admin CMS", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminTopicsPage({
  searchParams,
}: {
  searchParams: Promise<{ subjectId?: string }>;
}) {
  const auth = await requireAuthz("content:read");
  if (!auth.ok) redirect("/login");

  const { subjectId } = await searchParams;
  const [topics, subjects] = await Promise.all([
    listAllTopics(subjectId),
    listAllSubjects(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1E2024] dark:text-[#F4F1EA]">
            Kelola Topik Pembelajaran
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Topik mengelompokkan materi pembelajaran dan bank soal di bawah setiap mata pelajaran.
          </p>
        </div>
        <Link href="/admin/topics/new">
          <CmsButton variant="primary" icon={<Plus className="h-4 w-4" />}>
            Tambah Topik
          </CmsButton>
        </Link>
      </div>

      {/* Filter Tabs by Subject */}
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/admin/topics"
          className={`rounded-lg border-2 px-3 py-1.5 text-xs font-mono font-bold transition-all ${
            !subjectId
              ? "border-[#1E2024] bg-primary text-white shadow-[2px_2px_0px_0px_#1E2024] dark:border-[#F4F1EA]"
              : "border-border bg-card text-foreground hover:border-[#1E2024]"
          }`}
        >
          Semua Subjek
        </Link>
        {subjects.map((sub) => {
          const isSelected = subjectId === sub.id;
          return (
            <Link
              key={sub.id}
              href={`/admin/topics?subjectId=${sub.id}`}
              className={`rounded-lg border-2 px-3 py-1.5 text-xs font-mono font-bold transition-all ${
                isSelected
                  ? "border-[#1E2024] bg-primary text-white shadow-[2px_2px_0px_0px_#1E2024] dark:border-[#F4F1EA]"
                  : "border-border bg-card text-foreground hover:border-[#1E2024]"
              }`}
            >
              {sub.name}
            </Link>
          );
        })}
      </div>

      {/* Table Panel */}
      <CmsPanel title={`Daftar Topik (${topics.length})`} eyebrow="DATA DATABASE" bodyClassName="p-0">
        <TopicList topics={topics} />
      </CmsPanel>
    </div>
  );
}
