import type { ContentBlock } from "@/modules/content/blocks";
import { isInteractiveKey } from "@/modules/content/interactive-registry";
import { RenderInteractive } from "./render-interactive";
import { RenderFormula } from "./render-formula";

/**
 * LessonContentRenderer (IVE_TAD_Phase_1.md §9).
 * Dispatches each block through a per-type switch. Unknown block types render a
 * safe fallback instead of crashing — never use dangerouslySetInnerHTML here.
 *
 * This component is safe to render in a Server Component. Interactive and
 * formula blocks delegate to client boundaries.
 */
export function LessonContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}

function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "heading":
      const tag = getHeadingTag(block.level ?? 2);
      return <HeadingTag tag={tag}>{block.content}</HeadingTag>;

    case "text":
      return <p className="text-base leading-relaxed text-foreground/90">{block.content}</p>;

    case "image":
      return (
        <figure className="overflow-hidden rounded-xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.src} alt={block.alt || block.id} className="w-full object-cover" />
          {block.caption ? (
            <figcaption className="border-t border-border bg-muted/40 px-4 py-2 text-sm text-muted-foreground">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );

    case "video":
      return (
        <div className="aspect-video overflow-hidden rounded-xl border border-border bg-black">
          <video
            src={block.src}
            title={block.title}
            controls
            preload="metadata"
            className="h-full w-full"
          />
        </div>
      );

    case "formula":
      return <RenderFormula formula={block.content} display={block.display ?? false} />;

    case "callout":
      return <Callout variant={block.variant ?? "info"} content={block.content} />;

    case "example":
      return (
        <div className="rounded-xl border-l-4 border-l-sky-500 bg-sky-50 px-4 py-3 text-sm dark:bg-sky-950/30">
          <p className="font-medium text-sky-700 dark:text-sky-300">Contoh</p>
          <p className="text-foreground/90">{block.content}</p>
        </div>
      );

    case "interactive":
      if (!isInteractiveKey(block.component)) {
        return (
          <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            Interaksi berikut belum tersedia.
          </div>
        );
      }
      return <RenderInteractive componentKey={block.component} config={block.config} />;

    case "quiz":
      // Inline quiz blocks are rare; the lesson page has its own quiz flow (§7.6).
      return null;

    case "divider":
      return (
        <div className="relative py-1">
          <div className="h-px w-full bg-border" />
          {block.content ? (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs uppercase tracking-wide text-muted-foreground">
              {block.content}
            </span>
          ) : null}
        </div>
      );

    default:
      return (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          Konten tidak dikenali.
        </div>
      );
  }
}

function getHeadingTag(level: number): "h1" | "h2" | "h3" | "h4" | "h5" | "h6" {
  switch (level) {
    case 1:
      return "h1";
    case 2:
      return "h2";
    case 3:
      return "h3";
    case 4:
      return "h4";
    case 5:
      return "h5";
    default:
      return "h6";
  }
}

function HeadingTag({ tag, children }: { tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"; children: React.ReactNode }) {
  const className = "scroll-mt-24 font-semibold tracking-tight";
  switch (tag) {
    case "h1":
      return <h1 className={className}>{children}</h1>;
    case "h2":
      return <h2 className={className}>{children}</h2>;
    case "h3":
      return <h3 className={className}>{children}</h3>;
    case "h4":
      return <h4 className={className}>{children}</h4>;
    case "h5":
      return <h5 className={className}>{children}</h5>;
    default:
      return <h6 className={className}>{children}</h6>;
  }
}

function Callout({ variant, content }: { variant: string; content: string }) {
  const styles: Record<string, string> = {
    info: "border-l-sky-500 bg-sky-50 dark:bg-sky-950/30",
    warning: "border-l-amber-500 bg-amber-50 dark:bg-amber-950/30",
    tip: "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
  };
  const labels: Record<string, string> = { info: "Info", warning: "Perhatian", tip: "Tips" };
  const base = styles[variant] ?? styles.info;
  return (
    <div className={`rounded-xl border-l-4 px-4 py-3 ${base}`}>
      <p className="font-medium text-foreground/90">{labels[variant] ?? labels.info}</p>
      <p className="text-foreground/90">{content}</p>
    </div>
  );
}