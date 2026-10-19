const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  await client.connect();
  console.log("Connected to PostgreSQL database.");

  await client.query("BEGIN");

  try {
    // 1. Add missing enum values to SourceType
    console.log("Updating SourceType enum values...");
    await client.query("ALTER TYPE \"SourceType\" ADD VALUE IF NOT EXISTS 'BOOK'");
    await client.query("ALTER TYPE \"SourceType\" ADD VALUE IF NOT EXISTS 'ARTICLE'");
    await client.query("ALTER TYPE \"SourceType\" ADD VALUE IF NOT EXISTS 'WEBSITE'");
    await client.query("ALTER TYPE \"SourceType\" ADD VALUE IF NOT EXISTS 'GOVERNMENT'");
    await client.query("COMMIT");
  } catch (e) {
    console.log("Enum update note:", e.message);
    await client.query("ROLLBACK");
  }

  // Next transaction for table creation & swap
  await client.query("BEGIN");
  try {
    console.log("Creating sources table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "sources" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "author" TEXT,
        "publisher" TEXT,
        "url" TEXT,
        "type" "SourceType" NOT NULL DEFAULT 'WEBSITE',
        "year" INTEGER,
        "licenseNote" TEXT,
        "createdById" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Migrating existing sources data into sources table...");
    await client.query(`
      INSERT INTO "sources" ("id", "title", "author", "publisher", "url", "type", "year", "licenseNote", "createdAt", "updatedAt")
      SELECT
        "id",
        "title",
        "creator",
        "publisher",
        "url",
        CASE
          WHEN "type"::text IN ('TEXTBOOK', 'OFFICIAL_BOOK') THEN 'BOOK'::"SourceType"
          WHEN "type"::text IN ('OFFICIAL_SITE', 'OER') THEN 'WEBSITE'::"SourceType"
          WHEN "type"::text = 'JOURNAL' THEN 'JOURNAL'::"SourceType"
          ELSE 'OTHER'::"SourceType"
        END,
        "year",
        COALESCE("usageNote", "license"::text),
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      FROM "lesson_sources"
      ON CONFLICT ("id") DO NOTHING
    `);

    console.log("Creating proper join table lesson_sources_new...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "lesson_sources_new" (
        "lessonId" TEXT NOT NULL,
        "sourceId" TEXT NOT NULL,
        "citationNote" TEXT,
        "order" INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY ("lessonId", "sourceId"),
        CONSTRAINT "lesson_sources_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "lesson_sources_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "sources"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS "lesson_sources_lessonId_idx" ON "lesson_sources_new"("lessonId");
      CREATE INDEX IF NOT EXISTS "lesson_sources_sourceId_idx" ON "lesson_sources_new"("sourceId");
    `);

    console.log("Populating lesson_sources_new relations...");
    await client.query(`
      INSERT INTO "lesson_sources_new" ("lessonId", "sourceId", "citationNote", "order")
      SELECT "lessonId", "id", "usageNote", "order"
      FROM "lesson_sources"
      ON CONFLICT ("lessonId", "sourceId") DO NOTHING
    `);

    console.log("Swapping tables...");
    await client.query(`DROP TABLE "lesson_sources"`);
    await client.query(`ALTER TABLE "lesson_sources_new" RENAME TO "lesson_sources"`);

    await client.query("COMMIT");
    console.log("Migration completed successfully!");

    const countSources = await client.query('SELECT count(*) FROM "sources"');
    const countLessonSources = await client.query('SELECT count(*) FROM "lesson_sources"');
    console.log(`Sources count: ${countSources.rows[0].count}`);
    console.log(`LessonSources count: ${countLessonSources.rows[0].count}`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", err);
    throw err;
  } finally {
    await client.end();
  }
}

migrate().catch(console.error);
