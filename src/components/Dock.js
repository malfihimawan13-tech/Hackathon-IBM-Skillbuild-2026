import React, { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, TextInput, View, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../state/AppContext';
import Chat from '../screens/Chat';
import Icon from './Icon';
import { FadeIn, T } from './ui';
import { Avatar, statusJikaTerhubung } from './Feed';
import { useKomunitas } from '../state/useKomunitas';
import { profilPengguna } from './Sisi';
import { C, F } from '../theme';
import { cekCaption } from '../utils/pamer';
import { AKUN, cariAkun, koneksiDasar } from '../api/komunitasData';
import { usePesan, semuaThread, daftarPesan, belumDibaca, totalBelumDibaca } from '../state/usePesan';

const BALAS = {
  orang: 'Terima kasih sudah menghubungi! Nanti saya balas lebih lengkap ya.',
  mentor: 'Terima kasih sudah menghubungi! Kita atur sesi singkat bulan ini ya.',
  grup: 'Selamat datang! Silakan perkenalkan diri dan topik yang ingin dipelajari.',
};

function AvatarThread({ t, s, size = 40 }) {
  if (t.jenis === 'grup') {
    return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center' }}><Icon name="users" size={size * 0.5} color={C.ink} /></View>;
  }
  const a = (t.kunci && (AKUN[t.kunci] || cariAkun(t.kunci))) || {};
  return <Avatar nama={t.judul.replace(' (contoh)', '')} warna={a.warna || t.warna || C.teal2} size={size} status={t.jenis === 'orang' ? statusJikaTerhubung(s, t.kunci) : undefined} />;
}

function Lencana({ n, style }) {
  if (!n) return null;
  return (
    <View accessibilityLabel={`${n} belum dibaca`} style={[{ minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 5, backgroundColor: '#E0334C', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: C.card }, style]}>
      <T w={800} size={10} color="#fff">{n > 9 ? '9+' : n}</T>
    </View>
  );
}

function Pesan({ uid, muda, kepada }) {
  const { pesan, ubah } = usePesan(uid);
  const kom = useKomunitas(uid);
  const [aktif, setAktif] = useState(null);
  const [pilih, setPilih] = useState(false);
  const [hapus, setHapus] = useState(false);
  const [teks, setTeks] = useState('');
  const scroll = useRef(null);
  const aktifRef = useRef(null);
  aktifRef.current = aktif;
  const semua = semuaThread(pesan);
  const th = semua.find((t) => t.id === aktif);
  const daftar = (t) => daftarPesan(pesan, t);

  const buka = (id) => { setAktif(id); setHapus(false); setTeks((pesan._draft || {})[id] || ''); };
  const mulai = (k) => {
    const id = `t-p-${k.key}`;
    ubah((p) => ({ ...p, _hapus: (p._hapus || []).filter((x) => x !== id), _kontak: (p._kontak || []).some((c) => c.id === id) ? p._kontak : [...(p._kontak || []), { id, key: k.key, warna: k.warna, judul: k.nama, sub: k.peran || 'Koneksi' }] }));
    buka(id); setPilih(false);
  };
  useEffect(() => { if (kepada) mulai(kepada); }, [kepada]);

  // Pesan yang sedang dibuka dianggap sudah dibaca.
  const panjang = th ? daftar(th).length : 0;
  useEffect(() => {
    if (th && ((pesan._baca || {})[th.id] || 0) !== panjang) ubah((p) => ({ ...p, _baca: { ...(p._baca || {}), [th.id]: daftarPesan(p, th).length } }));
    setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 60);
  }, [aktif, panjang]);

  const ketik = (v) => { setTeks(v); if (th) ubah((p) => ({ ...p, _draft: { ...(p._draft || {}), [th.id]: v } })); };
  const hapusThread = () => {
    const id = th.id;
    ubah((p) => { const { [id]: _x, ...sisa } = p; return { ...sisa, _hapus: [...(p._hapus || []), id], _kontak: (p._kontak || []).filter((c) => c.id !== id), _draft: { ...(p._draft || {}), [id]: '' } }; });
    setAktif(null); setHapus(false); setTeks('');
  };

  if (!th && pilih) {
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12, gap: 8 }}>
        <Pressable accessibilityRole="button" onPress={() => setPilih(false)} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Icon name="back" size={18} color={C.teal} /><T w={800} size={13}>Pesan baru: pilih penerima</T></Pressable>
        {koneksiDasar(uid).filter((a) => !(kom.s.putus || {})[a.key]).slice(0, 12).map((a) => (
          <Pressable key={a.key} accessibilityRole="button" onPress={() => mulai(a)} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', padding: 8, borderRadius: 12, borderWidth: 1, borderColor: C.line, backgroundColor: C.card }}>
            <Avatar nama={a.nama} warna={a.warna} size={36} status={statusJikaTerhubung(kom.s, a.key)} />
            <View style={{ flex: 1 }}><T w={800} size={13} numberOfLines={1}>{a.nama}</T><T size={11} color={C.muted} numberOfLines={1}>{a.peran}</T></View>
          </Pressable>
        ))}
      </ScrollView>
    );
  }
  if (!th) {
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12, gap: 8 }}>
        <Pressable accessibilityRole="button" onPress={() => setPilih(true)} style={{ flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', minHeight: 40, borderRadius: 20, borderWidth: 1, borderColor: C.teal2 }}>
          <Icon name="plus" size={16} color={C.teal2} /><T w={800} size={13} color={C.teal2}>Pesan baru</T>
        </Pressable>
        {muda ? <T size={11} color={C.muted}>Pesan pribadi ke mentor dimatikan untuk pengguna di bawah 18 tahun.</T> : null}
        {semua.length === 0 ? <T size={12} color={C.muted}>Belum ada percakapan.</T> : null}
        {semua.map((t) => {
          const d = daftar(t);
          const terakhir = d[d.length - 1];
          const draft = ((pesan._draft || {})[t.id] || '').trim();
          const n = belumDibaca(pesan, t);
          return (
            <Pressable key={t.id} accessibilityRole="button" onPress={() => buka(t.id)}
              style={{ flexDirection: 'row', gap: 10, alignItems: 'center', padding: 10, borderRadius: 14, borderWidth: 1, borderColor: C.line, backgroundColor: C.card }}>
              <AvatarThread t={t} s={kom.s} />
              <View style={{ flex: 1 }}>
                <T w={800} size={13} numberOfLines={1}>{t.judul}</T>
                {t.jenis === 'grup' ? <T size={10} color={C.muted} numberOfLines={1}>{t.sub.replace('Grup · ', '')}</T> : null}
                {draft ? <T size={11} color={C.muted} numberOfLines={1}><T w={800} size={11} color="#E0334C">Draft: </T>{draft}</T>
                  : terakhir ? <T size={11} w={n ? 800 : 500} color={n ? C.ink : C.muted} numberOfLines={1}>{terakhir.teks}</T>
                  : <T size={11} color={C.muted} numberOfLines={1}>Pesan masih kosong</T>}
              </View>
              <Lencana n={n} style={{ borderWidth: 0 }} />
            </Pressable>
          );
        })}
      </ScrollView>
    );
  }
  const terkunci = muda && th.jenis === 'mentor';
  const kirim = () => {
    const t = teks.trim();
    if (!t || terkunci || !cekCaption(t).ok) return;
    const id = th.id, jenis = th.jenis;
    ubah((p) => ({ ...p, [id]: [...(p[id] || []), { dari: 'saya', teks: t }], _draft: { ...(p._draft || {}), [id]: '' } }));
    setTeks('');
    setTimeout(() => {
      ubah((p) => {
        const balasan = { dari: 'lain', nama: jenis === 'grup' ? 'Anggota contoh' : undefined, teks: `${BALAS[jenis]} (balasan contoh)` };
        const sudahDibuka = aktifRef.current === id;
        const next = { ...p, [id]: [...(p[id] || []), balasan] };
        if (sudahDibuka) next._baca = { ...(p._baca || {}), [id]: daftarPesan(next, th).length };
        return next;
      });
    }, 1400);
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: C.line }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Kembali ke daftar pesan" onPress={() => { setAktif(null); setHapus(false); }} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8 }}>
          <Icon name="back" size={18} color={C.teal} />
          <AvatarThread t={th} s={kom.s} size={34} />
          <View style={{ flex: 1 }}><T w={800} size={13} numberOfLines={1}>{th.judul}</T><T size={11} color={C.muted} numberOfLines={1}>{th.sub}</T></View>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Hapus percakapan" onPress={() => setHapus(!hapus)} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="trash" size={19} color={hapus ? '#C0392B' : C.muted} />
        </Pressable>
      </View>
      {hapus ? (
        <View style={{ padding: 12, gap: 8, backgroundColor: C.ground, borderBottomWidth: 1, borderBottomColor: C.line }}>
          <T size={12}>Hapus percakapan ini? Semua pesan di dalamnya akan hilang dari perangkat ini.</T>
          <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'flex-end' }}>
            <Pressable accessibilityRole="button" onPress={() => setHapus(false)} style={{ paddingHorizontal: 14, minHeight: 34, borderRadius: 17, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }}><T w={800} size={12} color={C.muted}>Batal</T></Pressable>
            <Pressable accessibilityRole="button" onPress={hapusThread} style={{ paddingHorizontal: 14, minHeight: 34, borderRadius: 17, backgroundColor: '#C0392B', alignItems: 'center', justifyContent: 'center' }}><T w={800} size={12} color="#fff">Hapus</T></Pressable>
          </View>
        </View>
      ) : null}
      <ScrollView ref={scroll} style={{ flex: 1 }} contentContainerStyle={{ padding: 12, gap: 8 }}>
        {daftar(th).length === 0 ? <T size={12} color={C.muted} style={{ textAlign: 'center', marginTop: 20 }}>Mulai percakapan dengan {th.judul}.</T> : null}
        {daftar(th).map((m, i) => (
          <FadeIn key={i} style={{ alignSelf: m.dari === 'saya' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
            <View style={{ backgroundColor: m.dari === 'saya' ? C.teal : C.card, borderWidth: m.dari === 'saya' ? 0 : 1, borderColor: C.line, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8 }}>
              {m.nama ? <T w={700} size={11} color={C.teal}>{m.nama}</T> : null}
              <T size={13} color={m.dari === 'saya' ? C.white : C.ink}>{m.teks}</T>
            </View>
          </FadeIn>
        ))}
      </ScrollView>
      {terkunci ? <View style={{ padding: 12 }}><T size={12} color={C.warn}>Pesan pribadi ke mentor dimatikan untuk pengguna di bawah 18 tahun. Gunakan grup yang disetujui.</T></View> : (
        <View style={{ flexDirection: 'row', gap: 8, padding: 10, borderTopWidth: 1, borderTopColor: C.line }}>
          <TextInput value={teks} onChangeText={ketik} placeholder="Tulis pesan…" placeholderTextColor="#8A9693" accessibilityLabel="Tulis pesan" onSubmitEditing={kirim}
            style={{ flex: 1, minHeight: 40, borderRadius: 12, borderWidth: 1, borderColor: C.line, paddingHorizontal: 12, fontFamily: F.medium, fontSize: 13, color: C.ink, backgroundColor: C.card }} />
          <Pressable accessibilityRole="button" accessibilityLabel="Kirim pesan" onPress={kirim} style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="send" size={18} color={C.white} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

// Jendela menempel di tepi bawah seperti LinkedIn: "Pesan" di kanan, "Tanya myCITA" (agen AI) di sebelah kirinya.
// Kepala jendela selalu terlihat; ketuk untuk membuka/menutup. Di ponsel, dua kepala berdampingan di atas menu bawah
// dan jendela yang terbuka memenuhi layar.
function Jendela({ judul, sub, ikon, avatar, buka, onToggle, lebarJendela, tinggi, kanan, bawah, children, aksen }) {
  return (
    <View style={{ position: 'absolute', right: kanan, bottom: bawah, width: lebarJendela, backgroundColor: C.card, borderTopLeftRadius: 12, borderTopRightRadius: 12, borderWidth: 1, borderBottomWidth: 0, borderColor: C.line, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 14, shadowOffset: { width: 0, height: -2 }, elevation: 12, height: buka ? tinggi : 52 }}>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: buka }} accessibilityLabel={judul} onPress={onToggle}
        style={({ hovered }) => ({ height: 52, flexDirection: 'row', alignItems: 'center', gap: 10, paddingLeft: 12, paddingRight: 20, backgroundColor: buka ? (aksen || C.card) : (hovered ? C.ground : C.card), borderBottomWidth: buka ? 1 : 0, borderBottomColor: C.line })}>
        {avatar || (
          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: aksen || C.teal, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={ikon} size={17} color={C.gold} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <T w={800} size={14} color={buka && aksen ? C.white : C.ink} numberOfLines={1}>{judul}</T>
          {sub && buka ? <T size={10} color={aksen ? 'rgba(255,255,255,0.8)' : C.muted} numberOfLines={1}>{sub}</T> : null}
        </View>
        <Icon name={buka ? 'down' : 'up'} size={18} color={buka && aksen ? C.white : C.muted} />
      </Pressable>
      {buka ? <View style={{ flex: 1 }}>{children}</View> : null}
    </View>
  );
}

// Dua tab saling menimpa di tepi bawah: sisi kiri miring, sisi kanan "Pesan" tegak lurus (rapat ke scroll bar).
const MIRING = 14;
const TINGGI_TAB = 44;
function Tab({ judul, ikon, avatar, aksen, aktif, onPress, lebar, atas }) {
  const w = lebar, h = TINGGI_TAB, d = MIRING;
  // Sudut atas melengkung; sisi kiri miring; sisi kanan "My Pesan" tegak, sisi kanan tab AI miring.
  const kiri = `M0,${h} L${d * 0.86},6 Q${d},0 ${d + 9},0`;
  const titik = atas ? `${kiri} L${w - 9},0 Q${w},0 ${w},9 L${w},${h} Z` : `${kiri} L${w - 6},0 Q${w},0 ${w - 1.5},6 L${w - d},${h} Z`;
  const isi = aksen ? (aktif ? C.teal2 : C.teal) : (aktif ? C.soft : C.card);
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={judul} accessibilityState={{ expanded: aktif }} onPress={onPress}
      style={{ width: w, height: h, marginLeft: atas ? -d : 0, zIndex: atas ? 2 : 1 }}>
      <Svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0 }}>
        <Path d={titik} fill={isi} stroke={aksen ? C.teal : C.line} strokeWidth={1} />
      </Svg>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: d + 12, paddingRight: atas ? 16 : d + 26 }}>
        {avatar || <Icon name={ikon} size={17} color={aksen ? C.gold : C.teal2} />}
        <T w={800} size={13} color={aksen ? C.white : C.ink} numberOfLines={1} style={{ flex: 1 }}>{judul}</T>
        <Icon name={aktif ? 'down' : 'up'} size={15} color={aksen ? C.white : C.muted} />
      </View>
    </Pressable>
  );
}

