/**
 * Rekam (atau perbarui) jawaban flow 7 coach di demoData.js.
 * Jalankan setelah ambil-data-demo.mjs jika Gemini rate-limited.
 *
 * Pakai:
 *   node scripts/ambil-chat-demo.mjs <baseUrl> <apiKey>
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { runFlow } from '../src/api/langflow.js';

const [, , baseUrl = 'http://localhost:7860', apiKey = ''] = process.argv;
if (!baseUrl) { console.error('Pakai: node scripts/ambil-chat-demo.mjs <baseUrl> <apiKey>'); process.exit(1); }

const settings = { baseUrl, apiKey };
const ok = (m) => console.log(`  ✓ ${m}`);
const warn = (m) => console.warn(`  ⚠ ${m}`);
const jeda = (ms) => new Promise((res) => setTimeout(res, ms));

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

// Baca demoData.js yang sudah ada
const demoPath = new URL('../src/api/demoData.js', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const { DEMO } = await import('../src/api/demoData.js');

const personas = [
  {
    id: 'budi',
    pertanyaanChat: [
      'Aku mau pindah ke data science, tapi takut gaji awal turun. Aku juga mau menikah 3 tahun lagi dan beli mobil. Gimana aturnya?',
      'Kalau aku juga buka usaha kopi sampingan di akhir pekan dengan modal 3 juta, apa dampaknya?',
      'Portofolio apa dulu?',
    ],
  },
  {
    id: 'agus',
    pertanyaanChat: [
      'Kami mau punya rumah Rp600 juta dalam 7 tahun. Bengkel dan kelontong istri sebaiknya diapakan?',
      'Kalau omzet bengkel naik 30%?',
    ],
  },
  {
    id: 'dini',
    pertanyaanChat: [
      'Aku sebentar lagi lulus SMA. Suka teknologi tapi bingung pilih jurusan dan kampus. Harus mulai dari mana?',
      'Berapa biaya kuliah di ITB atau Telkom University, dan ada beasiswa apa yang bisa aku coba?',
    ],
  },
];

// Salinan DEMO untuk dimodifikasi
const data = JSON.parse(JSON.stringify(DEMO));

for (const { id, pertanyaanChat } of personas) {
  console.log(`\n── ${id.toUpperCase()} ──`);
  if (!data[id]) { warn(`persona ${id} tidak ditemukan di DEMO`); continue; }
  if (!data[id].chat) data[id].chat = {};

  for (const q of pertanyaanChat) {
    if (data[id].chat[q]) {
      ok(`sudah ada: "${q.slice(0, 50)}…"`);
      continue;
    }
    await jeda(6000);
    const jawaban = await flow7(id, q, `${id}: "${q.slice(0, 50)}…"`);
    if (jawaban != null) {
      data[id].chat[q] = jawaban;
    }
  }
}

// Tulis ulang demoData.js dengan chat yang diperbarui
// Ambil header dari file yang ada
const existingLines = readFileSync(demoPath, 'utf8').split('\n');
const headerLines = existingLines.slice(0, 4).join('\n');

const fileContent = `${headerLines}

export const DEMO = ${JSON.stringify(data, null, 1)};

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

writeFileSync(demoPath, fileContent, 'utf8');
ok('src/api/demoData.js diperbarui dengan jawaban chat');
console.log('Selesai.');
