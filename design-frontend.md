# IVE-APP — Frontend Design & UI Implementation Brief

**Versi:** 1.0  
**Status:** Instruksi kerja untuk AI coding agent  
**Cakupan:** Hanya frontend yang digunakan pelajar/pengguna akhir (*student-facing web app*)  
**Bahasa UI:** Bahasa Indonesia  
**Tema:** Light theme sebagai default  
**Referensi pengalaman:** Prinsip *learn by doing*, visual learning, interactive problem solving, dan guided learning path dari Brilliant.org — bukan menyalin identitas atau layout persisnya.

---

## 0. Instruksi Utama untuk AI Agent

Anda bertindak sebagai **Senior Product Designer, UX Engineer, dan Senior Frontend Engineer** untuk IVE-APP (*Interactive Visual Education Application*). Tugas Anda adalah menuntaskan **layout, visual design system, dan implementasi frontend pengguna/pelajar** agar terasa seperti produk edtech modern yang matang, menyenangkan, mudah dipahami, dan interaktif.

### Batasan scope yang wajib dipatuhi

- Fokus pada halaman yang dilihat dan digunakan pelajar/pengguna akhir.
- **Jangan membangun, mendesain, atau mengubah Admin CMS** dalam pekerjaan ini. Jangan mengerjakan route `/admin` atau komponen khusus admin.
- Jangan menggabungkan desain CMS ke dalam frontend belajar.
- Jangan mengubah kebutuhan produk atau menambahkan backend baru hanya demi visual. Hubungkan UI dengan data dan fungsi yang sudah ada jika memungkinkan.
- Jangan berhenti pada mockup, screenshot, atau halaman statis. Implementasikan frontend di codebase yang ada, dengan interaksi nyata sesuai kapabilitas backend saat ini.
- Jangan merusak fitur yang telah berfungsi. Pertahankan konvensi, arsitektur, dan dependensi proyek yang sudah ada kecuali ada alasan teknis kuat.
- Jangan menyalin logo, ilustrasi, copywriting, komposisi pixel-perfect, atau aset proprietary Brilliant.org. Ambil inspirasi pada **metode pengalaman belajar**, lalu bangun identitas visual IVE-APP yang orisinal.

### Tujuan utama

Pengguna harus merasa bahwa IVE-APP adalah ruang untuk **menemukan konsep, mencoba sendiri, mendapat umpan balik, memahami kesalahan, lalu melanjutkan belajar**. Antarmuka tidak boleh terasa seperti dashboard administrasi, portal sekolah lama, atau katalog kartu yang generik.

Prinsip pengalaman inti:

**DISCOVER → LEARN → INTERACT → PRACTICE → ASK AI → COMPLETE → CONTINUE**

Sebelum coding, periksa struktur repository, `AGENTS.md` jika tersedia, PRD IVE-APP, TAD/arsitektur yang sudah ada, route, komponen, token styling, dan data nyata. Audit implementasi terlebih dahulu; gunakan kembali komponen yang baik dan buat perubahan secara bertahap.

---

## 1. Referensi Produk dan Prinsip yang Diadaptasi

Brilliant.org dikenal dengan pendekatan pembelajaran melalui aktivitas, visualisasi, problem solving, dan umpan balik langsung. Adaptasikan prinsip berikut ke IVE-APP:

1. **Learn by doing:** siswa segera melakukan sesuatu, bukan hanya membaca paragraf panjang.
2. **One concept at a time:** pecah pengalaman menjadi bagian kecil yang punya tujuan jelas.
3. **Visual intuition:** gunakan diagram, simulasi, ilustrasi, grafik, dan manipulasi variabel untuk memperjelas ide.
4. **Guided progression:** tunjukkan apa yang sedang dipelajari, posisi/progres, dan langkah yang masuk akal berikutnya.
5. **Feedback that teaches:** jawaban benar/salah disertai alasan atau petunjuk, bukan sekadar perubahan warna.
6. **Low-friction exploration:** pengguna boleh menjelajahi materi publik tanpa dipaksa login di awal.
7. **Motivation without clutter:** progres dan pencapaian boleh terasa menyenangkan, tetapi jangan menjejalkan streak, badge, leaderboard, atau gamifikasi yang tidak termasuk kebutuhan MVP.

Referensi publik untuk memahami prinsip tersebut:
- Brilliant FAQ: https://brilliant.org/faq/
- Brilliant About / teaching approach: https://brilliant.org/about/
- Brilliant course catalog: https://brilliant.org/courses/

Ini adalah referensi pola UX, bukan spesifikasi visual yang harus disalin. IVE-APP harus punya karakter sendiri.

