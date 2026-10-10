import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '../components/ui';
import { C, R } from '../theme';
import { PERSONAS } from '../state/persona';

function PersonaCard({ persona, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Masuk sebagai ${persona.nama}, ${persona.usia}, ${persona.kota}, ${persona.deskripsi}`}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: 16,
        borderRadius: R.xl,
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.line,
        opacity: pressed ? 0.82 : 1,
      })}
    >
      {/* Avatar */}
      <View style={{
        width: 52, height: 52, borderRadius: R.pill,
        backgroundColor: persona.avatarBg,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <T w={800} size={20} color={persona.avatarColor}>{persona.inisial}</T>
      </View>

      {/* Info */}
      <View style={{ flex: 1, gap: 3 }}>
        <T w={800} size={17}>{persona.nama}</T>
        <T size={12} color={C.muted}>{persona.usia} · {persona.kota}</T>
        <T w={700} size={12} color={C.teal}>{persona.deskripsi}</T>
      </View>

      {/* Chevron */}
      <T size={22} color={C.muted}>›</T>
    </Pressable>
  );
}

export default function Masuk({ onLogin }) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.ground }}
      contentContainerStyle={{ paddingTop: Math.max(insets.top, 48) + 16, paddingBottom: Math.max(insets.bottom, 24) + 16, paddingHorizontal: 24 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Logo + heading */}
      <View style={{ alignItems: 'center', gap: 10, marginBottom: 32 }}>
        <View style={{
          width: 76, height: 76, borderRadius: 24,
          backgroundColor: C.teal,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <T w={800} size={18} color={C.gold}>myCITA</T>
        </View>
        <T w={800} size={26} style={{ letterSpacing: -0.4 }}>Selamat datang</T>
        <T size={14} color={C.muted} style={{ textAlign: 'center', lineHeight: 21 }}>
          Capai Impian, Tentukan Arah.{'\n'}Pilih pengguna untuk masuk.
        </T>
      </View>

      {/* Kartu persona */}
      <View style={{ gap: 12 }}>
        {PERSONAS.map((p) => (
          <PersonaCard key={p.userId} persona={p} onPress={() => onLogin(p.userId)} />
        ))}
      </View>

      {/* Catatan privasi */}
      <View style={{ marginTop: 28, padding: 14, borderRadius: R.md, backgroundColor: C.card, borderWidth: 1, borderColor: C.line }}>
        <T size={12} color={C.muted} style={{ lineHeight: 18, textAlign: 'center' }}>
          Akun contoh untuk demo, tanpa kata sandi.{'\n'}Tanpa KTP, rekening, atau PIN.
        </T>
      </View>
    </ScrollView>
  );
}
