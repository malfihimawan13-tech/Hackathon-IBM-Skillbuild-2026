import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Percakapan CONTOH. Semua kontak fiktif; balasan otomatis diberi label "balasan contoh".
export const THREADS = [
  { id: 't-m1', judul: 'Dewi K. (contoh)', sub: 'Mentor · Data Scientist', kunci: 'dewi', jenis: 'mentor', awal: [{ dari: 'lain', teks: 'Halo! Ceritakan dulu tujuan kariermu ya, nanti kita atur sesi singkat.' }] },
  { id: 't-g1', judul: 'Belajar Data Science Pemula', sub: 'Grup · 128 anggota · 14 online', jenis: 'grup', awal: [{ dari: 'lain', nama: 'Rafi A.', teks: 'Besok Sabtu kita bahas dasar statistik, ya. Boleh bawa pertanyaan!' }] },
  { id: 't-g2', judul: 'Pindah Karier dari Pabrik ke Teknologi', sub: 'Grup · 64 anggota · 7 online', jenis: 'grup', awal: [{ dari: 'lain', nama: 'Salsa R.', teks: 'Ada yang mau berbagi portofolio pertamanya?' }] },
];

// Penyimpanan bersama (supaya tab "My Pesan" dan isi pesan melihat data yang sama). Disimpan di perangkat.
const cache = {};
const dimuat = {};
const pelanggan = new Set();
const kabari = () => pelanggan.forEach((f) => f());
const KOSONG = { _kontak: [], _hapus: [], _baca: {}, _draft: {} };
const ambil = (uid) => cache[uid] || KOSONG;

export const semuaThread = (p) => [...THREADS, ...(p._kontak || []).map((c) => ({ id: c.id, judul: c.judul, sub: c.sub, kunci: c.key || c.id.replace('t-p-', ''), warna: c.warna, jenis: 'orang', awal: [] }))].filter((t) => !(p._hapus || []).includes(t.id));
export const daftarPesan = (p, t) => [...t.awal, ...(p[t.id] || [])];
export const belumDibaca = (p, t) => daftarPesan(p, t).slice((p._baca || {})[t.id] || 0).filter((m) => m.dari === 'lain').length;
export const totalBelumDibaca = (p) => semuaThread(p).reduce((n, t) => n + belumDibaca(p, t), 0);

export function usePesan(uid) {
  const [, tik] = useState(0);
  useEffect(() => {
    const f = () => tik((n) => n + 1);
    pelanggan.add(f);
    if (!dimuat[uid]) {
      dimuat[uid] = true;
      (async () => {
        try {
          const raw = await AsyncStorage.getItem(`cita:pesan:${uid}`);
          if (raw) { cache[uid] = { ...KOSONG, ...JSON.parse(raw), _baca: { ...(JSON.parse(raw)._baca || {}) } }; kabari(); }
        } catch (e) { /* abaikan */ }
      })();
    }
    return () => { pelanggan.delete(f); };
  }, [uid]);
  const ubah = useCallback((fn) => {
    const next = fn(ambil(uid));
    cache[uid] = next;
    try { AsyncStorage.setItem(`cita:pesan:${uid}`, JSON.stringify(next)); } catch (e) { /* abaikan */ }
    kabari();
  }, [uid]);
  return { pesan: ambil(uid), ubah };
}
