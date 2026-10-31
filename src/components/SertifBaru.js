import React, { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import Icon from './Icon';
import { Screen, T } from './ui';
import { C } from '../theme';

const kartu = { get backgroundColor() { return C.card; }, borderRadius: 14, borderWidth: 1, get borderColor() { return C.line; }, overflow: 'hidden' };
const IMG = {
  a1: require('../assets/beranda/ks_a1.jpg'),
  a2: require('../assets/beranda/ks_a2.jpg'),
  a3: require('../assets/beranda/ks_a3.jpg'),
  a4: require('../assets/beranda/ks_a4.jpg'),
  b1: require('../assets/beranda/ks_b1.jpg'),
  b2: require('../assets/beranda/ks_b2.jpg'),
  b3: require('../assets/beranda/ks_b3.jpg'),
  b4: require('../assets/beranda/ks_b4.jpg'),
  c1: require('../assets/beranda/ks_c1.jpg'),
  c2: require('../assets/beranda/ks_c2.jpg'),
  c3: require('../assets/beranda/ks_c3.jpg'),
  c4: require('../assets/beranda/ks_c4.jpg'),
  g1: require('../assets/beranda/ks_g1.jpg'),
  g2: require('../assets/beranda/ks_g2.jpg'),
  g3: require('../assets/beranda/ks_g3.jpg'),
  g4: require('../assets/beranda/ks_g4.jpg'),
  hero: require('../assets/beranda/ks_hero.jpg'),
  promo: require('../assets/beranda/ks_promo.jpg'),
  r1: require('../assets/beranda/ks_r1.jpg'),
  r2: require('../assets/beranda/ks_r2.jpg'),
  r3: require('../assets/beranda/ks_r3.jpg'),
  r4: require('../assets/beranda/ks_r4.jpg'),
  s1: require('../assets/beranda/ks_s1.jpg'),
  s2: require('../assets/beranda/ks_s2.jpg'),
  s3: require('../assets/beranda/ks_s3.jpg'),
  s4: require('../assets/beranda/ks_s4.jpg'),
  v1: require('../assets/beranda/ks_v1.jpg'),
  v2: require('../assets/beranda/ks_v2.jpg'),
  v3: require('../assets/beranda/ks_v3.jpg'),
  v4: require('../assets/beranda/ks_v4.jpg'),
  v5: require('../assets/beranda/ks_v5.jpg'),
  v6: require('../assets/beranda/ks_v6.jpg'),
  w1: require('../assets/beranda/ks_w1.jpg'),
  w2: require('../assets/beranda/ks_w2.jpg'),
  w3: require('../assets/beranda/ks_w3.jpg'),
  w4: require('../assets/beranda/ks_w4.jpg'),
};
// Semua sertifikasi, jadwal, dan angka di halaman ini adalah contoh untuk demo.
const TAB = ['Semua', 'Sertifikasi Nasional', 'Sertifikasi Internasional', 'Sertifikasi Profesi', 'Sertifikasi Teknologi', 'Sertifikasi Manajemen', 'Sertifikasi Industri', 'Gratis'];
const REK = [
  { id: 'r1', judul: 'AWS Certified Cloud Practitioner', pen: 'Amazon Web Services', rating: '4.8 (12.4K)', siap: '4-8 minggu', tag: ['Cloud', 'IT Fundamentals', 'Pemula'], jenis: 'Sertifikasi Internasional' },
  { id: 'r2', judul: 'Sertifikasi Kompetensi Data Analyst', pen: 'BNSP (Badan Nasional Sertifikasi Profesi)', rating: '4.7 (8.2K)', siap: '1-3 bulan', tag: ['Data Analysis', 'Profesi', 'Nasional'], jenis: 'Sertifikasi Nasional' },
  { id: 'r3', judul: 'IBM Data Analyst Professional Certificate', pen: 'IBM', rating: '4.8 (6.1K)', siap: '1-3 bulan', tag: ['Data Analysis', 'Portfolio', 'Pemula'], jenis: 'Sertifikasi Internasional' },
  { id: 'r4', judul: 'Microsoft Certified: Azure Data Fundamentals', pen: 'Microsoft Learn', rating: '4.7 (9.6K)', siap: '4-8 minggu', tag: ['Azure', 'Data', 'Pemula'], jenis: 'Sertifikasi Internasional' },
];
const KAT = [
  ['a1', 'Sertifikasi Nasional', 'BNSP, Kemenaker, Kemenhub, dll', 'Sertifikasi Nasional'], ['a2', 'Sertifikasi Internasional', 'AWS, IBM, Microsoft, Google, dll', 'Sertifikasi Internasional'],
  ['a3', 'Sertifikasi Profesi', 'Bidang pekerjaan spesifik (HR, Finance, dll)', 'Sertifikasi Profesi'], ['a4', 'Sertifikasi Teknologi', 'IT, Data, AI, Cybersecurity, Cloud, dll', 'Sertifikasi Teknologi'],
  ['b1', 'Sertifikasi Manajemen', 'PMP, ITIL, Agile, dll', 'Sertifikasi Manajemen'], ['b2', 'Sertifikasi Industri', 'SIO, K3, Konstruksi, Manufaktur, dll', 'Sertifikasi Industri'],
  ['b3', 'Sertifikasi Bahasa', 'TOEFL, IELTS, JLPT, dll', 'Semua'], ['b4', 'Sertifikasi Lainnya', 'Desain, Digital Marketing, Akuntansi, dll', 'Semua'],
];
const POP = [
  { id: 'g1', judul: 'Google Data Analytics Professional Certificate', pen: 'Google', rating: '4.8 (20.1K)', tag: ['Data Analysis', 'Analytics'] },
  { id: 'g2', judul: 'TensorFlow Developer Certificate', pen: 'TensorFlow', rating: '4.7 (15.6K)', tag: ['Machine Learning', 'AI'] },
  { id: 'g3', judul: 'Cisco CCNA', pen: 'Cisco', rating: '4.6 (18.2K)', tag: ['Networking', 'IT Infrastructure'] },
  { id: 'g4', judul: 'SIO Operator Forklift', pen: 'Kemenaker / LPK', rating: '4.6 (6.4K)', tag: ['K3', 'Industri'] },
];
const WEB = [
  { id: 'w1', judul: 'Strategi Lulus Sertifikasi BNSP Data Analyst', pen: 'oleh LSP Digital Sertifikasi' },
  { id: 'w2', judul: 'Persiapan AWS Cloud Practitioner (Tips & Trik)', pen: 'oleh AWS User Group ID' },
  { id: 'w3', judul: 'Mengenal Sertifikasi K3 untuk Industri', pen: 'oleh Kemenaker RI' },
  { id: 'w4', judul: 'Roadmap Sertifikasi Microsoft Azure', pen: 'oleh Microsoft Indonesia' },
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

export default function SertifBaru({ go }) {
  const [tab, setTab] = useState('Semua');
  const [daftar, setDaftar] = useState({});
  const [simpan, setSimpan] = useState({});
  const [lebar, setLebar] = useState(0);
  const per = lebar >= 720 ? 4 : lebar >= 460 ? 2 : 1;
  const lbr = lebar ? Math.floor((lebar - 10 * (per - 1)) / per) : 170;
  const rek = REK.filter((r) => tab === 'Semua' || tab === 'Gratis' || r.jenis === tab);
  const web = WEB;
  return (
    <Screen>
      <View style={{ gap: 12 }} onLayout={(e) => setLebar(e.nativeEvent.layout.width)}>
        <View style={{ ...kartu, aspectRatio: 946 / 227, minHeight: 190, justifyContent: 'center', backgroundColor: '#0F4C47' }}>
          <Image source={IMG.hero} resizeMode="cover" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} />
          <View style={{ paddingLeft: 20, width: '38%', gap: 3 }}>
            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}><Icon name="shield" size={15} color="#fff" /><T w={700} size={12} color="#fff">myCITA SERTIFIKASI</T></View>
            <T w={800} size={19} color="#fff" style={{ lineHeight: 24 }}>Validasi Skill, Perluas Peluang, Raih Karier yang Lebih Baik</T>
            <T size={10} color="#E6F0F3" numberOfLines={3} style={{ lineHeight: 14 }}>Temukan sertifikasi resmi dari berbagai penyelenggara nasional dan internasional. Tingkatkan kompetensi, perkuat profil profesional, dan buka lebih banyak peluang karier bersama myCITA.</T>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
              <Pressable accessibilityRole="button" onPress={() => setTab('Semua')} style={{ paddingHorizontal: 12, minHeight: 34, borderRadius: 8, backgroundColor: '#fff', justifyContent: 'center' }}><T w={800} size={11} color="#0F4C47">Jelajahi Sertifikasi →</T></Pressable>
              <Pressable accessibilityRole="button" onPress={() => go('sertifikasi')} style={{ paddingHorizontal: 12, minHeight: 34, borderRadius: 8, borderWidth: 1, borderColor: '#fff', justifyContent: 'center' }}><T w={800} size={11} color="#fff">Lihat Panduan →</T></Pressable>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
          {TAB.map((t) => { const on = tab === t; return (
            <Pressable key={t} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => setTab(t)} style={{ paddingHorizontal: 12, minHeight: 32, borderRadius: 10, justifyContent: 'center', backgroundColor: on ? C.teal2 : C.card, borderWidth: 1, borderColor: on ? C.teal2 : C.line }}>
              <T w={on ? 800 : 600} size={11} color={on ? '#fff' : C.ink}>{t}</T>
            </Pressable>
          ); })}
        </View>

        <View style={{ gap: 8 }}>
          <Judul ikon="spark" warna="#E8A33D" teks="Disarankan sesuai untukmu" aksi="Lihat semua" onPress={() => go('sertifikasi')} />
          <T size={11} color={C.muted}>Rekomendasi sertifikasi berdasarkan minat, skill, dan tujuan kariermu.</T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {rek.length === 0 ? <T size={12} color={C.muted}>Belum ada rekomendasi di kategori ini.</T> : rek.map((k) => (
              <View key={k.id} style={{ ...kartu, width: lbr, paddingBottom: 10 }}>
                <Image source={IMG[k.id]} resizeMode="cover" style={{ width: lbr - 2, height: Math.round((lbr - 2) * 0.31) }} />
                <View style={{ paddingHorizontal: 10, gap: 5, marginTop: 6 }}>
                  <T w={800} size={12} numberOfLines={2} style={{ minHeight: 32 }}>{k.judul}</T>
                  <T size={10} color={C.muted} numberOfLines={1}>{k.pen}</T>
                  <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}><T size={10} color={C.ink}>★ {k.rating}</T><T size={10} color={C.muted}>◔ Persiapan: {k.siap}</T></View>
                  <View style={{ flexDirection: 'row', gap: 3, flexWrap: 'wrap' }}>{k.tag.map((t) => <Chip key={t} t={t} />)}</View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Judul teks="Kategori Sertifikasi" aksi="Lihat semua" onPress={() => setTab('Semua')} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {KAT.map(([id, j, w, t]) => (
              <Pressable key={id} accessibilityRole="button" onPress={() => setTab(t)} style={{ ...kartu, width: lbr, padding: 10, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <Image source={IMG[id]} style={{ width: 42, height: 42, borderRadius: 10 }} />
                <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={11} numberOfLines={2}>{j}</T><T size={9} color={C.muted} numberOfLines={2}>{w}</T></View>
                <T size={14} color={C.muted}>›</T>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Judul ikon="flag" warna="#E8A33D" teks="Sertifikasi Populer" aksi="Lihat semua" onPress={() => go('sertifikasi')} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {POP.map((k) => (
              <View key={k.id} style={{ ...kartu, width: lbr, padding: 10, gap: 6 }}>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
                  <Image source={IMG[k.id]} resizeMode="contain" style={{ width: 44, height: 44 }} />
                  <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={11} numberOfLines={3}>{k.judul}</T><T size={9} color={C.muted} numberOfLines={1}>{k.pen}</T><T size={10} color={C.ink}>★ {k.rating}</T></View>
                  <Pressable accessibilityRole="button" accessibilityLabel="Simpan" onPress={() => setSimpan({ ...simpan, [k.id]: !simpan[k.id] })}><Icon name="flag" size={16} color={simpan[k.id] ? C.teal2 : C.muted} /></Pressable>
                </View>
                <View style={{ flexDirection: 'row', gap: 3, flexWrap: 'wrap' }}>{k.tag.map((t) => <Chip key={t} t={t} />)}</View>
                <Pressable accessibilityRole="button" onPress={() => go('sertifikasi')} style={{ minHeight: 32, borderRadius: 8, borderWidth: 1, borderColor: C.teal2, alignItems: 'center', justifyContent: 'center' }}><T w={800} size={11} color={C.teal2}>Lihat Detail</T></Pressable>
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Judul ikon="bell" warna="#1C6BA8" teks="Webinar & Sosialisasi Sertifikasi Mendatang" aksi="Lihat semua" onPress={() => go('komunitas', { tab: 'grup' })} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {web.map((w) => (
              <View key={w.id} style={{ ...kartu, width: lbr, padding: 10, gap: 6 }}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Image source={IMG[w.id]} style={{ width: 50, height: 54, borderRadius: 10 }} />
                  <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={11} numberOfLines={3}>{w.judul}</T><T size={9} color={C.muted} numberOfLines={1}>{w.pen}</T></View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <T size={9} color={C.muted} style={{ flex: 1 }} numberOfLines={1}>Online · Gratis</T>
                  <Pressable accessibilityRole="button" onPress={() => setDaftar({ ...daftar, [w.id]: !daftar[w.id] })} style={{ paddingHorizontal: 12, minHeight: 30, borderRadius: 8, borderWidth: 1, borderColor: daftar[w.id] ? C.line : C.teal2, justifyContent: 'center' }}><T w={800} size={11} color={daftar[w.id] ? C.muted : C.teal2}>{daftar[w.id] ? 'Terdaftar' : 'Daftar'}</T></Pressable>
                </View>
              </View>
            ))}
          </View>
        </View>
        <T size={11} color={C.muted}>Semua sertifikasi, jadwal, dan angka di halaman ini adalah contoh untuk demo.</T>
      </View>
    </Screen>
  );
}

// ─── Panel kanan khusus halaman Sertifikasi ───────────────────────────
export function PanelKananSertif({ go }) {
  const lanjut = [['AWS Certified Cloud Practitioner', 'Persiapan Ujian', 75, 'c1'], ['Sertifikasi BNSP Data Analyst', 'Latihan Soal', 60, 'c2'], ['Microsoft Azure Fundamentals', 'Materi Pembelajaran', 40, 'c3'], ['Google Data Analytics', 'Video Learning', 30, 'c4']];
  const lain = [['CompTIA Security+', 'CompTIA', '4.7 (9.2K)', 's1'], ['IELTS Academic', 'British Council', '4.8 (12.1K)', 's2'], ['ITIL 4 Foundation', 'PeopleCert', '4.6 (7.4K)', 's3'], ['PMP (Project Management)', 'PMI', '4.6 (8.9K)', 's4']];
  const pen = [['BNSP', 'Sertifikasi Profesi Nasional', 'v1'], ['Kemenaker', 'Sertifikasi K3 dan Industri', 'v2'], ['AWS', 'Sertifikasi Cloud & Teknologi', 'v3'], ['Microsoft Learn', 'Sertifikasi Microsoft', 'v4'], ['Google Cloud', 'Sertifikasi Google', 'v5'], ['IBM', 'Sertifikasi Data & AI', 'v6']];
  return (
    <View style={{ gap: 12 }}>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Lanjutkan Persiapan" aksi="Lihat semua" onPress={() => go('sertifikasi')} />
        {lanjut.map(([a, b, p, im]) => (
          <View key={a} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={IMG[im]} resizeMode="contain" style={{ width: 46, height: 44, borderRadius: 8 }} />
            <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
              <T w={800} size={11} numberOfLines={1}>{a}</T><T size={10} color={C.muted} numberOfLines={1}>{b}</T>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><View style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: C.line }}><View style={{ width: p + '%', height: 4, borderRadius: 2, backgroundColor: C.teal2 }} /></View><T size={9} color={C.muted}>{p}%</T></View>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Lanjutkan" onPress={() => go('sertifikasi')} style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#1C6BA8', alignItems: 'center', justifyContent: 'center' }}><T w={800} size={10} color="#fff">▶</T></Pressable>
          </View>
        ))}
      </View>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Rekomendasi Sertifikasi Lainnya" aksi="Lihat semua" onPress={() => go('sertifikasi')} />
        {lain.map(([a, b, r, im]) => (
          <View key={a} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={IMG[im]} resizeMode="contain" style={{ width: 46, height: 40 }} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={11} numberOfLines={2}>{a}</T><T size={10} color={C.muted} numberOfLines={1}>{b}</T><T size={10} color={C.ink}>★ {r}</T></View>
            <Pressable accessibilityRole="button" onPress={() => go('sertifikasi')} style={{ paddingHorizontal: 14, minHeight: 30, borderRadius: 8, borderWidth: 1, borderColor: C.teal2, justifyContent: 'center' }}><T w={800} size={11} color={C.teal2}>Lihat</T></Pressable>
          </View>
        ))}
      </View>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Penyelenggara Sertifikasi" aksi="Lihat semua" onPress={() => go('sertifikasi')} />
        {pen.map(([n, a, im]) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={IMG[im]} resizeMode="contain" style={{ width: 46, height: 30 }} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={11} numberOfLines={1}>{n}</T><T size={10} color={C.muted} numberOfLines={1}>{a}</T></View>
            <Pressable accessibilityRole="button" onPress={() => go('sertifikasi')} style={{ paddingHorizontal: 14, minHeight: 30, borderRadius: 8, borderWidth: 1, borderColor: C.teal2, justifyContent: 'center' }}><T w={800} size={11} color={C.teal2}>Lihat</T></Pressable>
          </View>
        ))}
      </View>
      <View style={{ ...kartu, flexDirection: 'row', backgroundColor: '#E6F4F1', height: 170 }}>
        <View style={{ flex: 1, padding: 14, gap: 6, justifyContent: 'center' }}>
          <T w={800} size={15} color="#0F4C47" style={{ lineHeight: 20 }}>Tampilkan Sertifikatmu di Profil myCITA</T>
          <T size={10} color="#2B5B57" style={{ lineHeight: 14 }}>Validasi kompetensi dan tingkatkan peluang kariermu.</T>
          <Pressable accessibilityRole="button" onPress={() => go('sertifikasi')} style={{ alignSelf: 'flex-start', marginTop: 6, paddingHorizontal: 14, minHeight: 36, borderRadius: 8, backgroundColor: '#0F4C47', justifyContent: 'center' }}><T w={800} size={12} color="#fff">Unggah Sertifikat →</T></Pressable>
        </View>
        <Image source={IMG.promo} resizeMode="cover" style={{ width: 112, height: 168 }} />
      </View>
    </View>
  );
}
