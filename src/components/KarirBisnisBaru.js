import React, { useEffect, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import Svg, { G, Line, Polyline, Rect, Circle, Text as SvgText } from 'react-native-svg';
import { useApp } from '../state/AppContext';
import { findPersona } from '../state/persona';
import { Screen, T } from './ui';
import Icon from './Icon';
import { C } from '../theme';
import { rpShort } from '../utils/format';
import KarirBisnisLama from '../screens/KarirBisnis';

const kartu = { get backgroundColor() { return C.card; }, borderRadius: 14, borderWidth: 1, get borderColor() { return C.line; }, overflow: 'hidden' };
const IMG = {
  hero: require('../assets/beranda/kbz_hero.jpg'),
  heroK: require('../assets/beranda/kbk_hero.jpg'), clip: require('../assets/beranda/kbk_clip.jpg'),
  kb: [require('../assets/beranda/kbk_b0.jpg'), require('../assets/beranda/kbk_b1.jpg'), require('../assets/beranda/kbk_b2.jpg')],
  kc: [require('../assets/beranda/kbk_c0.jpg'), require('../assets/beranda/kbk_c1.jpg'), require('../assets/beranda/kbk_c2.jpg'), require('../assets/beranda/kbk_c3.jpg'), require('../assets/beranda/kbk_c4.jpg')],
  a1: require('../assets/beranda/kbz_a1.jpg'), a2: require('../assets/beranda/kbz_a2.jpg'), a3: require('../assets/beranda/kbz_a3.jpg'), a4: require('../assets/beranda/kbz_a4.jpg'), a5: require('../assets/beranda/kbz_a5.jpg'),
  ch: [require('../assets/beranda/kbr_ch0.jpg'), require('../assets/beranda/kbr_ch1.jpg'), require('../assets/beranda/kbr_ch2.jpg'), require('../assets/beranda/kbr_ch3.jpg')],
  km: [require('../assets/beranda/kbr_km0.jpg'), require('../assets/beranda/kbr_km1.jpg'), require('../assets/beranda/kbr_km2.jpg')],
  or: [require('../assets/beranda/kbr_or0.jpg'), require('../assets/beranda/kbr_or1.jpg'), require('../assets/beranda/kbr_or2.jpg')],
};
// Angka perubahan (↑12% dst.), kesehatan bisnis, tujuan, agenda, dan artikel adalah contoh demo.
const rpf = (n) => 'Rp' + Math.round(n || 0).toLocaleString('id-ID');
const jt = (n) => (n / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 2 });
const BISNIS = [['Bengkel Agus', 'Bengkel', 'briefcase'], ['Kelontong Istri', 'Toko Kelontong', 'store']];
const DELTA = [['+12%', '-5%', '+25%', '+8%', '+3%', '+2%'], ['+9%', '-3%', '+18%', '+6%', '+2%', '+1%']];
const BLN = ['Mei 2026', 'Jun 2026', 'Jul 2026', 'Agu 2026', 'Sep 2026', 'Okt 2026'];
const VAR = [[0.97, 0.99, 1.03, 0.98, 1.01, 1.02], [0.96, 0.98, 1.05, 0.99, 0.97, 1.05]];
const SEHAT = [['Keuangan', 70, '#2F80ED'], ['Pemasaran', 65, '#9B51E0'], ['Operasional', 80, '#E8A33D'], ['SDM', 60, '#1C6BA8'], ['Inovasi', 50, '#D6336C'], ['Kepuasan Pelanggan', 85, '#1FA37A']];
const TUJUAN = [['Meningkatkan Omzet Bulanan', 70, 'Des 2026', 'chart', '#E8A33D'], ['Membuka Cabang Kedua', 40, '2027', 'store', '#E25822'], ['Membangun Brand yang Dikenal', 60, '2027', 'flag', '#2F80ED']];
const LANGKAH = [
  'Bengkel: paket servis berkala dan pengingat pelanggan tetap',
  'Bengkel: catat jenis servis paling laris untuk stok sparepart',
  'Kelontong: catat barang laris dan tambah stok di jam ramai',
  'Pisahkan rekening usaha dan rumah tangga',
];
const LANGKAH2 = (mB, mK) => [
  ['Naikkan margin toko kelontong', `Margin kelontong ${mK}% jauh di bawah bengkel ${mB}%. Cek harga beli dan tambah barang berlaba tinggi.`, 'Prioritas Tinggi', '#E25822', 'chart', 92],
  ['Paket servis berkala + pengingat', 'Tawarkan paket servis per 2 bulan dan kirim pengingat WhatsApp agar pelanggan tetap kembali.', 'Prioritas Tinggi', '#2F80ED', 'bell', 85],
  ['Catat barang & servis paling laris', 'Dasar menentukan stok sparepart bengkel dan stok kelontong di jam ramai, supaya modal tidak mengendap.', 'Prioritas Sedang', '#E8A33D', 'book', 70],
  ['Pisahkan rekening usaha & rumah', 'Memudahkan membaca laba bersih sebenarnya dan menyiapkan pengajuan modal nanti.', 'Prioritas Rendah', '#1FA37A', 'wallet', 55],
];
const AGENDA = {
  'Hari Ini': [['08:00', 'Cek Stok Sparepart', 'Di Bengkel', '#E8A33D'], ['10:00', 'Meeting dengan Supplier', 'Online', '#2F80ED'], ['13:00', 'Review Laporan Penjualan', 'Di Kelontong', '#D6336C'], ['16:00', 'Konten Media Sosial', 'Di Toko', '#E8A33D'], ['19:00', 'Evaluasi Keuangan', 'Di Rumah', '#1FA37A']],
  'Minggu Ini': [['Sen', 'Belanja stok kelontong', 'Pasar induk', '#E8A33D'], ['Rab', 'Servis pelanggan langganan', 'Di Bengkel', '#2F80ED'], ['Jum', 'Rekap pembukuan mingguan', 'Di Rumah', '#1FA37A'], ['Sab', 'Promo akhir pekan', 'Di Toko', '#D6336C']],
  'Bulan Ini': [['05', 'Bayar tagihan listrik usaha', 'Online', '#E8A33D'], ['15', 'Rekap omzet dua usaha', 'Di Rumah', '#1FA37A'], ['28', 'Evaluasi target bulanan', 'Di Kantor', '#2F80ED']],
};
const ARTIKEL = [['a1', 'Strategi', '5 Strategi Pemasaran Efektif untuk UMKM'], ['a2', 'Keuangan', 'Cara Mengelola Keuangan Usaha dengan Baik'], ['a3', 'Pemasaran', 'Tips Meningkatkan Loyalitas Pelanggan'], ['a4', 'Operasional', 'Panduan Ekspansi Bisnis untuk UMKM'], ['a5', 'Strategi', 'Manfaat Digitalisasi dalam Bisnis Kuliner']];
const TABART = ['Semua', 'Strategi', 'Keuangan', 'Pemasaran', 'Operasional', 'SDM', 'Legalitas'];

