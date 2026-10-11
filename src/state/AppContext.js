import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { callTool, checkHealth, runFlow } from '../api/langflow';
import { DEMO } from '../api/demoData';
import { EMPTY_KEUANGAN, EMPTY_PROFIL, buildKeuanganPayload, buildProfilPayload } from './payloads';
import { findPersona } from './persona';

// Kembalikan data demo untuk persona yang sedang aktif.
// DEMO sekarang berstruktur { budi: {...}, agus: {...}, dini: {...} }.
function demoForUser(uid) {
  const id = (uid || '').trim().toLowerCase().replace(/\s+/g, '_');
  return DEMO[id] || {};
}

// Cari jawaban rekaman untuk pertanyaan q dari DEMO.<uid>.chat.
// Mengembalikan string jawaban atau null jika tidak ditemukan.
function demoChatReply(uid, question) {
  const d = demoForUser(uid);
  if (!d.chat) return null;
  // Cari kecocokan persis terlebih dulu
  if (d.chat[question] != null) return d.chat[question];
  // Tidak ada kecocokan — kembalikan null agar caller tahu ini pertanyaan bebas
  return null;
}

export { EXPENSE_TEMPLATE, sampleDrafts } from './payloads';

const STORE_KEY = 'cita:v1';

// user_id persona contoh — tidak perlu onboarding, data sudah ada di Langflow
export const DEMO_USER_IDS = ['budi', 'agus', 'dini'];

