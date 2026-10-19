# IVE-APP — Frontend Design & UI Implementation Brief
# Source of Truth: Arsitektur Visual, Sistem Desain, & Pengalaman Belajar Interaktif

> **Versi Dokumen:** 2.0 — Diselaraskan dengan implementasi aktual, `AGENTS.md` v2.0, `IVE_TAD_Phase_1.md` v2.0, dan `IVE-APP-PRD.md` v2.0  
> **Terakhir Diperbarui:** 2026-10-19  
> **Cakupan:** Seluruh antarmuka publik dan pengalaman pengguna/pelajar (*student-facing web app*).  
> **Larangan Mutlak:** Dilarang mengubah, mendesain ulang, atau menyentuh area Admin CMS (`/admin/*`) pada brief ini.  
> **Bahasa UI:** Bahasa Indonesia untuk seluruh antarmuka dan materi pembelajaran. Bahasa Inggris untuk kode, token, variabel, dan komentar commit.

---

## 0. Instruksi Utama & Prinsip Filosofi Desain

Anda bertindak sebagai **Principal Product Designer, Design Systems Architect, dan Lead Frontend Engineer** untuk IVE-APP (*Interactive Visual Education Application*). Dokumen ini adalah **kontrak desain dan pedoman visual resmi (Source of Truth)** untuk menjamin konsistensi estetika, hierarki kognitif, dan integritas teknis di seluruh halaman website.

### 0.1 Karakter & Archetype Visual
IVE-APP mengusung gaya **Soft Neobrutalism meets Oblo-inspired Editorial Warmth**:
1. **Bukan Putih Menyilaukan, Bukan Abu-Abu Kusam:** Latar belakang utama menggunakan linen/batu hangat (*warm vintage stone canvas* `#F4F1EA`), memberikan rasa tenang, elegan, dan ramah di mata (*eye-comfort*) saat belajar berjam-jam layaknya membaca buku sains premium.
2. **Garis Batas Tegas & Percaya Diri (Crisp High-Contrast Outlines):** Menggunakan border solid 2px hingga 3.5px (`border-stone-900` atau `border-stone-900/10` hingga `border-stone-900/40` pada light mode, `border-white` atau `border-stone-800` pada dark mode).
3. **Hard Offset Shadow (Neobrutalist Drop Shadow):** Elemen interaktif dan kartu menggunakan bayangan tanpa blur (*zero-blur offset shadow*), misalnya `shadow-[3.5px_3.5px_0px_0px_rgba(24,24,27,0.9)]` untuk memberikan kedalaman fisik (*tactile elevation*) yang tegas.
4. **Asymmetric & Anti-Monotony Layouts:** Menolak pola kartu grid horizontal seragam yang monoton. Menggunakan kombinasi **Asymmetric Bento Grid** dan **Interactive Stepped Timeline Process** yang dinamis terinspirasi dari referensi modern seperti `oblo.aura.build`.
5. **Setiap Mata Pelajaran Memiliki Identitas Warna Kognitif Tersendiri:** Matematika, Fisika, Kimia, Biologi, dan Sains Populer masing-masing memiliki tema warna latar (*tint*), kartu, border, badge, dan ikon yang saling terhubung harmonis.

### 0.2 Core Learning Loop
Pengalaman belajar pengguna mengikuti alur sirkular:
```text
DISCOVER → LEARN → INTERACT → PRACTICE → ASK AI → EVALUATE/COMPLETE → CONTINUE
```

---

## 1. Token Warna & Palet Global (Design System Tokens)

Semua komponen wajib mengonsumsi token semantic dari `src/app/globals.css`. Dilarang menggunakan warna *hardcoded* acak di luar sistem token.

### 1.1 Palet Utama (Base Canvas & Surface)

