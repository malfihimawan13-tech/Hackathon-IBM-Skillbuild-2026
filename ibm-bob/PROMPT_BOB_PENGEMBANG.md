# Membangun ulang prototipe myCITA dengan IBM Bob (agen pengembang)

Tujuan: Bob mewujudkan desain prototipe 3 persona, dimulai dari layar Masuk untuk memilih pengguna, (Budi, Agus, Dini) menjadi layar sungguhan di aplikasi React Native `mobile-app/`, dengan data asli dari 9 flow Langflow. Prototipe `index.html` dipakai sebagai acuan desain.

## Persiapan (sekali)
1. Salin `prototipe-interaktif/index.html` ke `mobile-app/design/referensi_prototipe.html`.
2. Di Bob: **File → Open Folder → `mobile-app`**. Bob otomatis membaca `AGENTS.md`.
3. Pilih mode **Agent** bawaan (BUKAN mode myCITA, karena mode itu tidak bisa mengedit file).
4. Simpan titik awal agar perubahan Bob bisa dibuktikan:
   ```
   git init
   git add .
   git commit -m "Titik awal sebelum dikerjakan IBM Bob"
   ```
5. Pastikan Langflow Desktop terbuka dan database 3 persona sudah terisi (flow 1-5, atau salin `data/mycita_contoh_3_persona.db`).

Setelah setiap tahap selesai dan dicek, simpan dengan `git commit -m "IBM Bob: <nama tahap>"`. Riwayat commit ini adalah bukti kontribusi Bob.

---

## Tahap 1 - Layar Masuk: pilih 1 dari 3 pengguna
```
Baca AGENTS.md dan design/referensi_prototipe.html (layar masuk ada di <section data-id="masuk">, layar lain di data-id="budi/Main" dan seterusnya).
Buat layar Masuk sebagai layar pertama aplikasi, mengikuti desain section data-id="masuk":
- Logo myCITA, judul "Selamat datang", dan tiga kartu pengguna: Budi (user_id "budi", 29 th, Tangerang, "Career switch + usaha sampingan"), Agus (user_id "agus", 38 th, Bekasi, "Usaha keluarga + rumah"), Dini (user_id "dini", 17 th, Bandung, "Career discovery (pelajar)").
- Menekan kartu = masuk sebagai pengguna itu (tanpa kata sandi), lalu buka Beranda. Data diambil dari Langflow memakai user_id tersebut, karena datanya sudah tersimpan di database myCITA.
- Simpan pengguna aktif di AppContext (dan AsyncStorage agar tetap masuk saat aplikasi dibuka lagi). Semua panggilan Langflow memakai user_id pengguna aktif.
- Di layar Profil, tambahkan tombol "Ganti pengguna" yang kembali ke layar Masuk.
- Tampilkan catatan kecil: "Akun contoh untuk demo, tanpa kata sandi. Tanpa KTP, rekening, atau PIN."
Buat file src/screens/Masuk.js dan src/state/persona.js. Jelaskan file yang diubah.
- Setelah pengguna dipilih, langsung panggil flow 4_analisis_keuangan_mycita untuk user_id itu dan simpan hasilnya, agar Beranda dan Keuangan langsung terisi. Jangan tampilkan onboarding untuk ketiga pengguna contoh ini, karena datanya sudah ada.
- Tambahan: saat dijalankan di web, terminal menampilkan error di src/components/Icon.js baris 50 pada komponen <Svg>. Perbaiki juga agar tidak muncul di web, tanpa mengubah tampilan ikon dan tanpa merusak versi Android/iOS.
```

