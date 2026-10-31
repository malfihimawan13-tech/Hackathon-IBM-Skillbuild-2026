import React from 'react';
import { View } from 'react-native';
import { Card, FadeIn, Screen, ScreenHeader, T } from '../components/ui';
import Icon from '../components/Icon';
import { C } from '../theme';

export const ITEM = [
  { i: 'heart', t: 'Rafi A. menyukai postinganmu', w: '1 jam' },
  { i: 'users', t: 'Dewi K. (mentor contoh) menerima permintaan koneksimu', w: '3 jam' },
  { i: 'spark', t: 'Roadmap-mu punya langkah baru minggu ini', w: 'Kemarin' },
  { i: 'bell', t: 'Grup Belajar Data Science Pemula mengadakan sesi Sabtu', w: '2 hari' },
];

export default function Notifikasi({ go }) {
  return (
    <Screen>
      <ScreenHeader title="Notifikasi" onBack={() => go('home')} />
      <Card tone="gold"><T size={12} color={C.muted}>Notifikasi di bawah adalah contoh untuk demo.</T></Card>
      {ITEM.map((n) => (
        <FadeIn key={n.t}>
          <Card style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' }}><Icon name={n.i} size={19} color={C.teal2} /></View>
            <View style={{ flex: 1 }}><T w={700} size={13}>{n.t}</T><T size={11} color={C.muted}>{n.w} lalu</T></View>
          </Card>
        </FadeIn>
      ))}
    </Screen>
  );
}