---

## 2. Arah Art Direction

### 2.1 Karakter visual

Buat tampilan yang:
- **Light, optimistic, modern, dan fokus pada konten.**
- Terasa cerdas tetapi tidak kaku; ramah bagi pelajar SD, SMP, SMA, dan pengguna umum.
- Memiliki ruang kosong yang cukup, tipografi kuat, ilustrasi yang bermakna, dan komponen interaktif yang terlihat bisa dicoba.
- Mengutamakan keterbacaan serta hierarki visual dibanding dekorasi.
- Menggunakan aksen warna untuk membedakan jenis materi atau status, bukan mewarnai semua permukaan.
- Menghindari tampilan template SaaS generik: jangan jadikan seluruh halaman kumpulan kartu putih dengan shadow tebal.

### 2.2 Tema terang — default wajib

Gunakan warna dasar terang dan kontras yang nyaman. Jika proyek sudah memiliki token warna, audit dan sesuaikan token tersebut daripada menambahkan sistem kedua.

Palet awal yang disarankan (boleh diselaraskan dengan token existing):

| Token | Nilai awal | Kegunaan |
|---|---|---|
| `--background` | `#F8FAFC` | Latar halaman lembut |
| `--surface` | `#FFFFFF` | Konten utama, panel, kartu penting |
| `--surface-muted` | `#F1F5F9` | Panel sekunder dan area inset |
| `--text-primary` | `#172033` | Heading dan teks utama |
| `--text-secondary` | `#526174` | Deskripsi dan metadata |
| `--border` | `#E2E8F0` | Garis pembatas halus |
| `--primary` | `#4F46E5` | CTA utama dan fokus interaksi |
| `--primary-hover` | `#4338CA` | Hover CTA |
| `--accent-teal` | `#0F9F8F` | Aksen pendukung / sukses yang sesuai |
| `--accent-amber` | `#D97706` | Peringatan ringan / aksen materi |
| `--success` | `#15803D` | Status berhasil |
| `--danger` | `#B91C1C` | Error atau jawaban salah |

Ketentuan warna:
- Jangan gunakan warna terang di atas putih jika kontras teksnya rendah.
- Jangan mengandalkan warna saja untuk menyampaikan status benar/salah/progres.
- Warna aksen mata pelajaran boleh berbeda, tetapi harus punya pemetaan token yang konsisten.
- Tema gelap tidak menjadi target desain utama fase ini. Jangan membiarkan halaman baru otomatis mewarisi tampilan dark theme dari contoh atau referensi.

### 2.3 Tipografi

- Gunakan font proyek yang sudah ada jika sesuai; jika belum ada, pilih sans-serif modern yang mudah dibaca dan mendukung Bahasa Indonesia.
- Gunakan skala tipografi konsisten: display/hero, page title, section title, card title, body, caption, label.
- Hindari terlalu banyak bobot font, uppercase berlebihan, teks abu-abu terlalu pucat, dan paragraf terlalu lebar.
- Batasi lebar baris teks panjang agar nyaman dibaca; halaman materi harus lebih mengutamakan keterbacaan daripada memenuhi lebar layar.
- Rumus matematika harus dirender dengan baik, tidak tampil sebagai teks mentah atau overflow.

### 2.4 Bentuk dan elevasi

- Gunakan radius konsisten, umumnya 12–20 px untuk panel/kartu utama dan radius lebih kecil untuk kontrol.
- Border halus lebih diutamakan daripada shadow besar.
- Shadow hanya untuk membedakan layer yang benar-benar mengambang, seperti popover atau drawer.
- Ikon harus konsisten dari satu library yang sudah dipakai proyek. Jangan mencampur gaya outline, filled, dan emoji sebagai ikon UI.
- Gunakan ilustrasi, mini diagram, atau preview visual pada kartu materi jika tersedia. Jangan memakai gambar dekoratif acak yang tidak berkaitan dengan pelajaran.

---

## 3. Layout Global dan Navigasi

### 3.1 Desktop

Buat top navigation yang ringan dan konsisten:
- Logo/wordmark **IVE-APP**.
- Navigasi utama: **Beranda**, **Jelajahi**, **Pembelajaran Saya**.
- Search entry point yang mudah ditemukan.
- Aksi akun: **Masuk** untuk guest atau avatar/menu profil untuk user login.
- Tombol/tautan jenjang jika sesuai dengan struktur navigasi yang sudah ada.

Gunakan header yang tidak terlalu tinggi, dengan konten berada dalam container terpusat dan lebar yang konsisten. Sticky header boleh digunakan jika membantu, tetapi tidak boleh menutupi konten atau menghabiskan ruang vertikal.

