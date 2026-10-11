// Tiga persona contoh myCITA. Data sudah tersimpan di database Langflow.
// Data isian (bukan hasil hitung) yang tidak disimpan Langflow ada di sini.
export const PERSONAS = [
  {
    userId: 'budi',
    nama: 'Budi',
    inisial: 'B',
    usia: '29 th',
    kota: 'Tangerang',
    deskripsi: 'Career switch + usaha sampingan',
    subJudul: 'Operator produksi → Data Scientist',
    avatarBg: '#E3EFEC',
    avatarColor: '#0F4C47',
    // Data profil — dikirim ke flow 1, tidak dikembalikan Langflow
    profil: {
      pendidikan_terakhir: 'S1 Teknik Informatika',
      status_pernikahan: 'single',
      pekerjaan: [
        { nama: 'Operator Produksi', jenis: 'full_time', penghasilan: 7500000, lama_kerja_bulan: 120 },
      ],
    },
    // Data keuangan — dikirim ke flow 2, tidak dikembalikan Langflow
    keuangan: {
      pengeluaran: [
        { label: 'Makan', nominal: 1500000 },
        { label: 'Kos', nominal: 1200000 },
        { label: 'Transportasi', nominal: 600000 },
        { label: 'Internet', nominal: 300000 },
        { label: 'Listrik', nominal: 200000 },
        { label: 'Kebutuhan pribadi', nominal: 500000 },
        { label: 'Hiburan', nominal: 300000 },
        { label: 'Orang tua', nominal: 500000 },
        { label: 'Lainnya', nominal: 400000 },
      ],
      tabungan_saat_ini: 35000000,
    },
    // Level skill (diisi pengguna, bukan hasil hitung Langflow)
    // Level: 'Mahir' = 3, 'Menengah' = 2, 'Dasar' = 1
    skills: [
      { nama: 'Excel', level: 'Mahir', skor: 3 },
      { nama: 'Python', level: 'Menengah', skor: 2 },
      { nama: 'SQL', level: 'Menengah', skor: 2 },
      { nama: 'Pandas', level: 'Menengah', skor: 2 },
      { nama: 'Data visualization', level: 'Menengah', skor: 2 },
      { nama: 'Machine learning', level: 'Dasar', skor: 1 },
      { nama: 'Statistics', level: 'Dasar', skor: 1 },
      { nama: 'AI', level: 'Dasar', skor: 1 },
    ],
    // Input untuk flow 6_eksplorasi_usaha_mycita (kopi keliling, sampingan)
    usahaInput: {
      user_id: 'budi',
      minat: ['kopi', 'minuman', 'kuliner'],
      skill: ['pelayanan pelanggan', 'komunikasi'],
      pengalaman: [],
      modal_tersedia: 3000000,
      waktu: 'sampingan',
    },
  },
  {
    userId: 'agus',
    nama: 'Agus',
    inisial: 'A',
    usia: '38 th',
    kota: 'Bekasi',
    deskripsi: 'Usaha keluarga + rumah',
    subJudul: 'Bengkel motor + kelontong istri · Bekasi',
    avatarBg: '#FDF1DC',
    avatarColor: '#9A4610',
    // Data profil — dikirim ke flow 1, tidak dikembalikan Langflow
    profil: {
      status_pernikahan: 'menikah',
      jumlah_anak: 2,
      pekerjaan: [
        { nama: 'Pemilik bengkel motor', jenis: 'usaha', penghasilan: 11000000, penghasilan_min: 11000000, lama_kerja_bulan: 120 },
      ],
      pasangan: { nama: 'Istri (usaha kelontong)', penghasilan: 3000000 },
    },
    // Data keuangan — dikirim ke flow 2, tidak dikembalikan Langflow
    keuangan: {
      pengeluaran: [
        { label: 'Makan', nominal: 3000000 },
        { label: 'Listrik', nominal: 500000 },
        { label: 'Air', nominal: 200000 },
        { label: 'Internet', nominal: 350000 },
        { label: 'Transportasi', nominal: 1000000 },
        { label: 'Pendidikan anak', nominal: 1500000 },
        { label: 'Kesehatan', nominal: 500000 },
        { label: 'Kebutuhan rumah', nominal: 700000 },
        { label: 'Hiburan', nominal: 300000 },
        { label: 'Lainnya', nominal: 450000 },
      ],
      tabungan_saat_ini: 45000000,
    },
    // Data usaha (input, bukan hasil hitung Langflow)
    usaha: [
      {
        nama: 'Bengkel Agus',
        icon: 'briefcase',
        iconColor: '#0F4C47',
        omzet: 18000000,
        biaya: 7000000,
        barColor: '#0F4C47',
      },
      {
        nama: 'Kelontong istri',
        icon: 'store',
        iconColor: '#9A4610',
        omzet: 8000000,
        biaya: 5000000,
        barColor: '#F2A93B',
      },
    ],
  },
  {
    userId: 'dini',
    nama: 'Dini',
    inisial: 'D',
    usia: '17 th',
    kota: 'Bandung',
    deskripsi: 'Career discovery (pelajar)',
    subJudul: 'Siswa SMA kelas 3 · Bandung · mode pelajar',
    avatarBg: '#E3EFEC',
    avatarColor: '#1F6F66',
    // Data profil — dikirim ke flow 1, tidak dikembalikan Langflow
    profil: {
      pendidikan_terakhir: 'SMA kelas 3',
      status_pernikahan: 'single',
      pekerjaan: [],
      pendapatan_tambahan: [{ sumber: 'Uang saku', nominal: 1500000 }],
    },
    // Data keuangan — dikirim ke flow 2, tidak dikembalikan Langflow
    keuangan: {
      pengeluaran: [
        { label: 'Makan & jajan', nominal: 500000 },
        { label: 'Transportasi', nominal: 250000 },
        { label: 'Internet & pulsa', nominal: 150000 },
        { label: 'Hiburan', nominal: 200000 },
        { label: 'Pendidikan & kursus', nominal: 200000 },
        { label: 'Lainnya', nominal: 50000 },
      ],
      tabungan_saat_ini: 2500000,
      tabungan_rutin_bulanan: 150000,
    },
    // Data kemampuan (input, bukan hasil hitung Langflow)
    skills: [
      { nama: 'Microsoft Office', level: 'Menengah', skor: 2 },
      { nama: 'Canva', level: 'Menengah', skor: 2 },
      { nama: 'Bahasa Inggris', level: 'Menengah', skor: 2 },
      { nama: 'Basic Python', level: 'Dasar', skor: 1 },
      { nama: 'Public speaking', level: 'Cukup', skor: 1 },
    ],
    minat: ['Teknologi', 'Matematika', 'Desain', 'Memecahkan masalah'],
    // Input untuk flow 5_eksplorasi_karier_mycita
    karierInput: {
      user_id: 'dini',
      minat: ['Teknologi', 'Matematika', 'Desain', 'Memecahkan masalah'],
      skill: ['Microsoft Office', 'Canva', 'Bahasa Inggris', 'Python dasar'],
      pengalaman: ['Ekstrakurikuler coding', 'Membuat website sederhana', 'Lomba teknologi'],
      pendidikan_terakhir: 'SMA',
      kota: 'Bandung',
      status: 'pelajar',
    },
  },
];

// Cari persona berdasarkan userId
export function findPersona(userId) {
  return PERSONAS.find((p) => p.userId === userId) || null;
}
