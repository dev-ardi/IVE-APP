# IVE-APP — CMS Design & UI Implementation Brief
# Source of Truth: Neo-Brutalist Admin CMS, RBAC Bridge, Sandbox Studio, & Integrasi Data CMS ↔ Frontend

> **Versi Dokumen:** 1.0 — diturunkan dari `design-frontend.md` v2.0, diselaraskan dengan `AGENTS.md`, `IVE_TAD_Phase_1.md` v2.0, dan `IVE-APP-PRD.md` v2.0
> **Tanggal:** 2026-10-19
> **Cakupan:** Seluruh antarmuka Admin CMS (`/admin/*`) + **satu jembatan** ke frontend publik (tombol *Akses CMS* di header). Dokumen pasangan dari `design-frontend.md` (yang melarang menyentuh `/admin/*`).
> **Bahasa UI:** Bahasa Indonesia. Bahasa Inggris untuk kode, token, variabel, dan komentar commit.
> **Penanda `[Perlu konfirmasi]`:** usulan yang belum diputuskan pemilik produk. Jangan dijadikan keputusan diam-diam; catat di handoff.

---

## 0. Instruksi Utama & Batas Scope

Anda bertindak sebagai **Principal Product Designer, Design Systems Architect, dan Lead Full-Stack Engineer** untuk CMS IVE-APP. Tugas dokumen ini: membangun CMS yang **tegas, cepat dipindai, dan terhubung nyata** dengan database dan frontend publik.

### 0.1 Tiga janji yang harus terbukti berfungsi

1. **Frontend → CMS:** nilai yang sudah ada di frontend/DB (mata pelajaran, topik, materi, sumber, soal, komponen interaktif, tema warna subjek) **muncul otomatis** di CMS sebagai pilihan dan konteks — tidak diketik ulang, tidak di-hardcode.
2. **CMS → Frontend:** apa pun yang disimpan/dipublikasikan di CMS **tampil di frontend publik** melalui renderer dan service yang sama (tanpa deploy ulang, tanpa menyentuh `dummy-data.ts`).
3. **RBAC jembatan dua arah:** tidak ada halaman login admin terpisah. Pengguna ber-role `ADMIN` atau `SUPER_ADMIN` melihat tombol **Akses CMS** di header frontend; di dalam CMS tersedia tombol **Lihat Public Site** untuk kembali.

### 0.2 Batas scope (wajib dipatuhi)

- Boleh: seluruh `/admin/*`, komponen khusus CMS, service/API admin, dan **satu elemen jembatan** di shell publik (tombol *Akses CMS* — Bagian 2.3).
- Dilarang: mengubah desain/komposisi halaman publik lain, mengganti token global frontend, atau menggeser perilaku navigasi pill (`nav-links.tsx`) di luar penambahan tombol aksi.
- Dilarang: membangun fitur Phase 2/3 (akun guru, kelas, kode akses). `SUPER_ADMIN` bukan role guru.
- Dilarang: kolom isian kode bebas, HTML/JS injection, `eval`, atau komponen buatan pengguna. CMS hanya menyimpan **key komponen + konfigurasi tervalidasi** (AGENTS.md Bagian 17).
- Jangan merusak fitur yang sudah berfungsi. Audit dulu (rute, komponen, token, service existing), pakai ulang sebelum membuat baru.

### 0.3 Prioritas keputusan desain CMS

1. Data benar dan terhubung (round-trip CMS ↔ frontend lulus).
2. Admin tidak salah menerbitkan/menghapus (konfirmasi, status jelas, checklist publish).
3. Keterbacaan & aksesibilitas (kontras, fokus keyboard, status bukan hanya warna).
4. Konsistensi token dan identitas dengan frontend.
5. Kecepatan kerja (scan cepat, aksi utama jelas).
6. Estetika neo-brutalis — hanya bila tidak mengorbankan poin 1–5.

---

## 1. Karakter Visual: Hard Neo-Brutalism untuk Ruang Kerja

Frontend publik memakai **Soft Neobrutalism** (`design-frontend.md` §0.1). CMS adalah ruang kerja, jadi memakai versi **lebih keras dan lebih padat** dengan DNA yang sama sehingga admin langsung merasa "masih di IVE-APP".

| Aspek | Frontend publik (Soft) | CMS (Hard) |
|---|---|---|
| Kanvas | `#F4F1EA` Stone Linen | **Sama** (`--background`) |
| Border | 2–3.5px, sering `stone-900/10–40` | **3px solid ink penuh** pada panel & kontrol; 2px pada elemen kecil |
| Shadow | `3.5px 3.5px 0` pada kartu/CTA | **Hard offset 4px/6px**, wajib pada panel aktif & tombol |
| Radius | `rounded-3xl` / `2xl` / `xl` | **`rounded-lg` (8px)** kontrol, **`rounded-xl` (12px)** panel; sel tabel 0 |
| Tipografi | Inter 16px, `leading-relaxed` | Inter **14–15px**, heading **800–900** rapat; label **Geist Mono** uppercase 12px |
| Warna | Tint kognitif lembut per subjek | **Blok warna datar jenuh** untuk status & aksi; tint subjek hanya sebagai garis/strip aksen |
| Layout | Asimetris, bento, editorial | **Grid tegas**: sidebar tetap + area kerja berpanel; densitas lebih tinggi |
| Motion | Spring halus, pill meluncur | **Mekanis**: tekan = bergeser ke bayangan; tanpa spring, tanpa Lenis |

Prinsip:

1. **Tegas, bukan berisik.** Border tebal + bayangan keras dipakai untuk hierarki (apa yang bisa diklik, apa yang aktif), bukan dekorasi. Satu halaman maksimal satu "sticker" dekoratif.
2. **Status selalu terbaca tanpa warna** — ikon + teks + warna (WCAG; sejalan dengan `design-frontend.md` §7.1).
3. **Warna subjek tetap bermakna.** Saat admin sedang mengedit materi Kimia, strip aksen memakai tema Kimia (Royal Lilac) dari `getSubjectTheme()` yang sama dengan frontend — admin selalu melihat "identitas" materi seperti yang akan dilihat pelajar.
4. **Tidak meniru produk lain.** Pertahankan identitas orisinal IVE-APP.

---

## 2. Akses, RBAC, & Jembatan Frontend ↔ CMS

### 2.1 Prinsip