### 3.2 Mobile

- Gunakan header ringkas dengan wordmark, pencarian, dan menu yang mudah dijangkau.
- Navigasi bawah dapat digunakan untuk area inti jika sesuai struktur aplikasi: Beranda, Jelajahi, Pembelajaran Saya, Profil. Jangan tampilkan terlalu banyak item.
- Hindari menyusutkan navigasi desktop begitu saja menjadi satu baris yang penuh.
- Menu, filter, drawer AI, dan kontrol interaktif harus nyaman untuk sentuhan.

### 3.3 Grid dan spacing

- Gunakan sistem spacing konsisten, misalnya kelipatan 4 atau 8.
- Konten katalog menggunakan grid responsif; satu kolom pada ponsel, dua kolom pada tablet bila cukup lebar, dan tiga kolom (atau lebih bila memang bermanfaat) pada desktop.
- Jangan menetapkan lebar tetap yang menyebabkan horizontal overflow.
- Gunakan container max-width untuk menjaga konten tidak terlalu melebar pada layar besar.
- Terapkan hierarki: page intro → section → content → supporting action.

---

## 4. Halaman dan Route yang Menjadi Prioritas

Ikuti route existing terlebih dahulu. Daftar ini adalah peta kebutuhan UX, bukan izin untuk mengganti routing yang sudah berfungsi tanpa alasan.

### P0 — Wajib dituntaskan

#### 4.1 Homepage `/`

Tujuan: membuat pengguna paham manfaat IVE-APP dan segera mulai belajar.

Susunan yang disarankan:
1. Header global.
2. Hero dengan headline berorientasi manfaat, misalnya **“Pahami konsep. Coba sendiri. Jadi makin bisa.”**
3. Subheadline singkat tentang belajar melalui visual, simulasi, dan latihan.
4. CTA primer **Mulai Belajar** dan CTA sekunder **Jelajahi Materi**.
5. Elemen visual utama yang memperlihatkan konsep interaktif nyata (misalnya mini grafik, bentuk geometri, atau ilustrasi sains), bukan stock photo generik.
6. Pilihan jenjang: Umum, SD, SMP, SMA.
7. Materi/topik pilihan yang diambil dari data aktual.
8. Bagian “Belajar dengan cara mencoba” yang memperlihatkan contoh aktivitas.
9. CTA lanjutan yang jelas.
10. Footer ringkas.

Kriteria:
- Jangan membuat angka pengguna, rating, testimoni, statistik, atau klaim efektivitas palsu.
- CTA mengarah ke route yang benar.
- Jangan memenuhi hero dengan terlalu banyak kartu atau teks.
- Homepage harus memiliki komposisi visual yang khas dan tidak terlihat seperti landing page template.

#### 4.2 Jelajahi / katalog `/explore`

Tujuan: membantu pengguna menemukan topik atau materi tanpa bingung.

Komponen:
- Judul dan deskripsi halaman.
- Search input.
- Filter jenjang, mata pelajaran, dan tingkat kesulitan jika datanya tersedia.
- Filter mobile dalam drawer/sheet yang nyaman.
- Kategori/subject section yang jelas.
- Kartu materi yang menampilkan judul, ringkasan singkat, kategori, level, dan durasi/kesulitan hanya jika data tersebut tersedia.
- Empty state yang menyarankan perubahan kata kunci/filter.
- Loading skeleton yang bentuknya sesuai dengan konten akhir.

Jangan menampilkan filter dekoratif yang tidak mengubah hasil. Jangan hardcode jumlah materi jika sumber datanya tidak mendukung.

#### 4.3 Dashboard jenjang `/learn/umum`, `/learn/sd`, `/learn/smp`, `/learn/sma`

Tujuan: memberikan konteks jenjang dan jalur eksplorasi yang mudah.

Komponen:
- Judul dan intro jenjang.
- Subject tiles atau daftar mata pelajaran.
- Materi yang relevan untuk jenjang tersebut.
- “Lanjutkan belajar” hanya jika progres benar-benar tersedia.
- Status progres yang jelas tanpa dashboard penuh angka.

#### 4.4 Halaman mata pelajaran `/learn/:level/:subject`

Komponen:
- Breadcrumb.
- Nama dan ringkasan mata pelajaran.
- Topik dalam urutan yang masuk akal.
- Materi unggulan jika tersedia.
- Indikator progres per topik jika ada data progres.
- Empty state untuk subject tanpa topik.

#### 4.5 Halaman topik `/learn/:level/:subject/:topic`

