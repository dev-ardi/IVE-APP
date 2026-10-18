import { prisma } from "@/lib/db";
import { Result, ok, fail, ErrorCode } from "@/lib/result";

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
  const level = await prisma.educationLevel.findUnique({
    where: { slug: levelSlug },
    select: { id: true },
  });
  if (!level) return [];

  const subjects = await prisma.subject.findMany({
    where: { educationLevelId: level.id, status: "PUBLISHED" },
    orderBy: { name: "asc" },
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

export interface SubjectDetail extends SubjectSummary {
  educationLevel: { id: string; name: string; slug: string };
}

export async function getSubjectBySlug(
  levelSlug: string,
  subjectSlug: string,
): Promise<SubjectDetail | null> {
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
  if (!subject) return null;
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

export async function findSubject(
  levelSlug: string,
  subjectSlug: string,
): Promise<Result<SubjectDetail>> {
  const subject = await getSubjectBySlug(levelSlug, subjectSlug);
  if (!subject) return fail(ErrorCode.NOT_FOUND, "Mata pelajaran tidak ditemukan.");
  return ok(subject);
}