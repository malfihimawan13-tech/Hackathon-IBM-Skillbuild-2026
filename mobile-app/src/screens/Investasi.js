import React from 'react';
import { Card, EmptyState, Screen, ScreenHeader } from '../components/ui';

export default function Investasi({ go }) {
  return (
    <Screen>
      <ScreenHeader title="Saham & Investasi" onBack={() => go('home')} />
      <Card style={{ padding: 0 }}>
        <EmptyState icon="chart" title="Segera hadir"
          body="Edukasi investasi dasar (reksa dana, saham, dan emas) akan tersedia setelah dana darurat dan targetmu aman. Untuk sekarang, mulai dari halaman My Keuangan dan My Tujuan."
          action="Buka My Keuangan" onAction={() => go('keuangan')} />
      </Card>
    </Screen>
  );
}
