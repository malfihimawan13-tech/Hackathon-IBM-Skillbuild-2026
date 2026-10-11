import { toIsoDate } from '../utils/format.js';

// Fungsi murni (tanpa React Native) untuk menyusun JSON yang dikirim ke flow Langflow.
export const EXPENSE_TEMPLATE = [
  { key: 'kebutuhan_pokok', label: 'Kebutuhan pokok', nominal: '' },
  { key: 'makan', label: 'Makan & minum', nominal: '' },
  { key: 'kos_sewa', label: 'Kos / sewa tempat tinggal', nominal: '' },
  { key: 'listrik_air', label: 'Listrik & air', nominal: '' },
  { key: 'internet_pulsa', label: 'Internet & pulsa', nominal: '' },
  { key: 'transportasi', label: 'Transportasi', nominal: '' },
  { key: 'kesehatan', label: 'Kesehatan & asuransi', nominal: '' },
  { key: 'hiburan', label: 'Hiburan & nongkrong', nominal: '' },
  { key: 'langganan', label: 'Langganan (streaming, aplikasi)', nominal: '' },
  { key: 'shopping', label: 'Belanja (fashion, gadget)', nominal: '' },
  { key: 'lainnya', label: 'Lainnya', nominal: '' },
];

export const EMPTY_PROFIL = {
  nama: '', tanggalLahir: '', kota: '', pendidikan: '', status: 'single',
  pasanganNama: '', pasanganPenghasilan: '', jumlahAnak: '', tanggungan: '',
  pekerjaan: [{ nama: '', jenis: 'full_time', penghasilan: '', penghasilanMin: '', lamaBulan: '' }],
  tambahan: [],
};
export const EMPTY_KEUANGAN = { pengeluaran: EXPENSE_TEMPLATE, hutang: [], tabungan: '' };

// Draft contoh persona Budi — dipakai oleh scripts/test-langflow.mjs
// Data tetap (tidak bergantung pada struktur demoData.js)
export function sampleDrafts() {
  const peng = EXPENSE_TEMPLATE.map((e) => ({ ...e }));
  const set = (key, v) => { const it = peng.find((x) => x.key === key); if (it) it.nominal = String(v); };
  set('kebutuhan_pokok', 2000000);
  set('kos_sewa', 1000000);
  set('listrik_air', 300000);
  set('internet_pulsa', 300000);
  set('transportasi', 500000);
  set('hiburan', 500000);
  set('langganan', 150000);
  set('lainnya', 300000);
  return {
    userId: 'budi',
    profil: {
      ...EMPTY_PROFIL,
      nama: 'Budi', tanggalLahir: '12/05/1998', kota: 'Tangerang', pendidikan: 'S1', status: 'single',
      pekerjaan: [
        { nama: 'Operator Produksi', jenis: 'full_time', penghasilan: '9000000', penghasilanMin: '', lamaBulan: '36' },
      ],
    },
    keuangan: {
      pengeluaran: peng,
      hutang: [
        { nama: 'Cicilan motor', jenis: 'kendaraan', cicilan: '800000', sisaPokok: '8000000', bunga: '12', tenor: '10' },
        { nama: 'Paylater', jenis: 'paylater', cicilan: '500000', sisaPokok: '1500000', bunga: '', tenor: '3' },
      ],
      tabungan: '10000000',
    },
    psikologi: { impulsif: 4, fomo: 3, menghindar: 2, emosional: 3, terlalu_hemat: 1, disiplin: 2 },
  };
}

const num = (v) => Number(String(v ?? '').replace(/[^0-9]/g, '')) || 0;

export function buildProfilPayload(userId, d, psikologi) {
  const payload = {
    user_id: userId,
    nama: d.nama.trim(),
    kota: d.kota.trim(),
    pendidikan_terakhir: d.pendidikan,
    status_pernikahan: d.status,
    pekerjaan: d.pekerjaan.filter((j) => j.nama || num(j.penghasilan)).map((j) => {
      const o = { nama: j.nama || 'Pekerjaan', jenis: j.jenis, penghasilan: num(j.penghasilan), lama_kerja_bulan: num(j.lamaBulan) };
      if (j.jenis !== 'full_time' && num(j.penghasilanMin)) o.penghasilan_min = num(j.penghasilanMin);
      return o;
    }),
    pendapatan_tambahan: d.tambahan.filter((t) => num(t.nominal)).map((t) => ({ sumber: t.sumber || 'Tambahan', nominal: num(t.nominal) })),
    jumlah_tanggungan: num(d.tanggungan),
  };
  const iso = toIsoDate(d.tanggalLahir);
  if (iso) payload.tanggal_lahir = iso;
  if (d.status === 'menikah') {
    payload.pasangan = { nama: d.pasanganNama, penghasilan: num(d.pasanganPenghasilan) };
    payload.jumlah_anak = num(d.jumlahAnak);
  }
  if (psikologi && Object.keys(psikologi).length) payload.psikologi = psikologi;
  return payload;
}

export function buildKeuanganPayload(userId, d) {
  const pengeluaran = {};
  d.pengeluaran.forEach((e) => { if (num(e.nominal)) pengeluaran[e.key || e.label] = num(e.nominal); });
  return {
    user_id: userId,
    pengeluaran,
    hutang: d.hutang.filter((h) => num(h.cicilan) || num(h.sisaPokok)).map((h) => {
      const o = { nama: h.nama || 'Hutang', jenis: h.jenis, cicilan_bulanan: num(h.cicilan), sisa_pokok: num(h.sisaPokok), sisa_tenor_bulan: num(h.tenor) };
      if (String(h.bunga).trim() !== '') o.bunga_tahunan = Number(String(h.bunga).replace(',', '.')) || 0;
      return o;
    }),
    tabungan_saat_ini: num(d.tabungan),
  };
}

