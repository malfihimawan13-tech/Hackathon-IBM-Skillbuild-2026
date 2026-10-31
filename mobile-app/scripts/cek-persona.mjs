// Skrip baca-saja untuk memverifikasi angka persona ke Langflow (tanpa flow 1/2/3/8).
// Pakai:  npm run cek:persona -- http://localhost:7860 <API_KEY>
// Hanya memanggil flow 4 (analisis), flow 5 (karier), flow 6 (usaha) — TIDAK mengubah data.
import { callTool } from '../src/api/langflow.js';

const [, , baseUrl = 'http://localhost:7860', apiKey = ''] = process.argv;
const settings = { baseUrl, apiKey, flowIds: {} };

// ── Helpers ────────────────────────────────────────────────────────────────────
function bulatkanJuta(n) {
  // Bulatkan ke juta terdekat
  return Math.round(n / 1000000) * 1000000;
}

function cek(label, harapan, aktual) {
  if (String(harapan) === String(aktual)) {
    console.log(`  ✓ OK  | ${label}: "${aktual}"`);
  } else {
    console.log(`  ✗ BEDA| ${label}: harapan "${harapan}", aktual "${aktual}"`);
  }
}

function cekAngka(label, harapan, aktual, toleransi = 0) {
  const a = Number(aktual);
  const h = Number(harapan);
  if (!toleransi ? a === h : Math.abs(a - h) <= toleransi) {
    console.log(`  ✓ OK  | ${label}: ${aktual}`);
  } else {
    console.log(`  ✗ BEDA| ${label}: harapan ${harapan}, aktual ${aktual}`);
  }
}

function cekPerkiraan(label, harapanMin, harapanMax, aktual) {
  const a = Number(aktual);
  if (a >= harapanMin && a <= harapanMax) {
    console.log(`  ✓ OK  | ${label}: ${aktual} (kisaran ${harapanMin}–${harapanMax})`);
  } else {
    console.log(`  ✗ BEDA| ${label}: harapan kisaran ${harapanMin}–${harapanMax}, aktual ${aktual}`);
  }
}

function waktuTargetMobil(hasil) {
  const t = (hasil?.target || []).find((x) => x.nama === 'Mobil');
  return t?.opsi_a_menabung?.waktu_tercapai ?? '–';
}

function waktuTargetRumah(hasil) {
  const t = (hasil?.target || []).find((x) => x.nama === 'Rumah');
  return t?.opsi_a_menabung?.waktu_tercapai ?? '–';
}

// ── BUDI ───────────────────────────────────────────────────────────────────────
console.log('\n══ BUDI ══════════════════════════════════════════════════════════════');

// [A] Analisis dasar Budi
const budiFin = await callTool(settings, 'analisis', { user_id: 'budi' });
cekAngka('Budi skor', 100, budiFin.dashboard?.skor_kesehatan);
cekAngka('Budi sisa (Rp)', 2000000, bulatkanJuta(budiFin.dashboard?.sisa));
cek('Budi Mobil opsi-A (menabung)', '22 tahun 1 bulan', waktuTargetMobil(budiFin));

// Kredit Mobil: semua tenor harus aman: false
const mobilTarget = (budiFin?.target || []).find((x) => x.nama === 'Mobil');
const tenorOpsiB = mobilTarget?.opsi_b_kredit?.pilihan_tenor || [];
const tenorOpsiC = mobilTarget?.opsi_c_kombinasi?.pilihan_tenor || [];
const semuaTenorTidakAman = [...tenorOpsiB, ...tenorOpsiC].every((t) => t.aman === false);
if ([...tenorOpsiB, ...tenorOpsiC].length === 0) {
  console.log(`  ✗ BEDA| Budi kredit mobil: tidak ada pilihan tenor ditemukan`);
} else if (semuaTenorTidakAman) {
  console.log(`  ✓ OK  | Budi kredit mobil: semua tenor aman=false (${tenorOpsiB.length} opsiB + ${tenorOpsiC.length} opsiC)`);
} else {
  const aman = [...tenorOpsiB, ...tenorOpsiC].filter((t) => t.aman === true);
  console.log(`  ✗ BEDA| Budi kredit mobil: harapan semua aman=false, ada ${aman.length} tenor aman=true`);
}

// [B] Budi karier: Data Scientist skor 71
const budiKarier = await callTool(settings, 'karier', {
  user_id: 'budi',
  target_profesi: 'Data Scientist',
});
const dsReko = (budiKarier?.rekomendasi || []).find((r) => r.id === 'data_scientist');
const daRekoBudi = (budiKarier?.rekomendasi || []).find((r) => r.id === 'data_analyst');
cekAngka('Budi karier Data Scientist skor', 71, dsReko?.skor_kecocokan);

