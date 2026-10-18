import { z } from "zod";
import { prisma } from "@/lib/db";
import { env, isAIEnabled } from "@/lib/env";
import { Result, ok, fail, ErrorCode } from "@/lib/result";
import { AIUnavailableError, type AIProvider, type AIChatMessage } from "./providers/types";
import { createDefaultProvider } from "./providers/openai";

/**
 * AI tutor service (IVE_TAD_Phase_1.md §18, §19, §26).
 * - Server-side only.
 * - Context is bounded: current lesson + recent conversation history.
 * - Falls back gracefully when the provider is unavailable.
 */

const SYSTEM_PROMPT = `Kamu adalah Edu AI, tutor belajar di platform IVE.
- Gunakan Bahasa Indonesia.
- Sesuaikan dengan jenjang pendidikan siswa.
- Jelaskan langkah demi langkah, gunakan contoh dan analogi.
- Bantu siswa memahami konsep; jangan hanya memberikan jawaban akhir.
- Utamakan konteks materi yang sedang dipelajari.
- Jangan mengarang fakta; nyatakan ketidakpastian bila perlu.`;

export const aiChatSchema = z.object({
  lessonId: z.string().optional(),
  message: z.string().min(1).max(2000),
});

export type AIChatInputSchema = z.infer<typeof aiChatSchema>;

export const createAIConversationSchema = z.object({
  lessonId: z.string().optional(),
});

const MAX_HISTORY = 6; // last 6 messages

/**
 * Build bounded context for the current lesson (§26).
 */
async function buildLessonContext(lessonId: string | undefined): Promise<string | null> {
  if (!lessonId) return null;
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      title: true,
      description: true,
      educationLevel: { select: { name: true } },
      subject: { select: { name: true } },
      topic: { select: { name: true } },
    },
  });
  if (!lesson) return null;
  return [
    `Jenjang: ${lesson.educationLevel?.name ?? "-"}`,
    `Mata pelajaran: ${lesson.subject?.name ?? "-"}`,
    `Topik: ${lesson.topic?.name ?? "-"}`,
    `Judul materi: ${lesson.title}`,
    `Deskripsi: ${lesson.description ?? "-"}`,
  ].join("\n");
}

export async function chat(
  userId: string,
  input: AIChatInputSchema,
): Promise<Result<{ reply: string }>> {
  if (!isAIEnabled()) {
    return fail(ErrorCode.AI_UNAVAILABLE, "Edu AI sedang tidak tersedia. Coba lagi sebentar.");
  }

  const lessonContext = await buildLessonContext(input.lessonId);

  // Recent history for this user + lesson conversation.
  const conversation = input.lessonId
    ? await prisma.aIConversation.findFirst({
        where: { userId, lessonId: input.lessonId },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          messages: { orderBy: { createdAt: "desc" }, take: MAX_HISTORY, select: { role: true, content: true } },
        },
      })
    : null;

  const history: AIChatMessage[] = (conversation?.messages ?? [])
    .slice()
    .reverse()
    .map((m) => ({ role: m.role === "USER" ? "user" : "assistant", content: m.content }));

  const messages: AIChatMessage[] = [{ role: "system", content: SYSTEM_PROMPT }];
  if (lessonContext) {
    messages.push({ role: "system", content: `Konteks materi saat ini:\n${lessonContext}` });
  }
  messages.push(...history);
  messages.push({ role: "user", content: input.message });

  const provider: AIProvider = createDefaultProvider();

  try {
    const result = await provider.chat({
      messages,
      maxTokens: Math.min(env.AI_MAX_CONTEXT_TOKENS, 2048),
    });

    // Persist conversation turn.
    let conversationId = conversation?.id ?? null;
    if (!conversationId) {
      const created = await prisma.aIConversation.create({
        data: { userId, lessonId: input.lessonId ?? null },
      });
      conversationId = created.id;
    }
    await prisma.aIMessage.createMany({
      data: [
        { conversationId: conversationId, role: "USER", content: input.message },
        { conversationId: conversationId, role: "ASSISTANT", content: result.content },
      ],
    });

    return ok({ reply: result.content });
  } catch (err) {
    if (err instanceof AIUnavailableError) {
      return fail(ErrorCode.AI_UNAVAILABLE, "Edu AI sedang tidak tersedia. Coba lagi sebentar.");
    }
    // Unknown error — do not leak details.
    return fail(ErrorCode.AI_UNAVAILABLE, "Edu AI sedang tidak tersedia. Coba lagi sebentar.");
  }
}