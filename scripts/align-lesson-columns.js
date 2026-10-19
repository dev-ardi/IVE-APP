const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
  await client.connect();
  console.log("Aligning lessons columns to schema.prisma...");
  await client.query(`
    ALTER TABLE "lessons" ADD COLUMN IF NOT EXISTS "contentBlocks" JSONB;
    ALTER TABLE "lessons" ADD COLUMN IF NOT EXISTS "thumbnail" TEXT;
    ALTER TABLE "lessons" ADD COLUMN IF NOT EXISTS "estimatedMinutes" INTEGER DEFAULT 0;
    ALTER TABLE "lessons" ADD COLUMN IF NOT EXISTS "createdById" TEXT;

    -- Sync contentBlocks with existing content
    UPDATE "lessons" SET "contentBlocks" = "content" WHERE "contentBlocks" IS NULL AND "content" IS NOT NULL;
  `);
  console.log("Successfully aligned lessons table columns.");
  await client.end();
}

main().catch(console.error);