Komponen:
- Breadcrumb yang mudah dipahami.
- Judul dan pengantar topik.
- Learning path/list materi yang menunjukkan urutan belajar.
- Kartu materi dengan status: belum dimulai, sedang dipelajari, selesai (hanya jika status tersebut didukung data).
- Rekomendasi “Mulai dari sini” jika urutan konten tersedia.

Kartu tidak boleh memuat metadata kosong, label dummy, atau progress bar palsu.

#### 4.6 Halaman materi `/learn/:level/:subject/:topic/:lesson`

Ini adalah halaman paling penting. Desain dan implementasikan paling matang.

Struktur desktop yang disarankan:
- Header global yang ringkas.
- Breadcrumb atau konteks topik.
- Layout dua kolom pada layar lebar: konten materi di kolom utama dan panel navigasi/progres yang lebih kecil bila bermanfaat.
- Konten utama berlebar nyaman untuk membaca.
- Panel samping dapat memuat daftar langkah/lesson terkait, progres, atau bantuan; jangan membuatnya mengganggu fokus.

Struktur mobile:
- Satu kolom.
- Navigasi materi/outline dalam accordion atau drawer.
- Kontrol simulasi dan kuis tersusun vertikal.
- Tombol aksi utama mudah dijangkau.

Konten halaman:
- Judul, ringkasan, jenjang, mata pelajaran, dan topik.
- Content blocks: rich text, heading, image/diagram, formula, video, callout, interactive component, quiz/question, dan jenis lain yang telah didukung renderer.
- Setiap blok memiliki spacing dan hierarki yang konsisten.
- Rumus, tabel, gambar, dan diagram tidak boleh menyebabkan layout pecah.
- Tombol **Tanya AI**.
- Aksi **Tandai selesai** atau pencatatan progres sesuai model yang ada.
- Navigasi materi sebelumnya/berikutnya jika tersedia.
- CTA **Mulai latihan** jika materi mempunyai kuis.
- Fallback informatif jika simulasi tidak dapat dimuat.

Hindari dinding teks. Pecah materi menjadi bagian yang mudah dipindai; gunakan ilustrasi atau visual hanya saat membantu pemahaman.

#### 4.7 Halaman kuis `/quiz/:lesson`

Buat pengalaman latihan yang fokus dan tenang, tidak seperti form survei.

Komponen:
- Progress pertanyaan, misalnya “3 dari 8” jika jumlah pertanyaan diketahui.
- Teks soal dan ilustrasi/rumus terkait.
- Pilihan jawaban dengan target klik/tap yang cukup besar.
- State jawaban terpilih yang jelas.
- Tombol periksa/lanjut yang mengikuti alur kuis existing.
- Feedback benar/salah dengan teks dan penjelasan, bukan warna saja.
- Ringkasan hasil setelah selesai: skor, jumlah benar, dan saran meninjau materi atau melanjutkan.
- Loading/error/retry state bila submit gagal.

Jangan menampilkan jawaban benar sebelum waktu yang tepat pada alur kuis. Penilaian final tetap ditentukan server sesuai arsitektur aplikasi.

#### 4.8 Search `/search`

- Search field yang menampilkan query saat ini.
- Hasil sebagai daftar/kartu yang dapat dibuka.
- Filter yang berfungsi dan dapat dibersihkan.
- Empty state yang berguna.
- Loading, error, dan retry.
- Jangan menampilkan hasil contoh yang menyamar sebagai data nyata.

#### 4.9 Pembelajaran Saya `/my-learning`

- Untuk user login: lanjutkan belajar, materi selesai, favorit, riwayat atau hasil kuis jika tersedia.
- Untuk guest: tampilkan progres lokal jika memang tersimpan, lalu jelaskan manfaat login untuk sinkronisasi tanpa memblokir akses materi publik.
- Empty state harus punya CTA relevan, misalnya “Jelajahi materi”.
- Hindari dashboard metrik kosong atau statistik palsu.

#### 4.10 Login dan profil

- Form ringkas, mudah dipahami, label dan error jelas.
- Jangan memaksa login sebelum membuka materi publik.
- Jelaskan manfaat akun: sinkronisasi progres, favorit, dan riwayat belajar.
- Tampilkan state submit, error, sukses, dan validasi.
- Jangan mengimplementasikan autentikasi palsu di frontend; integrasikan dengan mekanisme auth yang sudah ada.

### P1 — Setelah P0 stabil

- Halaman profil yang lebih lengkap.
- Detail favorit dan riwayat belajar.
- Perbaikan rekomendasi berbasis progres jika datanya sudah tersedia.
- Polesan transisi antarhalaman dan micro-interactions.

