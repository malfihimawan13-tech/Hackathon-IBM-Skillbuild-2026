import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import AuthLayout from './components/AuthLayout';
import { slides, slideRatio } from './slides';
import { Logo, Button, Field, Divider, SocialButton, Stepper, Notice } from './components/ui';
import { useAuth } from './AuthContext';
import { colors } from './theme';

export default function RegisterScreen({ onGoLogin, onDone }) {
  const { features, signUpEmail, signInGoogle, signInMicrosoft, user } = useAuth();
  const [step, setStep] = useState(1);
  const [nama, setNama] = useState(''); const [email, setEmail] = useState(''); const [sandi, setSandi] = useState('');
  const [busy, setBusy] = useState(false); const [galat, setGalat] = useState(''); const [er, setEr] = useState({});

  const validasi = () => {
    const e = {};
    if (nama.trim().length < 2) e.nama = 'Nama minimal 2 karakter.';
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = 'Format email tidak valid.';
    if (sandi.length < 8) e.sandi = 'Kata sandi minimal 8 karakter.';
    setEr(e); return Object.keys(e).length === 0;
  };
  const daftar = async () => {
    setGalat(''); if (!features.email) return setGalat('Pendaftaran email belum diaktifkan di versi ini. Gunakan akun demo di halaman masuk.'); if (!validasi()) return;
    setBusy(true); const r = await signUpEmail(nama, email, sandi); setBusy(false);
    r.ok ? setStep(2) : setGalat(r.pesan);
  };
  const sosial = async (fn) => { setGalat(''); setBusy(true); const r = await fn(); setBusy(false); if (!r.ok) setGalat(r.pesan); };

  return (
    <AuthLayout boxed panelImage={slides} panelRatio={slideRatio} title={'Mulai Perjalanan\nMasa Depanmu\ndi myCITA'}
      subtitle="Daftar gratis dan dapatkan rekomendasi karier, pembelajaran, bisnis, dan keuangan yang sesuai dengan minatmu."
      bullets={['Temukan peluang sesuai minatmu', 'Bandingkan jalur karier dan usaha', 'Lihat berapa lama targetmu tercapai', 'Rencanakan masa depan lebih terarah']}
      topRight={<Text style={s.foot}>Sudah punya akun? <Text style={s.link} onPress={onGoLogin}>Masuk di sini →</Text></Text>}
      footer={<Text style={s.foot}>Sudah punya akun? <Text style={s.link} onPress={onGoLogin}>Masuk di sini</Text></Text>}>
      <Stepper step={step} />
      {step === 1 ? (
        <>
          <Text style={s.h}>Buat Akun myCITA</Text>
          <Text style={s.sub}>Daftar gratis dan mulai jelajahi peluang untuk masa depanmu.</Text>
          {galat ? <Notice tone="error">{galat}</Notice> : null}
          {true ? (
            <>
              <Field label="Nama Lengkap" icon="👤" placeholder="Masukkan nama lengkap kamu" value={nama} onChangeText={setNama} error={er.nama} />
              <Field label="Email" icon="✉" placeholder="nama@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" error={er.email} />
              <Field label="Kata Sandi" icon="🔒" secure placeholder="Buat kata sandi (minimal 8 karakter)" value={sandi} onChangeText={setSandi} error={er.sandi} />
              <Button title="Lanjutkan  →" onPress={daftar} loading={busy} />
            </>
          ) : <Notice>Pendaftaran email belum diaktifkan di versi ini. Gunakan akun demo di halaman masuk.</Notice>}
          {true ? (
            <>
              <Divider text="atau daftar dengan" />
              <View style={{ flexDirection: 'row', marginHorizontal: -4 }}>
                <SocialButton kind="google" onPress={features.google ? () => sosial(signInGoogle) : () => setGalat('Daftar dengan Google belum diaktifkan di versi ini.')} />
                <SocialButton kind="microsoft" onPress={features.microsoft ? () => sosial(signInMicrosoft) : () => setGalat('Daftar dengan Microsoft belum diaktifkan di versi ini.')} />
              </View>
            </>
          ) : null}
          <Text style={s.legal}>Dengan mendaftar, kamu menyetujui Syarat dan Ketentuan serta Kebijakan Privasi myCITA.</Text>
        </>
      ) : null}
      {step === 2 ? (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 40 }}>✉️</Text>
          <Text style={s.h}>Cek email kamu</Text>
          <Text style={s.sub}>Kami mengirim tautan konfirmasi ke {email}. Kamu bisa langsung melanjutkan; konfirmasi email bisa dilakukan kapan saja.</Text>
          <Button title="Lanjutkan  →" onPress={() => setStep(3)} style={{ alignSelf: 'stretch' }} />
        </View>
      ) : null}
      {step === 3 ? (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 40 }}>🎉</Text>
          <Text style={s.h}>Akun siap, {user?.nama || nama}!</Text>
          <Text style={s.sub}>Sekarang isi profil singkatmu agar rekomendasi sesuai dengan kondisimu.</Text>
          <Button title="Mulai Sekarang  →" onPress={onDone} style={{ alignSelf: 'stretch' }} />
        </View>
      ) : null}
    </AuthLayout>
  );
}
const s = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 40, paddingVertical: 12, borderBottomWidth: 1, borderColor: colors.border, backgroundColor: '#fff' },
  nb: { borderWidth: 1, borderColor: colors.green, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 8, marginLeft: 10 },
  nbOn: { backgroundColor: colors.green }, nbT: { color: colors.green, fontWeight: '700' },
  h: { fontSize: 26, fontWeight: '800', color: colors.text, textAlign: 'left' },
  sub: { color: colors.muted, textAlign: 'left', marginTop: 6, marginBottom: 18 },
  link: { color: colors.green, fontWeight: '600', textDecorationLine: 'underline' },
  foot: { textAlign: 'center', marginTop: 18, color: colors.text },
  legal: { textAlign: 'center', color: colors.muted, fontSize: 12, marginTop: 16 },
});
