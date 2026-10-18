"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";
const labelClass = "mb-1 block text-sm font-medium";

export function NewSubjectForm({ levels }: { levels: { id: string; name: string }[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = (fd.get("name") as string).trim();
    const educationLevelId = fd.get("educationLevelId") as string;
    const description = (fd.get("description") as string).trim();

    if (!name) {
      setError("Nama mata pelajaran wajib diisi.");
      setPending(false);
      return;
    }
    if (!educationLevelId) {
      setError("Jenjang wajib dipilih.");
      setPending(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          educationLevelId,
          description: description || null,
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setError(body?.error?.message ?? "Ups, ada sedikit gangguan. Coba lagi.");
        setPending(false);
        return;
      }
      router.push("/admin/subjects");
      router.refresh();
    } catch {
      setError("Ups, ada sedikit gangguan. Coba lagi.");
      setPending(false);
    }
  }

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Buat Mata Pelajaran</h1>
        <p className="text-sm text-muted-foreground">Tambahkan mata pelajaran baru per jenjang.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="name" className={labelClass}>
            Nama
          </label>
          <input id="name" name="name" className={inputClass} placeholder="Fisika" required />
        </div>

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
          <label htmlFor="description" className={labelClass}>
            Deskripsi
          </label>
          <textarea
            id="description"
            name="description"
            className={inputClass}
            rows={3}
            placeholder="Deskripsi singkat mata pelajaran (opsional)"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 disabled:opacity-50"
          >
            {pending ? "Menyimpan…" : "Simpan"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/subjects")}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}