import React, { useState } from 'react';
import { Image, Pressable, TextInput, View } from 'react-native';
import Icon from './Icon';
import { Avatar } from './Feed';
import { IkonBulat } from './Visual';
import { Screen, T } from './ui';
import { useApp } from '../state/AppContext';
import { C } from '../theme';

const kartu = { get backgroundColor() { return C.card; }, borderRadius: 14, borderWidth: 1, get borderColor() { return C.line; }, overflow: 'hidden' };
const IMG = {
  hero: require('../assets/beranda/kb_hero.jpg'), promo: require('../assets/beranda/kb_promo.jpg'),
  p1: require('../assets/beranda/kb_p1.jpg'), p2: require('../assets/beranda/kb_p2.jpg'), p3: require('../assets/beranda/kb_p3.jpg'), p4: require('../assets/beranda/kb_p4.jpg'),
  i1: require('../assets/beranda/kb_i1.jpg'), i2: require('../assets/beranda/kb_i2.jpg'), i3: require('../assets/beranda/kb_i3.jpg'), i4: require('../assets/beranda/kb_i4.jpg'),
  t1: require('../assets/beranda/kb_t1.jpg'), t2: require('../assets/beranda/kb_t2.jpg'), t3: require('../assets/beranda/kb_t3.jpg'), t4: require('../assets/beranda/kb_t4.jpg'),
  k1: require('../assets/beranda/kb_k1.jpg'), k2: require('../assets/beranda/kb_k2.jpg'), k3: require('../assets/beranda/kb_k3.jpg'), k4: require('../assets/beranda/kb_k4.jpg'),
};
// Semua peluang, perusahaan, dan postingan di halaman ini adalah contoh untuk demo.
const TAB = ['Semua', 'Diskusi', 'Peluang', 'Kolaborasi', 'Showcase', 'Tren Bisnis', 'Pendanaan', 'Komunitas'];
const FITUR = [
  ['briefcase', 'teal', 'Peluang Kolaborasi', 'Proyek, vendor, distributor, atau partner bisnis.', 'Lihat peluang'],
  ['store', 'ungu', 'Profil Bisnis', 'Tampilkan usaha, produk, atau layananmu.', 'Buat Profil Bisnis'],
  ['chart', 'biru', 'Tren & Insight', 'Data industri, berita, dan analisis pasar.', 'Lihat tren'],
  ['users', 'ungu', 'Komunitas Bisnis', 'Gabung komunitas sesuai bidang usahamu.', 'Jelajahi komunitas'],
];
const PELUANG = [
  { id: 1, foto: 'p1', judul: 'Dicari Supplier Kemasan Ramah Lingkungan', pt: 'Kopi Nusantara', logo: 'k1', kota: 'Bandung, Jawa Barat', tag: ['Kemasan', 'Supplier', 'Jangka Panjang'] },
  { id: 2, foto: 'p2', judul: 'Mencari Mitra Distribusi untuk Ekspansi Produk Kopi', pt: 'Kopi Senja', logo: 'k2', kota: 'Jakarta, DKI Jakarta', tag: ['Distribusi', 'Retail', 'Kemitraan'] },
  { id: 3, foto: 'p3', judul: 'UMKM Mencari Partner Digital Marketing', pt: 'Rasa Kita', logo: 'k3', kota: 'Yogyakarta, DI Yogyakarta', tag: ['Marketing', 'Branding', 'Proyek'] },
  { id: 4, foto: 'p4', judul: 'Startup AgriTech Mencari Investor Tahap Awal', pt: 'TaniMaju', logo: 'k4', kota: 'Tangerang, Banten', tag: ['AgriTech', 'Pendanaan', 'Early Stage'] },
];
const POSTS = [
  { id: 1, nama: 'Andi Pratama', peran: 'Pemilik Kafe', waktu: '2 jam lalu', badge: 'Diskusi', judul: 'Strategi meningkatkan penjualan di marketplace untuk UMKM', isi: 'Saya sedang mencoba memperluas penjualan produk kopi ke marketplace. Ada yang punya pengalaman atau tips dalam memilih strategi promosi yang efektif untuk UMKM?', suka: 48, komen: 12, kat: 'UMKM' },
  { id: 2, nama: 'Rina Oktaviani', peran: 'Founder Startup', waktu: '5 jam lalu', badge: 'Insight', judul: 'Peluang bisnis di sektor energi terbarukan', isi: 'Menurut saya, sektor energi terbarukan masih sangat terbuka, terutama di daerah-daerah yang belum terjangkau. Ini saat yang tepat untuk mulai…', suka: 96, komen: 24, kat: 'Startup' },
];
const KAT = ['Semua', 'UMKM', 'Startup', 'Manufaktur', 'E-commerce', 'Pertanian', 'Jasa', 'Lainnya'];

