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

const settings = { baseUrl, apiKey };
const ok = (m) => console.log(`  ✓ ${m}`);
const warn = (m) => console.warn(`  ⚠ ${m}`);
const section = (m) => console.log(`\n── ${m} ──`);

// Jeda antar panggilan (Gemini punya batas rate)
const jeda = (ms) => new Promise((res) => setTimeout(res, ms));

// ── Helper ──────────────────────────────────────────────────────────────────

async function flow4(payload, label) {
  const r = await callTool(settings, 'analisis', payload, { timeout: 120000 });
  ok(`flow4 ${label}`);
  return r;
}

async function flow5(payload, label) {
  const r = await callTool(settings, 'karier', payload, { timeout: 120000 });
  ok(`flow5 ${label}`);
  return r;
}

async function flow6(payload, label) {
  const r = await callTool(settings, 'usaha', payload, { timeout: 120000 });
  ok(`flow6 ${label}`);
  return r;
}

// Panggil flow 7 (coach) dan kembalikan jawaban teks.
// Jika gagal, catat dan kembalikan null (jangan isi jawaban sendiri).
async function flow7(userId, pertanyaan, label) {
  try {
    const r = await runFlow(settings, 'coach', `user_id: ${userId}\npertanyaan: ${pertanyaan}`, {
      timeout: 120000,
      sessionId: `demo-${userId}`,
    });
    ok(`flow7 ${label}`);
    return r;
  } catch (e) {
    warn(`flow7 ${label} GAGAL: ${e.message}`);
    return null;
  }
}

// Rekam jawaban flow 7 untuk daftar pertanyaan persona.
// Mengembalikan objek { [pertanyaan]: jawaban }.
// Pertanyaan yang gagal tidak disertakan (bukan diisi manual).
async function rekamChatPersona(userId, pertanyaanList) {
  const hasil = {};
  for (const q of pertanyaanList) {
    await jeda(4000); // jeda antar panggilan Gemini
    const jawaban = await flow7(userId, q, `${userId}: "${q.slice(0, 50)}…"`);
    if (jawaban != null) {
      hasil[q] = jawaban;
    } else {
      warn(`  Pertanyaan dilewati (tidak disimpan): "${q.slice(0, 60)}"`);
    }
  }
  return hasil;
}

// Bungkus dua hasil analisis menjadi format {sebelum, sesudah} yang dipakai skenario.budi.
// Sesuai dengan fungsi wrap() di AppContext.loadSkenarioBudi.
function wrap(rBefore, rAfter) {
  if (!rAfter) return null;
  return {
    sebelum: {
      sisa: rBefore?.dashboard?.sisa,
      skor: rBefore?.dashboard?.skor_kesehatan,
      target: Object.fromEntries((rBefore?.target || []).map((t) => [t.nama, t.opsi_a_menabung?.waktu_tercapai])),
    },
    sesudah: {
      sisa: rAfter?.dashboard?.sisa,
      skor: rAfter?.dashboard?.skor_kesehatan,
      target: Object.fromEntries((rAfter?.target || []).map((t) => [t.nama, t.opsi_a_menabung?.waktu_tercapai])),
    },
  };
}

// ── BUDI ────────────────────────────────────────────────────────────────────
section('BUDI');

const budi_analisis = await flow4({ user_id: 'budi' }, 'dasar budi');

// flow 5: karier budi — minat dari persona.js dilewatkan agar hasil benar
// (mencegah minat terpecah per huruf)
const budi_karier = await flow5({
  user_id: 'budi',
  minat: ['ai', 'data', 'komputer', 'matematika'],
  skill: ['Excel', 'Python', 'SQL', 'Pandas'],
  pengalaman: ['Operator Produksi 10 tahun'],
  pendidikan_terakhir: 'S1 Teknik Informatika',
  kota: 'Tangerang',
}, 'karier budi');

