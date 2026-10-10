// Klien REST API Langflow untuk flow-flow CITA.
// Setiap flow dipanggil lewat POST /api/v1/run/{endpoint_name atau flow_id}.

export const FLOWS = {
  profil: '1_simpan_profil_mycita',
  keuangan: '2_simpan_keuangan_mycita',
  target: '3_simpan_target_mycita',
  analisis: '4_analisis_keuangan_mycita',
  coach: '7_konsultasi_coach_mycita',
  karier: '5_eksplorasi_karier_mycita',
  usaha: '6_eksplorasi_usaha_mycita',
  hapus: '8_hapus_data_mycita',
};

function normalizeBase(url) {
  let u = String(url || '').trim().replace(/\/+$/, '');
  if (u && !/^https?:\/\//i.test(u)) u = `http://${u}`;
  return u;
}

async function fetchWithTimeout(url, options, ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: ctrl.signal });
  } catch (e) {
    if (e?.name === 'AbortError') {
      throw new Error('Langflow tidak merespons tepat waktu. Pastikan Langflow berjalan dan alamatnya benar.');
    }
    throw new Error('Tidak bisa terhubung ke Langflow. Periksa alamat server dan pastikan HP satu jaringan dengan laptop (atau pakai alamat ngrok).');
  } finally {
    clearTimeout(timer);
  }
}

// Ambil teks Chat Output dari respons Langflow (mendukung beberapa versi format respons).
export function extractText(data) {
  const runs = data?.outputs || [];
  for (const run of runs) {
    for (const o of run?.outputs || []) {
      const t =
        o?.results?.message?.text ??
        o?.results?.message?.data?.text ??
        o?.outputs?.message?.message ??
        o?.messages?.[0]?.message ??
        o?.artifacts?.message;
      if (typeof t === 'string' && t.length) return t;
    }
  }
  if (typeof data?.result === 'string') return data.result;
  throw new Error('Respons Langflow tidak berisi Chat Output. Pastikan flow diakhiri komponen Chat Output.');
}

export async function runFlow(settings, flowKey, input, { timeout = 45000, sessionId } = {}) {
  const base = normalizeBase(settings.baseUrl);
  if (!base) throw new Error('Alamat Langflow belum diisi. Buka tab Profil → Koneksi Langflow.');
  const id = settings.flowIds?.[flowKey] || FLOWS[flowKey];
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
  if (settings.apiKey) headers['x-api-key'] = settings.apiKey.trim();
  const body = {
    input_value: typeof input === 'string' ? input : JSON.stringify(input),
    input_type: 'chat',
    output_type: 'chat',
  };
  if (sessionId) body.session_id = sessionId;
  const res = await fetchWithTimeout(
    `${base}/api/v1/run/${encodeURIComponent(id)}?stream=false`,
    { method: 'POST', headers, body: JSON.stringify(body) },
    timeout,
  );
  if (res.status === 401 || res.status === 403) {
    throw new Error('API key Langflow ditolak. Buat API key di Langflow (Settings → Langflow API Keys) lalu isi di tab Profil.');
  }
  if (res.status === 404) {
    throw new Error(`Flow "${id}" tidak ditemukan. Pastikan flow sudah di-import dan Endpoint Name-nya "${FLOWS[flowKey]}", atau isi Flow ID di pengaturan lanjutan.`);
  }
  if (!res.ok) {
    let detail = '';
    try { detail = JSON.stringify(await res.json()).slice(0, 200); } catch (_) { /* abaikan */ }
    throw new Error(`Langflow mengembalikan error ${res.status}. ${detail}`);
  }
  return extractText(await res.json());
}

// Untuk flow data/analisis: hasilnya JSON dari komponen CITA.
export async function callTool(settings, flowKey, payload, opts) {
  const text = await runFlow(settings, flowKey, payload, opts);
  let data;
  try {
    const s = text.indexOf('{');
    data = JSON.parse(text.slice(s, text.lastIndexOf('}') + 1));
  } catch (_) {
    throw new Error('Hasil flow bukan JSON yang valid. Pastikan flow memakai komponen CITA versi terbaru.');
  }
  if (data.status === 'error') throw new Error(data.pesan || 'Terjadi kesalahan di Langflow.');
  return data;
}

export async function checkHealth(settings) {
  const base = normalizeBase(settings.baseUrl);
  const res = await fetchWithTimeout(`${base}/health`, { method: 'GET' }, 8000);
  return res.ok;
}
