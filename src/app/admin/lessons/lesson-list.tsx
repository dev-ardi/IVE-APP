"use client";

import Link from "next/link";
import { ActionButton } from "@/components/admin/action-button";
import { StatusBadge, DifficultyBadge } from "@/components/admin/status-badge";
import type { Difficulty, ContentStatus } from "@prisma/client";

type LessonRow = {
  id: string;
  title: string;
  slug: string;
  status: ContentStatus;
  difficulty: Difficulty;
  subject: { name: string };
  _count: { questions: number };
};

export function LessonList({ lessons }: { lessons: LessonRow[] }) {
  if (lessons.length === 0) {
    return (
      <div className="rounded-xl border border-border p-6 text-sm text-muted-foreground">
        Belum ada materi.
      </div>
    );
  }

  const actionClass =
    "rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition hover:bg-muted";
  const publishClass =
    "rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground transition hover:bg-primary/80";

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Judul</th>
            <th className="px-4 py-3 font-medium">Mata Pelajaran</th>
            <th className="px-4 py-3 font-medium">Kesulitan</th>
            <th className="px-4 py-3 font-medium">Soal</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {lessons.map((lesson) => (
            <tr key={lesson.id}>
              <td className="px-4 py-3 font-medium">{lesson.title}</td>
              <td className="px-4 py-3 text-muted-foreground">{lesson.subject.name}</td>
              <td className="px-4 py-3">
                <DifficultyBadge difficulty={lesson.difficulty} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">{lesson._count.questions}</td>
              <td className="px-4 py-3">
                <StatusBadge status={lesson.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {lesson.status === "PUBLISHED" ? (
                    <ActionButton
                      endpoint={`/api/admin/lessons/${lesson.id}/publish`}
                      method="DELETE"
                      className={actionClass}
                    >
                      Batalkan Publish
                    </ActionButton>
                  ) : (
                    <ActionButton
                      endpoint={`/api/admin/lessons/${lesson.id}/publish`}
                      method="POST"
                      className={publishClass}
                    >
                      Publish
                    </ActionButton>
                  )}
                  {lesson.status !== "ARCHIVED" && (
                    <ActionButton
                      endpoint={`/api/admin/lessons/${lesson.id}`}
                      method="DELETE"
                      confirmText="Arsipkan materi ini? (dapat dipulihkan)"
                      className={actionClass}
                    >
                      Arsipkan
                    </ActionButton>
                  )}
                  <Link
                    href={`/admin/lessons/${lesson.id}/questions`}
                    className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition hover:bg-muted"
                  >
                    Soal
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}