## Agar tidak terkena limit chat di BOB, buka chat baru setiap tahapan baru akan di kirim awali dengan prompt ini
```
Konteks: aplikasi myCITA (React Native/Expo) di folder ini. Baca AGENTS.md. Sudah selesai di sesi sebelumnya: layar Masuk (pilih budi/agus/dini), Beranda, Roadmap, Karier, Pendidikan, Usaha, AppContext per persona, dan skrip scripts/ambil-data-demo.mjs. Acuan desain: design/referensi_prototipe.html. Langflow berjalan di http://localhost:7860, API key: API_KEY_KAMU.
Aturan: angka di daftar cek adalah tampilan yang sudah dibulatkan. Jangan mengubah data agar cocok dengan daftar cek. Jangan menulis data keuangan secara manual. Untuk mengecek angka, matikan Mode demo dan pakai Langflow. Jika ada angka berbeda, laporkan tanpa mengubah data. Kerjakan hanya tugas di bawah ini.
```

## Tahap 2 - Beranda per persona
```
Ubah src/screens/Home.js agar mengikuti desain section data-id="budi/Main", "agus/Main", dan "dini/Main" di design/referensi_prototipe.html.
- Budi dan Agus: kartu skor kesehatan, ringkasan pendapatan/pengeluaran/sisa, donat pengeluaran, kartu hutang dan dana darurat, kartu tujuan, dan kartu roadmap mini.
- Agus: dua kartu usaha (bengkel Agus dan kelontong istri: omzet, biaya, bersih, margin).
- Dini: profil kemampuan (level skill), minat, rekomendasi jurusan dengan skor, dan kampus tujuan.
ATURAN: semua angka diambil dari Langflow (flow 4_analisis_keuangan_mycita dan 5_eksplorasi_karier_mycita). Jangan menulis angka keuangan langsung di kode. Grafik riwayat 6 bulan boleh memakai data contoh, tetapi wajib diberi label "Contoh data".
Pakai komponen yang sudah ada di src/components/ui.js dan warna di src/theme.js.
- Data isian pengguna yang tidak disimpan Langflow boleh ditaruh di src/state/persona.js sebagai data profil persona (bukan hasil hitung):
  Agus: bengkel omzet 18.000.000, biaya 7.000.000; kelontong istri omzet 8.000.000, biaya 5.000.000. Laba bersih dan margin dihitung di kode dari angka ini (bengkel 61%, kelontong 37,5%).
  Dini: skill Microsoft Office (Menengah), Canva (Menengah), Bahasa Inggris (Menengah), Basic Python (Dasar), Public speaking (Cukup); minat Teknologi, Matematika, Desain, Memecahkan masalah.
- Untuk Dini, panggil flow 5_eksplorasi_karier_mycita dengan {"user_id": "dini", "status": "pelajar"} agar rekomendasi jurusan (SI 90, Informatika 89) dan daftar kampus diambil dari Langflow.
- Setelah selesai, cek bahwa angka di Beranda sama dengan Langflow: Budi skor 100 dan sisa Rp2 jt, Agus skor 84 dan sisa Rp5,5 jt, Dini skor 59 dan sisa Rp150 rb.
```

