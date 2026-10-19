const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
  await client.connect();
  console.log("Altering lessons.status to ContentStatus...");
  await client.query(`
    ALTER TABLE "lessons" ALTER COLUMN "status" DROP DEFAULT;
    ALTER TABLE "lessons" ALTER COLUMN "status" TYPE "ContentStatus" USING (
      CASE
        WHEN "status"::text = 'IN_REVIEW' THEN 'DRAFT'::"ContentStatus"
        ELSE "status"::text::"ContentStatus"
      END
    );
    ALTER TABLE "lessons" ALTER COLUMN "status" SET DEFAULT 'DRAFT'::"ContentStatus";
  `);
  console.log("Successfully converted lessons.status to ContentStatus.");
  await client.end();
}

main().catch(console.error);
