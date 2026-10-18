# IVE-APP — Product Requirements Document (PRD)
**Versi:** 1.0  
**Status:** Draft untuk validasi produk dan acuan implementasi  
**Nama produk:** IVE-APP  
**Nama panjang:** Interactive Visual Education Application  
**Bahasa utama:** Bahasa Indonesia  
**Platform awal:** Web responsif  
**Dokumen terkait:** TAD Phase 1, `AGENTS.md`, dan `PRD-EDU-PLATFORM.md` sebagai sumber kebutuhan awal

---

## 1. Ringkasan Eksekutif

IVE-APP adalah platform pembelajaran digital interaktif yang membantu pengguna mempelajari konsep melalui materi terstruktur, visualisasi, simulasi, latihan soal, umpan balik, pelacakan progres, dan bantuan tutor AI yang memahami konteks pelajaran.

IVE-APP tidak dimaksudkan sebagai situs sekolah statis atau sekadar katalog video. Pengalaman utamanya adalah siklus belajar aktif:

**DISCOVER → LEARN → INTERACT → PRACTICE → ASK AI → COMPLETE → CONTINUE**

Pengguna dapat menjelajahi materi tanpa membuat akun. Akun memberikan manfaat tambahan seperti sinkronisasi progres, riwayat belajar, favorit, dan riwayat percakapan AI. Pengelola konten menggunakan CMS sederhana untuk menyusun, meninjau, dan menerbitkan materi tanpa perlu membuat halaman aplikasi baru untuk setiap pelajaran.

Produk dibangun bertahap. Phase 1 berfokus pada fondasi yang benar-benar berfungsi: katalog pendidikan, mesin penyaji materi, komponen interaktif, kuis, progres, AI tutor, pencarian, favorit, autentikasi, dan CMS dasar. Fitur lanjutan tidak dianggap otomatis masuk cakupan hanya karena disebut sebagai kemungkinan masa depan.

## 2. Identitas dan Prinsip Produk

### 2.1 Identitas

- **Nama produk:** IVE-APP.
- **Makna nama:** Interactive Visual Education Application.
- **Kategori:** Platform pembelajaran digital interaktif.
- **Bahasa UI dan konten awal:** Bahasa Indonesia.
- **Pengalaman yang diinginkan:** Modern, visual, ramah, mudah dipahami, mendorong eksplorasi dan latihan.
- **Identitas visual:** Orisinal. Produk boleh mengambil inspirasi dari prinsip UX aplikasi belajar modern, tetapi tidak menyalin logo, ilustrasi, merek, atau tampilan produk lain.

### 2.2 Prinsip produk

1. **Belajar adalah prioritas.** Kualitas pengalaman siswa lebih penting daripada kompleksitas dashboard admin.
2. **Interaktif jika bermakna.** Simulasi harus membantu pemahaman, bukan sekadar dekorasi.
3. **Konten dikelola sebagai data.** Materi tidak ditanam langsung ke komponen UI.
4. **Komponen dapat digunakan kembali.** Satu renderer dan satu registri komponen mendukung banyak pelajaran.
5. **Akses awal mudah.** Pengguna boleh mulai belajar tanpa login jika kontennya publik.
6. **Umpan balik mendidik.** Kesalahan dijelaskan dengan bahasa yang membangun, tidak mempermalukan.
7. **Keamanan sejak awal.** Otorisasi, validasi, dan pemeriksaan sisi server tidak boleh digantikan dengan menyembunyikan UI.
8. **Bertumbuh bertahap.** Fitur dan infrastruktur ditambahkan berdasarkan kebutuhan nyata.
9. **Aksesibilitas dan perangkat seluler.** Materi harus tetap dapat dipahami pada layar kecil dan memiliki alternatif saat visualisasi interaktif tidak tersedia.
10. **Tidak ada UI palsu.** Tombol yang terlihat harus melakukan tindakan nyata atau fitur tersebut tidak ditampilkan sebagai fitur aktif.

## 3. Masalah yang Ingin Diselesaikan

Pengalaman belajar digital sering kali memisahkan materi, latihan, bantuan, dan pemantauan progres ke tempat yang berbeda. Konsep abstrak juga dapat sulit dipahami jika hanya dijelaskan melalui teks.

IVE-APP berusaha menjawab masalah tersebut dengan:
- Menyusun materi dalam hierarki yang mudah dijelajahi.
- Menyajikan konsep melalui teks, ilustrasi, rumus, video, dan simulasi yang relevan.
- Memberi siswa kesempatan bereksperimen dengan parameter dan mengamati hasilnya.
- Menghubungkan materi dengan kuis dan penjelasan jawaban.
- Menyediakan bantuan AI dengan konteks pelajaran saat ini.
- Menyimpan progres secara lokal bagi tamu dan di akun bagi pengguna yang login.
- Memberi pengelola konten alur yang sederhana untuk membuat dan menerbitkan materi.

## 4. Tujuan Produk dan Bukan Tujuan

### 4.1 Tujuan

- Menyediakan pengalaman belajar web yang responsif dan berfungsi dari ujung ke ujung.
- Memungkinkan pengguna menelusuri jenjang, mata pelajaran, topik, dan materi.
- Menyediakan konten berbasis blok yang dapat dirender secara konsisten.
- Mendukung beberapa jenis komponen pembelajaran interaktif yang terdaftar secara eksplisit.
- Menyediakan kuis pilihan ganda dengan penilaian dan penjelasan.
- Menyediakan tutor AI yang menggunakan konteks pelajaran dan berjalan melalui backend.
- Menyimpan progres belajar, riwayat, dan favorit sesuai status pengguna.
- Menyediakan CMS sederhana untuk membuat, mengedit, mempratinjau, menerbitkan, dan mengarsipkan konten.
- Menjaga arsitektur cukup modular agar dapat berkembang tanpa membangun sistem terdistribusi terlalu dini.

### 4.2 Bukan tujuan Phase 1

Hal berikut merupakan kemungkinan roadmap, bukan komitmen Phase 1:
- Akun guru dan fitur pengelolaan kelas.
- LMS sekolah penuh, absensi, nilai rapor, atau administrasi institusi.
- Aplikasi native iOS/Android.
- Sertifikat, leaderboard, XP, dan gamifikasi kompleks.
- Kuis adaptif tingkat lanjut dan personalisasi berbasis model.
- Sistem rekomendasi machine learning khusus.
- Dashboard analitik yang kompleks.
- Microservices, service mesh, atau infrastruktur terdistribusi sebelum dibutuhkan.
- Editor visual setara authoring suite profesional.
- Konten yang dihasilkan AI dan diterbitkan otomatis tanpa peninjauan manusia.

