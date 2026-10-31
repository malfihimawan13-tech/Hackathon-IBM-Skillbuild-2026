# Modul Auth myCITA

Isi: layar **Masuk**, **Daftar** (3 langkah), dan **Konfirmasi Keluar**, plus proses login:
- **Akun demo** (Budi, Agus, Dini): tanpa kata sandi, id `budi`/`agus`/`dini` sama dengan `user_id` di Langflow.
- **Email dan kata sandi** (Firebase Authentication), termasuk "Lupa kata sandi?" dan "Ingat saya".
- **Google** (semua akun Google, bila status OAuth "In production").
- **Microsoft** hanya versi web dan hanya jika `EXPO_PUBLIC_ENABLE_MICROSOFT=1`. Apple tidak disediakan.
Tombol hanya muncul jika fiturnya sudah dikonfigurasi, jadi tidak ada tombol mati.

## 1. Pasang paket
```
npx expo install firebase @react-native-async-storage/async-storage expo-auth-session expo-web-browser expo-crypto
```
Salin folder `auth/` ke proyek (mis. `src/auth/`). Salin `.env.example` menjadi `.env` di akar proyek.
Pastikan `.env` ada di `.gitignore`. PENTING: nilai `.env` dipakai Expo hanya jika ditulis statis (sudah dilakukan di `config.js`).

## 2. Pakai di aplikasi
```jsx
import { AuthProvider, AuthGate, LogoutConfirm, useAuth } from './auth';

export default function Root() {
  return (
    <AuthProvider>
      <AuthGate>
        <AplikasiKamu />
      </AuthGate>
    </AuthProvider>
  );
}
```
Tombol keluar di aplikasi:
```jsx
const [tampil, setTampil] = useState(false);
<Button title="Keluar" onPress={() => setTampil(true)} />
<LogoutConfirm visible={tampil} onCancel={() => setTampil(false)} />
```

## 3. Sambungkan ke Langflow
Di tempat aplikasi membuat pesan ke Langflow, pakai ID dari login:
```jsx
const { userId } = useAuth();
const pesanKeLangflow = `user ${userId}: ${teksPengguna}`;
```
Untuk akun demo ID-nya `budi`, `agus`, `dini`. Untuk akun asli ID-nya `u_<kode>` yang unik per orang, sehingga data profil dan keuangan tersimpan terpisah.
Catatan: pengguna baru perlu mengisi profil, keuangan, dan target terlebih dahulu (alur Langflow 1-3), karena belum ada datanya.

## 4. Firebase dan Google (sekitar 30-60 menit)
1. console.firebase.google.com: buat proyek. Di Project settings tambahkan aplikasi **Web**, salin 4 nilai config ke `.env`.
2. Authentication > Sign-in method: aktifkan **Email/Password** dan **Google**.
3. Authentication > Settings > Authorized domains: tambahkan domain Netlify kamu.
4. Google Cloud Console > APIs & Services > OAuth consent screen: User type **External**, isi nama aplikasi dan email, lalu **Publish app** (status "In production") agar semua akun Google dapat masuk. Jika dibiarkan "Testing", hanya akun penguji yang bisa masuk.
5. Credentials: Client ID **Web** (Firebase membuatnya otomatis; salin ke `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`) dan Client ID **Android** (package name aplikasi + SHA-1 dari build EAS: `eas credentials`) untuk `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`.
6. Bangun ulang web (Netlify) dan APK (EAS). Login Google tidak bekerja di Expo Go.

## 5. Microsoft (opsional, web)
Azure Portal > Microsoft Entra ID > App registrations > New registration (accounts in any directory and personal accounts). Tambahkan redirect URI dari Firebase (Authentication > Sign-in method > Microsoft). Masukkan Application (client) ID dan secret ke Firebase (bukan ke aplikasi). Lalu `EXPO_PUBLIC_ENABLE_MICROSOFT=1`.

## Keamanan
- Nilai Firebase dan Client ID bersifat publik. Jangan menaruh secret, service account, atau kunci Langflow/Gemini di aplikasi.
- Kata sandi dikelola Firebase dan tidak disimpan dalam bentuk asli. Jangan menulis klaim keamanan lain di layar yang belum dapat dibuktikan.
- Akun demo hanya berisi data contoh.
