// Token desain CITA — sama dengan mockup di kanvas desain.
import React from 'react';

export const C = {
  teal: '#0F4C47',
  teal2: '#1F6F66',
  soft: '#E3EFEC',
  gold: '#F2A93B',
  goldSoft: '#FDF1DC',
  goldLine: '#F3DDB4',
  ground: '#F4F6F5',
  card: '#FFFFFF',
  ink: '#14211F',
  muted: '#55625F',
  line: '#DCE3E1',
  warn: '#9A4610',
  warnSoft: '#FBEBDD',
  white: '#FFFFFF',
};

const LIGHT = { ...C };
const DARK = { ...C, soft: '#1E3A36', goldSoft: '#3A2E17', goldLine: '#5A4620', ground: '#0E1514', card: '#18221F', ink: '#E8EEEC', muted: '#9DB0AC', line: '#2B3836', warn: '#E8A06A', warnSoft: '#3A2418', teal2: '#2C8A7E' };
// Ganti tema: ubah nilai warna bersama, lalu pohon tampilan dipasang ulang (key di App).
export function setTema(mode) { Object.assign(C, mode === 'gelap' ? DARK : LIGHT); }
export const TemaCtx = React.createContext({ tema: 'terang', ganti: () => {} });

export const F = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
};

export const R = { sm: 10, md: 14, lg: 20, xl: 24, pill: 999 };
