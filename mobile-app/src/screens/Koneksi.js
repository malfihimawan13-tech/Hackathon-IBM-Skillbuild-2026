import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useApp } from '../state/AppContext';
import { Card, Screen, ScreenHeader, T } from '../components/ui';
import Icon from '../components/Icon';
import { Avatar, Terverifikasi, LinkAkun, statusAkun } from '../components/Feed';
import { useKomunitas } from '../state/useKomunitas';
import { AKUN, JARINGAN_AWAL, POSTS_AWAL, LEMBAGA_MINAT, ORANG_SARAN, SARAN_KONEKSI, cariAkun, koneksiDasar, mengikutiDasar } from '../api/komunitasData';
import { C } from '../theme';

const kotak = { get backgroundColor() { return C.card; }, borderRadius: 14, borderWidth: 1, get borderColor() { return C.line; }, overflow: 'hidden' };
const TINGGI = 560;

// Keterangan di kartu orang: bergantian jumlah koneksi atau koneksi bersama (angka contoh, tetap per akun).
const hash = (k) => String(k).split('').reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 997, 7);
const ketOrang = (a) => { const h = hash(a.key); return h % 2 ? `${60 + (h % 400)} koneksi` : `${1 + (h % 9)} koneksi bersama`; };
const postTerakhir = (k) => POSTS_AWAL.filter((p) => p.akun === k).length || 1;
const ketChannel = (a) => `${a.pengikut} pengikut`;

// Tombol bentuk pil: sama untuk semua baris (Terkoneksi / Mengikuti bisa diklik lagi untuk membatalkan).
export function Pil({ aktif, label, ikon, onPress, penuh }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress}
      style={{ flexDirection: 'row', gap: 5, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, minHeight: 34, borderRadius: 17, borderWidth: 1, borderColor: aktif ? C.line : C.teal2, alignSelf: penuh ? 'stretch' : 'auto' }}>
      <Icon name={aktif ? 'check' : (ikon || 'plus')} size={14} color={aktif ? C.muted : C.teal2} />
      <T w={800} size={12} color={aktif ? C.muted : C.teal2}>{label}</T>
    </Pressable>
  );
}

function Baris({ a, aksi, info }) {
  return (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.line }}>
      <LinkAkun k={a.key}><Avatar nama={a.nama} warna={a.warna} size={44} status={a.perusahaan ? undefined : statusAkun(a.key)} /></LinkAkun>
      <View style={{ flex: 1 }}>
        <LinkAkun k={a.key} style={{ alignSelf: 'flex-start' }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><T w={800} size={13} numberOfLines={1} style={{ flexShrink: 1 }}>{a.nama}</T><Terverifikasi akun={a} size={14} /></View></LinkAkun>
        <T size={11} color={C.muted} numberOfLines={2}>{a.peran}{a.pengikut ? ` · ${a.pengikut} pengikut` : ''}</T>
      </View>
      {info ? <T size={11} color={C.muted} style={{ marginRight: 4, maxWidth: 150, textAlign: 'right' }}>{info}</T> : null}
      {aksi}
    </View>
  );
}

