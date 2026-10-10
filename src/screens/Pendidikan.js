import React from 'react';
import { View } from 'react-native';
import { useApp } from '../state/AppContext';
import { Button, Card, Screen, ScreenHeader, T } from '../components/ui';
import Icon from '../components/Icon';
import { C } from '../theme';
import { rpShort } from '../utils/format';

// ── Jurusan data (from flow 5 output / fallback static) ───────────
const JURUSAN = [
  {
    nama: 'S1 Sistem Informasi',
    skor: 90,
    highlight: true,
    karier: 'Karier: Data Analyst, UI/UX, Software Engineer',
  },
  {
    nama: 'S1 Teknik Informatika / Ilmu Komputer',
    skor: 89,
    highlight: true,
    karier: 'Karier: Software Engineer, Data Scientist',
  },
  {
    nama: 'S1 Sains Data / Statistika',
    skor: 66,
    highlight: false,
    karier: 'Karier: Data Scientist, Data Analyst',
  },
  {
    nama: 'S1 Desain Komunikasi Visual',
    skor: 60,
    highlight: false,
    karier: 'Karier: UI/UX Designer, Creative Director',
  },
];

// Kampus data matches design section dini/Pendidikan
const KAMPUS_NASIONAL = [
  { qs: '189', nama: 'Universitas Indonesia', jurusan: 'Ilmu Komputer · Sistem Informasi', kota: 'Depok', tipe: 'PTN', biaya: 'UKT Rp0,5–17,5 jt' },
  { qs: '224', nama: 'Universitas Gadjah Mada', jurusan: 'Ilmu Komputer · Teknologi Informasi', kota: 'Yogyakarta', tipe: 'PTN', biaya: 'UKT Rp0–13,3 jt' },
  { qs: '255', nama: 'Institut Teknologi Bandung', jurusan: 'Teknik Informatika · Sistem Informasi', kota: 'Bandung', tipe: 'PTN', biaya: 'UKT Rp0–12,5 jt' },
  { qs: '515', nama: 'Universitas Padjadjaran', jurusan: 'Sistem Informasi · Ilmu Komputer', kota: 'Bandung', tipe: 'PTN', biaya: 'UKT Rp0–8 jt' },
  { qs: '801–1000', nama: 'ITS Surabaya', jurusan: 'Informatika · Sistem Informasi', kota: 'Surabaya', tipe: 'PTN', biaya: 'UKT Rp0–10 jt' },
  { qs: '1001–1200', nama: 'Telkom University', jurusan: 'Teknik Informatika · Sistem Informasi', kota: 'Bandung', tipe: 'PTS', biaya: 'SPP Rp15–23 jt/semester' },
  { qs: '1201–1400', nama: 'Universitas Pendidikan Indonesia', jurusan: 'Ilmu Komputer · Pendidikan Teknik', kota: 'Bandung', tipe: 'PTN', biaya: 'UKT Rp0–7 jt' },
];

const KOTA_USER = 'Bandung';
const KAMPUS_LOKAL = KAMPUS_NASIONAL.filter((k) => k.kota === KOTA_USER);

const JALUR_MASUK = [
  'SNBP: berdasarkan nilai rapor dan prestasi (lomba teknologi-mu bisa membantu)',
  'SNBT: berdasarkan skor UTBK, daftar sekitar Maret–April',
  'Seleksi mandiri kampus, biasanya ada uang pangkal (IPI)',
];