## Tahap 3 - Roadmap
```
Buat src/screens/Roadmap.js mengikuti desain section data-id="budi/Roadmap", "agus/Roadmap", dan "dini/Roadmap".
- Garis waktu proporsional per fase (abu-abu = persiapan, hijau = berpenghasilan/usaha), penanda tujuan tercapai, dan garis tenggat.
- Daftar fase dengan rentang bulan dan perkiraan pendapatan (dari "roadmap_karier" hasil flow 5).
- Grafik batang perbandingan skenario (hijau = sebelum tenggat, oranye = lewat tenggat).
Data:
- Budi: flow 4 dasar, lalu flow 4 dengan simulasi_siap_pakai profesi Data Scientist dari flow 5.
- Agus: flow 4 dengan simulasi "pengembangan_usaha" untuk bengkel +20%, kelontong +25%, dan gabungan; lalu target harga dari "harga_maksimal_terjangkau_sesuai_tenggat".
- Dini: "roadmap_karier" dari flow 5 (mode pelajar).
Tambahkan tab Roadmap di navigasi bawah (App.js). Angka harus sama dengan hasil Langflow.
- Budi, lengkapi skenario agar sama dengan prototipe:
  (1) Data Analyst: simulasi_siap_pakai profesi id "data_analyst" dari hasil flow 5;
  (2) usaha kopi: panggil flow 6_eksplorasi_usaha_mycita dengan {"user_id": "budi", "minat": ["kopi", "minuman", "kuliner"], "skill": ["meracik kopi", "pelayanan pelanggan"], "modal_tersedia": 3000000, "waktu": "sampingan"}, ambil rekomendasi pertama (Kopi keliling), lalu flow 4 dengan simulasi_siap_pakai_per_skenario.pesimis;
  (3) gabungan: flow 4 dengan "jadwal_pendapatan" dari simulasi Data Scientist ditambah "pendapatan_tambahan_jadwal" dan "biaya_awal" dari skenario pesimis, lalu sekali lagi dengan skenario moderat.
- Agus: ambil laba_bersih bengkel (11.000.000) dan kelontong (3.000.000) dari src/state/persona.js. Tenggat rumah 7 tahun (84 bulan).
- Dini: bagian skenario diganti kartu tiga pilihan karier (Data Analyst, Software Engineer, UI/UX Designer) dengan skor dan gaji awal dari flow 5.
- Navigasi bawah tetap 5 tab agar tidak penuh: Beranda, Karier (Budi dan Dini) atau Usaha (Agus), Roadmap, Keuangan, Tanya. Halaman Usaha Budi dibuka dari Beranda.
- Setelah selesai, cek angkanya sama dengan Langflow:
  Budi (mobil): tetap kerja 22 th 1 bl, Data Scientist 5 th 6 bl, Data Analyst 6 th, kopi pesimis 6 th 11 bl, Data Scientist + kopi pesimis 4 th 1 bl (menikah 2 th 8 bl), Data Scientist + kopi moderat 3 th 4 bl.
  Agus (rumah Rp600 jt): sekarang 22 th 2 bl, bengkel 10 th, kelontong 14 th 8 bl, gabungan 8 th 8 bl, lalu budget Rp515 jt tepat 7 th.
```

## Tahap 4 - Karier dan Usaha
```
Sesuaikan src/screens/Karier.js dan src/screens/Usaha.js dengan desain section "budi/Karier", "dini/Karier", "dini/Pendidikan", "agus/Usaha", dan "budi/Usaha".
- Karier Budi: level skill, rekomendasi (Data Scientist sebagai target), skill gap, gaji per jenjang dengan sumber, portofolio.
- Dini: mode pelajar, jurusan dengan skor, daftar kampus (QS adalah peringkat dunia; tandai kampus di kota pengguna), biaya kuliah.
- Usaha Agus: dua usaha yang sudah berjalan dan simulasi pengembangan (flow 4 "pengembangan_usaha"), BUKAN flow 6.
- Usaha Budi: usaha baru kopi sampingan dari flow 6, tampilkan tiga skenario dan pakai skenario pesimis sebagai acuan.
- Level skill Budi adalah data isian pengguna; simpan di src/state/persona.js: Python (Menengah), SQL (Menengah), Pandas (Menengah), Data visualization (Menengah), Excel (Mahir), Machine learning (Dasar), Statistics (Dasar), AI (Dasar).
- Karier Budi: panggil flow 5 dengan {"user_id": "budi", "target_profesi": "Data Scientist"}; skill gap dan rekomendasi diambil dari hasilnya.
- Dini: buat halaman terpisah "Jurusan & kampus" (src/screens/Pendidikan.js) yang dibuka dari layar Karier Dini, mengikuti section "dini/Pendidikan". Data dari flow 5 dengan {"user_id": "dini", "status": "pelajar"}.
- Usaha Agus: omzet dan biaya diambil dari src/state/persona.js (bengkel 18 jt / 7 jt, kelontong 8 jt / 5 jt); tambahan laba dari hasil flow 4 "pengembangan_usaha".
- Usaha Budi: pakai input flow 6 yang sama seperti di Tahap 3 (kopi, modal 3.000.000, sampingan).
- Gunakan ulang fungsi pengambil data dan hasil yang sudah dibuat di Tahap 3 (simpan di AppContext) agar Langflow tidak dipanggil berulang untuk data yang sama.
- Setelah selesai, cek angkanya sama dengan Langflow:
  Karier Budi: Data Scientist kecocokan 71, perlu diperdalam statistik & probabilitas dan machine learning, gaji Rp7-11 jt / Rp8-19 jt / Rp20-35 jt.
  Dini: S1 Sistem Informasi 90, S1 Teknik Informatika 89; kampus UI (QS 189), UGM (224), ITB (255); ITB, Unpad, dan Telkom University ditandai di Bandung.
  Usaha Agus: bengkel +Rp2.200.000, kelontong +Rp750.000, gabungan +Rp2.950.000 per bulan.
  Usaha Budi: Kopi keliling kecocokan 80; laba Rp2,4 jt / Rp4,28 jt / Rp6,6 jt; balik modal 3 / 2 / 2 bulan.
```

