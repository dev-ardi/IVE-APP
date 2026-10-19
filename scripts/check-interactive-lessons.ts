import { prisma } from "../src/lib/db";

async function main() {
  const lessons = await prisma.lesson.findMany({
    where: { status: "PUBLISHED" },
    include: { subject: true, topic: true, educationLevel: true },
    orderBy: { order: "asc" }
  });

  console.log("Total published lessons:", lessons.length);
  for (const l of lessons) {
    const blocks = (Array.isArray(l.contentBlocks) ? l.contentBlocks : l.content) as Array<{ type: string; component?: string }>;
    const interactiveBlock = Array.isArray(blocks) ? blocks.find(b => b.type === "interactive") : null;
    if (l.kind === "EXPERIMENT" || interactiveBlock) {
      console.log(`[${l.kind}] ${l.title} (slug: ${l.slug}) | Subject: ${l.subject.slug} | Topic: ${l.topic?.slug} | Component: ${interactiveBlock?.component}`);
    }
  }
}

main().catch(console.error).finally(() => process.exit(0));
