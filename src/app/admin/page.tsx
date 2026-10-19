import Link from "next/link";
import {
  BookOpen,
  FolderTree,
  Layers,
  FlaskConical,
  HelpCircle,
  Library,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Plus,
} from "lucide-react";
import { getDashboardStats } from "@/modules/admin/service";
import { CmsPanel } from "@/components/admin/ui/panel";
import { CmsButton } from "@/components/admin/ui/button";
import { ContentStatusBadge, KindBadge } from "@/components/admin/ui/badge";
import { getSubjectTheme } from "@/components/ui/subject-theme";

export const metadata = { title: "Dashboard — Admin CMS IVE-APP", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1E2024] dark:text-[#F4F1EA]">
              Dashboard CMS
            </h1>
            <span className="rounded-md border-2 border-[#1E2024] bg-[#FFD84D] px-2 py-0.5 text-xs font-mono font-black text-[#1E2024]">
              DATABASE AKTIF
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola konten pembelajaran, sumber rujukan, dan simulasi interaktif IVE-APP secara langsung.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/admin/interactive">
            <CmsButton
              variant="highlight"
              size="sm"
              icon={<FlaskConical className="h-4 w-4" />}
            >
              Sandbox Studio
            </CmsButton>
          </Link>
          <Link href="/admin/lessons/new">
            <CmsButton
              variant="primary"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
            >
              Tambah Materi
            </CmsButton>
          </Link>
        </div>
      </div>

      {/* Main Stats Bento Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="flex flex-col rounded-xl border-[3px] border-[#1E2024] bg-card p-4 shadow-[3px_3px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[3px_3px_0px_0px_rgba(244,241,234,0.85)]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-mono font-bold uppercase">Mata Pelajaran</span>
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <span className="mt-2 text-2xl font-black font-mono text-[#1E2024] dark:text-[#F4F1EA]">
            {stats.subjectCount}
          </span>
          <Link href="/admin/subjects" className="mt-2 text-xs font-bold text-primary hover:underline">
            Kelola Subjek →
          </Link>
        </div>

        <div className="flex flex-col rounded-xl border-[3px] border-[#1E2024] bg-card p-4 shadow-[3px_3px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[3px_3px_0px_0px_rgba(244,241,234,0.85)]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-mono font-bold uppercase">Topik</span>
            <FolderTree className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="mt-2 text-2xl font-black font-mono text-[#1E2024] dark:text-[#F4F1EA]">
            {stats.topicCount}
          </span>
          <Link href="/admin/topics" className="mt-2 text-xs font-bold text-primary hover:underline">
            Kelola Topik →
          </Link>
        </div>

        <div className="flex flex-col rounded-xl border-[3px] border-[#1E2024] bg-card p-4 shadow-[3px_3px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[3px_3px_0px_0px_rgba(244,241,234,0.85)]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-mono font-bold uppercase">Total Materi</span>
            <Layers className="h-4 w-4 text-blue-600" />
          </div>
          <span className="mt-2 text-2xl font-black font-mono text-[#1E2024] dark:text-[#F4F1EA]">
            {stats.totalLessons}
          </span>
          <span className="mt-2 text-xs font-mono text-muted-foreground">
            {stats.publishedLessons} Terbit · {stats.draftLessons} Draft
          </span>
        </div>

        <div className="flex flex-col rounded-xl border-[3px] border-[#1E2024] bg-card p-4 shadow-[3px_3px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[3px_3px_0px_0px_rgba(244,241,234,0.85)]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-mono font-bold uppercase">Eksperimen / Lab</span>
            <FlaskConical className="h-4 w-4 text-purple-600" />
          </div>
          <span className="mt-2 text-2xl font-black font-mono text-[#1E2024] dark:text-[#F4F1EA]">
            {stats.experimentCount}
          </span>
          <Link href="/admin/lessons?kind=EXPERIMENT" className="mt-2 text-xs font-bold text-primary hover:underline">
            Buka Lab CMS →
          </Link>
        </div>

        <div className="flex flex-col rounded-xl border-[3px] border-[#1E2024] bg-card p-4 shadow-[3px_3px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[3px_3px_0px_0px_rgba(244,241,234,0.85)]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-mono font-bold uppercase">Bank Soal</span>
            <HelpCircle className="h-4 w-4 text-amber-600" />
          </div>
          <span className="mt-2 text-2xl font-black font-mono text-[#1E2024] dark:text-[#F4F1EA]">
            {stats.questionCount}
          </span>
          <Link href="/admin/questions" className="mt-2 text-xs font-bold text-primary hover:underline">
            Kelola Soal →
          </Link>
        </div>

        <div className="flex flex-col rounded-xl border-[3px] border-[#1E2024] bg-card p-4 shadow-[3px_3px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[3px_3px_0px_0px_rgba(244,241,234,0.85)]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-mono font-bold uppercase">Sumber Rujukan</span>
            <Library className="h-4 w-4 text-teal-600" />
          </div>
          <span className="mt-2 text-2xl font-black font-mono text-[#1E2024] dark:text-[#F4F1EA]">
            {stats.sourceCount}
          </span>
          <Link href="/admin/sources" className="mt-2 text-xs font-bold text-primary hover:underline">
            Daftar Sumber →
          </Link>
        </div>
      </div>

      {/* Critical Status Alerts: "Materi tanpa sumber" & "Materi tanpa sandbox" (design-cms.md §4.2) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div
          className={`rounded-xl border-[3px] p-5 shadow-[4px_4px_0px_0px_#1E2024] dark:shadow-[4px_4px_0px_0px_rgba(244,241,234,0.85)] ${
            stats.lessonsWithoutSources > 0
              ? "border-[#1E2024] bg-[#FFD84D]/25 dark:border-[#F4F1EA]"
              : "border-[#1E2024] bg-[#7BE0A4]/20 dark:border-[#F4F1EA]"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] ${
                stats.lessonsWithoutSources > 0 ? "bg-[#FFD84D] text-[#1E2024]" : "bg-[#7BE0A4] text-[#1E2024]"
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-muted-foreground">
                  Validitas Sumber Rujukan
                </span>
                <span className="rounded border border-[#1E2024] bg-card px-2 py-0.5 text-xs font-mono font-black text-[#1E2024] dark:text-[#F4F1EA]">
                  {stats.lessonsWithoutSources} Belum Bersumber
                </span>
              </div>
              <h3 className="mt-1 text-base font-black text-[#1E2024] dark:text-[#F4F1EA]">
                {stats.lessonsWithoutSources > 0
                  ? "Ada materi yang belum memiliki sumber rujukan."
                  : "Semua materi sudah memiliki sumber rujukan!"}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Prinsip IVE-APP: materi tidak dapat dipublikasikan tanpa minimal 1 sumber rujukan valid.
              </p>
              <div className="mt-3">
                <Link
                  href="/admin/lessons"
                  className="inline-flex items-center gap-1 text-xs font-black text-[#1E2024] hover:underline dark:text-[#F4F1EA]"
                >
                  Lihat daftar materi →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border-[3px] border-[#1E2024] bg-[#E5EFFE]/40 p-5 shadow-[4px_4px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:bg-[#1E2B4D]/30 dark:shadow-[4px_4px_0px_0px_rgba(244,241,234,0.85)]">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-[#1E2024] bg-primary text-white shadow-[2px_2px_0px_0px_#1E2024]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-muted-foreground">
                  Kekayaan Interaktif
                </span>
                <span className="rounded border border-[#1E2024] bg-card px-2 py-0.5 text-xs font-mono font-black text-[#1E2024] dark:text-[#F4F1EA]">
                  {stats.lessonsWithoutSandbox} Perlu Sandbox
                </span>
              </div>
              <h3 className="mt-1 text-base font-black text-[#1E2024] dark:text-[#F4F1EA]">
                Tingkatkan materi dengan simulasi interaktif
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Buka Sandbox Studio untuk menambahkan simulasi rumus atau visualizer pada materi yang belum memiliki sandbox.
              </p>
              <div className="mt-3">
                <Link
                  href="/admin/interactive"
                  className="inline-flex items-center gap-1 text-xs font-black text-primary hover:underline"
                >
                  Buka Sandbox Studio →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Lessons Section */}
      <CmsPanel
        eyebrow="PEMBARUAN TERBARU"
        title="Daftar Materi Terbaru di Database"
        action={
          <Link
            href="/admin/lessons"
            className="inline-flex items-center gap-1 text-xs font-mono font-bold text-primary hover:underline"
          >
            Semua Materi <ArrowRight className="h-3 w-3" />
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-[#1E2024] bg-muted/50 font-mono text-muted-foreground dark:border-[#F4F1EA]">
                <th className="py-2.5 px-3">JUDUL MATERI</th>
                <th className="py-2.5 px-3">SUBJEK / TOPIK</th>
                <th className="py-2.5 px-3">JENIS</th>
                <th className="py-2.5 px-3">SUMBER</th>
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-3 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2024]/10 dark:divide-[#F4F1EA]/10">
              {stats.recentLessons.map((lesson) => {
                const theme = getSubjectTheme(lesson.subject.slug);
                return (
                  <tr
                    key={lesson.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <Link
                        href={`/admin/lessons/${lesson.id}`}
                        className="font-bold text-[#1E2024] hover:underline dark:text-[#F4F1EA]"
                      >
                        {lesson.title}
                      </Link>
                      <span className="block font-mono text-[10px] text-muted-foreground">
                        /{lesson.slug}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{
                            backgroundColor:
                              lesson.subject.slug === "matematika"
                                ? "#2563EB"
                                : lesson.subject.slug === "fisika"
                                  ? "#0891B2"
                                  : lesson.subject.slug === "kimia"
                                    ? "#7C3AED"
                                    : lesson.subject.slug === "biologi"
                                      ? "#059669"
                                      : "#D97706",
                          }}
                        />
                        <span className="font-bold">{lesson.subject.name}</span>
                        {lesson.topic && (
                          <span className="text-muted-foreground">/ {lesson.topic.name}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <KindBadge kind={lesson.kind} />
                    </td>
                    <td className="py-3 px-3 font-mono font-bold">
                      {lesson._count.sources > 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {lesson._count.sources} sumber
                        </span>
                      ) : (
                        <span className="rounded bg-[#FFD84D] px-1 py-0.5 text-[#1E2024]">
                          0 sumber
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <ContentStatusBadge status={lesson.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/interactive?lesson=${lesson.id}`}
                          className="rounded border border-[#1E2024] bg-[#FFD84D] px-2 py-1 text-[11px] font-bold text-[#1E2024] shadow-[1px_1px_0px_0px_#1E2024] hover:bg-[#FACC15]"
                        >
                          Sandbox
                        </Link>
                        <Link
                          href={`/admin/lessons/${lesson.id}`}
                          className="rounded border border-[#1E2024] bg-card px-2 py-1 text-[11px] font-bold text-[#1E2024] shadow-[1px_1px_0px_0px_#1E2024] hover:bg-muted dark:border-[#F4F1EA] dark:text-[#F4F1EA]"
                        >
                          Edit
                        </Link>
                      </div>
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