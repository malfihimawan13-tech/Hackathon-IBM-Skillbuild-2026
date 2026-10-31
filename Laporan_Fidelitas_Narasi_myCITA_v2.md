# Pemeriksa Fidelitas Narasi myCITA (diperbarui 31 Oktober 2026)

Tujuan: memisahkan dua jenis kesalahan yang berbeda.
1. **Kesalahan mesin**: Python salah menghitung. Diuji lewat uji bias, regresi, dan uji gabungan.
2. **Kesalahan narasi**: AI salah menyalin atau mengarang angka dari hasil mesin. Diuji oleh pemeriksa ini.

## Cara kerja (`cek_fidelitas.py`)
Input: JSON keluaran alat (mesin Python) dan teks jawaban AI. Skrip mengambil semua angka di jawaban (rupiah, durasi tahun/bulan, persen, skor), menormalkan formatnya (Rp7,5 juta = 7.500.000; 2 tahun 8 bulan = 32 bulan), lalu mencocokkannya dengan angka bertipe sama di keluaran alat dengan toleransi pembulatan sesuai desimal yang ditulis.

Status per angka:
- **COCOK**: ada di keluaran alat.
- **TURUNAN (cek manual)**: tidak ada langsung, tetapi selisih dua angka keluaran, dan hanya diterima bila kalimatnya menyebut selisih/total (mis. "lebih cepat 18 tahun").
- **TIDAK DITEMUKAN**: kemungkinan dikarang atau salah salin. Skrip keluar dengan kode 1.

Pemakaian: `python3 cek_fidelitas.py keluaran_alat.json jawaban.txt`

## Hasil uji validasi pemeriksa
Keluaran alat dari mesin (Budi, simulasi gabungan Data Scientist + Kopi keliling, pesimis).

| Jawaban | Angka diperiksa | Cocok | Turunan | Tidak ditemukan |
|---|---|---|---|---|
| Setia (angka disalin benar) | 15 | 14 | 1 (selisih 18 tahun, benar) | 0 |
| Sengaja diubah (sisa, skor, saving rate, dua durasi) | 15 | 10 | 1 | 4 |

Pada jawaban yang diubah, pemeriksa menandai skor 92 (asli 100), saving rate 31% (asli 26,7%), Menikah 2 tahun 3 bulan (asli 2 tahun 8 bulan), dan Mobil 3 tahun 6 bulan (asli 4 tahun 1 bulan).

## Batasan
- Angka sisa Rp2,5 juta (asli Rp2 juta) lolos karena Rp2,5 juta memang muncul di keluaran alat sebagai biaya awal. Pemeriksa mengecek keberadaan angka dan tipenya, bukan label bidangnya.
- Pengujian ini memakai jawaban contoh yang saya susun dari keluaran mesin, bukan jawaban asli Gemini. Langkah berikutnya: jalankan pemeriksa pada jawaban Gemini sungguhan untuk Budi, Agus, dan Dini, lalu laporkan angka akurasinya.
- Angka kecil (10 ke bawah), nomor urut daftar, dan tahun kalender diabaikan.

## Hasil pengujian pada jawaban Gemini 3.5 Flash Lite (Langflow flow 7)

### Tahap 1: 28 Oktober 2026 (sebelum Penjaga Fidelitas)
Jawaban asli dari Playground diperiksa terhadap keluaran mesin (Analisis v1.5.0, Karier v1.4.1, prompt v14).

| Skenario | Angka diperiksa | Cocok | Tidak ditemukan |
|---|---|---|---|
| Budi 1: pindah ke Data Scientist | 18 | 18 | 0 |
| Budi 2: karier + usaha kopi | 21 | 21 | 0 |
| Agus: rumah Rp600 juta, bengkel dan kelontong | 24 | 23 | 1 |
| Dini: jurusan dan kampus | 27 | 27 | 0 |
| **Total** | **90** | **89 (98,9%)** | **1** |

Satu angka Agus tidak ditemukan (tambahan tabungan Rp1.474.513/bulan, angka dari alat yang tidak terekam pada hasil reproduksi).

### Tahap 2: 31 Oktober 2026 (dengan Penjaga Fidelitas v1.3.5, Analisis v1.9.1, Karier v1.6.2, prompt v30)
Jawaban terakhir dari Playground (ditranskripsi dari tangkapan layar) diperiksa terhadap keluaran mesin versi yang sama. Ditambah empat jawaban Ringkasan Rencana.

| Skenario | Angka diperiksa | Cocok | Tidak ditemukan |
|---|---|---|---|
| Budi 1: pindah ke Data Scientist | 39 | 39 | 0 |
| Budi 2: karier + usaha kopi | 28 | 28 | 0 |
| Agus: rumah Rp600 juta, bengkel dan kelontong | 20 | 20 | 0 |
| Dini: jurusan dan kampus | 33 | 33 | 0 |
| Ringkasan Rencana Budi | 18 | 18 | 0 |
| Ringkasan Rencana Agus | 20 | 20 | 0 |
| Ringkasan Rencana Dini | 14 | 14 | 0 |
| Ringkasan Rencana Rina (tiga peringatan utang) | 23 | 23 | 0 |
| **Total** | **195** | **195 (100%)** | **0** |

Pada empat skenario yang sama dengan tahap 1, angka yang diperiksa naik dari 90 menjadi 120 dan seluruhnya cocok (120/120). Kenaikan jumlah angka berasal dari tabel kondisi dan penjelasan jalur yang kini disusun mesin.

