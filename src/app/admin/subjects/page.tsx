import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Edit, BookOpen, Layers, FolderTree } from "lucide-react";
import { requireAuthz } from "@/server/auth";
import { listAllSubjects } from "@/modules/admin/service";
import { CmsPanel } from "@/components/admin/ui/panel";
import { CmsButton } from "@/components/admin/ui/button";
import { ContentStatusBadge } from "@/components/admin/ui/badge";
import { getSubjectTheme } from "@/components/ui/subject-theme";

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
      <CmsPanel title="Daftar Mata Pelajaran Terdaftar" eyebrow="DATA DATABASE">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-[#1E2024] bg-muted/50 font-mono text-muted-foreground dark:border-[#F4F1EA]">
                <th className="py-2.5 px-3">MATA PELAJARAN</th>
                <th className="py-2.5 px-3">SLUG / TEMA</th>
                <th className="py-2.5 px-3">JENJANG</th>
                <th className="py-2.5 px-3">TOPIK</th>
                <th className="py-2.5 px-3">MATERI</th>
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-3 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2024]/10 dark:divide-[#F4F1EA]/10">
              {subjects.map((subject) => {
                const theme = getSubjectTheme(subject.slug);
                const ThemeIcon = theme.icon;

                return (
                  <tr key={subject.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[#1E2024]/20 ${theme.iconBg}`}
                        >
                          <ThemeIcon className={`h-4 w-4 ${theme.iconColor}`} />
                        </div>
                        <div>
                          <Link
                            href={`/admin/subjects/${subject.id}`}
                            className="font-black text-[#1E2024] hover:underline dark:text-[#F4F1EA]"
                          >
                            {subject.name}
                          </Link>
                          {subject.description && (
                            <span className="block max-w-xs truncate text-[11px] text-muted-foreground">
                              {subject.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-0.5">
                        <code className="font-mono text-[11px] text-primary font-bold">
                          /{subject.slug}
                        </code>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          Tema: {theme.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="rounded border border-border bg-card px-2 py-0.5 font-mono font-bold">
                        {subject.educationLevel.name}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <Link
                        href={`/admin/topics?subjectId=${subject.id}`}
                        className="inline-flex items-center gap-1 font-mono font-bold text-primary hover:underline"
                      >
                        <FolderTree className="h-3 w-3" />
                        <span>{subject._count.topics} topik</span>
                      </Link>
                    </td>
                    <td className="py-3 px-3">
                      <Link
                        href={`/admin/lessons?subjectId=${subject.id}`}
                        className="inline-flex items-center gap-1 font-mono font-bold text-primary hover:underline"
                      >
                        <Layers className="h-3 w-3" />
                        <span>{subject._count.lessons} materi</span>
                      </Link>
                    </td>
                    <td className="py-3 px-3">
                      <ContentStatusBadge status={subject.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/admin/subjects/${subject.id}`}
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
      </CmsPanel>
    </div>
  );
}