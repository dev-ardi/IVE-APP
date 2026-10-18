# IVE-APP — Product Requirements Document (PRD)
**Versi:** 2.0 (revisi dari v1.0 berdasarkan breakdown 5W1H)  
**Status:** Draft untuk validasi produk dan acuan implementasi  
**Nama produk:** IVE-APP  
**Nama panjang:** Interactive Visual Education Application  
**Bahasa utama:** Bahasa Indonesia  
**Platform awal:** Web responsif (Next.js)  
**Dokumen terkait:** TAD Phase 1, `AGENTS.md`, `PRD-EDU-PLATFORM.md` (sumber kebutuhan awal)

> **Cara membaca dokumen ini.** Dokumen disusun mengikuti kerangka **5W1H** (Why, Who, When, Where, What, How). Nomor FR dari v1.0 dipertahankan agar referensi di TAD dan `AGENTS.md` tidak rusak; kebutuhan baru diberi nomor FR-18 dan seterusnya. Daftar lengkap perubahan ada di **Lampiran C**, dan pemetaan 5W1H → bagian PRD ada di **Lampiran D**. Hal yang masih berupa usulan dan perlu keputusan produk ditandai **[Perlu konfirmasi]** dan dikumpulkan di Bagian 17.

---

## 1. Ringkasan Eksekutif

IVE-APP adalah aplikasi pendidikan interaktif berbasis web yang membantu siapa pun memahami konsep dengan **mencoba**, bukan hanya membaca atau menonton. Pengguna dapat mengubah nilai pada rumus atau model (misalnya kecepatan dan sudut pada gerak parabola), lalu melihat hasilnya sebagai visual yang paling sesuai: grafik, lintasan, infografis, atau diagram.

Platform belajar daring yang ada (premis tim: mis. Zenius) umumnya menyajikan materi lewat teks dan video yang bersifat satu arah. IVE-APP menambahkan lapisan **sandbox interaktif** di atas materi terstruktur, latihan soal, dan tutor AI.

Siklus belajar utama:

**DISCOVER → LEARN → INTERACT → PRACTICE → ASK AI → COMPLETE → CONTINUE**

Produk dibangun dalam tiga fase (Bagian 5):

| Fase | Fokus |
|---|---|
| **Phase 1** | Aplikasi + CMS (admin) dengan materi **Umum** dan komponen interaktif |
| **Phase 2** | CMS dapat digunakan guru/tenaga pengajar, sehingga aplikasi dapat dipakai di ruang kelas |
| **Phase 3** | Materi tingkat pendidikan wajib Indonesia: **SD, SMP, SMA**, di samping Umum |

---

## 2. Ringkasan 5W1H

| | Pertanyaan | Jawaban |
|---|---|---|
| **WHY** | Kenapa dibangun? | Mendukung tujuan Indonesia Emas 2045 melalui proses belajar-mengajar yang lebih imersif dan memberi pemahaman lebih dalam lewat elemen visual interaktif. |
| **WHO** | Untuk siapa? | Umum (pembelajar mandiri, rasa ingin tahu) pada Phase 1. Guru/tenaga pengajar pada Phase 2. Siswa SD/SMP/SMA berbasis kurikulum pada Phase 3. |
| **WHEN** | Kapan digunakan? | Kapan pun pengguna ingin belajar, penasaran, atau mencoba simulasi sederhana. Dikembangkan dalam 3 fase. |
| **WHERE** | Di mana digunakan? | Belajar mandiri (otodidak), proses belajar-mengajar di sekolah, dan bimbingan belajar. |
| **WHAT** | Apa produknya? | Aplikasi pendidikan interaktif berbasis web (Next.js) dengan: pemilihan mata pelajaran, sandbox interaktif, navigasi hierarkis, materi bersumber valid, dan bank soal/latihan. |
| **HOW** | Bagaimana bekerja? | 4 poin inti: (1) pilih materi, (2) materi multi-format + komponen interaktif, (3) latihan/kuis/evaluasi, (4) Tanya AI. Materi dikelola lewat Admin CMS dengan dua jalur: konten biasa dan pengalaman interaktif. |

---

## 3. WHY — Kenapa IVE-APP Dibangun

### 3.1 Latar belakang dan visi

IVE-APP dibangun untuk mendukung upaya peningkatan kualitas pembelajaran di Indonesia sebagai bagian dari tujuan **Indonesia Emas 2045**. Proses belajar-mengajar diharapkan menjadi lebih imersif, dan pemahaman siswa terhadap materi lebih dalam, dengan bantuan elemen visual yang dapat dimanipulasi. Kontribusi ini bersifat tidak langsung; produk tidak mengklaim dampak terukur terhadap target nasional tanpa data.

### 3.2 Masalah yang diselesaikan

1. **Materi digital cenderung pasif.** Pengguna hanya membaca atau menonton, tidak bisa mencoba.
2. **Konsep abstrak sulit dibayangkan.** Rumus, proses, dan struktur (fisika, matematika, biologi, kimia) sering hanya dijelaskan dengan teks dan gambar statis.
3. **Pembelajar mandiri tidak punya tempat bereksperimen cepat.** Rasa ingin tahu berhenti pada artikel atau video.
4. **Guru membutuhkan alat peraga visual** untuk menjelaskan konsep di kelas (Phase 2).
5. **Validitas sumber di internet bervariasi.** Pengguna sulit memastikan materi benar dan dari sumber yang layak.
6. **Materi, latihan, bantuan, dan progres tersebar** di tempat berbeda.

### 3.3 Positioning

| Aspek | Pola umum platform teks + video (premis tim) | IVE-APP |
|---|---|---|
| Format utama | Teks dan video | Teks, ilustrasi, rumus, video, **sandbox interaktif** |
| Peran pengguna | Menonton dan membaca | Mengubah parameter, mengamati hasil, lalu berlatih |
| Hasil perhitungan | Dijelaskan secara statis | Dihitung dan **divisualisasikan langsung** |
| Evaluasi | Latihan terpisah | Kuis, penjelasan jawaban, dan evaluasi terhubung ke materi |
| Bantuan | Terbatas | Tutor AI yang tahu konteks materi |
| Sumber | Tidak selalu terlihat | Sumber ditampilkan dan wajib ada saat publish |

> **[Perlu konfirmasi]** Premis tentang platform pembanding berasal dari tim dan belum diverifikasi lewat riset kompetitor. Disarankan analisis kompetitor singkat sebelum peluncuran publik.

### 3.4 Tujuan produk

- Menyediakan pengalaman belajar web yang responsif dan berfungsi dari ujung ke ujung.
- Menjadikan **sandbox interaktif** sebagai pembeda utama, bukan dekorasi.
- Memungkinkan pengguna menelusuri mata pelajaran, topik, dan materi dengan hierarki yang jelas.
- Menyajikan materi dari sumber yang dapat ditelusuri dan divalidasi.
- Menyediakan latihan, kuis, dan evaluasi yang terhubung dengan materi.
- Menyediakan CMS yang memungkinkan konten dan interaksi dikelola tanpa membuat halaman baru untuk setiap pelajaran.
- Menjaga arsitektur modular agar siap berkembang ke Phase 2 dan 3 tanpa penulisan ulang besar.

### 3.5 Bukan tujuan Phase 1

- Akun guru, pengelolaan kelas, dan bank soal berkode akses (Phase 2).
- Konten kurikulum SD/SMP/SMA secara menyeluruh (Phase 3).
- LMS sekolah penuh, absensi, nilai rapor, atau administrasi institusi.
- Aplikasi native iOS/Android, sertifikat, leaderboard, XP, gamifikasi kompleks.
- Kuis adaptif dan rekomendasi berbasis machine learning.
- Dashboard analitik kompleks.
- Microservices atau infrastruktur terdistribusi sebelum dibutuhkan.
- Editor/interaction builder no-code setara authoring suite profesional.
- Konten AI yang diterbitkan otomatis tanpa peninjauan manusia.

### 3.6 Metrik keberhasilan (baru di v2.0)

v1.0 belum memiliki metrik. Metrik berikut diperlukan agar tujuan "pengalaman belajar lebih imersif" dapat diukur.

| Metrik | Definisi | Hipotesis target awal* |
|---|---|---|
| Interaction rate | % sesi materi (yang memiliki komponen interaktif) dengan ≥1 interaksi bermakna | ≥ 40% |
| Lesson completion | % materi yang dibuka lalu ditandai selesai | ≥ 50% |
| Quiz completion | % kuis dimulai yang diselesaikan | ≥ 70% |
| Retensi 7 hari | % pengguna yang kembali dalam 7 hari | ≥ 20% |
| Penggunaan AI | % sesi materi dengan ≥1 pertanyaan AI, plus rating "membantu" | Ditetapkan setelah baseline |
| Keandalan komponen | % pemuatan komponen interaktif tanpa error | ≥ 99% |
| Validitas konten | % materi PUBLISHED yang memiliki sumber tervalidasi | **100%** (aturan keras) |

\*Angka target adalah hipotesis awal, bukan komitmen. Kalibrasi setelah ±4 minggu data baseline. Pengukuran membutuhkan event analytics minimal (FR-17).

---

## 4. WHO — Untuk Siapa

### 4.1 Segmen pengguna

