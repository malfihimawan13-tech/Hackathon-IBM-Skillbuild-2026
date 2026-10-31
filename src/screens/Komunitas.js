import React, { useMemo, useState } from 'react';
import { Linking, View } from 'react-native';
import { useApp } from '../state/AppContext';
import { Button, Card, FadeIn, Screen, ScreenHeader, Segmented, T } from '../components/ui';
import { Avatar } from '../components/Feed';
import { useKomunitas } from '../state/useKomunitas';
import { C, F } from '../theme';
import { BELAJAR_GRATIS, BERITA, GRUP, MENTOR, skorKecocokan } from '../api/komunitasData';


function Skor({ nilai }) {
  return (
    <View style={{ alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, backgroundColor: C.soft }}>
      <T w={800} size={17} color={C.teal} style={{ lineHeight: 20 }}>{nilai}</T>
      <T size={10} color={C.muted}>cocok</T>
    </View>
  );
}

function Banner({ muda }) {
  return (
    <Card tone="gold" style={{ gap: 4 }}>
      <T w={800} size={13}>Data contoh · akun fiktif</T>
      <T size={12} color={C.muted}>Semua akun, grup, dan mentor di sini simulasi untuk demo. Postingan hanya merayakan proses dan pencapaian: tanpa nominal uang, harga, atau foto barang.</T>
      {muda ? <T size={12} color={C.warn}>Untuk pengguna di bawah 18 tahun: pesan pribadi dimatikan dan gabung grup perlu persetujuan orang tua atau sekolah.</T> : null}
    </Card>
  );
}

export default function Komunitas({ go, params }) {
  const app = useApp();
  const uid = app.activeUserId;
  const muda = uid === 'dini';
  const [tab, setTab] = useState(params?.tab || (params?.q ? 'mentor' : 'grup'));
  const q = (params?.q || '').toLowerCase();
  const { s: state, ubah } = useKomunitas(uid);
  const simpan = ubah;

  const grup = useMemo(() => GRUP.map((g) => ({ ...g, ...skorKecocokan(uid, g.tag) })).filter((g) => !q || (g.nama + ' ' + g.alasan).toLowerCase().includes(q)).sort((a, b) => b.skor - a.skor), [uid, q]);
  const mentor = useMemo(() => MENTOR.map((m) => ({ ...m, ...skorKecocokan(uid, m.tag) })).filter((m) => !q || (m.nama + ' ' + m.bidang + ' ' + m.alasan).toLowerCase().includes(q)).sort((a, b) => b.skor - a.skor), [uid, q]);

  return (
    <Screen>
      <ScreenHeader title="Komunitas" onBack={() => go('home')} />
      {q ? <T size={13} color={C.muted}>Hasil pencarian: "{params.q}"</T> : null}
      <Banner muda={muda} />
      <Segmented value={tab} onChange={setTab} options={[{ value: 'grup', label: 'Grup' }, { value: 'mentor', label: 'Mentor' }, { value: 'berita', label: 'Berita' }]} />

      {tab === 'grup' ? (
        <View style={{ gap: 12 }}>
          <T size={13} color={C.muted}>Skor kecocokan dihitung kode dari minat dan tujuanmu. Penjelasannya ditulis ringkas.</T>
          {grup.map((g) => {
            const gabung = state.gabung[g.id];
            return (
              <FadeIn key={g.id}>
                <Card style={{ gap: 10 }}>
                  <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                    <View style={{ flex: 1, gap: 2 }}>
                      <T w={800} size={15}>{g.nama}</T>
                      <T size={12} color={C.muted}>{g.anggota} anggota contoh · {g.jadwal}</T>
                    </View>
                    <Skor nilai={g.skor} />
                  </View>
                  <T size={13} color={C.muted}>{g.alasan}</T>
                  <Button label={gabung ? (muda ? 'Menunggu persetujuan' : 'Sudah bergabung') : (muda ? 'Ajukan bergabung' : 'Gabung')} variant={gabung ? 'secondary' : 'primary'}
                    onPress={() => simpan((s) => ({ ...s, gabung: { ...s.gabung, [g.id]: !s.gabung[g.id] } }))} />
                </Card>
              </FadeIn>
            );
          })}
        </View>
      ) : null}

      {tab === 'mentor' ? (
        <View style={{ gap: 12 }}>
          <T size={13} color={C.muted}>Mentor contoh. Di versi sungguhan, mentor terverifikasi dan sesi dilakukan di kanal terjadwal, bukan pesan pribadi.</T>
          {mentor.map((m) => {
            const minta = state.minta[m.id];
            return (
              <FadeIn key={m.id}>
                <Card style={{ gap: 10 }}>
                  <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                    <Avatar nama={m.inisial} warna={C.teal2} size={44} />
                    <View style={{ flex: 1, gap: 2 }}>
                      <T w={800} size={15}>{m.nama}</T>
                      <T size={12} color={C.muted}>{m.bidang}</T>
                      <T size={11} color={C.muted}>Tersedia: {m.tersedia}</T>
                    </View>
                    <Skor nilai={m.skor} />
                  </View>
                  <T size={13} color={C.muted}>{m.alasan}</T>
                  <Button label={minta ? 'Permintaan terkirim' : 'Minta bimbingan'} variant={minta ? 'secondary' : 'primary'}
                    onPress={() => simpan((s) => ({ ...s, minta: { ...s.minta, [m.id]: !s.minta[m.id] } }))} />
                </Card>
              </FadeIn>
            );
          })}
          <Card tone="gold" style={{ gap: 6 }}>
            <T w={800} size={14}>Ingin jadi mentor?</T>
            <T size={12} color={C.muted}>Daftar sebagai mentor untuk berbagi pengalaman. Pendaftaran akan diverifikasi (LinkedIn atau institusi) sebelum tampil. Login dengan Google atau LinkedIn masuk rencana pengembangan.</T>
            <Button label="Daftar sebagai mentor (segera hadir)" variant="ghost" disabled />
          </Card>
        </View>
      ) : null}

      {tab === 'berita' ? (
        <View style={{ gap: 12 }}>
          <T size={13} color={C.muted}>Ringkasan ditulis sendiri dengan tautan ke sumber aslinya.</T>
          {BERITA.map((b) => (
            <FadeIn key={b.id}>
              <Card style={{ gap: 8 }}>
                <T w={800} size={15}>{b.judul}</T>
                <T size={13} color={C.muted}>{b.ringkas}</T>
                <T size={11} color={C.muted}>{b.sumber} · {b.tanggal}</T>
                <Button label="Baca di sumber asli" variant="secondary" icon="link" onPress={() => Linking.openURL(b.url)} />
              </Card>
            </FadeIn>
          ))}
          <FadeIn>
            <Card tone="teal" style={{ gap: 8 }}>
              <T w={800} size={15} color={C.white}>{BELAJAR_GRATIS.judul}</T>
              <T size={13} color="rgba(255,255,255,0.9)">{BELAJAR_GRATIS.ringkas}</T>
              <Button label="Buka situs IBM SkillsBuild" variant="secondary" icon="link" onPress={() => Linking.openURL(BELAJAR_GRATIS.url)} />
            </Card>
          </FadeIn>
        </View>
      ) : null}
    </Screen>
  );
}
