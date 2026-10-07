# Panduan Membaca Figure — Portofolio Kimsang Silalahi

Dokumen ini menjelaskan **cara membaca setiap figure** di situs: apa arti
setiap titik, garis, dan angka, serta bagaimana proyek di baliknya bekerja.

Semua figure digambar **dengan kode** (SVG + canvas), bukan gambar jadi —
jadi selalu tajam di layar apa pun dan ringan (≈260 KB gzip untuk seluruh
situs).

---

## 1. Bahasa Visual

Sejak Rev. 2026-10 situs berbentuk *datasheet komponen*: tinta di atas kertas
putih, dan setiap figure duduk di dalam **bingkai graticule** yang sama agar
bisa dibaca seragam:

| Elemen | Arti |
| --- | --- |
| **Bingkai graticule** | Satu figure = satu bukti visual; kotak kisi minor 10×8 seperti kertas grafik |
| **Header `Figure N.`** | `N` = nomor figure di lembar; di detail sheet memakai huruf (`2.a`, `2.b`, …) |
| **Baris "Conditions"** | Kondisi pengukuran: data apa, split apa, batasan apa |
| **Label monospace** | Hanya teks teknis: sumbu, satuan, nomor pin, readout |
| **Garis sumbu L** | Sumbu X dan Y seperti plot ilmiah |
| **Biru kobalt** | Sinyal terpenting: nilai target, klaster utama, kurva tipikal |
| **Abu-abu** | Garis pembanding: baseline, batas, elips sebaran |
| **Elips putus-putus** | Sebaran / ketidakpastian sebuah kelompok |
| **Crosshair `+`** | Centroid (titik pusat) sebuah klaster |
| **Bingkai putus-putus + tag ILLUSTRATIVE + watermark NOT TESTED** | Figure ilustratif: menunjukkan bentuk hasil, bukan pengukuran |

Aturan tunggal: **biru kobalt = lihat ini dulu; NOT TESTED = jangan kutip angkanya.**

---

## 2. Fig. 01 — Player Segmentation (Hero)

**Apa ini:** simulasi **K-Means yang berjalan langsung di browser**
(canvas 2D, bukan video), mewakili skripsi *Mobile Legends Player
Analytics*.

**Cara membaca:**

- **Titik** = sampel telemetri pemain. Sumbu X = KDA, sumbu Y = win rate.
- **Warna titik** = klaster hasil iterasi terakhir; oranye = klaster 1.
- **Crosshair `C1…C4`** = centroid tiap klaster.
- **Elips putus-putus** = sebaran klaster, dihitung dari kovariansnya
  (karena itu bentuknya bisa miring).
- **Panel bawah:**
  - `Iter` — jumlah iterasi yang sudah berjalan.
  - `Inertia` — rata-rata jarak kuadrat titik ke centroid-nya. Turun =
    pengelompokan makin padat.
  - `fitting → converged → reseed` — status mesin: menyesuaikan, stabil,
    lalu data diacak ulang dan proses dimulai lagi.

**Interaktif:** gerakkan kursor di atas plot — garis bantu menunjuk titik
terdekat dan menampilkan koordinat serta klasternya (`0.72, 0.41 → C2`).

**Cara kerja algoritmanya:** mulai dari 4 centroid acak, lalu ulangi:
(1) tiap titik di-assign ke centroid terdekat, (2) centroid digeser ke
rata-rata anggotanya, (3) berhenti saat centroid tidak bergerak lagi.
Skripsi membandingkan hasil ini dengan **DBSCAN**, yang tidak perlu
menentukan jumlah klaster di awal.

> Catatan: data pada Fig. 01 adalah **data sintetis** untuk demonstrasi
> algoritma. Data penelitian sebenarnya = 245 pemain asli dari Medan.

---

## 3. Figure Proyek

