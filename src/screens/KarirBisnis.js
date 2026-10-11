/**
 * KarirBisnis — Tab ke-2 untuk semua pengguna.
 * Judul layar selalu "Karir dan Bisnis".
 * Kontrol segmen "Karir | Bisnis" tampil untuk semua pengguna:
 * - budi/pengguna baru: kedua opsi aktif.
 * - dini: "Karir" aktif, "Bisnis" nonaktif (disabled, abu-abu).
 * - agus: "Bisnis" aktif, "Karir" nonaktif (disabled, abu-abu).
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

// Kontrol segmen dengan dukungan opsi disabled per item
function SegmentedWithDisabled({ options, value, onChange }) {
  return (
    <View style={{ flexDirection: 'row', borderRadius: 14, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, overflow: 'hidden' }}
      accessibilityRole="tablist">
      {options.map((o) => {
        const on = o.value === value;
        const disabled = !!o.disabled;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: on, disabled }}
            accessibilityLabel={o.label}
            onPress={disabled ? undefined : () => onChange(o.value)}
            style={[
              { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
              on && { backgroundColor: C.teal },
            ]}
          >
            <T
              w={on ? 700 : 600}
              size={14}
              color={on ? C.white : disabled ? C.muted : C.ink}
            >
              {o.label}
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}

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

// Tentukan opsi segmen (disabled/aktif) dan nilai awal berdasarkan persona
function getSegConfig(uid, paramTab) {
  if (uid === 'agus') {
    return {
      options: [
        { value: 'karir', label: 'Karir', disabled: true },
        { value: 'bisnis', label: 'Bisnis', disabled: false },
      ],
      initial: 'bisnis',
    };
  }
  if (uid === 'dini') {
    return {
      options: [
        { value: 'karir', label: 'Karir', disabled: false },
        { value: 'bisnis', label: 'Bisnis', disabled: true },
      ],
      initial: 'karir',
    };
  }
  // budi & pengguna baru: keduanya aktif
  return {
    options: [
      { value: 'karir', label: 'Karir', disabled: false },
      { value: 'bisnis', label: 'Bisnis', disabled: false },
    ],
    initial: paramTab === 'bisnis' ? 'bisnis' : 'karir',
  };
}

export default function KarirBisnis({ go, params }) {
  const app = useApp();
  const uid = app.activeUserId;

  const { options, initial } = getSegConfig(uid, params?.tab);
  const [seg, setSeg] = useState(initial);

  // Konten per kombinasi persona × segmen
  // Pilihan disabled tidak pernah menghasilkan konten persona lain
  const renderContent = () => {
    if (uid === 'budi') {
      return seg === 'karir'
        ? <BudiKarierContent go={go} />
        : <BudiUsahaContent go={go} />;
    }
    if (uid === 'agus') {
      // "Karir" disabled — selalu tampilkan bisnis
      return <AgusUsahaContent go={go} />;
    }
    if (uid === 'dini') {
      // "Bisnis" disabled — selalu tampilkan karir
      return <DiniKarierContent go={go} />;
    }
    // Pengguna baru
    return seg === 'karir'
      ? <NewUserKarirContent go={go} />
      : <NewUserUsahaContent go={go} />;
  };

  return (
    <Screen>
      <ScreenHeader title="Karir dan Bisnis" onBack={() => go('home')} />
      <SegmentedWithDisabled options={options} value={seg} onChange={setSeg} />
      {renderContent()}
    </Screen>
  );
}