| Segmen | Deskripsi | Kebutuhan utama | Fase aktif |
|---|---|---|---|
| **Pembelajar umum / otodidak** | Siapa pun yang ingin belajar atau sekadar penasaran tentang suatu konsep | Mulai tanpa registrasi; penjelasan jelas; bereksperimen cepat; tahu sumber materi | **Phase 1 (utama)** |
| **Siswa SD/SMP/SMA** | Pelajar yang belajar sesuai jenjang | Materi sesuai jenjang dan kurikulum; latihan soal; bantuan saat bingung | Konten Umum sejak Phase 1; materi per jenjang di Phase 3 |
| **Guru / tenaga pengajar** | Guru sekolah, tutor bimbel | Membuat/menyesuaikan materi; alat peraga visual; memberi latihan via kode akses; melihat hasil siswa | **Phase 2** |
| **Admin / pengelola konten** | Tim internal pembuat dan peninjau konten | Membuat, meninjau, dan menerbitkan materi dan komponen interaktif | Phase 1 |
| **Pengunjung tamu** | Pengguna belum login | Belajar tanpa hambatan; progres tersimpan lokal | Phase 1 |

### 4.2 Definisi "Umum"

Berdasarkan 5W1H (Phase 1 = materi general **Umum**, Phase 3 = SD, SMP, SMA, **Umum**), **Umum diperlakukan sebagai satu jenjang/kategori** setara SD, SMP, dan SMA. Isinya adalah materi tidak terikat kelas atau kurikulum: penjelasan konsep untuk rasa ingin tahu dan referensi visual awal. Ini menjawab pertanyaan terbuka di v1.0 tentang status "Umum".

> **[Perlu konfirmasi]** Jika "Umum" ternyata dimaksudkan sebagai katalog lintas jenjang, model data cukup menambahkan tag lintas jenjang. Model `level` yang dirancang di Bagian 7.5 tetap kompatibel.

### 4.3 Peran sistem dan matriks izin

| Kemampuan | Tamu | User | Guru (P2) | Admin |
|---|---|---|---|---|
| Jelajah materi publik, jalankan simulasi, kerjakan kuis | Ya | Ya | Ya | Ya |
| Bank soal mandiri | Ya | Ya | Ya | Ya |
| Simpan progres | Lokal | Akun | Akun | Akun |
| Favorit, riwayat belajar, riwayat AI | — | Ya | Ya | Ya |
| Bergabung ke kelas via kode akses | **[Perlu konfirmasi]** | Ya | — | — |
| Buat kelas, kode akses, dan set soal kelas | — | — | Ya | Ya |
| Lihat hasil siswa di kelasnya | — | — | Ya (kelas sendiri) | Ya |
| Buat/ubah konten (CMS) | — | — | Ya (konten sendiri) | Ya (semua) |
| Publish konten | — | — | Tidak langsung (melalui review) | Ya |
| Kelola pengguna dan role | — | — | — | Ya |

Phase 1 hanya mengaktifkan `user` dan `admin`. Role `guru` **dicadangkan** pada skema (Bagian 5.3) tetapi tidak aktif sampai Phase 2.

Ketentuan role (tetap dari v1.0): pendaftaran baru mendapat `user`; pengguna tidak dapat memilih atau menaikkan role sendiri; role admin ditetapkan melalui mekanisme aman; akses admin selalu diperiksa di server.

---

## 5. WHEN — Kapan Digunakan dan Kapan Dirilis

### 5.1 Momen penggunaan

Aplikasi dirancang untuk digunakan **kapan pun** ada yang ingin belajar atau penasaran. Tiga momen utama:

1. **Belajar terstruktur:** mengikuti materi dari awal sampai latihan.
2. **Penasaran sesaat:** ingin memahami satu konsep atau mencoba satu simulasi, lalu pergi.
3. **Referensi visual awal:** dipakai sebagai gambaran pertama sebelum mendalami materi dari sumber lain.

Implikasi produk:
- Materi dan komponen interaktif harus **cepat dimuat dan dapat diakses tanpa login**.
- Komponen interaktif sebaiknya **dapat dibuka langsung** (tautan yang bisa dibagikan, galeri eksperimen), tidak hanya di dalam alur materi.
- Materi dibuat **ringkas dan modular** agar nyaman untuk sesi singkat.

### 5.2 Fase pengembangan

#### Phase 1 — Foundation: aplikasi Umum + CMS + komponen interaktif

Cakupan:
- Katalog mata pelajaran → topik → materi untuk jenjang **Umum**.
- Content Block Engine, Interactive Component Registry, **Formula Sandbox**, dan komponen inti.
- Latihan, kuis, evaluasi (bank soal mandiri).
- Tutor AI kontekstual.
- Autentikasi (`user`, `admin`), progres tamu/akun.
- Admin CMS (hanya admin internal) dengan jalur konten biasa dan pengalaman interaktif.
- Sumber materi dan validasi sebelum publish.
- Navigasi hierarkis, pencarian, favorit.
- Seed content Umum yang bermakna (Bagian 10).

Kriteria keluar: seluruh kriteria penerimaan MVP (Bagian 14) lulus, instrumentasi metrik aktif, dan konten seed Umum telah ditinjau.

#### Phase 2 — Classroom: CMS untuk guru dan pemakaian di ruang kelas

Cakupan:
- Role `guru`/tenaga pengajar dengan akses CMS terbatas.
- Alur peninjauan konten (guru mengusulkan, admin meninjau).
- **Kelas, kode akses, dan bank soal dua arah** (FR-21): guru membuat dan membagikan set soal lewat kode; siswa mengerjakan; guru melihat hasil.
- Mode tampilan kelas (layar penuh/proyektor) untuk komponen interaktif.
- Evaluasi lintas percobaan dan dashboard hasil sederhana untuk guru.
- Evaluasi apakah **interaction builder no-code** layak dibangun.

Kriteria keluar: pilot dengan guru/kelas nyata (sekolah atau bimbel) berjalan dan umpan baliknya terdokumentasi.

#### Phase 3 — Kurikulum: materi pendidikan wajib Indonesia

Cakupan:
- Materi **SD, SMP, SMA** di samping Umum, dipetakan ke kurikulum nasional yang berlaku saat Phase 3 dimulai **[Perlu konfirmasi]**.
- Skala konten: target awal tetap seperti v1.0 (SD ≥5, SMP ≥10, SMA ≥20 materi) sebagai gelombang pertama.
- Penyesuaian bahasa dan kedalaman per jenjang, termasuk ketentuan privasi data anak (Bagian 12, NFR-06).

Kriteria keluar: cakupan materi per jenjang sesuai peta kurikulum yang disepakati.

#### Backlog masa depan (bukan komitmen fase)

Aplikasi mobile native, sertifikat/leaderboard/gamifikasi, kuis adaptif dan personalisasi, analitik lanjutan, peran orang tua/institusi, pencarian terpisah dari database, PWA/offline.

> Roadmap v1.0 (Phase 2 Product Depth, Phase 3 Scale, Phase 4 Platform) **digantikan** oleh fase di atas. Setiap fase tetap memerlukan validasi, prioritas, dan kriteria penerimaan sendiri.

### 5.3 Kebutuhan kesiapan lintas fase (forward-compatibility)

Agar Phase 2 dan 3 tidak memaksa penulisan ulang, Phase 1 harus:
- Menyimpan **`level`** pada setiap materi, dan mendukung banyak jenjang meski hanya Umum yang aktif.
- Mendefinisikan role sebagai daftar yang dapat diperluas (`guru` dicadangkan).
- Menyimpan **penulis dan status peninjauan** pada materi (siapa membuat, siapa meninjau).
- Memperlakukan **soal sebagai entitas mandiri** (dapat dipakai di kuis materi, bank soal, dan set soal kelas).
- Memisahkan konfigurasi komponen interaktif dari implementasinya (registry + skema).

Tabel kelas, enrolmen, dan kode akses **tidak** dibangun di Phase 1.

---

## 6. WHERE — Di Mana Digunakan

| Konteks | Deskripsi | Fase | Implikasi |
|---|---|---|---|
| **Belajar mandiri** | Di rumah, di perjalanan, otodidak, umumnya dari ponsel | 1 | Mobile-first, tanpa login, cepat dimuat, fallback saat simulasi tidak bisa dijalankan |
| **Sekolah / ruang kelas** | Guru menjelaskan dengan alat peraga visual; siswa mencoba | 2 | Mode layar penuh/proyektor, kode akses kelas, tampilan jelas dari jarak jauh |
| **Bimbingan belajar** | Tutor dan siswa memakai latihan dan visualisasi | 2 | Set soal berkode akses, hasil per siswa |
| **Koneksi dan perangkat terbatas** | Asumsi desain: sebagian pengguna memakai ponsel kelas menengah ke bawah dan koneksi tidak stabil | 1 | Anggaran performa per komponen, lazy loading, aset teroptimasi |

Catatan: dukungan offline/PWA masuk backlog, bukan komitmen Phase 1.

---

## 7. WHAT — Apa yang Dibangun

### 7.1 Definisi produk

IVE-APP adalah **aplikasi pendidikan interaktif berbasis web (Next.js)** yang bertujuan memberi siswa dan pembelajar umum pengalaman belajar yang lebih imersif. Bahasa UI dan konten awal: Bahasa Indonesia. Identitas visual orisinal; tidak menyalin merek atau tampilan produk lain.

### 7.2 Fitur inti dan pemetaannya

