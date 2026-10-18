import Link from "next/link";
import { listLevelsWithSubjectCounts } from "@/modules/levels/service";
import { Card } from "@/components/products/card";
import { SectionTitle } from "@/components/products/section-title";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const levels = await listLevelsWithSubjectCounts();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-12 sm:px-6 sm:py-16">
      <section className="flex flex-col items-center gap-6 text-center">
        <span className="rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-foreground/80">
          Belajar visual, interaktif, dan terukur
        </span>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Belajar lebih berkesan dengan IVE
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          Temukan materi pelajaran dalam bahasa Indonesia yang divisualisasikan, interaktif, dan
          dirancang agar mudah dipahami.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/learn"
            className="rounded-xl bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground transition hover:bg-primary/80"
          >
            Mulai Belajar
          </Link>
          <Link
            href="/search"
            className="rounded-xl border border-border px-6 py-3 text-center text-sm font-semibold transition hover:bg-muted"
          >
            Cari Materi
          </Link>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <SectionTitle
          eyebrow="Jenjang Pendidikan"
          title="Pilih jenjang"
          description="Mulai dari jenjang yang sesuai dengan kamu dan temukan mata pelajaran yang tersedia."
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
      </section>
    </div>
  );
}