import { prisma } from "../src/lib/db";

async function main() {
  const sample = await prisma.lesson.findFirst({
    where: { status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      contentBlocks: true,
    }
  });
  console.log("Sample lesson:", {
    title: sample?.title,
    slug: sample?.slug,
    contentIsArray: Array.isArray(sample?.content),
    contentLength: Array.isArray(sample?.content) ? sample?.content.length : 0,
    contentBlocksIsArray: Array.isArray(sample?.contentBlocks),
    contentBlocksLength: Array.isArray(sample?.contentBlocks) ? sample?.contentBlocks.length : 0,
  });
}

main().catch(console.error).finally(() => process.exit(0));
