import React, { useState } from 'react';
import { Alert, Pressable, Switch, View } from 'react-native';
import { useApp, DEMO_USER_IDS } from '../state/AppContext';
import { findPersona } from '../state/persona';
import { FLOWS } from '../api/langflow';
import { Button, Card, Chip, ErrorBox, Field, Screen, ScreenHeader, T } from '../components/ui';
import Icon from '../components/Icon';
import { C } from '../theme';
import { rpShort } from '../utils/format';

// Warna inisial avatar per persona
const AVATAR_BG = { budi: '#E3EFEC', agus: '#FDF1DC', dini: '#E3EFEC' };
const AVATAR_FG = { budi: '#0F4C47', agus: '#9A4610', dini: '#1F6F66' };

function PersonaData({ userId, analysis, profilDraft }) {
  const persona = findPersona(userId);
  const d = analysis?.dashboard;

  // Data diri: gabungkan dari persona (statis) dan analysis/draft (dinamis)
  const nama = d?.nama || profilDraft?.nama || persona?.nama || userId;
  const usia = persona?.usia || '';
  const kota = profilDraft?.kota || persona?.kota || '';
  const status = profilDraft?.status === 'menikah' ? 'Menikah' : profilDraft?.status === 'single' ? 'Belum menikah' : '';

  // Pendidikan dari profilDraft (jika sudah isi) atau persona tidak menyimpan ini
  const pendidikan = profilDraft?.pendidikan || '';
  const skills = persona?.skills || [];

  // Pekerjaan dari profilDraft
  const pekerjaan = profilDraft?.pekerjaan?.[0] || null;

  // Target dari analisis
  const targets = analysis?.target || [];

  // Hanya tampilkan section jika ada data yang meaningful
  const showDiri = nama && (usia || kota || status);
  const showPendidikan = pendidikan || skills.length > 0;
  const showPekerjaan = pekerjaan?.nama;
  const showTujuan = targets.length > 0;

  if (!showDiri && !showPendidikan && !showPekerjaan && !showTujuan) return null;

  return (
    <>
      {showDiri ? (
        <Card style={{ gap: 10 }}>
          <T w={800} size={15}>Data diri</T>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <T size={13} color={C.muted}>Nama</T>
            <T w={700} size={13}>{nama}</T>
          </View>
          {usia ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <T size={13} color={C.muted}>Usia</T>
              <T w={700} size={13}>{usia}</T>
            </View>
          ) : null}
          {status ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <T size={13} color={C.muted}>Status</T>
              <T w={700} size={13}>{status}</T>
            </View>
          ) : null}
          {kota ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <T size={13} color={C.muted}>Domisili</T>
              <T w={700} size={13}>{kota}</T>
            </View>
          ) : null}
        </Card>
      ) : null}

      {showPendidikan ? (
        <Card style={{ gap: 10 }}>
          <T w={800} size={15}>Pendidikan & kemampuan</T>
          {pendidikan ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <T size={13} color={C.muted}>Pendidikan</T>
              <T w={700} size={13}>{pendidikan}</T>
            </View>
          ) : null}
          {skills.length > 0 ? (
            <>
              <T size={12} w={700}>Skill</T>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {skills.map((s) => (
                  <Chip key={s.nama} label={s.nama} tone="teal" />
                ))}
              </View>
            </>
          ) : null}
        </Card>
      ) : null}

      {showPekerjaan ? (
        <Card style={{ gap: 10 }}>
          <T w={800} size={15}>Pekerjaan</T>
          {pekerjaan.nama ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <T size={13} color={C.muted}>Posisi</T>
              <T w={700} size={13} style={{ textAlign: 'right', flex: 1, marginLeft: 12 }}>{pekerjaan.nama}</T>
            </View>
          ) : null}
          {pekerjaan.lamaBulan ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <T size={13} color={C.muted}>Lama bekerja</T>
              <T w={700} size={13}>{Math.floor(Number(pekerjaan.lamaBulan) / 12)} tahun {Number(pekerjaan.lamaBulan) % 12 > 0 ? `${Number(pekerjaan.lamaBulan) % 12} bulan` : ''}</T>
            </View>
          ) : null}
          {pekerjaan.penghasilan ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <T size={13} color={C.muted}>Gaji</T>
              <T w={800} size={13}>{rpShort(Number(pekerjaan.penghasilan))}/bulan</T>
            </View>
          ) : null}
        </Card>
      ) : null}

      {showTujuan ? (
        <Card style={{ gap: 10 }}>
          <T w={800} size={15}>Tujuan finansial</T>
          {targets.map((t) => (
            <View key={t.nama} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
              <T size={13} color={C.muted}>{t.nama}</T>
              <T w={700} size={13} style={{ textAlign: 'right' }}>
                {t.harga_saat_ini ? `${rpShort(t.harga_saat_ini)}` : ''}
                {t.tenggat ? ` · ${t.tenggat}` : ''}
              </T>
            </View>
          ))}
        </Card>
      ) : null}
    </>
  );
}

