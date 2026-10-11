/**
 * Ambil data demo dari Langflow dan tulis ulang src/api/demoData.js.
 *
 * Pakai:
 *   node scripts/ambil-data-demo.mjs <baseUrl> <apiKey>
 *
 * Contoh:
 *   node scripts/ambil-data-demo.mjs http://localhost:7860 LAA...abc
 */

import { writeFileSync } from 'node:fs';
import { callTool, runFlow } from '../src/api/langflow.js';

const [, , baseUrl = 'http://localhost:7860', apiKey = ''] = process.argv;
if (!baseUrl) { console.error('Pakai: node scripts/ambil-data-demo.mjs <baseUrl> <apiKey>'); process.exit(1); }

// Flow 1-4 memakai endpoint _cita bukan _mycita; pakai flow ID langsung.
// Jalankan: GET /api/v1/flows/ untuk mendapatkan ID aktual.
// Jika endpoint_name tidak cocok, set FLOW_IDS env atau gunakan ID di bawah.
// Script akan mencoba endpoint_name standar, lalu fallback ke flow ID jika perlu.
const envFlowIds = process.env.FLOW_IDS ? JSON.parse(process.env.FLOW_IDS) : {};
const settings = { baseUrl, apiKey, flowIds: envFlowIds };
const ok = (m) => console.log(`  ✓ ${m}`);
const section = (m) => console.log(`\n── ${m} ──`);

// ── Helper ──────────────────────────────────────────────────────────────────

async function flow4(payload, label) {
  const r = await callTool(settings, 'analisis', payload);
  ok(`flow4 ${label}`);
  return r;
}

async function flow5(payload, label) {
  const r = await callTool(settings, 'karier', payload);
  ok(`flow5 ${label}`);
  return r;
}

async function flow6(payload, label) {
  const r = await callTool(settings, 'usaha', payload);
  ok(`flow6 ${label}`);
  return r;
}

// Panggil flow 7 (coach) dan kembalikan jawaban teks
async function flow7(userId, pertanyaan, label) {
  const r = await runFlow(settings, 'coach', `user_id: ${userId}\npertanyaan: ${pertanyaan}`, {
    timeout: 120000,
    sessionId: `cita-${userId}`,
  });
  ok(`flow7 ${label}`);
  return r;
}

// Rekam jawaban flow 7 untuk semua pertanyaan contoh persona.
// Mengembalikan objek { [pertanyaan]: jawaban }
async function rekamChatPersona(userId, pertanyaanList) {
  const hasil = {};
  for (const q of pertanyaanList) {
    hasil[q] = await flow7(userId, q, `${userId}: "${q.slice(0, 40)}…"`);
  }
  return hasil;
}

// ── BUDI ────────────────────────────────────────────────────────────────────
section('BUDI');

const budi_analisis = await flow4({ user_id: 'budi' }, 'dasar budi');

// flow 5: karier budi dengan target_profesi Data Scientist
const budi_karier = await flow5({
  user_id: 'budi',
  target_profesi: 'Data Scientist',
}, 'karier budi (target: Data Scientist)');

// Cari simulasi_siap_pakai untuk Data Scientist dan Data Analyst dari hasil flow 5
const budi_ds = budi_karier.rekomendasi?.find((r) => r.id === 'data_scientist');
const budi_da = budi_karier.rekomendasi?.find((r) => r.id === 'data_analyst');
if (!budi_ds) { console.warn('  ⚠ Data Scientist tidak ditemukan di hasil flow 5'); }
if (!budi_da) { console.warn('  ⚠ Data Analyst tidak ditemukan di hasil flow 5'); }

// flow 4: simulasi Data Scientist
const budi_sim_ds = budi_ds
  ? await flow4({ user_id: 'budi', simulasi: budi_ds.simulasi_siap_pakai }, 'simulasi Data Scientist')
  : null;

// flow 4: simulasi Data Analyst
const budi_sim_da = budi_da
  ? await flow4({ user_id: 'budi', simulasi: budi_da.simulasi_siap_pakai }, 'simulasi Data Analyst')
  : null;

