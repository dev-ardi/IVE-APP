import { z } from "zod";
import { prisma } from "@/lib/db";
import { Result, ok, fail, ErrorCode } from "@/lib/result";
import { contentBlocksSchema, type ContentBlock } from "@/modules/content/blocks";
import { ContentStatus, Difficulty, LessonKind, SourceType } from "@prisma/client";
import { invalidateContentCache } from "@/server/revalidate";

/**
 * Admin application services (IVE_TAD_Phase_1.md §22, design-cms.md §8).
 * All mutations write through domain services and invalidate public cache.
 */

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ===========================================================================
// DASHBOARD STATS (Real data, design-cms.md §4.2, §8.2)
// ===========================================================================

export async function getDashboardStats() {
  const [
    subjectCount,
    topicCount,
    totalLessons,
    publishedLessons,
    draftLessons,
    archivedLessons,
    experimentCount,
    questionCount,
    sourceCount,
    allLessonsWithSources,
    recentLessons,
  ] = await Promise.all([
    prisma.subject.count(),
    prisma.topic.count(),
    prisma.lesson.count(),
    prisma.lesson.count({ where: { status: ContentStatus.PUBLISHED } }),
    prisma.lesson.count({ where: { status: ContentStatus.DRAFT } }),
    prisma.lesson.count({ where: { status: ContentStatus.ARCHIVED } }),
    prisma.lesson.count({ where: { kind: LessonKind.EXPERIMENT } }),
    prisma.question.count(),
    prisma.source.count(),
    prisma.lesson.findMany({
      select: {
        id: true,
        contentBlocks: true,
        content: true,
        _count: { select: { sources: true } },
      },
    }),
    prisma.lesson.findMany({
      take: 6,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        kind: true,
        status: true,
        updatedAt: true,
        createdAt: true,
        subject: { select: { name: true, slug: true } },
        topic: { select: { name: true, slug: true } },
        _count: { select: { sources: true } },
      },
    }),
  ]);

  // Count lessons without sources
  const lessonsWithoutSources = allLessonsWithSources.filter(
    (l) => l._count.sources === 0,
  ).length;

  // Count lessons without interactive blocks
  const lessonsWithoutSandbox = allLessonsWithSources.filter((l) => {
    const rawBlocks = (Array.isArray(l.contentBlocks)
      ? l.contentBlocks
      : Array.isArray(l.content)
        ? l.content
        : []) as Array<{ type?: string }>;
    return !rawBlocks.some((b) => b.type === "interactive");
  }).length;

  return {
    subjectCount,
    topicCount,
    totalLessons,
    publishedLessons,
    draftLessons,
    archivedLessons,
    experimentCount,
    questionCount,
    sourceCount,
    lessonsWithoutSources,
    lessonsWithoutSandbox,
    recentLessons,
  };
}

// ===========================================================================
// SUBJECTS (Mata Pelajaran)
// ===========================================================================

export const adminSubjectSchema = z.object({
  name: z.string().min(1, "Nama mata pelajaran wajib diisi.").max(120),
  slug: z.string().min(1).max(120).optional(),
  description: z.string().max(2000).optional().nullable(),
  icon: z.string().max(64).optional().nullable(),
  coverImage: z.string().url().optional().nullable().or(z.literal("")),
  educationLevelId: z.string().min(1, "Jenjang wajib dipilih."),
  status: z.nativeEnum(ContentStatus).optional(),
  order: z.number().int().min(0).optional(),
});

export type AdminSubjectInput = z.infer<typeof adminSubjectSchema>;

export async function listAllSubjects() {
  return prisma.subject.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: {
      educationLevel: { select: { id: true, name: true, slug: true } },
      _count: { select: { topics: true, lessons: true } },
    },
  });
}

export async function getSubjectById(id: string) {
  return prisma.subject.findUnique({
    where: { id },
    include: {
      educationLevel: true,
      topics: { orderBy: { order: "asc" } },
      _count: { select: { lessons: true } },
    },
  });
}

