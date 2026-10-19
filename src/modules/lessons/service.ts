import { prisma } from "@/lib/db";
import { Result, ok, fail, ErrorCode } from "@/lib/result";
import {
  parseContentBlocks,
  type ContentBlock,
} from "@/modules/content/blocks";
import {
  DUMMY_DATA,
  getDummyLessonBySlug,
  getDummyLessonDetail,
  getDummyLessonsBySubject,
  getDummyLessonsByTopic,
} from "@/data/dummy-data";

/**
 * Lesson application service (IVE_TAD_Phase_1.md §7.5, §8.5, §9).
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
  subjectSlug?: string | null;
  kind?: string;
}

export interface LessonSourceView {
  title: string;
  author?: string;
  publisher?: string;
  year?: number;
  citationNote?: string;
  url?: string;
}

export async function listLessonsByTopic(topicIdOrSlug: string): Promise<LessonSummary[]> {
  try {
    const lessons = await prisma.lesson.findMany({
      where: {
        status: "PUBLISHED",
        OR: [{ topicId: topicIdOrSlug }, { topic: { slug: topicIdOrSlug } }],
      },
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
        kind: true,
        topic: { select: { slug: true } },
        subject: { select: { slug: true } },
      },
    });

    if (lessons.length > 0) {
      return lessons.map((l) => ({
        id: l.id,
        title: l.title,
        slug: l.slug,
        description: l.description,
        coverImage: l.coverImage,
        difficulty: l.difficulty,
        durationMinutes: l.durationMinutes,
        order: l.order,
        kind: l.kind,
        topicSlug: l.topic?.slug ?? null,
        subjectSlug: l.subject?.slug ?? null,
      }));
    }
  } catch (error) {
    console.warn("Database not accessible, using dummy lessons list by topic:", error);
  }

  const dummy = getDummyLessonsByTopic(topicIdOrSlug);
  return dummy.map((l) => ({
    id: l.id,
    title: l.title,
    slug: l.slug,
    description: l.description,
    coverImage: l.thumbnail,
    difficulty: l.difficulty,
    durationMinutes: l.durationMinutes,
    order: 1,
    kind: l.kind,
    topicSlug: l.topicSlug,
    subjectSlug: l.subjectSlug,
  }));
}

export async function listLessonsBySubject(subjectIdOrSlug: string): Promise<LessonSummary[]> {
  try {
    const lessons = await prisma.lesson.findMany({
      where: {
        status: "PUBLISHED",
        OR: [{ subjectId: subjectIdOrSlug }, { subject: { slug: subjectIdOrSlug } }],
      },
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
        kind: true,
        topic: { select: { slug: true } },
        subject: { select: { slug: true } },
      },
    });

    if (lessons.length > 0) {
      return lessons.map((l) => ({
        id: l.id,
        title: l.title,
        slug: l.slug,
        description: l.description,
        coverImage: l.coverImage,
        difficulty: l.difficulty,
        durationMinutes: l.durationMinutes,
        order: l.order,
        kind: l.kind,
        topicSlug: l.topic?.slug ?? null,
        subjectSlug: l.subject?.slug ?? null,
      }));
    }
  } catch (error) {
    console.warn("Database not accessible, using dummy lessons list by subject:", error);
  }

  const dummy = getDummyLessonsBySubject(subjectIdOrSlug);
  return dummy.map((l) => ({
    id: l.id,
    title: l.title,
    slug: l.slug,
    description: l.description,
    coverImage: l.thumbnail,
    difficulty: l.difficulty,
    durationMinutes: l.durationMinutes,
    order: 1,
    kind: l.kind,
    topicSlug: l.topicSlug,
    subjectSlug: l.subjectSlug,
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
  sources?: LessonSourceView[];
  interactiveKey?: string;
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
  try {
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
        kind: true,
        educationLevelId: true,
        subjectId: true,
        topicId: true,
        publishedAt: true,
        subject: { select: { name: true, slug: true } },
        educationLevel: { select: { name: true, slug: true } },
        topic: { select: { name: true, slug: true } },
        sources: {
          select: {
            citationNote: true,
            source: {
              select: {
                title: true,
                author: true,
                publisher: true,
                year: true,
                url: true,
              },
            },
          },
        },
      },
    });

    if (lesson) {
      const content = Array.isArray(lesson.content) ? parseContentBlocks(lesson.content) : [];
      const sources: LessonSourceView[] = lesson.sources.map((ls) => ({
        title: ls.source.title,
        author: ls.source.author ?? undefined,
        publisher: ls.source.publisher ?? undefined,
        year: ls.source.year ?? undefined,
        citationNote: ls.citationNote ?? undefined,
        url: ls.source.url ?? undefined,
      }));

      return {
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        description: lesson.description,
        coverImage: lesson.coverImage,
        difficulty: lesson.difficulty,
        durationMinutes: lesson.durationMinutes,
        order: lesson.order,
        kind: lesson.kind,
        content,
        educationLevelId: lesson.educationLevelId,
        subjectId: lesson.subjectId,
        topicId: lesson.topicId,
        publishedAt: lesson.publishedAt,
        subject: lesson.subject,
        educationLevel: lesson.educationLevel,
        topic: lesson.topic,
        topicSlug: lesson.topic?.slug ?? null,
        subjectSlug: lesson.subject.slug,
        sources,
      };
    }
  } catch (error) {
    console.warn("Database not accessible, using dummy lesson lookup:", error);
  }

  // Fallback to dummy lesson
  const dummy = getDummyLessonBySlug(opts);
  if (!dummy) return null;

  const subject = DUMMY_DATA.subjects.find((s) => s.slug === dummy.subjectSlug);
  const level = DUMMY_DATA.levels.find((l) => l.slug === dummy.levelSlug);
  const topic = DUMMY_DATA.topics.find((t) => t.slug === dummy.topicSlug);

  return {
    id: dummy.id,
    title: dummy.title,
    slug: dummy.slug,
    description: dummy.description,
    coverImage: dummy.thumbnail,
    difficulty: dummy.difficulty,
    durationMinutes: dummy.durationMinutes,
    order: 1,
    kind: dummy.kind,
    content: dummy.content,
    educationLevelId: level?.id ?? "lvl-umum",
    subjectId: subject?.id ?? "sub-1",
    topicId: topic?.id ?? "top-1",
    publishedAt: new Date("2026-10-19"),
    educationLevel: { name: level?.name ?? "Umum", slug: level?.slug ?? "umum" },
    subject: { name: subject?.name ?? dummy.subjectSlug, slug: dummy.subjectSlug },
    topic: topic ? { name: topic.name, slug: topic.slug } : null,
    topicSlug: dummy.topicSlug,
    subjectSlug: dummy.subjectSlug,
    interactiveKey: dummy.interactiveKey,
    sources: dummy.sources,
  };
}

export async function getLessonById(id: string): Promise<LessonDetail | null> {
  try {
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
        kind: true,
        educationLevelId: true,
        subjectId: true,
        topicId: true,
        publishedAt: true,
        subject: { select: { name: true, slug: true } },
        educationLevel: { select: { name: true, slug: true } },
        topic: { select: { name: true, slug: true } },
      },
    });

    if (lesson) {
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
        kind: lesson.kind,
        content,
        educationLevelId: lesson.educationLevelId,
        subjectId: lesson.subjectId,
        topicId: lesson.topicId,
        publishedAt: lesson.publishedAt,
        subject: lesson.subject,
        educationLevel: lesson.educationLevel,
        topic: lesson.topic,
        topicSlug: lesson.topic?.slug ?? null,
        subjectSlug: lesson.subject.slug,
      };
    }
  } catch (error) {
    console.warn("Database not accessible, using dummy lookup by id:", error);
  }

  return getDummyLessonDetail(id);
}

export async function listAllPublishedLessons(): Promise<LessonSummary[]> {
  try {
    const lessons = await prisma.lesson.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ updatedAt: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        coverImage: true,
        difficulty: true,
        durationMinutes: true,
        order: true,
        kind: true,
        topic: { select: { slug: true } },
        subject: { select: { slug: true } },
      },
    });

    if (lessons.length > 0) {
      return lessons.map((l) => ({
        id: l.id,
        title: l.title,
        slug: l.slug,
        description: l.description,
        coverImage: l.coverImage,
        difficulty: l.difficulty,
        durationMinutes: l.durationMinutes,
        order: l.order,
        kind: l.kind,
        topicSlug: l.topic?.slug ?? null,
        subjectSlug: l.subject?.slug ?? null,
      }));
    }
  } catch (error) {
    console.warn("Database not accessible, using all dummy lessons:", error);
  }

  return DUMMY_DATA.lessons.map((l) => ({
    id: l.id,
    title: l.title,
    slug: l.slug,
    description: l.description,
    coverImage: l.thumbnail,
    difficulty: l.difficulty,
    durationMinutes: l.durationMinutes,
    order: 1,
    kind: l.kind,
    topicSlug: l.topicSlug,
    subjectSlug: l.subjectSlug,
  }));
}

export async function findPublishedLesson(
  opts: {
    levelSlug: string;
    subjectSlug: string;
    topicSlug?: string;
    lessonSlug: string;
  },
): Promise<Result<LessonDetail>> {
  const lesson = await getPublishedLesson(opts);
  if (!lesson) return fail(ErrorCode.NOT_FOUND, "Materi tidak ditemukan.");
  return ok(lesson);
}