// Semua nilai di sini PUBLIK (aman ada di aplikasi). Jangan taruh rahasia/server key di sini.
// Isi lewat file .env (lihat .env.example) dengan awalan EXPO_PUBLIC_.
import { Platform } from 'react-native';

// PENTING: Expo hanya mengganti nilai .env jika ditulis STATIS (process.env.EXPO_PUBLIC_NAMA), bukan process.env[nama].

export const firebaseConfig = {
  apiKey: (process.env.EXPO_PUBLIC_FIREBASE_API_KEY || ''),
  authDomain: (process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || ''),
  projectId: (process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || ''),
  appId: (process.env.EXPO_PUBLIC_FIREBASE_APP_ID || ''),
};

export const googleClientIds = {
  web: (process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || ''),
  android: (process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || ''),
};

// Fitur hanya tampil jika sudah dikonfigurasi, sehingga tidak ada tombol mati saat demo.
export const firebaseReady = !!(firebaseConfig.apiKey && firebaseConfig.projectId);
export const features = {
  demo: true,
  email: firebaseReady,
  // Web memakai popup Firebase (tanpa client id khusus); HP memakai client id Android.
  google: firebaseReady && (Platform.OS === 'web' ? true : !!googleClientIds.android),
  microsoft: firebaseReady && Platform.OS === 'web' && process.env.EXPO_PUBLIC_ENABLE_MICROSOFT === '1',
};

// Persona demo: id HARUS sama dengan user_id di Langflow (user budi / agus / dini).
export const demoPersonas = [
  { id: 'budi', nama: 'Budi', info: 'Operator produksi, mau pindah karier' },
  { id: 'agus', nama: 'Agus', info: 'Pemilik bengkel, ingin punya rumah' },
  { id: 'dini', nama: 'Dini', info: 'Pelajar SMA, memilih jurusan' },
];
