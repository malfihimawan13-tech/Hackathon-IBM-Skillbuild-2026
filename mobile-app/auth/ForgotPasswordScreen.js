import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import AuthLayout from './components/AuthLayout';
import { slides, slideRatio } from './slides';
import { Button, Field, Notice } from './components/ui';
import { useAuth } from './AuthContext';
import { colors, radius } from './theme';

// Halaman "Lupa kata sandi": tampilan sama dengan Masuk/Daftar, isi formulir berbeda.
export default function ForgotPasswordScreen({ onGoLogin, onGoRegister }) {
  const { features, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [galat, setGalat] = useState('');
  const [terkirim, setTerkirim] = useState(false);

  const kirim = async () => {
    setGalat('');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setGalat('Masukkan alamat email yang valid.');
    if (!features.email) return setGalat('Atur ulang kata sandi belum diaktifkan di versi ini. Gunakan akun demo di halaman masuk.');
    setBusy(true); const r = await resetPassword(email); setBusy(false);
    r.ok ? setTerkirim(true) : setGalat(r.pesan);
  };

  return (
    <AuthLayout boxed panelImage={slides} panelRatio={slideRatio} title={'Lupa Kata Sandi?'}
      subtitle="Tenang, kami bantu kamu masuk kembali ke myCITA."
      below={
        <View style={s.safe}>
          <View style={s.shield}><Text style={{ color: colors.green }}>🛡</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '700', color: colors.green }}>Tetap Aman</Text>
            <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>Tautan atur ulang hanya dikirim ke email yang terdaftar dan berlaku sementara. Jangan bagikan tautan itu kepada siapa pun.</Text>
          </View>
        </View>
      }
      topRight={<Text style={s.foot}>Ingat kata sandi? <Text style={s.link} onPress={onGoLogin}>Masuk →</Text></Text>}
      footer={<Text style={[s.foot, { marginTop: 16 }]}>Ingat kata sandi? <Text style={s.link} onPress={onGoLogin}>Masuk →</Text></Text>}>
      {!terkirim ? (
        <>
          <View style={s.badge}><Text style={{ fontSize: 26 }}>🔑</Text></View>
          <Text style={s.h}>Lupa Kata Sandi?</Text>
          <Text style={s.sub}>Masukkan email akun myCITA kamu. Kami akan mengirim tautan untuk membuat kata sandi baru.</Text>
          {galat ? <Notice tone="error">{galat}</Notice> : null}
          <Field label="Email" icon="✉" placeholder="contoh@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" onSubmitEditing={kirim} />
          <Button title="Kirim Tautan Atur Ulang  →" onPress={kirim} loading={busy} style={{ marginTop: 8 }} />
          <Pressable onPress={onGoLogin} style={s.back} accessibilityRole="button">
            <Text style={{ color: colors.green, fontWeight: '700' }}>← Kembali ke Masuk</Text>
          </Pressable>
        </>
      ) : (
        <>
          <View style={[s.badge, { backgroundColor: colors.greenSoft }]}><Text style={{ fontSize: 26 }}>✉️</Text></View>
          <Text style={s.h}>Cek Email Kamu</Text>
          <Text style={s.sub}>Kami sudah mengirim tautan atur ulang kata sandi ke{'\n'}<Text style={{ fontWeight: '700', color: colors.text }}>{email.trim()}</Text></Text>
          <Notice>Belum masuk? Periksa folder Spam atau Promosi. Tautan berlaku untuk waktu terbatas.</Notice>
          <Button title="Kembali ke Masuk" onPress={onGoLogin} style={{ marginTop: 8 }} />
          <Pressable onPress={() => { setTerkirim(false); setGalat(''); }} style={s.back} accessibilityRole="button">
            <Text style={{ color: colors.green, fontWeight: '700' }}>Kirim ulang ke email lain</Text>
          </Pressable>
        </>
      )}
    </AuthLayout>
  );
}
const s = StyleSheet.create({
  h: { fontSize: 24, fontWeight: '800', color: colors.text, textAlign: 'center' },
  sub: { color: colors.muted, textAlign: 'center', marginTop: 6, marginBottom: 18, lineHeight: 20 },
  badge: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#fff4d6', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 12 },
  link: { color: colors.green, fontWeight: '600', textDecorationLine: 'underline' },
  foot: { textAlign: 'center', marginTop: 18, color: colors.text },
  back: { alignItems: 'center', paddingVertical: 14 },
  safe: { marginTop: 16, backgroundColor: colors.greenSoft, borderRadius: radius.sm, padding: 12, flexDirection: 'row' },
  shield: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#d7efe2', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
});