| # | Fitur inti (dari 5W1H) | Penjabaran di PRD | Fase |
|---|---|---|---|
| 1 | Pemilihan mata pelajaran | FR-01 s.d. FR-04 | 1 |
| 2 | Interaksi dengan elemen materi (sandbox: ubah nilai pada rumus → hasil tampil sebagai visual) | FR-07 (termasuk Formula Sandbox) | 1 |
| 3 | Navigasi mudah dan hierarkis karena mata pelajaran banyak | FR-18 *(baru)* | 1 |
| 4 | Akses materi yang valid sumbernya | FR-19 *(baru)* | 1 |
| 5a | Bank soal/latihan **mandiri** | FR-08 (P0), FR-20 *(baru, P1)* | 1 |
| 5b | Bank soal **dua arah murid–guru via kode akses** | FR-21 *(baru)* | **2** |
| 6 | Tanya AI sebagai asisten belajar | FR-09 | 1 |
| 7 | Progres, favorit, pembelajaran saya, pencarian | FR-11 s.d. FR-15 | 1 |
| 8 | Admin CMS (konten biasa + pengalaman interaktif) | FR-16 | 1 (admin), 2 (guru) |

### 7.3 Prinsip produk

1. **Belajar adalah prioritas.** Pengalaman siswa lebih penting daripada kompleksitas dashboard admin.
2. **Sandbox yang bermakna.** Interaksi harus membantu pemahaman, bukan dekorasi.
3. **Konten sebagai data.** Materi tidak ditanam ke komponen UI.
4. **Komponen dapat digunakan kembali.** Satu renderer dan satu registri mendukung banyak pelajaran.
5. **Sumber harus valid dan terlihat.** Materi tanpa sumber tidak boleh terbit. *(baru)*
6. **Akses awal mudah.** Konten publik dapat dipelajari tanpa login.
7. **Umpan balik mendidik.** Kesalahan dijelaskan dengan bahasa yang membangun.
8. **Keamanan sejak awal.** Otorisasi dan validasi di server; menyembunyikan UI bukan keamanan.
9. **Bertumbuh bertahap.** Fitur ditambahkan sesuai fase dan kebutuhan nyata.
10. **Aksesibilitas dan seluler.** Ada alternatif tekstual saat visualisasi tidak tersedia.
11. **Tidak ada UI palsu.** Tombol yang tampil aktif harus berfungsi; fitur fase berikutnya diberi label "Segera hadir" atau tidak ditampilkan.

### 7.4 Cakupan dan prioritas Phase 1

**P0 — wajib MVP**
1. Homepage dan navigasi hierarkis (FR-01, FR-18).
2. Katalog mata pelajaran/topik/materi untuk jenjang Umum (FR-02 s.d. FR-04).
3. Halaman materi dan Content Block Engine (FR-05, FR-06).
4. Interactive Component Registry, **Formula Sandbox**, Projectile Simulator, Trigonometry Visualizer, Cell Explorer (FR-07).
5. Quiz Engine, latihan, dan evaluasi per materi (FR-08).
6. Tutor AI kontekstual (FR-09).
7. Autentikasi, role `user`/`admin` (FR-10).
8. Progres tamu dan akun dengan merge aman (FR-11).
9. CMS dasar dengan validasi sumber sebelum publish (FR-16, FR-19).
10. Event analytics minimal untuk metrik inti (FR-17, subset).
11. Validasi, otorisasi, loading/error/empty state, desain responsif, migrasi, seed, dokumentasi environment, dan pengujian alur utama.

**P1 — bila fondasi P0 stabil**
- Pencarian, favorit, "Pembelajaran Saya" (FR-12 s.d. FR-14).
- Halaman bank soal mandiri (FR-20).
- Atom Explorer dan History Timeline (FR-07.6, FR-07.7).
- Galeri Eksperimen (FR-07.8).
- Rekomendasi berbasis aturan sederhana (FR-15).
- Riwayat percakapan AI untuk pengguna login.
- Event analytics lanjutan.

**P2 — bukan MVP Phase 1**
- Seluruh isi Phase 2 dan 3 (Bagian 5.2) dan backlog masa depan.

Prioritas hanya berubah melalui keputusan produk yang eksplisit, bukan karena fitur lebih menarik secara visual.

### 7.5 Struktur informasi dan model konten

Hierarki: **Jenjang → Mata Pelajaran → Topik → Materi → Blok Konten**. Soal bersifat entitas mandiri yang dapat dikaitkan ke materi/topik.

- **Jenjang:** Umum (aktif Phase 1), SD, SMP, SMA (disiapkan; aktif Phase 3).
- **Mata pelajaran awal:** Matematika, Fisika, Biologi, Kimia, Sejarah.
- Penambahan jenjang, mata pelajaran, topik, tipe blok, dan komponen interaktif tidak boleh memerlukan penulisan ulang halaman.

#### Status konten (diubah: ditambah IN_REVIEW)

| Status | Arti |
|---|---|
| **DRAFT** | Hanya terlihat/dapat diedit pihak berwenang |
| **IN_REVIEW** | Diajukan untuk ditinjau (kelayakan sumber, akurasi, kualitas) |
| **PUBLISHED** | Tersedia di katalog publik |
| **ARCHIVED** | Tidak tampil sebagai materi aktif, data tetap tersimpan |

Di Phase 1 (hanya admin), peninjau idealnya berbeda dari penulis; bila tim terlalu kecil, minimal ada langkah "periksa sumber" yang tercatat. Di Phase 2, materi dari guru **wajib** melalui IN_REVIEW.

#### Metadata materi

- Judul, slug unik, deskripsi ringkas.
- **Jenjang**, mata pelajaran, topik, urutan dalam topik.
- Tujuan pembelajaran, tingkat kesulitan, estimasi durasi, kata kunci.
- **Sumber/referensi** (wajib untuk publish; lihat FR-19).
- **Penulis dan peninjau** serta waktu tinjauan.
- Status publikasi, blok konten terurut, soal terkait, metadata pembuatan/pembaruan.

---

## 8. HOW — Bagaimana Aplikasi Bekerja

### 8.1 Empat poin inti alur belajar

1. **Pengguna memilih materi** dari katalog atau pencarian.
2. **Materi disajikan multi-format:** teks, ilustrasi, rumus (bila perlu), video penjelasan, contoh praktik/dunia nyata, dan komponen interaktif.
3. **Latihan soal, kuis, dan evaluasi** terhadap pengerjaan pengguna.
4. **Tanya AI** sebagai asisten belajar.

### 8.2 Bagaimana materi disediakan

Materi dibuat melalui **Admin CMS** dan bersumber dari referensi yang tersebar (buku pembelajaran, sumber internet). Karena sumber beragam, setiap materi wajib mencatat sumber dan statusnya divalidasi sebelum terbit (FR-19).

### 8.3 Fungsional

#### FR-01 — Homepage

Memperkenalkan manfaat IVE-APP dan memberi langkah berikutnya yang jelas.

Elemen: headline ramah, penjelasan singkat belajar visual-interaktif, CTA "Mulai Belajar" dan "Jelajahi Materi", akses pencarian/navigasi, materi/topik pilihan dari data nyata, **entri ke eksperimen interaktif**, dan jenjang yang aktif.

**Perubahan v2.0:** pada Phase 1 hanya Umum yang memiliki konten. Kartu SD/SMP/SMA ditampilkan dengan label **"Segera hadir"** dan tidak dapat diklik, atau tidak ditampilkan. Kartu jenjang aktif ditentukan oleh data (ada materi PUBLISHED), bukan hard-code.

**Kriteria penerimaan:** CTA menuju rute benar; homepage tidak kosong setelah seed; loading/error/empty ditangani; tidak ada tombol utama yang mati.

#### FR-02 — Pemilihan jenjang dan dashboard jenjang

Pengguna melihat mata pelajaran dan materi untuk jenjang aktif. Jika hanya satu jenjang yang aktif (Phase 1: Umum), **pemilih jenjang disembunyikan** dan pengguna langsung masuk ke katalog; pemilih muncul otomatis saat ≥2 jenjang memiliki materi PUBLISHED.

Dashboard dapat menampilkan mata pelajaran, materi pilihan dari data nyata, "Lanjutkan belajar", dan progres bila tersedia.

**Kriteria penerimaan:** perpindahan jenjang mengubah katalog; jumlah materi dari data; tidak mengasumsikan pengguna sudah login.

#### FR-03 — Katalog dan halaman mata pelajaran

Deskripsi mata pelajaran, daftar topik, materi terkait, dan progres. Hanya topik yang sesuai tampil; tautan memakai slug stabil; mata pelajaran tanpa materi memiliki empty state jelas.

#### FR-04 — Halaman topik

Daftar materi dalam urutan yang ditentukan pengelola. Kartu materi menampilkan judul, ringkasan, kesulitan/durasi bila ada, **indikator "memiliki simulasi interaktif"**, dan status progres.

#### FR-05 — Halaman materi

Pusat pengalaman belajar. Fitur: judul, ringkasan, metadata, renderer blok, navigasi sebelumnya/berikutnya, penandaan selesai, CTA "Mulai Latihan" bila ada soal, tombol "Tanya AI", informasi progres, layout responsif, dan **bagian "Sumber dan Referensi"** (FR-19).

- Fallback tekstual/statis wajib bila komponen interaktif gagal dimuat.
- Komponen interaktif menyediakan **mode layar penuh** (berguna di ponsel dan proyektor).
- Penyelesaian membaca tidak bergantung pada kuis kecuali dikonfigurasi lain.

