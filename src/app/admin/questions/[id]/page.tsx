import { redirect, notFound } from "next/navigation";
import { requireAuthz } from "@/server/auth";
import { getQuestionById, listAllTopics, listAllLessons } from "@/modules/admin/service";
import { QuestionForm } from "@/components/admin/questions/question-form";

export const metadata = { title: "Edit Soal — Admin CMS", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await requireAuthz("content:write");
  if (!auth.ok) redirect("/login");

  const { id } = await params;
  const [question, topics, lessons] = await Promise.all([
    getQuestionById(id),
    listAllTopics(),
    listAllLessons(),
  ]);

  if (!question) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-black tracking-tight text-[#1E2024] dark:text-[#F4F1EA]">
        Edit Soal
      </h1>
      <QuestionForm
        isEdit
        initialData={{
          id: question.id,
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          difficulty: question.difficulty,
          order: question.order,
          status: question.status,
          topicId: question.topicId,
          lessonId: question.lessonId,
        }}
        topics={topics}
        lessons={lessons}
      />
    </div>
  );
}
