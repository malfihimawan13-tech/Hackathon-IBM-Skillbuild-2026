import { Platform } from 'react-native';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth, initializeAuth, getReactNativePersistence,
  browserLocalPersistence, browserSessionPersistence, setPersistence,
} from 'firebase/auth';
import { firebaseConfig, firebaseReady } from './config';

let _auth = null;
export function getFirebaseAuth() {
  if (!firebaseReady) return null;
  if (_auth) return _auth;
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  if (Platform.OS === 'web') {
    _auth = getAuth(app);
  } else {
    // eslint-disable-next-line global-require
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    try { _auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) }); }
    catch { _auth = getAuth(app); }
  }
  return _auth;
}

// "Ingat saya": di web pilih penyimpanan lokal atau sesi. Di HP sesi selalu disimpan.
export async function setRemember(auth, remember) {
  if (Platform.OS !== 'web' || !auth) return;
  await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
}
