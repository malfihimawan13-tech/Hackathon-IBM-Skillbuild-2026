# CITA — Backend Langflow

> **Catatan paket pengumpulan:** alat pengembang (`src/`, `build.py`, `tools_gen_flows.py`, `data/*.py`, dan `myCITA_database_eksternal.json`) tidak disertakan karena tidak dibutuhkan untuk menjalankan myCITA: kode komponen dan data JSON sudah tertanam di file flow. Bagian README yang menyebut alat tersebut bersifat referensi pengembangan.


**CITA (Capai Impian, Tentukan Arah)** · *Wujudkan Keinginan dan Tujuan Hidup*
AI financial life-planning companion untuk Gen Z dan pekerja muda. Langflow = otak (backend), IBM Bob = antarmuka percakapan.

---

## Mulai cepat: 9 flow bernomor

Setiap flow diberi nomor urut, dan file input di `contoh_input/` memakai nomor yang sama dengan flow tujuannya (`1_profil_budi.json` untuk `1_simpan_profil_mycita`, `5_karier_budi.json` untuk `5_eksplorasi_karier_mycita`, dan seterusnya). Panduan lengkap ketiga persona ada di **`contoh_input/BACA_SAYA.md`**.

1. Import kesembilan file di `flows/`, lalu isi API key Gemini di komponen Agent flow `7_konsultasi_coach_mycita`.
2. Jalankan flow **1 → 2 → 3** dengan file bernomor sama (mengisi data persona).
3. Setelah itu flow **4, 5, 6, 7** boleh dijalankan dalam urutan apa pun dan berulang kali.
4. Flow **8** menghapus semua data satu persona untuk mulai dari awal.

Flow saling terhubung lewat `user_id` dan database yang sama (default `~/.mycita/mycita.db`), bukan lewat garis penghubung di kanvas.


## Database pengguna: mycita.db

- Lokasi bawaan: `~/.mycita/mycita.db` (Windows: `C:\Users\<nama>\.mycita\mycita.db`). Bisa diganti lewat kolom **Lokasi Database** di komponen atau variabel `MYCITA_DB_PATH`.
- Data lama dari `~/.cita/cita.db` dipindahkan otomatis saat flow pertama kali dijalankan (file lama tetap disimpan sebagai cadangan).
- **Database contoh 3 persona** tersedia di `data/mycita_contoh_3_persona.db` (Budi, Agus, Dini sudah terisi, termasuk data karier dan usaha). Untuk langsung mencoba tanpa menjalankan flow 1–5, tutup Langflow lalu jalankan di PowerShell dari folder paket:
  ```powershell
  New-Item -ItemType Directory -Force "$env:USERPROFILE\.mycita" | Out-Null
  Copy-Item "data\mycita_contoh_3_persona.db" "$env:USERPROFILE\.mycita\mycita.db"
  ```
  Perintah ini menimpa `mycita.db` yang sudah ada.

## 1. Arsitektur

```
                         IBM BOB (UI / percakapan)
                                  │  MCP
     ┌──────────────┬─────────────┼──────────────┬──────────────────┐
     ▼              ▼             ▼              ▼                  ▼
simpan_profil  simpan_keuangan  simpan_target  analisis_keuangan  konsultasi_coach
   _cita           _cita           _cita          _cita              _cita
 (Python)        (Python)        (Python)       (Python)        (Agent + Gemini)
     │              │             │              ▲                  │ memakai tool:
     └──────────────┴──────┬──────┘              │                  │ • 4_analisis_keuangan_mycita
                           ▼                     │                  │ • kelola_target_mycita
                  CITA DATA STORE (SQLite) ──────┴──────────────────┘
                  ~/.mycita/mycita.db, per user_id
```

Prinsip desain:

- **Flow data dan analisis tidak memakai LLM.** Semua angka dihitung pasti dengan rumus, sehingga cepat, gratis, konsisten, dan bisa dipertanggungjawabkan.
- **LLM hanya dipakai di Coach**, dan Agent diwajibkan mengambil setiap angka dari tool. AI menjelaskan, tidak mengarang angka.
- **Data dipakai bersama** lewat satu database lokal dengan kunci `user_id`.
- **Simulasi arus kas bulan per bulan.** Cicilan yang lunas otomatis membebaskan dana, dana darurat diisi lebih dulu, dan harga target naik sesuai asumsi kenaikan harga.

## 2. Isi paket