### Fig. 1 — CiteReady (AI search visibility auditor)
*Repo: [CiteReady](https://github.com/kim40404/CiteReady)*

- **1.a Gauge + bar** — lingkaran = blended GEO score (0–100); bar di bawah
  = skor per mesin AI (ChatGPT, Perplexity, AI Overviews).
- **1.b Pillars** — tiga pilar semantik yang benar-benar dinilai oleh
  model: **Authority** (kredibilitas penulis), **Fact Density** (kepadatan
  data & fakta), **Clarity** (ketegasan jawaban). Dijumlahkan menjadi
  blended score bersama skor teknis.
- **1.c Heatmap** — ilustrasi bagian teks mana yang "dibaca" model.

**Cara kerja:** FastAPI men-scrape halaman → cek struktur teknis
(H1, meta, JSON-LD) → **Llama 3.1 lokal via Ollama** melakukan pembedahan
semantik → keluar report card berisi prioritas perbaikan. Biaya inferensi
$0 karena model berjalan lokal; untuk produksi bisa dialihkan ke provider
cloud lewat proxy LiteLLM tanpa menulis ulang kode.

### Fig. 2 — LolosPCPM
*Repo: [lolos-pcpm-ai](https://github.com/kim40404/lolos-pcpm-ai)*

- **2.a Histogram** — sebaran skor tryout kandidat; bar oranye = di atas
  ambang kelulusan; garis melengkung = CDF (kumulatif).
- **2.b Flow** — alur skenario → evaluasi pada AI Policy Simulator.

**Cara kerja:** empat subsistem — Policy Simulator (menilai keputusan
makroekonomi pengguna terhadap literatur bank sentral), Interview Coach
(panel BEI & studi kasus yang adaptif), Dashboard Analitik (melacak *pace*
per soal + akurasi TPD), dan sistem kuota token AI harian di level
database.

> Platform edukasi independen. **Tidak berafiliasi** dengan Bank Indonesia.

### Fig. 3 — PDF Summarizer
*Repo: [PDF-SUMMARY](https://github.com/kim40404/PDF-SUMMARY)*

- **3.a Chunks** — buku dipecah menjadi blok 15 halaman (Pass 1), tiap blok
  diringkas memakai template ketat, lalu **Pass 2** membaca semua ringkasan
  itu untuk menulis executive overview + top 5 takeaways.
- **3.b Layers** — ekstraksi → chunk → template → meta-pass.

**Cara kerja:** PDFPlumber mengekstrak teks (melewati halaman kosong /
gambar), Llama 3.1 8B lewat Ollama memproses tiap chunk agar tidak kehabisan
context window. Output: `output/summary.md` lengkap dengan diagram
Mermaid.js dan tabel perbandingan. 100% offline, tanpa API berbayar.

### Fig. 4 — Telco Churn MLOps
*Repo: [mlops-churn-dicoding](https://github.com/kim40404/mlops-churn-dicoding)*

- **4.a Line chart** — presisi model selama 30 hari; garis putus oranye =
  ambang; lingkaran oranye = momen **data drift** terdeteksi dan alert
  Grafana menyala.
- **4.b SHAP** — bar menyebar dari garis tengah. Ke **kanan (oranye)** =
  fitur yang mendorong prediksi ke arah *churn* (mis. kontrak bulanan,
  tenure < 6 bulan). Ke **kiri** = fitur yang menahan pelanggan
  (mis. kontrak 2 tahun). Inilah transparansi di balik tiap prediksi.
- **4.c Layers** — tiga tingkat: training, serving, telemetry.

**Cara kerja:** dataset Telco berisi **7.043 pelanggan**, hanya ~26% yang
churn — sangat timpang. **SMOTE** menyeimbangkan data latih agar **XGBoost**
mengenali kelas minoritas; **CoxPHFitter** memperkirakan sisa tenure.
MLflow mencatat tiap eksperimen, FastAPI menyajikan model dalam Docker,
Prometheus + Grafana memantau, GitHub Actions menjalankan Flake8 + Pytest.
Output bisnisnya bukan sekadar label, tapi **estimasi kerugian pendapatan
(LTV)**.

### Fig. 5 — FlyRank Search Intelligence
*Repo: [flyrank-ml-internship-starter](https://github.com/kim40404/flyrank-ml-internship-starter)*

- **5.a Precision@k** — garis putus abu = baseline aturan manual; garis
  oranye = model terlatih. Jarak vertikal di k=50 = **lift ≈3×**
  (Precision@50 naik dari ≈0,24 ke ≈0,74).
- **5.b Flow** — prepare → baseline → train → evaluate → report.

**Cara kerja:** pipeline berjalan di atas data Google Search yang sudah
dianonimkan (~30 ribu halaman untuk starter; rilis penuh ~79 juta baris
diakses lewat DuckDB tanpa diunduh). Model (logistic regression, decision
tree, random forest) dilatih dengan **client-holdout split** supaya tidak
bocor antar klien, lalu menghasilkan antrean halaman mana yang harus
di-refresh lebih dulu.

> Hasilnya bersifat **observed / directional decision-support** — bukan
> klaim bahwa algoritma Google berhasil diprediksi.

### Fig. 6 — ID–EN Data Pipeline
*Repo: [id-en-data-pipeline](https://github.com/kim40404/id-en-data-pipeline)*

- **6.a Funnel** — ingest 945 baris → drop nulls → dedupe → validate →
  publish 944 baris. Angka oranye menandai **1 baris sampah** yang dibuang.
- **6.b Embedding** — titik solid = instruksi bahasa Indonesia, titik
  hollow = padanan Inggris, garis = pasangannya.
- **6.c Matrix** — sel diterima vs ditolak filter.

**Cara kerja:** "garbage in, garbage out" dicegah secara mekanis. Dataset
ditarik dari Hugging Face Hub, **Polars** (bukan pandas, karena
multi-threaded) membersihkan null dan duplikat, lalu *assertion* keras
memastikan nol null dan nol duplikat sebelum dataset dipublikasikan
kembali ke Hub.

### Fig. 7 — Mobile Legends Player Analytics
*Repo: [MobileLegendsUnique](https://github.com/kim40404/MobileLegendsUnique) · [Live app](https://mobilelegendsunique.up.railway.app/)*

- **7.a Clusters** — scatter K-Means vs DBSCAN pada k=3.
- **7.b Dendrogram** — pohon hierarkis (Ward linkage). Dibaca dari bawah:
  pemain `P01…P12` menyatu jadi cabang. **Garis putus oranye "cut → k = 3"**
  memotong pohon tepat di level yang menghasilkan 3 klaster — inilah alasan
  visual kenapa k=3 dipilih.
- **7.c Radar** — profil peran tiap klaster pada 6 sumbu (KDA, GPM, Win%,
  Damage, Vision, Teamfight). Bandingkan bentuk poligonnya untuk melihat
  "persona" tiap kelompok.
- **7.d Validation** — 8 metrik validasi berdampingan: Silhouette,
  Calinski-Harabasz, Davies-Bouldin, ANOVA F-test, Kruskal-Wallis,
  CV stability, feature-importance F-ratio, inter-cluster distance.

**Cara kerja:** aplikasi Flask membandingkan kedua algoritma secara
real-time. Data primer = **245 pemain asli dari Medan**, data sekunder =
1.000 record simulasi, ditambah basis data **129 hero**. Framework
validasi statistik mencapai **92% research validity** menjelang sidang.

### Fig. 8 — GrowMate
*Repo: [growmate-app](https://github.com/kim40404/growmate-app) · [Live app](https://growmate-app.vercel.app)*

- **8.a Match graph** — lingkaran konsentris = radius pencarian (hingga
  100 km). Titik = orang di sekitar; **titik oranye bergaris** = *mutual
  match* (keduanya saling tertarik). Titik `you` di tengah.
- **8.b Radius sweep** — kepadatan kandidat terhadap radius.

**Cara kerja:** aplikasi mempertemukan mahasiswa, builder, dan kreator
berdasarkan **skill, tujuan, dan jarak nyata** — bukan aplikasi kencan,
tapi untuk kolaborasi. Swipe → match hanya jika keduanya setuju → chat
terbuka. Fitur khasnya: **berbagi lokasi live** di dalam chat dengan peta
interaktif, koordinat **dibulatkan** agar lokasi pasti tidak terekspos.

### Fig. 9 — Honey Quality Classifier
- **9.a Hex lattice** — tiap sel heksagon = satu pembacaan sensor; oranye =
  terklasifikasi tidak murni. Garis di bawah = sinyal tegangan mentah.
- **9.b Threshold trace** — pembacaan terhadap ambang kemurnian.

**Cara kerja:** ESP32 membaca sensor array, mengalirkan data ke Firebase,
lalu classifier **k-NN** memisahkan madu murni dan oplosan dengan akurasi
**88,25%**.

### Fig. 10 — Decodream
- **10.a Symbol graph** — lingkaran konsentris = hierarki simbol mimpi;
  titik = simbol; garis = asosiasi emosional; oranye = sentimen kuat.

**Cara kerja:** NLP mengekstrak simbolisme dari narasi mimpi, memetakan
konteks emosional, dan menyimpan entri di Internet Computer (ICP).
Dikerjakan sebagai *project lead* untuk tim beranggotakan empat orang.

---

## 4. Figure Method (Fig. 3.x di section "Method")

### Retrieve — diagram alur RAG
Alur vertikal: Query → Embed → Retrieve → Rerank → Generate. Sisi kanan =
6 dokumen kandidat dengan skor relevansi; **3 teratas (oranye)** yang
diteruskan ke generator dan dikutip. Pesan: kualitas jawaban dibatasi oleh
kualitas konteks yang diambil.

### Evaluate — attention heatmap
Matriks attention: baris = token output, kolom = token input. Makin terang
= makin diperhatikan. **Sel oranye** = argmax tiap baris. Gunanya untuk
membuktikan model membaca bagian yang benar, bukan menebak.

### Ship — layer diagram
Lima lapis: Client → API → Model → Store → Observe. Garis oranye vertikal =
satu request yang ditelusuri melewati semua lapisan. Pesan: "ship" bukan
sekadar deploy, tapi observability.

---

## 5. Visual pada Writing

Section **Writing** tidak membuat figure teknis baru atau menduplikasi
figure proyek. Setiap artikel memakai **visual bukti yang sudah ada**:

| Artikel | Visual yang tampil | Cara membacanya |
| --- | --- | --- |
| First of twenty in a ChatGPT answer | Screenshot respons ChatGPT | Bukti satu observasi prompt-specific; bukan ranking permanen |
| Two products, zero API bills | Screenshot CiteReady | Antarmuka audit yang menerima hasil evaluasi Llama 3.1 lokal |
| Keeping a churn model honest | Screenshot SHAP asli dari repo | Panjang bar menunjukkan besar kontribusi fitur pada satu prediksi |
| Designing an exam simulator | Screenshot dashboard LolosPCPM | Bukti produk tempat tryout, pace dan akurasi ditampilkan |
| A free model… half a day | Diagram workflow yang sudah ada | AI menghasilkan opsi; keputusan akhir tetap melalui human review |

Thumbnail visual terlihat di daftar Writing. Setelah artikel dibuka,
visual yang sama tampil lebih besar di bagian **Project Evidence**. Klik
gambar atau tautan `Open` untuk melihat file aslinya dalam tab baru.

Figure teknis yang berhubungan tetap berada di section **Work**, supaya
satu figure hanya punya satu konteks dan tidak membingungkan pembaca.

### Motion figure di seluruh situs

Ketika sebuah plate figure pertama kali masuk viewport:

1. Isi figure naik 10 px dan settle perlahan selama sekitar 2,1 detik.
2. Garis data digambar dari awal ke akhir selama sekitar 3,1 detik.
3. Bar tumbuh dari baseline atau garis tengah selama sekitar 2,2 detik.
4. Garis putus bergerak singkat selama sekitar 3,5 detik untuk menegaskan
   alur atau sebaran.
5. Elemen `spin` berputar sangat lambat (satu rotasi ≈130 detik).
6. Pulse anomali mengembang setiap 3,6 detik.

Durasi panjang dipilih agar gerak terasa tenang, bukan ramai. Semua motion
utama hanya memakai `transform`, `opacity`, dan `stroke-dashoffset`. Jika
perangkat memilih `prefers-reduced-motion`, animasi dinonaktifkan dan
figure langsung tampil dalam keadaan akhir.

### Siklus gerak pada figure di card

Figure kecil pada card proyek tidak berhenti selamanya setelah entrance.
Masing-masing card menjalankan **ambient cycle** mandiri:

- Siklus pertama dimulai setelah jeda acak sekitar **4,5–8 detik**.
- Siklus berikutnya berjarak acak sekitar **6,2–11 detik**.
- Durasi satu gerakan sekitar **4,2 detik**.
- Arah selalu bergantian: satu siklus bergerak maju/kanan, siklus berikutnya
  mundur/kiri. Karena jedanya acak, card tidak bergerak serentak.
- Garis data tidak selalu "digambar dari nol". Ia kadang menyusut lalu
  kembali dari arah positif, kadang dari arah negatif.
- Bar kadang menyusut dari kiri, pada siklus lain dari kanan. Bar vertikal
  bergantian dari bawah dan atas.
- Seluruh isi plot hanya bergeser 5 px dan scale maksimum sekitar 1,2%, jadi
  gerak terasa hidup tanpa mengganggu keterbacaan angka.

Siklus hanya berjalan jika card terlihat di viewport. Saat card keluar
layar atau tab browser tidak aktif, timer tidur dan tidak membebani scroll.
Sejak Rev. 2026-10 tidak ada ambient cycle: kurva digambar sekali saat bingkai masuk layar, lalu diam. Pada `prefers-reduced-motion` semua kurva langsung dalam keadaan akhir.

---

## 6. Catatan Kejujuran Data

Beberapa figure memakai **angka ilustratif** untuk menunjukkan *bentuk*
sebuah hasil, bukan mengklaim pengukuran spesifik. Di halaman, figure seperti
ini ditandai `illustrative: true` di `content.ts` dan tampil dengan bingkai
putus-putus, tag ILLUSTRATIVE, dan watermark NOT TESTED:

| Figure | Status data |
| --- | --- |
| Fig. 01 hero | Sintetis — demonstrasi algoritma |
| 1.a / 1.b skor GEO | Ilustratif |
| 4.a kurva presisi & 4.b SHAP | Ilustratif (bentuk khas SMOTE+XGBoost) |
| 5.a Precision@k | **Nyata** — 0,24 → 0,74 dari README FlyRank |
| 6.a Funnel 945 → 944 | **Nyata** — dari README pipeline |
| 7.d Validation 92% | **Nyata** — research validity dari README |
| 9 akurasi 88,25% | **Nyata** — dari CV/portofolio |

---

## 7. Lokasi Kode

| Bagian | File |
| --- | --- |
| Fig. 01 (K-Means live) | `src/components/ClusterField.tsx` |
| 21 generator figure SVG | `src/components/ProjectVisual.tsx` |
| Bingkai graticule | `src/components/Frame.tsx` (kerangka) dan `src/components/FigurePlate.tsx` (pemicu gambar) |
| Visual bukti Application Notes | `src/components/ApplicationNotes.tsx` |
| Data & deskripsi proyek | `src/data/content.ts` |
| Aset lokal (WebP + dimensi) | `src/data/assets.ts`, `src/data/asset-manifest.json`, `scripts/build-assets.py` |

Setiap figure SVG memakai *seeded PRNG* (`mulberry32`) sehingga titik acak
selalu tergambar identik di setiap render — tidak pernah "bergoyang" antar
kunjungan.
