import React from 'react';
import { Platform } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

// Ikon garis sederhana (stroke), konsisten dengan mockup desain.
const P = (d) => ({ t: 'p', d });
const Ci = (cx, cy, r) => ({ t: 'c', cx, cy, r });
const Re = (x, y, w, h, rx) => ({ t: 'r', x, y, w, h, rx });

const ICONS = {
  home: [P('M3 10.5 12 3l9 7.5'), P('M5 9.5V20h14V9.5'), P('M10 20v-6h4v6')],
  target: [Ci(12, 12, 9), Ci(12, 12, 5), Ci(12, 12, 1.5)],
  heart: [P('M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z')],
  bubble: [P('M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z'), P('M8 10h8')],
  bagikan: [P('M8 10H6v10h12V10h-2'), P('M12 15V4'), P('m8.5 7.5 3.5-3.5 3.5 3.5')],
  bell: [P('M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z'), P('M10 21h4')],
  headset: [P('M4 14v-2a8 8 0 0 1 16 0v2'), Re(3, 14, 4, 6, 1.5), Re(17, 14, 4, 6, 1.5), P('M19 20a4 4 0 0 1-4 2h-2')],
  moon: [P('M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z')],
  sun: [Ci(12, 12, 4), P('M12 2v2'), P('M12 20v2'), P('M2 12h2'), P('M20 12h2'), P('m5 5 1.4 1.4'), P('m17.6 17.6 1.4 1.4'), P('m5 19 1.4-1.4'), P('m17.6 6.4 1.4-1.4')],
  gambar: [Re(3, 5, 18, 14, 2), Ci(8.5, 10, 1.5), P('m21 16-5-5-8 8')],
  video: [Re(3, 6, 13, 12, 2), P('m16 10 5-3v10l-5-3')],
  klip: [P('M20 11.5 12 19.5a5 5 0 0 1-7-7l8-8a3.3 3.3 0 0 1 4.7 4.7l-8 8a1.7 1.7 0 0 1-2.4-2.4L14 7')],
  bellOff: [P('M6 16v-5a6 6 0 0 1 9.5-4.8'), P('M18 11v5l1.5 2H7'), P('M10 21h4'), P('M4 4l16 16')],
  kunjungi: [P('M14 4h6v6'), P('M20 4 11 13'), P('M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5')],
  up: [P('m5 15 7-7 7 7')],
  down: [P('m5 9 7 7 7-7')],
  like: [P('M7 11v9H4v-9z'), P('M7 11l4-7a2 2 0 0 1 2 2v4h5.5a2 2 0 0 1 2 2.3l-1 6A2 2 0 0 1 17.5 20H7')],
  share: [P('M4 12V9a3 3 0 0 1 3-3h11'), P('m15 3 3 3-3 3'), P('M20 12v3a3 3 0 0 1-3 3H6'), P('m9 21-3-3 3-3')],
  globe: [Ci(12, 12, 9), P('M3 12h18'), P('M12 3a14 14 0 0 1 0 18'), P('M12 3a14 14 0 0 0 0 18')],
  users: [Ci(9, 8, 3.5), P('M2.5 20c1-3.8 3.5-5.5 6.5-5.5s5.5 1.7 6.5 5.5'), Ci(17, 9, 2.8), P('M17 14.3c2.3.3 4 1.9 4.8 4.7')],
  chat: [P('M4 5h16v11H9l-5 4z'), P('M8 9.5h8'), P('M8 12.5h5')],
  chart: [P('M4 20V10'), P('M10 20V4'), P('M16 20v-7'), P('M22 20H2')],
  user: [Ci(12, 8, 4), P('M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6')],
  wallet: [Re(3, 6, 18, 13, 2), P('M3 10h18'), P('M16 14.5h2')],
  search: [Ci(11, 11, 7), P('m20 20-4-4')],
  back: [P('M15 5 8 12l7 7')],
  plus: [P('M12 5v14'), P('M5 12h14')],
  minus: [P('M5 12h14')],
  close: [P('M6 6l12 12'), P('M18 6 6 18')],
  send: [P('M4 12 20 4l-6 16-3-7z')],
  shield: [P('M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z'), P('m9 12 2 2 4-4')],
  spark: [P('M12 3v4'), P('M12 17v4'), P('M3 12h4'), P('M17 12h4'), P('m6 6 2.5 2.5'), P('m15.5 15.5 2.5 2.5'), P('m6 18 2.5-2.5'), P('m15.5 8.5 2.5-2.5')],
  car: [P('M5 16h14'), P('M4 16v-4l2-5h12l2 5v4'), Ci(7.5, 17, 1.8), Ci(16.5, 17, 1.8)],
  ring: [Ci(12, 14, 6), P('m9 4 3 4 3-4')],
  house: [P('M3 11 12 4l9 7'), P('M6 10v10h12V10')],
  bike: [Ci(6, 16, 3.5), Ci(18, 16, 3.5), P('M6 16 10 8h5l3 8'), P('M9 8h3')],
  book: [P('M4 5h7v15H4z'), P('M13 5h7v15h-7z')],
  umbrella: [P('M3 12a9 9 0 0 1 18 0z'), P('M12 12v7a2 2 0 0 1-4 0')],
  check: [P('m5 12 4.5 4.5L19 7')],
  alert: [P('M12 4 2.5 20h19z'), P('M12 10v4.5'), P('M12 17.2v.3')],
  trash: [P('M4 7h16'), P('M9 7V4h6v3'), P('M6 7l1 13h10l1-13')],
  refresh: [P('M20 11a8 8 0 1 0-2.3 5.7'), P('M20 5v6h-6')],
  link: [P('M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1'), P('M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1')],
  edit: [P('M4 20h4L19 9l-4-4L4 16z'), P('m13.5 6.5 4 4')],
  piala: [P('M8 4h8v6a4 4 0 0 1-8 0z'), P('M8 6H4v1a4 4 0 0 0 4 4'), P('M16 6h4v1a4 4 0 0 1-4 4'), P('M12 14v4'), P('M8 20h8')],
  kalender: [Re(3, 5, 18, 16, 2), P('M3 10h18'), P('M8 3v4'), P('M16 3v4')],
  flag: [P('M5 21V4'), P('M5 4h11l-2 4 2 4H5')],
  briefcase: [Re(3, 7, 18, 13, 2), P('M9 7V5h6v2'), P('M3 12h18')],
  store: [P('M4 10v10h16V10'), P('M3 10l2-6h14l2 6z'), P('M10 20v-5h4v5')],
  route: [Ci(6, 18, 2.2), Ci(18, 6, 2.2), P('M8 18h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7')],
  'chevron-down': [P('M6 9l6 6 6-6')],
  'chevron-up': [P('M18 15l-6-6-6 6')],
};

export function iconForCategory(kat) {
  return { rumah: 'house', rumah_subsidi: 'house', mobil: 'car', motor: 'bike', menikah: 'ring', pendidikan: 'book', dana_darurat: 'umbrella' }[kat] || 'flag';
}

export default function Icon({ name, size = 22, color = '#14211F', strokeWidth = 1.9, fill = 'none' }) {
  const parts = ICONS[name] || ICONS.flag;
  const common = { stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', fill };
  // accessibilityElementsHidden / importantForAccessibility são props nativas; não existem no DOM web
  const a11yProps = Platform.OS !== 'web'
    ? { accessibilityElementsHidden: true, importantForAccessibility: 'no' }
    : { 'aria-hidden': true };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...a11yProps}>
      {parts.map((p, i) => {
        if (p.t === 'c') return <Circle key={i} cx={p.cx} cy={p.cy} r={p.r} {...common} />;
        if (p.t === 'r') return <Rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx={p.rx} {...common} />;
        return <Path key={i} d={p.d} {...common} />;
      })}
    </Svg>
  );
}
