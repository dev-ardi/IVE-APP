import { prisma } from "../src/lib/db";
import { verifyPassword } from "../src/lib/password";

async function main() {
  const users = await prisma.user.findMany();
  for (const u of users) {
    const hasHash = Boolean(u.passwordHash);
    const validDevAdmin = u.passwordHash ? verifyPassword("admin123", u.passwordHash) : false;
    const validDevSiswa = u.passwordHash ? verifyPassword("siswa123", u.passwordHash) : false;
    console.log(`User: ${u.email} | Role: ${u.role} | HasPassword: ${hasHash} | PassMatchesAdmin123: ${validDevAdmin} | PassMatchesSiswa123: ${validDevSiswa}`);
  }
}

main().catch(console.error).finally(() => process.exit(0));