#### FR-06 — Content Block Engine

Materi tersusun dari blok terstruktur, **bukan** HTML/JavaScript bebas.

Tipe blok awal: Heading, Text, Image, Video, Formula, Callout, Example (contoh praktik/dunia nyata), Interactive, Quiz, Divider.

Setiap tipe blok memiliki kontrak data stabil, validasi skema, renderer, editor/pratinjau CMS, penanganan data tidak valid, dan fallback aman untuk tipe tidak dikenal. Rumus ditampilkan dengan renderer seperti KaTeX bila tersedia pada stack.

**Kriteria penerimaan:** blok dirender sesuai urutan; data divalidasi sebelum terbit; blok tidak dikenal tidak merusak halaman; konten CMS tidak dapat mengeksekusi JavaScript arbitrer; gambar informatif punya teks alternatif.

#### FR-07 — Komponen pembelajaran interaktif (sandbox)

Ini adalah **pembeda utama** produk. Komponen didaftarkan melalui registry yang menghubungkan key komponen, skema konfigurasi, dan implementasi.

##### FR-07.1 Taksonomi komponen (baru di v2.0)

| Tipe | Deskripsi | Dibuat oleh | Contoh |
|---|---|---|---|
| **A. Formula Sandbox** | Komponen generik: rumus + variabel + visual hasil, **dikonfigurasi dari CMS tanpa kode** | Admin (CMS) | Fungsi kuadrat, Hukum Ohm, pH, pertumbuhan populasi |
| **B. Simulasi khusus** | Komponen terprogram dengan perilaku/animasi spesifik, parameter dapat dikonfigurasi | Developer | Projectile Simulator, Trigonometry Visualizer |
| **C. Explorer/diagram terpilih** | Diagram atau linimasa dengan elemen yang dapat dipilih | Developer (data dari CMS) | Cell Explorer, Atom Explorer, History Timeline |

Menambah tipe B dan C membutuhkan pekerjaan developer; tipe A dirancang agar admin dapat membuat banyak sandbox baru tanpa developer. Tipe A adalah langkah awal menuju interaction builder (Phase 2 evaluasi).

##### FR-07.2 Formula Sandbox (baru, P0)

Pengguna mengubah nilai variabel pada sebuah rumus dan melihat hasil perhitungan sebagai visual.

Konfigurasi dari CMS:
- **Rumus/ekspresi** (mis. `y = a*x^2 + b*x + c`), ditampilkan juga sebagai rumus terformat.
- **Variabel:** nama, label, satuan, nilai minimum, maksimum, langkah, nilai default.
- **Keluaran:** nilai hasil, dan/atau satu bentuk visual dari daftar tetap (lihat FR-07.3).
- **Teks asumsi/batasan** dan penjelasan singkat yang ikut tampil.
- **Teks alternatif/fallback** statis.

Aturan:
- Rumus dievaluasi dengan **parser ekspresi matematika terbatas dan aman**, tanpa `eval` atau eksekusi kode dari database.
- Hanya fungsi dan operator dalam daftar izin yang boleh dipakai.
- Pembagian nol, domain tidak valid, dan hasil tak hingga ditangani dengan pesan yang jelas, tidak membuat halaman rusak.
- Konfigurasi divalidasi (variabel yang dipakai rumus harus terdefinisi, rentang masuk akal) saat simpan dan publish.

**Kriteria penerimaan:** admin dapat membuat sandbox baru dari CMS tanpa kode; mengubah variabel memperbarui hasil dan visual; rumus tidak valid ditolak saat publish; perhitungan diuji dengan kasus representatif.

##### FR-07.3 Panduan memilih bentuk visualisasi (baru)

Bentuk visual dipilih dari daftar tetap agar konsisten dan aman. Penulis memilih saat menyusun komponen; panduan ini menjadi default yang disarankan CMS.

| Jenis hubungan/konsep | Bentuk visual disarankan |
|---|---|
| Fungsi satu variabel y = f(x) | Grafik garis |
| Hubungan dua besaran/data titik | Grafik sebar (scatter) |
| Perbandingan beberapa nilai | Grafik batang |
| Gerak/lintasan di ruang | Animasi lintasan 2D + pembacaan nilai |
| Sudut, bentuk, geometri | Diagram geometri/lingkaran satuan |
| Hasil tunggal (mis. pH, hambatan) | Pembacaan nilai + indikator/skala |
| Struktur (sel, atom) | Diagram terpilih (Tipe C) |
| Urutan peristiwa | Linimasa |

Pilihan bentuk visual pada Phase 1 dilakukan penulis; rekomendasi otomatis masuk backlog.

##### FR-07.4 Projectile Simulator (flagship, P0)

Kontrol: kecepatan awal, sudut peluncuran, gravitasi (bila dapat dikonfigurasi), reset. Hasil: lintasan, tinggi maksimum, jarak horizontal, waktu tempuh. Nilai dihitung dengan rumus fisika sesuai asumsi simulasi (gerak parabola ideal tanpa hambatan udara); batasan asumsi dijelaskan di UI.

##### FR-07.5 Trigonometry Visualizer dan Cell Explorer (P0)

- **Trigonometry Visualizer:** kontrol sudut; segitiga siku-siku dan/atau lingkaran satuan; nilai sin, cos, tan diperbarui; penjelasan sesuai jenjang; penanganan tan tidak terdefinisi.
- **Cell Explorer:** diagram sel; organel dapat dipilih (nucleus, mitochondria, ribosome, cell membrane, cytoplasm, Golgi apparatus); nama, fungsi, penjelasan sederhana untuk pilihan aktif.

##### FR-07.6 Atom Explorer (P1)

Inti, proton, neutron, elektron; pilihan unsur yang sudah ditentukan; nomor atom dan jumlah partikel; pernyataan jelas bahwa visualisasi adalah penyederhanaan.

##### FR-07.7 History Timeline (P1)

Linimasa horizontal/vertikal; pemilihan peristiwa menampilkan tahun, nama, deskripsi, arti penting. Contoh data: Budi Utomo (1908), Sumpah Pemuda (1928), Proklamasi Kemerdekaan (1945).

##### FR-07.8 Galeri Eksperimen (P1, baru)

Halaman yang mendaftar semua komponen interaktif dari materi PUBLISHED, masing-masing dapat dibuka langsung dan dibagikan lewat tautan, dengan tautan balik ke materi lengkap. Melayani momen "penasaran sesaat" (Bagian 5.1). Memanfaatkan registry yang sama, sehingga biaya tambahan kecil.

##### FR-07.9 Kriteria penerimaan umum

- Kontrol berfungsi dan mengubah visual/hasil.
- Dapat digunakan dengan mouse dan sentuhan.
- Label dapat dipahami; tersedia penjelasan tekstual/fallback statis.
- Tidak memuat kode arbitrer dari database.
- Anggaran performa: dimuat secara lazy dan tetap dapat dipakai di perangkat seluler menengah-bawah.
- Perhitungan penting diuji dengan kasus representatif.

#### FR-08 — Latihan, Kuis, dan Evaluasi

Phase 1 mendukung pertanyaan **pilihan ganda**. Struktur soal: pertanyaan, pilihan, jawaban benar (**disimpan di server**), penjelasan, kesulitan, dan relasi ke materi/topik.

Tiga lapis pengalaman (dari 5W1H poin 3):
1. **Latihan** per materi dengan umpan balik langsung dan penjelasan.
2. **Kuis** (rangkaian soal) dengan ringkasan skor.
3. **Evaluasi** (baru): setelah kuis, pengguna dapat meninjau jawaban satu per satu dan melihat **topik/materi yang perlu diulang** dengan tautan langsung. Pengguna login melihat riwayat percobaan; ringkasan kelemahan lintas percobaan masuk Phase 2.

Alur: mulai → pertanyaan → pilih jawaban → periksa → umpan balik benar/salah + penjelasan → berikutnya → ringkasan (skor, benar, salah, total, ajakan meninjau materi).

**Aturan penilaian:** penilaian otoritatif di server; klien tidak menentukan skor atau jawaban benar yang dipercaya; submit divalidasi; jawaban tidak dibocorkan untuk soal yang belum dijawab; pesan salah suportif dengan penjelasan.

**Kriteria penerimaan:** kuis berjalan dari awal sampai hasil; skor sesuai jawaban yang diterima server; refresh/pengiriman ganda tidak membuat pencatatan ganda; kegagalan API menghasilkan pesan yang dapat dipahami; evaluasi menautkan ke materi terkait.

Pengembangan lanjutan **[Perlu konfirmasi]**: tipe soal **jawaban numerik dengan toleransi** sangat cocok untuk materi berbasis rumus dan sinergis dengan sandbox; usul masuk setelah MVP stabil.

#### FR-09 — Tutor AI

Membantu memahami materi, bukan chatbot umum.

UI: tombol "Tanya AI"; drawer kanan (desktop) dan bottom sheet/layar penuh (seluler); label "Sedang membahas: [judul materi]"; riwayat pesan sesi; input; prompt saran relevan ("Jelaskan dengan sederhana", "Beri contoh lain", "Apa rumus pentingnya?", "Saya masih bingung", "Buatkan soal latihan").

Konteks dari backend: jenjang, mata pelajaran, topik, judul/deskripsi materi, potongan konten relevan, **sumber materi**, dan riwayat percakapan terbatas.

