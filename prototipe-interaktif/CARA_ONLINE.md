# Cara membuat prototipe myCITA bisa dibuka lewat tautan (tanpa claude.ai)

Folder ini berisi `index.html`, yaitu prototipe interaktif ketiga persona (Dini, Agus, Budi) yang bisa di-scroll dan diklik. Pilih salah satu cara berikut.

## Pilihan 1 · Netlify Drop (paling cepat, gratis, ±1 menit)
1. Buka https://app.netlify.com/drop
2. Seret (drag & drop) **folder `mycita-prototipe`** ini ke halaman tersebut.
3. Netlify memberi tautan seperti `https://nama-acak.netlify.app`. Daftar akun gratis agar tautannya permanen, lalu ganti namanya (misalnya `mycita-demo`) di Site settings.

## Pilihan 2 · GitHub Pages (gratis, cocok jika repo hackathon ada di GitHub)
1. Buat repository baru (misalnya `mycita-prototipe`), unggah `index.html`.
2. Buka **Settings → Pages**, pilih branch `main` dan folder `/ (root)`, lalu Save.
3. Tautan aktif dalam 1–2 menit: `https://USERNAME.github.io/mycita-prototipe/`

## Pilihan 3 · Vercel
1. Buka https://vercel.com/new, impor repo GitHub tadi atau unggah folder ini.
2. Deploy tanpa pengaturan tambahan; tautan berbentuk `https://mycita-prototipe.vercel.app`.

## Pilihan 4 · Tanpa internet (cadangan saat presentasi)
Simpan `index.html` di laptop presentasi, lalu klik dua kali untuk membuka di browser. Semua fitur scroll dan klik tetap berjalan (font akan diganti font bawaan jika offline).

## Memasang di PowerPoint
- Pilih tombol atau teks "Buka prototipe interaktif" di slide, lalu **Insert → Link** dan tempel tautan Netlify/GitHub Pages/Vercel.
- Untuk cadangan offline: Insert → Link → pilih file `index.html` di laptop (simpan file di folder yang sama dengan file PPT agar tautannya tidak putus).
- Saat slide show, klik tombolnya: prototipe terbuka di browser, lalu kembali ke PowerPoint dengan Alt+Tab.