export async function createSubject(input: AdminSubjectInput): Promise<Result<{ id: string }>> {
  const slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.name);
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
      coverImage: input.coverImage || null,
      status: input.status ?? ContentStatus.PUBLISHED,
      order: input.order ?? 0,
    },
  });

  invalidateContentCache({ subjectSlug: slug });
  return ok({ id: created.id });
}

export async function updateSubject(
  id: string,
  input: Partial<AdminSubjectInput>,
): Promise<Result<{ id: string }>> {
  const existing = await prisma.subject.findUnique({ where: { id } });
  if (!existing) return fail(ErrorCode.NOT_FOUND, "Mata pelajaran tidak ditemukan.");

  const slug = input.slug?.trim()
    ? slugify(input.slug)
    : input.name
      ? slugify(input.name)
      : existing.slug;

  if (slug !== existing.slug) {
    const exists = await prisma.subject.findFirst({
      where: {
        educationLevelId: input.educationLevelId ?? existing.educationLevelId,
        slug,
        id: { not: id },
      },
    });
    if (exists) return fail(ErrorCode.CONFLICT, "Slug mata pelajaran sudah digunakan.");
  }

  const updated = await prisma.subject.update({
    where: { id },
    data: {
      name: input.name,
      slug,
      description: input.description,
      icon: input.icon,
      coverImage: input.coverImage || null,
      status: input.status,
      order: input.order,
      educationLevelId: input.educationLevelId,
    },
  });

  invalidateContentCache({ subjectSlug: updated.slug });
  return ok({ id });
}

export async function deleteSubject(id: string): Promise<Result<{ id: string }>> {
  const existing = await prisma.subject.findUnique({
    where: { id },
    include: { _count: { select: { lessons: true } } },
  });
  if (!existing) return fail(ErrorCode.NOT_FOUND, "Mata pelajaran tidak ditemukan.");

  if (existing._count.lessons > 0) {
    // Prefer archive over hard delete
    await prisma.subject.update({
      where: { id },
      data: { status: ContentStatus.ARCHIVED },
    });
    invalidateContentCache({ subjectSlug: existing.slug });
    return ok({ id });
  }

  await prisma.subject.delete({ where: { id } });
  invalidateContentCache({ subjectSlug: existing.slug });
  return ok({ id });
}

// ===========================================================================
// TOPICS (Topik)
// ===========================================================================

export const adminTopicSchema = z.object({
  subjectId: z.string().min(1, "Mata pelajaran wajib dipilih."),
  name: z.string().min(1, "Nama topik wajib diisi.").max(120),
  slug: z.string().min(1).max(120).optional(),
  description: z.string().max(2000).optional().nullable(),
  order: z.number().int().min(0).optional(),
  status: z.nativeEnum(ContentStatus).optional(),
});

export type AdminTopicInput = z.infer<typeof adminTopicSchema>;

export async function listAllTopics(subjectId?: string) {
  return prisma.topic.findMany({
    where: subjectId ? { subjectId } : undefined,
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: {
      subject: { select: { id: true, name: true, slug: true } },
      _count: { select: { lessons: true, questions: true } },
    },
  });
}

export async function getTopicById(id: string) {
  return prisma.topic.findUnique({
    where: { id },
    include: {
      subject: true,
      lessons: { orderBy: { order: "asc" } },
      _count: { select: { questions: true } },
    },
  });
}

export async function createTopic(input: AdminTopicInput): Promise<Result<{ id: string }>> {
  const slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.name);
  const exists = await prisma.topic.findFirst({ where: { subjectId: input.subjectId, slug } });
  if (exists) return fail(ErrorCode.CONFLICT, "Slug topik sudah dipakai pada mata pelajaran ini.");

  const created = await prisma.topic.create({
    data: {
      subjectId: input.subjectId,
      name: input.name,
      slug,
      description: input.description ?? null,
      order: input.order ?? 0,
      status: input.status ?? ContentStatus.PUBLISHED,
    },
    include: { subject: { select: { slug: true } } },
  });

  invalidateContentCache({
    subjectSlug: created.subject?.slug,
    topicSlug: created.slug,
  });
  return ok({ id: created.id });
}

