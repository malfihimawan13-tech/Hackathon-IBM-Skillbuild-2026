import React, { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Icon from './Icon';
import { AKSEN } from './Visual';
import { FOTO_REKO, HERO } from './foto';
import { Bar, Card, FadeIn, T } from './ui';
import { C } from '../theme';

const rupiah = (n) => 'Rp ' + Math.round(Number(n) || 0).toLocaleString('id-ID');

// ─── Baris atas: sapaan + My Journey berdampingan (seperti desain) ───────────
const JOURNEY = {
  budi: { judul: 'Menjadi Data Scientist', langkah: [['Belajar', 'Python'], ['Kuasai', 'Data Analysis'], ['Bangun', 'Portofolio'], ['Dapatkan', 'Pekerjaan']], status: ['selesai', 'jalan', 'belum', 'belum'], hdr: 2, tgl: ['Jan 2024', 'Mar 2024', '', ''] },
  agus: { judul: 'Menuju Rumah Impian', langkah: [['Catat Keuangan', 'Usaha'], ['Rapikan', 'Pembukuan'], ['Bangun', 'Dana Darurat'], ['Siapkan', 'Uang Muka']], status: ['selesai', 'jalan', 'belum', 'belum'], hdr: 1, tgl: ['', '', '', ''] },
  dini: { judul: 'Memilih Jurusan Kuliah', langkah: [['Kenali Minat', '& Bakat'], ['Pilih', 'Jurusan'], ['Cari Beasiswa', '& UKT'], ['Daftar', 'Kampus']], status: ['selesai', 'jalan', 'belum', 'belum'], hdr: 1, tgl: ['', '', '', ''] },
};
const JOURNEY_UMUM = { judul: 'Merintis Arah Masa Depan', langkah: [['Isi', 'Profil'], ['Isi', 'Keuangan'], ['Pilih', 'Tujuan'], ['Susun', 'Roadmap']], status: ['jalan', 'belum', 'belum', 'belum'], hdr: 0, tgl: ['', '', '', ''] };
export const journeyUser = (uid) => JOURNEY[uid] || JOURNEY_UMUM;

// Posisi kartu langkah pada gambar pemandangan (kotak 506 x 224), diukur dari desain.
const JW = 506; const JH = 224;
const KARTU = [
  { x: 64, y: 163, w: 74, h: 61, cx: 65, cy: 161 },
  { x: 177, y: 147, w: 114, h: 65, cx: 193, cy: 157 },
  { x: 306, y: 159, w: 95, h: 53, cx: 321, cy: 166 },
  { x: 414, y: 158, w: 89, h: 54, cx: 428, cy: 165 },
];
const pctX = (v) => `${(v / JW) * 100}%`;
const pctY = (v) => `${(v / JH) * 100}%`;

export function BarisAtas({ uid, nama, go }) {
  const [w, setW] = useState(780);
  const [hh, setHh] = useState(0);
  const j = journeyUser(uid);
  const pct = Math.round((j.hdr / 4) * 100);
  const sempit = w < 640;
  const sk = Math.max(0.78, Math.min(1.15, (sempit ? w : w * 0.57) / JW));
  return (
    <FadeIn>
      <View onLayout={(e) => setW(e.nativeEvent.layout.width)} style={{ flexDirection: sempit ? 'column' : 'row', gap: 12 }}>
        {/* Sapaan */}
        <View onLayout={(e) => setHh(e.nativeEvent.layout.height)} style={{ flex: sempit ? undefined : 0.43, minHeight: sempit ? 200 : undefined, borderRadius: 16, overflow: 'hidden', backgroundColor: '#0C5A5C' }}>
          {hh > 0 ? <Image source={HERO[uid] || HERO.budi} resizeMode="cover" style={{ position: 'absolute', right: 0, top: 0, height: hh, width: hh * (397 / 220) }} /> : null}
          <View style={{ padding: 16, paddingRight: 0, width: sempit ? '58%' : '54%', gap: 4, justifyContent: 'center', flex: 1 }}>
            <T w={600} size={12} color="#FFFFFF">Selamat datang kembali,</T>
            <T w={800} size={21} color="#FFFFFF" style={{ letterSpacing: -0.3, lineHeight: 27 }}>{nama}! 👋</T>
            <T size={11} color="rgba(255,255,255,0.92)" style={{ lineHeight: 16, marginTop: 2 }}>Terus melangkah menuju tujuanmu. Setiap langkah kecil hari ini, membawa kamu lebih dekat ke masa depan yang kamu impikan.</T>
            <Pressable accessibilityRole="button" onPress={() => go('profil')}
              style={{ alignSelf: 'flex-start', marginTop: 8, flexDirection: 'row', gap: 6, alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 14, minHeight: 34, borderRadius: 10 }}>
              <T w={800} size={12} color="#0F4C47">Lihat Profil</T><T w={800} size={12} color="#0F4C47">→</T>
            </Pressable>
          </View>
        </View>

        {/* My Journey */}
        <View style={{ flex: sempit ? undefined : 0.57, aspectRatio: JW / JH, borderRadius: 16, overflow: 'hidden', backgroundColor: '#EAF4F8', borderWidth: 1, borderColor: C.line }}>
          <Image source={uid === 'dini' ? require('../assets/beranda/journey_dini.jpg') : require('../assets/beranda/journey_bg.jpg')} resizeMode="cover" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} />
          <View style={{ position: 'absolute', left: pctX(14), top: pctY(10) }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <Icon name="spark" size={20 * sk} color="#F2A93B" />
              <View>
                <T w={800} size={15 * sk} color="#14213D" style={{ lineHeight: 19 * sk }}>My Roadmap</T>
                <T w={500} size={11 * sk} color="#14213D" style={{ lineHeight: 15 * sk }}>{j.judul}</T>
              </View>
            </View>
          </View>
          <View style={{ position: 'absolute', right: pctX(14), top: pctY(10), alignItems: 'flex-end', gap: 3 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <T size={9.5 * sk} color="#14213D" style={{ lineHeight: 13 * sk }}><T w={800} size={11 * sk} color="#0E7A55">{j.hdr}</T> dari 4 langkah selesai</T>
              <View style={{ width: 64 * sk, height: 6, borderRadius: 3, backgroundColor: 'rgba(20,33,61,0.12)', overflow: 'hidden' }}><View style={{ width: `${pct}%`, height: 6, backgroundColor: '#0E7A55' }} /></View>
              <T w={700} size={10 * sk} color="#14213D">{pct}%</T>
            </View>
            <Pressable accessibilityRole="button" onPress={() => go('roadmap')}><T w={800} size={10 * sk} color="#0E7A55">Lihat detail →</T></Pressable>
          </View>
          {KARTU.map((k, i) => {
            const st = j.status[i];
            const warna = st === 'selesai' ? '#12A15F' : st === 'jalan' ? '#F5A100' : '#6B7285';
            const d = 30 * sk;
            return (
              <React.Fragment key={i}>
                <View style={{ position: 'absolute', left: pctX(k.x), top: pctY(k.y), width: pctX(k.w), height: pctY(k.h), borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.93)', borderWidth: st === 'jalan' ? 1.5 : 0, borderColor: '#F5A100', paddingLeft: i === 0 ? 6 : (k.cx - k.x + 17) * sk, paddingTop: i === 0 ? 13 * sk : 7 * sk, paddingRight: 2, overflow: 'hidden' }}>
                  <T w={800} size={8.5 * sk} color="#14213D" style={{ lineHeight: 11 * sk }}>{j.langkah[i][0]}</T>
                  <T w={800} size={8.5 * sk} color="#14213D" style={{ lineHeight: 11 * sk }}>{j.langkah[i][1]}</T>
                  <T w={600} size={8 * sk} color={st === 'selesai' ? '#0E7A55' : st === 'jalan' ? '#0E7A55' : '#55625F'} style={{ lineHeight: 11 * sk, marginTop: 1 }}>{st === 'selesai' ? '✓ Selesai' : st === 'jalan' ? '✓ Sedang berjalan' : 'Belum mulai'}</T>
                  {j.tgl[i] ? <T w={600} size={8 * sk} color={st === 'jalan' ? '#E58A00' : '#55625F'} style={{ lineHeight: 11 * sk }}>{j.tgl[i]}</T> : null}
                </View>
                <View style={{ position: 'absolute', left: pctX(k.cx - 15), top: pctY(k.cy - 15), width: d, height: d, borderRadius: d / 2, backgroundColor: warna, borderWidth: 2.5, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
                  {st === 'selesai' ? <Icon name="check" size={d * 0.6} color="#FFFFFF" strokeWidth={3} /> : <T w={800} size={d * 0.5} color="#FFFFFF" style={{ lineHeight: d * 0.62 }}>{i + 1}</T>}
                </View>
              </React.Fragment>
            );
          })}
        </View>
      </View>
    </FadeIn>
  );
}

// ─── Empat kartu ringkas ─────────────────────────────────────────────────
const PELUANG = { budi: ['5 lowongan cocok', '2 freelance · 3 kerja', 'karier'], agus: ['3 peluang usaha', '2 pelatihan · 1 pendampingan', 'usaha'], dini: ['4 program cocok', '2 beasiswa · 2 kampus', 'pendidikan'] };

export function BarisStat({ uid, persona, analysis, go }) {
  const [w, setW] = useState(800);
  const j = journeyUser(uid);
  const skills = persona?.skills || [];
  const sisa = analysis?.dashboard?.sisa;
  const pel = PELUANG[uid] || ['Jelajahi peluang', 'Karier & usaha', 'karirbisnis'];
  const kartu = [
    { ikon: 'route', aksen: 'biru', judul: 'My Roadmap', besar: null, baris: [`${j.hdr} dari 4 langkah selesai`], bar: j.hdr / 4, tautan: 'Lihat detail', ke: 'roadmap' },
    { ikon: 'user', aksen: 'ungu', judul: 'My Skill', besar: skills.length ? `${skills.length} skill utama` : 'Belum ada skill', baris: [skills.slice(0, 4).map((x) => x.nama).join(', ') || 'Lengkapi profilmu'], tautan: 'Lihat rekomendasi', ke: 'karirbisnis' },
    { ikon: 'wallet', aksen: 'teal', judul: 'My Keuangan', besar: sisa != null ? rupiah(sisa) : 'Belum ada data', baris: ['Kemampuan menabung/bulan'], tautan: 'Lihat detail', ke: 'keuangan' },
    { ikon: 'briefcase', aksen: 'coral', judul: 'Peluang Untukmu', besar: pel[0], baris: [pel[1]], tautan: 'Lihat peluang', ke: pel[2] },
  ];
  const dua = w < 620;
  return (
    <View onLayout={(e) => setW(e.nativeEvent.layout.width)} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
      {kartu.map((k, i) => {
        const a = AKSEN[k.aksen];
        return (
          <FadeIn key={k.judul} delay={90 + i * 40} style={{ width: dua ? '48%' : '23.6%', flexGrow: 1 }}>
            <Pressable accessibilityRole="button" onPress={() => go(k.ke)}
              style={({ hovered }) => ({ backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.line, padding: 12, gap: 6, minHeight: 124, opacity: hovered ? 0.95 : 1 })}>
              <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: a.bg, alignItems: 'center', justifyContent: 'center' }}><Icon name={k.ikon} size={20} color={a.fg} /></View>
                <View style={{ flex: 1 }}>
                  <T w={800} size={12} numberOfLines={1}>{k.judul}</T>
                  {k.besar ? <T w={700} size={12} numberOfLines={1} color={C.ink}>{k.besar}</T> : null}
                </View>
              </View>
              {k.baris.map((b) => <T key={b} size={11} color={C.muted} numberOfLines={2}>{b}</T>)}
              {k.bar != null ? <Bar ratio={k.bar} color={C.teal2} height={6} /> : null}
              <T w={700} size={11} color={C.teal2} style={{ marginTop: 'auto' }}>{k.tautan} →</T>
            </Pressable>
          </FadeIn>
        );
      })}
    </View>
  );
}

// ─── Rekomendasi ─────────────────────────────────────────────────────────
const REKO = {
  budi: [
    { kat: 'belajar', badge: 'Kursus', ikon: 'book', aksen: 'teal', judul: 'Python untuk Data Analyst (Pemula)', meta: 'Dicoding · ★ 4.8 (12.4K)', tombol: 'Ikuti Kelas', ke: 'pendidikan' },
    { kat: 'karier', badge: 'Lowongan', ikon: 'briefcase', aksen: 'biru', judul: 'Junior Data Analyst', meta: 'PT XYZ Indonesia · Jakarta · Hybrid', tombol: 'Lihat Detail', ke: 'karier' },
    { kat: 'komunitas', badge: 'Komunitas', ikon: 'users', aksen: 'ungu', judul: 'Komunitas Data Analyst Indonesia', meta: '12.4K anggota', tombol: 'Gabung', ke: 'komunitas', p: { tab: 'grup' } },
    { kat: 'mentor', badge: 'Mentor', ikon: 'user', aksen: 'gold', judul: 'Dewi K. · Data Scientist', meta: 'Mentor jalur kariermu (akun contoh)', tombol: 'Terhubung', ke: 'koneksi' },
    { kat: 'sertifikasi', badge: 'Sertifikasi', ikon: 'check', aksen: 'coral', judul: 'Sertifikasi Analis Data', meta: 'Sesuai jalur kariermu', tombol: 'Lihat Detail', ke: 'sertifikasi' },
  ],
  agus: [
    { kat: 'belajar', badge: 'Kursus', ikon: 'book', aksen: 'teal', judul: 'Pembukuan Usaha Kecil untuk Pemula', meta: 'Materi gratis · tingkat dasar', tombol: 'Ikuti Kelas', ke: 'pendidikan' },
    { kat: 'karier', badge: 'Peluang Usaha', ikon: 'store', aksen: 'gold', judul: 'Optimalkan usaha kelontong keluarga', meta: 'Simulasi modal dan balik modal', tombol: 'Lihat Detail', ke: 'usaha' },
    { kat: 'komunitas', badge: 'Komunitas', ikon: 'users', aksen: 'ungu', judul: 'Komunitas Pelaku Usaha Mikro', meta: 'Grup belajar usaha (contoh)', tombol: 'Gabung', ke: 'komunitas', p: { tab: 'grup' } },
    { kat: 'mentor', badge: 'Mentor', ikon: 'user', aksen: 'gold', judul: 'Nadia P. · Pemilik usaha kopi', meta: 'Berbagi pengalaman usaha (akun contoh)', tombol: 'Terhubung', ke: 'koneksi' },
    { kat: 'sertifikasi', badge: 'Sertifikasi', ikon: 'check', aksen: 'coral', judul: 'Sertifikasi Pembukuan Usaha Kecil', meta: 'Sesuai bidang usahamu', tombol: 'Lihat Detail', ke: 'sertifikasi' },
  ],
  dini: [
    { kat: 'belajar', badge: 'Belajar', ikon: 'book', aksen: 'teal', judul: 'Mengenal Jurusan Kuliah', meta: 'Panduan memilih jurusan', tombol: 'Pelajari', ke: 'pendidikan' },
    { kat: 'karier', badge: 'Karier', ikon: 'briefcase', aksen: 'biru', judul: 'Pilihan Karier Setelah Lulus', meta: 'Sesuai minat dan nilaimu', tombol: 'Lihat Detail', ke: 'karirbisnis' },
    { kat: 'komunitas', badge: 'Komunitas', ikon: 'users', aksen: 'ungu', judul: 'Grup Belajar Kelas 3 SMA', meta: 'Perlu persetujuan orang tua/sekolah', tombol: 'Lihat', ke: 'komunitas', p: { tab: 'grup' } },
    { kat: 'mentor', badge: 'Mentor', ikon: 'user', aksen: 'gold', judul: 'Ratna D. · Guru SMA', meta: 'Mentor belajar (akun contoh)', tombol: 'Terhubung', ke: 'koneksi' },
    { kat: 'sertifikasi', badge: 'Sertifikasi', ikon: 'check', aksen: 'coral', judul: 'Sertifikasi Dasar Komputer', meta: 'Untuk bekal kuliah', tombol: 'Lihat Detail', ke: 'sertifikasi' },
  ],
};
const fotoReko = (x, uid) => (/Jurusan/.test(x.judul || '') ? FOTO_REKO.jurusan : x.kat === 'belajar' && uid !== 'budi' ? FOTO_REKO.belajarUmum : FOTO_REKO[x.kat]);
const TAB = [['semua', 'Semua'], ['belajar', 'Belajar'], ['karier', 'Karier'], ['komunitas', 'Komunitas'], ['mentor', 'Mentor'], ['sertifikasi', 'Sertifikasi']];

export function Bookmark({ size = 17, color = '#14211F', isi = false }) {
  return (<Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M6 3h12v18l-6-4.5L6 21z" stroke={color} strokeWidth="2" strokeLinejoin="round" fill={isi ? color : 'none'} /></Svg>);
}

export function Rekomendasi({ uid, go }) {
  const [tab, setTab] = useState('semua');
  const [w, setW] = useState(800);
  const semua = REKO[uid] || REKO.budi;
  const daftar = tab === 'semua' ? semua.slice(0, 3) : semua.filter((x) => x.kat === tab);
  const tiga = w >= 600;
  return (
    <FadeIn delay={120}>
      <Card style={{ padding: 16, gap: 12, borderRadius: 18 }}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <Icon name="spark" size={24} color={C.gold} />
          <View style={{ flex: 1 }}>
            <T w={800} size={16}>Rekomendasi dari myCITA untuk kamu</T>
            <T size={12} color={C.muted}>Berdasarkan profil, minat, dan tujuanmu</T>
          </View>
          <Pressable accessibilityRole="button" onPress={() => go('karirbisnis')}><T w={700} size={12} color={C.teal2}>Lihat semua →</T></Pressable>
        </View>
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }} accessibilityRole="tablist">
          {TAB.map(([k, l]) => {
            const on = tab === k;
            return (
              <Pressable key={k} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => setTab(k)}
                style={{ paddingHorizontal: 16, minHeight: 34, borderRadius: 17, justifyContent: 'center', backgroundColor: on ? C.teal : C.ground, borderWidth: 1, borderColor: on ? C.teal : C.line }}>
                <T w={on ? 800 : 600} size={12} color={on ? '#FFFFFF' : C.ink}>{l}</T>
              </Pressable>
            );
          })}
        </View>
        <View onLayout={(e) => setW(e.nativeEvent.layout.width)} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {daftar.map((x) => {
            const a = AKSEN[x.aksen];
            return (
              <View key={x.judul} style={{ width: tiga ? '31.6%' : '100%', flexGrow: 1, minWidth: 190, backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.line, overflow: 'hidden' }}>
                {fotoReko(x, uid) ? (
                  <View style={{ height: 96, backgroundColor: a.bg }}>
                    <Image source={fotoReko(x, uid)} resizeMode="cover" style={{ width: '100%', height: 96 }} />
                  </View>
                ) : (
                  <View style={{ height: 96, backgroundColor: a.bg, alignItems: 'center', justifyContent: 'center' }}><Icon name={x.ikon} size={44} color={a.fg} /></View>
                )}
                <View style={{ position: 'absolute', left: 10, top: 10, flexDirection: 'row', gap: 5, alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 9, minHeight: 26, borderRadius: 13 }}>
                  <Icon name={x.ikon} size={12} color={a.fg} /><T w={700} size={11} color="#14211F">{x.badge}</T>
                </View>
                <View style={{ position: 'absolute', right: 8, top: 8, width: 32, height: 32, borderRadius: 9, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}><Bookmark /></View>
                <View style={{ padding: 12, gap: 4 }}>
                  <T w={800} size={13} numberOfLines={2} style={{ minHeight: 36 }}>{x.judul}</T>
                  <T size={11} color={C.muted} numberOfLines={2} style={{ minHeight: 30 }}>{x.meta}</T>
                  <Pressable accessibilityRole="button" onPress={() => go(x.ke, x.p || null)}
                    style={({ hovered }) => ({ marginTop: 6, minHeight: 36, borderRadius: 8, borderWidth: 1.5, borderColor: C.teal2, alignItems: 'center', justifyContent: 'center', backgroundColor: hovered ? C.soft : 'transparent' })}>
                    <T w={800} size={12} color={C.teal2}>{x.tombol}</T>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
        <T size={10} color={C.muted}>Rekomendasi contoh untuk demo, disusun dari profil dan roadmap.</T>
      </Card>
    </FadeIn>
  );
}
