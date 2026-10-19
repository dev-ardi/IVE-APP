import { prisma } from "@/lib/db";
import { Result, ok, fail, ErrorCode } from "@/lib/result";
import { getDummyTopicsBySubject, getDummyTopicBySlug, DUMMY_DATA } from "@/data/dummy-data";

/**
 * Topic application service (IVE_TAD_Phase_1.md §7.4).
 * Public queries filter status = PUBLISHED on lessons.
 */

export interface TopicSummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  lessonCount: number;
}

export async function listTopicsBySubject(subjectIdOrSlug: string): Promise<TopicSummary[]> {
  try {
    const topics = await prisma.topic.findMany({
      where: {
        OR: [{ subjectId: subjectIdOrSlug }, { subject: { slug: subjectIdOrSlug } }],
      },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        order: true,
        _count: { select: { lessons: { where: { status: "PUBLISHED" } } } },
      },
    });

    if (topics.length > 0) {
      return topics.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        description: t.description,
        order: t.order,
        lessonCount: t._count.lessons,
      }));
    }
  } catch (error) {
    console.warn("Database not accessible, using dummy topics list:", error);
  }

  // Find matching subject in dummy
  const subject = DUMMY_DATA.subjects.find(
    (s) => s.id === subjectIdOrSlug || s.slug === subjectIdOrSlug
  );
  if (!subject) return [];

  const dummyTopics = getDummyTopicsBySubject(subject.slug);
  return dummyTopics.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description,
    order: t.order,
    lessonCount: t.lessonCount ?? 1,
  }));
}

export interface TopicDetail extends TopicSummary {
  subjectId: string;
}

export async function getTopicBySlug(
  subjectIdOrSlug: string,
  topicSlug: string,
): Promise<TopicDetail | null> {
  try {
    const topic = await prisma.topic.findFirst({
      where: {
        slug: topicSlug,
        OR: [{ subjectId: subjectIdOrSlug }, { subject: { slug: subjectIdOrSlug } }],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        order: true,
        subjectId: true,
        _count: { select: { lessons: { where: { status: "PUBLISHED" } } } },
      },
    });

    if (topic) {
      return {
        id: topic.id,
        name: topic.name,
        slug: topic.slug,
        description: topic.description,
        order: topic.order,
        subjectId: topic.subjectId,
        lessonCount: topic._count.lessons,
      };
    }
  } catch (error) {
    const isConnRefused = (error as { code?: string })?.code === "ECONNREFUSED";
    if (isConnRefused) {
      console.info(`[Offline Mode] PostgreSQL offline, menggunakan dummy topic untuk: ${topicSlug}`);
    } else {
      console.warn("Database not accessible, using dummy topic lookup:", error);
    }
  }

  const subject = DUMMY_DATA.subjects.find(
    (s) => s.id === subjectIdOrSlug || s.slug === subjectIdOrSlug
  );
  if (!subject) return null;

  const dummy = getDummyTopicBySlug(subject.slug, topicSlug);
  if (!dummy) return null;

  return {
    id: dummy.id,
    name: dummy.name,
    slug: dummy.slug,
    description: dummy.description,
    order: dummy.order,
    subjectId: subject.id,
    lessonCount: dummy.lessonCount ?? 1,
  };
}

export async function findTopicBySlug(
  subjectId: string,
  topicSlug: string,
): Promise<Result<TopicDetail>> {
  const topic = await getTopicBySlug(subjectId, topicSlug);
  if (!topic) return fail(ErrorCode.NOT_FOUND, "Topik tidak ditemukan.");
  return ok(topic);
}