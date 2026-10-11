/**
 * KarirBisnis — Tab ke-2 untuk semua pengguna.
 * Judul layar selalu "Karir dan Bisnis".
 * - budi: segmen "Karir" | "Bisnis"
 * - agus: langsung konten usaha keluarga (tanpa segmen)
 * - dini: langsung konten karier pelajar (tanpa segmen)
 * - pengguna baru: segmen "Karir" | "Bisnis" dengan ajakan isi data
 */
import React, { useState } from 'react';
import { View } from 'react-native';
import { useApp } from '../state/AppContext';
import { Button, Card, Screen, ScreenHeader, Segmented } from '../components/ui';
import Icon from '../components/Icon';
import { C } from '../theme';
import { BudiKarierContent } from './Karier';
import { DiniKarierContent } from './Karier';
import { AgusUsahaContent } from './Usaha';
import { BudiUsahaContent } from './Usaha';

const SEG_OPTIONS = [
  { value: 'karir', label: 'Karir' },
  { value: 'bisnis', label: 'Bisnis' },
];

function NewUserKarirContent({ go }) {
  return (
    <Card style={{ alignItems: 'center', gap: 10, paddingVertical: 28 }}>
      <View style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="briefcase" size={26} color={C.teal} />
      </View>
      <Button label="Isi data & eksplorasi karier" icon="briefcase" onPress={() => go('profil')} />
    </Card>
  );
}

function NewUserUsahaContent({ go }) {
  return (
    <Card style={{ alignItems: 'center', gap: 10, paddingVertical: 28 }}>
      <View style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: C.goldSoft, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="store" size={26} color={C.warn} />
      </View>
      <Button label="Isi data & eksplorasi usaha" icon="store" onPress={() => go('profil')} />
    </Card>
  );
}

export default function KarirBisnis({ go, params }) {
  const app = useApp();
  const uid = app.activeUserId;

  // Tentukan tab awal: params?.tab bisa 'karir' atau 'bisnis'
  const [seg, setSeg] = useState(params?.tab === 'bisnis' ? 'bisnis' : 'karir');

  // ── Agus: langsung konten usaha, tanpa segmen ──────────────────
  if (uid === 'agus') {
    return (
      <Screen>
        <ScreenHeader title="Karir dan Bisnis" onBack={() => go('home')} />
        <AgusUsahaContent go={go} />
      </Screen>
    );
  }

  // ── Dini: langsung konten karier pelajar, tanpa segmen ──────────
  if (uid === 'dini') {
    return (
      <Screen>
        <ScreenHeader title="Karir dan Bisnis" onBack={() => go('home')} />
        <DiniKarierContent go={go} />
      </Screen>
    );
  }

  // ── Budi & pengguna baru: segmen Karir | Bisnis ─────────────────
  return (
    <Screen>
      <ScreenHeader title="Karir dan Bisnis" onBack={() => go('home')} />
      <Segmented options={SEG_OPTIONS} value={seg} onChange={setSeg} />

      {uid === 'budi' ? (
        seg === 'karir'
          ? <BudiKarierContent go={go} />
          : <BudiUsahaContent go={go} />
      ) : (
        seg === 'karir'
          ? <NewUserKarirContent go={go} />
          : <NewUserUsahaContent go={go} />
      )}
    </Screen>
  );
}
