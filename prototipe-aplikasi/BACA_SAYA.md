# Prototipe aplikasi myCITA (satu file HTML)

Mengubah aplikasi yang berjalan di localhost:8081 menjadi satu file `index.html`
dengan tampilan seperti prototipe interaktif: panel penjelasan di kiri, aplikasi asli di dalam bingkai HP di kanan.
File bisa dibuka dengan klik dua kali (tanpa server, tanpa internet) dan berjalan dalam Mode demo.

## Membuat file
Dari folder mobile-app (PowerShell):
    npx expo export --platform web
    node ..\prototipe-aplikasi\buat-prototipe.mjs
Hasil: prototipe-aplikasi\index.html

## Menambahkan tautan web + QR (opsional, untuk juri yang ingin mencoba di HP tanpa instal)
1. Unggah prototipe-aplikasi\index.html ke https://app.netlify.com/drop (seret filenya). Salin tautan https yang muncul.
2. Buka tautan itu di Microsoft Edge → klik kanan halaman → "Buat kode QR untuk halaman ini" → unduh, simpan sebagai prototipe-aplikasi\qr-web.png.
3. Buat ulang file dengan tautan web:
       node ..\prototipe-aplikasi\buat-prototipe.mjs --web https://TAUTAN-KAMU.netlify.app
4. Unggah ulang index.html yang baru ke Netlify (proyek yang sama) agar versi online ikut berisi QR.

## Untuk pitch deck
- Tombol "Buka prototipe": tautkan ke file prototipe-aplikasi/index.html (simpan deck satu folder dengan folder ini), atau ke tautan Netlify.
- QR APK Android: qr-apk.png (dari hasil EAS Build).
- QR versi web: qr-web.png (langkah di atas).

Jika kode aplikasi berubah, ulangi kedua perintah di bagian "Membuat file".
