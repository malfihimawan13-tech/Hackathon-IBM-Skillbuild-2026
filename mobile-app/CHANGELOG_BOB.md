# CHANGELOG_BOB.md — Riwayat Pengerjaan IBM Bob

myCITA Mobile — riwayat per tahap, file yang diubah, keputusan penting, dan hasil uji.

---

## Tahap 1 — Fondasi (commit `be72596`)

**Ringkasan:** Layar-layar inti pertama: Masuk (pilih persona), Beranda/Home, Roadmap, Karier, Pendidikan, Usaha. Persona Budi dibuat lengkap. Navigasi tab bawah via state (bukan Expo Router).

**File yang diubah/dibuat:**
- `App.js` — navigasi tab bawah berbasis state, tombol back Android
- `src/screens/Home.js` — Beranda dengan ringkasan finansial
- `src/screens/Masuk.js` — pilih persona (Budi / Agus / Dini)
- `src/screens/Karier.js` — eksplorasi karier awal
- `src/screens/Pendidikan.js` — halaman pendidikan untuk Dini
- `src/screens/Roadmap.js` — roadmap personal
- `src/screens/Usaha.js` — eksplorasi usaha
- `src/screens/Profil.js` — pengaturan awal
- `src/api/demoData.js` — data contoh Budi awal
- `src/state/AppContext.js` — state global awal, callTool, mode demo
- `src/state/persona.js` — data persona Budi

**Keputusan penting:**
- Navigasi sengaja tidak memakai Expo Router; tetap berbasis state agar kompatibel dengan SDK lama dan mudah di-debug.
- Semua angka finansial HANYA dari Langflow — tidak ada kalkulasi di aplikasi.
- `src/api/langflow.js` adalah satu-satunya tempat yang memanggil jaringan.

---

## Tahap 2 — Koreksi Data Demo + Tujuan, Keuangan, Chat, Profil (commit `82e5fc4` → `2ec94e7`)

**Ringkasan:** Perbaikan demoData Budi, penambahan layar Tujuan (opsi A/B/C + what-if), Keuangan, Chat, Profil lengkap.

**File yang diubah:**
- `src/api/demoData.js` — koreksi data demo Budi (hapus data salah)
- `src/screens/Chat.js` — layar tanya jawab coach
- `src/screens/Keuangan.js` — kondisi keuangan + formulir atur
- `src/screens/Profil.js` — pengaturan koneksi Langflow, privasi, hapus data
- `src/screens/Tujuan.js` — opsi A (menabung) / B (kredit) / C (kombinasi) + what-if

**Keputusan penting:**
- `whatIf` di AppContext memanggil flow 4 dengan `simulasi` opsional.
- Chat menggunakan `runFlow` (bukan `callTool`) karena output-nya teks bebas, bukan JSON.
- Hapus data hanya menampilkan `Alert.alert` di native; tidak berfungsi di web.

---

## Tahap 3 — Data Demo Per Persona + Perbaikan Bersama (commit `6f64021` → `96f2a8c`)

**Ringkasan:** Data demo diperluas ke 3 persona (Budi, Agus, Dini). `scripts/ambil-data-demo.mjs` dibuat. State per pengguna dipisahkan di AppContext.

**File yang diubah:**
- `scripts/ambil-data-demo.mjs` — skrip otomatis ambil data dari Langflow dan tulis ke demoData.js
- `src/api/demoData.js` — data lengkap 3 persona dari Langflow asli (~7000 baris)
- `src/state/persona.js` — data isian 3 persona (profil, keuangan, skill, input flow)
- `src/state/AppContext.js` — `karierByUser`, `usahaByUser`, `chatByUser` per user_id; `demoForUser()` mencari per persona; migrasi format lama
- `src/components/Icon.js` — ikon tambahan
- `src/screens/Karier.js`, `Keuangan.js`, `Profil.js`, `Roadmap.js`, `Usaha.js` — penyesuaian per persona

