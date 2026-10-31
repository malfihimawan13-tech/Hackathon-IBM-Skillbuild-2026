import React, { useState } from 'react';
import { Alert, Pressable, Switch, View } from 'react-native';
import { useApp, DEMO_USER_IDS } from '../state/AppContext';
import { findPersona } from '../state/persona';
import { FLOWS } from '../api/langflow';
import { Button, Card, ErrorBox, Field, Screen, ScreenHeader, T } from '../components/ui';
import Icon from '../components/Icon';
import { C } from '../theme';

// Warna inisial avatar per persona
const AVATAR_BG = { budi: '#E3EFEC', agus: '#FDF1DC', dini: '#E3EFEC' };
const AVATAR_FG = { budi: '#0F4C47', agus: '#9A4610', dini: '#1F6F66' };

function Row({ label, value }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
      <T size={13} color={C.muted}>{label}</T>
      <T w={700} size={13} style={{ textAlign: 'right', flexShrink: 1, marginLeft: 12 }}>{value}</T>
    </View>
  );
}

function PersonaData({ userId }) {
  const persona = findPersona(userId);
  if (!persona) return null;
  const p = persona.profil;

  // ── BUDI ──────────────────────────────────────────────────────────
  if (userId === 'budi') {
    const pekerjaan = p?.pekerjaan?.[0];
    const lamaKerja = pekerjaan?.lama_kerja_bulan;
    const lamaStr = lamaKerja ? `${Math.floor(lamaKerja / 12)} tahun` : null;
    return (
      <>
        <Card style={{ gap: 10 }}>
          <T w={800} size={15}>Data diri</T>
          <Row label="Nama" value={persona.nama} />
          <Row label="Usia" value={persona.usia.replace(' th', ' tahun')} />
          <Row label="Status" value="Belum menikah" />
          <Row label="Domisili" value={persona.kota} />
        </Card>
        {p?.pendidikan_terakhir ? (
          <Card style={{ gap: 10 }}>
            <T w={800} size={15}>Pendidikan</T>
            <Row label="Pendidikan terakhir" value={p.pendidikan_terakhir} />
          </Card>
        ) : null}
        {pekerjaan?.nama ? (
          <Card style={{ gap: 10 }}>
            <T w={800} size={15}>Pekerjaan</T>
            <Row label="Posisi" value={pekerjaan.nama} />
            {lamaStr ? <Row label="Lama bekerja" value={lamaStr} /> : null}
          </Card>
        ) : null}
      </>
    );
  }

  // ── AGUS ──────────────────────────────────────────────────────────
  if (userId === 'agus') {
    const pekerjaan = p?.pekerjaan?.[0];
    const lamaKerja = pekerjaan?.lama_kerja_bulan;
    const lamaStr = lamaKerja ? `${Math.floor(lamaKerja / 12)} tahun` : null;
    const statusStr = p?.status_pernikahan === 'menikah' && p?.jumlah_anak != null
      ? `Menikah · ${p.jumlah_anak} anak`
      : 'Menikah';
    return (
      <>
        <Card style={{ gap: 10 }}>
          <T w={800} size={15}>Data diri</T>
          <Row label="Nama" value={persona.nama} />
          <Row label="Usia" value={persona.usia.replace(' th', ' tahun')} />
          <Row label="Status" value={statusStr} />
          <Row label="Domisili" value={persona.kota} />
        </Card>
        {pekerjaan?.nama ? (
          <Card style={{ gap: 10 }}>
            <T w={800} size={15}>Pekerjaan</T>
            <Row label="Posisi" value={pekerjaan.nama} />
            {lamaStr ? <Row label="Lama bekerja" value={lamaStr} /> : null}
            {p?.pasangan?.nama ? <Row label="Pasangan" value={p.pasangan.nama} /> : null}
          </Card>
        ) : null}
      </>
    );
  }

  // ── DINI ──────────────────────────────────────────────────────────
  if (userId === 'dini') {
    return (
      <Card style={{ gap: 10 }}>
        <T w={800} size={15}>Data diri</T>
        <Row label="Nama" value={persona.nama} />
        <Row label="Usia" value={persona.usia.replace(' th', ' tahun')} />
        <Row label="Domisili" value={persona.kota} />
        {p?.pendidikan_terakhir ? <Row label="Pendidikan" value={p.pendidikan_terakhir} /> : null}
        <Row label="Status" value="Pelajar" />
      </Card>
    );
  }

  return null;
}

