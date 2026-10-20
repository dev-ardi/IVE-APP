import { prisma } from "../src/lib/db";

async function main() {
  const cols = await prisma.$queryRaw<Array<{ column_name: string; is_nullable: string; column_default: string }>>`
    SELECT column_name, is_nullable, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'questions'
    ORDER BY ordinal_position;
  `;
  console.log("Questions columns:", cols);
}

main().catch(console.error).finally(() => process.exit(0));
