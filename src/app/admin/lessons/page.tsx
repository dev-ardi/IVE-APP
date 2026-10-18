import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/server/auth";
import { listAllLessons } from "@/modules/admin/service";
import { LessonList } from "./lesson-list";

export const metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLessonsPage() {
  const auth = await requireAdmin();
  if (!auth.ok) redirect("/login");

  const lessons = await listAllLessons();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Materi</h1>
        <Link
          href="/admin/lessons/new"
          className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Buat Materi
        </Link>
      </div>

      <LessonList lessons={lessons} />
    </div>
  );
}