export default function Profil({ go, openOnboarding, onLogout }) {
  const app = useApp();
  const [form, setForm] = useState({ baseUrl: app.settings.baseUrl, apiKey: app.settings.apiKey, flowIds: app.settings.flowIds || {} });
  const [devOpen, setDevOpen] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [testing, setTesting] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [urlWarning, setUrlWarning] = useState('');
  const userId = app.userId || '';
  const isDemoUser = DEMO_USER_IDS.includes(userId);
  const persona = findPersona(userId);
  const displayName = persona?.nama || userId || 'Pengguna';
  const avatarInitial = displayName.charAt(0).toUpperCase() || 'C';
  const avatarBg = AVATAR_BG[userId] || C.gold;
  const avatarFg = AVATAR_FG[userId] || C.ink;

  // Potong "/api/v1/mcp" dari alamat
  function stripMcpPath(url) {
    return url.replace(/\/api\/v1\/mcp.*$/i, '').replace(/\/$/, '');
  }

  const onChangeUrl = (v) => {
    if (/\/api\/v1\/mcp/i.test(v)) {
      setUrlWarning('Ini alamat MCP untuk IBM Bob. Untuk aplikasi, isi alamat dasar Langflow saja, misalnya http://localhost:7860');
    } else {
      setUrlWarning('');
    }
    setForm({ ...form, baseUrl: v });
  };

  const save = (extra = {}) => {
    let baseUrl = form.baseUrl;
    if (/\/api\/v1\/mcp/i.test(baseUrl)) {
      baseUrl = stripMcpPath(baseUrl);
      setForm((f) => ({ ...f, baseUrl }));
      setUrlWarning('');
    }
    app.setSettings((s) => ({ ...s, ...form, ...extra, baseUrl }));
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
    if (!app.live) return;

    if (isDemoUser) {
      Alert.alert(
        'Hapus data contoh?',
        `Akun "${userId}" adalah pengguna contoh myCITA. Jika data di Langflow dihapus, seluruh skenario, analisis, dan tujuan akun ini akan hilang permanen dan perlu diisi ulang dari awal.`,
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Lanjutkan', style: 'destructive', onPress: () => {
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
      <ScreenHeader title="Profil" onBack={() => go('home')} />
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: avatarBg, alignItems: 'center', justifyContent: 'center' }}>
          <T w={800} size={20} color={avatarFg}>{avatarInitial}</T>
        </View>
        <View style={{ flex: 1 }}>
          <T w={800} size={17}>{displayName}</T>
          {persona ? (
            <T size={13} color={C.muted}>{persona.usia} · {persona.kota}</T>
          ) : null}
        </View>
      </Card>

      {/* Data persona — tampilan per persona */}
      <PersonaData userId={userId} />

      {openOnboarding ? (
        <Button label={app.analysis ? 'Ubah data keuangan' : 'Isi data keuangan'} icon="edit" variant="secondary" onPress={openOnboarding} />
      ) : null}
      <Button label="Ganti pengguna" icon="back" variant="secondary" onPress={handleLogout} />

      {/* Saklar Mode demo — di luar kartu agar mudah diganti saat demo */}
      <Card style={{ gap: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <T w={700} size={14}>Mode demo</T>
            <T size={12} color={C.muted}>Pakai data contoh tanpa server. Matikan untuk memakai Langflow.</T>
          </View>
          <Switch value={app.settings.demo} onValueChange={toggleDemo} trackColor={{ true: C.teal, false: C.line }} thumbColor={C.white}
            accessibilityLabel="Mode demo" />
        </View>
      </Card>

      {/* Pengaturan pengembang — tertutup secara default */}
      <Pressable
        onPress={() => setDevOpen(!devOpen)}
        accessibilityRole="button"
        accessibilityLabel={devOpen ? 'Tutup pengaturan pengembang' : 'Buka pengaturan pengembang'}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 4 }}
      >
        <T w={800} size={15}>Pengaturan pengembang</T>
        <Icon name={devOpen ? 'chevron-up' : 'chevron-down'} size={18} color={C.muted} />
      </Pressable>

      {devOpen ? (
        <Card style={{ gap: 12 }}>
          {/* Info pengguna aktif — hanya baca */}
          <View style={{ backgroundColor: C.ground, borderRadius: 10, padding: 10 }}>
            <T size={13} color={C.muted}>
              Masuk sebagai: <T w={700} size={13}>{displayName}</T>
              {userId ? <T size={13} color={C.muted}> (user_id: {userId})</T> : null}
            </T>
          </View>

          <Field
            label="Alamat Langflow"
            value={form.baseUrl}
            onChangeText={onChangeUrl}
            autoCapitalize="none"
            placeholder="http://192.168.1.10:7860 atau https://xxxx.ngrok-free.app"
            keyboardType="url"
          />
          {urlWarning ? (
            <View style={{ backgroundColor: C.warnSoft, borderRadius: 8, padding: 8 }}>
              <T size={12} color={C.warn} style={{ lineHeight: 18 }}>{urlWarning}</T>
            </View>
          ) : null}
          <T size={12} color={C.muted} style={{ marginTop: -6 }}>
            Di laptop: http://localhost:7860 · Di HP: IP laptop (mis. http://192.168.1.10:7860) atau URL ngrok
          </T>

          <Field label="API key Langflow" value={form.apiKey} onChangeText={(v) => setForm({ ...form, apiKey: v })} secure autoCapitalize="none"
            placeholder="sk-..." hint="Buat di Langflow: Settings → Langflow API Keys." />

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
      ) : null}
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