**Keputusan penting:**
- DEMO berstruktur `{ budi: {...}, agus: {...}, dini: {...} }` — bukan objek tunggal.
- `demoForUser(uid)` mencari persona dari DEMO[uid], tidak pernah fallback ke persona lain.
- `activeUserId` (bukan `settings.userId`) menjadi sumber kebenaran; settings.userId dihapus dari logika.

---

## Tahap 4 — Halaman Pengeluaran + Skenario Agus/Budi/Dini (commit `768aa22` → `662e117`)

**Ringkasan:** Halaman rincian pengeluaran (Pengeluaran.js), skenario roadmap Budi (DS + kopi), skenario Agus (bengkel + kelontong + gabungan), perbaikan Roadmap Dini.

**File yang diubah:**
- `src/screens/Pengeluaran.js` — (baru) daftar pengeluaran per pos, bisa diedit, kirim ke flow 2
- `src/screens/Home.js` — tombol ke Pengeluaran, penyesuaian tampilan
- `src/screens/Roadmap.js` — skenario multi-jalur per persona
- `src/screens/Usaha.js` — skenario bengkel + kelontong Agus
- `src/screens/Karier.js` — penyesuaian Dini
- `src/state/AppContext.js` — `loadSkenarioBudi`, `loadSkenarioAgus`, `savePengeluaran`
- `src/state/persona.js` — data usaha Agus (omzet, biaya)

**Keputusan penting:**
- `savePengeluaran` selalu menyertakan hutang + tabungan agar flow 2 tidak menghapus data lama (INSERT OR REPLACE).
- `loadSkenarioAgus` memakai `pengembangan_usaha` di flow 4 — bukan flow 6 (Agus tidak menggunakan flow 6).
- Tambahan laba bengkel = 20% laba bersih; kelontong = 25% laba bersih (sesuai persona.js).
- Skenario Budi: dasar → DS → kopi pesimis → DS+kopi pesimis → DS+kopi moderat (6 panggilan flow 4 paralel).

---

## Tahap 5 — Chat Per Persona + Penamaan Tab + Perbaikan UI (commit `defc8a1` → `fc64b23`)

**Ringkasan:** Chat dipisah per persona (chatByUser), tab Karir/Bisnis digabung, tombol "Atur Tujuanmu", form TambahKarir/TambahBisnis, perbaikan Roadmap Agus dan Dini.

**File yang diubah:**
- `src/screens/Chat.js` — chat per pengguna, riwayat tersimpan per user_id
- `src/screens/KarirBisnis.js` — (baru) tab gabungan Karier + Usaha per persona
- `src/screens/TambahKarir.js` — (baru) form eksplorasi karier manual
- `src/screens/TambahBisnis.js` — (baru) form eksplorasi usaha manual
- `src/screens/Roadmap.js` — perbaikan skenario Agus, Dini; penyesuaian tampilan
- `src/screens/Usaha.js` — perbaikan usaha Agus
- `src/state/AppContext.js` — `setChatForUser`, `setChatByUser`, perbaikan `loginAs`
- `src/state/persona.js` — pertanyaan contoh Chat per persona
- `scripts/ambil-data-demo.mjs` — tambahan pengambilan data chat persona

**Keputusan penting:**
- Tab ke-2 Budi: Karier; tab ke-2 Agus: Usaha; tab ke-2 Dini: Karier (dengan sub-halaman Pendidikan).
- `demoChatReply` mencari jawaban rekaman dari `DEMO.<uid>.chat`; pertanyaan bebas tidak dijawab di Mode demo.
- `loginAs` mempertahankan karierByUser/usahaByUser/chatByUser saat ganti pengguna.

---

## Tahap 6 — Uji Integrasi (sesi ini)

**Ringkasan:** Uji `test:langflow`, pembuatan `scripts/cek-persona.mjs`, dokumentasi cara pakai Expo Go, penulisan CHANGELOG dan pembaruan AGENTS.md.

**File yang dibuat/diubah:**
- `scripts/cek-persona.mjs` — (baru) skrip verifikasi angka per persona ke Langflow
- `package.json` — tambah script `"cek:persona"`
- `CHANGELOG_BOB.md` — (baru) file ini
- `AGENTS.md` — diperbarui: 9 flow, demoData.js 3 persona, cek-persona.mjs

