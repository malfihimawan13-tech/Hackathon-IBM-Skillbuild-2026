import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Ilustrasi } from './Visual';
import Icon from './Icon';
import { Avatar, LinkAkun, statusJikaTerhubung } from './Feed';
import { AKUN, JARINGAN_AWAL, KUNJUNGAN, POSTS_AWAL, SARAN_ANDA } from '../api/komunitasData';
import { useKomunitas } from '../state/useKomunitas';
import { T } from './ui';
import { C } from '../theme';

const kartu = { get backgroundColor() { return C.card; }, borderRadius: 14, borderWidth: 1, get borderColor() { return C.line; }, overflow: 'hidden' };

const PROFIL = {
  budi: { nama: 'Budi Hadianto', kerja: 'Operator Produksi', lokasi: 'Depok - Indonesia' },
  agus: { nama: 'Agus Setiawan', kerja: 'Pemilik Bengkel Motor', lokasi: 'Bekasi - Indonesia' },
  dini: { nama: 'Dini Maharani', kerja: 'Pelajar SMA Kelas 3', lokasi: 'Bandung - Indonesia' },
};
export function profilPengguna(uid) { return PROFIL[uid] || { nama: uid || 'Kamu', kerja: 'Pengguna myCITA', lokasi: 'Indonesia' }; }

export function sapaan() {
  const j = new Date().getHours();
  return j >= 4 && j < 11 ? 'Selamat pagi' : j < 15 ? 'Selamat siang' : j < 18 ? 'Selamat sore' : 'Selamat malam';
}

// Kartu profil bergambar (sapaan sesuai waktu setempat) + kotak menu "My ...".
export function SisiProfil({ uid, go, halaman }) {
  const p = profilPengguna(uid);
  const item = [
    { k: 'dashboard', l: 'My Dashboard', i: 'chart' },
    { k: 'karirbisnis', l: 'My Karir & Bisnis', i: 'briefcase' },
    { k: 'roadmap', l: 'My Roadmap', i: 'route' },
    { k: 'keuangan', l: 'My Keuangan', i: 'wallet' },
    { k: 'tujuan', l: 'My Tujuan', i: 'target' },
  ];
  return (
    <View style={{ gap: 12 }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Buka profil" onPress={() => go('profil')} style={{ borderRadius: 16, overflow: 'hidden', backgroundColor: '#0F4C47' }}>
        <Svg style={{ position: 'absolute', left: 0, top: 0 }} width="100%" height="100%" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="gProfil" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#0B3B37" /><Stop offset="0.6" stopColor="#0F4C47" /><Stop offset="1" stopColor="#1F6F66" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#gProfil)" />
        </Svg>
        <View style={{ position: 'absolute', right: -6, bottom: -4, opacity: 0.9 }} pointerEvents="none"><Ilustrasi /></View>
        <View style={{ alignItems: 'center', padding: 18, gap: 3 }}>
          <T w={700} size={13} color="rgba(255,255,255,0.95)">{sapaan()} 👋</T>
          <View style={{ borderWidth: 3, borderColor: 'rgba(255,255,255,0.9)', borderRadius: 44, marginTop: 8 }}><Avatar nama={p.nama} warna={C.gold} size={72} /></View>
          <T w={800} size={17} color="#FFFFFF" style={{ marginTop: 8, textAlign: 'center' }}>{p.nama}</T>
          <T w={600} size={13} color="#FFFFFF" style={{ textAlign: 'center' }}>{p.kerja}</T>
          <T size={12} color="rgba(255,255,255,0.8)" style={{ textAlign: 'center' }}>{p.lokasi}</T>
        </View>
      </Pressable>
      <View style={{ ...kartu, paddingVertical: 6 }}>
        {item.map((x) => (
          <Pressable key={x.k} accessibilityRole="button" onPress={() => go(x.k)}
            style={({ hovered }) => ({ flexDirection: 'row', gap: 12, alignItems: 'center', paddingHorizontal: 16, minHeight: 46, backgroundColor: hovered ? C.ground : 'transparent' })}>
            <Icon name={x.i} size={19} color={C.teal2} /><T w={700} size={13}>{x.l}</T>
          </Pressable>
        ))}
      </View>
      <KunjunganProfil uid={uid} />
      {halaman === 'mykoneksi' ? <StatistikJaringan uid={uid} go={go} /> : <SaranAnda uid={uid} go={go} />}
    </View>
  );
}

function TombolKoneksi({ k, s, ubah }) {
  const on = !!s.ikuti[k];
  return (
    <Pressable accessibilityRole="button" onPress={() => ubah((x) => ({ ...x, ikuti: { ...x.ikuti, [k]: !x.ikuti[k] } }))}
      style={{ flexDirection: 'row', gap: 4, alignItems: 'center', paddingHorizontal: 12, minHeight: 32, borderRadius: 16, borderWidth: 1, borderColor: on ? C.line : C.teal2 }}>
      {!on ? <Icon name="plus" size={14} color={C.teal2} /> : null}
      <T w={800} size={12} color={on ? C.muted : C.teal2}>{on ? 'Terhubung' : 'Koneksi'}</T>
    </Pressable>
  );
}

function Orang({ k, s, ubah, sub }) {
  const a = AKUN[k];
  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
      <LinkAkun k={k}><Avatar nama={a.nama} warna={a.warna} size={40} status={statusJikaTerhubung(s, k)} /></LinkAkun>
      <View style={{ flex: 1 }}>
        <LinkAkun k={k} style={{ alignSelf: 'flex-start' }}><T w={700} size={13} numberOfLines={1}>{a.nama}</T></LinkAkun>
        <T size={11} color={C.muted} numberOfLines={2}>{sub || a.peran}</T>
      </View>
      <TombolKoneksi k={k} s={s} ubah={ubah} />
    </View>
  );
}