// Cari rekomendasi Data Scientist dan Data Analyst dari hasil flow 5
const budi_ds = budi_karier.rekomendasi?.find((r) => r.id === 'data_scientist');
const budi_da = budi_karier.rekomendasi?.find((r) => r.id === 'data_analyst');
if (!budi_ds) { warn('Data Scientist tidak ditemukan di hasil flow 5'); }
if (!budi_da) { warn('Data Analyst tidak ditemukan di hasil flow 5'); }

// flow 4: simulasi Data Scientist
const budi_sim_ds = budi_ds?.simulasi_siap_pakai
  ? await flow4({ user_id: 'budi', simulasi: budi_ds.simulasi_siap_pakai }, 'simulasi Data Scientist')
  : null;

// flow 4: simulasi Data Analyst
const budi_sim_da = budi_da?.simulasi_siap_pakai
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

// Ambil simulasi kopi dari simulasi_siap_pakai_per_skenario (pesimis dan moderat)
// Sesuai dengan loadSkenarioBudi di AppContext yang memakai .pesimis dan .moderat
const kopi_rec = budi_usaha_kopi.rekomendasi?.[0];
const kopiPesimis = kopi_rec?.simulasi_siap_pakai_per_skenario?.pesimis;
const kopiModerat = kopi_rec?.simulasi_siap_pakai_per_skenario?.moderat;
if (!kopiPesimis) { warn('simulasi_siap_pakai_per_skenario.pesimis tidak ditemukan di rekomendasi[0] flow 6'); }
if (!kopiModerat) { warn('simulasi_siap_pakai_per_skenario.moderat tidak ditemukan di rekomendasi[0] flow 6'); }

// flow 4: simulasi kopi pesimis
const budi_sim_kopi_pesimis = kopiPesimis
  ? await flow4({ user_id: 'budi', simulasi: kopiPesimis }, 'simulasi kopi pesimis')
  : null;

// Simulasi gabungan DS + kopi: jadwal karier DS + tambahan kopi
const budi_gabungan_pesimis_sim = (budi_ds?.simulasi_siap_pakai && kopiPesimis)
  ? {
      jadwal_pendapatan: budi_ds.simulasi_siap_pakai.jadwal_pendapatan,
      pendapatan_tambahan_jadwal: kopiPesimis.pendapatan_tambahan_jadwal,
      biaya_awal: kopiPesimis.biaya_awal,
    }
  : null;

const budi_gabungan_moderat_sim = (budi_ds?.simulasi_siap_pakai && kopiModerat)
  ? {
      jadwal_pendapatan: budi_ds.simulasi_siap_pakai.jadwal_pendapatan,
      pendapatan_tambahan_jadwal: kopiModerat.pendapatan_tambahan_jadwal,
      biaya_awal: kopiModerat.biaya_awal,
    }
  : null;

// flow 4: simulasi gabungan DS + kopi (pesimis)
const budi_sim_gabungan_pesimis = budi_gabungan_pesimis_sim
  ? await flow4({ user_id: 'budi', simulasi: budi_gabungan_pesimis_sim }, 'simulasi DS+kopi pesimis')
  : null;

// flow 4: simulasi gabungan DS + kopi (moderat)
const budi_sim_gabungan_moderat = budi_gabungan_moderat_sim
  ? await flow4({ user_id: 'budi', simulasi: budi_gabungan_moderat_sim }, 'simulasi DS+kopi moderat')
  : null;

// Susun karier_simulasi Budi: format {sebelum, sesudah} sesuai skenario.budi di AppContext
const budi_karier_simulasi = {
  ...(budi_sim_ds ? { data_scientist: wrap(budi_analisis, budi_sim_ds) } : {}),
  ...(budi_sim_da ? { data_analyst: wrap(budi_analisis, budi_sim_da) } : {}),
  ...(budi_sim_kopi_pesimis ? { kopi_pesimis: wrap(budi_analisis, budi_sim_kopi_pesimis) } : {}),
  ...(budi_sim_gabungan_pesimis ? { data_scientist_kopi_pesimis: wrap(budi_analisis, budi_sim_gabungan_pesimis) } : {}),
  ...(budi_sim_gabungan_moderat ? { data_scientist_kopi_moderat: wrap(budi_analisis, budi_sim_gabungan_moderat) } : {}),
};

