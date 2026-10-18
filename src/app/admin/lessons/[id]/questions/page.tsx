import { redirect } from "next/navigation";
import { requireAdmin } from "@/server/auth";
import { QuestionForm } from "./form";

export const metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LessonQuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await requireAdmin();
  if (!auth.ok) redirect("/login");

  const { id } = await params;

  return <QuestionForm lessonId={id} />;
}