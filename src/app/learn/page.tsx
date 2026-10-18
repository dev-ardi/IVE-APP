import type { Metadata } from "next";
import { listLevelsWithSubjectCounts } from "@/modules/levels/service";
import { Card } from "@/components/products/card";
import { SectionTitle } from "@/components/products/section-title";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pilih Jenjang",
  description: "Pilih jenjang pendidikan untuk mulai belajar bersama IVE.",
};

export default async function LearnPage() {
  const levels = await listLevelsWithSubjectCounts();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16">
      <SectionTitle
        eyebrow="Belajar"
        title="Pilih jenjang"
        description="Pilih jenjang pendidikan untuk menjelajahi mata pelajaran yang tersedia."
      />

      {levels.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada jenjang tersedia.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {levels.map((level) => (
            <Card
              key={level.id}
              href={`/learn/${level.slug}`}
              title={level.name}
              description={level.description}
              footer={
                <span className="text-sm font-medium text-primary">
                  {level.subjectCount} mata pelajaran
                </span>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}