// Jumlah pengunjung profil (angka contoh); diketuk untuk melihat daftarnya.
export function KunjunganProfil({ uid }) {
  const { s, ubah } = useKomunitas(uid);
  const [buka, setBuka] = useState(false);
  return (
    <>
      <Pressable accessibilityRole="button" onPress={() => setBuka(true)} style={({ hovered }) => ({ ...kartu, padding: 14, flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: hovered ? C.ground : C.card })}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' }}><Icon name="user" size={20} color={C.teal2} /></View>
        <View style={{ flex: 1 }}>
          <T w={800} size={13}>{KUNJUNGAN.jumlah} orang mengunjungi Anda</T>
          <T size={11} color={C.muted}>7 hari terakhir (angka contoh)</T>
        </View>
      </Pressable>
      <Modal transparent visible={buka} animationType="fade" onRequestClose={() => setBuka(false)}>
        <Pressable accessibilityLabel="Tutup" onPress={() => setBuka(false)} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <Pressable onPress={() => {}} style={{ width: '100%', maxWidth: 420, maxHeight: '75%', backgroundColor: C.card, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: C.line }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: C.line }}>
              <T w={800} size={15} style={{ flex: 1 }}>Pengunjung profil Anda</T>
              <Pressable accessibilityRole="button" accessibilityLabel="Tutup" onPress={() => setBuka(false)} style={{ width: 34, height: 34, alignItems: 'center', justifyContent: 'center' }}><Icon name="close" size={18} color={C.muted} /></Pressable>
            </View>
            <ScrollView contentContainerStyle={{ padding: 14, gap: 14 }}>
              {KUNJUNGAN.daftar.map((v) => <Orang key={v.akun} k={v.akun} s={s} ubah={ubah} sub={`${AKUN[v.akun].peran.split(' (')[0]} · ${v.waktu}`} />)}
              <T size={12} color={C.muted}>dan {KUNJUNGAN.jumlah - KUNJUNGAN.daftar.length} lainnya (akun dan angka contoh)</T>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function SaranAnda({ uid, go }) {
  const daftar = SARAN_ANDA[uid] || SARAN_ANDA.budi;
  return (
    <View style={{ ...kartu, padding: 14, gap: 12 }}>
      <T w={800} size={14}>Saran untuk Anda</T>
      {daftar.map((x) => (
        <Pressable key={x.judul} accessibilityRole="button" onPress={() => go(x.ke, x.p || null)} style={({ hovered }) => ({ flexDirection: 'row', gap: 10, alignItems: 'center', padding: 8, marginHorizontal: -8, borderRadius: 12, backgroundColor: hovered ? C.ground : 'transparent' })}>
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' }}><Icon name={x.ikon} size={19} color={C.teal2} /></View>
          <View style={{ flex: 1 }}>
            <T w={700} size={13}>{x.judul}</T>
            <T size={11} color={C.muted}>{x.sub}</T>
          </View>
        </Pressable>
      ))}
      <T size={10} color={C.muted}>Disusun dari roadmap dan minatmu.</T>
    </View>
  );
}

// Di halaman Koneksi: kotak ringkasan di kolom kanan.
const potong = (t, n = 60) => (t.length > n ? `${t.slice(0, n)}…` : t);
export function StatistikJaringan({ uid, go }) {
  const { s } = useKomunitas(uid);
  const semuaPost = [...s.posts, ...POSTS_AWAL];
  // Interaksi lama (sebelum riwayat dicatat) ikut ditampilkan dari data suka/komentar/bagikan yang tersimpan.
  const catatan = s.riwayat || [];
  const lama = [
    ...Object.keys(s.komentar).flatMap((id) => (s.komentar[id] || []).map((k) => ({ jenis: 'komentar', id, teks: k.teks, t: 0 }))).filter((r) => !catatan.some((c) => c.jenis === 'komentar' && c.id === r.id && c.teks === r.teks)),
    ...Object.keys(s.suka).filter((id) => s.suka[id] && !catatan.some((c) => c.jenis === 'suka' && c.id === id)).map((id) => ({ jenis: 'suka', id, t: 0 })),
    ...Object.keys(s.bagikan).filter((id) => s.bagikan[id] && !catatan.some((c) => c.jenis === 'bagikan' && c.id === id)).map((id) => ({ jenis: 'bagikan', id, t: 0 })),
  ];
  const aksi = [...lama, ...catatan].reverse().slice(0, 4);
  const teksAksi = (r) => {
    const post = semuaPost.find((p) => p.id === r.id);
    const pemilik = post ? (post.akun === 'saya' ? 'Anda' : (AKUN[post.akun] || {}).nama) : null;
    const cuplik = post ? `“${potong(post.teks.replace(/\s+/g, ' '), 42)}”` : '';
    const dari = pemilik ? (pemilik === 'Anda' ? 'postingan Anda' : `postingan ${pemilik}`) : 'sebuah postingan';
    if (r.jenis === 'suka') return `Anda memberi Suka pada ${dari} ${cuplik}`;
    if (r.jenis === 'bagikan') return `Anda membagikan ${dari} ${cuplik}`;
    return `Anda memberi komentar “${potong(r.teks || '', 40)}” pada ${dari}`;
  };
  return (
    <View style={{ gap: 12 }}>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <T w={800} size={14}>Terakhir Dikunjungi</T>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {['dewi', 'rafi', 'salsa'].map((k) => <LinkAkun key={k} k={k}><Avatar nama={AKUN[k].nama} warna={AKUN[k].warna} size={36} status={statusJikaTerhubung(s, k)} /></LinkAkun>)}
        </View>
        <View style={{ height: 1, backgroundColor: C.line }} />
        <T w={800} size={14}>Terakhir Berinteraksi</T>
        {aksi.length === 0 ? <T size={12} color={C.muted}>Belum ada. Suka, komentari, atau bagikan postingan di Beranda.</T> : aksi.map((r, i) => (
          <Pressable key={`${r.jenis}${r.id}${r.t}${i}`} accessibilityRole="link" onPress={() => go && go('home', { postId: r.id, jenis: r.jenis })} style={({ hovered }) => ({ paddingVertical: 4, opacity: hovered ? 0.7 : 1 })}>
            <T size={12} style={{ lineHeight: 18 }}>{teksAksi(r)}</T>
          </Pressable>
        ))}
        <T size={10} color={C.muted}>Angka dan akun contoh.</T>
      </View>
    </View>
  );
}
