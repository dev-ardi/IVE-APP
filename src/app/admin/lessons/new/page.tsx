"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CONTENT_BLOCK_TYPES } from "@/modules/content/blocks";
import { INTERACTIVE_KEYS } from "@/modules/content/interactive-registry";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";
const labelClass = "mb-1 block text-sm font-medium";

type Level = { id: string; name: string; slug: string };
type Subject = { id: string; name: string; slug: string };

type BlockDraft = {
  id: string;
  type: string;
  component?: string;
  content: string;
};

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `b_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export default function NewLessonPage() {
  const router = useRouter();
  const [levels, setLevels] = useState<Level[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [blocks, setBlocks] = useState<BlockDraft[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [levelsRes, subjectsRes] = await Promise.all([
          fetch("/api/levels"),
          fetch("/api/admin/subjects"),
        ]);
        const levelsBody = await levelsRes.json().catch(() => null);
        const subjectsBody = await subjectsRes.json().catch(() => null);
        setLevels(levelsBody?.data ?? []);
        setSubjects(subjectsBody?.data ?? []);
      } catch {
        setError("Gagal memuat data jenjang/mata pelajaran.");
      }
    }
    load();
  }, []);

  function addBlock() {
    setBlocks((prev) => [...prev, { id: makeId(), type: "text", content: "" }]);
  }

  function updateBlock(id: string, patch: Partial<BlockDraft>) {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }

  function removeBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const title = (fd.get("title") as string).trim();
    const slug = (fd.get("slug") as string).trim();
    const description = (fd.get("description") as string).trim();
    const educationLevelId = fd.get("educationLevelId") as string;
    const subjectId = fd.get("subjectId") as string;
    const difficulty = fd.get("difficulty") as string;

    if (!title || !educationLevelId || !subjectId) {
      setError("Judul, jenjang, dan mata pelajaran wajib diisi.");
      setPending(false);
      return;
    }

    const content = blocks
      .map((b) => {
        const base = { id: b.id, type: b.type };
        if (b.type === "interactive") {
          return { ...base, component: b.component ?? INTERACTIVE_KEYS[0], config: parseConfig(b.content) };
        }
        try {
          const parsed = parseConfig(b.content);
          if (b.type === "heading" || b.type === "formula") {
            return { ...base, content: b.content, level: parsed.level ?? 2 };
          }
          if (b.type === "image" || b.type === "video") {
            return { ...base, src: b.content.trim(), ...parsed };
          }
          return { ...base, content: b.content };
        } catch {
          setError(`Blok ${b.type} memiliki JSON/edit yang tidak valid.`);
          setPending(false);
          return null;
        }
      })
      .filter(Boolean);

    if (content.some((c) => c === null)) {
      setPending(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slug || undefined,
          description: description || null,
          educationLevelId,
          subjectId,
          difficulty: difficulty || undefined,
          content,
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setError(body?.error?.message ?? "Ups, ada sedikit gangguan. Coba lagi.");
        setPending(false);
        return;
      }
      router.push("/admin/lessons");
      router.refresh();
    } catch {
      setError("Ups, ada sedikit gangguan. Coba lagi.");
      setPending(false);
    }
  }

  function parseConfig(raw: string): Record<string, unknown> {
    const trimmed = raw.trim();
    if (!trimmed) return {};
    return JSON.parse(trimmed);
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Buat Materi</h1>
        <p className="text-sm text-muted-foreground">
          Susun materi dari blok konten. Blok interaktif memakai kunci komponen yang terdaftar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className={labelClass}>
              Judul
            </label>
            <input id="title" name="title" className={inputClass} placeholder="Gerak Parabola" required />
          </div>
          <div>
            <label htmlFor="slug" className={labelClass}>
              Slug (opsional)
            </label>
            <input id="slug" name="slug" className={inputClass} placeholder="gerak-parabola" />
          </div>
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>
            Deskripsi
          </label>
          <textarea
            id="description"
            name="description"
            className={inputClass}
            rows={2}
            placeholder="Ringkasan materi"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="educationLevelId" className={labelClass}>
              Jenjang
            </label>
            <select id="educationLevelId" name="educationLevelId" className={inputClass} required defaultValue="">
              <option value="" disabled>
                Pilih jenjang
              </option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="subjectId" className={labelClass}>
              Mata Pelajaran
            </label>
            <select id="subjectId" name="subjectId" className={inputClass} required defaultValue="">
              <option value="" disabled>
                Pilih mata pelajaran
              </option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="difficulty" className={labelClass}>
              Kesulitan
            </label>
            <select id="difficulty" name="difficulty" className={inputClass} defaultValue="BEGINNER">
              <option value="BEGINNER">Pemula</option>
              <option value="INTERMEDIATE">Menengah</option>
              <option value="ADVANCED">Lanjutan</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Blok Konten</h2>
            <button
              type="button"
              onClick={addBlock}
              className="rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted"
            >
              + Tambah Blok
            </button>
          </div>

          {blocks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada blok. Tambahkan untuk menyusun materi.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {blocks.map((block, index) => (
                <div key={block.id} className="flex flex-col gap-2 rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={block.type}
                      onChange={(e) => updateBlock(block.id, { type: e.target.value, component: undefined })}
                      className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                      aria-label={`Tipe blok ${index + 1}`}
                    >
                      {CONTENT_BLOCK_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs text-muted-foreground">#{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeBlock(block.id)}
                      className="ml-auto rounded-md px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10"
                    >
                      Hapus
                    </button>
                  </div>

                  {block.type === "interactive" ? (
                    <div className="flex flex-col gap-2">
                      <select
                        value={block.component ?? ""}
                        onChange={(e) => updateBlock(block.id, { component: e.target.value })}
                        className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                        aria-label={`Komponen interaktif ${index + 1}`}
                      >
                        {INTERACTIVE_KEYS.map((key) => (
                          <option key={key} value={key}>
                            {key}
                          </option>
                        ))}
                      </select>
                      <textarea
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        className={inputClass}
                        rows={3}
                        placeholder='{"config": {}} — konfigurasi JSON opsional'
                      />
                    </div>
                  ) : block.type === "image" || block.type === "video" ? (
                    <input
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                      className={inputClass}
                      placeholder="https://..."
                    />
                  ) : (
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                      className={inputClass}
                      rows={3}
                      placeholder="Isi konten blok…"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 disabled:opacity-50"
          >
            {pending ? "Menyimpan…" : "Simpan Materi"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/lessons")}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}