Jangan mulai P1 sebelum seluruh alur P0 konsisten dan berfungsi.

---

## 5. Sistem Desain Komponen

Gunakan design system yang reusable, bukan styling ad hoc per halaman. Sesuaikan dengan stack dan library existing.

### 5.1 Foundation

- Color tokens dan semantic tokens.
- Typography scale.
- Spacing scale.
- Border/radius.
- Elevation/shadow.
- Breakpoints.
- Focus ring dan motion tokens.

### 5.2 Komponen dasar

- Button: primary, secondary, tertiary/ghost, destructive, icon button.
- Link dan breadcrumb.
- Text input, search input, select/filter, checkbox/radio bila diperlukan.
- Badge/status label.
- Tooltip/popover bila diperlukan.
- Dialog, drawer, mobile bottom sheet.
- Tabs/accordion jika membantu struktur informasi.
- Progress indicator.
- Skeleton/loading indicator.
- Toast/inline alert.
- Empty state/error state.
- Avatar/profile menu.

### 5.3 Komponen edukasi

- Learning path header.
- Subject tile.
- Lesson card.
- Lesson progress state.
- Content block wrapper.
- Formula panel.
- Figure/diagram panel.
- Interactive activity frame.
- Question card.
- Answer option.
- Feedback/explanation panel.
- Quiz progress header.
- Quiz result summary.
- AI tutor launcher and conversation UI.
- Previous/next lesson navigation.

### 5.4 Aturan komponen

- Gunakan komponen yang sudah ada jika layak; jangan membuat duplikat dengan nama berbeda.
- Props dan variant harus memiliki makna jelas.
- Hindari satu komponen raksasa yang berisi seluruh halaman dan banyak conditional UI.
- Jangan mengubah konten CMS atau model data hanya untuk memudahkan styling.
- Semua state interaksi harus terlihat: default, hover, focus-visible, active, disabled, loading, error, success.
- Pastikan komponen tidak mengandalkan hover saja; semua fungsi utama harus bisa diakses melalui keyboard dan touch.

---

## 6. Pengalaman Komponen Interaktif

Interaktivitas adalah pembeda utama IVE-APP. Jangan mendesain simulasi seperti gambar statis dengan tombol dekoratif.

### 6.1 Aturan umum

Setiap interactive component harus memiliki:
- Judul atau konteks singkat.
- Instruksi yang menjelaskan apa yang bisa dicoba.
- Area visual yang proporsional.
- Kontrol yang jelas dan terlabel.
- Hasil yang berubah sesuai input pengguna.
- Cara reset atau kembali ke kondisi awal jika relevan.
- Penjelasan hasil atau insight yang membantu belajar.
- Layout yang beradaptasi ke layar kecil.
- Fallback atau penjelasan tekstual jika komponen gagal dimuat.

### 6.2 Komponen yang direncanakan dalam PRD

**Projectile Simulator**
- Visualisasi lintasan.
- Slider/input kecepatan awal dan sudut peluncuran; gravitasi jika dikonfigurasi.
- Hasil seperti tinggi maksimum dan jarak horizontal jika dihitung oleh komponen.
- Perubahan kontrol harus memperbarui visualisasi secara nyata.

**Trigonometry Visualizer**
- Diagram sudut/segitiga atau unit circle sesuai implementasi.
- Kontrol sudut yang bisa dimanipulasi.
- Nilai sin, cos, tan yang ditampilkan dengan format jelas.
- Tangani nilai yang tidak terdefinisi secara matematis.

**Cell Explorer**
- Diagram sel dengan organel yang dapat dipilih.
- Panel detail organel yang berubah berdasarkan pilihan.
- Di layar kecil, gunakan daftar pilihan dan detail yang ditumpuk.

**Atom Explorer**
- Representasi visual sederhana yang tidak menyesatkan secara ilmiah.
- Pilihan unsur/parameter sesuai kemampuan implementasi.
- Data partikel dan penjelasan yang jelas.

**History Timeline**
- Linimasa yang dapat dieksplorasi.
- Pilihan peristiwa membuka informasi detail.
- Mobile layout tidak memerlukan drag horizontal yang sulit.

Jangan menampilkan kontrol yang tidak berfungsi. Jika implementasi interaktif belum tersedia, tampilkan fallback yang jujur atau jangan menyajikan komponen sebagai simulasi aktif.

---

## 7. AI Tutor UI

Tutor AI merupakan pendamping belajar pada halaman materi, bukan chatbot yang menguasai seluruh layar tanpa konteks.

