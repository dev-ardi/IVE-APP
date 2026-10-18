/**
 * Stable API error convention (IVE_TAD_Phase_1.md §23).
 * Route handlers map domain results to these codes; never expose stack traces.
 */

export const ErrorCode = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  CONFLICT: "CONFLICT",
  RATE_LIMITED: "RATE_LIMITED",
  AI_UNAVAILABLE: "AI_UNAVAILABLE",
  INTERNAL: "INTERNAL_ERROR",
} as const;

export type ErrorCodeValue = (typeof ErrorCode)[keyof typeof ErrorCode];

export interface AppError {
  code: ErrorCodeValue;
  message: string;
}

export interface Ok<T> {
  ok: true;
  data: T;
}

export interface Fail {
  ok: false;
  error: AppError;
}

export type Result<T> = Ok<T> | Fail;

export function ok<T>(data: T): Ok<T> {
  return { ok: true, data };
}

export function fail(code: ErrorCodeValue, message: string): Fail {
  return { ok: false, error: { code, message } };
}

export function toHttpStatus(code: ErrorCodeValue): number {
  switch (code) {
    case ErrorCode.VALIDATION_ERROR:
      return 400;
    case ErrorCode.UNAUTHORIZED:
      return 401;
    case ErrorCode.FORBIDDEN:
      return 403;
    case ErrorCode.NOT_FOUND:
      return 404;
    case ErrorCode.CONFLICT:
      return 409;
    case ErrorCode.RATE_LIMITED:
      return 429;
    case ErrorCode.AI_UNAVAILABLE:
      return 503;
    default:
      return 500;
  }
}

/**
 * Maps any unknown thrown value to a stable, human-safe API error.
 * Internal diagnostics (message, requestId) are logged, not returned.
 */
export function toAppError(err: unknown, fallbackMessage: string): AppError {
  if (err && typeof err === "object" && "code" in err && "message" in err) {
    const candidate = err as AppError;
    if (typeof candidate.code === "string" && typeof candidate.message === "string") {
      return { code: candidate.code as ErrorCodeValue, message: candidate.message };
    }
  }
  return { code: ErrorCode.INTERNAL, message: fallbackMessage };
}