Perilaku:
- Menyesuaikan bahasa dan kedalaman dengan jenjang; langkah demi langkah; contoh/analogi; mengarahkan proses, bukan sekadar jawaban akhir.
- **Berpijak pada materi tervalidasi (baru):** jawaban diprioritaskan dari konten dan sumber materi yang sedang dibuka; bila di luar cakupan materi, AI menyatakan hal itu dan tidak mengarang fakta.
- **Tidak membocorkan jawaban kuis yang sedang berlangsung (baru).**
- Tetap fokus pendidikan; mengakui ketidakpastian; tidak mengungkap prompt internal, kredensial, atau data privat; mematuhi batas konteks dan rate limit.
- *(Stretch, P1)* **Sadar sandbox:** dapat menerima nilai parameter sandbox saat ini sebagai konteks, sehingga bisa menjelaskan hasil yang sedang dilihat pengguna (mis. mengapa jarak maksimum pada sudut tertentu).

Keamanan: semua permintaan lewat backend; API key tidak pernah ke browser; provider dapat diganti melalui adapter; akses dibatasi kuota/rate limit; konteks dibatasi seperlunya.

Fallback: halaman tetap berjalan; pesan "AI sedang tidak tersedia" + "Coba lagi"; FAQ statis bila ada.

**Kriteria penerimaan:** konteks materi yang benar terkirim; API key tidak terlihat di bundle atau respons publik; kegagalan provider tertangani; respons ditampilkan sebagai teks aman (bukan HTML aktif); batas penggunaan dan error dicatat tanpa membocorkan rahasia.

#### FR-10 — Autentikasi dan profil

Daftar, login, logout, akses fitur akun. Belajar dari materi publik tidak mewajibkan login; login bermanfaat untuk sinkronisasi progres, riwayat, favorit, dan riwayat AI.

Peran Phase 1: `user`, `admin` (aturan lengkap di Bagian 4.3). Pengelolaan sesi/cookie mengikuti penyedia autentikasi yang dipilih.

#### FR-11 — Progres belajar

Tamu: progres dasar di localStorage. Pengguna login: di database. Dicatat: materi dibuka, diselesaikan, waktu pembaruan terakhir, hasil percobaan kuis (bila disimpan), materi terakhir.

Merge progres tamu → akun harus **idempoten**, tidak menurunkan progres server yang lebih baik, deterministik saat konflik, dan tidak memakai data klien sebagai bukti penilaian kuis.

#### FR-12 — Favorit

Pengguna login dapat menandai/membatalkan favorit. Untuk tamu, UI menjelaskan bahwa login diperlukan, tidak gagal diam-diam. *(P1)*

#### FR-13 — Pembelajaran Saya

Lanjutkan belajar, materi selesai, favorit, riwayat, hasil kuis (bila disimpan). Tamu melihat progres lokal dan ajakan login. Tidak boleh menjadi dashboard kosong atau menampilkan statistik palsu. *(P1)*

#### FR-14 — Pencarian dan eksplorasi

Cakupan: mata pelajaran, topik, judul, deskripsi, kata kunci. Filter: jenjang, mata pelajaran, kesulitan, dan **memiliki simulasi**. UX: debounce, loading, empty state, kartu hasil, filter ramah seluler. Implementasi awal dengan pencarian PostgreSQL. *(P1)*

#### FR-15 — Rekomendasi sederhana

Berbasis aturan transparan (materi lanjutan, mata pelajaran sama, belum selesai). Tidak boleh mengklaim personalisasi AI/ML jika hanya aturan statis. *(P1)*

#### FR-16 — CMS Admin

CMS sederhana, berorientasi pekerjaan konten. Sesuai 5W1H, CMS memiliki **dua jalur kerja**:

1. **Membuat dan memperbarui konten:** teks, gambar, rumus, video, soal, melalui editor blok.
2. **Menyusun pengalaman interaktif:** memilih komponen dari registry dan mengatur parameternya (mis. simulasi gerak parabola, atau Formula Sandbox dengan rumus dan variabel sendiri).

Keduanya dikelola dari CMS, tetapi cara membuatnya berbeda: konten biasa lewat editor; interaksi memakai komponen terprogram atau Formula Sandbox yang dikonfigurasi. Komponen tipe B/C baru memerlukan developer; **interaction builder no-code bukan bagian Phase 1**.

**Tata letak editor (acuan UX, mengikuti contoh implementasi):** tiga panel.
- **Panel kiri — Block Library:** daftar blok yang dapat ditambahkan (Teks, Gambar, Rumus, Video, Interaktif, Quiz, dan lainnya).
- **Bagian tengah — Content Canvas:** susunan materi yang dapat diurutkan.
- **Panel kanan — Properties Inspector:** pengaturan blok terpilih. Untuk blok Interaktif, form properti **dibangkitkan dari skema konfigurasi komponen di registry**, sehingga komponen baru otomatis memiliki panel pengaturan.
- Bilah atas: judul materi, status (Draft/Review/Published), aksi **Preview & Publish**.

Area CMS: dashboard ringkas; pengelolaan jenjang/mata pelajaran/topik; daftar dan editor materi; pengelolaan soal dan bank soal; pemilihan komponen interaktif; pratinjau; publish/unpublish; arsip.

Editor: tambah, edit, urutkan, hapus (dengan konfirmasi) blok; simpan draft; preview; ajukan review; publish.

**Gerbang publish (checklist otomatis):**
- Skema semua blok valid dan konfigurasi komponen valid (termasuk rumus Formula Sandbox).
- Memiliki tujuan pembelajaran.
- Memiliki ≥1 sumber/referensi yang lengkap (FR-19).
- Gambar informatif memiliki teks alternatif; komponen interaktif memiliki fallback tekstual.
- Telah berstatus ditinjau sesuai kebijakan editorial **[Perlu konfirmasi]**.

Ketentuan: hanya admin terotorisasi yang membuat/mengubah konten di Phase 1; draft tidak tampil di katalog publik; penghapusan konten terbit memakai arsip; aksi destruktif memerlukan konfirmasi. Role guru dan alur peninjauan diperluas di Phase 2 (FR-21).

#### FR-17 — Event analytics

Minimal untuk metrik (P0): `lesson_viewed`, `lesson_completed`, `interactive_used` *(baru)*, `quiz_completed`, `ai_question_asked`.
Tambahan (P1): `lesson_started`, `quiz_started`, `ai_opened`, `search_performed`, `source_viewed` *(baru)*, `ai_feedback` *(baru)*.

`interactive_used` dicatat dengan sampling/debounce (bukan setiap geseran slider) agar ringan. Analitik tidak boleh menghambat alur belajar; kumpulkan data pribadi seminimal mungkin.

#### FR-18 — Navigasi hierarkis dan skalabel (baru)

Karena mata pelajaran dan materi akan banyak, navigasi harus mudah digunakan dan hierarkinya jelas.

- **Menu utama** menampilkan hierarki Jenjang → Mata Pelajaran → Topik (mega menu/drawer bertingkat di desktop, daftar bertingkat yang dapat dilipat di seluler).
- **Breadcrumb** pada setiap halaman katalog dan materi.
- **Sidebar daftar isi topik** pada halaman materi, dengan penanda "sedang dibuka" dan status progres.
- Pencarian selalu dapat dijangkau dari header.
- "Lanjutkan belajar" mudah ditemukan.
- Struktur tetap jelas ketika katalog tumbuh (target uji: ratusan materi tanpa menu menjadi tidak terpakai **[Perlu konfirmasi]**).

**Kriteria penerimaan:** dari materi mana pun pengguna dapat mengetahui posisinya dan kembali ke topik/mata pelajaran dalam ≤2 aksi; navigasi dapat dipakai dengan keyboard dan sentuhan.

#### FR-19 — Sumber dan validitas konten (baru)

Sesuai 5W1H ("akses materi yang valid sumbernya"), validitas adalah kebutuhan produk, bukan hanya catatan risiko.

**Data sumber per materi** (≥1 wajib untuk publish): judul sumber, penulis/penerbit, jenis (buku teks, buku sekolah resmi, jurnal/artikel ilmiah, situs lembaga resmi, sumber terbuka/OER), URL atau rujukan, tahun/versi, tanggal diakses, **lisensi/status hak cipta**, dan catatan penggunaan. Blok tertentu dapat merujuk ke sumber tertentu.

**Kebijakan sumber:**
- Prioritaskan sumber otoritatif dan berlisensi terbuka (mis. buku sekolah resmi, OER). Setiap sumber perlu diperiksa lisensinya sebelum dipakai.
- Materi **ditulis ulang dengan kata-kata sendiri** dan dirujuk. Teks, gambar, atau video dari buku/situs berhak cipta tidak disalin tanpa izin atau lisensi yang memadai.
- Ilustrasi, diagram, dan simulasi dibuat sendiri atau berlisensi yang sesuai.
- Konten yang dihasilkan AI harus ditinjau manusia dan diperiksa terhadap sumber sebelum terbit.
- Peninjau mencatat pemeriksaan akurasi sebelum PUBLISHED.

**Tampilan ke pengguna:** bagian "Sumber dan Referensi" pada halaman materi; tanggal peninjauan terakhir bila tersedia.

**Kriteria penerimaan:** materi tanpa sumber lengkap tidak dapat dipublikasi; sumber tampil di halaman materi; perubahan sumber tercatat.

> Ini bukan nasihat hukum. Kebijakan hak cipta dan lisensi final perlu ditinjau oleh pihak yang berwenang sebelum peluncuran publik.

