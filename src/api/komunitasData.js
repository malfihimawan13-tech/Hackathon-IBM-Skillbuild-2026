// Data CONTOH untuk layar Komunitas. Semua akun, grup, dan mentor di bawah ini FIKTIF
// dan hanya untuk demo. Jangan diganti dengan nama atau foto orang sungguhan tanpa persetujuan mereka.

export const JENIS_POST = [
  { value: 'kerja', label: 'Keterima kerja', ikon: 'briefcase' },
  { value: 'kuliah', label: 'Keterima kuliah', ikon: 'book' },
  { value: 'sertifikat', label: 'Lulus sertifikasi', ikon: 'shield' },
  { value: 'belajar', label: 'Capai target belajar', ikon: 'target' },
  { value: 'tujuan', label: 'Tujuan tercapai', ikon: 'flag' },
  { value: 'saran', label: 'Butuh saran', ikon: 'chat' },
];

export const REAKSI = [
  { key: 'selamat', label: 'Selamat 🎉' },
  { key: 'semangat', label: 'Semangat 💪' },
  { key: 'inspirasi', label: 'Terinspirasi ✨' },
];

export const AKUN = {
  salsa: { nama: 'Salsa R.', peran: 'Junior Analis Keuangan · Alumni D3 Akuntansi (akun contoh)', warna: '#1F6F66' },
  rafi: { nama: 'Rafi A.', peran: 'Mahasiswa Informatika · Pengurus komunitas data (akun contoh)', warna: '#9A4610' },
  nadia: { nama: 'Nadia P.', peran: 'Pemilik usaha kopi kecil (akun contoh)', warna: '#0F4C47' },
  bima: { nama: 'Bima S.', peran: 'Teknisi bengkel · Calon pemilik usaha (akun contoh)', warna: '#55625F' },
  tari: { nama: 'Tari W.', peran: 'Siswi SMA kelas 3 · Calon mahasiswa SI (akun contoh)', warna: '#B77410' },
  dewi: { nama: 'Dewi K.', peran: 'Data Scientist · Mentor (akun contoh)', warna: '#5B46B8' },
  hrd: { nama: 'Maya S.', peran: 'HRD Recruiter · Sedang membuka lowongan (akun contoh)', warna: '#B77410' },
  dosen: { nama: 'Dr. Hendra W.', peran: 'Dosen Manajemen Bisnis (akun contoh)', warna: '#5B46B8' },
  guru: { nama: 'Ratna D.', peran: 'Guru SMA · Mentor belajar (akun contoh)', warna: '#1F6F66' },
  pedagang: { nama: 'Sulaiman R.', peran: 'Pedagang sembako · Pemilik warung (akun contoh)', warna: '#9A4610' },
  asesor: { nama: 'Rudi H.', peran: 'Asesor kompetensi di lembaga sertifikasi (akun contoh)', warna: '#0F4C47' },
  lsp: { nama: 'LSP Contoh Teknologi Informasi', peran: 'Lembaga sertifikasi (akun contoh) · 6,4 rb pengikut', kategori: 'Sertifikasi & Pelatihan', pengikut: '6,4 rb', warna: '#B77410', perusahaan: true, verifikasi: 'sertifikasi' },
  logistik: { nama: 'PT Contoh Logistik', peran: 'Perusahaan (akun contoh) · 1,2 rb pengikut', warna: '#1C6BA8', perusahaan: true, verifikasi: true },
};

