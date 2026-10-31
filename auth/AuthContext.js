import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile,
  sendEmailVerification, sendPasswordResetEmail, signOut as fbSignOut,
  GoogleAuthProvider, OAuthProvider, signInWithPopup, signInWithCredential,
} from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { getFirebaseAuth, setRemember } from './firebase';
import { googleClientIds, demoPersonas, features } from './config';

WebBrowser.maybeCompleteAuthSession();
const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);
const DEMO_KEY = 'mycita_demo_user';

// ID pengguna yang dikirim ke Langflow ("user <id>: ..."): huruf kecil, angka, garis bawah saja.
const slug = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 24);
const fromFirebase = (u) => ({
  id: 'u_' + slug(u.uid), nama: u.displayName || (u.email || '').split('@')[0] || 'Pengguna',
  email: u.email || '', demo: false, emailTerverifikasi: !!u.emailVerified, provider: u.providerData?.[0]?.providerId || 'password',
});
const pesanGalat = (e) => {
  const k = e?.code || '';
  if (k.includes('invalid-credential') || k.includes('wrong-password') || k.includes('user-not-found')) return 'Email atau kata sandi salah.';
  if (k.includes('email-already-in-use')) return 'Email ini sudah terdaftar. Silakan masuk.';
  if (k.includes('weak-password')) return 'Kata sandi minimal 8 karakter.';
  if (k.includes('invalid-email')) return 'Format email tidak valid.';
  if (k.includes('popup-closed') || k.includes('cancelled')) return 'Proses masuk dibatalkan.';
  if (k.includes('network')) return 'Koneksi bermasalah. Coba lagi.';
  if (k.includes('too-many-requests')) return 'Terlalu banyak percobaan. Coba beberapa menit lagi.';
  return 'Terjadi kendala. Coba lagi.';
};

export function AuthProvider({ children }) {
  const auth = getFirebaseAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Google di HP/web lewat id_token. clientId palsu mencegah error saat belum dikonfigurasi.
  const [, gResponse, gPrompt] = Google.useIdTokenAuthRequest({
    webClientId: googleClientIds.web || 'belum-diisi', androidClientId: googleClientIds.android || 'belum-diisi',
  });

  useEffect(() => {
    let batal = false;
    (async () => {
      try {
        const d = await AsyncStorage.getItem(DEMO_KEY);
        if (d && !batal) { setUser(JSON.parse(d)); setLoading(false); }
      } catch {}
    })();
    if (!auth) { setLoading(false); return () => { batal = true; }; }
    const off = onAuthStateChanged(auth, (u) => {
      if (u) setUser(fromFirebase(u));
      else setUser((cur) => (cur && cur.demo ? cur : null));
      setLoading(false);
    });
    return () => { batal = true; off(); };
  }, [auth]);

  useEffect(() => {
    if (gResponse?.type === 'success' && auth) {
      const idToken = gResponse.params?.id_token;
      if (idToken) signInWithCredential(auth, GoogleAuthProvider.credential(idToken)).catch(() => {});
    }
  }, [gResponse, auth]);

  const signInDemo = useCallback(async (id) => {
    const p = demoPersonas.find((x) => x.id === id);
    if (!p) return;
    const u = { id: p.id, nama: p.nama, email: '', demo: true, emailTerverifikasi: true, provider: 'demo' };
    await AsyncStorage.setItem(DEMO_KEY, JSON.stringify(u));
    setUser(u);
  }, []);

  const wrap = (fn) => async (...a) => { try { await fn(...a); return { ok: true }; } catch (e) { return { ok: false, pesan: pesanGalat(e) }; } };

  const signInEmail = wrap(async (email, sandi, ingat = true) => {
    await setRemember(auth, ingat); await signInWithEmailAndPassword(auth, email.trim(), sandi);
  });
  const signUpEmail = wrap(async (nama, email, sandi) => {
    if (sandi.length < 8) { const e = new Error('lemah'); e.code = 'auth/weak-password'; throw e; }
    const c = await createUserWithEmailAndPassword(auth, email.trim(), sandi);
    if (nama) await updateProfile(c.user, { displayName: nama.trim() });
    try { await sendEmailVerification(c.user); } catch {}
    setUser(fromFirebase({ ...c.user, displayName: nama.trim() }));
  });
  const resetPassword = wrap(async (email) => { await sendPasswordResetEmail(auth, email.trim()); });
  const signInGoogle = wrap(async () => {
    if (Platform.OS === 'web') await signInWithPopup(auth, new GoogleAuthProvider());
    else await gPrompt();
  });
  const signInMicrosoft = wrap(async () => {
    const p = new OAuthProvider('microsoft.com'); p.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(auth, p);
  });
  const signOut = useCallback(async () => {
    try { await AsyncStorage.removeItem(DEMO_KEY); } catch {}
    try { if (auth) await fbSignOut(auth); } catch {}
    setUser(null);
  }, [auth]);

  const value = useMemo(() => ({
    user, userId: user?.id || null, loading, features,
    signInDemo, signInEmail, signUpEmail, resetPassword, signInGoogle, signInMicrosoft, signOut,
  }), [user, loading, signInDemo, signOut]); // eslint-disable-line react-hooks/exhaustive-deps
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