#### FR-20 — Bank Soal Mandiri (baru, P1)

Halaman latihan yang dapat diakses terpisah dari alur materi, untuk belajar mandiri.

- Menelusuri soal per mata pelajaran, topik, dan kesulitan.
- Mengerjakan set latihan dengan alur dan penilaian server yang sama dengan FR-08.
- Soal adalah entitas mandiri yang dapat dikaitkan ke satu atau lebih materi.
- Tersedia untuk tamu; riwayat hasil tersimpan untuk pengguna login.
- Admin mengelola bank soal dari CMS.

Prioritas: kuis per materi (FR-08) adalah P0; halaman bank soal terpisah adalah P1 **[Perlu konfirmasi, lihat D-16]**.

#### FR-21 — Kelas, Kode Akses, dan CMS untuk Guru (Phase 2)

Menjawab fitur "bank soal yang diakses dua arah antara murid dan guru via kode akses yang diberikan guru". **Tidak dibangun di Phase 1.** Cakupan awal untuk perencanaan:

- **Guru:** membuat kelas atau set soal; menghasilkan **kode akses** (dapat dibatasi masa berlaku, dibatalkan, dan diperbarui); memilih soal dari bank atau membuat soal sendiri.
- **Siswa:** memasukkan kode untuk mengakses set soal, mengerjakan, dan melihat umpan balik.
- **Guru melihat hasil:** per siswa dan per soal, hanya untuk kelas yang dimilikinya.
- **"Dua arah"** diartikan: guru → siswa (membagikan set soal) dan siswa → guru (mengirim jawaban dan hasil). Penilaian tetap otoritatif di server.
- **CMS guru:** guru membuat/mengubah konten sendiri; publikasi publik melalui peninjauan admin (IN_REVIEW).
- Mode tampilan kelas untuk proyektor.

Pertanyaan yang harus diputuskan sebelum Phase 2: apakah siswa harus punya akun atau cukup nama panggilan; persetujuan orang tua untuk anak; masa berlaku dan format kode akses; apa yang terlihat oleh guru; retensi data kelas.

---

## 9. Rute dan Navigasi Produk

Rute konseptual (rute final mengikuti struktur aplikasi yang sudah ada; jangan mengubah rute yang berfungsi hanya agar cocok dengan dokumen).

**Publik:** `/`, `/explore`, `/search`, `/my-learning`, `/login`, `/practice` *(bank soal mandiri, baru)*, `/experiments` *(galeri eksperimen, baru, P1)*

**Pendidikan:** `/learn/:level` (`umum` aktif di Phase 1; `sd`, `smp`, `sma` disiapkan), `/learn/:level/:subject`, `/learn/:level/:subject/:topic`, `/learn/:level/:subject/:topic/:lesson`, `/quiz/:lesson`

**Admin:** `/admin`, `/admin/dashboard`, `/admin/subjects`, `/admin/topics`, `/admin/lessons`, `/admin/questions`, `/admin/interactive`, `/admin/sources` *(opsional; pengelolaan sumber/referensi)*

**Phase 2 (belum dibangun):** `/class/join` (masuk dengan kode akses), `/teacher/*` (kelas, set soal, hasil)

Navigasi desktop: Home, Explore, Latihan, My Learning, pencarian, login/profil. Navigasi seluler: menu ringkas dan navigasi bawah bila sesuai. Hierarki menu mengikuti FR-18.

---

## 10. Kebutuhan Data dan Konten Seed

Aplikasi tidak boleh dimulai dengan katalog kosong.

### 10.1 Seed Phase 1 (diubah dari v1.0)

v1.0 menargetkan 40+ materi di Umum, SD, SMP, dan SMA. Karena 5W1H menetapkan **Phase 1 = materi Umum** dan SD/SMP/SMA di Phase 3, target seed Phase 1 difokuskan pada kualitas **Umum** **[Perlu konfirmasi]**:

- Minimal **15 materi Umum**, minimal 3 per mata pelajaran awal (Matematika, Fisika, Biologi, Kimia, Sejarah).
- Minimal **8 materi** dengan komponen interaktif (Formula Sandbox, Projectile, Trigonometri, Cell Explorer, dan lainnya).
- Setiap materi: judul, deskripsi, tujuan belajar, minimal satu blok visual, **minimal satu sumber tervalidasi**, dan minimal tiga soal latihan bila relevan.
- Konten demo dibedakan dari statistik nyata bila ditampilkan sebagai data aktivitas.

Contoh area konten: Fungsi kuadrat dan grafiknya, Trigonometri dasar, Pythagoras (Matematika); Gerak lurus, Gerak parabola, Hukum Ohm (Fisika); Sel dan organel, Fotosintesis, Pertumbuhan populasi (Biologi); Atom dan unsur, Skala pH, Ikatan kimia (Kimia); Linimasa pergerakan nasional Indonesia (Sejarah).

"Gerak Parabola" menjadi contoh unggulan yang menggabungkan blok materi, simulasi, AI, dan kuis.

### 10.2 Target Phase 3

Gelombang pertama materi per jenjang mengikuti target v1.0 (SD ≥5, SMP ≥10, SMA ≥20), disesuaikan dengan peta kurikulum.

---

## 11. Kebutuhan UX, UI, dan Aksesibilitas

**Arah visual:** ramah, visual, cerah, mendorong eksplorasi; heading jelas; kartu dengan radius konsisten; warna aksen per mata pelajaran dengan kontras memadai; animasi halus yang tidak menghalangi; identitas visual orisinal.

**Responsivitas:** ponsel, tablet, desktop; tidak ada horizontal overflow tidak disengaja; kontrol interaktif dapat disentuh; target tap kuis cukup besar; drawer AI menyesuaikan perangkat; rumus, gambar, video, dan simulasi tetap dapat dipakai di layar kecil; komponen interaktif punya mode layar penuh.

**Aksesibilitas:** elemen semantik; semua input berlabel; navigasi keyboard dengan fokus terlihat; teks alternatif; kontras memadai; benar/salah tidak hanya dibedakan lewat warna; hormati reduced motion; simulasi punya penjelasan tekstual/fallback.

**Status antarmuka:** loading, error, empty, success, disabled, dan retry untuk semua fitur asinkron. Jangan tampilkan stack trace atau error internal.

---

## 12. Kebutuhan Nonfungsional

**NFR-01 Performa.** Render materi efisien; komponen interaktif dimuat lazy; optimalkan gambar/video; hindari query tidak terbatas dan N+1; cache konten publik dengan invalidasi saat konten berubah. **Baru:** tetapkan anggaran ukuran/waktu muat per komponen interaktif dan uji pada perangkat seluler menengah-bawah dengan koneksi lambat **[Perlu konfirmasi: angka target]**.

**NFR-02 Keamanan.** Otorisasi admin selalu di server; validasi body, parameter, dan konfigurasi konten; kunci API di server; ORM/parameterisasi; sanitasi rich text; jangan percaya skor dari klien; rate limit endpoint berisiko (AI); jangan mencatat password/token/API key; rahasia tidak masuk repository. **Baru:** evaluator rumus Formula Sandbox memakai parser terbatas dengan daftar fungsi yang diizinkan, tanpa `eval`; kode akses kelas (Phase 2) harus sulit ditebak dan dapat dicabut.

**NFR-03 Reliabilitas.** Kegagalan AI atau komponen interaktif tidak merusak halaman materi; blok tidak dikenal tidak merusak halaman; progres dan kuis aman terhadap pengiriman ganda dan konflik; migrasi dan seed terdokumentasi serta dapat dijalankan di lingkungan bersih.

**NFR-04 Skalabilitas.** Mulai sebagai Modular Monolith; PostgreSQL sebagai sumber kebenaran; Redis, queue, search engine khusus, atau layanan terpisah hanya bila kebutuhan terukur membenarkan; tidak membangun microservices untuk antisipasi hipotetis.

**NFR-05 Pemeliharaan.** TypeScript; validasi skema untuk data eksternal dan konten; pemisahan UI, layanan aplikasi, adaptor, dan infrastruktur; tes untuk logika penting; dokumentasi diperbarui saat kontrak berubah; cari dan gunakan ulang komponen yang ada sebelum membuat baru.

**NFR-06 Privasi.** Kumpulkan data minimum; batasi konteks ke AI; jelaskan manfaat login dan data yang disimpan; jangan memasukkan informasi sensitif ke log.

**Baru (data anak):** pengguna produk mencakup pelajar dan, pada fase berikutnya, anak SD/SMP. UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (Pasal 25) menyatakan pemrosesan data pribadi anak diselenggarakan secara khusus dan wajib mendapat persetujuan orang tua dan/atau wali. Konsekuensi: (1) sebelum peluncuran publik Phase 1, lakukan tinjauan privasi atas data yang dikumpulkan akun, progres, dan percakapan AI; (2) rancang mekanisme usia/persetujuan sebelum Phase 2 (kelas, nama siswa, hasil per siswa) dan Phase 3 (konten SD/SMP). Ini bukan nasihat hukum; konfirmasikan dengan penasihat hukum dan aturan turunan yang berlaku.

---

## 13. Prinsip Arsitektur Produk dan Hubungan Dokumen

PRD menetapkan kebutuhan produk; rincian teknis ada di TAD.