### Desktop
- Tombol **Tanya AI** mudah ditemukan pada halaman materi.
- Drawer sisi kanan atau panel kontekstual yang tidak merusak lebar baca materi.
- Label konteks, misalnya **“Sedang membahas: Gerak Parabola”**.
- Riwayat percakapan dengan hirarki visual yang mudah dibaca.
- Input pesan dengan tombol kirim dan state loading.
- Prompt saran: “Jelaskan lebih sederhana”, “Beri contoh lain”, “Bantu saya memahami langkah ini”.

### Mobile
- Gunakan full-height sheet/drawer yang nyaman, dengan tombol tutup yang jelas.
- Input tidak tertutup keyboard dan percakapan dapat di-scroll.
- Jangan membuat panel AI menutup konteks secara permanen; pengguna harus bisa kembali ke materi dengan mudah.

### Perilaku
- Bedakan pesan user dan tutor dengan jelas.
- Tampilkan jawaban panjang dengan line length yang nyaman dan format yang aman.
- Rumus dan list harus dirender dengan baik bila sudah didukung proyek.
- State kosong, loading, error, retry, dan limit penggunaan harus informatif.
- Jangan menampilkan API key atau detail teknis internal.
- Jangan menjanjikan jawaban instan bila backend sedang memproses.

---

## 8. Motion dan Micro-interactions

Gunakan animasi untuk memberi umpan balik, bukan sebagai dekorasi terus-menerus.

Cocok digunakan untuk:
- Hover/press feedback pada button dan lesson card.
- Perubahan state jawaban kuis.
- Perpindahan drawer atau dialog.
- Perubahan progres.
- Reveal ringan pada bagian halaman bila tidak menghambat akses konten.

Ketentuan:
- Durasi singkat dan konsisten; umumnya sekitar 120–220 ms untuk feedback kecil.
- Jangan animasikan semua elemen saat scroll.
- Hindari parallax, efek neon, glow berlebihan, dan animasi yang membuat teks bergerak.
- Hormati `prefers-reduced-motion`.
- Jangan menambahkan library animasi baru jika CSS atau library existing sudah memadai.

---

## 9. Responsive Design dan Accessibility

### 9.1 Responsive checklist

Uji setidaknya pada ukuran viewport:
- Mobile kecil: 320–375 px.
- Mobile umum: 390–430 px.
- Tablet: sekitar 768 px.
- Laptop: sekitar 1280 px.
- Desktop lebar: sekitar 1440 px atau lebih.

Pastikan:
- Tidak ada horizontal overflow yang tidak disengaja.
- Navigation, cards, forms, quizzes, formula, tables, diagrams, dan simulations tetap usable.
- Modal/drawer memiliki ukuran dan scroll yang benar.
- Filter mobile dapat dibuka, diterapkan, dan ditutup.
- Konten panjang tidak terpotong.
- Target interaksi touch idealnya sekitar 44×44 CSS px untuk kontrol penting.

### 9.2 Accessibility checklist

- Gunakan HTML semantik dan hierarki heading yang logis.
- Semua input mempunyai label yang dapat diakses.
- Semua fungsi utama dapat dioperasikan dengan keyboard.
- Focus ring terlihat dan tidak dihilangkan tanpa pengganti.
- Kontras teks memenuhi WCAG AA sejauh memungkinkan.
- Status benar/salah tidak hanya dibedakan melalui warna.
- Gambar informatif mempunyai alt text; gambar dekoratif menggunakan alt kosong.
- Dialog/drawer memiliki nama, perilaku fokus, dan cara tutup yang tepat.
- Gunakan `aria-live` secara bijak untuk feedback kuis dan status async.
- Hormati reduced motion.
- Simulasi harus menyediakan instruksi dan ringkasan teks yang membantu pengguna yang tidak dapat mengakses visualisasi secara penuh.

---

## 10. Data, Loading, Error, dan Empty States

Desain harus mencakup kondisi nyata, bukan hanya happy path.

Untuk setiap halaman data-driven, periksa:
- Loading/skeleton.
- Success dengan data.
- Empty state.
- Error state dan retry jika sesuai.
- Data parsial atau metadata yang tidak tersedia.
- Guest versus authenticated state jika relevan.

Aturan:
- Jangan membuat data palsu tampak seperti data produksi.
- Jangan tampilkan `undefined`, `null`, slug mentah, stack trace, atau pesan error internal.
- Jangan menampilkan progress 70%, durasi 10 menit, atau label “Populer” bila tidak didukung data.
- Gunakan fallback teks yang masuk akal jika metadata opsional tidak tersedia.
- Empty state harus menjelaskan situasi dan memberikan langkah selanjutnya yang berguna.
- Hindari layout shift besar saat loading selesai.

