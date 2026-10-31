# myCITA — My Career, Income, Target & Achievement
**Capai Impian, Tentukan Arah**

Pendamping AI untuk karier, usaha, dan finansial anak muda Indonesia. myCITA menghubungkan arah karier atau usaha dengan potensi pendapatan, lalu menghitung kapan tujuan hidup (rumah, kendaraan, menikah, kuliah) bisa tercapai.

## Isi paket
| Folder / file | Isi |
|---|---|
| `langflow/flows/` | 9 flow Langflow bernomor, siap di-import |
| `langflow/contoh_input/` | Input uji bernomor sesuai flow, untuk 3 persona (panduan: `BACA_SAYA.md`) |
| `langflow/components/` | Kode sumber komponen myCITA (sudah tertanam di file flow; disertakan agar mudah dibaca) |
| `langflow/prompt/` | Instruksi Agent Coach (flow 7) |
| `langflow/tests/` | Uji otomatis untuk memeriksa angka ketiga persona |
| `langflow/README.md` | Dokumentasi teknis lengkap |
| `data/mycita_contoh_3_persona.db` | Database contoh berisi 3 persona; salin ke `%USERPROFILE%\.mycita\mycita.db` untuk langsung mencoba tanpa mengisi data |
| `data/myCITA_Database_Eksternal.pdf` | Database eksternal (setiap angka bersumber); di-upload ke komponen Read File flow 9 dan flow 7 |
| `ibm-bob/` | Prompt mode myCITA untuk IBM Bob dan contoh konfigurasi MCP (tanpa API key) |
| `mobile-app/` | Aplikasi mobile React Native (Expo), web dan Android |
| `prototipe-interaktif/index.html` | Prototipe 3 persona yang bisa digulir dan diklik, berjalan offline di browser |

## Menjalankan
1. **Langflow:** import 9 file di `langflow/flows/` → upload `data/myCITA_Database_Eksternal.pdf` di komponen Read File (flow 9 dan flow 7) → isi API key Gemini di Agent flow 7.
2. **Isi data persona:** jalankan flow 1 → 2 → 3, lalu flow 5, dengan file bernomor sama di `langflow/contoh_input/`. Jalan pintas: salin `data/mycita_contoh_3_persona.db` menjadi `%USERPROFILE%\.mycita\mycita.db` (tutup Langflow dulu).
3. **Coba:** flow 4 (analisis dan simulasi), flow 5 (karier), flow 6 (usaha), flow 9 (cari di database PDF), atau flow 7 (Coach) dengan kalimat di `7_pertanyaan_coach.txt`.
4. **IBM Bob:** aktifkan MCP Server di project Langflow (tool `_1`–`_6`, `_8`, `_9`), tambahkan ke Bob sesuai `ibm-bob/mcp_settings_contoh.json`, lalu buat mode myCITA dengan isi `ibm-bob/BOB_PROMPTS.md`.
5. **Aplikasi mobile:** `cd mobile-app` → `npm install` → salin `auth/.env.example` menjadi `.env` (opsional, hanya untuk login) → `npx expo start --web`. Isi alamat Langflow dan API key di menu Pengaturan aplikasi. Mode demo memakai data contoh.
6. **Uji otomatis (opsional):** dari folder `langflow/`, jalankan `python tests/skenario_tiga_persona.py`.

## Tiga persona demo
| Persona | Kebutuhan | Hasil kunci |
|---|---|---|
| Dini, 17, SMA, Bandung | Career discovery | Jurusan SI 90 / Informatika 89, kampus UI–UGM–ITB (dan Unpad, Telkom di Bandung), Data Analyst 75 |
| Agus, 38, bengkel + kelontong istri | Usaha keluarga + rumah | Rumah Rp600 jt: 22 th 2 bl (menabung) → 8 th 11 bl (kedua usaha berkembang, laba naik 20%); budget maksimal Rp505 jt agar tepat 7 tahun |
| Budi, 29, operator produksi | Career switch + usaha sampingan | Mobil: 22 th 1 bl → 5 th 6 bl (Data Scientist) → 4 th 1 bl (+ kopi sampingan, skenario pesimis) |

## Prinsip
Angka dihitung oleh komponen Python dari data bersumber, bukan ditebak AI. AI (Gemini di Agent, IBM Bob) memahami pertanyaan, memilih tool, dan menjelaskan hasilnya. Penjaga Fidelitas memeriksa bahwa angka dalam jawaban AI sama dengan hasil hitung. Estimasi bersifat edukatif, bukan nasihat investasi.

## Keamanan
Tidak ada API key di repositori ini. Kunci Gemini disimpan di dalam Langflow, dan file `.env` tidak diunggah.
