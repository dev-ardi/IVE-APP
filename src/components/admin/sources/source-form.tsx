"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CmsInput, CmsTextarea, CmsSelect, CmsFormField } from "@/components/admin/ui/input";
import { CmsButton } from "@/components/admin/ui/button";
import { CmsPanel } from "@/components/admin/ui/panel";
import { SourceType } from "@prisma/client";

interface SourceFormProps {
  initialData?: {
    id: string;
    title: string;
    author?: string | null;
    publisher?: string | null;
    url?: string | null;
    type?: SourceType;
    year?: number | null;
    licenseNote?: string | null;
  };
  isEdit?: boolean;
}

export function SourceForm({ initialData, isEdit = false }: SourceFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [author, setAuthor] = useState(initialData?.author || "");
  const [publisher, setPublisher] = useState(initialData?.publisher || "");
  const [url, setUrl] = useState(initialData?.url || "");
  const [type, setType] = useState<SourceType>(initialData?.type || SourceType.WEBSITE);
  const [year, setYear] = useState<string>(initialData?.year ? String(initialData.year) : "");
  const [licenseNote, setLicenseNote] = useState(initialData?.licenseNote || "");

  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Judul sumber rujukan wajib diisi.");
      return;
    }

    setIsPending(true);
    try {
      const endpoint = isEdit
        ? `/api/admin/sources/${initialData?.id}`
        : "/api/admin/sources";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim() || null,
          publisher: publisher.trim() || null,
          url: url.trim() || null,
          type,
          year: year.trim() ? parseInt(year.trim(), 10) : null,
          licenseNote: licenseNote.trim() || null,
        }),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setError(body?.error?.message || "Gagal menyimpan sumber.");
        setIsPending(false);
        return;
      }

      router.push("/admin/sources");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan.");
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-6">
      <CmsPanel title={isEdit ? `Edit Sumber: ${initialData?.title}` : "Informasi Sumber Rujukan"}>
        {error && (
          <div className="mb-4 rounded-lg border-2 border-[#FF6B6B] bg-red-50 p-3 text-xs font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <CmsFormField label="Judul Sumber Rujukan" required id="source-title">
            <CmsInput
              id="source-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Fisika Dasar untuk Universitas, Jilid 1"
            />
          </CmsFormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CmsFormField label="Penulis / Pengarang" id="source-author">
              <CmsInput
                id="source-author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Halliday, Resnick, & Walker"
              />
            </CmsFormField>

            <CmsFormField label="Penerbit / Institusi" id="source-publisher">
              <CmsInput
                id="source-publisher"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="Erlangga / Kemendikbud"
              />
            </CmsFormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CmsFormField label="Tipe Sumber" id="source-type">
              <CmsSelect
                id="source-type"
                value={type}
                onChange={(e) => setType(e.target.value as SourceType)}
              >
                <option value="BOOK">Buku (BOOK)</option>
                <option value="ARTICLE">Artikel (ARTICLE)</option>
                <option value="WEBSITE">Website (WEBSITE)</option>
                <option value="JOURNAL">Jurnal Ilmiah (JOURNAL)</option>
                <option value="GOVERNMENT">Pemerintah / Kemdikbud (GOVERNMENT)</option>
                <option value="OTHER">Lainnya (OTHER)</option>
              </CmsSelect>
            </CmsFormField>

            <CmsFormField label="Tahun Terbit" id="source-year">
              <CmsInput
                id="source-year"
                type="number"
                min={1800}
                max={2100}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2024"
              />
            </CmsFormField>
          </div>

          <CmsFormField label="Tautan / URL (opsional)" id="source-url">
            <CmsInput
              id="source-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://kemdikbud.go.id/..."
            />
          </CmsFormField>

          <CmsFormField label="Catatan Lisensi / Hak Cipta" id="source-license">
            <CmsTextarea
              id="source-license"
              rows={2}
              value={licenseNote}
              onChange={(e) => setLicenseNote(e.target.value)}
              placeholder="Materi disarikan secara orisinal berdasarkan referensi ini."
            />
          </CmsFormField>
        </div>
      </CmsPanel>

      <div className="flex items-center justify-end gap-3">
        <CmsButton
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/sources")}
        >
          Batal
        </CmsButton>
        <CmsButton type="submit" variant="primary" isLoading={isPending}>
          {isEdit ? "Simpan Perubahan" : "Simpan Sumber"}
        </CmsButton>
      </div>
    </form>
  );
}