- **Satu pintu login:** `/login` yang sama dipakai semua pengguna. **Tidak ada** `/admin/login`, tidak ada form "login sebagai admin".
- Setelah login, **semua pengguna mendarat di frontend publik** (`/` atau halaman asal). CMS bukan tujuan otomatis.
- Akses CMS ditentukan **role di server**, bukan oleh tombol yang terlihat. Menyembunyikan tombol bukan keamanan (AGENTS.md Bagian 20).
- Role **tidak pernah** dipilih pengguna saat registrasi dan tidak dibaca dari klien.

### 2.2 Role & matriks kemampuan

Enum `Role`: `USER | ADMIN | SUPER_ADMIN` (default `USER`). Menambah nilai enum adalah migrasi non-breaking (TAD §8.1) tetapi **TAD v2.0 saat ini hanya menyebut `USER | ADMIN`** → perubahan ini harus dicatat di TAD (lihat daftar penyesuaian AGENTS.md).

Semua pengecekan lewat `modules/authz` — `can(user, action, resource)`; **dilarang** `role === "ADMIN"` ad-hoc.

| Kemampuan (`action`) | USER | ADMIN | SUPER_ADMIN |
|---|---|---|---|
| `cms:access` (masuk `/admin/*`, melihat tombol Akses CMS) | — | ✅ | ✅ |
| `content:read` / `content:write` (subjek, topik, materi, soal, sumber) | — | ✅ | ✅ |
| `content:publish` / `unpublish` / `archive` | — | ✅ | ✅ |
| `sandbox:write` (Sandbox Studio, interactive library) | — | ✅ | ✅ |
| `media:upload` | — | ✅ | ✅ |
| `content:hard-delete` (hapus permanen) `[Perlu konfirmasi]` | — | — | ✅ |
| `user:manage-role` (ubah role pengguna) `[Perlu konfirmasi]` | — | — | ✅ |
| `system:settings` `[Perlu konfirmasi]` | — | — | ✅ |

Ketentuan:

- Pemberian role `ADMIN`/`SUPER_ADMIN` hanya lewat seed/ops atau oleh `SUPER_ADMIN`. Akun super admin pertama dibuat dari seed (`ADMIN_EMAIL` / `ADMIN_PASSWORD`), tidak pernah hardcode di source.
- `SUPER_ADMIN` **mencakup seluruh kemampuan** `ADMIN`. Pembeda hanya aksi sistem/destruktif/manajemen role. Daftar detail pembeda adalah usulan — jangan menambah kemampuan baru tanpa konfirmasi.
- Halaman `/admin/users` (manajemen role) **dicadangkan** untuk `SUPER_ADMIN`; jangan dibangun sebelum disetujui. Item sidebar-nya hanya dirender bila `can(user,'user:manage-role')` dan memiliki rute nyata.
- Perubahan role berlaku pada request berikutnya (jangan cache role di klien lebih dari masa sesi). Role diturunkan saat sesi aktif → request admin berikutnya ditolak dan pengguna diarahkan ke `/` dengan pesan.

### 2.3 Alur & Jembatan

```text
Pengguna login di /login ──► frontend publik (/)
        │
        ├─ role USER ............ tidak ada tombol CMS; /admin/* ditolak
        │
        └─ role ADMIN / SUPER_ADMIN
               │  header frontend menampilkan tombol "Akses CMS"
               ▼
           /admin (Dashboard CMS)
               │  topbar CMS menampilkan tombol "Lihat Public Site"
               ▼
           kembali ke frontend publik (/ atau halaman publik terkait)
```

#### A. Tombol **Akses CMS** (di frontend — satu-satunya perubahan shell publik)

- **Kondisi tampil:** `can(user, 'cms:access')`. Server mengirim **boolean `canAccessCms`**, bukan role mentah, ke komponen klien.
- **Lokasi desktop:** di klaster *Aksi Kanan* header (`design-frontend.md` §4.1), **sebelum** menu profil/avatar. **Bukan** item pill navigasi (ia aksi, bukan halaman) sehingga indikator sliding tidak terpengaruh.
- **Lokasi mobile:** di `MobileNav` drawer, grup teratas bagian akun, lebar penuh, target sentuh ≥ 44×44 px. Juga muncul sebagai item pertama di dropdown profil.
- **Label & ikon:** teks **"Akses CMS"** + ikon `LayoutDashboard` (satu library ikon yang sudah dipakai proyek). Di layar sempit boleh ikon saja **dengan** `aria-label="Akses CMS"` dan tooltip.
- **Gaya:** tombol neo-brutalis kecil (border 2px ink, hard shadow 3px, latar `--cms-highlight` kuning) agar jelas berbeda dari CTA cobalt pelajar namun serasi dengan kapsul biru. Tidak berkedip/berdenyut.
- **Aksi:** `<Link href="/admin">` (navigasi biasa; Ctrl/Cmd+klik membuka tab baru).
- **Performa:** halaman publik tidak boleh menjadi dinamis penuh hanya demi tombol ini. Render slot tombol sebagai komponen klien kecil yang membaca status sesi (endpoint `no-store` yang mengembalikan `{ authenticated, canAccessCms }`), dengan **slot lebar tetap** untuk mencegah layout shift. Tidak ada skeleton untuk tombol yang mungkin tidak muncul — slot kosong saja.
- **Guest & USER:** tombol tidak ada di DOM.

#### B. Guard rute `/admin/*` (server)

- Middleware/layout server memanggil `authz.can(user, 'cms:access')` pada **setiap** request `/admin/*` dan `/api/admin/*`.
- Belum login → redirect ke `/login?next=/admin/...` (halaman login biasa; setelah login, `next` hanya diikuti bila role mengizinkan, selain itu ke `/`).
- Login tetapi tidak berhak → tampilkan **404 atau halaman "Akses ditolak"** bergaya CMS (bukan stack trace) dengan tombol *Kembali ke Public Site*. `[Perlu konfirmasi: 404 vs 403 — default: 403 ramah agar admin yang salah akun paham sebabnya]`.
- Setiap mutasi admin tetap memeriksa izin spesifik (`content:write`, `content:publish`, …) di server.

#### C. Tombol **Lihat Public Site** (di CMS)

- **Lokasi:** topbar CMS, sisi kanan, selalu terlihat di semua halaman admin (desktop & mobile).
- **Label & ikon:** **"Lihat Public Site"** + ikon `ExternalLink`/`Globe`. Latar `--card` dengan border ink 3px dan hard shadow 4px (sekunder, bukan primary).
- **Tujuan kontekstual** (helper `getPublicUrl(context)`):

