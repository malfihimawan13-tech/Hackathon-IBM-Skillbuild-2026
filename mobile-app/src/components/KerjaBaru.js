import React, { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import Icon from './Icon';
import { IkonBulat } from './Visual';
import { Screen, T } from './ui';
import { C } from '../theme';

const kartu = { get backgroundColor() { return C.card; }, borderRadius: 14, borderWidth: 1, get borderColor() { return C.line; }, overflow: 'hidden' };
const IMG = {
  hero: require('../assets/beranda/kj_hero.jpg'), prep: require('../assets/beranda/kj_prep.jpg'),
  astra: require('../assets/beranda/kj_astra.jpg'), bca: require('../assets/beranda/kj_bca.jpg'), gojek: require('../assets/beranda/kj_gojek.jpg'),
  yanmar: require('../assets/beranda/kj_yanmar.jpg'), tokped: require('../assets/beranda/kj_tokped.jpg'),
};
// Semua lowongan di halaman ini adalah contoh untuk demo.
const JOBS = [
  { id: 1, judul: 'Data Analyst', pt: 'PT Astra International', logo: 'astra', kota: 'Jakarta', tipe: 'Hybrid', exp: '1–3 tahun', gaji: 'Rp 8 – 12 jt', skill: ['SQL', 'Python', 'Power BI'], badge: 'Sangat cocok', jenis: 'Full-time', kat: 'Data & AI', waktu: '2 hari lalu' },
  { id: 2, judul: 'Junior Data Analyst', pt: 'PT Bank Central Asia', logo: 'bca', kota: 'Jakarta', tipe: 'Onsite', exp: '0–2 tahun', gaji: 'Rp 6 – 9 jt', skill: ['Excel', 'SQL', 'Reporting'], badge: 'Cocok untukmu', jenis: 'Full-time', kat: 'Data & AI', waktu: '3 hari lalu' },
  { id: 3, judul: 'Data Engineer', pt: 'PT GoTo Gojek Tokopedia', logo: 'gojek', kota: 'Jakarta', tipe: 'Hybrid', exp: '3–5 tahun', gaji: 'Rp 10 – 18 jt', skill: ['Python', 'Big Data', 'ETL'], badge: 'Potensial', jenis: 'Full-time', kat: 'Data & AI', waktu: '5 hari lalu' },
  { id: 4, judul: 'Machine Learning Engineer (Mid)', pt: 'Gojek (PT GoTo Gojek Tokopedia)', logo: 'gojek', kota: 'Jakarta', tipe: 'Hybrid', exp: '3–5 tahun', gaji: 'Rp 15 – 25 jt', skill: ['Python', 'Machine Learning', 'Deep Learning', 'MLOps'], badge: 'Potensial', jenis: 'Full-time', kat: 'Data & AI', waktu: '1 minggu lalu' },
  { id: 5, judul: 'Business Intelligence Analyst', pt: 'PT Yanmar Diesel Indonesia', logo: 'yanmar', kota: 'Bekasi', tipe: 'Onsite', exp: '1–3 tahun', gaji: 'Rp 8 – 14 jt', skill: ['SQL', 'Power BI', 'Data Modeling', 'Reporting'], badge: 'Cocok untukmu', jenis: 'Full-time', kat: 'Data & AI', waktu: '1 minggu lalu' },
  { id: 6, judul: 'Magang Data Analyst', pt: 'Tokopedia', logo: 'tokped', kota: 'Jakarta', tipe: 'Remote', exp: 'Fresh graduate', gaji: 'Rp 3 – 4 jt', skill: ['Excel', 'SQL'], badge: 'Cocok untukmu', jenis: 'Magang/Internship', kat: 'Data & AI', waktu: '2 minggu lalu' },
  { id: 7, judul: 'Freelance Dashboard Developer', pt: 'Proyek lepas · Studio Contoh', logo: 'tokped', kota: 'Bandung', tipe: 'Remote', exp: '1–2 tahun', gaji: 'Rp 4 – 7 jt / proyek', skill: ['Power BI', 'Excel'], badge: 'Potensial', jenis: 'Freelance', kat: 'IT & Software', waktu: '3 minggu lalu' },
  { id: 8, judul: 'Staf Analisis Produksi (Kontrak)', pt: 'PT Yanmar Diesel Indonesia', logo: 'yanmar', kota: 'Bekasi', tipe: 'Onsite', exp: '0–2 tahun', gaji: 'Rp 6 – 8 jt', skill: ['Excel', 'Reporting'], badge: 'Cocok untukmu', jenis: 'Kontrak', kat: 'Engineering', waktu: '3 minggu lalu' },
];
const TAB = [['semua', 'Semua Lowongan', 'briefcase'], ['rek', 'Rekomendasi untukmu', 'spark'], ['pt', 'Perusahaan', 'store'], ['remote', 'Remote', 'globe'], ['magang', 'Magang/Entry Level', 'book'], ['freelance', 'Freelance', 'user'], ['kontrak', 'Kontrak', 'check'], ['saved', 'Saved', 'flag']];
const FILTER = {
  jenis: ['Full-time', 'Part-time', 'Kontrak', 'Freelance', 'Magang/Internship'],
  kota: ['Jakarta', 'Tangerang', 'Bekasi', 'Depok', 'Bandung'],
  tipe: ['Onsite', 'Hybrid', 'Remote'],
  kat: ['Data & AI', 'Engineering', 'IT & Software', 'Finance & Accounting', 'Business & Strategy'],
};
const WARNA_BADGE = { 'Sangat cocok': '#1F7A4D', 'Cocok untukmu': '#B77410', 'Potensial': '#C2502B' };

function Cek({ label, on, onPress }) {
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: on }} onPress={onPress} style={{ flexDirection: 'row', gap: 8, alignItems: 'center', minHeight: 26 }}>
      <View style={{ width: 16, height: 16, borderRadius: 4, borderWidth: 1.5, borderColor: on ? C.teal2 : C.line, backgroundColor: on ? C.teal2 : 'transparent', alignItems: 'center', justifyContent: 'center' }}>{on ? <Icon name="check" size={11} color="#fff" /> : null}</View>
      <T size={12} color={C.ink} style={{ flexShrink: 1 }}>{label}</T>
    </Pressable>
  );
}
const Chip = ({ t }) => <View style={{ backgroundColor: C.soft, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}><T size={10} color={C.teal2} numberOfLines={1}>{t}</T></View>;
const Meta = ({ t }) => <T size={11} color={C.muted}>{t}</T>;

function PanelFilter({ f, setF, reset }) {
  const tog = (g, v) => setF({ ...f, [g]: f[g].includes(v) ? f[g].filter((x) => x !== v) : [...f[g], v] });
  const Grup = ({ judul, g }) => (
    <View style={{ gap: 2 }}>
      <T w={800} size={12}>{judul}</T>
      {FILTER[g].map((v) => <Cek key={v} label={v} on={f[g].includes(v)} onPress={() => tog(g, v)} />)}
    </View>
  );
  return (
    <View style={{ ...kartu, padding: 12, gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <T w={800} size={14} style={{ flex: 1 }}>Filter</T>
        <Pressable accessibilityRole="button" onPress={reset}><T w={700} size={11} color={C.teal2}>Reset Semua</T></Pressable>
      </View>
      <Grup judul="Jenis Pekerjaan" g="jenis" />
      <Grup judul="Lokasi" g="kota" />
      <View style={{ gap: 6 }}>
        <T w={800} size={12}>Range Gaji (per bulan)</T>
        <View style={{ height: 4, borderRadius: 2, backgroundColor: C.teal2, marginVertical: 6 }} />
        <T size={11} color={C.muted}>Rp 3.000.000 – Rp 50.000.000+</T>
      </View>
      <Grup judul="Tipe Kerja" g="tipe" />
      <View style={{ gap: 4 }}>
        <T w={800} size={12}>Pengalaman</T>
        <View style={{ borderWidth: 1, borderColor: C.line, borderRadius: 8, minHeight: 34, paddingHorizontal: 10, justifyContent: 'center' }}><T size={11} color={C.muted}>Semua pengalaman</T></View>
      </View>
      <Grup judul="Kategori Pekerjaan" g="kat" />
    </View>
  );
}

function Logo({ k, size = 52 }) {
  return <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}><Image source={IMG[k]} resizeMode="contain" style={{ width: size, height: size }} /></View>;
}

export default function KerjaBaru({ go }) {
  const [tab, setTab] = useState('semua');
  const [f, setF] = useState({ jenis: [], kota: [], tipe: [], kat: [] });
  const [simpan, setSimpan] = useState({ 1: true, 2: true });
  const [lamar, setLamar] = useState({});
  const [lebar, setLebar] = useState(0);
  const [bukaFilter, setBukaFilter] = useState(false);
  const lebarLayar = lebar >= 740;
  const reset = () => setF({ jenis: [], kota: [], tipe: [], kat: [] });
  const lolos = (j) => (!f.jenis.length || f.jenis.includes(j.jenis)) && (!f.kota.length || f.kota.includes(j.kota)) && (!f.tipe.length || f.tipe.includes(j.tipe)) && (!f.kat.length || f.kat.includes(j.kat));
  const tabOk = (j) => tab === 'semua' || tab === 'pt' || (tab === 'rek' && j.badge !== 'Potensial') || (tab === 'remote' && j.tipe === 'Remote') || (tab === 'magang' && (j.jenis === 'Magang/Internship' || j.exp.startsWith('0') || j.exp === 'Fresh graduate')) || (tab === 'freelance' && j.jenis === 'Freelance') || (tab === 'kontrak' && j.jenis === 'Kontrak') || (tab === 'saved' && simpan[j.id]);
  const hasil = JOBS.filter((j) => lolos(j) && tabOk(j));
  const rek = JOBS.filter((j) => j.badge !== 'Potensial' || j.id < 4).slice(0, 3);
  const tg = (id) => setSimpan({ ...simpan, [id]: !simpan[id] });

  return (
    <Screen>
      <View style={{ gap: 12 }} onLayout={(e) => setLebar(e.nativeEvent.layout.width)}>
        {/* Banner */}
        <View style={{ ...kartu, aspectRatio: 946 / 220, minHeight: 170, justifyContent: 'center' }}>
          <Image source={IMG.hero} resizeMode="cover" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} />
          <View style={{ paddingLeft: 20, width: '50%', gap: 3 }}>
            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}><Icon name="briefcase" size={16} color="#fff" /><T w={700} size={13} color="#fff">Kerja</T></View>
            <T w={800} size={22} color="#fff" style={{ lineHeight: 27 }}>Temukan Pekerjaan{'\n'}yang Sesuai dengan Impianmu</T>
            <T size={11} color="#E6F0F3" numberOfLines={2} style={{ lineHeight: 15 }}>Lebih dari sekadar pekerjaan, bangun karier dan masa depanmu bersama perusahaan terpercaya di myCITA.</T>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
              {[['check', 'teal', 'Lowongan\nterpercaya'], ['spark', 'ungu', 'Rekomendasi\nberbasis AI'], ['bell', 'gold', 'Update real-time\ndari perusahaan'], ['chart', 'biru', 'Persiapan karier\nlebih terarah']].map(([ic, ak, tx]) => (
                <View key={tx} style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}><IkonBulat icon={ic} aksen={ak} size={24} /><T w={700} size={9} color="#fff" style={{ lineHeight: 12 }}>{tx}</T></View>
              ))}
            </View>
          </View>
        </View>

        {/* Tab */}
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
          {TAB.map(([k, l, ic]) => {
            const on = tab === k;
            return (
              <Pressable key={k} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => setTab(k)}
                style={{ flexDirection: 'row', gap: 5, alignItems: 'center', paddingHorizontal: 11, minHeight: 34, borderRadius: 10, backgroundColor: on ? C.teal2 : C.card, borderWidth: 1, borderColor: on ? C.teal2 : C.line }}>
                <Icon name={ic} size={14} color={on ? '#fff' : C.teal2} /><T w={on ? 800 : 600} size={11} color={on ? '#fff' : C.ink}>{l}</T>
              </Pressable>
            );
          })}
        </View>

        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
          {lebarLayar ? <View style={{ width: 190 }}><PanelFilter f={f} setF={setF} reset={reset} /></View> : null}
          <View style={{ flex: 1, minWidth: 0, gap: 12 }}>
            {/* Rekomendasi */}
            <View style={{ ...kartu, padding: 12, gap: 10, backgroundColor: C.soft }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <IkonBulat icon="check" aksen="teal" size={34} />
                <View style={{ flex: 1 }}><T w={800} size={14}>Rekomendasi Lowongan untukmu</T><T size={11} color={C.muted}>Berdasarkan profil, skill, dan minatmu</T></View>
                <Pressable accessibilityRole="button" onPress={() => setTab('rek')}><T w={700} size={11} color={C.teal2}>Lihat semua →</T></Pressable>
              </View>
              <View style={{ flexDirection: 'row', gap: 10, flexWrap: lebarLayar ? 'nowrap' : 'wrap' }}>
                {rek.map((j, i) => (
                  <View key={j.id} style={{ flex: 1, minWidth: 170, backgroundColor: C.card, borderRadius: 12, borderWidth: i === 0 ? 1.5 : 1, borderColor: i === 0 ? C.teal2 : C.line, padding: 10, gap: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Logo k={j.logo} size={40} />
                      <View style={{ flex: 1 }} />
                      <View style={{ backgroundColor: C.ground, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 }}><T w={700} size={9} color={WARNA_BADGE[j.badge]} numberOfLines={1}>{j.badge}</T></View>
                      <Pressable accessibilityRole="button" accessibilityLabel="Simpan" onPress={() => tg(j.id)}><Icon name="flag" size={16} color={simpan[j.id] ? C.teal2 : C.muted} /></Pressable>
                    </View>
                    <T w={800} size={13} numberOfLines={1}>{j.judul}</T>
                    <T size={11} color={C.muted} numberOfLines={1}>{j.pt}</T>
                    <Meta t={`${j.kota} · ${j.tipe}`} /><Meta t={j.gaji} />
                    <View style={{ flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>{j.skill.slice(0, 3).map((s) => <Chip key={s} t={s} />)}</View>
                  </View>
                ))}
              </View>
            </View>

            {/* Ringkasan + tombol filter */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <T size={12} style={{ flex: 1 }}><T w={800} size={12}>{hasil.length}</T> lowongan ditemukan</T>
              {!lebarLayar ? (
                <Pressable accessibilityRole="button" onPress={() => setBukaFilter(!bukaFilter)} style={{ paddingHorizontal: 12, minHeight: 32, borderRadius: 8, borderWidth: 1, borderColor: C.teal2, justifyContent: 'center' }}><T w={800} size={11} color={C.teal2}>Filter {bukaFilter ? '△' : '▽'}</T></Pressable>
              ) : null}
              <View style={{ borderWidth: 1, borderColor: C.line, borderRadius: 8, minHeight: 32, paddingHorizontal: 10, justifyContent: 'center' }}><T size={11} color={C.muted}>Urutkan: Paling relevan ▾</T></View>
            </View>
            {!lebarLayar && bukaFilter ? <PanelFilter f={f} setF={setF} reset={reset} /> : null}

            {/* Daftar */}
            {hasil.length === 0 ? <View style={{ ...kartu, padding: 16 }}><T size={12} color={C.muted}>Belum ada lowongan yang cocok dengan filter ini. Coba kurangi filter.</T></View> : hasil.map((j) => (
              <View key={j.id} style={{ ...kartu, padding: 12, flexDirection: 'row', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <Logo k={j.logo} size={56} />
                <View style={{ flex: 1, minWidth: 180, gap: 3 }}>
                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <T w={800} size={14} style={{ flexShrink: 1 }}>{j.judul}</T>
                    <T w={700} size={10} color={WARNA_BADGE[j.badge]}>✦ {j.badge}</T>
                  </View>
                  <T size={12} color={C.muted} numberOfLines={1}>{j.pt}</T>
                  <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}><Meta t={`⌖ ${j.kota}`} /><Meta t={j.tipe} /><Meta t={`◔ ${j.exp}`} /><Meta t={j.gaji} /></View>
                  <View style={{ flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>{j.skill.map((s) => <Chip key={s} t={s} />)}</View>
                </View>
                <View style={{ width: 110, gap: 6, alignItems: 'stretch' }}>
                  <T size={10} color={C.muted} style={{ textAlign: 'right' }}>{j.waktu}</T>
                  <Pressable accessibilityRole="button" onPress={() => tg(j.id)} style={{ minHeight: 32, borderRadius: 8, borderWidth: 1, borderColor: simpan[j.id] ? C.teal2 : C.line, alignItems: 'center', justifyContent: 'center' }}><T w={800} size={11} color={simpan[j.id] ? C.teal2 : C.ink}>{simpan[j.id] ? 'Tersimpan' : 'Simpan'}</T></Pressable>
                  <Pressable accessibilityRole="button" onPress={() => setLamar({ ...lamar, [j.id]: true })} style={{ minHeight: 34, borderRadius: 8, backgroundColor: lamar[j.id] ? C.line : C.teal2, alignItems: 'center', justifyContent: 'center' }}><T w={800} size={12} color={lamar[j.id] ? C.muted : '#fff'}>{lamar[j.id] ? 'Terkirim' : 'Lamar'}</T></Pressable>
                </View>
              </View>
            ))}
            <T size={11} color={C.muted}>Semua lowongan dan perusahaan di halaman ini adalah contoh untuk demo.</T>
          </View>
        </View>
      </View>
    </Screen>
  );
}

// ─── Panel kanan khusus halaman Kerja ─────────────────────────────────
function Judul({ teks, aksi, onPress }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <T w={800} size={14} style={{ flex: 1 }}>{teks}</T>
      {aksi ? <Pressable accessibilityRole="button" onPress={onPress}><T w={700} size={11} color={C.teal2}>{aksi} →</T></Pressable> : null}
    </View>
  );
}

export function PanelKananKerja({ go }) {
  const [ikuti, setIkuti] = useState({});
  const pt = [['PT Astra International', 'Otomotif · 2.1K followers', 'astra'], ['PT Bank Central Asia', 'Perbankan · 1.8K followers', 'bca'], ['Gojek (PT GoTo)', 'Teknologi · 2.5K followers', 'gojek'], ['PT Yanmar Diesel Indonesia', 'Manufaktur · 1.2K followers', 'yanmar'], ['Tokopedia', 'E-commerce · 3.4K followers', 'tokped']];
  const tren = [['Data Analyst', '3.2K lowongan'], ['Machine Learning Engineer', '2.1K lowongan'], ['Business Analyst', '1.8K lowongan'], ['Data Engineer', '1.6K lowongan'], ['Product Manager', '1.4K lowongan']];
  const siap = [['Review dan optimalkan CV', 'Dapatkan saran dari AI', 'ungu', 'edit'], ['Latihan interview', 'Simulasi dengan pertanyaan real', 'gold', 'chat'], ['Bangun portofolio', 'Tunjukkan proyek terbaikmu', 'teal', 'briefcase'], ['Ikuti kursus yang relevan', 'Tingkatkan skill sesuai tujuanmu', 'gold', 'book']];
  const tersimpan = [['Data Analyst', 'PT Astra International', 'Jakarta · Hybrid · Rp 8 – 12 jt', 'astra'], ['Junior Data Analyst', 'PT Bank Central Asia', 'Jakarta · Onsite · Rp 6 – 9 jt', 'bca']];
  return (
    <View style={{ gap: 12 }}>
      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Perusahaan yang Mungkin Kamu Suka" aksi="Lihat semua" onPress={() => go('koneksi')} />
        {pt.map(([n, w, lg]) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Logo k={lg} size={40} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={12} numberOfLines={1}>{n}</T><T size={10} color={C.muted} numberOfLines={1}>{w}</T></View>
            <Pressable accessibilityRole="button" onPress={() => setIkuti({ ...ikuti, [n]: !ikuti[n] })} style={{ paddingHorizontal: 12, minHeight: 30, borderRadius: 8, borderWidth: 1, borderColor: ikuti[n] ? C.line : C.teal2, justifyContent: 'center' }}><T w={800} size={11} color={ikuti[n] ? C.muted : C.teal2}>{ikuti[n] ? 'Mengikuti' : '+ Ikuti'}</T></Pressable>
          </View>
        ))}
      </View>

      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Tren Pekerjaan di Indonesia" aksi="Lihat semua" onPress={() => {}} />
        {tren.map(([n, w], i) => (
          <View key={n} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#1C6BA8', alignItems: 'center', justifyContent: 'center' }}><T w={800} size={11} color="#fff">{i + 1}</T></View>
            <T w={700} size={12} style={{ flex: 1 }} numberOfLines={1}>{n}</T>
            <T size={11} color={C.muted}>{w}</T>
          </View>
        ))}
      </View>

      <View style={{ ...kartu, padding: 14, gap: 10, overflow: 'hidden' }}>
        <Judul teks="Persiapan Karier" />
        <Image source={IMG.prep} resizeMode="cover" style={{ position: 'absolute', right: 0, bottom: 0, width: 92, height: 150, opacity: 0.95 }} />
        <View style={{ gap: 10, paddingRight: 70 }}>
          {siap.map(([a, b, ak, ic]) => (
            <View key={a} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <IkonBulat icon={ic === 'edit' ? 'edit' : ic} aksen={ak} size={34} />
              <View style={{ flex: 1 }}><T w={800} size={11} numberOfLines={2}>{a}</T><T size={10} color={C.muted} numberOfLines={2}>{b}</T></View>
            </View>
          ))}
        </View>
        <Pressable accessibilityRole="button" onPress={() => go('karirbisnis')} style={{ alignSelf: 'flex-start', paddingHorizontal: 14, minHeight: 38, borderRadius: 8, backgroundColor: '#0F4C47', justifyContent: 'center', marginTop: 4 }}><T w={800} size={12} color="#fff">Mulai Persiapan Karier →</T></Pressable>
      </View>

      <View style={{ ...kartu, padding: 14, gap: 10 }}>
        <Judul teks="Lowongan Tersimpan (12)" aksi="Lihat semua" onPress={() => {}} />
        {tersimpan.map(([a, b, c, lg]) => (
          <View key={a} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Logo k={lg} size={42} />
            <View style={{ flex: 1, minWidth: 0 }}><T w={800} size={12} numberOfLines={1}>{a}</T><T size={10} color={C.muted} numberOfLines={1}>{b}</T><T size={10} color={C.muted} numberOfLines={1}>{c}</T></View>
            <Icon name="flag" size={18} color={C.teal2} />
          </View>
        ))}
      </View>
    </View>
  );
}
