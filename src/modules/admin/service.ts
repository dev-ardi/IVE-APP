import { z } from "zod";
import { prisma } from "@/lib/db";
import { Result, ok, fail, ErrorCode } from "@/lib/result";
import { contentBlocksSchema } from "@/modules/content/blocks";
import { ContentStatus, Difficulty } from "@prisma/client";

/**
 * Admin application services (IVE_TAD_Phase_1.md §22, §7.1-7.7).
 * All mutations assume the caller has already verified ADMIN authorization
 * server-side (requireAdmin). These services never trust client role claims.
 */

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// --- Subjects -------------------------------------------------------------

export const adminSubjectSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(120).optional(),
  description: z.string().max(2000).optional().nullable(),
  icon: z.string().max(64).optional().nullable(),
  coverImage: z.string().url().optional().nullable(),
  educationLevelId: z.string().min(1),
  status: z.nativeEnum(ContentStatus).optional(),
});

export type AdminSubjectInput = z.infer<typeof adminSubjectSchema>;

export async function createSubject(input: AdminSubjectInput): Promise<Result<{ id: string }>> {
  const slug = input.slug ?? slugify(input.name);
  const exists = await prisma.subject.findFirst({
    where: { educationLevelId: input.educationLevelId, slug },
  });
  if (exists) return fail(ErrorCode.CONFLICT, "Slug mata pelajaran sudah dipakai pada jenjang ini.");

  const created = await prisma.subject.create({
    data: {
      educationLevelId: input.educationLevelId,
      name: input.name,
      slug,
      description: input.description ?? null,
      icon: input.icon ?? null,
      coverImage: input.coverImage ?? null,
      status: input.status ?? ContentStatus.DRAFT,
    },
  });
  return ok({ id: created.id });
}

// --- Topics ---------------------------------------------------------------

export const adminTopicSchema = z.object({
  subjectId: z.string().min(1),
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(120).optional(),
  description: z.string().max(2000).optional().nullable(),
  order: z.number().int().min(0).optional(),
});

export type AdminTopicInput = z.infer<typeof adminTopicSchema>;

export async function createTopic(input: AdminTopicInput): Promise<Result<{ id: string }>> {
  const slug = input.slug ?? slugify(input.name);
  const exists = await prisma.topic.findFirst({ where: { subjectId: input.subjectId, slug } });
  if (exists) return fail(ErrorCode.CONFLICT, "Slug topik sudah dipakai pada mata pelajaran ini.");

  const created = await prisma.topic.create({
    data: {
      subjectId: input.subjectId,
      name: input.name,
      slug,
      description: input.description ?? null,
      order: input.order ?? 0,
    },
  });
  return ok({ id: created.id });
}

// --- Lessons ---------------------------------------------------------------

export const adminLessonSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional().nullable(),
  coverImage: z.string().url().optional().nullable(),
  difficulty: z.nativeEnum(Difficulty).optional(),
  durationMinutes: z.number().int().min(0).optional(),
  order: z.number().int().min(0).optional(),
  educationLevelId: z.string().min(1),
  subjectId: z.string().min(1),
  topicId: z.string().min(1).optional().nullable(),
  content: contentBlocksSchema.optional(),
});

export type AdminLessonInput = z.infer<typeof adminLessonSchema>;

export async function createLesson(input: AdminLessonInput): Promise<Result<{ id: string }>> {
  const subject = await prisma.subject.findUnique({ where: { id: input.subjectId }, select: { educationLevelId: true } });
  if (!subject) return fail(ErrorCode.NOT_FOUND, "Mata pelajaran tidak ditemukan.");
  if (subject.educationLevelId !== input.educationLevelId) {
    return fail(ErrorCode.VALIDATION_ERROR, "Mata pelajaran tidak berada pada jenjang yang dipilih.");
  }

  const slug = input.slug ?? slugify(input.title);
  const exists = await prisma.lesson.findFirst({ where: { subjectId: input.subjectId, slug } });
  if (exists) return fail(ErrorCode.CONFLICT, "Slug materi sudah dipakai pada mata pelajaran ini.");

  const created = await prisma.lesson.create({
    data: {
      title: input.title,
      slug,
      description: input.description ?? null,
      coverImage: input.coverImage ?? null,
      difficulty: input.difficulty ?? Difficulty.BEGINNER,
      durationMinutes: input.durationMinutes ?? 0,
      order: input.order ?? 0,
      educationLevelId: input.educationLevelId,
      subjectId: input.subjectId,
      topicId: input.topicId ?? null,
      content: (input.content ?? []) as object,
      status: ContentStatus.DRAFT,
    },
  });
  return ok({ id: created.id });
}

