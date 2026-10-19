import dummyDataRaw from "./dummy-lessons.json";
import type { ContentBlock } from "@/modules/content/blocks";

export interface DummyLevel {
  id: string;
  slug: string;
  name: string;
  description: string;
  isActive: boolean;
  order: number;
}

export interface DummySubject {
  id: string;
  levelSlug: string;
  slug: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  order: number;
  lessonCount?: number;
}

export interface DummyTopic {
  id: string;
  subjectSlug: string;
  slug: string;
  name: string;
  description: string;
  order: number;
  lessonCount?: number;
}

export interface DummyQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
}

export interface DummySource {
  title: string;
  author?: string;
  publisher?: string;
  year?: number;
  citationNote?: string;
  url?: string;
}

export interface DummyLesson {
  id: string;
  levelSlug: string;
  subjectSlug: string;
  topicSlug: string;
  slug: string;
  title: string;
  description: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  durationMinutes: number;
  kind: "LESSON" | "EXPERIMENT";
  interactiveKey: string;
  thumbnail: string | null;
  keywords: string[];
  sources: DummySource[];
  content: ContentBlock[];
  questions: DummyQuestion[];
}

export const DUMMY_DATA = dummyDataRaw as {
  levels: DummyLevel[];
  subjects: DummySubject[];
  topics: DummyTopic[];
  lessons: DummyLesson[];
};

export function getDummyLevels() {
  return DUMMY_DATA.levels;
}

export function getDummySubjects(levelSlug: string = "umum") {
  return DUMMY_DATA.subjects
    .filter((s) => s.levelSlug === levelSlug)
    .map((s) => ({
      ...s,
      lessonCount: DUMMY_DATA.lessons.filter((l) => l.subjectSlug === s.slug).length,
    }));
}

export function getDummySubjectBySlug(levelSlug: string, subjectSlug: string) {
  const s = DUMMY_DATA.subjects.find(
    (subj) => subj.levelSlug === levelSlug && subj.slug === subjectSlug
  );
  if (!s) return null;
  return {
    ...s,
    lessonCount: DUMMY_DATA.lessons.filter((l) => l.subjectSlug === s.slug).length,
  };
}

export function getDummyTopicsBySubject(subjectSlug: string) {
  return DUMMY_DATA.topics
    .filter((t) => t.subjectSlug === subjectSlug)
    .map((t) => ({
      ...t,
      lessonCount: DUMMY_DATA.lessons.filter((l) => l.topicSlug === t.slug).length,
    }));
}

export function getDummyTopicBySlug(subjectSlug: string, topicSlug: string) {
  const t = DUMMY_DATA.topics.find(
    (top) => top.subjectSlug === subjectSlug && top.slug === topicSlug
  );
  if (!t) return null;
  return {
    ...t,
    lessonCount: DUMMY_DATA.lessons.filter((l) => l.topicSlug === t.slug).length,
  };
}

export function getDummyLessonsBySubject(subjectSlug: string) {
  return DUMMY_DATA.lessons.filter((l) => l.subjectSlug === subjectSlug);
}

export function getDummyLessonsByTopic(topicSlug: string) {
  return DUMMY_DATA.lessons.filter((l) => l.topicSlug === topicSlug);
}

export function getDummyLessonBySlug(opts: {
  levelSlug: string;
  subjectSlug: string;
  topicSlug?: string;
  lessonSlug: string;
}) {
  return (
    DUMMY_DATA.lessons.find((l) => {
      const matchLevel = l.levelSlug === opts.levelSlug;
      const matchSubject = l.subjectSlug === opts.subjectSlug;
      const matchLesson = l.slug === opts.lessonSlug;
      const matchTopic = opts.topicSlug ? l.topicSlug === opts.topicSlug : true;
      return matchLevel && matchSubject && matchLesson && matchTopic;
    }) ?? null
  );
}

export function getDummyLessonDetail(lessonSlug: string) {
  const found = DUMMY_DATA.lessons.find((l) => l.slug === lessonSlug);
  if (!found) return null;

  const subject = DUMMY_DATA.subjects.find((s) => s.slug === found.subjectSlug);
  const level = DUMMY_DATA.levels.find((lv) => lv.slug === found.levelSlug);
  const topic = DUMMY_DATA.topics.find((t) => t.slug === found.topicSlug);

  return {
    ...found,
    coverImage: found.thumbnail,
    order: 1,
    educationLevelId: level?.id ?? "lvl-umum",
    subjectId: subject?.id ?? "sub-1",
    topicId: topic?.id ?? "top-1",
    publishedAt: new Date("2026-10-19"),
    educationLevel: { name: level?.name ?? "Umum", slug: level?.slug ?? "umum" },
    subject: { name: subject?.name ?? found.subjectSlug, slug: found.subjectSlug },
    topic: topic ? { name: topic.name, slug: topic.slug } : null,
  };
}

export function searchDummyLessons(query: string, subjectSlug?: string) {
  const q = query.toLowerCase().trim();
  return DUMMY_DATA.lessons.filter((l) => {
    if (subjectSlug && subjectSlug !== "all" && l.subjectSlug !== subjectSlug) {
      return false;
    }
    if (!q) return true;
    return (
      l.title.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.subjectSlug.toLowerCase().includes(q) ||
      l.keywords.some((kw) => kw.toLowerCase().includes(q))
    );
  });
}