export const DEFAULT_SETTINGS = {
  baseUrl: '',
  apiKey: '',
  userId: '',
  demo: true,
  flowIds: {},
};

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  // activeUserId: null = belum login (tampilkan layar Masuk)
  const [activeUserId, setActiveUserId] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [profilDraft, setProfilDraft] = useState(EMPTY_PROFIL);
  const [keuanganDraft, setKeuanganDraft] = useState(EMPTY_KEUANGAN);
  const [psikologi, setPsikologi] = useState({});
  const [analysis, setAnalysis] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  // chat per pengguna: dict { userId: messages[] }. chat (array) adalah slice untuk pengguna aktif.
  const [chat, setChat] = useState([]);
  const [chatByUser, setChatByUser] = useState({});
  // karier & usaha per pengguna: { userId: {input, hasil, at} }
  // karier/usaha (derived) reflect the active user's entry
  const [karierByUser, setKarierByUser] = useState({});
  const [usahaByUser, setUsahaByUser] = useState({});
  const [skenario, setSkenario] = useState({});
  const loaded = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORE_KEY);
        if (raw) {
          const s = JSON.parse(raw);
          if (s.activeUserId) setActiveUserId(s.activeUserId);
          if (s.settings) setSettings({ ...DEFAULT_SETTINGS, ...s.settings });
          if (s.profilDraft) setProfilDraft(s.profilDraft);
          if (s.keuanganDraft) setKeuanganDraft(s.keuanganDraft);
          if (s.psikologi) setPsikologi(s.psikologi);
          if (s.analysis) setAnalysis(s.analysis);
          if (s.updatedAt) setUpdatedAt(s.updatedAt);
          // Muat chatByUser; chat aktif akan diisi saat activeUserId diketahui
          if (s.chatByUser) {
            setChatByUser(s.chatByUser);
            const uid = (s.activeUserId || '').trim().toLowerCase().replace(/\s+/g, '_');
            if (uid && s.chatByUser[uid]) setChat((s.chatByUser[uid] || []).slice(-40));
          } else if (s.chat) {
            // migrasi dari format lama (chat global) ke format per pengguna
            const uid = (s.activeUserId || '').trim().toLowerCase().replace(/\s+/g, '_');
            if (uid) {
              const migrated = { [uid]: s.chat.slice(-40) };
              setChatByUser(migrated);
              setChat(s.chat.slice(-40));
            }
          }
          if (s.karierByUser) setKarierByUser(s.karierByUser);
          else if (s.karier) {
            // Migrasi format lama (single object) ke per-user
            const uid = (s.activeUserId || '').trim().toLowerCase().replace(/\s+/g, '_');
            if (uid && s.karier) setKarierByUser({ [uid]: s.karier });
          }
          if (s.usahaByUser) setUsahaByUser(s.usahaByUser);
          else if (s.usaha) {
            const uid = (s.activeUserId || '').trim().toLowerCase().replace(/\s+/g, '_');
            if (uid && s.usaha) setUsahaByUser({ [uid]: s.usaha });
          }
          if (s.skenario) setSkenario(s.skenario);
        }
      } catch (_) { /* penyimpanan kosong atau rusak: mulai baru */ }
      loaded.current = true;
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(STORE_KEY, JSON.stringify({
      activeUserId, settings, profilDraft, keuanganDraft, psikologi, analysis, updatedAt, chatByUser, karierByUser, usahaByUser, skenario,
    })).catch(() => {});
  }, [activeUserId, settings, profilDraft, keuanganDraft, psikologi, analysis, updatedAt, chatByUser, karierByUser, usahaByUser, skenario]);

  const live = !settings.demo;
  // Pengguna aktif: hanya dari activeUserId (layar Masuk). settings.userId lama diabaikan.
  const userId = (activeUserId || '').trim().toLowerCase().replace(/\s+/g, '_');

  // Derived: data karier/usaha untuk pengguna aktif saja
  const karier = karierByUser[userId] || null;
  const usaha = usahaByUser[userId] || null;

  // Helper: simpan hasil karier/usaha untuk user tertentu
  const setKarierForUser = useCallback((uid, v) => {
    setKarierByUser((prev) => ({ ...prev, [uid]: v }));
  }, []);
  const setUsahaForUser = useCallback((uid, v) => {
    setUsahaByUser((prev) => ({ ...prev, [uid]: v }));
  }, []);

  // Perbarui chat pengguna aktif di kedua state (in-memory + dict per pengguna)
  const setChatForUser = useCallback((updater, uid) => {
    const id = (uid || userId || '').trim();
    setChat((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const sliced = next.slice(-40);
      if (id) {
        setChatByUser((byUser) => ({ ...byUser, [id]: sliced }));
      }
      return sliced;
    });
  }, [userId]);

  const requireUser = useCallback(() => {
    if (!userId) throw new Error('User ID belum diisi. Isi di langkah profil atau tab Profil.');
  }, [userId]);

  const setAnalysisNow = useCallback((a) => { setAnalysis(a); setUpdatedAt(new Date().toISOString()); }, []);

  const refreshAnalysis = useCallback(async () => {
    if (!live) { const a = demoForUser(activeUserId).analisis; setAnalysisNow(a); return a; }
    requireUser();
    const a = await callTool(settings, 'analisis', { user_id: userId });
    if (a.status === 'data_belum_lengkap') throw new Error(a.pesan);
    setAnalysisNow(a);
    return a;
  }, [live, settings, userId, activeUserId, requireUser, setAnalysisNow]);

  const submitOnboarding = useCallback(async ({ profil, keuangan, psi, uid }) => {
    setProfilDraft(profil); setKeuanganDraft(keuangan); setPsikologi(psi || {});
    const id = (uid || userId).trim().toLowerCase().replace(/\s+/g, '_');
    if (uid && uid !== settings.userId) setSettings((s) => ({ ...s, userId: uid }));
    if (!live) { setAnalysisNow(demoForUser(activeUserId).analisis); return { warnings: [] }; }
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
      const harga = DEMO.harga || {};
      const q = query.toLowerCase();
      const hit = Object.entries(harga).find(([k]) => q.includes(k.split(' ')[0]) || k.includes(q));
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
    if (!live) return demoForUser(activeUserId).simulasi_gaji;
    requireUser();
    return callTool(settings, 'analisis', { user_id: userId, simulasi });
  }, [live, settings, userId, requireUser]);

  const exploreKarier = useCallback(async (input) => {
    let r;
    if (!live) {
      await new Promise((res) => setTimeout(res, 600));
      r = demoForUser(activeUserId).karier;
    } else {
      r = await callTool(settings, 'karier', { ...input, user_id: userId || undefined });
    }
    const v = { input, hasil: r, at: new Date().toISOString() };
    setKarierForUser(userId, v);
    return v;
  }, [live, settings, userId, activeUserId, setKarierForUser]);

  const exploreUsaha = useCallback(async (input) => {
    let r;
    if (!live) {
      await new Promise((res) => setTimeout(res, 600));
      r = demoForUser(activeUserId).usaha_kopi || demoForUser(activeUserId).karier;
    } else {
      r = await callTool(settings, 'usaha', { ...input, user_id: userId || undefined });
    }
    const v = { input, hasil: r, at: new Date().toISOString() };
    setUsahaForUser(userId, v);
    return v;
  }, [live, settings, userId, activeUserId, setUsahaForUser]);

  // Untuk Budi: panggil flow 6 dengan input kopi, simpan di usaha state (dipakai Usaha screen).
  const exploreUsahaKopi = useCallback(async () => {
    // Jika sudah ada data kopi yang tersimpan, pakai ulang
    if (usaha?.input?.minat?.[0] === 'kopi') return usaha;
    const persona = findPersona(activeUserId);
    const input = persona?.usahaInput || { user_id: activeUserId, minat: ['kopi', 'minuman', 'kuliner'], skill: [], modal_tersedia: 3000000, waktu: 'sampingan' };
    let r;
    if (!live) {
      await new Promise((res) => setTimeout(res, 300));
      r = demoForUser(activeUserId).usaha_kopi;
    } else {
      r = await callTool(settings, 'usaha', { ...input, user_id: userId });
    }
    const v = { input, hasil: r, at: new Date().toISOString() };
    setUsahaForUser(userId, v);
    return v;
  }, [live, settings, userId, activeUserId, usaha, setUsahaForUser]);

  // Dampak jalur karier/usaha ke tujuan finansial. demoKey: ['karier'|'usaha', id]
  const simulateRoadmap = useCallback(async (simulasi, demoKey) => {
    if (!live) {
      const d = demoForUser(activeUserId);
      const tabel = demoKey?.[0] === 'usaha' ? d.usaha_simulasi : d.karier_simulasi;
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
    setChatForUser((c) => [...c, msg]);
    try {
      let reply;
      if (!live) {
        // Mode demo: cari jawaban rekaman untuk pertanyaan contoh persona
        const recorded = demoChatReply(activeUserId, question);
        if (recorded != null) {
          await new Promise((r) => setTimeout(r, 900));
          reply = recorded + '\n\n_Jawaban rekaman dari Langflow._';
        } else {
          // Pertanyaan bebas — tidak dijawab di Mode demo
          reply = 'Mode demo hanya menjawab pertanyaan contoh. Matikan Mode demo untuk bertanya bebas ke myCITA.';
        }
      } else {
        requireUser();
        reply = await runFlow(settings, 'coach', `user_id: ${userId}\npertanyaan: ${question}`, {
          timeout: 120000, sessionId: `cita-${userId}`,
        });
      }
      setChatForUser((c) => [...c, { id: `${Date.now()}a`, role: 'assistant', text: reply }]);
    } catch (e) {
      setChatForUser((c) => [...c, { id: `${Date.now()}e`, role: 'error', text: e.message }]);
    }
  }, [live, settings, userId, activeUserId, requireUser, setChatForUser]);

  const testConnection = useCallback(async (override) => {
    const st = { ...settings, ...(override || {}) };
    // Pakai activeUserId (pengguna yang sedang masuk), bukan settings.userId
    const uid = (activeUserId || '').trim().toLowerCase().replace(/\s+/g, '_');
    const healthy = await checkHealth(st);
    if (!healthy) throw new Error('Server ditemukan, tetapi Langflow belum siap.');
    if (!uid) return 'Langflow terhubung. Pilih pengguna untuk menguji flow CITA.';
    const a = await callTool(st, 'analisis', { user_id: uid });
    return a.status === 'data_belum_lengkap'
      ? 'Langflow dan flow CITA terhubung. Data pengguna ini belum ada, silakan isi data keuangan.'
      : 'Langflow dan flow CITA terhubung, data pengguna ditemukan.';
  }, [settings, activeUserId]);

  // Muat semua skenario Budi: dasar, DS, DA, kopi pesimis, DS+kopi pesimis, DS+kopi moderat.
  // Dipanggil dari Roadmap saat data karier & usaha sudah tersedia.
  const loadSkenarioBudi = useCallback(async () => {
    // Ambil simulasi_siap_pakai dari karier (DS dan DA)
    const karierHasil = karier?.hasil?.rekomendasi || [];
    const dsReko = karierHasil.find((r) => r.id === 'data_scientist');
    const daReko = karierHasil.find((r) => r.id === 'data_analyst');
    // Ambil simulasi kopi dari usaha
    const usahaHasil = usaha?.hasil?.rekomendasi || [];
    const kopiReko = usahaHasil.find((r) => r.id === 'kopi_keliling');
    const kopiPesimis = kopiReko?.simulasi_siap_pakai_per_skenario?.pesimis;
    const kopiModerat = kopiReko?.simulasi_siap_pakai_per_skenario?.moderat;

    if (!live) {
      // Mode demo: gunakan karier_simulasi dari demoData
      const d = demoForUser('budi');
      const ks = d.karier_simulasi || {};
      setSkenario((prev) => ({
        ...prev,
        budi: {
          dasar: ks.data_scientist ? { sesudah: ks.data_scientist.sebelum } : null,
          data_scientist: ks.data_scientist || null,
          data_analyst: ks.data_analyst || null,
          kopi_pesimis: ks.kopi_pesimis || null,
          data_scientist_kopi_pesimis: ks.data_scientist_kopi_pesimis || null,
          data_scientist_kopi_moderat: ks.data_scientist_kopi_moderat || null,
        },
      }));
      return;
    }

    requireUser();
    const run = async (simulasi) => {
      const payload = { user_id: userId };
      if (simulasi) payload.simulasi = simulasi;
      const r = await callTool(settings, 'analisis', payload);
      if (r.status === 'data_belum_lengkap') throw new Error(r.pesan);
      return r;
    };

    const [rDasar, rDS, rDA, rKopiP, rDSKopiP, rDSKopiM] = await Promise.all([
      run(null),
      dsReko?.simulasi_siap_pakai ? run(dsReko.simulasi_siap_pakai) : Promise.resolve(null),
      daReko?.simulasi_siap_pakai ? run(daReko.simulasi_siap_pakai) : Promise.resolve(null),
      kopiPesimis ? run(kopiPesimis) : Promise.resolve(null),
      (dsReko?.simulasi_siap_pakai && kopiPesimis)
        ? run({
            jadwal_pendapatan: dsReko.simulasi_siap_pakai.jadwal_pendapatan,
            pendapatan_tambahan_jadwal: kopiPesimis.pendapatan_tambahan_jadwal,
            biaya_awal: kopiPesimis.biaya_awal,
          })
        : Promise.resolve(null),
      (dsReko?.simulasi_siap_pakai && kopiModerat)
        ? run({
            jadwal_pendapatan: dsReko.simulasi_siap_pakai.jadwal_pendapatan,
            pendapatan_tambahan_jadwal: kopiModerat.pendapatan_tambahan_jadwal,
            biaya_awal: kopiModerat.biaya_awal,
          })
        : Promise.resolve(null),
    ]);

    // Bungkus hasil analisis menjadi format {sebelum, sesudah} seperti demo untuk konsistensi
    const wrap = (rBefore, rAfter) => rAfter ? {
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
    } : null;

    setSkenario((prev) => ({
      ...prev,
      budi: {
        dasar: rDasar ? wrap(rDasar, rDasar) : null,
        data_scientist: wrap(rDasar, rDS),
        data_analyst: wrap(rDasar, rDA),
        kopi_pesimis: wrap(rDasar, rKopiP),
        data_scientist_kopi_pesimis: wrap(rDasar, rDSKopiP),
        data_scientist_kopi_moderat: wrap(rDasar, rDSKopiM),
      },
    }));
  }, [live, settings, userId, karier, usaha, requireUser]);

  // Muat semua skenario Agus: dasar; bengkel saja; kelontong saja; gabungan;
  // lalu gabungan + budget rumah tepat 7 tahun dari harga_maksimal_terjangkau_sesuai_tenggat.
  const loadSkenarioAgus = useCallback(async () => {
    const personaAgus = findPersona('agus');
    const usahaList = personaAgus?.usaha || [];
    const bengkelData = usahaList[0];
    const kelontongData = usahaList[1];
    const bengkelTambahan = bengkelData ? Math.round((bengkelData.omzet - bengkelData.biaya) * 0.2) : 2200000;
    const kelontongTambahan = kelontongData ? Math.round((kelontongData.omzet - kelontongData.biaya) * 0.25) : 750000;

    if (!live) {
      const d = demoForUser('agus');
      setSkenario((prev) => ({
        ...prev,
        agus: {
          dasar: d.analisis || null,
          bengkel: null,
          kelontong: null,
          gabungan: null,
          rumah_realistis: null,
          tambahan: { bengkel: bengkelTambahan, kelontong: kelontongTambahan },
          harga_realistis: null,
        },
      }));
      return;
    }

    requireUser();
    const run = async (simulasi) => {
      const payload = { user_id: userId };
      if (simulasi) payload.simulasi = simulasi;
      const r = await callTool(settings, 'analisis', payload);
      if (r.status === 'data_belum_lengkap') throw new Error(r.pesan);
      return r;
    };

    const simBengkel = { pengembangan_usaha: [{ nama: bengkelData?.nama || 'Bengkel Agus', tambahan_laba_bulanan: bengkelTambahan }] };
    const simKelontong = { pengembangan_usaha: [{ nama: kelontongData?.nama || 'Kelontong istri', tambahan_laba_bulanan: kelontongTambahan }] };
    const simGabungan = {
      pengembangan_usaha: [
        { nama: bengkelData?.nama || 'Bengkel Agus', tambahan_laba_bulanan: bengkelTambahan },
        { nama: kelontongData?.nama || 'Kelontong istri', tambahan_laba_bulanan: kelontongTambahan },
      ],
    };

    const [rDasar, rBengkel, rKelontong, rGabungan] = await Promise.all([
      run(null),
      run(simBengkel),
      run(simKelontong),
      run(simGabungan),
    ]);

    // Dari hasil gabungan, ambil harga realistis agar target tepat 7 tahun
    const rumahTargetGab = (rGabungan?.target || []).find((t) => t.nama === 'Rumah');
    const hargaRealistis = rumahTargetGab?.alternatif?.harga_maksimal_terjangkau_sesuai_tenggat ?? null;
    const tenggat = rumahTargetGab?.tenggat_bulan ?? 84;

    let rRumahRealistis = null;
    if (hargaRealistis) {
      rRumahRealistis = await run({
        ...simGabungan,
        target: { nama: 'Rumah', kategori: 'rumah', harga: hargaRealistis, target_tahun: Math.round(tenggat / 12) },
      });
    }

    setSkenario((prev) => ({
      ...prev,
      agus: {
        dasar: rDasar,
        bengkel: rBengkel,
        kelontong: rKelontong,
        gabungan: rGabungan,
        rumah_realistis: rRumahRealistis,
        tambahan: { bengkel: bengkelTambahan, kelontong: kelontongTambahan },
        harga_realistis: hargaRealistis,
        tenggat_tahun: Math.round(tenggat / 12),
      },
    }));
  }, [live, settings, userId, requireUser]);

  // Simpan pengeluaran yang diubah: kirim data lengkap ke flow 2, lalu tandai skenario perlu dimuat ulang.
  // PENTING: flow 2 INSERT OR REPLACE, harus selalu sertakan hutang dan tabungan.
  const savePengeluaran = useCallback(async (uid, pengeluaranItems) => {
    if (!live) throw new Error('Mode demo aktif. Matikan Mode Demo untuk menyimpan perubahan.');
    const id = (uid || userId).trim().toLowerCase().replace(/\s+/g, '_');
    if (!id) throw new Error('User ID belum diisi.');
    // Susun pengeluaran sebagai objek {label: nominal}
    const pengeluaran = {};
    pengeluaranItems.forEach((e) => { if (e.nominal >= 0) pengeluaran[e.label] = Number(e.nominal) || 0; });
    // Ambil hutang dan tabungan dari persona (data asli, bukan hasil hitung)
    const persona = findPersona(id);
    const keu = persona?.keuangan || {};
    const hutang = (keu.hutang || []).map((h) => {
      const o = { nama: h.nama || 'Hutang', jenis: h.jenis || 'lainnya', cicilan_bulanan: Number(h.cicilan_bulanan) || 0, sisa_pokok: Number(h.sisa_pokok) || 0, sisa_tenor_bulan: Number(h.sisa_tenor_bulan) || 0 };
      if (h.bunga_tahunan != null) o.bunga_tahunan = Number(h.bunga_tahunan) || 0;
      return o;
    });
    const tabungan_saat_ini = Number(keu.tabungan_saat_ini) || 0;
    // Simpan ke persona lokal supaya layar lain ikut berubah sebelum analisis kembali
    if (persona) {
      persona.keuangan.pengeluaran = pengeluaranItems.map((e) => ({ label: e.label, nominal: e.nominal }));
    }
    const r = await callTool(settings, 'keuangan', { user_id: id, pengeluaran, hutang, tabungan_saat_ini });
    // Tandai skenario perlu dimuat ulang (kosongkan skenario untuk user ini)
    setSkenario((prev) => { const next = { ...prev }; delete next[id]; return next; });
    return r;
  }, [live, settings, userId]);

  const deleteAllData = useCallback(async () => {
    if (live && userId) await callTool(settings, 'hapus', { user_id: userId, konfirmasi: true });
    setAnalysis(null); setUpdatedAt(null); setSkenario({});
    setProfilDraft(EMPTY_PROFIL); setKeuanganDraft(EMPTY_KEUANGAN); setPsikologi({});
    // Hapus data karier/usaha untuk user aktif
    if (userId) {
      setKarierByUser((prev) => { const next = { ...prev }; delete next[userId]; return next; });
      setUsahaByUser((prev) => { const next = { ...prev }; delete next[userId]; return next; });
      setChatByUser((prev) => { const next = { ...prev }; delete next[userId]; return next; });
    }
    setChat([]);
  }, [live, settings, userId]);

  // Masuk sebagai salah satu persona contoh: atur userId, muat analisis dari Langflow.
  // Untuk persona contoh, mode demo tetap aktif (data demo tersedia tanpa server).
  const loginAs = useCallback(async (uid) => {
    const id = uid.trim().toLowerCase().replace(/\s+/g, '_');
    // reset state analisis/karier/usaha — tapi PERTAHANKAN chatByUser agar riwayat tiap persona tersimpan
    setAnalysis(null); setUpdatedAt(null); setKarier(null); setUsaha(null); setSkenario({});
    setProfilDraft(EMPTY_PROFIL); setKeuanganDraft(EMPTY_KEUANGAN); setPsikologi({});
    setActiveUserId(id);
    // Muat chat persona ini dari dict (bisa kosong jika belum pernah chat)
    setChatByUser((prev) => {
      const existing = prev[id] || [];
      setChat(existing.slice(-40));
      return prev;
    });
    // Muat analisis: pakai mode live jika server dikonfigurasi, fallback ke demo
    const demoD = demoForUser(id);
    try {
      const st = settings;
      const lv = !st.demo && !!st.baseUrl;
      if (lv) {
        const a = await callTool(st, 'analisis', { user_id: id });
        if (a && a.status !== 'data_belum_lengkap') { setAnalysisNow(a); }
      } else {
        setAnalysisNow(demoD.analisis);
      }
    } catch (_) {
      // jaringan gagal — pakai data demo agar layar tetap terisi
      setAnalysisNow(demoD.analisis);
    }
    // Untuk Budi: otomatis muat data usaha kopi jika belum ada
    if (id === 'budi') {
      try {
        const persona = findPersona(id);
        const input = persona?.usahaInput || { minat: ['kopi'], modal_tersedia: 3000000, waktu: 'sampingan' };
        const lv = !settings.demo && !!settings.baseUrl;
        let r;
        if (lv) {
          r = await callTool(settings, 'usaha', { ...input, user_id: id });
        } else {
          r = demoD.usaha_kopi;
        }
        setUsaha({ input, hasil: r, at: new Date().toISOString() });
      } catch (_) {
        setUsaha({ input: {}, hasil: demoD.usaha_kopi, at: new Date().toISOString() });
      }
    }
    // Untuk Dini: otomatis panggil flow 5_eksplorasi_karier_mycita
    // sehingga rekomendasi jurusan/karier langsung tersedia di Beranda
    if (id === 'dini') {
      try {
        const persona = findPersona('dini');
        const st = settings;
        const lv = !st.demo && !!st.baseUrl;
        let r;
        if (lv && persona?.karierInput) {
          r = await callTool(st, 'karier', persona.karierInput);
        } else {
          await new Promise((res) => setTimeout(res, 100));
          r = demoD.karier;
        }
        setKarier({ input: persona?.karierInput || {}, hasil: r, at: new Date().toISOString() });
      } catch (_) {
        setKarier({ input: {}, hasil: demoD.karier, at: new Date().toISOString() });
      }
    }
  }, [settings, setAnalysisNow]);

  // Kembali ke layar Masuk
  const logout = useCallback(() => {
    setActiveUserId(null);
    setAnalysis(null); setUpdatedAt(null); setChat([]); setKarier(null); setUsaha(null); setSkenario({});
    setProfilDraft(EMPTY_PROFIL); setKeuanganDraft(EMPTY_KEUANGAN); setPsikologi({});
    // chatByUser dipertahankan agar riwayat tiap persona tidak hilang saat logout
  }, []);

  // setChat yang diekspos ke layar: juga perbarui chatByUser (dipakai tombol hapus riwayat di Chat.js)
  const setChatCtx = useCallback((updater) => {
    setChatForUser(updater);
  }, [setChatForUser]);

  const value = useMemo(() => ({
    ready, settings, setSettings, live, userId, activeUserId,
    profilDraft, keuanganDraft, psikologi, analysis, updatedAt, chat, setChat: setChatCtx, karier, usaha, skenario,
    exploreKarier, exploreUsaha, exploreUsahaKopi, simulateRoadmap, loadSkenarioBudi, loadSkenarioAgus, refreshAnalysis, submitOnboarding, searchPrice, addTarget, removeTarget, whatIf, askCoach,
    testConnection, deleteAllData, loginAs, logout, savePengeluaran,
  }), [ready, settings, live, userId, activeUserId, profilDraft, keuanganDraft, psikologi, analysis, updatedAt, chat, karier, usaha, skenario,
    exploreKarier, exploreUsaha, exploreUsahaKopi, simulateRoadmap, loadSkenarioBudi, loadSkenarioAgus, refreshAnalysis, submitOnboarding, searchPrice, addTarget, removeTarget, whatIf, askCoach, testConnection, deleteAllData, loginAs, logout, savePengeluaran, setChatCtx]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp harus dipakai di dalam AppProvider');
  return v;
}
