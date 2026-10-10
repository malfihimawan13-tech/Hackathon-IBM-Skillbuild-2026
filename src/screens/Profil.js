import React, { useState } from 'react';
import { Alert, Pressable, Switch, View } from 'react-native';
import { useApp } from '../state/AppContext';
import { FLOWS } from '../api/langflow';
import { Button, Card, ErrorBox, Field, Screen, ScreenHeader, T } from '../components/ui';
import Icon from '../components/Icon';
import { C } from '../theme';
import { rpShort } from '../utils/format';

export default function Profil({ go, openOnboarding }) {
  const app = useApp();
  const [form, setForm] = useState({ baseUrl: app.settings.baseUrl, apiKey: app.settings.apiKey, userId: app.settings.userId, flowIds: app.settings.flowIds || {} });
  const [advanced, setAdvanced] = useState(false);
  const [testing, setTesting] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const d = app.analysis?.dashboard;

  const save = (extra = {}) => {
    app.setSettings((s) => ({ ...s, ...form, ...extra, userId: (form.userId || '').trim() }));
  };

  const test = async () => {
    save(); setTesting(true); setMsg(''); setErr('');
    try {
      // pakai nilai form terbaru tanpa menunggu state tersimpan
      const res = await app.testConnection({ ...app.settings, ...form });
      setMsg(res);
    } catch (e) { setErr(e.message); }
    setTesting(false);
  };

  const toggleDemo = (demo) => {
    if (!demo && !form.baseUrl.trim()) { setErr('Isi alamat Langflow dulu sebelum mematikan mode demo.'); return; }
    save({ demo });
    setMsg(demo ? 'Mode demo aktif.' : 'Terhubung ke Langflow. Tarik ke bawah di beranda untuk memuat datamu.');
  };

  const confirmDelete = () => {
    Alert.alert('Hapus semua data?', app.live
      ? 'Profil, keuangan, target, dan hasil analisismu akan dihapus permanen dari Langflow dan HP ini.'
      : 'Data di HP ini akan dihapus.', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus permanen', style: 'destructive', onPress: async () => {
        try { await app.deleteAllData(); setMsg('Semua data telah dihapus.'); } catch (e) { setErr(e.message); }
      } },
    ]);
  };

  return (
    <Screen>
      <ScreenHeader title="Profil" onBack={() => go('home')} />
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center' }}>
          <T w={800} size={20}>{(d?.nama || 'C').charAt(0)}</T>
        </View>
        <View style={{ flex: 1 }}>
          <T w={800} size={17}>{d?.nama || 'Belum ada profil'}</T>
          <T size={13} color={C.muted}>{d ? `Pendapatan ${rpShort(d.pendapatan)}/bln · user ${app.settings.userId || '-'}` : 'Isi data untuk mulai'}</T>
        </View>
      </Card>
      <Button label={d ? 'Ubah data keuangan' : 'Isi data keuangan'} icon="edit" variant="secondary" onPress={openOnboarding} />

      <T w={800} size={16} style={{ marginTop: 6 }}>Koneksi Langflow</T>
      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <T w={700} size={14}>Mode demo</T>
            <T size={12} color={C.muted}>Pakai data contoh tanpa server. Matikan untuk memakai Langflow.</T>
          </View>
          <Switch value={app.settings.demo} onValueChange={toggleDemo} trackColor={{ true: C.teal, false: C.line }} thumbColor={C.white}
            accessibilityLabel="Mode demo" />
        </View>
        <Field label="Alamat Langflow" value={form.baseUrl} onChangeText={(v) => setForm({ ...form, baseUrl: v })} autoCapitalize="none"
          placeholder="http://192.168.1.10:7860 atau https://xxxx.ngrok-free.app" keyboardType="url"
          hint="Alamat IP laptop di Wi-Fi yang sama, atau alamat ngrok." />
        <Field label="API key Langflow" value={form.apiKey} onChangeText={(v) => setForm({ ...form, apiKey: v })} secure autoCapitalize="none"
          placeholder="sk-..." hint="Buat di Langflow: Settings → Langflow API Keys." />
        <Field label="User ID" value={form.userId} onChangeText={(v) => setForm({ ...form, userId: v })} autoCapitalize="none"
          placeholder="budi" hint="Samakan dengan user_id saat bertanya ke Bob." />
        <Pressable onPress={() => setAdvanced(!advanced)} accessibilityRole="button">
          <T w={700} size={13} color={C.teal}>{advanced ? 'Sembunyikan pengaturan lanjutan' : 'Pengaturan lanjutan: Flow ID'}</T>
        </Pressable>
        {advanced ? (
          <View style={{ gap: 10 }}>
            <T size={12} color={C.muted}>Kosongkan untuk memakai Endpoint Name bawaan. Isi Flow ID jika endpoint name tidak diatur.</T>
            {Object.entries(FLOWS).map(([key, name]) => (
              <Field key={key} label={name} value={form.flowIds[key] || ''} autoCapitalize="none" placeholder={name}
                onChangeText={(v) => setForm({ ...form, flowIds: { ...form.flowIds, [key]: v.trim() } })} />
            ))}
          </View>
        ) : null}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button label="Simpan" variant="secondary" onPress={() => { save(); setMsg('Pengaturan tersimpan.'); setErr(''); }} style={{ flex: 1 }} />
          <Button label="Tes koneksi" icon="link" onPress={test} loading={testing} style={{ flex: 1 }} />
        </View>
        {msg ? <T size={13} color={C.teal}>{msg}</T> : null}
      </Card>
      <ErrorBox message={err} />

      <T w={800} size={16} style={{ marginTop: 6 }}>Privasi</T>
      <Card style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Icon name="shield" size={20} color={C.teal} />
          <T size={13} style={{ flex: 1, lineHeight: 20 }}>myCITA hanya menyimpan data yang dibutuhkan untuk perhitungan. Tidak ada alamat lengkap, KTP, nomor rekening, atau PIN.</T>
        </View>
        <Button label="Hapus semua data saya" icon="trash" variant="danger" onPress={confirmDelete} />
      </Card>

      <T size={11} color={C.muted} style={{ lineHeight: 16 }}>
        myCITA adalah alat edukasi dan perencanaan karier, usaha, dan keuangan, bukan nasihat investasi atau rekomendasi produk keuangan tertentu. Backend: Langflow · Antarmuka percakapan: IBM Bob.
      </T>
    </Screen>
  );
}
