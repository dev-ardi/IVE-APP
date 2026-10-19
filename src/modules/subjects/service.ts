import { prisma } from "@/lib/db";
import { Result, ok, fail, ErrorCode } from "@/lib/result";
import { getDummySubjects, getDummySubjectBySlug } from "@/data/dummy-data";

/**
 * Subject application service (IVE_TAD_Phase_1.md §7.3).
 * Public queries filter status = PUBLISHED.
 */

export interface SubjectSummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  coverImage: string | null;
  topicCount: number;
  lessonCount: number;
}

export async function listSubjectsByLevel(levelSlug: string): Promise<SubjectSummary[]> {
  try {
    const level = await prisma.educationLevel.findUnique({
      where: { slug: levelSlug },
      select: { id: true },
    });
    if (level) {
      const subjects = await prisma.subject.findMany({
        where: { educationLevelId: level.id, status: "PUBLISHED" },
        orderBy: { order: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          icon: true,
          coverImage: true,
          _count: { select: { topics: true, lessons: { where: { status: "PUBLISHED" } } } },
        },
      });

      if (subjects.length > 0) {
        return subjects.map((s) => ({
          id: s.id,
          name: s.name,
          slug: s.slug,
          description: s.description,
          icon: s.icon,
          coverImage: s.coverImage,
          topicCount: s._count.topics,
          lessonCount: s._count.lessons,
        }));
      }
    }
  } catch (error) {
    console.warn("Database not accessible, using dummy subject list:", error);
  }

  // Fallback to dummy data
  const dummy = getDummySubjects(levelSlug);
  return dummy.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    description: s.description,
    icon: s.icon,
    coverImage: null,
    topicCount: 1,
    lessonCount: s.lessonCount ?? 1,
  }));
}

export interface SubjectDetail extends SubjectSummary {
  educationLevel: { id: string; name: string; slug: string };
}

export async function getSubjectBySlug(
  levelSlug: string,
  subjectSlug: string,
): Promise<SubjectDetail | null> {
  try {
    const subject = await prisma.subject.findFirst({
      where: {
        slug: subjectSlug,
        status: "PUBLISHED",
        educationLevel: { slug: levelSlug },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        coverImage: true,
        educationLevel: { select: { id: true, name: true, slug: true } },
        _count: { select: { topics: true, lessons: { where: { status: "PUBLISHED" } } } },
      },
    });

    if (subject) {
      return {
        id: subject.id,
        name: subject.name,
        slug: subject.slug,
        description: subject.description,
        icon: subject.icon,
        coverImage: subject.coverImage,
        topicCount: subject._count.topics,
        lessonCount: subject._count.lessons,
        educationLevel: subject.educationLevel,
      };
    }
  } catch (error) {
    console.warn("Database not accessible, using dummy subject lookup:", error);
  }

  const dummy = getDummySubjectBySlug(levelSlug, subjectSlug);
  if (!dummy) return null;

  return {
    id: dummy.id,
    name: dummy.name,
    slug: dummy.slug,
    description: dummy.description,
    icon: dummy.icon,
    coverImage: null,
    topicCount: 1,
    lessonCount: dummy.lessonCount ?? 1,
    educationLevel: { id: "lvl-umum", name: "Umum", slug: "umum" },
  };
}

export async function getSubjectById(id: string): Promise<SubjectDetail | null> {
  try {
    const subject = await prisma.subject.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        coverImage: true,
        educationLevel: { select: { id: true, name: true, slug: true } },
        _count: { select: { topics: true, lessons: { where: { status: "PUBLISHED" } } } },
      },
    });
    if (subject) {
      return {
        id: subject.id,
        name: subject.name,
        slug: subject.slug,
        description: subject.description,
        icon: subject.icon,
        coverImage: subject.coverImage,
        topicCount: subject._count.topics,
        lessonCount: subject._count.lessons,
        educationLevel: subject.educationLevel,
      };
    }
  } catch (error) {
    console.warn("Database not accessible, using dummy subject lookup by id:", error);
  }

  const dummy = getDummySubjects("umum").find((s) => s.id === id);
  if (!dummy) return null;
  return {
    id: dummy.id,
    name: dummy.name,
    slug: dummy.slug,
    description: dummy.description,
    icon: dummy.icon,
    coverImage: null,
    topicCount: 1,
    lessonCount: dummy.lessonCount ?? 1,
    educationLevel: { id: "lvl-umum", name: "Umum", slug: "umum" },
  };
}

export async function findSubjectBySlug(
  levelSlug: string,
  subjectSlug: string,
): Promise<Result<SubjectDetail>> {
  const subject = await getSubjectBySlug(levelSlug, subjectSlug);
  if (!subject) return fail(ErrorCode.NOT_FOUND, "Mata pelajaran tidak ditemukan.");
  return ok(subject);
}