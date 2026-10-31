import React, { useState } from 'react';
import { Image, Pressable, TextInput, View, useWindowDimensions } from 'react-native';
import Icon from './Icon';
import { Avatar } from './Feed';
import { IkonBulat, AKSEN } from './Visual';
import { Bookmark } from './BerandaBaru';
import { LOGO_LOWONGAN } from './foto';
import { PanelKananKoneksi } from './KoneksiBaru';
import { PanelKananKerja } from './KerjaBaru';
import { PanelKananBisnis } from './BisnisBaru';
import { PanelKananBelajar } from './BelajarBaru';
import { PanelKananSertif } from './SertifBaru';
import { PanelKananKomunitas } from './KomunitasBaru';
import { PanelKananKompetisi } from './KompetisiBaru';
import { PanelKananEvent } from './EventBaru';
import { PanelKananInvestasi } from './InvestasiBaru';
import { PanelKananDashboard } from './DashboardBaru';
import { PanelKananKarirBisnis } from './KarirBisnisBaru';
import { KunjunganProfil, StatistikJaringan, profilPengguna } from './Sisi';
import { useKomunitas } from '../state/useKomunitas';
import { AKUN, JARINGAN_AWAL, SARAN_ANDA, SARAN_KONEKSI } from '../api/komunitasData';
import { T } from './ui';
import { C } from '../theme';

const kartu = { get backgroundColor() { return C.card; }, borderRadius: 16, borderWidth: 1, get borderColor() { return C.line; } };
const LOGO = require('../../auth/assets/logo-mycita.png');

// Data tambahan kartu profil (contoh untuk demo).
const EXTRA = {
  budi: { bio: 'Tertarik pada data, teknologi, dan pengembangan diri. Saat ini belajar Python untuk menjadi Data Scientist.', grup: 8, sertifikat: 12 },
  agus: { bio: 'Pemilik bengkel motor dan usaha keluarga. Sedang merapikan pembukuan dan menyiapkan rumah impian.', grup: 5, sertifikat: 3 },
  dini: { bio: 'Pelajar kelas 3 SMA yang sedang mengenali minat dan memilih jurusan kuliah.', grup: 3, sertifikat: 2 },
};
export function dataProfil(uid) {
  const p = profilPengguna(uid);
  const e = EXTRA[uid] || { bio: 'Pengguna myCITA yang sedang merencanakan masa depan.', grup: 0, sertifikat: 0 };
  const j = JARINGAN_AWAL[uid] || { koneksi: 0 };
  return { ...p, ...e, koneksi: j.koneksi };
}

