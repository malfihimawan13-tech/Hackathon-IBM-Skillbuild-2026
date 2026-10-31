import React from 'react';
import { View, Text, Modal, Image, StyleSheet } from 'react-native';
import { Button, Logo } from './components/ui';
import { useAuth } from './AuthContext';
import { colors, radius } from './theme';

// Pemakaian: <LogoutConfirm visible={tampil} onCancel={() => setTampil(false)} />
export default function LogoutConfirm({ visible, onCancel, onDone }) {
  const { signOut, user } = useAuth();
  const keluar = async () => { await signOut(); onDone && onDone(); };
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={s.back}>
        <View style={s.card}>
          <View style={s.logo}><Logo size={22} /></View>
          <Image source={require('./assets/auth-door.png')} style={s.door} resizeMode="stretch" />
          <Text style={s.h}>Yakin ingin keluar?</Text>
          <Text style={s.sub}>Kamu akan keluar dari akun myCITA{user?.nama ? ` (${user.nama})` : ''} dan perlu masuk kembali untuk mengakses semua fitur.</Text>
          <View style={s.box}>
            <Text style={{ fontWeight: '700', color: colors.text, marginBottom: 6 }}>💡 Sebelum keluar, pastikan:</Text>
            {['Data yang sedang kamu isi sudah tersimpan.', 'Tidak ada perubahan penting yang belum disimpan.',
              user?.demo ? 'Akun demo bisa dimasuki lagi kapan saja tanpa kata sandi.' : 'Kamu masih ingat email dan kata sandi untuk masuk kembali.']
              .map((t) => <Text key={t} style={{ color: colors.muted, marginBottom: 4 }}>✓ {t}</Text>)}
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Button title="Batal" kind="outline" onPress={onCancel} style={{ flex: 1, marginRight: 8 }} />
            <Button title="↪  Ya, Logout" kind="danger" onPress={keluar} style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
const s = StyleSheet.create({
  back: { flex: 1, backgroundColor: 'rgba(16,35,26,0.55)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: radius.lg, paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12, width: '100%', maxWidth: 480, overflow: 'hidden' },
  logo: { position: 'absolute', top: 14, left: 20, zIndex: 2 },
  door: { width: '100%', aspectRatio: 610 / 475, marginBottom: -10 },
  h: { fontSize: 28, fontWeight: '800', color: colors.text, textAlign: 'center', marginTop: 8 },
  sub: { color: colors.muted, textAlign: 'center', marginTop: 6, marginBottom: 16 },
  box: { backgroundColor: colors.mint, borderRadius: radius.sm, padding: 14, marginBottom: 18 },
});
