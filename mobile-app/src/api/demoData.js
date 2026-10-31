// Data demo dihasilkan otomatis oleh scripts/ambil-data-demo.mjs dari Langflow.
// JANGAN DIEDIT MANUAL. Jalankan kembali skrip untuk memperbarui.
// Dihasilkan: 2026-10-11T12:32:39.169Z


export const DEMO = {
 "budi": {
  "analisis": {
   "status": "ok",
   "user_id": "budi",
   "mode": "analisis",
   "pesan": "Analisis selesai dan tersimpan.",
   "ringkasan": "Budi: pendapatan Rp7.500.000, pengeluaran Rp5.500.000, sisa Rp2.000.000. Skor kesehatan 100/100 (Sangat sehat 🟢), saving rate 26.7%. Target Menikah: dengan menabung tercapai dalam 3 tahun. Target Mobil: dengan menabung tercapai dalam 22 tahun 1 bulan.",
   "dashboard": {
    "nama": "Budi",
    "pendapatan": 7500000,
    "pengeluaran": 5500000,
    "sisa": 2000000,
    "skor_kesehatan": 100,
    "status": "Sangat sehat 🟢",
    "saving_rate_persen": 26.7
   },
   "kesehatan_keuangan": {
    "penghasilan": 7500000,
    "penghasilan_konservatif": 7500000,
    "pengeluaran_rutin": 5500000,
    "pengeluaran_keinginan": 300000,
    "total_cicilan": 0,
    "total_pengeluaran": 5500000,
    "disposable_income": 2000000,
    "kapasitas_menabung": 2000000,
    "saving_rate_persen": 26.7,
    "rasio_cicilan_persen": 0,
    "rasio_keinginan_persen": 4,
    "rincian_skor": {
     "saving_rate (maks 30)": 30,
     "rasio_cicilan (maks 25)": 25,
     "dana_darurat (maks 25)": 25,
     "pengeluaran_keinginan (maks 10)": 10,
     "hutang_berbunga_tinggi (maks 10)": 10
    },
    "skor": 100,
    "status": "Sangat sehat 🟢"
   },
   "dana_darurat": {
    "dana_likuid_saat_ini": 35000000,
    "cukup_untuk_bulan": 6.4,
    "target_minimum": 16500000,
    "target_ideal": 33000000,
    "target_dipakai": 16500000,
    "kekurangan": 0,
    "perkiraan_waktu_terpenuhi": "sudah tercapai"
   },
   "alokasi_bulan_ini": {
    "kapasitas_menabung": 2000000,
    "untuk_dana_darurat": 0,
    "untuk_target": 2000000,
    "catatan": "Alokasi berubah otomatis: setelah dana darurat terpenuhi atau cicilan lunas, dananya dialihkan ke target."
   },
   "strategi_hutang": [],
   "target": [
    {
     "nama": "Menikah",
     "kategori": "menikah",
     "prioritas": 1,
     "harga_saat_ini": 60000000,
     "sumber_harga": "diisi pengguna",
     "kenaikan_harga_per_tahun_persen": 4,
     "tenggat_bulan": 36,
     "tenggat": "3 tahun",
     "setoran_bulan_pertama": 1360884,
     "opsi_a_menabung": {
      "waktu_tercapai_bulan": 36,
      "waktu_tercapai": "3 tahun",
      "perkiraan_harga_saat_tercapai": 67491840,
      "jika_hanya_fokus_target_ini": "2 tahun",
      "harga_saat_tenggat": 67491840,
      "tercapai_sesuai_tenggat": true
     },
     "catatan_kredit": "Kredit/pinjaman tidak disarankan untuk tujuan konsumtif ini; prioritaskan menabung.",
     "status": "realistis",
     "opsi_disarankan": "menabung"
    },
    {
     "nama": "Mobil",
     "kategori": "mobil",
     "prioritas": 2,
     "harga_saat_ini": 250000000,
     "sumber_harga": "diisi pengguna",
     "kenaikan_harga_per_tahun_persen": 3,
     "tenggat_bulan": 60,
     "tenggat": "5 tahun",
     "setoran_bulan_pertama": 639116,
     "opsi_a_menabung": {
      "waktu_tercapai_bulan": 265,
      "waktu_tercapai": "22 tahun 1 bulan",
      "perkiraan_harga_saat_tercapai": 480207259,
      "jika_hanya_fokus_target_ini": "15 tahun 11 bulan",
      "harga_saat_tenggat": 289818519,
      "tercapai_sesuai_tenggat": false
     },
     "opsi_b_kredit": {
      "dp_persen": 20,
      "dp": 56972824,
      "waktu_kumpulkan_dp_bulan": 53,
      "waktu_kumpulkan_dp": "4 tahun 5 bulan",
      "perkiraan_harga_saat_beli": 284864120,
      "pinjaman": 227891296,
      "bunga_tahunan_persen": 10,
      "cicilan_lama_saat_itu": 0,
      "pilihan_tenor": [
       {
        "tenor_tahun": 3,
        "cicilan_bulanan": 7353411,
        "total_bunga": 36831504,
        "total_dibayar": 321695624,
        "rasio_cicilan_setelah_kredit_persen": 98,
        "aman": false
       },
       {
        "tenor_tahun": 4,
        "cicilan_bulanan": 5779912,
        "total_bunga": 49544480,
        "total_dibayar": 334408600,
        "rasio_cicilan_setelah_kredit_persen": 77.1,
        "aman": false
       },
       {
        "tenor_tahun": 5,
        "cicilan_bulanan": 4842017,
        "total_bunga": 62629697,
        "total_dibayar": 347493817,
        "rasio_cicilan_setelah_kredit_persen": 64.6,
        "aman": false
       }
      ],
      "tenor_aman_terpendek": null
     },
     "opsi_c_kombinasi": {
      "dp_persen": 35,
      "dp": 106035189,
      "waktu_kumpulkan_dp_bulan": 78,
      "waktu_kumpulkan_dp": "6 tahun 6 bulan",
      "perkiraan_harga_saat_beli": 302957682,
      "pinjaman": 196922493,
      "bunga_tahunan_persen": 10,
      "cicilan_lama_saat_itu": 0,
      "pilihan_tenor": [
       {
        "tenor_tahun": 3,
        "cicilan_bulanan": 6354135,
        "total_bunga": 31826365,
        "total_dibayar": 334784047,
        "rasio_cicilan_setelah_kredit_persen": 84.7,
        "aman": false
       },
       {
        "tenor_tahun": 4,
        "cicilan_bulanan": 4994463,
        "total_bunga": 42811739,
        "total_dibayar": 345769421,
        "rasio_cicilan_setelah_kredit_persen": 66.6,
        "aman": false
       },
       {
        "tenor_tahun": 5,
        "cicilan_bulanan": 4184021,
        "total_bunga": 54118768,
        "total_dibayar": 357076450,
        "rasio_cicilan_setelah_kredit_persen": 55.8,
        "aman": false
       }
      ],
      "tenor_aman_terpendek": null,
      "keterangan": "Menabung lebih lama untuk DP 35% agar pinjaman dan total bunga lebih kecil."
     },
     "status": "perlu_penyesuaian",
     "opsi_disarankan": "sesuaikan_rencana",
     "alternatif": {
      "tambahan_tabungan_per_bulan_agar_tepat_waktu": 3646839,
      "harga_maksimal_terjangkau_sesuai_tenggat": 61000000,
      "perpanjang_tenggat_menjadi": "22 tahun 1 bulan"
     }
    }
   ],
   "rekomendasi_utama": [
    "Target 'Mobil' belum realistis dalam 5 tahun. Dengan kondisi sekarang baru tercapai 22 tahun 1 bulan, terlalu jauh dari tenggat. Pilihan: naikkan penghasilan lewat jalur karier atau usaha (lihat simulasinya di Roadmap), atau turunkan budget ke ±Rp61.000.000, atau tambah tabungan/penghasilan ±Rp3.646.839/bulan."
   ],
   "psikologi": null,
   "asumsi": {
    "inflasi_umum_persen": 3.2,
    "kenaikan_harga_persen": {
     "rumah": 4,
     "rumah_subsidi": 3,
     "mobil": 3,
     "motor": 3,
     "menikah": 4,
     "pendidikan": 6,
     "default": 3.2
    },
    "bunga_kredit_persen": {
     "rumah": 11,
     "rumah_subsidi": 5,
     "mobil": 10,
     "motor": 15
    },
    "dp_persen": {
     "rumah": 20,
     "rumah_subsidi": 1,
     "mobil": 20,
     "motor": 15
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
    "imbal_hasil_tabungan_persen": 0,
    "kenaikan_penghasilan_persen": 0,
    "pakai_penghasilan_konservatif": false,
    "batas_aman_cicilan_persen": 30,
    "porsi_dana_darurat_persen": 50
   },
   "sumber_asumsi": [
    "Inflasi umum 3,2%: inflasi tahunan Indonesia Agustus 2026 tercatat 3,19% (BPS via Databoks); sasaran BI 2,5±1%.",
    "Bunga KPR 11%: bunga floating KPR BCA 11% (Mandiri 13%, CIMB Niaga 13,5%), Kontan Agustus 2026.",
    "KPR subsidi 5% tetap dan batas harga rumah subsidi Rp166-185 juta: Kompas.com 2026.",
    "Kenaikan harga barang, bunga kredit kendaraan, DP, dan porsi alokasi adalah asumsi myCITA yang dapat diubah.",
    "Penghasilan dan pengeluaran dianggap tetap (konservatif); ubah 'kenaikan_penghasilan_persen' untuk skenario kenaikan gaji."
   ],
   "disclaimer": "myCITA adalah alat edukasi dan perencanaan keuangan, bukan nasihat investasi atau rekomendasi produk keuangan tertentu. Semua angka adalah estimasi berdasarkan data yang kamu isi dan asumsi yang tercantum."
  },
  "karier": {
   "status": "ok",
   "user_id": "budi",
   "pesan": "Eksplorasi karier selesai: Data Scientist, Data Analyst, Supply Chain Analyst.",
   "rekomendasi_jurusan": [],
   "mode_pelajar": false,
   "rekomendasi": [
    {
     "id": "data_scientist",
     "profesi": "Data Scientist",
     "bidang": "Teknologi & Data",
     "skor_kecocokan": 71,
     "target_pengguna": true,
     "alasan": [
      "Cocok dengan minatmu: ai, data, komputer, matematika.",
      "Kamu sudah punya 2 dari 4 skill wajib.",
      "Perlu diperdalam (masih level dasar): statistik & probabilitas, machine learning."
     ],
     "deskripsi": "Membangun model statistik dan machine learning untuk memprediksi, mengelompokkan, atau mengotomatiskan keputusan bisnis.",
     "jenjang_karier": [
      "Junior Data Scientist",
      "Data Scientist",
      "Senior Data Scientist",
      "Lead Data Scientist",
      "Head of Data Science"
     ],
     "pendidikan_umum": "S1 Informatika, Statistika, Matematika, Sains Data, atau setara; jalur umum: dari Data Analyst dengan portofolio machine learning",
     "skill_sudah_dimiliki": [
      "Python (pandas, scikit-learn)",
      "SQL",
      "deep learning"
     ],
     "skill_perlu_diperdalam": [
      "statistik & probabilitas",
      "machine learning"
     ],
     "skill_gap_wajib": [],
     "skill_gap_pendukung": [
      "deployment model (MLOps dasar)",
      "komunikasi hasil analisis"
     ],
     "jalur_pendapatan": {
      "tahapan": [
       {
        "tahap": "entry",
        "rentang_min": 7000000,
        "rentang_max": 11000000,
        "nilai_tengah": 9000000,
        "perkiraan_tahun_ke": "0-2",
        "sumber": [
         "Glassdoor via Tempo Institute (Januari 2026)"
        ]
       },
       {
        "tahap": "mid",
        "rentang_min": 8000000,
        "rentang_max": 19166667,
        "nilai_tengah": 11750000,
        "perkiraan_tahun_ke": "2-5",
        "sumber": [
         "Glassdoor - Data Scientist Jakarta (Februari 2026)",
         "Glassdoor via Tempo Institute (Januari 2026)"
        ]
       },
       {
        "tahap": "senior",
        "rentang_min": 20000000,
        "rentang_max": 35000000,
        "nilai_tengah": 27500000,
        "perkiraan_tahun_ke": "5-seterusnya",
        "sumber": [
         "KantorKu - Gaji Data Scientist 2026 (2026)"
        ]
       }
      ]
     },
     "jalur_belajar": {
      "jalur_utama": [],
      "opsional_jangka_panjang": [
       {
        "program": "Sertifikasi BNSP Data Analyst",
        "jenis": "Sertifikasi kompetensi",
        "biaya_min": 800000,
        "biaya_max": 2500000,
        "satuan": "per sertifikasi",
        "durasi": "pembekalan ±5-7 hari",
        "sumber": "LSP Ditekindo; dilatih.co (2026)"
       },
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
       "min": 0,
       "max": 0
      },
      "catatan": [
       "Jalur utama lewat portofolio dan belajar mandiri; biaya bootcamp spesifik belum ada di database."
      ]
     },
     "perkiraan_persiapan_bulan": 4,
     "rekomendasi_pendidikan": [
      {
       "jurusan": "S1 Sains Data / Statistika",
       "skill_dibangun": [
        "statistik",
        "Python",
        "SQL",
        "visualisasi data",
        "machine learning dasar"
       ],
       "biaya_referensi": [
        {
         "program": "Universitas Terbuka - S1 Sains Data",
         "biaya_min": 1900000,
         "biaya_max": 1900000,
         "satuan": "per semester",
         "sumber": "Kompas.com Edu (2026)"
        },
        {
         "program": "UKT Universitas Indonesia - S1",
         "biaya_min": 500000,
         "biaya_max": 16900000,
         "satuan": "per semester",
         "sumber": "Kontan (rilis UKT UI 2026) (2026)"
        }
       ]
      },
      {
       "jurusan": "S1 Informatika / Ilmu Komputer",
       "skill_dibangun": [
        "pemrograman",
        "struktur data & algoritma",
        "basis data",
        "rekayasa perangkat lunak"
       ],
       "biaya_referensi": [
        {
         "program": "UKT Universitas Indonesia - S1",
         "biaya_min": 500000,
         "biaya_max": 16900000,
         "satuan": "per semester",
         "sumber": "Kontan (rilis UKT UI 2026) (2026)"
        },
        {
         "program": "Universitas Terbuka - S1 (umum)",
         "biaya_min": 1300000,
         "biaya_max": 1300000,
         "satuan": "per semester",
         "sumber": "Kompas.com Edu; laman admisi UT (2026)"
        }
       ]
      },
      {
       "jurusan": "S1 Matematika / Statistika",
       "skill_dibangun": [
        "statistik & probabilitas",
        "pemodelan matematika",
        "analisis data"
       ],
       "biaya_referensi": [
        {
         "program": "UKT Universitas Indonesia - S1",
         "biaya_min": 500000,
         "biaya_max": 16900000,
         "satuan": "per semester",
         "sumber": "Kontan (rilis UKT UI 2026) (2026)"
        },
        {
         "program": "Universitas Terbuka - S1 (umum)",
         "biaya_min": 1300000,
         "biaya_max": 1300000,
         "satuan": "per semester",
         "sumber": "Kompas.com Edu; laman admisi UT (2026)"
        }
       ]
      },
      {
       "jurusan": "Jalur non-gelar: bootcamp + sertifikasi",
       "skill_dibangun": [
        "skill praktis sesuai program",
        "portofolio proyek"
       ],
       "biaya_referensi": [
        {
         "program": "Bootcamp Data Analyst (umum)",
         "biaya_min": 2000000,
         "biaya_max": 40000000,
         "satuan": "per program",
         "sumber": "tempatbelajar.id (2026)"
        },
        {
         "program": "Sertifikasi BNSP (skema umum)",
         "biaya_min": 800000,
         "biaya_max": 1500000,
         "satuan": "per sertifikasi",
         "sumber": "LSP Ditekindo (2026)"
        }
       ]
      }
     ],
     "portofolio_disarankan": [
      "Model prediksi (mis. churn/harga) end-to-end dengan scikit-learn",
      "Analisis eksploratif + uji statistik di Jupyter Notebook",
      "Model yang di-deploy sebagai API/web app sederhana (Streamlit)"
     ],
     "roadmap_karier": [
      {
       "fase": "Tutup skill gap",
       "mulai_bulan": 0,
       "selesai_bulan": 2,
       "fokus": [
        "Perdalam: statistik & probabilitas, machine learning",
        "Tetap bekerja di pekerjaan sekarang selama belajar"
       ]
      },
      {
       "fase": "Portofolio & melamar",
       "mulai_bulan": 2,
       "selesai_bulan": 4,
       "fokus": [
        "Selesaikan portofolio: Model prediksi (mis. churn/harga) end-to-end dengan scikit-learn; Analisis eksploratif + uji statistik di Jupyter Notebook",
        "Lamar posisi Junior Data Scientist"
       ]
      },
      {
       "fase": "Junior Data Scientist",
       "mulai_bulan": 4,
       "selesai_bulan": 28,
       "fokus": [
        "Perkiraan gaji Rp7.000.000 - Rp11.000.000/bulan"
       ],
       "pendapatan": {
        "min": 7000000,
        "max": 11000000
       }
      },
      {
       "fase": "Data Scientist",
       "mulai_bulan": 28,
       "selesai_bulan": 64,
       "fokus": [
        "Perkiraan gaji Rp8.000.000 - Rp19.166.667/bulan"
       ],
       "pendapatan": {
        "min": 8000000,
        "max": 19166667
       }
      },
      {
       "fase": "Senior Data Scientist",
       "mulai_bulan": 64,
       "selesai_bulan": null,
       "fokus": [
        "Perkiraan gaji Rp20.000.000 - Rp35.000.000/bulan"
       ],
       "pendapatan": {
        "min": 20000000,
        "max": 35000000
       }
      }
     ],
     "jadwal_pendapatan_untuk_simulasi": [
      {
       "mulai_bulan": 0,
       "penghasilan": 7500000,
       "keterangan": "penghasilan pekerjaan utama saat ini"
      },
      {
       "mulai_bulan": 4,
       "penghasilan": 9000000,
       "keterangan": "perkiraan tahap entry (nilai tengah rentang)"
      },
      {
       "mulai_bulan": 28,
       "penghasilan": 11750000,
       "keterangan": "perkiraan tahap mid (nilai tengah rentang)"
      },
      {
       "mulai_bulan": 64,
       "penghasilan": 27500000,
       "keterangan": "perkiraan tahap senior (nilai tengah rentang)"
      }
     ],
     "simulasi_siap_pakai": {
      "jadwal_pendapatan": [
       {
        "mulai_bulan": 0,
        "penghasilan": 7500000,
        "keterangan": "penghasilan pekerjaan utama saat ini"
       },
       {
        "mulai_bulan": 4,
        "penghasilan": 9000000,
        "keterangan": "perkiraan tahap entry (nilai tengah rentang)"
       },
       {
        "mulai_bulan": 28,
        "penghasilan": 11750000,
        "keterangan": "perkiraan tahap mid (nilai tengah rentang)"
       },
       {
        "mulai_bulan": 64,
        "penghasilan": 27500000,
        "keterangan": "perkiraan tahap senior (nilai tengah rentang)"
       }
      ]
     },
     "selisih_tahap_awal_vs_sekarang": 1500000
    },
    {
     "id": "data_analyst",
     "profesi": "Data Analyst",
     "bidang": "Teknologi & Data",
     "skor_kecocokan": 76,
     "target_pengguna": false,
     "alasan": [
      "Cocok dengan minatmu: data, komputer, matematika.",
      "Kamu sudah punya 3 dari 4 skill wajib.",
      "Perlu diperdalam (masih level dasar): statistik dasar.",
      "Perhatian: gaji tahap awal diperkirakan lebih rendah Rp500.000/bulan dari pekerjaan utamamu sekarang sebelum naik di tahap berikutnya."
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
      "visualisasi data (Power BI/Tableau/Looker Studio)",
      "Python (pandas)",
      "storytelling data"
     ],
     "skill_perlu_diperdalam": [
      "statistik dasar"
     ],
     "skill_gap_wajib": [],
     "skill_gap_pendukung": [
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
     "perkiraan_persiapan_bulan": 3,
     "rekomendasi_pendidikan": [
      {
       "jurusan": "S1 Sistem Informasi",
       "skill_dibangun": [
        "basis data/SQL",
        "analisis sistem",
        "pemrograman",
        "manajemen proyek TI"
       ],
       "biaya_referensi": [
        {
         "program": "Universitas Terbuka - S1 Sistem Informasi",
         "biaya_min": 1800000,
         "biaya_max": 1800000,
         "satuan": "per semester",
         "sumber": "Kompas.com Edu (2026)"
        },
        {
         "program": "UKT Universitas Indonesia - S1",
         "biaya_min": 500000,
         "biaya_max": 16900000,
         "satuan": "per semester",
         "sumber": "Kontan (rilis UKT UI 2026) (2026)"
        }
       ]
      },
      {
       "jurusan": "S1 Sains Data / Statistika",
       "skill_dibangun": [
        "statistik",
        "Python",
        "SQL",
        "visualisasi data",
        "machine learning dasar"
       ],
       "biaya_referensi": [
        {
         "program": "Universitas Terbuka - S1 Sains Data",
         "biaya_min": 1900000,
         "biaya_max": 1900000,
         "satuan": "per semester",
         "sumber": "Kompas.com Edu (2026)"
        },
        {
         "program": "UKT Universitas Indonesia - S1",
         "biaya_min": 500000,
         "biaya_max": 16900000,
         "satuan": "per semester",
         "sumber": "Kontan (rilis UKT UI 2026) (2026)"
        }
       ]
      },
      {
       "jurusan": "S1 Informatika / Ilmu Komputer",
       "skill_dibangun": [
        "pemrograman",
        "struktur data & algoritma",
        "basis data",
        "rekayasa perangkat lunak"
       ],
       "biaya_referensi": [
        {
         "program": "UKT Universitas Indonesia - S1",
         "biaya_min": 500000,
         "biaya_max": 16900000,
         "satuan": "per semester",
         "sumber": "Kontan (rilis UKT UI 2026) (2026)"
        },
        {
         "program": "Universitas Terbuka - S1 (umum)",
         "biaya_min": 1300000,
         "biaya_max": 1300000,
         "satuan": "per semester",
         "sumber": "Kompas.com Edu; laman admisi UT (2026)"
        }
       ]
      },
      {
       "jurusan": "S1 Matematika / Statistika",
       "skill_dibangun": [
        "statistik & probabilitas",
        "pemodelan matematika",
        "analisis data"
       ],
       "biaya_referensi": [
        {
         "program": "UKT Universitas Indonesia - S1",
         "biaya_min": 500000,
         "biaya_max": 16900000,
         "satuan": "per semester",
         "sumber": "Kontan (rilis UKT UI 2026) (2026)"
        },
        {
         "program": "Universitas Terbuka - S1 (umum)",
         "biaya_min": 1300000,
         "biaya_max": 1300000,
         "satuan": "per semester",
         "sumber": "Kompas.com Edu; laman admisi UT (2026)"
        }
       ]
      },
      {
       "jurusan": "Jalur non-gelar: bootcamp + sertifikasi",
       "skill_dibangun": [
        "skill praktis sesuai program",
        "portofolio proyek"
       ],
       "biaya_referensi": [
        {
         "program": "Bootcamp Data Analyst (umum)",
         "biaya_min": 2000000,
         "biaya_max": 40000000,
         "satuan": "per program",
         "sumber": "tempatbelajar.id (2026)"
        },
        {
         "program": "Sertifikasi BNSP (skema umum)",
         "biaya_min": 800000,
         "biaya_max": 1500000,
         "satuan": "per sertifikasi",
         "sumber": "LSP Ditekindo (2026)"
        }
       ]
      }
     ],
     "portofolio_disarankan": [
      "Dashboard penjualan interaktif (Power BI/Looker Studio)",
      "Analisis data publik (mis. BPS/Kaggle) dengan SQL + Python",
      "Laporan insight bisnis 1 halaman dari dataset nyata"
     ],
     "roadmap_karier": [
      {
       "fase": "Tutup skill gap",
       "mulai_bulan": 0,
       "selesai_bulan": 1,
       "fokus": [
        "Perdalam: statistik dasar",
        "Tetap bekerja di pekerjaan sekarang selama belajar"
       ]
      },
      {
       "fase": "Portofolio & melamar",
       "mulai_bulan": 1,
       "selesai_bulan": 3,
       "fokus": [
        "Selesaikan portofolio: Dashboard penjualan interaktif (Power BI/Looker Studio); Analisis data publik (mis. BPS/Kaggle) dengan SQL + Python",
        "Lamar posisi Junior Data Analyst"
       ]
      },
      {
       "fase": "Junior Data Analyst",
       "mulai_bulan": 3,
       "selesai_bulan": 27,
       "fokus": [
        "Perkiraan gaji Rp5.000.000 - Rp9.000.000/bulan"
       ],
       "pendapatan": {
        "min": 5000000,
        "max": 9000000
       }
      },
      {
       "fase": "Data Analyst",
       "mulai_bulan": 27,
       "selesai_bulan": 63,
       "fokus": [
        "Perkiraan gaji Rp7.635.417 - Rp14.000.000/bulan"
       ],
       "pendapatan": {
        "min": 7635417,
        "max": 14000000
       }
      },
      {
       "fase": "Senior Data Analyst",
       "mulai_bulan": 63,
       "selesai_bulan": null,
       "fokus": [
        "Perkiraan gaji Rp15.000.000 - Rp28.000.000/bulan"
       ],
       "pendapatan": {
        "min": 15000000,
        "max": 28000000
       }
      }
     ],
     "jadwal_pendapatan_untuk_simulasi": [
      {
       "mulai_bulan": 0,
       "penghasilan": 7500000,
       "keterangan": "penghasilan pekerjaan utama saat ini"
      },
      {
       "mulai_bulan": 3,
       "penghasilan": 7000000,
       "keterangan": "perkiraan tahap entry (nilai tengah rentang)"
      },
      {
       "mulai_bulan": 27,
       "penghasilan": 10000000,
       "keterangan": "perkiraan tahap mid (nilai tengah rentang)"
      },
      {
       "mulai_bulan": 63,
       "penghasilan": 21500000,
       "keterangan": "perkiraan tahap senior (nilai tengah rentang)"
      }
     ],
     "simulasi_siap_pakai": {
      "jadwal_pendapatan": [
       {
        "mulai_bulan": 0,
        "penghasilan": 7500000,
        "keterangan": "penghasilan pekerjaan utama saat ini"
       },
       {
        "mulai_bulan": 3,
        "penghasilan": 7000000,
        "keterangan": "perkiraan tahap entry (nilai tengah rentang)"
       },
       {
        "mulai_bulan": 27,
        "penghasilan": 10000000,
        "keterangan": "perkiraan tahap mid (nilai tengah rentang)"
       },
       {
        "mulai_bulan": 63,
        "penghasilan": 21500000,
        "keterangan": "perkiraan tahap senior (nilai tengah rentang)"
       }
      ]
     },
     "selisih_tahap_awal_vs_sekarang": -500000
    },
    {
     "id": "supply_chain_analyst",
     "profesi": "Supply Chain Analyst",
     "bidang": "Rantai Pasok",
     "skor_kecocokan": 71,
     "target_pengguna": false,
     "alasan": [
      "Cocok dengan minatmu: ai, data, komputer.",
      "Kamu sudah punya 3 dari 4 skill wajib.",
      "Perhatian: gaji tahap awal diperkirakan lebih rendah Rp250.000/bulan dari pekerjaan utamamu sekarang sebelum naik di tahap berikutnya."
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
      "dashboard (Power BI/Looker Studio)",
      "Python dasar"
     ],
     "skill_perlu_diperdalam": [],
     "skill_gap_wajib": [
      "analisis persediaan"
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
     "rekomendasi_pendidikan": [
      {
       "jurusan": "S1 Teknik Industri",
       "skill_dibangun": [
        "perencanaan produksi",
        "analisis data",
        "optimasi proses",
        "manajemen persediaan"
       ],
       "biaya_referensi": [
        {
         "program": "UKT Universitas Indonesia - S1",
         "biaya_min": 500000,
         "biaya_max": 16900000,
         "satuan": "per semester",
         "sumber": "Kontan (rilis UKT UI 2026) (2026)"
        },
        {
         "program": "Universitas Terbuka - S1 (umum)",
         "biaya_min": 1300000,
         "biaya_max": 1300000,
         "satuan": "per semester",
         "sumber": "Kompas.com Edu; laman admisi UT (2026)"
        }
       ]
      },
      {
       "jurusan": "S1 Manajemen",
       "skill_dibangun": [
        "manajemen",
        "pemasaran",
        "keuangan dasar",
        "kepemimpinan"
       ],
       "biaya_referensi": [
        {
         "program": "UKT Universitas Indonesia - S1",
         "biaya_min": 500000,
         "biaya_max": 16900000,
         "satuan": "per semester",
         "sumber": "Kontan (rilis UKT UI 2026) (2026)"
        },
        {
         "program": "Universitas Terbuka - S1 (umum)",
         "biaya_min": 1300000,
         "biaya_max": 1300000,
         "satuan": "per semester",
         "sumber": "Kompas.com Edu; laman admisi UT (2026)"
        }
       ]
      },
      {
       "jurusan": "S1 Teknik Industri",
       "skill_dibangun": [
        "perencanaan produksi",
        "optimasi",
        "statistik industri"
       ],
       "biaya_referensi": [
        {
         "program": "UKT Universitas Indonesia - S1",
         "biaya_min": 500000,
         "biaya_max": 16900000,
         "satuan": "per semester",
         "sumber": "Kontan (rilis UKT UI 2026) (2026)"
        },
        {
         "program": "Universitas Terbuka - S1 (umum)",
         "biaya_min": 1300000,
         "biaya_max": 1300000,
         "satuan": "per semester",
         "sumber": "Kompas.com Edu; laman admisi UT (2026)"
        }
       ]
      }
     ],
     "portofolio_disarankan": [
      "Dashboard persediaan & perputaran stok (Power BI/Looker Studio)",
      "Analisis ABC/XYZ produk dengan SQL",
      "Forecast permintaan sederhana dengan Excel/Python"
     ],
     "roadmap_karier": [
      {
       "fase": "Tutup skill gap",
       "mulai_bulan": 0,
       "selesai_bulan": 4,
       "fokus": [
        "Pelajari: analisis persediaan",
        "Tetap bekerja di pekerjaan sekarang selama belajar"
       ]
      },
      {
       "fase": "Portofolio & melamar",
       "mulai_bulan": 4,
       "selesai_bulan": 6,
       "fokus": [
        "Selesaikan portofolio: Dashboard persediaan & perputaran stok (Power BI/Looker Studio); Analisis ABC/XYZ produk dengan SQL",
        "Lamar posisi Supply Chain Staff"
       ]
      },
      {
       "fase": "Supply Chain Staff",
       "mulai_bulan": 6,
       "selesai_bulan": 66,
       "fokus": [
        "Perkiraan gaji Rp4.000.000 - Rp10.000.000/bulan"
       ],
       "pendapatan": {
        "min": 4000000,
        "max": 10000000
       }
      },
      {
       "fase": "Senior Analyst",
       "mulai_bulan": 66,
       "selesai_bulan": null,
       "fokus": [
        "Perkiraan gaji Rp12.000.000 - Rp20.000.000/bulan"
       ],
       "pendapatan": {
        "min": 12000000,
        "max": 20000000
       }
      }
     ],
     "jadwal_pendapatan_untuk_simulasi": [
      {
       "mulai_bulan": 0,
       "penghasilan": 7500000,
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
        "penghasilan": 7500000,
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
     "selisih_tahap_awal_vs_sekarang": -250000
    }
   ],
   "profesi_lain": [
    {
     "profesi": "Data Engineer",
     "skor_kecocokan": 71
    },
    {
     "profesi": "Software Engineer",
     "skor_kecocokan": 62
    },
    {
     "profesi": "IT Support",
     "skor_kecocokan": 45
    },
    {
     "profesi": "UI/UX Designer",
     "skor_kecocokan": 28
    },
    {
     "profesi": "Teknisi Listrik",
     "skor_kecocokan": 28
    },
    {
     "profesi": "Teknisi Mekanik / Mekanik",
     "skor_kecocokan": 28
    },
    {
     "profesi": "Dokter Umum",
     "skor_kecocokan": 28
    },
    {
     "profesi": "Dokter Spesialis",
     "skor_kecocokan": 28
    },
    {
     "profesi": "Dokter Hewan",
     "skor_kecocokan": 28
    },
    {
     "profesi": "Apoteker",
     "skor_kecocokan": 28
    },
    {
     "profesi": "Supervisor Gudang",
     "skor_kecocokan": 19
    },
    {
     "profesi": "Staff PPIC",
     "skor_kecocokan": 19
    },
    {
     "profesi": "Akuntan",
     "skor_kecocokan": 19
    },
    {
     "profesi": "Insinyur Teknik Industri",
     "skor_kecocokan": 19
    },
    {
     "profesi": "Digital Marketing",
     "skor_kecocokan": 10
    },
    {
     "profesi": "Perawat",
     "skor_kecocokan": 10
    },
    {
     "profesi": "Psikolog",
     "skor_kecocokan": 10
    },
    {
     "profesi": "Guru",
     "skor_kecocokan": 10
    },
    {
     "profesi": "TNI (Tentara)",
     "skor_kecocokan": 10
    },
    {
     "profesi": "Polisi",
     "skor_kecocokan": 10
    }
   ],
   "konteks_wilayah": {
    "jenis": "UMK 2026",
    "wilayah": "Kota Tangerang",
    "nilai": 5399405
   },
   "catatan_target": null,
   "total_pengalaman_tahun": 0,
   "catatan_metode": [
    "Skor kecocokan 0-100: minat (35), skill wajib yang sudah dimiliki (35), relevansi pengalaman (20), kesesuaian pendidikan (10).",
    "Jadwal pendapatan menggantikan penghasilan pekerjaan utama saja; pendapatan sampingan dan pasangan tetap dihitung terpisah. Rentang gaji dari database eksternal myCITA beserta sumbernya; jadwal pendapatan memakai nilai tengah rentang dan asumsi umum lama jenjang (entry 0-2 th, mid 2-5 th, senior 5+ th).",
    "Rekomendasi tidak memakai jenis kelamin, usia, agama, atau asal daerah sebagai faktor."
   ],
   "sumber_data": "Database Eksternal myCITA v1.0 (Oktober 2026)",
   "memakai_data_tersimpan": [
    "skill",
    "target_profesi"
   ],
   "disclaimer": "Rekomendasi adalah gambaran awal berdasarkan data yang kamu isi dan data referensi pasar. Keputusan tetap di tanganmu."
  },
  "karier_simulasi": {
   "data_scientist": {
    "sebelum": {
     "sisa": 2000000,
     "skor": 100,
     "target": {
      "Menikah": "3 tahun",
      "Mobil": "22 tahun 1 bulan"
     }
    },
    "sesudah": {
     "sisa": 2000000,
     "skor": 100,
     "target": {
      "Menikah": "3 tahun",
      "Mobil": "5 tahun 6 bulan"
     }
    }
   },
   "data_analyst": {
    "sebelum": {
     "sisa": 2000000,
     "skor": 100,
     "target": {
      "Menikah": "3 tahun",
      "Mobil": "22 tahun 1 bulan"
     }
    },
    "sesudah": {
     "sisa": 2000000,
     "skor": 100,
     "target": {
      "Menikah": "3 tahun",
      "Mobil": "6 tahun"
     }
    }
   },
   "kopi_pesimis": {
    "sebelum": {
     "sisa": 2000000,
     "skor": 100,
     "target": {
      "Menikah": "3 tahun",
      "Mobil": "22 tahun 1 bulan"
     }
    },
    "sesudah": {
     "sisa": 2000000,
     "skor": 100,
     "target": {
      "Menikah": "3 tahun",
      "Mobil": "6 tahun 11 bulan"
     }
    }
   },
   "data_scientist_kopi_pesimis": {
    "sebelum": {
     "sisa": 2000000,
     "skor": 100,
     "target": {
      "Menikah": "3 tahun",
      "Mobil": "22 tahun 1 bulan"
     }
    },
    "sesudah": {
     "sisa": 2000000,
     "skor": 100,
     "target": {
      "Menikah": "2 tahun 8 bulan",
      "Mobil": "4 tahun 1 bulan"
     }
    }
   },
   "data_scientist_kopi_moderat": {
    "sebelum": {
     "sisa": 2000000,
     "skor": 100,
     "target": {
      "Menikah": "3 tahun",
      "Mobil": "22 tahun 1 bulan"
     }
    },
    "sesudah": {
     "sisa": 2000000,
     "skor": 100,
     "target": {
      "Menikah": "1 tahun 8 bulan",
      "Mobil": "3 tahun 4 bulan"
     }
    }
   }
  },
  "usaha_kopi": {
   "status": "ok",
   "user_id": "budi",
   "pesan": "Eksplorasi usaha selesai: Kopi keliling, Es teh jumbo / minuman kekinian, Warung kopi (warkop / warmindo).",
   "rekomendasi": [
    {
     "id": "kopi_keliling",
     "usaha": "Kopi keliling",
     "bidang": "Makanan & Minuman",
     "skor_kecocokan": 80,
     "pilihan_pengguna": false,
     "alasan": [
      "Modalmu Rp3.000.000 melebihi kebutuhan modal awal (Rp1.000.000-Rp2.500.000); sisanya bisa jadi dana cadangan usaha.",
      "Sesuai minatmu: kopi, kuliner, minuman."
     ],
     "modal_awal": {
      "min": 1000000,
      "max": 2500000,
      "dipakai_simulasi": 2500000,
      "kekurangan": 0
     },
     "biaya_operasional_bulanan": "Bahan baku harian, bensin",
     "model_pendapatan": "Kopi Rp5-15 rb per gelas",
     "skenario": {
      "pesimis": {
       "omzet_bulanan_stabil": 6000000,
       "margin_persen": 40,
       "laba_bulanan_stabil": 2400000,
       "laba_tahun_pertama": 23760000,
       "balik_modal_bulan": 3,
       "balik_modal": "3 bulan"
      },
      "moderat": {
       "omzet_bulanan_stabil": 9000000,
       "margin_persen": 48,
       "laba_bulanan_stabil": 4275000,
       "laba_tahun_pertama": 42322500,
       "balik_modal_bulan": 2,
       "balik_modal": "2 bulan"
      },
      "optimis": {
       "omzet_bulanan_stabil": 12000000,
       "margin_persen": 55,
       "laba_bulanan_stabil": 6600000,
       "laba_tahun_pertama": 65340000,
       "balik_modal_bulan": 2,
       "balik_modal": "2 bulan"
      }
     },
     "balik_modal_menurut_sumber": "-",
     "modal_belum_cukup": false,
     "skill_sudah_dimiliki": [
      "meracik kopi"
     ],
     "skill_gap": [
      "pemasaran lokal",
      "manajemen waktu"
     ],
     "risiko": [
      "cuaca",
      "izin berjualan",
      "persaingan"
     ],
     "dasar_angka": "Modal Rp1-2,5 jt dan omzet Rp6-12 jt/bulan (Medcom, September 2026); margin dari contoh laba Rp300-400 rb per Rp700 rb omzet harian",
     "sumber": "Medcom (2026)",
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
        "nilai": 1282500
       },
       {
        "mulai_bulan": 1,
        "nilai": 1881000
       },
       {
        "mulai_bulan": 2,
        "nilai": 2479500
       },
       {
        "mulai_bulan": 3,
        "nilai": 3078000
       },
       {
        "mulai_bulan": 4,
        "nilai": 3676500
       },
       {
        "mulai_bulan": 5,
        "nilai": 4275000
       }
      ],
      "biaya_awal": 2500000
     },
     "simulasi_siap_pakai_per_skenario": {
      "pesimis": {
       "pendapatan_tambahan_jadwal": [
        {
         "mulai_bulan": 0,
         "nilai": 720000
        },
        {
         "mulai_bulan": 1,
         "nilai": 1056000
        },
        {
         "mulai_bulan": 2,
         "nilai": 1392000
        },
        {
         "mulai_bulan": 3,
         "nilai": 1728000
        },
        {
         "mulai_bulan": 4,
         "nilai": 2064000
        },
        {
         "mulai_bulan": 5,
         "nilai": 2400000
        }
       ],
       "biaya_awal": 2500000
      },
      "moderat": {
       "pendapatan_tambahan_jadwal": [
        {
         "mulai_bulan": 0,
         "nilai": 1282500
        },
        {
         "mulai_bulan": 1,
         "nilai": 1881000
        },
        {
         "mulai_bulan": 2,
         "nilai": 2479500
        },
        {
         "mulai_bulan": 3,
         "nilai": 3078000
        },
        {
         "mulai_bulan": 4,
         "nilai": 3676500
        },
        {
         "mulai_bulan": 5,
         "nilai": 4275000
        }
       ],
       "biaya_awal": 2500000
      },
      "optimis": {
       "pendapatan_tambahan_jadwal": [
        {
         "mulai_bulan": 0,
         "nilai": 1980000
        },
        {
         "mulai_bulan": 1,
         "nilai": 2904000
        },
        {
         "mulai_bulan": 2,
         "nilai": 3828000
        },
        {
         "mulai_bulan": 3,
         "nilai": 4752000
        },
        {
         "mulai_bulan": 4,
         "nilai": 5676000
        },
        {
         "mulai_bulan": 5,
         "nilai": 6600000
        }
       ],
       "biaya_awal": 2500000
      }
     }
    },
    {
     "id": "es_teh_jumbo",
     "usaha": "Es teh jumbo / minuman kekinian",
     "bidang": "Makanan & Minuman",
     "skor_kecocokan": 80,
     "pilihan_pengguna": false,
     "alasan": [
      "Modalmu Rp3.000.000 sudah masuk kisaran modal awal Rp1.000.000-Rp20.000.000.",
      "Sesuai minatmu: kuliner, minuman."
     ],
     "modal_awal": {
      "min": 1000000,
      "max": 20000000,
      "dipakai_simulasi": 3000000,
      "kekurangan": 0
     },
     "biaya_operasional_bulanan": "Bahan baku, sewa lapak",
     "model_pendapatan": "Penjualan per cup",
     "skenario": {
      "pesimis": {
       "omzet_bulanan_stabil": 6000000,
       "margin_persen": 35,
       "laba_bulanan_stabil": 2100000,
       "laba_tahun_pertama": 20790000,
       "balik_modal_bulan": 4,
       "balik_modal": "4 bulan"
      },
      "moderat": {
       "omzet_bulanan_stabil": 10500000,
       "margin_persen": 42,
       "laba_bulanan_stabil": 4462500,
       "laba_tahun_pertama": 44178750,
       "balik_modal_bulan": 2,
       "balik_modal": "2 bulan"
      },
      "optimis": {
       "omzet_bulanan_stabil": 15000000,
       "margin_persen": 50,
       "laba_bulanan_stabil": 7500000,
       "laba_tahun_pertama": 74250000,
       "balik_modal_bulan": 2,
       "balik_modal": "2 bulan"
      }
     },
     "balik_modal_menurut_sumber": "1-3 bulan (klaim franchisor)",
     "modal_belum_cukup": false,
     "skill_sudah_dimiliki": [
      "meracik minuman"
     ],
     "skill_gap": [
      "pemilihan lokasi",
      "pencatatan kas"
     ],
     "risiko": [
      "tren cepat berubah",
      "persaingan gerai",
      "musim hujan"
     ],
     "dasar_angka": "Paket franchise Rp1-9 jt, gerai lengkap ±Rp20 jt, laba klaim franchisor Rp3,3-7,7 jt/bulan (Detik; OCBC); usaha rumahan laba ±Rp2,3 jt (UNP Kediri, 2026); omzet & margin disetarakan ASUMSI myCITA",
     "sumber": "Detik Finance; OCBC; UNP Kediri (2026)",
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
        "nilai": 1338750
       },
       {
        "mulai_bulan": 1,
        "nilai": 1963500
       },
       {
        "mulai_bulan": 2,
        "nilai": 2588250
       },
       {
        "mulai_bulan": 3,
        "nilai": 3213000
       },
       {
        "mulai_bulan": 4,
        "nilai": 3837750
       },
       {
        "mulai_bulan": 5,
        "nilai": 4462500
       }
      ],
      "biaya_awal": 3000000
     },
     "simulasi_siap_pakai_per_skenario": {
      "pesimis": {
       "pendapatan_tambahan_jadwal": [
        {
         "mulai_bulan": 0,
         "nilai": 630000
        },
        {
         "mulai_bulan": 1,
         "nilai": 924000
        },
        {
         "mulai_bulan": 2,
         "nilai": 1218000
        },
        {
         "mulai_bulan": 3,
         "nilai": 1512000
        },
        {
         "mulai_bulan": 4,
         "nilai": 1806000
        },
        {
         "mulai_bulan": 5,
         "nilai": 2100000
        }
       ],
       "biaya_awal": 3000000
      },
      "moderat": {
       "pendapatan_tambahan_jadwal": [
        {
         "mulai_bulan": 0,
         "nilai": 1338750
        },
        {
         "mulai_bulan": 1,
         "nilai": 1963500
        },
        {
         "mulai_bulan": 2,
         "nilai": 2588250
        },
        {
         "mulai_bulan": 3,
         "nilai": 3213000
        },
        {
         "mulai_bulan": 4,
         "nilai": 3837750
        },
        {
         "mulai_bulan": 5,
         "nilai": 4462500
        }
       ],
       "biaya_awal": 3000000
      },
      "optimis": {
       "pendapatan_tambahan_jadwal": [
        {
         "mulai_bulan": 0,
         "nilai": 2250000
        },
        {
         "mulai_bulan": 1,
         "nilai": 3300000
        },
        {
         "mulai_bulan": 2,
         "nilai": 4350000
        },
        {
         "mulai_bulan": 3,
         "nilai": 5400000
        },
        {
         "mulai_bulan": 4,
         "nilai": 6450000
        },
        {
         "mulai_bulan": 5,
         "nilai": 7500000
        }
       ],
       "biaya_awal": 3000000
      }
     }
    },
    {
     "id": "warkop",
     "usaha": "Warung kopi (warkop / warmindo)",
     "bidang": "Makanan & Minuman",
     "skor_kecocokan": 74,
     "pilihan_pengguna": false,
     "alasan": [
      "Modalmu masih kurang Rp2.000.000 dari modal minimal Rp5.000.000. Simulasi mengasumsikan kekurangan ini sudah tertutup (misalnya dari tabungan tambahan), jadi siapkan dulu sebelum memulai.",
      "Sesuai minatmu: kopi, kuliner, minuman."
     ],
     "modal_awal": {
      "min": 5000000,
      "max": 10000000,
      "dipakai_simulasi": 5000000,
      "kekurangan": 2000000
     },
     "biaya_operasional_bulanan": "Sewa 3x4 m Rp2,5-4 jt/tahun, bahan baku, listrik",
     "model_pendapatan": "Penjualan kopi, mi instan, gorengan",
     "skenario": {
      "pesimis": {
       "omzet_bulanan_stabil": 9000000,
       "margin_persen": 30,
       "laba_bulanan_stabil": 2700000,
       "laba_tahun_pertama": 26730000,
       "balik_modal_bulan": 4,
       "balik_modal": "4 bulan"
      },
      "moderat": {
       "omzet_bulanan_stabil": 12000000,
       "margin_persen": 35,
       "laba_bulanan_stabil": 4200000,
       "laba_tahun_pertama": 41580000,
       "balik_modal_bulan": 3,
       "balik_modal": "3 bulan"
      },
      "optimis": {
       "omzet_bulanan_stabil": 15000000,
       "margin_persen": 40,
       "laba_bulanan_stabil": 6000000,
       "laba_tahun_pertama": 59400000,
       "balik_modal_bulan": 3,
       "balik_modal": "3 bulan"
      }
     },
     "balik_modal_menurut_sumber": "2-3 bulan (jika pendapatan harian ≥Rp300 rb)",
     "modal_belum_cukup": true,
     "skill_sudah_dimiliki": [
      "meracik kopi & mi",
      "pelayanan pelanggan"
     ],
     "skill_gap": [
      "pencatatan kas"
     ],
     "risiko": [
      "lokasi kurang ramai",
      "persaingan kafe",
      "jam kerja panjang"
     ],
     "dasar_angka": "Modal contoh Rp10 jt (OCBC); pendapatan harian ≥Rp300 rb dan balik modal 2-3 bulan (Metro TV, 2026); omzet maksimum dan margin ASUMSI myCITA",
     "sumber": "OCBC; Metro TV (2026)",
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
        "nilai": 1260000
       },
       {
        "mulai_bulan": 1,
        "nilai": 1848000
       },
       {
        "mulai_bulan": 2,
        "nilai": 2436000
       },
       {
        "mulai_bulan": 3,
        "nilai": 3024000
       },
       {
        "mulai_bulan": 4,
        "nilai": 3612000
       },
       {
        "mulai_bulan": 5,
        "nilai": 4200000
       }
      ],
      "biaya_awal": 5000000
     },
     "simulasi_siap_pakai_per_skenario": {
      "pesimis": {
       "pendapatan_tambahan_jadwal": [
        {
         "mulai_bulan": 0,
         "nilai": 810000
        },
        {
         "mulai_bulan": 1,
         "nilai": 1188000
        },
        {
         "mulai_bulan": 2,
         "nilai": 1566000
        },
        {
         "mulai_bulan": 3,
         "nilai": 1944000
        },
        {
         "mulai_bulan": 4,
         "nilai": 2322000
        },
        {
         "mulai_bulan": 5,
         "nilai": 2700000
        }
       ],
       "biaya_awal": 5000000
      },
      "moderat": {
       "pendapatan_tambahan_jadwal": [
        {
         "mulai_bulan": 0,
         "nilai": 1260000
        },
        {
         "mulai_bulan": 1,
         "nilai": 1848000
        },
        {
         "mulai_bulan": 2,
         "nilai": 2436000
        },
        {
         "mulai_bulan": 3,
         "nilai": 3024000
        },
        {
         "mulai_bulan": 4,
         "nilai": 3612000
        },
        {
         "mulai_bulan": 5,
         "nilai": 4200000
        }
       ],
       "biaya_awal": 5000000
      },
      "optimis": {
       "pendapatan_tambahan_jadwal": [
        {
         "mulai_bulan": 0,
         "nilai": 1800000
        },
        {
         "mulai_bulan": 1,
         "nilai": 2640000
        },
        {
         "mulai_bulan": 2,
         "nilai": 3480000
        },
        {
         "mulai_bulan": 3,
         "nilai": 4320000
        },
        {
         "mulai_bulan": 4,
         "nilai": 5160000
        },
        {
         "mulai_bulan": 5,
         "nilai": 6000000
        }
       ],
       "biaya_awal": 5000000
      }
     }
    }
   ],
   "usaha_lain": [
    {
     "usaha": "Jualan gorengan",
     "skor_kecocokan": 55
    },
    {
     "usaha": "Konter pulsa, paket data & token listrik",
     "skor_kecocokan": 55
    },
    {
     "usaha": "Toko kelontong rumahan",
     "skor_kecocokan": 50
    },
    {
     "usaha": "Warung / jualan sayur",
     "skor_kecocokan": 50
    },
    {
     "usaha": "Lapak buah segar",
     "skor_kecocokan": 50
    },
    {
     "usaha": "Frozen food rumahan",
     "skor_kecocokan": 40
    },
    {
     "usaha": "Bengkel motor rumahan",
     "skor_kecocokan": 34
    },
    {
     "usaha": "Agen BRILink / agen laku pandai",
     "skor_kecocokan": 30
    },
    {
     "usaha": "Laundry kiloan rumahan",
     "skor_kecocokan": 27
    },
    {
     "usaha": "Lapak ayam potong / daging eceran",
     "skor_kecocokan": 24
    },
    {
     "usaha": "Warung makan (warteg)",
     "skor_kecocokan": 23
    },
    {
     "usaha": "Warung sembako / warung Madura",
     "skor_kecocokan": 9
    },
    {
     "usaha": "Ternak ayam potong skala kecil",
     "skor_kecocokan": 7
    },
    {
     "usaha": "Laundry kiloan skala kecil profesional",
     "skor_kecocokan": 6
    },
    {
     "usaha": "Bengkel motor kecil-menengah (ruko)",
     "skor_kecocokan": 5
    }
   ],
   "mode": "sampingan",
   "catatan_metode": [
    "Skor kecocokan 0-100: kecukupan modal (40), minat (30), skill & pengalaman (30).",
    "Skenario: pesimis = omzet & margin terendah, moderat = nilai tengah, optimis = tertinggi dari database. Masa rintisan: bulan 1 baru 30% dari kondisi stabil, stabil di bulan ke-6.",
    "simulasi_siap_pakai (skenario moderat) atau simulasi_siap_pakai_per_skenario (pesimis/moderat/optimis) bisa langsung dikirim ke analisis_keuangan_mycita. Untuk usaha sampingan paruh waktu/akhir pekan, gunakan skenario pesimis sebagai acuan."
   ],
   "catatan_database": "Template usaha masih terbatas (laundry dan bengkel motor). Angka yang ditandai ASUMSI myCITA belum memiliki sumber terverifikasi.",
   "sumber_data": "Database Eksternal myCITA v1.0 (Oktober 2026)",
   "disclaimer": "Simulasi usaha adalah skenario berdasarkan data referensi, bukan jaminan keuntungan. Hasil nyata sangat bergantung pada lokasi dan pengelolaan."
  },
  "chat": {}
 },
 "agus": {
  "analisis": {
   "status": "ok",
   "user_id": "agus",
   "mode": "analisis",
   "pesan": "Analisis selesai dan tersimpan.",
   "ringkasan": "Agus: pendapatan Rp14.000.000, pengeluaran Rp8.500.000, sisa Rp5.500.000. Skor kesehatan 84/100 (Sangat sehat 🟢), saving rate 39.3%. Target Rumah: dengan menabung tercapai dalam 22 tahun 2 bulan.",
   "dashboard": {
    "nama": "Agus",
    "pendapatan": 14000000,
    "pengeluaran": 8500000,
    "sisa": 5500000,
    "skor_kesehatan": 84,
    "status": "Sangat sehat 🟢",
    "saving_rate_persen": 39.3
   },
   "kesehatan_keuangan": {
    "penghasilan": 14000000,
    "penghasilan_konservatif": 14000000,
    "pengeluaran_rutin": 8500000,
    "pengeluaran_keinginan": 300000,
    "total_cicilan": 0,
    "total_pengeluaran": 8500000,
    "disposable_income": 5500000,
    "kapasitas_menabung": 5500000,
    "saving_rate_persen": 39.3,
    "rasio_cicilan_persen": 0,
    "rasio_keinginan_persen": 2.1,
    "rincian_skor": {
     "saving_rate (maks 30)": 30,
     "rasio_cicilan (maks 25)": 25,
     "dana_darurat (maks 25)": 8.8,
     "pengeluaran_keinginan (maks 10)": 10,
     "hutang_berbunga_tinggi (maks 10)": 10
    },
    "skor": 84,
    "status": "Sangat sehat 🟢"
   },
   "dana_darurat": {
    "dana_likuid_saat_ini": 45000000,
    "cukup_untuk_bulan": 5.3,
    "target_minimum": 76500000,
    "target_ideal": 127500000,
    "target_dipakai": 76500000,
    "kekurangan": 31500000,
    "perkiraan_waktu_terpenuhi": "1 tahun"
   },
   "alokasi_bulan_ini": {
    "kapasitas_menabung": 5500000,
    "untuk_dana_darurat": 2750000,
    "untuk_target": 2750000,
    "catatan": "Alokasi berubah otomatis: setelah dana darurat terpenuhi atau cicilan lunas, dananya dialihkan ke target."
   },
   "strategi_hutang": [],
   "target": [
    {
     "nama": "Rumah",
     "kategori": "rumah",
     "prioritas": 1,
     "harga_saat_ini": 600000000,
     "sumber_harga": "diisi pengguna",
     "kenaikan_harga_per_tahun_persen": 4,
     "tenggat_bulan": 84,
     "tenggat": "7 tahun",
     "setoran_bulan_pertama": 2750000,
     "opsi_a_menabung": {
      "waktu_tercapai_bulan": 266,
      "waktu_tercapai": "22 tahun 2 bulan",
      "perkiraan_harga_saat_tercapai": 1431276711,
      "jika_hanya_fokus_target_ini": "22 tahun 2 bulan",
      "harga_saat_tenggat": 789559068,
      "tercapai_sesuai_tenggat": false
     },
     "opsi_b_kredit": {
      "dp_persen": 20,
      "dp": 132362388,
      "waktu_kumpulkan_dp_bulan": 30,
      "waktu_kumpulkan_dp": "2 tahun 6 bulan",
      "perkiraan_harga_saat_beli": 661811941,
      "pinjaman": 529449553,
      "bunga_tahunan_persen": 11,
      "cicilan_lama_saat_itu": 0,
      "pilihan_tenor": [
       {
        "tenor_tahun": 10,
        "cicilan_bulanan": 7293168,
        "total_bunga": 345730630,
        "total_dibayar": 1007542570,
        "rasio_cicilan_setelah_kredit_persen": 52.1,
        "aman": false
       },
       {
        "tenor_tahun": 15,
        "cicilan_bulanan": 6017707,
        "total_bunga": 553737777,
        "total_dibayar": 1215549717,
        "rasio_cicilan_setelah_kredit_persen": 43,
        "aman": false
       },
       {
        "tenor_tahun": 20,
        "cicilan_bulanan": 5464917,
        "total_bunga": 782130485,
        "total_dibayar": 1443942426,
        "rasio_cicilan_setelah_kredit_persen": 39,
        "aman": false
       }
      ],
      "tenor_aman_terpendek": null
     },
     "opsi_c_kombinasi": {
      "dp_persen": 35,
      "dp": 248090987,
      "waktu_kumpulkan_dp_bulan": 51,
      "waktu_kumpulkan_dp": "4 tahun 3 bulan",
      "perkiraan_harga_saat_beli": 708831391,
      "pinjaman": 460740404,
      "bunga_tahunan_persen": 11,
      "cicilan_lama_saat_itu": 0,
      "pilihan_tenor": [
       {
        "tenor_tahun": 10,
        "cicilan_bulanan": 6346700,
        "total_bunga": 300863546,
        "total_dibayar": 1009694938,
        "rasio_cicilan_setelah_kredit_persen": 45.3,
        "aman": false
       },
       {
        "tenor_tahun": 15,
        "cicilan_bulanan": 5236761,
        "total_bunga": 481876632,
        "total_dibayar": 1190708023,
        "rasio_cicilan_setelah_kredit_persen": 37.4,
        "aman": false
       },
       {
        "tenor_tahun": 20,
        "cicilan_bulanan": 4755709,
        "total_bunga": 680629749,
        "total_dibayar": 1389461140,
        "rasio_cicilan_setelah_kredit_persen": 34,
        "aman": false
       }
      ],
      "tenor_aman_terpendek": null,
      "keterangan": "Menabung lebih lama untuk DP 35% agar pinjaman dan total bunga lebih kecil."
     },
     "status": "perlu_penyesuaian",
     "opsi_disarankan": "sesuaikan_rencana",
     "alternatif": {
      "tambahan_tabungan_per_bulan_agar_tepat_waktu": 4274514,
      "harga_maksimal_terjangkau_sesuai_tenggat": 327000000,
      "perpanjang_tenggat_menjadi": "22 tahun 2 bulan"
     }
    }
   ],
   "rekomendasi_utama": [
    "Bangun dana darurat Rp76.500.000 (9x pengeluaran bulanan) lebih dulu. Dengan menyisihkan sebagian kapasitas menabung, perkiraan terpenuhi dalam 1 tahun.",
    "Target 'Rumah' belum realistis dalam 7 tahun. Dengan kondisi sekarang baru tercapai 22 tahun 2 bulan, terlalu jauh dari tenggat. Pilihan: naikkan penghasilan lewat jalur karier atau usaha (lihat simulasinya di Roadmap), atau turunkan budget ke ±Rp327.000.000, atau tambah tabungan/penghasilan ±Rp4.274.514/bulan.",
    "Sebagian penghasilan tidak tetap. Di bulan sepi, pegang angka konservatif Rp14.000.000; kelebihan di bulan ramai langsung ditabung."
   ],
   "psikologi": null,
   "asumsi": {
    "inflasi_umum_persen": 3.2,
    "kenaikan_harga_persen": {
     "rumah": 4,
     "rumah_subsidi": 3,
     "mobil": 3,
     "motor": 3,
     "menikah": 4,
     "pendidikan": 6,
     "default": 3.2
    },
    "bunga_kredit_persen": {
     "rumah": 11,
     "rumah_subsidi": 5,
     "mobil": 10,
     "motor": 15
    },
    "dp_persen": {
     "rumah": 20,
     "rumah_subsidi": 1,
     "mobil": 20,
     "motor": 15
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
    "imbal_hasil_tabungan_persen": 0,
    "kenaikan_penghasilan_persen": 0,
    "pakai_penghasilan_konservatif": false,
    "batas_aman_cicilan_persen": 30,
    "porsi_dana_darurat_persen": 50
   },
   "sumber_asumsi": [
    "Inflasi umum 3,2%: inflasi tahunan Indonesia Agustus 2026 tercatat 3,19% (BPS via Databoks); sasaran BI 2,5±1%.",
    "Bunga KPR 11%: bunga floating KPR BCA 11% (Mandiri 13%, CIMB Niaga 13,5%), Kontan Agustus 2026.",
    "KPR subsidi 5% tetap dan batas harga rumah subsidi Rp166-185 juta: Kompas.com 2026.",
    "Kenaikan harga barang, bunga kredit kendaraan, DP, dan porsi alokasi adalah asumsi myCITA yang dapat diubah.",
    "Penghasilan dan pengeluaran dianggap tetap (konservatif); ubah 'kenaikan_penghasilan_persen' untuk skenario kenaikan gaji."
   ],
   "disclaimer": "myCITA adalah alat edukasi dan perencanaan keuangan, bukan nasihat investasi atau rekomendasi produk keuangan tertentu. Semua angka adalah estimasi berdasarkan data yang kamu isi dan asumsi yang tercantum."
  },
  "skenario": {
   "dasar": {
    "status": "ok",
    "user_id": "agus",
    "mode": "analisis",
    "pesan": "Analisis selesai dan tersimpan.",
    "ringkasan": "Agus: pendapatan Rp14.000.000, pengeluaran Rp8.500.000, sisa Rp5.500.000. Skor kesehatan 84/100 (Sangat sehat 🟢), saving rate 39.3%. Target Rumah: dengan menabung tercapai dalam 22 tahun 2 bulan.",
    "dashboard": {
     "nama": "Agus",
     "pendapatan": 14000000,
     "pengeluaran": 8500000,
     "sisa": 5500000,
     "skor_kesehatan": 84,
     "status": "Sangat sehat 🟢",
     "saving_rate_persen": 39.3
    },
    "kesehatan_keuangan": {
     "penghasilan": 14000000,
     "penghasilan_konservatif": 14000000,
     "pengeluaran_rutin": 8500000,
     "pengeluaran_keinginan": 300000,
     "total_cicilan": 0,
     "total_pengeluaran": 8500000,
     "disposable_income": 5500000,
     "kapasitas_menabung": 5500000,
     "saving_rate_persen": 39.3,
     "rasio_cicilan_persen": 0,
     "rasio_keinginan_persen": 2.1,
     "rincian_skor": {
      "saving_rate (maks 30)": 30,
      "rasio_cicilan (maks 25)": 25,
      "dana_darurat (maks 25)": 8.8,
      "pengeluaran_keinginan (maks 10)": 10,
      "hutang_berbunga_tinggi (maks 10)": 10
     },
     "skor": 84,
     "status": "Sangat sehat 🟢"
    },
    "dana_darurat": {
     "dana_likuid_saat_ini": 45000000,
     "cukup_untuk_bulan": 5.3,
     "target_minimum": 76500000,
     "target_ideal": 127500000,
     "target_dipakai": 76500000,
     "kekurangan": 31500000,
     "perkiraan_waktu_terpenuhi": "1 tahun"
    },
    "alokasi_bulan_ini": {
     "kapasitas_menabung": 5500000,
     "untuk_dana_darurat": 2750000,
     "untuk_target": 2750000,
     "catatan": "Alokasi berubah otomatis: setelah dana darurat terpenuhi atau cicilan lunas, dananya dialihkan ke target."
    },
    "strategi_hutang": [],
    "target": [
     {
      "nama": "Rumah",
      "kategori": "rumah",
      "prioritas": 1,
      "harga_saat_ini": 600000000,
      "sumber_harga": "diisi pengguna",
      "kenaikan_harga_per_tahun_persen": 4,
      "tenggat_bulan": 84,
      "tenggat": "7 tahun",
      "setoran_bulan_pertama": 2750000,
      "opsi_a_menabung": {
       "waktu_tercapai_bulan": 266,
       "waktu_tercapai": "22 tahun 2 bulan",
       "perkiraan_harga_saat_tercapai": 1431276711,
       "jika_hanya_fokus_target_ini": "22 tahun 2 bulan",
       "harga_saat_tenggat": 789559068,
       "tercapai_sesuai_tenggat": false
      },
      "opsi_b_kredit": {
       "dp_persen": 20,
       "dp": 132362388,
       "waktu_kumpulkan_dp_bulan": 30,
       "waktu_kumpulkan_dp": "2 tahun 6 bulan",
       "perkiraan_harga_saat_beli": 661811941,
       "pinjaman": 529449553,
       "bunga_tahunan_persen": 11,
       "cicilan_lama_saat_itu": 0,
       "pilihan_tenor": [
        {
         "tenor_tahun": 10,
         "cicilan_bulanan": 7293168,
         "total_bunga": 345730630,
         "total_dibayar": 1007542570,
         "rasio_cicilan_setelah_kredit_persen": 52.1,
         "aman": false
        },
        {
         "tenor_tahun": 15,
         "cicilan_bulanan": 6017707,
         "total_bunga": 553737777,
         "total_dibayar": 1215549717,
         "rasio_cicilan_setelah_kredit_persen": 43,
         "aman": false
        },
        {
         "tenor_tahun": 20,
         "cicilan_bulanan": 5464917,
         "total_bunga": 782130485,
         "total_dibayar": 1443942426,
         "rasio_cicilan_setelah_kredit_persen": 39,
         "aman": false
        }
       ],
       "tenor_aman_terpendek": null
      },
      "opsi_c_kombinasi": {
       "dp_persen": 35,
       "dp": 248090987,
       "waktu_kumpulkan_dp_bulan": 51,
       "waktu_kumpulkan_dp": "4 tahun 3 bulan",
       "perkiraan_harga_saat_beli": 708831391,
       "pinjaman": 460740404,
       "bunga_tahunan_persen": 11,
       "cicilan_lama_saat_itu": 0,
       "pilihan_tenor": [
        {
         "tenor_tahun": 10,
         "cicilan_bulanan": 6346700,
         "total_bunga": 300863546,
         "total_dibayar": 1009694938,
         "rasio_cicilan_setelah_kredit_persen": 45.3,
         "aman": false
        },
        {
         "tenor_tahun": 15,
         "cicilan_bulanan": 5236761,
         "total_bunga": 481876632,
         "total_dibayar": 1190708023,
         "rasio_cicilan_setelah_kredit_persen": 37.4,
         "aman": false
        },
        {
         "tenor_tahun": 20,
         "cicilan_bulanan": 4755709,
         "total_bunga": 680629749,
         "total_dibayar": 1389461140,
         "rasio_cicilan_setelah_kredit_persen": 34,
         "aman": false
        }
       ],
       "tenor_aman_terpendek": null,
       "keterangan": "Menabung lebih lama untuk DP 35% agar pinjaman dan total bunga lebih kecil."
      },
      "status": "perlu_penyesuaian",
      "opsi_disarankan": "sesuaikan_rencana",
      "alternatif": {
       "tambahan_tabungan_per_bulan_agar_tepat_waktu": 4274514,
       "harga_maksimal_terjangkau_sesuai_tenggat": 327000000,
       "perpanjang_tenggat_menjadi": "22 tahun 2 bulan"
      }
     }
    ],
    "rekomendasi_utama": [
     "Bangun dana darurat Rp76.500.000 (9x pengeluaran bulanan) lebih dulu. Dengan menyisihkan sebagian kapasitas menabung, perkiraan terpenuhi dalam 1 tahun.",
     "Target 'Rumah' belum realistis dalam 7 tahun. Dengan kondisi sekarang baru tercapai 22 tahun 2 bulan, terlalu jauh dari tenggat. Pilihan: naikkan penghasilan lewat jalur karier atau usaha (lihat simulasinya di Roadmap), atau turunkan budget ke ±Rp327.000.000, atau tambah tabungan/penghasilan ±Rp4.274.514/bulan.",
     "Sebagian penghasilan tidak tetap. Di bulan sepi, pegang angka konservatif Rp14.000.000; kelebihan di bulan ramai langsung ditabung."
    ],
    "psikologi": null,
    "asumsi": {
     "inflasi_umum_persen": 3.2,
     "kenaikan_harga_persen": {
      "rumah": 4,
      "rumah_subsidi": 3,
      "mobil": 3,
      "motor": 3,
      "menikah": 4,
      "pendidikan": 6,
      "default": 3.2
     },
     "bunga_kredit_persen": {
      "rumah": 11,
      "rumah_subsidi": 5,
      "mobil": 10,
      "motor": 15
     },
     "dp_persen": {
      "rumah": 20,
      "rumah_subsidi": 1,
      "mobil": 20,
      "motor": 15
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
     "imbal_hasil_tabungan_persen": 0,
     "kenaikan_penghasilan_persen": 0,
     "pakai_penghasilan_konservatif": false,
     "batas_aman_cicilan_persen": 30,
     "porsi_dana_darurat_persen": 50
    },
    "sumber_asumsi": [
     "Inflasi umum 3,2%: inflasi tahunan Indonesia Agustus 2026 tercatat 3,19% (BPS via Databoks); sasaran BI 2,5±1%.",
     "Bunga KPR 11%: bunga floating KPR BCA 11% (Mandiri 13%, CIMB Niaga 13,5%), Kontan Agustus 2026.",
     "KPR subsidi 5% tetap dan batas harga rumah subsidi Rp166-185 juta: Kompas.com 2026.",
     "Kenaikan harga barang, bunga kredit kendaraan, DP, dan porsi alokasi adalah asumsi myCITA yang dapat diubah.",
     "Penghasilan dan pengeluaran dianggap tetap (konservatif); ubah 'kenaikan_penghasilan_persen' untuk skenario kenaikan gaji."
    ],
    "disclaimer": "myCITA adalah alat edukasi dan perencanaan keuangan, bukan nasihat investasi atau rekomendasi produk keuangan tertentu. Semua angka adalah estimasi berdasarkan data yang kamu isi dan asumsi yang tercantum."
   },
   "bengkel": {
    "status": "ok",
    "user_id": "agus",
    "mode": "simulasi_what_if",
    "pesan": "Simulasi what-if selesai (tidak mengubah data tersimpan).",
    "ringkasan": "Agus: pendapatan Rp16.200.000, pengeluaran Rp8.500.000, sisa Rp7.700.000. Skor kesehatan 84/100 (Sangat sehat 🟢), saving rate 47.5%. Target Rumah: dengan menabung tercapai dalam 10 tahun.",
    "dashboard": {
     "nama": "Agus",
     "pendapatan": 16200000,
     "pengeluaran": 8500000,
     "sisa": 7700000,
     "skor_kesehatan": 84,
     "status": "Sangat sehat 🟢",
     "saving_rate_persen": 47.5
    },
    "kesehatan_keuangan": {
     "penghasilan": 16200000,
     "penghasilan_konservatif": 16200000,
     "pengeluaran_rutin": 8500000,
     "pengeluaran_keinginan": 300000,
     "total_cicilan": 0,
     "total_pengeluaran": 8500000,
     "disposable_income": 7700000,
     "kapasitas_menabung": 7700000,
     "saving_rate_persen": 47.5,
     "rasio_cicilan_persen": 0,
     "rasio_keinginan_persen": 1.9,
     "rincian_skor": {
      "saving_rate (maks 30)": 30,
      "rasio_cicilan (maks 25)": 25,
      "dana_darurat (maks 25)": 8.8,
      "pengeluaran_keinginan (maks 10)": 10,
      "hutang_berbunga_tinggi (maks 10)": 10
     },
     "skor": 84,
     "status": "Sangat sehat 🟢"
    },
    "dana_darurat": {
     "dana_likuid_saat_ini": 45000000,
     "cukup_untuk_bulan": 5.3,
     "target_minimum": 76500000,
     "target_ideal": 127500000,
     "target_dipakai": 76500000,
     "kekurangan": 31500000,
     "perkiraan_waktu_terpenuhi": "9 bulan"
    },
    "alokasi_bulan_ini": {
     "kapasitas_menabung": 7700000,
     "untuk_dana_darurat": 3850000,
     "untuk_target": 3850000,
     "catatan": "Alokasi berubah otomatis: setelah dana darurat terpenuhi atau cicilan lunas, dananya dialihkan ke target."
    },
    "strategi_hutang": [],
    "target": [
     {
      "nama": "Rumah",
      "kategori": "rumah",
      "prioritas": 1,
      "harga_saat_ini": 600000000,
      "sumber_harga": "diisi pengguna",
      "kenaikan_harga_per_tahun_persen": 4,
      "tenggat_bulan": 84,
      "tenggat": "7 tahun",
      "setoran_bulan_pertama": 3850000,
      "opsi_a_menabung": {
       "waktu_tercapai_bulan": 120,
       "waktu_tercapai": "10 tahun",
       "perkiraan_harga_saat_tercapai": 888146571,
       "jika_hanya_fokus_target_ini": "10 tahun",
       "harga_saat_tenggat": 789559068,
       "tercapai_sesuai_tenggat": false
      },
      "opsi_b_kredit": {
       "dp_persen": 20,
       "dp": 128525585,
       "waktu_kumpulkan_dp_bulan": 21,
       "waktu_kumpulkan_dp": "1 tahun 9 bulan",
       "perkiraan_harga_saat_beli": 642627926,
       "pinjaman": 514102341,
       "bunga_tahunan_persen": 11,
       "cicilan_lama_saat_itu": 0,
       "pilihan_tenor": [
        {
         "tenor_tahun": 10,
         "cicilan_bulanan": 7081760,
         "total_bunga": 335708898,
         "total_dibayar": 978336824,
         "rasio_cicilan_setelah_kredit_persen": 43.7,
         "aman": false
        },
        {
         "tenor_tahun": 15,
         "cicilan_bulanan": 5843271,
         "total_bunga": 537686519,
         "total_dibayar": 1180314445,
         "rasio_cicilan_setelah_kredit_persen": 36.1,
         "aman": false
        },
        {
         "tenor_tahun": 20,
         "cicilan_bulanan": 5306505,
         "total_bunga": 759458784,
         "total_dibayar": 1402086710,
         "rasio_cicilan_setelah_kredit_persen": 32.8,
         "aman": false
        }
       ],
       "tenor_aman_terpendek": null
      },
      "opsi_c_kombinasi": {
       "dp_persen": 35,
       "dp": 235450636,
       "waktu_kumpulkan_dp_bulan": 35,
       "waktu_kumpulkan_dp": "2 tahun 11 bulan",
       "perkiraan_harga_saat_beli": 672716103,
       "pinjaman": 437265467,
       "bunga_tahunan_persen": 11,
       "cicilan_lama_saat_itu": 0,
       "pilihan_tenor": [
        {
         "tenor_tahun": 10,
         "cicilan_bulanan": 6023332,
         "total_bunga": 285534409,
         "total_dibayar": 958250512,
         "rasio_cicilan_setelah_kredit_persen": 37.2,
         "aman": false
        },
        {
         "tenor_tahun": 15,
         "cicilan_bulanan": 4969946,
         "total_bunga": 457324794,
         "total_dibayar": 1130040896,
         "rasio_cicilan_setelah_kredit_persen": 30.7,
         "aman": false
        },
        {
         "tenor_tahun": 20,
         "cicilan_bulanan": 4513403,
         "total_bunga": 645951347,
         "total_dibayar": 1318667450,
         "rasio_cicilan_setelah_kredit_persen": 27.9,
         "aman": true
        }
       ],
       "tenor_aman_terpendek": 20,
       "keterangan": "Menabung lebih lama untuk DP 35% agar pinjaman dan total bunga lebih kecil."
      },
      "status": "perlu_penyesuaian",
      "opsi_disarankan": "sesuaikan_rencana",
      "alternatif": {
       "tambahan_tabungan_per_bulan_agar_tepat_waktu": 2074514,
       "harga_maksimal_terjangkau_sesuai_tenggat": 467000000,
       "perpanjang_tenggat_menjadi": "10 tahun"
      }
     }
    ],
    "rekomendasi_utama": [
     "Bangun dana darurat Rp76.500.000 (9x pengeluaran bulanan) lebih dulu. Dengan menyisihkan sebagian kapasitas menabung, perkiraan terpenuhi dalam 9 bulan.",
     "Target 'Rumah' belum realistis dalam 7 tahun. Pilihan: perpanjang tenggat menjadi 10 tahun, atau turunkan budget ke ±Rp467.000.000, atau tambah tabungan/penghasilan ±Rp2.074.514/bulan.",
     "Sebagian penghasilan tidak tetap. Di bulan sepi, pegang angka konservatif Rp16.200.000; kelebihan di bulan ramai langsung ditabung."
    ],
    "psikologi": null,
    "pengembangan_usaha": [
     {
      "nama": "Bengkel Agus",
      "laba_bersih_sekarang": 11000000,
      "kenaikan_persen": 20,
      "tambahan_laba_bulanan": 2200000
     }
    ],
    "catatan_pengembangan_usaha": "Asumsi: kenaikan omzet dengan margin bersih tetap, sehingga laba bersih naik dengan persentase yang sama.",
    "perubahan_yang_disimulasikan": {
     "pengembangan_usaha": [
      {
       "nama": "Bengkel Agus",
       "laba_bersih": 11000000,
       "kenaikan_persen": 20
      }
     ],
     "perubahan_penghasilan": 2200000
    },
    "perbandingan": {
     "sebelum": {
      "sisa": 5500000,
      "skor": 84,
      "target": {
       "Rumah": "22 tahun 2 bulan"
      }
     },
     "sesudah": {
      "sisa": 7700000,
      "skor": 84,
      "target": {
       "Rumah": "10 tahun"
      }
     }
    },
    "asumsi": {
     "inflasi_umum_persen": 3.2,
     "kenaikan_harga_persen": {
      "rumah": 4,
      "rumah_subsidi": 3,
      "mobil": 3,
      "motor": 3,
      "menikah": 4,
      "pendidikan": 6,
      "default": 3.2
     },
     "bunga_kredit_persen": {
      "rumah": 11,
      "rumah_subsidi": 5,
      "mobil": 10,
      "motor": 15
     },
     "dp_persen": {
      "rumah": 20,
      "rumah_subsidi": 1,
      "mobil": 20,
      "motor": 15
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
     "imbal_hasil_tabungan_persen": 0,
     "kenaikan_penghasilan_persen": 0,
     "pakai_penghasilan_konservatif": false,
     "batas_aman_cicilan_persen": 30,
     "porsi_dana_darurat_persen": 50
    },
    "sumber_asumsi": [
     "Inflasi umum 3,2%: inflasi tahunan Indonesia Agustus 2026 tercatat 3,19% (BPS via Databoks); sasaran BI 2,5±1%.",
     "Bunga KPR 11%: bunga floating KPR BCA 11% (Mandiri 13%, CIMB Niaga 13,5%), Kontan Agustus 2026.",
     "KPR subsidi 5% tetap dan batas harga rumah subsidi Rp166-185 juta: Kompas.com 2026.",
     "Kenaikan harga barang, bunga kredit kendaraan, DP, dan porsi alokasi adalah asumsi myCITA yang dapat diubah.",
     "Penghasilan dan pengeluaran dianggap tetap (konservatif); ubah 'kenaikan_penghasilan_persen' untuk skenario kenaikan gaji."
    ],
    "disclaimer": "myCITA adalah alat edukasi dan perencanaan keuangan, bukan nasihat investasi atau rekomendasi produk keuangan tertentu. Semua angka adalah estimasi berdasarkan data yang kamu isi dan asumsi yang tercantum."
   },
   "kelontong": {
    "status": "ok",
    "user_id": "agus",
    "mode": "simulasi_what_if",
    "pesan": "Simulasi what-if selesai (tidak mengubah data tersimpan).",
    "ringkasan": "Agus: pendapatan Rp14.750.000, pengeluaran Rp8.500.000, sisa Rp6.250.000. Skor kesehatan 84/100 (Sangat sehat 🟢), saving rate 42.4%. Target Rumah: dengan menabung tercapai dalam 14 tahun 8 bulan.",
    "dashboard": {
     "nama": "Agus",
     "pendapatan": 14750000,
     "pengeluaran": 8500000,
     "sisa": 6250000,
     "skor_kesehatan": 84,
     "status": "Sangat sehat 🟢",
     "saving_rate_persen": 42.4
    },
    "kesehatan_keuangan": {
     "penghasilan": 14750000,
     "penghasilan_konservatif": 14750000,
     "pengeluaran_rutin": 8500000,
     "pengeluaran_keinginan": 300000,
     "total_cicilan": 0,
     "total_pengeluaran": 8500000,
     "disposable_income": 6250000,
     "kapasitas_menabung": 6250000,
     "saving_rate_persen": 42.4,
     "rasio_cicilan_persen": 0,
     "rasio_keinginan_persen": 2,
     "rincian_skor": {
      "saving_rate (maks 30)": 30,
      "rasio_cicilan (maks 25)": 25,
      "dana_darurat (maks 25)": 8.8,
      "pengeluaran_keinginan (maks 10)": 10,
      "hutang_berbunga_tinggi (maks 10)": 10
     },
     "skor": 84,
     "status": "Sangat sehat 🟢"
    },
    "dana_darurat": {
     "dana_likuid_saat_ini": 45000000,
     "cukup_untuk_bulan": 5.3,
     "target_minimum": 76500000,
     "target_ideal": 127500000,
     "target_dipakai": 76500000,
     "kekurangan": 31500000,
     "perkiraan_waktu_terpenuhi": "11 bulan"
    },
    "alokasi_bulan_ini": {
     "kapasitas_menabung": 6250000,
     "untuk_dana_darurat": 3125000,
     "untuk_target": 3125000,
     "catatan": "Alokasi berubah otomatis: setelah dana darurat terpenuhi atau cicilan lunas, dananya dialihkan ke target."
    },
    "strategi_hutang": [],
    "target": [
     {
      "nama": "Rumah",
      "kategori": "rumah",
      "prioritas": 1,
      "harga_saat_ini": 600000000,
      "sumber_harga": "diisi pengguna",
      "kenaikan_harga_per_tahun_persen": 4,
      "tenggat_bulan": 84,
      "tenggat": "7 tahun",
      "setoran_bulan_pertama": 3125000,
      "opsi_a_menabung": {
       "waktu_tercapai_bulan": 176,
       "waktu_tercapai": "14 tahun 8 bulan",
       "perkiraan_harga_saat_tercapai": 1066531189,
       "jika_hanya_fokus_target_ini": "14 tahun 8 bulan",
       "harga_saat_tenggat": 789559068,
       "tercapai_sesuai_tenggat": false
      },
      "opsi_b_kredit": {
       "dp_persen": 20,
       "dp": 130643201,
       "waktu_kumpulkan_dp_bulan": 26,
       "waktu_kumpulkan_dp": "2 tahun 2 bulan",
       "perkiraan_harga_saat_beli": 653216007,
       "pinjaman": 522572806,
       "bunga_tahunan_persen": 11,
       "cicilan_lama_saat_itu": 0,
       "pilihan_tenor": [
        {
         "tenor_tahun": 10,
         "cicilan_bulanan": 7198441,
         "total_bunga": 341240113,
         "total_dibayar": 994456121,
         "rasio_cicilan_setelah_kredit_persen": 48.8,
         "aman": false
        },
        {
         "tenor_tahun": 15,
         "cicilan_bulanan": 5939546,
         "total_bunga": 546545563,
         "total_dibayar": 1199761570,
         "rasio_cicilan_setelah_kredit_persen": 40.3,
         "aman": false
        },
        {
         "tenor_tahun": 20,
         "cicilan_bulanan": 5393936,
         "total_bunga": 771971797,
         "total_dibayar": 1425187804,
         "rasio_cicilan_setelah_kredit_persen": 36.6,
         "aman": false
        }
       ],
       "tenor_aman_terpendek": null
      },
      "opsi_c_kombinasi": {
       "dp_persen": 35,
       "dp": 242479413,
       "waktu_kumpulkan_dp_bulan": 44,
       "waktu_kumpulkan_dp": "3 tahun 8 bulan",
       "perkiraan_harga_saat_beli": 692798323,
       "pinjaman": 450318910,
       "bunga_tahunan_persen": 11,
       "cicilan_lama_saat_itu": 0,
       "pilihan_tenor": [
        {
         "tenor_tahun": 10,
         "cicilan_bulanan": 6203143,
         "total_bunga": 294058309,
         "total_dibayar": 986856632,
         "rasio_cicilan_setelah_kredit_persen": 42.1,
         "aman": false
        },
        {
         "tenor_tahun": 15,
         "cicilan_bulanan": 5118311,
         "total_bunga": 470977057,
         "total_dibayar": 1163775380,
         "rasio_cicilan_setelah_kredit_persen": 34.7,
         "aman": false
        },
        {
         "tenor_tahun": 20,
         "cicilan_bulanan": 4648140,
         "total_bunga": 665234574,
         "total_dibayar": 1358032897,
         "rasio_cicilan_setelah_kredit_persen": 31.5,
         "aman": false
        }
       ],
       "tenor_aman_terpendek": null,
       "keterangan": "Menabung lebih lama untuk DP 35% agar pinjaman dan total bunga lebih kecil."
      },
      "status": "perlu_penyesuaian",
      "opsi_disarankan": "sesuaikan_rencana",
      "alternatif": {
       "tambahan_tabungan_per_bulan_agar_tepat_waktu": 3524514,
       "harga_maksimal_terjangkau_sesuai_tenggat": 375000000,
       "perpanjang_tenggat_menjadi": "14 tahun 8 bulan"
      }
     }
    ],
    "rekomendasi_utama": [
     "Bangun dana darurat Rp76.500.000 (9x pengeluaran bulanan) lebih dulu. Dengan menyisihkan sebagian kapasitas menabung, perkiraan terpenuhi dalam 11 bulan.",
     "Target 'Rumah' belum realistis dalam 7 tahun. Dengan kondisi sekarang baru tercapai 14 tahun 8 bulan, terlalu jauh dari tenggat. Pilihan: naikkan penghasilan lewat jalur karier atau usaha (lihat simulasinya di Roadmap), atau turunkan budget ke ±Rp375.000.000, atau tambah tabungan/penghasilan ±Rp3.524.514/bulan.",
     "Sebagian penghasilan tidak tetap. Di bulan sepi, pegang angka konservatif Rp14.750.000; kelebihan di bulan ramai langsung ditabung."
    ],
    "psikologi": null,
    "pengembangan_usaha": [
     {
      "nama": "Kelontong istri",
      "laba_bersih_sekarang": 3000000,
      "kenaikan_persen": 25,
      "tambahan_laba_bulanan": 750000
     }
    ],
    "catatan_pengembangan_usaha": "Asumsi: kenaikan omzet dengan margin bersih tetap, sehingga laba bersih naik dengan persentase yang sama.",
    "perubahan_yang_disimulasikan": {
     "pengembangan_usaha": [
      {
       "nama": "Kelontong istri",
       "laba_bersih": 3000000,
       "kenaikan_persen": 25
      }
     ],
     "perubahan_penghasilan": 750000
    },
    "perbandingan": {
     "sebelum": {
      "sisa": 5500000,
      "skor": 84,
      "target": {
       "Rumah": "22 tahun 2 bulan"
      }
     },
     "sesudah": {
      "sisa": 6250000,
      "skor": 84,
      "target": {
       "Rumah": "14 tahun 8 bulan"
      }
     }
    },
    "asumsi": {
     "inflasi_umum_persen": 3.2,
     "kenaikan_harga_persen": {
      "rumah": 4,
      "rumah_subsidi": 3,
      "mobil": 3,
      "motor": 3,
      "menikah": 4,
      "pendidikan": 6,
      "default": 3.2
     },
     "bunga_kredit_persen": {
      "rumah": 11,
      "rumah_subsidi": 5,
      "mobil": 10,
      "motor": 15
     },
     "dp_persen": {
      "rumah": 20,
      "rumah_subsidi": 1,
      "mobil": 20,
      "motor": 15
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
     "imbal_hasil_tabungan_persen": 0,
     "kenaikan_penghasilan_persen": 0,
     "pakai_penghasilan_konservatif": false,
     "batas_aman_cicilan_persen": 30,
     "porsi_dana_darurat_persen": 50
    },
    "sumber_asumsi": [
     "Inflasi umum 3,2%: inflasi tahunan Indonesia Agustus 2026 tercatat 3,19% (BPS via Databoks); sasaran BI 2,5±1%.",
     "Bunga KPR 11%: bunga floating KPR BCA 11% (Mandiri 13%, CIMB Niaga 13,5%), Kontan Agustus 2026.",
     "KPR subsidi 5% tetap dan batas harga rumah subsidi Rp166-185 juta: Kompas.com 2026.",
     "Kenaikan harga barang, bunga kredit kendaraan, DP, dan porsi alokasi adalah asumsi myCITA yang dapat diubah.",
     "Penghasilan dan pengeluaran dianggap tetap (konservatif); ubah 'kenaikan_penghasilan_persen' untuk skenario kenaikan gaji."
    ],
    "disclaimer": "myCITA adalah alat edukasi dan perencanaan keuangan, bukan nasihat investasi atau rekomendasi produk keuangan tertentu. Semua angka adalah estimasi berdasarkan data yang kamu isi dan asumsi yang tercantum."
   },
   "gabungan": {
    "status": "ok",
    "user_id": "agus",
    "mode": "simulasi_what_if",
    "pesan": "Simulasi what-if selesai (tidak mengubah data tersimpan).",
    "ringkasan": "Agus: pendapatan Rp16.950.000, pengeluaran Rp8.500.000, sisa Rp8.450.000. Skor kesehatan 84/100 (Sangat sehat 🟢), saving rate 49.9%. Target Rumah: dengan menabung tercapai dalam 8 tahun 8 bulan.",
    "dashboard": {
     "nama": "Agus",
     "pendapatan": 16950000,
     "pengeluaran": 8500000,
     "sisa": 8450000,
     "skor_kesehatan": 84,
     "status": "Sangat sehat 🟢",
     "saving_rate_persen": 49.9
    },
    "kesehatan_keuangan": {
     "penghasilan": 16950000,
     "penghasilan_konservatif": 16950000,
     "pengeluaran_rutin": 8500000,
     "pengeluaran_keinginan": 300000,
     "total_cicilan": 0,
     "total_pengeluaran": 8500000,
     "disposable_income": 8450000,
     "kapasitas_menabung": 8450000,
     "saving_rate_persen": 49.9,
     "rasio_cicilan_persen": 0,
     "rasio_keinginan_persen": 1.8,
     "rincian_skor": {
      "saving_rate (maks 30)": 30,
      "rasio_cicilan (maks 25)": 25,
      "dana_darurat (maks 25)": 8.8,
      "pengeluaran_keinginan (maks 10)": 10,
      "hutang_berbunga_tinggi (maks 10)": 10
     },
     "skor": 84,
     "status": "Sangat sehat 🟢"
    },
    "dana_darurat": {
     "dana_likuid_saat_ini": 45000000,
     "cukup_untuk_bulan": 5.3,
     "target_minimum": 76500000,
     "target_ideal": 127500000,
     "target_dipakai": 76500000,
     "kekurangan": 31500000,
     "perkiraan_waktu_terpenuhi": "8 bulan"
    },
    "alokasi_bulan_ini": {
     "kapasitas_menabung": 8450000,
     "untuk_dana_darurat": 4225000,
     "untuk_target": 4225000,
     "catatan": "Alokasi berubah otomatis: setelah dana darurat terpenuhi atau cicilan lunas, dananya dialihkan ke target."
    },
    "strategi_hutang": [],
    "target": [
     {
      "nama": "Rumah",
      "kategori": "rumah",
      "prioritas": 1,
      "harga_saat_ini": 600000000,
      "sumber_harga": "diisi pengguna",
      "kenaikan_harga_per_tahun_persen": 4,
      "tenggat_bulan": 84,
      "tenggat": "7 tahun",
      "setoran_bulan_pertama": 4225000,
      "opsi_a_menabung": {
       "waktu_tercapai_bulan": 104,
       "waktu_tercapai": "8 tahun 8 bulan",
       "perkiraan_harga_saat_tercapai": 842895091,
       "jika_hanya_fokus_target_ini": "8 tahun 8 bulan",
       "harga_saat_tenggat": 789559068,
       "tercapai_sesuai_tenggat": false
      },
      "opsi_b_kredit": {
       "dp_persen": 20,
       "dp": 127688181,
       "waktu_kumpulkan_dp_bulan": 19,
       "waktu_kumpulkan_dp": "1 tahun 7 bulan",
       "perkiraan_harga_saat_beli": 638440905,
       "pinjaman": 510752724,
       "bunga_tahunan_persen": 11,
       "cicilan_lama_saat_itu": 0,
       "pilihan_tenor": [
        {
         "tenor_tahun": 10,
         "cicilan_bulanan": 7035619,
         "total_bunga": 333521598,
         "total_dibayar": 971962502,
         "rasio_cicilan_setelah_kredit_persen": 41.5,
         "aman": false
        },
        {
         "tenor_tahun": 15,
         "cicilan_bulanan": 5805200,
         "total_bunga": 534183240,
         "total_dibayar": 1172624145,
         "rasio_cicilan_setelah_kredit_persen": 34.2,
         "aman": false
        },
        {
         "tenor_tahun": 20,
         "cicilan_bulanan": 5271930,
         "total_bunga": 754510555,
         "total_dibayar": 1392951460,
         "rasio_cicilan_setelah_kredit_persen": 31.1,
         "aman": false
        }
       ],
       "tenor_aman_terpendek": null
      },
      "opsi_c_kombinasi": {
       "dp_persen": 35,
       "dp": 233153282,
       "waktu_kumpulkan_dp_bulan": 32,
       "waktu_kumpulkan_dp": "2 tahun 8 bulan",
       "perkiraan_harga_saat_beli": 666152234,
       "pinjaman": 432998952,
       "bunga_tahunan_persen": 11,
       "cicilan_lama_saat_itu": 0,
       "pilihan_tenor": [
        {
         "tenor_tahun": 10,
         "cicilan_bulanan": 5964561,
         "total_bunga": 282748374,
         "total_dibayar": 948900608,
         "rasio_cicilan_setelah_kredit_persen": 35.2,
         "aman": false
        },
        {
         "tenor_tahun": 15,
         "cicilan_bulanan": 4921453,
         "total_bunga": 452862555,
         "total_dibayar": 1119014788,
         "rasio_cicilan_setelah_kredit_persen": 29,
         "aman": true
        },
        {
         "tenor_tahun": 20,
         "cicilan_bulanan": 4469365,
         "total_bunga": 639648629,
         "total_dibayar": 1305800863,
         "rasio_cicilan_setelah_kredit_persen": 26.4,
         "aman": true
        }
       ],
       "tenor_aman_terpendek": 15,
       "keterangan": "Menabung lebih lama untuk DP 35% agar pinjaman dan total bunga lebih kecil."
      },
      "status": "perlu_penyesuaian",
      "opsi_disarankan": "sesuaikan_rencana",
      "alternatif": {
       "tambahan_tabungan_per_bulan_agar_tepat_waktu": 1324513,
       "harga_maksimal_terjangkau_sesuai_tenggat": 515000000,
       "perpanjang_tenggat_menjadi": "8 tahun 8 bulan"
      }
     }
    ],
    "rekomendasi_utama": [
     "Bangun dana darurat Rp76.500.000 (9x pengeluaran bulanan) lebih dulu. Dengan menyisihkan sebagian kapasitas menabung, perkiraan terpenuhi dalam 8 bulan.",
     "Target 'Rumah' belum realistis dalam 7 tahun. Pilihan: perpanjang tenggat menjadi 8 tahun 8 bulan, atau turunkan budget ke ±Rp515.000.000, atau tambah tabungan/penghasilan ±Rp1.324.513/bulan.",
     "Sebagian penghasilan tidak tetap. Di bulan sepi, pegang angka konservatif Rp16.950.000; kelebihan di bulan ramai langsung ditabung."
    ],
    "psikologi": null,
    "pengembangan_usaha": [
     {
      "nama": "Bengkel Agus",
      "laba_bersih_sekarang": 11000000,
      "kenaikan_persen": 20,
      "tambahan_laba_bulanan": 2200000
     },
     {
      "nama": "Kelontong istri",
      "laba_bersih_sekarang": 3000000,
      "kenaikan_persen": 25,
      "tambahan_laba_bulanan": 750000
     }
    ],
    "catatan_pengembangan_usaha": "Asumsi: kenaikan omzet dengan margin bersih tetap, sehingga laba bersih naik dengan persentase yang sama.",
    "perubahan_yang_disimulasikan": {
     "pengembangan_usaha": [
      {
       "nama": "Bengkel Agus",
       "laba_bersih": 11000000,
       "kenaikan_persen": 20
      },
      {
       "nama": "Kelontong istri",
       "laba_bersih": 3000000,
       "kenaikan_persen": 25
      }
     ],
     "perubahan_penghasilan": 2950000
    },
    "perbandingan": {
     "sebelum": {
      "sisa": 5500000,
      "skor": 84,
      "target": {
       "Rumah": "22 tahun 2 bulan"
      }
     },
     "sesudah": {
      "sisa": 8450000,
      "skor": 84,
      "target": {
       "Rumah": "8 tahun 8 bulan"
      }
     }
    },
    "asumsi": {
     "inflasi_umum_persen": 3.2,
     "kenaikan_harga_persen": {
      "rumah": 4,
      "rumah_subsidi": 3,
      "mobil": 3,
      "motor": 3,
      "menikah": 4,
      "pendidikan": 6,
      "default": 3.2
     },
     "bunga_kredit_persen": {
      "rumah": 11,
      "rumah_subsidi": 5,
      "mobil": 10,
      "motor": 15
     },
     "dp_persen": {
      "rumah": 20,
      "rumah_subsidi": 1,
      "mobil": 20,
      "motor": 15
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
     "imbal_hasil_tabungan_persen": 0,
     "kenaikan_penghasilan_persen": 0,
     "pakai_penghasilan_konservatif": false,
     "batas_aman_cicilan_persen": 30,
     "porsi_dana_darurat_persen": 50
    },
    "sumber_asumsi": [
     "Inflasi umum 3,2%: inflasi tahunan Indonesia Agustus 2026 tercatat 3,19% (BPS via Databoks); sasaran BI 2,5±1%.",
     "Bunga KPR 11%: bunga floating KPR BCA 11% (Mandiri 13%, CIMB Niaga 13,5%), Kontan Agustus 2026.",
     "KPR subsidi 5% tetap dan batas harga rumah subsidi Rp166-185 juta: Kompas.com 2026.",
     "Kenaikan harga barang, bunga kredit kendaraan, DP, dan porsi alokasi adalah asumsi myCITA yang dapat diubah.",
     "Penghasilan dan pengeluaran dianggap tetap (konservatif); ubah 'kenaikan_penghasilan_persen' untuk skenario kenaikan gaji."
    ],
    "disclaimer": "myCITA adalah alat edukasi dan perencanaan keuangan, bukan nasihat investasi atau rekomendasi produk keuangan tertentu. Semua angka adalah estimasi berdasarkan data yang kamu isi dan asumsi yang tercantum."
   },
   "rumah_realistis": {
    "status": "ok",
    "user_id": "agus",
    "mode": "simulasi_what_if",
    "pesan": "Simulasi what-if selesai (tidak mengubah data tersimpan).",
    "ringkasan": "Agus: pendapatan Rp16.950.000, pengeluaran Rp8.500.000, sisa Rp8.450.000. Skor kesehatan 84/100 (Sangat sehat 🟢), saving rate 49.9%. Target Rumah: dengan menabung tercapai dalam 7 tahun; via kredit DP Rp108.884.933 dan cicilan Rp4.950.331/bln (15 th).",
    "dashboard": {
     "nama": "Agus",
     "pendapatan": 16950000,
     "pengeluaran": 8500000,
     "sisa": 8450000,
     "skor_kesehatan": 84,
     "status": "Sangat sehat 🟢",
     "saving_rate_persen": 49.9
    },
    "kesehatan_keuangan": {
     "penghasilan": 16950000,
     "penghasilan_konservatif": 16950000,
     "pengeluaran_rutin": 8500000,
     "pengeluaran_keinginan": 300000,
     "total_cicilan": 0,
     "total_pengeluaran": 8500000,
     "disposable_income": 8450000,
     "kapasitas_menabung": 8450000,
     "saving_rate_persen": 49.9,
     "rasio_cicilan_persen": 0,
     "rasio_keinginan_persen": 1.8,
     "rincian_skor": {
      "saving_rate (maks 30)": 30,
      "rasio_cicilan (maks 25)": 25,
      "dana_darurat (maks 25)": 8.8,
      "pengeluaran_keinginan (maks 10)": 10,
      "hutang_berbunga_tinggi (maks 10)": 10
     },
     "skor": 84,
     "status": "Sangat sehat 🟢"
    },
    "dana_darurat": {
     "dana_likuid_saat_ini": 45000000,
     "cukup_untuk_bulan": 5.3,
     "target_minimum": 76500000,
     "target_ideal": 127500000,
     "target_dipakai": 76500000,
     "kekurangan": 31500000,
     "perkiraan_waktu_terpenuhi": "8 bulan"
    },
    "alokasi_bulan_ini": {
     "kapasitas_menabung": 8450000,
     "untuk_dana_darurat": 4225000,
     "untuk_target": 4225000,
     "catatan": "Alokasi berubah otomatis: setelah dana darurat terpenuhi atau cicilan lunas, dananya dialihkan ke target."
    },
    "strategi_hutang": [],
    "target": [
     {
      "nama": "Rumah",
      "kategori": "rumah",
      "prioritas": 1,
      "harga_saat_ini": 515000000,
      "sumber_harga": "diisi pengguna",
      "kenaikan_harga_per_tahun_persen": 4,
      "tenggat_bulan": 84,
      "tenggat": "7 tahun",
      "setoran_bulan_pertama": 4225000,
      "opsi_a_menabung": {
       "waktu_tercapai_bulan": 84,
       "waktu_tercapai": "7 tahun",
       "perkiraan_harga_saat_tercapai": 677704866,
       "jika_hanya_fokus_target_ini": "7 tahun",
       "harga_saat_tenggat": 677704866,
       "tercapai_sesuai_tenggat": true
      },
      "opsi_b_kredit": {
       "dp_persen": 20,
       "dp": 108884933,
       "waktu_kumpulkan_dp_bulan": 17,
       "waktu_kumpulkan_dp": "1 tahun 5 bulan",
       "perkiraan_harga_saat_beli": 544424666,
       "pinjaman": 435539732,
       "bunga_tahunan_persen": 11,
       "cicilan_lama_saat_itu": 0,
       "pilihan_tenor": [
        {
         "tenor_tahun": 10,
         "cicilan_bulanan": 5999560,
         "total_bunga": 284407504,
         "total_dibayar": 828832170,
         "rasio_cicilan_setelah_kredit_persen": 35.4,
         "aman": false
        },
        {
         "tenor_tahun": 15,
         "cicilan_bulanan": 4950331,
         "total_bunga": 455519892,
         "total_dibayar": 999944558,
         "rasio_cicilan_setelah_kredit_persen": 29.2,
         "aman": true
        },
        {
         "tenor_tahun": 20,
         "cicilan_bulanan": 4495591,
         "total_bunga": 643402003,
         "total_dibayar": 1187826668,
         "rasio_cicilan_setelah_kredit_persen": 26.5,
         "aman": true
        }
       ],
       "tenor_aman_terpendek": 15
      },
      "opsi_c_kombinasi": {
       "dp_persen": 35,
       "dp": 197523936,
       "waktu_kumpulkan_dp_bulan": 28,
       "waktu_kumpulkan_dp": "2 tahun 4 bulan",
       "perkiraan_harga_saat_beli": 564354104,
       "pinjaman": 366830167,
       "bunga_tahunan_persen": 11,
       "cicilan_lama_saat_itu": 0,
       "pilihan_tenor": [
        {
         "tenor_tahun": 10,
         "cicilan_bulanan": 5053086,
         "total_bunga": 239540149,
         "total_dibayar": 803894253,
         "rasio_cicilan_setelah_kredit_persen": 29.8,
         "aman": true
        },
        {
         "tenor_tahun": 15,
         "cicilan_bulanan": 4169380,
         "total_bunga": 383658311,
         "total_dibayar": 948012415,
         "rasio_cicilan_setelah_kredit_persen": 24.6,
         "aman": true
        },
        {
         "tenor_tahun": 20,
         "cicilan_bulanan": 3786378,
         "total_bunga": 541900650,
         "total_dibayar": 1106254754,
         "rasio_cicilan_setelah_kredit_persen": 22.3,
         "aman": true
        }
       ],
       "tenor_aman_terpendek": 10,
       "keterangan": "Menabung lebih lama untuk DP 35% agar pinjaman dan total bunga lebih kecil."
      },
      "status": "realistis",
      "opsi_disarankan": "menabung"
     }
    ],
    "rekomendasi_utama": [
     "Bangun dana darurat Rp76.500.000 (9x pengeluaran bulanan) lebih dulu. Dengan menyisihkan sebagian kapasitas menabung, perkiraan terpenuhi dalam 8 bulan.",
     "Sebagian penghasilan tidak tetap. Di bulan sepi, pegang angka konservatif Rp16.950.000; kelebihan di bulan ramai langsung ditabung."
    ],
    "psikologi": null,
    "pengembangan_usaha": [
     {
      "nama": "Bengkel Agus",
      "laba_bersih_sekarang": 11000000,
      "kenaikan_persen": 20,
      "tambahan_laba_bulanan": 2200000
     },
     {
      "nama": "Kelontong istri",
      "laba_bersih_sekarang": 3000000,
      "kenaikan_persen": 25,
      "tambahan_laba_bulanan": 750000
     }
    ],
    "catatan_pengembangan_usaha": "Asumsi: kenaikan omzet dengan margin bersih tetap, sehingga laba bersih naik dengan persentase yang sama.",
    "perubahan_yang_disimulasikan": {
     "pengembangan_usaha": [
      {
       "nama": "Bengkel Agus",
       "laba_bersih": 11000000,
       "kenaikan_persen": 20
      },
      {
       "nama": "Kelontong istri",
       "laba_bersih": 3000000,
       "kenaikan_persen": 25
      }
     ],
     "target": {
      "nama": "Rumah",
      "kategori": "rumah",
      "harga": 515000000,
      "target_tahun": 7
     },
     "perubahan_penghasilan": 2950000
    },
    "perbandingan": {
     "sebelum": {
      "sisa": 5500000,
      "skor": 84,
      "target": {
       "Rumah": "14 tahun"
      }
     },
     "sesudah": {
      "sisa": 8450000,
      "skor": 84,
      "target": {
       "Rumah": "7 tahun"
      }
     }
    },
    "asumsi": {
     "inflasi_umum_persen": 3.2,
     "kenaikan_harga_persen": {
      "rumah": 4,
      "rumah_subsidi": 3,
      "mobil": 3,
      "motor": 3,
      "menikah": 4,
      "pendidikan": 6,
      "default": 3.2
     },
     "bunga_kredit_persen": {
      "rumah": 11,
      "rumah_subsidi": 5,
      "mobil": 10,
      "motor": 15
     },
     "dp_persen": {
      "rumah": 20,
      "rumah_subsidi": 1,
      "mobil": 20,
      "motor": 15
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
     "imbal_hasil_tabungan_persen": 0,
     "kenaikan_penghasilan_persen": 0,
     "pakai_penghasilan_konservatif": false,
     "batas_aman_cicilan_persen": 30,
     "porsi_dana_darurat_persen": 50
    },
    "sumber_asumsi": [
     "Inflasi umum 3,2%: inflasi tahunan Indonesia Agustus 2026 tercatat 3,19% (BPS via Databoks); sasaran BI 2,5±1%.",
     "Bunga KPR 11%: bunga floating KPR BCA 11% (Mandiri 13%, CIMB Niaga 13,5%), Kontan Agustus 2026.",
     "KPR subsidi 5% tetap dan batas harga rumah subsidi Rp166-185 juta: Kompas.com 2026.",
     "Kenaikan harga barang, bunga kredit kendaraan, DP, dan porsi alokasi adalah asumsi myCITA yang dapat diubah.",
     "Penghasilan dan pengeluaran dianggap tetap (konservatif); ubah 'kenaikan_penghasilan_persen' untuk skenario kenaikan gaji."
    ],
    "disclaimer": "myCITA adalah alat edukasi dan perencanaan keuangan, bukan nasihat investasi atau rekomendasi produk keuangan tertentu. Semua angka adalah estimasi berdasarkan data yang kamu isi dan asumsi yang tercantum."
   },
   "harga_realistis": 515000000,
   "tenggat_tahun": 7
  },
  "chat": {}
 },
 "dini": {
  "analisis": {
   "status": "ok",
   "user_id": "dini",
   "mode": "analisis",
   "pesan": "Analisis selesai dan tersimpan.",
   "ringkasan": "Dini: pendapatan Rp1.500.000, pengeluaran Rp1.350.000, sisa Rp150.000. Skor kesehatan 59/100 (Perlu perhatian 🟡), saving rate 10.0%.",
   "dashboard": {
    "nama": "Dini",
    "pendapatan": 1500000,
    "pengeluaran": 1350000,
    "sisa": 150000,
    "skor_kesehatan": 59,
    "status": "Perlu perhatian 🟡",
    "saving_rate_persen": 10
   },
   "kesehatan_keuangan": {
    "penghasilan": 1500000,
    "penghasilan_konservatif": 1500000,
    "pengeluaran_rutin": 1350000,
    "pengeluaran_keinginan": 700000,
    "total_cicilan": 0,
    "total_pengeluaran": 1350000,
    "disposable_income": 150000,
    "kapasitas_menabung": 150000,
    "saving_rate_persen": 10,
    "rasio_cicilan_persen": 0,
    "rasio_keinginan_persen": 46.7,
    "rincian_skor": {
     "saving_rate (maks 30)": 15,
     "rasio_cicilan (maks 25)": 25,
     "dana_darurat (maks 25)": 7.7,
     "pengeluaran_keinginan (maks 10)": 1.7,
     "hutang_berbunga_tinggi (maks 10)": 10
    },
    "skor": 59,
    "status": "Perlu perhatian 🟡"
   },
   "dana_darurat": {
    "dana_likuid_saat_ini": 2500000,
    "cukup_untuk_bulan": 1.9,
    "target_minimum": 4050000,
    "target_ideal": 8100000,
    "target_dipakai": 4050000,
    "kekurangan": 1550000,
    "perkiraan_waktu_terpenuhi": "11 bulan"
   },
   "alokasi_bulan_ini": {
    "kapasitas_menabung": 150000,
    "untuk_dana_darurat": 150000,
    "untuk_target": 0,
    "catatan": "Alokasi berubah otomatis: setelah dana darurat terpenuhi atau cicilan lunas, dananya dialihkan ke target."
   },
   "strategi_hutang": [],
   "target": [],
   "rekomendasi_utama": [
    "Bangun dana darurat Rp4.050.000 (3x pengeluaran bulanan) lebih dulu. Dengan menyisihkan sebagian kapasitas menabung, perkiraan terpenuhi dalam 11 bulan.",
    "Saving rate 10%. Untuk mencapai 20%, perlu menambah tabungan ±Rp150.000/bulan.",
    "Pengeluaran keinginan 47% dari penghasilan (ideal ≤30%); pos terbesar: makan_jajan Rp500.000."
   ],
   "psikologi": null,
   "asumsi": {
    "inflasi_umum_persen": 3.2,
    "kenaikan_harga_persen": {
     "rumah": 4,
     "rumah_subsidi": 3,
     "mobil": 3,
     "motor": 3,
     "menikah": 4,
     "pendidikan": 6,
     "default": 3.2
    },
    "bunga_kredit_persen": {
     "rumah": 11,
     "rumah_subsidi": 5,
     "mobil": 10,
     "motor": 15
    },
    "dp_persen": {
     "rumah": 20,
     "rumah_subsidi": 1,
     "mobil": 20,
     "motor": 15
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
    "imbal_hasil_tabungan_persen": 0,
    "kenaikan_penghasilan_persen": 0,
    "pakai_penghasilan_konservatif": false,
    "batas_aman_cicilan_persen": 30,
    "porsi_dana_darurat_persen": 50
   },
   "sumber_asumsi": [
    "Inflasi umum 3,2%: inflasi tahunan Indonesia Agustus 2026 tercatat 3,19% (BPS via Databoks); sasaran BI 2,5±1%.",
    "Bunga KPR 11%: bunga floating KPR BCA 11% (Mandiri 13%, CIMB Niaga 13,5%), Kontan Agustus 2026.",
    "KPR subsidi 5% tetap dan batas harga rumah subsidi Rp166-185 juta: Kompas.com 2026.",
    "Kenaikan harga barang, bunga kredit kendaraan, DP, dan porsi alokasi adalah asumsi myCITA yang dapat diubah.",
    "Penghasilan dan pengeluaran dianggap tetap (konservatif); ubah 'kenaikan_penghasilan_persen' untuk skenario kenaikan gaji."
   ],
   "disclaimer": "myCITA adalah alat edukasi dan perencanaan keuangan, bukan nasihat investasi atau rekomendasi produk keuangan tertentu. Semua angka adalah estimasi berdasarkan data yang kamu isi dan asumsi yang tercantum."
  },
  "karier": {
   "status": "ok",
   "user_id": "dini",
   "pesan": "Eksplorasi karier selesai: Data Analyst, Software Engineer, UI/UX Designer.",
   "rekomendasi_jurusan": [
    {
     "id": "sistem_informasi",
     "jurusan": "S1 Sistem Informasi",
     "skor_kecocokan": 90,
     "minat_cocok": [
      "desain",
      "memecahkan masalah",
      "teknologi"
     ],
     "skill_pendukung": [
      "office",
      "public speaking",
      "python",
      "website"
     ],
     "karier_terkait": [
      "Data Analyst",
      "Software Engineer",
      "UI/UX Designer"
     ],
     "kampus": [
      {
       "nama": "Universitas Indonesia (UI)",
       "kota": "Depok",
       "jenis": "PTN",
       "qs_2026": "189",
       "prodi": [
        "S1 Ilmu Komputer",
        "S1 Sistem Informasi"
       ],
       "biaya_min": 500000,
       "biaya_max": 17500000,
       "satuan": "UKT per semester",
       "catatan": "Fakultas Ilmu Komputer",
       "sumber": "Keputusan Rektor UI No. 297/SK/R/UI/2026 via Gebrak; QS WUR 2026 via Detik",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Universitas Gadjah Mada (UGM)",
       "kota": "Yogyakarta",
       "jenis": "PTN",
       "qs_2026": "224",
       "prodi": [
        "S1 Ilmu Komputer",
        "S1 Teknologi Informasi"
       ],
       "biaya_min": 0,
       "biaya_max": 13300000,
       "satuan": "UKT per semester",
       "catatan": "Kelompok bidang rekayasa (perangkat lunak, internet)",
       "sumber": "Mamikos (UKT UGM SNBP/SNBT 2026)",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Institut Teknologi Bandung (ITB)",
       "kota": "Bandung",
       "jenis": "PTN",
       "qs_2026": "255",
       "prodi": [
        "S1 Teknik Informatika (STEI)",
        "S1 Sistem dan Teknologi Informasi (STEI)"
       ],
       "biaya_min": 500000,
       "biaya_max": 12500000,
       "satuan": "UKT per semester",
       "catatan": "STEI; persaingan masuk sangat ketat",
       "sumber": "Mamikos (UKT SNBT ITB 2026)",
       "periode": "2026",
       "di_kota_pengguna": true
      },
      {
       "nama": "Universitas Airlangga (Unair)",
       "kota": "Surabaya",
       "jenis": "PTN",
       "qs_2026": "287",
       "prodi": [
        "S1 Sistem Informasi"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "UKT prodi belum tersedia di database; cek unair.ac.id",
       "sumber": "QS WUR 2026 via Detik",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Institut Teknologi Sepuluh Nopember (ITS)",
       "kota": "Surabaya",
       "jenis": "PTN",
       "qs_2026": "509",
       "prodi": [
        "S1 Teknik Informatika",
        "S1 Sistem Informasi",
        "S1 Sains Data"
       ],
       "biaya_min": 500000,
       "biaya_max": 7500000,
       "satuan": "UKT per semester",
       "catatan": "Kisaran umum program sarjana; verifikasi di its.ac.id",
       "sumber": "Sevima",
       "periode": "kisaran umum",
       "di_kota_pengguna": false
      },
      {
       "nama": "Universitas Brawijaya (UB)",
       "kota": "Malang",
       "jenis": "PTN",
       "qs_2026": "680",
       "prodi": [
        "S1 Teknik Informatika",
        "S1 Sistem Informasi"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "UKT prodi belum tersedia di database; cek ub.ac.id",
       "sumber": "QS WUR 2026 via Detik",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "BINUS University",
       "kota": "Jakarta",
       "jenis": "PTS",
       "qs_2026": "851-900",
       "prodi": [
        "S1 Computer Science",
        "S1 Information Systems",
        "S1 Data Science"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "per semester",
       "catatan": "Kampus swasta peringkat teratas; biaya belum tersedia di database",
       "sumber": "QS WUR 2026 via Detik",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Telkom University",
       "kota": "Bandung",
       "jenis": "PTS",
       "qs_2026": "1001-1200",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi",
        "S1 Sains Data"
       ],
       "biaya_min": 12000000,
       "biaya_max": 13500000,
       "satuan": "BPP per semester",
       "catatan": "Ditambah uang pangkal (UP3/SDP2) sekali bayar",
       "sumber": "Telkom University (hive.telkomuniversity.ac.id); Tirto 2025",
       "periode": "2025-2026",
       "di_kota_pengguna": true
      },
      {
       "nama": "Institut Teknologi Nasional (Itenas)",
       "kota": "Bandung",
       "jenis": "PTS",
       "qs_2026": "1201-1400 (QS 2025)",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi",
        "dan prodi teknik lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "Binus Bandung (QS WUR 2025)",
       "periode": "2025",
       "di_kota_pengguna": true
      },
      {
       "nama": "Universitas Kristen Maranatha",
       "kota": "Bandung",
       "jenis": "PTS",
       "qs_2026": "1401+",
       "prodi": [
        "S1 Teknik Informatika",
        "S1 Sistem Informasi",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": true
      },
      {
       "nama": "Universitas Andalas (Unand)",
       "kota": "Padang",
       "jenis": "PTN",
       "qs_2026": "1401+",
       "prodi": [
        "S1 Sistem Informasi",
        "S1 Teknik Komputer",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Universitas Sriwijaya (Unsri)",
       "kota": "Palembang",
       "jenis": "PTN",
       "qs_2026": "1401+",
       "prodi": [
        "S1 Teknik Informatika",
        "S1 Sistem Informasi",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Universitas Kristen Petra",
       "kota": "Surabaya",
       "jenis": "PTS",
       "qs_2026": "1401+",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi Bisnis",
        "S1 Sains Data",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Universitas Widyatama",
       "kota": "Bandung",
       "jenis": "PTS",
       "qs_2026": "-",
       "prodi": [
        "S1 Teknik Informatika",
        "S1 Sistem Informasi",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": true
      },
      {
       "nama": "UPN Veteran Jakarta",
       "kota": "Jakarta",
       "jenis": "PTN",
       "qs_2026": "-",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "UPN Veteran Yogyakarta",
       "kota": "Yogyakarta",
       "jenis": "PTN",
       "qs_2026": "-",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "UPN Veteran Jawa Timur",
       "kota": "Surabaya",
       "jenis": "PTN",
       "qs_2026": "-",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi",
        "S1 Sains Data",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Institut Teknologi Kalimantan (ITK)",
       "kota": "Balikpapan",
       "jenis": "PTN",
       "qs_2026": "-",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi",
        "dan prodi teknik lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Universitas Tarumanagara (Untar)",
       "kota": "Jakarta",
       "jenis": "PTS",
       "qs_2026": "-",
       "prodi": [
        "S1 Teknik Informatika",
        "S1 Sistem Informasi",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Universitas Gunadarma",
       "kota": "Depok",
       "jenis": "PTS",
       "qs_2026": "-",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Universitas Pelita Harapan (UPH)",
       "kota": "Tangerang",
       "jenis": "PTS",
       "qs_2026": "-",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Universitas Multimedia Nusantara (UMN)",
       "kota": "Tangerang",
       "jenis": "PTS",
       "qs_2026": "-",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi",
        "S1 DKV",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "President University",
       "kota": "Bekasi",
       "jenis": "PTS",
       "qs_2026": "-",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Universitas Terbuka (UT)",
       "kota": "Daring (seluruh Indonesia)",
       "jenis": "PTN",
       "qs_2026": "-",
       "prodi": [
        "S1 Sistem Informasi",
        "S1 Sains Data"
       ],
       "biaya_min": 1800000,
       "biaya_max": 1900000,
       "satuan": "per semester",
       "catatan": "Alternatif hemat dan fleksibel, bisa sambil bekerja",
       "sumber": "Kompas Edu",
       "periode": "2026",
       "di_kota_pengguna": false
      }
     ]
    },
    {
     "id": "informatika",
     "jurusan": "S1 Teknik Informatika / Ilmu Komputer",
     "skor_kecocokan": 89,
     "minat_cocok": [
      "matematika",
      "memecahkan masalah",
      "teknologi"
     ],
     "skill_pendukung": [
      "coding",
      "python",
      "website"
     ],
     "karier_terkait": [
      "Software Engineer",
      "Data Scientist",
      "Data Engineer"
     ],
     "kampus": [
      {
       "nama": "Universitas Indonesia (UI)",
       "kota": "Depok",
       "jenis": "PTN",
       "qs_2026": "189",
       "prodi": [
        "S1 Ilmu Komputer",
        "S1 Sistem Informasi"
       ],
       "biaya_min": 500000,
       "biaya_max": 17500000,
       "satuan": "UKT per semester",
       "catatan": "Fakultas Ilmu Komputer",
       "sumber": "Keputusan Rektor UI No. 297/SK/R/UI/2026 via Gebrak; QS WUR 2026 via Detik",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Universitas Gadjah Mada (UGM)",
       "kota": "Yogyakarta",
       "jenis": "PTN",
       "qs_2026": "224",
       "prodi": [
        "S1 Ilmu Komputer",
        "S1 Teknologi Informasi"
       ],
       "biaya_min": 0,
       "biaya_max": 13300000,
       "satuan": "UKT per semester",
       "catatan": "Kelompok bidang rekayasa (perangkat lunak, internet)",
       "sumber": "Mamikos (UKT UGM SNBP/SNBT 2026)",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Institut Teknologi Bandung (ITB)",
       "kota": "Bandung",
       "jenis": "PTN",
       "qs_2026": "255",
       "prodi": [
        "S1 Teknik Informatika (STEI)",
        "S1 Sistem dan Teknologi Informasi (STEI)"
       ],
       "biaya_min": 500000,
       "biaya_max": 12500000,
       "satuan": "UKT per semester",
       "catatan": "STEI; persaingan masuk sangat ketat",
       "sumber": "Mamikos (UKT SNBT ITB 2026)",
       "periode": "2026",
       "di_kota_pengguna": true
      },
      {
       "nama": "IPB University",
       "kota": "Bogor",
       "jenis": "PTN",
       "qs_2026": "399",
       "prodi": [
        "S1 Ilmu Komputer",
        "S1 Statistika dan Sains Data"
       ],
       "biaya_min": 2400000,
       "biaya_max": 12000000,
       "satuan": "UKT per semester",
       "catatan": "Kisaran umum program sarjana",
       "sumber": "Sevima; Mamikos (Januari 2026)",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Institut Teknologi Sepuluh Nopember (ITS)",
       "kota": "Surabaya",
       "jenis": "PTN",
       "qs_2026": "509",
       "prodi": [
        "S1 Teknik Informatika",
        "S1 Sistem Informasi",
        "S1 Sains Data"
       ],
       "biaya_min": 500000,
       "biaya_max": 7500000,
       "satuan": "UKT per semester",
       "catatan": "Kisaran umum program sarjana; verifikasi di its.ac.id",
       "sumber": "Sevima",
       "periode": "kisaran umum",
       "di_kota_pengguna": false
      },
      {
       "nama": "Universitas Padjadjaran (Unpad)",
       "kota": "Bandung/Jatinangor",
       "jenis": "PTN",
       "qs_2026": "515",
       "prodi": [
        "S1 Teknik Informatika",
        "S1 Statistika"
       ],
       "biaya_min": 500000,
       "biaya_max": 15000000,
       "satuan": "UKT per semester",
       "catatan": "Teknik Informatika termasuk UKT tertinggi di Unpad",
       "sumber": "Mamikos (Kep. Rektor Unpad No. 110/UN6.RKT/Kep/HK/2025)",
       "periode": "2026",
       "di_kota_pengguna": true
      },
      {
       "nama": "Universitas Diponegoro (Undip)",
       "kota": "Semarang",
       "jenis": "PTN",
       "qs_2026": "624",
       "prodi": [
        "S1 Informatika"
       ],
       "biaya_min": null,
       "biaya_max": 9500000,
       "satuan": "UKT per semester",
       "catatan": "Batas atas umum universitas",
       "sumber": "Mamikos (Januari 2026)",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Universitas Brawijaya (UB)",
       "kota": "Malang",
       "jenis": "PTN",
       "qs_2026": "680",
       "prodi": [
        "S1 Teknik Informatika",
        "S1 Sistem Informasi"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "UKT prodi belum tersedia di database; cek ub.ac.id",
       "sumber": "QS WUR 2026 via Detik",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "BINUS University",
       "kota": "Jakarta",
       "jenis": "PTS",
       "qs_2026": "851-900",
       "prodi": [
        "S1 Computer Science",
        "S1 Information Systems",
        "S1 Data Science"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "per semester",
       "catatan": "Kampus swasta peringkat teratas; biaya belum tersedia di database",
       "sumber": "QS WUR 2026 via Detik",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Telkom University",
       "kota": "Bandung",
       "jenis": "PTS",
       "qs_2026": "1001-1200",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi",
        "S1 Sains Data"
       ],
       "biaya_min": 12000000,
       "biaya_max": 13500000,
       "satuan": "BPP per semester",
       "catatan": "Ditambah uang pangkal (UP3/SDP2) sekali bayar",
       "sumber": "Telkom University (hive.telkomuniversity.ac.id); Tirto 2025",
       "periode": "2025-2026",
       "di_kota_pengguna": true
      },
      {
       "nama": "Universitas Pendidikan Indonesia (UPI)",
       "kota": "Bandung",
       "jenis": "PTN",
       "qs_2026": "1201-1400",
       "prodi": [
        "S1 Ilmu Komputer"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "UKT prodi belum tersedia di database; cek upi.edu",
       "sumber": "QS WUR 2026 via Detik",
       "periode": "2026",
       "di_kota_pengguna": true
      },
      {
       "nama": "Institut Teknologi Nasional (Itenas)",
       "kota": "Bandung",
       "jenis": "PTS",
       "qs_2026": "1201-1400 (QS 2025)",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi",
        "dan prodi teknik lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "Binus Bandung (QS WUR 2025)",
       "periode": "2025",
       "di_kota_pengguna": true
      },
      {
       "nama": "Universitas Kristen Maranatha",
       "kota": "Bandung",
       "jenis": "PTS",
       "qs_2026": "1401+",
       "prodi": [
        "S1 Teknik Informatika",
        "S1 Sistem Informasi",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": true
      },
      {
       "nama": "Universitas Negeri Malang (UM)",
       "kota": "Malang",
       "jenis": "PTN",
       "qs_2026": "1401+",
       "prodi": [
        "S1 Teknik Informatika",
        "S1 Pendidikan Teknik Informatika",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Universitas Sriwijaya (Unsri)",
       "kota": "Palembang",
       "jenis": "PTN",
       "qs_2026": "1401+",
       "prodi": [
        "S1 Teknik Informatika",
        "S1 Sistem Informasi",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Universitas Islam Indonesia (UII)",
       "kota": "Yogyakarta",
       "jenis": "PTS",
       "qs_2026": "1401+",
       "prodi": [
        "S1 Informatika",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Universitas Kristen Petra",
       "kota": "Surabaya",
       "jenis": "PTS",
       "qs_2026": "1401+",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi Bisnis",
        "S1 Sains Data",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Politeknik Negeri Bandung (Polban)",
       "kota": "Bandung",
       "jenis": "PTN (vokasi)",
       "qs_2026": "-",
       "prodi": [
        "D3/D4 Teknik Informatika",
        "dan prodi vokasi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": true
      },
      {
       "nama": "Universitas Pasundan (Unpas)",
       "kota": "Bandung",
       "jenis": "PTS",
       "qs_2026": "-",
       "prodi": [
        "S1 Teknik Informatika",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": true
      },
      {
       "nama": "Universitas Widyatama",
       "kota": "Bandung",
       "jenis": "PTS",
       "qs_2026": "-",
       "prodi": [
        "S1 Teknik Informatika",
        "S1 Sistem Informasi",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": true
      },
      {
       "nama": "UPN Veteran Jakarta",
       "kota": "Jakarta",
       "jenis": "PTN",
       "qs_2026": "-",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "UPN Veteran Yogyakarta",
       "kota": "Yogyakarta",
       "jenis": "PTN",
       "qs_2026": "-",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "UPN Veteran Jawa Timur",
       "kota": "Surabaya",
       "jenis": "PTN",
       "qs_2026": "-",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi",
        "S1 Sains Data",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Institut Teknologi Sumatera (ITERA)",
       "kota": "Lampung Selatan",
       "jenis": "PTN",
       "qs_2026": "-",
       "prodi": [
        "S1 Teknik Informatika",
        "S1 Sains Data",
        "dan prodi teknik lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Institut Teknologi Kalimantan (ITK)",
       "kota": "Balikpapan",
       "jenis": "PTN",
       "qs_2026": "-",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi",
        "dan prodi teknik lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Politeknik Negeri Jakarta (PNJ)",
       "kota": "Depok",
       "jenis": "PTN (vokasi)",
       "qs_2026": "-",
       "prodi": [
        "D3/D4 Teknik Informatika & Komputer",
        "dan prodi vokasi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Politeknik Elektronika Negeri Surabaya (PENS)",
       "kota": "Surabaya",
       "jenis": "PTN (vokasi)",
       "qs_2026": "-",
       "prodi": [
        "D3/D4 Teknik Informatika",
        "D4 Sains Data Terapan",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Universitas Tarumanagara (Untar)",
       "kota": "Jakarta",
       "jenis": "PTS",
       "qs_2026": "-",
       "prodi": [
        "S1 Teknik Informatika",
        "S1 Sistem Informasi",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Universitas Gunadarma",
       "kota": "Depok",
       "jenis": "PTS",
       "qs_2026": "-",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Universitas Pelita Harapan (UPH)",
       "kota": "Tangerang",
       "jenis": "PTS",
       "qs_2026": "-",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Universitas Multimedia Nusantara (UMN)",
       "kota": "Tangerang",
       "jenis": "PTS",
       "qs_2026": "-",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi",
        "S1 DKV",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "President University",
       "kota": "Bekasi",
       "jenis": "PTS",
       "qs_2026": "-",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      }
     ]
    },
    {
     "id": "sains_data",
     "jurusan": "S1 Sains Data / Statistika",
     "skor_kecocokan": 66,
     "minat_cocok": [
      "matematika",
      "memecahkan masalah"
     ],
     "skill_pendukung": [
      "python"
     ],
     "karier_terkait": [
      "Data Analyst",
      "Data Scientist"
     ],
     "kampus": [
      {
       "nama": "IPB University",
       "kota": "Bogor",
       "jenis": "PTN",
       "qs_2026": "399",
       "prodi": [
        "S1 Ilmu Komputer",
        "S1 Statistika dan Sains Data"
       ],
       "biaya_min": 2400000,
       "biaya_max": 12000000,
       "satuan": "UKT per semester",
       "catatan": "Kisaran umum program sarjana",
       "sumber": "Sevima; Mamikos (Januari 2026)",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Institut Teknologi Sepuluh Nopember (ITS)",
       "kota": "Surabaya",
       "jenis": "PTN",
       "qs_2026": "509",
       "prodi": [
        "S1 Teknik Informatika",
        "S1 Sistem Informasi",
        "S1 Sains Data"
       ],
       "biaya_min": 500000,
       "biaya_max": 7500000,
       "satuan": "UKT per semester",
       "catatan": "Kisaran umum program sarjana; verifikasi di its.ac.id",
       "sumber": "Sevima",
       "periode": "kisaran umum",
       "di_kota_pengguna": false
      },
      {
       "nama": "Universitas Padjadjaran (Unpad)",
       "kota": "Bandung/Jatinangor",
       "jenis": "PTN",
       "qs_2026": "515",
       "prodi": [
        "S1 Teknik Informatika",
        "S1 Statistika"
       ],
       "biaya_min": 500000,
       "biaya_max": 15000000,
       "satuan": "UKT per semester",
       "catatan": "Teknik Informatika termasuk UKT tertinggi di Unpad",
       "sumber": "Mamikos (Kep. Rektor Unpad No. 110/UN6.RKT/Kep/HK/2025)",
       "periode": "2026",
       "di_kota_pengguna": true
      },
      {
       "nama": "BINUS University",
       "kota": "Jakarta",
       "jenis": "PTS",
       "qs_2026": "851-900",
       "prodi": [
        "S1 Computer Science",
        "S1 Information Systems",
        "S1 Data Science"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "per semester",
       "catatan": "Kampus swasta peringkat teratas; biaya belum tersedia di database",
       "sumber": "QS WUR 2026 via Detik",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Telkom University",
       "kota": "Bandung",
       "jenis": "PTS",
       "qs_2026": "1001-1200",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi",
        "S1 Sains Data"
       ],
       "biaya_min": 12000000,
       "biaya_max": 13500000,
       "satuan": "BPP per semester",
       "catatan": "Ditambah uang pangkal (UP3/SDP2) sekali bayar",
       "sumber": "Telkom University (hive.telkomuniversity.ac.id); Tirto 2025",
       "periode": "2025-2026",
       "di_kota_pengguna": true
      },
      {
       "nama": "Universitas Kristen Petra",
       "kota": "Surabaya",
       "jenis": "PTS",
       "qs_2026": "1401+",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi Bisnis",
        "S1 Sains Data",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "UPN Veteran Jawa Timur",
       "kota": "Surabaya",
       "jenis": "PTN",
       "qs_2026": "-",
       "prodi": [
        "S1 Informatika",
        "S1 Sistem Informasi",
        "S1 Sains Data",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Institut Teknologi Sumatera (ITERA)",
       "kota": "Lampung Selatan",
       "jenis": "PTN",
       "qs_2026": "-",
       "prodi": [
        "S1 Teknik Informatika",
        "S1 Sains Data",
        "dan prodi teknik lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Politeknik Elektronika Negeri Surabaya (PENS)",
       "kota": "Surabaya",
       "jenis": "PTN (vokasi)",
       "qs_2026": "-",
       "prodi": [
        "D3/D4 Teknik Informatika",
        "D4 Sains Data Terapan",
        "dan prodi lain"
       ],
       "biaya_min": null,
       "biaya_max": null,
       "satuan": "UKT per semester",
       "catatan": "",
       "sumber": "QS WUR 2026 via Detik/Gebrak",
       "periode": "2026",
       "di_kota_pengguna": false
      },
      {
       "nama": "Universitas Terbuka (UT)",
       "kota": "Daring (seluruh Indonesia)",
       "jenis": "PTN",
       "qs_2026": "-",
       "prodi": [
        "S1 Sistem Informasi",
        "S1 Sains Data"
       ],
       "biaya_min": 1800000,
       "biaya_max": 1900000,
       "satuan": "per semester",
       "catatan": "Alternatif hemat dan fleksibel, bisa sambil bekerja",
       "sumber": "Kompas Edu",
       "periode": "2026",
       "di_kota_pengguna": false
      }
     ]
    },
    {
     "id": "dkv",
     "jurusan": "S1 Desain Komunikasi Visual",
     "skor_kecocokan": 40,
     "minat_cocok": [
      "desain"
     ],
     "skill_pendukung": [
      "canva"
     ],
     "karier_terkait": [
      "UI/UX Designer",
      "Digital Marketing"
     ],
     "kampus": []
    }
   ],
   "mode_pelajar": true,
   "rekomendasi": [
    {
     "id": "data_analyst",
     "profesi": "Data Analyst",
     "bidang": "Teknologi & Data",
     "skor_kecocokan": 75,
     "target_pengguna": false,
     "alasan": [
      "Cocok dengan minatmu: matematika, memecahkan masalah, teknologi.",
      "Kamu sudah punya 1 dari 4 skill wajib.",
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
      "Python (pandas)"
     ],
     "skill_perlu_diperdalam": [],
     "skill_gap_wajib": [
      "SQL",
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
     "perkiraan_persiapan_bulan": 54,
     "rekomendasi_pendidikan": [
      {
       "jurusan": "S1 Sistem Informasi",
       "skill_dibangun": [
        "basis data/SQL",
        "analisis sistem",
        "pemrograman",
        "manajemen proyek TI"
       ],
       "biaya_referensi": [
        {
         "program": "Universitas Terbuka - S1 Sistem Informasi",
         "biaya_min": 1800000,
         "biaya_max": 1800000,
         "satuan": "per semester",
         "sumber": "Kompas.com Edu (2026)"
        },
        {
         "program": "UKT Universitas Indonesia - S1",
         "biaya_min": 500000,
         "biaya_max": 16900000,
         "satuan": "per semester",
         "sumber": "Kontan (rilis UKT UI 2026) (2026)"
        }
       ]
      },
      {
       "jurusan": "S1 Sains Data / Statistika",
       "skill_dibangun": [
        "statistik",
        "Python",
        "SQL",
        "visualisasi data",
        "machine learning dasar"
       ],
       "biaya_referensi": [
        {
         "program": "Universitas Terbuka - S1 Sains Data",
         "biaya_min": 1900000,
         "biaya_max": 1900000,
         "satuan": "per semester",
         "sumber": "Kompas.com Edu (2026)"
        },
        {
         "program": "UKT Universitas Indonesia - S1",
         "biaya_min": 500000,
         "biaya_max": 16900000,
         "satuan": "per semester",
         "sumber": "Kontan (rilis UKT UI 2026) (2026)"
        }
       ]
      },
      {
       "jurusan": "S1 Informatika / Ilmu Komputer",
       "skill_dibangun": [
        "pemrograman",
        "struktur data & algoritma",
        "basis data",
        "rekayasa perangkat lunak"
       ],
       "biaya_referensi": [
        {
         "program": "UKT Universitas Indonesia - S1",
         "biaya_min": 500000,
         "biaya_max": 16900000,
         "satuan": "per semester",
         "sumber": "Kontan (rilis UKT UI 2026) (2026)"
        },
        {
         "program": "Universitas Terbuka - S1 (umum)",
         "biaya_min": 1300000,
         "biaya_max": 1300000,
         "satuan": "per semester",
         "sumber": "Kompas.com Edu; laman admisi UT (2026)"
        }
       ]
      },
      {
       "jurusan": "S1 Matematika / Statistika",
       "skill_dibangun": [
        "statistik & probabilitas",
        "pemodelan matematika",
        "analisis data"
       ],
       "biaya_referensi": [
        {
         "program": "UKT Universitas Indonesia - S1",
         "biaya_min": 500000,
         "biaya_max": 16900000,
         "satuan": "per semester",
         "sumber": "Kontan (rilis UKT UI 2026) (2026)"
        },
        {
         "program": "Universitas Terbuka - S1 (umum)",
         "biaya_min": 1300000,
         "biaya_max": 1300000,
         "satuan": "per semester",
         "sumber": "Kompas.com Edu; laman admisi UT (2026)"
        }
       ]
      },
      {
       "jurusan": "Jalur non-gelar: bootcamp + sertifikasi",
       "skill_dibangun": [
        "skill praktis sesuai program",
        "portofolio proyek"
       ],
       "biaya_referensi": [
        {
         "program": "Bootcamp Data Analyst (umum)",
         "biaya_min": 2000000,
         "biaya_max": 40000000,
         "satuan": "per program",
         "sumber": "tempatbelajar.id (2026)"
        },
        {
         "program": "Sertifikasi BNSP (skema umum)",
         "biaya_min": 800000,
         "biaya_max": 1500000,
         "satuan": "per sertifikasi",
         "sumber": "LSP Ditekindo (2026)"
        }
       ]
      }
     ],
     "portofolio_disarankan": [
      "Dashboard penjualan interaktif (Power BI/Looker Studio)",
      "Analisis data publik (mis. BPS/Kaggle) dengan SQL + Python",
      "Laporan insight bisnis 1 halaman dari dataset nyata"
     ],
     "roadmap_karier": [
      {
       "fase": "Pilih jurusan & persiapan masuk",
       "mulai_bulan": 0,
       "selesai_bulan": 6,
       "fokus": [
        "Pertimbangkan jurusan: S1 Sistem Informasi, S1 Sains Data / Statistika",
        "Bandingkan biaya kuliah dan beasiswa",
        "Mulai portofolio kecil: Dashboard penjualan interaktif (Power BI/Looker Studio)"
       ]
      },
      {
       "fase": "Kuliah tahun 1-2",
       "mulai_bulan": 6,
       "selesai_bulan": 30,
       "fokus": [
        "Kuasai dasar: SQL, visualisasi data (Power BI/Tableau/Looker Studio)",
        "Ikut komunitas/lomba sesuai bidang",
        "Selesaikan portofolio pertama"
       ]
      },
      {
       "fase": "Kuliah tahun 3-4 + magang",
       "mulai_bulan": 30,
       "selesai_bulan": 54,
       "fokus": [
        "Magang di bidang Teknologi & Data",
        "Portofolio lanjutan: Analisis data publik (mis. BPS/Kaggle) dengan SQL + Python; Laporan insight bisnis 1 halaman dari dataset nyata",
        "Siapkan CV dan profil LinkedIn/GitHub"
       ]
      },
      {
       "fase": "Junior Data Analyst",
       "mulai_bulan": 54,
       "selesai_bulan": 78,
       "fokus": [
        "Perkiraan gaji Rp5.000.000 - Rp9.000.000/bulan"
       ],
       "pendapatan": {
        "min": 5000000,
        "max": 9000000
       }
      },
      {
       "fase": "Data Analyst",
       "mulai_bulan": 78,
       "selesai_bulan": 114,
       "fokus": [
        "Perkiraan gaji Rp7.635.417 - Rp14.000.000/bulan"
       ],
       "pendapatan": {
        "min": 7635417,
        "max": 14000000
       }
      },
      {
       "fase": "Senior Data Analyst",
       "mulai_bulan": 114,
       "selesai_bulan": null,
       "fokus": [
        "Perkiraan gaji Rp15.000.000 - Rp28.000.000/bulan"
       ],
       "pendapatan": {
        "min": 15000000,
        "max": 28000000
       }
      }
     ],
     "jadwal_pendapatan_untuk_simulasi": [
      {
       "mulai_bulan": 54,
       "penghasilan": 7000000,
       "keterangan": "perkiraan tahap entry (nilai tengah rentang)"
      },
      {
       "mulai_bulan": 78,
       "penghasilan": 10000000,
       "keterangan": "perkiraan tahap mid (nilai tengah rentang)"
      },
      {
       "mulai_bulan": 114,
       "penghasilan": 21500000,
       "keterangan": "perkiraan tahap senior (nilai tengah rentang)"
      }
     ],
     "simulasi_siap_pakai": {
      "jadwal_pendapatan": [
       {
        "mulai_bulan": 54,
        "penghasilan": 7000000,
        "keterangan": "perkiraan tahap entry (nilai tengah rentang)"
       },
       {
        "mulai_bulan": 78,
        "penghasilan": 10000000,
        "keterangan": "perkiraan tahap mid (nilai tengah rentang)"
       },
       {
        "mulai_bulan": 114,
        "penghasilan": 21500000,
        "keterangan": "perkiraan tahap senior (nilai tengah rentang)"
       }
      ]
     }
    },
    {
     "id": "software_engineer",
     "profesi": "Software Engineer",
     "bidang": "Teknologi",
     "skor_kecocokan": 73,
     "target_pengguna": false,
     "alasan": [
      "Cocok dengan minatmu: matematika, memecahkan masalah, teknologi.",
      "Perlu diperdalam (masih level dasar): satu bahasa pemrograman (JavaScript/Python/Java/Go).",
      "Pengalaman kerjamu bisa jadi nilai tambah, tetapi tetap perlu belajar dasar bidang ini."
     ],
     "deskripsi": "Merancang, membangun, dan memelihara aplikasi web, mobile, atau sistem backend.",
     "jenjang_karier": [
      "Junior",
      "Mid",
      "Senior",
      "Lead/Staff",
      "Engineering Manager/Architect"
     ],
     "pendidikan_umum": "S1 Informatika/Ilmu Komputer atau setara; bootcamp + portofolio juga diterima banyak perusahaan",
     "skill_sudah_dimiliki": [],
     "skill_perlu_diperdalam": [
      "satu bahasa pemrograman (JavaScript/Python/Java/Go)"
     ],
     "skill_gap_wajib": [
      "Git",
      "basis data",
      "dasar web/API"
     ],
     "skill_gap_pendukung": [
      "framework (React, Node.js, dsb.)",
      "testing",
      "cloud & deployment"
     ],
     "jalur_pendapatan": {
      "tahapan": [
       {
        "tahap": "entry",
        "rentang_min": 6000000,
        "rentang_max": 10000000,
        "nilai_tengah": 9000000,
        "perkiraan_tahun_ke": "0-2",
        "sumber": [
         "HRBS Global 2026; NodeFlair via whatisthesalary.com (2026)"
        ]
       },
       {
        "tahap": "senior",
        "rentang_min": 18000000,
        "rentang_max": 35000000,
        "nilai_tengah": 26500000,
        "perkiraan_tahun_ke": "5-seterusnya",
        "sumber": [
         "HRBS Global - Average Salary in Indonesia 2026 (2026)"
        ]
       }
      ]
     },
     "jalur_belajar": {
      "jalur_utama": [],
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
       "min": 0,
       "max": 0
      },
      "catatan": [
       "Jalur utama lewat portofolio dan belajar mandiri; biaya bootcamp spesifik belum ada di database."
      ]
     },
     "perkiraan_persiapan_bulan": 54,
     "rekomendasi_pendidikan": [
      {
       "jurusan": "S1 Sistem Informasi",
       "skill_dibangun": [
        "basis data/SQL",
        "analisis sistem",
        "pemrograman",
        "manajemen proyek TI"
       ],
       "biaya_referensi": [
        {
         "program": "Universitas Terbuka - S1 Sistem Informasi",
         "biaya_min": 1800000,
         "biaya_max": 1800000,
         "satuan": "per semester",
         "sumber": "Kompas.com Edu (2026)"
        },
        {
         "program": "UKT Universitas Indonesia - S1",
         "biaya_min": 500000,
         "biaya_max": 16900000,
         "satuan": "per semester",
         "sumber": "Kontan (rilis UKT UI 2026) (2026)"
        }
       ]
      },
      {
       "jurusan": "S1 Informatika / Ilmu Komputer",
       "skill_dibangun": [
        "pemrograman",
        "struktur data & algoritma",
        "basis data",
        "rekayasa perangkat lunak"
       ],
       "biaya_referensi": [
        {
         "program": "UKT Universitas Indonesia - S1",
         "biaya_min": 500000,
         "biaya_max": 16900000,
         "satuan": "per semester",
         "sumber": "Kontan (rilis UKT UI 2026) (2026)"
        },
        {
         "program": "Universitas Terbuka - S1 (umum)",
         "biaya_min": 1300000,
         "biaya_max": 1300000,
         "satuan": "per semester",
         "sumber": "Kompas.com Edu; laman admisi UT (2026)"
        }
       ]
      },
      {
       "jurusan": "Jalur non-gelar: bootcamp + sertifikasi",
       "skill_dibangun": [
        "skill praktis sesuai program",
        "portofolio proyek"
       ],
       "biaya_referensi": [
        {
         "program": "Bootcamp Data Analyst (umum)",
         "biaya_min": 2000000,
         "biaya_max": 40000000,
         "satuan": "per program",
         "sumber": "tempatbelajar.id (2026)"
        },
        {
         "program": "Sertifikasi BNSP (skema umum)",
         "biaya_min": 800000,
         "biaya_max": 1500000,
         "satuan": "per sertifikasi",
         "sumber": "LSP Ditekindo (2026)"
        }
       ]
      }
     ],
     "portofolio_disarankan": [
      "Aplikasi web lengkap (frontend + backend + database) di GitHub",
      "REST API dengan autentikasi dan testing",
      "Kontribusi ke proyek open-source"
     ],
     "roadmap_karier": [
      {
       "fase": "Pilih jurusan & persiapan masuk",
       "mulai_bulan": 0,
       "selesai_bulan": 6,
       "fokus": [
        "Pertimbangkan jurusan: S1 Sistem Informasi, S1 Informatika / Ilmu Komputer",
        "Bandingkan biaya kuliah dan beasiswa",
        "Mulai portofolio kecil: Aplikasi web lengkap (frontend + backend + database) di GitHub"
       ]
      },
      {
       "fase": "Kuliah tahun 1-2",
       "mulai_bulan": 6,
       "selesai_bulan": 30,
       "fokus": [
        "Kuasai dasar: Git, basis data",
        "Ikut komunitas/lomba sesuai bidang",
        "Selesaikan portofolio pertama"
       ]
      },
      {
       "fase": "Kuliah tahun 3-4 + magang",
       "mulai_bulan": 30,
       "selesai_bulan": 54,
       "fokus": [
        "Magang di bidang Teknologi",
        "Portofolio lanjutan: REST API dengan autentikasi dan testing; Kontribusi ke proyek open-source",
        "Siapkan CV dan profil LinkedIn/GitHub"
       ]
      },
      {
       "fase": "Junior",
       "mulai_bulan": 54,
       "selesai_bulan": 114,
       "fokus": [
        "Perkiraan gaji Rp6.000.000 - Rp10.000.000/bulan"
       ],
       "pendapatan": {
        "min": 6000000,
        "max": 10000000
       }
      },
      {
       "fase": "Senior",
       "mulai_bulan": 114,
       "selesai_bulan": null,
       "fokus": [
        "Perkiraan gaji Rp18.000.000 - Rp35.000.000/bulan"
       ],
       "pendapatan": {
        "min": 18000000,
        "max": 35000000
       }
      }
     ],
     "jadwal_pendapatan_untuk_simulasi": [
      {
       "mulai_bulan": 54,
       "penghasilan": 9000000,
       "keterangan": "perkiraan tahap entry (nilai tengah rentang)"
      },
      {
       "mulai_bulan": 114,
       "penghasilan": 26500000,
       "keterangan": "perkiraan tahap senior (nilai tengah rentang)"
      }
     ],
     "simulasi_siap_pakai": {
      "jadwal_pendapatan": [
       {
        "mulai_bulan": 54,
        "penghasilan": 9000000,
        "keterangan": "perkiraan tahap entry (nilai tengah rentang)"
       },
       {
        "mulai_bulan": 114,
        "penghasilan": 26500000,
        "keterangan": "perkiraan tahap senior (nilai tengah rentang)"
       }
      ]
     }
    },
    {
     "id": "uiux_designer",
     "profesi": "UI/UX Designer",
     "bidang": "Teknologi & Kreatif",
     "skor_kecocokan": 73,
     "target_pengguna": false,
     "alasan": [
      "Cocok dengan minatmu: desain, memecahkan masalah, teknologi.",
      "Kamu sudah punya 1 dari 4 skill wajib.",
      "Sebagian pengalaman kerjamu bisa dipakai sebagai nilai tambah."
     ],
     "deskripsi": "Merancang tampilan dan pengalaman pengguna aplikasi atau situs agar mudah dan nyaman dipakai.",
     "jenjang_karier": [
      "Junior Designer",
      "UI/UX Designer",
      "Senior Designer",
      "Lead/Principal Designer",
      "Head of Design"
     ],
     "pendidikan_umum": "S1 DKV, Desain Produk, Informatika, atau Psikologi; portofolio lebih menentukan daripada ijazah",
     "skill_sudah_dimiliki": [
      "prinsip desain visual",
      "design system"
     ],
     "skill_perlu_diperdalam": [],
     "skill_gap_wajib": [
      "Figma",
      "wireframe & prototyping",
      "riset pengguna dasar"
     ],
     "skill_gap_pendukung": [
      "usability testing",
      "dasar HTML/CSS"
     ],
     "jalur_pendapatan": {
      "tahapan": [
       {
        "tahap": "entry",
        "rentang_min": 5000000,
        "rentang_max": 8000000,
        "nilai_tengah": 6500000,
        "perkiraan_tahun_ke": "0-2",
        "sumber": [
         "bernas.id - Standar Gaji UI/UX Designer 2026 (September 2026)"
        ]
       },
       {
        "tahap": "mid",
        "rentang_min": 8500000,
        "rentang_max": 15000000,
        "nilai_tengah": 11750000,
        "perkiraan_tahun_ke": "2-5",
        "sumber": [
         "bernas.id - Standar Gaji UI/UX Designer 2026 (September 2026)"
        ]
       },
       {
        "tahap": "senior",
        "rentang_min": 16000000,
        "rentang_max": 28000000,
        "nilai_tengah": 22000000,
        "perkiraan_tahun_ke": "5-seterusnya",
        "sumber": [
         "bernas.id - Standar Gaji UI/UX Designer 2026 (September 2026)"
        ]
       }
      ]
     },
     "jalur_belajar": {
      "jalur_utama": [],
      "opsional_jangka_panjang": [
       {
        "program": "Sertifikasi BNSP (skema umum)",
        "jenis": "Sertifikasi kompetensi",
        "biaya_min": 800000,
        "biaya_max": 1500000,
        "satuan": "per sertifikasi",
        "durasi": "bervariasi",
        "sumber": "LSP Ditekindo (2026)"
       }
      ],
      "estimasi_biaya_jalur_utama": {
       "min": 0,
       "max": 0
      },
      "catatan": [
       "Jalur utama lewat pendidikan formal: S1 DKV, Desain Produk, Informatika, atau Psikologi; portofolio lebih menentukan daripada ijazah. Lihat rekomendasi_pendidikan untuk jurusan dan biaya kuliah."
      ]
     },
     "perkiraan_persiapan_bulan": 54,
     "rekomendasi_pendidikan": [
      {
       "jurusan": "S1 Desain Komunikasi Visual",
       "skill_dibangun": [
        "desain visual",
        "tipografi",
        "prototyping",
        "riset pengguna dasar"
       ],
       "biaya_referensi": [
        {
         "program": "UKT Universitas Indonesia - S1",
         "biaya_min": 500000,
         "biaya_max": 16900000,
         "satuan": "per semester",
         "sumber": "Kontan (rilis UKT UI 2026) (2026)"
        },
        {
         "program": "Universitas Terbuka - S1 (umum)",
         "biaya_min": 1300000,
         "biaya_max": 1300000,
         "satuan": "per semester",
         "sumber": "Kompas.com Edu; laman admisi UT (2026)"
        }
       ]
      },
      {
       "jurusan": "Jalur non-gelar: bootcamp + sertifikasi",
       "skill_dibangun": [
        "skill praktis sesuai program",
        "portofolio proyek"
       ],
       "biaya_referensi": [
        {
         "program": "Bootcamp Data Analyst (umum)",
         "biaya_min": 2000000,
         "biaya_max": 40000000,
         "satuan": "per program",
         "sumber": "tempatbelajar.id (2026)"
        },
        {
         "program": "Sertifikasi BNSP (skema umum)",
         "biaya_min": 800000,
         "biaya_max": 1500000,
         "satuan": "per sertifikasi",
         "sumber": "LSP Ditekindo (2026)"
        }
       ]
      }
     ],
     "portofolio_disarankan": [
      "Studi kasus redesign aplikasi lokal (riset → wireframe → prototipe)",
      "Design system mini di Figma",
      "Hasil usability test dengan 5 pengguna"
     ],
     "roadmap_karier": [
      {
       "fase": "Pilih jurusan & persiapan masuk",
       "mulai_bulan": 0,
       "selesai_bulan": 6,
       "fokus": [
        "Pertimbangkan jurusan: S1 Desain Komunikasi Visual",
        "Bandingkan biaya kuliah dan beasiswa",
        "Mulai portofolio kecil: Studi kasus redesign aplikasi lokal (riset → wireframe → prototipe)"
       ]
      },
      {
       "fase": "Kuliah tahun 1-2",
       "mulai_bulan": 6,
       "selesai_bulan": 30,
       "fokus": [
        "Kuasai dasar: Figma, wireframe & prototyping",
        "Ikut komunitas/lomba sesuai bidang",
        "Selesaikan portofolio pertama"
       ]
      },
      {
       "fase": "Kuliah tahun 3-4 + magang",
       "mulai_bulan": 30,
       "selesai_bulan": 54,
       "fokus": [
        "Magang di bidang Teknologi & Kreatif",
        "Portofolio lanjutan: Design system mini di Figma; Hasil usability test dengan 5 pengguna",
        "Siapkan CV dan profil LinkedIn/GitHub"
       ]
      },
      {
       "fase": "Junior Designer",
       "mulai_bulan": 54,
       "selesai_bulan": 78,
       "fokus": [
        "Perkiraan gaji Rp5.000.000 - Rp8.000.000/bulan"
       ],
       "pendapatan": {
        "min": 5000000,
        "max": 8000000
       }
      },
      {
       "fase": "UI/UX Designer",
       "mulai_bulan": 78,
       "selesai_bulan": 114,
       "fokus": [
        "Perkiraan gaji Rp8.500.000 - Rp15.000.000/bulan"
       ],
       "pendapatan": {
        "min": 8500000,
        "max": 15000000
       }
      },
      {
       "fase": "Senior Designer",
       "mulai_bulan": 114,
       "selesai_bulan": null,
       "fokus": [
        "Perkiraan gaji Rp16.000.000 - Rp28.000.000/bulan"
       ],
       "pendapatan": {
        "min": 16000000,
        "max": 28000000
       }
      }
     ],
     "jadwal_pendapatan_untuk_simulasi": [
      {
       "mulai_bulan": 54,
       "penghasilan": 6500000,
       "keterangan": "perkiraan tahap entry (nilai tengah rentang)"
      },
      {
       "mulai_bulan": 78,
       "penghasilan": 11750000,
       "keterangan": "perkiraan tahap mid (nilai tengah rentang)"
      },
      {
       "mulai_bulan": 114,
       "penghasilan": 22000000,
       "keterangan": "perkiraan tahap senior (nilai tengah rentang)"
      }
     ],
     "simulasi_siap_pakai": {
      "jadwal_pendapatan": [
       {
        "mulai_bulan": 54,
        "penghasilan": 6500000,
        "keterangan": "perkiraan tahap entry (nilai tengah rentang)"
       },
       {
        "mulai_bulan": 78,
        "penghasilan": 11750000,
        "keterangan": "perkiraan tahap mid (nilai tengah rentang)"
       },
       {
        "mulai_bulan": 114,
        "penghasilan": 22000000,
        "keterangan": "perkiraan tahap senior (nilai tengah rentang)"
       }
      ]
     }
    }
   ],
   "profesi_lain": [
    {
     "profesi": "Data Scientist",
     "skor_kecocokan": 70
    },
    {
     "profesi": "Data Engineer",
     "skor_kecocokan": 40
    },
    {
     "profesi": "IT Support",
     "skor_kecocokan": 27
    },
    {
     "profesi": "Supply Chain Analyst",
     "skor_kecocokan": 19
    },
    {
     "profesi": "Supervisor Gudang",
     "skor_kecocokan": 16
    },
    {
     "profesi": "Staff PPIC",
     "skor_kecocokan": 16
    },
    {
     "profesi": "Akuntan",
     "skor_kecocokan": 16
    },
    {
     "profesi": "Insinyur Teknik Industri",
     "skor_kecocokan": 16
    },
    {
     "profesi": "Perawat",
     "skor_kecocokan": 12
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
    },
    {
     "profesi": "Dokter Umum",
     "skor_kecocokan": 10
    },
    {
     "profesi": "Dokter Spesialis",
     "skor_kecocokan": 10
    },
    {
     "profesi": "Dokter Hewan",
     "skor_kecocokan": 10
    },
    {
     "profesi": "Apoteker",
     "skor_kecocokan": 10
    },
    {
     "profesi": "Psikolog",
     "skor_kecocokan": 10
    },
    {
     "profesi": "Guru",
     "skor_kecocokan": 10
    },
    {
     "profesi": "TNI (Tentara)",
     "skor_kecocokan": 10
    },
    {
     "profesi": "Polisi",
     "skor_kecocokan": 10
    }
   ],
   "konteks_wilayah": {
    "jenis": "UMK 2026",
    "wilayah": "Kota Bandung",
    "nilai": 4737678
   },
   "catatan_target": null,
   "total_pengalaman_tahun": 1,
   "catatan_metode": [
    "Mode pelajar: skor kecocokan 0-100 = minat (50), skill dan potensi (25), aktivitas relevan (15), kesiapan pendidikan (10).",
    "Jadwal pendapatan menggantikan penghasilan pekerjaan utama saja; pendapatan sampingan dan pasangan tetap dihitung terpisah. Rentang gaji dari database eksternal myCITA beserta sumbernya; jadwal pendapatan memakai nilai tengah rentang dan asumsi umum lama jenjang (entry 0-2 th, mid 2-5 th, senior 5+ th).",
    "Rekomendasi tidak memakai jenis kelamin, usia, agama, atau asal daerah sebagai faktor."
   ],
   "sumber_data": "Database Eksternal myCITA v1.0 (Oktober 2026)",
   "memakai_data_tersimpan": [
    "skill",
    "pengalaman"
   ],
   "disclaimer": "Rekomendasi adalah gambaran awal berdasarkan data yang kamu isi dan data referensi pasar. Keputusan tetap di tanganmu."
  },
  "chat": {}
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
 }
};

// Akses per persona:
//   DEMO.budi.analisis          — hasil flow 4 dasar
//   DEMO.budi.karier            — hasil flow 5
//   DEMO.budi.karier_simulasi   — skenario {sebelum, sesudah} (sesuai skenario.budi AppContext)
//   DEMO.budi.usaha_kopi        — hasil flow 6
//   DEMO.agus.analisis          — hasil flow 4 dasar
//   DEMO.agus.skenario          — objek analisis penuh {dasar, bengkel, kelontong, gabungan, ...}
//                                  (sesuai skenario.agus AppContext live path)
//   DEMO.dini.analisis          — hasil flow 4 dasar
//   DEMO.dini.karier            — hasil flow 5 lengkap (termasuk kampus)
//   DEMO.<id>.chat              — { [pertanyaan]: jawaban } rekaman flow 7
