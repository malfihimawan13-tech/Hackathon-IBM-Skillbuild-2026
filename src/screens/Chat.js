import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../state/AppContext';
import { FadeIn, IconButton, RichText, T, TypingDots } from '../components/ui';
import Icon from '../components/Icon';
import { C, F } from '../theme';
import { findPersona } from '../state/persona';

// Pertanyaan umum untuk pengguna baru (bukan persona contoh), tanpa menyebut gudang/hutang/angka tertentu
const SUGGEST_UMUM = [
  'Bagaimana kondisi keuanganku sekarang?',
  'Tujuanku bisa tercapai tepat waktu?',
  'Bagaimana kalau penghasilanku naik bulan depan?',
  'Apa langkah pertama yang harus aku ambil?',
  'Bagaimana cara menabung lebih efektif?',
];

// Langkah yang ditampilkan bergulir saat menunggu jawaban, supaya jeda terasa berjalan, bukan macet.
const LANGKAH = [
  'Membaca pertanyaanmu…',
  'Mengambil datamu…',
  'Menghitung simulasi dengan data bersumber…',
  'Menyusun jawaban yang mudah dipahami…',
  'Hampir selesai, merapikan jawaban…',
];

function Menunggu({ live }) {
  const [det, setDet] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDet((d) => d + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const idx = live ? Math.min(LANGKAH.length - 1, Math.floor(det / 5)) : 1;
  return (
    <FadeIn style={{ alignSelf: 'flex-start', maxWidth: '90%' }}>
      <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.line, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 18, borderBottomLeftRadius: 4, gap: 8 }}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <TypingDots />
          <T size={13} color={C.ink} w={600}>{LANGKAH[idx]}</T>
        </View>
        {live ? <T size={11} color={C.muted}>Mohon tunggu sebentar, jangan tutup layar ini.</T> : null}
      </View>
    </FadeIn>
  );
}

export default function Chat({ go, embedded = false }) {
  const app = useApp();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const scroll = useRef(null);

  // Pertanyaan contoh: pakai milik persona aktif jika ada, fallback ke pertanyaan umum
  const persona = findPersona(app.activeUserId);
  const suggestList = persona?.pertanyaanChat || SUGGEST_UMUM;

  useEffect(() => { setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 80); }, [app.chat.length, sending]);

  const send = async (q = text) => {
    const msg = q.trim();
    if (!msg || sending) return;
    setText(''); setSending(true);
    await app.askCoach(msg);
    setSending(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.ground }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ paddingTop: embedded ? 10 : insets.top + 8, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.line, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {embedded ? null : <IconButton icon="back" label="Kembali" onPress={() => go('home')} />}
        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center' }}>
          <T w={800} size={10} color={C.gold}>myCITA</T>
        </View>
        <View style={{ flex: 1 }}>
          <T w={800} size={16}>Tanya myCITA</T>
          <T size={12} color={C.muted}>{app.live ? 'Jawaban bisa butuh beberapa detik' : 'Mode demo, jawaban contoh'}</T>
        </View>
        {app.chat.length ? <IconButton icon="trash" label="Hapus riwayat chat" onPress={() => app.setChat([])} /> : null}
      </View>

      <ScrollView ref={scroll} style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12 }} keyboardShouldPersistTaps="handled">
        {app.chat.length === 0 ? (
          <View style={{ gap: 12, paddingTop: 8 }}>
            <T w={800} size={20}>Mau tanya apa hari ini?</T>
            <T size={14} color={C.muted}>myCITA menjawab memakai datamu dan simulasi yang dihitung pasti, bukan tebakan.</T>
            {suggestList.map((s, i) => (
              <FadeIn key={s} delay={80 * i}>
              <Pressable onPress={() => send(s)} accessibilityRole="button"
                style={{ padding: 14, borderRadius: 16, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Icon name="chat" size={18} color={C.teal} /><T size={14} style={{ flex: 1 }}>{s}</T>
              </Pressable>
              </FadeIn>
            ))}
          </View>
        ) : null}
        {app.chat.map((m) => {
          if (m.role === 'user') {
            return (
              <FadeIn key={m.id} style={{ alignSelf: 'flex-end', maxWidth: '82%' }}>
                <View style={{ backgroundColor: C.teal, paddingHorizontal: 14, paddingVertical: 11, borderRadius: 18, borderBottomRightRadius: 4 }}>
                  <T size={14} color={C.white} style={{ lineHeight: 21 }}>{m.text}</T>
                </View>
              </FadeIn>
            );
          }
          const isErr = m.role === 'error';
          return (
            <FadeIn key={m.id} style={{ alignSelf: 'flex-start', maxWidth: '92%' }}>
              <View style={{ backgroundColor: isErr ? C.goldSoft : C.card, borderWidth: 1, borderColor: isErr ? C.goldLine : C.line, paddingHorizontal: 14, paddingVertical: 11, borderRadius: 18, borderBottomLeftRadius: 4 }}>
                {isErr ? <T size={13} color={C.warn}>{/langflow|flow|endpoint|gemini|ngrok|server/i.test(m.text || '') ? 'Maaf, Coach sedang tidak bisa dihubungi. Coba lagi sebentar lagi.' : m.text}</T> : <RichText text={m.text} />}
              </View>
            </FadeIn>
          );
        })}
        {sending ? <Menunggu live={app.live} /> : null}
      </ScrollView>

      {app.chat.length > 0 && !sending ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled"
          style={{ flexGrow: 0, backgroundColor: C.ground }} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, gap: 8 }}>
          {suggestList.map((q) => (
            <Pressable key={q} onPress={() => send(q)} accessibilityRole="button"
              style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, maxWidth: 260 }}>
              <T size={12} w={600} color={C.teal} numberOfLines={1}>{q}</T>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}
      <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: embedded ? 12 : insets.bottom + 12, backgroundColor: C.ground, flexDirection: 'row', gap: 10, alignItems: 'flex-end' }}>
        <TextInput accessibilityLabel="Tulis pertanyaan" value={text} onChangeText={setText} placeholder="Tanya soal keuanganmu…" placeholderTextColor="#8A9693"
          multiline style={{ flex: 1, minHeight: 50, maxHeight: 120, borderRadius: 16, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12, fontFamily: F.medium, fontSize: 14, color: C.ink }} />
        <Pressable accessibilityRole="button" accessibilityLabel="Kirim" onPress={() => send()} disabled={sending || !text.trim()}
          style={{ width: 50, height: 50, borderRadius: 16, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center', opacity: sending || !text.trim() ? 0.5 : 1 }}>
          <Icon name="send" size={20} color={C.white} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
