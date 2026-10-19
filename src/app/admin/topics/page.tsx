import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Edit, FolderTree, Layers, HelpCircle } from "lucide-react";
import { requireAuthz } from "@/server/auth";
import { listAllTopics, listAllSubjects } from "@/modules/admin/service";
import { CmsPanel } from "@/components/admin/ui/panel";
import { CmsButton } from "@/components/admin/ui/button";
import { ContentStatusBadge } from "@/components/admin/ui/badge";
import { getSubjectTheme } from "@/components/ui/subject-theme";

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
      <CmsPanel title={`Daftar Topik (${topics.length})`} eyebrow="DATA DATABASE">
        {topics.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Belum ada topik pada filter yang dipilih. Silakan klik tombol Tambah Topik.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-[#1E2024] bg-muted/50 font-mono text-muted-foreground dark:border-[#F4F1EA]">
                  <th className="py-2.5 px-3">NAMA TOPIK</th>
                  <th className="py-2.5 px-3">MATA PELAJARAN</th>
                  <th className="py-2.5 px-3">SLUG</th>
                  <th className="py-2.5 px-3">URUTAN</th>
                  <th className="py-2.5 px-3">MATERI</th>
                  <th className="py-2.5 px-3">SOAL</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3 text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2024]/10 dark:divide-[#F4F1EA]/10">
                {topics.map((topic) => {
                  const theme = getSubjectTheme(topic.subject.slug);

                  return (
                    <tr key={topic.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-3">
                        <Link
                          href={`/admin/topics/${topic.id}`}
                          className="font-black text-[#1E2024] hover:underline dark:text-[#F4F1EA]"
                        >
                          {topic.name}
                        </Link>
                        {topic.description && (
                          <span className="block max-w-xs truncate text-[11px] text-muted-foreground">
                            {topic.description}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{
                              backgroundColor:
                                topic.subject.slug === "matematika"
                                  ? "#2563EB"
                                  : topic.subject.slug === "fisika"
                                    ? "#0891B2"
                                    : topic.subject.slug === "kimia"
                                      ? "#7C3AED"
                                      : topic.subject.slug === "biologi"
                                        ? "#059669"
                                        : "#D97706",
                            }}
                          />
                          <span className="font-bold">{topic.subject.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">
                        /{topic.slug}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold">
                        #{topic.order}
                      </td>
                      <td className="py-3 px-3">
                        <Link
                          href={`/admin/lessons?topicId=${topic.id}`}
                          className="inline-flex items-center gap-1 font-mono font-bold text-primary hover:underline"
                        >
                          <Layers className="h-3 w-3" />
                          <span>{topic._count.lessons} materi</span>
                        </Link>
                      </td>
                      <td className="py-3 px-3">
                        <Link
                          href={`/admin/questions?topicId=${topic.id}`}
                          className="inline-flex items-center gap-1 font-mono font-bold text-primary hover:underline"
                        >
                          <HelpCircle className="h-3 w-3" />
                          <span>{topic._count.questions} soal</span>
                        </Link>
                      </td>
                      <td className="py-3 px-3">
                        <ContentStatusBadge status={topic.status} />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/admin/topics/${topic.id}`}
                          className="inline-flex items-center gap-1 rounded border border-[#1E2024] bg-card px-2.5 py-1 text-xs font-bold text-[#1E2024] shadow-[1px_1px_0px_0px_#1E2024] hover:bg-muted dark:border-[#F4F1EA] dark:text-[#F4F1EA]"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Edit</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CmsPanel>
    </div>
  );
}