## Tahap 5 - Tujuan, Keuangan, Tanya, Profil
```
Sesuaikan src/screens/Tujuan.js, Keuangan.js, Chat.js, dan Profil.js dengan section "*/Tujuan", "*/Keuangan", "*/Chat", dan "*/Profil" di referensi.
- Opsi kredit yang hasil Langflow-nya "aman": false harus ditampilkan sebagai "belum aman", bukan direkomendasikan.
- Chat memakai flow 7_konsultasi_coach_mycita lewat callTool yang sudah ada.
- Profil menampilkan data persona dan tombol hapus data (flow 8) dengan konfirmasi.
- Tombol hapus data (flow 8) untuk ketiga akun contoh: wajib konfirmasi dua kali dengan peringatan bahwa data contoh akan terhapus permanen dan perlu diisi ulang. Saat Mode demo aktif, tombol ini nonaktif dan tidak memanggil Langflow.
- Jangan menghapus bagian pengaturan koneksi Langflow (alamat, API key, Mode demo, Tes koneksi) dan tombol "Ganti pengguna" di Profil.
- Tujuan dan Keuangan: angka diambil dari flow 4_analisis_keuangan_mycita untuk pengguna yang sedang masuk. Grafik riwayat 6 bulan boleh memakai contoh data, tetapi wajib diberi label "Contoh data".
- Chat: flow 7 memakai Gemini dan bisa butuh 20–60 detik. Tampilkan indikator loading, dan jika gagal atau terlalu lama, tampilkan pesan yang jelas tanpa membuat jawaban sendiri.
- Setelah selesai, cek dengan Mode demo mati: Keuangan Budi skor 100, Agus skor 84, Dini skor 59; Tujuan Budi mobil 22 tahun 1 bulan; opsi kredit mobil Budi tampil "belum aman".
```

## Tahap 6 - Uji
```
Jalankan npm install lalu npm run test:langflow -- http://localhost:PORT API_KEY dan perbaiki jika ada yang gagal.
Lalu jalankan npx expo start dan jelaskan cara saya mencobanya di HP dengan Expo Go.
Tuliskan ringkasan semua perubahan yang kamu buat di file CHANGELOG_BOB.md.
```

## Tahap 7 - Data demo offline dan APK Android
Bagian ini membuat aplikasi bisa dipasang di HP Android sebagai file APK, dan tetap bisa didemokan tanpa internet.