| Folder / file | Isi |
|---|---|
| `flows/` | 6 file flow JSON siap import ke Langflow |
| `components/` | Kode 5 Custom Component (untuk pemasangan manual atau jika import gagal) |
| `prompt/instruksi_agent_coach.md` | Agent Instructions untuk flow Coach |
| `contoh_input/` | Contoh input persona "Budi" untuk uji coba setiap flow |
| `src/`, `build.py`, `tools_gen_flows.py`, `tests/` | Sumber kode, skrip build, generator flow, dan pengujian (untuk repositori/version control) |

## 3. Pemasangan

### Opsi A — Import flow (disarankan)

1. Buka Langflow → buat project baru, misalnya **CITA**.
2. Klik **Import** (atau tombol unggah di halaman project), pilih keenam file di folder `flows/`.
3. Buka flow **7_konsultasi_coach_mycita**, klik komponen **Agent**, lalu pilih model **Gemini** pada *Language Model*. Pastikan Gemini API Key sudah diisi di *Settings → Model Providers* seperti di materi workshop.
4. Lanjut ke bagian 4 untuk uji coba.

File JSON dibuat dan diuji dengan Langflow 1.12. Jika versi Langflow Desktop-mu jauh lebih lama dan import gagal, pakai Opsi B.

### Opsi B — Pasang manual

Untuk setiap flow data (`1_simpan_profil_mycita`, `2_simpan_keuangan_mycita`, `3_simpan_target_mycita`, `4_analisis_keuangan_mycita`, `8_hapus_data_mycita`):

1. Buat flow kosong (*Blank Flow*), beri nama persis seperti di atas.
2. Tambahkan **Chat Input** dan **Chat Output**.
3. Tambahkan **Custom Component** (dari sidebar, kategori *Custom* / tombol *New Custom Component*), klik **Code**, hapus isinya, lalu tempel seluruh isi file yang sesuai dari `components/`. Klik **Check & Save**.
4. Sambungkan: `Chat Input (Message)` → `input_json` komponen CITA → `Hasil` → `Chat Output`.
5. Isi deskripsi flow (ikon pengaturan flow) dengan deskripsi di bagian 6.

Untuk flow `7_konsultasi_coach_mycita`:

1. Tambahkan **Chat Input**, **Agent**, **Chat Output**, serta dua Custom Component berisi `4_mycita_analisis.py` dan `3_mycita_target.py`.
2. Pada kedua komponen CITA, nyalakan **Tool Mode**, lalu sambungkan output **Toolset** ke input **Tools** milik Agent.
3. Salin isi `prompt/instruksi_agent_coach.md` ke **Agent Instructions**, pilih model Gemini.
4. Sambungkan `Chat Input → Agent → Chat Output`.

### Lokasi database

Secara default data disimpan di `~/.mycita/mycita.db` (di Windows: `C:\Users\<nama>\.mycita\mycita.db`). Untuk memindahkannya, isi field **Lokasi Database** (menu *advanced* pada komponen) dengan path yang **sama di semua komponen**, atau setel environment variable `MYCITA_DB_PATH`.

## 4. Uji coba di Playground

Jalankan berurutan, tempel isi file dari `contoh_input/` ke chat Playground:

| Urutan | Flow | Input | Hasil yang diharapkan |
|---|---|---|---|
| 1 | 1_simpan_profil_mycita | `1_profil_budi.json` | Total penghasilan Rp9.000.000, tipe psikologi "Si Spontan" |
| 2 | 2_simpan_keuangan_mycita | `2_keuangan_budi.json` | Total pengeluaran Rp6.350.000 (termasuk cicilan Rp1.300.000) |
| 3 | 3_simpan_target_mycita | `3_target_budi.json` | Avanza otomatis memakai harga referensi Rp259.200.000 |
| 4 | 4_analisis_keuangan_mycita | `4_analisis_budi.json` | Skor 70/100 "Cukup sehat", Avanza tercapai ±7 tahun 8 bulan |
| 5 | 4_analisis_keuangan_mycita | `4_simulasi_what_if_budi.json` | Gaji +2 juta & hemat 300 ribu → Avanza ±4 tahun 11 bulan |
| 6 | 3_simpan_target_mycita | `3_cari_harga.json` | Referensi harga Honda Vario 125 |
| 7 | 7_konsultasi_coach_mycita | lihat di bawah | Jawaban Coach dengan angka dari tool |

Contoh input Coach:

```
user_id: budi
pertanyaan: Aku pengen beli Avanza dalam 5 tahun, realistis nggak? Kalau gajiku naik 2 juta gimana?
```

Uji `8_hapus_data_mycita` dengan `8_hapus_budi.json` paling akhir saja, karena data Budi akan terhapus.