// flow 6: usaha kopi sampingan
const budi_usaha_kopi = await flow6({
  user_id: 'budi',
  minat: ['kopi', 'minuman', 'kuliner'],
  skill: ['meracik kopi', 'pelayanan pelanggan'],
  modal_tersedia: 3000000,
  waktu: 'sampingan',
}, 'usaha kopi budi');

// Cari skenario pesimis kopi dari rekomendasi flow 6
const kopi_rec = budi_usaha_kopi.rekomendasi?.[0]; // rekomendasi pertama (kopi keliling)
const kopi_pesimis_sim = kopi_rec?.simulasi_siap_pakai
  ? (() => {
      // simulasi_siap_pakai dari flow 6 memakai skenario moderat; buat versi pesimis dari skenario.pesimis
      const labaPesimis = kopi_rec.skenario?.pesimis?.laba_bulanan_stabil;
      if (!labaPesimis) return kopi_rec.simulasi_siap_pakai;
      // Bangun jadwal pesimis: ramp-up 30% bulan 0, mencapai stabil di bulan 5
      const stable = labaPesimis;
      return {
        ...kopi_rec.simulasi_siap_pakai,
        pendapatan_tambahan_jadwal: [
          { mulai_bulan: 0, nilai: Math.round(stable * 0.30) },
          { mulai_bulan: 1, nilai: Math.round(stable * 0.44) },
          { mulai_bulan: 2, nilai: Math.round(stable * 0.58) },
          { mulai_bulan: 3, nilai: Math.round(stable * 0.72) },
          { mulai_bulan: 4, nilai: Math.round(stable * 0.86) },
          { mulai_bulan: 5, nilai: Math.round(stable * 1.00) },
        ],
      };
    })()
  : null;

// flow 4: simulasi kopi pesimis
const budi_sim_kopi_pesimis = kopi_pesimis_sim
  ? await flow4({ user_id: 'budi', simulasi: kopi_pesimis_sim }, 'simulasi kopi pesimis')
  : null;

// Gabungkan Data Scientist + kopi: jadwal gabungan = jadwal_pendapatan DS + pendapatan_tambahan_jadwal kopi
function gabungSimulasi(ds_sim, kopi_sim) {
  if (!ds_sim || !kopi_sim) return null;
  return {
    jadwal_pendapatan: ds_sim.jadwal_pendapatan,
    pendapatan_tambahan_jadwal: kopi_sim.pendapatan_tambahan_jadwal,
    biaya_awal: kopi_sim.biaya_awal,
  };
}

const budi_gabungan_pesimis_sim = gabungSimulasi(budi_ds?.simulasi_siap_pakai, kopi_pesimis_sim);
const budi_gabungan_moderat_sim = gabungSimulasi(
  budi_ds?.simulasi_siap_pakai,
  kopi_rec?.simulasi_siap_pakai,
);

// flow 4: simulasi gabungan DS + kopi (pesimis)
const budi_sim_gabungan_pesimis = budi_gabungan_pesimis_sim
  ? await flow4({ user_id: 'budi', simulasi: budi_gabungan_pesimis_sim }, 'simulasi DS+kopi pesimis')
  : null;

// flow 4: simulasi gabungan DS + kopi (moderat)
const budi_sim_gabungan_moderat = budi_gabungan_moderat_sim
  ? await flow4({ user_id: 'budi', simulasi: budi_gabungan_moderat_sim }, 'simulasi DS+kopi moderat')
  : null;

// ── AGUS ────────────────────────────────────────────────────────────────────
section('AGUS');

const agus_analisis = await flow4({ user_id: 'agus' }, 'dasar agus');

// Simulasi pengembangan usaha agus: bengkel +20%, kelontong +25%, gabungan
// Ambil data pendapatan agus dari analisis
// flow 4 dengan simulasi pengembangan bengkel +20%: tambahan pendapatan dari bengkel
// omzet bengkel 11.000.000 × 20% × margin bengkel
const BENGKEL_OMZET = 11000000;
const BENGKEL_MARGIN_PCT = 20; // margin bersih bengkel
const KELONTONG_OMZET = 3000000; // +25% omzet tambahan sebagaimana diminta
const KELONTONG_MARGIN_PCT = 25;

