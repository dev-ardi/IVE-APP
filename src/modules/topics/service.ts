import { prisma } from "@/lib/db";
import { Result, ok, fail, ErrorCode } from "@/lib/result";

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

export async function listTopicsBySubject(subjectId: string): Promise<TopicSummary[]> {
  const topics = await prisma.topic.findMany({
    where: { subjectId },
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
  return topics.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description,
    order: t.order,
    lessonCount: t._count.lessons,
  }));
}

export interface TopicDetail extends TopicSummary {
  subjectId: string;
}

export async function getTopicBySlug(
  subjectId: string,
  topicSlug: string,
): Promise<TopicDetail | null> {
  const topic = await prisma.topic.findFirst({
    where: { subjectId, slug: topicSlug },
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
  if (!topic) return null;
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

export async function findTopic(
  subjectId: string,
  topicSlug: string,
): Promise<Result<TopicDetail>> {
  const topic = await getTopicBySlug(subjectId, topicSlug);
  if (!topic) return fail(ErrorCode.NOT_FOUND, "Topik tidak ditemukan.");
  return ok(topic);
}