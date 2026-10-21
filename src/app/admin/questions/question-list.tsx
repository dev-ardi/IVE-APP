"use client";

import React from "react";
import Link from "next/link";
import { Edit, Layers } from "lucide-react";
import { ContentStatusBadge, DifficultyBadge } from "@/components/admin/ui/badge";
import { TablePagination, usePagination } from "@/components/admin/ui/pagination";
import type { Difficulty, ContentStatus } from "@prisma/client";

export interface QuestionListItem {
  id: string;
  question: string;
  options: unknown;
  correctAnswer: string;
  difficulty: Difficulty;
  status: ContentStatus;
  topic?: { id: string; name: string } | null;
  lesson?: { id: string; title: string; slug: string } | null;
}

export function QuestionList({ questions }: { questions: QuestionListItem[] }) {
  const pagination = usePagination(questions, 10);

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Belum ada soal pada filter yang dipilih. Silakan klik tombol Tambah Soal.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b-2 border-[#1E2024] bg-muted/50 font-mono text-muted-foreground dark:border-[#F4F1EA]">
              <th className="py-2.5 px-3">PERTANYAAN</th>
              <th className="py-2.5 px-3">TOPIK / MATERI</th>
              <th className="py-2.5 px-3">KUNCI JAWABAN</th>
              <th className="py-2.5 px-3">KESULITAN</th>
              <th className="py-2.5 px-3">STATUS</th>
              <th className="py-2.5 px-3 text-right">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2024]/10 dark:divide-[#F4F1EA]/10">
            {pagination.paginatedData.map((q) => {
              const opts = (Array.isArray(q.options) ? q.options : []) as Array<{
                id: string;
                text: string;
              }>;
              const correctOpt = opts.find((o) => o.id === q.correctAnswer);

              return (
                <tr key={q.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-3 max-w-sm">
                    <Link
                      href={`/admin/questions/${q.id}`}
                      className="font-black text-[#1E2024] hover:underline line-clamp-2 dark:text-[#F4F1EA]"
                    >
                      {q.question}
                    </Link>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {opts.length} opsi pilihan
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-col">
                      <span className="font-bold">{q.topic?.name || "-"}</span>
                      {q.lesson && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Layers className="h-3 w-3" />
                          <span>{q.lesson.title}</span>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded bg-[#7BE0A4] px-1.5 py-0.5 text-[10px] font-black text-stone-900">
                        {q.correctAnswer}
                      </span>
                      <span className="truncate max-w-[150px] font-medium text-muted-foreground">
                        {correctOpt?.text}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <DifficultyBadge difficulty={q.difficulty} />
                  </td>
                  <td className="py-3 px-3">
                    <ContentStatusBadge status={q.status} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href={`/admin/questions/${q.id}`}
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
        itemLabel="soal"
      />
    </div>
  );
}