## 5. Pengguna Sasaran dan Kebutuhan

### 5.1 Siswa/pelajar

Termasuk pengguna pada jenjang SD, SMP, SMA, serta pengguna umum. Bahasa, kedalaman materi, contoh, dan tingkat teknis harus menyesuaikan jenjang.

**Kebutuhan utama:**
- Menemukan materi yang relevan.
- Memahami materi melalui penjelasan dan visualisasi.
- Mencoba simulasi dengan kontrol yang mudah digunakan.
- Mengetahui apakah jawaban benar dan mengapa.
- Bertanya saat menemui kesulitan.
- Melanjutkan pembelajaran dari progres sebelumnya.
- Menggunakan platform dengan nyaman melalui ponsel.

### 5.2 Pengguna tamu

Pengguna yang belum login tetap dapat menjelajahi konten publik, membuka materi, menjalankan simulasi, dan mengerjakan kuis yang tersedia.

**Kebutuhan utama:**
- Mulai belajar tanpa hambatan registrasi.
- Memiliki progres dasar yang tersimpan pada perangkat.
- Memahami manfaat login jika ingin menyinkronkan progres.

### 5.3 Pengguna terdaftar

Pengguna yang telah login mendapat penyimpanan progres lintas sesi/perangkat, riwayat belajar, favorit, dan riwayat percakapan AI apabila fitur tersebut tersedia dan diaktifkan.

### 5.4 Admin/pengelola konten

Pengguna dengan peran admin bertanggung jawab atas katalog dan konten pendidikan.

**Kebutuhan utama:**
- Mengelola jenjang, mata pelajaran, topik, materi, soal, dan konfigurasi komponen interaktif.
- Menyusun materi dari blok konten yang dapat diurutkan.
- Menyimpan draft dan melihat pratinjau.
- Menerbitkan atau membatalkan publikasi.
- Mengarsipkan konten tanpa menghapus data penting secara tidak sengaja.
- Mengelola konten tanpa mengakses kredensial atau rahasia sistem.

### 5.5 Peran masa depan

Guru, orang tua, institusi, dan pengelola kelas dapat dipertimbangkan pada fase berikutnya. Mereka bukan peran aktif Phase 1 kecuali ditambahkan melalui keputusan produk yang terpisah.

## 6. Ruang Lingkup dan Prioritas

### 6.1 P0 — Wajib untuk MVP Phase 1

1. Homepage dan navigasi utama.
2. Pilihan jenjang pendidikan.
3. Katalog mata pelajaran dan topik.
4. Halaman materi/lesson.
5. Konten seed yang bermakna.
6. Content Block Engine.
7. Interactive Component Registry dan komponen inti.
8. Quiz Engine dan hasil kuis.
9. AI Assistant berbasis konteks pelajaran.
10. Autentikasi pengguna dan peran admin.
11. Progres belajar tamu dan pengguna login.
12. CMS dasar.
13. Validasi, otorisasi, error/loading/empty state, dan desain responsif.
14. Migrasi database, seed, dokumentasi environment, dan pengujian alur utama.

### 6.2 P1 — Termasuk bila fondasi P0 stabil

- Pencarian materi.
- Favorit.
- Halaman “Pembelajaran Saya”.
- Rekomendasi berbasis aturan sederhana.
- Event analytics dasar.
- Riwayat percakapan AI untuk pengguna login, jika belum masuk P0 implementasi awal.

### 6.3 P2 — Tidak wajib untuk MVP

- Gamifikasi lanjutan.
- Personalisasi tingkat lanjut.
- Fitur guru/kelas.
- Sertifikat dan leaderboard.
- Kuis adaptif.
- Analitik lanjutan.
- Sistem pencarian khusus yang terpisah dari database.
- Aplikasi mobile native.

Prioritas dapat diubah hanya melalui keputusan produk yang eksplisit, bukan karena fitur lebih menarik secara visual.

## 7. Struktur Informasi dan Model Konten

Hierarki utama:

**Jenjang Pendidikan → Mata Pelajaran → Topik → Materi → Blok Konten → Pertanyaan Latihan**

Jenjang awal:
- Umum
- SD
- SMP
- SMA

Mata pelajaran awal:
- Matematika
- Fisika
- Biologi
- Kimia
- Sejarah

Struktur harus memungkinkan penambahan jenjang, mata pelajaran, topik, materi, tipe blok, dan komponen interaktif baru tanpa perlu menulis ulang semua halaman.

### 7.1 Status konten

Setiap materi mendukung status:
- **DRAFT:** hanya dapat dilihat/diedit oleh pihak yang berwenang.
- **PUBLISHED:** tersedia pada katalog publik sesuai aturan akses.
- **ARCHIVED:** tidak ditampilkan sebagai materi aktif, tetapi tetap tersedia untuk kebutuhan pengelolaan atau referensi.

Konten publik hanya menampilkan materi berstatus PUBLISHED. Pratinjau admin yang sah boleh menampilkan draft tanpa memublikasikannya.

### 7.2 Metadata materi

Materi idealnya memiliki:
- Judul dan slug unik.
- Deskripsi ringkas.
- Jenjang, mata pelajaran, dan topik.
- Tujuan pembelajaran.
- Tingkat kesulitan.
- Estimasi durasi jika tersedia.
- Kata kunci untuk pencarian.
- Urutan dalam topik.
- Status publikasi.
- Daftar blok konten terurut.
- Kumpulan pertanyaan latihan.
- Metadata pembuatan dan pembaruan.

Field yang belum tersedia dalam implementasi dapat ditambahkan melalui migrasi yang terencana; PRD ini tidak mewajibkan semua field opsional masuk skema awal sekaligus.

## 8. Kebutuhan Fungsional

### FR-01 — Homepage

Homepage harus memperkenalkan manfaat IVE-APP dan memberi langkah berikutnya yang jelas.

