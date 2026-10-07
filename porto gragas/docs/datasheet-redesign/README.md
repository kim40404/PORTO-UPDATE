# Arsip: redesain "Component Datasheet" dan perbaikan yang tetap dipakai

Tanggal: 7 Oktober 2026. Desain yang aktif di `src/` adalah **desain asli** (Geist, Instrument Serif italic,
tema gelap dengan aksen oranye, figur ilmiah). Folder ini menyimpan seluruh hasil percobaan redesain
"datasheet komponen" yang sempat dibangun, dinilai, dan kemudian dibatalkan atas keputusan pemilik, supaya
tidak ada pekerjaan yang hilang dan bisa dipakai lagi kapan saja.

## 1. Yang tetap aktif di situs (dipakai oleh desain asli)

| Perbaikan | Di mana | Efek |
| --- | --- | --- |
| Overflow HP: kartu proyek selebar 442 px di viewport 390 px | `src/components/Work.tsx` baris grid `ul` memakai `grid-cols-[minmax(0,1fr)]` dan `li` memakai `min-w-0` | Lebar gulir HP = 390 px, tepi plate dan angka seperti "M 64" tidak terpotong lagi |
| Gambar dari raw GitHub | `scripts/build-assets.py` menyalin asli ke `public/images/*.webp` (maks 1600 px, varian 800 px), `src/data/asset-manifest.json` menyimpan dimensi, `src/data/assets.ts` memakai path lokal dan mengekspor `assetMeta` serta `srcSet()` | Situs tidak bergantung pada repo GitHub; 17 gambar = 1,28 MB total |
| Berat halaman | WebP di atas, build multi-file (plugin single-file dibuang), `three` dan `@types/three` yang tak pernah diimpor dihapus, vite 7.3.7 dan audit 0 kerentanan | Transfer desktop turun dari ±8,8 MB ke ±2,9 MB; JS/CSS/font dipisah dan bisa di-cache |
| Preview tautan dan deploy | `index.html` punya `og:image`, `twitter:image`, `public/og.png` (gaya desain asli), `public/robots.txt` | Dibagikan ke LinkedIn/WhatsApp tampil dengan kartu sendiri, bukan teks Arena |
| Dokumen kebenaran produk | `PRODUCT.md` di root | Fakta audiens, posisi, bukti, dan daftar kontradiksi data yang perlu diputuskan pemilik |

Baseline Lighthouse mobile desain asli setelah perbaikan di atas (build produksi, throttling simulasi):
performa 86, aksesibilitas 97, best practices 100, SEO 100; LCP 2,6 detik, TBT 340 ms, CLS 0,013.
Selisih ke angka datasheet (98/100/100/100) berasal dari preloader, GSAP, dan motion yang belum digerbang
di ponsel (lihat bagian 3, butir 3).

Catatan pemulihan: `src/` dan `index.html` dikembalikan byte demi byte dari cadangan sebelum redesain,
kecuali `src/data/assets.ts` (path lokal) dan satu baris grid di `Work.tsx`. Dependensi desain asli
(`gsap`, `lenis`, `clsx`, `tailwind-merge`, font Geist/Geist Mono/Instrument Serif) terpasang kembali.

## 2. Yang diarsipkan di folder ini (tidak dipakai, bisa dihidupkan lagi)

| File | Isi |
| --- | --- |
| `snapshot/src/` dan `snapshot/index.html` | Seluruh kode desain datasheet dalam keadaan lulus review. Untuk mencobanya lagi: salin `snapshot/src` ke `src` dan `snapshot/index.html` ke `index.html`, lalu `npm install @fontsource-variable/libre-franklin @fontsource/share-tech-mono` |
| `DESIGN.md` dan `design.json` | Sistem desain datasheet lengkap: token warna oklch, skala tipografi, bentuk, komponen, aturan |
| `direction-contract.md` | Kontrak arah: thesis, own-world, story, first viewport, interaksi tanda tangan, tata motion, enam "raise" dari penantang katalog |
| `seven-directions.md` | Tujuh kandidat dunia visual lain yang sempat disusun (Datasheet, Matriks Bertin, Perekam X-Y, Ulos Ragidup, Peta Kedalaman Belawan, Papan Hitung ISOTYPE, Scoreboard pasca-match) |
| `implementation-plan.md` | Rencana implementasi: token, primitif CSS, peta komponen, bentuk data, urutan kerja |
| `codebase-understanding.md` | Peta kode desain asli: arsitektur, tabel komponen, inventaris konten, baseline performa, 48 tanda template, daftar hal yang harus dipertahankan |
| `preview-desktop.png`, `preview-mobile.png`, `og-datasheet.png` | Tangkapan layar hasil akhir datasheet dan kartu preview tautannya |