- Next.js, React, TypeScript sesuai baseline TAD.
- UI memanggil layanan aplikasi; komponen UI tidak mengakses database langsung.
- Konten disimpan di database dan ditampilkan lewat renderer reusable; komponen interaktif lewat registry.
- Validasi dan otorisasi di server; Quiz Engine adalah otoritas penilaian.
- AI melalui service dan provider adapter di backend.
- Progres tamu dan akun memiliki jalur penyimpanan dan merge yang jelas.
- Modul domain terpisah secara logis, tidak harus terpisah secara deployment.
- Kesiapan lintas fase mengikuti Bagian 5.3.

Jika PRD dan TAD berbeda, catat konflik dan sepakati keputusan; jangan mengganti keputusan produk atau arsitektur secara diam-diam. Jika kode yang berjalan berbeda dari dokumen, periksa kondisi aktual, pertahankan perilaku yang benar, dan usulkan perubahan bertahap tanpa rewrite luas.

**Definisi selesai fitur:** kebutuhan jelas; mengikuti pola arsitektur yang ada; kode lama diperiksa agar tidak diduplikasi; validasi dan otorisasi sesuai risiko; loading/error/empty/success ditangani; UI responsif dan wajar secara aksesibilitas; tes relevan dibuat dan dijalankan; tidak ada tombol palsu; diff ditinjau; dokumentasi diperbarui; laporan akhir memuat perubahan, tes, hasil, dan risiko terbuka.

---

## 14. Kriteria Penerimaan

### 14.1 MVP Phase 1

**Pengalaman pembelajar**
- [ ] Homepage menampilkan data dan navigasi yang berfungsi; jenjang tanpa konten tidak tampil sebagai aktif.
- [ ] Pengguna dapat menelusuri mata pelajaran → topik → materi dengan hierarki jelas (breadcrumb, menu, sidebar).
- [ ] Materi menampilkan blok konten dengan benar dan menampilkan **sumber**.
- [ ] Formula Sandbox dan komponen interaktif inti bekerja dan memiliki fallback.
- [ ] Kuis dapat diselesaikan; skor dihitung server; evaluasi menautkan ke materi.
- [ ] AI menerima konteks materi, berpijak pada materi, dan memiliki penanganan kegagalan.
- [ ] Halaman bekerja di ponsel dan desktop.

**Akun dan progres**
- [ ] Materi publik dapat dipakai tanpa login.
- [ ] Login/logout berfungsi; role ditetapkan dengan aman.
- [ ] Progres tamu lokal dan progres akun di database; merge tidak menimpa progres server yang lebih baik.
- [ ] Favorit dan riwayat bekerja bila diaktifkan dalam rilis.

**CMS**
- [ ] Admin login dan aksesnya diperiksa di server.
- [ ] Admin dapat membuat/mengedit materi, menambah/mengurutkan/mengedit/menghapus blok, mengatur soal dan konfigurasi komponen interaktif.
- [ ] Admin dapat **membuat Formula Sandbox baru tanpa kode**.
- [ ] Draft, preview, review, publish/unpublish, archive berfungsi; draft tidak muncul di publik.
- [ ] **Publish ditolak jika sumber, tujuan belajar, skema, atau fallback tidak lengkap.**
- [ ] Aksi destruktif memiliki konfirmasi.

**Teknis dan kualitas**
- [ ] Migrasi dan seed berjalan dari lingkungan bersih; seed Umum memenuhi Bagian 10.1.
- [ ] `.env.example` tersedia; tidak ada secret production di repository.
- [ ] Validasi input dan penanganan error tersedia; tidak ada tombol utama yang mati atau error runtime utama.
- [ ] Event analytics minimal aktif untuk metrik Bagian 3.6.
- [ ] Tes logika penting dan alur E2E utama lulus; dokumentasi lokal dan deployment tersedia.
- [ ] Tinjauan privasi dasar selesai sebelum peluncuran publik.

### 14.2 Phase 2 (ringkas, dirinci saat fase dimulai)
- [ ] Guru dapat membuat set soal dan kode akses; siswa dapat bergabung dan mengerjakan; guru melihat hasil kelasnya saja.
- [ ] Konten guru melewati peninjauan sebelum publik.
- [ ] Mekanisme privasi/persetujuan untuk data siswa telah diputuskan dan diterapkan.
- [ ] Pilot kelas nyata selesai dan didokumentasikan.

### 14.3 Phase 3 (ringkas)
- [ ] Materi SD/SMP/SMA tersedia sesuai peta kurikulum yang disepakati, dengan sumber tervalidasi dan bahasa sesuai jenjang.

---

## 15. Skenario Uji End-to-End Utama

**E2E-01 — Alur belajar Fisika (Umum).** Buka homepage → masuk katalog Umum → Fisika → topik Gerak → materi Gerak Parabola → baca → ubah sudut dan kecepatan di Projectile Simulator → pastikan visual dan nilai berubah → buka bagian Sumber → buka AI dan tanyakan mengapa sudut 45° sering memberi jarak maksimum pada asumsi gerak parabola ideal → tutup AI → mulai kuis → jawab → tinjau umpan balik dan evaluasi → lanjut ke materi berikutnya.

**E2E-02 — Trigonometri.** Buka materi → ubah sudut → pastikan sin/cos/tan diperbarui → jalankan kuis dan lihat hasil.

**E2E-03 — Biologi.** Buka materi Sel → buka Cell Explorer → pilih nucleus → baca penjelasan → pilih mitochondria → pastikan penjelasan berubah.

**E2E-04 — CMS.** Login admin → buat materi baru (jenjang Umum) → tambah blok teks, formula, video, interaktif → tambah soal → isi sumber → simpan draft → preview → ajukan review → publish → pastikan muncul di situs publik dan draft lain tidak terlihat.

**E2E-05 — Progres tamu ke akun.** Belajar tanpa login → selesaikan beberapa materi → login/daftar → merge progres → pastikan progres valid pindah tanpa menurunkan progres server → ulangi merge, tidak terduplikasi.

**E2E-06 — Formula Sandbox dari penulis ke pembelajar (baru).** Admin membuat sandbox baru (rumus, variabel dengan rentang, keluaran grafik garis) → publish → pembelajar membuka materi, mengubah variabel → grafik dan nilai berubah → memasukkan nilai yang menyebabkan pembagian nol → muncul pesan jelas, halaman tidak rusak.

**E2E-07 — Gerbang sumber (baru).** Admin mencoba publish materi tanpa sumber → ditolak dengan pesan yang jelas → tambah sumber → publish berhasil → sumber tampil di halaman materi.

**E2E-P2-01 — Kode akses kelas (Phase 2, outline).** Guru membuat set soal dan kode → siswa memasukkan kode dan mengerjakan → guru melihat hasil → kode yang dicabut tidak dapat digunakan.

---

## 16. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Materi tidak akurat atau sumber tidak layak | Kepercayaan dan hasil belajar turun | Wajib sumber; gerbang publish; peninjauan; tanggal tinjauan (FR-19) |
| **Pelanggaran hak cipta** karena materi diambil dari internet/buku | Risiko hukum dan reputasi | Kebijakan sumber dan lisensi; tulis ulang dan rujuk; aset sendiri atau berlisensi; tinjauan hukum sebelum rilis |
| AI memberi jawaban salah atau membocorkan jawaban kuis | Salah pemahaman | Berpijak pada materi tervalidasi; instruksi tutor; uji respons; feedback pengguna |
| Biaya AI tidak terkendali | Anggaran dan ketersediaan | Kuota, rate limit, provider adapter, fallback |
| Komponen interaktif berat di perangkat seluler | Pengalaman lambat | Lazy loading, anggaran performa, kontrol sederhana, fallback statis |
| Formula dari CMS menjadi celah eksekusi kode | Keamanan | Parser ekspresi terbatas, daftar fungsi izin, validasi saat publish |
| Konfigurasi CMS tidak valid | Halaman rusak | Validasi skema, renderer defensif, preview |
| Progres tamu dan akun konflik | Kehilangan progres | Merge idempoten, aturan konflik eksplisit |
| Skor dimanipulasi dari klien | Hasil tidak dapat dipercaya | Penilaian server-authoritative |
| **Data anak** (siswa SD/SMP, kelas) | Risiko privasi dan kepatuhan | Data minimum; tinjauan privasi; mekanisme persetujuan sebelum Phase 2/3 |
| **Scope melebar atau fase tercampur** (mis. fitur guru masuk Phase 1) | MVP terlambat | Tetapkan fase dan prioritas; label "Segera hadir"; review scope |
| Katalog tumbuh, navigasi tidak terpakai | Pengguna tersesat | FR-18; uji dengan data banyak |
| Kualitas bergantung pada kapasitas tim konten | Konten sedikit atau tidak konsisten | Seed fokus Umum; template materi; proses tinjauan ringan |
| Ketergantungan AI provider | Fitur AI rentan gangguan | Provider adapter dan fallback aman |
| Kebocoran rahasia | Risiko keamanan | Secret di server, environment terpisah, review log dan repository |
| Duplikasi komponen akibat banyak agen | Kode sulit dipelihara | `AGENTS.md`, pencarian sebelum membuat, ownership domain, review diff |

---

## 17. Keputusan Terbuka dan Asumsi

Keputusan berikut harus dicatat saat disepakati; jangan diisi dengan asumsi tersembunyi.

