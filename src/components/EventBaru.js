import React, { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import Icon from './Icon';
import { Screen, T } from './ui';
import { C } from '../theme';

const kartu = { get backgroundColor() { return C.card; }, borderRadius: 14, borderWidth: 1, get borderColor() { return C.line; }, overflow: 'hidden' };
const IMG = {
  hero: require('../assets/beranda/ev_hero.jpg'),
  r1: require('../assets/beranda/ev_r1.jpg'), r2: require('../assets/beranda/ev_r2.jpg'), r3: require('../assets/beranda/ev_r3.jpg'), r4: require('../assets/beranda/ev_r4.jpg'),
  p1: require('../assets/beranda/ev_p1.jpg'), p2: require('../assets/beranda/ev_p2.jpg'), p3: require('../assets/beranda/ev_p3.jpg'), p4: require('../assets/beranda/ev_p4.jpg'),
  d1: require('../assets/beranda/ev_d1.jpg'), d2: require('../assets/beranda/ev_d2.jpg'), d3: require('../assets/beranda/ev_d3.jpg'), d4: require('../assets/beranda/ev_d4.jpg'),
  h1: require('../assets/beranda/ev_h1.jpg'), h2: require('../assets/beranda/ev_h2.jpg'), h3: require('../assets/beranda/ev_h3.jpg'),
  s1: require('../assets/beranda/ev_s1.jpg'), s2: require('../assets/beranda/ev_s2.jpg'), s3: require('../assets/beranda/ev_s3.jpg'),
  a1: require('../assets/beranda/ko_a1.jpg'), a2: require('../assets/beranda/ko_a2.jpg'), a3: require('../assets/beranda/ko_a3.jpg'),
};
// Semua event, tanggal, dan angka di halaman ini adalah contoh untuk demo.
const TAB = ['Semua', 'Webinar', 'Workshop', 'Seminar', 'Meetup', 'Career Event', 'Pelatihan', 'Talkshow', 'Info Sesi'];
const REK = [
  { id: 'r1', jenis: 'Webinar', judul: 'Karier Data Analyst di Industri Manufaktur', pen: 'oleh IBM Indonesia', tag: ['Data Analysis', 'Career', 'Industry Insight'], tgl: '28 Okt 2026', jam: '19.00 - 21.00 WIB', lok: 'Online', ps: '1.2K peserta' },
  { id: 'r2', jenis: 'Workshop', judul: 'Hands-on Python untuk Data Analysis', pen: 'oleh Dicoding', tag: ['Python', 'Pandas', 'Data Visualization'], tgl: '31 Okt 2026', jam: '09.00 - 16.00 WIB', lok: 'Online', ps: '350 peserta' },
  { id: 'r3', jenis: 'Seminar', judul: 'AI untuk Produktivitas Kerja dan Bisnis', pen: 'oleh Google Indonesia', tag: ['AI', 'Productivity', 'Business'], tgl: '02 Nov 2026', jam: '13.00 - 16.00 WIB', lok: 'Hybrid (Jakarta)', ps: '950 peserta' },
  { id: 'r4', jenis: 'Meetup', judul: 'Indonesia Data Community Meetup #12', pen: 'oleh Komunitas Data Indonesia', tag: ['Networking', 'Data', 'Community'], tgl: '05 Nov 2026', jam: '18.00 - 21.00 WIB', lok: 'Jakarta', ps: '420 peserta' },
];
const POP = [
  { id: 'p1', jenis: 'Webinar', judul: 'Generative AI untuk Pemula', pen: 'oleh Microsoft Indonesia', tag: ['Generative AI', 'LLM', 'Productivity'], tgl: '25 Okt 2026', jam: '19.00 - 21.00 WIB', lok: 'Online', ps: '2.5K peserta' },
  { id: 'p2', jenis: 'Workshop', judul: 'Data Visualization dengan Power BI', pen: 'oleh Tokopedia', tag: ['Power BI', 'Data Visualization', 'Business'], tgl: '29 Okt 2026', jam: '09.00 - 16.00 WIB', lok: 'Online', ps: '1.8K peserta' },
  { id: 'p3', jenis: 'Seminar', judul: 'Tren Teknologi dan Peluang Karier di 2027', pen: 'oleh Telkom Indonesia', tag: ['Technology', 'Career', 'Innovation'], tgl: '01 Nov 2026', jam: '13.00 - 16.00 WIB', lok: 'Jakarta', ps: '1.1K peserta' },
  { id: 'p4', jenis: 'Career Event', judul: 'Virtual Career Fair 2026', pen: 'oleh myCITA x Partner', tag: ['Career', 'Recruitment', 'Job Opportunity'], tgl: '03 Nov 2026', jam: '10.00 - 17.00 WIB', lok: 'Online', ps: '3.2K peserta' },
];
const DL = [
  { id: 'd1', jenis: 'Webinar', judul: 'Pengantar Machine Learning', pen: 'oleh Kaggle Indonesia', lok: 'Online', ps: '560 peserta', sisa: '33 slot tersisa' },
  { id: 'd2', jenis: 'Workshop', judul: 'Praktik SQL untuk Analisis Data', pen: 'oleh Komunitas Data Indonesia', lok: 'Online', ps: '220 peserta', sisa: '5 slot tersisa' },
  { id: 'd3', jenis: 'Seminar', judul: 'Inovasi AI di Industri Manufaktur', pen: 'oleh Yanmar Indonesia', lok: 'Hybrid (Bekasi)', ps: '180 peserta', sisa: '12 slot tersisa' },
  { id: 'd4', jenis: 'Meetup', judul: 'Networking for Tech Talent', pen: 'oleh myCITA Community', lok: 'Jakarta', ps: '300 peserta', sisa: '27 slot tersisa' },
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
const Tombol = ({ t, onPress, aktif = true, penuh }) => (
  <Pressable accessibilityRole="button" onPress={onPress} style={{ paddingHorizontal: 12, minHeight: 30, borderRadius: 8, borderWidth: 1, borderColor: aktif ? C.teal2 : C.line, alignItems: 'center', justifyContent: 'center', ...(penuh ? { alignSelf: 'stretch' } : null) }}>
    <T w={800} size={11} color={aktif ? C.teal2 : C.muted}>{t}</T>
  </Pressable>
);
const Info = ({ ik, t }) => <T size={10} color={C.muted} numberOfLines={1}>{ik} {t}</T>;

export default function EventBaru({ go }) {
  const [tab, setTab] = useState('Semua');
  const [daftar, setDaftar] = useState({});
  const [simpan, setSimpan] = useState({});
  const [pesan, setPesan] = useState('');
  const [lebar, setLebar] = useState(0);
  const per = lebar >= 720 ? 4 : lebar >= 460 ? 2 : 1;
  const lbr = lebar ? Math.floor((lebar - 10 * (per - 1)) / per) : 170;
  const ok = (x) => tab === 'Semua' || x.jenis === tab;
  const rek = REK.filter(ok), pop = POP.filter(ok), dl = DL.filter(ok);
  const kosong = <T size={12} color={C.muted}>Belum ada event di kategori ini.</T>;
  const Simpan = ({ id }) => (
    <Pressable accessibilityRole="button" accessibilityLabel="Simpan" onPress={() => setSimpan({ ...simpan, [id]: !simpan[id] })} style={{ position: 'absolute', right: 8, top: 8, width: 26, height: 26, borderRadius: 7, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
      <T size={13} color={simpan[id] ? '#D9A21B' : C.teal2}>{simpan[id] ? '★' : '☆'}</T>
    </Pressable>
  );
  const Blok = ({ ikon, warna, teks, sub, kosongnya, children }) => (
    <View style={{ gap: 8 }}>
      <Judul ikon={ikon} warna={warna} teks={teks} sub={sub} aksi="Lihat semua" onPress={() => setTab('Semua')} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>{kosongnya ? kosong : children}</View>
    </View>
  );
  const Lengkap = ({ k, rasio }) => (
    <View key={k.id} style={{ ...kartu, width: lbr, paddingBottom: 10 }}>
      <View><Image source={IMG[k.id]} resizeMode="cover" style={{ width: lbr - 2, height: Math.round((lbr - 2) * rasio) }} /><Simpan id={k.id} /></View>
      <View style={{ paddingHorizontal: 10, gap: 4, marginTop: 8 }}>
        <T w={800} size={12} numberOfLines={3} style={{ minHeight: 48 }}>{k.judul}</T>
        <T size={10} color={C.muted} numberOfLines={1}>{k.pen}</T>
        <View style={{ flexDirection: 'row', gap: 3, flexWrap: 'wrap', minHeight: 40 }}>{k.tag.map((t) => <Chip key={t} t={t} />)}</View>
        <Info ik="▦" t={k.tgl} /><Info ik="◷" t={k.jam} /><Info ik="◎" t={k.lok} /><Info ik="◔" t={k.ps} />
        <View style={{ marginTop: 6 }}><Tombol penuh t="Lihat Detail" onPress={() => go('komunitas2')} /></View>
      </View>
    </View>
  );
  return (
    <Screen>
      <View style={{ gap: 12 }} onLayout={(e) => setLebar(e.nativeEvent.layout.width)}>
        <View style={{ ...kartu, aspectRatio: 941 / 216, backgroundColor: '#0F3B4A' }}>
          <Image source={IMG.hero} resizeMode="stretch" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} />
          <Pressable accessibilityRole="button" accessibilityLabel="Jelajahi Event" onPress={() => setTab('Semua')} style={{ position: 'absolute', left: '4%', top: '79%', width: '16.7%', height: '16%' }} />
          <Pressable accessibilityRole="button" accessibilityLabel="Buat Event" onPress={() => setPesan('Fitur buat event akan segera tersedia (contoh demo).')} style={{ position: 'absolute', left: '22%', top: '79%', width: '16.2%', height: '16%' }} />
        </View>
        {pesan ? <View style={{ ...kartu, padding: 10, backgroundColor: C.soft }}><T size={11} color={C.teal2}>{pesan}</T></View> : null}
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
          {TAB.map((t) => { const on = tab === t; return (
            <Pressable key={t} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => setTab(t)} style={{ paddingHorizontal: 14, minHeight: 32, borderRadius: 10, justifyContent: 'center', backgroundColor: on ? C.teal2 : C.card, borderWidth: 1, borderColor: on ? C.teal2 : C.line }}>
              <T w={on ? 800 : 600} size={11} color={on ? '#fff' : C.ink}>{t}</T>
            </Pressable>
          ); })}
        </View>

        <Blok ikon="target" warna="#D33" teks="Event Rekomendasi untukmu" sub="Dipilih berdasarkan minat, skill, tujuan karier, dan aktivitasmu di myCITA." kosongnya={rek.length === 0}>
          {rek.map((k) => <Lengkap key={k.id} k={k} rasio={0.25} />)}
        </Blok>
        <Blok ikon="flag" warna="#E8A33D" teks="Event Populer di myCITA" sub="Event dengan peserta terbanyak dan tingkat antusiasme tinggi." kosongnya={pop.length === 0}>
          {pop.map((k) => <Lengkap key={k.id} k={k} rasio={0.18} />)}
        </Blok>
        <Blok ikon="bell" warna="#1C6BA8" teks="Event dengan Jadwal Terdekat" sub="Jangan lewatkan kesempatan, daftar sebelum kuota penuh." kosongnya={dl.length === 0}>
          {dl.map((k) => (
            <View key={k.id} style={{ ...kartu, width: lbr, paddingBottom: 10 }}>
              <Image source={IMG[k.id]} resizeMode="cover" style={{ width: lbr - 2, height: Math.round((lbr - 2) * 0.16) }} />
              <View style={{ paddingHorizontal: 10, gap: 4, marginTop: 8 }}>
                <T w={800} size={12} numberOfLines={2} style={{ minHeight: 32 }}>{k.judul}</T>
                <T size={10} color={C.muted} numberOfLines={1}>{k.pen}</T>
                <Info ik="◎" t={k.lok} /><Info ik="◔" t={k.ps} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <T w={700} size={10} color="#D33" style={{ flex: 1 }} numberOfLines={1}>◔ {k.sisa}</T>
                  <Tombol t={daftar[k.id] ? 'Terdaftar' : 'Daftar'} aktif={!daftar[k.id]} onPress={() => setDaftar({ ...daftar, [k.id]: !daftar[k.id] })} />
                </View>
              </View>
            </View>
          ))}
        </Blok>
        <T size={11} color={C.muted}>Semua event, tanggal, dan angka di halaman ini adalah contoh untuk demo.</T>
      </View>
    </Screen>
  );
}

// ─── Panel kanan khusus halaman Event & Webinar ──────────────────────
export function PanelKananEvent({ go }) {
  const [st, setSt] = useState({});
  const tg = (k) => setSt({ ...st, [k]: !st[k] });
  const akan = [['24', 'Okt', 'Pengantar Machine Learning', 'oleh Kaggle Indonesia', 'Online', '560 peserta'], ['26', 'Okt', 'Praktik SQL untuk Analisis Data', 'oleh Komunitas Data Indonesia', 'Online', '220 peserta'], ['27', 'Okt', 'Inovasi AI di Industri Manufaktur', 'oleh Yanmar Indonesia', 'Hybrid', '180 peserta'], ['29', 'Okt', 'Data Visualization dengan Power BI', 'oleh Tokopedia', 'Online', '1.8K peserta']];
  const pernah = [['Webinar Introduction to AI', 'oleh Google Indonesia', '15 Sep 2026', 'h1'], ['Workshop Python for Data', 'oleh Dicoding', '10 Agu 2026', 'h2'], ['Seminar Karier di Industri Data', 'oleh Komunitas Data Indonesia', '20 Jul 2026', 'h3']];
  const disimpan = [['Generative AI untuk Pemula', 'oleh Microsoft Indonesia', '25 Okt 2026', 's1'], ['UI/UX Design Workshop', 'oleh Figma Indonesia', '05 Nov 2026', 's2'], ['Product Management 101', 'oleh Gojek', '12 Nov 2026', 's3']];
  const bicara = [['Rizky Pratama', 'Data Scientist | Tech Company', '5 event mendatang', 'a1'], ['Salsa Rahma', 'Machine Learning Engineer', '4 event mendatang', 'a2'], ['Dimas Ardianto', 'Product Manager', '3 event mendatang', 'a3']];
  return (
    <View style={{ gap: 12 }}>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Event yang Akan Datang" aksi="Lihat semua" onPress={() => go('eventhal')} />
        {akan.map(([a, b, n, o, l, p]) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <View style={{ width: 42, height: 46, borderRadius: 8, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }}><T w={800} size={14}>{a}</T><T w={700} size={10}>{b}</T></View>
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={11} numberOfLines={2}>{n}</T><T size={10} color={C.muted} numberOfLines={1}>{o}</T><T size={10} color={C.muted}>{l} • {p}</T></View>
            <Tombol t="Lihat" onPress={() => go('komunitas2')} />
          </View>
        ))}
      </View>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Event yang Pernah Kamu Ikuti" aksi="Lihat semua" onPress={() => go('eventhal')} />
        {pernah.map(([n, o, t, im]) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={IMG[im]} style={{ width: 52, height: 48, borderRadius: 8 }} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={11} numberOfLines={2}>{n}</T><T size={10} color={C.muted} numberOfLines={1}>{o}</T><T size={10} color={C.muted}>{t}</T></View>
            <View style={{ backgroundColor: C.soft, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}><T w={700} size={10} color={C.teal2}>Selesai</T></View>
          </View>
        ))}
      </View>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Event yang Disimpan" aksi="Lihat semua" onPress={() => go('eventhal')} />
        {disimpan.map(([n, o, t, im]) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={IMG[im]} style={{ width: 52, height: 48, borderRadius: 8 }} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={11} numberOfLines={2}>{n}</T><T size={10} color={C.muted} numberOfLines={1}>{o}</T><T size={10} color={C.muted}>{t}</T></View>
            <Pressable accessibilityRole="button" accessibilityLabel="Simpan" onPress={() => tg(n)}><T size={16} color={st[n] ? C.muted : C.teal2}>{st[n] ? '☆' : '★'}</T></Pressable>
            <Tombol t="Lihat" onPress={() => go('komunitas2')} />
          </View>
        ))}
      </View>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Pembicara yang Mungkin Kamu Minati" aksi="Lihat semua" onPress={() => go('koneksi')} />
        {bicara.map(([n, p, e, im]) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={IMG[im]} style={{ width: 46, height: 46, borderRadius: 23 }} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={12} numberOfLines={1}>{n}</T><T size={10} color={C.muted} numberOfLines={1}>{p}</T><T size={10} color={C.muted}>{e}</T></View>
            <Tombol t={st[n] ? 'Diikuti' : 'Lihat'} aktif={!st[n]} onPress={() => tg(n)} />
          </View>
        ))}
      </View>
    </View>
  );
}
