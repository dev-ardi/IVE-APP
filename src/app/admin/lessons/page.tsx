import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { requireAuthz } from "@/server/auth";
import { listAllLessons, listAllSubjects } from "@/modules/admin/service";
import { LessonList } from "./lesson-list";
import { CmsButton } from "@/components/admin/ui/button";

export const metadata = { title: "Materi Pembelajaran — Admin CMS", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLessonsPage() {
  const auth = await requireAuthz("content:read");
  if (!auth.ok) redirect("/login");

  const [lessons, subjects] = await Promise.all([
    listAllLessons(),
    listAllSubjects(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1E2024] dark:text-[#F4F1EA]">
            Kelola Materi & Eksperimen
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Daftar seluruh materi terstruktur dan simulasi lab interaktif IVE-APP.
          </p>
        </div>
        <Link href="/admin/lessons/new">
          <CmsButton variant="primary" icon={<Plus className="h-4 w-4" />}>
            Buat Materi Baru
          </CmsButton>
        </Link>
      </div>

      <LessonList
        lessons={lessons as unknown as Parameters<typeof LessonList>[0]["lessons"]}
        subjects={subjects}
      />
    </div>
  );
}