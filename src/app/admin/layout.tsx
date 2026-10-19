import { redirect } from "next/navigation";
import { getSessionUser } from "@/server/auth";
import { can } from "@/modules/authz";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminAccessDenied } from "@/components/admin/access-denied";

export const metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  // If not authenticated, redirect to /login with next parameter
  if (!user) {
    redirect("/login?next=/admin");
  }

  // If authenticated but unauthorized, render friendly 403 page (design-cms.md §2.3B)
  if (!can(user, "cms:access")) {
    return (
      <AdminAccessDenied
        userName={user.name}
        userEmail={user.email}
        userRole={user.role}
      />
    );
  }

  return (
    <AdminShell
      userName={user.name}
      userEmail={user.email}
      userRole={user.role}
    >
      {children}
    </AdminShell>
  );
}