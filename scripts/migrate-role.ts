import { prisma } from "../src/lib/db";

async function run() {
  try {
    await prisma.$executeRawUnsafe(`ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'SUPER_ADMIN';`);
    console.log("Successfully added SUPER_ADMIN to enum Role in database");
    await prisma.$executeRawUnsafe(`DELETE FROM _prisma_migrations WHERE migration_name = '20261019120000_phase1_trd_delta';`);
    console.log("Cleaned up failed migration entries");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    process.exit(0);
  }
}

run();