## 5. Hubungkan ke IBM Bob (MCP)

Ikuti urutan dari materi workshop: **flow dulu → project → Bob terakhir**.

1. Pastikan setiap flow berjalan di Playground.
2. Di Langflow, buka project CITA → tab **MCP Server** → pastikan keenam flow aktif sebagai tool. Periksa nama dan deskripsi tool (bagian 6), ubah lewat *Edit tools* bila perlu.
3. Klik **JSON** → **Generate API Key** → salin konfigurasi (untuk Windows tetap salin dari opsi **macOS/Linux**).
4. Di Bob: ikon **Gear → MCP → +**, tempel konfigurasi, dan tambahkan `"--with", "mcp<2.0.0",` pada bagian `args`.
5. Cek bahwa Bob menemukan keenam tool, lalu uji satu permintaan eksplisit dulu, misalnya *"Jalankan 4_analisis_keuangan_mycita untuk user_id budi"*, sebelum mencoba bahasa alami.

### Instruksi untuk Bob

Tempel teks berikut sebagai instruksi/rules di Bob (atau di awal percakapan demo) agar Bob tahu alurnya:

```
Kamu adalah antarmuka aplikasi CITA, perencana keuangan untuk anak muda. Gunakan tools CITA:
- Saat pengguna memberi data diri/pekerjaan/penghasilan → susun JSON lalu panggil 1_simpan_profil_mycita.
- Saat pengguna memberi pengeluaran/hutang/tabungan → 2_simpan_keuangan_mycita.
- Saat pengguna menyebut impian (rumah, mobil, motor, menikah, dll.) → 3_simpan_target_mycita (aksi "tambah").
  Untuk sekadar cek harga gunakan aksi "cari_harga".
- Untuk dashboard/kondisi keuangan → 4_analisis_keuangan_mycita.
- Untuk pertanyaan bebas, saran, atau "bagaimana kalau..." → 7_konsultasi_coach_mycita dengan format
  "user_id: <id>\npertanyaan: <pertanyaan>".
- 8_hapus_data_mycita hanya jika pengguna meminta datanya dihapus dan sudah mengonfirmasi.
Selalu sertakan user_id yang sama untuk satu pengguna. Jangan menghitung angka sendiri; pakai hasil tool.
Tanyakan data yang kurang secara bertahap dan ramah, jangan sekaligus banyak pertanyaan.
```

## 6. Referensi tools

| Tool | Fungsi | Field input utama |
|---|---|---|
| `1_simpan_profil_mycita` | Simpan profil & hitung total penghasilan | `user_id`, `nama`, `tanggal_lahir`/`usia`, `kota`, `pendidikan_terakhir`, `status_pernikahan`, `pekerjaan[]` (`nama`, `jenis`, `lama_kerja_bulan`, `penghasilan`, `penghasilan_min`), `pendapatan_tambahan[]`, `pasangan`, `anak[]`/`jumlah_anak`, `jumlah_tanggungan`, `psikologi` |
| `2_simpan_keuangan_mycita` | Simpan pengeluaran, hutang, tabungan | `user_id`, `pengeluaran{kategori: nominal}`, `hutang[]` (`nama`, `jenis`, `sisa_pokok`, `cicilan_bulanan`, `bunga_tahunan`, `sisa_tenor_bulan`), `tabungan_saat_ini`, `dana_darurat_saat_ini` |
| `3_simpan_target_mycita` | Kelola target & cari harga | `user_id`, `aksi` (`simpan`/`tambah`/`hapus`/`cari_harga`), `target` (`nama`, `harga` opsional, `target_tahun`, `prioritas`, `dp_persen`, `bunga_kredit_persen`, `dana_terkumpul`) |
| `4_analisis_keuangan_mycita` | Analisis + simulasi | `user_id`, opsional `simulasi` (`perubahan_penghasilan`, `penghasilan_baru`, `perubahan_pengeluaran`, `perubahan_keinginan`, `target`, `jadwal_pendapatan`, `pendapatan_tambahan_jadwal`, `biaya_awal`), opsional `asumsi` |
| `7_konsultasi_coach_mycita` | Percakapan & rekomendasi personal | Teks: `user_id: ...` dan `pertanyaan: ...` |
| `5_eksplorasi_karier_mycita` | Rekomendasi karier + jadwal pendapatan | `user_id`, `minat[]`, `skill[]`, `pengalaman[{bidang, tahun}]`, `pendidikan_terakhir`, `kota`, opsional `target_profesi`, `penghasilan_sekarang` |
| `6_eksplorasi_usaha_mycita` | Rekomendasi usaha + skenario + simulasi siap pakai | `user_id`, `minat[]`, `skill[]`, `pengalaman[]`, `modal_tersedia`, `waktu` (`sampingan`/`penuh`), opsional `usaha_pilihan` |
| `8_hapus_data_mycita` | Hapus semua data pengguna | `user_id`, `konfirmasi: true` |

