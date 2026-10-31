import React from 'react';
import { Card, EmptyState, Screen, ScreenHeader } from '../components/ui';

export default function Kompetisi({ go }) {
  return (
    <Screen>
      <ScreenHeader title="Kompetisi" onBack={() => go('home')} />
      <Card style={{ padding: 0 }}>
        <EmptyState icon="target" title="Segera hadir"
          body="Lomba, hackathon, dan tantangan belajar akan tersedia di sini. Untuk sekarang, cari teman dan mentor lewat halaman Komunitas."
          action="Buka Komunitas" onAction={() => go('komunitas2')} />
      </Card>
    </Screen>
  );
}
