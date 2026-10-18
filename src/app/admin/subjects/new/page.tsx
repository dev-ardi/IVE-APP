import { redirect } from "next/navigation";
import { requireAdmin } from "@/server/auth";
import { listLevels } from "@/modules/admin/service";
import { NewSubjectForm } from "./form";

export const metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function NewSubjectPage() {
  const auth = await requireAdmin();
  if (!auth.ok) redirect("/login");

  const levels = await listLevels();

  return <NewSubjectForm levels={levels} />;
}