export const POSTS_AWAL = [
  {
    id: 'p1', menit: 120, kat: 'pekerjaan', penyuka: ['rafi','tari','dewi'], bagikan: 12, pembagi: ['nadia','bima'], akun: 'salsa', waktu: '2 jam',
    teks: 'Alhamdulillah, keterima kerja di BUMN setelah 4 bulan belajar dan latihan wawancara 🎉\n\nYang membantu: roadmap skill dari myCITA dan grup belajar akuntansi tiap malam. Tipsnya: mulai dari satu skill dulu, jangan semuanya sekaligus.',
    reaksi: { suka: 124 }, komentar: [{ akun: 'rafi', teks: 'Wahh selamat Salsa! 🎉' }, { akun: 'tari', teks: 'Keren, boleh tanya tips wawancaranya?' }],
  },
  {
    id: 'p2', menit: 300, kat: 'pekerjaan', topik: ['pekerjaan'], penyuka: ['bima','rafi','tari'], bagikan: 31, pembagi: ['salsa'], akun: 'logistik', waktu: '5 jam',
    teks: '📢 LOWONGAN: Staf Gudang dan Logistik (Bekasi)\n📍 Lokasi: Cibitung, Bekasi\n🎓 Terbuka untuk lulusan SMK dan D3\n🏢 Kami menyediakan pelatihan awal dan jalur karier ke supervisor.\n\nKirim lamaran lewat profil perusahaan kami. (lowongan contoh untuk demo)',
    reaksi: { suka: 164 }, komentar: [{ akun: 'bima', teks: 'Terima kasih infonya!' }],
  },
  {
    id: 'p3', menit: 1440, kat: 'belajar', penyuka: ['salsa','dewi','rafi'], bagikan: 18, pembagi: ['nadia'], akun: 'tari', waktu: 'Kemarin',
    teks: 'Aku keterima di jurusan Sistem Informasi! Perjalanan masih panjang, tapi senang sekali 🥹\n\nTips: mulai cari informasi UKT dan beasiswa sejak kelas 2.',
    reaksi: { suka: 231 }, komentar: [{ akun: 'salsa', teks: 'Selamat ya, sukses terus!' }],
  },
  {
    id: 'p4', menit: 1500, kat: 'pekerjaan', topik: ['belajar'], penyuka: ['rafi','nadia','bima'], bagikan: 54, pembagi: ['salsa','tari'], akun: 'dewi', waktu: '1 hari',
    teks: 'Banyak yang tanya: "Pindah dari pabrik ke data science, mulai dari mana?"\n\n1. Kuasai statistik dasar\n2. Buat 2 proyek kecil dari data yang kamu kenal\n3. Cari teman belajar dan mentor\n\nGaji awal bisa turun sedikit, karena itu hitung dulu rencanamu. Itu fungsinya roadmap. 💡',
    reaksi: { suka: 412 }, komentar: [{ akun: 'rafi', teks: 'Setuju banget soal teman belajar.' }, { akun: 'nadia', teks: 'Terima kasih tipsnya, Kak!' }],
  },
  {
    id: 'p5', menit: 2880, kat: 'bisnis', topik: ['bisnis'], penyuka: ['salsa','dewi','tari'], bagikan: 6, pembagi: ['bima'], akun: 'nadia', waktu: '2 hari',
    teks: 'Target belajar pembukuan sederhana bulan ini tercapai. Sekarang catatan usaha jadi rapi 💪\n\nTips: catat tiap hari, 10 menit saja.',
    reaksi: { suka: 87 }, komentar: [],
  },
  {
    id: 'p6', menit: 4320, kat: 'sertifikasi', penyuka: ['dewi','bima','nadia'], bagikan: 9, pembagi: ['salsa'], akun: 'rafi', waktu: '3 hari',
    teks: 'Lulus sertifikasi dasar data analitik. Terima kasih buat grup belajar yang sabar ngajarin 🙏\n\nCari teman belajar, hasilnya jauh lebih konsisten.',
    reaksi: { suka: 96 }, komentar: [{ akun: 'bima', teks: 'Mantap Rafi!' }],
  },
  {
    id: 'h1', menit: 90, kat: 'pekerjaan', topik: ['pekerjaan'], penyuka: ['rafi','dewi','salsa'], bagikan: 9, pembagi: ['nadia'], akun: 'hrd', waktu: '1 jam',
    teks: '📢 Lowongan: Operator Produksi (shift pagi dan sore), Cikarang.\n🎓 Terbuka untuk lulusan SMK/D3 dan yang mau belajar mesin.\n\nKirim CV lewat profil saya. (lowongan contoh untuk demo)',
    reaksi: { suka: 48 }, komentar: [],
  },
  {
    id: 'h2', menit: 200, kat: 'pekerjaan', topik: ['pekerjaan'], penyuka: ['rafi','dewi','salsa'], bagikan: 11, pembagi: ['nadia'], akun: 'f0', waktu: '3 jam',
    teks: 'Loker hari ini: Admin Gudang, Staf Akuntansi Junior, Teknisi Mesin. Cek syarat tiap lowongan sebelum melamar. (postingan contoh)',
    reaksi: { suka: 72 }, komentar: [],
  },
  {
    id: 'h3', menit: 600, kat: 'bisnis', topik: ['bisnis'], penyuka: ['rafi','dewi','salsa'], bagikan: 22, pembagi: ['nadia'], akun: 'dosen', waktu: '10 jam',
    teks: 'Tiga pertanyaan sebelum membuka usaha:\n1. Siapa pelanggan pertamamu?\n2. Berapa modal minimum agar usaha bisa berjalan?\n3. Apa yang membedakanmu dari penjual lain?\n\nJawab dulu di kertas, baru belanja modal.',
    reaksi: { suka: 134 }, komentar: [],
  },
  {
    id: 'h4', menit: 1000, kat: 'bisnis', topik: ['bisnis'], penyuka: ['rafi','dewi','salsa'], bagikan: 8, pembagi: ['nadia'], akun: 'pedagang', waktu: '17 jam',
    teks: 'Tips dari warung: catat stok masuk dan keluar tiap sore. Barang yang cepat habis perlu stok lebih banyak, yang lambat jangan ditimbun. (postingan contoh)',
    reaksi: { suka: 65 }, komentar: [],
  },
  {
    id: 'h5', menit: 800, kat: 'bisnis', topik: ['bisnis'], penyuka: ['rafi','dewi','salsa'], bagikan: 7, pembagi: ['nadia'], akun: 'l2', waktu: '13 jam',
    teks: 'Materi singkat: pisahkan uang usaha dan uang pribadi sejak hari pertama. Siapkan dua dompet atau dua rekening. (postingan contoh)',
    reaksi: { suka: 58 }, komentar: [],
  },
  {
    id: 'h6', menit: 400, kat: 'belajar', topik: ['belajar'], penyuka: ['rafi','dewi','salsa'], bagikan: 16, pembagi: ['nadia'], akun: 'guru', waktu: '7 jam',
    teks: 'Cara belajar efektif: 25 menit fokus, 5 menit istirahat, ulangi 4 kali. Ulangi materi 1 hari, 3 hari, dan 7 hari kemudian supaya lebih menempel.',
    reaksi: { suka: 91 }, komentar: [],
  },
  {
    id: 'h7', menit: 700, kat: 'belajar', topik: ['belajar'], penyuka: ['rafi','dewi','salsa'], bagikan: 12, pembagi: ['nadia'], akun: 'l1', waktu: '12 jam',
    teks: 'Materi hari ini: SELECT dan WHERE pada SQL. Latihan: tampilkan data pelanggan dari satu kota. (postingan contoh)',
    reaksi: { suka: 77 }, komentar: [],
  },
  {
    id: 'h8', menit: 1200, kat: 'sertifikasi', topik: ['sertifikasi'], penyuka: ['rafi','dewi','salsa'], bagikan: 10, pembagi: ['nadia'], akun: 'lsp', waktu: '20 jam',
    teks: 'Informasi uji kompetensi: pastikan skema sertifikasi sesuai bidang kerjamu, siapkan portofolio, dan daftar lewat lembaga resmi. Jadwal gelombang berikutnya: contoh, bulan depan. (postingan contoh)',
    reaksi: { suka: 54 }, komentar: [],
  },
  {
    id: 'h9', menit: 1800, kat: 'sertifikasi', topik: ['sertifikasi'], penyuka: ['rafi','dewi','salsa'], bagikan: 14, pembagi: ['nadia'], akun: 'asesor', waktu: '1 hari',
    teks: 'Tips persiapan uji kompetensi: kumpulkan bukti pengalaman kerja (foto kegiatan, surat keterangan, laporan). Asesor menilai bukti nyata, bukan hanya teori.',
    reaksi: { suka: 83 }, komentar: [],
  },
  {
    id: 'h10', menit: 2200, kat: 'sertifikasi', topik: ['sertifikasi'], penyuka: ['rafi','dewi','salsa'], bagikan: 13, pembagi: ['nadia'], akun: 'l7', waktu: '1 hari',
    teks: 'Peta jalur sertifikasi pemula IT: mulai dari dasar jaringan atau dasar data, lalu naik ke tingkat berikutnya. Cek syarat tiap sertifikasi di lembaga penyelenggara. (postingan contoh)',
    reaksi: { suka: 69 }, komentar: [],
  },
];

