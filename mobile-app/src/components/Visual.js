import React from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Polygon, Rect, Stop } from 'react-native-svg';
import Icon from './Icon';
import { FadeIn, T } from './ui';
import { C } from '../theme';

// Warna aksen tambahan untuk ikon berwarna (selaras dengan palet utama).
export const AKSEN = {
  teal: { bg: '#E3EFEC', fg: '#0F4C47' },
  gold: { bg: '#FDF1DC', fg: '#B77410' },
  coral: { bg: '#FBE7DF', fg: '#C2502B' },
  ungu: { bg: '#ECE8F8', fg: '#5B46B8' },
  biru: { bg: '#E1EEF9', fg: '#1C6BA8' },
};

export function IkonBulat({ icon, aksen = 'teal', size = 36 }) {
  const a = AKSEN[aksen];
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.34, backgroundColor: a.bg, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} size={size * 0.52} color={a.fg} />
    </View>
  );
}

// Ilustrasi asli: jalan berkelok menuju bendera di atas bukit, dengan matahari dan percikan bintang.
export function Ilustrasi({ width = 150, height = 112 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 160 120">
      <Circle cx="128" cy="20" r="11" fill="#F2A93B" opacity="0.95" />
      <Circle cx="128" cy="20" r="17" fill="#F2A93B" opacity="0.18" />
      <Path d="M0 120 L0 84 Q38 52 82 78 T160 62 L160 120 Z" fill="#FFFFFF" opacity="0.10" />
      <Path d="M0 120 L0 100 Q50 76 100 98 T160 90 L160 120 Z" fill="#FFFFFF" opacity="0.14" />
      <Path d="M26 118 C58 102 36 88 78 80 S122 64 116 42" stroke="#F2A93B" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 7" fill="none" />
      <Path d="M116 44 L116 22" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <Polygon points="117,22 136,28 117,35" fill="#F2A93B" />
      <Circle cx="34" cy="30" r="2.2" fill="#FFFFFF" opacity="0.85" />
      <Circle cx="58" cy="14" r="1.6" fill="#FFFFFF" opacity="0.6" />
      <Circle cx="92" cy="30" r="1.8" fill="#FFFFFF" opacity="0.7" />
      <Circle cx="12" cy="52" r="1.6" fill="#FFFFFF" opacity="0.5" />
    </Svg>
  );
}

// Banner sambutan dengan gradasi dan ilustrasi, pengganti salam polos di Beranda.
export function HeroBanner({ nama, subjudul, tombol, onPress }) {
  return (
    <FadeIn>
      <View style={{ borderRadius: 24, overflow: 'hidden', minHeight: 150 }}>
        <Svg style={{ position: 'absolute', left: 0, top: 0 }} width="100%" height="100%" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="gHero" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#0B3B37" />
              <Stop offset="0.6" stopColor="#0F4C47" />
              <Stop offset="1" stopColor="#1F6F66" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#gHero)" />
        </Svg>
        <View style={{ position: 'absolute', right: -6, bottom: -4 }} pointerEvents="none"><Ilustrasi /></View>
        <View style={{ padding: 18, paddingRight: 120, gap: 6 }}>
          <T size={12} color="rgba(255,255,255,0.8)" w={600}>Selamat datang kembali 👋</T>
          <T w={800} size={26} color={C.white} style={{ letterSpacing: -0.4 }}>Halo, {nama}</T>
          <T size={13} color="rgba(255,255,255,0.88)" numberOfLines={2}>{subjudul}</T>
          {tombol ? (
            <Pressable accessibilityRole="button" onPress={onPress}
              style={{ alignSelf: 'flex-start', marginTop: 8, flexDirection: 'row', gap: 6, alignItems: 'center', backgroundColor: C.gold, paddingHorizontal: 14, minHeight: 38, borderRadius: 999 }}>
              <T w={800} size={13} color={C.ink}>{tombol}</T>
              <Icon name="route" size={16} color={C.ink} />
            </Pressable>
          ) : null}
        </View>
      </View>
    </FadeIn>
  );
}

// Pintasan berikon warna ke fitur utama.
export function Pintasan({ go }) {
  const item = [
    { k: 'karirbisnis', l: 'Karir & Bisnis', i: 'briefcase', a: 'teal' },
    { k: 'roadmap', l: 'Roadmap', i: 'route', a: 'gold' },
    { k: 'keuangan', l: 'Keuangan', i: 'wallet', a: 'coral' },
    { k: 'komunitas', l: 'Komunitas', i: 'users', a: 'ungu' },
  ];
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {item.map((x, n) => (
        <FadeIn key={x.k} delay={60 * n} style={{ flex: 1 }}>
          <Pressable accessibilityRole="button" accessibilityLabel={x.l} onPress={() => go(x.k)}
            style={({ pressed }) => ({ alignItems: 'center', gap: 8, paddingVertical: 12, borderRadius: 18, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, opacity: pressed ? 0.85 : 1 })}>
            <IkonBulat icon={x.i} aksen={x.a} size={42} />
            <T w={700} size={11} style={{ textAlign: 'center' }}>{x.l}</T>
          </Pressable>
        </FadeIn>
      ))}
    </View>
  );
}
