import React, { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import Icon from './Icon';
import { Avatar } from './Feed';
import { IkonBulat } from './Visual';
import { fotoUntuk } from './foto';
import { Screen, T } from './ui';
import { C } from '../theme';

const kartu = { get backgroundColor() { return C.card; }, borderRadius: 14, borderWidth: 1, get borderColor() { return C.line; }, overflow: 'hidden' };
const I = (f) => f;
const IMG = {
  hero: require('../assets/beranda/kn_hero.jpg'),
  dewi: require('../assets/beranda/kn_dewi.jpg'), rafi: require('../assets/beranda/kn_rafi.jpg'), salsa: require('../assets/beranda/kn_salsa.jpg'),
  fauzan: require('../assets/beranda/kn_fauzan.jpg'), nadia: require('../assets/beranda/kn_nadia.jpg'),
  komA: require('../assets/beranda/kn_komA.jpg'), komB: require('../assets/beranda/kn_komB.jpg'), komC: require('../assets/beranda/kn_komC.jpg'),
  komD: require('../assets/beranda/kn_komD.jpg'), komE: require('../assets/beranda/kn_komE.jpg'),
  google: require('../assets/beranda/kn_google.jpg'), tokped: require('../assets/beranda/kn_tokped.jpg'), yanmar: require('../assets/beranda/kn_yanmar.jpg'),
  astra: require('../assets/beranda/kn_astra.jpg'), bca: require('../assets/beranda/kn_bca.jpg'),
  promo: require('../assets/beranda/kn_promo.jpg'),
};

// Semua orang, komunitas, dan perusahaan di halaman ini adalah contoh untuk demo.
const ORANG = [
  { nama: 'Dewi Kartika', foto: 'dewi', peran: 'Data Scientist', pt: 'PT ABC', kota: 'Jakarta, Indonesia', sama: 12, badge: 'Minat yang sama', jenis: 'orang', skill: ['Python', 'Machine Learning'] },
  { nama: 'Rafi Ahmad', foto: 'rafi', peran: 'Product Manager', pt: 'PT XYZ', kota: 'Tangerang, Indonesia', sama: 8, badge: 'Satu perusahaan', jenis: 'rekan', skill: ['Product', 'Career Growth'] },
  { nama: 'Salsa Rahma', foto: 'salsa', peran: 'Junior Data Analyst', pt: 'PT DEF', kota: 'Jakarta, Indonesia', sama: 5, badge: 'Alumni', jenis: 'alumni', skill: ['SQL', 'Data Visualization'] },
  { nama: 'Ahmad Fauzan', foto: 'fauzan', peran: 'Business Development', pt: 'PT GHI', kota: 'Bekasi, Indonesia', sama: 5, badge: 'Rekan kerja potensial', jenis: 'rekan', skill: ['Networking', 'Business'] },
  { nama: 'Nadia Putri', foto: 'nadia', peran: 'UI/UX Designer', pt: 'Freelance', kota: 'Depok, Indonesia', sama: 4, badge: 'Teman belajar', jenis: 'teman', skill: ['Design', 'Figma'] },
];
const KOMUNITAS = [
  { nama: 'Data Analyst Indonesia', foto: 'komA', n: '12.4K', tag: ['Diskusi', 'Materi', 'Kelas Online'] },
  { nama: 'Python Indonesia', foto: 'komB', n: '18.2K', tag: ['Belajar', 'Proyek', 'Mentor'] },
  { nama: 'Karier di Jepang', foto: 'komC', n: '8.7K', tag: ['Beasiswa', 'Kerja', 'Tips'] },
  { nama: 'Freelance & Remote', foto: 'komD', n: '9.1K', tag: ['Proyek', 'Klien', 'Sharing'] },
  { nama: 'Keuangan Personal', foto: 'komE', n: '6.3K', tag: ['Investasi', 'Tabungan', 'Diskusi'] },
];
const PERUSAHAAN = [
  { nama: 'Google Indonesia', foto: 'google', n: '250+' }, { nama: 'Tokopedia', foto: 'tokped', n: '180+' },
  { nama: 'Yanmar Diesel Indonesia', foto: 'yanmar', n: '42+' }, { nama: 'Astra International', foto: 'astra', n: '120+' },
  { nama: 'Bank BCA', foto: 'bca', n: '300+' },
];
const TAB = [['rek', 'Rekomendasi'], ['orang', 'Orang'], ['mentor', 'Mentor'], ['teman', 'Teman Belajar'], ['rekan', 'Rekan Kerja'], ['alumni', 'Alumni'], ['kom', 'Komunitas'], ['pt', 'Perusahaan']];
const MUTUAL = ['Dewi Kartika', 'Rafi Ahmad', 'Salsa Rahma', 'Ahmad Fauzan', 'Nadia Putri'];

function Tumpuk({ mulai = 0, n = 3 }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {Array.from({ length: n }).map((_, i) => (
        <View key={i} style={{ marginLeft: i ? -7 : 0, borderWidth: 2, borderColor: C.card, borderRadius: 14 }}><Avatar nama={MUTUAL[(mulai + i) % 5]} warna={C.gold} size={20} /></View>
      ))}
    </View>
  );
}

