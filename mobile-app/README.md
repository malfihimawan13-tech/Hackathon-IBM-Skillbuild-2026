# myCITA Mobile

Aplikasi mobile **myCITA (My Career, Income, Target & Achievement)**, "Capai Impian, Tentukan Arah", untuk Android dan iOS, dibuat dengan React Native + Expo (SDK 57).
Aplikasi ini adalah antarmuka; semua proses dan perhitungan dijalankan oleh **backend Langflow** CITA, dan **IBM Bob** terhubung ke backend yang sama lewat MCP.

```
IBM Bob ── MCP ──┐
                 ├──► Langflow (6 flow CITA) ──► database per user_id
Aplikasi ─ HTTP ─┘
```

Karena memakai flow dan database yang sama, data yang diisi di aplikasi langsung bisa ditanyakan ke Bob, dan sebaliknya.

## Fitur

- **Onboarding 3 langkah:** profil & pekerjaan (bisa lebih dari satu), pengeluaran & hutang, kuis gaya uang (opsional). Ada tombol isi data contoh Budi.
- **Beranda:** kartu Roadmap-mu (karier & usaha pilihan), skor kesehatan keuangan, pendapatan/pengeluaran/sisa, saran utama.
- **Karier:** form minat, skill, pengalaman, pendidikan, kota → 3 rekomendasi profesi dengan skor kecocokan, skill gap, gaji per tahap (bersumber), jenjang karier, jalur belajar & biaya, lalu **Lihat dampak ke tujuanku** (kapan tujuan finansial tercapai lewat jalur itu).
- **Usaha:** form minat, skill, modal, mode sampingan/penuh → rekomendasi usaha dengan skenario pesimis/moderat/optimis, balik modal, risiko, roadmap 12 bulan, dan dampaknya ke tujuan.
- **Keuangan:** rincian skor, rasio, arus kas, dana darurat (tab Kondisi); alokasi bulanan, urutan pelunasan hutang, saran, gaya uang (tab Atur); asumsi dan sumber data.
- **Tujuan:** simulasi menabung, kredit, dan kombinasi per tujuan, alternatif agar tepat waktu, dan simulasi "bagaimana kalau".
- **Cari Impian:** cari harga referensi (mobil, motor, rumah subsidi, pernikahan) lalu tambahkan sebagai tujuan.
- **Tanya CITA:** chat dengan Agent Coach di Langflow, dengan riwayat percakapan per pengguna.
- **Profil:** koneksi Langflow, mode demo, tes koneksi, hapus semua data.
- **Mode demo:** aplikasi tetap berjalan tanpa server memakai data contoh dari backend asli, cocok sebagai cadangan saat pitching.

## Menjalankan

Butuh Node.js 20+ dan aplikasi **Expo Go** di HP (Play Store / App Store).

```bash
npm install
npx expo start
```

Pindai QR code yang muncul dengan Expo Go (Android) atau kamera (iOS). HP dan laptop harus di jaringan Wi-Fi yang sama; jika tidak bisa, jalankan `npx expo start --tunnel`.

Aplikasi terbuka dalam **mode demo**. Untuk memakai Langflow, ikuti langkah berikut.

## Menghubungkan ke Langflow

1. **Import flow** CITA ke Langflow (folder `flows/` di paket backend). Setiap flow sudah punya Endpoint Name sesuai namanya, misalnya `4_analisis_keuangan_mycita`.
2. **Buat API key** di Langflow: *Settings → Langflow API Keys → Add New*.
3. **Pastikan HP bisa menjangkau Langflow.** Pilih salah satu:
   - **ngrok (paling mudah, disarankan untuk demo):** `ngrok http 7860`, lalu pakai alamat `https://xxxx.ngrok-free.app`.
   - **Wi-Fi yang sama:** jalankan Langflow agar menerima koneksi dari jaringan (`LANGFLOW_HOST=0.0.0.0`), lalu pakai alamat IP laptop, misalnya `http://192.168.1.10:7860`. Cek IP dengan `ipconfig` (Windows).
   - Port Langflow Desktop bisa berbeda dari 7860; lihat alamat server di konfigurasi MCP Server Langflow.
4. Di aplikasi, buka tab **Profil → Koneksi Langflow**, isi alamat, API key, dan User ID, tekan **Tes koneksi**, lalu matikan **Mode demo**.
5. Isi data lewat **Ubah data keuangan**, atau tekan "Isi dengan data contoh (Budi)" lalu **Simpan & analisis**.

Jika Endpoint Name tidak terbaca (misalnya flow dibuat manual), isi Flow ID masing-masing flow di **Pengaturan lanjutan**.

### Uji koneksi dari laptop

```bash
npm run test:langflow -- http://localhost:7860 <API_KEY>
```

Skrip ini menjalankan alur lengkap memakai kode klien yang sama dengan aplikasi: simpan profil, keuangan, cari harga, tambah target, analisis, what-if, hapus target, dan hapus data.

## Peran IBM Bob

1. **Antarmuka percakapan (MCP):** Bob memanggil keenam flow CITA sebagai tools. Pakai User ID yang sama dengan aplikasi.
2. **Agen pengembang:** buka folder proyek ini di Bob. File `AGENTS.md` memberi Bob konteks lengkap (arsitektur, flow, struktur kode, aturan). Bob dapat memanggil tool Langflow lewat MCP untuk melihat data asli saat mengubah layar. Contoh prompt ada di `BOB_PROMPTS.md`.

## Demo pitching yang disarankan

1. Buka aplikasi di HP, isi data Budi, tunjukkan dashboard (skor 70/100).
2. Buka **Tujuan**, tunjukkan Avanza belum realistis dalam 5 tahun beserta alternatifnya; coba "bagaimana kalau" gaji +2 juta.
3. Pindah ke **Bob** dan tanya: *"Bagaimana kondisi keuangan user budi? Kalau dia mau rumah subsidi, realistis nggak?"* Bob menjawab dari data yang baru diisi di HP.
4. Tunjukkan **Profil → Hapus semua data** sebagai bukti kontrol privasi.

Siapkan mode demo sebagai cadangan jika jaringan bermasalah saat presentasi.

## Membuat APK (opsional)

```bash
npx eas-cli@latest build -p android --profile preview
```

Butuh akun Expo gratis. Untuk build produksi yang memakai alamat `http://` (bukan https), aktifkan cleartext traffic lewat config plugin `expo-build-properties`; dengan ngrok (https) tidak perlu.

## Struktur

```
App.js                    navigasi tab, font, provider
src/api/langflow.js       klien REST Langflow
src/api/demoData.js       data mode demo (dari backend asli)
src/state/AppContext.js   state & aksi aplikasi
src/state/payloads.js     penyusun JSON untuk flow
src/screens/              Home, Keuangan, Tujuan, Cari, Chat, Profil, Onboarding
src/components/           komponen UI & ikon
scripts/test-langflow.mjs uji integrasi ke Langflow
```

*CITA adalah alat edukasi dan perencanaan keuangan, bukan nasihat investasi atau rekomendasi produk keuangan tertentu.*