Cara membaca: ini mengukur **fidelitas narasi** (angka yang disebut AI ada di keluaran mesin). Ini bukan ukuran akurasi data atau model. Kebenaran mesin diuji terpisah (uji sensitivitas, uji bias, dan dokumen asumsi dengan sumber bertanggal).

## Penjaga Fidelitas (komponen pada alur, versi 1.3.5)
Pemeriksa di atas dijalankan setelah jawaban selesai. Penjaga Fidelitas menjalankan pemeriksaan serupa **otomatis pada setiap jawaban sebelum sampai ke pengguna**.

Cara kerja: setiap alat mencatat keluarannya di tabel `mycita_jejak` (SQLite, jendela 15 menit per pengguna). Penjaga mengambil angka dari jawaban AI, mencocokkannya dengan jejak itu, lalu menghapus baris yang angkanya tidak ada atau salah konteks.

| Kemampuan | Penjelasan |
|---|---|
| Angka bertipe | Rupiah, per bulan, persen, dan durasi dicocokkan terpisah, sehingga angka yang sama nilainya tetapi beda jenis tidak lolos |
| Konteks durasi | Durasi harus cocok dengan nama target di kalimat yang sama (mis. "Mobil 5 tahun 6 bulan" tidak boleh dipakai untuk Menikah) |
| Pemeriksaan kolom tabel | Angka di kolom tambahan laba, sisa, budget, harga sekarang, penghasilan, dan pengeluaran dicocokkan sesuai kolomnya |
| Angka dari pesan pengguna | Boleh muncul di kalimat biasa, tetapi tidak di baris tabel, baris tambahan laba, dan baris yang menyebut modal |
| Klaim modal | Kalimat "sesuai yang kamu sebutkan" dihapus, karena mesin mungkin memakai modal berbeda (kasus nyata: pengguna menyebut Rp3 juta, mesin memakai Rp2,5 juta sebagai batas atas modal usaha) |
| Koreksi tabel | Tabel perbandingan usaha yang rusak diganti otomatis dari hasil mesin |
| Penyisip tabel | Bila jawaban membahas rentang gaji tetapi tabel dari mesin tidak disalin, tabelnya disisipkan |
| Catatan koreksi | Rincian baris yang dihapus tersimpan di status komponen; catatan di bawah jawaban dapat dinyalakan |

## Temuan dan perbaikan selama pengujian
Kesalahan narasi tidak hanya salah salin angka. Penanganannya dipindahkan dari prompt ke mesin.

| Pola | Contoh yang ditemukan | Perbaikan |
|---|---|---|
| AI mengarang atau menebak input | Laba kelontong Rp1.000.000 (profil: Rp3 juta); kota Jakarta (profil: Bandung) | Mesin membaca laba dan kota dari profil tersimpan |
| AI memotong atau membulatkan angka | "8 tahun" padahal 8 tahun 11 bulan; budget Rp467 juta tertukar dengan Rp505 juta | Mesin menyediakan kalimat dan tabel siap salin |
| AI tidak patuh larangan | "Gaji awal tidak akan turun" padahal batas bawah di bawah gaji sekarang | Mesin menyediakan kalimat wajib perbandingan gaji awal |
| AI tidak memanggil semua alat | Hanya satu dari tiga skenario usaha dihitung | Satu panggilan mengembalikan semua skenario |
| AI menambah baris tabel yang tidak ada | Baris "Kondisi sekarang" dengan angka Rp0 dan Rp215 juta | Guard menghapus baris; tabel dikoreksi dari mesin |
| AI mengklaim modal yang tidak dipakai mesin | "Simulasi memakai modal Rp3.000.000 (sesuai yang kamu sebutkan)" padahal mesin memakai Rp2.500.000 | Modal simulasi tampil di judul tabel; Guard menahan klaim modal dari pesan pengguna |
| AI melewatkan tabel gaji | Jawaban pindah karier tanpa tabel rentang gaji | Penyisip tabel pada Guard v1.3.5 |

Dampak lain: panggilan alat untuk pertanyaan Agus turun dari 5 menjadi 1, dan waktu respons dari 117,7 detik (70,1K token) menjadi sekitar 9 sampai 27 detik (20K sampai 48K token). Respons lambat (89 detik pada Budi 1) pernah terjadi dan kemungkinan terkait antrean model, bukan kode.

## Batasan yang diketahui
- Pemeriksa dan Penjaga memastikan angka ada dan bertipe sama, serta (pada Penjaga) cocok dengan kolom dan nama target. Keduanya belum menangkap penukaran dua baris dalam satu kolom tabel.
- Rentang saran buatan AI seperti "9-10 tahun" tidak dicocokkan, karena tidak ada angka kembarannya di mesin.
- Alat Pustaka (referensi data) belum dijaga Penjaga.
- Kalimat nasihat tanpa angka (mis. "bergantian antara target menikah dan cicilan mobil") tidak dapat diverifikasi oleh pemeriksaan angka. Prompt membatasi saran pada isi rekomendasi mesin.
- Jawaban ditranskripsi dari tangkapan layar Playground dan keluaran mesin dijalankan ulang di luar Langflow dari berkas contoh yang sama, bukan keluaran Langflow asli.
- Ukuran sampel kecil (empat persona dan delapan jawaban) dan satu model (Gemini 3.5 Flash Lite). Hasil tidak boleh dibaca sebagai akurasi umum untuk semua pertanyaan.
