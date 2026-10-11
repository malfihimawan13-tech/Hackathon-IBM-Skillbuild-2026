# myCITA Mobile — konteks proyek untuk agen AI (IBM Bob)

myCITA (My Career, Income, Target & Achievement) adalah pendamping AI untuk karier, usaha, dan finansial anak muda Indonesia, dengan tiga jalur: Karier, Usaha, Finansial yang bermuara ke roadmap personal.
Aplikasi ini adalah **antarmuka mobile**. Semua logika dan perhitungan ada di **backend Langflow**; jangan menulis ulang perhitungan keuangan di aplikasi.

## Arsitektur

```
IBM Bob ── MCP ──┐
                 ├──► Langflow (9 flow CITA) ──► SQLite (per user_id)
Aplikasi ─ HTTP ─┘    POST /api/v1/run/<endpoint_name>?stream=false
```

Flow yang tersedia (Endpoint Name = nama flow, juga tersedia sebagai tool MCP di Bob):

| Kunci di aplikasi | Endpoint / tool | Input (JSON sebagai input_value) | Output utama |
|---|---|---|---|
| `profil` | `1_simpan_profil_mycita` | `user_id`, `nama`, `tanggal_lahir`, `kota`, `pendidikan_terakhir`, `status_pernikahan`, `pekerjaan[]`, `pendapatan_tambahan[]`, `pasangan`, `jumlah_anak`, `jumlah_tanggungan`, `psikologi` | `ringkasan`, `peringatan` |
| `keuangan` | `2_simpan_keuangan_mycita` | `user_id`, `pengeluaran{}`, `hutang[]`, `tabungan_saat_ini` | `ringkasan`, `peringatan` |
| `target` | `3_simpan_target_mycita` | `user_id`, `aksi` (`tambah`/`hapus`/`simpan`/`cari_harga`), `target`, `query` | `target[]` atau `hasil[]` |
| `analisis` | `4_analisis_keuangan_mycita` | `user_id`, opsional `simulasi`, `asumsi` | `dashboard`, `kesehatan_keuangan`, `dana_darurat`, `alokasi_bulan_ini`, `strategi_hutang`, `target[]`, `rekomendasi_utama[]`, `psikologi`, `perbandingan` (what-if) |
| `coach` | `7_konsultasi_coach_mycita` | teks `user_id: <id>\npertanyaan: <teks>` | teks jawaban (markdown sederhana) |
| `karier` | `5_eksplorasi_karier_mycita` | `user_id`, `minat[]`, `skill[]`, `pengalaman[]`, `pendidikan_terakhir`, `kota` | `rekomendasi[]` (skor, skill gap, `jalur_pendapatan`, `jalur_belajar`, `simulasi_siap_pakai`) |
| `usaha` | `6_eksplorasi_usaha_mycita` | `user_id`, `minat[]`, `skill[]`, `modal_tersedia`, `waktu` | `rekomendasi[]` (`skenario`, `modal_awal`, `roadmap_usaha`, `simulasi_siap_pakai`) |
| `hapus` | `8_hapus_data_mycita` | `user_id`, `konfirmasi: true` | `pesan` |
| _(referensi)_ | `9_pustaka_database_mycita` | pertanyaan teks singkat (kata kunci) | kutipan teks PDF + sumber + halaman |

Sebelum mengubah layar yang membaca data, panggil tool MCP yang sesuai (misalnya `4_analisis_keuangan_mycita` dengan `{"user_id": "budi"}`) untuk melihat bentuk data asli, lalu sesuaikan kode.

## Struktur kode

- `App.js` — font, provider, navigasi sederhana berbasis state (tab bawah), tombol back Android. **Proyek ini sengaja tidak memakai Expo Router**; jangan memindahkan ke `src/app/` kecuali diminta.
- `src/api/langflow.js` — klien REST Langflow (`runFlow`, `callTool`, `checkHealth`). Satu-satunya tempat yang memanggil jaringan.
- `src/api/demoData.js` — data contoh 3 persona (Budi, Agus, Dini) dalam struktur `{ budi, agus, dini }`, dihasilkan dari backend asli oleh `scripts/ambil-data-demo.mjs`. Dipakai saat Mode Demo.
- `src/state/AppContext.js` — state global, pengaturan (alamat Langflow, API key, user_id, mode demo), aksi (analisis, simpan, cari harga, what-if, chat, hapus). Disimpan dengan AsyncStorage.
- `src/state/payloads.js` — fungsi murni penyusun JSON untuk flow (bisa diuji dengan Node).
- `src/components/ui.js`, `forms.js`, `Icon.js` — komponen UI, widget form (MultiPills, ChipInput, ExperienceList, ImpactCard), ikon SVG.
- Dampak jalur karier/usaha: kirim `simulasi_siap_pakai` ke `analisis` lewat `simulateRoadmap()` di AppContext.
- `src/screens/` — `Home` (Roadmap-mu), `Karier`, `Usaha`, `Keuangan` (Kondisi/Atur), `Tujuan` (opsi A/B/C + what-if), `Cari`, `Chat`, `Profil` (pengaturan & privasi), `Onboarding` (3 langkah).
- `src/theme.js` — token desain: teal `#0F4C47`, marigold `#F2A93B`, ground `#F4F6F5`, ink `#14211F`, font Plus Jakarta Sans. Teks memakai komponen `T` dengan prop `w` (400–800), bukan `fontWeight`.
- `scripts/test-langflow.mjs` — uji integrasi ke Langflow: `npm run test:langflow -- http://localhost:7860 <API_KEY>`.
- `scripts/cek-persona.mjs` — verifikasi angka per persona (flow 4/5/6, baca saja, tanpa flow 1/2/3/8): `npm run cek:persona -- http://localhost:7860 <API_KEY>`.

## Aturan

- Semua angka keuangan berasal dari Langflow. Jangan menghitung atau mengarang angka di aplikasi.
- Teks antarmuka berbahasa Indonesia, kalimat biasa (bukan huruf kapital semua), ramah dan jelas.
- Jangan meminta atau menyimpan data sensitif (nomor rekening, PIN, KTP, alamat lengkap).
- Jangan merekomendasikan produk keuangan tertentu; pertahankan disclaimer edukatif.
- Target sentuh minimal 44px, setiap tombol ikon wajib `accessibilityLabel`.
- Expo SDK 57. Pasang paket dengan `npx expo install <paket>`. Expo berubah tiap versi: cek https://docs.expo.dev/llms.txt sebelum memakai API Expo yang belum ada di proyek.
- Setelah mengubah kode: jalankan `npx expo export --platform android` (cek kompilasi) dan `npm run test:langflow` bila menyentuh `src/api` atau `src/state/payloads.js`.