function Tombol({ label, on, onPress, ikon }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress}
      style={{ flexDirection: 'row', gap: 4, alignItems: 'center', justifyContent: 'center', minHeight: 32, borderRadius: 8, borderWidth: 1, borderColor: on ? C.line : C.teal2, backgroundColor: on ? C.ground : 'transparent' }}>
      {on ? <Icon name="check" size={13} color={C.muted} /> : ikon ? <Icon name={ikon} size={13} color={C.teal2} /> : null}
      <T w={800} size={12} color={on ? C.muted : C.teal2}>{label}</T>
    </Pressable>
  );
}

function Baris({ w, judul, ikon, aksi, onAksi, children }) {
  const [lebar, setLebar] = useState(0);
  const per = lebar >= 640 ? 5 : lebar >= 480 ? 3 : 2;
  const lbr = lebar ? Math.floor((lebar - 28 - 10 * (per - 1)) / per) : 150;
  return (
    <View style={{ ...kartu, padding: 14, gap: 10 }} onLayout={(e) => setLebar(e.nativeEvent.layout.width)}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon name={ikon} size={18} color={C.teal2} />
        <View style={{ flex: 1 }}>
          <T w={800} size={15}>{judul}</T>
          {w ? <T size={11} color={C.muted}>{w}</T> : null}
        </View>
        <Pressable accessibilityRole="button" onPress={onAksi}><T w={700} size={11} color={C.teal2}>{aksi} →</T></Pressable>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>{children(lbr)}</View>
    </View>
  );
}

