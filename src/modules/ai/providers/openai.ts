import { env } from "@/lib/env";
import {
  type AIProvider,
  type AIChatInput,
  type AIChatOutput,
  AIUnavailableError,
} from "./types";

/**
 * OpenAI-compatible chat provider (server-side only).
 * Base URL is configurable so any OpenAI-compatible endpoint works (§25).
 */
export class OpenAICompatibleProvider implements AIProvider {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor(opts?: { apiKey?: string; baseUrl?: string; model?: string }) {
    this.apiKey = opts?.apiKey ?? env.AI_API_KEY;
    this.baseUrl = opts?.baseUrl ?? env.AI_BASE_URL;
    this.model = opts?.model ?? env.AI_MODEL;
  }

  private assertConfigured() {
    if (!this.apiKey) {
      throw new AIUnavailableError("AI_API_KEY is not configured.");
    }
  }

  async chat(input: AIChatInput, signal?: AbortSignal): Promise<AIChatOutput> {
    this.assertConfigured();
    const url = `${this.baseUrl.replace(/\/$/, "")}/chat/completions`;

    const controller = new AbortController();
    if (signal) {
      signal.addEventListener("abort", () => controller.abort(), { once: true });
    }
    if (input.maxTokens) {
      const timeout = setTimeout(() => controller.abort(), 60_000);
      signal?.addEventListener("abort", () => clearTimeout(timeout), { once: true });
      try {
        return await this.post(url, input, controller.signal);
      } finally {
        clearTimeout(timeout);
      }
    }
    return this.post(url, input, controller.signal);
  }

  private async post(
    url: string,
    input: AIChatInput,
    signal: AbortSignal,
  ): Promise<AIChatOutput> {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: input.messages,
        max_tokens: input.maxTokens ?? 512,
      }),
      signal,
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        throw new AIUnavailableError("AI provider rejected the request (auth).");
      }
      if (res.status === 429) {
        throw new AIUnavailableError("AI provider rate limited.");
      }
      throw new AIUnavailableError(`AI provider error (${res.status}).`);
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new AIUnavailableError("AI provider returned an empty response.");
    }
    return { content };
  }
}

export function createDefaultProvider(): AIProvider {
  return new OpenAICompatibleProvider();
}