export const GRUP = [
  { id: 'g1', nama: 'Belajar Data Science Pemula', anggota: 128, tag: ['data', 'karier', 'belajar'], jadwal: 'Sabtu pagi, daring' },
  { id: 'g2', nama: 'Pindah Karier dari Pabrik ke Teknologi', anggota: 64, tag: ['data', 'karier', 'pindah'], jadwal: 'Rabu malam, daring' },
  { id: 'g3', nama: 'Komunitas Usaha Bengkel dan Kelontong', anggota: 210, tag: ['usaha', 'keluarga', 'rumah'], jadwal: 'Minggu sore, daring' },
  { id: 'g4', nama: 'Pejuang Rumah Pertama', anggota: 340, tag: ['rumah', 'keuangan', 'menabung'], jadwal: 'Diskusi harian' },
  { id: 'g5', nama: 'Persiapan Jurusan Teknologi (Kelas 12)', anggota: 95, tag: ['pelajar', 'kuliah', 'data'], jadwal: 'Jumat sore, daring' },
  { id: 'g6', nama: 'Beasiswa dan UKT: Tanya Jawab', anggota: 180, tag: ['pelajar', 'kuliah', 'keuangan'], jadwal: 'Diskusi harian' },
];

export const MENTOR = [
  { id: 'm1', inisial: 'DK', nama: 'Dewi K. (contoh)', bidang: 'Data Scientist, pindah dari manufaktur', tag: ['data', 'karier', 'pindah'], tersedia: '2 sesi/bulan' },
  { id: 'm2', inisial: 'HS', nama: 'Hendra S. (contoh)', bidang: 'Pemilik 3 bengkel, pengembangan usaha', tag: ['usaha', 'keluarga'], tersedia: '1 sesi/bulan' },
  { id: 'm3', inisial: 'AP', nama: 'Ayu P. (contoh)', bidang: 'Perencana keuangan keluarga', tag: ['keuangan', 'rumah', 'menabung'], tersedia: '2 sesi/bulan' },
  { id: 'm4', inisial: 'RM', nama: 'Reza M. (contoh)', bidang: 'Alumni Sistem Informasi, kini software engineer', tag: ['pelajar', 'kuliah', 'data'], tersedia: '1 sesi/bulan' },
];

