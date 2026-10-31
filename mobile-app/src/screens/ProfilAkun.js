import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useApp } from '../state/AppContext';
import { Card, Screen, ScreenHeader, T } from '../components/ui';
import { Avatar, Terverifikasi, PostCard, statusJikaTerhubung, LABEL_STATUS } from '../components/Feed';
import { useKomunitas } from '../state/useKomunitas';
import { cariAkun } from '../api/komunitasData';
import { Dialog, Pil } from './Koneksi';
import { profilPengguna } from '../components/Sisi';
import { C } from '../theme';

const KOTA = ['Depok', 'Bekasi', 'Bandung', 'Tangerang', 'Bogor', 'Surabaya', 'Yogyakarta'];
const hash = (k) => String(k).split('').reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 997, 7);
const kotak = { get backgroundColor() { return C.card; }, borderRadius: 14, borderWidth: 1, get borderColor() { return C.line; }, overflow: 'hidden' };

// Postingan contoh untuk channel (diberi label contoh).
function postChannel(a) {
  const n = a.post || 2;
  const kat = String(a.kategori || a.peran || 'karier').toLowerCase();
  const teks = [
    `Tips singkat ${kat}: mulai dari satu langkah kecil hari ini, lalu catat progresnya tiap minggu. (postingan contoh)`,
    `Pertanyaan minggu ini: apa satu hal yang ingin kamu kuasai di bidang ${kat} bulan ini? Tulis di komentar. (postingan contoh)`,
    `Rangkuman materi ${kat}: tiga hal dasar yang perlu dipahami pemula. (postingan contoh)`,
  ];
  const waktu = [a.waktu || '1 hari lalu', '2 hari lalu', '4 hari lalu'];
  return Array.from({ length: Math.min(n, 3) }, (_, i) => ({ id: `g-${a.key}-${i}`, kat: 'belajar', menit: 60 * (i + 1), penyuka: [], bagikan: 2 + i, pembagi: [], akun: a.key, waktu: waktu[i], teks: teks[i % 3], reaksi: { suka: 20 + 13 * (i + 1) }, komentar: [] }));
}

export default function ProfilAkun({ go, params }) {
  const { activeUserId: uid } = useApp();
  const { s, ubah, posts } = useKomunitas(uid);
  const [dlg, setDlg] = useState(null);
  const key = params?.key;
  const a0 = cariAkun(key);
  const saya = profilPengguna(uid);
  if (!a0) {
    return (<Screen><ScreenHeader title="Profil" onBack={() => go('koneksi')} /><Card><T size={13} color={C.muted}>Profil tidak ditemukan.</T></Card></Screen>);
  }
  const a = { ...a0, key };
  const channel = !!a.perusahaan;
  const h = hash(key);
  const dasar = /^[cf]\d+$/.test(key);
  const terhubung = dasar ? !(s.putus || {})[key] : !!s.ikuti[key];
  const aktifkan = () => ubah((x) => dasar ? { ...x, putus: { ...(x.putus || {}), [key]: false } } : { ...x, ikuti: { ...x.ikuti, [key]: true } });
  const matikan = () => ubah((x) => ({ ...x, ikuti: { ...x.ikuti, [key]: false }, putus: { ...(x.putus || {}), [key]: true } }));
  const tanya = () => setDlg(channel
    ? { judul: 'Berhenti mengikuti?', isi: `Anda yakin akan berhenti mengikuti ${a.nama}?`, tombol: 'Berhenti Mengikuti', ok: matikan }
    : { judul: 'Putus koneksi?', isi: 'Anda yakin akan melakukan putus koneksi dengan orang ini? Orang yang Anda putus koneksinya akan mendapatkan notifikasi. Perhatikan baik-baik bahwa keputusan Anda sudah tepat.', tombol: 'Putus Koneksi', ok: matikan });
  const daftarPost = posts.filter((p) => p.akun === key);
  const tampil = daftarPost.length ? daftarPost : (channel ? postChannel(a) : []);
  const statistik = channel ? `${a.pengikut || '1,2 rb'} pengikut` : `${60 + (h % 400)} koneksi · ${1 + (h % 9)} koneksi bersama`;
  return (
    <Screen>
      <ScreenHeader title={channel ? 'Profil Channel' : 'Profil'} onBack={() => go('koneksi')} />
      <View style={kotak}>
        <View style={{ height: 110, backgroundColor: a.warna, opacity: 0.9 }} />
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <View style={{ marginTop: -48, alignSelf: 'flex-start', borderWidth: 4, borderColor: C.card, borderRadius: 60 }}><Avatar nama={a.nama} warna={a.warna} size={96} status={statusJikaTerhubung(s, key)} /></View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}><T w={800} size={22}>{a.nama}</T><Terverifikasi akun={a} size={18} label /></View>
          <T size={14} color={C.ink}>{String(a.peran).split(' · ')[0]}</T>
          {statusJikaTerhubung(s, key) ? <T size={12} color={C.muted} style={{ marginTop: 2 }}>{LABEL_STATUS[statusJikaTerhubung(s, key)]}</T> : null}
          <T size={12} color={C.muted} style={{ marginTop: 2 }}>{KOTA[h % KOTA.length]} - Indonesia · {statistik}</T>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <Pil aktif={terhubung} label={channel ? (terhubung ? 'Mengikuti' : 'Ikuti') : (terhubung ? 'Terkoneksi' : 'Koneksi')} onPress={terhubung ? tanya : aktifkan} />
            {!channel ? <Pil ikon="chat" label="Kirim Pesan" onPress={() => go('pesan', { kepada: { key, nama: a.nama, peran: a.peran, warna: a.warna } })} /> : null}
          </View>
        </View>
      </View>
      <View style={[kotak, { padding: 16, gap: 6 }]}>
        <T w={800} size={15}>Tentang</T>
        <T size={13} color={C.muted} style={{ lineHeight: 20 }}>{channel ? `${a.kategori ? `Channel contoh seputar ${String(a.kategori).toLowerCase()}.` : 'Akun perusahaan contoh.'} Isi dan jumlah pengikut hanya contoh untuk demo myCITA.${a.verifikasi ? ' Centang verifikasi di sini hanya simulasi demo.' : ''}` : `Profil contoh untuk demo myCITA. Nama, pekerjaan, dan jumlah koneksi bukan data orang sungguhan.`}</T>
      </View>
      <T w={800} size={15}>Postingan terbaru</T>
      {tampil.length === 0 ? <Card><T size={13} color={C.muted}>Belum ada postingan.</T></Card> : tampil.map((p) => <PostCard key={p.id} post={p} s={s} ubah={ubah} namaSaya={saya.nama} headlineSaya={saya.kerja} />)}
      <Dialog data={dlg} tutup={() => setDlg(null)} />
    </Screen>
  );
}
