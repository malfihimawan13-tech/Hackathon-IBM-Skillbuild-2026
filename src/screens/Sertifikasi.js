import React from 'react';
import { Linking, View } from 'react-native';
import { useApp } from '../state/AppContext';
import { Button, Card, FadeIn, Screen, ScreenHeader, T } from '../components/ui';
import { C } from '../theme';
import { BELAJAR_GRATIS } from '../api/komunitasData';

const BIDANG = {
  budi: ['Analitik data dasar', 'SQL dan basis data', 'Dasar machine learning'],
  agus: ['Pembukuan usaha kecil', 'Pemasaran digital untuk UMKM', 'Keselamatan kerja bengkel'],
  dini: ['Literasi digital dan pemrograman dasar', 'Desain grafis dasar', 'Bahasa Inggris untuk karier'],
};

export default function Sertifikasi({ go }) {
  const { activeUserId } = useApp();
  const daftar = BIDANG[activeUserId] || BIDANG.budi;
  return (
    <Screen>
      <ScreenHeader title="Sertifikasi" onBack={() => go('home')} />
      <Card tone="gold"><T size={12} color={C.muted}>Bidang di bawah adalah saran umum untuk tujuanmu, bukan daftar sertifikat resmi. Cek nama dan syarat sertifikat langsung di penyedia pelatihan.</T></Card>
      <T w={800} size={15}>Bidang yang cocok untukmu</T>
      {daftar.map((b) => (
        <FadeIn key={b}><Card><T w={700} size={14}>{b}</T></Card></FadeIn>
      ))}
      <Card tone="teal" style={{ gap: 8 }}>
        <T w={800} size={15} color={C.white}>{BELAJAR_GRATIS.judul}</T>
        <T size={13} color="rgba(255,255,255,0.9)">{BELAJAR_GRATIS.ringkas}</T>
        <Button label="Buka IBM SkillsBuild" variant="secondary" icon="link" onPress={() => Linking.openURL(BELAJAR_GRATIS.url)} />
      </Card>
    </Screen>
  );
}
