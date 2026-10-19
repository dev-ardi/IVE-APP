import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Edit, ExternalLink, Library, Layers } from "lucide-react";
import { requireAuthz } from "@/server/auth";
import { listAllSources } from "@/modules/admin/service";
import { CmsPanel } from "@/components/admin/ui/panel";
import { CmsButton } from "@/components/admin/ui/button";

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
      <CmsPanel title={`Daftar Sumber Rujukan (${sources.length})`} eyebrow="DATA RUJUKAN">
        {sources.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Belum ada sumber rujukan. Silakan klik tombol Tambah Sumber.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-[#1E2024] bg-muted/50 font-mono text-muted-foreground dark:border-[#F4F1EA]">
                  <th className="py-2.5 px-3">JUDUL SUMBER</th>
                  <th className="py-2.5 px-3">PENULIS / PENERBIT</th>
                  <th className="py-2.5 px-3">TIPE</th>
                  <th className="py-2.5 px-3">TAHUN</th>
                  <th className="py-2.5 px-3">TAUTAN</th>
                  <th className="py-2.5 px-3">DIGUNAKAN PADA</th>
                  <th className="py-2.5 px-3 text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2024]/10 dark:divide-[#F4F1EA]/10">
                {sources.map((source) => (
                  <tr key={source.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3">
                      <Link
                        href={`/admin/sources/${source.id}`}
                        className="font-black text-[#1E2024] hover:underline dark:text-[#F4F1EA]"
                      >
                        {source.title}
                      </Link>
                      {source.licenseNote && (
                        <span className="block max-w-xs truncate text-[11px] text-muted-foreground">
                          {source.licenseNote}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="font-bold">{source.author || "-"}</span>
                        {source.publisher && (
                          <span className="text-[11px] text-muted-foreground">
                            {source.publisher}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="rounded border border-border bg-card px-2 py-0.5 font-mono text-[11px] font-bold">
                        {source.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      {source.year || "-"}
                    </td>
                    <td className="py-3 px-3">
                      {source.url ? (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[11px] text-primary hover:underline"
                        >
                          <span>Buka</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 font-mono font-bold text-muted-foreground">
                        <Layers className="h-3 w-3" />
                        <span>{source._count.lessons} materi</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/admin/sources/${source.id}`}
                        className="inline-flex items-center gap-1 rounded border border-[#1E2024] bg-card px-2.5 py-1 text-xs font-bold text-[#1E2024] shadow-[1px_1px_0px_0px_#1E2024] hover:bg-muted dark:border-[#F4F1EA] dark:text-[#F4F1EA]"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Edit</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CmsPanel>
    </div>
  );
}