---

## Hasil `npm run test:langflow`

Tanggal: sesi ini  
Server: `http://localhost:7860`  
User ID uji: `tes_mobile` (bukan persona nyata)

```
✓ Server Langflow sehat
✓ 1_simpan_profil_mycita → Profil Budi tersimpan. (total penghasilan 9000000)
✓ 2_simpan_keuangan_mycita → total pengeluaran 6350000
✓ 3_simpan_target_mycita (cari_harga) → Toyota Avanza 259200000
✓ 3_simpan_target_mycita (tambah) → 1 target tersimpan (aksi: tambah).
✓ 4_analisis_keuangan_mycita → skor 72, sisa 2650000, Avanza 7 tahun 2 bulan
✓ 4_analisis_keuangan_mycita (what-if) → Avanza 7 tahun 2 bulan → 4 tahun 2 bulan
✓ 5_eksplorasi_karier_mycita → Supply Chain Analyst, Supervisor Gudang, Data Analyst
✓ dampak karier (Supply Chain Analyst) → Avanza 7 tahun 2 bulan → 6 tahun 11 bulan
✓ 6_eksplorasi_usaha_mycita → Bengkel motor rumahan, balik modal moderat 7 bulan
✓ dampak usaha → Avanza 7 tahun 2 bulan → 4 tahun 5 bulan
✓ 3_simpan_target_mycita (hapus) → 0 target tersimpan (aksi: hapus).
✓ 8_hapus_data_mycita → 6 catatan milik 'tes_mobile' telah dihapus permanen.
✓ API key salah ditolak dengan pesan jelas: "API key Langflow ditolak..."
Semua uji integrasi lulus.
```

Peringatan `MODULE_TYPELESS_PACKAGE_JSON` diabaikan sesuai instruksi (jangan menambah `"type": "module"` ke package.json).

---

## Hasil `npm run cek:persona`

Tanggal: sesi ini  
Server: `http://localhost:7860`

```
══ BUDI ══════════════════════════════════════════════════════════════
  ✓ OK  | Budi skor: 100
  ✓ OK  | Budi sisa (Rp): 2000000
  ✓ OK  | Budi Mobil opsi-A (menabung): "22 tahun 1 bulan"
  ✓ OK  | Budi kredit mobil: semua tenor aman=false (3 opsiB + 3 opsiC)
  ✓ OK  | Budi karier Data Scientist skor: 71
  ✗ BEDA| Budi usaha Kopi keliling skor: harapan 80, aktual 70
  ✓ OK  | Budi kopi laba pesimis: 2400000 (kisaran 2000000–2800000)
  ✓ OK  | Budi kopi laba moderat: 4275000 (kisaran 3700000–4800000)
  ✓ OK  | Budi kopi laba optimis: 6600000 (kisaran 5500000–7700000)
  ✓ OK  | Budi kopi balik modal pesimis: "3 bulan"
  ✓ OK  | Budi kopi balik modal moderat: "2 bulan"
  ✓ OK  | Budi kopi balik modal optimis: "2 bulan"
  ✓ OK  | Budi Mobil DS saja: "5 tahun 6 bulan"
  ✗ BEDA| Budi Mobil kopi pesimis saja: harapan "6 tahun", aktual "6 tahun 11 bulan"
  ✓ OK  | Budi Mobil DS+kopi pesimis: "4 tahun 1 bulan"
  ✓ OK  | Budi Mobil DS+kopi moderat: "3 tahun 4 bulan"

══ AGUS ══════════════════════════════════════════════════════════════
  ✓ OK  | Agus skor: 84
  ✗ BEDA| Agus sisa (Rp): harapan 5500000, aktual 6000000
         (panggilan ulang manual: sisa = 5500000 — kemungkinan fluktuasi respons)
  ✓ OK  | Agus tambahan laba bengkel: 2200000
  ✓ OK  | Agus tambahan laba kelontong: 750000
  ✓ OK  | Agus Rumah opsi-A dasar: "22 tahun 2 bulan"
  ✗ BEDA| Agus Rumah + bengkel: harapan "10 tahun", aktual "22 tahun 2 bulan"
  ✗ BEDA| Agus Rumah + kelontong: harapan "14 tahun 8 bulan", aktual "22 tahun 2 bulan"
  ✗ BEDA| Agus Rumah + gabungan: harapan "8 tahun 8 bulan", aktual "22 tahun 2 bulan"
  ✗ BEDA| Agus harga rumah realistis (harapan ±515.000.000): aktual 327000000
         (sesudah = sebelum di semua skenario pengembangan_usaha → backend tidak
          mengubah waktu_tercapai opsi_a untuk simulasi pengembangan_usaha; mungkin
          perlu update flow 4 di Langflow)
  ✓ OK  | Agus Rumah realistis: "7 tahun"

══ DINI ══════════════════════════════════════════════════════════════
  ✓ OK  | Dini skor: 59
  ✓ OK  | Dini sisa (Rp): 150000
  ✗ BEDA| Dini jurusan S1 Sistem Informasi skor: harapan 90, aktual 88
  ✗ BEDA| Dini jurusan S1 Teknik Informatika skor: harapan 89, aktual 85
  ✗ BEDA| Dini karier Data Analyst skor: harapan 75, aktual 69
  ✗ BEDA| Dini karier Software Engineer skor: harapan 73, aktual undefined
         (Software Engineer tidak muncul di rekomendasi utama saat ini)
  ✗ BEDA| Dini karier UI/UX Designer skor: harapan 73, aktual 69
```