// ─── Bar atas ─────────────────────────────────────────────────────────────
export function TopBar({ go, uid, panel, setPanel, tema, gantiTema, onMenu, lebarMenu }) {
  const { width } = useWindowDimensions();
  const [q, setQ] = useState('');
  const p = profilPengguna(uid);
  const cari = () => { if (q.trim()) { setPanel(null); go('komunitas', { q: q.trim() }); setQ(''); } };
  const tombol = (k) => () => setPanel(panel === k ? null : k);
  const Ikon = ({ nama, label, on, onPress, titik }) => (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
      style={({ hovered }) => ({ width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: on || hovered ? C.ground : 'transparent' })}>
      <Icon name={nama} size={22} color={on ? C.teal2 : C.ink} />
      {titik ? <View style={{ position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: 4, backgroundColor: '#E5484D', borderWidth: 1.5, borderColor: C.card }} /> : null}
    </Pressable>
  );
  return (
    <View style={{ backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.line, alignItems: 'center', zIndex: 40 }}>
      <View style={{ width: '100%', maxWidth: 1490, height: 60, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Menu" onPress={onMenu}
          style={({ hovered }) => ({ width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: hovered ? C.ground : 'transparent' })}>
          {[0, 1, 2].map((i) => <View key={i} style={{ width: 18, height: 2, borderRadius: 1, backgroundColor: C.ink }} />)}
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Ke Beranda" onPress={() => { setPanel(null); go('home'); }} style={{ flexShrink: 0 }}>
          <Image source={LOGO} resizeMode="contain" style={{ width: 118, height: 36 }} />
        </Pressable>
        <View style={{ flex: 1, maxWidth: 680, marginLeft: 6, minHeight: 40, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, borderRadius: 999, backgroundColor: C.ground, borderWidth: 1, borderColor: C.line }}>
          <Icon name="search" size={16} color={C.muted} />
          <TextInput value={q} onChangeText={setQ} onSubmitEditing={cari} placeholder={width >= 1100 ? 'Cari orang, komunitas, lowongan, kursus, atau topik...' : 'Cari'} placeholderTextColor="#8A9693" accessibilityLabel="Cari"
            style={{ flex: 1, fontFamily: 'PlusJakartaSans_500Medium', fontSize: 13, color: C.ink, outlineStyle: 'none', minWidth: 0 }} />
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <Ikon nama="bubble" label="Pesan" onPress={() => { setPanel(null); go('pesan'); }} />
          <Ikon nama="bell" label="Notifikasi" on={panel === 'notif'} onPress={tombol('notif')} titik />
          <Ikon nama="headset" label="Bantuan" on={panel === 'bantu'} onPress={tombol('bantu')} />
          <Ikon nama={tema === 'gelap' ? 'sun' : 'moon'} label="Ganti mode" onPress={() => { setPanel(null); gantiTema(tema === 'gelap' ? 'terang' : 'gelap'); }} />
          <Pressable accessibilityRole="button" accessibilityLabel="Profil" onPress={tombol('profil')} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 8 }}>
            <Avatar nama={p.nama} warna={C.gold} size={38} />
            <Icon name="down" size={16} color={C.muted} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// ─── Panel kiri: profil + menu ─────────────────────────────────────────
const SOSIAL = [
  { l: 'Beranda', i: 'home', r: 'home', aktif: ['home'] },
  { l: 'Koneksi', i: 'users', r: 'koneksi', aktif: ['koneksi'] },
  { l: 'Kerja', i: 'briefcase', r: 'kerja', aktif: ['kerja'] },
  { l: 'Bisnis', i: 'store', r: 'bisnis', aktif: ['bisnis'] },
  { l: 'Belajar', i: 'book', r: 'belajar', aktif: ['belajar'] },
  { l: 'Sertifikasi', i: 'check', r: 'sertif', aktif: ['sertif'] },
  { l: 'Komunitas', i: 'globe', r: 'komunitas2', aktif: ['komunitas2'] },
  { l: 'Proyek & Kompetisi', i: 'piala', r: 'kompetisi', aktif: ['kompetisi'] },
  { l: 'Event & Webinar', i: 'kalender', r: 'eventhal', aktif: ['eventhal'] },
  { l: 'Saham & Investasi', i: 'chart', r: 'investasi', aktif: ['investasi'] },
];
const PERSONAL = [
  { l: 'My Dashboard', i: 'chart', r: 'dashboard', aktif: ['dashboard'] },
  { l: 'My Karier & Bisnis', i: 'briefcase', r: 'karirbisnis', aktif: ['karirbisnis', 'karier', 'tambahkarir', 'usaha', 'tambahbisnis', 'sertifikasi'] },
  { l: 'My Koneksi', i: 'users', r: 'mykoneksi', aktif: ['mykoneksi', 'komunitas'] },
  { l: 'My Roadmap', i: 'route', r: 'roadmap', aktif: ['roadmap', 'pendidikan'] },
  { l: 'My Keuangan', i: 'wallet', r: 'keuangan', aktif: ['keuangan', 'cari', 'pengeluaran'] },
  { l: 'My Tujuan', i: 'target', r: 'tujuan', aktif: ['tujuan'] },
];

function Bagian({ judul, item, halaman, go, onPilih }) {
  const [buka, setBuka] = useState(true);
  return (
    <View style={{ ...kartu, paddingVertical: 8, paddingHorizontal: 8 }}>
      <Pressable accessibilityRole="button" onPress={() => setBuka(!buka)} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, minHeight: 34 }}>
        <T w={800} size={11} color={C.ink} style={{ flex: 1, letterSpacing: 0.4 }}>{judul}</T>
        <Icon name={buka ? 'up' : 'down'} size={15} color={C.muted} />
      </Pressable>
      {buka ? item.map((x) => {
        const on = x.aktif.includes(halaman);
        return (
          <Pressable key={x.l} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => { onPilih && onPilih(); go(x.r, x.p || null); }}
            style={({ hovered }) => ({ flexDirection: 'row', gap: 12, alignItems: 'center', paddingHorizontal: 10, minHeight: 44, borderRadius: 10, backgroundColor: on ? C.soft : hovered ? C.ground : 'transparent' })}>
            <Icon name={x.i} size={19} color={on ? C.teal2 : C.ink} />
            <T w={on ? 800 : 500} size={13} color={on ? C.teal2 : C.ink}>{x.l}</T>
          </Pressable>
        );
      }) : null}
    </View>
  );
}