Nominal boleh ditulis bebas: `7000000`, `"7.000.000"`, `"Rp 7 juta"`, `"7,5jt"`, `"500rb"`.

Kuis psikologi keuangan (`psikologi`) berisi skor 1–5 (1 = sangat tidak setuju, 5 = sangat setuju) untuk enam pernyataan: `impulsif`, `fomo`, `menghindar`, `emosional`, `terlalu_hemat`, `disiplin`. Teks pernyataannya ada di `PSIKOLOGI_PERTANYAAN` pada `components/1_mycita_profil.py`, siap dipakai untuk form di UI.

### Bagian output analisis (untuk UI/dashboard)

- `dashboard`: nama, pendapatan, pengeluaran, sisa, skor kesehatan, status, saving rate → kartu beranda.
- `kesehatan_keuangan`: rasio-rasio dan rincian skor → halaman "Kondisi Keuangan".
- `dana_darurat`, `alokasi_bulan_ini`, `strategi_hutang` → halaman "Atur Keuangan".
- `target[]`: opsi A menabung, B kredit (beberapa tenor), C kombinasi, status, dan alternatif → halaman "Tujuan Saya".
- `rekomendasi_utama[]`, `psikologi` → kartu saran.
- `asumsi`, `sumber_asumsi`, `disclaimer` → transparansi.

## 7. Cara kerja perhitungan

**Skor kesehatan (0–100):** saving rate (maks 30, penuh jika ≥20%), rasio cicilan terhadap penghasilan (maks 25, aman ≤30%), kecukupan dana darurat (maks 25), porsi pengeluaran keinginan (maks 10, ideal ≤30%), dan ada/tidaknya hutang berbunga tinggi seperti paylater, pinjol, dan kartu kredit (maks 10). Jika pengeluaran melebihi penghasilan, skor dibatasi maksimal 30.

**Dana darurat:** lajang 3–6× pengeluaran bulanan; menikah 6–9×; punya tanggungan 6–12×; ditambah 3 bulan jika penghasilan tidak tetap.

**Simulasi arus kas:** setiap bulan, dana bebas = penghasilan − pengeluaran − cicilan aktif. Sebagian (default 50%) mengisi dana darurat sampai target minimum tercapai; sisanya dibagi ke target sesuai kebutuhan tenggat dan prioritas, dan kelebihannya mempercepat target prioritas teratas. Harga target naik setiap bulan sesuai asumsi.

**Kredit:** cicilan anuitas; tenor dianggap aman jika total rasio cicilan ≤30% penghasilan dan cicilan masih tertutup arus kas saat pembelian.

**Alternatif:** dihitung dengan pencarian biner pada simulasi yang sama: tambahan tabungan minimum agar tepat waktu, budget maksimal yang terjangkau, dan tenggat realistis.

## 8. Asumsi & sumber data

| Asumsi | Nilai default | Sumber |
|---|---|---|
| Inflasi umum | 3,2%/tahun | Inflasi tahunan Agustus 2026 3,19% (BPS via Databoks); sasaran BI 2,5±1% |
| Bunga KPR | 11%/tahun | Bunga floating KPR BCA 11% (Mandiri 13%, CIMB Niaga 13,5%), Kontan, Agustus 2026 |
| KPR subsidi | 5% tetap; harga maks Rp166–185 juta | Kompas.com, 2026 |
| Kenaikan harga rumah/kendaraan/menikah/pendidikan | 4% / 3% / 4% / 6% per tahun | Asumsi CITA, dapat diubah |
| Bunga kredit mobil/motor | 10% / 15% per tahun | Asumsi CITA, dapat diubah |
| DP | rumah 20%, mobil 20%, motor 15% | Asumsi CITA, dapat diubah |

Harga referensi (OTR Jakarta dan sekitarnya, dikumpulkan Oktober 2026): Toyota Avanza, Mitsubishi Xpander, Suzuki Ertiga, Honda Brio, Honda BeAT, Honda Vario 125, Honda Scoopy, Yamaha NMAX, rumah subsidi, dan budget pernikahan. Untuk memperbarui atau menambah, ubah daftar `REF_HARGA` di `src/target.py`, jalankan `python build.py`, lalu tempel ulang kode komponen (atau jalankan `tools_gen_flows.py` untuk membuat ulang file flow).

