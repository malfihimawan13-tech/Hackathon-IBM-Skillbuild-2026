import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { callTool, checkHealth, runFlow } from '../api/langflow';
import { DEMO } from '../api/demoData';
import { rp } from '../utils/format';
import { EMPTY_KEUANGAN, EMPTY_PROFIL, buildKeuanganPayload, buildProfilPayload } from './payloads';

export { EXPENSE_TEMPLATE, sampleDrafts } from './payloads';

const STORE_KEY = 'cita:v1';

export const DEFAULT_SETTINGS = {
  baseUrl: '',
  apiKey: '',
  userId: '',
  demo: true,
  flowIds: {},
};

function demoCoachReply(q) {
  const a = DEMO.analisis;
  const s = DEMO.simulasi_gaji;
  const t = (a.target || [])[0];
  const text = q.toLowerCase();
  if (/(gaji|naik|hemat|jajan|kalau|gimana kalau|bagaimana jika)/.test(text)) {
    const before = s.perbandingan.sebelum; const after = s.perbandingan.sesudah;
    return `Aku coba simulasikan gaji naik ${rp(2000000)} dan jajan berkurang ${rp(300000)} per bulan.\n\n`
      + `- Sisa per bulan: ${rp(before.sisa)} → **${rp(after.sisa)}**\n`
      + Object.keys(after.target).map((k) => `- ${k}: ${before.target[k]} → **${after.target[k]}**`).join('\n')
      + `\n\nDengan skenario ini, Avanza masuk target 5 tahun. Langkah kecil minggu ini: lunasi paylater dulu, lalu pindahkan jatah jajan ke rekening tabungan terpisah.\n\n_Estimasi edukatif, bukan nasihat investasi._`;
  }
  if (/rumah/.test(text)) {
    return 'Untuk rumah, aku perlu harga yang kamu incar. Sebagai gambaran, batas harga rumah subsidi di Jabodetabek maksimal Rp185 juta dengan bunga KPR subsidi 5% tetap, tetapi ada syarat penghasilan dan belum punya rumah. Tambahkan rumah di menu Cari Impian supaya aku bisa hitung simulasinya.\n\n_Estimasi edukatif, bukan nasihat investasi._';
  }
  return `Kondisi keuanganmu ${a.dashboard.status.replace(/[^\p{L}\p{N} ]/gu, '').trim().toLowerCase()} dengan skor ${a.dashboard.skor_kesehatan}/100 dan sisa ${rp(a.dashboard.sisa)} per bulan.\n\n`
    + (t ? `Untuk ${t.nama}, dengan kondisi sekarang baru tercapai dalam **${t.opsi_a_menabung?.waktu_tercapai}**. ` : '')
    + `Prioritas utamaku untukmu:\n- ${a.rekomendasi_utama.slice(0, 3).join('\n- ')}\n\nMau coba simulasi "bagaimana kalau gaji naik"?\n\n_Estimasi edukatif, bukan nasihat investasi._`;
}

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [profilDraft, setProfilDraft] = useState(EMPTY_PROFIL);
  const [keuanganDraft, setKeuanganDraft] = useState(EMPTY_KEUANGAN);
  const [psikologi, setPsikologi] = useState({});
  const [analysis, setAnalysis] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [chat, setChat] = useState([]);
  const [karier, setKarier] = useState(null);
  const [usaha, setUsaha] = useState(null);
  const loaded = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORE_KEY);
        if (raw) {
          const s = JSON.parse(raw);
          if (s.settings) setSettings({ ...DEFAULT_SETTINGS, ...s.settings });
          if (s.profilDraft) setProfilDraft(s.profilDraft);
          if (s.keuanganDraft) setKeuanganDraft(s.keuanganDraft);
          if (s.psikologi) setPsikologi(s.psikologi);
          if (s.analysis) setAnalysis(s.analysis);
          if (s.updatedAt) setUpdatedAt(s.updatedAt);
          if (s.chat) setChat(s.chat.slice(-40));
          if (s.karier) setKarier(s.karier);
          if (s.usaha) setUsaha(s.usaha);
        }
      } catch (_) { /* penyimpanan kosong atau rusak: mulai baru */ }
      loaded.current = true;
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(STORE_KEY, JSON.stringify({
      settings, profilDraft, keuanganDraft, psikologi, analysis, updatedAt, chat: chat.slice(-40), karier, usaha,
    })).catch(() => {});
  }, [settings, profilDraft, keuanganDraft, psikologi, analysis, updatedAt, chat, karier, usaha]);

  const live = !settings.demo;
  const userId = (settings.userId || '').trim().toLowerCase().replace(/\s+/g, '_');

  const requireUser = useCallback(() => {
    if (!userId) throw new Error('User ID belum diisi. Isi di langkah profil atau tab Profil.');
  }, [userId]);

  const setAnalysisNow = useCallback((a) => { setAnalysis(a); setUpdatedAt(new Date().toISOString()); }, []);

  const refreshAnalysis = useCallback(async () => {
    if (!live) { setAnalysisNow(DEMO.analisis); return DEMO.analisis; }
    requireUser();
    const a = await callTool(settings, 'analisis', { user_id: userId });
    if (a.status === 'data_belum_lengkap') throw new Error(a.pesan);
    setAnalysisNow(a);
    return a;
  }, [live, settings, userId, requireUser, setAnalysisNow]);

  const submitOnboarding = useCallback(async ({ profil, keuangan, psi, uid }) => {
    setProfilDraft(profil); setKeuanganDraft(keuangan); setPsikologi(psi || {});
    const id = (uid || userId).trim().toLowerCase().replace(/\s+/g, '_');
    if (uid && uid !== settings.userId) setSettings((s) => ({ ...s, userId: uid }));
    if (!live) { setAnalysisNow(DEMO.analisis); return { warnings: [] }; }
    if (!id) throw new Error('User ID wajib diisi.');
    const r1 = await callTool(settings, 'profil', buildProfilPayload(id, profil, psi));
    const r2 = await callTool(settings, 'keuangan', buildKeuanganPayload(id, keuangan));
    const a = await callTool(settings, 'analisis', { user_id: id });
    if (a.status === 'data_belum_lengkap') throw new Error(a.pesan);
    setAnalysisNow(a);
    return { warnings: [...(r1.peringatan || []), ...(r2.peringatan || [])] };
  }, [live, settings, userId, setAnalysisNow]);

  const searchPrice = useCallback(async (query) => {
    if (!live) {
      const q = query.toLowerCase();
      const hit = Object.entries(DEMO.harga).find(([k]) => q.includes(k.split(' ')[0]) || k.includes(q));
      return hit ? hit[1].hasil : [];
    }
    const r = await callTool(settings, 'target', { aksi: 'cari_harga', query });
    return r.hasil || [];
  }, [live, settings]);

  const addTarget = useCallback(async (target) => {
    if (!live) throw new Error('Mode demo memakai data contoh yang tetap. Matikan Mode Demo di tab Profil untuk menyimpan target ke Langflow.');
    requireUser();
    const r = await callTool(settings, 'target', { user_id: userId, aksi: 'tambah', target });
    await refreshAnalysis();
    return r;
  }, [live, settings, userId, requireUser, refreshAnalysis]);

  const removeTarget = useCallback(async (nama) => {
    if (!live) throw new Error('Mode demo memakai data contoh yang tetap. Matikan Mode Demo untuk mengubah target.');
    requireUser();
    await callTool(settings, 'target', { user_id: userId, aksi: 'hapus', target: { nama } });
    await refreshAnalysis();
  }, [live, settings, userId, requireUser, refreshAnalysis]);

  const whatIf = useCallback(async (simulasi) => {
    if (!live) return DEMO.simulasi_gaji;
    requireUser();
    return callTool(settings, 'analisis', { user_id: userId, simulasi });
  }, [live, settings, userId, requireUser]);

  const exploreKarier = useCallback(async (input) => {
    let r;
    if (!live) {
      await new Promise((res) => setTimeout(res, 600));
      r = DEMO.karier;
    } else {
      r = await callTool(settings, 'karier', { ...input, user_id: userId || undefined });
    }
    const v = { input, hasil: r, at: new Date().toISOString() };
    setKarier(v);
    return v;
  }, [live, settings, userId]);

  const exploreUsaha = useCallback(async (input) => {
    let r;
    if (!live) {
      await new Promise((res) => setTimeout(res, 600));
      r = DEMO.usaha;
    } else {
      r = await callTool(settings, 'usaha', { ...input, user_id: userId || undefined });
    }
    const v = { input, hasil: r, at: new Date().toISOString() };
    setUsaha(v);
    return v;
  }, [live, settings, userId]);

  // Dampak jalur karier/usaha ke tujuan finansial. demoKey: ['karier'|'usaha', id]
  const simulateRoadmap = useCallback(async (simulasi, demoKey) => {
    if (!live) {
      const tabel = demoKey?.[0] === 'usaha' ? DEMO.usaha_simulasi : DEMO.karier_simulasi;
      const p = tabel?.[demoKey?.[1]];
      if (!p) throw new Error('Simulasi demo untuk pilihan ini belum tersedia.');
      return { perbandingan: p };
    }
    requireUser();
    const r = await callTool(settings, 'analisis', { user_id: userId, simulasi });
    if (r.status === 'data_belum_lengkap') throw new Error(r.pesan);
    return r;
  }, [live, settings, userId, requireUser]);

  const askCoach = useCallback(async (question) => {
    const msg = { id: `${Date.now()}u`, role: 'user', text: question };
    setChat((c) => [...c, msg]);
    try {
      let reply;
      if (!live) {
        await new Promise((r) => setTimeout(r, 900));
        reply = demoCoachReply(question);
      } else {
        requireUser();
        reply = await runFlow(settings, 'coach', `user_id: ${userId}\npertanyaan: ${question}`, {
          timeout: 120000, sessionId: `cita-${userId}`,
        });
      }
      setChat((c) => [...c, { id: `${Date.now()}a`, role: 'assistant', text: reply }]);
    } catch (e) {
      setChat((c) => [...c, { id: `${Date.now()}e`, role: 'error', text: e.message }]);
    }
  }, [live, settings, userId, requireUser]);

  const testConnection = useCallback(async (override) => {
    const st = { ...settings, ...(override || {}) };
    const uid = (st.userId || '').trim().toLowerCase().replace(/\s+/g, '_');
    const healthy = await checkHealth(st);
    if (!healthy) throw new Error('Server ditemukan, tetapi Langflow belum siap.');
    if (!uid) return 'Langflow terhubung. Isi User ID untuk menguji flow CITA.';
    const a = await callTool(st, 'analisis', { user_id: uid });
    return a.status === 'data_belum_lengkap'
      ? 'Langflow dan flow CITA terhubung. Data pengguna ini belum ada, silakan isi data keuangan.'
      : 'Langflow dan flow CITA terhubung, data pengguna ditemukan.';
  }, [settings]);

  const deleteAllData = useCallback(async () => {
    if (live && userId) await callTool(settings, 'hapus', { user_id: userId, konfirmasi: true });
    setAnalysis(null); setUpdatedAt(null); setChat([]); setKarier(null); setUsaha(null);
    setProfilDraft(EMPTY_PROFIL); setKeuanganDraft(EMPTY_KEUANGAN); setPsikologi({});
  }, [live, settings, userId]);

  const value = useMemo(() => ({
    ready, settings, setSettings, live, userId,
    profilDraft, keuanganDraft, psikologi, analysis, updatedAt, chat, setChat, karier, usaha,
    exploreKarier, exploreUsaha, simulateRoadmap, refreshAnalysis, submitOnboarding, searchPrice, addTarget, removeTarget, whatIf, askCoach,
    testConnection, deleteAllData,
  }), [ready, settings, live, userId, profilDraft, keuanganDraft, psikologi, analysis, updatedAt, chat, karier, usaha,
    exploreKarier, exploreUsaha, simulateRoadmap, refreshAnalysis, submitOnboarding, searchPrice, addTarget, removeTarget, whatIf, askCoach, testConnection, deleteAllData]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp harus dipakai di dalam AppProvider');
  return v;
}
