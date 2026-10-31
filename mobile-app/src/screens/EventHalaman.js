import React from 'react';
import { Card, EmptyState, Screen, ScreenHeader } from '../components/ui';

export default function EventHalaman({ go }) {
  return (
    <Screen>
      <ScreenHeader title="Event & Webinar" onBack={() => go('home')} />
      <Card style={{ padding: 0 }}>
        <EmptyState icon="flag" title="Segera hadir"
          body="Kalender webinar, workshop, dan meetup akan tersedia di sini. Untuk sekarang, lihat event di halaman Komunitas."
          action="Buka Komunitas" onAction={() => go('komunitas2')} />
      </Card>
    </Screen>
  );
}