Semua asumsi bisa diganti per permintaan, contoh:
`{"user_id": "budi", "asumsi": {"kenaikan_harga_persen": {"mobil": 5}, "bunga_kredit_persen": {"mobil": 8}}}`

## 9. Responsible AI (bahan pitching)

- **Angka tidak dikarang AI:** semua perhitungan deterministik di Python; Agent diwajibkan mengambil angka dari tool.
- **Transparan:** setiap analisis memuat asumsi, sumber data, rincian skor, dan disclaimer.
- **Privasi:** data tersimpan lokal; tidak meminta nomor rekening, PIN, atau KTP; tersedia tool penghapusan data; alamat cukup kota.
- **Konservatif:** penghasilan freelance dihitung dengan angka konservatif; imbal hasil tabungan default 0%.
- **Batas peran:** CITA tidak merekomendasikan produk keuangan tertentu dan menolak menyarankan paylater/pinjol untuk konsumsi.
- **Perlindungan pengguna rentan:** Coach merespons tekanan finansial dengan empati dan mengarahkan ke Kontak OJK 157 untuk pengaduan.
- **Adil:** tidak ada variabel gender, agama, atau suku dalam perhitungan.
- **Pengawasan manusia:** pengguna selalu dapat mengubah harga, asumsi, dan prioritas; CITA memberi pilihan, bukan keputusan.

## 10. Pemecahan masalah

| Masalah | Solusi |
|---|---|
| `No module named 'langflow.custom'` saat menempel kode | Ganti tiga baris import di atas file menjadi `from lfx.custom.custom_component.component import Component`, `from lfx.io import MessageTextInput, Output, StrInput`, `from lfx.schema.message import Message` |
| `data_belum_lengkap` | Profil dan keuangan untuk `user_id` tersebut belum disimpan, atau `user_id` berbeda (huruf besar/kecil dan spasi dinormalisasi otomatis) |
| Data tidak terbaca antar flow | Field **Lokasi Database** berbeda antar komponen; samakan atau kosongkan semua |
| Coach menjawab tanpa angka | Pastikan kedua komponen tersambung ke **Tools** milik Agent dan Tool Mode menyala |
| Bob tidak menemukan tool | Cek tab MCP Server, API key, dan argumen `mcp<2.0.0` di konfigurasi Bob |
| Error `Input harus berupa JSON object` | Flow data menerima JSON; untuk bahasa alami gunakan 7_konsultasi_coach_mycita atau biarkan Bob menyusun JSON-nya |

## 11. Skenario demo (±3 menit)

1. **Masalah:** "Budi, 28 tahun, gaji Rp9 juta, ingin Avanza dalam 5 tahun dan menikah dalam 4 tahun."
2. **Isi data lewat Bob** → dashboard: skor 70/100, sisa Rp2,65 juta/bulan, dana darurat baru cukup 1,6 bulan.
3. **Fakta jujur:** dengan kondisi sekarang, Avanza baru tercapai ±7 tahun 8 bulan; kredit 5 tahun pun membuat cicilan ±52% penghasilan (tidak aman).
4. **Rekomendasi CITA:** lunasi paylater dulu, alihkan cicilan yang lunas ke tabungan, bangun dana darurat, plus saran kebiasaan untuk tipe "Si Spontan".
5. **What-if:** "Kalau gajiku naik 2 juta dan aku hemat jajan 300 ribu?" → Avanza menjadi ±4 tahun 11 bulan, masuk target.
6. **Penutup:** semua angka transparan, sumber tercantum, dan keputusan tetap di tangan pengguna.

## 12. Aplikasi mobile

Paket `mobile-app/` berisi aplikasi React Native + Expo yang memanggil flow yang sama lewat REST API Langflow:
`POST /api/v1/run/<endpoint_name>?stream=false` dengan header `x-api-key`. Setiap flow di folder `flows/` sudah memiliki **Endpoint Name** sesuai namanya (misalnya `4_analisis_keuangan_mycita`), jadi aplikasi bisa langsung memanggilnya setelah flow di-import. Panduan lengkap ada di `mobile-app/README.md`.

Karena aplikasi dan Bob memakai flow serta database yang sama, gunakan **user_id yang sama** di keduanya agar datanya tersambung.

## 13. myCITA Karier (jalur karier → finansial)

