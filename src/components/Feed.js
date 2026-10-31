import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, TextInput, View, useWindowDimensions } from 'react-native';
import Icon from './Icon';
import { Button, FadeIn, T } from './ui';
import { C, F } from '../theme';
import { cekCaption, sarankanVersiNetral } from '../utils/pamer';
import { tipeVerifikasi, cariAkun, AKUN } from '../api/komunitasData';
import { Image, Platform } from 'react-native';
import { fotoUntuk } from './foto';

const WARNA_CENTANG = { perusahaan: '#1D9BF0', belajar: '#5CCB8E', sertifikasi: '#F2B705' };
const TEKS_CENTANG = { perusahaan: '#1778C2', belajar: '#2E9E6B', sertifikasi: '#A87A00' };
const KET_CENTANG = { perusahaan: 'Perusahaan terverifikasi', belajar: 'Channel pembelajaran terverifikasi', sertifikasi: 'Lembaga sertifikasi terverifikasi' };
export function CentangBiru({ size = 16, tipe = 'perusahaan' }) {
  return (
    <View accessibilityLabel={KET_CENTANG[tipe]} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: WARNA_CENTANG[tipe], alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="check" size={size - 5} color="#FFFFFF" strokeWidth={3} />
    </View>
  );
}
// Centang + tulisan "Terverifikasi" (biru: perusahaan, hijau muda: pembelajaran, kuning: sertifikasi). Hanya simulasi demo.
export function Terverifikasi({ akun, size = 15, label = false }) {
  const tipe = tipeVerifikasi(akun);
  if (!tipe) return null;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <CentangBiru size={size} tipe={tipe} />
      {label ? <T w={700} size={11} color={TEKS_CENTANG[tipe]}>Terverifikasi</T> : null}
    </View>
  );
}

export const WARNA_STATUS = { online: '#2BA84A', sibuk: '#F28C28', offline: '#D93025' };
export const LABEL_STATUS = { online: 'Online', sibuk: 'Sibuk', offline: 'Offline' };
// Status contoh (tetap per akun) untuk demo; belum ada server yang melacak status sungguhan.
export function statusAkun(k) {
  if (k === 'saya') return 'online';
  const h = String(k).split('').reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 997, 11) % 10;
  return h < 5 ? 'online' : h < 7 ? 'sibuk' : 'offline';
}

export function Avatar({ nama, warna, size = 44, status }) {
  const ini = String(nama || '?').split(' ').map((x) => x[0]).join('').slice(0, 2).toUpperCase();
  const d = Math.max(10, Math.round(size * 0.28));
  const foto = fotoUntuk(nama);
  return (
    <View accessibilityLabel={status ? LABEL_STATUS[status] : undefined} style={{ width: size, height: size }}>
      {foto ? (
        <Image source={foto} resizeMode="cover" style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: warna, alignItems: 'center', justifyContent: 'center' }}>
          <T w={800} size={size * 0.38} color={C.white}>{ini}</T>
        </View>
      )}
      {status ? <View style={{ position: 'absolute', right: -1, bottom: -1, width: d, height: d, borderRadius: d / 2, backgroundColor: WARNA_STATUS[status], borderWidth: 2, borderColor: C.card }} /> : null}
    </View>
  );
}

const kartu = { get backgroundColor() { return C.card; }, borderRadius: 14, borderWidth: 1, get borderColor() { return C.line; } };

function Aksi({ ikon, label, on, onPress, warna }) {
  const w = on ? (warna || C.teal) : C.muted;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
      style={({ pressed, hovered }) => ({ flexDirection: 'row', gap: 6, alignItems: 'center', paddingHorizontal: 14, minHeight: 38, borderRadius: 999, backgroundColor: pressed || hovered ? C.ground : 'transparent', borderWidth: 1, borderColor: on ? w : C.line })}>
      <Icon name={ikon} size={18} color={w} fill={on && ikon === 'heart' ? w : 'none'} />
      <T w={on ? 800 : 600} size={13} color={w}>{label}</T>
    </Pressable>
  );
}

// Kartu postingan bergaya LinkedIn: profil, teks, hitungan, lalu Suka / Komentar / Bagikan.
const cabut = (x, jenis, id) => (x.riwayat || []).filter((r) => !(r.jenis === jenis && r.id === id));