// Lebar scroll bar bawaan peramban (0 di HP/Mac overlay), supaya tab rapat ke tepinya.
function lebarScrollbar() {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return 0;
  try {
    const el = document.createElement('div');
    el.style.cssText = 'position:absolute;top:-9999px;width:60px;height:60px;overflow:scroll';
    document.body.appendChild(el);
    const w = el.offsetWidth - el.clientWidth;
    document.body.removeChild(el);
    return w;
  } catch (e) { return 0; }
}

export default function Dock({ open, setOpen, lebar, adaMenuBawah }) {
  const app = useApp();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const muda = app.activeUserId === 'dini';
  const nama = profilPengguna(app.activeUserId).nama;
  const st = open || { ai: false, pesan: false };
  const buka = st.ai ? 'ai' : st.pesan ? 'pesan' : null;
  const toggle = (k) => setOpen({ ai: false, pesan: false, [k]: buka !== k });

  const { pesan: dataPesan } = usePesan(app.activeUserId);
  const baru = totalBelumDibaca(dataPesan);
  const avatarPesan = (
    <View>
      <Avatar nama={nama} warna={C.gold} size={24} />
      <Lencana n={baru} style={{ position: 'absolute', top: -9, right: -12 }} />
      <View style={{ position: 'absolute', right: -1, bottom: -1, width: 9, height: 9, borderRadius: 5, backgroundColor: '#2BA84A', borderWidth: 2, borderColor: C.card }} />
    </View>
  );
  const bawahMenu = lebar ? 0 : (adaMenuBawah ? 70 + Math.max(insets.bottom, 8) : insets.bottom);
  const lebarTab = lebar ? 210 : (width + MIRING) / 2;
  const kanan = lebar ? lebarScrollbar() : 0;
  const isi = buka === 'ai' ? <Chat embedded go={() => {}} /> : <Pesan uid={app.activeUserId} muda={muda} kepada={st.kepada} />;
  const panel = buka ? (
    <Jendela judul={buka === 'ai' ? 'Tanya myCITA' : 'My Pesan'} sub={buka === 'ai' ? 'Agen AI · jawaban bisa butuh beberapa detik' : undefined} ikon="spark" aksen={buka === 'ai' ? C.teal : undefined}
      avatar={buka === 'pesan' ? avatarPesan : undefined} buka onToggle={() => toggle(buka)}
      lebarJendela={lebar ? lebarTab * 2 - MIRING * 2 : width} tinggi={lebar ? Math.min(520, height - 130) : height - bawahMenu - insets.top - 56}
      kanan={kanan} bawah={bawahMenu + 44}>
      {isi}
    </Jendela>
  ) : null;
  return (
    <>
      {panel}
      <View style={{ position: 'absolute', right: kanan, bottom: bawahMenu, flexDirection: 'row', alignItems: 'flex-end' }}>
        <Tab judul="Tanya myCITA" ikon="spark" aksen aktif={buka === 'ai'} onPress={() => toggle('ai')} lebar={lebarTab} />
        <Tab judul="My Pesan" avatar={avatarPesan} aktif={buka === 'pesan'} onPress={() => toggle('pesan')} lebar={lebarTab} atas />
      </View>
    </>
  );
}
