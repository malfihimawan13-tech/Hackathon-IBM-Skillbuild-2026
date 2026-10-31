// Memperbarui kode komponen myCITA di Langflow yang sedang berjalan, tanpa menghapus atau mengimpor ulang flow.
// Endpoint Name, API key Gemini (flow 7), dan file PDF tidak disentuh.
//
// Pakai (dari folder ini):
//   node perbarui-langflow.mjs http://localhost:7860 API_KEY            -> cek saja (tidak mengubah apa pun)
//   node perbarui-langflow.mjs http://localhost:7860 API_KEY --terapkan -> terapkan perubahan
//
// Sebelum menerapkan, salinan setiap flow disimpan di folder cadangan_flow/.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const [, , baseArg, apiKey, flag] = process.argv;
const base = String(baseArg || '').replace(/\/+$/, '');
const terapkan = flag === '--terapkan';
if (!base || !apiKey) {
  console.log('Pakai: node perbarui-langflow.mjs http://localhost:7860 API_KEY [--terapkan]');
  process.exit(1);
}
const headers = { 'x-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' };
const NODE = JSON.parse(readFileSync(join(here, 'node_mycita.json'), 'utf8')); // { endpoint: { MyCITAxxx: nodeDef } }

async function api(method, path, body) {
  const res = await fetch(`${base}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

// "CITAProfil" (versi lama) atau "MyCITAProfil" → "MyCITAProfil"
const tipeBaru = (t) => (t.startsWith('MyCITA') ? t : t.startsWith('CITA') ? `My${t}` : null);

let daftar = await api('GET', '/api/v1/flows/?get_all=true');
if (!Array.isArray(daftar)) daftar = daftar.items || daftar.flows || [];
const target = daftar.filter((f) => /^[1-9]_.*_mycita$/.test(f.name || ''));
console.log(`Ditemukan ${target.length} flow myCITA.${terapkan ? '' : ' (mode cek: tidak ada yang diubah)'}\n`);
if (terapkan) mkdirSync(join(here, 'cadangan_flow'), { recursive: true });

let masalah = 0;
for (const ringkas of target.sort((a, b) => a.name.localeCompare(b.name))) {
  const flow = await api('GET', `/api/v1/flows/${ringkas.id}`);
  const acuan = NODE[flow.name];
  const catatan = [];
  const perluEndpoint = flow.endpoint_name !== flow.name;
  if (perluEndpoint) console.log(`  ${flow.name}: endpoint_name "${flow.endpoint_name}" → "${flow.name}"`);
  if (!acuan) { console.log(`- ${flow.name}: dilewati (tidak ada acuan)`); continue; }
  const data = flow.data || { nodes: [], edges: [] };
  let diubah = 0;
  for (const node of data.nodes || []) {
    const lama = node?.data?.type || '';
    const baru = tipeBaru(lama);
    if (!baru) continue;
    const def = acuan[baru];
    if (!def) { catatan.push(`komponen ${lama} tidak dikenal`); masalah++; continue; }
    const kodeLama = node.data.node?.template?.code?.value || '';
    const dbLama = node.data.node?.template?.db_path?.value || '';
    const versiLama = kodeLama.includes('.cita') && !kodeLama.includes('.mycita');
    const kodeSama = kodeLama === def.template.code.value;
    const info = [];
    if (versiLama) info.push('kode versi lama (database .cita)');
    else if (!kodeSama) info.push('kode berbeda');
    if (dbLama) info.push(`Lokasi Database diisi "${dbLama}" → dikosongkan`);
    if (lama !== baru) info.push(`tipe ${lama} → ${baru}`);
    if (kodeSama && !dbLama && lama === baru) { console.log(`  ${flow.name} · ${baru}: sudah terbaru`); continue; }
    console.log(`  ${flow.name} · ${lama}: ${info.join('; ')}`);
    node.data.node = JSON.parse(JSON.stringify(def));
    node.data.node.template.db_path && (node.data.node.template.db_path.value = '');
    if (lama !== baru) {
      node.data.type = baru;
      for (const e of data.edges || []) {
        if (e.source !== node.id && e.target !== node.id) continue;
        for (const k of ['sourceHandle', 'targetHandle']) {
          if (typeof e[k] === 'string') e[k] = e[k].split(`œ${lama}œ`).join(`œ${baru}œ`);
        }
        if (e.data?.sourceHandle?.dataType === lama) e.data.sourceHandle.dataType = baru;
      }
    }
    // Pastikan sambungan masih cocok dengan nama input/output komponen baru
    const outNames = (def.outputs || []).map((o) => o.name);
    for (const e of data.edges || []) {
      if (e.target === node.id) {
        const f = e.data?.targetHandle?.fieldName || (String(e.targetHandle).match(/œfieldNameœ:œ([^œ]+)œ/) || [])[1];
        if (f && !def.template[f]) { catatan.push(`sambungan masuk ke "${f}" tidak ada di ${baru}`); masalah++; }
      }
      if (e.source === node.id) {
        const n = e.data?.sourceHandle?.name || (String(e.sourceHandle).match(/œnameœ:œ([^œ]+)œ/) || [])[1];
        if (n && !outNames.includes(n)) { catatan.push(`sambungan keluar "${n}" tidak ada di ${baru}`); masalah++; }
      }
    }
    diubah++;
  }
  for (const c of catatan) console.log(`  ! ${flow.name}: ${c}`);
  if ((diubah || perluEndpoint) && terapkan) {
    writeFileSync(join(here, 'cadangan_flow', `${flow.name}.json`), JSON.stringify(flow, null, 1));
    const body = diubah ? { data } : {};
    if (perluEndpoint) body.endpoint_name = flow.name;
    await api('PATCH', `/api/v1/flows/${flow.id}`, body);
    console.log(`  ✓ ${flow.name}: ${diubah} komponen diperbarui${perluEndpoint ? ', endpoint diperbaiki' : ''}`);
  }
}
console.log(masalah ? `\nAda ${masalah} hal yang perlu dicek (tanda !). Kirim hasil ini ke Claude sebelum --terapkan.` : '\nTidak ada masalah sambungan.');
if (!terapkan) console.log('Jika hasilnya sesuai, jalankan lagi dengan --terapkan di akhir.');
else console.log('Selesai. Tutup lalu buka lagi Langflow, kemudian jalankan npm run test:langflow.');
