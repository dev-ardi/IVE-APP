import { redirect } from "next/navigation";
import { requireAuthz } from "@/server/auth";
import { listAllTopics, listAllLessons } from "@/modules/admin/service";
import { QuestionForm } from "@/components/admin/questions/question-form";

export const metadata = { title: "Tambah Soal — Admin CMS", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function NewQuestionPage() {
  const auth = await requireAuthz("content:write");
  if (!auth.ok) redirect("/login");

  const [topics, lessons] = await Promise.all([
    listAllTopics(),
    listAllLessons(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-black tracking-tight text-[#1E2024] dark:text-[#F4F1EA]">
        Tambah Soal Baru
      </h1>
      <QuestionForm topics={topics} lessons={lessons} />
    </div>
  );
}