| ID | Pertanyaan | Usulan/asumsi saat ini |
|---|---|---|
| D-01 | Apakah **bank soal berkode akses** (dua arah murid–guru) memang masuk **Phase 2**? | Ya, karena membutuhkan role guru yang baru aktif di Phase 2. Phase 1 hanya bank soal mandiri. |
| D-02 | Apakah "Umum" adalah jenjang setara SD/SMP/SMA? | Ya (Bagian 4.2). |
| D-03 | Apakah Atom Explorer dan History Timeline boleh turun ke P1 demi memprioritaskan Formula Sandbox? | Ya, usulan. |
| D-04 | Target seed Phase 1: 15 materi Umum (8 interaktif) sudah realistis untuk kapasitas tim konten? | Usulan, perlu validasi tim konten. |
| D-05 | Siapa peninjau konten dan apa kriteria editorial sebelum publish? | Belum ditetapkan. |
| D-06 | Sumber apa yang disetujui (mis. buku sekolah resmi, OER) dan bagaimana prosedur pengecekan lisensi? | Belum ditetapkan; butuh pihak berwenang. |
| D-07 | Apakah interaction builder no-code layak dibangun? | Evaluasi di Phase 2; Formula Sandbox adalah langkah awal. |
| D-08 | Apakah siswa harus memiliki akun untuk masuk kelas (Phase 2), dan bagaimana persetujuan orang tua untuk anak? | Belum diputuskan; wajib sebelum Phase 2. |
| D-09 | Penyedia autentikasi final dan lingkungan deployment. | Belum diputuskan. |
| D-10 | Penyedia AI, model, biaya, kuota, dan batas penggunaan; apakah riwayat percakapan AI masuk rilis pertama? | Belum diputuskan; riwayat AI diusulkan P1. |
| D-11 | Model bisnis dan pendanaan (gratis, sponsor, langganan, lembaga)? | Belum dibahas; memengaruhi biaya AI dan kebijakan data. |
| D-12 | Target performa dan anggaran per komponen interaktif. | Tetapkan setelah prototipe diuji di perangkat menengah-bawah. |
| D-13 | Kebijakan retensi data, privasi, dan moderasi. | Tinjauan privasi sebelum peluncuran publik. |
| D-14 | Apakah analisis kompetitor akan dilakukan untuk memvalidasi positioning? | Disarankan sebelum peluncuran. |
| D-15 | Kurikulum acuan untuk Phase 3. | Tentukan saat Phase 3 dimulai. |
| D-16 | Apakah halaman bank soal terpisah (FR-20) masuk P0 atau P1? | Usulan P1; kuis per materi tetap P0. |

---

## Lampiran A — Ringkasan Prioritas Fitur per Fase

| Fitur | Phase 1 | Phase 2 | Phase 3 |
|---|---|---|---|
| Homepage, katalog, navigasi hierarkis (FR-01 s.d. 04, 18) | P0 (Umum) | Perluasan | Ditambah SD/SMP/SMA |
| Halaman materi + Content Block Engine | P0 | | |
| Formula Sandbox, Projectile, Trigonometri, Cell Explorer | P0 | | |
| Atom Explorer, History Timeline, Galeri Eksperimen | P1 | | |
| Kuis, latihan, evaluasi dasar | P0 | Evaluasi lintas percobaan | |
| Bank soal mandiri (halaman terpisah) | P1 | | |
| Tutor AI kontekstual | P0 | | Penyesuaian per jenjang |
| Sumber dan validitas konten (FR-19) | P0 | Peninjauan guru | |
| Auth, role `user`/`admin` | P0 | Role `guru` | |
| Progres tamu/akun + merge | P0 | | |
| CMS admin | P0 | CMS guru + review | |
| Event analytics minimal | P0 | | |
| Pencarian, favorit, Pembelajaran Saya | P1 | | |
| Rekomendasi sederhana | P1 | | |
| Kelas, kode akses, bank soal dua arah (FR-21) | — | **Utama** | |
| Mode tampilan kelas/proyektor | — | Ya | |
| Interaction builder no-code | — | Evaluasi | Bila disetujui |
| Gamifikasi, sertifikat, leaderboard, native app, kuis adaptif | Backlog | Backlog | Backlog |

---

## Lampiran B — Catatan Penamaan

Semua nama produk yang ditampilkan kepada pengguna harus menggunakan **IVE-APP** kecuali ada keputusan branding baru. Nama lama **EduSpark** hanya boleh muncul dalam konteks migrasi dokumen, riwayat keputusan, atau referensi sumber lama; jangan biarkan tertanam di UI, prompt AI, seed, metadata, atau dokumentasi aktif. Mengganti nama identifier internal (package, database, folder) tidak wajib bila berisiko dan tidak bermanfaat; lakukan secara terencana dan konsisten.

---

## Lampiran C — Ringkasan Perubahan v1.0 → v2.0

| # | Perubahan | Alasan (dasar 5W1H) |
|---|---|---|
| 1 | Dokumen disusun ulang mengikuti 5W1H; nomor FR v1.0 dipertahankan | Menyelaraskan PRD dengan breakdown tim dan menjaga referensi TAD |
| 2 | Roadmap 4 fase diganti **3 fase**: Umum+CMS → CMS guru/kelas → SD/SMP/SMA | WHEN: 3 fase proyek |
| 3 | Seed 40+ materi lintas jenjang di Phase 1 diganti **≥15 materi Umum** | WHEN: Phase 1 hanya materi Umum |
| 4 | Fitur guru/kelas dipindah dari "bukan tujuan/Phase 4" ke **Phase 2** | WHEN: Phase 2 = CMS dipakai guru |
| 5 | Ditambah **FR-21** bank soal dua arah via kode akses (Phase 2) dan **FR-20** bank soal mandiri | WHAT: fitur bank soal mandiri dan berkode akses |
| 6 | Ditambah **Formula Sandbox** (komponen generik, dikonfigurasi dari CMS) dan taksonomi komponen A/B/C | WHAT/HOW: sandbox rumus → visual; CMS menyusun interaksi |
| 7 | Ditambah **panduan bentuk visualisasi** per jenis konsep | Kebutuhan "bentuk visualisasi paling sesuai" |
| 8 | Ditambah **FR-18 navigasi hierarkis skalabel** | WHAT: navigasi mudah dan hierarki jelas |
| 9 | Ditambah **FR-19 sumber dan validitas konten**, status IN_REVIEW, dan gerbang publish | WHAT: materi harus valid sumbernya; HOW: sumber tersebar |
| 10 | CMS: dua jalur kerja, tata letak 3 panel, form properti dibangkitkan dari skema registry | HOW: contoh implementasi CMS |
| 11 | Kuis dikembangkan menjadi **Latihan, Kuis, Evaluasi** | HOW poin 3 |
| 12 | AI berpijak pada materi tervalidasi, tidak membocorkan jawaban kuis, (stretch) sadar sandbox | HOW poin 4 + kebutuhan validitas |
| 13 | Ditambah **WHY, positioning, dan metrik keberhasilan** | v1.0 belum memiliki metrik; WHY: Indonesia Emas 2045 |
| 14 | Segmen WHO diperluas (pembelajar umum, siswa, guru, admin); **"Umum" didefinisikan**; ditambah matriks izin | WHO + pertanyaan terbuka v1.0 |
| 15 | Ditambah **WHERE** dan implikasinya (mandiri, kelas, bimbel, perangkat/koneksi terbatas) | WHERE |
| 16 | Kartu jenjang tanpa konten diberi label "Segera hadir"; pemilih jenjang tersembunyi bila hanya satu jenjang aktif | Prinsip "tidak ada UI palsu" |
| 17 | Event analytics minimal dinaikkan ke P0; ditambah `interactive_used`, `source_viewed`, `ai_feedback` | Agar metrik dapat diukur |
| 18 | Risiko baru: hak cipta, data anak, formula sebagai celah eksekusi, fase tercampur | Analisis lanjutan |
| 19 | NFR-06 ditambah ketentuan data anak (UU PDP No. 27/2022 Pasal 25) | Target pengguna mencakup pelajar/anak |
| 20 | Pertanyaan terbuka diperbarui menjadi D-01 s.d. D-16 dengan usulan | Mengurangi asumsi tersembunyi |
| 21 | Bagian arsitektur, DoD, dan hubungan dokumen dipadatkan | PRD fokus pada produk |

---

## Lampiran D — Penelusuran 5W1H → Bagian PRD

| Butir 5W1H | Bagian PRD |
|---|---|
| WHAT: aplikasi, basis Next.js, tujuan imersif | 1, 7.1 |
| WHAT: pemilihan mata pelajaran | FR-01 s.d. 04 |
| WHAT: interaksi/sandbox rumus → visual | FR-07 (07.1–07.3) |
| WHAT: navigasi hierarkis | FR-18 |
| WHAT: materi valid sumbernya | FR-19, 7.5 |
| WHAT: bank soal mandiri dan berkode akses | FR-08, FR-20, FR-21 |
| WHO: umum, guru, siswa | 4 |
| WHEN: kapan digunakan | 5.1 |
| WHEN: 3 fase | 5.2, Lampiran A |
| WHERE: sekolah, otodidak, bimbel | 6 |
| WHY: Indonesia Emas 2045, imersif, pemahaman | 3 |
| HOW: 4 poin inti | 8.1, FR-05, 08, 09 |
| HOW: materi lewat Admin CMS, sumber tersebar | 8.2, FR-16, FR-19 |
| HOW: dua komponen CMS dan tata letak 3 panel | FR-16 |