**Catatan perbedaan yang teridentifikasi (tidak diubah, hanya dilaporkan):**

| Persona | Item | Harapan | Aktual | Kemungkinan Penyebab |
|---|---|---|---|---|
| Budi | Kopi keliling skor | 80 | 70 | Skor Langflow berubah (bisa karena data budi diperbarui di sesi lain) |
| Budi | Mobil kopi pesimis saja | "6 tahun" | "6 tahun 11 bulan" | Perubahan kalkulasi flow 4 |
| Agus | Sisa pertama | 5.500.000 | 6.000.000 | Fluktuasi; panggilan ulang = 5.500.000 |
| Agus | Skenario bengkel/kelontong/gabungan | berubah | sama dengan dasar | flow 4 tidak mengubah opsi_a saat simulasi pengembangan_usaha |
| Agus | Harga rumah realistis | ~515.000.000 | 327.000.000 | Turunan dari skenario gabungan yang sama dengan dasar |
| Dini | Skor jurusan SI/TI | 90/89 | 88/85 | Pembaruan bobot di flow 5 |
| Dini | Skor karier DA/SE/UIUX | 75/73/73 | 69/–/69 | Software Engineer tidak lagi di top-3; skor berubah |

---

## Keterbatasan yang Diketahui

1. **Grafik / chart bersifat ilustratif** — tidak ada library chart (React Native Charts / Victory Native). Semua grafik adalah representasi visual sederhana dari data teks Langflow.

2. **Chat butuh 20–60 detik** — flow 7 (coach) memanggil LLM; latensi tinggi wajar. Timeout di `runFlow` diset 120 detik untuk chat. Di Mode demo, jawaban tersedia instan hanya untuk pertanyaan rekaman.

3. **Mode demo vs live** — angka di Mode demo diambil dari `demoData.js` (hasil Langflow pada tanggal generate). Jika data Langflow berubah, Mode demo tidak otomatis diperbarui; jalankan kembali `scripts/ambil-data-demo.mjs`.

4. **Skenario Agus (pengembangan_usaha)** — saat uji, flow 4 mengembalikan `sesudah` sama dengan `sebelum` untuk semua simulasi `pengembangan_usaha`. Kemungkinan perlu pembaruan versi flow 4 di Langflow.

5. **Alert.alert tidak tampil di web** — konfirmasi hapus data harus diuji di HP native (Expo Go), bukan di browser.

6. **Tunnel diperlukan di HP** — Langflow Desktop hanya menerima koneksi dari localhost; di HP perlu IP LAN atau ngrok/cloudflared agar aplikasi bisa terhubung.
