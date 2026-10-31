import React, { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import Icon from './Icon';
import { Screen, T } from './ui';
import { C } from '../theme';

const kartu = { get backgroundColor() { return C.card; }, borderRadius: 14, borderWidth: 1, get borderColor() { return C.line; }, overflow: 'hidden' };
const IMG = {
  hero: require('../assets/beranda/pk_hero.jpg'),
  r1: require('../assets/beranda/pk_r1.jpg'), r2: require('../assets/beranda/pk_r2.jpg'), r3: require('../assets/beranda/pk_r3.jpg'), r4: require('../assets/beranda/pk_r4.jpg'),
  p1: require('../assets/beranda/pk_p1.jpg'), p2: require('../assets/beranda/pk_p2.jpg'), p3: require('../assets/beranda/pk_p3.jpg'), p4: require('../assets/beranda/pk_p4.jpg'),
  d1: require('../assets/beranda/pk_d1.jpg'), d2: require('../assets/beranda/pk_d2.jpg'), d3: require('../assets/beranda/pk_d3.jpg'), d4: require('../assets/beranda/pk_d4.jpg'),
  s1: require('../assets/beranda/pk_s1.jpg'), s2: require('../assets/beranda/pk_s2.jpg'), s3: require('../assets/beranda/pk_s3.jpg'),
  k1: require('../assets/beranda/pk_k1.jpg'), k2: require('../assets/beranda/pk_k2.jpg'), k3: require('../assets/beranda/pk_k3.jpg'),
  t1: require('../assets/beranda/pk_t1.jpg'), t2: require('../assets/beranda/pk_t2.jpg'), t3: require('../assets/beranda/pk_t3.jpg'),
};
// Semua proyek, kompetisi, tanggal, dan angka di halaman ini adalah contoh untuk demo.
const TAB = ['Semua', 'Proyek', 'Hackathon', 'Lomba', 'Challenge', 'Studi Kasus', 'Kolaborasi Tim'];
const REK = [
  { id: 'r1', jenis: 'Proyek', judul: 'Sales Analytics Dashboard', pen: 'oleh PT. Yanmar Diesel Indonesia', desk: 'Bangun dashboard penjualan menggunakan Power BI atau Excel.', tag: ['Data Analysis', 'Power BI', 'Business'], tim: 'Tim (2-4 orang)', dur: '6 minggu', info: '320 peserta' },
  { id: 'r2', jenis: 'Hackathon', judul: 'IBM & Komdigi AI Innovation Challenge 2026', pen: 'oleh IBM & Komdigi', desk: 'Kembangkan solusi AI untuk masalah nyata di Indonesia.', tag: ['AI', 'Inovasi Digital', 'Sustainability'], tim: 'Tim (2-4 orang)', dur: 'Online', info: '1.8K peserta' },
  { id: 'r3', jenis: 'Challenge', judul: 'Bangkit 2026 Capstone Project', pen: 'oleh Google, GoTo, Traveloka', desk: 'Selesaikan capstone project dan dapatkan sertifikat resmi.', tag: ['Cloud', 'Machine Learning', 'Mobile App'], tim: 'Tim (3-5 orang)', dur: 'Online', info: '28 Okt 2026' },
  { id: 'r4', jenis: 'Studi Kasus', judul: 'Optimasi Produksi di Industri Manufaktur', pen: 'oleh Komunitas Industri Indonesia', desk: 'Analisis data produksi dan berikan rekomendasi berbasis data.', tag: ['Data Analysis', 'SQL', 'Business Insight'], tim: 'Tim (1-3 orang)', dur: '4 minggu', info: '450 peserta' },
];
const POP = [
  { id: 'p1', jenis: 'Proyek', judul: 'E-Commerce Data Analysis', pen: 'oleh myCITA', tag: ['Data Analysis', 'Python', 'Visualization'], info: '2.4K peserta' },
  { id: 'p2', jenis: 'Hackathon', judul: 'ASEAN Data Science Exploration 2026', pen: 'oleh ASEAN Foundation', tag: ['Data Science', 'Analytics', 'AI'], info: '1.9K peserta' },
  { id: 'p3', jenis: 'Lomba', judul: 'National Business Plan Competition 2026', pen: 'oleh Kementerian Pendidikan', tag: ['Startup', 'Bisnis', 'Sosial'], info: '980 peserta' },
  { id: 'p4', jenis: 'Challenge', judul: 'Climate Tech Innovation Challenge', pen: 'oleh UNDP Indonesia', tag: ['Sustainability', 'Clean Energy', 'ESG'], info: '860 peserta' },
];
const DL = [
  { id: 'd1', jenis: 'Challenge', judul: 'Data Storytelling Challenge', pen: 'oleh MySkill', sisa: '3 hari lagi' },
  { id: 'd2', jenis: 'Hackathon', judul: 'GovTech AI Hackathon', pen: 'oleh Kominfo', sisa: '5 hari lagi' },
  { id: 'd3', jenis: 'Lomba', judul: 'Inovasi Sosial untuk Desa', pen: 'oleh BUMN', sisa: '8 hari lagi' },
  { id: 'd4', jenis: 'Studi Kasus', judul: 'Analisis Pasar UMKM', pen: 'oleh Telkom Indonesia', sisa: '11 hari lagi' },
];

const Chip = ({ t }) => <View style={{ backgroundColor: C.soft, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 }}><T size={9} color={C.teal2} numberOfLines={1}>{t}</T></View>;
function Judul({ teks, aksi, onPress, ikon, warna, sub }) {
  return (
    <View style={{ gap: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {ikon ? <Icon name={ikon} size={18} color={warna || C.teal2} /> : null}
        <T w={800} size={ikon ? 15 : 14} style={{ flex: 1 }}>{teks}</T>
        {aksi ? <Pressable accessibilityRole="button" onPress={onPress}><T w={700} size={11} color={C.teal2}>{aksi} →</T></Pressable> : null}
      </View>
      {sub ? <T size={11} color={C.muted}>{sub}</T> : null}
    </View>
  );
}
const Tombol = ({ t, onPress, kecil, aktif = true }) => (
  <Pressable accessibilityRole="button" onPress={onPress} style={{ paddingHorizontal: kecil ? 12 : 10, minHeight: kecil ? 30 : 32, borderRadius: 8, borderWidth: 1, borderColor: aktif ? C.teal2 : C.line, alignItems: 'center', justifyContent: 'center' }}>
    <T w={800} size={11} color={aktif ? C.teal2 : C.muted}>{t}</T>
  </Pressable>
);

export default function KompetisiBaru({ go }) {
  const [tab, setTab] = useState('Semua');
  const [daftar, setDaftar] = useState({});
  const [simpan, setSimpan] = useState({});
  const [pesan, setPesan] = useState('');
  const [lebar, setLebar] = useState(0);
  const per = lebar >= 720 ? 4 : lebar >= 460 ? 2 : 1;
  const lbr = lebar ? Math.floor((lebar - 10 * (per - 1)) / per) : 170;
  const ok = (x) => tab === 'Semua' || tab === 'Kolaborasi Tim' || x.jenis === tab;
  const rek = REK.filter(ok), pop = POP.filter(ok), dl = DL.filter(ok);
  const kosong = <T size={12} color={C.muted}>Belum ada item di kategori ini.</T>;
  const Info = ({ t }) => <T size={10} color={C.muted} numberOfLines={1}>◔ {t}</T>;
  const Simpan = ({ id, w }) => (
    <Pressable accessibilityRole="button" accessibilityLabel="Simpan" onPress={() => setSimpan({ ...simpan, [id]: !simpan[id] })} style={{ position: 'absolute', right: 8, top: 8, width: 26, height: 26, borderRadius: 7, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
      <T size={13} color={simpan[id] ? '#D9A21B' : C.teal2}>{simpan[id] ? '★' : '☆'}</T>
    </Pressable>
  );
  const Blok = ({ ikon, warna, teks, sub, children, kosongnya }) => (
    <View style={{ gap: 8 }}>
      <Judul ikon={ikon} warna={warna} teks={teks} sub={sub} aksi="Lihat semua" onPress={() => setTab('Semua')} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>{kosongnya ? kosong : children}</View>
    </View>
  );
  return (
    <Screen>
      <View style={{ gap: 12 }} onLayout={(e) => setLebar(e.nativeEvent.layout.width)}>
        <View style={{ ...kartu, aspectRatio: 941 / 216, backgroundColor: '#0F3B4A' }}>
          <Image source={IMG.hero} resizeMode="stretch" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} />
          <Pressable accessibilityRole="button" accessibilityLabel="Jelajahi Proyek dan Kompetisi" onPress={() => setTab('Semua')} style={{ position: 'absolute', left: '3.6%', top: '79%', width: '19%', height: '16%' }} />
          <Pressable accessibilityRole="button" accessibilityLabel="Buat Proyek atau Ikuti Kompetisi" onPress={() => setPesan('Fitur buat proyek dan daftar kompetisi akan segera tersedia (contoh demo).')} style={{ position: 'absolute', left: '23.4%', top: '79%', width: '19.5%', height: '16%' }} />
        </View>
        {pesan ? <View style={{ ...kartu, padding: 10, backgroundColor: C.soft }}><T size={11} color={C.teal2}>{pesan}</T></View> : null}

        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
          {TAB.map((t) => { const on = tab === t; return (
            <Pressable key={t} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => setTab(t)} style={{ paddingHorizontal: 14, minHeight: 32, borderRadius: 10, justifyContent: 'center', backgroundColor: on ? C.teal2 : C.card, borderWidth: 1, borderColor: on ? C.teal2 : C.line }}>
              <T w={on ? 800 : 600} size={11} color={on ? '#fff' : C.ink}>{t}</T>
            </Pressable>
          ); })}
        </View>

        <Blok ikon="target" warna="#D33" teks="Rekomendasi untukmu" sub="Dipilih berdasarkan minat, skill, tujuan karier, dan aktivitasmu di myCITA." kosongnya={rek.length === 0}>
          {rek.map((k) => (
            <View key={k.id} style={{ ...kartu, width: lbr, paddingBottom: 10 }}>
              <View><Image source={IMG[k.id]} resizeMode="cover" style={{ width: lbr - 2, height: Math.round((lbr - 2) * 0.33) }} /><Simpan id={k.id} /></View>
              <View style={{ paddingHorizontal: 10, gap: 4, marginTop: 8 }}>
                <T w={800} size={12} numberOfLines={3} style={{ minHeight: 48 }}>{k.judul}</T>
                <T size={10} color={C.muted} numberOfLines={1}>{k.pen}</T>
                <T size={10} numberOfLines={2} style={{ minHeight: 28 }}>{k.desk}</T>
                <View style={{ flexDirection: 'row', gap: 3, flexWrap: 'wrap', minHeight: 40 }}>{k.tag.map((t) => <Chip key={t} t={t} />)}</View>
                <Info t={k.tim} /><Info t={k.dur} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <T size={10} color={C.muted} style={{ flex: 1 }} numberOfLines={1}>◔ {k.info}</T>
                  <Tombol kecil t="Lihat Detail" onPress={() => go('komunitas2')} />
                </View>
              </View>
            </View>
          ))}
        </Blok>

        <Blok ikon="flag" warna="#E8A33D" teks="Proyek Populer di myCITA" sub="Proyek dan kompetisi dengan peserta terbanyak dan tingkat antusiasme tinggi." kosongnya={pop.length === 0}>
          {pop.map((k) => (
            <View key={k.id} style={{ ...kartu, width: lbr, paddingBottom: 10 }}>
              <View><Image source={IMG[k.id]} resizeMode="cover" style={{ width: lbr - 2, height: Math.round((lbr - 2) * 0.23) }} /><Simpan id={k.id} /></View>
              <View style={{ paddingHorizontal: 10, gap: 4, marginTop: 8 }}>
                <T w={800} size={12} numberOfLines={3} style={{ minHeight: 48 }}>{k.judul}</T>
                <T size={10} color={C.muted} numberOfLines={1}>{k.pen}</T>
                <View style={{ flexDirection: 'row', gap: 3, flexWrap: 'wrap', minHeight: 40 }}>{k.tag.map((t) => <Chip key={t} t={t} />)}</View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <T size={10} color={C.muted} style={{ flex: 1 }} numberOfLines={1}>◔ {k.info}</T>
                  <Tombol kecil t="Lihat Detail" onPress={() => go('komunitas2')} />
                </View>
              </View>
            </View>
          ))}
        </Blok>

        <Blok ikon="bell" warna="#1C6BA8" teks="Proyek & Kompetisi dengan Pendaftaran Terdekat" sub="Jangan lewatkan kesempatan, daftar sebelum kuota penuh." kosongnya={dl.length === 0}>
          {dl.map((k) => (
            <View key={k.id} style={{ ...kartu, width: lbr, paddingBottom: 10 }}>
              <Image source={IMG[k.id]} resizeMode="cover" style={{ width: lbr - 2, height: Math.round((lbr - 2) * 0.17) }} />
              <View style={{ paddingHorizontal: 10, gap: 4, marginTop: 8 }}>
                <T w={800} size={12} numberOfLines={2} style={{ minHeight: 32 }}>{k.judul}</T>
                <T size={10} color={C.muted} numberOfLines={1}>{k.pen}</T>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <T w={700} size={10} color="#D33" style={{ flex: 1 }} numberOfLines={1}>◷ {k.sisa}</T>
                  <Tombol kecil t={daftar[k.id] ? 'Terdaftar' : 'Daftar'} aktif={!daftar[k.id]} onPress={() => setDaftar({ ...daftar, [k.id]: !daftar[k.id] })} />
                </View>
              </View>
            </View>
          ))}
        </Blok>
        <T size={11} color={C.muted}>Semua proyek, kompetisi, tanggal, dan angka di halaman ini adalah contoh untuk demo.</T>
      </View>
    </Screen>
  );
}

// ─── Panel kanan khusus halaman Proyek & Kompetisi ───────────────────
const Lencana = ({ t, w }) => <View style={{ alignSelf: 'flex-start', backgroundColor: w, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 }}><T w={700} size={9} color="#fff">{t}</T></View>;
export function PanelKananKompetisi({ go }) {
  const [st, setSt] = useState({});
  const tg = (k) => setSt({ ...st, [k]: !st[k] });
  const jalan = [['AI Business Assistant', 'Proyek', '#1F7A4D', 'Progress 65%', 0.65, 's1'], ['Hackathon IBM & Komdigi 2026', 'Kompetisi', '#B83D8A', 'Submit dalam 12 hari', 0.45, 's2'], ['Data Visualization Challenge', 'Challenge', '#C2502B', 'Progress 80%', 0.8, 's3']];
  const dl = [['20', 'Okt', 'AI for Social Good Challenge', 'oleh Microsoft Indonesia', '5 hari lagi'], ['25', 'Okt', 'Indonesian AI Hackathon 2026', 'oleh Kaggle Indonesia & Dicoding', '10 hari lagi'], ['28', 'Okt', 'Lomba Inovasi Teknologi Tepat Guna', 'oleh BRIN', '13 hari lagi'], ['01', 'Nov', 'Beasiswa Talenta Digital 2026', 'oleh Kominfo', '17 hari lagi'], ['05', 'Nov', 'UI/UX Design Challenge', 'oleh Figma Indonesia', '21 hari lagi']];
  const rek = [['Studi Kasus Analisis Penjualan', 'Proyek', '#1F7A4D', 'Sesuai minat data analysis', 'k1'], ['Hackathon Generative AI', 'Kompetisi', '#B83D8A', 'Sesuai minat AI', 'k2'], ['UI/UX Design Challenge', 'Challenge', '#C2502B', 'Sesuai minat design', 'k3']];
  const tim = [['Tim Data Analysis', 'Cari 2 anggota (Python, Power BI)', 'Proyek • 4 minggu', 't1'], ['Tim AI untuk Hackathon', 'Cari 3 anggota (ML, Backend)', 'Kompetisi • Online', 't2'], ['Tim Business Plan', 'Cari 2 anggota (Bisnis, Keuangan)', 'Lomba • 6 minggu', 't3']];
  return (
    <View style={{ gap: 12 }}>
      <View style={{ ...kartu, padding: 14, gap: 12 }}>
        <Judul teks="Proyek & Kompetisi yang Sedang Diikuti" aksi="Lihat semua" onPress={() => go('kompetisi')} />
        {jalan.map(([n, j, w, p, v, im]) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={IMG[im]} style={{ width: 52, height: 52, borderRadius: 10 }} />
            <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
              <T w={800} size={11} numberOfLines={2}>{n}</T>
              <Lencana t={j} w={w} />
              <T size={10} color={C.muted}>{p}</T>
              <View style={{ height: 5, borderRadius: 3, backgroundColor: C.soft, overflow: 'hidden' }}><View style={{ width: `${v * 100}%`, height: 5, backgroundColor: C.teal2 }} /></View>
            </View>
            <Tombol kecil t="Lanjut" onPress={() => go('komunitas2')} />
          </View>
        ))}
      </View>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Deadline Terdekat" aksi="Lihat semua" onPress={() => go('kompetisi')} />
        {dl.map(([a, b, n, o, s]) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <View style={{ width: 42, height: 42, borderRadius: 8, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }}><T w={800} size={14}>{a}</T><T w={700} size={10}>{b}</T></View>
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={11} numberOfLines={2}>{n}</T><T size={10} color={C.muted} numberOfLines={1}>{o}</T><T w={700} size={10} color="#D33">◷ {s}</T></View>
            <Tombol kecil t={st[n] ? 'Terdaftar' : 'Daftar'} aktif={!st[n]} onPress={() => tg(n)} />
          </View>
        ))}
      </View>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Rekomendasi untukmu" aksi="Lihat semua" onPress={() => go('kompetisi')} />
        {rek.map(([n, j, w, s, im]) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={IMG[im]} style={{ width: 52, height: 40, borderRadius: 8 }} />
            <View style={{ flex: 1, minWidth: 0, gap: 2 }}><T w={800} size={11} numberOfLines={2}>{n}</T><View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}><Lencana t={j} w={w} /><T size={9} color={C.muted}>{s}</T></View></View>
            <Tombol kecil t="Lihat" onPress={() => go('komunitas2')} />
          </View>
        ))}
      </View>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Temukan Tim untuk Proyek & Kompetisi" aksi="Lihat semua" onPress={() => go('koneksi')} />
        {tim.map(([n, a, b, im]) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={IMG[im]} style={{ width: 46, height: 46, borderRadius: 8 }} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={11} numberOfLines={1}>{n}</T><T size={10} color={C.muted} numberOfLines={2}>{a}</T><T size={10} color={C.muted}>{b}</T></View>
            <Tombol kecil t={st[n] ? 'Diajukan' : 'Gabung'} aktif={!st[n]} onPress={() => tg(n)} />
          </View>
        ))}
      </View>
    </View>
  );
}