---

## 11. Content Rendering dan Detail UI

Konten materi disimpan sebagai data dan ditampilkan melalui renderer. Frontend harus menjaga konsistensi visual antarblok.

- Rich text harus memiliki hirarki heading, paragraf, list, quote, dan link yang nyaman dibaca.
- Formula harus dirender menggunakan mekanisme matematika yang telah dipilih proyek (misalnya KaTeX jika sudah digunakan).
- Gambar harus responsif, tidak pecah, dan memiliki caption/alt bila relevan.
- Video memiliki rasio yang sesuai, kontrol yang dapat diakses, dan fallback jika gagal.
- Interactive blocks harus tampak sebagai aktivitas pembelajaran yang menyatu dengan materi, bukan embed asing.
- Callout memiliki variasi semantik seperlunya: info, hint, warning, key idea.
- Tabel lebar harus bisa di-scroll secara lokal pada mobile, bukan memaksa seluruh halaman overflow.
- Konten tidak tepercaya tidak boleh dirender sebagai HTML aktif tanpa sanitasi dan kebijakan keamanan yang sesuai.

---

## 12. Aturan Implementasi Teknis

1. **Inspect before change.** Baca `AGENTS.md`, PRD, struktur route, komponen UI, dan pola data fetching yang ada sebelum mengedit.
2. **Follow the current stack.** PRD mengarah pada Next.js, React, TypeScript, Tailwind, shadcn/ui, tetapi pastikan kondisi repository aktual. Jangan mengganti framework atau styling system tanpa persetujuan dan alasan kuat.
3. **Reuse before create.** Cari komponen, token, utilitas, dan pola existing sebelum membuat yang baru.
4. **Separate concerns.** Pisahkan page composition, reusable UI, content rendering, interactive components, dan data fetching sesuai pola proyek.
5. **Avoid unnecessary dependencies.** Jangan memasang library baru hanya untuk satu efek kecil.
6. **Keep server authority.** Penilaian kuis, otorisasi, dan akses data sensitif tidak boleh dipercayakan pada UI.
7. **No fake functionality.** Setiap button/link/control harus punya aksi nyata. Jika fitur belum tersedia, jangan menyamarkannya sebagai fitur aktif.
8. **No arbitrary code execution.** Frontend hanya merender tipe konten dan interactive component yang diizinkan oleh arsitektur; jangan mengeksekusi JavaScript arbitrer dari konten.
9. **Use existing route conventions.** Jangan mengganti URL yang sudah berfungsi tanpa kebutuhan yang jelas.
10. **Keep TypeScript strict and clean.** Hindari `any` yang tidak perlu, cast paksa, dan duplikasi tipe.
11. **Protect performance.** Lazy-load komponen visual berat bila tepat, optimalkan gambar, dan hindari animasi/render yang tidak perlu.
12. **Keep scope focused.** Jangan mengerjakan CMS, admin dashboard, atau fitur backend baru dalam task desain frontend ini.

---

## 13. Workflow Kerja Agent

Kerjakan dalam urutan berikut. Jangan langsung melakukan redesign besar sebelum memahami codebase.

### Tahap A — Audit

- Baca `AGENTS.md`, PRD IVE-APP, dan dokumen arsitektur yang tersedia.
- Petakan route pengguna/pelajar yang sudah ada.
- Identifikasi design system, font, warna, icon library, layout wrapper, dan komponen yang dapat digunakan kembali.
- Jalankan aplikasi dan periksa halaman existing jika memungkinkan.
- Catat halaman yang sudah berfungsi, halaman yang belum selesai, dan regresi visual/fungsional yang ditemukan.

### Tahap B — Design foundation

- Tetapkan light theme tokens.
- Rapikan typography, spacing, container, buttons, cards, inputs, status, focus, dan responsive breakpoints.
- Bangun atau perbaiki global navigation dan layout wrapper.
- Pastikan perubahan token tidak merusak halaman lain.

### Tahap C — Implementasi berurutan

Prioritas:
1. Global shell/navigation dan homepage.
2. Explore/search dan katalog.
3. Dashboard jenjang, subject, dan topic.
4. Lesson page dan content block presentation.
5. Interactive activity states.
6. Quiz flow dan result.
7. AI tutor drawer/sheet.
8. My Learning, login, dan profil sesuai fitur yang ada.

### Tahap D — Polishing

- Perbaiki responsive behavior.
- Lengkapi loading, empty, error, disabled, success, hover, active, dan focus states.
- Periksa konsistensi jarak, alignment, typographic hierarchy, dan overflow.
- Hilangkan placeholder, dead links, tombol tanpa aksi, data palsu, dan komponen duplikat.

