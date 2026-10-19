import { z } from "zod";
import { prisma } from "@/lib/db";
import { Result, ok, fail, ErrorCode } from "@/lib/result";
import { DUMMY_DATA } from "@/data/dummy-data";

/**
 * Server-authoritative quiz service (IVE_TAD_Phase_1.md §7.7, §19, Design §4.7).
 * Correctness is derived from server truth, never from the client.
 * Provides constructive feedback that teaches.
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
export async function listQuestionsForLesson(lessonIdOrSlug: string): Promise<QuestionView[]> {
  try {
    const questions = await prisma.question.findMany({
      where: {
        OR: [{ lessonId: lessonIdOrSlug }, { lesson: { slug: lessonIdOrSlug } }],
      },
      orderBy: { order: "asc" },
      select: { id: true, question: true, options: true, difficulty: true, order: true },
    });

    if (questions.length > 0) {
      return questions.map((qs) => ({
        id: qs.id,
        question: qs.question,
        options: (qs.options as unknown as QuestionOption[]) ?? [],
        difficulty: qs.difficulty,
        order: qs.order,
      }));
    }
  } catch (error) {
    console.warn("Database not accessible, using dummy questions list:", error);
  }

  // Fallback to dummy lesson questions
  const dummyLesson = DUMMY_DATA.lessons.find(
    (l) => l.id === lessonIdOrSlug || l.slug === lessonIdOrSlug
  );

  if (dummyLesson && dummyLesson.questions) {
    return dummyLesson.questions.map((q, idx) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty,
      order: idx + 1,
    }));
  }

  return [];
}

export const quizSubmitSchema = z.object({
  lessonId: z.string().min(1),
  answers: z.record(z.string(), z.string()).optional().default({}),
});

export type QuizSubmitInput = z.infer<typeof quizSubmitSchema>;

export interface QuestionFeedback {
  questionId: string;
  correct: boolean;
  correctAnswer: string;
  explanation?: string;
}

export interface QuizResult {
  lessonId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  feedback: QuestionFeedback[];
  passed: boolean;
  attemptId: string | null;
}

const PASS_THRESHOLD = 70;

export async function submitQuiz(
  userId: string | null,
  input: QuizSubmitInput,
): Promise<Result<QuizResult>> {
  try {
    const lesson = await prisma.lesson.findFirst({
      where: {
        OR: [{ id: input.lessonId }, { slug: input.lessonId }],
        status: "PUBLISHED",
      },
      select: { id: true, status: true },
    });

    if (lesson) {
      const questions = await prisma.question.findMany({
        where: { lessonId: lesson.id },
        orderBy: { order: "asc" },
        select: { id: true, correctAnswer: true, explanation: true },
      });

      if (questions.length > 0) {
        let correct = 0;
        const feedback: QuestionFeedback[] = questions.map((qs) => {
          const isCorrect = input.answers[qs.id] === qs.correctAnswer;
          if (isCorrect) correct += 1;
          return {
            questionId: qs.id,
            correct: isCorrect,
            correctAnswer: qs.correctAnswer,
            explanation: qs.explanation ?? undefined,
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
              lessonId: lesson.id,
              score,
              totalQuestions: total,
              correctAnswers: correct,
            },
          });
          attemptId = attempt.id;
        }

        return ok({
          lessonId: input.lessonId,
          totalQuestions: total,
          correctAnswers: correct,
          score,
          feedback,
          passed,
          attemptId,
        });
      }
    }
  } catch (error) {
    console.warn("Database not accessible, scoring via dummy data:", error);
  }

  // Fallback scoring via dummy questions
  const dummyLesson = DUMMY_DATA.lessons.find(
    (l) => l.id === input.lessonId || l.slug === input.lessonId
  );

  if (!dummyLesson || !dummyLesson.questions || dummyLesson.questions.length === 0) {
    return fail(ErrorCode.NOT_FOUND, "Soal latihan materi tidak ditemukan.");
  }

  let correctCount = 0;
  const feedback: QuestionFeedback[] = dummyLesson.questions.map((q) => {
    const isCorrect = input.answers[q.id] === q.correctAnswer;
    if (isCorrect) correctCount += 1;
    return {
      questionId: q.id,
      correct: isCorrect,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    };
  });

  const total = dummyLesson.questions.length;
  const score = total === 0 ? 0 : Math.round((correctCount / total) * 100);
  const passed = score >= PASS_THRESHOLD;

  return ok({
    lessonId: input.lessonId,
    totalQuestions: total,
    correctAnswers: correctCount,
    score,
    feedback,
    passed,
    attemptId: null,
  });
}