const akunDasar = (k) => /^[cf]\d+$/.test(String(k));
export const terhubungAkun = (s, k) => (akunDasar(k) ? !(s.putus || {})[k] : !!s.ikuti[k]);
const alihAkun = (x, k) => (akunDasar(k) ? { ...x, putus: { ...(x.putus || {}), [k]: !(x.putus || {})[k] } } : { ...x, ikuti: { ...x.ikuti, [k]: !x.ikuti[k] } });

export const statusJikaTerhubung = (s, k) => (k === 'saya' ? 'online' : (!(cariAkun(k) || {}).perusahaan && terhubungAkun(s, k) ? statusAkun(k) : undefined));

export const ProfilCtx = React.createContext(() => {});
export function LinkAkun({ k, children, style }) {
  const buka = React.useContext(ProfilCtx);
  if (!k || k === 'saya') return <View style={style}>{children}</View>;
  return <Pressable accessibilityRole="link" onPress={() => buka(k)} style={style}>{children}</Pressable>;
}

export function PostCard({ post, s, ubah, namaSaya, headlineSaya, bukaAwal }) {
  const milik = post.akun === 'saya';
  const akun = milik ? { nama: namaSaya, peran: headlineSaya, warna: C.gold } : (AKUN[post.akun] || cariAkun(post.akun));
  const [buka, setBuka] = useState(!!bukaAwal);
  const [teks, setTeks] = useState('');
  const [daftar, setDaftar] = useState(false);
  const [tabD, setTabD] = useState('suka');
  const suka = !!s.suka[post.id];
  const mengikuti = terhubungAkun(s, post.akun);
  const komentar = [...post.komentar, ...(s.komentar[post.id] || [])];
  const jumlahSuka = (post.reaksi.suka || 0) + (suka ? 1 : 0);
  const dibagikan = !!s.bagikan[post.id];
  const jumlahBagi = (post.bagikan || 0) + (dibagikan ? 1 : 0);
  const penyuka = [...(suka ? ['saya'] : []), ...(post.penyuka || [])];
  const pembagi = [...(dibagikan ? ['saya'] : []), ...(post.pembagi || [])];
  const sisaSuka = Math.max(0, jumlahSuka - penyuka.length);
  const sisaBagi = Math.max(0, jumlahBagi - pembagi.length);
  const ok = !teks.trim() || cekCaption(teks).ok;
  return (
    <FadeIn>
      <View style={{ ...kartu, paddingTop: 12, overflow: 'hidden' }}>
        <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 14, alignItems: 'flex-start' }}>
          <LinkAkun k={post.akun}><Avatar nama={akun.nama} warna={akun.warna} size={48} status={statusJikaTerhubung(s, post.akun)} /></LinkAkun>
          <View style={{ flex: 1 }}>
            <LinkAkun k={post.akun} style={{ alignSelf: 'flex-start' }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <T w={800} size={14}>{akun.nama}</T><Terverifikasi akun={akun} />
            </View></LinkAkun>
            <T size={12} color={C.muted} numberOfLines={2}>{akun.peran}</T>
            <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center', marginTop: 1 }}>
              <T size={11} color={C.muted}>{post.waktu} ·</T><Icon name="globe" size={12} color={C.muted} />
            </View>
          </View>
          {!milik ? (
            <Pressable accessibilityRole="button" onPress={() => ubah((x) => alihAkun(x, post.akun))}
              style={{ flexDirection: 'row', gap: 4, alignItems: 'center', paddingHorizontal: 8, minHeight: 32 }}>
              {!mengikuti ? <Icon name="plus" size={16} color={C.teal2} /> : null}
              <T w={800} size={13} color={mengikuti ? C.muted : C.teal2}>{akun.perusahaan ? (mengikuti ? 'Mengikuti' : 'Ikuti') : (mengikuti ? 'Terhubung' : 'Koneksi')}</T>
            </Pressable>
          ) : null}
        </View>
        <T size={14} style={{ lineHeight: 21, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 12 }}>{post.teks}</T>
        <Lampiran daftar={post.lampiran} />
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', paddingHorizontal: 14, paddingBottom: 12, flexWrap: 'wrap' }}>
          <Aksi ikon="heart" warna="#E0334C" label={String(jumlahSuka)} on={suka} onPress={() => ubah((x) => ({ ...x, suka: { ...x.suka, [post.id]: !x.suka[post.id] }, riwayat: x.suka[post.id] ? cabut(x, 'suka', post.id) : [...(x.riwayat || []), { jenis: 'suka', id: post.id, t: Date.now() }] }))} />
          <Aksi ikon="bubble" label={String(komentar.length)} on={buka} onPress={() => setBuka(!buka)} />
          <Aksi ikon="bagikan" label={String(jumlahBagi)} on={!!s.bagikan[post.id]} onPress={() => ubah((x) => ({ ...x, bagikan: { ...x.bagikan, [post.id]: !x.bagikan[post.id] }, riwayat: x.bagikan[post.id] ? cabut(x, 'bagikan', post.id) : [...(x.riwayat || []), { jenis: 'bagikan', id: post.id, t: Date.now() }] }))} />
          <View style={{ flex: 1 }} />
          <Pressable accessibilityRole="button" accessibilityLabel="Lihat siapa yang menyukai dan membagikan" onPress={() => setDaftar(!daftar)} style={{ flexDirection: 'row', alignItems: 'center', minHeight: 38 }}>
            {penyuka.slice(0, 3).map((k, i) => {
              const a = k === 'saya' ? { nama: namaSaya, warna: C.gold } : AKUN[k];
              return <View key={k} style={{ marginLeft: i ? -10 : 0, borderWidth: 2, borderColor: C.card, borderRadius: 14 }}><Avatar nama={a.nama} warna={a.warna} size={26} /></View>;
            })}
          </Pressable>
        </View>
        <Modal transparent visible={daftar} animationType="fade" onRequestClose={() => setDaftar(false)}>
          <Pressable accessibilityLabel="Tutup" onPress={() => setDaftar(false)} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <Pressable onPress={() => {}} style={{ width: '100%', maxWidth: 420, maxHeight: '75%', backgroundColor: C.card, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: C.line }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderBottomWidth: 1, borderBottomColor: C.line }}>
                {[{ k: 'suka', l: `Suka (${jumlahSuka})` }, { k: 'bagi', l: `Dibagikan (${jumlahBagi})` }].map((t) => (
                  <Pressable key={t.k} accessibilityRole="tab" onPress={() => setTabD(t.k)} style={{ paddingHorizontal: 12, minHeight: 34, borderRadius: 17, justifyContent: 'center', backgroundColor: tabD === t.k ? C.teal : 'transparent', borderWidth: 1, borderColor: tabD === t.k ? C.teal : C.line }}>
                    <T w={700} size={12} color={tabD === t.k ? C.white : C.muted}>{t.l}</T>
                  </Pressable>
                ))}
                <View style={{ flex: 1 }} />
                <Pressable accessibilityRole="button" accessibilityLabel="Tutup" onPress={() => setDaftar(false)} style={{ width: 34, height: 34, alignItems: 'center', justifyContent: 'center' }}><Icon name="close" size={18} color={C.muted} /></Pressable>
              </View>
              <ScrollView contentContainerStyle={{ padding: 14, gap: 12 }}>
                {(tabD === 'suka' ? penyuka : pembagi).map((k) => {
                  const a = k === 'saya' ? { nama: `${namaSaya} (kamu)`, peran: headlineSaya, warna: C.gold } : AKUN[k];
                  return (
                    <View key={k} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                      <Avatar nama={a.nama} warna={a.warna} size={38} />
                      <View style={{ flex: 1 }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><T w={700} size={13}>{a.nama}</T><Terverifikasi akun={a} size={14} /></View><T size={11} color={C.muted} numberOfLines={2}>{a.peran}</T></View>
                    </View>
                  );
                })}
                {(tabD === 'suka' ? sisaSuka : sisaBagi) > 0 ? <T size={12} color={C.muted}>dan {tabD === 'suka' ? sisaSuka : sisaBagi} lainnya (angka contoh)</T> : null}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
        {buka ? (
          <View style={{ padding: 12, gap: 10, backgroundColor: C.ground }}>
            {komentar.map((k, i) => {
              const a = k.akun === 'saya' ? { nama: namaSaya, warna: C.gold } : AKUN[k.akun];
              return (
                <View key={i} style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
                  <Avatar nama={a.nama} warna={a.warna} size={30} />
                  <View style={{ flex: 1, backgroundColor: C.card, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 }}>
                    <T w={700} size={12}>{a.nama}</T><T size={13}>{k.teks}</T>
                  </View>
                </View>
              );
            })}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput value={teks} onChangeText={setTeks} placeholder="Tulis komentar yang menyemangati…" placeholderTextColor="#8A9693" accessibilityLabel="Tulis komentar"
                style={{ flex: 1, minHeight: 40, borderRadius: 20, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, paddingHorizontal: 14, fontFamily: F.medium, fontSize: 13, color: C.ink }} />
              <Pressable accessibilityRole="button" accessibilityLabel="Kirim komentar" disabled={!teks.trim() || !ok}
                onPress={() => { ubah((x) => ({ ...x, komentar: { ...x.komentar, [post.id]: [...(x.komentar[post.id] || []), { akun: 'saya', teks: teks.trim() }] }, riwayat: [...(x.riwayat || []), { jenis: 'komentar', id: post.id, teks: teks.trim(), t: Date.now() }] })); setTeks(''); }}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center', opacity: !teks.trim() || !ok ? 0.5 : 1 }}>
                <Icon name="send" size={17} color={C.white} />
              </Pressable>
            </View>
            {!ok ? <T size={11} color={C.warn}>Komentar tanpa nominal uang atau nada pamer ya.</T> : null}
          </View>
        ) : null}
      </View>
    </FadeIn>
  );
}