export async function updateTopic(
  id: string,
  input: Partial<AdminTopicInput>,
): Promise<Result<{ id: string }>> {
  const existing = await prisma.topic.findUnique({
    where: { id },
    include: { subject: { select: { slug: true } } },
  });
  if (!existing) return fail(ErrorCode.NOT_FOUND, "Topik tidak ditemukan.");

  const slug = input.slug?.trim()
    ? slugify(input.slug)
    : input.name
      ? slugify(input.name)
      : existing.slug;

  const updated = await prisma.topic.update({
    where: { id },
    data: {
      subjectId: input.subjectId,
      name: input.name,
      slug,
      description: input.description,
      order: input.order,
      status: input.status,
    },
  });

  invalidateContentCache({
    subjectSlug: existing.subject?.slug,
    topicSlug: updated.slug,
  });
  return ok({ id });
}

export async function deleteTopic(id: string): Promise<Result<{ id: string }>> {
  const existing = await prisma.topic.findUnique({
    where: { id },
    include: {
      subject: { select: { slug: true } },
      _count: { select: { lessons: true } },
    },
  });
  if (!existing) return fail(ErrorCode.NOT_FOUND, "Topik tidak ditemukan.");

  if (existing._count.lessons > 0) {
    await prisma.topic.update({
      where: { id },
      data: { status: ContentStatus.ARCHIVED },
    });
    invalidateContentCache({
      subjectSlug: existing.subject?.slug,
      topicSlug: existing.slug,
    });
    return ok({ id });
  }

  await prisma.topic.delete({ where: { id } });
  invalidateContentCache({
    subjectSlug: existing.subject?.slug,
    topicSlug: existing.slug,
  });
  return ok({ id });
}

// ===========================================================================
// LESSONS (Materi & Eksperimen)
// ===========================================================================

export const adminLessonSchema = z.object({
  title: z.string().min(1, "Judul materi wajib diisi.").max(200),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional().nullable(),
  coverImage: z.string().url().optional().nullable().or(z.literal("")),
  thumbnail: z.string().url().optional().nullable().or(z.literal("")),
  difficulty: z.nativeEnum(Difficulty).optional(),
  kind: z.nativeEnum(LessonKind).optional(),
  durationMinutes: z.number().int().min(0).optional(),
  estimatedMinutes: z.number().int().min(0).optional(),
  order: z.number().int().min(0).optional(),
  keywords: z.array(z.string()).optional(),
  educationLevelId: z.string().min(1, "Jenjang wajib dipilih."),
  subjectId: z.string().min(1, "Mata pelajaran wajib dipilih."),
  topicId: z.string().min(1).optional().nullable(),
  contentBlocks: contentBlocksSchema.optional(),
  status: z.nativeEnum(ContentStatus).optional(),
});

export type AdminLessonInput = z.infer<typeof adminLessonSchema>;

export async function listAllLessons(filter?: {
  subjectId?: string;
  topicId?: string;
  kind?: LessonKind;
  status?: ContentStatus;
  search?: string;
}) {
  return prisma.lesson.findMany({
    where: {
      subjectId: filter?.subjectId,
      topicId: filter?.topicId,
      kind: filter?.kind,
      status: filter?.status,
      title: filter?.search ? { contains: filter.search, mode: "insensitive" } : undefined,
    },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    include: {
      subject: { select: { id: true, name: true, slug: true } },
      topic: { select: { id: true, name: true, slug: true } },
      educationLevel: { select: { id: true, name: true, slug: true } },
      _count: { select: { questions: true, sources: true } },
    },
  });
}