function Judul({ teks, ikon, warna, aksi, onPress, kanan }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      {ikon ? <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: warna, alignItems: 'center', justifyContent: 'center' }}><Icon name={ikon} size={15} color="#fff" /></View> : null}
      <T w={800} size={15} style={{ flex: 1 }} numberOfLines={1}>{teks}</T>
      {kanan}
      {aksi ? <Pressable accessibilityRole="button" onPress={onPress}><T w={700} size={11} color={C.teal2}>{aksi} →</T></Pressable> : null}
    </View>
  );
}

function Dropdown({ nilai, opsi, onPilih, lebar = 150 }) {
  const [buka, setBuka] = useState(false);
  return (
    <View style={{ zIndex: 20 }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Pilih" onPress={() => setBuka(!buka)} style={{ minHeight: 32, width: lebar, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <T size={11} numberOfLines={1} style={{ flex: 1 }}>{nilai}</T><T size={10} color={C.muted}>{buka ? '▲' : '▼'}</T>
      </Pressable>
      {buka ? (
        <View style={{ position: 'absolute', top: 34, left: 0, width: lebar, ...kartu, borderRadius: 8, zIndex: 30 }}>
          {opsi.map((o) => (
            <Pressable key={o} accessibilityRole="button" onPress={() => { onPilih(o); setBuka(false); }} style={{ paddingHorizontal: 10, paddingVertical: 8, backgroundColor: o === nilai ? C.soft : C.card }}>
              <T size={11} w={o === nilai ? 800 : 500}>{o}</T>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function Pertumbuhan({ omzet, biaya, idx, lebar }) {
  const w = Math.max(lebar, 280), h = 190, kiri = 34, bawah = 30, atas = 10;
  const pend = VAR[idx].map((v) => omzet * v), peng = VAR[idx].map((v) => biaya * (2 - v)), laba = pend.map((v, i) => v - peng[i]);
  const mx = Math.ceil((Math.max(...pend) * 1.1) / 5000000) * 5000000 || 1;
  const y = (v) => atas + (h - atas - bawah) * (1 - v / mx);
  const slot = (w - kiri - 6) / 6, bw = Math.min(14, slot / 3);
  const cx = (i) => kiri + i * slot + slot / 2;
  return (
    <View>
      <Svg width={w} height={h}>
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <G key={g}><Line x1={kiri} x2={w - 6} y1={y(mx * g)} y2={y(mx * g)} stroke={C.line} strokeWidth={1} /><SvgText x={kiri - 5} y={y(mx * g) + 3} fontSize={9} fill={C.muted} textAnchor="end">{Math.round((mx * g) / 1000000)} jt</SvgText></G>
        ))}
        {pend.map((v, i) => (
          <G key={i}>
            <Rect x={cx(i) - bw - 1} y={y(v)} width={bw} height={h - bawah - y(v)} rx={2} fill="#3DC8A0" />
            <Rect x={cx(i) + 1} y={y(peng[i])} width={bw} height={h - bawah - y(peng[i])} rx={2} fill="#F28B9A" />
            <SvgText x={cx(i)} y={h - 14} fontSize={8} fill={C.muted} textAnchor="middle">{BLN[i]}</SvgText>
          </G>
        ))}
        <Polyline points={laba.map((v, i) => `${cx(i)},${y(v)}`).join(' ')} fill="none" stroke="#1C6BA8" strokeWidth={2} />
        {laba.map((v, i) => <Circle key={i} cx={cx(i)} cy={y(v)} r={3} fill="#1C6BA8" />)}
      </Svg>
      <View style={{ flexDirection: 'row', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
        <T size={10} color={C.muted}><T size={10} color="#3DC8A0">■ </T>Pendapatan</T>
        <T size={10} color={C.muted}><T size={10} color="#F28B9A">■ </T>Pengeluaran</T>
        <T size={10} color={C.muted}><T size={10} color="#1C6BA8">● </T>Laba Bersih</T>
      </View>
    </View>
  );
}

function OmzetGabungan({ b, k, lebar }) {
  const w = Math.max(lebar, 260), h = 150, kiri = 30, bawah = 20, atas = 6;
  const vb = VAR[0].map((v) => b * v), vk = VAR[1].map((v) => k * v);
  const mx = Math.ceil((Math.max(...vb.map((v, i) => v + vk[i])) * 1.1) / 5000000) * 5000000 || 1;
  const y = (v) => atas + (h - atas - bawah) * (1 - v / mx);
  const slot = (w - kiri - 6) / 6, bw = Math.min(26, slot * 0.6);
  return (
    <View>
      <Svg width={w} height={h}>
        {[0, 0.5, 1].map((g) => (<G key={g}><Line x1={kiri} x2={w - 6} y1={y(mx * g)} y2={y(mx * g)} stroke={C.line} strokeWidth={1} /><SvgText x={kiri - 5} y={y(mx * g) + 3} fontSize={9} fill={C.muted} textAnchor="end">{Math.round((mx * g) / 1000000)}</SvgText></G>))}
        {vb.map((v, i) => { const x = kiri + i * slot + slot / 2 - bw / 2; return (
          <G key={i}>
            <Rect x={x} y={y(v)} width={bw} height={h - bawah - y(v)} fill="#0F4C47" />
            <Rect x={x} y={y(v + vk[i])} width={bw} height={y(v) - y(v + vk[i])} rx={3} fill="#F2A93B" />
            <SvgText x={x + bw / 2} y={h - 6} fontSize={8} fill={C.muted} textAnchor="middle">{BLN[i].slice(0, 3)}</SvgText>
          </G>
        ); })}
      </Svg>
      <View style={{ flexDirection: 'row', gap: 14, justifyContent: 'center' }}>
        <T size={10} color={C.muted}><T size={10} color="#0F4C47">■ </T>Bengkel</T>
        <T size={10} color={C.muted}><T size={10} color="#F2A93B">■ </T>Kelontong</T>
      </View>
    </View>
  );
}

function Cincin({ nilai }) {
  const r = 34, kel = 2 * Math.PI * r;
  return (
    <View style={{ width: 84, height: 84 }}>
      <Svg width={84} height={84} viewBox="0 0 84 84">
        <Circle cx="42" cy="42" r={r} fill="none" stroke={C.soft} strokeWidth="9" />
        <Circle cx="42" cy="42" r={r} fill="none" stroke="#1C9BD6" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${kel * nilai / 100} ${kel}`} transform="rotate(-90 42 42)" />
      </Svg>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}><T w={800} size={18} color="#1C6BA8">{nilai}%</T></View>
    </View>
  );
}

export default function KarirBisnisBaru(props) {
  const app = useApp();
  if (app.activeUserId !== 'agus') return <KarirBisnisLama {...props} />;
  return <HalamanAgus {...props} />;
}

function HalamanAgus({ go }) {
  const app = useApp();
  const persona = findPersona('agus');
  const [seg, setSeg] = useState('bisnis');
  const [pilih, setPilih] = useState(BISNIS[0][1]);
  const [rentang, setRentang] = useState('6 Bulan Terakhir');
  const [tabArt, setTabArt] = useState('Semua');
  const [simpan, setSimpan] = useState({});
  const [pesan, setPesan] = useState('');
  const [lebar, setLebar] = useState(0);
  const [lbT, setLbT] = useState(0);
  const dua = lebar >= 760;
  const idx = pilih === BISNIS[0][1] ? 0 : 1;
  const u = persona?.usaha?.[idx];
  const omzet = u?.omzet || 0, biaya = u?.biaya || 0, bersih = omzet - biaya;
  const totB = (persona?.usaha || []).reduce((t, x) => t + (x.omzet - x.biaya), 0) || 1;
  const [urut, setUrut] = useState([0, 1, 2, 3]);
  const [detail, setDetail] = useState(false);
  const geser = (p, d) => { const n = [...urut]; [n[p], n[p + d]] = [n[p + d], n[p]]; setUrut(n); };
  const kontribusi = Math.round((bersih / totB) * 100);
  const margin = omzet > 0 ? Math.round((bersih / omzet) * 100) : 0;
  const kotak = [
    ['Pendapatan Bulan Ini', rpf(omzet), `↑ ${DELTA[idx][0]} dari bulan lalu`, 'wallet', '#1FA37A', true],
    ['Pengeluaran Bulan Ini', rpf(biaya), `↓ ${DELTA[idx][1].replace('-', '')} dari bulan lalu`, 'chart', '#2F80ED', true],
    ['Laba Bersih', rpf(bersih), `↑ ${DELTA[idx][2]} dari bulan lalu`, 'check', '#9B51E0', true],
    ['Omzet Rata-rata', rpf(omzet), 'per bulan', 'wallet', '#E25822', false],
    ['Biaya Operasional', rpf(biaya), 'per bulan', 'briefcase', '#9B51E0', false],
    ['Margin', `${margin}%`, 'margin bersih', 'chart', '#E8A33D', false],
  ];

  // Simulasi pengembangan usaha (data dari skenario Langflow, sama seperti sebelumnya)
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const b = persona?.usaha?.[0], k = persona?.usaha?.[1];
  const sk = app.skenario?.agus;
  const bT = sk?.bengkel?.pengembangan_usaha?.[0]?.tambahan_laba_bulanan ?? null;
  const kT = sk?.kelontong?.pengembangan_usaha?.[0]?.tambahan_laba_bulanan ?? null;
  const gT = bT != null && kT != null ? bT + kT : null;
  const sisaD = sk?.dasar?.dashboard?.sisa ?? null, sisaG = sk?.gabungan?.dashboard?.sisa ?? null;
  const muat = async () => { setBusy(true); setErr(''); try { await app.loadSkenarioAgus(); } catch (e) { setErr(e.message); } setBusy(false); };
  useEffect(() => { if (!sk && app.loadSkenarioAgus) muat(); }, []); // eslint-disable-line
  const mB = b ? Math.round(((b.omzet - b.biaya) / b.omzet) * 100) : 0, mK = k ? Math.round(((k.omzet - k.biaya) / k.omzet) * 100) : 0;

  const chip = [['Ide & Validasi', 'Temukan ide bisnis potensial', 'spark', '#1FA37A', 'tambahbisnis'], ['Strategi & Pengembangan', 'Rancang strategi untuk tumbuh', 'chart', '#2F80ED', 'roadmap'], ['Permodalan', 'Akses sumber pendanaan', 'wallet', '#1FA37A', 'keuangan'], ['Pemasaran', 'Tingkatkan penjualan', 'bell', '#D6336C', 'komunitas2'], ['Konsultasi Bisnis', 'Dengan mentor ahli', 'chat', '#E25822', 'chat']];

  return (
    <Screen>
      <View style={{ gap: 14 }} onLayout={(e) => setLebar(e.nativeEvent.layout.width)}>
        <View style={{ ...kartu, aspectRatio: 897 / 244, minHeight: 170, backgroundColor: '#1B2A3A', overflow: 'hidden' }}>
          <Image source={seg === 'karir' ? IMG.heroK : IMG.hero} resizeMode="stretch" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} />
          <View style={{ position: 'absolute', left: 0, bottom: 0, width: '44%', height: '19.5%', minHeight: 40, backgroundColor: '#ECF5FE', borderTopRightRadius: 14, flexDirection: 'row', gap: 6, paddingHorizontal: 4, paddingTop: 3, paddingBottom: 3 }}>
            {[['karir', 'Karir', 'user'], ['bisnis', 'Bisnis', 'store']].map(([k2, l, ik]) => { const on = seg === k2; return (
              <Pressable key={k2} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => setSeg(k2)} style={{ flex: 1, borderRadius: 10, backgroundColor: on ? '#0F7C78' : '#E3EEFA', flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={ik} size={15} color={on ? '#fff' : '#1D6FD1'} /><T w={800} size={13} color={on ? '#fff' : '#1D6FD1'}>{l}</T>
              </Pressable>
            ); })}
          </View>
        </View>

        {seg === 'karir' ? <KarirBaruInline go={go} setSeg={setSeg} /> : (
          <>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {chip.map(([n, s, ik, w, r]) => (
                <Pressable key={n} accessibilityRole="button" onPress={() => go(r)} style={{ ...kartu, flexGrow: 1, flexBasis: dua ? 150 : 140, padding: 10, flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: w, alignItems: 'center', justifyContent: 'center' }}><Icon name={ik} size={17} color="#fff" /></View>
                  <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={10} numberOfLines={2}>{n}</T><T size={9} color={C.muted} numberOfLines={2}>{s}</T></View>
                </Pressable>
              ))}
            </View>
            {pesan ? <View style={{ ...kartu, padding: 10, backgroundColor: C.soft }}><T size={11} color={C.teal2}>{pesan}</T></View> : null}

            <View style={{ flexDirection: dua ? 'row' : 'column', gap: 12, zIndex: 10 }}>
              <View style={{ ...kartu, padding: 14, gap: 12, flex: dua ? 1 : undefined, overflow: 'visible', zIndex: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, zIndex: 20, flexWrap: 'wrap' }}>
                  <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#2F80ED', alignItems: 'center', justifyContent: 'center' }}><Icon name="briefcase" size={15} color="#fff" /></View>
                  <T w={800} size={15} style={{ flexGrow: 1, flexShrink: 0 }}>Ringkasan Bisnis Saya</T>
                  <Dropdown nilai={pilih} opsi={BISNIS.map((x) => x[1])} onPilih={setPilih} lebar={140} />
                  <Pressable accessibilityRole="button" onPress={() => go('tambahbisnis')} style={{ paddingHorizontal: 10, minHeight: 32, borderRadius: 8, borderWidth: 1, borderColor: C.teal2, justifyContent: 'center' }}><T w={800} size={11} color={C.teal2}>Kelola Bisnis →</T></Pressable>
                </View>
                <T size={11} color={C.muted}>Dua sumber pendapatan: bengkel motor milik Agus dan usaha kelontong milik istri.</T>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {kotak.map(([j, v, s, ik, w, naik]) => (
                    <View key={j} style={{ flexGrow: 1, flexBasis: 150, borderWidth: 1, borderColor: C.line, borderRadius: 10, padding: 10, flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                      <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: w, alignItems: 'center', justifyContent: 'center' }}><Icon name={ik} size={16} color="#fff" /></View>
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <T w={800} size={14} numberOfLines={1} adjustsFontSizeToFit>{v}</T>
                        <T size={9} color={C.muted} numberOfLines={1}>{j}</T>
                        <T size={9} color={naik ? '#1F8A4C' : C.muted} numberOfLines={1}>{s}</T>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
              <View style={{ ...kartu, padding: 14, gap: 8, flex: dua ? 1 : undefined, zIndex: 5 }} onLayout={(e) => setLbT(e.nativeEvent.layout.width - 28)}>
                <Judul ikon="chart" warna="#2F80ED" teks="Pertumbuhan Bisnis" kanan={<Dropdown nilai={rentang} opsi={['3 Bulan Terakhir', '6 Bulan Terakhir']} onPilih={setRentang} lebar={130} />} />
                <View style={{ flex: 1, justifyContent: 'center', gap: 14 }}>
                <Pertumbuhan omzet={omzet} biaya={biaya} idx={idx} lebar={lbT} />
                <View style={{ gap: 6, marginTop: 8 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><T size={11} color={C.muted}>{pilih} · kontribusi ke pendapatan usaha</T><T w={800} size={11} color={idx === 0 ? C.teal2 : '#9A4610'}>{kontribusi}%</T></View>
                  <View style={{ flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', gap: 3 }}>
                    <View style={{ flex: Math.max(biaya, 1), backgroundColor: '#B8C9C5' }} />
                    <View style={{ flex: Math.max(bersih, 1), backgroundColor: idx === 0 ? '#0F4C47' : '#F2A93B' }} />
                  </View>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <T size={10} color={C.muted}><T size={10} color="#B8C9C5">■ </T>Biaya</T>
                    <T size={10} color={C.muted}><T size={10} color={idx === 0 ? '#0F4C47' : '#F2A93B'}>■ </T>Bersih</T>
                  </View>
                </View>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: dua ? 'row' : 'column', gap: 12 }}>
              <View style={{ ...kartu, padding: 14, gap: 8, flex: dua ? 1 : undefined }}>
                <Judul ikon="chart" warna="#1FA37A" teks="Simulasi Pengembangan Usaha" />
                {busy && !sk ? <T size={12} color={C.muted}>Memuat simulasi dari Langflow…</T> : null}
                {(() => {
                  const mx = Math.max(bT || 0, kT || 0, gT || 0, 1);
                  return [['B', 'Omzet bengkel +20%', bT, '#0F4C47', `Margin tetap ${mB}%`], ['C', 'Omzet kelontong +20%', kT, '#F2A93B', `Margin tetap ${mK}%`], ['B+C', 'Gabungan', gT, '#1FA37A', 'Kedua usaha naik']].map(([kode, l, v, w, cat]) => (
                    <View key={kode} style={{ gap: 4 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={{ minWidth: 30, paddingHorizontal: 5, height: 22, borderRadius: 7, backgroundColor: w, alignItems: 'center', justifyContent: 'center' }}><T w={800} size={10} color="#fff">{kode}</T></View>
                        <View style={{ flex: 1, minWidth: 0 }}><T w={700} size={12} numberOfLines={1}>{l}</T><T size={9} color={C.muted}>{cat}</T></View>
                        <T w={800} size={13} color={C.teal2}>{v != null ? `+${rpShort(v)}` : '–'}<T size={9} color={C.muted}> /bln</T></T>
                      </View>
                      <View style={{ height: 10, borderRadius: 5, backgroundColor: C.soft, overflow: 'hidden' }}><View style={{ width: `${Math.max(4, Math.round(((v || 0) / mx) * 100))}%`, height: 10, borderRadius: 5, backgroundColor: w }} /></View>
                    </View>
                  ));
                })()}
                <View style={{ borderTopWidth: 1, borderTopColor: C.line, paddingTop: 10, gap: 6 }}>
                  <T w={800} size={11}>Sisa uang per bulan (dampak ke rumah)</T>
                  {(() => { const m = Math.max(sisaD || 0, sisaG || 0, 1); return [['Sekarang', sisaD, '#B8C9C5'], ['Setelah simulasi', sisaG, '#1FA37A']].map(([n, v, w]) => (
                    <View key={n} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <T size={10} color={C.muted} style={{ width: 92 }}>{n}</T>
                      <View style={{ flex: 1, height: 14, borderRadius: 7, backgroundColor: C.soft, overflow: 'hidden' }}><View style={{ width: `${Math.max(6, Math.round(((v || 0) / m) * 100))}%`, height: 14, borderRadius: 7, backgroundColor: w }} /></View>
                      <T w={800} size={11} style={{ width: 62, textAlign: 'right' }}>{v != null ? rpShort(v) : '–'}</T>
                    </View>
                  )); })()}
                  <T size={10} color={C.muted} style={{ lineHeight: 15 }}>Tambahan laba dihitung dari kenaikan omzet bengkel dan kelontong masing-masing 20%, dengan margin masing-masing tetap ({mB}% dan {mK}%).</T>
                </View>
                {err ? <T size={12} color={C.warn}>{err}</T> : null}
                {!sk && !busy ? <Pressable accessibilityRole="button" onPress={muat} style={{ alignSelf: 'flex-start', paddingHorizontal: 12, minHeight: 32, borderRadius: 8, borderWidth: 1, borderColor: C.teal2, justifyContent: 'center' }}><T w={800} size={11} color={C.teal2}>Muat ulang simulasi</T></Pressable> : null}
                <Pressable accessibilityRole="button" onPress={() => go('roadmap')} style={{ alignSelf: 'flex-start', paddingHorizontal: 12, minHeight: 32, borderRadius: 8, borderWidth: 1, borderColor: C.line, justifyContent: 'center' }}><T w={700} size={11} color={C.muted}>Lihat dampak ke rumah →</T></Pressable>
              </View>
              <View style={{ ...kartu, padding: 14, gap: 10, flex: dua ? 1 : undefined }}>
                <Judul ikon="heart" warna="#1FA37A" teks="Aspek Bisnis" aksi="Lihat detail" onPress={() => setPesan('Detail kesehatan bisnis akan segera tersedia (contoh demo).')} />
                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                  <Cincin nilai={72} />
                  <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={13} color="#1C6BA8">Dalam Kondisi Baik</T><T size={10} color={C.muted} style={{ lineHeight: 15 }}>Bisnismu berjalan dengan baik. Terus pertahankan dan tingkatkan performa di area yang masih kurang.</T></View>
                </View>
                {SEHAT.map(([n, v, w]) => (
                  <View key={n} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: w }} />
                    <T size={10} style={{ width: 110 }} numberOfLines={1}>{n}</T>
                    <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: C.soft }}><View style={{ width: `${v}%`, height: 6, borderRadius: 3, backgroundColor: w }} /></View>
                    <T w={700} size={10} style={{ width: 32, textAlign: 'right' }}>{v}%</T>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ flexDirection: dua ? 'row' : 'column', gap: 12 }}>
              <View style={{ ...kartu, padding: 14, gap: 10, flex: dua ? 1 : undefined }}>
                <Judul ikon="check" warna="#1FA37A" teks="Langkah Prioritas Bisnis" aksi={detail ? 'Tutup detail' : 'Lihat detail'} onPress={() => setDetail(!detail)} />
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: C.line, gap: 6 }}>
                  <T w={800} size={9} color={C.muted} style={{ width: 34, textAlign: 'center' }}>Rank</T>
                  <T w={800} size={9} color={C.muted} style={{ flex: 1 }}>Langkah</T>
                  <T w={800} size={9} color={C.muted} style={{ width: 84, textAlign: 'center' }}>Prioritas</T>
                  <T w={800} size={9} color={C.muted} style={{ width: 44, textAlign: 'center' }}>Skor</T>
                  <T w={800} size={9} color={C.muted} style={{ width: 46, textAlign: 'center' }}>Urutan</T>
                </View>
                {urut.map((id, pos) => { const [n, ket, tag, w, , skor] = LANGKAH2(mB, mK)[id]; const wb = tag === 'Prioritas Tinggi' ? ['#FDE7E7', '#B42318'] : tag === 'Prioritas Sedang' ? ['#FFF1D6', '#9A5B00'] : ['#E3F4EA', '#1F8A4C']; return (
                  <View key={id} style={{ borderBottomWidth: pos < urut.length - 1 ? 1 : 0, borderBottomColor: C.line, paddingVertical: 8, gap: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={{ width: 34, alignItems: 'center' }}><View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' }}><T w={800} size={11} color={C.teal2}>{pos + 1}</T></View></View>
                      <T w={700} size={11} style={{ flex: 1, lineHeight: 15 }} numberOfLines={2}>{n}</T>
                      <View style={{ width: 84, alignItems: 'center' }}><View style={{ width: 80, paddingVertical: 3, borderRadius: 6, backgroundColor: wb[0], alignItems: 'center' }}><T w={700} size={9} color={wb[1]}>{tag}</T></View></View>
                      <View style={{ width: 44, alignItems: 'center', gap: 2 }}><T w={800} size={12} color={w}>{skor}</T><View style={{ width: 34, height: 4, borderRadius: 2, backgroundColor: C.soft }}><View style={{ width: `${skor}%`, height: 4, borderRadius: 2, backgroundColor: w }} /></View></View>
                      <View style={{ width: 46, flexDirection: 'row', justifyContent: 'center', gap: 2 }}>
                        <Pressable accessibilityRole="button" accessibilityLabel="Naikkan prioritas" disabled={pos === 0} onPress={() => geser(pos, -1)} style={{ width: 20, height: 22, alignItems: 'center', justifyContent: 'center', opacity: pos === 0 ? 0.25 : 1 }}><Icon name="up" size={15} color={C.teal2} /></Pressable>
                        <Pressable accessibilityRole="button" accessibilityLabel="Turunkan prioritas" disabled={pos === urut.length - 1} onPress={() => geser(pos, 1)} style={{ width: 20, height: 22, alignItems: 'center', justifyContent: 'center', opacity: pos === urut.length - 1 ? 0.25 : 1 }}><Icon name="down" size={15} color={C.teal2} /></Pressable>
                      </View>
                    </View>
                    {detail ? <T size={10} color={C.muted} style={{ lineHeight: 15, paddingLeft: 40 }}>{ket}</T> : null}
                  </View>
                ); })}
                <T size={10} color={C.muted}>Skor prioritas (0–100) dihitung dari dampak dan kemudahan, contoh demo. Geser panah untuk mengubah urutan.</T>
              </View>
              <View style={{ ...kartu, padding: 14, gap: 10, flex: dua ? 1 : undefined }}>
                <Judul ikon="flag" warna="#E8A33D" teks="Target Bisnis" aksi="Lihat semua" onPress={() => go('tujuan')} />
                <View style={{ flex: 1, gap: 10 }}>
                {TUJUAN.map(([n, p, t, ik, w]) => (
                  <View key={n} style={{ flex: 1, minHeight: 74, borderWidth: 1, borderColor: C.line, borderRadius: 12, padding: 10, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: w, alignItems: 'center', justifyContent: 'center' }}><Icon name={ik} size={20} color="#fff" /></View>
                    <View style={{ flex: 1, minWidth: 0, gap: 6 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <T w={800} size={12} numberOfLines={2} style={{ flex: 1 }}>{n}</T>
                        <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, backgroundColor: C.soft }}><T w={700} size={9} color={C.teal2}>Target {t}</T></View>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: C.soft, overflow: 'hidden' }}><View style={{ width: `${p}%`, height: 8, borderRadius: 4, backgroundColor: w }} /></View>
                        <T w={800} size={11} style={{ width: 34, textAlign: 'right' }}>{p}%</T>
                      </View>
                    </View>
                  </View>
                ))}
                </View>
              </View>
            </View>

            <View style={{ ...kartu, padding: 14, gap: 10 }}>
              <Judul ikon="book" warna="#1C6BA8" teks="Artikel & Tips Bisnis" aksi="Lihat semua" onPress={() => setTabArt('Semua')} />
              <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                {TABART.map((t) => { const on = tabArt === t; return (
                  <Pressable key={t} accessibilityRole="tab" onPress={() => setTabArt(t)} style={{ paddingHorizontal: 12, minHeight: 28, borderRadius: 8, justifyContent: 'center', backgroundColor: on ? C.teal2 : C.card, borderWidth: 1, borderColor: on ? C.teal2 : C.line }}><T w={on ? 800 : 600} size={10} color={on ? '#fff' : C.ink}>{t}</T></Pressable>
                ); })}
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {ARTIKEL.filter((a) => tabArt === 'Semua' || a[1] === tabArt).map(([id, kat, j]) => (
                  <Pressable key={id} accessibilityRole="button" onPress={() => setPesan(j + ' — artikel lengkap akan segera tersedia (contoh demo).')} style={{ width: dua ? '18.6%' : '47%' }}>
                    <View><Image source={IMG[id]} resizeMode="cover" style={{ width: '100%', height: 70, borderRadius: 8 }} />
                      <Pressable accessibilityRole="button" accessibilityLabel="Simpan" onPress={() => setSimpan({ ...simpan, [id]: !simpan[id] })} style={{ position: 'absolute', right: 6, top: 6, width: 22, height: 22, borderRadius: 6, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}><T size={12} color={simpan[id] ? '#D9A21B' : C.teal2}>{simpan[id] ? '★' : '☆'}</T></Pressable>
                    </View>
                    <T w={800} size={11} numberOfLines={2} style={{ marginTop: 4 }}>{j}</T>
                  </Pressable>
                ))}
                {ARTIKEL.filter((a) => tabArt === 'Semua' || a[1] === tabArt).length === 0 ? <T size={11} color={C.muted}>Belum ada artikel di kategori ini.</T> : null}
              </View>
            </View>
            <T size={11} color={C.muted}>Angka perubahan, kesehatan bisnis, tujuan, agenda, dan artikel di halaman ini adalah contoh untuk demo.</T>
          </>
        )}
      </View>
    </Screen>
  );
}

// Tab "Karir" untuk Agus: isi lama (hasil karier atau empty state) tetap dipakai
function KarirBaruInline({ go, setSeg }) {
  const app = useApp();
  const hasil = app.karier?.hasil;
  const reko = hasil?.rekomendasi || [];
  const [tutup, setTutup] = useState(false);
  const mul = /^#f/i.test(String(C.card)) ? { mixBlendMode: 'multiply' } : {};
  const [lebar, setLebar] = useState(700);
  const lebarLayar = lebar >= 640;
  const langkah = [['Lengkapi Minat & Profil Karier'], ['Dapatkan Rekomendasi Jalur Karier'], ['Ikuti Belajar & Pengembangan Skill'], ['Lihat Peluang (Kerja, Usaha, Freelance, dll)']];
  const aktif = reko.length ? 2 : 0;
  const pilihan = [['Bekerja', '(Karyawan/Profesional)', '#EFF9FE', () => go('kerja')], ['Freelance', '(Pekerjaan Fleksibel)', '#F6F0FE', () => go('kerja')], ['Melanjutkan Studi', '(Kuliah/Pelatihan Lanjutan)', '#FEF6EA', () => go('belajar')], ['Proyek & Kompetisi', '(Pengalaman & Portofolio)', '#FEEEF6', () => go('kompetisi')]];
  const manfaat = [['Rekomendasi karier yang sesuai'], ['Saran belajar & pengembangan skill'], ['Peluang kerja, usaha, atau proyek']];
  return (
    <View style={{ gap: 12 }} onLayout={(e) => setLebar(e.nativeEvent.layout.width)}>
      {reko.length ? (
        <View style={{ ...kartu, padding: 16, gap: 10 }}>
          <Judul ikon="route" warna="#1FA37A" teks="Rekomendasi Karier untuk Agus" aksi="Lihat detail & dampak" onPress={() => go('tambahkarir')} />
          {reko.slice(0, 3).map((r) => (
            <View key={r.id || r.profesi} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <View style={{ flex: 1 }}><T w={700} size={14}>{r.profesi}</T><T size={12} color={C.muted}>Kecocokan {r.skor_kecocokan}</T></View>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.teal2 }} />
            </View>
          ))}
          <Pressable accessibilityRole="button" onPress={() => go('tambahkarir')} style={{ minHeight: 40, borderRadius: 10, backgroundColor: C.teal2, alignItems: 'center', justifyContent: 'center' }}><T w={800} size={12} color="#fff">Lihat detail & dampak</T></Pressable>
        </View>
      ) : tutup ? null : (
        <View style={{ ...kartu, padding: 16, flexDirection: lebarLayar ? 'row' : 'column', gap: 16, alignItems: 'center', backgroundColor: '#F2FBF8' }}>
          <Image source={IMG.clip} resizeMode="contain" style={{ width: 150, height: 137, ...mul }} />
          <View style={{ flex: 1, gap: 10 }}>
            <T w={800} size={20} color="#0F4C47">Lengkapi Minat Kariermu Dulu Yuk!</T>
            <T size={12} color={C.muted} style={{ lineHeight: 18 }}>Bantu kami memahami minat, keahlian, dan tujuanmu agar bisa memberikan rekomendasi karier yang lebih tepat dan personal.</T>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {manfaat.map(([n], i) => (
                <View key={n} style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexBasis: 150, flexGrow: 1 }}>
                  <Image source={IMG.kb[i]} style={{ width: 36, height: 36, borderRadius: 18 }} />
                  <T w={600} size={11} style={{ flex: 1 }}>{n}</T>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              <Pressable accessibilityRole="button" onPress={() => go('tambahkarir')} style={{ minHeight: 40, paddingHorizontal: 18, borderRadius: 10, backgroundColor: '#0F7C5A', justifyContent: 'center' }}><T w={800} size={12} color="#fff">Lengkapi Minat Karier Sekarang →</T></Pressable>
              <Pressable accessibilityRole="button" onPress={() => setTutup(true)} style={{ minHeight: 40, paddingHorizontal: 22, borderRadius: 10, borderWidth: 1, borderColor: '#0F7C5A', justifyContent: 'center' }}><T w={800} size={12} color="#0F7C5A">Nanti Saja</T></Pressable>
            </View>
          </View>
        </View>
      )}

      <View style={{ ...kartu, padding: 16, gap: 12 }}>
        <T w={800} size={15}>Langkah Memulai Perjalanan Karier</T>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 4 }}>
          {langkah.map(([n], i) => { const on = i === aktif, sudah = i < aktif; return (
            <React.Fragment key={n}>
              <View style={{ flex: 1, alignItems: 'center', gap: 6 }}>
                <View style={{ width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: on || sudah ? '#0F7C5A' : C.line, backgroundColor: on || sudah ? '#0F7C5A' : C.card, alignItems: 'center', justifyContent: 'center' }}>{sudah ? <Icon name="check" size={16} color="#fff" /> : <T w={800} size={14} color={on ? '#fff' : C.muted}>{i + 1}</T>}</View>
                <T size={10} color={C.ink} style={{ textAlign: 'center', lineHeight: 14 }}>{n}</T>
              </View>
              {i < langkah.length - 1 ? <T size={16} color={C.muted} style={{ marginTop: 6 }}>›</T> : null}
            </React.Fragment>
          ); })}
        </View>
      </View>

      <View style={{ ...kartu, padding: 16, gap: 12 }}>
        <Judul ikon="flag" warna="#2F80ED" teks="Jelajahi Berbagai Pilihan Perjalanan Karier" aksi="Lihat semua pilihan" onPress={() => go('kerja')} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {pilihan.map(([n, sub, w, f], i) => (
            <Pressable key={n} accessibilityRole="button" onPress={f} style={{ flexGrow: 1, flexBasis: 120, borderRadius: 12, backgroundColor: w, padding: 10, alignItems: 'center', gap: 6, minHeight: 112 }}>
              <Image source={IMG.kc[[0, 2, 3, 4][i]]} resizeMode="contain" style={{ width: 54, height: 47, ...mul }} />
              <T w={800} size={11} style={{ textAlign: 'center' }}>{n}</T>
              <T size={9} color={C.muted} style={{ textAlign: 'center' }}>{sub}</T>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Panel kanan khusus My Karier & Bisnis (Agus): hanya Agenda & Aktivitas ───
const CHANNEL = [['Sahabat UMKM Indonesia', '382 rb subscriber', true], ['Tips Bisnis dan Pemasaran', '215 rb subscriber', true], ['Belajar Keuangan UMKM', '178 rb subscriber', true], ['Strategi Operasional Bisnis', '96 rb subscriber', true]];
const KOMUNITAS = [['Komunitas UMKM Nusantara', '12.480 anggota'], ['Pelaku Otomotif & Bengkel', '8.215 anggota'], ['Pelaku Ritel & Kelontong', '5.903 anggota']];
const MITRA = [['Rizky Pratama', 'Supplier sparepart motor'], ['Siti Marlina', 'Distributor barang kelontong'], ['Dimas Saputra', 'Penyedia peralatan bengkel']];

function Kartu({ ikon, warna, teks, bawah, onBawah, children }) {
  return (
    <View style={{ ...kartu, padding: 14, gap: 10 }}>
      <Judul ikon={ikon} warna={warna} teks={teks} />
      {children}
      <Pressable accessibilityRole="button" onPress={onBawah} style={{ alignSelf: 'center', minHeight: 28, justifyContent: 'center' }}><T w={800} size={11} color={C.teal2}>{bawah} →</T></Pressable>
    </View>
  );
}

export function PanelKananKarirBisnis({ go }) {
  const [tab, setTab] = useState('Hari Ini');
  const [cek, setCek] = useState({});
  const [lonceng, setLonceng] = useState({ 'Sahabat UMKM Indonesia': true, 'Belajar Keuangan UMKM': true, 'Komunitas UMKM Nusantara': true });
  const [kon, setKon] = useState({});
  return (
    <View style={{ gap: 12 }}>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul ikon="kalender" warna="#9B51E0" teks="Agenda & Aktivitas yang Disarankan" />
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {Object.keys(AGENDA).map((t) => { const on = tab === t; return (
            <Pressable key={t} accessibilityRole="tab" onPress={() => setTab(t)} style={{ flex: 1, minHeight: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? C.teal2 : C.soft }}><T w={on ? 800 : 600} size={10} color={on ? '#fff' : C.teal2}>{t}</T></Pressable>
          ); })}
        </View>
        {AGENDA[tab].map(([j, n, l, w]) => { const k = tab + n; const d = !!cek[k]; return (
          <Pressable key={k} accessibilityRole="checkbox" accessibilityState={{ checked: d }} onPress={() => setCek({ ...cek, [k]: !d })} style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <View style={{ width: 18, height: 18, borderRadius: 5, borderWidth: 1.5, borderColor: d ? C.teal2 : C.line, backgroundColor: d ? C.teal2 : 'transparent', alignItems: 'center', justifyContent: 'center' }}>{d ? <Icon name="check" size={12} color="#fff" /> : null}</View>
            <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: w, alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={13} color="#fff" /></View>
            <View style={{ flex: 1, minWidth: 0 }}><T w={700} size={11} numberOfLines={2} style={{ textDecorationLine: d ? 'line-through' : 'none' }}>{n}</T><T size={10} color={C.muted}>{j} · {l}</T></View>
          </Pressable>
        ); })}
        <Pressable accessibilityRole="button" onPress={() => go('eventhal')} style={{ alignSelf: 'center', minHeight: 28, justifyContent: 'center' }}><T w={800} size={11} color={C.teal2}>Lihat semua aktivitas →</T></Pressable>
      </View>

      <Kartu ikon="bell" warna="#D6336C" teks="Channel Bisnis yang Diikuti" bawah="Lihat semua channel" onBawah={() => go('komunitas2')}>
        {CHANNEL.map(([n, sub], i) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={IMG.ch[i]} style={{ width: 34, height: 34, borderRadius: 17 }} />
            <View style={{ flex: 1, minWidth: 0 }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><T w={800} size={11} numberOfLines={1} style={{ flexShrink: 1 }}>{n}</T><View style={{ width: 13, height: 13, borderRadius: 7, backgroundColor: '#2F80ED', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={9} color="#fff" /></View></View><T size={10} color={C.muted}>{sub}</T></View>
            <View style={{ flexDirection: 'row', gap: 2 }}>
              <Pressable accessibilityRole="button" accessibilityLabel="Kunjungi channel" onPress={() => go('komunitas2')} style={{ padding: 5 }}><Icon name="kunjungi" size={16} color={C.teal2} /></Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel={lonceng[n] ? 'Matikan notifikasi' : 'Aktifkan notifikasi'} onPress={() => setLonceng({ ...lonceng, [n]: !lonceng[n] })} style={{ padding: 5 }}><Icon name={lonceng[n] ? 'bell' : 'bellOff'} size={16} color={lonceng[n] ? C.teal2 : C.muted} /></Pressable>
            </View>
          </View>
        ))}
      </Kartu>

      <Kartu ikon="heart" warna="#2F80ED" teks="Komunitas Bisnis Anda" bawah="Lihat semua komunitas" onBawah={() => go('komunitas2')}>
        {KOMUNITAS.map(([n, sub], i) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={IMG.km[i]} style={{ width: 38, height: 38, borderRadius: 12 }} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={11} numberOfLines={1}>{n}</T><T size={10} color={C.muted}>{sub}</T></View>
            <View style={{ flexDirection: 'row', gap: 2 }}>
              <Pressable accessibilityRole="button" accessibilityLabel="Kunjungi komunitas" onPress={() => go('komunitas2')} style={{ padding: 5 }}><Icon name="kunjungi" size={16} color={C.teal2} /></Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel={lonceng[n] ? 'Matikan notifikasi' : 'Aktifkan notifikasi'} onPress={() => setLonceng({ ...lonceng, [n]: !lonceng[n] })} style={{ padding: 5 }}><Icon name={lonceng[n] ? 'bell' : 'bellOff'} size={16} color={lonceng[n] ? C.teal2 : C.muted} /></Pressable>
            </View>
          </View>
        ))}
      </Kartu>

      <Kartu ikon="route" warna="#1FA37A" teks="Mitra Bisnis Terkoneksi" bawah="Lihat semua mitra" onBawah={() => go('koneksi')}>
        {MITRA.map(([n, sub], i) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={IMG.or[i]} style={{ width: 38, height: 38, borderRadius: 19 }} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={11} numberOfLines={1}>{n}</T><T size={10} color={C.muted} numberOfLines={1}>{sub}</T></View>
            <View style={{ flexDirection: 'row', gap: 2 }}>
              <Pressable accessibilityRole="button" accessibilityLabel="Kunjungi" onPress={() => go('koneksi')} style={{ padding: 5 }}><Icon name="kunjungi" size={16} color={C.teal2} /></Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="Pesan" onPress={() => go('chat')} style={{ padding: 5 }}><Icon name="bubble" size={16} color={C.teal2} /></Pressable>
            </View>
          </View>
        ))}
        <T size={9} color={C.muted} style={{ textAlign: 'center' }}>Data channel, komunitas, dan mitra adalah contoh demo.</T>
      </Kartu>
    </View>
  );
}