Elemen yang diharapkan:
- Headline yang ramah, misalnya “Belajar jadi lebih seru.”
- Penjelasan singkat tentang belajar visual dan interaktif.
- CTA utama “Mulai Belajar”.
- CTA sekunder “Jelajahi Materi”.
- Kartu jenjang Umum, SD, SMP, SMA.
- Materi atau topik pilihan dari data yang tersedia.
- Akses yang jelas ke pencarian dan navigasi.
- Tampilan responsif dan tidak bergantung pada data palsu.

**Kriteria penerimaan:**
- CTA menuju rute yang benar.
- Kartu jenjang menampilkan data yang valid.
- Homepage tidak kosong setelah database di-seed.
- Loading, error, dan empty state ditangani.
- Tidak ada tombol utama yang tidak berfungsi.

### FR-02 — Pemilihan jenjang dan dashboard jenjang

Pengguna dapat memilih Umum, SD, SMP, atau SMA dan melihat mata pelajaran serta materi yang tersedia pada jenjang tersebut.

Dashboard jenjang dapat menampilkan:
- Mata pelajaran.
- Materi pilihan atau populer berdasarkan data nyata.
- Lanjutkan belajar jika progres tersedia.
- Pengalaman interaktif yang relevan.
- Progres pengguna jika dapat ditampilkan.

**Kriteria penerimaan:**
- Perpindahan jenjang mengubah katalog sesuai pilihan.
- Jumlah materi berasal dari data, bukan angka statis palsu.
- Tampilan tidak mengasumsikan pengguna sudah login.

### FR-03 — Katalog dan halaman mata pelajaran

Pengguna dapat melihat deskripsi mata pelajaran, daftar topik, materi terkait, dan progres yang tersedia.

**Kriteria penerimaan:**
- Mata pelajaran hanya menampilkan topik yang sesuai.
- Tautan menuju topik dan materi menggunakan slug yang stabil.
- Kondisi mata pelajaran tanpa materi memiliki empty state yang jelas.

### FR-04 — Halaman topik

Halaman topik menampilkan daftar materi dalam urutan yang ditentukan pengelola konten.

Setiap kartu materi dapat menampilkan judul, ringkasan, tingkat kesulitan atau durasi jika tersedia, serta status progres pengguna bila ada.

### FR-05 — Halaman materi

Halaman materi adalah pusat pengalaman belajar.

Fitur:
- Judul, ringkasan, metadata jenjang/mata pelajaran/topik.
- Renderer blok konten.
- Navigasi materi sebelumnya/berikutnya bila tersedia.
- Aksi menandai materi selesai atau pencatatan penyelesaian sesuai aturan progres.
- CTA “Mulai Latihan” jika materi memiliki kuis.
- Tombol “Tanya AI”.
- Informasi progres yang jelas.
- Layout responsif.
- Fallback yang tetap membuat konten dapat dipahami jika komponen interaktif gagal dimuat.

Penyelesaian membaca materi tidak harus bergantung pada penyelesaian kuis kecuali konfigurasi produk menyatakan sebaliknya.

### FR-06 — Content Block Engine

Materi tersusun dari blok terstruktur, bukan HTML/JavaScript bebas yang disimpan dalam database.

Jenis blok awal yang direncanakan:
- Heading.
- Text.
- Image.
- Video.
- Formula.
- Callout.
- Example.
- Interactive.
- Quiz.
- Divider.

Setiap tipe blok memiliki:
- Kontrak data yang stabil.
- Validasi skema.
- Renderer.
- Editor dan pratinjau CMS jika relevan.
- Penanganan data tidak valid.
- Tampilan fallback atau pesan yang aman untuk tipe yang tidak dikenali.

Rumus matematika ditampilkan menggunakan renderer yang sesuai seperti KaTeX jika tersedia pada stack. Video dan media harus mempertimbangkan performa dan perangkat seluler.

**Kriteria penerimaan:**
- Materi yang terdiri dari beberapa tipe blok dirender dalam urutan yang tersimpan.
- Data blok divalidasi sebelum diterbitkan.
- Blok tidak dikenal tidak merusak seluruh halaman.
- Konten CMS tidak dapat mengeksekusi JavaScript arbitrer.

### FR-07 — Komponen pembelajaran interaktif

Komponen interaktif didaftarkan melalui registry yang menghubungkan key komponen, skema konfigurasi, dan implementasi.

Komponen inti yang direncanakan:
1. **Projectile Simulator** — simulasi gerak parabola.
2. **Trigonometry Visualizer** — visualisasi sudut dan nilai sinus, cosinus, tangen.
3. **Cell Explorer** — diagram sel dengan organel yang dapat dipilih.
4. **Atom Explorer** — visualisasi sederhana struktur atom dan data unsur terpilih.
5. **History Timeline** — linimasa peristiwa sejarah.

#### FR-07.1 Projectile Simulator
Kontrol dan hasil:
- Kecepatan awal.
- Sudut peluncuran.
- Gravitasi jika dapat dikonfigurasi.
- Lintasan.
- Tinggi maksimum.
- Jarak horizontal.
- Waktu tempuh.
- Tombol reset.

Nilai harus dihitung menggunakan formula fisika yang sesuai dengan asumsi simulasi. Batasan asumsi harus dijelaskan agar visualisasi tidak dianggap sebagai model lengkap untuk semua kondisi nyata.

#### FR-07.2 Trigonometry Visualizer
- Kontrol sudut.
- Visualisasi segitiga siku-siku dan/atau lingkaran satuan.
- Nilai sin, cos, dan tan yang diperbarui ketika sudut berubah.
- Penjelasan yang sesuai jenjang.
- Penanganan sudut saat tan tidak terdefinisi.

#### FR-07.3 Cell Explorer
- Diagram sel.
- Organela yang dapat dipilih, termasuk nucleus, mitochondria, ribosome, cell membrane, cytoplasm, dan Golgi apparatus.
- Nama, fungsi, dan penjelasan sederhana untuk pilihan aktif.

#### FR-07.4 Atom Explorer
- Menampilkan inti, proton, neutron, dan elektron.
- Memungkinkan pemilihan sejumlah unsur yang sudah ditentukan.
- Menampilkan nomor atom dan jumlah partikel yang relevan.
- Menyatakan dengan jelas bahwa visualisasi merupakan penyederhanaan untuk belajar.