| Konteks CMS | Tujuan |
|---|---|
| Dashboard, daftar, halaman lain | `/` |
| Editor Materi `PUBLISHED` | URL publik materi: `/learn/:level/:subject/:topic/:lesson` |
| Editor Materi `DRAFT`/`ARCHIVED` | `/` + tooltip "Materi belum terbit — gunakan Pratinjau" (tombol *Pratinjau* terpisah memakai renderer publik) |
| Subjek / Topik `ACTIVE` | `/learn/:level/:subject` / `.../:topic` |
| Sandbox Studio dengan materi terpilih yang terbit | URL publik materi tersebut (anchor ke blok interaktif bila tersedia) |

- Navigasi biasa dalam tab yang sama (`<a>`); Ctrl/Cmd+klik/klik tengah membuka tab baru. Bila ada perubahan belum tersimpan → dialog konfirmasi ("Tinggalkan CMS? Perubahan belum disimpan akan hilang.") dengan aksi *Simpan Draft & Lihat*, *Tinggalkan*, *Batal*.
- Untuk pengguna `ADMIN`/`SUPER_ADMIN`, halaman publik tampil **persis seperti pelajar** (tanpa overlay admin), kecuali tombol *Akses CMS* di header.

#### D. Indikator identitas di CMS

Topbar menampilkan nama pengguna + **badge role** (`ADMIN` kuning, `SUPER ADMIN` merah muda/ink-on-pink — dengan teks, bukan warna saja), menu *Keluar*. Keluar mengembalikan ke `/` (publik, sebagai guest).

---

## 3. Token Desain CMS

CMS **mengonsumsi token frontend** dari `src/app/globals.css` (`--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--muted`, `--accent`, `--border`, `--ring`, `--destructive`, dst.) dan **menambah token khusus CMS** dengan awalan `--cms-*`. Dilarang membuat sistem token kedua atau warna hex acak di komponen.

### 3.1 Cakupan token

- Token CMS didefinisikan dalam scope `.cms-root` (dipasang di layout `/admin`), **bukan** di `:root`, agar tidak bocor ke frontend publik.
- Mode terang adalah default; mode gelap mengikuti kelas/mekanisme tema yang sudah dipakai frontend (paritas penuh, uji keduanya).

### 3.2 Token tambahan

| Token | Light | Dark | Kegunaan |
|---|---|---|---|
| `--cms-ink` | `#1E2024` | `#F4F1EA` | Warna border keras, teks tegas, bayangan offset |
| `--cms-shadow` | `#1E2024` | `rgba(244,241,234,.85)` | Warna hard shadow |
| `--cms-highlight` | `#FFD84D` | `#E6B800` | Aksi sorotan (Akses CMS, "BARU", fokus kerja) |
| `--cms-ok` | `#7BE0A4` | `#2F9E67` | Status *Published* / sukses |
| `--cms-warn` | `#FFD84D` | `#E6B800` | Status *Draft* / peringatan |
| `--cms-muted` | `#D9D4C7` | `#3A3F4B` | Status *Archived* / nonaktif |
| `--cms-danger` | `#FF6B6B` | `#EF4444` | Error, hapus, validasi gagal (selaras `--destructive`) |
| `--cms-info` | `#E5EFFE` | `#1E2B4D` | Info/konteks (selaras `--accent`) |
| `--cms-role-super` | `#FFB3D1` | `#C2477F` | Badge `SUPER ADMIN` |

Teks di atas blok warna datar selalu `--cms-ink` pekat (hindari teks putih di atas pastel — `design-frontend.md` §7.1).

### 3.3 Border, bayangan, radius, jarak

```css
.cms-root {
  --cms-border-w: 3px;           /* panel, kontrol utama */
  --cms-border-w-sm: 2px;        /* elemen kecil, badge */
  --cms-shadow-sm: 2px 2px 0 0 var(--cms-shadow);
  --cms-shadow-md: 4px 4px 0 0 var(--cms-shadow);
  --cms-shadow-lg: 6px 6px 0 0 var(--cms-shadow);
  --cms-radius-control: 8px;
  --cms-radius-panel: 12px;
}
```

- **Interaksi tekan:** `hover` → bayangan mengecil satu tingkat; `active` → `transform: translate(3px,3px)` + `box-shadow: 0 0 0 0` (tombol "tenggelam" ke bayangannya). Durasi 80–120 ms, linear/ease-out. Tidak ada spring.
- **Fokus keyboard:** `outline: 3px solid var(--ring); outline-offset: 2px` **selain** border/bayangan. Border tebal **bukan pengganti** focus ring.
- **Spacing:** skala 4/8 px; area kerja `max-w` lebar (tidak dibatasi `max-w-3xl` seperti teks publik), tetapi teks panjang di editor tetap ≤ 75 karakter per baris.

### 3.4 Tipografi

- Font: **Inter** (sama dengan frontend, `font-feature-settings: "cv02","cv03","cv04","cv11"`) dan **Geist Mono** untuk label teknis, slug, ID, nilai numerik, kunci komponen.
- Skala: Judul halaman 28–32px / 900; judul panel 18–20px / 800; body 14–15px; label mono uppercase 12px dengan `tracking-wider`; keterangan 13px minimum. Jangan di bawah 12px.
- Tombol & input: tinggi minimum **44px** (target sentuh), teks 15px.

---

## 4. Shell & Layout CMS

### 4.1 Struktur

```text
┌────────────┬──────────────────────────────────────────────────────┐
│  SIDEBAR   │ TOPBAR: breadcrumb · [Lihat Public Site] · tema · user │
│  264px     ├──────────────────────────────────────────────────────┤
│  border-r  │ AREA KERJA (page header + konten berpanel)            │
│  3px ink   │                                                      │
└────────────┴──────────────────────────────────────────────────────┘
```

- **Sidebar (desktop ≥1024px):** logo/wordmark **IVE-APP** + label mono `CMS`; grup bernama dengan eyebrow mono:
  - **KONTEN:** Dashboard · Mata Pelajaran · Topik · Materi · Bank Soal · Sumber
  - **INTERAKTIF:** **Sandbox Interaktif** (Bagian 7)
  - **SISTEM** (hanya jika `SUPER_ADMIN` dan rute nyata ada): Pengguna & Role
  - Item aktif: blok `--primary` teks putih + hard shadow + ikon; item non-aktif: transparan, border muncul saat hover. Badge hitungan (mis. "Materi tanpa sumber: 3") hanya bila data nyata.
