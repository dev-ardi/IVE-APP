"use client";

import React from "react";
import Link from "next/link";
import { Edit, Layers, HelpCircle } from "lucide-react";
import { ContentStatusBadge } from "@/components/admin/ui/badge";
import { TablePagination, usePagination } from "@/components/admin/ui/pagination";
import type { ContentStatus } from "@prisma/client";

export interface TopicListItem {
  id: string;
  name: string;
  slug: string;
  order: number;
  description?: string | null;
  status: ContentStatus;
  subject: { name: string; slug: string };
  _count: { lessons: number; questions: number };
}

export function TopicList({ topics }: { topics: TopicListItem[] }) {
  const pagination = usePagination(topics, 10);

  if (topics.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Belum ada topik pada filter yang dipilih. Silakan klik tombol Tambah Topik.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b-2 border-[#1E2024] bg-muted/50 font-mono text-muted-foreground dark:border-[#F4F1EA]">
              <th className="py-2.5 px-3">NAMA TOPIK</th>
              <th className="py-2.5 px-3">MATA PELAJARAN</th>
              <th className="py-2.5 px-3">SLUG</th>
              <th className="py-2.5 px-3">URUTAN</th>
              <th className="py-2.5 px-3">MATERI</th>
              <th className="py-2.5 px-3">SOAL</th>
              <th className="py-2.5 px-3">STATUS</th>
              <th className="py-2.5 px-3 text-right">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2024]/10 dark:divide-[#F4F1EA]/10">
            {pagination.paginatedData.map((topic) => (
              <tr key={topic.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-3">
                    <Link
                      href={`/admin/topics/${topic.id}`}
                      className="font-black text-[#1E2024] hover:underline dark:text-[#F4F1EA]"
                    >
                      {topic.name}
                    </Link>
                    {topic.description && (
                      <span className="block max-w-xs truncate text-[11px] text-muted-foreground">
                        {topic.description}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            topic.subject.slug === "matematika"
                              ? "#2563EB"
                              : topic.subject.slug === "fisika"
                                ? "#0891B2"
                                : topic.subject.slug === "kimia"
                                  ? "#7C3AED"
                                  : topic.subject.slug === "biologi"
                                    ? "#059669"
                                    : "#D97706",
                        }}
                      />
                      <span className="font-bold">{topic.subject.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-muted-foreground">
                    /{topic.slug}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold">
                    #{topic.order}
                  </td>
                  <td className="py-3 px-3">
                    <Link
                      href={`/admin/lessons?topicId=${topic.id}`}
                      className="inline-flex items-center gap-1 font-mono font-bold text-primary hover:underline"
                    >
                      <Layers className="h-3 w-3" />
                      <span>{topic._count.lessons} materi</span>
                    </Link>
                  </td>
                  <td className="py-3 px-3">
                    <Link
                      href={`/admin/questions?topicId=${topic.id}`}
                      className="inline-flex items-center gap-1 font-mono font-bold text-primary hover:underline"
                    >
                      <HelpCircle className="h-3 w-3" />
                      <span>{topic._count.questions} soal</span>
                    </Link>
                  </td>
                  <td className="py-3 px-3">
                    <ContentStatusBadge status={topic.status} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href={`/admin/topics/${topic.id}`}
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
        itemLabel="topik"
      />
    </div>
  );
}
