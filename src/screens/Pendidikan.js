import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useApp } from '../state/AppContext';
import { Button, Card, Screen, ScreenHeader, T } from '../components/ui';
import Icon from '../components/Icon';
import { C } from '../theme';
import { rpShort } from '../utils/format';

const JALUR_MASUK = [
  'SNBP: berdasarkan nilai rapor dan prestasi (lomba teknologi-mu bisa membantu)',
  'SNBT: berdasarkan skor UTBK, daftar sekitar Maret–April',
  'Seleksi mandiri kampus, biasanya ada uang pangkal (IPI)',
];

// Konversi qs_2026 ke angka untuk pengurutan; non-numerik = besar
function qsToNum(qs) {
  if (!qs || qs === '-') return 9999;
  const m = String(qs).match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : 9999;
}

// Buat label biaya dari kampus object
function biayaLabel(k) {
  if (k.biaya_min == null && k.biaya_max == null) return null;
  const satuan = k.satuan || '';
  if (k.biaya_min != null && k.biaya_max != null) {
    return `${k.satuan?.includes('BPP') ? 'BPP' : k.satuan?.includes('UKT') ? 'UKT' : ''} ${rpShort(k.biaya_min)}–${rpShort(k.biaya_max)}/${satuan.includes('semester') ? 'smt' : 'bln'}`.trim();
  }
  if (k.biaya_max != null) return `s/d ${rpShort(k.biaya_max)}/${satuan.includes('semester') ? 'smt' : 'bln'}`;
  return null;
}

export default function Pendidikan({ go }) {
  const app = useApp();
  const karier = app.karier;
  const analisis = app.analysis;

  // Jurusan dari rekomendasi_jurusan flow 5 (2 teratas)
  const jurusanList = useMemo(() => {
    const raw = karier?.hasil?.rekomendasi_jurusan || [];
    return raw.slice(0, 2);
  }, [karier]);

  // Kampus: gabungkan kampus dari dua jurusan teratas, deduplicate by nama, filter biaya null, sort QS
  const kampusNasional = useMemo(() => {
    const seen = new Set();
    const all = [];
    for (const j of jurusanList) {
      for (const k of (j.kampus || [])) {
        if (!seen.has(k.nama)) {
          // Sembunyikan jika biaya_min AND biaya_max keduanya null
          if (k.biaya_min == null && k.biaya_max == null) continue;
          seen.add(k.nama);
          all.push(k);
        }
      }
    }
    return all.sort((a, b) => qsToNum(a.qs_2026) - qsToNum(b.qs_2026));
  }, [jurusanList]);

  // Kampus di kota pengguna (Bandung): dari kampus nasional + tambah yang biaya null tapi di_kota_pengguna
  const kotaUser = 'Bandung';
  const kampusLokal = useMemo(() => {
    // Ambil semua kampus di kota pengguna (termasuk yang biaya null) dari semua jurusan
    const seen = new Set();
    const all = [];
    for (const j of jurusanList) {
      for (const k of (j.kampus || [])) {
        if (k.di_kota_pengguna && !seen.has(k.nama)) {
          seen.add(k.nama);
          all.push(k);
        }
      }
    }
    return all.sort((a, b) => qsToNum(a.qs_2026) - qsToNum(b.qs_2026));
  }, [jurusanList]);

  // Data keuangan dari flow 4
  const tabungan = analisis?.dana_darurat?.dana_likuid_saat_ini ?? null;
  const menabung = analisis?.alokasi_bulan_ini?.kapasitas_menabung ?? null;
  const bulanLagi = 6;
  const proyeksi = (tabungan != null && menabung != null) ? tabungan + menabung * bulanLagi : null;

  return (
    <Screen>
      <ScreenHeader title="Jurusan & kampus" onBack={() => go('karier')} />

      {/* Jurusan yang cocok */}
      <Card style={{ gap: 12 }}>
        <T w={800} size={15}>Jurusan yang cocok</T>
        {jurusanList.length === 0 && (
          <T size={13} color={C.muted}>Data jurusan belum tersedia. Muat ulang layar Karier.</T>
        )}
        {jurusanList.map((j, idx) => {
          const highlight = idx < 2;
          return (
            <View key={j.id || j.jurusan} style={{ gap: 4 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                <T size={13} w={highlight ? 800 : 600} style={{ flex: 1 }}>{j.jurusan}</T>
                <T size={14} w={800} color={highlight ? C.teal : C.muted}>{j.skor_kecocokan}</T>
              </View>
              <View style={{ height: 8, borderRadius: 999, backgroundColor: C.soft, overflow: 'hidden' }}>
                <View style={{ width: `${j.skor_kecocokan}%`, height: 8, borderRadius: 999, backgroundColor: highlight ? C.teal : '#B8C9C5' }} />
              </View>
              {j.karier_terkait?.length > 0 && (
                <T size={11} color={C.muted} style={{ lineHeight: 16 }}>Karier: {j.karier_terkait.join(', ')}</T>
              )}
            </View>
          );
        })}
      </Card>

      {/* Kampus nasional */}
      {kampusNasional.length > 0 && (
        <Card style={{ gap: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <T w={800} size={15} style={{ flex: 1 }}>Kampus untuk SI & Informatika</T>
            <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: C.soft }}>
              <T size={12} w={700} color={C.teal}>{kampusNasional.length} kampus</T>
            </View>
          </View>
          {kampusNasional.map((k, i) => {
            const bLabel = biayaLabel(k);
            return (
              <View key={k.nama} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start', paddingVertical: 10, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: C.line }}>
                <View style={{ width: 42, flexShrink: 0, alignItems: 'center' }}>
                  <T size={10} color={C.muted}>QS</T>
                  <T size={12} w={800} color={C.teal}>{k.qs_2026 === '-' ? '–' : k.qs_2026}</T>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <T size={13} w={700}>{k.nama}</T>
                  <T size={11} color={C.muted}>{(k.prodi || []).join(' · ')}</T>
                  <T size={11} color={C.muted}>{k.kota} · {k.jenis}{bLabel ? ` · ${bLabel}` : ''}</T>
                </View>
              </View>
            );
          })}
        </Card>
      )}

      {/* Kampus di kota pengguna */}
      {kampusLokal.length > 0 && (
        <Card style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <T w={800} size={15} style={{ flex: 1 }}>Kampus di {kotaUser}</T>
            <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: C.goldSoft }}>
              <T size={12} w={700} color={C.warn}>Dekat rumah</T>
            </View>
          </View>
          {kampusLokal.map((k) => {
            const bLabel = biayaLabel(k);
            return (
              <View key={k.nama} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                <T size={13} color={C.muted} style={{ flex: 1 }}>{k.nama}</T>
                <T size={13} w={700} style={{ textAlign: 'right' }}>QS {k.qs_2026 === '-' ? '–' : k.qs_2026} · {k.jenis}{bLabel ? ` · ${bLabel}` : ''}</T>
              </View>
            );
          })}
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
          <T size={13} w={700} style={{ textAlign: 'right' }}>{tabungan != null ? rpShort(tabungan) : '–'}</T>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
          <T size={13} color={C.muted}>Menabung rutin</T>
          <T size={13} w={700} style={{ textAlign: 'right' }}>{menabung != null ? `${rpShort(menabung)}/bulan` : '–'}</T>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
          <T size={13} color={C.muted}>Perkiraan saat masuk kuliah ({bulanLagi} bulan lagi)</T>
          <T size={13} w={800} color={C.teal} style={{ textAlign: 'right' }}>{proyeksi != null ? `±${rpShort(proyeksi)}` : '–'}</T>
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
