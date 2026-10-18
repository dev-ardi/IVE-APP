import { z } from "zod";
import { prisma } from "@/lib/db";
import { Result, ok, fail, ErrorCode } from "@/lib/result";

/**
 * Server-authoritative quiz service (IVE_TAD_Phase_1.md §7.7, §19).
 * Correctness is derived from database truth, never from the client.
 */

export interface QuestionOption {
  id: string;
  text: string;
}

export interface QuestionView {
  id: string;
  question: string;
  options: QuestionOption[];
  difficulty: string;
  order: number;
}

/** Questions exposed to the client — correct answer is NOT included. */
export async function listQuestionsForLesson(lessonId: string): Promise<QuestionView[]> {
  const questions = await prisma.question.findMany({
    where: { lessonId },
    orderBy: { order: "asc" },
    select: { id: true, question: true, options: true, difficulty: true, order: true },
  });
  return questions.map((qs) => ({
    id: qs.id,
    question: qs.question,
    options: (qs.options as unknown as QuestionOption[]) ?? [],
    difficulty: qs.difficulty,
    order: qs.order,
  }));
}

export const quizSubmitSchema = z.object({
  lessonId: z.string().min(1),
  answers: z.record(z.string(), z.string()).optional().default({}),
});

export type QuizSubmitInput = z.infer<typeof quizSubmitSchema>;

export interface QuizResult {
  lessonId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  feedback: { questionId: string; correct: boolean; correctAnswer: string }[];
  passed: boolean;
  attemptId: string | null;
}

const PASS_THRESHOLD = 70;

export async function submitQuiz(
  userId: string | null,
  input: QuizSubmitInput,
): Promise<Result<QuizResult>> {
  const lesson = await prisma.lesson.findUnique({
    where: { id: input.lessonId },
    select: { id: true, status: true },
  });
  if (!lesson) return fail(ErrorCode.NOT_FOUND, "Materi tidak ditemukan.");
  if (lesson.status !== "PUBLISHED") {
    return fail(ErrorCode.NOT_FOUND, "Materi tidak ditemukan.");
  }

  const questions = await prisma.question.findMany({
    where: { lessonId: input.lessonId },
    orderBy: { order: "asc" },
    select: { id: true, correctAnswer: true },
  });

  let correct = 0;
  const feedback = questions.map((qs) => {
    const isCorrect = input.answers[qs.id] === qs.correctAnswer;
    if (isCorrect) correct += 1;
    return {
      questionId: qs.id,
      correct: isCorrect,
      correctAnswer: qs.correctAnswer,
    };
  });

  const total = questions.length;
  const score = total === 0 ? 0 : Math.round((correct / total) * 100);
  const passed = score >= PASS_THRESHOLD;

  let attemptId: string | null = null;
  if (userId) {
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        lessonId: input.lessonId,
        score,
        totalQuestions: total,
        correctAnswers: correct,
      },
    });
    attemptId = attempt.id;
  } else {
    // Guest attempts are local-only in Phase 1 (§7.9).
  }

  return ok({ lessonId: input.lessonId, totalQuestions: total, correctAnswers: correct, score, feedback, passed, attemptId });
}