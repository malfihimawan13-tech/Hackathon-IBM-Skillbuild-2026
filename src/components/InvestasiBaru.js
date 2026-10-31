import React, { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import Icon from './Icon';
import { Screen, T } from './ui';
import { C } from '../theme';

const kartu = { get backgroundColor() { return C.card; }, borderRadius: 14, borderWidth: 1, get borderColor() { return C.line; }, overflow: 'hidden' };
const R = {
  hero: require('../assets/beranda/iv_hero.jpg'),
  e1: require('../assets/beranda/iv_e1.jpg'), e2: require('../assets/beranda/iv_e2.jpg'), e3: require('../assets/beranda/iv_e3.jpg'), e4: require('../assets/beranda/iv_e4.jpg'),
  a1: require('../assets/beranda/iv_a1.jpg'), a2: require('../assets/beranda/iv_a2.jpg'), a3: require('../assets/beranda/iv_a3.jpg'), a4: require('../assets/beranda/iv_a4.jpg'),
  i1: require('../assets/beranda/iv_i1.jpg'), i2: require('../assets/beranda/iv_i2.jpg'), i3: require('../assets/beranda/iv_i3.jpg'), i4: require('../assets/beranda/iv_i4.jpg'), i5: require('../assets/beranda/iv_i5.jpg'), i6: require('../assets/beranda/iv_i6.jpg'),
  w1: require('../assets/beranda/iv_w1.jpg'), w2: require('../assets/beranda/iv_w2.jpg'), w3: require('../assets/beranda/iv_w3.jpg'), w4: require('../assets/beranda/iv_w4.jpg'), w5: require('../assets/beranda/iv_w5.jpg'),
  g1: require('../assets/beranda/iv_g1.jpg'), g2: require('../assets/beranda/iv_g2.jpg'),
  k1: require('../assets/beranda/iv_k1.jpg'), k2: require('../assets/beranda/iv_k2.jpg'), k3: require('../assets/beranda/iv_k3.jpg'),
};
// Semua harga, angka, dan data di halaman ini adalah CONTOH simulasi untuk demo — bukan data pasar nyata dan bukan nasihat investasi.
const NAIK = '#1F8A4C', TURUN = '#D33';
const TAB = ['Semua', 'Saham', 'Reksa Dana', 'ETF', 'Obligasi', 'Emas', 'Kripto', 'P2P Lending', 'Edukasi', 'Simulasi'];
const PASAR = [
  { n: 'IHSG', h: '7,341.25', p: '+58.32 (+0.80%)', up: true, s: [3, 4, 3.5, 5, 4.5, 6, 5.5, 7, 8] },
  { n: 'LQ45', h: '923.17', p: '+6.21 (+0.68%)', up: true, s: [3, 3.6, 3.4, 4.5, 4.2, 5.5, 5.8, 6.5, 7.5] },
  { n: 'USD/IDR', h: '15,680', p: '-25 (-0.16%)', up: false, s: [8, 7, 7.5, 6, 6.5, 5, 5.5, 3.5, 3] },
  { n: 'Harga Emas', h: 'Rp 1,567,000 gr', p: '+12,000 (+0.77%)', up: true, s: [3, 3.5, 3.2, 4.5, 4, 5.5, 5.2, 6.5, 8], w: '#E0A520' },
  { n: 'Bitcoin (BTC)', h: 'Rp 1,094,500,000', p: '+18,200,000 (+1.69%)', up: true, s: [3, 4.5, 4, 5, 5.5, 5, 6.5, 6, 7.5] },
];
const EDU = [
  { id: 'e1', lv: 'Pemula', mnt: '15 menit', judul: 'Pengenalan Investasi untuk Pemula', desk: 'Memahami jenis-jenis investasi, risiko, dan manfaatnya.', ps: '32.1K peserta', jenis: 'Edukasi' },
  { id: 'e2', lv: 'Pemula', mnt: '20 menit', judul: 'Dasar-Dasar Saham', desk: 'Cara kerja saham, analisis sederhana, dan tips memilih saham.', ps: '28.5K peserta', jenis: 'Saham' },
  { id: 'e3', lv: 'Menengah', mnt: '25 menit', judul: 'Reksa Dana untuk Tujuan Jangka Panjang', desk: 'Strategi memilih reksa dana sesuai profil risiko.', ps: '18.2K peserta', jenis: 'Reksa Dana' },
  { id: 'e4', lv: 'Menengah', mnt: '30 menit', judul: 'Manajemen Risiko Portofolio', desk: 'Cara mengelola risiko dan mendiversifikasi aset.', ps: '12.6K peserta', jenis: 'Edukasi' },
];
const INSTR = [['Saham Indonesia', 'IDX', '128 Saham Populer', 'Lihat Saham', 'i1'], ['Reksa Dana', 'Berbagai Manajer Investasi', '256 Produk', 'Lihat Reksa Dana', 'i2'], ['ETF', 'Exchange Traded Fund', '48 Produk', 'Lihat ETF', 'i3'], ['Obligasi', 'Pemerintah & Korporasi', '72 Produk', 'Lihat Obligasi', 'i4'], ['Emas', 'Logam Mulia', 'Update Real-time', 'Lihat Harga', 'i5'], ['Kripto', 'Aset Digital', '120+ Koin', 'Lihat Kripto', 'i6']];
const ART = [
  { id: 'a1', judul: 'Analisis IHSG: Peluang dan Tantangan di Akhir 2026', oleh: 'oleh Tim myCITA', tgl: '12 Okt 2026' },
  { id: 'a2', judul: 'Strategi Investasi untuk Generasi Milenial', oleh: 'oleh Rina Putri', tgl: '10 Okt 2026' },
  { id: 'a3', judul: 'Perbandingan Reksa Dana vs ETF, Mana yang Cocok?', oleh: 'oleh Andi Wijaya', tgl: '08 Okt 2026' },
  { id: 'a4', judul: 'Investasi Emas di Tengah Ketidakpastian Global', oleh: 'oleh Tim myCITA', tgl: '06 Okt 2026' },
];

function Spark({ s, up, w = 78, h = 30, warna }) {
  const mx = Math.max(...s), mn = Math.min(...s);
  const pts = s.map((v, i) => `${(i / (s.length - 1)) * w},${h - 2 - ((v - mn) / (mx - mn || 1)) * (h - 4)}`).join(' ');
  return <Svg width={w} height={h}><Polyline points={pts} fill="none" stroke={warna || (up ? NAIK : TURUN)} strokeWidth={1.6} /></Svg>;
}
function Judul({ teks, aksi, onPress, ikon, warna, sub }) {
  return (
    <View style={{ gap: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {ikon ? <Icon name={ikon} size={18} color={warna || C.teal2} /> : null}
        <T w={800} size={ikon ? 15 : 14} style={{ flex: 1 }}>{teks}</T>
        {aksi ? <Pressable accessibilityRole="button" onPress={onPress}><T w={700} size={11} color={C.teal2}>{aksi} →</T></Pressable> : null}
      </View>
      {sub ? <T size={11} color={C.muted} numberOfLines={2}>{sub}</T> : null}
    </View>
  );
}
const Tombol = ({ t, onPress, aktif = true, penuh }) => (
  <Pressable accessibilityRole="button" onPress={onPress} style={{ paddingHorizontal: 12, minHeight: 30, borderRadius: 8, borderWidth: 1, borderColor: aktif ? C.teal2 : C.line, alignItems: 'center', justifyContent: 'center', ...(penuh ? { alignSelf: 'stretch' } : null) }}>
    <T w={800} size={penuh ? 10 : 11} color={aktif ? C.teal2 : C.muted} numberOfLines={2} style={{ textAlign: 'center' }}>{t}</T>
  </Pressable>
);

export default function InvestasiBaru({ go }) {
  const [tab, setTab] = useState('Semua');
  const [pesan, setPesan] = useState('');
  const [lebar, setLebar] = useState(0);
  const per = lebar >= 720 ? 4 : lebar >= 460 ? 2 : 1;
  const lbr = lebar ? Math.floor((lebar - 10 * (per - 1)) / per) : 170;
  const per6 = lebar >= 760 ? 6 : lebar >= 460 ? 3 : 2;
  const l6 = lebar ? Math.floor((lebar - 8 * (per6 - 1)) / per6) : 110;
  const per5 = lebar >= 760 ? 5 : lebar >= 460 ? 3 : 2;
  const l5 = lebar ? Math.floor((lebar - 10 * (per5 - 1)) / per5) : 130;
  const edu = EDU.filter((x) => ['Semua', 'Edukasi'].includes(tab) || x.jenis === tab);
  const info = (t) => setPesan(t + ' — fitur ini segera tersedia (contoh demo).');
  return (
    <Screen>
      <View style={{ gap: 14 }} onLayout={(e) => setLebar(e.nativeEvent.layout.width)}>
        <View style={{ ...kartu, aspectRatio: 941 / 213, backgroundColor: '#0F3B4A' }}>
          <Image source={R.hero} resizeMode="stretch" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} />
          <Pressable accessibilityRole="button" accessibilityLabel="Mulai Belajar" onPress={() => setTab('Edukasi')} style={{ position: 'absolute', left: '4.3%', top: '79%', width: '16.5%', height: '16%' }} />
          <Pressable accessibilityRole="button" accessibilityLabel="Simulasi Investasi" onPress={() => info('Simulasi Investasi')} style={{ position: 'absolute', left: '22.2%', top: '79%', width: '17.2%', height: '16%' }} />
        </View>
        {pesan ? <View style={{ ...kartu, padding: 10, backgroundColor: C.soft }}><T size={11} color={C.teal2}>{pesan}</T></View> : null}
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
          {TAB.map((t) => { const on = tab === t; return (
            <Pressable key={t} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => setTab(t)} style={{ paddingHorizontal: 14, minHeight: 32, borderRadius: 10, justifyContent: 'center', backgroundColor: on ? C.teal2 : C.card, borderWidth: 1, borderColor: on ? C.teal2 : C.line }}>
              <T w={on ? 800 : 600} size={11} color={on ? '#fff' : C.ink}>{t}</T>
            </Pressable>
          ); })}
        </View>

        <View style={{ gap: 8 }}>
          <Judul ikon="chart" warna={NAIK} teks="Ringkasan Pasar Hari Ini" sub="Pantau pergerakan pasar secara real-time dan dapatkan gambaran umum kondisi pasar." aksi="Lihat detail pasar" onPress={() => info('Detail pasar')} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {PASAR.map((p) => (
              <View key={p.n} style={{ ...kartu, width: l5, padding: 10, gap: 4 }}>
                <T size={10} color={C.muted} numberOfLines={1}>{p.n}</T>
                <T w={800} size={13} numberOfLines={1}>{p.h}</T>
                <T w={700} size={10} color={p.up ? NAIK : TURUN} numberOfLines={1}>{p.up ? '▲' : '▼'} {p.p}</T>
                <Spark s={p.s} up={p.up} warna={p.w} w={Math.max(60, l5 - 22)} h={26} />
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Judul ikon="book" warna="#E8A33D" teks="Rekomendasi Materi Edukasi untukmu" sub="Pelajari investasi dengan cara yang mudah dipahami, mulai dari dasar hingga strategi lanjutan." aksi="Lihat semua" onPress={() => setTab('Semua')} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {edu.length === 0 ? <T size={12} color={C.muted}>Belum ada materi di kategori ini.</T> : edu.map((k) => (
              <View key={k.id} style={{ ...kartu, width: lbr, paddingBottom: 10 }}>
                <View>
                  <Image source={R[k.id]} resizeMode="cover" style={{ width: lbr - 2, height: Math.round((lbr - 2) * 0.255) }} />
                  <View style={{ position: 'absolute', right: 8, bottom: 6, backgroundColor: 'rgba(15,40,50,0.85)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}><T w={700} size={9} color="#fff">◷ {k.mnt}</T></View>
                </View>
                <View style={{ paddingHorizontal: 10, gap: 4, marginTop: 8 }}>
                  <T w={800} size={12} numberOfLines={2} style={{ minHeight: 32 }}>{k.judul}</T>
                  <T size={10} color={C.muted} numberOfLines={3} style={{ minHeight: 40 }}>{k.desk}</T>
                  <View style={{ flexDirection: 'row', gap: 10, marginVertical: 2 }}><T size={10} color={C.muted}>▶ Video</T><T size={10} color={C.muted} numberOfLines={1}>◔ {k.ps}</T></View>
                  <Tombol penuh t="Mulai Belajar" onPress={() => info(k.judul)} />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Judul ikon="spark" warna="#E25822" teks="Instrumen Investasi Populer" sub="Lihat instrumen investasi yang banyak diminati pengguna myCITA." aksi="Lihat semua" onPress={() => setTab('Semua')} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {INSTR.map(([n, s, j, b, im]) => (
              <View key={n} style={{ ...kartu, width: l6, padding: 10, gap: 4 }}>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <Image source={R[im]} resizeMode="contain" style={{ width: 34, height: 34 }} />
                  <T w={800} size={11} numberOfLines={2} style={{ flex: 1 }}>{n}</T>
                </View>
                <T size={9} color={C.muted} numberOfLines={2} style={{ minHeight: 24 }}>{s}</T>
                <T size={9} color={C.muted} numberOfLines={1}>{j}</T>
                <Tombol penuh t={b} onPress={() => info(n)} />
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Judul ikon="bubble" warna={C.teal2} teks="Artikel dan Berita Terbaru" sub="Dapatkan insight dan informasi terbaru seputar investasi dari sumber terpercaya." aksi="Lihat semua" onPress={() => info('Semua artikel')} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {ART.map((a) => (
              <Pressable key={a.id} accessibilityRole="button" onPress={() => info(a.judul)} style={{ ...kartu, width: lbr, flexDirection: 'row', padding: 8, gap: 10, alignItems: 'center' }}>
                <Image source={R[a.id]} resizeMode="cover" style={{ width: 70, height: 76, borderRadius: 8 }} />
                <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                  <T w={800} size={11} numberOfLines={3}>{a.judul}</T>
                  <T size={10} color={C.muted} numberOfLines={1}>{a.oleh}</T>
                  <T size={10} color={C.muted} numberOfLines={1}>◷ {a.tgl}</T>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
        <T size={11} color={C.muted}>Semua harga, angka, dan data di halaman ini adalah contoh simulasi untuk demo — bukan data pasar nyata dan bukan nasihat investasi.</T>
      </View>
    </Screen>
  );
}

// ─── Panel kanan khusus halaman Saham & Investasi ────────────────────
export function PanelKananInvestasi({ go }) {
  const [st, setSt] = useState({});
  const tg = (k) => setSt({ ...st, [k]: !st[k] });
  const alok = [['Saham', 45, '#2F80ED'], ['Reksa Dana', 25, '#1FA37A'], ['Emas', 15, '#E8A33D'], ['Kripto', 10, '#9B51E0'], ['Lainnya', 5, '#9AA5A8']];
  const watch = [['BBCA', '9,425', '+75 (+0.80%)', true, [3, 4, 3.5, 5, 4.5, 6, 5.5, 7], 'w1'], ['TLKM', '3,120', '-20 (-0.64%)', false, [7, 6, 6.5, 5, 5.5, 4, 4.5, 3], 'w2'], ['BMRI', '6,900', '+50 (+0.73%)', true, [3, 3.5, 3.2, 4.5, 4, 5.5, 5.2, 6], 'w3'], ['ANTM', '1,675', '+45 (+2.76%)', true, [3, 3.4, 4, 3.6, 5, 5.5, 6, 7], 'w4'], ['BTC', '1,094,500,000', '+18,200,000 (+1.69%)', true, [3, 4.5, 4, 5, 5.5, 5, 6.5, 7], 'w5']];
  const tujuan = [['Beli Rumah', 'Rp 500,000,000', 0.2, 'Target 2031', 'g1'], ['Dana Pensiun', 'Rp 1,000,000,000', 0.1, 'Target 2045', 'g2']];
  const ev = [['25', 'Okt', 'Investasi Saham untuk Pemula', 'oleh Mirae Asset', 'Online • Gratis'], ['28', 'Okt', 'Strategi Reksa Dana Jangka Panjang', 'oleh Bibit', 'Online • Gratis'], ['02', 'Nov', 'Analisis Teknikal untuk Trader', 'oleh Komunitas Trader Indonesia', 'Online • Berbayar']];
  const kom = [['Investor Pemula Indonesia', '12.4K anggota', 'k1'], ['Saham & Analisis Teknikal', '8.7K anggota', 'k2'], ['Reksa Dana & Perencanaan Finansial', '6.2K anggota', 'k3']];
  return (
    <View style={{ gap: 12 }}>
      <View style={{ ...kartu, padding: 14, gap: 8 }}>
        <Judul teks="Portofolio Simulasi Saya" aksi="Lihat detail" onPress={() => go('keuangan')} />
        <T size={10} color={C.muted}>Latih strategi investasimu tanpa risiko finansial.</T>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View><T w={800} size={18}>Rp 10,000,000</T><T w={700} size={11} color={NAIK}>▲ +3.25% (1 bulan)</T></View>
          <Spark s={[3, 3.6, 3.2, 4.4, 4, 5.2, 4.8, 6, 6.6, 8]} up w={110} h={44} />
        </View>
        {alok.map(([n, p, w]) => (
          <View key={n} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: w }} />
            <T size={10} style={{ width: 66 }}>{n}</T>
            <T size={10} color={C.muted} style={{ width: 30 }}>{p}%</T>
            <View style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: C.soft }}><View style={{ width: `${p * 2}%`, height: 5, borderRadius: 3, backgroundColor: w }} /></View>
          </View>
        ))}
      </View>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Watchlist Saya" aksi="Lihat semua" onPress={() => go('investasi')} />
        {watch.map(([n, h, p, up, s, im]) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={R[im]} resizeMode="contain" style={{ width: 30, height: 30, borderRadius: 15 }} />
            <T w={800} size={12} style={{ width: 40 }}>{n}</T>
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={11} numberOfLines={1}>{h}</T><T w={700} size={9} color={up ? NAIK : TURUN} numberOfLines={1}>{p}</T></View>
            <Spark s={s} up={up} w={64} h={24} />
          </View>
        ))}
      </View>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Tujuan Finansial Saya" aksi="Kelola tujuan" onPress={() => go('tujuan')} />
        <T size={10} color={C.muted}>Tetapkan tujuan dan mulai investasikan masa depanmu.</T>
        {tujuan.map(([n, v, p, t, im]) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={R[im]} resizeMode="contain" style={{ width: 40, height: 40, borderRadius: 10 }} />
            <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><T w={800} size={11}>{n}</T><T size={9} color={C.muted}>{t}</T></View>
              <T w={700} size={10}>{v}</T>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><View style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: C.soft }}><View style={{ width: `${p * 100}%`, height: 5, borderRadius: 3, backgroundColor: C.teal2 }} /></View><T size={9} color={C.muted}>{Math.round(p * 100)}%</T></View>
            </View>
          </View>
        ))}
      </View>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Event & Webinar Terkait Investasi" aksi="Lihat semua" onPress={() => go('eventhal')} />
        {ev.map(([a, b, n, o, l]) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <View style={{ width: 40, height: 44, borderRadius: 8, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }}><T w={800} size={14}>{a}</T><T w={700} size={10}>{b}</T></View>
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={11} numberOfLines={2}>{n}</T><T size={10} color={C.muted} numberOfLines={1}>{o}</T><T size={10} color={C.muted}>{l}</T></View>
            <Tombol t={st[n] ? 'Terdaftar' : 'Daftar'} aktif={!st[n]} onPress={() => tg(n)} />
          </View>
        ))}
      </View>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Komunitas Investor" aksi="Lihat semua" onPress={() => go('komunitas2')} />
        {kom.map(([n, a, im]) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={R[im]} resizeMode="cover" style={{ width: 38, height: 38, borderRadius: 8 }} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={11} numberOfLines={2}>{n}</T><T size={10} color={C.muted}>{a}</T></View>
            <Tombol t={st[n] ? 'Bergabung' : 'Gabung'} aktif={!st[n]} onPress={() => tg(n)} />
          </View>
        ))}
      </View>
    </View>
  );
}