export default function Profil({ go, openOnboarding, onLogout }) {
  const app = useApp();
  const [form, setForm] = useState({ baseUrl: app.settings.baseUrl, apiKey: app.settings.apiKey, userId: app.settings.userId, flowIds: app.settings.flowIds || {} });
  const [advanced, setAdvanced] = useState(false);
  const [testing, setTesting] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const d = app.analysis?.dashboard;

  const userId = app.userId || '';
  const isDemoUser = DEMO_USER_IDS.includes(userId);
  const persona = findPersona(userId);
  const avatarInitial = (d?.nama || persona?.nama || userId)?.charAt(0)?.toUpperCase() || 'C';
  const avatarBg = AVATAR_BG[userId] || C.gold;
  const avatarFg = AVATAR_FG[userId] || C.ink;

  const save = (extra = {}) => {
    app.setSettings((s) => ({ ...s, ...form, ...extra, userId: (form.userId || '').trim() }));
  };

  const test = async () => {
    save(); setTesting(true); setMsg(''); setErr('');
    try {
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
    // Tombol nonaktif saat Mode demo
    if (!app.live) return;

    if (isDemoUser) {
      // Konfirmasi pertama: peringatan data contoh
      Alert.alert(
        'Hapus data contoh?',
        `Akun "${userId}" adalah pengguna contoh myCITA. Jika data di Langflow dihapus, seluruh skenario, analisis, dan tujuan akun ini akan hilang permanen dan perlu diisi ulang dari awal.`,
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Lanjutkan', style: 'destructive', onPress: () => {
              // Konfirmasi kedua: pastikan pengguna sadar
              Alert.alert(
                'Yakin menghapus data contoh?',
                `Ketik "HAPUS" untuk mengonfirmasi. Data profil, keuangan, target, dan analisis akun ${userId} akan dihapus permanen dari Langflow.`,
                [
                  { text: 'Batal', style: 'cancel' },
                  {
                    text: 'Hapus permanen', style: 'destructive', onPress: async () => {
                      try {
                        await app.deleteAllData();
                        setMsg('Semua data telah dihapus.');
                      } catch (e) { setErr(e.message); }
                    },
                  },
                ],
              );
            },
          },
        ],
      );
    } else {
      Alert.alert('Hapus semua data?', 'Profil, keuangan, target, dan hasil analisismu akan dihapus permanen dari Langflow dan HP ini.', [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus permanen', style: 'destructive', onPress: async () => {
            try { await app.deleteAllData(); setMsg('Semua data telah dihapus.'); } catch (e) { setErr(e.message); }
          },
        },
      ]);
    }
  };

  const handleLogout = () => {
    if (onLogout) { onLogout(); return; }
    app.logout();
  };

  return (
    <Screen>
      <ScreenHeader title="Profil & data" onBack={() => go('home')} />
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: avatarBg, alignItems: 'center', justifyContent: 'center' }}>
          <T w={800} size={20} color={avatarFg}>{avatarInitial}</T>
        </View>
        <View style={{ flex: 1 }}>
          <T w={800} size={17}>{d?.nama || persona?.nama || userId || 'Belum ada profil'}</T>
          <T size={13} color={C.muted}>
            {d ? `Pendapatan ${rpShort(d.pendapatan)}/bln` : (persona ? `${persona.usia} · ${persona.kota}` : 'Isi data untuk mulai')}
          </T>
        </View>
      </Card>

      {/* Data persona — ditampilkan bila ada */}
      <PersonaData userId={userId} analysis={app.analysis} profilDraft={app.profilDraft} />

      {openOnboarding ? (
        <Button label={d ? 'Ubah data keuangan' : 'Isi data keuangan'} icon="edit" variant="secondary" onPress={openOnboarding} />
      ) : null}
      <Button label="Ganti pengguna" icon="back" variant="secondary" onPress={handleLogout} />

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
          <T size={13} style={{ flex: 1, lineHeight: 20 }}>myCITA hanya menyimpan data yang dibutuhkan untuk perhitungan. Tidak ada alamat lengkap, KTP, nomor rekening, atau PIN. Data bisa dihapus kapan saja.</T>
        </View>
        {app.live ? (
          <Button label="Hapus semua data saya" icon="trash" variant="danger" onPress={confirmDelete} />
        ) : (
          <View style={{ gap: 6 }}>
            <Button label="Hapus semua data saya" icon="trash" variant="danger" onPress={() => {}} disabled />
            <T size={12} color={C.muted}>Nonaktif saat Mode demo. Matikan mode demo untuk menghapus data dari Langflow.</T>
          </View>
        )}
      </Card>

      <T size={11} color={C.muted} style={{ lineHeight: 16 }}>
        myCITA adalah alat edukasi dan perencanaan karier, usaha, dan keuangan, bukan nasihat investasi atau rekomendasi produk keuangan tertentu. Backend: Langflow · Antarmuka percakapan: IBM Bob.
      </T>
    </Screen>
  );
}
