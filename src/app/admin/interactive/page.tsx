import { redirect } from "next/navigation";
import { requireAuthz } from "@/server/auth";
import { SandboxStudio } from "@/components/admin/interactive/sandbox-studio";

export const metadata = {
  title: "Sandbox Studio Interaktif — Admin CMS",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function InteractivePage({
  searchParams,
}: {
  searchParams: Promise<{ lesson?: string }>;
}) {
  const auth = await requireAuthz("sandbox:write");
  if (!auth.ok) redirect("/login");

  const { lesson } = await searchParams;

  return <SandboxStudio initialLessonId={lesson} />;
}