- **Topbar:** breadcrumb (Beranda CMS → … ), **Lihat Public Site** (Bagian 2.3C), toggle tema, menu pengguna dengan badge role.
- **Tablet (768–1023px):** sidebar menjadi rail ikon yang bisa dibuka (drawer) dengan overlay; **mobile (<768px):** drawer penuh + topbar ringkas. CMS *desktop-first*, tetapi seluruh fungsi utama harus tetap dapat dioperasikan di tablet; editor blok & Sandbox Studio boleh menampilkan ajakan memakai layar lebih lebar di mobile **tanpa** menyembunyikan data.
- **Scroll:** CMS **tidak memakai Lenis** (`smooth-scroll-provider.tsx` dipasang di shell publik saja). Panel dengan scroll internal memakai `overflow-auto` + `data-lenis-prevent` bila provider terlanjur aktif di layout induk.

### 4.2 Template halaman

1. **Daftar** (Subjek, Topik, Materi, Soal, Sumber): page header (judul + deskripsi + aksi utama *Tambah …*), toolbar filter/search, tabel keras (header berlatar `--secondary`, garis 2px, baris hover berlatar `--accent`), pagination; di mobile tabel menjadi kartu bertumpuk.
2. **Editor** (Materi, Soal): top bar editor (judul, status badge, *Pratinjau*, *Simpan Draft*, *Publish*), tiga panel (Bagian 6).
3. **Studio** (Sandbox Interaktif): tiga zona (Bagian 7).
4. **Dashboard:** kartu statistik dari data nyata (jumlah subjek/topik/materi/eksperimen/soal, materi terbit, draft, **materi tanpa sumber**, **materi tanpa sandbox**), daftar materi terbaru. Tidak ada angka palsu.

---

## 5. Komponen CMS

Gunakan komponen shadcn/ui yang sudah ada sebagai basis dan **restyle lewat token CMS** (varian `cms`), bukan membuat duplikat.

| Komponen | Spesifikasi neo-brutalis |
|---|---|
| **Button** | Primary: `--primary` + teks putih + border 3px ink + shadow-md. Secondary: `--card` + border ink. Highlight: `--cms-highlight`. Destructive: `--cms-danger` + ikon + teks. Ghost: tanpa border sampai hover. Radius 8px. Semua punya state default/hover/active/focus-visible/disabled/loading. |
| **Input / Textarea / Select** | Border 3px ink, latar `--card`, shadow-sm saat fokus, label di atas (tidak hanya placeholder), pesan error di bawah dengan ikon + teks, `aria-describedby`. |
| **Badge status** | Border 2px ink, radius 6px, ikon + teks: `DRAFT` (kuning, ikon `PencilLine`), `PUBLISHED` (hijau, `CheckCircle2`), `ARCHIVED` (abu, `Archive`), `BARU` (highlight). Tidak mengandalkan warna saja. |
| **Panel / Card** | Latar `--card`, border 3px ink, radius 12px, shadow-md. Header panel dengan eyebrow mono. Panel konteks subjek memakai strip kiri 6px dari `theme.cardBorder`/warna merek subjek. |
| **Tabel** | Header mono uppercase; kolom status memakai Badge; aksi baris di menu `…` dengan label aksesibel. |
| **Dialog konfirmasi** | Wajib untuk: arsip, hapus, unpublish, publish ke materi yang sudah terbit, keluar dengan perubahan belum tersimpan. Judul menyebut objek ("Arsipkan *Reaksi Redoks*?"), menjelaskan dampak ke **Public Site**, tombol destruktif terpisah dari *Batal*. Fokus awal pada *Batal*. |
| **Toast / Alert inline** | Sukses: hijau + `CheckCircle2`; error: merah + `XCircle`; `aria-live="polite"` (error `assertive`). Jangan menampilkan pesan error internal/stack. |
| **Empty state** | Ilustrasi sederhana + penjelasan + CTA relevan ("Tambah Materi"). Tidak boleh tampil kosong tanpa arahan. |
| **Error state** | "Ups, ada sedikit gangguan." + *Coba lagi*; bila DB tidak tersedia, jelaskan bahwa CMS tidak dapat membaca/menulis data (Bagian 8.5). |
| **Skeleton** | Berbentuk sama dengan konten akhir (baris tabel, panel), hard border, tanpa shimmer berlebihan. |
| **Stepper/Checklist publish** | Daftar syarat (sumber ≥1, `alt` gambar, konfigurasi valid, fallback teks) dengan ikon status + teks; syarat gagal menautkan ke bagian yang bermasalah. |
| **Combobox bertingkat** | Dipakai untuk pemilih materi (Bagian 7.3): pencarian, grup per mata pelajaran dengan titik warna tema, navigasi keyboard penuh. |

Aturan: ikon dari satu library saja; tidak ada emoji sebagai ikon UI; komponen tidak bergantung pada hover.

---

## 6. Halaman CMS & Editor Materi

### 6.1 Peta halaman

| Rute | Akses | Isi | Rujukan |
|---|---|---|---|
| `/admin` → `/admin/dashboard` | `cms:access` | Ringkasan nyata | TAD §12.1 |
| `/admin/subjects` | `content:write` | CRUD Mata Pelajaran + pratinjau tema | TAD §12.2 |
| `/admin/topics` | `content:write` | CRUD Topik, urutan | TAD §12.2 |
| `/admin/lessons` (+ `/new`, `/[id]`) | `content:write` | Daftar & editor blok Materi; `kind` LESSON/EXPERIMENT | TAD §12.2 |
| `/admin/questions` | `content:write` | Bank soal per topik (opsional pin materi) | TAD §12.2 |
| `/admin/sources` | `content:write` | CRUD Sumber & penautan | TAD §13 |
| `/admin/interactive` | `sandbox:write` | **Sandbox Studio** + Interactive Library | Bagian 7 |
| `/admin/users` | `user:manage-role` | **Dicadangkan** `[Perlu konfirmasi]` | Bagian 2.2 |

Rute di luar TAD (`/admin/users`) memerlukan persetujuan sebelum dibangun.

### 6.2 Editor Materi (tiga panel, PRD FR-16)

