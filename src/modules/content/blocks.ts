import { z } from "zod";

/**
 * Content block engine contract (IVE_TAD_Phase_1.md §9, §16-17).
 * CMS stores structured JSON; the renderer dispatches through a registry.
 * Unknown block types must fail gracefully — never crash a lesson.
 */

export const CONTENT_BLOCK_TYPES = [
  "heading",
  "text",
  "image",
  "video",
  "formula",
  "callout",
  "example",
  "interactive",
  "quiz",
  "divider",
] as const;

export type ContentBlockType = (typeof CONTENT_BLOCK_TYPES)[number];

const sharedBlock = z.object({
  id: z.string().min(1),
});

export const headingBlockSchema = sharedBlock.extend({
  type: z.literal("heading"),
  content: z.string().min(1),
  level: z.number().int().min(1).max(6).optional().default(2),
});

export const textBlockSchema = sharedBlock.extend({
  type: z.literal("text"),
  content: z.string().min(1),
});

export const imageBlockSchema = sharedBlock.extend({
  type: z.literal("image"),
  src: z.string().url(),
  alt: z.string().optional().default(""),
  caption: z.string().optional(),
});

export const videoBlockSchema = sharedBlock.extend({
  type: z.literal("video"),
  src: z.string().url(),
  title: z.string().optional(),
});

export const formulaBlockSchema = sharedBlock.extend({
  type: z.literal("formula"),
  content: z.string().min(1),
  display: z.boolean().optional().default(false),
});

export const calloutBlockSchema = sharedBlock.extend({
  type: z.literal("callout"),
  content: z.string().min(1),
  variant: z.enum(["info", "warning", "tip"]).optional().default("info"),
});

export const exampleBlockSchema = sharedBlock.extend({
  type: z.literal("example"),
  content: z.string().min(1),
});

export const interactiveBlockSchema = sharedBlock.extend({
  type: z.literal("interactive"),
  component: z.string().min(1),
  config: z.record(z.string(), z.unknown()).optional().default({}),
});

export const quizBlockSchema = sharedBlock.extend({
  type: z.literal("quiz"),
  question: z.string().min(1),
  options: z.array(z.string()).min(2),
  answer: z.number().int().min(0),
});

export const dividerBlockSchema = sharedBlock.extend({
  type: z.literal("divider"),
  content: z.string().optional(),
});

const blockSchemas = [
  headingBlockSchema,
  textBlockSchema,
  imageBlockSchema,
  videoBlockSchema,
  formulaBlockSchema,
  calloutBlockSchema,
  exampleBlockSchema,
  interactiveBlockSchema,
  quizBlockSchema,
  dividerBlockSchema,
] as const;

export const contentBlockSchema = z.discriminatedUnion("type", blockSchemas);

export const contentBlocksSchema = z.array(contentBlockSchema);

export type ContentBlock = z.infer<typeof contentBlockSchema>;
export type HeadingBlock = z.infer<typeof headingBlockSchema>;
export type TextBlock = z.infer<typeof textBlockSchema>;
export type ImageBlock = z.infer<typeof imageBlockSchema>;
export type VideoBlock = z.infer<typeof videoBlockSchema>;
export type FormulaBlock = z.infer<typeof formulaBlockSchema>;
export type CalloutBlock = z.infer<typeof calloutBlockSchema>;
export type ExampleBlock = z.infer<typeof exampleBlockSchema>;
export type InteractiveBlock = z.infer<typeof interactiveBlockSchema>;
export type QuizBlock = z.infer<typeof quizBlockSchema>;
export type DividerBlock = z.infer<typeof dividerBlockSchema>;

/**
 * Validate an array of blocks from the database (or admin input).
 * Returns a safe, parsed result; throws a ZodError on invalid content.
 */
export function parseContentBlocks(input: unknown): ContentBlock[] {
  return contentBlocksSchema.parse(input);
}