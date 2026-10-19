import { redirect, notFound } from "next/navigation";
import { requireAuthz } from "@/server/auth";
import { getSourceById } from "@/modules/admin/service";
import { SourceForm } from "@/components/admin/sources/source-form";

export const metadata = { title: "Edit Sumber Rujukan — Admin CMS", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EditSourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await requireAuthz("content:write");
  if (!auth.ok) redirect("/login");

  const { id } = await params;
  const source = await getSourceById(id);

  if (!source) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-black tracking-tight text-[#1E2024] dark:text-[#F4F1EA]">
        Edit Sumber: {source.title}
      </h1>
      <SourceForm
        isEdit
        initialData={{
          id: source.id,
          title: source.title,
          author: source.author,
          publisher: source.publisher,
          url: source.url,
          type: source.type,
          year: source.year,
          licenseNote: source.licenseNote,
        }}
      />
    </div>
  );
}
