import { prisma } from "@/lib/db";
import { Result, ok, fail, ErrorCode } from "@/lib/result";
import {
  parseContentBlocks,
  type ContentBlock,
} from "@/modules/content/blocks";

/**
 * Lesson application service (IVE_TAD_Phase_1.md §7.5, §9).
 * Public queries filter status = PUBLISHED.
 */

export interface LessonSummary {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  difficulty: string;
  durationMinutes: number | null;
  order: number;
  topicSlug: string | null;
}

export async function listLessonsByTopic(topicId: string): Promise<LessonSummary[]> {
  const lessons = await prisma.lesson.findMany({
    where: { topicId, status: "PUBLISHED" },
    orderBy: [{ order: "asc" }, { title: "asc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      coverImage: true,
      difficulty: true,
      durationMinutes: true,
      order: true,
      topic: { select: { slug: true } },
    },
  });
  return lessons.map((l) => ({
    id: l.id,
    title: l.title,
    slug: l.slug,
    description: l.description,
    coverImage: l.coverImage,
    difficulty: l.difficulty,
    durationMinutes: l.durationMinutes,
    order: l.order,
    topicSlug: l.topic?.slug ?? null,
  }));
}

export async function listLessonsBySubject(subjectId: string): Promise<LessonSummary[]> {
  const lessons = await prisma.lesson.findMany({
    where: { subjectId, status: "PUBLISHED" },
    orderBy: [{ order: "asc" }, { title: "asc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      coverImage: true,
      difficulty: true,
      durationMinutes: true,
      order: true,
      topic: { select: { slug: true } },
    },
  });
  return lessons.map((l) => ({
    id: l.id,
    title: l.title,
    slug: l.slug,
    description: l.description,
    coverImage: l.coverImage,
    difficulty: l.difficulty,
    durationMinutes: l.durationMinutes,
    order: l.order,
    topicSlug: l.topic?.slug ?? null,
  }));
}

export interface LessonDetail extends LessonSummary {
  content: ContentBlock[];
  educationLevelId: string;
  subjectId: string;
  topicId: string | null;
  subject: { name: string; slug: string };
  educationLevel: { name: string; slug: string };
  topic: { name: string; slug: string } | null;
  publishedAt: Date | null;
}

/**
 * Resolve a published lesson through its public URL path:
 * /learn/:levelSlug/:subjectSlug/:topicSlug/:lessonSlug (topicSlug may be omitted).
 */
export async function getPublishedLesson(
  opts: {
    levelSlug: string;
    subjectSlug: string;
    topicSlug?: string;
    lessonSlug: string;
  },
): Promise<LessonDetail | null> {
  const lesson = await prisma.lesson.findFirst({
    where: {
      slug: opts.lessonSlug,
      status: "PUBLISHED",
      educationLevel: { slug: opts.levelSlug },
      subject: { slug: opts.subjectSlug },
      topic: opts.topicSlug ? { slug: opts.topicSlug } : undefined,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      coverImage: true,
      difficulty: true,
      durationMinutes: true,
      order: true,
      content: true,
      educationLevelId: true,
      subjectId: true,
      topicId: true,
      publishedAt: true,
      subject: { select: { name: true, slug: true } },
      educationLevel: { select: { name: true, slug: true } },
      topic: { select: { name: true, slug: true } },
    },
  });
  if (!lesson) return null;

  const content = Array.isArray(lesson.content) ? parseContentBlocks(lesson.content) : [];
  return {
    id: lesson.id,
    title: lesson.title,
    slug: lesson.slug,
    description: lesson.description,
    coverImage: lesson.coverImage,
    difficulty: lesson.difficulty,
    durationMinutes: lesson.durationMinutes,
    order: lesson.order,
    content,
    educationLevelId: lesson.educationLevelId,
    subjectId: lesson.subjectId,
    topicId: lesson.topicId,
    publishedAt: lesson.publishedAt,
    subject: lesson.subject,
    educationLevel: lesson.educationLevel,
    topic: lesson.topic,
    topicSlug: lesson.topic?.slug ?? null,
  };
}

export async function getLessonById(id: string): Promise<LessonDetail | null> {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      coverImage: true,
      difficulty: true,
      durationMinutes: true,
      order: true,
      content: true,
      educationLevelId: true,
      subjectId: true,
      topicId: true,
      publishedAt: true,
      subject: { select: { name: true, slug: true } },
      educationLevel: { select: { name: true, slug: true } },
      topic: { select: { name: true, slug: true } },
    },
  });
  if (!lesson) return null;
  const content = Array.isArray(lesson.content) ? parseContentBlocks(lesson.content) : [];
  return { ...lesson, content, topicSlug: lesson.topic?.slug ?? null };
}

export async function findLesson(
  opts: Parameters<typeof getPublishedLesson>[0],
): Promise<Result<LessonDetail>> {
  const lesson = await getPublishedLesson(opts);
  if (!lesson) return fail(ErrorCode.NOT_FOUND, "Materi tidak ditemukan.");
  return ok(lesson);
}