Hasil penilaian datasheet sebelum dibatalkan: finish review impeccable berdisposisi **ship**;
Lighthouse mobile performa 98, aksesibilitas 100, best practices 100, SEO 100.

## 3. Kemajuan dan alat yang tetap berguna untuk desain asli

Temuan ini berasal dari audit yang sudah dijalankan dan belum diterapkan ke desain asli. Tidak ada yang
diubah tanpa keputusan pemilik.

1. **Kejujuran figur.** `FIGURES.md` sudah mencatat figur mana yang ilustratif, tetapi di halaman tidak ada
   tanda. Angka seperti "p95 42 ms", "1.2k req/min", skor "82", dan "1,182 pairs" (seharusnya 944 rows)
   tampil seolah terukur. Dalam arsip, `snapshot/src/data/content.ts` sudah memberi flag `illustrative: true`
   per figur dan `snapshot/src/components/ProjectVisual.tsx` sudah memperbaiki teks "1,182 pairs" serta
   label stack di figur `layers`. Keduanya bisa diporting ke desain asli tanpa mengubah tampilan.
2. **Figur generik yang dipakai ulang di proyek yang salah.** `growth` (kelembapan tanah) dipakai untuk
   Honey dan GrowMate, `rag` untuk FlyRank, `layers` berlabel "Claude · OpenAI" untuk proyek Llama.
   Saran: hapus dari daftar figur proyek tersebut atau beri label ilustratif.
3. **Motion di HP belum digerbang.** Sekitar 77 ScrollTrigger, scrub kata di Manifesto, counter, preloader
   3,2 detik, siklus ambient figur, loop `.spin`/`.ping`, dan marquee berjalan sama di ponsel. Saran murah:
   `gsap.matchMedia` untuk membatasi ke `(hover: hover) and (pointer: fine)`, dan hapus loop tak berujung.
4. **Gambar tanpa `width`/`height`.** `assetMeta` dan `srcSet()` di `src/data/assets.ts` sudah siap dipakai di
   `SearchDiscovery.tsx`, `AboutStage.tsx`, `Work.tsx`, dan `WritingSection.tsx` untuk mencegah layout shift.
5. **Kontradiksi data** yang tercatat di `PRODUCT.md`: IPK 3,78 vs 3,77; akhir masa konsultan Jun vs Feb 2026;
   backend CiteReady Ollama vs OpenAI; dataset 1.182 item vs 945 ke 944 baris; "10 proyek di GitHub" tetapi
   hanya 8 kartu bertautan; dua peran di CV (Exstore.id, Kemenkumham) tidak ada di situs.
6. **Alat verifikasi** yang dipakai dan bisa dijalankan lagi: `npx tsc --noEmit`, `npx vite build`,
   `npx lighthouse http://localhost:4173/ --form-factor=mobile` setelah `npx vite preview`, dan
   `python scripts/build-assets.py` bila ada gambar baru.

## 4. Skill yang dipakai dan perannya

- **superpowers** (brainstorming, systematic-debugging, verification-before-completion): alur kerja,
  klasifikasi tugas, diagnosis bug dengan bukti sebelum perbaikan.
- **ponytail**: memaksa solusi terpendek, misalnya menghapus dependensi tak terpakai dan membuang plugin
  single-file alih-alih menambah konfigurasi.
- **ui-ux-pro-max**: data palet, tipografi, dan checklist UX sebagai masukan, bukan keputusan.
- **impeccable**: `concept-seed` (dadu arah), surface brief, `detect` (0 temuan), finish reviewer (verdict),
  documenter (`DESIGN.md`), `embed-prompt` (provenance pada setiap raster di `public/`).
- **graphify** dan **understand-anything**: peta ketergantungan kode untuk menentukan inti otentik
  (`ClusterField.tsx`, `ProjectVisual.tsx`, `content.ts`) yang tidak boleh rusak.
- **Addy Osmani agent-skills** (frontend-ui-engineering, performance-optimization): standar komponen dan
  langkah ukur-dulu-baru-optimasi.
- **caveman** terpasang tetapi tidak dipakai; **archify** gagal dipasang (installer tidak mendukung
  pemasangan global).

## 5. Perubahan file di luar desain yang perlu diketahui

- `FIGURES.md` sempat diperbarui ke bahasa datasheet; sekarang dikembalikan ke versi asli bersama `src/`.
- `.impeccable/` (surface brief, cache hook) dipindahkan ke folder ini supaya hook desain tidak lagi
  menegakkan sistem datasheet pada desain asli.
- Folder `graphify-out/` (cache) dihapus.