export async function getLessonById(id: string) {
  return prisma.lesson.findUnique({
    where: { id },
    include: {
      subject: true,
      topic: true,
      educationLevel: true,
      sources: {
        include: { source: true },
        orderBy: { order: "asc" },
      },
      questions: {
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function createLesson(input: AdminLessonInput): Promise<Result<{ id: string }>> {
  const subject = await prisma.subject.findUnique({
    where: { id: input.subjectId },
    select: { educationLevelId: true, slug: true },
  });
  if (!subject) return fail(ErrorCode.NOT_FOUND, "Mata pelajaran tidak ditemukan.");

  const slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title);
  const exists = await prisma.lesson.findFirst({
    where: { subjectId: input.subjectId, slug },
  });
  if (exists) return fail(ErrorCode.CONFLICT, "Slug materi sudah dipakai pada mata pelajaran ini.");

  const blocks = (input.contentBlocks ?? []) as object;

  const created = await prisma.lesson.create({
    data: {
      title: input.title,
      slug,
      description: input.description ?? null,
      coverImage: input.coverImage || null,
      thumbnail: input.thumbnail || null,
      difficulty: input.difficulty ?? Difficulty.BEGINNER,
      kind: input.kind ?? LessonKind.LESSON,
      durationMinutes: input.durationMinutes ?? 0,
      estimatedMinutes: input.estimatedMinutes ?? input.durationMinutes ?? 0,
      order: input.order ?? 0,
      keywords: input.keywords ?? [],
      educationLevelId: input.educationLevelId || subject.educationLevelId,
      subjectId: input.subjectId,
      topicId: input.topicId ?? null,
      contentBlocks: blocks,
      content: blocks,
      status: input.status ?? ContentStatus.DRAFT,
    },
    include: {
      topic: { select: { slug: true } },
    },
  });

  invalidateContentCache({
    subjectSlug: subject.slug,
    topicSlug: created.topic?.slug,
    lessonSlug: created.slug,
    kind: created.kind,
  });

  return ok({ id: created.id });
}

export async function updateLesson(
  id: string,
  input: Partial<AdminLessonInput>,
): Promise<Result<{ id: string }>> {
  const existing = await prisma.lesson.findUnique({
    where: { id },
    include: {
      subject: { select: { slug: true } },
      topic: { select: { slug: true } },
    },
  });
  if (!existing) return fail(ErrorCode.NOT_FOUND, "Materi tidak ditemukan.");

  const slug = input.slug?.trim()
    ? slugify(input.slug)
    : input.title
      ? slugify(input.title)
      : existing.slug;

  const blocks = input.contentBlocks ? (input.contentBlocks as object) : undefined;

  const updated = await prisma.lesson.update({
    where: { id },
    data: {
      title: input.title,
      slug,
      description: input.description,
      coverImage: input.coverImage || null,
      thumbnail: input.thumbnail || null,
      difficulty: input.difficulty,
      kind: input.kind,
      durationMinutes: input.durationMinutes,
      estimatedMinutes: input.estimatedMinutes,
      order: input.order,
      keywords: input.keywords,
      subjectId: input.subjectId,
      topicId: input.topicId,
      contentBlocks: blocks,
      content: blocks,
      status: input.status,
    },
  });

  invalidateContentCache({
    subjectSlug: existing.subject.slug,
    topicSlug: existing.topic?.slug,
    lessonSlug: updated.slug,
    kind: updated.kind,
  });

  return ok({ id });
}

// ---------------------------------------------------------------------------
// PUBLISH CHECKLIST & GATES (TAD §12.5, design-cms.md §6.2)
// ---------------------------------------------------------------------------

export interface PublishCheckItem {
  id: string;
  label: string;
  passed: boolean;
  message?: string;
}

export async function verifyPublishGates(id: string): Promise<{
  canPublish: boolean;
  checklist: PublishCheckItem[];
}> {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      subject: { include: { educationLevel: true } },
      sources: true,
    },
  });

  if (!lesson) {
    return {
      canPublish: false,
      checklist: [{ id: "exists", label: "Materi ditemukan", passed: false, message: "Materi tidak ada." }],
    };
  }

  const blocks = (Array.isArray(lesson.contentBlocks)
    ? lesson.contentBlocks
    : Array.isArray(lesson.content)
      ? lesson.content
      : []) as ContentBlock[];

  // 1. Title and description
  const hasTitle = !!lesson.title && lesson.title.trim().length > 0;
  // 2. Active taxonomy
  const activeTaxonomy =
    lesson.subject.status !== ContentStatus.ARCHIVED &&
    lesson.subject.educationLevel.isActive;
  // 3. At least 1 valid source (TAD Rule 16)
  const hasSource = lesson.sources.length >= 1;
  // 4. Content blocks present
  const hasContent = blocks.length > 0;
  // 5. Image blocks alt text
  const imageBlocks = blocks.filter((b) => b.type === "image") as Array<{ src: string; alt?: string }>;
  const allImagesHaveAlt = imageBlocks.every((img) => typeof img.alt === "string" && img.alt.trim().length > 0);
  // 6. Interactive blocks valid config & textFallback
  const interactiveBlocks = blocks.filter((b) => b.type === "interactive") as Array<{
    component: string;
    config?: Record<string, unknown>;
  }>;
  const allInteractivesValid = interactiveBlocks.every((ib) => {
    const fallback = ib.config?.textFallback;
    return typeof fallback === "string" && fallback.trim().length > 0;
  });

  const checklist: PublishCheckItem[] = [
    {
      id: "title",
      label: "Judul dan Deskripsi",
      passed: hasTitle,
      message: hasTitle ? undefined : "Judul materi wajib diisi.",
    },
    {
      id: "taxonomy",
      label: "Taksonomi Aktif (Jenjang & Subjek)",
      passed: activeTaxonomy,
      message: activeTaxonomy ? undefined : "Mata pelajaran atau jenjang sedang non-aktif/diarsipkan.",
    },
    {
      id: "sources",
      label: "Minimal 1 Sumber Rujukan Valid",
      passed: hasSource,
      message: hasSource ? undefined : "Materi wajib menautkan minimal 1 sumber sebelum dipublikasikan.",
    },
    {
      id: "content",
      label: "Memiliki Blok Konten",
      passed: hasContent,
      message: hasContent ? undefined : "Materi belum memiliki blok konten.",
    },
    {
      id: "image_alt",
      label: "Aksesibilitas Gambar (Teks Alt)",
      passed: allImagesHaveAlt,
      message: allImagesHaveAlt ? undefined : "Semua blok gambar wajib memiliki deskripsi teks (alt).",
    },
    {
      id: "interactive_fallback",
      label: "Fallback Tekstual Komponen Interaktif",
      passed: allInteractivesValid,
      message: allInteractivesValid
        ? undefined
        : "Setiap komponen interaktif wajib menyertakan fallback teks.",
    },
  ];

  const canPublish = checklist.every((c) => c.passed);
  return { canPublish, checklist };
}

export async function publishLesson(id: string): Promise<Result<{ id: string; status: ContentStatus }>> {
  const { canPublish, checklist } = await verifyPublishGates(id);
  if (!canPublish) {
    const failed = checklist.find((c) => !c.passed);
    return fail(
      ErrorCode.VALIDATION_ERROR,
      failed?.message ?? "Syarat publikasi materi belum terpenuhi.",
    );
  }

  const updated = await prisma.lesson.update({
    where: { id },
    data: { status: ContentStatus.PUBLISHED, publishedAt: new Date() },
    include: {
      subject: { select: { slug: true } },
      topic: { select: { slug: true } },
    },
  });

  invalidateContentCache({
    subjectSlug: updated.subject.slug,
    topicSlug: updated.topic?.slug,
    lessonSlug: updated.slug,
    kind: updated.kind,
  });

  return ok({ id, status: ContentStatus.PUBLISHED });
}

export async function unpublishLesson(id: string): Promise<Result<{ id: string; status: ContentStatus }>> {
  const existing = await prisma.lesson.findUnique({
    where: { id },
    include: {
      subject: { select: { slug: true } },
      topic: { select: { slug: true } },
    },
  });
  if (!existing) return fail(ErrorCode.NOT_FOUND, "Materi tidak ditemukan.");

  await prisma.lesson.update({
    where: { id },
    data: { status: ContentStatus.DRAFT, publishedAt: null },
  });

  invalidateContentCache({
    subjectSlug: existing.subject.slug,
    topicSlug: existing.topic?.slug,
    lessonSlug: existing.slug,
    kind: existing.kind,
  });

  return ok({ id, status: ContentStatus.DRAFT });
}

export async function archiveLesson(id: string): Promise<Result<{ id: string; status: ContentStatus }>> {
  const existing = await prisma.lesson.findUnique({
    where: { id },
    include: {
      subject: { select: { slug: true } },
      topic: { select: { slug: true } },
    },
  });
  if (!existing) return fail(ErrorCode.NOT_FOUND, "Materi tidak ditemukan.");

  await prisma.lesson.update({
    where: { id },
    data: { status: ContentStatus.ARCHIVED },
  });

  invalidateContentCache({
    subjectSlug: existing.subject.slug,
    topicSlug: existing.topic?.slug,
    lessonSlug: existing.slug,
    kind: existing.kind,
  });

  return ok({ id, status: ContentStatus.ARCHIVED });
}

// ===========================================================================
// SOURCES (Sumber Rujukan, TAD §13, design-cms.md §6)
// ===========================================================================

export const adminSourceSchema = z.object({
  title: z.string().min(1, "Judul sumber wajib diisi.").max(300),
  author: z.string().max(200).optional().nullable(),
  publisher: z.string().max(200).optional().nullable(),
  url: z.string().url().optional().nullable().or(z.literal("")),
  type: z.nativeEnum(SourceType).optional(),
  year: z.number().int().min(1800).max(2100).optional().nullable(),
  licenseNote: z.string().max(500).optional().nullable(),
});

export type AdminSourceInput = z.infer<typeof adminSourceSchema>;

export async function listAllSources() {
  return prisma.source.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { lessons: true } },
    },
  });
}

