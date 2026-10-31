# Laporan Uji Bias Mesin myCITA (diperbarui 1 November 2026)

Yang diuji: mesin Python myCITA versi terbaru, yaitu Analisis v1.9.1, Karier v1.6.2, Usaha v1.2.0, Target v1.2.0, Profil dan Keuangan dari repositori. Narasi AI (Gemini) tidak diuji di sini.
Laporan sebelumnya (27 Oktober 2026) menguji Analisis v1.2.0. Uji ini mengulang metode yang sama pada versi mesin yang sekarang dipakai.

## Metode
Profil dasar bernama Budi: S1 Teknik Informatika, Tangerang, gaji Rp7,5 juta, target Menikah Rp60 juta dalam 3 tahun dan Mobil Rp250 juta dalam 5 tahun, minat dan skill sama pada semua uji. Setiap uji membuat pengguna baru dengan data identik, mengubah **satu atribut**, lalu menjalankan alur lengkap: simpan profil, keuangan, target, eksplorasi karier, eksplorasi usaha, analisis dasar, dan simulasi gabungan (Data Scientist + kopi keliling, skenario pesimis). Yang dibandingkan: tiga profesi teratas dengan skor, tiga usaha teratas dengan skor, skor kesehatan keuangan, waktu tercapai tiap target pada analisis dasar, dan waktu tercapai pada simulasi gabungan.

## Hasil
| Atribut yang diubah | Hasil dibanding profil dasar |
|---|---|
| Jenis kelamin: perempuan | Identik di semua keluaran |
| Nama: Siti / Yohanes | Identik |
| Usia: 22 / 45 / 55 (S1) | Identik |
| Kota: Jakarta / Surabaya / Kabupaten Wonogiri / Kota Jayapura | Identik |
| Agama / suku (diisi ke input) | Identik; kolom ini tidak ada di skema dan tidak dibaca |
| Status pernikahan: menikah | **Berbeda** (catatan 1) |
| Pendidikan SMA, usia 18 vs usia 30 | **Berbeda** (catatan 2) |

## Catatan
1. **Status menikah** menaikkan target dana darurat (aturan perencanaan keuangan yang dinyatakan terbuka). Dampak pada uji ini: skor kesehatan 100 menjadi 92, waktu tercapai Mobil pada analisis dasar 15 tahun 2 bulan menjadi 16 tahun, dan pada simulasi gabungan Mobil 4 tahun 2 bulan menjadi 4 tahun 3 bulan. Waktu Menikah tidak berubah. Ini aturan yang disengaja, bukan bias terhadap kelompok.
2. **Usia 19 tahun ke bawah dengan pendidikan SMA/SMK** diperlakukan sebagai pelajar. Skor Data Scientist 78 (usia 18) dibanding 62 (usia 30); pada simulasi gabungan Menikah 3 tahun dan Mobil 5 tahun 9 bulan (usia 18) dibanding 2 tahun 11 bulan dan 4 tahun 2 bulan (usia 30), karena waktu kuliah dihitung. Di luar cabang ini usia tidak memengaruhi hasil (usia 22, 45, 55 identik).
3. Jenis kelamin, nama, agama, dan suku tidak memengaruhi keluaran. Kota memengaruhi batas bawah gaji (UMK) dan kampus terdekat; pada uji ini hasilnya tidak berubah di empat kota yang dicoba.

## Perbedaan dengan uji 27 Oktober
Pola hasil sama: hanya status menikah dan cabang pelajar yang membuat keluaran berbeda. Angka mutlaknya berbeda sedikit dari laporan lama (mis. skor Data Scientist usia 30 menjadi 62, sebelumnya 66; menikah menjadi 92, sebelumnya 93) karena versi mesin berbeda dan data masukan profil dasar disusun ulang untuk uji ini. Angka kedua laporan tidak boleh dicampur.

## Batasan uji
- Satu profil dasar saja (Budi); belum diulang untuk Agus dan Dini.
- Dijalankan dengan memanggil fungsi komponen langsung di luar Langflow, dengan database sementara. Bukan lewat antarmuka Langflow atau aplikasi.
- Data masukan profil dasar (rincian pengeluaran dan daftar skill) disusun ulang oleh penguji, tidak sama persis dengan data uji 27 Oktober.
- Rekomendasi kampus dan jurusan untuk pelajar yang memakai kota belum diuji secara terpisah.
- Narasi AI (Gemini) belum diuji bias.
- Database baru 11 profesi dan 4 template usaha, sehingga cakupan uji terbatas.
