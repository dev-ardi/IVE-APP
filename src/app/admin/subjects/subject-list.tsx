"use client";

import React from "react";
import Link from "next/link";
import { Edit, FolderTree, Layers } from "lucide-react";
import { ContentStatusBadge } from "@/components/admin/ui/badge";
import { TablePagination, usePagination } from "@/components/admin/ui/pagination";
import { getSubjectTheme } from "@/components/ui/subject-theme";
import type { ContentStatus } from "@prisma/client";

export interface SubjectListItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  status: ContentStatus;
  educationLevel: { name: string; slug: string };
  _count: { topics: number; lessons: number };
}

export function SubjectList({ subjects }: { subjects: SubjectListItem[] }) {
  const pagination = usePagination(subjects, 10);

  if (subjects.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Belum ada mata pelajaran terdaftar. Silakan klik tombol Tambah Mapel.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b-2 border-[#1E2024] bg-muted/50 font-mono text-muted-foreground dark:border-[#F4F1EA]">
              <th className="py-2.5 px-3">MATA PELAJARAN</th>
              <th className="py-2.5 px-3">SLUG / TEMA</th>
              <th className="py-2.5 px-3">JENJANG</th>
              <th className="py-2.5 px-3">TOPIK</th>
              <th className="py-2.5 px-3">MATERI</th>
              <th className="py-2.5 px-3">STATUS</th>
              <th className="py-2.5 px-3 text-right">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2024]/10 dark:divide-[#F4F1EA]/10">
            {pagination.paginatedData.map((subject) => {
              const theme = getSubjectTheme(subject.slug);
              const ThemeIcon = theme.icon;

              return (
                <tr key={subject.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[#1E2024]/20 ${theme.iconBg}`}
                      >
                        <ThemeIcon className={`h-4 w-4 ${theme.iconColor}`} />
                      </div>
                      <div>
                        <Link
                          href={`/admin/subjects/${subject.id}`}
                          className="font-black text-[#1E2024] hover:underline dark:text-[#F4F1EA]"
                        >
                          {subject.name}
                        </Link>
                        {subject.description && (
                          <span className="block max-w-xs truncate text-[11px] text-muted-foreground">
                            {subject.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-col gap-0.5">
                      <code className="font-mono text-[11px] text-primary font-bold">
                        /{subject.slug}
                      </code>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        Tema: {theme.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="rounded border border-border bg-card px-2 py-0.5 font-mono font-bold">
                      {subject.educationLevel.name}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <Link
                      href={`/admin/topics?subjectId=${subject.id}`}
                      className="inline-flex items-center gap-1 font-mono font-bold text-primary hover:underline"
                    >
                      <FolderTree className="h-3 w-3" />
                      <span>{subject._count.topics} topik</span>
                    </Link>
                  </td>
                  <td className="py-3 px-3">
                    <Link
                      href={`/admin/lessons?subjectId=${subject.id}`}
                      className="inline-flex items-center gap-1 font-mono font-bold text-primary hover:underline"
                    >
                      <Layers className="h-3 w-3" />
                      <span>{subject._count.lessons} materi</span>
                    </Link>
                  </td>
                  <td className="py-3 px-3">
                    <ContentStatusBadge status={subject.status} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href={`/admin/subjects/${subject.id}`}
                      className="inline-flex items-center gap-1 rounded border border-[#1E2024] bg-card px-2.5 py-1 text-xs font-bold text-[#1E2024] shadow-[1px_1px_0px_0px_#1E2024] hover:bg-muted dark:border-[#F4F1EA] dark:text-[#F4F1EA]"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Edit</span>
                    </Link>
                  </td>
                </tr>
              );
            })}
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
        itemLabel="mata pelajaran"
      />
    </div>
  );
}