export default function Pendidikan({ go }) {
  const app = useApp();
  const analisis = app.analysis;
  const tabungan = analisis?.dana_darurat?.dana_likuid_saat_ini || 2500000;
  const menabung = 150000;
  const bulanLagi = 6;
  const proyeksi = tabungan + menabung * bulanLagi;

  return (
    <Screen>
      <ScreenHeader title="Jurusan & kampus" onBack={() => go('karier')} />

      {/* Jurusan yang cocok */}
      <Card style={{ gap: 12 }}>
        <T w={800} size={15}>Jurusan yang cocok</T>
        {JURUSAN.map((j) => (
          <View key={j.nama} style={{ gap: 4 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
              <T size={13} w={j.highlight ? 800 : 600} style={{ flex: 1 }}>{j.nama}</T>
              <T size={14} w={800} color={j.highlight ? C.teal : C.muted}>{j.skor}</T>
            </View>
            <View style={{ height: 8, borderRadius: 999, backgroundColor: C.soft, overflow: 'hidden' }}>
              <View style={{ width: `${j.skor}%`, height: 8, borderRadius: 999, backgroundColor: j.highlight ? C.teal : '#B8C9C5' }} />
            </View>
            <T size={11} color={C.muted} style={{ lineHeight: 16 }}>{j.karier}</T>
          </View>
        ))}
      </Card>

      {/* Kampus nasional */}
      <Card style={{ gap: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <T w={800} size={15} style={{ flex: 1 }}>Kampus untuk SI & Informatika</T>
          <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: C.soft }}>
            <T size={12} w={700} color={C.teal}>{KAMPUS_NASIONAL.length} kampus</T>
          </View>
        </View>
        {KAMPUS_NASIONAL.map((k, i) => (
          <View key={k.nama} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start', paddingVertical: 10, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: C.line }}>
            <View style={{ width: 42, flexShrink: 0, alignItems: 'center' }}>
              <T size={10} color={C.muted}>QS</T>
              <T size={12} w={800} color={C.teal}>{k.qs}</T>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <T size={13} w={700}>{k.nama}</T>
              <T size={11} color={C.muted}>{k.jurusan}</T>
              <T size={11} color={C.muted}>{k.kota} · {k.tipe} · {k.biaya}</T>
            </View>
          </View>
        ))}
      </Card>

      {/* Kampus di kota pengguna */}
      {KAMPUS_LOKAL.length > 0 && (
        <Card style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <T w={800} size={15} style={{ flex: 1 }}>Kampus di {KOTA_USER}</T>
            <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: C.goldSoft }}>
              <T size={12} w={700} color={C.warn}>Dekat rumah</T>
            </View>
          </View>
          {KAMPUS_LOKAL.map((k) => (
            <View key={k.nama} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
              <T size={13} color={C.muted} style={{ flex: 1 }}>{k.nama}</T>
              <T size={13} w={700} style={{ textAlign: 'right' }}>QS {k.qs} · {k.tipe}</T>
            </View>
          ))}
          <T size={11} color={C.muted} style={{ lineHeight: 16 }}>Kuliah dekat rumah bisa menghemat biaya kos dan hidup.</T>
        </Card>
      )}

      {/* Jalur masuk */}
      <Card style={{ gap: 10 }}>
        <T w={800} size={15}>Jalur masuk</T>
        {JALUR_MASUK.map((j) => (
          <View key={j} style={{ flexDirection: 'row', gap: 8 }}>
            <Icon name="check" size={16} color={C.teal} />
            <T size={13} style={{ flex: 1, lineHeight: 20 }}>{j}</T>
          </View>
        ))}
      </Card>

      {/* Kesiapan dana */}
      <Card style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <T w={800} size={15} style={{ flex: 1 }}>Kesiapan dana</T>
          <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: C.warnSoft }}>
            <T size={12} w={700} color={C.warn}>Cek beasiswa</T>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
          <T size={13} color={C.muted}>Tabungan sekarang</T>
          <T size={13} w={700} style={{ textAlign: 'right' }}>{rpShort(tabungan)}</T>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
          <T size={13} color={C.muted}>Menabung rutin</T>
          <T size={13} w={700} style={{ textAlign: 'right' }}>{rpShort(menabung)}/bulan</T>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
          <T size={13} color={C.muted}>Perkiraan saat masuk kuliah ({bulanLagi} bulan lagi)</T>
          <T size={13} w={800} color={C.teal} style={{ textAlign: 'right' }}>±{rpShort(proyeksi)}</T>
        </View>
        <T size={11} color={C.muted} style={{ lineHeight: 16 }}>UKT PTN ditentukan dari kemampuan ekonomi keluarga, mulai Rp0–0,5 jt untuk golongan terendah. Cek juga KIP Kuliah dan beasiswa kampus.</T>
      </Card>

      {/* Alternatif hemat */}
      <Card style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <T w={800} size={15} style={{ flex: 1 }}>Alternatif hemat</T>
          <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: C.ground }}>
            <T size={12} w={700} color={C.muted}>Opsional</T>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
          <T size={13} color={C.muted} style={{ flex: 1 }}>Universitas Terbuka · S1 Sistem Informasi</T>
          <T size={13} w={700} style={{ textAlign: 'right' }}>Rp1,8 jt/semester</T>
        </View>
        <T size={11} color={C.muted} style={{ lineHeight: 16 }}>Kuliah daring, bisa sambil bekerja paruh waktu.</T>
      </Card>

      <Button label="Lihat roadmap" icon="route" onPress={() => go('roadmap')} />
    </Screen>
  );
}
