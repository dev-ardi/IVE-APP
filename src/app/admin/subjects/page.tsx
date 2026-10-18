import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/server/auth";
import { listAllSubjects } from "@/modules/admin/service";
import { StatusBadge } from "@/components/admin/status-badge";

export const metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminSubjectsPage() {
  const auth = await requireAdmin();
  if (!auth.ok) redirect("/login");

  const subjects = await listAllSubjects();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Mata Pelajaran</h1>
        <Link
          href="/admin/subjects/new"
          className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Buat Mata Pelajaran
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        {subjects.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">Belum ada mata pelajaran.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Jenjang</th>
                <th className="px-4 py-3 font-medium">Topik</th>
                <th className="px-4 py-3 font-medium">Materi</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subjects.map((subject) => (
                <tr key={subject.id}>
                  <td className="px-4 py-3 font-medium">{subject.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {subject.educationLevel.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{subject._count.topics}</td>
                  <td className="px-4 py-3 text-muted-foreground">{subject._count.lessons}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={subject.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}