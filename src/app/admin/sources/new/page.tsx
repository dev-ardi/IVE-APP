import { redirect } from "next/navigation";
import { requireAuthz } from "@/server/auth";
import { SourceForm } from "@/components/admin/sources/source-form";

export const metadata = { title: "Tambah Sumber Rujukan — Admin CMS", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function NewSourcePage() {
  const auth = await requireAuthz("content:write");
  if (!auth.ok) redirect("/login");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-black tracking-tight text-[#1E2024] dark:text-[#F4F1EA]">
        Tambah Sumber Rujukan Baru
      </h1>
      <SourceForm />
    </div>
  );
}