const bengkelPlusLaba = Math.round(BENGKEL_OMZET * 0.20 * (BENGKEL_MARGIN_PCT / 100));
const kelontongPlusLaba = Math.round(KELONTONG_OMZET * 0.25 * (KELONTONG_MARGIN_PCT / 100));

const agus_sim_bengkel = {
  pendapatan_tambahan_jadwal: [{ mulai_bulan: 0, nilai: bengkelPlusLaba }],
};

const agus_sim_kelontong = {
  pendapatan_tambahan_jadwal: [{ mulai_bulan: 0, nilai: kelontongPlusLaba }],
};

const agus_sim_gabungan = {
  pendapatan_tambahan_jadwal: [{ mulai_bulan: 0, nilai: bengkelPlusLaba + kelontongPlusLaba }],
};

const agus_sim_bengkel_r = await flow4({ user_id: 'agus', simulasi: agus_sim_bengkel }, 'simulasi bengkel +20%');
const agus_sim_kelontong_r = await flow4({ user_id: 'agus', simulasi: agus_sim_kelontong }, 'simulasi kelontong +25%');
const agus_sim_gabungan_r = await flow4({ user_id: 'agus', simulasi: agus_sim_gabungan }, 'simulasi bengkel+kelontong gabungan');

// Cari harga maksimal terjangkau sesuai tenggat dari hasil gabungan
// untuk target rumah agus
const agusTargetRumah = agus_sim_gabungan_r.target?.find((t) => t.kategori === 'rumah' || t.kategori === 'rumah_subsidi' || t.nama?.toLowerCase().includes('rumah'));
const agusHargaMaxSesuaiTenggat = agusTargetRumah?.alternatif?.harga_maksimal_terjangkau_sesuai_tenggat;
ok(`agus rumah harga_maksimal_terjangkau_sesuai_tenggat: ${agusHargaMaxSesuaiTenggat}`);

// flow 4 dengan target sesuai harga_maksimal_terjangkau_sesuai_tenggat hasil gabungan
// Ini adalah simulasi with asumsi berbeda, bukan menambah target baru — pakai asumsi harga baru
const agusRumahHarga = agusHargaMaxSesuaiTenggat || agusTargetRumah?.harga_saat_ini || 185000000;
const agus_sim_rumah_sesuai = await flow4(
  { user_id: 'agus', simulasi: agus_sim_gabungan, asumsi: { harga_rumah_override: agusRumahHarga } },
  `simulasi gabungan + rumah Rp${agusRumahHarga}`,
);

// ── DINI ────────────────────────────────────────────────────────────────────
section('DINI');

const dini_analisis = await flow4({ user_id: 'dini' }, 'dasar dini');

// flow 5: karier dini (pelajar)
const dini_karier = await flow5({
  user_id: 'dini',
  status: 'pelajar',
}, 'karier dini (pelajar)');

// ── FLOW 7 — Rekam jawaban coach per persona ─────────────────────────────────
section('FLOW 7 — rekam jawaban coach');

// Pertanyaan contoh harus sesuai dengan persona.pertanyaanChat di src/state/persona.js
const budi_chat = await rekamChatPersona('budi', [
  'Aku mau pindah ke data science, tapi takut gaji awal turun. Aku juga mau menikah 3 tahun lagi dan beli mobil. Gimana aturnya?',
  'Kalau aku juga buka usaha kopi sampingan di akhir pekan dengan modal 3 juta, apa dampaknya?',
  'Portofolio apa dulu?',
]);

const agus_chat = await rekamChatPersona('agus', [
  'Kami mau punya rumah Rp600 juta dalam 7 tahun. Bengkel dan kelontong istri sebaiknya diapakan?',
  'Kalau omzet bengkel naik 30%?',
]);

const dini_chat = await rekamChatPersona('dini', [
  'Aku sebentar lagi lulus SMA. Suka teknologi tapi bingung pilih jurusan dan kampus. Harus mulai dari mana?',
  'Berapa biaya kuliah di ITB atau Telkom University, dan ada beasiswa apa yang bisa aku coba?',
]);

// ── Tulis demoData.js ────────────────────────────────────────────────────────
section('Menulis src/api/demoData.js');

