import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../state/AppContext';
import { IconButton, RichText, T } from '../components/ui';
import Icon from '../components/Icon';
import { C, F } from '../theme';

const SUGGEST = [
  'Aku kerja di gudang, mau pindah karier. Mulai dari mana?',
  'Bisa nggak aku capai tujuanku tepat waktu?',
  'Kalau gajiku naik 2 juta gimana?',
  'Hutang mana yang harus dilunasi dulu?',
  'Kalau aku mau beli rumah subsidi?',
];

export default function Chat({ go }) {
  const app = useApp();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const scroll = useRef(null);

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
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.line, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <IconButton icon="back" label="Kembali" onPress={() => go('home')} />
        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center' }}>
          <T w={800} size={10} color={C.gold}>myCITA</T>
        </View>
        <View style={{ flex: 1 }}>
          <T w={800} size={16}>Tanya myCITA</T>
          <T size={12} color={C.muted}>{app.live ? 'Terhubung ke Langflow · bisa butuh 20–60 detik' : 'Mode demo, jawaban contoh'}</T>
        </View>
        {app.chat.length ? <IconButton icon="trash" label="Hapus riwayat chat" onPress={() => app.setChat([])} /> : null}
      </View>

      <ScrollView ref={scroll} style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12 }} keyboardShouldPersistTaps="handled">
        {app.chat.length === 0 ? (
          <View style={{ gap: 12, paddingTop: 8 }}>
            <T w={800} size={20}>Mau tanya apa hari ini?</T>
            <T size={14} color={C.muted}>myCITA menjawab memakai datamu dan simulasi yang dihitung pasti, bukan tebakan.</T>
            {SUGGEST.map((s) => (
              <Pressable key={s} onPress={() => send(s)} accessibilityRole="button"
                style={{ padding: 14, borderRadius: 16, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Icon name="chat" size={18} color={C.teal} /><T size={14} style={{ flex: 1 }}>{s}</T>
              </Pressable>
            ))}
          </View>
        ) : null}
        {app.chat.map((m) => {
          if (m.role === 'user') {
            return (
              <View key={m.id} style={{ alignSelf: 'flex-end', maxWidth: '82%', backgroundColor: C.teal, paddingHorizontal: 14, paddingVertical: 11, borderRadius: 18, borderBottomRightRadius: 4 }}>
                <T size={14} color={C.white} style={{ lineHeight: 21 }}>{m.text}</T>
              </View>
            );
          }
          const isErr = m.role === 'error';
          return (
            <View key={m.id} style={{ alignSelf: 'flex-start', maxWidth: '90%', backgroundColor: isErr ? C.goldSoft : C.card, borderWidth: 1, borderColor: isErr ? C.goldLine : C.line, paddingHorizontal: 14, paddingVertical: 11, borderRadius: 18, borderBottomLeftRadius: 4 }}>
              {isErr ? <T size={13} color={C.warn}>{m.text}</T> : <RichText text={m.text} />}
            </View>
          );
        })}
        {sending ? (
          <View style={{ alignSelf: 'flex-start', maxWidth: '90%', backgroundColor: C.card, borderWidth: 1, borderColor: C.line, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 18, borderBottomLeftRadius: 4, gap: 6 }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <ActivityIndicator color={C.teal} size="small" />
              <T size={13} color={C.muted}>CITA sedang menjawab…</T>
            </View>
            {app.live ? (
              <T size={11} color={C.muted}>Menggunakan Gemini AI · bisa butuh 20–60 detik. Jangan tutup layar ini.</T>
            ) : null}
          </View>
        ) : null}
      </ScrollView>

      <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: insets.bottom + 12, backgroundColor: C.ground, flexDirection: 'row', gap: 10, alignItems: 'flex-end' }}>
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
