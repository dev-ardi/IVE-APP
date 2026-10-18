import { z } from "zod";
import { prisma } from "@/lib/db";
import { Result, ok, fail, ErrorCode } from "@/lib/result";

/**
 * Progress service (IVE_TAD_Phase_1.md §7.8, §20).
 * Authenticated progress is persisted; guest progress is client-local (localStorage).
 * Completion: completed = true AND progress = 100.
 * Never overwrite better server progress with worse local progress.
 */

export const progressUpdateSchema = z.object({
  lessonId: z.string().min(1),
  progress: z.number().int().min(0).max(100).optional(),
  completed: z.boolean().optional(),
  lastPosition: z.number().int().min(0).optional(),
});

export type ProgressUpdateInput = z.infer<typeof progressUpdateSchema>;

export interface ProgressView {
  lessonId: string;
  progress: number;
  completed: boolean;
  lastPosition: number | null;
  updatedAt: Date;
}

export async function listProgress(userId: string): Promise<ProgressView[]> {
  const rows = await prisma.userProgress.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: { lessonId: true, progress: true, completed: true, lastPosition: true, updatedAt: true },
  });
  return rows.map((r) => ({
    lessonId: r.lessonId,
    progress: r.progress,
    completed: r.completed,
    lastPosition: r.lastPosition,
    updatedAt: r.updatedAt,
  }));
}

export async function getProgress(userId: string, lessonId: string): Promise<ProgressView | null> {
  const row = await prisma.userProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
    select: { lessonId: true, progress: true, completed: true, lastPosition: true, updatedAt: true },
  });
  if (!row) return null;
  return {
    lessonId: row.lessonId,
    progress: row.progress,
    completed: row.completed,
    lastPosition: row.lastPosition,
    updatedAt: row.updatedAt,
  };
}

export async function upsertProgress(
  userId: string,
  input: ProgressUpdateInput,
): Promise<Result<ProgressView>> {
  const lesson = await prisma.lesson.findUnique({
    where: { id: input.lessonId },
    select: { id: true, status: true },
  });
  if (!lesson || lesson.status !== "PUBLISHED") {
    return fail(ErrorCode.NOT_FOUND, "Materi tidak ditemukan.");
  }

  const existing = await getProgress(userId, input.lessonId);

  // Merge: never regress progress (§20).
  const progress =
    input.progress !== undefined
      ? Math.max(input.progress, existing?.progress ?? 0)
      : existing?.progress ?? 0;

  const completed =
    input.completed === true
      ? true
      : progress >= 100
        ? true
        : (existing?.completed ?? false);

  const lastPosition =
    input.lastPosition !== undefined
      ? input.lastPosition
      : existing?.lastPosition ?? null;

  const row = await prisma.userProgress.upsert({
    where: { userId_lessonId: { userId, lessonId: input.lessonId } },
    update: { progress, completed, lastPosition },
    create: { userId, lessonId: input.lessonId, progress, completed, lastPosition },
    select: { lessonId: true, progress: true, completed: true, lastPosition: true, updatedAt: true },
  });

  return ok({
    lessonId: row.lessonId,
    progress: row.progress,
    completed: row.completed,
    lastPosition: row.lastPosition,
    updatedAt: row.updatedAt,
  });
}