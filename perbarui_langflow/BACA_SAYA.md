# Perbarui komponen myCITA di Langflow (tanpa hapus/import ulang)

Skrip ini mengganti kode komponen myCITA di flow 1–9 dengan versi terbaru (termasuk perbaikan saran di flow 4 dan perbaikan minat di flow 5), mengosongkan kolom Lokasi Database, dan menyamakan Endpoint Name dengan nama flow.
Tidak disentuh: API key Gemini di flow 7, file PDF, dan flow lain.

Langkah (PowerShell):
1. Di Langflow, kembali ke daftar flow (jangan biarkan ada flow yang sedang terbuka di editor, karena editor bisa menyimpan ulang versi lama).
2. Masuk ke folder ini:
   cd D:\Alfi\Hackaton\myCITA\update\myCITA_Pengumpulan_Hackathon\myCITA_Hackathon\perbarui_langflow
3. Cek dulu (tidak mengubah apa pun):
   node perbarui-langflow.mjs http://localhost:7860 API_KEY
4. Jika tidak ada baris bertanda "!", terapkan:
   node perbarui-langflow.mjs http://localhost:7860 API_KEY --terapkan
   (salinan flow sebelum diubah tersimpan di folder cadangan_flow/)
5. Tutup Langflow. Pulihkan database dan matikan database lama:
   copy ..\data\mycita_contoh_3_persona.db $env:USERPROFILE\.mycita\mycita.db
   ren $env:USERPROFILE\.cita .cita_lama
6. Buka Langflow lagi. Dari folder mobile-app jalankan:
   npm run test:langflow -- http://localhost:7860 API_KEY
   Berhasil jika baris flow 8 berbunyi "6 catatan milik 'tes_mobile' telah dihapus permanen".

Folder perbarui_langflow/ dan cadangan_flow/ tidak perlu ikut dikumpulkan.