function Pil({ t }) {
  return <View style={{ backgroundColor: C.ground, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}><T size={9} color={C.muted} numberOfLines={1}>{t}</T></View>;
}

export default function KoneksiBaru({ go }) {
  const [tab, setTab] = useState('rek');
  const [ikuti, setIkuti] = useState({});
  const [gabung, setGabung] = useState({});
  const tog = (set, st, k) => set({ ...st, [k]: !st[k] });
  const orang = ORANG.filter((o) => tab === 'rek' || tab === 'orang' || o.jenis === tab || (tab === 'mentor' && o.peran.includes('Manager')));
  const tampilOrang = ['rek', 'orang', 'mentor', 'teman', 'rekan', 'alumni'].includes(tab);
  return (
    <Screen>
      {/* Banner */}
      <View style={{ ...kartu, aspectRatio: 929 / 225, minHeight: 150, justifyContent: 'center' }}>
        <Image source={IMG.hero} resizeMode="cover" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} />
        <View style={{ paddingLeft: 22, width: '42%', gap: 3 }}>
          <T w={800} size={30} color="#fff">Koneksi</T>
          <T w={800} size={16} color="#fff" style={{ lineHeight: 21 }}>Bersama, perjalananmu{'\n'}lebih bermakna.</T>
          <T size={10} color="#E6F0F3" numberOfLines={3} style={{ lineHeight: 14, marginTop: 2 }}>Temukan orang-orang yang sejalan, mentor yang berpengalaman, komunitas yang mendukung, dan perusahaan impianmu.</T>
          <View style={{ flexDirection: 'row', gap: 14, marginTop: 8 }}>
            {[['users', 'teal', 'Perluas\njaringan'], ['spark', 'biru', 'Dapatkan\nkesempatan'], ['heart', 'ungu', 'Saling\nmendukung']].map(([ic, ak, tx]) => (
              <View key={tx} style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                <IkonBulat icon={ic} aksen={ak} size={28} /><T w={700} size={10} color="#fff" style={{ lineHeight: 13 }}>{tx}</T>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Tab */}
      <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
        {TAB.map(([k, l]) => {
          const on = tab === k;
          return (
            <Pressable key={k} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => setTab(k)}
              style={{ paddingHorizontal: 11, minHeight: 32, borderRadius: 16, justifyContent: 'center', backgroundColor: on ? C.teal2 : C.card, borderWidth: 1, borderColor: on ? C.teal2 : C.line }}>
              <T w={on ? 800 : 600} size={12} color={on ? '#fff' : C.ink}>{l}</T>
            </Pressable>
          );
        })}
        <View style={{ flex: 1 }} />
        <Pressable accessibilityRole="button" onPress={() => {}} style={{ flexDirection: 'row', gap: 6, alignItems: 'center', paddingHorizontal: 10, minHeight: 32, borderRadius: 10, borderWidth: 1, borderColor: C.teal2 }}>
          <T w={800} size={12} color={C.teal2}>Filter ▽</T>
        </Pressable>
      </View>

      {tampilOrang ? (
        <Baris ikon="users" judul="Orang yang Mungkin Kamu Kenal" w="Berdasarkan profil, minat, dan tujuanmu." aksi="Lihat semua" onAksi={() => go('mykoneksi')}>
          {(lbr) => (orang.length ? orang : ORANG).map((o, i) => (
            <View key={o.nama} style={{ width: lbr, borderWidth: 1, borderColor: C.line, borderRadius: 12, padding: 8, gap: 4 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ backgroundColor: C.soft, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2, flexShrink: 1 }}><T w={700} size={9} color={C.teal2} numberOfLines={1}>{o.badge}</T></View>
                <T w={800} size={14} color={C.muted}>···</T>
              </View>
              <Image source={IMG[o.foto]} resizeMode="cover" style={{ width: lbr - 18, height: Math.round((lbr - 18) * 0.78), borderRadius: 10 }} />
              <T w={800} size={13} numberOfLines={1}>{o.nama}</T>
              <T size={11} color={C.muted} numberOfLines={1}>{o.peran}</T>
              <T size={11} color={C.muted} numberOfLines={1}>▫ {o.pt}</T>
              <T size={11} color={C.muted} numberOfLines={1}>⌖ {o.kota}</T>
              <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}><Tumpuk mulai={i} /><T size={10} color={C.muted} numberOfLines={1} style={{ flexShrink: 1 }}>{o.sama} koneksi sama</T></View>
              <View style={{ flexDirection: 'row', gap: 4 }}>{o.skill.map((s) => <Pil key={s} t={s} />)}</View>
              <Tombol label={ikuti[o.nama] ? 'Mengikuti' : '+ Ikuti'} on={ikuti[o.nama]} onPress={() => tog(setIkuti, ikuti, o.nama)} />
            </View>
          ))}
        </Baris>
      ) : null}

      {tab === 'rek' || tab === 'kom' ? (
        <Baris ikon="globe" judul="Komunitas yang Mungkin Kamu Suka" aksi="Lihat semua" onAksi={() => go('komunitas', { tab: 'grup' })}>
          {(lbr) => KOMUNITAS.map((k) => (
            <View key={k.nama} style={{ width: lbr, borderWidth: 1, borderColor: C.line, borderRadius: 12, overflow: 'hidden', paddingBottom: 8, gap: 4 }}>
              <Image source={IMG[k.foto]} resizeMode="cover" style={{ width: lbr - 2, height: Math.round((lbr - 2) * 0.36) }} />
              <View style={{ paddingHorizontal: 8, gap: 4 }}>
                <T w={800} size={12} numberOfLines={1}>{k.nama}</T>
                <T size={10} color={C.muted}>◔ {k.n} anggota</T>
                <View style={{ flexDirection: 'row', gap: 3, flexWrap: 'wrap' }}>{k.tag.map((t) => <Pil key={t} t={t} />)}</View>
                <Tombol label={gabung[k.nama] ? 'Tergabung' : 'Gabung'} on={gabung[k.nama]} onPress={() => tog(setGabung, gabung, k.nama)} />
              </View>
            </View>
          ))}
        </Baris>
      ) : null}

      {tab === 'rek' || tab === 'pt' ? (
        <Baris ikon="users" judul="Perusahaan yang Mungkin Kamu Kenal" aksi="Lihat semua" onAksi={() => go('kerja')}>
          {(lbr) => PERUSAHAAN.map((p, i) => (
            <View key={p.nama} style={{ width: lbr, borderWidth: 1, borderColor: C.line, borderRadius: 12, padding: 8, gap: 6 }}>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <View style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}><Image source={IMG[p.foto]} resizeMode="contain" style={{ width: 36, height: 36 }} /></View>
                <View style={{ flex: 1 }}>
                  <T w={800} size={11} numberOfLines={2}>{p.nama}</T>
                  <T size={9} color={C.muted} numberOfLines={1}>{p.n} karyawan di myCITA</T>
                </View>
              </View>
              <Tumpuk mulai={i} n={5} />
              <Tombol label="Lihat Profil" onPress={() => go('kerja')} />
            </View>
          ))}
        </Baris>
      ) : null}
      <T size={11} color={C.muted}>Semua orang, komunitas, dan perusahaan di halaman ini adalah contoh untuk demo.</T>
    </Screen>
  );
}

