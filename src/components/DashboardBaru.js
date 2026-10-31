import React, { useState } from 'react';
import { Image, Pressable, RefreshControl, View } from 'react-native';
import Svg, { Circle, G, Line, Polyline, Rect, Text as SvgText } from 'react-native-svg';
import { useApp } from '../state/AppContext';
import { findPersona } from '../state/persona';
import { Card, EmptyState, ErrorBox, Screen, T } from './ui';
import Icon from './Icon';
import { C } from '../theme';
import { cleanStatus, pct, rpShort } from '../utils/format';
import {
  ScoreCard, DebtEmergencyRow, SavingsChart, RoadmapCard, UsahaCards, DiniHeroCard, SkillProfile, JurusanList, KarierCards, TopReco,
} from '../screens/Home';
import { HERO } from './foto';
import { journeyUser } from './BerandaBaru';

const kartu = { get backgroundColor() { return C.card; }, borderRadius: 14, borderWidth: 1, get borderColor() { return C.line; }, overflow: 'hidden' };
const IMG = {
  hero2: require('../assets/beranda/db_hero2.jpg'),
  bengkel: require('../assets/beranda/db_bengkel.png'), kelontong: require('../assets/beranda/db_kelontong.png'), shield: require('../assets/beranda/db_shield.png'), koin: require('../assets/beranda/db_koin.png'), bars: require('../assets/beranda/db_bars.png'), bulb: require('../assets/beranda/db_bulb.png'), target: require('../assets/beranda/db_target.png'),
  promo: require('../assets/beranda/db_promo.jpg'),
  p1: require('../assets/beranda/pk_r2.jpg'),
  p2: require('../assets/beranda/pk_r1.jpg'),
};
const BULAN = ['Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep'];
const WARNA = ['#2F80ED', '#1FA37A', '#F2A93B', '#9B51E0', '#D85A30', '#9AA5A8', '#0F4C47'];
const rpf = (n) => 'Rp' + Math.round(n || 0).toLocaleString('id-ID');

const Tombol = ({ t, onPress, kecil = true, aktif = true }) => (
  <Pressable accessibilityRole="button" onPress={onPress} style={{ paddingHorizontal: 12, minHeight: kecil ? 30 : 34, borderRadius: 8, borderWidth: 1, borderColor: aktif ? C.teal2 : C.line, alignItems: 'center', justifyContent: 'center' }}>
    <T w={800} size={11} color={aktif ? C.teal2 : C.muted} numberOfLines={1}>{t}</T>
  </Pressable>
);
function Judul({ teks, ikon, warna, aksi, onPress, sub }) {
  return (
    <View style={{ gap: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {ikon ? <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: warna, alignItems: 'center', justifyContent: 'center' }}><Icon name={ikon} size={15} color="#fff" /></View> : null}
        <T w={800} size={15} style={{ flex: 1 }} numberOfLines={1}>{teks}</T>
        {aksi ? <Pressable accessibilityRole="button" onPress={onPress}><T w={700} size={11} color={C.teal2}>{aksi} →</T></Pressable> : null}
      </View>
      {sub ? <T size={11} color={C.muted}>{sub}</T> : null}
    </View>
  );
}