export function PanelKiri({ uid, go, halaman, onPilih }) {
  const p = dataProfil(uid);
  const stat = [[p.koneksi, 'Koneksi'], [p.grup, 'Grup'], [p.sertifikat, 'Sertifikat']];
  return (
    <View style={{ gap: 12 }}>
      <View style={{ ...kartu, padding: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Avatar nama={p.nama} warna={C.gold} size={56} />
          <View style={{ flex: 1 }}>
            <T w={800} size={15} numberOfLines={1}>{p.nama}</T>
            <T size={12} color={C.muted} numberOfLines={1}>{p.kerja}</T>
            <T size={12} color={C.muted} numberOfLines={1}>{p.lokasi.replace(' - ', ', ')}</T>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Ubah profil" onPress={() => { onPilih && onPilih(); go('profil'); }}><Icon name="edit" size={16} color={C.teal2} /></Pressable>
        </View>
        <T size={12} color={C.muted} style={{ lineHeight: 18 }}>{p.bio}</T>
        <View style={{ flexDirection: 'row', paddingVertical: 4 }}>
          {stat.map(([n, l], i) => (
            <View key={l} style={{ flex: 1, alignItems: 'center', borderLeftWidth: i ? 1 : 0, borderLeftColor: C.line }}>
              <T w={800} size={16}>{n}</T>
              <T size={11} color={C.muted}>{l}</T>
            </View>
          ))}
        </View>
        <Pressable accessibilityRole="button" onPress={() => { onPilih && onPilih(); go('profil'); }}
          style={({ hovered }) => ({ minHeight: 42, borderRadius: 10, borderWidth: 1.5, borderColor: C.teal2, alignItems: 'center', justifyContent: 'center', backgroundColor: hovered ? C.soft : 'transparent' })}>
          <T w={800} size={13} color={C.teal2}>Lihat Profil</T>
        </Pressable>
      </View>
      <Bagian judul="JELAJAHI (SOSIAL)" item={SOSIAL} halaman={halaman} go={go} onPilih={onPilih} />
      <Bagian judul="PERJALANAN SAYA (PERSONAL)" item={PERSONAL} halaman={halaman} go={go} onPilih={onPilih} />
    </View>
  );
}

// ─── Panel kanan: aktivitas, orang, lowongan ──────────────────────────
const LOWONGAN = {
  budi: [
    ['Data Analyst', 'PT XYZ Indonesia', 'Jakarta · Hybrid', 'biru'],
    ['Machine Learning Engineer', 'PT ABC', 'Tangerang · Onsite', 'ungu'],
    ['Business Intelligence Analyst', 'PT DEF', 'Jakarta · Hybrid', 'gold'],
  ],
  agus: [
    ['Pendamping Usaha Mikro', 'Dinas Koperasi (contoh)', 'Bekasi · Onsite', 'gold'],
    ['Kemitraan Suku Cadang', 'PT Contoh Otomotif', 'Bekasi · Onsite', 'biru'],
    ['Admin Pembukuan Paruh Waktu', 'CV Contoh', 'Bekasi · Hybrid', 'ungu'],
  ],
  dini: [
    ['Magang Desain Konten', 'Studio Contoh', 'Bandung · Hybrid', 'ungu'],
    ['Asisten Perpustakaan Kampus', 'Universitas Contoh', 'Bandung · Onsite', 'biru'],
    ['Relawan Literasi Digital', 'Komunitas Contoh', 'Bandung · Hybrid', 'gold'],
  ],
};
const IKON_LOW = ['chart', 'spark', 'briefcase'];
const SAMA = { dewi: 12, rafi: 8, salsa: 5, nadia: 6, bima: 4, tari: 3 };

function Judul({ teks, aksi, onPress }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <T w={800} size={14} style={{ flex: 1 }}>{teks}</T>
      <Pressable accessibilityRole="button" onPress={onPress}><T w={700} size={11} color={C.teal2}>{aksi} →</T></Pressable>
    </View>
  );
}

export function PanelKanan({ uid, go, halaman }) {
  const { s, ubah } = useKomunitas(uid);
  const [simpan, setSimpan] = useState({});
  const saran = SARAN_ANDA[uid] || SARAN_ANDA.budi;
  const aksen = ['gold', 'biru', 'ungu', 'coral', 'teal'];
  const orang = (SARAN_KONEKSI[uid] || SARAN_KONEKSI.budi).slice(0, 3);
  const low = LOWONGAN[uid] || LOWONGAN.budi;
  if (halaman === 'koneksi') return <PanelKananKoneksi go={go} />;
  if (halaman === 'kerja') return <PanelKananKerja go={go} />;
  if (halaman === 'bisnis') return <PanelKananBisnis go={go} />;
  if (halaman === 'belajar') return <PanelKananBelajar go={go} />;
  if (halaman === 'sertif') return <PanelKananSertif go={go} />;
  if (halaman === 'komunitas2') return <PanelKananKomunitas go={go} />;
  if (halaman === 'kompetisi') return <PanelKananKompetisi go={go} />;
  if (halaman === 'eventhal') return <PanelKananEvent go={go} />;
  if (halaman === 'investasi') return <PanelKananInvestasi go={go} />;
  if (halaman === 'dashboard') return <PanelKananDashboard key={uid} go={go} uid={uid} />;
  if (halaman === 'karirbisnis' && uid === 'agus') return <PanelKananKarirBisnis go={go} />;
  return (
    <View style={{ gap: 12 }}>
      {halaman === 'mykoneksi' ? <StatistikJaringan uid={uid} go={go} /> : null}

      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Aktivitas & Saran untukmu" aksi="Lihat semua" onPress={() => go('notifikasi')} />
        {saran.map((x, i) => (
          <Pressable key={x.judul} accessibilityRole="button" onPress={() => go(x.ke, x.p || null)}
            style={({ hovered }) => ({ flexDirection: 'row', gap: 10, alignItems: 'center', padding: 6, marginHorizontal: -6, borderRadius: 12, backgroundColor: hovered ? C.ground : 'transparent' })}>
            <IkonBulat icon={x.ikon} aksen={aksen[i % aksen.length]} size={40} />
            <View style={{ flex: 1 }}>
              <T w={700} size={12} numberOfLines={2}>{x.judul}</T>
              <T size={11} color={C.muted} numberOfLines={1}>{x.sub}</T>
            </View>
            <T size={18} color={C.muted}>›</T>
          </Pressable>
        ))}
      </View>

      <View style={{ ...kartu, padding: 14, gap: 12 }}>
        <Judul teks="Orang yang mungkin kamu kenal" aksi="Lihat semua" onPress={() => go('koneksi')} />
        {orang.map((k) => {
          const a = AKUN[k]; const on = !!s.ikuti[k];
          return (
            <View key={k} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <Avatar nama={a.nama} warna={a.warna} size={46} />
              <View style={{ flex: 1 }}>
                <T w={700} size={13} numberOfLines={1}>{a.nama}</T>
                <T size={11} color={C.muted} numberOfLines={2}>{a.peran.split(' · ')[0].split(' (')[0]} · {SAMA[k] || 3} koneksi sama</T>
              </View>
              <Pressable accessibilityRole="button" onPress={() => ubah((x) => ({ ...x, ikuti: { ...x.ikuti, [k]: !x.ikuti[k] } }))}
                style={{ flexDirection: 'row', gap: 3, alignItems: 'center', paddingHorizontal: 10, minHeight: 32, borderRadius: 8, borderWidth: 1.5, borderColor: on ? C.line : C.teal2 }}>
                {!on ? <Icon name="plus" size={13} color={C.teal2} /> : null}
                <T w={800} size={12} color={on ? C.muted : C.teal2}>{on ? 'Diikuti' : 'Ikuti'}</T>
              </Pressable>
            </View>
          );
        })}
      </View>

      <View style={{ ...kartu, padding: 14, gap: 12 }}>
        <Judul teks="Lowongan yang mungkin kamu suka" aksi="Lihat semua" onPress={() => go('kerja')} />
        {low.map(([judul, pt, lok, ak], i) => (
          <View key={judul} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            {uid === 'budi' ? <Image source={LOGO_LOWONGAN[i % 3]} resizeMode="cover" style={{ width: 46, height: 46, borderRadius: 12 }} /> : <IkonBulat icon={IKON_LOW[i % 3]} aksen={ak} size={46} />}
            <Pressable accessibilityRole="button" onPress={() => go('kerja')} style={{ flex: 1 }}>
              <T w={700} size={12} numberOfLines={1}>{judul}</T>
              <T size={11} color={C.muted} numberOfLines={1}>{pt}</T>
              <T size={11} color={C.muted} numberOfLines={1}>{lok}</T>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Simpan lowongan" onPress={() => setSimpan((x) => ({ ...x, [judul]: !x[judul] }))}>
              <Bookmark size={19} color={simpan[judul] ? C.teal2 : C.ink} isi={!!simpan[judul]} />
            </Pressable>
          </View>
        ))}
        <T size={10} color={C.muted}>Contoh untuk demo.</T>
      </View>

      <KunjunganProfil uid={uid} />
    </View>
  );
}
