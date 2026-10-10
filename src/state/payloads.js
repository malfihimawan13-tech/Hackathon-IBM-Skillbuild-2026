import { DEMO } from '../api/demoData.js';
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

// Draft contoh persona Budi (sama dengan contoh_input di backend)
export function sampleDrafts() {
  const p = DEMO.profil_input;
  const k = DEMO.keuangan_input;
  const peng = EXPENSE_TEMPLATE.map((e) => ({ ...e }));
  const set = (key, v) => { const it = peng.find((x) => x.key === key); if (it) it.nominal = String(v); };
  set('kebutuhan_pokok', k.pengeluaran.kebutuhan_pokok);
  set('kos_sewa', k.pengeluaran.kos);
  set('listrik_air', k.pengeluaran.listrik);
  set('internet_pulsa', k.pengeluaran.internet);
  set('transportasi', k.pengeluaran.transportasi);
  set('hiburan', k.pengeluaran.hiburan);
  set('langganan', k.pengeluaran.langganan_streaming);
  set('lainnya', k.pengeluaran.lainnya);
  return {
    userId: p.user_id,
    profil: {
      ...EMPTY_PROFIL,
      nama: 'Budi', tanggalLahir: '12/05/1998', kota: p.kota, pendidikan: p.pendidikan_terakhir, status: 'single',
      pekerjaan: p.pekerjaan.map((j) => ({
        nama: j.nama, jenis: j.jenis, penghasilan: String(j.penghasilan),
        penghasilanMin: j.penghasilan_min ? String(j.penghasilan_min) : '', lamaBulan: String(j.lama_kerja_bulan || ''),
      })),
    },
    keuangan: {
      pengeluaran: peng,
      hutang: k.hutang.map((h) => ({
        nama: h.nama, jenis: h.jenis, cicilan: String(h.cicilan_bulanan), sisaPokok: String(h.sisa_pokok),
        bunga: h.bunga_tahunan != null ? String(h.bunga_tahunan) : '', tenor: String(h.sisa_tenor_bulan || ''),
      })),
      tabungan: String(k.tabungan_saat_ini),
    },
    psikologi: { ...p.psikologi },
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