export async function getSourceById(id: string) {
  return prisma.source.findUnique({
    where: { id },
    include: {
      lessons: {
        include: { lesson: { select: { id: true, title: true, slug: true } } },
      },
    },
  });
}

export async function createSource(input: AdminSourceInput): Promise<Result<{ id: string }>> {
  const created = await prisma.source.create({
    data: {
      title: input.title,
      author: input.author || null,
      publisher: input.publisher || null,
      url: input.url || null,
      type: input.type ?? SourceType.WEBSITE,
      year: input.year || null,
      licenseNote: input.licenseNote || null,
    },
  });
  return ok({ id: created.id });
}

export async function updateSource(
  id: string,
  input: Partial<AdminSourceInput>,
): Promise<Result<{ id: string }>> {
  const existing = await prisma.source.findUnique({ where: { id } });
  if (!existing) return fail(ErrorCode.NOT_FOUND, "Sumber rujukan tidak ditemukan.");

  await prisma.source.update({
    where: { id },
    data: {
      title: input.title,
      author: input.author,
      publisher: input.publisher,
      url: input.url || null,
      type: input.type,
      year: input.year,
      licenseNote: input.licenseNote,
    },
  });
  return ok({ id });
}

export async function deleteSource(id: string): Promise<Result<{ id: string }>> {
  const existing = await prisma.source.findUnique({
    where: { id },
    include: { _count: { select: { lessons: true } } },
  });
  if (!existing) return fail(ErrorCode.NOT_FOUND, "Sumber rujukan tidak ditemukan.");

  if (existing._count.lessons > 0) {
    return fail(
      ErrorCode.CONFLICT,
      `Sumber ini masih tertaut pada ${existing._count.lessons} materi. Lepas tautan terlebih dahulu.`,
    );
  }

  await prisma.source.delete({ where: { id } });
  return ok({ id });
}