// Donat pengeluaran dengan total di tengah
function Donat({ items, total, ukuran = 190 }) {
  const r = ukuran / 2 - 22, sw = 30, cx = ukuran / 2, keliling = 2 * Math.PI * r;
  let off = 0;
  return (
    <View style={{ width: ukuran, height: ukuran, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={ukuran} height={ukuran}>
        <G rotation={-90} origin={`${cx}, ${cx}`}>
          {items.map((it, i) => { const dash = total > 0 ? (it.nilai / total) * keliling : 0; const e = <Circle key={it.label} cx={cx} cy={cx} r={r} stroke={WARNA[i % WARNA.length]} strokeWidth={sw} fill="none" strokeDasharray={`${Math.max(dash - 2, 0)} ${keliling}`} strokeDashoffset={-off} />; off += dash; return e; })}
        </G>
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center', width: ukuran - 2 * (sw + 22) + 20 }}>
        <T size={9} color={C.muted}>Total Pengeluaran</T>
        <T w={800} size={14} numberOfLines={1} adjustsFontSizeToFit>{rpf(total)}</T>
        <T size={9} color={C.muted}>/bulan</T>
      </View>
    </View>
  );
}

// Grafik batang berpasangan (gaya "Insight Mingguan")
function BatangGanda({ a, b, namaA, namaB, lebar }) {
  const w = Math.max(lebar, 260), h = 150, kiri = 8, bawah = 22, atas = 8;
  const mx = Math.max(...a, ...b, 1) * 1.1;
  const n = a.length, slot = (w - kiri * 2) / n, bw = Math.min(14, slot / 3);
  const y = (v) => atas + (h - atas - bawah) * (1 - v / mx);
  return (
    <View>
      <Svg width={w} height={h}>
        {[0, 0.5, 1].map((g) => <Line key={g} x1={kiri} x2={w - kiri} y1={y(mx * g)} y2={y(mx * g)} stroke={C.line} strokeWidth={1} />)}
        {a.map((v, i) => {
          const x0 = kiri + i * slot + slot / 2;
          return (
            <G key={i}>
              <Rect x={x0 - bw - 1} y={y(v)} width={bw} height={h - bawah - y(v)} rx={3} fill={C.teal2} />
              <Rect x={x0 + 1} y={y(b[i])} width={bw} height={h - bawah - y(b[i])} rx={3} fill="#B8C9C5" />
              <SvgText x={x0} y={h - 6} fontSize={9} fill={C.muted} textAnchor="middle">{BULAN[i]}</SvgText>
            </G>
          );
        })}
      </Svg>
      <View style={{ flexDirection: 'row', gap: 14, justifyContent: 'center', marginTop: 2 }}>
        <T size={10} color={C.muted}><T size={10} color={C.teal2}>■ </T>{namaA}</T>
        <T size={10} color={C.muted}><T size={10} color="#B8C9C5">■ </T>{namaB}</T>
      </View>
    </View>
  );
}

// Grafik garis progres waktu ke waktu
function GarisProgres({ seri, lebar }) {
  const w = Math.max(lebar, 260), h = 170, kiri = 26, bawah = 22, atas = 8, kanan = 10;
  const x = (i) => kiri + (i / (BULAN.length - 1)) * (w - kiri - kanan);
  const y = (v) => atas + (h - atas - bawah) * (1 - v / 100);
  return (
    <View>
      <Svg width={w} height={h}>
        {[0, 20, 40, 60, 80, 100].map((g) => (
          <G key={g}>
            <Line x1={kiri} x2={w - kanan} y1={y(g)} y2={y(g)} stroke={C.line} strokeWidth={1} />
            <SvgText x={kiri - 5} y={y(g) + 3} fontSize={9} fill={C.muted} textAnchor="end">{g}</SvgText>
          </G>
        ))}
        {seri.map((s, k) => (
          <G key={s.n}>
            <Polyline points={s.v.map((v, i) => `${x(i)},${y(v)}`).join(' ')} fill="none" stroke={WARNA[k]} strokeWidth={2} />
            {s.v.map((v, i) => <Circle key={i} cx={x(i)} cy={y(v)} r={3} fill={WARNA[k]} />)}
          </G>
        ))}
        {BULAN.map((m, i) => <SvgText key={m} x={x(i)} y={h - 6} fontSize={9} fill={C.muted} textAnchor="middle">{m}</SvgText>)}
      </Svg>
      <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {seri.map((s, k) => <T key={s.n} size={10} color={C.muted}><T size={10} color={WARNA[k]}>● </T>{s.n}  <T w={700} size={10}>{s.v[s.v.length - 1]}%</T></T>)}
      </View>
    </View>
  );
}

const PROGRES = {
  Skill: [{ n: 'Python', v: [30, 38, 45, 52, 62, 70] }, { n: 'Data Analysis', v: [20, 28, 36, 44, 52, 60] }, { n: 'Power BI', v: [10, 16, 24, 32, 38, 45] }, { n: 'Machine Learning', v: [5, 9, 14, 19, 25, 30] }],
  Pembelajaran: [{ n: 'Modul selesai', v: [10, 22, 30, 41, 50, 60] }, { n: 'Jam belajar', v: [8, 15, 26, 33, 42, 51] }],
  Proyek: [{ n: 'Proyek aktif', v: [0, 10, 25, 35, 55, 65] }, { n: 'Kompetisi', v: [0, 0, 10, 30, 40, 45] }],
  Sertifikasi: [{ n: 'Sertifikat', v: [20, 30, 45, 55, 70, 80] }],
  Keuangan: [{ n: 'Tabungan', v: [20, 28, 35, 44, 52, 59] }, { n: 'Dana darurat', v: [10, 16, 22, 30, 36, 42] }],
};
// Data panel kanan & hitungan ringkas per persona (contoh demo). Persona lain memakai data umum (budi).
const DATA_PERSONA = {
  budi: {
    stat: { belajar: 3, proyek: 2, sertif: 12, event: 1 },
    jadwal: [['08:00', 'Kerja', 'PT. Yanmar Diesel Indonesia', 'users', '#2F80ED'], ['12:00', 'Istirahat', '', 'heart', '#E8A33D'], ['19:00', 'Belajar Python', 'Modul Data Analysis (1 jam)', 'book', '#9B51E0'], ['20:00', 'Selesaikan Tugas Proyek', 'Analisis penjualan', 'briefcase', '#1FA37A']],
    tugas: [['t1', 'Selesaikan modul Python (1 jam)', 'hari'], ['t2', 'Revisi laporan proyek hackathon', 'hari'], ['t3', 'Ikut webinar Investasi untuk Pemula', 'hari'], ['t4', 'Kirim laporan harian kerja', 'hari'], ['t5', 'Baca jurnal untuk TA', 'minggu'], ['t6', 'Ikuti kelas SQL lanjutan', 'minggu'], ['t7', 'Update portofolio', 'minggu']],
    selesai: ['t4', 't5'],
    aktivitas: [['Menyelesaikan modul Data Analysis', '2 jam yang lalu', '#1FA37A'], ['Bergabung di proyek Sales Dashboard', 'Kemarin, 18:30', '#2F80ED'], ['Mendapatkan sertifikat Python Basic', '2 hari yang lalu', '#9B51E0'], ['Mengikuti webinar Investasi untuk Pemula', '3 hari yang lalu', '#1C9BD6']],
  },
  agus: {
    stat: { belajar: 1, proyek: 1, sertif: 3, event: 1 },
    jadwal: [['08:00', 'Cek Stok Sparepart', 'Di Bengkel', 'briefcase', '#E8A33D'], ['10:00', 'Meeting dengan Supplier', 'Online', 'users', '#2F80ED'], ['13:00', 'Review Laporan Penjualan', 'Di Kelontong', 'store', '#D6336C'], ['16:00', 'Konten Media Sosial', 'Di Toko', 'bell', '#E8A33D'], ['19:00', 'Evaluasi Keuangan', 'Di Rumah', 'wallet', '#1FA37A']],
    tugas: [['t1', 'Catat pemasukan bengkel hari ini', 'hari'], ['t2', 'Hitung omzet kelontong istri', 'hari'], ['t3', 'Hubungi supplier sparepart', 'hari'], ['t4', 'Pisahkan uang usaha dan rumah tangga', 'hari'], ['t5', 'Belanja stok kelontong di pasar induk', 'minggu'], ['t6', 'Rekap pembukuan mingguan', 'minggu'], ['t7', 'Siapkan promo akhir pekan', 'minggu']],
    selesai: ['t4'],
    aktivitas: [['Mencatat pemasukan bengkel hari ini', '2 jam yang lalu', '#1FA37A'], ['Menambah stok oli dan sparepart', 'Kemarin, 16:30', '#2F80ED'], ['Memuat simulasi pengembangan usaha', '2 hari yang lalu', '#9B51E0'], ['Memperbarui tujuan Rumah Rp600 jt', '3 hari yang lalu', '#1C9BD6']],
  },
  dini: {
    stat: { belajar: 2, proyek: 1, sertif: 2, event: 1 },
    jadwal: [['06:30', 'Berangkat Sekolah', 'SMA kelas 3, Bandung', 'book', '#2F80ED'], ['15:30', 'Eksplor Jurusan', 'Riset Teknik Informatika', 'target', '#E8A33D'], ['19:00', 'Latihan Soal UTBK', 'Belajar mandiri (1 jam)', 'book', '#9B51E0'], ['20:30', 'Cek Info Beasiswa', 'ITB dan Telkom University', 'flag', '#1FA37A']],
    tugas: [['t1', 'Kerjakan PR sekolah', 'hari'], ['t2', 'Riset jurusan dan kampus impian', 'hari'], ['t3', 'Latihan soal UTBK (1 jam)', 'hari'], ['t4', 'Catat uang saku hari ini', 'hari'], ['t5', 'Ikut webinar pemilihan jurusan', 'minggu'], ['t6', 'Cari info beasiswa kuliah', 'minggu'], ['t7', 'Tanya kakak alumni tentang jurusan', 'minggu']],
    selesai: ['t4'],
    aktivitas: [['Menyelesaikan tes minat dan bakat', '2 jam yang lalu', '#1FA37A'], ['Membaca profil jurusan Informatika', 'Kemarin, 19:00', '#2F80ED'], ['Bergabung di komunitas pelajar', '2 hari yang lalu', '#9B51E0'], ['Menghitung perkiraan biaya kuliah', '3 hari yang lalu', '#1C9BD6']],
  },
};
const dataPersona = (uid) => DATA_PERSONA[uid] || DATA_PERSONA.budi;

const STAT = (uid, n) => {
  const d = dataPersona(uid).stat;
  return [
    ['Pembelajaran', String(d.belajar), 'dalam progress', 'book', '#2F80ED', 0.45, 'belajar'],
    ['Proyek & Kompetisi', String(d.proyek), 'sedang dikerjakan', 'briefcase', '#1FA37A', 0.3, 'kompetisi'],
    ['Sertifikasi', String(d.sertif), 'diperoleh', 'shield', '#9B51E0', 0.5, 'sertif'],
    ['My Tujuan', String(n), 'tujuan aktif', 'target', '#E25822', 0.4, 'tujuan'],
    ['Event', String(d.event), 'akan datang', 'kalender', '#D6336C', 0.2, 'eventhal'],
  ];
};


// Roadmap-mu: mengikuti isi My Journey / Roadmap (judul, langkah, status) dari journeyUser.
function RoadmapBaru({ userId, karier, usaha, go, isi }) {
  const j = journeyUser(userId);
  const karierNama = karier?.hasil?.rekomendasi?.[0]?.profesi;
  const usahaNama = usaha?.hasil?.rekomendasi?.[0]?.usaha || usaha?.hasil?.rekomendasi?.[0]?.nama;
  const n = j.langkah.length;
  const pers = Math.round((j.hdr / n) * 100);
  const warna = (st) => (st === 'selesai' ? '#1F8A4C' : st === 'jalan' ? '#E58A00' : '#B8C9C5');
  return (
    <View style={{ ...kartu, padding: 14, gap: 12, ...(isi ? { flex: 1 } : null) }}>
      <Judul ikon="route" warna="#1FA37A" teks="Roadmap-mu" aksi="Lihat detail" onPress={() => go('roadmap')} />
      <View style={{ gap: 4 }}>
        <T w={800} size={13}>{j.judul}</T>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: C.soft }}><View style={{ width: `${pers}%`, height: 6, borderRadius: 3, backgroundColor: C.teal2 }} /></View>
          <T w={800} size={11} color={C.teal2}>{pers}%</T>
        </View>
        <T size={10} color={C.muted}>{j.hdr} dari {n} langkah selesai</T>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {j.langkah.map(([a, b], i) => {
          const st = j.status[i], w = warna(st);
          return (
            <View key={i} style={{ flex: 1, alignItems: 'center', minWidth: 0 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', height: 26 }}>
                <View style={{ flex: 1, height: 2, backgroundColor: i === 0 ? 'transparent' : (j.status[i - 1] === 'selesai' ? '#1F8A4C' : C.line) }} />
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: st === 'belum' ? '#fff' : w, borderWidth: 2, borderColor: w, alignItems: 'center', justifyContent: 'center' }}>
                  {st === 'selesai' ? <Icon name="check" size={13} color="#fff" /> : <T w={800} size={10} color={st === 'jalan' ? '#fff' : '#8A9A97'}>{i + 1}</T>}
                </View>
                <View style={{ flex: 1, height: 2, backgroundColor: i === n - 1 ? 'transparent' : (st === 'selesai' ? '#1F8A4C' : C.line) }} />
              </View>
              <T w={800} size={9} numberOfLines={2} style={{ textAlign: 'center', marginTop: 4 }}>{a}</T>
              <T w={800} size={9} numberOfLines={2} style={{ textAlign: 'center' }}>{b}</T>
              <T size={8} color={st === 'jalan' ? '#E58A00' : st === 'selesai' ? '#1F8A4C' : C.muted} style={{ textAlign: 'center' }}>{st === 'selesai' ? 'Selesai' : st === 'jalan' ? 'Sedang berjalan' : 'Belum mulai'}{j.tgl[i] ? ` · ${j.tgl[i]}` : ''}</T>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const Dekor = ({ src, w, h, style }) => <Image source={src} resizeMode="contain" style={{ position: 'absolute', right: 0, bottom: 0, width: w, height: h, ...style }} />;
function DetailBaru({ analysis, d, dd, persona, karier, usaha, userId, isDini, tabungan, go, dua, bagian = 'semua', sempit = false }) {
  const sk = ['semua', 'grup'].includes(bagian), hd = ['semua', 'grup'].includes(bagian), tb = ['semua', 'tab'].includes(bagian), bawah = ['semua', 'bawah'].includes(bagian);
  const hutang = d?.total_hutang ?? analysis?.dashboard?.total_hutang ?? 0;
  const likuid = dd?.dana_likuid_saat_ini ?? 0, target = dd?.target_dipakai ?? 0, bln = dd?.cukup_untuk_bulan ?? 0;
  const rasio = target > 0 ? Math.min(1, likuid / target) : 0;
  const saran = analysis?.rekomendasi_utama?.[0];
  const skor = d?.skor_kesehatan;
  const r = 44, kel = 2 * Math.PI * r, pj = Math.max(0, Math.min(100, skor || 0)) / 100;
  const baris = { flexDirection: dua && !sempit ? 'row' : 'column', gap: 12 };
  const barisHD = { flexDirection: dua || sempit ? 'row' : 'column', gap: 12 };
  return (
    <View style={{ gap: 12 }}>
      {sk && isDini ? (
        <>
          <DiniHeroCard rekomendasiJurusan={karier?.hasil?.rekomendasi_jurusan} />
          {persona?.skills ? <SkillProfile skills={persona.skills} minat={persona.minat} /> : null}
          <JurusanList rekomendasiJurusan={karier?.hasil?.rekomendasi_jurusan} go={go} />
          <KarierCards rekomendasi={karier?.hasil?.rekomendasi} go={go} />
        </>
      ) : null}
      {sk && !isDini && d ? (
        <Pressable accessibilityRole="button" accessibilityLabel={`Skor Kesehatan Finansial ${skor} dari 100`} onPress={() => go('keuangan')} style={{ ...kartu, backgroundColor: '#DDF1EE', flexDirection: 'row', alignItems: 'center', gap: 18, padding: 16, minHeight: 130 }}>
          <Dekor src={IMG.bars} w={240} h={130} style={{ opacity: 0.9 }} />
          <View style={{ width: 104, height: 104 }}>
            <Svg width={104} height={104} viewBox="0 0 104 104">
              <Circle cx="52" cy="52" r={r} fill="none" stroke="#FFFFFF" strokeWidth="10" />
              <Circle cx="52" cy="52" r={r} fill="none" stroke="#F2A93B" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${kel * pj} ${kel}`} transform="rotate(-90 52 52)" />
            </Svg>
            <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
              <T w={800} size={30} color="#0F4C47" style={{ lineHeight: 34 }}>{skor}</T>
              <T size={10} color={C.muted}>dari 100</T>
            </View>
          </View>
          <View style={{ flex: 1, gap: 4, minWidth: 0 }}>
            <T w={800} size={13} color="#0F4C47">Skor Kesehatan Finansial</T>
            <T w={800} size={24} color="#0F4C47">{cleanStatus(d.status)}</T>
            <T size={12} color="#1F4E4A">{d.saving_rate_persen != null ? `Saving rate ${pct(d.saving_rate_persen)}` : ''}{(d.total_hutang === 0 || !d.total_hutang) ? ' · tanpa hutang' : ''}</T>
            {dd ? <T size={12} color="#1F4E4A">Dana darurat: {String(bln).replace('.', ',')} bulan ({rpShort(likuid)} / {rpShort(target)})</T> : null}
          </View>
        </Pressable>
      ) : null}
      {sk && !isDini && persona?.usaha?.length ? (
        <View style={baris}>
          {persona.usaha.map((u, i) => {
            const bersih = u.omzet - u.biaya, margin = u.omzet > 0 ? Math.round((bersih / u.omzet) * 100) : 0;
            return (
              <Pressable key={i} accessibilityRole="button" accessibilityLabel={`Detail ${u.nama}`} onPress={() => go('karirbisnis')} style={{ ...kartu, flex: 1, padding: 14, gap: 6, minHeight: 130 }}>
                <Dekor src={i === 0 ? IMG.bengkel : IMG.kelontong} w={150} h={130} style={{ opacity: 0.95 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><Icon name={u.icon} size={18} color={u.iconColor} /><T w={800} size={13}>{u.nama}</T></View>
                <View style={{ width: '62%', gap: 2 }}>
                  {[['Omzet', rpShort(u.omzet), false], ['Biaya', rpShort(u.biaya), false], ['Bersih', rpShort(bersih), true]].map(([l, v, b]) => (
                    <View key={l} style={{ flexDirection: 'row', justifyContent: 'space-between' }}><T size={12} color={C.muted}>{l}</T><T w={b ? 800 : 700} size={12} color={b ? C.teal2 : C.ink}>{v}</T></View>
                  ))}
                </View>
                <View style={{ width: '62%', height: 7, borderRadius: 4, backgroundColor: C.soft }}><View style={{ width: `${Math.min(margin, 100)}%`, height: 7, borderRadius: 4, backgroundColor: u.barColor }} /></View>
                <T size={11} color={C.muted}>Margin {margin}%</T>
              </Pressable>
            );
          })}
        </View>
      ) : null}
      {hd ? <View style={barisHD}>
        <View style={{ ...kartu, flex: 1, padding: 14, gap: 4, minHeight: 100 }}>
          <Dekor src={IMG.shield} w={sempit ? 70 : 110} h={sempit ? 56 : 86} />
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}><Icon name="wallet" size={18} color={C.teal2} /><T w={800} size={14}>Hutang</T></View>
          <T w={800} size={sempit ? 18 : 24}>{hutang === 0 ? 'Rp0' : rpShort(hutang)}</T>
          <T size={11} color={C.muted}>{hutang === 0 ? 'Tidak ada cicilan' : 'Total cicilan aktif'}</T>
        </View>
        <View style={{ ...kartu, flex: 1, padding: 14, gap: 4, minHeight: 100 }}>
          <Dekor src={IMG.koin} w={sempit ? 56 : 90} h={sempit ? 56 : 90} />
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}><Icon name="umbrella" size={18} color={C.gold} /><T w={800} size={14}>Dana darurat</T></View>
          {dd ? (
            <>
              <T w={800} size={sempit ? 14 : 20} numberOfLines={1} adjustsFontSizeToFit>{rpShort(likuid)} / {rpShort(target)}</T>
              <View style={{ width: '70%', height: 7, borderRadius: 4, backgroundColor: C.soft }}><View style={{ width: `${rasio * 100}%`, height: 7, borderRadius: 4, backgroundColor: rasio >= 1 ? C.teal2 : '#F2A93B' }} /></View>
              <T size={11} color={C.muted}>{String(bln).replace('.', ',')} bulan</T>
            </>
          ) : <T w={800} size={20}>–</T>}
        </View>
      </View> : null}
      {tb && tabungan ? (
        <Card style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="chart" size={18} color="#1FA37A" />
            <T w={800} size={15} style={{ flex: 1 }}>Tabungan</T>
            <T w={800} size={13} color="#1FA37A">{rpShort(tabungan)}</T>
          </View>
          <SavingsChart currentAmount={tabungan} monthlyAdd={d?.sisa || 0} />
          <T size={11} color={C.muted} style={{ textAlign: 'center' }}>Contoh data · proyeksi jika sisa ditabung rutin</T>
        </Card>
      ) : null}
      {bawah && isDini ? <RoadmapBaru userId={userId} karier={karier} usaha={usaha} go={go} /> : null}
      {bawah && saran ? (
        <View style={{ ...kartu, backgroundColor: '#E7F5F3', padding: 16, minHeight: 100, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <Image source={IMG.bulb} resizeMode="contain" style={{ width: 48, height: 56 }} />
          <View style={{ flex: 1, gap: 4, minWidth: 0, paddingRight: 90 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <T w={800} size={16} color="#14211F" style={{ flex: 1 }}>Saran utama</T>
              <View style={{ backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 }}><T w={700} size={10} color="#C2502B">Prioritas</T></View>
            </View>
            <T size={13} color="#14211F" style={{ lineHeight: 19 }}>{saran}</T>
          </View>
          <Dekor src={IMG.target} w={92} h={84} style={{ right: 6, bottom: 6 }} />
        </View>
      ) : null}
    </View>
  );
}

export default function DashboardBaru({ go }) {
  const app = useApp();
  const { analysis, refreshAnalysis, live, settings, karier, usaha, userId } = app;
  const persona = findPersona(userId);
  const isDini = userId === 'dini', isBudi = userId === 'budi';
  const nama = persona?.nama || userId || '';
  const d = analysis?.dashboard, dd = analysis?.dana_darurat;
  const targets = analysis?.target || [];
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState('');
  const [tabP, setTabP] = useState('Skill');
  const [lebar, setLebar] = useState(0);
  const [lbG, setLbG] = useState(0);
  const [lbP, setLbP] = useState(0);
  const onRefresh = async () => { setRefreshing(true); setErr(''); try { await refreshAnalysis(); } catch (e) { setErr(e.message); } setRefreshing(false); };
  const dua = lebar >= 760;

  const pengeluaran = (persona?.keuangan?.pengeluaran || []).map((p) => ({ label: p.label, nilai: Number(p.nominal) || 0 })).sort((a, b) => b.nilai - a.nilai);
  const totalKel = pengeluaran.reduce((s, p) => s + p.nilai, 0) || d?.pengeluaran || 0;
  const pend = d?.pendapatan || 0, peng = d?.pengeluaran || 0, sisa = d?.sisa ?? pend - peng;
  const rate = d?.saving_rate_persen;
  const bulan = BULAN.map((_, i) => (isDini ? 1500000 : (peng || 0) * (0.94 + i * 0.01)));
  const bulanPend = BULAN.map((_, i) => (isDini ? 1500000 : (peng || 0) * (0.94 + i * 0.01) + (pend - peng)));
  const tabungan = dd?.tabungan_saat_ini ?? d?.tabungan ?? dd?.dana_likuid_saat_ini ?? 0;
  const stat = STAT(userId, targets.length || 0);
  const keu = ['Keuangan', rpShort(tabungan), 'tabungan saat ini', 'wallet', '#E8A33D', 0.35, 'keuangan'];

  const hero = (
    <View style={{ ...kartu, aspectRatio: 876 / 174, minHeight: 190, backgroundColor: '#12407F', justifyContent: 'center' }}>
      <Image source={IMG.hero2} resizeMode="cover" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} />
      <View style={{ paddingHorizontal: 22, width: '62%', gap: 5 }}>
        <T w={700} size={14} color="#fff">Halo, {nama}! 👋</T>
        <T w={800} size={27} color="#fff" style={{ lineHeight: 32 }}>Capai Impian, Tentukan Arah</T>
        <T size={12} color="#DCE9FA" style={{ lineHeight: 17 }}>Terus melangkah untuk versi terbaik dari dirimu. Belajar hari ini, peluang lebih besar esok.</T>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          <Pressable accessibilityRole="button" onPress={() => go('belajar')} style={{ paddingHorizontal: 14, minHeight: 38, borderRadius: 9, backgroundColor: '#fff', justifyContent: 'center' }}><T w={800} size={12} color="#0F4C47">Lanjutkan Belajar →</T></Pressable>
          <Pressable accessibilityRole="button" onPress={() => go('roadmap')} style={{ paddingHorizontal: 14, minHeight: 38, borderRadius: 9, borderWidth: 1, borderColor: '#fff', justifyContent: 'center' }}><T w={800} size={12} color="#fff">Lihat Roadmap Saya →</T></Pressable>
        </View>
      </View>
    </View>
  );

  const per = lebar >= 760 ? 6 : lebar >= 460 ? 3 : 2;
  const lKartu = lebar ? Math.floor((lebar - 8 * (per - 1)) / per) : 110;

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.teal} />}>
      <View style={{ gap: 14 }} onLayout={(e) => setLebar(e.nativeEvent.layout.width)}>
        <ErrorBox message={err} onRetry={onRefresh} />
        {hero}

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {[...stat, keu].map(([j, v, s, ik, w, p, r]) => (
            <Pressable key={j} accessibilityRole="button" onPress={() => go(r)} style={{ ...kartu, width: lKartu, padding: 10, gap: 3 }}>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <View style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: w, alignItems: 'center', justifyContent: 'center' }}><Icon name={ik} size={16} color="#fff" /></View>
                <T w={700} size={10} numberOfLines={2} style={{ flex: 1 }}>{j}</T>
              </View>
              <T w={800} size={j === 'Keuangan' ? 14 : 20} numberOfLines={1} adjustsFontSizeToFit>{v}</T>
              <T size={10} color={C.muted} numberOfLines={1}>{s}</T>
              <View style={{ height: 4, borderRadius: 2, backgroundColor: C.soft, marginTop: 2 }}><View style={{ width: `${p * 100}%`, height: 4, borderRadius: 2, backgroundColor: w }} /></View>
            </Pressable>
          ))}
        </View>

        {!analysis ? (
          <EmptyState icon="target" title="Data belum dimuat" body="Tarik ke bawah untuk memuat data dari Langflow, atau aktifkan Mode Demo di tab Profil." action="Perbarui" onAction={onRefresh} />
        ) : null}

        {analysis && !isDini ? (
          <>
            <DetailBaru bagian="grup" {...{ d, dd, persona, karier, usaha, userId, isDini, tabungan, go, dua }} analysis={analysis} />
            <View style={{ flexDirection: dua ? 'row' : 'column', gap: 12 }}>
              <View style={{ flex: dua ? 1.1 : undefined, gap: 12 }}>
              <View style={{ ...kartu, padding: 14, gap: 10, flex: dua ? 1 : undefined }}>
                <Judul ikon="wallet" warna="#E8A33D" teks="Keuangan Saya" aksi="Lihat detail" onPress={() => go('keuangan')} />
                {pengeluaran.length > 0 ? (
                  <Pressable accessibilityRole="button" accessibilityLabel="Lihat rincian pengeluaran bulan ini" onPress={() => go('pengeluaran', { from: 'home' })} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Donat items={pengeluaran} total={totalKel} />
                    <View style={{ flex: 1, minWidth: 190, gap: 6 }}>
                      {pengeluaran.map((p, i) => (
                        <View key={p.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: WARNA[i % WARNA.length] }} />
                          <T size={10} style={{ flex: 1 }} numberOfLines={1}>{p.label}</T>
                          <T size={10} color={C.muted} style={{ width: 34, textAlign: 'right' }}>{totalKel ? Math.round((p.nilai / totalKel) * 100) : 0}%</T>
                          <T w={700} size={10} style={{ width: 72, textAlign: 'right' }}>{rpf(p.nilai)}</T>
                        </View>
                      ))}
                      <T size={10} color={C.muted}>Pengeluaran rumah tangga bulan ini · {cleanStatus(d?.status_pengeluaran) || 'Sehat'}</T>
                    </View>
                  </Pressable>
                ) : null}
                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                  {[['Total Pemasukan', pend, '#1F8A4C'], ['Total Pengeluaran', peng, '#D33'], ['Sisa untuk Tabungan', sisa, C.teal2]].map(([j, v, w]) => (
                    <View key={j} style={{ flex: 1, minWidth: 110, borderWidth: 1, borderColor: C.line, borderRadius: 10, padding: 8 }}>
                      <T size={10} color={C.muted} numberOfLines={1}>{j}</T>
                      <T w={800} size={14} numberOfLines={1} adjustsFontSizeToFit>{rpf(v)}</T>
                      <T size={9} color={w}>/bulan</T>
                    </View>
                  ))}
                </View>
                {rate != null ? (
                  <View style={{ backgroundColor: C.soft, borderRadius: 10, padding: 10 }}>
                    <T size={11} color={C.teal2}>Kamu berhasil menabung {pct(rate)} dari pemasukanmu. Pertahankan konsistensi ini!</T>
                  </View>
                ) : null}
                <View style={{ gap: 4 }} onLayout={(e) => setLbG(e.nativeEvent.layout.width)}>
                  <T w={800} size={13}>Arus Kas 6 Bulan</T>
                  <T size={10} color={C.muted}>{d?.sisa != null ? `Rata-rata sisa ${rpShort(d.sisa)} · ` : ''}contoh data</T>
                  <BatangGanda a={bulanPend} b={bulan} namaA="Pemasukan" namaB="Pengeluaran" lebar={lbG - 4} />
                </View>
              </View>

              </View>
              <View style={{ flex: dua ? 1 : undefined, gap: 12 }}>
                <DetailBaru bagian="tab" {...{ d, dd, persona, karier, usaha, userId, isDini, tabungan, go, dua }} analysis={analysis} />
              <View style={{ ...kartu, padding: 14, gap: 10 }}>
                <Judul ikon="chart" warna="#2F80ED" teks="Progress Saya dari Waktu ke Waktu" />
                <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                  {Object.keys(PROGRES).map((t) => { const on = tabP === t; return (
                    <Pressable key={t} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => setTabP(t)} style={{ paddingHorizontal: 12, minHeight: 28, borderRadius: 8, justifyContent: 'center', backgroundColor: on ? C.teal2 : C.card, borderWidth: 1, borderColor: on ? C.teal2 : C.line }}>
                      <T w={on ? 800 : 600} size={10} color={on ? '#fff' : C.ink}>{t}</T>
                    </Pressable>
                  ); })}
                </View>
                <View onLayout={(e) => setLbP(e.nativeEvent.layout.width)}><GarisProgres seri={PROGRES[tabP]} lebar={lbP - 2} /></View>
                <View style={{ backgroundColor: C.soft, borderRadius: 10, padding: 10, flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <Icon name="spark" size={18} color={C.teal2} />
                  <T size={11} color={C.teal2} style={{ flex: 1 }}>Skill Python kamu meningkat 30% dalam 6 bulan terakhir. Terus konsisten untuk mencapai level berikutnya!</T>
                </View>
              </View>
              <RoadmapBaru isi={dua} userId={userId} karier={karier} usaha={usaha} go={go} />
              </View>
            </View>
          </>
        ) : null}

        {analysis && isDini ? (
          <View style={{ ...kartu, padding: 14, gap: 10 }} onLayout={(e) => setLbG(e.nativeEvent.layout.width - 28)}>
            <Judul ikon="wallet" warna="#E8A33D" teks="Keuangan Pelajar" aksi="Lihat detail" onPress={() => go('keuangan')} />
            <T size={10} color={C.muted}>{d?.sisa != null ? `Menabung ${rpShort(d.sisa)} · ` : ''}contoh data 6 bulan</T>
            <BatangGanda a={bulanPend} b={bulan} namaA="Pemasukan" namaB="Pengeluaran" lebar={lbG} />
          </View>
        ) : null}

        {analysis ? <DetailBaru bagian={isDini ? 'semua' : 'bawah'} {...{ d, dd, persona, karier, usaha, userId, isDini, tabungan, go, dua }} analysis={analysis} /> : null}
      </View>
    </Screen>
  );
}

// ─── Panel kanan khusus My Dashboard ─────────────────────────────────
export function PanelKananDashboard({ go, uid }) {
  const d = dataPersona(uid);
  const [st, setSt] = useState(() => Object.fromEntries(d.selesai.map((k) => [k, true])));
  const [tabT, setTabT] = useState('Hari Ini');
  const tgl = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
  const jadwal = d.jadwal;
  const tugas = d.tugas;
  const vis = tugas.filter(([, , k]) => tabT === 'Semua' || (tabT === 'Hari Ini' ? k === 'hari' : k === 'minggu'));
  const _reko = [['Selesaikan Modul Data Analysis', 'Lanjutkan belajar, 3 materi lagi', 'book', '#2F80ED', 'belajar'], ['Daftar Hackathon IBM & Komdigi', 'Pendaftaran ditutup 5 hari lagi', 'flag', '#E8A33D', 'kompetisi'], ['Tambah Proyek ke Portofolio', 'Tampilkan karya terbaikmu', 'briefcase', '#1C6BA8', 'kompetisi'], ['Ikuti Webinar Investasi', 'Jumat, 25 Okt 2026', 'kalender', '#D6336C', 'eventhal']];
  return (
    <View style={{ gap: 12 }}>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul ikon="kalender" warna="#2F80ED" teks="Jadwal Hari Ini" aksi="Lihat kalender" onPress={() => go('eventhal')} sub={tgl} />
        {jadwal.map(([j, n, s, ik, w]) => (
          <View key={j} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <T w={700} size={11} style={{ width: 42 }}>{j}</T>
            <View style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: w, alignItems: 'center', justifyContent: 'center' }}><Icon name={ik} size={16} color="#fff" /></View>
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={11} numberOfLines={1}>{n}</T>{s ? <T size={10} color={C.muted} numberOfLines={1}>{s}</T> : null}</View>
          </View>
        ))}
        <Tombol kecil={false} t="+ Tambah Jadwal" onPress={() => go('eventhal')} />
      </View>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul ikon="check" warna="#E8A33D" teks="Tugas Saya" aksi="Lihat semua" onPress={() => setTabT('Semua')} />
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {['Hari Ini', 'Minggu Ini', 'Semua'].map((t) => { const on = tabT === t; return (
            <Pressable key={t} accessibilityRole="tab" onPress={() => setTabT(t)} style={{ flex: 1, minHeight: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? C.teal2 : C.card, borderWidth: 1, borderColor: on ? C.teal2 : C.line }}>
              <T w={on ? 800 : 600} size={10} color={on ? '#fff' : C.ink}>{t}</T>
            </Pressable>
          ); })}
        </View>
        {vis.map(([k, n]) => (
          <Pressable key={k} accessibilityRole="checkbox" accessibilityState={{ checked: !!st[k] }} onPress={() => setSt({ ...st, [k]: !st[k] })} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <View style={{ width: 18, height: 18, borderRadius: 5, borderWidth: 1.5, borderColor: st[k] ? C.teal2 : C.line, backgroundColor: st[k] ? C.teal2 : 'transparent', alignItems: 'center', justifyContent: 'center' }}>{st[k] ? <Icon name="check" size={12} color="#fff" /> : null}</View>
            <T size={11} color={st[k] ? C.muted : C.ink} style={{ flex: 1, textDecorationLine: st[k] ? 'line-through' : 'none' }}>{n}</T>
          </Pressable>
        ))}
      </View>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul ikon="bell" warna="#1FA37A" teks="Aktivitas Terbaru" aksi="Lihat semua" onPress={() => go('notifikasi')} />
        {d.aktivitas.map(([a, b, w]) => (
          <View key={a} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: w }} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={700} size={11} numberOfLines={2}>{a}</T><T size={10} color={C.muted}>{b}</T></View>
          </View>
        ))}
      </View>
      <View style={{ ...kartu, aspectRatio: 309 / 180 }}>
        <Image source={IMG.promo} resizeMode="stretch" style={{ width: '100%', height: '100%' }} />
        <Pressable accessibilityRole="button" accessibilityLabel="Mulai Sekarang" onPress={() => go('belajar')} style={{ position: 'absolute', left: '5%', top: '66%', width: '40%', height: '22%' }} />
      </View>
    </View>
  );
}
