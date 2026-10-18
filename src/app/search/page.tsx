import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { searchContent, type SearchResultItem } from "@/modules/search/service";
import { SearchInput } from "@/components/products/search-input";
import { SectionTitle } from "@/components/products/section-title";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cari Materi",
  description: "Cari materi, topik, dan mata pelajaran di IVE.",
};

const KIND_LABELS: Record<SearchResultItem["kind"], string> = {
  lesson: "Materi",
  subject: "Mata Pelajaran",
  topic: "Topik",
};

function SearchResults({ q }: { q: string }) {
  return <SearchResultsInner q={q} />;
}

async function SearchResultsInner({ q }: { q: string }) {
  const results = await searchContent(q);

  if (results.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Belum menemukan materi yang cocok.</p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {results.map((item) => (
        <li key={`${item.kind}-${item.id}`}>
          <Link
            href={item.url}
            className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4 transition hover:border-primary/50 hover:bg-muted/40"
          >
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {KIND_LABELS[item.kind]}
              </span>
              {item.levelName ? (
                <span className="text-xs text-muted-foreground">{item.levelName}</span>
              ) : null}
            </div>
            <span className="font-semibold tracking-tight">{item.title}</span>
            {item.description ? (
              <span className="text-sm text-muted-foreground">{item.description}</span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16">
      <SectionTitle
        eyebrow="Cari"
        title="Telusuri materi"
        description="Temukan materi, topik, atau mata pelajaran yang kamu butuhkan."
      />

      <Suspense fallback={null}>
        <SearchInput />
      </Suspense>

      {query ? (
        <Suspense fallback={<p className="text-sm text-muted-foreground">Mencari…</p>}>
          <SearchResults q={query} />
        </Suspense>
      ) : null}
    </div>
  );
}