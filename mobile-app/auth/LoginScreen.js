import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import AuthLayout from './components/AuthLayout';
import { slides, slideRatio } from './slides';
import { Button, Field, Divider, SocialButton, Notice } from './components/ui';
import { useAuth } from './AuthContext';
import { demoPersonas } from './config';
import { colors, radius } from './theme';

export default function LoginScreen({ onGoRegister, onGoForgot }) {
  const { features, signInDemo, signInEmail, signInGoogle, signInMicrosoft, resetPassword } = useAuth();
  const [email, setEmail] = useState(''); const [sandi, setSandi] = useState('');
  const [ingat, setIngat] = useState(true); const [busy, setBusy] = useState(false);
  const [galat, setGalat] = useState(''); const [demoBuka, setDemoBuka] = useState(false); const [info, setInfo] = useState('');

  const jalan = async (fn) => { setGalat(''); setInfo(''); setBusy(true); const r = await fn(); setBusy(false); if (r && !r.ok) setGalat(r.pesan); };
  const masuk = () => {
    if (!features.email) return setGalat('Login email belum diaktifkan di versi ini. Gunakan akun demo di bawah.');
    if (!email || !sandi) return setGalat('Isi email dan kata sandi.');
    jalan(() => signInEmail(email, sandi, ingat));
  };
  const lupa = () => onGoForgot && onGoForgot();
  const sosial = true;
  const belum = (nama) => () => setGalat(`Login ${nama} belum diaktifkan di versi ini. Gunakan akun demo di bawah.`);

  return (
    <AuthLayout boxed panelImage={slides} panelRatio={slideRatio} title={'Satu Langkah\nLebih Dekat\nuntuk Masa Depanmu'}
      subtitle="Masuk ke myCITA dan lanjutkan perjalananmu menuju karier, bisnis, keuangan, dan kehidupan yang lebih baik."
      below={
      <View style={s.safe}>
        <View style={s.shield}><Text style={{ color: colors.green }}>🛡</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '700', color: colors.green }}>Akunmu Aman Bersama Kami</Text>
          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>Data pribadi kamu dilindungi dengan standar keamanan terbaik.</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
            {['Enkripsi data', 'Autentikasi aman', 'Privasi terjamin'].map((x) => <Text key={x} style={s.chk}>✓ {x}</Text>)}
          </View>
        </View>
      </View>
      }
      topRight={<Text style={s.foot}>Belum punya akun? <Text style={s.link} onPress={onGoRegister}>Daftar Sekarang →</Text></Text>}
      footer={<Text style={[s.foot, { marginTop: 16 }]}>Belum punya akun? <Text style={s.link} onPress={onGoRegister}>Daftar Sekarang →</Text></Text>}>
      <Text style={s.h}>Selamat Datang Kembali</Text>
      <Text style={s.sub}>Masuk ke akun myCITA kamu untuk melanjutkan perjalanan menuju impianmu.</Text>
      <View style={s.tabs}>
        <View style={[s.tab, s.tabOn]}><Text style={s.tabOnT}>Masuk</Text></View>
        <Pressable style={s.tab} onPress={onGoRegister}><Text style={s.tabT}>Daftar</Text></Pressable>
      </View>

      {galat ? <Notice tone="error">{galat}</Notice> : null}
      {info ? <Notice>{info}</Notice> : null}

      {true ? (
        <>
          <Field label="Email atau Nomor Telepon" icon="✉" placeholder="contoh@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <Field label="Kata Sandi" icon="🔒" secure placeholder="Masukkan kata sandi" value={sandi} onChangeText={setSandi} onSubmitEditing={masuk} />
          <View style={s.row}>
            <Pressable onPress={() => setIngat(!ingat)} style={s.row}>
              <View style={[s.cb, ingat && { backgroundColor: colors.green, borderColor: colors.green }]}>{ingat ? <Text style={{ color: '#fff', fontSize: 12 }}>✓</Text> : null}</View>
              <Text style={{ color: colors.text }}>Ingat saya</Text>
            </Pressable>
            <Text style={s.link} onPress={lupa}>Lupa kata sandi?</Text>
          </View>
          <Button title="Masuk ke myCITA  →" onPress={masuk} loading={busy} style={{ marginTop: 16 }} />
        </>
      ) : null}

      {sosial ? (
        <>
          <Divider text="atau masuk dengan" />
          <View style={{ flexDirection: 'row', marginHorizontal: -4 }}>
            <SocialButton kind="google" onPress={features.google ? () => jalan(signInGoogle) : belum('Google')} />
            <SocialButton kind="microsoft" onPress={features.microsoft ? () => jalan(signInMicrosoft) : belum('Microsoft')} />
          </View>
        </>
      ) : null}

      {features.demo ? (
        <>
          <Pressable onPress={() => setDemoBuka(!demoBuka)} style={s.demoHead} accessibilityRole="button">
            <Text style={{ color: colors.green, fontWeight: '700' }}>Coba dengan akun demo</Text>
            <Text style={{ color: colors.green, fontSize: 14 }}>{demoBuka ? '▲' : '▼'}</Text>
          </Pressable>
          {demoBuka ? demoPersonas.map((p) => (
            <Pressable key={p.id} onPress={() => signInDemo(p.id)} style={({ pressed }) => [s.demo, pressed && { opacity: 0.85 }]} accessibilityRole="button">
              <View style={s.av}><Text style={{ color: colors.green, fontWeight: '800' }}>{p.nama[0]}</Text></View>
              <View style={{ flex: 1 }}><Text style={{ fontWeight: '700', color: colors.text }}>Masuk sebagai {p.nama}</Text><Text style={{ color: colors.muted, fontSize: 12 }}>{p.info}</Text></View>
              <Text style={{ color: colors.green, fontSize: 18 }}>→</Text>
            </Pressable>
          )) : null}
        </>
      ) : null}

    </AuthLayout>
  );
}
const s = StyleSheet.create({
  h: { fontSize: 24, fontWeight: '800', color: colors.text, textAlign: 'center' },
  sub: { color: colors.muted, textAlign: 'center', marginTop: 6, marginBottom: 18 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cb: { width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  link: { color: colors.green, fontWeight: '600', textDecorationLine: 'underline' },
  foot: { textAlign: 'center', marginTop: 18, color: colors.text },
  demo: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: 12, marginBottom: 8, backgroundColor: colors.mint },
  av: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  safe: { marginTop: 16, backgroundColor: colors.greenSoft, borderRadius: radius.sm, padding: 12, flexDirection: 'row' },
  shield: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#d7efe2', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  chk: { color: colors.green, fontSize: 11, marginRight: 12, marginBottom: 2 },
  demoHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, marginBottom: 10, paddingVertical: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, backgroundColor: colors.mint },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.border, marginBottom: 18 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  tabOn: { borderBottomWidth: 2, borderColor: colors.green, marginBottom: -1 },
  tabOnT: { color: colors.green, fontWeight: '700' }, tabT: { color: colors.muted },
});