// Minat per persona contoh. Skor kecocokan dihitung kode, bukan ditebak AI.
export const MINAT = {
  budi: ['data', 'karier', 'pindah', 'belajar', 'keuangan'],
  agus: ['usaha', 'keluarga', 'rumah', 'keuangan', 'menabung'],
  dini: ['pelajar', 'kuliah', 'data', 'keuangan'],
};
const MINAT_UMUM = ['karier', 'belajar', 'keuangan'];

const ALASAN = {
  data: 'minat data dan teknologi', karier: 'arah kariermu', pindah: 'rencana pindah karier', belajar: 'target belajarmu',
  usaha: 'usaha yang kamu jalankan', keluarga: 'usaha keluarga', rumah: 'target rumahmu', keuangan: 'tujuan keuanganmu',
  menabung: 'kebiasaan menabung', pelajar: 'statusmu sebagai pelajar', kuliah: 'rencana kuliahmu',
};

export function skorKecocokan(userId, tagItem) {
  const minat = MINAT[userId] || MINAT_UMUM;
  const sama = tagItem.filter((t) => minat.includes(t));
  const skor = Math.min(98, 52 + Math.round((sama.length / Math.max(tagItem.length, 1)) * 38) + sama.length * 3);
  const alasan = sama.length ? `Cocok dengan ${sama.slice(0, 3).map((t) => ALASAN[t] || t).join(', ')}.` : 'Topik umum yang mungkin menarik.';
  return { skor: sama.length ? skor : 50, alasan };
}