export async function updateLesson(
  id: string,
  input: Partial<AdminLessonInput>,
): Promise<Result<{ id: string }>> {
  const existing = await prisma.lesson.findUnique({ where: { id } });
  if (!existing) return fail(ErrorCode.NOT_FOUND, "Materi tidak ditemukan.");

  await prisma.lesson.update({
    where: { id },
    data: {
      title: input.title,
      description: input.description,
      coverImage: input.coverImage,
      difficulty: input.difficulty,
      durationMinutes: input.durationMinutes,
      order: input.order,
      topicId: input.topicId,
      content: input.content ? (input.content as object) : undefined,
    },
  });
  return ok({ id });
}

/**
 * Publish a lesson with required validation (IVE_TAD_Phase_1.md §8).
 * A published lesson must have a title, non-empty content, and valid taxonomy.
 */
export async function publishLesson(id: string): Promise<Result<{ id: string; status: ContentStatus }>> {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    select: { title: true, content: true, subjectId: true, educationLevelId: true },
  });
  if (!lesson) return fail(ErrorCode.NOT_FOUND, "Materi tidak ditemukan.");

  const blocks = Array.isArray(lesson.content) ? lesson.content : [];
  if (!lesson.title) return fail(ErrorCode.VALIDATION_ERROR, "Judul materi belum diisi.");
  if (blocks.length === 0) return fail(ErrorCode.VALIDATION_ERROR, "Materi belum memiliki konten.");

  await prisma.lesson.update({
    where: { id },
    data: { status: ContentStatus.PUBLISHED, publishedAt: new Date() },
  });
  return ok({ id, status: ContentStatus.PUBLISHED });
}

export async function unpublishLesson(id: string): Promise<Result<{ id: string; status: ContentStatus }>> {
  const existing = await prisma.lesson.findUnique({ where: { id } });
  if (!existing) return fail(ErrorCode.NOT_FOUND, "Materi tidak ditemukan.");
  await prisma.lesson.update({ where: { id }, data: { status: ContentStatus.DRAFT, publishedAt: null } });
  return ok({ id, status: ContentStatus.DRAFT });
}

export async function archiveLesson(id: string): Promise<Result<{ id: string; status: ContentStatus }>> {
  const existing = await prisma.lesson.findUnique({ where: { id } });
  if (!existing) return fail(ErrorCode.NOT_FOUND, "Materi tidak ditemukan.");
  await prisma.lesson.update({ where: { id }, data: { status: ContentStatus.ARCHIVED } });
  return ok({ id, status: ContentStatus.ARCHIVED });
}

// --- Admin list (all statuses) --------------------------------------------

export async function listAllLessons() {
  return prisma.lesson.findMany({
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      difficulty: true,
      updatedAt: true,
      subject: { select: { name: true, slug: true } },
      educationLevel: { select: { name: true, slug: true } },
      _count: { select: { questions: true } },
    },
  });
}

export async function listAllSubjects() {
  return prisma.subject.findMany({
    orderBy: [{ status: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      educationLevel: { select: { name: true, slug: true } },
      _count: { select: { topics: true, lessons: true } },
    },
  });
}

export async function listLevels() {
  return prisma.educationLevel.findMany({ orderBy: { slug: "asc" }, select: { id: true, name: true, slug: true } });
}

// --- Questions -------------------------------------------------------------

export const adminQuestionSchema = z.object({
  lessonId: z.string().min(1),
  question: z.string().min(1).max(2000),
  options: z.array(z.object({ id: z.string().min(1), text: z.string().min(1) })).min(2),
  correctAnswer: z.string().min(1),
  explanation: z.string().max(5000).optional().nullable(),
  difficulty: z.nativeEnum(Difficulty).optional(),
  order: z.number().int().min(0).optional(),
});

export type AdminQuestionInput = z.infer<typeof adminQuestionSchema>;

export async function createQuestion(input: AdminQuestionInput): Promise<Result<{ id: string }>> {
  const lesson = await prisma.lesson.findUnique({ where: { id: input.lessonId }, select: { id: true } });
  if (!lesson) return fail(ErrorCode.NOT_FOUND, "Materi tidak ditemukan.");

  const optionIds = input.options.map((o) => o.id);
  if (!optionIds.includes(input.correctAnswer)) {
    return fail(ErrorCode.VALIDATION_ERROR, "Jawaban benar harus merujuk pada salah satu opsi.");
  }

  const created = await prisma.question.create({
    data: {
      lessonId: input.lessonId,
      question: input.question,
      options: input.options as object,
      correctAnswer: input.correctAnswer,
      explanation: input.explanation ?? null,
      difficulty: input.difficulty ?? Difficulty.BEGINNER,
      order: input.order ?? 0,
    },
  });
  return ok({ id: created.id });
}