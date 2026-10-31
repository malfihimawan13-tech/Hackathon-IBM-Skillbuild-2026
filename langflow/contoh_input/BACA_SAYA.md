# Urutan flow dan file input

Angka di depan nama file = nomor flow tujuannya. Buka flow bernomor sama di Langflow → **Playground** → tempel isi file → kirim.

| No | Flow di Langflow | File input (Budi) | File input (Agus) | File input (Dini) |
|---|---|---|---|---|
| 1 | `1_simpan_profil_mycita` | `1_profil_budi.json` | `1_profil_agus.json` | `1_profil_dini.json` |
| 2 | `2_simpan_keuangan_mycita` | `2_keuangan_budi.json` | `2_keuangan_agus.json` | `2_keuangan_dini.json` |
| 3 | `3_simpan_target_mycita` | `3_target_budi.json` | `3_target_agus.json` | (Dini belum punya target) |
| 4 | `4_analisis_keuangan_mycita` | `4_analisis_budi.json`, `4_simulasi_jalur_data_scientist_budi.json`, `4_simulasi_usaha_kopi_budi.json`, `4_simulasi_data_scientist_plus_usaha_pesimis_budi.json`, `4_simulasi_data_scientist_plus_usaha_budi.json`, `4_simulasi_what_if_budi.json` | `4_analisis_agus.json`, `4_skenario_agus_B_bengkel.json`, `4_skenario_agus_C_kelontong.json`, `4_skenario_agus_D_gabungan.json`, `4_skenario_agus_E_rumah_515jt.json` | `4_analisis_dini.json` |
| 5 | `5_eksplorasi_karier_mycita` | `5_karier_budi.json` | – | `5_karier_dini.json` |
| 6 | `6_eksplorasi_usaha_mycita` | `6_usaha_budi.json` (usaha kopi sampingan, modal Rp3 jt) | – | – |
| 7 | `7_konsultasi_coach_mycita` | kalimat dari `7_pertanyaan_coach.txt` | kalimat dari `7_pertanyaan_coach.txt` | kalimat dari `7_pertanyaan_coach.txt` |
| 9 | `9_pustaka_database_mycita` | kata kunci dari `9_pertanyaan_pustaka.txt` | (sama) | (sama) |
| 8 | `8_hapus_data_mycita` | `8_hapus_budi.json` | `8_hapus_agus.json` | `8_hapus_dini.json` |

Tambahan untuk flow 3: `3_cari_harga.json` (mencari harga referensi, misalnya Avanza).

## Flow 9: database PDF
Sebelum memakai flow 9, buka flow `9_pustaka_database_mycita`, klik komponen **Read File**, upload `data/myCITA_Database_Eksternal.pdf`, lalu simpan flow. Setelah itu flow 9 (dan tool Pustaka di dalam flow 7) bisa mencari isi PDF. Lakukan hal yang sama untuk komponen Read File di flow 7.

## Jalan pintas: database contoh
Ingin langsung mencoba flow 4–9 tanpa menjalankan flow 1–5? Salin `data/mycita_contoh_3_persona.db` menjadi `%USERPROFILE%\.mycita\mycita.db` (lihat README bagian Database pengguna).

## Aturan urutan
- **1 → 2 → 3 wajib lebih dulu** (mengisi data). Setelah itu flow 4, 5, 6, 7 boleh diulang dalam urutan apa pun.
- Semua file 4 untuk satu persona memakai data yang sama, jadi bisa dicoba bergantian tanpa menyimpan ulang.
- Flow 8 menghapus semua data persona itu. Setelahnya mulai lagi dari flow 1.

## Sebelum mencoba flow 7 (Coach)
Jalankan dulu flow **1–3** dan flow **5** (`5_karier_budi.json`, `5_karier_dini.json`) untuk persona yang akan ditanyakan. Coach otomatis memakai data karier yang tersimpan, termasuk skill dan levelnya, sehingga jawabannya sama dengan deck walaupun pertanyaanmu singkat.
- Budi: mobil 22 th 1 bl → 5 th 6 bl lewat jalur Data Scientist.
- Dini: jurusan S1 Sistem Informasi 90, Teknik Informatika 89, plus kampus teratas (UI, UGM, ITB, ...).
- Agus: Coach memakai simulasi `pengembangan_usaha` (bengkel +20%, kelontong +25%) → 10 th, 14 th 8 bl, gabungan 8 th 8 bl, lalu rumah ±Rp515 jt tepat 7 th.

## Hasil yang seharusnya muncul (sama dengan pitch deck)
- **Budi:** skor 100; mobil 22 th 1 bl (tetap kerja) → 5 th 6 bl (jalur Data Scientist) → 4 th 1 bl (Data Scientist + usaha kopi sampingan pesimis, file `4_simulasi_data_scientist_plus_usaha_pesimis_budi.json`); karier #1 Data Scientist 71; usaha #1 Kopi keliling 80.
- **Agus:** skor 84; rumah A 22 th 2 bl, B 10 th, C 14 th 8 bl, D 8 th 8 bl, E 7 th.
- **Dini:** skor 59, sisa Rp150 rb; karier Data Analyst 75, Software Engineer 73, UI/UX 73; jurusan S1 Sistem Informasi 90, Teknik Informatika 89.

Cek otomatis semuanya sekaligus: `python3 tests/skenario_tiga_persona.py`