// ── AGUS ────────────────────────────────────────────────────────────────────
section('AGUS');

const agus_analisis = await flow4({ user_id: 'agus' }, 'dasar agus');

// laba_bersih dari persona.js (omzet - biaya), bukan konstanta manual.
// Sesuai dengan loadSkenarioAgus di AppContext yang membaca persona.usaha[n].omzet/.biaya
const AGUS_BENGKEL_LABA = 18000000 - 7000000;   // sesuai persona.js
const AGUS_KELONTONG_LABA = 8000000 - 5000000;  // sesuai persona.js

const simBengkel = {
  pengembangan_usaha: [{ nama: 'Bengkel Agus', laba_bersih: AGUS_BENGKEL_LABA, kenaikan_persen: 20 }],
};
const simKelontong = {
  pengembangan_usaha: [{ nama: 'Kelontong istri', laba_bersih: AGUS_KELONTONG_LABA, kenaikan_persen: 25 }],
};
const simGabungan = {
  pengembangan_usaha: [
    { nama: 'Bengkel Agus', laba_bersih: AGUS_BENGKEL_LABA, kenaikan_persen: 20 },
    { nama: 'Kelontong istri', laba_bersih: AGUS_KELONTONG_LABA, kenaikan_persen: 25 },
  ],
};

const agus_sim_bengkel_r = await flow4({ user_id: 'agus', simulasi: simBengkel }, 'simulasi bengkel +20%');
const agus_sim_kelontong_r = await flow4({ user_id: 'agus', simulasi: simKelontong }, 'simulasi kelontong +25%');
const agus_sim_gabungan_r = await flow4({ user_id: 'agus', simulasi: simGabungan }, 'simulasi bengkel+kelontong gabungan');

// Dari hasil gabungan, ambil harga_maksimal_terjangkau_sesuai_tenggat untuk target rumah 7 tahun.
// Sesuai dengan loadSkenarioAgus di AppContext (bukan harga_rumah_override).
const rumahTargetGab = (agus_sim_gabungan_r?.target || []).find((t) =>
  t.kategori === 'rumah' || t.kategori === 'rumah_subsidi' || t.nama?.toLowerCase().includes('rumah'),
);
const agusHargaRealistis = rumahTargetGab?.alternatif?.harga_maksimal_terjangkau_sesuai_tenggat ?? null;
const agusTenggat = rumahTargetGab?.tenggat_bulan ?? 84;
ok(`agus harga_maksimal_terjangkau_sesuai_tenggat: ${agusHargaRealistis}`);

// flow 4: simulasi gabungan + rumah sesuai harga realistis (target_tahun: 7)
const agus_sim_rumah_r = agusHargaRealistis
  ? await flow4(
      {
        user_id: 'agus',
        simulasi: {
          ...simGabungan,
          target: {
            nama: 'Rumah',
            kategori: 'rumah',
            harga: agusHargaRealistis,
            target_tahun: Math.round(agusTenggat / 12),
          },
        },
      },
      `simulasi gabungan + rumah Rp${agusHargaRealistis}`,
    )
  : null;

// Simpan skenario Agus sebagai objek analisis penuh (sesuai skenario.agus di AppContext live path).
// loadSkenarioAgus demo path akan membacanya langsung.
const agus_skenario = {
  dasar: agus_analisis,
  bengkel: agus_sim_bengkel_r,
  kelontong: agus_sim_kelontong_r,
  gabungan: agus_sim_gabungan_r,
  rumah_realistis: agus_sim_rumah_r,
  harga_realistis: agusHargaRealistis,
  tenggat_tahun: Math.round(agusTenggat / 12),
};

// ── DINI ────────────────────────────────────────────────────────────────────
section('DINI');

const dini_analisis = await flow4({ user_id: 'dini' }, 'dasar dini');

