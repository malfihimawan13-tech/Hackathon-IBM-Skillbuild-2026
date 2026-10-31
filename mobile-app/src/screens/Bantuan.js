import React from 'react';
import { Button, Card, Screen, ScreenHeader, T } from '../components/ui';
import { C } from '../theme';

export const FAQ = [
  ['Apakah angka di myCITA tebakan AI?', 'Angka keuangan dan skor dihitung oleh kode yang pasti. AI hanya menjelaskan hasilnya dan menjawab pertanyaan.'],
  ['Apakah akun dan postingan di Beranda asli?', 'Belum. Semua akun, grup, mentor, dan postingan adalah contoh fiktif untuk demo dan diberi label.'],
  ['Kenapa jawaban Agen AI butuh beberapa detik?', 'Agen AI berjalan di Langflow dan memanggil model bahasa. Di Mode demo, jawaban memakai data rekaman.'],
  ['Bagaimana menghubungkan ke Langflow?', 'Buka Profil, lalu Pengaturan pengembang: isi alamat Langflow dan API key, uji koneksi, lalu matikan Mode demo.'],
];

export default function Bantuan({ go }) {
  return (
    <Screen>
      <ScreenHeader title="Bantuan" onBack={() => go('home')} />
      {FAQ.map(([q, a]) => (
        <Card key={q} style={{ gap: 4 }}><T w={800} size={14}>{q}</T><T size={13} color={C.muted}>{a}</T></Card>
      ))}
      <Button label="Tanya Agen AI" icon="spark" onPress={() => go('chat')} />
    </Screen>
  );
}
