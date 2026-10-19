export interface PublicUrlContext {
  pageType?: "dashboard" | "subject" | "topic" | "lesson" | "studio" | "other";
  levelSlug?: string;
  subjectSlug?: string;
  topicSlug?: string;
  lessonSlug?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  interactiveId?: string;
}

/**
 * Contextual destination for "Lihat Public Site" button in CMS topbar (design-cms.md §2.3C).
 */
export function getPublicUrl(context?: PublicUrlContext): {
  url: string;
  tooltip?: string;
  isDraft?: boolean;
} {
  if (!context) return { url: "/" };

  const level = context.levelSlug || "umum";

  if (context.pageType === "lesson" || context.pageType === "studio") {
    if (
      context.status === "PUBLISHED" &&
      context.subjectSlug &&
      context.topicSlug &&
      context.lessonSlug
    ) {
      const anchor = context.interactiveId ? `#interactive-${context.interactiveId}` : "";
      return {
        url: `/learn/${level}/${context.subjectSlug}/${context.topicSlug}/${context.lessonSlug}${anchor}`,
      };
    }
    if (context.status && context.status !== "PUBLISHED") {
      return {
        url: "/",
        tooltip: "Materi belum terbit — gunakan Pratinjau",
        isDraft: true,
      };
    }
  }

  if (context.pageType === "subject" && context.subjectSlug) {
    return { url: `/learn/${level}/${context.subjectSlug}` };
  }

  if (context.pageType === "topic" && context.subjectSlug && context.topicSlug) {
    return { url: `/learn/${level}/${context.subjectSlug}/${context.topicSlug}` };
  }

  return { url: "/" };
}
