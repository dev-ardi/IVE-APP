const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
  await client.connect();
  console.log("Aligning questions table to schema.prisma...");
  await client.query(`
    DO $$ BEGIN
      CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "lessonId" TEXT;
    ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "type" "QuestionType" NOT NULL DEFAULT 'MULTIPLE_CHOICE';
    ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "correctOptionId" TEXT;
    ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0;

    DO $$ BEGIN
      ALTER TABLE "questions" ADD CONSTRAINT "questions_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "questions_lessonId_idx" ON "questions"("lessonId");
  `);
  console.log("Successfully aligned questions table.");
  await client.end();
}

main().catch(console.error);
