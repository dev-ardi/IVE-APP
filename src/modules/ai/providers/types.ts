import { z } from "zod";

/**
 * Provider-agnostic AI adapter interface (IVE_TAD_Phase_1.md §25).
 * The AI service depends on this interface, never on a vendor SDK directly.
 * This enables future provider swaps without rewriting product code.
 */

export interface AIChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIChatInput {
  messages: AIChatMessage[];
  maxTokens?: number;
}

export interface AIChatOutput {
  content: string;
}

export interface AIProvider {
  streamChat?(
    input: AIChatInput,
    signal?: AbortSignal,
  ): AsyncIterable<string>;
  chat(input: AIChatInput, signal?: AbortSignal): Promise<AIChatOutput>;
}

/** Stable error thrown when the provider is unavailable or the call fails. */
export class AIUnavailableError extends Error {
  constructor(message = "AI provider unavailable") {
    super(message);
    this.name = "AIUnavailableError";
  }
}

export const aiProviderSchema = z.object({
  name: z.string().min(1),
});

export type AIProviderInfo = z.infer<typeof aiProviderSchema>;