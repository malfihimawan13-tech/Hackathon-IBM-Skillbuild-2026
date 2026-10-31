import React, { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import Icon from './Icon';
import { Screen, T } from './ui';
import { C } from '../theme';

const kartu = { get backgroundColor() { return C.card; }, borderRadius: 14, borderWidth: 1, get borderColor() { return C.line; }, overflow: 'hidden' };
const IMG = {
  r1: require('../assets/beranda/kl_r1.jpg'),
  r2: require('../assets/beranda/kl_r2.jpg'),
  r3: require('../assets/beranda/kl_r3.jpg'),
  r4: require('../assets/beranda/kl_r4.jpg'),
  pa: require('../assets/beranda/kl_pa.jpg'),
  pb: require('../assets/beranda/kl_pb.jpg'),
  pc: require('../assets/beranda/kl_pc.jpg'),
  pd: require('../assets/beranda/kl_pd.jpg'),
  u1: require('../assets/beranda/kl_u1.jpg'),
  u2: require('../assets/beranda/kl_u2.jpg'),
  u3: require('../assets/beranda/kl_u3.jpg'),
  u4: require('../assets/beranda/kl_u4.jpg'),
  w1: require('../assets/beranda/kl_w1.jpg'),
  w2: require('../assets/beranda/kl_w2.jpg'),
  w3: require('../assets/beranda/kl_w3.jpg'),
  w4: require('../assets/beranda/kl_w4.jpg'),
  c1: require('../assets/beranda/kl_c1.jpg'),
  c2: require('../assets/beranda/kl_c2.jpg'),
  c3: require('../assets/beranda/kl_c3.jpg'),
  m1: require('../assets/beranda/kl_m1.jpg'),
  m2: require('../assets/beranda/kl_m2.jpg'),
  m3: require('../assets/beranda/kl_m3.jpg'),
  k1: require('../assets/beranda/kl_k1.jpg'),
  k2: require('../assets/beranda/kl_k2.jpg'),
  k3: require('../assets/beranda/kl_k3.jpg'),
  k4: require('../assets/beranda/kl_k4.jpg'),
  v1: require('../assets/beranda/kl_v1.jpg'),
  v2: require('../assets/beranda/kl_v2.jpg'),
  v3: require('../assets/beranda/kl_v3.jpg'),
  v4: require('../assets/beranda/kl_v4.jpg'),
  v5: require('../assets/beranda/kl_v5.jpg'),
  hero: require('../assets/beranda/kl_hero.jpg'),
};
// Semua kursus, mentor, dan jadwal di halaman ini adalah contoh untuk demo.
const TAB = ['Semua', 'Kursus', 'Learning Path', 'Mentor', 'Webinar', 'Komunitas', 'Materi', 'Program Perusahaan', 'Universitas', 'Gratis'];
const REK = [
  { id: 'r1', judul: 'Python untuk Data Analyst (From Zero to Hero)', pen: 'Dicoding', rating: '4.8 (12.4K)', jam: '12 jam', tag: ['Python', 'Data Analysis', 'Pemula'] },
  { id: 'r2', judul: 'Strategi Meningkatkan Karier di Era AI', pen: 'Mitra Talenta', rating: '4.7 (5.2K)', jam: '2 jam', tag: ['Karier', 'AI', 'Pengembangan Diri'] },
  { id: 'r3', judul: 'Data Visualization dengan Power BI', pen: 'Microsoft Learn', rating: '4.8 (8.9K)', jam: '10 jam', tag: ['Power BI', 'Data Analysis', 'Intermediate'] },
  { id: 'r4', judul: 'Excel untuk Analisis Data', pen: 'Udemy', rating: '4.6 (15.2K)', jam: '8 jam', tag: ['Excel', 'Data Analysis', 'Pemula'] },
];
const PATH = [
  { id: 'pa', judul: 'Data Analyst', badge: 'Populer', w: 'Dari dasar hingga siap kerja', st: '8 kursus • 4 proyek • 1 sertifikat' },
  { id: 'pb', judul: 'Machine Learning Engineer', badge: 'Trending', w: 'Bangun skill untuk karier di AI', st: '10 kursus • 5 proyek • 2 sertifikat' },
  { id: 'pc', judul: 'Business Analyst', w: 'Analisis bisnis dan pengambilan keputusan', st: '7 kursus • 4 proyek • 1 sertifikat' },
  { id: 'pd', judul: 'Digital Marketing', w: 'Strategi pemasaran digital dari dasar', st: '6 kursus • 3 proyek • 1 sertifikat' },
];
const POP = [
  { id: 'u1', judul: 'Machine Learning Fundamentals', pen: 'Coursera', rating: '4.8 (20.1K)', jam: '20 jam', tag: ['ML', 'Python', 'AI'] },
  { id: 'u2', judul: 'SQL untuk Data Analyst', pen: 'Dicoding', rating: '4.7 (10.3K)', jam: '15 jam', tag: ['SQL', 'Database', 'Pemula'] },
  { id: 'u3', judul: 'Product Management Basics', pen: 'RevoU', rating: '4.8 (7.6K)', jam: '14 jam', tag: ['Product', 'Strategy', 'Beginner'] },
  { id: 'u4', judul: 'Statistika untuk Analisis Data', pen: 'Zenius', rating: '4.6 (6.1K)', jam: '12 jam', tag: ['Statistik', 'Data Analysis', 'Pemula'] },
];
const WEB = [
  { id: 'w1', judul: 'Karier Data Analyst di Industri Manufaktur', pen: 'oleh Google Developer Group', info: 'Online · Gratis' },
  { id: 'w2', judul: 'Business Model Canvas untuk UMKM', pen: 'oleh UMKM Academy', info: 'Online · Rp 50.000' },
  { id: 'w3', judul: 'Visualisasi Data Interaktif dengan Power BI', pen: 'oleh Microsoft Learn', info: 'Online · Gratis' },
  { id: 'w4', judul: 'Strategi Digital Marketing untuk Pemula', pen: 'oleh RevoU', info: 'Online · Rp 75.000' },
];

const Chip = ({ t }) => <View style={{ backgroundColor: C.soft, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 }}><T size={9} color={C.teal2} numberOfLines={1}>{t}</T></View>;
function Judul({ teks, aksi, onPress, ikon, warna }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      {ikon ? <Icon name={ikon} size={18} color={warna || C.teal2} /> : null}
      <T w={800} size={ikon ? 15 : 14} style={{ flex: 1 }}>{teks}</T>
      {aksi ? <Pressable accessibilityRole="button" onPress={onPress}><T w={700} size={11} color={C.teal2}>{aksi} →</T></Pressable> : null}
    </View>
  );
}