#### FR-07.5 History Timeline
- Linimasa horizontal atau vertikal.
- Pemilihan peristiwa menampilkan tahun, nama peristiwa, deskripsi, dan arti pentingnya.
- Contoh data awal dapat mencakup Budi Utomo (1908), Sumpah Pemuda (1928), dan Proklamasi Kemerdekaan (1945).

**Kriteria penerimaan umum:**
- Kontrol berfungsi dan mengubah visualisasi/hasil.
- Dapat digunakan dengan mouse dan sentuhan.
- Memiliki label yang dapat dipahami.
- Tersedia penjelasan tekstual atau fallback statis.
- Tidak memuat kode arbitrer dari database.
- Perhitungan penting diuji dengan kasus yang representatif.

### FR-08 — Quiz Engine

Kuis Phase 1 mendukung pertanyaan pilihan ganda.

Struktur pertanyaan mencakup:
- Pertanyaan.
- Pilihan jawaban.
- Jawaban benar yang disimpan di sisi server.
- Penjelasan jawaban.
- Tingkat kesulitan bila tersedia.
- Relasi dengan materi.

Alur kuis:
1. Pengguna memulai kuis.
2. Sistem menampilkan pertanyaan dan pilihan.
3. Pengguna memilih jawaban.
4. Pengguna memeriksa jawaban.
5. Sistem menampilkan hasil benar/salah beserta penjelasan.
6. Pengguna melanjutkan ke pertanyaan berikutnya.
7. Setelah selesai, sistem menampilkan ringkasan hasil.

Ringkasan dapat mencakup skor, jumlah benar, jumlah salah, total soal, dan ajakan untuk meninjau materi atau melanjutkan.

**Aturan penilaian:**
- Penilaian otoritatif dilakukan di server.
- Klien tidak boleh menentukan skor final atau jawaban benar yang dipercaya server.
- Permintaan submit divalidasi dan hanya jawaban yang sah diproses.
- Respons tidak membocorkan jawaban untuk pertanyaan yang belum dijawab apabila hal tersebut merusak alur kuis.
- Pesan salah harus suportif dan disertai penjelasan.

**Kriteria penerimaan:**
- Kuis berjalan dari awal hingga hasil.
- Skor sesuai jawaban yang diterima server.
- Jawaban salah memberikan koreksi dan penjelasan.
- Refresh atau pengiriman ganda tidak boleh menghasilkan pencatatan ganda yang tidak disengaja jika percobaan kuis disimpan.
- Kegagalan API menghasilkan pesan yang dapat dipahami.

### FR-09 — AI Assistant / Tutor AI

Tutor AI membantu pengguna memahami materi, bukan sekadar menjadi chatbot umum.

UI:
- Tombol “Tanya AI” pada halaman materi.
- Drawer sisi kanan pada desktop dan tampilan drawer/bottom sheet layar penuh pada perangkat seluler.
- Label konteks “Sedang membahas: [judul materi]”.
- Riwayat pesan selama sesi.
- Input pertanyaan.
- Prompt saran yang relevan dengan materi.

Contoh prompt:
- “Jelaskan konsep ini dengan sederhana.”
- “Beri contoh lain.”
- “Apa rumus pentingnya?”
- “Saya masih bingung.”
- “Buatkan soal latihan.”

Konteks yang dikirim dari backend:
- Jenjang pendidikan.
- Mata pelajaran.
- Topik.
- Judul dan deskripsi materi.
- Potongan konten relevan dari materi.
- Riwayat percakapan yang dibatasi jika tersedia.

Perilaku AI:
- Menyesuaikan bahasa dan kedalaman dengan jenjang.
- Menjelaskan langkah demi langkah bila sesuai.
- Menggunakan contoh atau analogi.
- Mengarahkan siswa memahami proses, bukan hanya memberikan jawaban akhir.
- Tetap fokus pada pendidikan.
- Mengakui ketidakpastian dan tidak mengarang fakta.
- Tidak mengungkap prompt internal, kredensial, atau data privat.
- Mematuhi batas ukuran konteks dan rate limit.

Keamanan:
- Permintaan AI selalu melalui backend.
- Kunci API tidak pernah dikirim ke browser atau variabel environment publik.
- Provider dapat diganti melalui adapter yang stabil.
- Akses AI dapat dibatasi berdasarkan konfigurasi, kuota, atau rate limit.
- Konten materi dan percakapan yang dikirim dibatasi pada kebutuhan konteks.

Fallback:
- Jika provider tidak tersedia, aplikasi tetap berjalan.
- Tampilkan pesan bahwa AI sedang tidak tersedia dan aksi “Coba lagi”.
- FAQ edukatif statis dapat digunakan sebagai fallback jika tersedia.
- Error provider tidak boleh merusak halaman materi.

**Kriteria penerimaan:**
- Pertanyaan dari halaman materi menerima konteks materi yang benar.
- API key tidak terlihat dalam bundle browser atau respons publik.
- Kegagalan provider ditangani dengan baik.
- Respons AI ditampilkan sebagai teks aman; konten tidak dipercaya sebagai HTML aktif.
- Batas penggunaan dan error dicatat tanpa membocorkan rahasia.

### FR-10 — Autentikasi dan profil

Pengguna dapat mendaftar, login, logout, dan mengakses fitur akun yang tersedia.

Browsing dan belajar dari materi publik tidak diwajibkan login. Login berguna untuk:
- Sinkronisasi progres.
- Riwayat belajar.
- Favorit.
- Riwayat percakapan AI jika tersedia.

Peran Phase 1:
- `user`
- `admin`

Ketentuan:
- Pendaftaran baru mendapat role `user`.
- Pengguna tidak dapat memilih atau menaikkan role sendiri.
- Role admin ditetapkan melalui mekanisme aman.
- Akses admin selalu diperiksa di server.
- Pengelolaan sesi/cookie mengikuti kemampuan penyedia autentikasi yang dipilih.

### FR-11 — Progres belajar

Untuk pengguna tamu, progres dasar disimpan di localStorage. Untuk pengguna login, progres persisten disimpan di database.

Informasi progres yang dapat dicatat:
- Materi yang telah dibuka.
- Materi yang telah diselesaikan.
- Waktu pembaruan terakhir.
- Hasil/riwayat percobaan kuis jika masuk dalam skema implementasi.
- Materi yang terakhir dipelajari.