- **Kiri — Block Library:** tipe blok yang didukung (`heading`, `text`, `image`, `video`, `formula`, `callout`, `example`, `realworld`, `interactive`, `quiz`, `divider`) sebagai tombol bertepi tebal.
- **Tengah — Content Canvas:** blok terurut (drag + tombol naik/turun untuk aksesibilitas), tiap blok berbingkai; kartu blok menampilkan jenis (eyebrow mono) dan ringkasan.
- **Kanan — Properties Inspector:** form blok terpilih. Untuk blok `interactive`, form **dibangkitkan dari `configSchema` registry** + pratinjau langsung (komponen publik).
- **Top bar editor:** judul, **badge status**, *Pratinjau* (renderer publik + tema subjek), *Simpan Draft*, *Publish* (membuka checklist), *Lihat Public Site* (kontekstual, Bagian 2.3C).
- **Pratinjau = `LessonContentRenderer` yang sama** dengan frontend, dibungkus latar `theme.bgTint` subjek agar identik dengan halaman publik (`design-frontend.md` §6.1). Pratinjau materi tak terbit hanya untuk pengguna berizin.
- Autosave hanya menyimpan draft, **tidak pernah mempublikasikan**.
- Gerbang publish keras (TAD §12.5): judul/slug valid; level-subjek-topik aktif; deskripsi; blok valid (Zod); konfigurasi interaktif valid; **≥1 sumber**; semua gambar punya `alt`. Gagal → pesan jelas + tautan ke bagian terkait.

---

## 7. Sandbox Interaktif (Sandbox Studio)

Menu **Sandbox Interaktif** adalah tempat admin membuat komponen interaktif untuk sebuah materi. Prinsip utamanya: **tidak pernah kosong** — selalu terisi dari materi yang ada.

### 7.1 Tujuan & batas

- Admin memilih **materi** (dari DB), lalu membangun sandbox untuk materi itu.
- Hasil akhir **hanya** berupa blok `interactive` `{ component, config }` yang tervalidasi `configSchema` di dalam `Lesson.contentBlocks` (TAD §11.1, §8.6). Tidak ada kode yang disimpan atau dijalankan.
- Pembangun awal memakai komponen `formula-sandbox` (TAD §11.6) — evaluator ekspresi terbatas, allowlist operator/fungsi, tanpa `eval`/`new Function`. Komponen tipe B/C (Projectile, Trigonometri, Cell/Atom Explorer, Timeline) tetap dipilih dari registry dan dikonfigurasi lewat form (bukan dibuat ulang di CMS).
- **Desain GUI pembangun visual akan dilanjutkan terpisah.** Dokumen ini mendefinisikan *shell*, data, kontrak, dan fase GUI (Bagian 7.6) sehingga GUI lanjutan dapat dipasang tanpa refactor.

### 7.2 Layout Studio (tiga zona)

```text
┌────────────────┬───────────────────────────────────┬────────────────┐
│ A. PEMILIH     │ B. WORKSPACE STUDIO               │ C. KONTEKS     │
│ MATERI         │  header: Kimia / Redoks /         │  MATERI        │
│ (dari DB)      │          Reaksi Redoks  [status]  │  deskripsi     │
│ cari · filter  │  mode: Template ▾                 │  kata kunci    │
│ grup per       │  ─ builder (GUI) ─                │  rumus di      │
│ mata pelajaran │  ─ validasi · fallback teks ─     │  materi        │
│ ● Kimia        │  ─ PRATINJAU LANGSUNG ─           │  sumber        │
│   Reaksi Redoks│  [Simpan Draft] [Sisipkan ke      │  sandbox yang  │
│   [BARU]       │   Materi]                         │  sudah ada     │
└────────────────┴───────────────────────────────────┴────────────────┘
```

Responsif: A menjadi combobox/sheet di atas B pada tablet; C menjadi panel lipat di bawah B.

### 7.3 Zona A — Pemilih Materi (terisi otomatis dari DB)

- **Sumber data:** query ke service materi (bukan konstanta). Contoh kontrak: `GET /api/admin/interactive/lessons` → daftar ringkas:

```ts
type StudioLessonSummary = {
  id: string; slug: string; title: string; kind: "LESSON" | "EXPERIMENT";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  subject: { id: string; name: string; slug: string };   // tema via getSubjectTheme(slug)
  topic:   { id: string; name: string; slug: string };
  interactiveBlockCount: number;       // jumlah blok interactive yang sudah ada
  hasFormulaBlock: boolean;            // ada blok formula di materi
  createdAt: string; updatedAt: string;
};
```

- **Cakupan:** semua materi `DRAFT` dan `PUBLISHED` (materi yang baru ditambahkan biasanya masih draft); `ARCHIVED` disembunyikan (toggle *Tampilkan arsip*). Dibatasi level aktif.
- **Tampilan:** dikelompokkan per **Mata Pelajaran** (titik warna + ikon dari `getSubjectTheme(slug)`), lalu Topik, lalu Materi. Setiap baris: judul, badge status, badge `BARU` (dibuat ≤ 7 hari `[Perlu konfirmasi: ambang]`), badge `SANDBOX n` bila `interactiveBlockCount > 0`, atau `BELUM ADA SANDBOX`.
- **Filter:** mata pelajaran, status, jenis (Materi/Eksperimen), "Belum punya sandbox", pencarian teks (judul/kata kunci). Dapat dikombinasikan.
- **Pemilih bertingkat (field "Materi"):** combobox yang menampilkan jalur `Kimia / Redoks / Reaksi Redoks`. Contoh skenario wajib berfungsi: begitu admin menambahkan materi **Kimia → Reaksi Redoks** di menu *Materi* (bahkan sebagai draft), materi itu **langsung muncul** di daftar ini dan di field *Materi* tanpa restart, seed, atau deploy.
- **Deep link:** `/admin/interactive?lesson=<id>` membuka Studio langsung pada materi tertentu (dipakai tombol *Buat Sandbox* di editor materi dan daftar materi).
- Tidak ada pilihan palsu: bila belum ada materi → empty state (Bagian 7.7).

### 7.4 Zona C — Konteks Materi (diisi dari materi terpilih)

Panel baca-saja yang menunjukkan hal-hal nyata dari materi: judul, subjek/topik (dengan strip tema), deskripsi, kata kunci, tingkat kesulitan, **daftar blok `formula` yang ditemukan** (LaTeX terformat KaTeX) sebagai *Saran dasar rumus*, sumber yang tertaut, dan sandbox yang sudah ada (jumlah + posisi blok).

- Tombol **"Gunakan sebagai dasar"** pada rumus yang ditemukan menyalin ekspresi ke builder sebagai **usulan yang harus ditinjau** admin; tidak ada pengisian otomatis yang langsung disimpan.
- Peringatan konteks: materi tanpa sumber → "Materi belum memiliki sumber — tidak dapat dipublikasikan" (tautan ke editor).