export const BERITA = [
  {
    id: 'b1',
    judul: 'Dari D3 Akuntansi ke PLN, lalu lanjut S2 lewat beasiswa perusahaan',
    ringkas: 'Kisah lulusan vokasi yang meniti karier di BUMN dan melanjutkan pendidikan lewat beasiswa kantor. Pesannya: titik awal pendidikan bukan batas akhir.',
    sumber: 'detikJatim', tanggal: '22 Okt 2026',
    url: 'https://www.detik.com/jatim/berita/d-8719170/cerita-gadis-salsabila-lulusan-d3-unair-yang-berkarier-di-pln',
    tag: ['karier', 'kuliah', 'belajar'],
  },
];

export const BELAJAR_GRATIS = {
  judul: 'Belajar gratis bersama IBM SkillsBuild',
  ringkas: 'Cocokkan skill yang masih kurang dengan kursus gratis. Cek daftar kursus terbaru langsung di situs resminya.',
  url: 'https://skillsbuild.org',
};

// Pengunjung profil (angka dan akun contoh).
export const KUNJUNGAN = {
  jumlah: 14,
  daftar: [
    { akun: 'dewi', waktu: '1 jam lalu' }, { akun: 'rafi', waktu: '3 jam lalu' }, { akun: 'salsa', waktu: '5 jam lalu' },
    { akun: 'nadia', waktu: 'Kemarin' }, { akun: 'tari', waktu: 'Kemarin' }, { akun: 'bima', waktu: '2 hari lalu' },
  ],
};

// Urutan saran koneksi menurut jalur tiap persona.
export const SARAN_KONEKSI = {
  budi: ['dewi', 'rafi', 'salsa', 'nadia', 'bima', 'tari'],
  agus: ['nadia', 'bima', 'dewi', 'salsa', 'rafi', 'tari'],
  dini: ['tari', 'rafi', 'dewi', 'salsa', 'nadia', 'bima'],
};

// Tautan berita karier dari media. Ini bukan peringkat "viral" asli; tanggal terbit dicek di sumber.
export const BERITA_TERKINI = [
  { judul: 'Lowongan Freeport Indonesia 2026 dibuka, fresh graduate bisa daftar', sumber: 'RCTI+', url: 'https://www.rctiplus.com/news/detail/gaya-hidup/5464550/lowongan-kerja-freeport-indonesia-2026-dibuka--fresh-graduate-bisa-daftar' },
  { judul: 'BCA buka lowongan Relationship Officer Program, fresh graduate bisa daftar', sumber: 'Kompas TV', url: 'https://www.kompas.tv/ekonomi/671682/bca-buka-lowongan-relationship-officer-program-juni-2026-fresh-graduate-bisa-daftar' },
  { judul: 'Sampoerna buka lowongan Graduate Trainee 2026, mahasiswa tingkat akhir bisa daftar', sumber: 'Kompas TV', url: 'https://www.kompas.tv/ekonomi/669513/sampoerna-buka-lowongan-graduate-trainee-2026-mahasiswa-tingkat-akhir-bisa-daftar' },
];

