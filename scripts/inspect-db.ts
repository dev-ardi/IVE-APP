import { prisma } from "../src/lib/db";

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users in DB:", users.map(u => ({ id: u.id, email: u.email, role: u.role, name: u.name })));

  const levels = await prisma.educationLevel.findMany();
  console.log("Education levels:", levels.map(l => ({ id: l.id, slug: l.slug, name: l.name, isActive: l.isActive })));

  const subjects = await prisma.subject.findMany({
    include: { educationLevel: true }
  });
  console.log("Subjects count:", subjects.length);
  console.log("Subjects:", subjects.map(s => ({ id: s.id, slug: s.slug, name: s.name, status: s.status, levelSlug: s.educationLevel.slug })));

  const topics = await prisma.topic.findMany({
    include: { subject: true }
  });
  console.log("Topics count:", topics.length);
  console.log("Topics:", topics.map(t => ({ id: t.id, slug: t.slug, name: t.name, subjectSlug: t.subject.slug })));

  const lessons = await prisma.lesson.findMany({
    include: {
      educationLevel: true,
      subject: true,
      topic: true,
      sources: true,
    }
  });
  console.log("Total lessons in DB:", lessons.length);
  const byStatus: Record<string, number> = {};
  for (const l of lessons) {
    byStatus[l.status] = (byStatus[l.status] || 0) + 1;
  }
  console.log("Lessons by status:", byStatus);
  console.log("Lessons breakdown:", lessons.map(l => ({
    id: l.id,
    title: l.title,
    slug: l.slug,
    status: l.status,
    kind: l.kind,
    levelSlug: l.educationLevel?.slug,
    subjectSlug: l.subject?.slug,
    topicSlug: l.topic?.slug,
    sourcesCount: l.sources.length,
    hasContent: Boolean(l.content),
    hasContentBlocks: Boolean(l.contentBlocks),
  })));
}

main().catch(console.error).finally(() => process.exit(0));