const data = {
  budi: {
    analisis: budi_analisis,
    simulasi_gaji: null, // dihitung saat runtime oleh AppContext.whatIf
    karier: budi_karier,
    karier_simulasi: {
      // skenario individual — kunci = id profesi atau usaha
      ...(budi_ds && budi_sim_ds ? { data_scientist: budi_sim_ds.perbandingan } : {}),
      ...(budi_da && budi_sim_da ? { data_analyst: budi_sim_da.perbandingan } : {}),
      ...(budi_sim_kopi_pesimis ? { kopi_pesimis: budi_sim_kopi_pesimis.perbandingan } : {}),
      ...(budi_sim_gabungan_pesimis ? { data_scientist_kopi_pesimis: budi_sim_gabungan_pesimis.perbandingan } : {}),
      ...(budi_sim_gabungan_moderat ? { data_scientist_kopi_moderat: budi_sim_gabungan_moderat.perbandingan } : {}),
    },
    usaha_kopi: budi_usaha_kopi,
    usaha_simulasi: {
      // kopi pesimis dipakai oleh Usaha screen untuk ScenarioBar
      ...(budi_sim_kopi_pesimis ? { kopi_keliling: budi_sim_kopi_pesimis.perbandingan } : {}),
      ...(budi_sim_ds ? { data_scientist: budi_sim_ds.perbandingan } : {}),
      ...(budi_sim_gabungan_pesimis ? { data_scientist_kopi_pesimis: budi_sim_gabungan_pesimis.perbandingan } : {}),
      ...(budi_sim_gabungan_moderat ? { data_scientist_kopi_moderat: budi_sim_gabungan_moderat.perbandingan } : {}),
    },
    // Jawaban rekaman flow 7 untuk pertanyaan contoh — { [pertanyaan]: jawaban }
    chat: budi_chat,
  },
  agus: {
    analisis: agus_analisis,
    simulasi: {
      bengkel_plus20: agus_sim_bengkel_r.perbandingan,
      kelontong_plus25: agus_sim_kelontong_r.perbandingan,
      gabungan: agus_sim_gabungan_r.perbandingan,
      gabungan_rumah_terjangkau: agus_sim_rumah_sesuai.perbandingan,
    },
    // Jawaban rekaman flow 7 untuk pertanyaan contoh
    chat: agus_chat,
  },
  dini: {
    analisis: dini_analisis,
    karier: dini_karier,
    // Jawaban rekaman flow 7 untuk pertanyaan contoh
    chat: dini_chat,
  },
};

// Pertahankan data harga dan karier_input budi dari file lama (statis, tidak perlu re-fetch)
// Baca file lama untuk mengambil harga dan data statis
let oldHarga = {};
let oldKarierInput = {};
try {
  const { DEMO: OLD } = await import('../src/api/demoData.js');
  oldHarga = OLD.harga || {};
  oldKarierInput = OLD.karier_input || {};
} catch (_) { /* file baru tidak perlu data lama */ }

// Kunci waktu untuk laporan — gunakan nama target dinamis
function cariWaktuTercapai(analisis, kata) {
  const t = (analisis?.target || []).find((x) =>
    !kata || x.nama?.toLowerCase().includes(kata.toLowerCase()),
  ) || (analisis?.target || [])[0];
  return t?.opsi_a_menabung?.waktu_tercapai || '-';
}
function cariWaktuPerbandingan(perbObj, namaKey) {
  if (!perbObj?.sesudah?.target) return '-';
  if (namaKey) {
    // coba exact match dulu, lalu partial
    const exact = perbObj.sesudah.target[namaKey];
    if (exact != null) return exact;
    const partialKey = Object.keys(perbObj.sesudah.target).find((k) => k.toLowerCase().includes(namaKey.toLowerCase()));
    if (partialKey) return perbObj.sesudah.target[partialKey];
  }
  // ambil nilai pertama
  return Object.values(perbObj.sesudah.target)[0] || '-';
}

// Cari nama target mobil budi dan rumah agus dari hasil analisis
const budiMobilNama = (budi_analisis.target || []).find((t) =>
  t.kategori === 'mobil' || t.nama?.toLowerCase().includes('mobil'),
)?.nama || 'Mobil';
const agusRumahNama = (agus_analisis.target || []).find((t) =>
  t.kategori === 'rumah' || t.kategori === 'rumah_subsidi' || t.nama?.toLowerCase().includes('rumah'),
)?.nama || agus_analisis.target?.[0]?.nama || 'Rumah';