// Saran untuk Anda (aturan sederhana menurut roadmap/minat persona, bukan hasil AI).
export const SARAN_ANDA = {
  budi: [
    { ikon: 'target', judul: 'Mulai hari ini: 30 menit belajar SQL', sub: 'Langkah awal roadmap Data Scientist', ke: 'roadmap' },
    { ikon: 'check', judul: 'Cek sertifikasi analitik data', sub: 'Sesuai jalur kariermu', ke: 'sertifikasi' },
    { ikon: 'users', judul: 'Gabung grup Belajar Data Science Pemula', sub: 'Belajar bareng tiap Sabtu', ke: 'komunitas', p: { tab: 'grup' } },
  ],
  agus: [
    { ikon: 'wallet', judul: 'Catat pemasukan bengkel hari ini', sub: 'Mulai kebiasaan pembukuan sederhana', ke: 'keuangan' },
    { ikon: 'check', judul: 'Pelajari pembukuan usaha kecil', sub: 'Bidang sertifikasi yang cocok', ke: 'sertifikasi' },
    { ikon: 'target', judul: 'Tinjau target dana darurat', sub: 'Lihat progres tujuanmu', ke: 'tujuan' },
  ],
  dini: [
    { ikon: 'book', judul: 'Jelajahi jurusan sesuai minat', sub: 'Lihat rekomendasi jurusan', ke: 'karirbisnis' },
    { ikon: 'flag', judul: 'Cari info beasiswa dan UKT', sub: 'Mulai dari kelas 3', ke: 'pendidikan' },
    { ikon: 'users', judul: 'Gabung grup belajar yang disetujui sekolah', sub: 'Perlu persetujuan orang tua atau sekolah', ke: 'komunitas', p: { tab: 'grup' } },
  ],
};

// Jumlah awal jaringan (angka contoh) sebelum pengguna menambah koneksi.
export const JARINGAN_AWAL = { budi: { koneksi: 48, mengikuti: 10 }, agus: { koneksi: 31, mengikuti: 6 }, dini: { koneksi: 12, mengikuti: 4 } };

// ---- Daftar akun contoh yang dibuat otomatis (semua fiktif) untuk halaman Koneksi ----
const DEPAN = ['Andi', 'Bayu', 'Citra', 'Dimas', 'Eka', 'Fajar', 'Gita', 'Hana', 'Indra', 'Joko', 'Kiki', 'Lina', 'Maya', 'Nanda', 'Oki', 'Putri', 'Rina', 'Sari', 'Toni', 'Umar', 'Vina', 'Wawan', 'Yuni', 'Zaki'];
const PERAN = ['Operator Produksi', 'Analis Data Junior', 'Staf Gudang', 'Teknisi Mesin', 'Mahasiswa Statistika', 'Pemilik Warung', 'Staf Administrasi', 'Desainer Grafis', 'Siswa SMK', 'Wirausaha Kuliner', 'Staf Akuntansi', 'Calon Mahasiswa'];
const WARNA = ['#1F6F66', '#9A4610', '#5B46B8', '#1C6BA8', '#B77410', '#55625F', '#0F4C47'];
const buatOrang = (prefix, n, off) => Array.from({ length: n }, (_, i) => {
  const j = i + off;
  return { key: `${prefix}${i}`, nama: `${DEPAN[j % DEPAN.length]} ${String.fromCharCode(65 + ((j * 7) % 26))}.`, peran: `${PERAN[j % PERAN.length]} (akun contoh)`, warna: WARNA[j % WARNA.length] };
});
export const ORANG_SARAN = buatOrang('o', 24, 5);
export const koneksiDasar = (uid) => buatOrang('c', (JARINGAN_AWAL[uid] || JARINGAN_AWAL.budi).koneksi, 0);