### 7.5 Zona B — Workspace Studio & Binding ke Materi

- **Header:** jalur materi + badge status + strip tema subjek.
- **Mode/Template:** pilihan komponen dari registry (`formula-sandbox` default; komponen lain dikonfigurasi lewat form). Daftar bersumber dari registry (`title`, `description`, `subjectHints` — **disorot** bila `subjectHints` cocok dengan subjek materi, mis. Kimia).
- **Builder:** area GUI (Bagian 7.6).
- **Validasi langsung:** panel menampilkan error `configSchema` & evaluator (variabel tak terdefinisi, rentang tak masuk akal, pembagian nol, ekspresi di luar allowlist) dengan ikon + teks. Tombol simpan nonaktif hingga valid.
- **Fallback teks wajib:** field *Penjelasan teks/fallback* (mengisi `textFallback`) tidak boleh kosong untuk disisipkan.
- **Pratinjau langsung:** komponen **publik** yang sama (`formula-sandbox`) dengan konfigurasi saat ini, di dalam bingkai bertema subjek, dengan kontrol *Reset* dan *Layar penuh* — apa yang dilihat admin = apa yang dilihat pelajar.
- **Aksi:**
  - **Simpan Draft Sandbox** — menyimpan draf studio (belum menyentuh materi).
  - **Sisipkan ke Materi** — membuat/memperbarui blok `interactive` pada materi terpilih; admin memilih posisi ("setelah blok …", default: sebelum bagian latihan/soal bila ada). Blok memiliki `id` stabil sehingga pengeditan ulang **memperbarui**, bukan menggandakan.
  - **Buka Pratinjau Materi** dan **Lihat Public Site** (kontekstual).
- **Dampak ke Public Site:** jika materi `PUBLISHED`, *Sisipkan ke Materi* mengubah halaman publik. Tampilkan dialog: "Perubahan ini langsung tampil di Public Site." dengan pilihan *Terapkan*, *Simpan sebagai draft studio saja*, *Batal*. `[Perlu konfirmasi: model draf untuk materi terbit — default: terapkan langsung setelah konfirmasi karena TAD tidak mendefinisikan versi]`.
- **Eksperimen/Lab:** opsi *"Tampilkan juga di Lab Simulasi"* menautkan sandbox ke entri `EXPERIMENT` (TAD §4, `/lab`). `[Perlu konfirmasi: membuat EXPERIMENT baru vs. menandai materi]` — jangan implementasikan tanpa keputusan; sementara, `/lab` mengambil materi `kind = EXPERIMENT` yang terbit.

### 7.6 Fase GUI Builder (didesain lanjutan)

Agar tidak ada UI palsu (AGENTS.md "No dead UI") sekaligus tidak mengunci desain GUI:

| Fase | Isi builder | Status |
|---|---|---|
| **v0 — Form tervalidasi** | Form yang **dibangkitkan otomatis dari `configSchema`** + `defaultConfig` (TAD §12.3): variabel (nama, label, satuan, min, max, step, default), keluaran (ekspresi), visualisasi (pembacaan nilai / garis / sebar), penjelasan, fallback teks. Fungsional penuh. | **Dibangun sekarang** |
| **v1 — GUI visual** | Pembangun visual (drag variabel, kanvas rumus, pilihan bentuk visual sesuai `design`/PRD FR-07.3, template per subjek). | **Didesain lanjutan** — dokumen terpisah |

Kontrak yang harus dihormati v1 (agar bisa dipasang tanpa refactor):

1. Builder adalah komponen yang menerima `{ lesson: StudioLessonSummary, value: SandboxDraft, onChange }` dan **hanya** menghasilkan JSON yang lolos `configSchema`.
2. Slot UI stabil (id): `variables`, `outputs`, `visualization`, `explanation`, `fallback`, `preview` — v0 dan v1 mengisi slot yang sama.
3. Evaluator ekspresi, validasi, pratinjau, penyimpanan, dan penyisipan blok **dipakai bersama** v0/v1 (tidak diduplikasi).
4. Tidak ada kode bebas; keluaran berupa data.

Saran awal bentuk visual per konsep (mis. Kimia/Redoks: pembacaan nilai + indikator/skala; fungsi y=f(x): garis) mengikuti PRD FR-07.3 dan tetap dipilih manual oleh admin.

### 7.7 State Studio

| State | Perilaku |
|---|---|
| Belum ada materi | Empty state: "Belum ada materi. Tambahkan materi dulu untuk membuat sandbox." + CTA *Tambah Materi* (`/admin/lessons/new`). Bukan kolom kosong. |
| Memuat | Skeleton tiga zona. |
| Error baca | "Ups, ada sedikit gangguan." + *Coba lagi*; bila DB mati, jelaskan CMS tidak dapat membaca data (tanpa fallback dummy). |
| Tanpa izin | Halaman akses ditolak (Bagian 2.3B). |
| Materi dipilih tanpa sumber | Peringatan + tetap dapat menyimpan draf; tidak dapat mempublikasikan materi. |
| Perubahan belum tersimpan | Dialog konfirmasi saat pindah materi atau menekan *Lihat Public Site*. |
| Konflik (materi diubah di tab lain) | Deteksi versi/`updatedAt`; tawarkan muat ulang; jangan menimpa diam-diam. |

### 7.8 Interactive Library

Di dalam menu yang sama, tab **Pustaka Komponen** menampilkan komponen terdaftar (title, description, key, `subjectHints`) dengan sandbox pratinjau — baca-saja, bersumber dari registry (TAD §12.3).

---

## 8. Integrasi Data: CMS ↔ Database ↔ Frontend

### 8.1 Prinsip

1. **Satu sumber kebenaran: database.** CMS menulis lewat service domain; frontend membaca lewat service yang sama (bukan query terpisah).
2. **Satu renderer.** Pratinjau CMS dan halaman publik memakai `LessonContentRenderer`.
3. **Tidak ada nilai ganda.** Daftar subjek/topik/materi, tema, dan pilihan komponen diambil dari DB/registry — dilarang menyalin ke konstanta CMS.
4. **Semua mutasi CMS membuat frontend segar** (invalidasi cache, Bagian 8.4).

### 8.2 Peta field CMS → DB → konsumen frontend