const laporan = {
  skor: {
    budi: budi_analisis.dashboard?.skor_kesehatan,
    agus: agus_analisis.dashboard?.skor_kesehatan,
    dini: dini_analisis.dashboard?.skor_kesehatan ?? 'N/A (pelajar)',
  },
  mobil_budi: {
    baseline: cariWaktuTercapai(budi_analisis, budiMobilNama),
    kopi_pesimis: cariWaktuPerbandingan(data.budi.usaha_simulasi?.kopi_keliling, budiMobilNama),
    data_scientist: cariWaktuPerbandingan(data.budi.karier_simulasi?.data_scientist, budiMobilNama),
    ds_kopi_pesimis: cariWaktuPerbandingan(data.budi.karier_simulasi?.data_scientist_kopi_pesimis, budiMobilNama),
    ds_kopi_moderat: cariWaktuPerbandingan(data.budi.karier_simulasi?.data_scientist_kopi_moderat, budiMobilNama),
  },
  rumah_agus: {
    baseline: cariWaktuTercapai(agus_analisis, agusRumahNama),
    bengkel_plus20: cariWaktuPerbandingan(data.agus.simulasi?.bengkel_plus20, agusRumahNama),
    kelontong_plus25: cariWaktuPerbandingan(data.agus.simulasi?.kelontong_plus25, agusRumahNama),
    gabungan: cariWaktuPerbandingan(data.agus.simulasi?.gabungan, agusRumahNama),
  },
};

console.log('\n══════════════════════════════════════════');
console.log('LAPORAN ANGKA KUNCI');
console.log('══════════════════════════════════════════');
console.log(`Skor kesehatan:`);
console.log(`  Budi : ${laporan.skor.budi}`);
console.log(`  Agus : ${laporan.skor.agus}`);
console.log(`  Dini : ${laporan.skor.dini}`);
console.log(`\nWaktu tercapai mobil Budi (${budiMobilNama}):`);
console.log(`  Baseline (tanpa perubahan) : ${laporan.mobil_budi.baseline}`);
console.log(`  Kopi pesimis saja          : ${laporan.mobil_budi.kopi_pesimis}`);
console.log(`  Data Scientist saja        : ${laporan.mobil_budi.data_scientist}`);
console.log(`  DS + kopi (pesimis)        : ${laporan.mobil_budi.ds_kopi_pesimis}`);
console.log(`  DS + kopi (moderat)        : ${laporan.mobil_budi.ds_kopi_moderat}`);
console.log(`\nWaktu tercapai rumah Agus (${agusRumahNama || 'target rumah'}):`);
console.log(`  Baseline (tanpa perubahan) : ${laporan.rumah_agus.baseline}`);
console.log(`  Bengkel +20%               : ${laporan.rumah_agus.bengkel_plus20}`);
console.log(`  Kelontong +25%             : ${laporan.rumah_agus.kelontong_plus25}`);
console.log(`  Bengkel + Kelontong        : ${laporan.rumah_agus.gabungan}`);
console.log('══════════════════════════════════════════\n');

// Tulis file
const fileContent = `// Data demo dihasilkan otomatis oleh scripts/ambil-data-demo.mjs dari Langflow.
// JANGAN DIEDIT MANUAL. Jalankan kembali skrip untuk memperbarui.
// Dihasilkan: ${new Date().toISOString()}

export const DEMO = ${JSON.stringify({ ...data, harga: oldHarga }, null, 1)};

// Akses per persona: DEMO.budi.analisis, DEMO.agus.analisis, DEMO.dini.analisis
// Karier simulasi Budi: DEMO.budi.karier_simulasi.<id>  (perbandingan sebelum/sesudah)
// Usaha simulasi Agus : DEMO.agus.simulasi.<key>        (perbandingan sebelum/sesudah)
// Jawaban coach demo : DEMO.<id>.chat[pertanyaan]        (string jawaban flow 7)
`;

writeFileSync(new URL('../src/api/demoData.js', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'), fileContent, 'utf8');
ok('src/api/demoData.js berhasil ditulis ulang');

console.log('Selesai.');