Penggabungan progres tamu ke akun:
- Harus idempoten.
- Tidak boleh menghapus progres server yang lebih baik dengan data lokal yang lebih lama atau lebih buruk.
- Harus menangani konflik secara deterministik.
- Tidak boleh mengandalkan data klien sebagai bukti penilaian kuis yang sah.

### FR-12 — Favorit

Pengguna login dapat menandai dan membatalkan tanda favorit pada materi. Status favorit ditampilkan di halaman yang relevan dan pada area “Pembelajaran Saya”.

Jika fitur favorit tidak tersedia untuk tamu, UI harus menjelaskan bahwa login diperlukan alih-alih diam-diam gagal.

### FR-13 — Pembelajaran Saya

Halaman ini menjadi tempat pengguna melihat progres dan melanjutkan pembelajaran.

Dapat menampilkan:
- Lanjutkan belajar.
- Materi yang telah diselesaikan.
- Favorit.
- Riwayat belajar.
- Hasil kuis jika disimpan.

Untuk pengguna tamu, tampilkan progres lokal dan ajakan login untuk sinkronisasi bila relevan. Halaman tidak boleh menjadi dashboard kosong atau menampilkan statistik palsu.

### FR-14 — Pencarian dan eksplorasi

Pencarian mencakup:
- Mata pelajaran.
- Topik.
- Judul materi.
- Deskripsi.
- Kata kunci.

Filter awal:
- Jenjang.
- Mata pelajaran.
- Tingkat kesulitan jika data tersedia.

UX:
- Input pencarian dengan debounce.
- Status loading.
- Empty state.
- Kartu hasil yang dapat dibuka.
- Filter yang dapat digunakan di perangkat seluler.

Implementasi awal dapat menggunakan kemampuan pencarian PostgreSQL. Mesin pencarian terpisah hanya dipertimbangkan ketika kebutuhan relevansi, volume, atau latensi telah terbukti.

### FR-15 — Rekomendasi sederhana

Jika diterapkan pada Phase 1, rekomendasi menggunakan aturan yang mudah dipahami, misalnya:
- Materi lanjutan dari materi yang sedang dipelajari.
- Materi pada mata pelajaran yang sama.
- Materi populer berdasarkan event nyata jika data tersebut dikumpulkan.
- Materi yang belum selesai.

Jangan mengklaim rekomendasi personal berbasis AI/ML jika implementasinya hanya berupa aturan statis.

### FR-16 — CMS admin

CMS harus sederhana, berorientasi pada pekerjaan konten, dan tidak mengalahkan prioritas UI siswa.

Area:
- Dashboard ringkas.
- Pengelolaan jenjang/mata pelajaran/topik jika diperlukan.
- Daftar dan editor materi.
- Pengelolaan pertanyaan.
- Pemilihan komponen interaktif.
- Pratinjau.
- Publish/unpublish.
- Arsip.

Editor materi:
- Tambah blok.
- Edit blok.
- Pindahkan urutan blok.
- Hapus blok dengan konfirmasi bila relevan.
- Simpan draft.
- Preview.
- Publish.

Tipe blok awal: heading, text, image, video, formula, callout, example, interactive, quiz, divider.

Ketentuan:
- Hanya admin terotorisasi dapat membuat atau mengubah konten.
- Perubahan publikasi divalidasi.
- Draft tidak tampil di katalog publik.
- Penghapusan konten terbit sebaiknya menggunakan arsip jika sesuai.
- Aksi destruktif membutuhkan konfirmasi.
- Konten harus divalidasi sebelum diterbitkan.

### FR-17 — Event analytics dasar

Jika termasuk dalam implementasi, event dasar dapat mencakup:
- `lesson_viewed`
- `lesson_started`
- `lesson_completed`
- `quiz_started`
- `quiz_completed`
- `ai_opened`
- `ai_question_asked`
- `search_performed`

Analitik Phase 1 bersifat sederhana dan tidak boleh menghambat alur belajar. Hindari pengumpulan data pribadi yang tidak dibutuhkan. Dashboard analitik lanjutan bukan persyaratan MVP.

## 9. Rute dan Navigasi Produk

Rute konseptual yang direncanakan:

### Publik
- `/` — Homepage
- `/explore` — Eksplorasi katalog
- `/search` — Hasil pencarian
- `/my-learning` — Progres dan materi pengguna
- `/login` — Login

### Pendidikan
- `/learn/umum`
- `/learn/sd`
- `/learn/smp`
- `/learn/sma`
- `/learn/:level/:subject`
- `/learn/:level/:subject/:topic`
- `/learn/:level/:subject/:topic/:lesson`
- `/quiz/:lesson`

### Admin
- `/admin`
- `/admin/dashboard`
- `/admin/subjects`
- `/admin/topics`
- `/admin/lessons`
- `/admin/questions`
- `/admin/interactive`

Rute final harus konsisten dengan struktur aplikasi yang telah ada. Jika implementasi sudah menggunakan rute berbeda tetapi berfungsi, perubahan rute harus direncanakan dan tidak dilakukan hanya untuk mencocokkan dokumen.

Navigasi desktop mencakup Home, Explore, My Learning, pencarian, serta login/profil. Navigasi seluler menyediakan menu ringkas dan, bila sesuai, navigasi bawah. Pilihan jenjang harus mudah ditemukan.

## 10. Kebutuhan Data dan Konten Seed

Aplikasi tidak boleh dimulai dengan katalog kosong. Seed awal harus menyediakan contoh materi yang cukup untuk menguji seluruh alur utama.

Target awal dari kebutuhan produk:
- Umum: minimal 5 materi.
- SD: minimal 5 materi.
- SMP: minimal 10 materi.
- SMA: minimal 20 materi.
- Total target: 40+ materi.

Setiap materi seed sebaiknya mencakup judul, deskripsi, konten belajar, setidaknya satu blok visual/konten, dan minimal tiga pertanyaan latihan jika relevan.

Contoh area konten:
- **Matematika SD:** operasi bilangan, pecahan, bangun datar, keliling dan luas, perbandingan.
- **Matematika SMP:** aljabar, persamaan linear, geometri, Pythagoras, statistika.
- **Matematika SMA:** fungsi, persamaan kuadrat, trigonometri, limit, turunan, integral.
- **Fisika:** besaran dan satuan, gerak lurus, kecepatan, percepatan, gerak parabola, Hukum Newton, energi, momentum, gelombang, listrik.
- **Biologi:** sel, struktur sel, organel, fotosintesis, sistem pencernaan, pernapasan, peredaran darah, genetika.
- **Kimia:** atom, unsur, molekul, struktur atom, ikatan kimia, reaksi kimia, asam dan basa.
- **Sejarah:** linimasa dan peristiwa penting Indonesia.