// Jenis centang: biru = perusahaan, hijau muda = channel pembelajaran, kuning = lembaga/channel sertifikasi. (Simulasi demo.)
const TANPA_CENTANG = ['Peluang Usaha Rumahan', 'Magang Fresh Graduate'];
const tipeChannel = (kat, nama) => (TANPA_CENTANG.includes(nama) ? null : /sertifikasi|pelatihan/i.test(kat) ? 'sertifikasi' : /belajar|kuliah|inggris|pemrograman|kantor|beasiswa|karier|tips/i.test(kat) ? 'belajar' : /lowongan|usaha|keuangan|kerja|industri|manufaktur|desain/i.test(kat) ? 'perusahaan' : null);
export const tipeVerifikasi = (a) => (!a || !a.verifikasi ? null : a.verifikasi === true ? 'perusahaan' : a.verifikasi);
const CHANNEL_MINAT = [
  ['Langkah Karier', 'Pengembangan Karier', '12 rb'], ['Data dari Nol', 'Belajar Data & Analitik', '8,4 rb'], ['Naik Kelas UMKM', 'Usaha UMKM', '15 rb'], ['Peta Beasiswa', 'Beasiswa & Studi Lanjut', '21 rb'],
  ['Siap SNBT Bareng', 'Persiapan Kuliah', '9,7 rb'], ['Buku Kas Warung', 'Keuangan Usaha Kecil', '6,3 rb'], ['English Harian', 'Bahasa Inggris Kerja', '18 rb'], ['Jalur Sertifikasi IT', 'Sertifikasi & Pelatihan', '7,1 rb'],
  ['Dapur Wirausaha', 'Usaha Kuliner', '5,2 rb'], ['Pabrik Cerdas', 'Industri & Manufaktur', '4,8 rb'], ['Uang Keluarga Santai', 'Keuangan Pribadi', '13 rb'], ['Desain Mulai Hari Ini', 'Desain & Kreatif', '10 rb'],
];
export const LEMBAGA_MINAT = CHANNEL_MINAT.map(([nama, kategori, pengikut], i) => ({ key: `l${i}`, nama, kategori, pengikut, peran: kategori, warna: WARNA[(i + 2) % WARNA.length], perusahaan: true, verifikasi: tipeChannel(kategori, nama) }));
const CHANNEL_IKUTI = [
  ['Info Loker Harian', 'Lowongan Kerja', 4, 'hari ini pukul 08.15'], ['Wawancara Tanpa Gugup', 'Tips Karier', 1, 'kemarin'], ['Excel Praktis', 'Keterampilan Kantor', 3, '3 hari lalu'], ['Peluang Usaha Rumahan', 'Usaha UMKM', 2, 'kemarin pukul 16.40'],
  ['Melek Finansial', 'Keuangan Pribadi', 5, 'hari ini pukul 06.40'], ['Magang Fresh Graduate', 'Karier Pemula', 2, 'seminggu lalu'], ['Python untuk Pemula', 'Belajar Pemrograman', 1, '2 hari lalu'], ['Kelas Gratis Pilihan', 'Belajar Mandiri', 3, 'kemarin pukul 19.20'],
  ['Kerja Remote ID', 'Kerja Fleksibel', 6, 'hari ini pukul 10.05'], ['Pelatihan Vokasi', 'Pelatihan & Sertifikasi', 1, '4 hari lalu'],
];
export const mengikutiDasar = (uid) => CHANNEL_IKUTI.slice(0, (JARINGAN_AWAL[uid] || JARINGAN_AWAL.budi).mengikuti).map(([nama, kategori, post, waktu], i) => ({
  key: `f${i}`, nama, kategori, post, waktu, pengikut: `${3 + (i * 7) % 20} rb`, peran: kategori, warna: WARNA[(i + 4) % WARNA.length], perusahaan: true, verifikasi: tipeChannel(kategori, nama),
}));

// Cari akun menurut kunci (akun nyata contoh atau hasil buatan di atas).
const PETA = Object.fromEntries([...ORANG_SARAN, ...LEMBAGA_MINAT].map((a) => [a.key, a]));
const PETA_C = Object.fromEntries(buatOrang('c', 60, 0).map((a) => [a.key, a]));
const PETA_F = Object.fromEntries(mengikutiDasar('budi').map((a) => [a.key, a]));
export const cariAkun = (k) => AKUN[k] || PETA[k] || PETA_C[k] || PETA_F[k] || null;