### Tahap E — Verifikasi

- Jalankan lint, typecheck, test, dan build sesuai script yang tersedia.
- Jalankan E2E atau smoke test untuk alur pengguna bila test setup tersedia.
- Periksa browser console dan network errors bila tooling memungkinkan.
- Uji viewport mobile, tablet, dan desktop.
- Periksa `git diff` agar perubahan tetap berada dalam scope.
- Dokumentasikan masalah yang tidak bisa diselesaikan karena API/data/backend belum tersedia; jangan menyembunyikannya dengan mock data.

Jika pekerjaan terlalu besar untuk satu iterasi, selesaikan satu kelompok halaman sampai konsisten dan terverifikasi, lalu lanjutkan. Jangan mengklaim semua selesai jika belum diuji.

---

## 14. Acceptance Criteria — Definition of Done

Pekerjaan frontend dianggap selesai jika seluruh hal berikut terpenuhi sejauh didukung codebase:

### Visual design
- [ ] Light theme diterapkan konsisten sebagai default.
- [ ] IVE-APP memiliki identitas visual orisinal dan tidak meniru pixel-perfect Brilliant.org.
- [ ] Typography, color, spacing, radius, border, dan button variants konsisten.
- [ ] Homepage punya hero dan visual learning yang kuat tanpa statistik/testimoni palsu.
- [ ] Kartu katalog, halaman materi, kuis, dan area progres memiliki hierarki yang jelas.
- [ ] UI tidak terasa seperti template dashboard admin atau sekadar grid kartu generik.

### Functionality
- [ ] Navigasi utama dan CTA menuju route yang benar.
- [ ] Search dan filter benar-benar berfungsi jika backend mendukungnya.
- [ ] Halaman jenjang, subject, topic, dan lesson memakai data yang benar.
- [ ] Content blocks dirender dengan baik.
- [ ] Komponen interaktif merespons input dan mempunyai feedback/fallback yang jelas.
- [ ] Alur kuis berjalan dari pertanyaan sampai hasil sesuai implementasi backend.
- [ ] AI tutor dapat dibuka/ditutup dan state loading/error ditangani jika integrasi tersedia.
- [ ] Guest dan logged-in state tidak menampilkan UI yang saling bertentangan.
- [ ] Tidak ada dead button, dead link, atau kontrol dekoratif yang seolah berfungsi.

### Quality
- [ ] Tidak ada horizontal overflow yang tidak disengaja pada ukuran viewport target.
- [ ] Keyboard focus dan label form jelas.
- [ ] Loading, error, empty, dan success states relevan tersedia.
- [ ] Tidak ada data palsu atau metadata placeholder yang terlihat seperti data produksi.
- [ ] Lint/typecheck/build yang tersedia berhasil, atau kegagalannya dicatat dengan jelas.
- [ ] Tidak ada perubahan ke Admin CMS atau route `/admin`.
- [ ] Perubahan tidak merusak fitur yang sudah ada.

---

## 15. Format Laporan Akhir Agent

Setelah implementasi, laporkan secara ringkas dan faktual:

1. **Halaman yang diperiksa dan diselesaikan.**
2. **Perubahan design system** (warna, tipografi, layout, komponen).
3. **Interaksi yang berfungsi** dan sumber data yang digunakan.
4. **Responsiveness/accessibility** yang telah diverifikasi.
5. **Perintah verifikasi yang dijalankan** beserta hasilnya.
6. **Kendala tersisa**, terutama yang memerlukan backend/API atau keputusan produk.
7. Konfirmasi bahwa scope Admin CMS tidak disentuh.

Jangan hanya melaporkan file yang diubah. Jelaskan hasil yang benar-benar dapat dilihat dan diuji pengguna.

---

## 16. Prioritas Keputusan Desain

Jika harus memilih di antara beberapa pendekatan, gunakan urutan prioritas berikut:

1. Membantu siswa memahami materi.
2. Membuat interaksi jelas dan mudah dicoba.
3. Menjaga keterbacaan dan aksesibilitas.
4. Konsisten dengan design system IVE-APP.
5. Responsif pada perangkat kecil.
6. Menjaga performa dan kestabilan.
7. Menambah dekorasi hanya jika mendukung poin-poin di atas.

**Hasil yang diinginkan:** frontend IVE-APP yang terang, khas, matang, responsif, dan berpusat pada pengalaman belajar aktif. Selesaikan pengalaman pengguna/pelajar terlebih dahulu. Admin CMS merupakan pekerjaan terpisah dan berada di luar scope dokumen ini.
