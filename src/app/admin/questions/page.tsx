import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Edit, HelpCircle, Layers, CheckCircle2 } from "lucide-react";
import { requireAuthz } from "@/server/auth";
import { listAllQuestions, listAllTopics } from "@/modules/admin/service";
import { CmsPanel } from "@/components/admin/ui/panel";
import { CmsButton } from "@/components/admin/ui/button";
import { ContentStatusBadge, DifficultyBadge } from "@/components/admin/ui/badge";

export const metadata = { title: "Bank Soal — Admin CMS", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminQuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ topicId?: string; lessonId?: string }>;
}) {
  const auth = await requireAuthz("content:read");
  if (!auth.ok) redirect("/login");

  const { topicId, lessonId } = await searchParams;
  const [questions, topics] = await Promise.all([
    listAllQuestions(topicId, lessonId),
    listAllTopics(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1E2024] dark:text-[#F4F1EA]">
            Bank Soal & Latihan
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola soal pilihan ganda berbasis topik atau dipin ke materi pembelajaran tertentu.
          </p>
        </div>
        <Link href="/admin/questions/new">
          <CmsButton variant="primary" icon={<Plus className="h-4 w-4" />}>
            Tambah Soal
          </CmsButton>
        </Link>
      </div>

      {/* Filter by Topic */}
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/admin/questions"
          className={`rounded-lg border-2 px-3 py-1.5 text-xs font-mono font-bold transition-all ${
            !topicId
              ? "border-[#1E2024] bg-primary text-white shadow-[2px_2px_0px_0px_#1E2024] dark:border-[#F4F1EA]"
              : "border-border bg-card text-foreground hover:border-[#1E2024]"
          }`}
        >
          Semua Topik
        </Link>
        {topics.map((t) => {
          const isSelected = topicId === t.id;
          return (
            <Link
              key={t.id}
              href={`/admin/questions?topicId=${t.id}`}
              className={`rounded-lg border-2 px-3 py-1.5 text-xs font-mono font-bold transition-all ${
                isSelected
                  ? "border-[#1E2024] bg-primary text-white shadow-[2px_2px_0px_0px_#1E2024] dark:border-[#F4F1EA]"
                  : "border-border bg-card text-foreground hover:border-[#1E2024]"
              }`}
            >
              {t.subject.name} - {t.name}
            </Link>
          );
        })}
      </div>

      {/* Table Panel */}
      <CmsPanel title={`Daftar Soal (${questions.length})`} eyebrow="BANK SOAL">
        {questions.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Belum ada soal pada filter yang dipilih. Silakan klik tombol Tambah Soal.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-[#1E2024] bg-muted/50 font-mono text-muted-foreground dark:border-[#F4F1EA]">
                  <th className="py-2.5 px-3">PERTANYAAN</th>
                  <th className="py-2.5 px-3">TOPIK / MATERI</th>
                  <th className="py-2.5 px-3">KUNCI JAWABAN</th>
                  <th className="py-2.5 px-3">KESULITAN</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3 text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2024]/10 dark:divide-[#F4F1EA]/10">
                {questions.map((q) => {
                  const opts = (Array.isArray(q.options) ? q.options : []) as Array<{ id: string; text: string }>;
                  const correctOpt = opts.find((o) => o.id === q.correctAnswer);

                  return (
                    <tr key={q.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-3 max-w-sm">
                        <Link
                          href={`/admin/questions/${q.id}`}
                          className="font-black text-[#1E2024] hover:underline line-clamp-2 dark:text-[#F4F1EA]"
                        >
                          {q.question}
                        </Link>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {opts.length} opsi pilihan
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-bold">{q.topic?.name || "-"}</span>
                          {q.lesson && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Layers className="h-3 w-3" />
                              <span>{q.lesson.title}</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-[#7BE0A4] px-1.5 py-0.5 text-[10px] font-black text-stone-900">
                            {q.correctAnswer}
                          </span>
                          <span className="truncate max-w-[150px] font-medium text-muted-foreground">
                            {correctOpt?.text}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <DifficultyBadge difficulty={q.difficulty} />
                      </td>
                      <td className="py-3 px-3">
                        <ContentStatusBadge status={q.status} />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/admin/questions/${q.id}`}
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
