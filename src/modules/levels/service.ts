import { prisma } from "@/lib/db";
import { Result, ok, fail, ErrorCode } from "@/lib/result";
import { getDummyLevels, getDummySubjects } from "@/data/dummy-data";

/**
 * EducationLevel repository + application service.
 * Domain module owning level retrieval (IVE_TAD_Phase_1.md §7.2, §11).
 * In Phase 1, only active levels (Umum) are listed publicly.
 */

export interface LevelSummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  subjectCount: number;
}

export async function listLevelsWithSubjectCounts(): Promise<LevelSummary[]> {
  try {
    const levels = await prisma.educationLevel.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { slug: "asc" }],
      select: { id: true, name: true, slug: true, description: true },
    });

    if (levels.length > 0) {
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
  } catch (error) {
    console.warn("Database not accessible, using dummy level data:", error);
  }

  // Fallback to active dummy levels
  const dummySubjects = getDummySubjects("umum");
  return getDummyLevels()
    .filter((l) => l.isActive)
    .map((l) => ({
      id: l.id,
      name: l.name,
      slug: l.slug,
      description: l.description,
      subjectCount: dummySubjects.length,
    }));
}

export async function getLevelBySlug(slug: string): Promise<LevelSummary | null> {
  try {
    const level = await prisma.educationLevel.findUnique({
      where: { slug, isActive: true },
      select: { id: true, name: true, slug: true, description: true },
    });
    if (level) {
      const subjectCount = await prisma.subject.count({
        where: { educationLevelId: level.id, status: "PUBLISHED" },
      });
      return { ...level, subjectCount };
    }
  } catch (error) {
    console.warn("Database not accessible, using dummy level lookup:", error);
  }

  const dummyLevel = getDummyLevels().find((l) => l.slug === slug && l.isActive);
  if (!dummyLevel) return null;
  const dummySubjects = getDummySubjects(slug);
  return {
    id: dummyLevel.id,
    name: dummyLevel.name,
    slug: dummyLevel.slug,
    description: dummyLevel.description,
    subjectCount: dummySubjects.length,
  };
}

export async function getLevelById(id: string): Promise<LevelSummary | null> {
  try {
    const level = await prisma.educationLevel.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true, description: true },
    });
    if (level) {
      const subjectCount = await prisma.subject.count({
        where: { educationLevelId: level.id, status: "PUBLISHED" },
      });
      return { ...level, subjectCount };
    }
  } catch (error) {
    console.warn("Database not accessible, using dummy level lookup by id:", error);
  }

  const dummyLevel = getDummyLevels().find((l) => l.id === id);
  if (!dummyLevel) return null;
  const dummySubjects = getDummySubjects(dummyLevel.slug);
  return {
    id: dummyLevel.id,
    name: dummyLevel.name,
    slug: dummyLevel.slug,
    description: dummyLevel.description,
    subjectCount: dummySubjects.length,
  };
}

/** Public lookup with explicit 404 result typing for route handlers. */
export async function findLevelBySlug(
  slug: string,
): Promise<Result<LevelSummary>> {
  const level = await getLevelBySlug(slug);
  if (!level) return fail(ErrorCode.NOT_FOUND, "Jenjang pendidikan tidak ditemukan.");
  return ok(level);
}