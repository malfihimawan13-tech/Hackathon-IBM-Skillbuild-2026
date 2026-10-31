import React, { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import Icon from './Icon';
import { Avatar } from './Feed';
import { Screen, T } from './ui';
import { C } from '../theme';

const kartu = { get backgroundColor() { return C.card; }, borderRadius: 14, borderWidth: 1, get borderColor() { return C.line; }, overflow: 'hidden' };
const IMG = {
  a1: require('../assets/beranda/ko_a1.jpg'),
  a2: require('../assets/beranda/ko_a2.jpg'),
  a3: require('../assets/beranda/ko_a3.jpg'),
  a4: require('../assets/beranda/ko_a4.jpg'),
  d1: require('../assets/beranda/ko_d1.jpg'),
  d2: require('../assets/beranda/ko_d2.jpg'),
  d3: require('../assets/beranda/ko_d3.jpg'),
  e1: require('../assets/beranda/ko_e1.jpg'),
  e2: require('../assets/beranda/ko_e2.jpg'),
  e3: require('../assets/beranda/ko_e3.jpg'),
  e4: require('../assets/beranda/ko_e4.jpg'),
  f1: require('../assets/beranda/ko_f1.jpg'),
  f2: require('../assets/beranda/ko_f2.jpg'),
  f3: require('../assets/beranda/ko_f3.jpg'),
  f4: require('../assets/beranda/ko_f4.jpg'),
  hero: require('../assets/beranda/ko_hero.jpg'),
  l1: require('../assets/beranda/ko_l1.jpg'),
  l2: require('../assets/beranda/ko_l2.jpg'),
  l3: require('../assets/beranda/ko_l3.jpg'),
  l4: require('../assets/beranda/ko_l4.jpg'),
  p1: require('../assets/beranda/ko_p1.jpg'),
  p2: require('../assets/beranda/ko_p2.jpg'),
  p3: require('../assets/beranda/ko_p3.jpg'),
  p4: require('../assets/beranda/ko_p4.jpg'),
  promo: require('../assets/beranda/ko_promo.jpg'),
  r1: require('../assets/beranda/ko_r1.jpg'),
  r2: require('../assets/beranda/ko_r2.jpg'),
  r3: require('../assets/beranda/ko_r3.jpg'),
  r4: require('../assets/beranda/ko_r4.jpg'),
};
// Semua komunitas, event, dan angka di halaman ini adalah contoh untuk demo.
const TAB = ['Semua', 'Data & AI', 'Teknologi', 'Karier', 'Bisnis & Startup', 'Industri', 'Pengembangan Diri', 'Daerah', 'Kampus', 'Grup Belajar'];
const REK = [
  { id: 'r1', logo: 'l1', nama: 'Data Analyst Indonesia', n: '12.4K', w: 'Komunitas untuk belajar, berbagi pengalaman, dan diskusi seputar Data Analyst.', tag: ['Data Analysis', 'Python', 'SQL'], kat: 'Data & AI' },
  { id: 'r2', logo: 'l2', nama: 'Python Indonesia', n: '8.2K', w: 'Belajar Python dari dasar hingga proyek nyata.', tag: ['Python', 'Machine Learning', 'AI'], kat: 'Teknologi' },
  { id: 'r3', logo: 'l3', nama: 'Machine Learning Indonesia', n: '9.1K', w: 'Diskusi riset, proyek, dan update terbaru seputar ML & AI.', tag: ['Machine Learning', 'Deep Learning', 'AI'], kat: 'Data & AI' },
  { id: 'r4', logo: 'l4', nama: 'Karier di Industri Manufaktur', n: '6.3K', w: 'Diskusi karier, produksi, quality, maintenance, dan teknologi industri.', tag: ['Manufaktur', 'Karier', 'Pengembangan Diri'], kat: 'Industri' },
];
const POPULER = [
  { id: 'p1', judul: 'Startup Indonesia (Sesi 1)', pen: 'oleh Data Analyst Indonesia', meta: ['Online', 'Gratis'], peserta: '120 peserta' },
  { id: 'p2', judul: 'Praktik Visualisasi Data dengan Power BI', pen: 'oleh Python Indonesia', meta: ['Online', 'Rp 50.000'], peserta: '85 peserta' },
  { id: 'p3', judul: 'Dasar-Dasar Machine Learning untuk Pemula', pen: 'oleh Machine Learning Indonesia', meta: ['Jakarta', 'Gratis'], peserta: '150 peserta' },
  { id: 'p4', judul: 'Networking Karier di Industri Manufaktur', pen: 'oleh Karier di Industri Manufaktur', meta: ['Jakarta', 'Rp 75.000'], peserta: '60 peserta' },
];
const EVENT = [
  { id: 'e1', judul: 'Belajar SQL Bareng (Sesi 1)', pen: 'oleh Data Analyst Indonesia', meta: ['Online', 'Gratis'], peserta: '120 peserta' },
  { id: 'e2', judul: 'Praktik Visualisasi Data dengan Power BI', pen: 'oleh Python Indonesia', meta: ['Online', 'Rp 50.000'], peserta: '85 peserta' },
  { id: 'e3', judul: 'Dasar-Dasar Machine Learning untuk Pemula', pen: 'oleh Machine Learning Indonesia', meta: ['Jakarta', 'Gratis'], peserta: '150 peserta' },
  { id: 'e4', judul: 'Networking Karier di Industri Manufaktur', pen: 'oleh Karier di Industri Manufaktur', meta: ['Jakarta', 'Rp 75.000'], peserta: '60 peserta' },
];
const ORANG = ['Dewi Kartika', 'Rafi Ahmad', 'Salsa Rahma'];

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

export default function KomunitasBaru({ go }) {
  const [tab, setTab] = useState('Semua');
  const [gabung, setGabung] = useState({});
  const [daftar, setDaftar] = useState({});
  const [lebar, setLebar] = useState(0);
  const per = lebar >= 720 ? 4 : lebar >= 460 ? 2 : 1;
  const lbr = lebar ? Math.floor((lebar - 10 * (per - 1)) / per) : 170;
  const rek = REK.filter((r) => tab === 'Semua' || r.kat === tab);
  const buka = () => go('komunitas', { tab: 'grup' });
  const KartuEvent = ({ e, i }) => (
    <View style={{ ...kartu, width: lbr, paddingBottom: 10 }}>
      <Image source={IMG[e.id]} resizeMode="cover" style={{ width: lbr - 2, height: Math.round((lbr - 2) * 0.26) }} />
      <View style={{ paddingHorizontal: 10, gap: 4, marginTop: 8 }}>
        <T w={800} size={12} numberOfLines={3} style={{ minHeight: 48 }}>{e.judul}</T>
        <T size={10} color={C.muted} numberOfLines={1}>{e.pen}</T>
        <View style={{ flexDirection: 'row', gap: 10 }}>{e.meta.map((m) => <T key={m} size={10} color={C.muted}>◔ {m}</T>)}</View>
        <T size={10} color={C.muted}>◔ {e.peserta}</T>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <View style={{ flexDirection: 'row', flex: 1 }}>{[0, 1, 2].map((j) => <View key={j} style={{ marginLeft: j ? -6 : 0, borderWidth: 2, borderColor: C.card, borderRadius: 12 }}><Avatar nama={ORANG[(i + j) % 3]} warna={C.gold} size={20} /></View>)}</View>
          <Pressable accessibilityRole="button" onPress={() => setDaftar({ ...daftar, [e.id]: !daftar[e.id] })} style={{ paddingHorizontal: 12, minHeight: 30, borderRadius: 8, borderWidth: 1, borderColor: daftar[e.id] ? C.line : C.teal2, justifyContent: 'center' }}><T w={800} size={11} color={daftar[e.id] ? C.muted : C.teal2}>{daftar[e.id] ? 'Terdaftar' : 'Daftar'}</T></Pressable>
        </View>
      </View>
    </View>
  );
  return (
    <Screen>
      <View style={{ gap: 12 }} onLayout={(e) => setLebar(e.nativeEvent.layout.width)}>
        <View style={{ ...kartu, aspectRatio: 945 / 217, minHeight: 190, justifyContent: 'center', backgroundColor: '#0F4C47' }}>
          <Image source={IMG.hero} resizeMode="cover" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} />
          <View style={{ paddingLeft: 20, width: '38%', gap: 3 }}>
            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}><Icon name="users" size={15} color="#fff" /><T w={700} size={12} color="#fff">myCITA KOMUNITAS</T></View>
            <T w={800} size={20} color="#fff" style={{ lineHeight: 25 }}>Bertumbuh Bersama Komunitas yang Tepat</T>
            <T size={10} color="#E6F0F3" numberOfLines={3} style={{ lineHeight: 14 }}>Temukan komunitas sesuai minatmu, berdiskusi, belajar bersama, bertemu mentor, dan perluas jaringan untuk mencapai tujuan karier dan bisnismu.</T>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
              <Pressable accessibilityRole="button" onPress={buka} style={{ paddingHorizontal: 12, minHeight: 34, borderRadius: 8, backgroundColor: '#fff', justifyContent: 'center' }}><T w={800} size={11} color="#0F4C47">Jelajahi Komunitas →</T></Pressable>
              <Pressable accessibilityRole="button" onPress={buka} style={{ paddingHorizontal: 12, minHeight: 34, borderRadius: 8, borderWidth: 1, borderColor: '#fff', justifyContent: 'center' }}><T w={800} size={11} color="#fff">Buat Komunitas →</T></Pressable>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
          {TAB.map((t) => { const on = tab === t; return (
            <Pressable key={t} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => setTab(t)} style={{ paddingHorizontal: 13, minHeight: 32, borderRadius: 10, justifyContent: 'center', backgroundColor: on ? C.teal2 : C.card, borderWidth: 1, borderColor: on ? C.teal2 : C.line }}>
              <T w={on ? 800 : 600} size={11} color={on ? '#fff' : C.ink}>{t}</T>
            </Pressable>
          ); })}
        </View>

        <View style={{ gap: 8 }}>
          <Judul ikon="users" warna="#1C6BA8" teks="Komunitas Rekomendasi untukmu" sub="Berdasarkan minat, skill, tujuan karier, dan aktivitasmu di myCITA." aksi="Lihat semua" onPress={buka} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {rek.length === 0 ? <T size={12} color={C.muted}>Belum ada komunitas di kategori ini.</T> : rek.map((k) => (
              <View key={k.id} style={{ ...kartu, width: lbr, paddingBottom: 10 }}>
                <Image source={IMG[k.id]} resizeMode="cover" style={{ width: lbr - 2, height: Math.round((lbr - 2) * 0.29) }} />
                <View style={{ paddingHorizontal: 10, gap: 5, marginTop: 8 }}>
                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <Image source={IMG[k.logo]} style={{ width: 30, height: 30, borderRadius: 8 }} />
                    <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={12} numberOfLines={2}>{k.nama}</T><T size={10} color={C.muted}>{k.n} anggota</T></View>
                  </View>
                  <T size={10} color={C.muted} numberOfLines={4} style={{ lineHeight: 14, minHeight: 56 }}>{k.w}</T>
                  <View style={{ flexDirection: 'row', gap: 3, flexWrap: 'wrap' }}>{k.tag.map((t) => <Chip key={t} t={t} />)}</View>
                  <Pressable accessibilityRole="button" onPress={() => setGabung({ ...gabung, [k.id]: !gabung[k.id] })} style={{ minHeight: 34, borderRadius: 8, borderWidth: 1, borderColor: gabung[k.id] ? C.line : C.teal2, alignItems: 'center', justifyContent: 'center' }}><T w={800} size={12} color={gabung[k.id] ? C.muted : C.teal2}>{gabung[k.id] ? 'Tergabung' : 'Gabung'}</T></Pressable>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Judul ikon="flag" warna="#E8A33D" teks="Komunitas Populer untukmu" sub="Komunitas dengan anggota terbanyak dan aktivitas paling aktif di myCITA." aksi="Lihat semua" onPress={buka} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>{POPULER.map((e, i) => <KartuEvent key={e.id} e={e} i={i} />)}</View>
        </View>

        <View style={{ gap: 8 }}>
          <Judul ikon="bell" warna="#D33" teks="Event dari Komunitas" sub="Kegiatan belajar bersama, kelas komunitas, study group, dan meetup yang diadakan oleh komunitas." aksi="Lihat semua" onPress={buka} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>{EVENT.map((e, i) => <KartuEvent key={e.id} e={e} i={i} />)}</View>
        </View>
        <T size={11} color={C.muted}>Semua komunitas, event, dan angka di halaman ini adalah contoh untuk demo.</T>
      </View>
    </Screen>
  );
}

// ─── Panel kanan khusus halaman Komunitas ─────────────────────────────
export function PanelKananKomunitas({ go }) {
  const [st, setSt] = useState({});
  const tg = (k) => setSt({ ...st, [k]: !st[k] });
  const buka = () => go('komunitas', { tab: 'grup' });
  const ikut = [['Data Analyst Indonesia', '12.4K anggota', 'f1'], ['Python Indonesia', '8.2K anggota', 'f2'], ['Machine Learning Indonesia', '9.1K anggota', 'f3'], ['Karier di Industri Manufaktur', '6.3K anggota', 'f4']];
  const orang = [['Rizky Pratama', 'Data Scientist | Tech Company', '2 komunitas yang sama', 'a1'], ['Salsa Rahma', 'Senior Data Analyst', '3 komunitas yang sama', 'a2'], ['Dimas Ardianto', 'Manufacturing Engineer', '2 komunitas yang sama', 'a3'], ['Putri Lestari', 'Product Manager', '1 komunitas yang sama', 'a4']];
  const dis = [['Tips membangun portfolio Data Analyst...', 'Data Analyst Indonesia', '2 jam yang lalu', 24, 8, 'd1'], ['Rekomendasi laptop untuk Machine...', 'Machine Learning Indonesia', '4 jam yang lalu', 31, 12, 'd2'], ['Pengalaman sertifikasi AWS, worth it ga?', 'Cloud & DevOps Indonesia', '6 jam yang lalu', 18, 6, 'd3']];
  return (
    <View style={{ gap: 12 }}>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Komunitas yang Kamu Ikuti" aksi="Lihat semua" onPress={buka} />
        {ikut.map(([n, a, im]) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={IMG[im]} style={{ width: 44, height: 44, borderRadius: 12 }} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={12} numberOfLines={2}>{n}</T><T size={10} color={C.muted}>{a}</T></View>
            <Pressable accessibilityRole="button" onPress={buka} style={{ paddingHorizontal: 14, minHeight: 30, borderRadius: 8, borderWidth: 1, borderColor: C.teal2, justifyContent: 'center' }}><T w={800} size={11} color={C.teal2}>Buka</T></Pressable>
          </View>
        ))}
      </View>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Anggota di Komunitas yang Mungkin Kamu Kenal" aksi="Lihat semua" onPress={() => go('koneksi')} />
        {orang.map(([n, p, k, im]) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={IMG[im]} style={{ width: 46, height: 46, borderRadius: 23 }} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={12} numberOfLines={1}>{n}</T><T size={10} color={C.muted} numberOfLines={2}>{p}</T><T size={10} color={C.muted} numberOfLines={1}>{k}</T></View>
            <Pressable accessibilityRole="button" onPress={() => tg(n)} style={{ paddingHorizontal: 12, minHeight: 30, borderRadius: 8, borderWidth: 1, borderColor: st[n] ? C.line : C.teal2, justifyContent: 'center' }}><T w={800} size={11} color={st[n] ? C.muted : C.teal2}>{st[n] ? 'Mengikuti' : 'Ikuti'}</T></Pressable>
          </View>
        ))}
      </View>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Diskusi Terbaru dari Komunitas" aksi="Lihat semua" onPress={buka} />
        {dis.map(([j, k, w, suka, komen, im]) => (
          <Pressable key={j} accessibilityRole="button" onPress={buka} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={IMG[im]} style={{ width: 36, height: 36, borderRadius: 18 }} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={11} numberOfLines={2}>{j}</T><T size={10} color={C.muted} numberOfLines={1}>{k}</T><T size={9} color={C.muted}>{w}</T></View>
            <View style={{ alignItems: 'flex-end', gap: 4 }}><T size={10} color={C.ink}>👍 {suka}</T><T size={10} color={C.ink}>💬 {komen}</T></View>
          </Pressable>
        ))}
      </View>
      <View style={{ ...kartu, flexDirection: 'row', backgroundColor: '#E6F4F1', height: 170 }}>
        <View style={{ flex: 1, padding: 14, gap: 6, justifyContent: 'center' }}>
          <T w={800} size={14} color="#0F4C47" style={{ lineHeight: 19 }}>Belum menemukan komunitas yang kamu cari?</T>
          <T size={10} color="#2B5B57" style={{ lineHeight: 14 }}>Kamu juga bisa membuat komunitas sendiri dan mengundang orang lain untuk bergabung.</T>
          <Pressable accessibilityRole="button" onPress={buka} style={{ alignSelf: 'flex-start', marginTop: 6, paddingHorizontal: 14, minHeight: 36, borderRadius: 8, backgroundColor: '#0F4C47', justifyContent: 'center' }}><T w={800} size={12} color="#fff">Buat Komunitas →</T></Pressable>
        </View>
        <Image source={IMG.promo} resizeMode="cover" style={{ width: 98, height: 168 }} />
      </View>
    </View>
  );
}
