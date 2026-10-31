import React from 'react';
import { Card, EmptyState, Screen, ScreenHeader } from '../components/ui';

export default function Portofolio({ go }) {
  return (
    <Screen>
      <ScreenHeader title="Project & Portofolio" onBack={() => go('home')} />
      <Card style={{ padding: 0 }}>
        <EmptyState icon="briefcase" title="Segera hadir"
          body="Tempat menampilkan proyek dan karya terbaikmu akan tersedia di sini. Untuk sekarang, lihat profilmu atau halaman Karier & Bisnis."
          action="Buka My Karier & Bisnis" onAction={() => go('karirbisnis')} />
      </Card>
    </Screen>
  );
}
