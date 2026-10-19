const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
  await client.connect();
  console.log("Adding extension point audit columns to tables...");
  await client.query(`
    ALTER TABLE "subjects" ADD COLUMN IF NOT EXISTS "createdById" TEXT;
    ALTER TABLE "subjects" ADD COLUMN IF NOT EXISTS "updatedById" TEXT;

    ALTER TABLE "topics" ADD COLUMN IF NOT EXISTS "createdById" TEXT;
    ALTER TABLE "topics" ADD COLUMN IF NOT EXISTS "updatedById" TEXT;

    ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "createdById" TEXT;
    ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "updatedById" TEXT;
  `);
  console.log("Successfully added audit columns.");
  await client.end();
}

main().catch(console.error);
