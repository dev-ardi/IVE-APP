import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/server/auth";
import { listAllLessons, listAllSubjects } from "@/modules/admin/service";
import { StatusBadge, DifficultyBadge } from "@/components/admin/status-badge";

export const metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const auth = await requireAdmin();
  if (!auth.ok) redirect("/login");

  const [lessons, subjects] = await Promise.all([listAllLessons(), listAllSubjects()]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard Admin</h1>
          <p className="text-sm text-muted-foreground">
            Selamat datang. Kelola konten pembelajaran IVE dari sini.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/subjects/new"
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            + Mata Pelajaran
          </Link>
          <Link
            href="/admin/lessons/new"
            className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            + Buat Materi
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border p-5">
          <p className="text-3xl font-semibold">{lessons.length}</p>
          <p className="text-sm text-muted-foreground">Total Materi</p>
        </div>
        <div className="rounded-xl border border-border p-5">
          <p className="text-3xl font-semibold">{subjects.length}</p>
          <p className="text-sm text-muted-foreground">Total Mata Pelajaran</p>
        </div>
        <div className="rounded-xl border border-border p-5">
          <p className="text-3xl font-semibold">
            {lessons.filter((l) => l.status === "PUBLISHED").length}
          </p>
          <p className="text-sm text-muted-foreground">Materi Terpublikasi</p>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Materi Terbaru</h2>
        <div className="overflow-hidden rounded-xl border border-border">
          {lessons.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">Belum ada materi.</p>
          ) : (
            <ul className="divide-y divide-border">
              {lessons.slice(0, 5).map((lesson) => (
                <li key={lesson.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{lesson.title}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {lesson.subject.name} · {lesson.educationLevel.name}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <DifficultyBadge difficulty={lesson.difficulty} />
                    <StatusBadge status={lesson.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}