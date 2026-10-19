import { prisma } from "@/lib/db";
import { searchDummyLessons, DUMMY_DATA } from "@/data/dummy-data";

/**
 * Search service (IVE_TAD_Phase_1.md §27).
 * Phase 1 uses PostgreSQL search with fallback to dummy dataset.
 * Searches published lessons, subjects, and topics.
 */

export interface SearchResultItem {
  kind: "lesson" | "subject" | "topic";
  id: string;
  title: string;
  description: string | null;
  slug: string;
  url: string;
  subjectName?: string;
  levelName?: string;
}

export async function searchContent(query: string, limit = 20): Promise<SearchResultItem[]> {
  const q = query.trim();
  if (!q) return [];

  try {
    const contains = (s: string) => ({ contains: s, mode: "insensitive" as const });

    const [lessons, subjects, topics] = await Promise.all([
      prisma.lesson.findMany({
        where: {
          status: "PUBLISHED",
          OR: [{ title: contains(q) }, { description: contains(q) }, { slug: contains(q) }],
        },
        orderBy: { title: "asc" },
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          subject: { select: { name: true, slug: true } },
          educationLevel: { select: { name: true, slug: true } },
          topic: { select: { slug: true } },
        },
      }),
      prisma.subject.findMany({
        where: {
          status: "PUBLISHED",
          OR: [{ name: contains(q) }, { description: contains(q) }],
        },
        orderBy: { name: "asc" },
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          educationLevel: { select: { name: true, slug: true } },
        },
      }),
      prisma.topic.findMany({
        where: { OR: [{ name: contains(q) }, { description: contains(q) }] },
        orderBy: { name: "asc" },
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          subject: {
            select: {
              name: true,
              slug: true,
              educationLevel: { select: { slug: true } },
            },
          },
        },
      }),
    ]);

    const items: SearchResultItem[] = [];

    for (const lesson of lessons) {
      const topicSeg = lesson.topic ? `/${lesson.topic.slug}` : "";
      items.push({
        kind: "lesson",
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        slug: lesson.slug,
        url: `/learn/${lesson.educationLevel.slug}/${lesson.subject.slug}${topicSeg}/${lesson.slug}`,
        subjectName: lesson.subject.name,
        levelName: lesson.educationLevel.name,
      });
    }

    for (const subject of subjects) {
      items.push({
        kind: "subject",
        id: subject.id,
        title: subject.name,
        description: subject.description,
        slug: subject.slug,
        url: `/learn/${subject.educationLevel.slug}/${subject.slug}`,
        subjectName: subject.name,
        levelName: subject.educationLevel.name,
      });
    }

    for (const topic of topics) {
      items.push({
        kind: "topic",
        id: topic.id,
        title: topic.name,
        description: topic.description,
        slug: topic.slug,
        url: `/learn/${topic.subject.educationLevel?.slug ?? ""}/${topic.subject.slug}/${topic.slug}`,
        subjectName: topic.subject.name,
      });
    }

    if (items.length > 0) {
      return items.slice(0, limit);
    }
  } catch (error) {
    console.warn("Database search failed, searching dummy dataset:", error);
  }

  // Fallback search across dummy dataset
  const items: SearchResultItem[] = [];
  const matchedLessons = searchDummyLessons(q);
  for (const l of matchedLessons) {
    const subj = DUMMY_DATA.subjects.find((s) => s.slug === l.subjectSlug);
    items.push({
      kind: "lesson",
      id: l.id,
      title: l.title,
      description: l.description,
      slug: l.slug,
      url: `/learn/${l.levelSlug}/${l.subjectSlug}/${l.topicSlug}/${l.slug}`,
      subjectName: subj?.name ?? l.subjectSlug,
      levelName: "Umum",
    });
  }

  const matchedSubjects = DUMMY_DATA.subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(q.toLowerCase()) ||
      s.description.toLowerCase().includes(q.toLowerCase())
  );
  for (const s of matchedSubjects) {
    items.push({
      kind: "subject",
      id: s.id,
      title: s.name,
      description: s.description,
      slug: s.slug,
      url: `/learn/${s.levelSlug}/${s.slug}`,
      subjectName: s.name,
      levelName: "Umum",
    });
  }

  return items.slice(0, limit);
}