export async function linkLessonSource(
  lessonId: string,
  sourceId: string,
  citationNote?: string,
): Promise<Result<{ success: boolean }>> {
  const exists = await prisma.lessonSource.findUnique({
    where: { lessonId_sourceId: { lessonId, sourceId } },
  });

  if (exists) {
    await prisma.lessonSource.update({
      where: { lessonId_sourceId: { lessonId, sourceId } },
      data: { citationNote: citationNote ?? null },
    });
  } else {
    await prisma.lessonSource.create({
      data: {
        lessonId,
        sourceId,
        citationNote: citationNote ?? null,
      },
    });
  }

  return ok({ success: true });
}

export async function unlinkLessonSource(
  lessonId: string,
  sourceId: string,
): Promise<Result<{ success: boolean }>> {
  await prisma.lessonSource.deleteMany({
    where: { lessonId, sourceId },
  });
  return ok({ success: true });
}

// ===========================================================================
// QUESTIONS (Bank Soal)
// ===========================================================================

export const adminQuestionSchema = z.object({
  topicId: z.string().min(1, "Topik wajib dipilih.").optional().nullable(),
  lessonId: z.string().optional().nullable(),
  question: z.string().min(1, "Pertanyaan wajib diisi.").max(3000),
  options: z
    .array(
      z.object({
        id: z.string().min(1),
        text: z.string().min(1, "Teks opsi tidak boleh kosong."),
      }),
    )
    .min(2, "Minimal 2 opsi pilihan jawaban."),
  correctAnswer: z.string().min(1, "Kunci jawaban benar wajib dipilih."),
  explanation: z.string().max(5000).optional().nullable(),
  difficulty: z.nativeEnum(Difficulty).optional(),
  order: z.number().int().min(0).optional(),
  status: z.nativeEnum(ContentStatus).optional(),
});