// [C] Budi usaha kopi
const budiUsaha = await callTool(settings, 'usaha', {
  user_id: 'budi',
  minat: ['kopi', 'minuman', 'kuliner'],
  skill: ['meracik kopi', 'pelayanan pelanggan'],
  modal_tersedia: 3000000,
  waktu: 'sampingan',
});
const kopiReko = (budiUsaha?.rekomendasi || []).find((r) => r.id === 'kopi_keliling');
cekAngka('Budi usaha Kopi keliling skor', 80, kopiReko?.skor_kecocokan);
cekPerkiraan('Budi kopi laba pesimis', 2000000, 2800000, kopiReko?.skenario?.pesimis?.laba_bulanan_stabil);
cekPerkiraan('Budi kopi laba moderat', 3700000, 4800000, kopiReko?.skenario?.moderat?.laba_bulanan_stabil);
cekPerkiraan('Budi kopi laba optimis', 5500000, 7700000, kopiReko?.skenario?.optimis?.laba_bulanan_stabil);
cek('Budi kopi balik modal pesimis', '3 bulan', kopiReko?.skenario?.pesimis?.balik_modal);
cek('Budi kopi balik modal moderat', '2 bulan', kopiReko?.skenario?.moderat?.balik_modal);
cek('Budi kopi balik modal optimis', '2 bulan', kopiReko?.skenario?.optimis?.balik_modal);

// [D] Budi skenario Mobil — DS, DA, kopi pesimis, DS+kopi pesimis, DS+kopi moderat
const kopiPesimis = kopiReko?.simulasi_siap_pakai_per_skenario?.pesimis;
const kopiModerat = kopiReko?.simulasi_siap_pakai_per_skenario?.moderat;
const dsSim = dsReko?.simulasi_siap_pakai;
const daSim = daRekoBudi?.simulasi_siap_pakai;

const [rDS, rDA, rKopiP, rDSKopiP, rDSKopiM] = await Promise.all([
  dsSim ? callTool(settings, 'analisis', { user_id: 'budi', simulasi: dsSim }) : Promise.resolve(null),
  daSim ? callTool(settings, 'analisis', { user_id: 'budi', simulasi: daSim }) : Promise.resolve(null),
  kopiPesimis ? callTool(settings, 'analisis', { user_id: 'budi', simulasi: kopiPesimis }) : Promise.resolve(null),
  (dsSim && kopiPesimis)
    ? callTool(settings, 'analisis', {
        user_id: 'budi',
        simulasi: {
          jadwal_pendapatan: dsSim.jadwal_pendapatan,
          pendapatan_tambahan_jadwal: kopiPesimis.pendapatan_tambahan_jadwal,
          biaya_awal: kopiPesimis.biaya_awal,
        },
      })
    : Promise.resolve(null),
  (dsSim && kopiModerat)
    ? callTool(settings, 'analisis', {
        user_id: 'budi',
        simulasi: {
          jadwal_pendapatan: dsSim.jadwal_pendapatan,
          pendapatan_tambahan_jadwal: kopiModerat.pendapatan_tambahan_jadwal,
          biaya_awal: kopiModerat.biaya_awal,
        },
      })
    : Promise.resolve(null),
]);

cek('Budi Mobil DS saja', '5 tahun 6 bulan', waktuTargetMobil(rDS));
cek('Budi Mobil Data Analyst saja', '6 tahun', waktuTargetMobil(rDA));
cek('Budi Mobil kopi pesimis saja', '6 tahun 11 bulan', waktuTargetMobil(rKopiP));
cek('Budi Mobil DS+kopi pesimis', '4 tahun 1 bulan', waktuTargetMobil(rDSKopiP));
cek('Budi Mobil DS+kopi moderat', '3 tahun 4 bulan', waktuTargetMobil(rDSKopiM));

// ── AGUS ───────────────────────────────────────────────────────────────────────
console.log('\n══ AGUS ══════════════════════════════════════════════════════════════');

// laba_bersih = omzet − biaya (dari persona.js); kenaikan_persen dikirim ke Langflow
// tambahan_laba_bulanan adalah HASIL dari Langflow, bukan input
const BENGKEL_LABA = 18000000 - 7000000;  // 11000000
const KELONTONG_LABA = 8000000 - 5000000;  // 3000000

const agusFin = await callTool(settings, 'analisis', { user_id: 'agus' });
cekAngka('Agus skor', 84, agusFin.dashboard?.skor_kesehatan);
cekAngka('Agus sisa (Rp)', 5500000, agusFin.dashboard?.sisa);
cek('Agus Rumah opsi-A dasar', '22 tahun 2 bulan', waktuTargetRumah(agusFin));

// Skenario bengkel, kelontong, gabungan — input: laba_bersih + kenaikan_persen
const simBengkel = { pengembangan_usaha: [{ nama: 'Bengkel Agus', laba_bersih: BENGKEL_LABA, kenaikan_persen: 20 }] };
const simKelontong = { pengembangan_usaha: [{ nama: 'Kelontong istri', laba_bersih: KELONTONG_LABA, kenaikan_persen: 25 }] };
const simGabungan = {
  pengembangan_usaha: [
    { nama: 'Bengkel Agus', laba_bersih: BENGKEL_LABA, kenaikan_persen: 20 },
    { nama: 'Kelontong istri', laba_bersih: KELONTONG_LABA, kenaikan_persen: 25 },
  ],
};