| Token Semantic | Nilai Light Mode | Nilai Dark Mode | Karakter & Kegunaan |
|---|---|---|---|
| `--background` | `#F4F1EA` (Stone Linen) | `#121316` (Deep Charcoal) | Kanvas latar belakang utama website; lembut dan bebas silau. |
| `--foreground` | `#1E2024` (Charcoal Obsidian) | `#F4F1EA` (Stone Linen) | Warna teks utama; memenuhi standar WCAG AAA (kontras > 9:1). |
| `--card` | `#FCFAF6` (Warm Cream Ivory) | `#191B20` (Dark Slate) | Permukaan kartu, kontainer bento, dan panel konten. |
| `--card-foreground` | `#1E2024` | `#F4F1EA` | Teks di dalam kartu dan panel. |
| `--popover` | `#FCFAF6` | `#191B20` | Permukaan tooltip, dropdown menu, dan popover. |
| `--popover-foreground` | `#1E2024` | `#F4F1EA` | Teks di dalam popover. |
| `--primary` | `#2A3FB8` (Royal Cobalt) | `#4F6BFF` (Electric Cobalt) | Aksen brand utama, tombol CTA primer, dan status aktif navigasi. |
| `--primary-foreground` | `#FFFFFF` | `#121316` | Teks di atas tombol primary. |
| `--secondary` | `#EBE6DC` (Warm Sandstone) | `#242730` | Kontainer sekunder, tombol sekunder, dan badge netral. |
| `--secondary-foreground` | `#22242B` | `#F4F1EA` | Teks di dalam tombol atau kontainer sekunder. |
| `--muted` | `#EBE6DC` | `#242730` | Status non-aktif, pill filter yang tidak terpilih. |
| `--muted-foreground` | `#525662` (Deep Stone Gray) | `#A4AAB7` | Teks penjelasan sekunder, metadata, dan waktu baca. |
| `--accent` | `#E5EFFE` (Soft Ice Blue) | `#1E2B4D` | Highlight hover ringan dan aksen navigasi sekunder. |
| `--accent-foreground` | `#1E3A8A` | `#93B4F8` | Teks penekanan di atas latar aksen. |
| `--border` | `#DCD6C9` (Soft Earth Border) | `#2D313C` | Garis batas struktural pada layout halus. |
| `--ring` | `#2A3FB8` | `#4F6BFF` | Focus outline ring untuk aksesibilitas navigasi keyboard. |
| `--destructive` | `#DC2626` (Bright Crimson) | `#EF4444` | Pesan error validasi, jawaban keliru pada kuis, atau aksi hapus. |

---

## 2. Sistem Warna Kognitif Mata Pelajaran (Cognitive Subject Themes)