export type AdminQuestionInput = z.infer<typeof adminQuestionSchema>;

export async function listAllQuestions(topicId?: string, lessonId?: string) {
  return prisma.question.findMany({
    where: {
      topicId: topicId || undefined,
      lessonId: lessonId || undefined,
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: {
      topic: { select: { id: true, name: true, slug: true } },
      lesson: { select: { id: true, title: true, slug: true } },
    },
  });
}

export async function getQuestionById(id: string) {
  return prisma.question.findUnique({
    where: { id },
    include: { topic: true, lesson: true },
  });
}

export async function createQuestion(input: AdminQuestionInput): Promise<Result<{ id: string }>> {
  const optionIds = input.options.map((o) => o.id);
  if (!optionIds.includes(input.correctAnswer)) {
    return fail(ErrorCode.VALIDATION_ERROR, "Kunci jawaban benar harus merujuk pada salah satu ID opsi.");
  }

  const created = await prisma.question.create({
    data: {
      topicId: input.topicId || null,
      lessonId: input.lessonId || null,
      question: input.question,
      options: input.options as object,
      correctAnswer: input.correctAnswer,
      explanation: input.explanation ?? null,
      difficulty: input.difficulty ?? Difficulty.BEGINNER,
      order: input.order ?? 0,
      status: input.status ?? ContentStatus.PUBLISHED,
    },
  });

  return ok({ id: created.id });
}

export async function updateQuestion(
  id: string,
  input: Partial<AdminQuestionInput>,
): Promise<Result<{ id: string }>> {
  const existing = await prisma.question.findUnique({ where: { id } });
  if (!existing) return fail(ErrorCode.NOT_FOUND, "Soal tidak ditemukan.");

  if (input.options && input.correctAnswer) {
    const optionIds = input.options.map((o) => o.id);
    if (!optionIds.includes(input.correctAnswer)) {
      return fail(ErrorCode.VALIDATION_ERROR, "Kunci jawaban benar harus merujuk pada salah satu ID opsi.");
    }
  }

  await prisma.question.update({
    where: { id },
    data: {
      topicId: input.topicId !== undefined ? input.topicId : existing.topicId,
      lessonId: input.lessonId !== undefined ? input.lessonId : existing.lessonId,
      question: input.question,
      options: input.options ? (input.options as object) : undefined,
      correctAnswer: input.correctAnswer,
      explanation: input.explanation,
      difficulty: input.difficulty,
      order: input.order,
      status: input.status,
    },
  });

  return ok({ id });
}

export async function deleteQuestion(id: string): Promise<Result<{ id: string }>> {
  await prisma.question.delete({ where: { id } });
  return ok({ id });
}

// ===========================================================================
// SANDBOX STUDIO (design-cms.md §7)
// ===========================================================================

export interface StudioLessonSummary {
  id: string;
  slug: string;
  title: string;
  kind: "LESSON" | "EXPERIMENT";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  subject: { id: string; name: string; slug: string };
  topic: { id: string; name: string; slug: string } | null;
  interactiveBlockCount: number;
  hasFormulaBlock: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getStudioLessons(): Promise<StudioLessonSummary[]> {
  const lessons = await prisma.lesson.findMany({
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      kind: true,
      status: true,
      contentBlocks: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      subject: { select: { id: true, name: true, slug: true } },
      topic: { select: { id: true, name: true, slug: true } },
    },
  });

  return lessons.map((l) => {
    const blocks = (Array.isArray(l.contentBlocks)
      ? l.contentBlocks
      : Array.isArray(l.content)
        ? l.content
        : []) as Array<{ type?: string }>;

    const interactiveBlockCount = blocks.filter((b) => b.type === "interactive").length;
    const hasFormulaBlock = blocks.some((b) => b.type === "formula");

    return {
      id: l.id,
      slug: l.slug,
      title: l.title,
      kind: l.kind as "LESSON" | "EXPERIMENT",
      status: l.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
      subject: l.subject,
      topic: l.topic,
      interactiveBlockCount,
      hasFormulaBlock,
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString(),
    };
  });
}

export async function getStudioLessonContext(lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      subject: true,
      topic: true,
      sources: { include: { source: true } },
    },
  });

  if (!lesson) return null;

  const blocks = (Array.isArray(lesson.contentBlocks)
    ? lesson.contentBlocks
    : Array.isArray(lesson.content)
      ? lesson.content
      : []) as ContentBlock[];

  const formulaBlocks = blocks.filter((b) => b.type === "formula");
  const interactiveBlocks = blocks.filter((b) => b.type === "interactive");

  return {
    lesson: {
      id: lesson.id,
      title: lesson.title,
      slug: lesson.slug,
      kind: lesson.kind,
      status: lesson.status,
      description: lesson.description,
      keywords: lesson.keywords,
      difficulty: lesson.difficulty,
      subject: lesson.subject,
      topic: lesson.topic,
      updatedAt: lesson.updatedAt.toISOString(),
    },
    formulaBlocks,
    interactiveBlocks,
    sources: lesson.sources.map((s) => ({
      id: s.source.id,
      title: s.source.title,
      citationNote: s.citationNote,
    })),
  };
}