| Halaman CMS · field | DB (Prisma) | Tampil di frontend |
|---|---|---|
| Mata Pelajaran · nama, slug, deskripsi, ikon, cover, urutan, status | `Subject.*` | Bento "Identitas Visual & Keilmuan" (`design-frontend` §5.2), `/explore`, mega menu, breadcrumb (§6.1), tema via slug |
| Topik · nama, slug, subjek, deskripsi, urutan, status | `Topic.*` | Halaman topik, outline tree, mega menu |
| Materi · judul, slug, deskripsi, kesulitan, estimasi menit, thumbnail, kata kunci, `kind`, urutan, status | `Lesson.*` | Kartu materi, header halaman materi, pencarian, `/lab` (`kind = EXPERIMENT`) |
| Materi · blok konten | `Lesson.contentBlocks` (JSON) | `LessonContentRenderer` di halaman materi |
| Materi · sumber | `Source` + `LessonSource` | Bagian **"Sumber"** di bawah materi (§6.1 poin 3) |
| Bank Soal | `Question` | `/quiz/:lesson` (kunci jawaban hanya di server) |
| Sandbox Studio · komponen + konfigurasi | Blok `interactive` di `Lesson.contentBlocks` | Blok interaktif di halaman materi; kartu di Lab |
| Pengguna · role | `User.role` | Tombol *Akses CMS* (`canAccessCms`) |

Bagian beranda yang **harus berasal dari data** (bukan teks tetap): daftar/hitungan subjek, kartu materi pilihan, kartu Lab Simulasi. Aturan turunan tanpa kolom baru: *Lab Simulasi* = materi terbit `kind = EXPERIMENT` urut `order`; *Grid Materi Interaktif* = materi terbit yang memuat blok `interactive`, urut `order`/`updatedAt`. Teks marketing statis (headline hero, teaser rumus pada bento) boleh tetap di kode.

### 8.3 Integrasi tema subjek

- Frontend memetakan slug → tema lewat `getSubjectTheme(slug)` / `SUBJECT_THEMES` (`src/components/ui/subject-theme.tsx`): Matematika (Soft Cobalt), Fisika (Cyan Azure), Kimia (Royal Lilac), Biologi (Sage Emerald), General Knowledge (Warm Solar Amber).
- Form Mata Pelajaran menampilkan **pratinjau tema hasil `getSubjectTheme(slug)`** secara langsung. Slug yang tidak dikenali → tema *fallback* + peringatan "Slug ini belum punya tema warna; ia akan memakai tema bawaan."
- Jangan menambah warna per-subjek di CMS. Usulan `themeKey` pada `Subject` (agar tema tidak bergantung pada slug) adalah perubahan skema → `[Perlu konfirmasi]`; sampai disetujui, tema diturunkan dari slug.

### 8.4 Cache & kesegaran

- Setiap mutasi CMS (buat/ubah/publish/unpublish/arsip, sandbox sisip) **menginvalidasi** cache yang dikonsumsi frontend memakai mekanisme yang sudah ada di repo; jika belum ada, gunakan `revalidateTag`/`revalidatePath` dengan tag terdokumentasi (mis. `subjects`, `topics`, `lessons`, `lesson:<slug>`, `lab`, `search`).
- Publikasi berjalan dalam transaksi (validasi + status + `publishedAt` + pemicu invalidasi) — TAD §9.
- Pencarian publik hanya berisi materi `PUBLISHED` pada level aktif; unpublish/arsip harus hilang dari pencarian, Lab, kartu, dan sitemap.

### 8.5 Aturan `dummy-data.ts` (penting)

`design-frontend.md` §7.2 membolehkan service frontend jatuh ke `src/data/dummy-data.ts` saat PostgreSQL mati. Konsekuensi untuk CMS:

1. **CMS tidak pernah membaca atau menulis `dummy-data.ts`.** DB tidak tersedia → tampilkan error state CMS yang jelas; jangan menampilkan data contoh seolah data produksi.
2. Slug/ID materi buatan CMS tidak boleh bergantung pada keberadaan data dummy.
3. Uji integrasi round-trip **harus berjalan dengan DB hidup** dan memverifikasi frontend menampilkan **data CMS**, bukan dummy (mis. menggunakan judul unik uji).
4. Disarankan (konfirmasi) menampilkan indikator "Mode data contoh (offline)" di frontend saat fallback aktif, agar masalah integrasi tidak tersamar.

### 8.6 Uji round-trip wajib (CMS ↔ Frontend)

| ID | Skenario | Hasil yang diverifikasi |
|---|---|---|
| RT-1 | Buat subjek baru dengan slug bertema (mis. `kimia`) lalu slug tanpa tema | Muncul di `/explore` & mega menu; tema sesuai `getSubjectTheme`; slug tanpa tema → fallback + peringatan CMS |
| RT-2 | Buat Topik + Materi **Kimia / Reaksi Redoks** (draft) lalu publish | Draft tidak tampil di publik; setelah publish tampil di `/learn/umum/kimia/.../reaksi-redoks` dengan tint Kimia, breadcrumb, bagian Sumber |
| RT-3 | Buka **Sandbox Interaktif** setelah RT-2 | Materi Reaksi Redoks **otomatis ada** di Zona A & field *Materi* (tanpa restart); pilih → buat sandbox → *Sisipkan ke Materi* → halaman publik menampilkan sandbox yang berfungsi + fallback teks |
| RT-4 | Ubah sandbox yang sudah disisipkan | Blok diperbarui (bukan duplikat); publik berubah |
| RT-5 | Unpublish/arsip materi | Hilang dari publik, pencarian, Lab; Zona A menyembunyikan arsip |
| RT-6 | Publish tanpa sumber | Ditolak dengan pesan jelas; setelah menambah sumber, berhasil |
| RT-7 | RBAC | USER: tak ada tombol & `/admin` ditolak. ADMIN & SUPER_ADMIN: tombol *Akses CMS* terlihat → CMS → *Lihat Public Site* kembali. Role diturunkan → request admin berikutnya ditolak |
| RT-8 | DB mati | CMS menampilkan error (tanpa dummy); frontend memakai fallback sesuai desain |

---

## 9. Aksesibilitas, Responsivitas, Motion