function Judul({ teks, aksi, onPress, ikon }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      {ikon ? <Icon name={ikon} size={18} color={C.teal2} /> : null}
      <T w={800} size={ikon ? 15 : 14} style={{ flex: 1 }}>{teks}</T>
      {aksi ? <Pressable accessibilityRole="button" onPress={onPress}><T w={700} size={11} color={C.teal2}>{aksi} →</T></Pressable> : null}
    </View>
  );
}
const Chip = ({ t }) => <View style={{ backgroundColor: C.soft, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 }}><T size={9} color={C.teal2} numberOfLines={1}>{t}</T></View>;

export default function BisnisBaru({ go }) {
  const { activeUserId: uid } = useApp();
  const [tab, setTab] = useState('Semua');
  const [kat, setKat] = useState('Semua');
  const [suka, setSuka] = useState({});
  const [simpan, setSimpan] = useState({});
  const [teks, setTeks] = useState('');
  const [baru, setBaru] = useState([]);
  const [lebar, setLebar] = useState(0);
  const per = lebar >= 720 ? 4 : lebar >= 460 ? 2 : 1;
  const lbr = lebar ? Math.floor((lebar - 10 * (per - 1)) / per) : 170;
  const nama = { budi: 'Budi Hadianto', agus: 'Agus Setiawan', dini: 'Dini Maharani' }[uid] || 'Kamu';
  const kirim = () => { if (!teks.trim()) return; setBaru([{ id: Date.now(), nama, peran: 'Anggota myCITA', waktu: 'baru saja', badge: 'Diskusi', judul: teks.trim().slice(0, 80), isi: teks.trim(), suka: 0, komen: 0, kat: 'UMKM' }, ...baru]); setTeks(''); };
  const posts = [...baru, ...POSTS].filter((p) => kat === 'Semua' || p.kat === kat);
  const tampilPeluang = ['Semua', 'Peluang', 'Kolaborasi', 'Pendanaan', 'Showcase'].includes(tab);
  const tampilDiskusi = ['Semua', 'Diskusi', 'Komunitas', 'Tren Bisnis'].includes(tab);
  return (
    <Screen>
      <View style={{ gap: 12 }} onLayout={(e) => setLebar(e.nativeEvent.layout.width)}>
        {/* Banner */}
        <View style={{ ...kartu, aspectRatio: 943 / 230, minHeight: 180, justifyContent: 'center', backgroundColor: '#0F4C47' }}>
          <Image source={IMG.hero} resizeMode="cover" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} />
          <View style={{ paddingLeft: 20, width: '42%', gap: 3 }}>
            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}><Icon name="store" size={15} color="#fff" /><T w={700} size={12} color="#fff">myCITA BISNIS</T></View>
            <T w={800} size={22} color="#fff" style={{ lineHeight: 27 }}>Peluang Lebih Luas{'\n'}untuk Berkembang</T>
            <T size={11} color="#E6F0F3" numberOfLines={3} style={{ lineHeight: 15 }}>Temukan peluang usaha, bangun kemitraan, dan ikuti perkembangan dunia bisnis di Indonesia bersama komunitas myCITA.</T>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              <Pressable accessibilityRole="button" onPress={() => go('usaha')} style={{ paddingHorizontal: 12, minHeight: 34, borderRadius: 8, backgroundColor: '#fff', justifyContent: 'center' }}><T w={800} size={11} color="#0F4C47">+ Buat Postingan</T></Pressable>
              <Pressable accessibilityRole="button" onPress={() => setTab('Peluang')} style={{ paddingHorizontal: 12, minHeight: 34, borderRadius: 8, borderWidth: 1, borderColor: '#fff', justifyContent: 'center' }}><T w={800} size={11} color="#fff">Cari Mitra Bisnis →</T></Pressable>
            </View>
          </View>
        </View>

        {/* Tab */}
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
          {TAB.map((t) => { const on = tab === t; return (
            <Pressable key={t} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => setTab(t)} style={{ paddingHorizontal: 14, minHeight: 34, borderRadius: 10, justifyContent: 'center', backgroundColor: on ? C.teal2 : C.card, borderWidth: 1, borderColor: on ? C.teal2 : C.line }}>
              <T w={on ? 800 : 600} size={12} color={on ? '#fff' : C.ink}>{t}</T>
            </Pressable>
          ); })}
        </View>

        {/* Fitur */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {FITUR.map(([ic, ak, j, w, a]) => (
            <View key={j} style={{ ...kartu, width: lbr, padding: 12, flexDirection: 'row', gap: 10 }}>
              <IkonBulat icon={ic} aksen={ak} size={44} />
              <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                <T w={800} size={13} numberOfLines={1}>{j}</T>
                <T size={11} color={C.muted} numberOfLines={3}>{w}</T>
                <Pressable accessibilityRole="button" onPress={() => (j === 'Komunitas Bisnis' ? go('komunitas', { tab: 'grup' }) : j === 'Profil Bisnis' ? go('tambahbisnis') : setTab(j === 'Tren & Insight' ? 'Tren Bisnis' : 'Peluang'))}><T w={800} size={11} color={C.teal2}>{a} →</T></Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* Peluang */}
        {tampilPeluang ? (
          <View style={{ gap: 10 }}>
            <Judul teks="Peluang dan Kolaborasi untukmu" aksi="Lihat semua" onPress={() => setTab('Peluang')} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {PELUANG.map((p) => (
                <View key={p.id} style={{ ...kartu, width: lbr, paddingBottom: 10, gap: 6 }}>
                  <Image source={IMG[p.foto]} resizeMode="cover" style={{ width: lbr - 2, height: Math.round((lbr - 2) * 0.44) }} />
                  <View style={{ paddingHorizontal: 10, gap: 5 }}>
                    <T w={800} size={13} numberOfLines={3} style={{ minHeight: 48 }}>{p.judul}</T>
                    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                      <Image source={IMG[p.logo]} style={{ width: 22, height: 22, borderRadius: 11 }} />
                      <View style={{ flex: 1 }}><T w={700} size={10} numberOfLines={1}>{p.pt}</T><T size={10} color={C.muted} numberOfLines={1}>{p.kota}</T></View>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 3, flexWrap: 'wrap' }}>{p.tag.map((t) => <Chip key={t} t={t} />)}</View>
                    <Pressable accessibilityRole="button" onPress={() => go('usaha')} style={{ minHeight: 34, borderRadius: 8, borderWidth: 1, borderColor: C.teal2, alignItems: 'center', justifyContent: 'center' }}><T w={800} size={12} color={C.teal2}>Lihat Detail</T></Pressable>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Diskusi */}
        {tampilDiskusi ? (
          <View style={{ gap: 10 }}>
            <Judul ikon="users" teks="Diskusi dan Cerita Bisnis" aksi="Lihat" onPress={() => go('home')} />
            <View style={{ ...kartu, padding: 10, flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <Avatar nama={nama} warna={C.gold} size={38} />
              <TextInput value={teks} onChangeText={setTeks} placeholder="Bagikan pengalaman, pertanyaan, atau insight bisnis..." placeholderTextColor={C.muted} style={{ flex: 1, minWidth: 180, minHeight: 38, borderRadius: 10, backgroundColor: C.ground, paddingHorizontal: 12, fontSize: 12, color: C.ink }} />
              {['Foto', 'Poll', 'Artikel', 'Peluang'].map((x) => <View key={x} style={{ paddingHorizontal: 10, minHeight: 34, borderRadius: 8, borderWidth: 1, borderColor: C.line, justifyContent: 'center' }}><T size={11} color={C.ink}>{x}</T></View>)}
              <Pressable accessibilityRole="button" onPress={kirim} style={{ paddingHorizontal: 16, minHeight: 36, borderRadius: 8, backgroundColor: C.teal2, justifyContent: 'center' }}><T w={800} size={12} color="#fff">Posting</T></Pressable>
            </View>
            <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
              {KAT.map((k) => { const on = kat === k; return (
                <Pressable key={k} accessibilityRole="button" onPress={() => setKat(k)} style={{ paddingHorizontal: 12, minHeight: 30, borderRadius: 15, justifyContent: 'center', backgroundColor: on ? C.teal2 : C.card, borderWidth: 1, borderColor: on ? C.teal2 : C.line }}>
                  <T w={on ? 800 : 600} size={11} color={on ? '#fff' : C.ink}>{k}</T>
                </Pressable>
              ); })}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {posts.length === 0 ? <T size={12} color={C.muted}>Belum ada postingan di kategori ini.</T> : posts.map((p) => (
                <View key={p.id} style={{ ...kartu, flexGrow: 1, flexBasis: lebar >= 720 ? '48%' : '100%', padding: 12, gap: 6 }}>
                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <Avatar nama={p.nama} warna={C.gold} size={38} />
                    <View style={{ flex: 1 }}>
                      <T w={800} size={12} numberOfLines={1}>{p.nama}</T>
                      <T size={10} color={C.muted} numberOfLines={1}>{p.peran} • {p.waktu}</T>
                    </View>
                    <View style={{ backgroundColor: C.soft, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 }}><T w={700} size={10} color={C.teal2}>{p.badge}</T></View>
                  </View>
                  <T w={800} size={14} style={{ lineHeight: 19 }}>{p.judul}</T>
                  <T size={11} color={C.muted} numberOfLines={4} style={{ lineHeight: 16 }}>{p.isi}</T>
                  <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center', marginTop: 4 }}>
                    <Pressable accessibilityRole="button" onPress={() => setSuka({ ...suka, [p.id]: !suka[p.id] })} style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}><Icon name="heart" size={16} color={suka[p.id] ? '#D33' : C.muted} /><T size={11} color={C.ink}>{p.suka + (suka[p.id] ? 1 : 0)}</T></Pressable>
                    <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}><Icon name="chat" size={16} color={C.muted} /><T size={11} color={C.ink}>{p.komen}</T></View>
                    <Pressable accessibilityRole="button" onPress={() => setSimpan({ ...simpan, [p.id]: !simpan[p.id] })} style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}><Icon name="flag" size={16} color={simpan[p.id] ? C.teal2 : C.muted} /><T size={11} color={C.ink}>{simpan[p.id] ? 'Tersimpan' : 'Simpan'}</T></Pressable>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}
        <T size={11} color={C.muted}>Semua peluang, perusahaan, dan postingan di halaman ini adalah contoh untuk demo.</T>
      </View>
    </Screen>
  );
}

// ─── Panel kanan khusus halaman Bisnis ────────────────────────────────
export function PanelKananBisnis({ go }) {
  const [ikuti, setIkuti] = useState({});
  const [daftar, setDaftar] = useState({});
  const mitra = [['PT Agro Maju Indonesia', 'Produsen bahan pangan', 'Jakarta • Manufaktur', 'i1'], ['Nusantara Packaging', 'Supplier kemasan', 'Bandung • Industri', 'i2'], ['DigitalKreatif Agency', 'Jasa digital marketing', 'Yogyakarta • Jasa', 'i3'], ['Toko Sumber Jaya', 'Distributor produk industri', 'Surabaya • Perdagangan', 'i4']];
  const tren = [['Tren UMKM Makanan & Minuman di 2026', 'Permintaan meningkat 12%', '12%', 't1'], ['Pertumbuhan E-commerce Lokal', 'Transaksi naik signifikan', '18%', 't2'], ['Peluang Bisnis Energi Terbarukan', 'Dukungan pemerintah meningkat', '15%', 't3'], ['Industri Manufaktur Tumbuh Stabil', 'Didorong peningkatan ekspor', '8%', 't4']];
  const acara = [['Business Networking Jakarta', 'Sab, 25 Okt 2026 • Offline', 'ungu', 'users'], ['Workshop Digital Marketing untuk UMKM', 'Jum, 31 Okt 2026 • Hybrid', 'biru', 'check'], ['Expo Startup Indonesia 2026', 'Sab, 7 Nov 2026 • Offline', 'gold', 'store']];
  return (
    <View style={{ gap: 12 }}>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Rekomendasi Partner Bisnis" aksi="Lihat semua" onPress={() => go('koneksi')} />
        {mitra.map(([n, a, b, im]) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={IMG[im]} style={{ width: 44, height: 44, borderRadius: 12 }} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={12} numberOfLines={1}>{n}</T><T size={10} color={C.muted} numberOfLines={1}>{a}</T><T size={10} color={C.muted} numberOfLines={1}>{b}</T></View>
            <Pressable accessibilityRole="button" onPress={() => setIkuti({ ...ikuti, [n]: !ikuti[n] })} style={{ paddingHorizontal: 12, minHeight: 30, borderRadius: 8, borderWidth: 1, borderColor: ikuti[n] ? C.line : C.teal2, justifyContent: 'center' }}><T w={800} size={11} color={ikuti[n] ? C.muted : C.teal2}>{ikuti[n] ? 'Mengikuti' : '+ Ikuti'}</T></Pressable>
          </View>
        ))}
      </View>

      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Tren Bisnis di Indonesia" aksi="Lihat semua" onPress={() => {}} />
        {tren.map(([a, b, p, im]) => (
          <View key={a} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={IMG[im]} style={{ width: 56, height: 46, borderRadius: 8 }} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={11} numberOfLines={2}>{a}</T><T size={10} color={C.muted} numberOfLines={1}>{b}</T></View>
            <T w={800} size={11} color="#1F7A4D">↑ {p}</T>
          </View>
        ))}
      </View>

      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Acara & Kegiatan Bisnis" aksi="Lihat semua" onPress={() => go('komunitas', { tab: 'grup' })} />
        {acara.map(([a, b, ak, ic]) => (
          <View key={a} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <IkonBulat icon={ic} aksen={ak} size={40} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={11} numberOfLines={2}>{a}</T><T size={10} color={C.muted} numberOfLines={1}>{b}</T></View>
            <Pressable accessibilityRole="button" onPress={() => setDaftar({ ...daftar, [a]: !daftar[a] })} style={{ paddingHorizontal: 12, minHeight: 30, borderRadius: 8, borderWidth: 1, borderColor: daftar[a] ? C.line : C.teal2, justifyContent: 'center' }}><T w={800} size={11} color={daftar[a] ? C.muted : C.teal2}>{daftar[a] ? 'Terdaftar' : 'Daftar'}</T></Pressable>
          </View>
        ))}
      </View>

      <View style={{ ...kartu, flexDirection: 'row', backgroundColor: '#E6F4F1', height: 170 }}>
        <View style={{ flex: 1, padding: 14, gap: 6, justifyContent: 'center' }}>
          <T w={800} size={16} color="#0F4C47" style={{ lineHeight: 21 }}>Punya ide bisnis?</T>
          <T size={11} color="#2B5B57" style={{ lineHeight: 15 }}>Jaringan, pengetahuan, dan peluang ada di myCITA.</T>
          <Pressable accessibilityRole="button" onPress={() => go('tambahbisnis')} style={{ alignSelf: 'flex-start', marginTop: 6, paddingHorizontal: 14, minHeight: 36, borderRadius: 8, backgroundColor: '#0F4C47', justifyContent: 'center' }}><T w={800} size={12} color="#fff">Mulai Sekarang →</T></Pressable>
        </View>
        <Image source={IMG.promo} resizeMode="cover" style={{ width: 118, height: 168 }} />
      </View>
    </View>
  );
}