Materi “Gerak Parabola” menjadi salah satu contoh unggulan yang menggabungkan blok materi, simulasi, AI, dan kuis. Materi trigonometri dan sel menjadi contoh utama untuk menguji jenis komponen interaktif lain.

Konten seed harus bermakna dan diperiksa secara wajar. Konten demo harus dibedakan dari statistik produk nyata jika ditampilkan sebagai data aktivitas.

## 11. Kebutuhan UX, UI, dan Aksesibilitas

### 11.1 Arah visual

- Ramah, visual, cerah, dan mendorong eksplorasi.
- Heading jelas dan mudah dibaca.
- Kartu dengan radius konsisten.
- Spasi yang cukup.
- Ikon dan ilustrasi yang membantu pemahaman.
- CTA utama mudah dikenali.
- Warna aksen mata pelajaran konsisten dan memiliki kontras yang memadai.
- Animasi halus dan tidak menghalangi tugas.
- Tidak meniru identitas visual produk lain.

### 11.2 Responsivitas

- Mendukung ponsel, tablet, dan desktop.
- Tidak ada horizontal overflow yang tidak disengaja.
- Kontrol interaktif dapat digunakan dengan sentuhan.
- Pilihan kuis berupa target tap yang cukup besar.
- Drawer AI menyesuaikan perangkat.
- Rumus, gambar, video, dan simulasi tetap dapat digunakan pada layar kecil.

### 11.3 Aksesibilitas

- Gunakan elemen semantik dan hierarki heading yang masuk akal.
- Semua input memiliki label.
- Navigasi keyboard dan fokus terlihat.
- Gambar informatif memiliki teks alternatif.
- Kontras warna memadai.
- Status benar/salah tidak dibedakan hanya melalui warna.
- Hormati preferensi reduced motion jika memungkinkan.
- Simulasi interaktif menyediakan penjelasan tekstual/fallback.

### 11.4 Status antarmuka

Semua fitur asinkron harus menangani state yang relevan:
- Loading.
- Error.
- Empty.
- Success.
- Disabled jika memang tidak dapat digunakan.
- Retry jika kegagalan bersifat sementara.

Jangan menampilkan stack trace atau error internal kepada pengguna.

## 12. Kebutuhan Nonfungsional

### NFR-01 — Performa
- Render materi utama secara efisien.
- Muat komponen interaktif secara lazy bila sesuai.
- Optimalkan gambar dan video.
- Hindari query tidak terbatas dan pola N+1.
- Ambil field database yang diperlukan saja.
- Ukur masalah performa sebelum melakukan optimasi kompleks.
- Cache konten publik bila aman dan invalidasi cache setelah perubahan konten.

### NFR-02 — Keamanan
- Semua operasi admin harus memeriksa otorisasi di server.
- Validasi request body, parameter, dan konfigurasi konten.
- Lindungi API key dan kredensial di server.
- Gunakan ORM dan parameterisasi untuk mengurangi risiko injeksi SQL.
- Sanitasi atau render konten rich text dengan aman.
- Jangan mempercayai skor atau jawaban benar dari klien.
- Terapkan rate limit pada endpoint yang berisiko, khususnya AI, jika sesuai.
- Jangan mencatat kata sandi, token, API key, atau data pribadi yang tidak diperlukan.
- Rahasia tidak boleh masuk repository.

### NFR-03 — Reliabilitas
- Kegagalan AI tidak boleh merusak halaman materi.
- Blok konten yang tidak dikenal tidak boleh merusak seluruh halaman.
- Progres dan kuis harus menangani pengiriman ganda dan kondisi konflik secara aman.
- Migrasi dan seed harus terdokumentasi dan dapat dijalankan pada lingkungan bersih.

### NFR-04 — Skalabilitas
- Mulai dengan arsitektur Modular Monolith.
- Pisahkan domain dan tanggung jawab aplikasi dengan jelas.
- Gunakan PostgreSQL sebagai sumber kebenaran untuk data persisten.
- Redis, queue, search engine khusus, atau layanan terpisah ditambahkan bila kebutuhan terukur membenarkannya.
- Jangan membangun microservices hanya untuk antisipasi hipotetis.

### NFR-05 — Pemeliharaan
- TypeScript untuk kode aplikasi.
- Validasi skema untuk data eksternal dan konten.
- Pemisahan UI, layanan aplikasi, repositori/adaptor, dan infrastruktur.
- Pengujian untuk logika penting.
- Dokumentasi diperbarui saat kontrak, arsitektur, environment, atau deployment berubah.
- Komponen dan utilitas yang sudah ada harus dicari dan digunakan ulang sebelum membuat duplikasi.

### NFR-06 — Privasi
- Kumpulkan data minimum yang diperlukan untuk pengalaman belajar.
- Batasi konteks yang dikirim ke AI.
- Jelaskan manfaat login dan data yang disimpan melalui UI yang sesuai.
- Jangan memasukkan informasi sensitif ke log.
- Kebijakan privasi final perlu disesuaikan dengan cara produk benar-benar mengumpulkan dan memproses data sebelum rilis publik.

## 13. Prinsip Arsitektur Produk

PRD ini menetapkan kebutuhan produk; rincian implementasi teknis berada di TAD. Secara garis besar:
- Aplikasi web menggunakan stack Next.js, React, dan TypeScript sesuai baseline TAD.
- UI memanggil layanan aplikasi; komponen UI tidak mengakses database secara langsung.
- Konten pendidikan disimpan dalam database dan ditampilkan melalui renderer reusable.
- Validasi dan otorisasi dilakukan di sisi server.
- Quiz Engine menjadi otoritas penilaian.
- AI diakses melalui service dan provider adapter di backend.
- Progress guest dan progress akun memiliki jalur penyimpanan dan mekanisme merge yang jelas.
- Modul domain dipisahkan secara logis, tetapi tidak harus menjadi service deployment terpisah.
- Skema data, rute, atau komponen yang sudah ada harus diperiksa sebelum penambahan baru.

