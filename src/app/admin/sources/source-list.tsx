"use client";

import React from "react";
import Link from "next/link";
import { Edit, ExternalLink, Layers } from "lucide-react";
import { TablePagination, usePagination } from "@/components/admin/ui/pagination";

export interface SourceListItem {
  id: string;
  title: string;
  author?: string | null;
  publisher?: string | null;
  year?: number | null;
  url?: string | null;
  type: string;
  licenseNote?: string | null;
  _count: { lessons: number };
}

export function SourceList({ sources }: { sources: SourceListItem[] }) {
  const pagination = usePagination(sources, 10);

  if (sources.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Belum ada sumber rujukan. Silakan klik tombol Tambah Sumber.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b-2 border-[#1E2024] bg-muted/50 font-mono text-muted-foreground dark:border-[#F4F1EA]">
              <th className="py-2.5 px-3">JUDUL SUMBER</th>
              <th className="py-2.5 px-3">PENULIS / PENERBIT</th>
              <th className="py-2.5 px-3">TIPE</th>
              <th className="py-2.5 px-3">TAHUN</th>
              <th className="py-2.5 px-3">TAUTAN</th>
              <th className="py-2.5 px-3">DIGUNAKAN PADA</th>
              <th className="py-2.5 px-3 text-right">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2024]/10 dark:divide-[#F4F1EA]/10">
            {pagination.paginatedData.map((source) => (
              <tr key={source.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-3 px-3">
                  <Link
                    href={`/admin/sources/${source.id}`}
                    className="font-black text-[#1E2024] hover:underline dark:text-[#F4F1EA]"
                  >
                    {source.title}
                  </Link>
                  {source.licenseNote && (
                    <span className="block max-w-xs truncate text-[11px] text-muted-foreground">
                      {source.licenseNote}
                    </span>
                  )}
                </td>
                <td className="py-3 px-3">
                  <div className="flex flex-col">
                    <span className="font-bold">{source.author || "-"}</span>
                    {source.publisher && (
                      <span className="text-[11px] text-muted-foreground">
                        {source.publisher}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className="rounded border border-border bg-card px-2 py-0.5 font-mono text-[11px] font-bold">
                    {source.type}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono">
                  {source.year || "-"}
                </td>
                <td className="py-3 px-3">
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-primary hover:underline"
                    >
                      <span>Buka</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1 font-mono font-bold text-muted-foreground">
                    <Layers className="h-3 w-3" />
                    <span>{source._count.lessons} materi</span>
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <Link
                    href={`/admin/sources/${source.id}`}
                    className="inline-flex items-center gap-1 rounded border border-[#1E2024] bg-card px-2.5 py-1 text-xs font-bold text-[#1E2024] shadow-[1px_1px_0px_0px_#1E2024] hover:bg-muted dark:border-[#F4F1EA] dark:text-[#F4F1EA]"
                  >
                    <Edit className="h-3 w-3" />
                    <span>Edit</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
        rowsPerPage={pagination.rowsPerPage}
        onPageChange={pagination.goToPage}
        onRowsPerPageChange={pagination.setRowsPerPage}
        itemLabel="sumber"
      />
    </div>
  );
}
