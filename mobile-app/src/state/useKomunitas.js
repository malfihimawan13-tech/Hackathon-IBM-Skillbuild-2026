import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { POSTS_AWAL } from '../api/komunitasData';

const KEY = 'cita:komunitas:v2';
const KOSONG = { posts: [], suka: {}, komentar: {}, ikuti: {}, gabung: {}, minta: {}, bagikan: {}, putus: {}, riwayat: [] };

// Penyimpanan bersama (satu salinan per pengguna) supaya semua komponen melihat data yang sama.
// Disimpan di penyimpanan lokal perangkat (bukan server).
const cache = {};
const dimuat = {};
const pelanggan = new Set();
const kabari = () => pelanggan.forEach((f) => f());
const ambil = (uid) => cache[uid] || KOSONG;

function simpan(uid, next) {
  cache[uid] = next;
  try {
    AsyncStorage.setItem(`${KEY}:${uid}`, JSON.stringify({ ...next, posts: next.posts.map((p) => ({ ...p, lampiran: (p.lampiran || []).map(({ jenis, nama }) => ({ jenis, nama })) })) }));
  } catch (e) { /* abaikan */ }
  kabari();
}

export function useKomunitas(uid) {
  const [, tik] = useState(0);
  useEffect(() => {
    const f = () => tik((n) => n + 1);
    pelanggan.add(f);
    if (!dimuat[uid]) {
      dimuat[uid] = true;
      (async () => {
        try {
          const raw = await AsyncStorage.getItem(`${KEY}:${uid}`);
          if (raw) { cache[uid] = { ...KOSONG, ...JSON.parse(raw) }; kabari(); }
        } catch (e) { /* abaikan */ }
      })();
    }
    return () => { pelanggan.delete(f); };
  }, [uid]);
  const ubah = useCallback((fn) => simpan(uid, fn(ambil(uid))), [uid]);
  const s = ambil(uid);
  return { s, ubah, posts: [...s.posts, ...POSTS_AWAL] };
}
