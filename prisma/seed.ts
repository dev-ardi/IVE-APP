import { PrismaClient, ContentStatus, Difficulty, Role } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../src/lib/password";

// Ambil URL database dari file .env
const connectionString = `${process.env.DATABASE_URL}`;

// Inisialisasi pool PostgreSQL dan pasang ke adapter Prisma
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Panggil PrismaClient DENGAN adapter
const prisma = new PrismaClient({ adapter });

/**
 * Seed script for IVE Phase 1.
 * Populates education levels, an SMA Physics lesson with all content block types
 * and interactive components, questions, an admin user, and demo data matching
 * the product-critical flows in IVE_TAD_Phase_1.md §58.
 */

async function upsertLevel(name: string, slug: string, description: string) {
  return prisma.educationLevel.upsert({
    where: { slug },
    update: { name, description },
    create: { name, slug, description },
  });
}
async function main() {
  console.log("Seeding IVE database...");

  // --- Users ---------------------------------------------------------
  const adminEmail = process.env.ADMIN_EMAIL || "admin@ive.example";
  const defaultAdminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const defaultStudentPassword = process.env.STUDENT_PASSWORD || "siswa123";

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { 
      name: "Admin IVE", 
      role: Role.SUPER_ADMIN,
      passwordHash: hashPassword(defaultAdminPassword),
    },
    create: { 
      email: adminEmail, 
      name: "Admin IVE", 
      role: Role.SUPER_ADMIN,
      passwordHash: hashPassword(defaultAdminPassword),
    },
  });
  const student = await prisma.user.upsert({
    where: { email: "siswa@ive.example" },
    update: { 
      name: "Siswa Demo", 
      role: Role.USER,
      passwordHash: hashPassword(defaultStudentPassword),
    },
    create: { 
      email: "siswa@ive.example", 
      name: "Siswa Demo", 
      role: Role.USER,
      passwordHash: hashPassword(defaultStudentPassword),
    },
  });

  // --- Education levels ----------------------------------------------
  const umum = await upsertLevel("Umum", "umum", "Materi lintas jenjang untuk semua siswa.");
  await upsertLevel("SD", "sd", "Sekolah Dasar.");
  await upsertLevel("SMP", "smp", "Sekolah Menengah Pertama.");
  const sma = await upsertLevel("SMA", "sma", "Sekolah Menengah Atas.");

  // --- Subject: Fisika (SMA) -------------------------------------------
  const fisika = await prisma.subject.upsert({
    where: { educationLevelId_slug: { educationLevelId: sma.id, slug: "fisika" } },
    update: { name: "Fisika", description: "Materi Fisika SMA.", icon: "atom", status: ContentStatus.PUBLISHED },
    create: {
      educationLevelId: sma.id,
      name: "Fisika",
      slug: "fisika",
      description: "Materi Fisika SMA.",
      icon: "atom",
      status: ContentStatus.PUBLISHED,
    },
  });

  const kinematika = await prisma.topic.upsert({
    where: { subjectId_slug: { subjectId: fisika.id, slug: "kinematika" } },
    update: { name: "Kinematika", description: "Gerak lurus dan gerak parabola.", order: 1 },
    create: { subjectId: fisika.id, name: "Kinematika", slug: "kinematika", description: "Gerak lurus dan gerak parabola.", order: 1 },
  });

  const parabornContent = [
    { id: "p1", type: "heading", content: "Gerak Parabola", level: 2 },
    {
      id: "p2",
      type: "text",
      content:
        "Gerak parabola adalah perpaduan gerak lurus beraturan (GLB) pada sumbu horizontal dan gerak lurus berubah beraturan (GLBB) pada sumbu vertikal. Contohnya: bola yang ditendang, air yang muncrat dari selang, atau atlet lompat jauh.",
    },
    {
      id: "p3",
      type: "callout",
      content:
        "Kunci memahami gerak parabola: kecepatan horizontal (vx) selalu tetap karena tidak ada percepatan horizontal, sedangkan kecepatan vertikal (vy) berubah karena dipengaruhi gravitasi.",
      variant: "tip",
    },
    { id: "p4", type: "heading", content: "Komponen Kecepatan", level: 3 },
    {
      id: "p5",
      type: "text",
      content:
        "Jika sebuah benda dilempar dengan kecepatan awal v₀ membentuk sudut θ terhadap horizontal, kecepatan awalnya diuraikan menjadi dua komponen: v₀ₓ = v₀ cos θ dan v₀ᵧ = v₀ sin θ.",
    },
    { id: "p6", type: "formula", content: "x(t) = v_0 \\cos\\theta \\cdot t", display: true },
    { id: "p7", type: "formula", content: "y(t) = v_0 \\sin\\theta \\cdot t - \\frac{1}{2} g t^2", display: true },
    {
      id: "p8",
      type: "example",
      content:
        "Contoh: Sebuah bola ditendang dengan kecepatan 20 m/s membentuk sudut 30° terhadap horizontal. Kecepatan horizontalnya v₀ₓ = 20 cos 30° ≈ 17,3 m/s, dan vertikalnya v₀ᵧ = 20 sin 30° = 10 m/s.",
    },
    { id: "p9", type: "heading", content: "Jelajahi Simulasi", level: 3 },
    {
      id: "p10",
      type: "text",
      content:
        "Gunakan simulasi interaktif di bawah ini. Ubah kecepatan awal dan sudut elevasi, lalu amati bagaimana lintasan parabola berubah.",
    },
    { id: "p11", type: "interactive", component: "projectile-simulator", config: { gravity: 9.8 } },
    { id: "p12", type: "divider" },
    { id: "p13", type: "heading", content: "Uji Pemahaman", level: 3 },
    {
      id: "p14",
      type: "text",
      content: "Selesaikan latihan soal di bagian bawah halaman untuk menguji pemahamanmu tentang gerak parabola.",
    },
  ];

  const gerakParabola = await prisma.lesson.upsert({
    where: { subjectId_slug: { subjectId: fisika.id, slug: "gerak-parabola" } },
    update: {},
    create: {
      educationLevelId: sma.id,
      subjectId: fisika.id,
      topicId: kinematika.id,
      title: "Gerak Parabola",
      slug: "gerak-parabola",
      description: "Pelajari konsep gerak parabola melalui penjelasan, visualisasi interaktif, dan latihan soal.",
      content: parabornContent as object,
      difficulty: Difficulty.INTERMEDIATE,
      status: ContentStatus.PUBLISHED,
      order: 1,
      durationMinutes: 12,
      publishedAt: new Date(),
    },
  });

  const questions = [
    {
      question: "Pada gerak parabola, kecepatan horizontal (vx) bersifat …",
      options: [
        { id: "A", text: "tetap" },
        { id: "B", text: "bertambah" },
        { id: "C", text: "berkurang" },
        { id: "D", text: "berubah teratur" },
      ],
      correctAnswer: "A",
      explanation: "Kecepatan horizontal tetap karena tidak ada percepatan pada arah horizontal (dengan mengabaikan gesekan udara).",
      difficulty: Difficulty.BEGINNER,
      order: 1,
    },
    {
      question: "Sudut elevasi yang menghasilkan jangkauan maksimum (tanpa hambatan udara) adalah …",
      options: [
        { id: "A", text: "30°" },
        { id: "B", text: "45°" },
        { id: "C", text: "60°" },
        { id: "D", text: "90°" },
      ],
      correctAnswer: "B",
      explanation: "Jangkauan maksimum terjadi pada sudut 45° karena sin(2θ) bernilai maksimum saat 2θ = 90°.",
      difficulty: Difficulty.BEGINNER,
      order: 2,
    },
    {
      question: "Sebuah bola ditendang dengan kecepatan 20 m/s pada sudut 30°. Berapa kecepatan horizontalnya? (cos 30° ≈ 0,87)",
      options: [
        { id: "A", text: "10 m/s" },
        { id: "B", text: "17,3 m/s" },
        { id: "C", text: "20 m/s" },
        { id: "D", text: "23 m/s" },
      ],
      correctAnswer: "B",
      explanation: "v₀ₓ = v₀ cos θ = 20 × cos 30° = 20 × 0,87 ≈ 17,3 m/s.",
      difficulty: Difficulty.BEGINNER,
      order: 3,
    },
  ];

  const existingQuestions = await prisma.question.findMany({
    where: { lessonId: gerakParabola.id },
  });
  if (existingQuestions.length === 0) {
    for (const q of questions) {
      await prisma.question.create({
        data: { lessonId: gerakParabola.id, ...q },
      });
    }
  }

  // --- Gravitasi Newton Lesson in Fisika ---
  const gravitasiContent = [
    { id: "g1", type: "heading", content: "Kisah Apel dan Hukum Gravitasi Universal", level: 2 },
    {
      id: "g2",
      type: "text",
      content:
        "Pengamatan jatuhnya buah apel di hadapan Isaac Newton pada tahun 1665 memicu pemikiran mendalam mengapa benda selalu jatuh tegak lurus menuju pusat bumi. Newton merumuskan bahwa gaya tarik yang sama juga mengikat Bulan tetap pada orbitnya.",
    },
    { id: "g3", type: "formula", content: "F = G \\frac{m_1 \\cdot m_2}{r^2}", display: true },
    { id: "g4", type: "formula", content: "g = \\frac{G M_{\\text{bumi}}}{R_{\\text{bumi}}^2} \\approx 9.81\\text{ m/s}^2", display: true },
    {
      id: "g5",
      type: "callout",
      content:
        "Di ruang hampa tanpa hambatan udara, semua benda jatuh bebas dengan percepatan yang sama persis (g ≈ 9.81 m/s²), terlepas dari berapapun massanya!",
      variant: "info",
    },
    { id: "g6", type: "heading", content: "Simulasi Interaktif: Apel Jatuh & Ruang Hampa Galileo", level: 3 },
    { id: "g7", type: "interactive", component: "newtonian-gravity", config: { defaultObject: "apple", initialHeight: 5.0, airResistance: false } },
    { id: "g8", type: "divider" },
  ];

  await prisma.lesson.upsert({
    where: { subjectId_slug: { subjectId: fisika.id, slug: "gravitasi-newton" } },
    update: {},
    create: {
      educationLevelId: sma.id,
      subjectId: fisika.id,
      topicId: kinematika.id,
      title: "Hukum Gravitasi Newton & Gerak Jatuh Bebas",
      slug: "gravitasi-newton",
      description: "Pelajari hukum gravitasi universal Newton, gerak jatuh bebas apel di bawah pohon, dan perbandingan ruang hampa vs udara.",
      content: gravitasiContent as object,
      difficulty: Difficulty.BEGINNER,
      status: ContentStatus.PUBLISHED,
      order: 2,
      durationMinutes: 15,
      publishedAt: new Date(),
    },
  });

  // --- Subject: Matematika (SMA) with Trigonometri + trig visualizer ---
  const matematika = await prisma.subject.upsert({
    where: { educationLevelId_slug: { educationLevelId: sma.id, slug: "matematika" } },
    update: { name: "Matematika", description: "Materi Matematika SMA.", icon: "calculator", status: ContentStatus.PUBLISHED },
    create: { educationLevelId: sma.id, name: "Matematika", slug: "matematika", description: "Materi Matematika SMA.", icon: "calculator", status: ContentStatus.PUBLISHED },
  });
  const trigonometriTopic = await prisma.topic.upsert({
    where: { subjectId_slug: { subjectId: matematika.id, slug: "trigonometri" } },
    update: { name: "Trigonometri", description: "Rasio trigonometri dan lingkaran satuan.", order: 1 },
    create: { subjectId: matematika.id, name: "Trigonometri", slug: "trigonometri", description: "Rasio trigonometri dan lingkaran satuan.", order: 1 },
  });
  await prisma.lesson.upsert({
    where: { subjectId_slug: { subjectId: matematika.id, slug: "perbandingan-trigonometri" } },
    update: {},
    create: {
      educationLevelId: sma.id,
      subjectId: matematika.id,
      topicId: trigonometriTopic.id,
      title: "Perbandingan Trigonometri",
      slug: "perbandingan-trigonometri",
      description: "Kenali sinus, kosinus, dan tangen melalui lingkaran satuan.",
      content: [
        { id: "t1", type: "heading", content: "Perbandingan Trigonometri", level: 2 },
        {
          id: "t2",
          type: "text",
          content:
            "Pada segitiga siku-siku, sinus, kosinus, dan tangen suatu sudut didefinisikan sebagai perbandingan panjang sisi-sisinya.",
        },
        { id: "t3", type: "formula", content: "\\sin\\theta = \\frac{\\text{depan}}{\\text{miring}}", display: true },
        { id: "t4", type: "formula", content: "\\cos\\theta = \\frac{\\text{samping}}{\\text{miring}}", display: true },
        { id: "t5", type: "heading", content: "Visualisasi Lingkaran Satuan", level: 3 },
        { id: "t6", type: "interactive", component: "trigonometry-visualizer", config: { initialAngle: 45 } },
      ] as object,
      difficulty: Difficulty.BEGINNER,
      status: ContentStatus.PUBLISHED,
      order: 1,
      durationMinutes: 10,
      publishedAt: new Date(),
    },
  });

  // --- Biology (Umum) with Cell Explorer ---------------------------------
  const biologi = await prisma.subject.upsert({
    where: { educationLevelId_slug: { educationLevelId: umum.id, slug: "biologi" } },
    update: { name: "Biologi", description: "Ilmu tentang makhluk hidup.", icon: "leaf", status: ContentStatus.PUBLISHED },
    create: { educationLevelId: umum.id, name: "Biologi", slug: "biologi", description: "Ilmu tentang makhluk hidup.", icon: "leaf", status: ContentStatus.PUBLISHED },
  });
  const selTopic = await prisma.topic.upsert({
    where: { subjectId_slug: { subjectId: biologi.id, slug: "sel" } },
    update: { name: "Sel", description: "Struktur dan fungsi sel.", order: 1 },
    create: { subjectId: biologi.id, name: "Sel", slug: "sel", description: "Struktur dan fungsi sel.", order: 1 },
  });
  await prisma.lesson.upsert({
    where: { subjectId_slug: { subjectId: biologi.id, slug: "sel-dan-organel" } },
    update: {},
    create: {
      educationLevelId: umum.id,
      subjectId: biologi.id,
      topicId: selTopic.id,
      title: "Sel dan Organel",
      slug: "sel-dan-organel",
      description: "Jelajahi struktur sel dan fungsi organel secara interaktif.",
      content: [
        { id: "s1", type: "heading", content: "Sel sebagai Unit Kehidupan", level: 2 },
        {
          id: "s2",
          type: "text",
          content:
            "Sel adalah unit struktural dan fungsional terkecil dari makhluk hidup. Di dalam sel terdapat organel-organel dengan fungsi spesifik.",
        },
        { id: "s3", type: "heading", content: "Jelajahi Sel", level: 3 },
        { id: "s4", type: "interactive", component: "cell-explorer", config: { initialOrganelle: "nucleus" } },
        {
          id: "s5",
          type: "callout",
          content:
            "Ingat: nukleus adalah pusat kendali sel, mitokondria adalah 'pembangkit tenaga', dan ribosom adalah tempat sintesis protein.",
          variant: "info",
        },
      ] as object,
      difficulty: Difficulty.BEGINNER,
      status: ContentStatus.PUBLISHED,
      order: 1,
      durationMinutes: 8,
      publishedAt: new Date(),
    },
  });

  console.log("Seeding...");
  console.log("Seed complete.");
  console.log(`  Admin:  ${admin.email}  (role ADMIN)`);
  console.log(`  Siswa:  ${student.email}  (role USER)`);
  console.log(`  Lesson tersedia: /learn/sma/fisika/kinematika/gerak-parabola`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });