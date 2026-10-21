import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { requireAuthz } from "@/server/auth";
import { listAllQuestions, listAllTopics } from "@/modules/admin/service";
import { CmsPanel } from "@/components/admin/ui/panel";
import { CmsButton } from "@/components/admin/ui/button";
import { QuestionList } from "./question-list";

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
      <CmsPanel title={`Daftar Soal (${questions.length})`} eyebrow="BANK SOAL" bodyClassName="p-0">
        <QuestionList questions={questions} />
      </CmsPanel>
    </div>
  );
}