export function Dialog({ data, tutup }) {
  return (
    <Modal transparent visible={!!data} animationType="fade" onRequestClose={tutup}>
      <Pressable accessibilityLabel="Tutup" onPress={tutup} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <Pressable onPress={() => {}} style={{ width: '100%', maxWidth: 440, backgroundColor: C.card, borderRadius: 16, padding: 20, gap: 12 }}>
          <T w={800} size={17}>{data?.judul}</T>
          <T size={13} color={C.muted} style={{ lineHeight: 20 }}>{data?.isi}</T>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
            <Pressable accessibilityRole="button" onPress={tutup} style={{ paddingHorizontal: 16, minHeight: 38, borderRadius: 19, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }}><T w={800} size={13} color={C.muted}>Batal</T></Pressable>
            <Pressable accessibilityRole="button" onPress={() => { data.ok(); tutup(); }} style={{ paddingHorizontal: 16, minHeight: 38, borderRadius: 19, backgroundColor: '#C0392B', alignItems: 'center', justifyContent: 'center' }}><T w={800} size={13} color="#fff">{data?.tombol}</T></Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Panah({ arah, onPress }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={arah === 'kiri' ? 'Sebelumnya' : 'Berikutnya'} onPress={onPress}
      style={{ position: 'absolute', top: '42%', [arah === 'kiri' ? 'left' : 'right']: 6, width: 36, height: 36, borderRadius: 18, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center', zIndex: 5, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 }}>
      <View style={{ transform: [{ rotate: arah === 'kiri' ? '0deg' : '180deg' }] }}><Icon name="back" size={18} color={C.text} /></View>
    </Pressable>
  );
}

// Baris kartu bergaya jejaring: 4 kartu per halaman (PC), tombol panah kiri/kanan untuk berpindah.
function Karusel({ judul, sub, items, label, onAksi, onTutup, ket }) {
  const [lebar, setLebar] = useState(0);
  const [hal, setHal] = useState(0);
  const per = lebar >= 640 ? 4 : lebar >= 420 ? 3 : 2;
  const total = Math.max(1, Math.ceil(items.length / per));
  const h = Math.min(hal, total - 1);
  const tampil = items.slice(h * per, h * per + per);
  return (
    <View style={kotak} onLayout={(e) => setLebar(e.nativeEvent.layout.width)}>
      <View style={{ padding: 14, gap: 2 }}>
        <T w={800} size={15}>{judul}</T>
        {sub ? <T size={11} color={C.muted}>{sub}</T> : null}
      </View>
      {items.length === 0 ? <T size={12} color={C.muted} style={{ padding: 14 }}>Tidak ada saran lagi.</T> : (
        <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {tampil.map((a) => (
              <View key={a.key} style={{ flex: 1, minWidth: 0, borderWidth: 1, borderColor: C.line, borderRadius: 12, overflow: 'hidden', alignItems: 'center', paddingBottom: 12 }}>
                <View style={{ alignSelf: 'stretch', height: 52, backgroundColor: a.warna, opacity: 0.9 }} />
                <Pressable accessibilityRole="button" accessibilityLabel="Sembunyikan" onPress={() => onTutup(a)} style={{ position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' }}><Icon name="close" size={14} color="#fff" /></Pressable>
                <LinkAkun k={a.key} style={{ marginTop: -30, borderWidth: 3, borderColor: C.card, borderRadius: 40 }}><Avatar nama={a.nama} warna={a.warna} size={64} /></LinkAkun>
                <View style={{ paddingHorizontal: 8, marginTop: 8, alignItems: 'center', minHeight: 80 }}>
                  <LinkAkun k={a.key}><View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, flexWrap: 'wrap' }}><T w={800} size={13} numberOfLines={2} style={{ textAlign: 'center' }}>{a.nama}</T><Terverifikasi akun={a} size={14} /></View></LinkAkun>
                  <T size={11} color={C.muted} numberOfLines={2} style={{ textAlign: 'center', marginTop: 2 }}>{a.peran}</T>
                  <T size={11} color={C.teal2} w={700} numberOfLines={1} style={{ textAlign: 'center', marginTop: 4 }}>{ket(a)}</T>
                </View>
                <View style={{ alignSelf: 'stretch', paddingHorizontal: 10, marginTop: 8 }}><Pil label={label} onPress={() => onAksi(a)} penuh /></View>
              </View>
            ))}
            {Array.from({ length: per - tampil.length }).map((_, i) => <View key={`k${i}`} style={{ flex: 1 }} />)}
          </View>
          {h > 0 ? <Panah arah="kiri" onPress={() => setHal(h - 1)} /> : null}
          {h < total - 1 ? <Panah arah="kanan" onPress={() => setHal(h + 1)} /> : null}
        </View>
      )}
    </View>
  );
}

export default function Koneksi({ go }) {
  const { activeUserId: uid } = useApp();
  const { s, ubah } = useKomunitas(uid);
  const [tab, setTab] = useState('koneksi');
  const [sembunyi, setSembunyi] = useState({});
  const [dlg, setDlg] = useState(null);
  const alih = (k) => ubah((x) => ({ ...x, ikuti: { ...x.ikuti, [k]: !x.ikuti[k] } }));
  const putus = (k) => ubah((x) => ({ ...x, ikuti: { ...x.ikuti, [k]: false }, putus: { ...(x.putus || {}), [k]: true } }));
  const dasar = JARINGAN_AWAL[uid] || JARINGAN_AWAL.budi;
  const gone = s.putus || {};

  const nyata = Object.keys(s.ikuti).filter((k) => s.ikuti[k]).map((k) => ({ k, a: { ...cariAkun(k), key: k } })).filter((x) => x.a.nama);
  const orangNyata = nyata.filter((x) => !x.a.perusahaan);
  const lembagaNyata = nyata.filter((x) => x.a.perusahaan);
  const orangDasar = koneksiDasar(uid).filter((a) => !gone[a.key]);
  const channelDasar = mengikutiDasar(uid).filter((a) => !gone[a.key]);

  const urutan = (SARAN_KONEKSI[uid] || SARAN_KONEKSI.budi).map((k) => ({ ...AKUN[k], key: k }));
  const saran = [...urutan, ...ORANG_SARAN].filter((a) => !sembunyi[a.key] && !s.ikuti[a.key]);
  const minat = LEMBAGA_MINAT.filter((a) => !sembunyi[a.key] && !s.ikuti[a.key]);

  const tanyaPutus = (a) => setDlg({ judul: 'Putus koneksi?', isi: `Anda yakin akan melakukan putus koneksi dengan orang ini? Orang yang Anda putus koneksinya akan mendapatkan notifikasi. Perhatikan baik-baik bahwa keputusan Anda sudah tepat.`, tombol: 'Putus Koneksi', ok: () => putus(a.key) });
  const tanyaBerhenti = (a) => setDlg({ judul: 'Berhenti mengikuti?', isi: `Anda yakin akan berhenti mengikuti ${a.nama}?`, tombol: 'Berhenti Mengikuti', ok: () => putus(a.key) });

  const tabs = [{ k: 'koneksi', l: 'Koneksi', n: orangDasar.length + orangNyata.length }, { k: 'mengikuti', l: 'Mengikuti', n: channelDasar.length + lembagaNyata.length }];

  return (
    <Screen>
      <ScreenHeader title="My Koneksi" onBack={() => go('home')} />
      <Card><T size={13} color={C.muted}>Tidak ada undangan yang belum direspons.</T></Card>

      <View style={kotak}>
        <View style={{ flexDirection: 'row' }} accessibilityRole="tablist">
          {tabs.map((t) => {
            const on = tab === t.k;
            return (
              <Pressable key={t.k} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => setTab(t.k)}
                style={{ flex: 1, alignItems: 'center', paddingVertical: 14, borderBottomWidth: 3, borderBottomColor: on ? C.teal2 : C.line }}>
                <T w={on ? 800 : 600} size={14} color={on ? C.teal2 : C.muted}>{t.l} {t.n}</T>
              </Pressable>
            );
          })}
        </View>
        <ScrollView nestedScrollEnabled style={{ height: TINGGI }}>
          {tab === 'koneksi'
            ? [...orangNyata.map((x) => x.a), ...orangDasar].map((a) => <Baris key={a.key} a={a} aksi={<View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}><Pil ikon="chat" label="Kirim Pesan" onPress={() => go('pesan', { kepada: { key: a.key, nama: a.nama, peran: a.peran, warna: a.warna } })} /><Pil aktif label="Terkoneksi" onPress={() => tanyaPutus(a)} /></View>} />)
            : [...lembagaNyata.map((x) => x.a), ...channelDasar].map((a) => <Baris key={a.key} a={a} info={`${a.post ?? postTerakhir(a.key)} postingan terakhir\n${a.waktu || 'hari ini'}`} aksi={<View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}><Pil ikon="globe" label="Kunjungi" onPress={() => go('profilakun', { key: a.key })} /><Pil aktif label="Mengikuti" onPress={() => tanyaBerhenti(a)} /></View>} />)}
        </ScrollView>
      </View>

      <Karusel judul="Orang yang mungkin Anda kenal" sub="Gunakan panah untuk melihat saran lainnya" items={saran} ket={ketOrang} label="Koneksi" onAksi={(a) => alih(a.key)} onTutup={(a) => setSembunyi({ ...sembunyi, [a.key]: true })} />
      <Karusel judul="Channel yang mungkin Anda minati" sub="Channel karier, belajar, dan usaha" items={minat} ket={ketChannel} label="Ikuti" onAksi={(a) => alih(a.key)} onTutup={(a) => setSembunyi({ ...sembunyi, [a.key]: true })} />
      <T size={11} color={C.muted}>Semua akun, channel, dan angka adalah contoh untuk demo.</T>
      <Dialog data={dlg} tutup={() => setDlg(null)} />
    </Screen>
  );
}