// flow 5: karier dini (pelajar) — sertakan data lengkap agar kampus & jurusan terisi
const dini_karier = await flow5({
  user_id: 'dini',
  status: 'pelajar',
  minat: ['Teknologi', 'Matematika', 'Desain', 'Memecahkan masalah'],
  skill: ['Microsoft Office', 'Canva', 'Bahasa Inggris', 'Basic Python'],
  pendidikan_terakhir: 'SMA kelas 3',
  kota: 'Bandung',
}, 'karier dini (pelajar)');

// ── FLOW 7 — Rekam jawaban coach per persona ──────────────────────────────
// Pertanyaan diambil dari persona.pertanyaanChat di src/state/persona.js
section('FLOW 7 — rekam jawaban coach (budi)');
await jeda(3000);
const budi_chat = await rekamChatPersona('budi', [
  'Aku mau pindah ke data science, tapi takut gaji awal turun. Aku juga mau menikah 3 tahun lagi dan beli mobil. Gimana aturnya?',
  'Kalau aku juga buka usaha kopi sampingan di akhir pekan dengan modal 3 juta, apa dampaknya?',
  'Portofolio apa dulu?',
]);

section('FLOW 7 — rekam jawaban coach (agus)');
await jeda(3000);
const agus_chat = await rekamChatPersona('agus', [
  'Kami mau punya rumah Rp600 juta dalam 7 tahun. Bengkel dan kelontong istri sebaiknya diapakan?',
  'Kalau omzet bengkel naik 30%?',
]);

section('FLOW 7 — rekam jawaban coach (dini)');
await jeda(3000);
const dini_chat = await rekamChatPersona('dini', [
  'Aku sebentar lagi lulus SMA. Suka teknologi tapi bingung pilih jurusan dan kampus. Harus mulai dari mana?',
  'Berapa biaya kuliah di ITB atau Telkom University, dan ada beasiswa apa yang bisa aku coba?',
]);

// ── Tulis demoData.js ────────────────────────────────────────────────────────
section('Menulis src/api/demoData.js');

const data = {
  budi: {
    // Hasil flow 4 dasar
    analisis: budi_analisis,
    // Hasil flow 5 karier (seluruh objek, termasuk semua rekomendasi)
    karier: budi_karier,
    // Skenario karier: format {sebelum, sesudah} sesuai skenario.budi di AppContext.
    // loadSkenarioBudi demo path membaca kunci ini langsung.
    karier_simulasi: budi_karier_simulasi,
    // Hasil flow 6 usaha kopi
    usaha_kopi: budi_usaha_kopi,
    // Jawaban rekaman flow 7 — { [pertanyaan]: jawaban }
    chat: budi_chat,
  },
  agus: {
    // Hasil flow 4 dasar
    analisis: agus_analisis,
    // Skenario usaha Agus: objek analisis penuh sesuai skenario.agus di AppContext.
    // loadSkenarioAgus demo path membaca kunci ini langsung.
    skenario: agus_skenario,
    // Jawaban rekaman flow 7
    chat: agus_chat,
  },
  dini: {
    // Hasil flow 4 dasar
    analisis: dini_analisis,
    // Hasil flow 5 karier lengkap (termasuk kampus, jurusan, jalur belajar)
    karier: dini_karier,
    // Jawaban rekaman flow 7
    chat: dini_chat,
  },
};

// Pertahankan data harga dari file lama (statis, tidak perlu re-fetch)
let oldHarga = {};
try {
  const { DEMO: OLD } = await import('../src/api/demoData.js');
  oldHarga = OLD.harga || {};
} catch (_) { /* file baru tidak perlu data lama */ }

// ── Laporan angka kunci ────────────────────────────────────────────────────

function teksTarget(analisis, namaKata) {
  const t = (analisis?.target || []).find((x) =>
    !namaKata || x.nama?.toLowerCase().includes(namaKata.toLowerCase()),
  ) || (analisis?.target || [])[0];
  return t?.opsi_a_menabung?.waktu_tercapai || '–';
}

