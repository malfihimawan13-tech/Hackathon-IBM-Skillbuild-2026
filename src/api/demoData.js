// Data demo dihasilkan dari backend myCITA asli (persona Budi). Dipakai saat Mode Demo aktif.
export const DEMO = {
 "profil_input": {
  "user_id": "budi",
  "nama": "Budi Santoso",
  "jenis_kelamin": "laki-laki",
  "tanggal_lahir": "1998-05-12",
  "kota": "Bogor",
  "pendidikan_terakhir": "S1",
  "status_pernikahan": "single",
  "pekerjaan": [
   {
    "nama": "Software Engineer",
    "jenis": "full_time",
    "lama_kerja_bulan": 24,
    "penghasilan": 7000000
   },
   {
    "nama": "Freelance Web Developer",
    "jenis": "freelance",
    "lama_kerja_bulan": 12,
    "penghasilan": 2000000,
    "penghasilan_min": 1000000
   }
  ],
  "pendapatan_tambahan": [],
  "jumlah_tanggungan": 0,
  "psikologi": {
   "impulsif": 4,
   "fomo": 3,
   "menghindar": 2,
   "emosional": 3,
   "terlalu_hemat": 1,
   "disiplin": 2
  }
 },
 "keuangan_input": {
  "user_id": "budi",
  "pengeluaran": {
   "kebutuhan_pokok": 2000000,
   "kos": 1000000,
   "listrik": 300000,
   "internet": 300000,
   "transportasi": 500000,
   "hiburan": 500000,
   "langganan_streaming": 150000,
   "lainnya": 300000
  },
  "hutang": [
   {
    "nama": "Cicilan motor",
    "jenis": "kendaraan",
    "sisa_pokok": 8000000,
    "cicilan_bulanan": 800000,
    "bunga_tahunan": 12,
    "sisa_tenor_bulan": 10
   },
   {
    "nama": "Paylater",
    "jenis": "paylater",
    "sisa_pokok": 1500000,
    "cicilan_bulanan": 500000,
    "sisa_tenor_bulan": 3
   }
  ],
  "tabungan_saat_ini": 10000000
 },
 "analisis": {
  "status": "ok",
  "user_id": "budi",
  "mode": "analisis",
  "pesan": "Analisis selesai dan tersimpan.",
  "ringkasan": "Budi Santoso: pendapatan Rp9.000.000, pengeluaran Rp6.350.000, sisa Rp2.650.000. Skor kesehatan 70/100 (Cukup sehat 🟢), saving rate 29.4%. Target Toyota Avanza: dengan menabung tercapai dalam 7 tahun 8 bulan. Target Menikah (intimate): dengan menabung tercapai dalam 13 tahun.",
  "dashboard": {
   "nama": "Budi Santoso",
   "pendapatan": 9000000,
   "pengeluaran": 6350000,
   "sisa": 2650000,
   "skor_kesehatan": 70,
   "status": "Cukup sehat 🟢",
   "saving_rate_persen": 29.4
  },
  "kesehatan_keuangan": {
   "penghasilan": 9000000,
   "penghasilan_konservatif": 8000000,
   "pengeluaran_rutin": 5050000,
   "pengeluaran_keinginan": 650000,
   "total_cicilan": 1300000,
   "total_pengeluaran": 6350000,
   "disposable_income": 2650000,
   "kapasitas_menabung": 2650000,
   "saving_rate_persen": 29.4,
   "rasio_cicilan_persen": 14.4,
   "rasio_keinginan_persen": 7.2,
   "rincian_skor": {
    "saving_rate (maks 30)": 30.0,
    "rasio_cicilan (maks 25)": 22.8,
    "dana_darurat (maks 25)": 4.4,
    "pengeluaran_keinginan (maks 10)": 10.0,
    "hutang_berbunga_tinggi (maks 10)": 3.0
   },
   "skor": 70,
   "status": "Cukup sehat 🟢"
  },
  "dana_darurat": {
   "dana_likuid_saat_ini": 10000000,
   "cukup_untuk_bulan": 1.6,
   "target_minimum": 38100000,
   "target_ideal": 57150000,
   "target_dipakai": 38100000,
   "kekurangan": 28100000,
   "perkiraan_waktu_terpenuhi": "1 tahun 5 bulan"
  },
  "alokasi_bulan_ini": {
   "kapasitas_menabung": 2650000,
   "untuk_dana_darurat": 1325000,
   "untuk_target": 1325000,
   "catatan": "Alokasi berubah otomatis: setelah dana darurat terpenuhi atau cicilan lunas, dananya dialihkan ke target."
  },
  "strategi_hutang": [
   {
    "urutan": 1,
    "nama": "Paylater",
    "jenis": "paylater",
    "bunga_tahunan_persen": 30.0,
    "sisa_pokok": 1500000,
    "cicilan_bulanan": 500000,
    "perkiraan_lunas": "3 bulan",
    "berbunga_tinggi": true
   },
   {
    "urutan": 2,
    "nama": "Cicilan motor",
    "jenis": "kendaraan",
    "bunga_tahunan_persen": 12.0,
    "sisa_pokok": 8000000,
    "cicilan_bulanan": 800000,
    "perkiraan_lunas": "10 bulan",
    "berbunga_tinggi": false
   }
  ],
  "target": [
   {
    "nama": "Toyota Avanza",
    "kategori": "mobil",
    "prioritas": 1,
    "harga_saat_ini": 259200000,
    "sumber_harga": "referensi: oto.com (OTR Jakarta), 2026",
    "kenaikan_harga_per_tahun_persen": 3.0,
    "tenggat_bulan": 60,
    "tenggat": "5 tahun",
    "setoran_bulan_pertama": 1325000,
    "opsi_a_menabung": {
     "waktu_tercapai_bulan": 92,
     "waktu_tercapai": "7 tahun 8 bulan",
     "perkiraan_harga_saat_tercapai": 325127511,
     "jika_hanya_fokus_target_ini": "7 tahun 8 bulan",
     "harga_saat_tenggat": 300483840,
     "tercapai_sesuai_tenggat": false
    },
    "opsi_b_kredit": {
     "dp_persen": 20.0,
     "dp": 54997056,
     "waktu_kumpulkan_dp_bulan": 24,
     "waktu_kumpulkan_dp": "2 tahun",
     "perkiraan_harga_saat_beli": 274985280,
     "pinjaman": 219988224,
     "bunga_tahunan_persen": 10.0,
     "cicilan_lama_saat_itu": 0,
     "pilihan_tenor": [
      {
       "tenor_tahun": 3,
       "cicilan_bulanan": 7098401,
       "total_bunga": 35554219,
       "total_dibayar": 310539499,
       "rasio_cicilan_setelah_kredit_persen": 78.9,
       "aman": false
      },
      {
       "tenor_tahun": 4,
       "cicilan_bulanan": 5579470,
       "total_bunga": 47826321,
       "total_dibayar": 322811601,
       "rasio_cicilan_setelah_kredit_persen": 62.0,
       "aman": false
      },
      {
       "tenor_tahun": 5,
       "cicilan_bulanan": 4674100,
       "total_bunga": 60457754,
       "total_dibayar": 335443034,
       "rasio_cicilan_setelah_kredit_persen": 51.9,
       "aman": false
      }
     ],
     "tenor_aman_terpendek": null
    },
    "opsi_c_kombinasi": {
     "dp_persen": 35.0,
     "dp": 98888308,
     "waktu_kumpulkan_dp_bulan": 35,
     "waktu_kumpulkan_dp": "2 tahun 11 bulan",
     "perkiraan_harga_saat_beli": 282538023,
     "pinjaman": 183649715,
     "bunga_tahunan_persen": 10.0,
     "cicilan_lama_saat_itu": 0,
     "pilihan_tenor": [
      {
       "tenor_tahun": 3,
       "cicilan_bulanan": 5925860,
       "total_bunga": 29681235,
       "total_dibayar": 312219259,
       "rasio_cicilan_setelah_kredit_persen": 65.8,
       "aman": false
      },
      {
       "tenor_tahun": 4,
       "cicilan_bulanan": 4657831,
       "total_bunga": 39926184,
       "total_dibayar": 322464207,
       "rasio_cicilan_setelah_kredit_persen": 51.8,
       "aman": false
      },
      {
       "tenor_tahun": 5,
       "cicilan_bulanan": 3902014,
       "total_bunga": 50471107,
       "total_dibayar": 333009131,
       "rasio_cicilan_setelah_kredit_persen": 43.4,
       "aman": false
      }
     ],
     "tenor_aman_terpendek": null,
     "keterangan": "Menabung lebih lama untuk DP 35% agar pinjaman dan total bunga lebih kecil."
    },
    "status": "perlu_penyesuaian",
    "opsi_disarankan": "sesuaikan_rencana",
    "alternatif": {
     "tambahan_tabungan_per_bulan_agar_tepat_waktu": 1684731,
     "harga_maksimal_terjangkau_sesuai_tenggat": 172004192,
     "perpanjang_tenggat_menjadi": "7 tahun 8 bulan"
    }
   },
   {
    "nama": "Menikah (intimate)",
    "kategori": "menikah",
    "prioritas": 2,
    "harga_saat_ini": 150000000,
    "sumber_harga": "diisi pengguna",
    "kenaikan_harga_per_tahun_persen": 4.0,
    "tenggat_bulan": 48,
    "tenggat": "4 tahun",
    "setoran_bulan_pertama": 0,
    "opsi_a_menabung": {
     "waktu_tercapai_bulan": 156,
     "waktu_tercapai": "13 tahun",
     "perkiraan_harga_saat_tercapai": 249761026,
     "jika_hanya_fokus_target_ini": "4 tahun 7 bulan",
     "harga_saat_tenggat": 175478784,
     "tercapai_sesuai_tenggat": false
    },
    "catatan_kredit": "Kredit/pinjaman tidak disarankan untuk tujuan konsumtif ini; prioritaskan menabung.",
    "status": "perlu_penyesuaian",
    "opsi_disarankan": "sesuaikan_rencana",
    "alternatif": {
     "tambahan_tabungan_per_bulan_agar_tepat_waktu": 5474404,
     "harga_maksimal_terjangkau_sesuai_tenggat": null,
     "perpanjang_tenggat_menjadi": "13 tahun",
     "catatan": "Menurunkan budget saja tidak cukup karena dana sedang terpakai untuk target prioritas lebih tinggi."
    }
   }
  ],
  "rekomendasi_utama": [
   "Lunasi 'Paylater' (paylater, bunga ±30%/tahun) secepatnya, dan hindari menambah paylater/pinjol baru.",
   "Bangun dana darurat Rp38.100.000 (6x pengeluaran bulanan) lebih dulu. Dengan menyisihkan sebagian kapasitas menabung, perkiraan terpenuhi dalam 1 tahun 5 bulan.",
   "'Paylater' diperkirakan lunas dalam 3 bulan. Alihkan cicilan Rp500.000/bulan itu langsung ke tabungan target agar tidak terpakai untuk konsumsi.",
   "Target 'Toyota Avanza' belum realistis dalam 5 tahun. Pilihan: perpanjang tenggat menjadi 7 tahun 8 bulan, atau turunkan budget ke ±Rp172.004.192, atau tambah tabungan/penghasilan ±Rp1.684.731/bulan.",
   "Target 'Menikah (intimate)' belum realistis dalam 4 tahun. Pilihan: perpanjang tenggat menjadi 13 tahun, atau tambah tabungan/penghasilan ±Rp5.474.404/bulan.",
   "Sebagian penghasilan tidak tetap. Di bulan sepi, pegang angka konservatif Rp8.000.000; kelebihan di bulan ramai langsung ditabung.",
   "Profil kebiasaan: Si Spontan. Terapkan aturan tunggu 48 jam sebelum membeli barang non-kebutuhan, dan pisahkan rekening tabungan dari rekening belanja."
  ],
  "psikologi": {
   "skor": {
    "impulsif": 4,
    "fomo": 3,
    "menghindar": 2,
    "emosional": 3,
    "terlalu_hemat": 1,
    "disiplin": 2
   },
   "tipe": "impulsif",
   "nama_tipe": "Si Spontan",
   "saran_kebiasaan": "Terapkan aturan tunggu 48 jam sebelum membeli barang non-kebutuhan, dan pisahkan rekening tabungan dari rekening belanja.",
   "disiplin_anggaran": false,
   "skala": "1 = sangat tidak setuju, 5 = sangat setuju"
  },
  "asumsi": {
   "inflasi_umum_persen": 3.2,
   "kenaikan_harga_persen": {
    "rumah": 4.0,
    "rumah_subsidi": 3.0,
    "mobil": 3.0,
    "motor": 3.0,
    "menikah": 4.0,
    "pendidikan": 6.0,
    "default": 3.2
   },
   "bunga_kredit_persen": {
    "rumah": 11.0,
    "rumah_subsidi": 5.0,
    "mobil": 10.0,
    "motor": 15.0
   },
   "dp_persen": {
    "rumah": 20.0,
    "rumah_subsidi": 1.0,
    "mobil": 20.0,
    "motor": 15.0
   },
   "tenor_tahun": {
    "rumah": [
     10,
     15,
     20
    ],
    "rumah_subsidi": [
     10,
     15,
     20
    ],
    "mobil": [
     3,
     4,
     5
    ],
    "motor": [
     1,
     2,
     3
    ]
   },
   "imbal_hasil_tabungan_persen": 0.0,
   "kenaikan_penghasilan_persen": 0.0,
   "pakai_penghasilan_konservatif": false,
   "batas_aman_cicilan_persen": 30.0,
   "porsi_dana_darurat_persen": 50.0
  },
  "sumber_asumsi": [
   "Inflasi umum 3,2%: inflasi tahunan Indonesia Agustus 2026 tercatat 3,19% (BPS via Databoks); sasaran BI 2,5±1%.",
   "Bunga KPR 11%: bunga floating KPR BCA 11% (Mandiri 13%, CIMB Niaga 13,5%), Kontan Agustus 2026.",
   "KPR subsidi 5% tetap dan batas harga rumah subsidi Rp166-185 juta: Kompas.com 2026.",
   "Kenaikan harga barang, bunga kredit kendaraan, DP, dan porsi alokasi adalah asumsi CITA yang dapat diubah.",
   "Penghasilan dan pengeluaran dianggap tetap (konservatif); ubah 'kenaikan_penghasilan_persen' untuk skenario kenaikan gaji."
  ],
  "disclaimer": "CITA adalah alat edukasi dan perencanaan keuangan, bukan nasihat investasi atau rekomendasi produk keuangan tertentu. Semua angka adalah estimasi berdasarkan data yang kamu isi dan asumsi yang tercantum."
 },
 "simulasi_gaji": {
  "status": "ok",
  "user_id": "budi",
  "mode": "simulasi_what_if",
  "pesan": "Simulasi what-if selesai (tidak mengubah data tersimpan).",
  "ringkasan": "Budi Santoso: pendapatan Rp11.000.000, pengeluaran Rp6.050.000, sisa Rp4.950.000. Skor kesehatan 72/100 (Cukup sehat 🟢), saving rate 45.0%. Target Toyota Avanza: dengan menabung tercapai dalam 4 tahun 11 bulan. Target Menikah (intimate): dengan menabung tercapai dalam 7 tahun 3 bulan.",
  "dashboard": {
   "nama": "Budi Santoso",
   "pendapatan": 11000000,
   "pengeluaran": 6050000,
   "sisa": 4950000,
   "skor_kesehatan": 72,
   "status": "Cukup sehat 🟢",
   "saving_rate_persen": 45.0
  },
  "kesehatan_keuangan": {
   "penghasilan": 11000000,
   "penghasilan_konservatif": 10000000,
   "pengeluaran_rutin": 4750000,
   "pengeluaran_keinginan": 350000,
   "total_cicilan": 1300000,
   "total_pengeluaran": 6050000,
   "disposable_income": 4950000,
   "kapasitas_menabung": 4950000,
   "saving_rate_persen": 45.0,
   "rasio_cicilan_persen": 11.8,
   "rasio_keinginan_persen": 3.2,
   "rincian_skor": {
    "saving_rate (maks 30)": 30.0,
    "rasio_cicilan (maks 25)": 24.1,
    "dana_darurat (maks 25)": 4.6,
    "pengeluaran_keinginan (maks 10)": 10.0,
    "hutang_berbunga_tinggi (maks 10)": 3.0
   },
   "skor": 72,
   "status": "Cukup sehat 🟢"
  },
  "dana_darurat": {
   "dana_likuid_saat_ini": 10000000,
   "cukup_untuk_bulan": 1.7,
   "target_minimum": 36300000,
   "target_ideal": 54450000,
   "target_dipakai": 36300000,
   "kekurangan": 26300000,
   "perkiraan_waktu_terpenuhi": "10 bulan"
  },
  "alokasi_bulan_ini": {
   "kapasitas_menabung": 4950000,
   "untuk_dana_darurat": 2475000,
   "untuk_target": 2475000,
   "catatan": "Alokasi berubah otomatis: setelah dana darurat terpenuhi atau cicilan lunas, dananya dialihkan ke target."
  },
  "strategi_hutang": [
   {
    "urutan": 1,
    "nama": "Paylater",
    "jenis": "paylater",
    "bunga_tahunan_persen": 30.0,
    "sisa_pokok": 1500000,
    "cicilan_bulanan": 500000,
    "perkiraan_lunas": "3 bulan",
    "berbunga_tinggi": true
   },
   {
    "urutan": 2,
    "nama": "Cicilan motor",
    "jenis": "kendaraan",
    "bunga_tahunan_persen": 12.0,
    "sisa_pokok": 8000000,
    "cicilan_bulanan": 800000,
    "perkiraan_lunas": "10 bulan",
    "berbunga_tinggi": false
   }
  ],
  "target": [
   {
    "nama": "Toyota Avanza",
    "kategori": "mobil",
    "prioritas": 1,
    "harga_saat_ini": 259200000,
    "sumber_harga": "referensi: oto.com (OTR Jakarta), 2026",
    "kenaikan_harga_per_tahun_persen": 3.0,
    "tenggat_bulan": 60,
    "tenggat": "5 tahun",
    "setoran_bulan_pertama": 2475000,
    "opsi_a_menabung": {
     "waktu_tercapai_bulan": 59,
     "waktu_tercapai": "4 tahun 11 bulan",
     "perkiraan_harga_saat_tercapai": 299744589,
     "jika_hanya_fokus_target_ini": "4 tahun 5 bulan",
     "harga_saat_tenggat": 300483840,
     "tercapai_sesuai_tenggat": true
    },
    "opsi_b_kredit": {
     "dp_persen": 20.0,
     "dp": 53791236,
     "waktu_kumpulkan_dp_bulan": 15,
     "waktu_kumpulkan_dp": "1 tahun 3 bulan",
     "perkiraan_harga_saat_beli": 268956180,
     "pinjaman": 215164944,
     "bunga_tahunan_persen": 10.0,
     "cicilan_lama_saat_itu": 0,
     "pilihan_tenor": [
      {
       "tenor_tahun": 3,
       "cicilan_bulanan": 6942768,
       "total_bunga": 34774687,
       "total_dibayar": 303730867,
       "rasio_cicilan_setelah_kredit_persen": 63.1,
       "aman": false
      },
      {
       "tenor_tahun": 4,
       "cicilan_bulanan": 5457139,
       "total_bunga": 46777721,
       "total_dibayar": 315733901,
       "rasio_cicilan_setelah_kredit_persen": 49.6,
       "aman": false
      },
      {
       "tenor_tahun": 5,
       "cicilan_bulanan": 4571619,
       "total_bunga": 59132207,
       "total_dibayar": 328088387,
       "rasio_cicilan_setelah_kredit_persen": 41.6,
       "aman": false
      }
     ],
     "tenor_aman_terpendek": null
    },
    "opsi_c_kombinasi": {
     "dp_persen": 35.0,
     "dp": 96008066,
     "waktu_kumpulkan_dp_bulan": 23,
     "waktu_kumpulkan_dp": "1 tahun 11 bulan",
     "perkiraan_harga_saat_beli": 274308761,
     "pinjaman": 178300694,
     "bunga_tahunan_persen": 10.0,
     "cicilan_lama_saat_itu": 0,
     "pilihan_tenor": [
      {
       "tenor_tahun": 3,
       "cicilan_bulanan": 5753262,
       "total_bunga": 28816733,
       "total_dibayar": 303125494,
       "rasio_cicilan_setelah_kredit_persen": 52.3,
       "aman": false
      },
      {
       "tenor_tahun": 4,
       "cicilan_bulanan": 4522166,
       "total_bunga": 38763285,
       "total_dibayar": 313072046,
       "rasio_cicilan_setelah_kredit_persen": 41.1,
       "aman": false
      },
      {
       "tenor_tahun": 5,
       "cicilan_bulanan": 3788363,
       "total_bunga": 49001075,
       "total_dibayar": 323309836,
       "rasio_cicilan_setelah_kredit_persen": 34.4,
       "aman": false
      }
     ],
     "tenor_aman_terpendek": null,
     "keterangan": "Menabung lebih lama untuk DP 35% agar pinjaman dan total bunga lebih kecil."
    },
    "status": "realistis",
    "opsi_disarankan": "menabung"
   },
   {
    "nama": "Menikah (intimate)",
    "kategori": "menikah",
    "prioritas": 2,
    "harga_saat_ini": 150000000,
    "sumber_harga": "diisi pengguna",
    "kenaikan_harga_per_tahun_persen": 4.0,
    "tenggat_bulan": 48,
    "tenggat": "4 tahun",
    "setoran_bulan_pertama": 0,
    "opsi_a_menabung": {
     "waktu_tercapai_bulan": 87,
     "waktu_tercapai": "7 tahun 3 bulan",
     "perkiraan_harga_saat_tercapai": 199334729,
     "jika_hanya_fokus_target_ini": "2 tahun 9 bulan",
     "harga_saat_tenggat": 175478784,
     "tercapai_sesuai_tenggat": false
    },
    "catatan_kredit": "Kredit/pinjaman tidak disarankan untuk tujuan konsumtif ini; prioritaskan menabung.",
    "status": "perlu_penyesuaian",
    "opsi_disarankan": "sesuaikan_rencana",
    "alternatif": {
     "tambahan_tabungan_per_bulan_agar_tepat_waktu": 3136376,
     "harga_maksimal_terjangkau_sesuai_tenggat": 25151999,
     "perpanjang_tenggat_menjadi": "7 tahun 3 bulan"
    }
   }
  ],
  "rekomendasi_utama": [
   "Lunasi 'Paylater' (paylater, bunga ±30%/tahun) secepatnya, dan hindari menambah paylater/pinjol baru.",
   "Bangun dana darurat Rp36.300.000 (6x pengeluaran bulanan) lebih dulu. Dengan menyisihkan sebagian kapasitas menabung, perkiraan terpenuhi dalam 10 bulan.",
   "'Paylater' diperkirakan lunas dalam 3 bulan. Alihkan cicilan Rp500.000/bulan itu langsung ke tabungan target agar tidak terpakai untuk konsumsi.",
   "Target 'Menikah (intimate)' belum realistis dalam 4 tahun. Pilihan: perpanjang tenggat menjadi 7 tahun 3 bulan, atau turunkan budget ke ±Rp25.151.999, atau tambah tabungan/penghasilan ±Rp3.136.376/bulan.",
   "'Menikah (intimate)' sebenarnya bisa tercapai dalam 2 tahun 9 bulan jika didahulukan. Target ini bentrok dengan target prioritas lebih tinggi, jadi pertimbangkan mengubah urutan prioritas.",
   "Sebagian penghasilan tidak tetap. Di bulan sepi, pegang angka konservatif Rp10.000.000; kelebihan di bulan ramai langsung ditabung.",
   "Profil kebiasaan: Si Spontan. Terapkan aturan tunggu 48 jam sebelum membeli barang non-kebutuhan, dan pisahkan rekening tabungan dari rekening belanja."
  ],
  "psikologi": {
   "skor": {
    "impulsif": 4,
    "fomo": 3,
    "menghindar": 2,
    "emosional": 3,
    "terlalu_hemat": 1,
    "disiplin": 2
   },
   "tipe": "impulsif",
   "nama_tipe": "Si Spontan",
   "saran_kebiasaan": "Terapkan aturan tunggu 48 jam sebelum membeli barang non-kebutuhan, dan pisahkan rekening tabungan dari rekening belanja.",
   "disiplin_anggaran": false,
   "skala": "1 = sangat tidak setuju, 5 = sangat setuju"
  },
  "perubahan_yang_disimulasikan": {
   "perubahan_penghasilan": 2000000,
   "perubahan_keinginan": -300000
  },
  "perbandingan": {
   "sebelum": {
    "sisa": 2650000,
    "skor": 70,
    "target": {
     "Toyota Avanza": "7 tahun 8 bulan",
     "Menikah (intimate)": "13 tahun"
    }
   },
   "sesudah": {
    "sisa": 4950000,
    "skor": 72,
    "target": {
     "Toyota Avanza": "4 tahun 11 bulan",
     "Menikah (intimate)": "7 tahun 3 bulan"
    }
   }
  },
  "asumsi": {
   "inflasi_umum_persen": 3.2,
   "kenaikan_harga_persen": {
    "rumah": 4.0,
    "rumah_subsidi": 3.0,
    "mobil": 3.0,
    "motor": 3.0,
    "menikah": 4.0,
    "pendidikan": 6.0,
    "default": 3.2
   },
   "bunga_kredit_persen": {
    "rumah": 11.0,
    "rumah_subsidi": 5.0,
    "mobil": 10.0,
    "motor": 15.0
   },
   "dp_persen": {
    "rumah": 20.0,
    "rumah_subsidi": 1.0,
    "mobil": 20.0,
    "motor": 15.0
   },
   "tenor_tahun": {
    "rumah": [
     10,
     15,
     20
    ],
    "rumah_subsidi": [
     10,
     15,
     20
    ],
    "mobil": [
     3,
     4,
     5
    ],
    "motor": [
     1,
     2,
     3
    ]
   },
   "imbal_hasil_tabungan_persen": 0.0,
   "kenaikan_penghasilan_persen": 0.0,
   "pakai_penghasilan_konservatif": false,
   "batas_aman_cicilan_persen": 30.0,
   "porsi_dana_darurat_persen": 50.0
  },
  "sumber_asumsi": [
   "Inflasi umum 3,2%: inflasi tahunan Indonesia Agustus 2026 tercatat 3,19% (BPS via Databoks); sasaran BI 2,5±1%.",
   "Bunga KPR 11%: bunga floating KPR BCA 11% (Mandiri 13%, CIMB Niaga 13,5%), Kontan Agustus 2026.",
   "KPR subsidi 5% tetap dan batas harga rumah subsidi Rp166-185 juta: Kompas.com 2026.",
   "Kenaikan harga barang, bunga kredit kendaraan, DP, dan porsi alokasi adalah asumsi CITA yang dapat diubah.",
   "Penghasilan dan pengeluaran dianggap tetap (konservatif); ubah 'kenaikan_penghasilan_persen' untuk skenario kenaikan gaji."
  ],
  "disclaimer": "CITA adalah alat edukasi dan perencanaan keuangan, bukan nasihat investasi atau rekomendasi produk keuangan tertentu. Semua angka adalah estimasi berdasarkan data yang kamu isi dan asumsi yang tercantum."
 },
 "harga": {
  "avanza": {
   "status": "ok",
   "pesan": "1 referensi harga ditemukan untuk 'avanza'.",
   "hasil": [
    {
     "nama": "Toyota Avanza",
     "kategori": "mobil",
     "min": 244200000,
     "max": 282100000,
     "acuan": 259200000,
     "catatan": "Acuan varian 1.3 E CVT",
     "sumber": "oto.com (OTR Jakarta), 2026"
    }
   ],
   "catatan": "Harga referensi adalah estimasi per Oktober 2026 dan dapat berbeda per kota dan dealer."
  },
  "xpander": {
   "status": "ok",
   "pesan": "1 referensi harga ditemukan untuk 'xpander'.",
   "hasil": [
    {
     "nama": "Mitsubishi Xpander",
     "kategori": "mobil",
     "min": 274500000,
     "max": 348000000,
     "acuan": 283500000,
     "catatan": "Acuan varian GLS CVT",
     "sumber": "moladin.com (OTR Jakarta), Juli 2026"
    }
   ],
   "catatan": "Harga referensi adalah estimasi per Oktober 2026 dan dapat berbeda per kota dan dealer."
  },
  "ertiga": {
   "status": "ok",
   "pesan": "1 referensi harga ditemukan untuk 'ertiga'.",
   "hasil": [
    {
     "nama": "Suzuki Ertiga",
     "kategori": "mobil",
     "min": 236100000,
     "max": 270700000,
     "acuan": 236100000,
     "catatan": "Acuan varian terendah",
     "sumber": "oto.com (OTR Jakarta), 2026"
    }
   ],
   "catatan": "Harga referensi adalah estimasi per Oktober 2026 dan dapat berbeda per kota dan dealer."
  },
  "brio": {
   "status": "ok",
   "pesan": "1 referensi harga ditemukan untuk 'brio'.",
   "hasil": [
    {
     "nama": "Honda Brio",
     "kategori": "mobil",
     "min": 170400000,
     "max": 263200000,
     "acuan": 170400000,
     "catatan": "Acuan varian terendah",
     "sumber": "zigwheels.co.id (OTR Jakarta), 2026"
    }
   ],
   "catatan": "Harga referensi adalah estimasi per Oktober 2026 dan dapat berbeda per kota dan dealer."
  },
  "beat": {
   "status": "ok",
   "pesan": "1 referensi harga ditemukan untuk 'beat'.",
   "hasil": [
    {
     "nama": "Honda BeAT",
     "kategori": "motor",
     "min": 18980000,
     "max": 20380000,
     "acuan": 18980000,
     "catatan": "Acuan varian terendah",
     "sumber": "zigwheels.co.id / oto.com, 2026"
    }
   ],
   "catatan": "Harga referensi adalah estimasi per Oktober 2026 dan dapat berbeda per kota dan dealer."
  },
  "vario": {
   "status": "ok",
   "pesan": "1 referensi harga ditemukan untuk 'vario'.",
   "hasil": [
    {
     "nama": "Honda Vario 125",
     "kategori": "motor",
     "min": 24810000,
     "max": 26799000,
     "acuan": 24810000,
     "catatan": "Acuan Vario 125 CBS",
     "sumber": "Price list AHM OTR DKI (via bernas.id), 2026"
    }
   ],
   "catatan": "Harga referensi adalah estimasi per Oktober 2026 dan dapat berbeda per kota dan dealer."
  },
  "scoopy": {
   "status": "ok",
   "pesan": "1 referensi harga ditemukan untuk 'scoopy'.",
   "hasil": [
    {
     "nama": "Honda Scoopy",
     "kategori": "motor",
     "min": 24200000,
     "max": 25005000,
     "acuan": 24200000,
     "catatan": "Acuan Scoopy Fashion",
     "sumber": "Wahana Honda Jabodetabek, Oktober 2026"
    }
   ],
   "catatan": "Harga referensi adalah estimasi per Oktober 2026 dan dapat berbeda per kota dan dealer."
  },
  "nmax": {
   "status": "ok",
   "pesan": "1 referensi harga ditemukan untuk 'nmax'.",
   "hasil": [
    {
     "nama": "Yamaha NMAX",
     "kategori": "motor",
     "min": 31620000,
     "max": 33180000,
     "acuan": 31620000,
     "catatan": "Acuan varian terendah",
     "sumber": "oto.com (OTR Jakarta), 2026"
    }
   ],
   "catatan": "Harga referensi adalah estimasi per Oktober 2026 dan dapat berbeda per kota dan dealer."
  },
  "rumah subsidi jabodetabek": {
   "status": "ok",
   "pesan": "2 referensi harga ditemukan untuk 'rumah subsidi jabodetabek'.",
   "hasil": [
    {
     "nama": "Rumah subsidi Jabodetabek",
     "kategori": "rumah_subsidi",
     "min": 150000000,
     "max": 185000000,
     "acuan": 185000000,
     "catatan": "Batas harga maksimal rumah subsidi (FLPP), bunga KPR subsidi 5% tetap",
     "sumber": "Kompas.com (Kepmen batas harga rumah subsidi), 2026"
    },
    {
     "nama": "Rumah subsidi Jawa (luar Jabodetabek) & Sumatera",
     "kategori": "rumah_subsidi",
     "min": 140000000,
     "max": 166000000,
     "acuan": 166000000,
     "catatan": "Batas harga maksimal rumah subsidi (FLPP), bunga KPR subsidi 5% tetap",
     "sumber": "Kompas.com (Kepmen batas harga rumah subsidi), 2026"
    }
   ],
   "catatan": "Harga referensi adalah estimasi per Oktober 2026 dan dapat berbeda per kota dan dealer."
  },
  "rumah subsidi jawa": {
   "status": "ok",
   "pesan": "1 referensi harga ditemukan untuk 'rumah subsidi jawa'.",
   "hasil": [
    {
     "nama": "Rumah subsidi Jawa (luar Jabodetabek) & Sumatera",
     "kategori": "rumah_subsidi",
     "min": 140000000,
     "max": 166000000,
     "acuan": 166000000,
     "catatan": "Batas harga maksimal rumah subsidi (FLPP), bunga KPR subsidi 5% tetap",
     "sumber": "Kompas.com (Kepmen batas harga rumah subsidi), 2026"
    }
   ],
   "catatan": "Harga referensi adalah estimasi per Oktober 2026 dan dapat berbeda per kota dan dealer."
  },
  "menikah intimate": {
   "status": "ok",
   "pesan": "2 referensi harga ditemukan untuk 'menikah intimate'.",
   "hasil": [
    {
     "nama": "Pernikahan intimate",
     "kategori": "menikah",
     "min": 150000000,
     "max": 250000000,
     "acuan": 200000000,
     "catatan": "Sangat bergantung kota dan jumlah tamu",
     "sumber": "Popbela/IDN, perkiraan budget nikah 2026"
    },
    {
     "nama": "Pernikahan menengah",
     "kategori": "menikah",
     "min": 300000000,
     "max": 500000000,
     "acuan": 400000000,
     "catatan": "Sangat bergantung kota dan jumlah tamu",
     "sumber": "Popbela/IDN, perkiraan budget nikah 2026"
    }
   ],
   "catatan": "Harga referensi adalah estimasi per Oktober 2026 dan dapat berbeda per kota dan dealer."
  },
  "menikah menengah": {
   "status": "ok",
   "pesan": "2 referensi harga ditemukan untuk 'menikah menengah'.",
   "hasil": [
    {
     "nama": "Pernikahan menengah",
     "kategori": "menikah",
     "min": 300000000,
     "max": 500000000,
     "acuan": 400000000,
     "catatan": "Sangat bergantung kota dan jumlah tamu",
     "sumber": "Popbela/IDN, perkiraan budget nikah 2026"
    },
    {
     "nama": "Pernikahan intimate",
     "kategori": "menikah",
     "min": 150000000,
     "max": 250000000,
     "acuan": 200000000,
     "catatan": "Sangat bergantung kota dan jumlah tamu",
     "sumber": "Popbela/IDN, perkiraan budget nikah 2026"
    }
   ],
   "catatan": "Harga referensi adalah estimasi per Oktober 2026 dan dapat berbeda per kota dan dealer."
  }
 },
 "karier_input": {
  "user_id": "budi",
  "minat": [
   "angka",
   "komputer"
  ],
  "skill": [
   "Excel",
   "Python dasar",
   "SQL"
  ],
  "pengalaman": [
   {
    "bidang": "IT software",
    "tahun": 2
   }
  ],
  "pendidikan_terakhir": "S1",
  "kota": "Kota Bogor"
 },
 "karier": {
  "status": "ok",
  "user_id": "budi",
  "pesan": "Eksplorasi karier selesai: Data Analyst, Supply Chain Analyst, Data Engineer.",
  "rekomendasi": [
   {
    "id": "data_analyst",
    "profesi": "Data Analyst",
    "bidang": "Teknologi & Data",
    "skor_kecocokan": 70,
    "target_pengguna": false,
    "alasan": [
     "Cocok dengan minatmu: angka, komputer.",
     "Kamu sudah punya 2 dari 4 skill wajib.",
     "Sebagian pengalaman kerjamu bisa dipakai sebagai nilai tambah."
    ],
    "deskripsi": "Mengolah data menjadi laporan dan dashboard untuk membantu keputusan bisnis.",
    "jenjang_karier": [
     "Junior Data Analyst",
     "Data Analyst",
     "Senior Data Analyst",
     "Analytics Lead",
     "Head of Data/Analytics"
    ],
    "pendidikan_umum": "S1 berbagai jurusan (Statistik, Matematika, Informatika, Sistem Informasi, Teknik Industri); banyak career switcher masuk lewat bootcamp + portofolio",
    "skill_sudah_dimiliki": [
     "Excel/Google Sheets",
     "SQL",
     "Python (pandas)"
    ],
    "skill_gap_wajib": [
     "visualisasi data (Power BI/Tableau/Looker Studio)",
     "statistik dasar"
    ],
    "skill_gap_pendukung": [
     "storytelling data",
     "pemahaman bisnis"
    ],
    "jalur_pendapatan": {
     "tahapan": [
      {
       "tahap": "entry",
       "rentang_min": 5000000,
       "rentang_max": 9000000,
       "nilai_tengah": 7000000,
       "perkiraan_tahun_ke": "0-2",
       "sumber": [
        "HRBS Global - Average Salary in Indonesia 2026 (2026)"
       ]
      },
      {
       "tahap": "mid",
       "rentang_min": 7635417,
       "rentang_max": 14000000,
       "nilai_tengah": 10000000,
       "perkiraan_tahun_ke": "2-5",
       "sumber": [
        "Glassdoor - Data Analyst Jakarta (Oktober 2026)"
       ]
      },
      {
       "tahap": "senior",
       "rentang_min": 15000000,
       "rentang_max": 28000000,
       "nilai_tengah": 21500000,
       "perkiraan_tahun_ke": "5-seterusnya",
       "sumber": [
        "HRBS Global - Average Salary in Indonesia 2026 (2026)"
       ]
      }
     ]
    },
    "jalur_belajar": {
     "jalur_utama": [
      {
       "program": "Bootcamp Data Analyst (umum)",
       "jenis": "Bootcamp",
       "biaya_min": 2000000,
       "biaya_max": 40000000,
       "satuan": "per program",
       "durasi": "1-6 bulan",
       "sumber": "tempatbelajar.id (2026)"
      },
      {
       "program": "Sertifikasi BNSP Data Analyst",
       "jenis": "Sertifikasi kompetensi",
       "biaya_min": 800000,
       "biaya_max": 2500000,
       "satuan": "per sertifikasi",
       "durasi": "pembekalan ±5-7 hari",
       "sumber": "LSP Ditekindo; dilatih.co (2026)"
      }
     ],
     "opsional_jangka_panjang": [
      {
       "program": "Universitas Terbuka - S1 Sains Data",
       "jenis": "Kuliah jarak jauh",
       "biaya_min": 1900000,
       "biaya_max": 1900000,
       "satuan": "per semester",
       "durasi": "±8 semester",
       "sumber": "Kompas.com Edu (2026)"
      }
     ],
     "estimasi_biaya_jalur_utama": {
      "min": 2800000,
      "max": 42500000
     },
     "catatan": []
    },
    "perkiraan_persiapan_bulan": 6,
    "jadwal_pendapatan_untuk_simulasi": [
     {
      "mulai_bulan": 0,
      "penghasilan": 7000000,
      "keterangan": "penghasilan pekerjaan utama saat ini"
     },
     {
      "mulai_bulan": 6,
      "penghasilan": 7000000,
      "keterangan": "perkiraan tahap entry (nilai tengah rentang)"
     },
     {
      "mulai_bulan": 30,
      "penghasilan": 10000000,
      "keterangan": "perkiraan tahap mid (nilai tengah rentang)"
     },
     {
      "mulai_bulan": 66,
      "penghasilan": 21500000,
      "keterangan": "perkiraan tahap senior (nilai tengah rentang)"
     }
    ],
    "simulasi_siap_pakai": {
     "jadwal_pendapatan": [
      {
       "mulai_bulan": 0,
       "penghasilan": 7000000,
       "keterangan": "penghasilan pekerjaan utama saat ini"
      },
      {
       "mulai_bulan": 6,
       "penghasilan": 7000000,
       "keterangan": "perkiraan tahap entry (nilai tengah rentang)"
      },
      {
       "mulai_bulan": 30,
       "penghasilan": 10000000,
       "keterangan": "perkiraan tahap mid (nilai tengah rentang)"
      },
      {
       "mulai_bulan": 66,
       "penghasilan": 21500000,
       "keterangan": "perkiraan tahap senior (nilai tengah rentang)"
      }
     ]
    },
    "selisih_tahap_awal_vs_sekarang": 0
   },
   {
    "id": "supply_chain_analyst",
    "profesi": "Supply Chain Analyst",
    "bidang": "Rantai Pasok",
    "skor_kecocokan": 62,
    "target_pengguna": false,
    "alasan": [
     "Cocok dengan minatmu: angka, komputer.",
     "Kamu sudah punya 2 dari 4 skill wajib."
    ],
    "deskripsi": "Menganalisis data persediaan, pemasok, dan distribusi untuk menekan biaya dan mencegah kehabisan stok.",
    "jenjang_karier": [
     "Supply Chain Staff",
     "Supply Chain Analyst",
     "Senior Analyst",
     "Supply Chain Supervisor/Lead",
     "Supply Chain Manager"
    ],
    "pendidikan_umum": "S1 Teknik Industri, Manajemen, Statistik, atau Logistik; sertifikasi analisis data membantu",
    "skill_sudah_dimiliki": [
     "Excel lanjutan (pivot, lookup)",
     "SQL dasar",
     "Python dasar"
    ],
    "skill_gap_wajib": [
     "analisis persediaan",
     "dashboard (Power BI/Looker Studio)"
    ],
    "skill_gap_pendukung": [
     "forecasting",
     "pengetahuan pengadaan & distribusi"
    ],
    "jalur_pendapatan": {
     "tahapan": [
      {
       "tahap": "entry",
       "rentang_min": 4000000,
       "rentang_max": 10000000,
       "nilai_tengah": 7250000,
       "perkiraan_tahun_ke": "0-2",
       "sumber": [
        "HRBS Global - Average Salary in Indonesia 2026 (2026)",
        "KantorKu - Gaji Supply Chain Staff 2026 (2026)"
       ]
      },
      {
       "tahap": "senior",
       "rentang_min": 12000000,
       "rentang_max": 20000000,
       "nilai_tengah": 16000000,
       "perkiraan_tahun_ke": "5-seterusnya",
       "sumber": [
        "HRBS Global - Average Salary in Indonesia 2026 (2026)"
       ]
      }
     ]
    },
    "jalur_belajar": {
     "jalur_utama": [
      {
       "program": "Google Data Analytics Professional Certificate (Coursera)",
       "jenis": "Kursus online bersertifikat",
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "±USD 49 per bulan",
       "durasi": "beberapa bulan, mandiri",
       "sumber": "tempatbelajar.id (rangkuman bootcamp 2026) (2026)"
      },
      {
       "program": "Sertifikasi BNSP Data Analyst",
       "jenis": "Sertifikasi kompetensi",
       "biaya_min": 800000,
       "biaya_max": 2500000,
       "satuan": "per sertifikasi",
       "durasi": "pembekalan ±5-7 hari",
       "sumber": "LSP Ditekindo; dilatih.co (2026)"
      }
     ],
     "opsional_jangka_panjang": [
      {
       "program": "Universitas Terbuka - S1 (umum)",
       "jenis": "Kuliah jarak jauh (cocok sambil bekerja)",
       "biaya_min": 1300000,
       "biaya_max": 1300000,
       "satuan": "per semester",
       "durasi": "±8 semester",
       "sumber": "Kompas.com Edu; laman admisi UT (2026)"
      }
     ],
     "estimasi_biaya_jalur_utama": {
      "min": 800000,
      "max": 2500000
     },
     "catatan": [
      "Sebagian program berbiaya langganan (lihat satuan), belum termasuk di total."
     ]
    },
    "perkiraan_persiapan_bulan": 6,
    "jadwal_pendapatan_untuk_simulasi": [
     {
      "mulai_bulan": 0,
      "penghasilan": 7000000,
      "keterangan": "penghasilan pekerjaan utama saat ini"
     },
     {
      "mulai_bulan": 6,
      "penghasilan": 7250000,
      "keterangan": "perkiraan tahap entry (nilai tengah rentang)"
     },
     {
      "mulai_bulan": 66,
      "penghasilan": 16000000,
      "keterangan": "perkiraan tahap senior (nilai tengah rentang)"
     }
    ],
    "simulasi_siap_pakai": {
     "jadwal_pendapatan": [
      {
       "mulai_bulan": 0,
       "penghasilan": 7000000,
       "keterangan": "penghasilan pekerjaan utama saat ini"
      },
      {
       "mulai_bulan": 6,
       "penghasilan": 7250000,
       "keterangan": "perkiraan tahap entry (nilai tengah rentang)"
      },
      {
       "mulai_bulan": 66,
       "penghasilan": 16000000,
       "keterangan": "perkiraan tahap senior (nilai tengah rentang)"
      }
     ]
    },
    "selisih_tahap_awal_vs_sekarang": 250000
   },
   {
    "id": "data_engineer",
    "profesi": "Data Engineer",
    "bidang": "Teknologi & Data",
    "skor_kecocokan": 58,
    "target_pengguna": false,
    "alasan": [
     "Cocok dengan minatmu: komputer.",
     "Kamu sudah punya 2 dari 4 skill wajib.",
     "Pengalaman kerjamu sangat relevan, jadi bisa masuk tanpa mulai dari nol."
    ],
    "deskripsi": "Membangun dan merawat pipeline serta infrastruktur data agar data siap dipakai analis dan sistem AI.",
    "jenjang_karier": [
     "Junior Data Engineer",
     "Data Engineer",
     "Senior Data Engineer",
     "Lead/Staff Engineer",
     "Data Architect"
    ],
    "pendidikan_umum": "S1 Informatika/Sistem Informasi/Teknik Komputer atau setara; jalur umum: dari Data Analyst atau Software Engineer",
    "skill_sudah_dimiliki": [
     "SQL lanjutan",
     "Python"
    ],
    "skill_gap_wajib": [
     "ETL/ELT pipeline",
     "konsep data warehouse"
    ],
    "skill_gap_pendukung": [
     "cloud (GCP/AWS/Azure)",
     "Airflow/orchestration",
     "Spark"
    ],
    "jalur_pendapatan": {
     "tahapan": [
      {
       "tahap": "mid",
       "rentang_min": 8833333,
       "rentang_max": 17812500,
       "nilai_tengah": 11108333,
       "perkiraan_tahun_ke": "2-5",
       "sumber": [
        "Glassdoor - Data Engineer Jakarta (Oktober 2026)"
       ]
      }
     ]
    },
    "jalur_belajar": {
     "jalur_utama": [
      {
       "program": "Bootcamp Data Analyst (umum)",
       "jenis": "Bootcamp",
       "biaya_min": 2000000,
       "biaya_max": 40000000,
       "satuan": "per program",
       "durasi": "1-6 bulan",
       "sumber": "tempatbelajar.id (2026)"
      }
     ],
     "opsional_jangka_panjang": [
      {
       "program": "Universitas Terbuka - S1 Sistem Informasi",
       "jenis": "Kuliah jarak jauh",
       "biaya_min": 1800000,
       "biaya_max": 1800000,
       "satuan": "per semester",
       "durasi": "±8 semester",
       "sumber": "Kompas.com Edu (2026)"
      }
     ],
     "estimasi_biaya_jalur_utama": {
      "min": 2000000,
      "max": 40000000
     },
     "catatan": []
    },
    "perkiraan_persiapan_bulan": 12,
    "jadwal_pendapatan_untuk_simulasi": [
     {
      "mulai_bulan": 0,
      "penghasilan": 7000000,
      "keterangan": "penghasilan pekerjaan utama saat ini"
     },
     {
      "mulai_bulan": 12,
      "penghasilan": 11108333,
      "keterangan": "perkiraan tahap mid (nilai tengah rentang)"
     }
    ],
    "simulasi_siap_pakai": {
     "jadwal_pendapatan": [
      {
       "mulai_bulan": 0,
       "penghasilan": 7000000,
       "keterangan": "penghasilan pekerjaan utama saat ini"
      },
      {
       "mulai_bulan": 12,
       "penghasilan": 11108333,
       "keterangan": "perkiraan tahap mid (nilai tengah rentang)"
      }
     ]
    },
    "selisih_tahap_awal_vs_sekarang": 4108333
   }
  ],
  "profesi_lain": [
   {
    "profesi": "Software Engineer",
    "skor_kecocokan": 58
   },
   {
    "profesi": "Staff PPIC",
    "skor_kecocokan": 36
   },
   {
    "profesi": "Supervisor Gudang",
    "skor_kecocokan": 19
   },
   {
    "profesi": "UI/UX Designer",
    "skor_kecocokan": 15
   },
   {
    "profesi": "Digital Marketing",
    "skor_kecocokan": 10
   },
   {
    "profesi": "Teknisi Listrik",
    "skor_kecocokan": 10
   },
   {
    "profesi": "Teknisi Mekanik / Mekanik",
    "skor_kecocokan": 10
   }
  ],
  "konteks_wilayah": {
   "jenis": "UMK 2026",
   "wilayah": "Kota Bogor",
   "nilai": 5437203
  },
  "catatan_target": null,
  "total_pengalaman_tahun": 2.0,
  "catatan_metode": [
   "Skor kecocokan 0-100: minat (35), skill wajib yang sudah dimiliki (35), relevansi pengalaman (20), kesesuaian pendidikan (10).",
   "Jadwal pendapatan menggantikan penghasilan pekerjaan utama saja; pendapatan sampingan dan pasangan tetap dihitung terpisah. Rentang gaji dari database eksternal myCITA beserta sumbernya; jadwal pendapatan memakai nilai tengah rentang dan asumsi umum lama jenjang (entry 0-2 th, mid 2-5 th, senior 5+ th).",
   "Rekomendasi tidak memakai jenis kelamin, usia, agama, atau asal daerah sebagai faktor."
  ],
  "sumber_data": "Database Eksternal myCITA v1.0 (Oktober 2026)",
  "disclaimer": "Rekomendasi adalah gambaran awal berdasarkan data yang kamu isi dan data referensi pasar. Keputusan tetap di tanganmu."
 },
 "karier_simulasi": {
  "data_scientist": {
   "sebelum": {
    "sisa": 2650000,
    "skor": 70,
    "target": {
     "Toyota Avanza": "7 tahun 8 bulan",
     "Menikah (intimate)": "13 tahun"
    }
   },
   "sesudah": {
    "sisa": 2650000,
    "skor": 70,
    "target": {
     "Toyota Avanza": "5 tahun 6 bulan",
     "Menikah (intimate)": "4 tahun 1 bulan"
    }
   }
  },
  "data_scientist_kopi_pesimis": {
   "sebelum": {
    "sisa": 2650000,
    "skor": 70,
    "target": {
     "Toyota Avanza": "7 tahun 8 bulan",
     "Menikah (intimate)": "13 tahun"
    }
   },
   "sesudah": {
    "sisa": 2650000,
    "skor": 70,
    "target": {
     "Toyota Avanza": "4 tahun 1 bulan",
     "Menikah (intimate)": "2 tahun 8 bulan"
    }
   }
  },
  "data_scientist_kopi_moderat": {
   "sebelum": {
    "sisa": 2650000,
    "skor": 70,
    "target": {
     "Toyota Avanza": "7 tahun 8 bulan",
     "Menikah (intimate)": "13 tahun"
    }
   },
   "sesudah": {
    "sisa": 2650000,
    "skor": 70,
    "target": {
     "Toyota Avanza": "3 tahun 4 bulan",
     "Menikah (intimate)": "2 tahun 1 bulan"
    }
   }
  },
  "kopi_pesimis": {
   "sebelum": {
    "sisa": 2650000,
    "skor": 70,
    "target": {
     "Toyota Avanza": "7 tahun 8 bulan",
     "Menikah (intimate)": "13 tahun"
    }
   },
   "sesudah": {
    "sisa": 2650000,
    "skor": 70,
    "target": {
     "Toyota Avanza": "6 tahun 11 bulan",
     "Menikah (intimate)": "7 tahun 5 bulan"
    }
   }
  },
  "data_analyst": {
   "sebelum": {
    "sisa": 2650000,
    "skor": 70,
    "target": {
     "Toyota Avanza": "7 tahun 8 bulan",
     "Menikah (intimate)": "13 tahun"
    }
   },
   "sesudah": {
    "sisa": 2650000,
    "skor": 70,
    "target": {
     "Toyota Avanza": "5 tahun 2 bulan",
     "Menikah (intimate)": "6 tahun 3 bulan"
    }
   }
  },
  "supply_chain_analyst": {
   "sebelum": {
    "sisa": 2650000,
    "skor": 70,
    "target": {
     "Toyota Avanza": "7 tahun 8 bulan",
     "Menikah (intimate)": "13 tahun"
    }
   },
   "sesudah": {
    "sisa": 2650000,
    "skor": 70,
    "target": {
     "Toyota Avanza": "6 tahun",
     "Menikah (intimate)": "7 tahun 4 bulan"
    }
   }
  },
  "data_engineer": {
   "sebelum": {
    "sisa": 2650000,
    "skor": 70,
    "target": {
     "Toyota Avanza": "7 tahun 8 bulan",
     "Menikah (intimate)": "13 tahun"
    }
   },
   "sesudah": {
    "sisa": 2650000,
    "skor": 70,
    "target": {
     "Toyota Avanza": "4 tahun 9 bulan",
     "Menikah (intimate)": "6 tahun"
    }
   }
  }
 },
 "usaha_input": {
  "user_id": "budi",
  "minat": [
   "otomotif",
   "motor"
  ],
  "skill": [
   "servis motor",
   "pelayanan pelanggan"
  ],
  "pengalaman": [
   {
    "bidang": "bengkel otomotif",
    "tahun": 2
   }
  ],
  "modal_tersedia": 10000000,
  "waktu": "sampingan"
 },
 "usaha": {
  "status": "ok",
  "user_id": "budi",
  "pesan": "Eksplorasi usaha selesai: Bengkel motor rumahan, Bengkel motor kecil-menengah (ruko), Laundry kiloan rumahan.",
  "rekomendasi": [
   {
    "id": "bengkel_rumahan",
    "usaha": "Bengkel motor rumahan",
    "bidang": "Otomotif",
    "skor_kecocokan": 100,
    "pilihan_pengguna": false,
    "alasan": [
     "Modalmu Rp10.000.000 sudah masuk kisaran modal awal Rp5.000.000-Rp15.000.000.",
     "Sesuai minatmu: motor, otomotif.",
     "Pengalaman kerjamu relevan dengan usaha ini."
    ],
    "modal_awal": {
     "min": 5000000,
     "max": 15000000,
     "dipakai_simulasi": 10000000,
     "kekurangan": 0
    },
    "biaya_operasional_bulanan": "Kecil (tanpa sewa); stok oli/sparepart fast moving",
    "model_pendapatan": "Jasa servis ringan (±Rp50-150 rb/motor) + penjualan sparepart",
    "skenario": {
     "pesimis": {
      "omzet_bulanan_stabil": 3900000,
      "margin_persen": 25,
      "laba_bulanan_stabil": 975000,
      "laba_tahun_pertama": 9652500,
      "balik_modal_bulan": 13,
      "balik_modal": "13 bulan"
     },
     "moderat": {
      "omzet_bulanan_stabil": 7150000,
      "margin_persen": 32,
      "laba_bulanan_stabil": 2323750,
      "laba_tahun_pertama": 23005125,
      "balik_modal_bulan": 7,
      "balik_modal": "7 bulan"
     },
     "optimis": {
      "omzet_bulanan_stabil": 10400000,
      "margin_persen": 40,
      "laba_bulanan_stabil": 4160000,
      "laba_tahun_pertama": 41184000,
      "balik_modal_bulan": 5,
      "balik_modal": "5 bulan"
     }
    },
    "balik_modal_menurut_sumber": "8-12 bulan",
    "modal_belum_cukup": false,
    "skill_sudah_dimiliki": [
     "keterampilan mekanik",
     "pelayanan pelanggan"
    ],
    "skill_gap": [
     "diagnosis kerusakan"
    ],
    "risiko": [
     "lokasi kurang strategis",
     "persaingan bengkel sekitar",
     "modal stok sparepart"
    ],
    "dasar_angka": "ASUMSI myCITA: 3-4 motor/hari × Rp50-100 rb (tarif servis ringan dari sumber) × 26 hari; margin 25-40% asumsi karena belum ada data terverifikasi",
    "sumber": "setupbengkel.com; Liputan6 (2025); OJC Auto Course (2025-2026)",
    "roadmap_usaha": [
     {
      "fase": "Bulan 0-1: Persiapan",
      "langkah": [
       "Riset lokasi, calon pelanggan, dan pesaing sekitar",
       "Urus NIB lewat OSS untuk usaha mikro",
       "Siapkan alat dan pisahkan rekening usaha dari rekening pribadi"
      ]
     },
     {
      "fase": "Bulan 1-3: Uji pasar",
      "langkah": [
       "Mulai promosi lokal (WhatsApp, Google Maps, media sosial)",
       "Catat setiap pemasukan dan pengeluaran harian",
       "Kumpulkan masukan pelanggan pertama"
      ]
     },
     {
      "fase": "Bulan 4-6: Stabilkan",
      "langkah": [
       "Evaluasi harga, biaya, dan jam operasional",
       "Bangun pelanggan tetap (program langganan/loyalitas)",
       "Sisihkan dana cadangan usaha"
      ]
     },
     {
      "fase": "Bulan 7-12: Evaluasi & kembangkan",
      "langkah": [
       "Bandingkan laba nyata dengan skenario myCITA",
       "Jika laba stabil, pertimbangkan tambah kapasitas atau layanan",
       "Jika di bawah skenario pesimis, tinjau ulang lokasi atau model usaha"
      ]
     }
    ],
    "mode": "sampingan",
    "simulasi_siap_pakai": {
     "pendapatan_tambahan_jadwal": [
      {
       "mulai_bulan": 0,
       "nilai": 697125
      },
      {
       "mulai_bulan": 1,
       "nilai": 1022450
      },
      {
       "mulai_bulan": 2,
       "nilai": 1347775
      },
      {
       "mulai_bulan": 3,
       "nilai": 1673100
      },
      {
       "mulai_bulan": 4,
       "nilai": 1998425
      },
      {
       "mulai_bulan": 5,
       "nilai": 2323750
      }
     ],
     "biaya_awal": 10000000
    }
   },
   {
    "id": "bengkel_kecil_ruko",
    "usaha": "Bengkel motor kecil-menengah (ruko)",
    "bidang": "Otomotif",
    "skor_kecocokan": 64,
    "pilihan_pengguna": false,
    "alasan": [
     "Modalmu masih kurang Rp15.000.000 dari modal minimal Rp25.000.000. Simulasi mengasumsikan kekurangan ini sudah tertutup (misalnya dari tabungan tambahan), jadi siapkan dulu sebelum memulai.",
     "Sesuai minatmu: motor, otomotif.",
     "Pengalaman kerjamu relevan dengan usaha ini."
    ],
    "modal_awal": {
     "min": 25000000,
     "max": 70000000,
     "dipakai_simulasi": 25000000,
     "kekurangan": 15000000
    },
    "biaya_operasional_bulanan": "Sewa Rp10-30 jt/tahun, gaji mekanik ±Rp2-5 jt/orang, listrik Rp0,5-1,5 jt",
    "model_pendapatan": "10-15 motor/hari; omzet dilaporkan bervariasi ±Rp9-30 jt/bulan tergantung lokasi & layanan",
    "skenario": {
     "pesimis": {
      "omzet_bulanan_stabil": 9000000,
      "margin_persen": 20,
      "laba_bulanan_stabil": 1800000,
      "laba_tahun_pertama": 17820000,
      "balik_modal_bulan": 16,
      "balik_modal": "16 bulan"
     },
     "moderat": {
      "omzet_bulanan_stabil": 19500000,
      "margin_persen": 28,
      "laba_bulanan_stabil": 5362500,
      "laba_tahun_pertama": 53088750,
      "balik_modal_bulan": 7,
      "balik_modal": "7 bulan"
     },
     "optimis": {
      "omzet_bulanan_stabil": 30000000,
      "margin_persen": 35,
      "laba_bulanan_stabil": 10500000,
      "laba_tahun_pertama": 103950000,
      "balik_modal_bulan": 5,
      "balik_modal": "5 bulan"
     }
    },
    "balik_modal_menurut_sumber": "6-12 bulan",
    "modal_belum_cukup": true,
    "skill_sudah_dimiliki": [
     "keterampilan mekanik"
    ],
    "skill_gap": [
     "manajemen stok sparepart",
     "manajemen karyawan",
     "pemasaran"
    ],
    "risiko": [
     "sewa dan izin",
     "modal stok",
     "ketergantungan pada mekanik terampil"
    ],
    "dasar_angka": "Omzet dari rentang yang dilaporkan sumber; margin 20-35% ASUMSI myCITA",
    "sumber": "foliopos.com (2026); setupbengkel.com; bikincabang.id; liputan6.com (2025-2026)",
    "roadmap_usaha": [
     {
      "fase": "Bulan 0-1: Persiapan",
      "langkah": [
       "Riset lokasi, calon pelanggan, dan pesaing sekitar",
       "Urus NIB lewat OSS untuk usaha mikro",
       "Siapkan alat dan pisahkan rekening usaha dari rekening pribadi"
      ]
     },
     {
      "fase": "Bulan 1-3: Uji pasar",
      "langkah": [
       "Mulai promosi lokal (WhatsApp, Google Maps, media sosial)",
       "Catat setiap pemasukan dan pengeluaran harian",
       "Kumpulkan masukan pelanggan pertama"
      ]
     },
     {
      "fase": "Bulan 4-6: Stabilkan",
      "langkah": [
       "Evaluasi harga, biaya, dan jam operasional",
       "Bangun pelanggan tetap (program langganan/loyalitas)",
       "Sisihkan dana cadangan usaha"
      ]
     },
     {
      "fase": "Bulan 7-12: Evaluasi & kembangkan",
      "langkah": [
       "Bandingkan laba nyata dengan skenario myCITA",
       "Jika laba stabil, pertimbangkan tambah kapasitas atau layanan",
       "Jika di bawah skenario pesimis, tinjau ulang lokasi atau model usaha"
      ]
     }
    ],
    "mode": "sampingan",
    "simulasi_siap_pakai": {
     "pendapatan_tambahan_jadwal": [
      {
       "mulai_bulan": 0,
       "nilai": 1608750
      },
      {
       "mulai_bulan": 1,
       "nilai": 2359500
      },
      {
       "mulai_bulan": 2,
       "nilai": 3110250
      },
      {
       "mulai_bulan": 3,
       "nilai": 3861000
      },
      {
       "mulai_bulan": 4,
       "nilai": 4611750
      },
      {
       "mulai_bulan": 5,
       "nilai": 5362500
      }
     ],
     "biaya_awal": 25000000
    }
   },
   {
    "id": "laundry_rumahan",
    "usaha": "Laundry kiloan rumahan",
    "bidang": "Jasa",
    "skor_kecocokan": 50,
    "pilihan_pengguna": false,
    "alasan": [
     "Modalmu Rp10.000.000 sudah masuk kisaran modal awal Rp7.000.000-Rp18.000.000."
    ],
    "modal_awal": {
     "min": 7000000,
     "max": 18000000,
     "dipakai_simulasi": 10000000,
     "kekurangan": 0
    },
    "biaya_operasional_bulanan": "Rp3-4,5 jt (tanpa sewa tempat)",
    "model_pendapatan": "Tarif per kg (umumnya Rp6-15 rb/kg tergantung lokasi)",
    "skenario": {
     "pesimis": {
      "omzet_bulanan_stabil": 6000000,
      "margin_persen": 30,
      "laba_bulanan_stabil": 1800000,
      "laba_tahun_pertama": 17820000,
      "balik_modal_bulan": 8,
      "balik_modal": "8 bulan"
     },
     "moderat": {
      "omzet_bulanan_stabil": 9750000,
      "margin_persen": 40,
      "laba_bulanan_stabil": 3900000,
      "laba_tahun_pertama": 38610000,
      "balik_modal_bulan": 5,
      "balik_modal": "5 bulan"
     },
     "optimis": {
      "omzet_bulanan_stabil": 13500000,
      "margin_persen": 50,
      "laba_bulanan_stabil": 6750000,
      "laba_tahun_pertama": 66825000,
      "balik_modal_bulan": 4,
      "balik_modal": "4 bulan"
     }
    },
    "balik_modal_menurut_sumber": "6-14 bulan",
    "modal_belum_cukup": false,
    "skill_sudah_dimiliki": [
     "pelayanan pelanggan"
    ],
    "skill_gap": [
     "manajemen operasional",
     "pembukuan sederhana"
    ],
    "risiko": [
     "persaingan lokal",
     "kerusakan mesin",
     "ketergantungan cuaca jika tanpa pengering"
    ],
    "dasar_angka": "Omzet dihitung dari asumsi sumber: Rp10-15 rb/kg × 20-30 kg/hari × 30 hari; margin 30-50% dari cuciqu.com",
    "sumber": "VIVA Tangerang; cuciqu.com (2026); ottodigital.id (2025-2026)",
    "roadmap_usaha": [
     {
      "fase": "Bulan 0-1: Persiapan",
      "langkah": [
       "Riset lokasi, calon pelanggan, dan pesaing sekitar",
       "Urus NIB lewat OSS untuk usaha mikro",
       "Siapkan alat dan pisahkan rekening usaha dari rekening pribadi"
      ]
     },
     {
      "fase": "Bulan 1-3: Uji pasar",
      "langkah": [
       "Mulai promosi lokal (WhatsApp, Google Maps, media sosial)",
       "Catat setiap pemasukan dan pengeluaran harian",
       "Kumpulkan masukan pelanggan pertama"
      ]
     },
     {
      "fase": "Bulan 4-6: Stabilkan",
      "langkah": [
       "Evaluasi harga, biaya, dan jam operasional",
       "Bangun pelanggan tetap (program langganan/loyalitas)",
       "Sisihkan dana cadangan usaha"
      ]
     },
     {
      "fase": "Bulan 7-12: Evaluasi & kembangkan",
      "langkah": [
       "Bandingkan laba nyata dengan skenario myCITA",
       "Jika laba stabil, pertimbangkan tambah kapasitas atau layanan",
       "Jika di bawah skenario pesimis, tinjau ulang lokasi atau model usaha"
      ]
     }
    ],
    "mode": "sampingan",
    "simulasi_siap_pakai": {
     "pendapatan_tambahan_jadwal": [
      {
       "mulai_bulan": 0,
       "nilai": 1170000
      },
      {
       "mulai_bulan": 1,
       "nilai": 1716000
      },
      {
       "mulai_bulan": 2,
       "nilai": 2262000
      },
      {
       "mulai_bulan": 3,
       "nilai": 2808000
      },
      {
       "mulai_bulan": 4,
       "nilai": 3354000
      },
      {
       "mulai_bulan": 5,
       "nilai": 3900000
      }
     ],
     "biaya_awal": 10000000
    }
   }
  ],
  "usaha_lain": [
   {
    "usaha": "Laundry kiloan skala kecil profesional",
    "skor_kecocokan": 20
   }
  ],
  "mode": "sampingan",
  "catatan_metode": [
   "Skor kecocokan 0-100: kecukupan modal (40), minat (30), skill & pengalaman (30).",
   "Skenario: pesimis = omzet & margin terendah, moderat = nilai tengah, optimis = tertinggi dari database. Masa rintisan: bulan 1 baru 30% dari kondisi stabil, stabil di bulan ke-6.",
   "simulasi_siap_pakai bisa langsung dikirim ke analisis_keuangan_mycita untuk melihat dampak ke tujuan finansial (memakai skenario moderat)."
  ],
  "catatan_database": "Template usaha masih terbatas (laundry dan bengkel motor). Angka yang ditandai ASUMSI myCITA belum memiliki sumber terverifikasi.",
  "sumber_data": "Database Eksternal myCITA v1.0 (Oktober 2026)",
  "disclaimer": "Simulasi usaha adalah skenario berdasarkan data referensi, bukan jaminan keuntungan. Hasil nyata sangat bergantung pada lokasi dan pengelolaan."
 },
 "usaha_kopi": {
  "status": "ok",
  "user_id": "budi",
  "pesan": "Eksplorasi usaha selesai: Kopi keliling, Es teh jumbo, Warkop.",
  "rekomendasi": [
   {
    "id": "kopi_keliling",
    "usaha": "Kopi keliling",
    "bidang": "Minuman & Kuliner",
    "skor_kecocokan": 80,
    "pilihan_pengguna": false,
    "alasan": [
     "Modalmu Rp3 jt melebihi kebutuhan Rp1–2,5 jt; sisanya jadi dana cadangan usaha.",
     "Sesuai minatmu: kopi, minuman, kuliner.",
     "Cocok dijalankan sampingan akhir pekan."
    ],
    "modal_awal": {
     "min": 1000000,
     "max": 2500000,
     "dipakai_simulasi": 2500000,
     "kekurangan": 0
    },
    "biaya_operasional_bulanan": "Bahan baku harian, bensin",
    "model_pendapatan": "Kopi Rp5–15 rb per gelas",
    "skenario": {
     "pesimis": {
      "omzet_bulanan_stabil": 8000000,
      "margin_persen": 30,
      "laba_bulanan_stabil": 2400000,
      "laba_tahun_pertama": 23760000,
      "balik_modal_bulan": 3,
      "balik_modal": "3 bulan"
     },
     "moderat": {
      "omzet_bulanan_stabil": 14250000,
      "margin_persen": 30,
      "laba_bulanan_stabil": 4275000,
      "laba_tahun_pertama": 42322500,
      "balik_modal_bulan": 2,
      "balik_modal": "2 bulan"
     },
     "optimis": {
      "omzet_bulanan_stabil": 22000000,
      "margin_persen": 30,
      "laba_bulanan_stabil": 6600000,
      "laba_tahun_pertama": 65340000,
      "balik_modal_bulan": 2,
      "balik_modal": "2 bulan"
     }
    },
    "balik_modal_menurut_sumber": "2-4 bulan",
    "modal_belum_cukup": false,
    "skill_sudah_dimiliki": ["pelayanan pelanggan", "komunikasi"],
    "skill_gap": ["racik kopi", "manajemen stok minuman"],
    "risiko": ["cuaca (berjualan di luar ruangan)", "izin berjualan di lokasi", "persaingan penjual kopi"],
    "dasar_angka": "Omzet dihitung dari asumsi 20-50 gelas/hari × Rp5-15 rb × 26 hari (akhir pekan saja lebih kecil). Margin 30% asumsi myCITA. Sumber: Medcom 2026 (data usaha penuh waktu); pakai skenario pesimis sebagai acuan usaha sampingan.",
    "sumber": "Medcom 2026",
    "roadmap_usaha": [
     {
      "fase": "Bulan 0-1: Persiapan",
      "langkah": ["Riset lokasi, urus NIB lewat OSS, siapkan alat"]
     },
     {
      "fase": "Bulan 1-3: Uji pasar",
      "langkah": ["Jualan akhir pekan, catat transaksi harian"]
     },
     {
      "fase": "Bulan 3-6: Stabilkan",
      "langkah": ["Evaluasi harga & lokasi, bangun pelanggan tetap"]
     },
     {
      "fase": "Bulan 6-12: Kembangkan",
      "langkah": ["Tambah hari jualan atau titip jual jika laba stabil"]
     }
    ],
    "mode": "sampingan",
    "simulasi_siap_pakai": {
     "pendapatan_tambahan_jadwal": [
      { "mulai_bulan": 0, "nilai": 720000 },
      { "mulai_bulan": 1, "nilai": 1056000 },
      { "mulai_bulan": 2, "nilai": 1392000 },
      { "mulai_bulan": 3, "nilai": 1728000 },
      { "mulai_bulan": 4, "nilai": 2064000 },
      { "mulai_bulan": 5, "nilai": 2400000 }
     ],
     "biaya_awal": 2500000
    }
   },
   {
    "id": "es_teh_jumbo",
    "usaha": "Es teh jumbo",
    "bidang": "Minuman",
    "skor_kecocokan": 80,
    "pilihan_pengguna": false,
    "alasan": [
     "Modal Rp3 jt masuk kisaran Rp1–20 jt.",
     "Sesuai minatmu: minuman, kuliner."
    ],
    "modal_awal": { "min": 1000000, "max": 20000000, "dipakai_simulasi": 3000000, "kekurangan": 0 },
    "biaya_operasional_bulanan": "Bahan baku harian",
    "model_pendapatan": "Es teh Rp3–8 rb per botol",
    "skenario": {
     "pesimis": { "omzet_bulanan_stabil": 6000000, "margin_persen": 35, "laba_bulanan_stabil": 2100000, "laba_tahun_pertama": 20790000, "balik_modal_bulan": 2, "balik_modal": "2 bulan" },
     "moderat": { "omzet_bulanan_stabil": 10000000, "margin_persen": 35, "laba_bulanan_stabil": 3500000, "laba_tahun_pertama": 34650000, "balik_modal_bulan": 1, "balik_modal": "1 bulan" },
     "optimis": { "omzet_bulanan_stabil": 15000000, "margin_persen": 35, "laba_bulanan_stabil": 5250000, "laba_tahun_pertama": 51975000, "balik_modal_bulan": 1, "balik_modal": "1 bulan" }
    },
    "balik_modal_menurut_sumber": "1-3 bulan",
    "modal_belum_cukup": false,
    "skill_sudah_dimiliki": ["pelayanan pelanggan"],
    "skill_gap": ["racikan minuman", "manajemen stok"],
    "risiko": ["persaingan tinggi", "cuaca", "ketergantungan lokasi"],
    "dasar_angka": "Angka asumsi myCITA berdasarkan tren usaha es teh 2026.",
    "sumber": "myCITA internal estimate 2026",
    "roadmap_usaha": [
     { "fase": "Bulan 0-1: Persiapan", "langkah": ["Pilih resep, coba 10-20 porsi di lingkungan sekitar"] },
     { "fase": "Bulan 1-3: Uji pasar", "langkah": ["Cari titik jual strategis, catat omzet harian"] },
     { "fase": "Bulan 3-6: Stabilkan", "langkah": ["Buat paket hemat, bangun pelanggan tetap"] },
     { "fase": "Bulan 6-12: Kembangkan", "langkah": ["Tambah titik jual atau jenis minuman"] }
    ],
    "mode": "sampingan",
    "simulasi_siap_pakai": {
     "pendapatan_tambahan_jadwal": [
      { "mulai_bulan": 0, "nilai": 630000 }, { "mulai_bulan": 1, "nilai": 924000 },
      { "mulai_bulan": 2, "nilai": 1218000 }, { "mulai_bulan": 3, "nilai": 1512000 },
      { "mulai_bulan": 4, "nilai": 1806000 }, { "mulai_bulan": 5, "nilai": 2100000 }
     ],
     "biaya_awal": 3000000
    }
   },
   {
    "id": "warkop",
    "usaha": "Warkop",
    "bidang": "Minuman & Kuliner",
    "skor_kecocokan": 74,
    "pilihan_pengguna": false,
    "alasan": [
     "Modalmu Rp3 jt kurang dari modal minimal Rp5 jt.",
     "Sesuai minatmu: kopi, minuman."
    ],
    "modal_awal": { "min": 5000000, "max": 10000000, "dipakai_simulasi": 5000000, "kekurangan": 2000000 },
    "biaya_operasional_bulanan": "Sewa tempat atau gerobak, bahan baku",
    "model_pendapatan": "Kopi & minuman Rp5–20 rb per gelas + makanan ringan",
    "skenario": {
     "pesimis": { "omzet_bulanan_stabil": 6000000, "margin_persen": 25, "laba_bulanan_stabil": 1500000, "laba_tahun_pertama": 14850000, "balik_modal_bulan": 4, "balik_modal": "4 bulan" },
     "moderat": { "omzet_bulanan_stabil": 10000000, "margin_persen": 30, "laba_bulanan_stabil": 3000000, "laba_tahun_pertama": 29700000, "balik_modal_bulan": 2, "balik_modal": "2 bulan" },
     "optimis": { "omzet_bulanan_stabil": 15000000, "margin_persen": 35, "laba_bulanan_stabil": 5250000, "laba_tahun_pertama": 51975000, "balik_modal_bulan": 2, "balik_modal": "2 bulan" }
    },
    "balik_modal_menurut_sumber": "2-6 bulan",
    "modal_belum_cukup": true,
    "skill_sudah_dimiliki": ["pelayanan pelanggan"],
    "skill_gap": ["racik kopi, manajemen karyawan"],
    "risiko": ["modal kurang", "butuh tempat tetap", "persaingan"],
    "dasar_angka": "Angka asumsi myCITA.",
    "sumber": "myCITA internal estimate 2026",
    "roadmap_usaha": [
     { "fase": "Bulan 0-2: Persiapan", "langkah": ["Kumpulkan sisa modal, cari lokasi"] },
     { "fase": "Bulan 2-4: Buka", "langkah": ["Buka operasional, promosi lokal"] },
     { "fase": "Bulan 4-6: Stabilkan", "langkah": ["Evaluasi menu dan jam operasional"] },
     { "fase": "Bulan 6-12: Kembangkan", "langkah": ["Tambah menu makanan ringan"] }
    ],
    "mode": "sampingan",
    "simulasi_siap_pakai": {
     "pendapatan_tambahan_jadwal": [
      { "mulai_bulan": 0, "nilai": 450000 }, { "mulai_bulan": 1, "nilai": 660000 },
      { "mulai_bulan": 2, "nilai": 870000 }, { "mulai_bulan": 3, "nilai": 1080000 },
      { "mulai_bulan": 4, "nilai": 1290000 }, { "mulai_bulan": 5, "nilai": 1500000 }
     ],
     "biaya_awal": 5000000
    }
   }
  ],
  "mode": "sampingan",
  "catatan_metode": ["Kecocokan = modal (40) + minat (30) + skill & pengalaman (30). Warkop butuh modal lebih besar; simpan dulu.", "simulasi_siap_pakai bisa langsung dikirim ke analisis_keuangan_mycita."],
  "catatan_database": "Angka kopi/minuman dari data referensi 2026.",
  "disclaimer": "Simulasi usaha adalah skenario berdasarkan data referensi, bukan jaminan keuntungan."
 },
 "usaha_simulasi": {
 "agus_bengkel_plus20": {
   "sebelum": {
    "sisa": 5500000,
    "skor": 84,
    "target": {
     "Rumah Bekasi": "22 tahun 2 bulan"
    }
   },
   "sesudah": {
    "sisa": 7700000,
    "skor": 88,
    "target": {
     "Rumah Bekasi": "10 tahun"
    }
   }
  },
  "agus_kelontong_plus25": {
   "sebelum": {
    "sisa": 5500000,
    "skor": 84,
    "target": {
     "Rumah Bekasi": "22 tahun 2 bulan"
    }
   },
   "sesudah": {
    "sisa": 6250000,
    "skor": 86,
    "target": {
     "Rumah Bekasi": "14 tahun 8 bulan"
    }
   }
  },
  "agus_bengkel_kelontong": {
   "sebelum": {
    "sisa": 5500000,
    "skor": 84,
    "target": {
     "Rumah Bekasi": "22 tahun 2 bulan"
    }
   },
   "sesudah": {
    "sisa": 8450000,
    "skor": 90,
    "target": {
     "Rumah Bekasi": "8 tahun 8 bulan"
    }
   }
  },
  "agus_bengkel_kelontong_515jt": {
   "sebelum": {
    "sisa": 5500000,
    "skor": 84,
    "target": {
     "Rumah Bekasi": "22 tahun 2 bulan"
    }
   },
   "sesudah": {
    "sisa": 8450000,
    "skor": 90,
    "target": {
     "Rumah Bekasi": "7 tahun"
    }
   }
  },
  "bengkel_rumahan": {
   "sebelum": {
    "sisa": 2650000,
    "skor": 70,
    "target": {
     "Toyota Avanza": "7 tahun 8 bulan",
     "Menikah (intimate)": "13 tahun"
    }
   },
   "sesudah": {
    "sisa": 2650000,
    "skor": 70,
    "target": {
     "Toyota Avanza": "4 tahun 11 bulan",
     "Menikah (intimate)": "7 tahun 5 bulan"
    }
   }
  },
  "bengkel_kecil_ruko": {
   "sebelum": {
    "sisa": 2650000,
    "skor": 70,
    "target": {
     "Toyota Avanza": "7 tahun 8 bulan",
     "Menikah (intimate)": "13 tahun"
    }
   },
   "sesudah": {
    "sisa": 2650000,
    "skor": 70,
    "target": {
     "Toyota Avanza": "4 tahun 7 bulan",
     "Menikah (intimate)": "4 tahun 11 bulan"
    }
   }
  },
  "laundry_rumahan": {
   "sebelum": {
    "sisa": 2650000,
    "skor": 70,
    "target": {
     "Toyota Avanza": "7 tahun 8 bulan",
     "Menikah (intimate)": "13 tahun"
    }
   },
   "sesudah": {
    "sisa": 2650000,
    "skor": 70,
    "target": {
     "Toyota Avanza": "4 tahun 8 bulan",
     "Menikah (intimate)": "5 tahun 9 bulan"
    }
   }
  }
 }
};