Flow baru `5_eksplorasi_karier_mycita` (komponen `components/5_mycita_karier.py`) memakai **Database Eksternal myCITA** yang sudah disematkan di dalam komponen, jadi tidak perlu memasang file tambahan. Salinan database ada di folder `data/` (PDF untuk RAG/dokumentasi, JSON untuk angka, dan `sumber_data.py` + `build_database.py` untuk memperbarui keduanya sekaligus).

**Cara kerja (tanpa LLM):**
1. Skor kecocokan 0–100 per profesi: minat (35), skill wajib yang sudah dimiliki (35), relevansi pengalaman (20), kesesuaian pendidikan (10). Pengalaman gudang/logistik otomatis menambahkan skill transferable.
2. Untuk 3 profesi teratas: alasan, skill gap (wajib & pendukung), jalur belajar dan estimasi biaya dari database, jenjang karier, rentang gaji per tahap beserta sumbernya, dan konteks UMK/UMP wilayah pengguna.
3. `jadwal_pendapatan_untuk_simulasi`: penghasilan pekerjaan utama per bulan (sekarang → setelah masa persiapan → naik jenjang), dengan batas bawah UMK/UMP.

**Menghubungkan ke finansial:** kirim jadwal tersebut ke `4_analisis_keuangan_mycita`:
`{"user_id": "rudi", "simulasi": {"jadwal_pendapatan": [...]}}`. Mesin simulasi mengganti penghasilan pekerjaan utama sesuai jadwal (pendapatan sampingan dan pasangan tetap dihitung), lalu `perbandingan` menunjukkan kapan tujuan tercapai sebelum vs sesudah memakai jalur karier itu. Agent Coach melakukan langkah ini otomatis (lihat instruksi Agent, bagian "Roadmap karier → finansial").

**Contoh hasil uji (persona demo Rudi, 29 th, SMK, leader gudang 10 th, Kab. Bekasi, target rumah subsidi 5 tahun):**

| Jalur | Skill gap wajib | Rumah subsidi tercapai |
|---|---|---|
| Tetap di pekerjaan sekarang | - | lebih dari 50 tahun |
| Supervisor Gudang | tidak ada | lebih dari 50 tahun (gaji setara) |
| Supply Chain Analyst | SQL dasar, dashboard | 6 tahun 6 bulan |
| Data Analyst | SQL, visualisasi data, statistik dasar | 5 tahun 8 bulan |

Contoh input ada di `tests/fixtures/8_karier_persona_gudang.json`. Flow ini juga sudah terpasang sebagai tool ketiga di Agent Coach.

## 14. myCITA Usaha (jalur usaha → finansial)

Flow `6_eksplorasi_usaha_mycita` (komponen `components/6_mycita_usaha.py`) memakai template usaha di database eksternal (saat ini laundry kiloan dan bengkel motor, masing-masing dua skala).

**Cara kerja (tanpa LLM):**
1. Skor kecocokan 0–100: kecukupan modal (40), minat (30), skill & pengalaman (30).
2. Tiga skenario dari database: pesimis (omzet & margin terendah), moderat (nilai tengah), optimis (tertinggi). Setiap skenario dihitung dengan **masa rintisan** (bulan 1 = 30% kondisi stabil, stabil di bulan ke-6), menghasilkan laba bulanan stabil, laba tahun pertama, dan balik modal. Perkiraan balik modal menurut sumber ditampilkan sebagai pembanding.
3. Kekurangan modal, risiko, skill gap, roadmap usaha 12 bulan, dan **`simulasi_siap_pakai`**:
   - mode `sampingan` → `pendapatan_tambahan_jadwal` (laba usaha ditambahkan di atas gaji) + `biaya_awal` (modal keluar dari tabungan);
   - mode `penuh` → `jadwal_pendapatan` (laba usaha menggantikan gaji utama) + `biaya_awal`.
4. Kirim `simulasi_siap_pakai` apa adanya ke `4_analisis_keuangan_mycita` untuk melihat dampaknya ke tujuan finansial.

Template yang memakai angka **ASUMSI myCITA** (belum bersumber) ditandai di output dan di PDF database.

**Contoh hasil uji (Budi, modal Rp10 jt, usaha sampingan):** bengkel motor rumahan, balik modal moderat 7 bulan, target Avanza dari 7 tahun 8 bulan menjadi **4 tahun 8 bulan**. Contoh lain: menjadikan laundry rumahan sebagai pekerjaan utama justru memperlambat target, dan myCITA menyampaikannya dengan jujur serta menyarankan memulai sebagai usaha sampingan.

Flow ini juga terpasang sebagai tool keempat di Agent Coach (bagian "Roadmap usaha → finansial" di instruksi Agent).