TAD dan kondisi kode saat implementasi adalah acuan teknis. Jika terdapat perbedaan antara PRD dan TAD, tim harus mencatat konflik dan menyepakati keputusan; jangan diam-diam mengganti keputusan produk atau arsitektur.

## 14. Kriteria Penerimaan MVP

MVP dinyatakan memenuhi kebutuhan produk apabila:

### Pengalaman siswa
- [ ] Homepage menampilkan data dan navigasi yang berfungsi.
- [ ] Pengguna dapat memilih jenjang, mata pelajaran, topik, dan materi.
- [ ] Materi menampilkan blok konten secara benar.
- [ ] Komponen interaktif inti bekerja dan memiliki fallback.
- [ ] Kuis dapat diselesaikan dan hasil dihitung secara otoritatif di server.
- [ ] AI menerima konteks materi dan memiliki penanganan kegagalan.
- [ ] Pengguna dapat melanjutkan ke materi lain.
- [ ] Halaman bekerja di ponsel dan desktop.

### Akun dan progres
- [ ] Pengguna dapat menggunakan materi publik tanpa login.
- [ ] Login dan logout berfungsi.
- [ ] Role pengguna ditetapkan dengan aman.
- [ ] Progres tamu tersimpan secara lokal.
- [ ] Progres akun tersimpan di database.
- [ ] Merge progres tidak menimpa progres server yang lebih baik.
- [ ] Favorit dan riwayat bekerja jika diaktifkan dalam rilis.

### CMS
- [ ] Admin dapat login dan aksesnya diperiksa di server.
- [ ] Admin dapat membuat dan mengedit materi.
- [ ] Admin dapat menambah, mengurutkan, mengedit, dan menghapus blok.
- [ ] Admin dapat mengatur soal dan konfigurasi komponen interaktif.
- [ ] Admin dapat menyimpan draft, preview, publish/unpublish, dan archive.
- [ ] Draft tidak muncul di katalog publik.
- [ ] Aksi destruktif memiliki konfirmasi.

### Teknis dan kualitas
- [ ] Migrasi database dan seed berjalan dari lingkungan bersih.
- [ ] Environment variables didokumentasikan melalui `.env.example`.
- [ ] Tidak ada secret production di repository.
- [ ] Validasi input dan penanganan error tersedia.
- [ ] Tidak ada tombol utama yang mati.
- [ ] Tidak ada error runtime utama pada alur kritis.
- [ ] Tes logika penting dan alur end-to-end utama lulus.
- [ ] Dokumentasi penggunaan lokal dan deployment tersedia.

## 15. Skenario Uji End-to-End Utama

### E2E-01 — Alur belajar Fisika
1. Buka homepage.
2. Pilih SMA.
3. Buka Fisika.
4. Buka topik Gerak.
5. Buka materi Gerak Parabola.
6. Baca konten.
7. Ubah sudut dan kecepatan di Projectile Simulator.
8. Pastikan visualisasi dan nilai berubah.
9. Buka AI dan tanyakan mengapa sudut 45° sering menghasilkan jarak maksimum dalam asumsi gerak parabola ideal.
10. Tutup AI.
11. Mulai kuis.
12. Jawab pertanyaan.
13. Tinjau umpan balik dan skor.
14. Lanjutkan ke materi berikutnya jika tersedia.

### E2E-02 — Alur Trigonometri
1. Buka materi Trigonometri.
2. Ubah sudut pada visualizer.
3. Pastikan visualisasi dan nilai sin/cos/tan diperbarui.
4. Jalankan kuis dan lihat hasil.

### E2E-03 — Alur Biologi
1. Buka materi Sel.
2. Buka Cell Explorer.
3. Pilih nucleus.
4. Baca penjelasan.
5. Pilih mitochondria.
6. Pastikan penjelasan berubah.

### E2E-04 — Alur CMS
1. Login sebagai admin.
2. Buka dashboard admin.
3. Buat materi baru.
4. Pilih jenjang, mata pelajaran, dan topik.
5. Tambahkan blok teks, formula, video, dan interaktif.
6. Tambahkan pertanyaan latihan.
7. Simpan draft.
8. Preview.
9. Publish.
10. Pastikan materi muncul di situs publik.
11. Pastikan draft yang belum diterbitkan tidak terlihat oleh publik.

### E2E-05 — Progres tamu ke akun
1. Mulai belajar tanpa login.
2. Selesaikan atau tandai beberapa materi.
3. Login atau buat akun.
4. Jalankan merge progres.
5. Pastikan progres tamu yang valid dipindahkan tanpa menurunkan progres server yang sudah ada.
6. Ulangi merge dan pastikan hasil tidak terduplikasi.

## 16. Roadmap Produk

### Phase 1 — Foundation
- Struktur katalog dan database.
- Autentikasi dan otorisasi.
- Halaman publik utama.
- Content Block Engine.
- Interactive Component Registry dan komponen inti.
- Quiz Engine.
- Progres tamu dan akun.
- AI tutor berbasis konteks.
- Pencarian dan favorit sesuai prioritas rilis.
- CMS dasar.
- Seed content, pengujian, dan dokumentasi.

### Phase 2 — Product Depth
- Pengalaman editor konten lebih kaya.
- Kumpulan komponen interaktif lebih luas.
- Rekomendasi yang lebih baik.
- Tutor AI yang lebih kontekstual.
- Analitik pembelajaran yang lebih berguna.
- Kuis adaptif jika ada kebutuhan dan rancangan evaluasi yang jelas.

### Phase 3 — Scale
- Peningkatan caching dan delivery media.
- Background jobs dan worker sesuai kebutuhan.
- Peningkatan pencarian bila data/performa membutuhkannya.
- Pipeline analitik.
- Pemisahan layanan AI atau domain tertentu bila batas dan beban nyata membenarkannya.

### Phase 4 — Platform
- Akun guru dan fitur kelas.
- Personalisasi dan pembelajaran adaptif.
- Pencapaian dan sertifikat.
- Aplikasi mobile.
- Orkestrasi AI yang lebih maju.

Roadmap adalah arah pengembangan, bukan persetujuan otomatis untuk membangun semua fitur. Setiap fase membutuhkan validasi, prioritas, dan kriteria penerimaan tersendiri.

