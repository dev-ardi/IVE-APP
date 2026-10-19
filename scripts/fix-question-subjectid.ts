import { prisma } from "../src/lib/db";

async function main() {
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "questions" ALTER COLUMN "subjectId" DROP NOT NULL;
  `);
  console.log("Altered questions.subjectId to DROP NOT NULL.");
}

main().catch(console.error).finally(() => process.exit(0));