const [rBengkel, rKelontong, rGabungan] = await Promise.all([
  callTool(settings, 'analisis', { user_id: 'agus', simulasi: simBengkel }),
  callTool(settings, 'analisis', { user_id: 'agus', simulasi: simKelontong }),
  callTool(settings, 'analisis', { user_id: 'agus', simulasi: simGabungan }),
]);

cek('Agus Rumah + bengkel', '10 tahun', waktuTargetRumah(rBengkel));
cek('Agus Rumah + kelontong', '14 tahun 8 bulan', waktuTargetRumah(rKelontong));
cek('Agus Rumah + gabungan', '8 tahun 8 bulan', waktuTargetRumah(rGabungan));

// Tambahan laba dari respons Langflow (pengembangan_usaha[].tambahan_laba_bulanan)
const bengkelResp = (rBengkel?.pengembangan_usaha || []).find((u) => u.nama === 'Bengkel Agus');
const kelontongResp = (rKelontong?.pengembangan_usaha || []).find((u) => u.nama === 'Kelontong istri');
cekAngka('Agus tambahan laba bengkel (dari Langflow)', 2200000, bengkelResp?.tambahan_laba_bulanan);
cekAngka('Agus tambahan laba kelontong (dari Langflow)', 750000, kelontongResp?.tambahan_laba_bulanan);

// Rumah realistis: harga_maksimal_terjangkau_sesuai_tenggat dari skenario gabungan
const rumahGab = (rGabungan?.target || []).find((t) => t.nama === 'Rumah');
const hargaRealistis = rumahGab?.alternatif?.harga_maksimal_terjangkau_sesuai_tenggat ?? null;
const tenggat = rumahGab?.tenggat_bulan ?? 84;

// Periksa harga realistis ±10% dari 515.000.000
if (hargaRealistis !== null) {
  cekPerkiraan('Agus harga rumah realistis (harapan ±515.000.000)', 400000000, 600000000, hargaRealistis);

  const rRumahRealistis = await callTool(settings, 'analisis', {
    user_id: 'agus',
    simulasi: {
      ...simGabungan,
      target: { nama: 'Rumah', kategori: 'rumah', harga: hargaRealistis, target_tahun: Math.round(tenggat / 12) },
    },
  });
  cek('Agus Rumah realistis', '7 tahun', waktuTargetRumah(rRumahRealistis));
} else {
  console.log('  ✗ BEDA| Agus harga rumah realistis: tidak ditemukan di respons Langflow');
}

// ── DINI ───────────────────────────────────────────────────────────────────────
console.log('\n══ DINI ══════════════════════════════════════════════════════════════');

const diniFin = await callTool(settings, 'analisis', { user_id: 'dini' });
cekAngka('Dini skor', 59, diniFin.dashboard?.skor_kesehatan);
cekAngka('Dini sisa (Rp)', 150000, diniFin.dashboard?.sisa);

// Karier Dini: hanya kirim user_id + status (jangan kirim minat/skill/pengalaman
// karena flow 5 menyimpannya dan akan mengubah skor Dini secara permanen)
const diniKarier = await callTool(settings, 'karier', {
  user_id: 'dini',
  status: 'pelajar',
});

// Jurusan
const siReko = (diniKarier?.rekomendasi_jurusan || []).find((r) => r.id === 'sistem_informasi');
const tiReko = (diniKarier?.rekomendasi_jurusan || []).find(
  (r) => r.id === 'teknik_informatika' || r.jurusan?.toLowerCase().includes('teknik informatika'),
);
cekAngka('Dini jurusan S1 Sistem Informasi skor', 90, siReko?.skor_kecocokan);
cekAngka('Dini jurusan S1 Teknik Informatika skor', 89, tiReko?.skor_kecocokan);

// Karier
const daRekoDini = (diniKarier?.rekomendasi || []).find(
  (r) => r.id === 'data_analyst' || r.profesi === 'Data Analyst',
);
const seReko = (diniKarier?.rekomendasi || []).find(
  (r) => r.id === 'software_engineer' || r.profesi === 'Software Engineer',
);
// UI/UX bisa ada di rekomendasi utama atau profesi_lain
const uiReko =
  (diniKarier?.rekomendasi || []).find((r) => r.profesi?.includes('UI/UX')) ||
  (diniKarier?.profesi_lain || []).find((r) => r.profesi?.includes('UI/UX'));
cekAngka('Dini karier Data Analyst skor', 75, daRekoDini?.skor_kecocokan);
cekAngka('Dini karier Software Engineer skor', 73, seReko?.skor_kecocokan);
cekAngka('Dini karier UI/UX Designer skor', 73, uiReko?.skor_kecocokan);

console.log('\n══ Selesai ═══════════════════════════════════════════════════════════');