## 17. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Materi berkualitas rendah atau tidak akurat | Kepercayaan dan hasil belajar turun | Konten terstruktur, peninjauan, sumber dan tujuan belajar yang jelas |
| AI memberikan jawaban salah | Salah pemahaman | Konteks terbatas dan relevan, instruksi tutor, penanganan ketidakpastian, uji respons, feedback pengguna |
| Konten interaktif berat di perangkat seluler | Pengalaman lambat atau tidak bisa digunakan | Lazy loading, kontrol sederhana, fallback statis/tekstual |
| Konten CMS tidak valid | Halaman materi rusak | Validasi schema saat edit/publish, renderer defensif, preview |
| Progres tamu dan akun konflik | Kehilangan data progres | Merge idempoten dan aturan konflik eksplisit |
| Skor dimanipulasi dari klien | Hasil kuis tidak dapat dipercaya | Penilaian server-authoritative |
| Scope melebar terlalu cepat | MVP terlambat dan kualitas turun | Prioritas P0/P1/P2, review scope, hindari over-engineering |
| Duplikasi komponen akibat banyak agen | Kode sulit dipelihara | `AGENTS.md`, pencarian sebelum membuat, ownership domain, review diff |
| Ketergantungan AI provider | Fitur AI rentan gangguan | Provider adapter dan fallback yang aman |
| Kebocoran rahasia | Risiko keamanan | Secret server-side, environment terpisah, review log dan repository |

## 18. Asumsi dan Hal yang Perlu Diputuskan

PRD ini menggunakan kebutuhan yang sudah tersedia dalam dokumen awal dan baseline arsitektur. Hal-hal berikut perlu dikonfirmasi sebelum atau selama perencanaan rilis:
- Apakah “Umum” merupakan kategori setara jenjang sekolah atau katalog lintas jenjang.
- Penyedia autentikasi final dan konfigurasi lingkungan deployment.
- Penyedia AI, model, biaya penggunaan, kuota, dan batasan penggunaan.
- Apakah riwayat percakapan AI masuk rilis pertama atau iterasi berikutnya.
- Apakah event analytics disimpan di database utama atau tidak diaktifkan dahulu.
- Kebijakan retensi data, privasi, dan moderasi yang sesuai dengan audiens produk.
- Kriteria editorial dan proses peninjauan konten sebelum publish.
- Target performa dan kapasitas yang dapat diuji setelah deployment awal.

Keputusan tersebut tidak boleh diisi dengan asumsi tersembunyi. Catat keputusan produk/teknis ketika telah disepakati.

## 19. Definisi Selesai (Definition of Done)

Sebuah fitur dianggap selesai jika:
1. Kebutuhan dan perilaku yang diharapkan jelas.
2. Implementasi mengikuti pola arsitektur dan domain yang ada.
3. Kode lama yang relevan sudah diperiksa dan tidak diduplikasi tanpa alasan.
4. Validasi dan otorisasi diterapkan sesuai risiko.
5. Loading, error, empty, dan success state ditangani.
6. UI responsif dan dapat diakses secara wajar.
7. Tes relevan dibuat atau diperbarui dan dijalankan.
8. Tidak ada tombol atau interaksi utama yang palsu.
9. Diff ditinjau dan tidak berisi perubahan tidak terkait.
10. Dokumentasi diperbarui jika kontrak, konfigurasi, arsitektur, atau perilaku publik berubah.
11. Hasil akhir melaporkan apa yang diubah, tes yang dijalankan, hasilnya, dan risiko yang masih terbuka.

## 20. Hubungan dengan Dokumen Lain

- **PRD ini:** menjelaskan apa yang harus dicapai, siapa penggunanya, ruang lingkup, perilaku produk, dan kriteria penerimaan.
- **TAD Phase 1:** menjelaskan bagaimana kebutuhan tersebut diterapkan secara teknis, termasuk arsitektur, domain, data, API, keamanan, pengujian, dan deployment.
- **`AGENTS.md`:** menjelaskan cara agen coding bekerja, menjaga konsistensi kode, melakukan perubahan, dan berkolaborasi.
- **Dokumen implementasi dan ADR:** mencatat keputusan teknis yang berubah atau membutuhkan alasan eksplisit.

Jika kode yang berjalan berbeda dari dokumen, agen harus memeriksa kondisi aktual, menjaga perilaku yang sudah benar, dan mengusulkan perubahan secara bertahap. Jangan melakukan rewrite luas hanya untuk membuat implementasi tampak identik dengan dokumen.

---

## Lampiran A — Ringkasan Prioritas Fitur

| Fitur | Prioritas | Keterangan |
|---|---|---|
| Homepage dan navigasi | P0 | Wajib |
| Katalog jenjang/mata pelajaran/topik | P0 | Wajib |
| Halaman materi dan content renderer | P0 | Wajib |
| Konten seed | P0 | 40+ materi sebagai target awal |
| Simulasi inti | P0 | Projectile, trigonometri, sel, atom, timeline sesuai kesiapan konten |
| Kuis pilihan ganda | P0 | Penilaian sisi server |
| AI tutor kontekstual | P0 | Provider adapter, server-side, fallback |
| Auth dan role admin | P0 | Login opsional untuk belajar publik |
| Progres tamu dan akun | P0 | Merge aman |
| CMS materi dasar | P0 | Draft, preview, publish, archive |
| Search | P1 | Dapat dinaikkan prioritas sesuai keputusan rilis |
| Favorit | P1 | Fitur akun |
| Rekomendasi sederhana | P1 | Aturan transparan |
| Analytics dasar | P1 | Event minimal jika berguna |
| Gamifikasi kompleks | P2 | Bukan MVP |
| Guru/kelas | P2 | Fase berikutnya |
| Sertifikat/leaderboard | P2 | Fase berikutnya |
| Aplikasi native | P2 | Fase berikutnya |

## Lampiran B — Catatan Penamaan

Semua nama produk yang ditampilkan kepada pengguna harus menggunakan **IVE-APP** kecuali ada keputusan branding baru. Nama lama **EduSpark** hanya boleh muncul dalam konteks migrasi dokumen, riwayat keputusan, atau referensi sumber lama; jangan biarkan nama lama tertanam di UI, prompt AI, seed, metadata, atau dokumentasi aktif tanpa alasan.

Perubahan nama produk tidak mengharuskan perubahan nama setiap identifier internal, package, database, atau folder jika perubahan itu berisiko dan tidak memberi manfaat. Perubahan branding teknis harus dilakukan secara terencana dan konsisten.