### 7a. Data Mode Demo untuk 3 persona
```
Pastikan Langflow sedang berjalan dan database berisi persona budi, agus, dan dini.
Buat skrip scripts/ambil-data-demo.mjs yang memanggil Langflow (pakai fungsi di src/api/langflow.js) untuk ketiga persona:
- budi: flow 4 dasar, flow 5 (5_karier_budi), flow 4 dengan simulasi_siap_pakai Data Scientist, flow 6 (usaha kopi), dan flow 4 gabungan karier + usaha skenario pesimis;
- agus: flow 4 dasar, flow 4 dengan pengembangan_usaha (bengkel +20%, kelontong +25%, gabungan), dan flow 4 dengan target sesuai harga_maksimal_terjangkau_sesuai_tenggat;
- dini: flow 4 dasar dan flow 5 (5_karier_dini, mode pelajar).
Simpan semua hasilnya ke src/api/demoData.js dengan struktur per persona, lalu ubah AppContext agar Mode Demo memakai data persona yang sedang masuk.
Jalankan skripnya, lalu pastikan Mode Demo menampilkan angka yang sama dengan saat terhubung ke Langflow.
```

### 7b. Siapkan konfigurasi build
```
Siapkan aplikasi untuk dibuat menjadi APK Android dengan EAS Build:
- Di app.json: ubah "slug" menjadi "mycita", "android.package" dan "ios.bundleIdentifier" menjadi "id.mycita.app", "description" menjadi "myCITA - My Career, Income, Target & Achievement. Capai Impian, Tentukan Arah.", dan tambahkan "android.versionCode": 1.
- Pasang expo-build-properties (npx expo install expo-build-properties) dan tambahkan plugin dengan android.usesCleartextTraffic = true, agar aplikasi bisa memanggil Langflow lewat alamat http di jaringan lokal.
- Buat eas.json dengan profil "preview" yang menghasilkan file APK (android.buildType = "apk").
- Jalankan npx expo-doctor dan perbaiki masalah yang muncul.
Jelaskan setiap perubahan.
```

### 7c. Buat APK (dijalankan bersama Bob di terminal)
```
npm install -g eas-cli
eas login                      # masuk dengan akun Expo gratis dari expo.dev
eas build -p android --profile preview
```
Proses build berjalan di server Expo (biasanya 10-20 menit). Setelah selesai, terminal menampilkan tautan untuk mengunduh APK. Buka tautan itu di HP Android, unduh, lalu pasang (izinkan "instal dari sumber tidak dikenal" jika diminta).

### 7d. Menyambungkan APK di HP ke Langflow di laptop
HP tidak bisa memakai alamat `localhost`, karena alamat itu menunjuk ke HP sendiri. Pilih salah satu:
- **Wi-Fi yang sama:** isi alamat Langflow dengan IP laptop, misalnya `http://192.168.1.10:7860` (cek IP dengan perintah `ipconfig` di PowerShell). Cara ini hanya berhasil jika Langflow menerima koneksi dari perangkat lain di jaringan; jika tidak bisa tersambung, pakai cara berikutnya.
- **Tunnel (paling andal):** jalankan `ngrok http 7860` (atau `cloudflared tunnel --url http://localhost:7860`), lalu isi alamat Langflow di aplikasi dengan tautan https yang muncul.
- **Tanpa internet:** aktifkan **Mode Demo** di aplikasi. Data dari Tahap 7a dipakai, jadi demo tetap berjalan walaupun Langflow atau internet bermasalah.

Masukkan alamat dan API key Langflow di halaman pengaturan aplikasi, lalu tekan "Tes koneksi".

---

## Tips
- Kerjakan satu tahap per task Bob. Periksa hasilnya di HP (Expo Go) sebelum lanjut, lalu commit.
- Jika Bob mengusulkan perubahan yang tidak sesuai, tolak, lalu beri koreksi singkat di task yang sama.
- Jika kredit terbatas, prioritaskan Tahap 1, 2, 3, dan 7a (layar Masuk, beranda, roadmap, data demo offline). Tahap 7b-7c (APK) dikerjakan jika ingin aplikasi terpasang di HP saat demo.
- Di pitch, sebutkan dengan jujur bagian yang dikerjakan Bob (lihat `CHANGELOG_BOB.md` dan riwayat commit).