function teksTargetSkenario(skenObj, namaKata) {
  if (!skenObj?.sesudah?.target) return '–';
  const keys = Object.keys(skenObj.sesudah.target);
  const key = namaKata
    ? (keys.find((k) => k.toLowerCase() === namaKata.toLowerCase()) || keys.find((k) => k.toLowerCase().includes(namaKata.toLowerCase())))
    : keys[0];
  return skenObj.sesudah.target[key] || '–';
}

function teksTargetAnalisis(rFull, namaKata) {
  const t = (rFull?.target || []).find((x) =>
    !namaKata || x.nama?.toLowerCase().includes(namaKata.toLowerCase()),
  ) || (rFull?.target || [])[0];
  return t?.opsi_a_menabung?.waktu_tercapai || '–';
}

const budiMobilNama = (budi_analisis.target || []).find((t) =>
  t.kategori === 'mobil' || t.nama?.toLowerCase().includes('mobil'),
)?.nama || 'Mobil';

const agusRumahNama = (agus_analisis.target || []).find((t) =>
  t.kategori === 'rumah' || t.kategori === 'rumah_subsidi' || t.nama?.toLowerCase().includes('rumah'),
)?.nama || agus_analisis.target?.[0]?.nama || 'Rumah';

console.log('\n══════════════════════════════════════════');
console.log('LAPORAN ANGKA KUNCI');
console.log('══════════════════════════════════════════');
console.log('Skor kesehatan:');
console.log(`  Budi : ${budi_analisis.dashboard?.skor_kesehatan}`);
console.log(`  Agus : ${agus_analisis.dashboard?.skor_kesehatan}`);
console.log(`  Dini : ${dini_analisis.dashboard?.skor_kesehatan ?? 'N/A (pelajar)'}`);
console.log(`\nWaktu tercapai ${budiMobilNama} Budi:`);
console.log(`  Baseline (tanpa perubahan) : ${teksTarget(budi_analisis, budiMobilNama)}`);
console.log(`  Kopi pesimis saja          : ${teksTargetSkenario(budi_karier_simulasi.kopi_pesimis, budiMobilNama)}`);
console.log(`  Data Scientist saja        : ${teksTargetSkenario(budi_karier_simulasi.data_scientist, budiMobilNama)}`);
console.log(`  Data Analyst saja          : ${teksTargetSkenario(budi_karier_simulasi.data_analyst, budiMobilNama)}`);
console.log(`  DS + kopi (pesimis)        : ${teksTargetSkenario(budi_karier_simulasi.data_scientist_kopi_pesimis, budiMobilNama)}`);
console.log(`  DS + kopi (moderat)        : ${teksTargetSkenario(budi_karier_simulasi.data_scientist_kopi_moderat, budiMobilNama)}`);
console.log(`\nWaktu tercapai ${agusRumahNama} Agus:`);
console.log(`  Baseline (tanpa perubahan)   : ${teksTarget(agus_analisis, agusRumahNama)}`);
console.log(`  Bengkel +20%                 : ${teksTargetAnalisis(agus_sim_bengkel_r, agusRumahNama)}`);
console.log(`  Kelontong +25%               : ${teksTargetAnalisis(agus_sim_kelontong_r, agusRumahNama)}`);
console.log(`  Bengkel + Kelontong          : ${teksTargetAnalisis(agus_sim_gabungan_r, agusRumahNama)}`);
console.log(`  Gabungan + rumah realistis   : ${agus_sim_rumah_r ? teksTargetAnalisis(agus_sim_rumah_r, agusRumahNama) : '(tidak tersedia)'}`);
console.log('══════════════════════════════════════════\n');

// Tulis file
const fileContent = `// Data demo dihasilkan otomatis oleh scripts/ambil-data-demo.mjs dari Langflow.
// JANGAN DIEDIT MANUAL. Jalankan kembali skrip untuk memperbarui.
// Dihasilkan: ${new Date().toISOString()}

export const DEMO = ${JSON.stringify({ ...data, harga: oldHarga }, null, 1)};

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
`;

writeFileSync(new URL('../src/api/demoData.js', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'), fileContent, 'utf8');
ok('src/api/demoData.js berhasil ditulis ulang');

console.log('Selesai.');
