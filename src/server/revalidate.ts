import { revalidatePath } from "next/cache";

/**
 * Invalidate public frontend cache on CMS mutations (design-cms.md §8.4).
 */
export function invalidateContentCache(options?: {
  subjectSlug?: string;
  topicSlug?: string;
  lessonSlug?: string;
  kind?: "LESSON" | "EXPERIMENT";
}) {
  try {
    revalidatePath("/", "page");
    revalidatePath("/explore", "page");
    revalidatePath("/lab", "page");
    revalidatePath("/search", "page");

    if (options?.subjectSlug) {
      revalidatePath(`/learn/umum/${options.subjectSlug}`, "layout");
      if (options?.topicSlug) {
        revalidatePath(
          `/learn/umum/${options.subjectSlug}/${options.topicSlug}`,
          "page",
        );
        if (options?.lessonSlug) {
          revalidatePath(
            `/learn/umum/${options.subjectSlug}/${options.topicSlug}/${options.lessonSlug}`,
            "page",
          );
        }
      }
    }
  } catch {
    // Best-effort in route handler or server component context
  }
}
