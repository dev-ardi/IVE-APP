import { prisma } from "../src/lib/db";

async function main() {
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "passwordHash" TEXT;
  `);
  console.log("Column passwordHash added or verified in users table.");

  const cols = await prisma.$queryRaw<Array<{ column_name: string; data_type: string }>>`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'users'
    ORDER BY ordinal_position;
  `;
  console.log("Users columns:", cols.map(c => c.column_name));
}

main().catch(console.error).finally(() => process.exit(0));