## 15. Tiga persona demo

Skrip `tests/skenario_tiga_persona.py` menjalankan ketiga persona dengan mesin yang sama. Contoh input ada di `contoh_input/9_…`, `10_…`, dan `11_…`.

**Dini (17, SMA kelas 3, Bandung) · career discovery.** Mode pelajar memakai rumus khusus: minat (50), skill dan potensi (25), aktivitas relevan (15), kesiapan pendidikan (10). Karier: Data Analyst 75, Software Engineer 73, UI/UX Designer 73, Data Scientist 70. Output `rekomendasi_jurusan`: S1 Sistem Informasi 90, S1 Teknik Informatika / Ilmu Komputer 89, S1 Sains Data / Statistika 66, S1 DKV 40, masing-masing dengan daftar kampus dari tabel `universitas` di database (13 perguruan tinggi, peringkat QS WUR 2026, UKT per semester, penanda kampus di kota pengguna). Roadmap: persiapan SNBP/SNBT, kuliah dan magang, gaji pertama bulan ke-54 (Rp5–9 jt). Keuangan: uang saku Rp1,5 jt, pengeluaran Rp1,35 jt, menabung Rp150 rb/bulan, tabungan Rp2,5 jt (skor kesehatan 59, saving rate 10%, dana darurat Rp4,05 jt terpenuhi ±11 bulan).

**Agus (38, Bekasi) · usaha keluarga + rumah.** Dua sumber pendapatan: bengkel motor Agus (omzet Rp18 jt, biaya Rp7 jt, bersih Rp11 jt) dan kelontong istri (omzet Rp8 jt, biaya Rp5 jt, bersih Rp3 jt). Pengeluaran Rp8,5 jt, tabungan Rp45 jt, tanpa hutang. Target rumah Rp600 jt dalam 7 tahun.

| Skenario | Rumah tercapai |
|---|---|
| A · Kondisi sekarang | 22 th 2 bl |
| B · Omzet bengkel +20% (+Rp2,2 jt, asumsi margin tetap 61%) | 10 th |
| C · Omzet kelontong istri +25% (+Rp750 rb, asumsi margin tetap 37,5%) | 14 th 8 bl |
| D · Gabungan B + C | 8 th 8 bl |
| E · Gabungan, rumah ±Rp515 jt | 7 th (KPR 15 th aman, 29,2%) |
| F · Tanpa pengembangan, rumah Rp327 jt | 7 th 1 bl |

Skenario usaha Agus memakai `simulasi.perubahan_penghasilan` di `4_analisis_keuangan_mycita`, karena kedua usahanya sudah berjalan (flow `6_eksplorasi_usaha_mycita` khusus untuk usaha baru).

**Budi (29, Tangerang) · career switch + finansial.** Gaji Rp7,5 jt, pengeluaran Rp5,5 jt, tabungan Rp35 jt. Target Data Scientist (kecocokan 71; statistik dan ML perlu diperdalam), menikah Rp60 jt (3 th) dan mobil Rp250 jt (5 th). Tetap bekerja: mobil 22 th 1 bl. Jalur Data Scientist: gaji awal naik ±Rp1,5 jt, mobil 5 th 6 bl. Jalur Data Analyst: gaji awal turun ±Rp500 rb, mobil 6 th.

## 16. Cakupan Database Eksternal (Oktober 2026)

| Kelompok | Jumlah | Contoh tambahan terbaru |
|---|---|---|
| Profesi | 23 | Akuntan, Dokter Umum, Dokter Spesialis, Dokter Hewan, Perawat, Apoteker, Psikolog, IT Support, Insinyur Teknik Industri, Guru, TNI, Polisi |
| Data gaji | 58 baris | WageIndicator 2026 (awal kerja & setelah 5 tahun), KantorKu, Dealls, PP 5/2024 (PNS), Perpres 11/2024 (PPPK), PP 6 & 7/2024 (TNI/Polri) |
| Skill | 24 profesi | wajib + pendukung per profesi |
| Jurusan / jalur pendidikan | 37 | Akuntansi, Kedokteran, Keperawatan, Farmasi, Psikologi, PPG, Teknik, Hukum, Gizi, Kebidanan, Akmil/Akpol, SMK TKJ |
| Template usaha | 18 | toko kelontong, warung sembako/Madura, warkop, kopi keliling, es teh, warteg, gorengan, frozen food, konter pulsa, agen BRILink, sayur, buah, ayam/daging, ternak ayam |
| Kendaraan | 23 | LCGC (Ayla, Sigra, Agya, Calya, Brio), Veloz, Innova, PCX, Vario 160, Aerox, Fazzio, dll. |
| Biaya pendidikan | 29 baris | UKT per kampus (UI, ITB, UGM, Unpad, Unhas, USU, UNY, Unesa, Unair, UNNES, Unsoed, UNS, UB, Undip, IPB, ITS), Telkom University, ikatan dinas |
| Perguruan tinggi | 74 | PTN di berbagai provinsi, politeknik negeri, dan PTS utama, dengan peringkat QS WUR 2026 jika ada |