// Kotak "Mulai buat posting" seperti LinkedIn; terbuka menjadi formulir dengan pemeriksa anti-pamer.
// Pilih berkas (web): membuka dialog pilih file; di HP info singkat. Berkas tidak diunggah ke server (demo).
function pilihBerkas(jenis, tambah, info) {
  if (Platform.OS !== 'web' || typeof document === 'undefined') { info('Lampiran tersedia di versi web (demo).'); return; }
  const el = document.createElement('input');
  el.type = 'file';
  el.accept = jenis === 'gambar' ? 'image/*' : jenis === 'video' ? 'video/*' : '*/*';
  el.onchange = () => {
    const f = el.files && el.files[0];
    if (!f) return;
    if (f.size > 25 * 1024 * 1024) { info('Berkas terlalu besar (maksimal 25 MB).'); return; }
    tambah({ jenis, nama: f.name, uri: jenis === 'gambar' ? URL.createObjectURL(f) : undefined });
  };
  el.click();
}

export function Lampiran({ daftar, onHapus }) {
  if (!daftar || !daftar.length) return null;
  return (
    <View style={{ gap: 8, paddingHorizontal: 14, paddingBottom: onHapus ? 0 : 12 }}>
      {daftar.map((l, i) => (
        <View key={i}>
          {l.uri ? <Image source={{ uri: l.uri }} accessibilityLabel={l.nama} style={{ width: '100%', height: 220, borderRadius: 12, backgroundColor: C.ground }} resizeMode="cover" /> : null}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: l.uri ? 4 : 0, paddingHorizontal: 10, minHeight: 36, borderRadius: 10, backgroundColor: C.ground }}>
            <Icon name={l.jenis === 'gambar' ? 'gambar' : l.jenis === 'video' ? 'video' : 'klip'} size={16} color={C.teal2} />
            <T size={12} style={{ flex: 1 }} numberOfLines={1}>{l.nama}</T>
            {onHapus ? <Pressable accessibilityRole="button" accessibilityLabel="Hapus lampiran" onPress={() => onHapus(i)}><Icon name="close" size={16} color={C.muted} /></Pressable> : null}
          </View>
        </View>
      ))}
    </View>
  );
}

