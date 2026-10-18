import { prisma } from "@/lib/db";
import { Result, ok, fail, ErrorCode } from "@/lib/result";

/**
 * EducationLevel repository + application service.
 * Domain module owning level retrieval (IVE_TAD_Phase_1.md §7.2, §11).
 */

export interface LevelSummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  subjectCount: number;
}

export async function listLevelsWithSubjectCounts(): Promise<LevelSummary[]> {
  const levels = await prisma.educationLevel.findMany({
    orderBy: [{ slug: "asc" }],
    select: { id: true, name: true, slug: true, description: true },
  });
  const counts = await prisma.subject.groupBy({
    by: ["educationLevelId"],
    where: { status: "PUBLISHED" },
    _count: { _all: true },
  });
  const countMap = new Map(counts.map((c) => [c.educationLevelId, c._count._all]));
  return levels.map((l) => ({
    id: l.id,
    name: l.name,
    slug: l.slug,
    description: l.description,
    subjectCount: countMap.get(l.id) ?? 0,
  }));
}

export async function getLevelBySlug(slug: string): Promise<LevelSummary | null> {
  const level = await prisma.educationLevel.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true, description: true },
  });
  if (!level) return null;
  const subjectCount = await prisma.subject.count({
    where: { educationLevelId: level.id, status: "PUBLISHED" },
  });
  return { ...level, subjectCount };
}

export async function getLevelById(id: string): Promise<LevelSummary | null> {
  const level = await prisma.educationLevel.findUnique({
    where: { id },
    select: { id: true, name: true, slug: true, description: true },
  });
  if (!level) return null;
  const subjectCount = await prisma.subject.count({
    where: { educationLevelId: level.id, status: "PUBLISHED" },
  });
  return { ...level, subjectCount };
}

/** Public lookup with explicit 404 result typing for route handlers. */
export async function findLevelBySlug(
  slug: string,
): Promise<Result<LevelSummary>> {
  const level = await getLevelBySlug(slug);
  if (!level) return fail(ErrorCode.NOT_FOUND, "Jenjang pendidikan tidak ditemukan.");
  return ok(level);
}