Untuk memudahkan identifikasi visual saat berpindah mata pelajaran, setiap subjek memiliki **tema warna khusus** yang dikonfigurasi secara modular di [`src/components/ui/subject-theme.tsx`](file:///d:/Kerjaan/IVE-APP/src/components/ui/subject-theme.tsx).

Warna-warna ini diaplikasikan pada latar belakang halaman materi (`bgTint`), kartu materi (`cardBg`), garis batas kartu (`cardBorder`), badge, ikon, dan bayangan (*shadow*).

### 2.1 Spesifikasi Tema Mata Pelajaran

| Mata Pelajaran | Ikon Utama | Warna Brand & Hex | `bgTint` (Latar Halaman) | `cardBg` (Kartu) | `cardBorder` & Shadow | Karakter Ilmiah & Contoh Materi |
|---|---|---|---|---|---|---|
| **Matematika** | `Sigma` / `Binary` | **Soft Cobalt** (`#1E40AF` / `#2563EB`) | Light: `#EEF4FF`<br>Dark: `#131A29` | Light: `#F3F7FF`<br>Dark: `#162035` | `border-[#93B4F8]`<br>`shadow-[3.5px_3.5px_0px_0px_rgba(30,58,138,0.85)]` | Logika, Kalkulus, Lingkaran Satuan, & Trigonometri ($\sin^2\theta + \cos^2\theta = 1$). |
| **Fisika** | `Atom` | **Cyan Azure** (`#0891B2` / `#0E5263`) | Light: `#EBF8FB`<br>Dark: `#112025` | Light: `#F1FCFD`<br>Dark: `#15272E` | `border-[#87D7E8]`<br>`shadow-[3.5px_3.5px_0px_0px_rgba(8,145,178,0.85)]` | Mekanika, Vektor, Gravitasi, & Gerak Parabola ($y = v_0 \sin(\theta)t - \frac{1}{2}gt^2$). |
| **Kimia** | `FlaskConical` / `Flame` | **Royal Lilac** (`#7C3AED` / `#581C87`) | Light: `#F7F0FC`<br>Dark: `#1F1426` | Light: `#FAF5FD`<br>Dark: `#25182F` | `border-[#D8B4FE]`<br>`shadow-[3.5px_3.5px_0px_0px_rgba(124,58,237,0.85)]` | Struktur Ikatan, Termodinamika Molekuler, & Konversi Suhu ($0\text{ K} = -273.15^\circ\text{C}$). |
| **Biologi** | `Dna` | **Sage Emerald** (`#059669` / `#065F35`) | Light: `#EFF8F2`<br>Dark: `#122216` | Light: `#F4FAF6`<br>Dark: `#162A1C` | `border-[#93E2B1]`<br>`shadow-[3.5px_3.5px_0px_0px_rgba(5,150,105,0.85)]` | Metabolisme Seluler, Siklus Krebs (+36 ATP Yield), & Organel Mikroskopis. |
| **General Knowledge** | `Globe2` / `Zap` | **Warm Solar Amber** (`#D97706` / `#7B341E`) | Light: `#FDF6EC`<br>Dark: `#241A10` | Light: `#FEFAEF`<br>Dark: `#2C2013` | `border-[#F9CE87]`<br>`shadow-[3.5px_3.5px_0px_0px_rgba(217,119,6,0.85)]` | Sains Populer, Reaksi Berantai Fisi Nuklir ($^{235}\text{U} + \text{n}$), & Astronomi. |

### 2.2 Cara Memanggil Tema Subjek di Komponen
Gunakan utilitas resmi:
```tsx
import { getSubjectTheme, SubjectIcon } from "@/components/ui/subject-theme";

const theme = getSubjectTheme(subjectSlug);

<div className={`min-h-screen ${theme.bgTint}`}>
  <div className={`rounded-3xl border-2 ${theme.cardBorder} ${theme.cardBg} ${theme.shadowColor} p-6`}>
    <SubjectIcon slug={subjectSlug} size={28} />
    <span className={`rounded-full border px-2.5 py-0.5 ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
      {theme.name}
    </span>
  </div>
</div>
```

---

## 3. Sistem Geometri, Radius, & Tipografi

### 3.1 Skala Radius Sudut (Curvature Tokens)
- **`rounded-3xl` (24px–28px):** Wadah kartu utama, hero preview, dan bento grid showcase.
- **`rounded-2xl` (16px–20px):** Kontainer dalam (*inner container*), kontainer ikon, dan kotak simulasi interaktif.
- **`rounded-xl` (12px–14px):** Tombol aksi (CTA), input teks, dropdown filter, dan kartu pilihan jawaban kuis.
- **`rounded-full` (9999px):** Badge status, kapsul navigasi (*island nav pill*), dan indikator aktif.

### 3.2 Hierarki Tipografi & Keterbacaan
- **Font Utama:** Inter / Sans Modern dengan fitur tipografi tingkat lanjut: `font-feature-settings: "cv02", "cv03", "cv04", "cv11"` untuk bentuk angka dan glif yang jernih.
- **Font Formula & Angka:** `font-mono` (Geist Mono) untuk nilai numerik, langkah langkah proses, sudut parameter, dan token kode.
- **Ukuran Body Text:** Standar minimum `15.5px` hingga `16px` dengan line-height santai (`leading-relaxed`), mencegah kelelahan membaca materi teori ilmiah.
- **Lebar Kolom Teks (Max Line Width):** Konten teks bacaan dibatasi maksimal `max-w-3xl` (sekitar 68–75 karakter per baris) agar mata pengguna tidak cepat lelah saat membaca penjelasan konsep.

---

## 4. Pola Navigasi Global & Interaksi Halus

### 4.1 Header Mengambang & Animated Sliding Pill Indicator
Navigasi desktop menggunakan kontainer pill mengambang yang terpusat secara mutlak (*pinned absolute center*). Hal ini mencegah menu bergeser saat bilah pencarian meluas atau menyusut.

- **Komponen:** [`src/components/layout/nav-links.tsx`](file:///d:/Kerjaan/IVE-APP/src/components/layout/nav-links.tsx).
- **Teknologi:** Framer Motion `<motion.span layoutId="navbar-active-pill" ... />`.
- **Perilaku Transisi:** Ketika pengguna berpindah antar menu (*Beranda* `/`, *Jelajahi* `/explore`, *Lab Simulasi* `/lab`, *Pembelajaran Saya* `/my-learning`), kapsul penanda warna biru meluncur secara fisik (*smooth sliding animation*) dengan fisika pegas (`type: "spring", stiffness: 400, damping: 32`), bukan berganti warna secara instan.
- **Aksi Kanan:** Search bar yang dapat meluas secara dinamis ([`ExpandableSearch`](file:///d:/Kerjaan/IVE-APP/src/components/layout/expandable-search.tsx)), menu autentikasi profil, dan menu drawer responsif untuk perangkat mobile ([`MobileNav`](file:///d:/Kerjaan/IVE-APP/src/components/layout/mobile-nav.tsx)).

### 4.2 Smooth Scrolling Tanpa Macet (Lenis Engine Architecture)
Website mengadopsi Lenis Smooth Scroll untuk memberikan pergerakan gulir yang mewah dan terkontrol.
- **Komponen:** [`src/components/layout/smooth-scroll-provider.tsx`](file:///d:/Kerjaan/IVE-APP/src/components/layout/smooth-scroll-provider.tsx).
- **Aturan Wajib CSS di `globals.css`:**
  ```css
  html.lenis, html.lenis body {
    height: auto;
  }
  .lenis.lenis-smooth {
    scroll-behavior: auto !important;
  }
  .lenis.lenis-smooth [data-lenis-prevent] {
    overscroll-behavior: contain;
  }
  .lenis.lenis-stopped {
    overflow: hidden;
  }
  ```
- **Pencegahan Scroll Freeze / Stuck Bug:** Lenis wajib dikonfigurasi dengan `autoResize: true` dan didampingi oleh `ResizeObserver` yang memantau elemen `document.body`. Hal ini memastikan bahwa penambahan elemen DOM dinamis (seperti grafik SVG, kartu bento, atau gambar yang terlambat dimuat) tidak membuat batas scroll terkunci di tengah halaman.

---

## 5. Arsitektur Komposisi Halaman Utama (Homepage `/`)

Halaman utama dirancang untuk memecah kejenuhan tata letak dengan menyajikan kombinasi struktur yang variatif dari atas hingga bawah:

```text
1. HERO SECTION (2-Column Asymmetric dengan Live Interactive Preview Card)
   ↓
2. "MENGAPA BELAJAR SECARA INTERAKTIF?" (Active Learning Value Prop Grid)
   ↓
3. "EMPAT LANGKAH MENUJU PEMAHAMAN MANDIRI" (Interactive Stepper + Live Sandbox Stage)
   ↓
4. "IDENTITAS VISUAL & KEILMUAN TIAP SUBJEK" (Asymmetric Oblo-style Bento Showcase)
   ↓
5. "LABORATORIUM SIMULASI MANDIRI" (Direct Interactive Sandboxes Carousel)
   ↓
6. "PILIH TOPIK & MULAI BEREKSPERIMEN" (Curated Interactive Lessons Grid)
   ↓
7. CALL-TO-ACTION BANNER (High-Contrast Cobalt Neobrutalism)
```

### 5.1 Rincian: Interactive Stepped Process Roadmap (`LearningLoopPillars`)
Menggantikan deretan kartu 4-kolom horizontal yang repetitif dengan tata letak asimetris 2-kolom:
- **Kolom Kiri (5 Kolom Grid Desktop):** Stepper interaktif vertikal (Langkah 01–04) yang dapat diklik atau di-hover, dilengkapi badge status, ikon peraga, dan indikator titik animasi berdenyut (*pulsing indicator*).
- **Kolom Kanan (7 Kolom Grid Desktop):** Panggung demonstrasi simulasi nyata (`IVE_STAGE`) yang langsung merespons langkah aktif:
  - *Langkah 01 (Amati Visual):* Miniatur diagram siklus biologi seluler berotasi halus dengan tag produksi energi (+2 ATP, +6 NADH).
  - *Langkah 02 (Eksperimen Sandbox):* Slider sudut elevasi yang dapat digeser ($15^\circ$–$75^\circ$) dengan kalkulasi jarak jatuh horizontal parabola dan lintasan kurva SVG dinamis seketika.
  - *Langkah 03 (Uji Pemahaman):* Kartu kuis interaktif formatif di mana pengguna dapat mengklik opsi jawaban dan langsung menerima penjelasan teoretis edukatif (misal: definisi nol mutlak $-273.15^\circ\text{C}$).
  - *Langkah 04 (Tanya AI):* Mock percakapan tutor AI kontekstual yang menjelaskan penurunan matematis sudut optimal $45^\circ$.

### 5.2 Rincian: Oblo-Inspired Asymmetric Bento Showcase (`SubjectShowcaseSection`)
Menolak tata letak 5 kartu seragam dengan membagi ruang secara fungsional berdasarkan bobot materi:
- **Kartu Hero Utama (7 Kolom Grid Desktop — Fisika):** Menggunakan kanvas biru lembut (`#EBF2FE`), dilengkapi rumus gerak peluru $y = v_0 \sin(\theta)t - \frac{1}{2}gt^2$, lencana simulasi 60 FPS, dan tombol cepat menuju Lab Fisika.
- **Kartu Pendamping (5 Kolom Grid Desktop — Biologi):** Menggunakan kanvas hijau lembut (`#EBF7F0`), lencana rendemen ATP, dan penanda ketersediaan video penjelasan lokal.
- **Trio Kartu Bawah (Masing-masing 4 Kolom Grid Desktop):**
  - *Kimia:* Termodinamika molekuler dan visual skala nol mutlak $0\text{ K}$.
  - *Matematika:* Geometri analitik dan identitas trigonometri $\sin^2\theta + \cos^2\theta = 1$.
  - *Sains Populer:* Reaksi fisi berantai Uranium-235 dan simulasi pengendalian batang reaktor.

---

## 6. Halaman Materi Pembelajaran (`/learn/[level]/[subject]/[topic]/[lesson]`)

Halaman ini adalah inti produk IVE-APP dan memegang standar kualitas tertinggi.

### 6.1 Tata Letak Workspace
1. **Latar Belakang Tematik Dinamis:** Halaman secara otomatis mengambil warna latar belakang `theme.bgTint` sesuai mata pelajaran yang dibuka (misal `#EFF8F2` untuk Biologi, `#EBF8FB` untuk Fisika), menciptakan suasana imersif.
2. **Breadcrumb Navigasi:** Beranda → Jenjang → Mata Pelajaran (dengan ikon) → Topik → Judul Pelajaran.
3. **Panel Konten Terstruktur (Content Blocks Engine):**
   - **Teks Teori & Penjelasan:** Tipografi nyaman baca dengan peraga visual.
   - **Video Konsep:** Mendukung pemutar video HTML5 lokal (misalnya `./public/assets/video/example-vieo-biologi-contect.mp4` untuk materi Biologi Siklus Krebs) serta embed YouTube ramah privasi dengan fallback bila offline.
   - **Blok Rumus Matematis (KaTeX):** Render LaTeX murni dengan kontainer scroll horizontal lokal bila rumus panjang, dilengkapi penanganan kesalahan sintaks tanpa merusak halaman.
   - **Komponen Interaktif / Sandbox:** Simulasi langsung di mana variabel dapat diuji secara bebas oleh siswa.
   - **Latihan & Kuis Formatif Terbimbing:** Soal latihan di akhir sesi dengan umpan balik ramah yang membimbing pemahaman.
   - **Daftar Sumber Terverifikasi ("Sumber"):** Bagian wajib di bawah materi yang memuat judul referensi, nama penulis, institusi/penerbit, tahun, dan tautan orisinal.
4. **Tutor AI Kontekstual ("Tanya AI"):** Drawer sisi kanan yang membaca konteks materi yang sedang dibuka, siap menjawab pertanyaan spesifik pelajar tanpa perlu keluar dari materi.

---

## 7. Standar Aksesibilitas (WCAG AA/AAA) & Performa

### 7.1 Aturan Kontras & Keterbacaan Warna
1. **Dilarang Menempatkan Teks Putih di Atas Warna Pastel Terang:** Label badge pada latar terang wajib menggunakan warna teks gelap yang pekat (contoh: teks `text-amber-900` di atas `bg-amber-100`, `text-blue-900` di atas `bg-blue-100`).
2. **Dilarang Mengandalkan Warna Saja untuk Menyampaikan Status:** Kesalahan atau keberhasilan kuis wajib menyertakan ikon pembeda (`CheckCircle2` untuk benar, `XCircle` untuk salah) serta teks penjelasan deskriptif.
3. **Target Sentuh Minimum:** Seluruh tombol navigasi, filter kuis, dan kontrol slider memiliki target interaksi sentuh minimal $44 \times 44\text{ px}$ pada layar ponsel.

### 7.2 Efisiensi Performa & Bandwidth Rendah
1. **Bebas WebGL Berat yang Membebani GPU:** Komponen visual interaktif mengutamakan SVG presisi tinggi dan manipulasi Canvas 2D murni, memastikan performa 60 FPS tetap tercapai pada ponsel kelas menengah (*mid-range smartphones*).
2. **Mode Offline & Fallback Tangguh:** Layanan modul (`services`) dilengkapi penanganan toleransi kegagalan (*fault tolerance*) otomatis ke berkas dummy lokal terstruktur ([`src/data/dummy-data.ts`](file:///d:/Kerjaan/IVE-APP/src/data/dummy-data.ts)) jika server database PostgreSQL sedang offline (`ECONNREFUSED`), sehingga tampilan antarmuka tidak pernah melempar layar putih crash.

---

## 8. Kontrak Perilaku Agen & Aturan Modifikasi

Setiap agen AI yang bekerja pada frontend IVE-APP wajib mematuhi aturan berikut:
1. **Jangan Menyentuh Admin CMS:** Halaman `/admin/*` dan komponen CMS admin berada di luar cakupan pekerjaan ini.
2. **Konsistensi Token:** Selalu gunakan variabel dari `globals.css` dan `SUBJECT_THEMES` dari `subject-theme.tsx`. Jangan membuat skema warna ad-hoc baru.
3. **Pertahankan Validasi:** Setelah melakukan perubahan frontend, selalu jalankan `npm run typecheck`, `npm run lint`, dan pastikan `npm run build` berhasil dengan 0 error sebelum melaporkan pekerjaan selesai.
4. **Keaslian Identitas:** Pertahankan karakter orisinal IVE-APP; pelajari metodologi pembelajaran dari platform global tanpa meniru aset, branding, atau salinan visual mereka.
