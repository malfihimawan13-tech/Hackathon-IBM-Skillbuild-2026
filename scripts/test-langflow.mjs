// Uji integrasi: memanggil flow CITA di Langflow memakai klien API yang sama dengan aplikasi.
// Pakai:  node scripts/test-langflow.mjs http://localhost:7860 <API_KEY> [user_id]
import { callTool, checkHealth } from '../src/api/langflow.js';
import { sampleDrafts, buildProfilPayload, buildKeuanganPayload } from '../src/state/payloads.js';

const [, , baseUrl = 'http://localhost:7860', apiKey = '', userId = 'tes_mobile'] = process.argv;
const settings = { baseUrl, apiKey, flowIds: process.env.FLOW_IDS ? JSON.parse(process.env.FLOW_IDS) : {} };
const ok = (m) => console.log(`  ✓ ${m}`);

console.log(`Menguji Langflow di ${baseUrl} (user_id: ${userId})`);
if (!(await checkHealth(settings))) throw new Error('Health check gagal');
ok('Server Langflow sehat');

const d = sampleDrafts();
const r1 = await callTool(settings, 'profil', buildProfilPayload(userId, d.profil, d.psikologi));
ok(`1_simpan_profil_mycita → ${r1.pesan} (total penghasilan ${r1.ringkasan.total_penghasilan})`);
const r2 = await callTool(settings, 'keuangan', buildKeuanganPayload(userId, d.keuangan));
ok(`2_simpan_keuangan_mycita → total pengeluaran ${r2.ringkasan.total_pengeluaran}`);
const r3 = await callTool(settings, 'target', { aksi: 'cari_harga', query: 'toyota avanza' });
ok(`3_simpan_target_mycita (cari_harga) → ${r3.hasil[0].nama} ${r3.hasil[0].acuan}`);
const r4 = await callTool(settings, 'target', { user_id: userId, aksi: 'tambah', target: { nama: 'Toyota Avanza', harga: r3.hasil[0].acuan, target_tahun: 5, prioritas: 1 } });
ok(`3_simpan_target_mycita (tambah) → ${r4.pesan}`);
const a = await callTool(settings, 'analisis', { user_id: userId });
ok(`4_analisis_keuangan_mycita → skor ${a.dashboard.skor_kesehatan}, sisa ${a.dashboard.sisa}, Avanza ${a.target[0].opsi_a_menabung.waktu_tercapai}`);
const s = await callTool(settings, 'analisis', { user_id: userId, simulasi: { perubahan_penghasilan: 2000000, perubahan_keinginan: -300000 } });
ok(`4_analisis_keuangan_mycita (what-if) → Avanza ${s.perbandingan.sebelum.target['Toyota Avanza']} → ${s.perbandingan.sesudah.target['Toyota Avanza']}`);
const k = await callTool(settings, 'karier', { user_id: userId, minat: ['angka', 'komputer'], skill: ['Excel', 'SAP'], pengalaman: [{ bidang: 'gudang dan logistik', tahun: 9 }], pendidikan_terakhir: 'SMK', kota: 'Kabupaten Bekasi' });
ok(`5_eksplorasi_karier_mycita → ${k.rekomendasi.map((h) => h.profesi).join(', ')}`);
const ks = await callTool(settings, 'analisis', { user_id: userId, simulasi: k.rekomendasi[0].simulasi_siap_pakai });
ok(`dampak karier (${k.rekomendasi[0].profesi}) → Avanza ${ks.perbandingan.sebelum.target['Toyota Avanza']} → ${ks.perbandingan.sesudah.target['Toyota Avanza']}`);
const u = await callTool(settings, 'usaha', { user_id: userId, minat: ['otomotif'], skill: ['servis motor'], modal_tersedia: 10000000, waktu: 'sampingan' });
ok(`6_eksplorasi_usaha_mycita → ${u.rekomendasi[0].usaha}, balik modal moderat ${u.rekomendasi[0].skenario.moderat.balik_modal}`);
const us = await callTool(settings, 'analisis', { user_id: userId, simulasi: u.rekomendasi[0].simulasi_siap_pakai });
ok(`dampak usaha → Avanza ${us.perbandingan.sebelum.target['Toyota Avanza']} → ${us.perbandingan.sesudah.target['Toyota Avanza']}`);
const r5 = await callTool(settings, 'target', { user_id: userId, aksi: 'hapus', target: { nama: 'Toyota Avanza' } });
ok(`3_simpan_target_mycita (hapus) → ${r5.pesan}`);
const h = await callTool(settings, 'hapus', { user_id: userId, konfirmasi: true });
ok(`8_hapus_data_mycita → ${h.pesan}`);
try {
  await callTool({ ...settings, apiKey: 'kunci-salah' }, 'analisis', { user_id: userId });
} catch (e) { ok(`API key salah ditolak dengan pesan jelas: "${e.message.slice(0, 60)}…"`); }
console.log('Semua uji integrasi lulus.');