export function Composer({ nama, onKirim }) {
  const [lampiran, setLampiran] = useState([]);
  const [info, setInfo] = useState('');
  const [buka, setBuka] = useState(false);
  const [teks, setTeks] = useState('');
  const hasil = useMemo(() => cekCaption(teks), [teks]);
  const kosong = !teks.trim();
  return (
    <View style={{ ...kartu, padding: 12, gap: 10 }}>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <Avatar nama={nama} warna={C.gold} size={46} />
        {!buka ? (
          <Pressable accessibilityRole="button" onPress={() => setBuka(true)} style={{ flex: 1, minHeight: 46, borderRadius: 12, backgroundColor: C.ground, justifyContent: 'center', paddingHorizontal: 16 }}>
            <T w={500} size={13} color={C.muted} numberOfLines={1}>Bagikan cerita, pengalaman, atau pencapaianmu...</T>
          </Pressable>
        ) : <T w={800} size={14} style={{ flex: 1 }}>Bagikan pencapaian atau pelajaranmu</T>}
      </View>
      {!buka ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {[['gambar', 'Foto'], ['book', 'Kursus'], ['briefcase', 'Lowongan'], ['bubble', 'Pertanyaan'], ['edit', 'Artikel'], ['chart', 'Poll']].map(([ik, l]) => (
            <Pressable key={l} accessibilityRole="button" accessibilityLabel={`Buat posting: ${l}`} onPress={() => setBuka(true)}
              style={({ hovered }) => ({ flexGrow: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, minHeight: 36, borderRadius: 10, borderWidth: 1, borderColor: C.line, backgroundColor: hovered ? C.soft : C.card })}>
              <Icon name={ik} size={16} color={C.teal2} /><T w={600} size={12} color={C.ink}>{l}</T>
            </Pressable>
          ))}
        </View>
      ) : null}
      {buka ? (
        <>
          <TextInput value={teks} onChangeText={setTeks} multiline autoFocus placeholder="Ceritakan prosesnya, tanpa angka uang atau harga…" placeholderTextColor="#8A9693" accessibilityLabel="Isi postingan"
            style={{ minHeight: 96, borderRadius: 12, borderWidth: 1, borderColor: C.line, padding: 12, fontFamily: F.medium, fontSize: 14, color: C.ink, textAlignVertical: 'top' }} />
          {!kosong && !hasil.ok ? (
            <View style={{ backgroundColor: C.goldSoft, borderWidth: 1, borderColor: C.goldLine, borderRadius: 12, padding: 10, gap: 4 }}>
              <T w={800} size={13}>Saran sebelum diposting</T>
              {hasil.temuan.map((t) => <T key={t.kode} size={12} color={C.warn}>• {t.pesan}</T>)}
              <Pressable accessibilityRole="button" onPress={() => setTeks(sarankanVersiNetral(teks, 'Aku berhasil mencapai target yang kususun 🎉'))}><T w={700} size={13} color={C.teal}>Terapkan versi netral</T></Pressable>
            </View>
          ) : null}
          <Lampiran daftar={lampiran} onHapus={(i) => setLampiran(lampiran.filter((_, n) => n !== i))} />
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            {[{ k: 'gambar', l: 'Foto' }, { k: 'video', l: 'Video' }, { k: 'berkas', l: 'File' }].map((b) => (
              <Pressable key={b.k} accessibilityRole="button" accessibilityLabel={`Tambah ${b.l}`} onPress={() => { setInfo(''); pilihBerkas(b.k, (l) => setLampiran([...lampiran, l]), setInfo); }}
                style={({ hovered }) => ({ flexDirection: 'row', gap: 6, alignItems: 'center', paddingHorizontal: 12, minHeight: 38, borderRadius: 19, backgroundColor: hovered ? C.soft : 'transparent' })}>
                <Icon name={b.k === 'gambar' ? 'gambar' : b.k === 'video' ? 'video' : 'klip'} size={19} color={C.teal2} /><T w={700} size={12} color={C.muted}>{b.l}</T>
              </Pressable>
            ))}
          </View>
          {info ? <T size={11} color={C.warn}>{info}</T> : null}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button label="Batal" variant="secondary" onPress={() => { setBuka(false); setTeks(''); }} style={{ flex: 1, minHeight: 44 }} />
            <Button label="Posting" disabled={(kosong && !lampiran.length) || (!kosong && !hasil.ok)} onPress={() => { onKirim(teks.trim(), lampiran); setBuka(false); setTeks(''); setLampiran([]); setInfo(''); }} style={{ flex: 1, minHeight: 44 }} />
          </View>
        </>
      ) : null}
    </View>
  );
}