export default function BelajarBaru({ go }) {
  const [tab, setTab] = useState('Semua');
  const [daftar, setDaftar] = useState({});
  const [lebar, setLebar] = useState(0);
  const per = lebar >= 720 ? 4 : lebar >= 460 ? 2 : 1;
  const lbr = lebar ? Math.floor((lebar - 10 * (per - 1)) / per) : 170;
  const lihat = (k) => tab === 'Semua' || (k === 'kursus' && tab === 'Kursus') || (k === 'path' && tab === 'Learning Path') || (k === 'web' && tab === 'Webinar') || ['Mentor', 'Komunitas', 'Materi', 'Program Perusahaan', 'Universitas', 'Gratis'].includes(tab);
  const gratis = (x) => tab !== 'Gratis' || !/Rp/.test(x.info || '');
  const Kursus = ({ k, tipis }) => (
    <View style={{ ...kartu, width: lbr, paddingBottom: 10 }}>
      <Image source={IMG[k.id]} resizeMode="cover" style={{ width: lbr - 2, height: tipis ? Math.round((lbr - 2) * 0.17) : Math.round((lbr - 2) * 0.3) }} />
      <View style={{ paddingHorizontal: 10, gap: 5, marginTop: 6 }}>
        <T w={800} size={12} numberOfLines={2} style={{ minHeight: 32 }}>{k.judul}</T>
        <T size={10} color={C.muted} numberOfLines={1}>{k.pen}</T>
        <View style={{ flexDirection: 'row', gap: 10 }}><T size={10} color={C.ink}>★ {k.rating}</T><T size={10} color={C.muted}>◔ {k.jam}</T></View>
        <View style={{ flexDirection: 'row', gap: 3, flexWrap: 'wrap' }}>{k.tag.map((t) => <Chip key={t} t={t} />)}</View>
      </View>
    </View>
  );
  return (
    <Screen>
      <View style={{ gap: 12 }} onLayout={(e) => setLebar(e.nativeEvent.layout.width)}>
        <View style={{ ...kartu, aspectRatio: 945 / 216, minHeight: 190, justifyContent: 'center', backgroundColor: '#0F4C47' }}>
          <Image source={IMG.hero} resizeMode="cover" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} />
          <View style={{ paddingLeft: 20, width: '40%', gap: 3 }}>
            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}><Icon name="book" size={15} color="#fff" /><T w={700} size={12} color="#fff">myCITA BELAJAR</T></View>
            <T w={800} size={19} color="#fff" style={{ lineHeight: 24 }}>Kembangkan Skill Hari Ini untuk Masa Depan yang Lebih Baik</T>
            <T size={10} color="#E6F0F3" numberOfLines={3} style={{ lineHeight: 14 }}>Akses ribuan kursus, mentor, komunitas, dan program pembelajaran dari berbagai penyelenggara untuk mengembangkan diri dan mencapai tujuan kariermu.</T>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
              <Pressable accessibilityRole="button" onPress={() => go('pendidikan')} style={{ paddingHorizontal: 12, minHeight: 34, borderRadius: 8, backgroundColor: '#fff', justifyContent: 'center' }}><T w={800} size={11} color="#0F4C47">Mulai Belajar →</T></Pressable>
              <Pressable accessibilityRole="button" onPress={() => setTab('Learning Path')} style={{ paddingHorizontal: 12, minHeight: 34, borderRadius: 8, borderWidth: 1, borderColor: '#fff', justifyContent: 'center' }}><T w={800} size={11} color="#fff">Lihat Learning Path →</T></Pressable>
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

        {lihat('kursus') ? (
          <View style={{ gap: 8 }}>
            <Judul ikon="spark" warna="#1C6BA8" teks="Disarankan sesuai untukmu" aksi="Lihat semua" onPress={() => go('pendidikan')} />
            <T size={11} color={C.muted}>Rekomendasi berdasarkan minat, skill, tujuan karier, dan aktivitasmu di myCITA.</T>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>{REK.map((k) => <Kursus key={k.id} k={k} />)}</View>
          </View>
        ) : null}

        {lihat('path') ? (
          <View style={{ gap: 8 }}>
            <Judul ikon="target" warna="#C2502B" teks="Learning Path Pilihan" aksi="Lihat semua" onPress={() => go('roadmap')} />
            <T size={11} color={C.muted}>Jalur belajar terstruktur untuk mencapai tujuan kariermu.</T>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {PATH.map((p) => (
                <View key={p.id} style={{ ...kartu, width: lbr, padding: 10, gap: 8 }}>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Image source={IMG[p.id]} style={{ width: 46, height: 46, borderRadius: 12 }} />
                    <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                      <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}><T w={800} size={12} style={{ flexShrink: 1 }}>{p.judul}</T>{p.badge ? <T w={700} size={9} color="#B77410">{p.badge}</T> : null}</View>
                      <T size={10} color={C.muted} numberOfLines={2}>{p.w}</T>
                    </View>
                  </View>
                  <T size={10} color={C.muted} numberOfLines={2}>{p.st}</T>
                  <Pressable accessibilityRole="button" onPress={() => go('roadmap')} style={{ minHeight: 32, borderRadius: 8, borderWidth: 1, borderColor: C.teal2, alignItems: 'center', justifyContent: 'center' }}><T w={800} size={11} color={C.teal2}>Lihat Path →</T></Pressable>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {lihat('kursus') ? (
          <View style={{ gap: 8 }}>
            <Judul ikon="chart" warna="#D33" teks="Kursus Populer untukmu" aksi="Lihat semua" onPress={() => go('pendidikan')} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>{POP.map((k) => <Kursus key={k.id} k={k} tipis />)}</View>
          </View>
        ) : null}

        {lihat('web') ? (
          <View style={{ gap: 8 }}>
            <Judul ikon="bell" warna="#D33" teks="Webinar & Workshop Mendatang" aksi="Lihat semua" onPress={() => go('komunitas', { tab: 'grup' })} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {WEB.filter(gratis).map((w) => (
                <View key={w.id} style={{ ...kartu, width: lbr, padding: 10, gap: 6 }}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Image source={IMG[w.id]} style={{ width: 50, height: 50, borderRadius: 10 }} />
                    <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={11} numberOfLines={3}>{w.judul}</T><T size={9} color={C.muted} numberOfLines={1}>{w.pen}</T></View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <T size={9} color={C.muted} style={{ flex: 1 }} numberOfLines={1}>{w.info}</T>
                    <Pressable accessibilityRole="button" onPress={() => setDaftar({ ...daftar, [w.id]: !daftar[w.id] })} style={{ paddingHorizontal: 12, minHeight: 30, borderRadius: 8, borderWidth: 1, borderColor: daftar[w.id] ? C.line : C.teal2, justifyContent: 'center' }}><T w={800} size={11} color={daftar[w.id] ? C.muted : C.teal2}>{daftar[w.id] ? 'Terdaftar' : 'Daftar'}</T></Pressable>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}
        <T size={11} color={C.muted}>Semua kursus, mentor, dan jadwal di halaman ini adalah contoh untuk demo.</T>
      </View>
    </Screen>
  );
}

// ─── Panel kanan khusus halaman Belajar ───────────────────────────────
export function PanelKananBelajar({ go }) {
  const [st, setSt] = useState({});
  const tg = (k) => setSt({ ...st, [k]: !st[k] });
  const lanjut = [['Python untuk Data Analyst', 'Dicoding', 75, 'c1'], ['Data Visualization dengan Power BI', 'Microsoft Learn', 53, 'c2'], ['Excel untuk Analisis Data', 'Udemy', 20, 'c3']];
  const mentor = [['Rizky Pratama', 'Data Scientist di Tech Company', '4.9 (320)', 'm1'], ['Salsa Rahma', 'Senior Data Analyst', '4.8 (256)', 'm2'], ['Andi Kurniawan', 'AI Engineer & Content Creator', '4.8 (198)', 'm3']];
  const kom = [['Data Analyst Indonesia', '12.4K anggota', 'k1'], ['Python Indonesia', '8.2K anggota', 'k2'], ['Machine Learning', '9.1K anggota', 'k3'], ['Excel Indonesia', '6.8K anggota', 'k4']];
  const pen = [['Dicoding', '520+ kursus', 'v1'], ['Microsoft Learn', '380+ kursus', 'v2'], ['Coursera', '1.2K+ kursus', 'v3'], ['Udemy', '2.1K+ kursus', 'v4'], ['RevoU', '150+ kursus', 'v5']];
  return (
    <View style={{ gap: 12 }}>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Lanjutkan Belajar" aksi="Lihat semua" onPress={() => go('pendidikan')} />
        {lanjut.map(([a, b, p, im]) => (
          <View key={a} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={IMG[im]} style={{ width: 48, height: 44, borderRadius: 8 }} />
            <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
              <T w={800} size={11} numberOfLines={1}>{a}</T><T size={10} color={C.muted} numberOfLines={1}>{b}</T>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><View style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: C.line }}><View style={{ width: p + '%', height: 4, borderRadius: 2, backgroundColor: C.teal2 }} /></View><T size={9} color={C.muted}>{p}%</T></View>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Lanjutkan" onPress={() => go('pendidikan')} style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#1C6BA8', alignItems: 'center', justifyContent: 'center' }}><T w={800} size={10} color="#fff">▶</T></Pressable>
          </View>
        ))}
      </View>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Mentor Populer" aksi="Lihat semua" onPress={() => go('koneksi')} />
        {mentor.map(([n, p, r, im]) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={IMG[im]} style={{ width: 46, height: 46, borderRadius: 23 }} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={12} numberOfLines={1}>{n}</T><T size={10} color={C.muted} numberOfLines={2}>{p}</T><T size={10} color={C.ink}>★ {r}</T></View>
            <Pressable accessibilityRole="button" onPress={() => tg(n)} style={{ paddingHorizontal: 12, minHeight: 30, borderRadius: 8, borderWidth: 1, borderColor: st[n] ? C.line : C.teal2, justifyContent: 'center' }}><T w={800} size={11} color={st[n] ? C.muted : C.teal2}>{st[n] ? 'Mengikuti' : 'Ikuti'}</T></Pressable>
          </View>
        ))}
      </View>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Komunitas Belajar" aksi="Lihat semua" onPress={() => go('komunitas', { tab: 'grup' })} />
        {kom.map(([n, a, im]) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={IMG[im]} style={{ width: 40, height: 38, borderRadius: 10 }} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={12} numberOfLines={1}>{n}</T><T size={10} color={C.muted}>{a}</T></View>
            <Pressable accessibilityRole="button" onPress={() => tg(n)} style={{ paddingHorizontal: 12, minHeight: 30, borderRadius: 8, borderWidth: 1, borderColor: st[n] ? C.line : C.teal2, justifyContent: 'center' }}><T w={800} size={11} color={st[n] ? C.muted : C.teal2}>{st[n] ? 'Tergabung' : 'Gabung'}</T></Pressable>
          </View>
        ))}
      </View>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Penyelenggara Pembelajaran" aksi="Lihat semua" onPress={() => go('pendidikan')} />
        {pen.map(([n, a, im]) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={IMG[im]} resizeMode="contain" style={{ width: 36, height: 36, borderRadius: 8 }} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={12} numberOfLines={1}>{n}</T><T size={10} color={C.muted}>{a}</T></View>
            <Pressable accessibilityRole="button" onPress={() => go('pendidikan')} style={{ paddingHorizontal: 14, minHeight: 30, borderRadius: 8, borderWidth: 1, borderColor: C.teal2, justifyContent: 'center' }}><T w={800} size={11} color={C.teal2}>Lihat</T></Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}
