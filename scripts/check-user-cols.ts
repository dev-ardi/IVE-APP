import { prisma } from "../src/lib/db";

async function main() {
  const cols = await prisma.$queryRaw<Array<{ column_name: string; data_type: string }>>`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'users'
    ORDER BY ordinal_position;
  `;
  console.log("Users table columns:", cols);
}

main().catch(console.error).finally(() => process.exit(0));