- **Kontras:** AA minimum (target AAA untuk teks utama); teks ink pekat di atas blok warna datar.
- **Keyboard:** semua aksi dapat dijangkau; fokus selalu terlihat (ring 3px, Bagian 3.3); *skip link* ke area kerja; dialog memerangkap fokus dan mengembalikannya.
- **Status & error bukan hanya warna** (ikon + teks); `aria-live` untuk toast, hasil validasi, dan perubahan status.
- **Target sentuh** ≥ 44×44 px; tabel mobile menjadi kartu.
- **Uji viewport:** 768, 1024, 1280, 1440 (CMS desktop-first; mobile 390 diuji untuk fungsi inti: login→Akses CMS→dashboard, daftar, Lihat Public Site).
- **Motion:** hanya umpan balik (tekan tombol, buka dialog, toast); 80–150 ms; hormati `prefers-reduced-motion`. Tanpa Lenis, parallax, atau animasi dekoratif. Framer Motion hanya bila sudah dipakai dan CSS tidak cukup.
- **Performa:** daftar dipaginasi; Sandbox Studio memuat komponen pratinjau secara *lazy*; jangan mengunduh seluruh blok semua materi ke Zona A (ringkasan saja).

---

## 10. Kontrak Perilaku Agen (Mode C)

1. **Baca dulu:** `AGENTS.md`, dokumen ini, `design-frontend.md` (token & tema), TAD §8, §11–§13, §20–§21, PRD FR-07, FR-16, FR-19.
2. **Audit sebelum mengubah:** rute `/admin/*`, komponen CMS, service materi/subjek, registry interaktif, `subject-theme.tsx`, mekanisme auth/session, kebijakan cache.
3. **Satu sumber token:** pakai `globals.css` + token `--cms-*` (scoped `.cms-root`). Tidak ada hex acak.
4. **Server-side authz untuk semua:** `authz.can`; Zod pada semua batas; tidak ada kode bebas.
5. **Tidak ada UI palsu:** tombol/menu harus berfungsi; item sidebar tanpa rute nyata tidak dirender.
6. **Jangan menyentuh halaman publik** selain tombol *Akses CMS* (Bagian 2.3A) dan helper sesi/guard yang diperlukannya.
7. **Pastikan round-trip RT-1…RT-8** lulus sebelum melapor selesai; dokumentasikan yang tidak bisa diuji.
8. **Validasi:** jalankan `npm run typecheck`, `npm run lint`, `npm run build` (0 error), plus tes unit/integrasi/E2E relevan.
9. **Laporan akhir:** halaman CMS yang diselesaikan, perubahan token/komponen, perubahan skema/role, hasil round-trip, hasil uji viewport/aksesibilitas, daftar `[Perlu konfirmasi]` yang dijumpai, dan konfirmasi bahwa halaman publik tidak diubah selain tombol jembatan.

---

## 11. Acceptance Criteria — Definition of Done CMS

### RBAC & jembatan
- [ ] Tidak ada rute/form login admin terpisah; `/login` tunggal.
- [ ] `ADMIN` dan `SUPER_ADMIN` melihat tombol **Akses CMS** di header (desktop & mobile); `USER`/guest tidak (tidak ada di DOM).
- [ ] `/admin/*` dan `/api/admin/*` diperiksa `authz.can` di server pada setiap request; role dari klien tidak dipercaya.
- [ ] Tombol **Lihat Public Site** ada di semua halaman CMS, kontekstual, dengan konfirmasi perubahan belum tersimpan.
- [ ] Penurunan/penghapusan role berlaku pada request berikutnya.

### Sandbox Studio
- [ ] Daftar materi terisi dari DB (grup per subjek, tema subjek), termasuk materi draft baru; contoh **Kimia / Reaksi Redoks** muncul otomatis.
- [ ] Field *Materi* dapat dipilih; konteks materi (deskripsi, kata kunci, rumus, sumber, sandbox existing) tampil.
- [ ] Builder v0 (form dari `configSchema`) berfungsi; validasi & fallback teks wajib; pratinjau memakai komponen publik.
- [ ] *Sisipkan ke Materi* membuat/memperbarui blok `interactive` (tanpa duplikasi) dan tampil di frontend.
- [ ] Tidak ada `eval`/kode bebas; evaluator punya unit test termasuk percobaan injeksi.

### Integrasi data
- [ ] Peta field (Bagian 8.2) terimplementasi; tidak ada daftar subjek/topik/materi yang di-hardcode di CMS.
- [ ] Tema subjek dari `getSubjectTheme`; slug tak dikenal → peringatan.
- [ ] Mutasi CMS menginvalidasi cache; perubahan terlihat di frontend tanpa deploy.
- [ ] CMS tidak menyentuh `dummy-data.ts`; round-trip diuji dengan DB hidup.
- [ ] RT-1…RT-8 lulus.

### Visual & kualitas
- [ ] Token `--cms-*` ter-scope di `.cms-root`; tidak bocor ke frontend; light & dark berfungsi.
- [ ] Border 3px, hard shadow, radius, tipografi sesuai Bagian 3; fokus keyboard jelas; status tidak hanya warna.
- [ ] Loading, empty, error, success, disabled, dan konfirmasi destruktif tersedia di semua halaman CMS.
- [ ] Tidak ada horizontal overflow tak disengaja pada 768–1440 px.
- [ ] `typecheck`, `lint`, `build` sukses; tidak ada perubahan tak terkait.

---

## 12. Keputusan Terbuka `[Perlu konfirmasi]`

| # | Pertanyaan | Default sementara |
|---|---|---|
| C-01 | Pembeda kemampuan `SUPER_ADMIN` vs `ADMIN` (hard-delete, kelola role, pengaturan sistem) | Seperti tabel Bagian 2.2 |
| C-02 | Bangun `/admin/users` untuk kelola role sekarang? | Tidak; dicadangkan |
| C-03 | Pengguna tak berhak membuka `/admin`: 403 ramah atau 404? | 403 ramah |
| C-04 | Menambahkan `SUPER_ADMIN` ke enum `Role` (perlu pembaruan TAD §8.1) | Ya (non-breaking) |
| C-05 | Kolom `themeKey` pada `Subject` | Tidak; tema dari slug |
| C-06 | Model draf sandbox untuk materi yang sudah terbit | Konfirmasi lalu terapkan langsung |
| C-07 | Tautan sandbox ke Lab (`EXPERIMENT`): buat entri baru atau tandai materi | Belum dibangun; Lab memakai materi `EXPERIMENT` terbit |
| C-08 | Ambang badge `BARU` | 7 hari |
| C-09 | Indikator "Mode data contoh" saat frontend memakai `dummy-data.ts` | Disarankan |
| C-10 | Provider video lokal (`design-frontend` §6.1) vs YouTube-only (TAD) — apakah CMS boleh mengunggah video lokal? | Tidak; CMS hanya YouTube. Renderer tetap mendukung aset lokal yang sudah ada |