Catatan cakupan:
- Indonesia memiliki lebih dari 4.000 perguruan tinggi; daftar ini memuat kampus utama. Untuk cakupan penuh, integrasikan data resmi PDDikti.
- Gaji ASN/TNI/Polri adalah **gaji pokok** (belum termasuk tunjangan kinerja/profesi).
- Template usaha yang memakai angka belum terverifikasi ditandai **ASUMSI myCITA** di kolom `dasar_angka` (misalnya lapak buah dan lapak ayam/daging eceran).
- Perluasan disimpan di `data/data_ext.py` dan digabung otomatis oleh `data/sumber_data.py`.

## 17. Simulasi usaha yang sudah berjalan & data karier tersimpan

- `4_analisis_keuangan_mycita` menerima `simulasi.pengembangan_usaha`: daftar `{nama, laba_bersih, kenaikan_persen}`. Mesin menghitung tambahan laba (asumsi margin bersih tetap) dan menampilkannya di kolom `pengembangan_usaha`. Dipakai untuk usaha yang sudah ada, misalnya bengkel Agus dan kelontong istrinya.
- `harga_maksimal_terjangkau_sesuai_tenggat` dibulatkan ke bawah ke Rp1 juta terdekat agar mudah dibaca dan tetap dalam tenggat.
- `5_eksplorasi_karier_mycita` memakai data karier yang pernah disimpan untuk `user_id` yang sama bila Agent/Bob tidak menyebut minat, skill, pengalaman, atau pendidikan (lihat kolom `memakai_data_tersimpan`). Mode pelajar juga dikenali dari profil tersimpan (misalnya "SMA kelas 3" atau usia ≤ 19 tahun dengan pendidikan SMA/SMK).
- `6_eksplorasi_usaha_mycita` kini juga mengeluarkan `simulasi_siap_pakai_per_skenario` (pesimis/moderat/optimis). Untuk usaha sampingan akhir pekan, skenario pesimis dipakai sebagai acuan, dan bisa digabung dengan `jadwal_pendapatan` jalur karier dalam satu simulasi.
- Instruksi Agent Coach (`prompt/instruksi_agent_coach.md`) memuat aturan ini, sehingga jawaban Coach dan IBM Bob konsisten dengan angka di pitch deck.

## 18. Database PDF sebagai input Langflow (flow 9)

`9_pustaka_database_mycita` memakai komponen bawaan **Read File** untuk membaca `myCITA_Database_Eksternal.pdf`, lalu komponen **myCITA Pustaka Database** (`components/9_mycita_pustaka.py`) mencari bagian yang relevan dengan kata kunci (tanpa model AI, tanpa kuota API). Hasilnya berupa kutipan tabel PDF beserta nomor halaman dan sumber.

- Cara pakai: buka flow 9 → klik Read File → upload PDF dari folder `data/` → simpan → di Playground ketik kata kunci (contoh di `contoh_input/9_pertanyaan_pustaka.txt`).
- Flow 7 (Coach) juga punya komponen Read File + Pustaka sebagai tool: upload PDF yang sama di Read File flow 7.
- Flow 9 otomatis tersedia sebagai tool MCP untuk IBM Bob (`_9_pustaka_database_mycita`).
- Pembagian peran: **PDF = sumber referensi** untuk menjawab dan mengutip (daftar profesi, gaji, harga, UKT, UMK, usaha). **JSON yang ditanam di komponen = sumber angka perhitungan** (waktu tercapai, cicilan, skor), agar hasil simulasi tetap pasti dan tidak bergantung pada pembacaan teks.
- Diuji di Langflow 1.12: 6/6 pertanyaan uji menemukan angka yang benar (Agya Rp174,3 jt, perawat Rp2,98 jt, UKT Unpad Rp15 jt, warkop Rp5 jt, UMK Bandung Rp4.737.678, Brigpol Rp2,42 jt).

---

*CITA adalah alat edukasi dan perencanaan keuangan, bukan nasihat investasi atau rekomendasi produk keuangan tertentu.*
