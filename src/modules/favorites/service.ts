import { prisma } from "@/lib/db";
import { Result, ok, fail, ErrorCode } from "@/lib/result";

/**
 * Favorites service (IVE_TAD_Phase_1.md §7.10).
 */

export interface FavoriteLesson {
  lessonId: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  createdAt: Date;
  subject: { name: string; slug: string } | null;
  educationLevel: { name: string; slug: string } | null;
}

export async function listFavorites(userId: string): Promise<FavoriteLesson[]> {
  const rows = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      lessonId: true,
      createdAt: true,
      lesson: {
        select: {
          title: true,
          slug: true,
          description: true,
          coverImage: true,
          subject: { select: { name: true, slug: true } },
          educationLevel: { select: { name: true, slug: true } },
        },
      },
    },
  });
  return rows
    .filter((r) => r.lesson)
    .map((r) => ({
      lessonId: r.lessonId,
      title: r.lesson.title,
      slug: r.lesson.slug,
      description: r.lesson.description,
      coverImage: r.lesson.coverImage,
      createdAt: r.createdAt,
      subject: r.lesson.subject,
      educationLevel: r.lesson.educationLevel,
    }));
}

export async function isFavorite(userId: string, lessonId: string): Promise<boolean> {
  const row = await prisma.favorite.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
    select: { id: true },
  });
  return Boolean(row);
}

export async function addFavorite(userId: string, lessonId: string): Promise<Result<boolean>> {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, status: true },
  });
  if (!lesson || lesson.status !== "PUBLISHED") {
    return fail(ErrorCode.NOT_FOUND, "Materi tidak ditemukan.");
  }
  await prisma.favorite.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: {},
    create: { userId, lessonId },
  });
  return ok(true);
}

export async function removeFavorite(userId: string, lessonId: string): Promise<Result<boolean>> {
  await prisma.favorite.deleteMany({ where: { userId, lessonId } });
  return ok(true);
}