// ─── Panel kanan khusus halaman Koneksi ───────────────────────────────
function Judul({ teks, aksi, onPress }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <T w={800} size={14} style={{ flex: 1 }}>{teks}</T>
      <Pressable accessibilityRole="button" onPress={onPress}><T w={700} size={11} color={C.teal2}>{aksi} →</T></Pressable>
    </View>
  );
}

export function PanelKananKoneksi({ go }) {
  const [minta, setMinta] = useState({ 'Rendi Setiawan': null, 'Monica Sari': null, 'Hendra Wijaya': null });
  const [daftar, setDaftar] = useState({});
  const permintaan = [['Rendi Setiawan', 'Data Engineer di PT ABC'], ['Monica Sari', 'Recruiter di PT XYZ'], ['Hendra Wijaya', 'Data Analyst di PT DEF']].filter(([n]) => minta[n] === null);
  const ikut = [['Dewi Kartika', 'Data Scientist • PT ABC', '12 koneksi sama'], ['Rafi Ahmad', 'Product Manager • PT XYZ', '8 koneksi sama'], ['Salsa Rahma', 'Junior Data Analyst • PT DEF', '5 koneksi sama'], ['Ahmad Fauzan', 'Business Development • PT GHI', '7 koneksi sama']];
  const acara = [['Webinar: Karier Data Analyst di Industri Manufaktur', 'Sab, 25 Okt 2026 • Online', 'biru'], ['Networking Night Jakarta', 'Jum, 31 Okt 2026 • Offline', 'gold'], ['Workshop Python untuk Pemula', 'Sab, 7 Nov 2026 • Hybrid', 'biru']];
  return (
    <View style={{ gap: 12 }}>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Permintaan Koneksi" aksi="Lihat semua" onPress={() => go('mykoneksi')} />
        {permintaan.length === 0 ? <T size={12} color={C.muted}>Tidak ada permintaan baru.</T> : permintaan.map(([n, p]) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Avatar nama={n} warna={C.gold} size={44} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={12} numberOfLines={1}>{n}</T><T size={11} color={C.muted} numberOfLines={2}>{p}</T></View>
            <Pressable accessibilityRole="button" onPress={() => setMinta({ ...minta, [n]: 'tolak' })} style={{ paddingHorizontal: 10, minHeight: 30, borderRadius: 8, borderWidth: 1, borderColor: C.line, justifyContent: 'center' }}><T w={800} size={11} color={C.ink}>Tolak</T></Pressable>
            <Pressable accessibilityRole="button" onPress={() => setMinta({ ...minta, [n]: 'terima' })} style={{ paddingHorizontal: 10, minHeight: 30, borderRadius: 8, backgroundColor: C.teal2, justifyContent: 'center' }}><T w={800} size={11} color="#fff">Terima</T></Pressable>
          </View>
        ))}
      </View>

      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Orang yang Kamu Ikuti" aksi="Lihat semua" onPress={() => go('mykoneksi')} />
        {ikut.map(([n, p, k]) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Avatar nama={n} warna={C.gold} size={44} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={12} numberOfLines={1}>{n}</T><T size={11} color={C.muted} numberOfLines={1}>{p}</T><T size={10} color={C.muted}>{k}</T></View>
            <Pressable accessibilityRole="button" onPress={() => go('pesan', { kepada: { key: n, nama: n, peran: p, warna: C.gold } })} style={{ paddingHorizontal: 14, minHeight: 32, borderRadius: 8, borderWidth: 1, borderColor: C.teal2, justifyContent: 'center' }}><T w={800} size={11} color={C.teal2}>Pesan</T></Pressable>
          </View>
        ))}
      </View>

      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Acara & Kegiatan" aksi="Lihat semua" onPress={() => go('komunitas', { tab: 'grup' })} />
        {acara.map(([j, w, ak], i) => (
          <View key={j} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <IkonBulat icon={i === 1 ? 'users' : 'flag'} aksen={ak} size={40} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={12} numberOfLines={2}>{j}</T><T size={10} color={C.muted}>{w}</T></View>
            <Pressable accessibilityRole="button" onPress={() => setDaftar({ ...daftar, [j]: !daftar[j] })} style={{ paddingHorizontal: 12, minHeight: 30, borderRadius: 8, borderWidth: 1, borderColor: daftar[j] ? C.line : C.teal2, justifyContent: 'center' }}><T w={800} size={11} color={daftar[j] ? C.muted : C.teal2}>{daftar[j] ? 'Terdaftar' : 'Daftar'}</T></Pressable>
          </View>
        ))}
      </View>

      <View style={{ ...kartu, flexDirection: 'row', backgroundColor: '#E6F4F1', height: 190 }}>
        <View style={{ flex: 1, padding: 14, gap: 6, justifyContent: 'center', zIndex: 2 }}>
          <T w={800} size={17} color="#0F4C47" style={{ lineHeight: 22 }}>Bangun jaringan lebih luas!</T>
          <T size={11} color="#2B5B57" style={{ lineHeight: 15 }}>Temukan mentor, teman belajar, rekan kerja, dan komunitas yang sejalan dengan tujuanmu.</T>
          <Pressable accessibilityRole="button" onPress={() => go('mykoneksi')} style={{ alignSelf: 'flex-start', marginTop: 6, paddingHorizontal: 14, minHeight: 36, borderRadius: 8, backgroundColor: '#0F4C47', justifyContent: 'center' }}><T w={800} size={12} color="#fff">Jelajahi Koneksi →</T></Pressable>
        </View>
        <Image source={IMG.promo} resizeMode="cover" style={{ width: 120, height: 188 }} />
      </View>
    </View>
  );
}