export async function attachInteractiveBlockToLesson({
  lessonId,
  componentKey,
  config,
  existingBlockId,
}: {
  lessonId: string;
  componentKey: string;
  config: Record<string, unknown>;
  existingBlockId?: string;
}): Promise<Result<{ id: string; blockId: string }>> {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      subject: { select: { slug: true } },
      topic: { select: { slug: true } },
    },
  });

  if (!lesson) return fail(ErrorCode.NOT_FOUND, "Materi tidak ditemukan.");

  const currentBlocks = (Array.isArray(lesson.contentBlocks)
    ? lesson.contentBlocks
    : Array.isArray(lesson.content)
      ? lesson.content
      : []) as ContentBlock[];

  const blockId = existingBlockId || `interactive_${Date.now()}`;
  let updatedBlocks: ContentBlock[];

  const existingIdx = currentBlocks.findIndex(
    (b) => b.id === existingBlockId || (b.type === "interactive" && b.component === componentKey),
  );

  const newBlock: ContentBlock = {
    id: blockId,
    type: "interactive",
    component: componentKey,
    config,
  };

  if (existingIdx >= 0) {
    // Update existing interactive block (stable ID, no duplication)
    updatedBlocks = [...currentBlocks];
    updatedBlocks[existingIdx] = {
      ...newBlock,
      id: currentBlocks[existingIdx].id,
    };
  } else {
    // Insert before quiz block or at end
    const quizIdx = currentBlocks.findIndex((b) => b.type === "quiz");
    if (quizIdx >= 0) {
      updatedBlocks = [
        ...currentBlocks.slice(0, quizIdx),
        newBlock,
        ...currentBlocks.slice(quizIdx),
      ];
    } else {
      updatedBlocks = [...currentBlocks, newBlock];
    }
  }

  await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      contentBlocks: updatedBlocks as object,
      content: updatedBlocks as object,
    },
  });

  invalidateContentCache({
    subjectSlug: lesson.subject.slug,
    topicSlug: lesson.topic?.slug,
    lessonSlug: lesson.slug,
    kind: lesson.kind,
  });

  return ok({ id: lessonId, blockId });
}

// Levels
export async function listLevels() {
  return prisma.educationLevel.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true, slug: true, isActive: true },
  });
}