import { redirect } from "next/navigation";
import { requireAdmin } from "@/server/auth";
import { AdminNavLink } from "@/components/admin/nav-link";

export const metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = await requireAdmin();
  if (!auth.ok) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-border bg-muted/40">
        <div className="flex h-16 items-center border-b border-border px-4 font-bold tracking-tight">
          <span className="mr-2 flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm font-extrabold text-primary-foreground">
            IV
          </span>
          Admin IVE
        </div>
        <nav className="flex flex-col gap-1 p-3" aria-label="Navigasi admin">
          <AdminNavLink href="/admin">Dashboard</AdminNavLink>
          <AdminNavLink href="/admin/subjects">Mata Pelajaran</AdminNavLink>
          <AdminNavLink href="/admin/lessons">Materi</AdminNavLink>
        </nav>
      </aside>
      <main className="flex-1 overflow-x-hidden px-6 py-8">{children}</main>
    </div>
  );
}