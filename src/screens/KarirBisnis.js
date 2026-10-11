/**
 * KarirBisnis — Tab ke-2 untuk semua pengguna.
 * Judul layar selalu "Karir dan Bisnis".
 * Kontrol segmen "Karir | Bisnis" SELALU aktif untuk semua pengguna.
 * - budi: kedua segmen menampilkan data lengkap (karier dan usaha kopi).
 * - agus: terbuka di "Bisnis"; "Karir" tampilkan empty state atau hasil karier jika sudah ada.
 * - dini: terbuka di "Karir"; "Bisnis" tampilkan empty state atau hasil bisnis jika sudah ada.
 * - pengguna baru: kedua segmen menampilkan empty state atau hasil yang sudah disimpan.
 */
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useApp } from '../state/AppContext';
import { Button, Card, Screen, ScreenHeader, T } from '../components/ui';
import Icon from '../components/Icon';
import { C } from '../theme';
import { BudiKarierContent } from './Karier';
import { DiniKarierContent } from './Karier';
import { AgusUsahaContent } from './Usaha';
import { BudiUsahaContent } from './Usaha';

// Kontrol segmen standar — kedua opsi selalu aktif
function Segmented({ value, onChange }) {
  const options = [
    { value: 'karir', label: 'Karir' },
    { value: 'bisnis', label: 'Bisnis' },
  ];
  return (
    <View style={{ flexDirection: 'row', borderRadius: 14, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, overflow: 'hidden' }}
      accessibilityRole="tablist">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={o.label}
            onPress={() => onChange(o.value)}
            style={[
              { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
              on && { backgroundColor: C.teal },
            ]}
          >
            <T w={on ? 700 : 600} size={14} color={on ? C.white : C.ink}>{o.label}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

// Kartu ringkas hasil karier dengan tombol ubah isian
function KarierHasilRingkas({ hasil, go }) {
  const reko = hasil?.rekomendasi || [];
  return (
    <View style={{ gap: 10 }}>
      {reko.slice(0, 3).map((r) => (
        <Card key={r.id || r.profesi} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <T w={700} size={14}>{r.profesi}</T>
            <T size={12} color={C.muted}>Kecocokan {r.skor_kecocokan}</T>
          </View>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.teal }} />
        </Card>
      ))}
      <Button label="Lihat detail & dampak" icon="briefcase" onPress={() => go('tambahkarir')} style={{ minHeight: 44 }} />
    </View>
  );
}

// Kartu ringkas hasil bisnis dengan tombol ubah isian
function BisnisHasilRingkas({ hasil, go }) {
  const reko = hasil?.rekomendasi || [];
  return (
    <View style={{ gap: 10 }}>
      {reko.slice(0, 3).map((r) => (
        <Card key={r.id || r.usaha} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <T w={700} size={14}>{r.usaha}</T>
            <T size={12} color={C.muted}>Skor {r.skor_kecocokan}</T>
          </View>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.teal }} />
        </Card>
      ))}
      <Button label="Lihat detail & dampak" icon="store" onPress={() => go('tambahbisnis')} style={{ minHeight: 44 }} />
    </View>
  );
}

// Empty state untuk karir yang belum diisi — atau ringkasan hasil jika sudah ada
function KarirContent({ go }) {
  const app = useApp();
  if (app.karier?.hasil) {
    return <KarierHasilRingkas hasil={app.karier.hasil} go={go} />;
  }
  return (
    <Card style={{ alignItems: 'center', gap: 14, paddingVertical: 32 }}>
      <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="briefcase" size={28} color={C.teal} />
      </View>
      <T w={700} size={15} style={{ textAlign: 'center' }}>Belum ada rencana karier</T>
      <T size={13} color={C.muted} style={{ textAlign: 'center', lineHeight: 19 }}>
        Isi minat, skill, dan pengalaman untuk mendapatkan rekomendasi karier yang cocok.
      </T>
      <Button
        label="Tambah karir"
        icon="briefcase"
        onPress={() => go('tambahkarir')}
        accessibilityLabel="Tambah karir"
        style={{ minHeight: 44, alignSelf: 'stretch' }}
      />
    </Card>
  );
}

// Empty state untuk bisnis yang belum diisi — atau ringkasan hasil jika sudah ada
function BisnisContent({ go }) {
  const app = useApp();
  if (app.usaha?.hasil) {
    return <BisnisHasilRingkas hasil={app.usaha.hasil} go={go} />;
  }
  return (
    <Card style={{ alignItems: 'center', gap: 14, paddingVertical: 32 }}>
      <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: C.goldSoft, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="store" size={28} color={C.warn} />
      </View>
      <T w={700} size={15} style={{ textAlign: 'center' }}>Belum ada rencana bisnis</T>
      <T size={13} color={C.muted} style={{ textAlign: 'center', lineHeight: 19 }}>
        Isi minat, skill, dan modal untuk menemukan ide usaha yang paling cocok untukmu.
      </T>
      <Button
        label="Tambah bisnis"
        icon="store"
        onPress={() => go('tambahbisnis')}
        accessibilityLabel="Tambah bisnis"
        style={{ minHeight: 44, alignSelf: 'stretch' }}
      />
    </Card>
  );
}

// Tentukan nilai awal segmen berdasarkan persona
function getInitialSeg(uid, paramTab) {
  if (uid === 'agus') return 'bisnis';
  if (uid === 'dini') return 'karir';
  return paramTab === 'bisnis' ? 'bisnis' : 'karir';
}

export default function KarirBisnis({ go, params }) {
  const app = useApp();
  const uid = app.activeUserId;

  const [seg, setSeg] = useState(() => getInitialSeg(uid, params?.tab));

  // Konten per kombinasi persona × segmen
  const renderContent = () => {
    if (uid === 'budi') {
      return seg === 'karir'
        ? <BudiKarierContent go={go} />
        : <BudiUsahaContent go={go} />;
    }
    if (uid === 'agus') {
      return seg === 'bisnis'
        ? <AgusUsahaContent go={go} />
        : <KarirContent go={go} />;
    }
    if (uid === 'dini') {
      return seg === 'karir'
        ? <DiniKarierContent go={go} />
        : <BisnisContent go={go} />;
    }
    // Pengguna baru: segmen menampilkan hasil atau empty state
    return seg === 'karir'
      ? <KarirContent go={go} />
      : <BisnisContent go={go} />;
  };

  return (
    <Screen>
      <ScreenHeader title="Karir dan Bisnis" onBack={() => go('home')} />
      <Segmented value={seg} onChange={setSeg} />
      {renderContent()}
    </Screen>
  );
}
