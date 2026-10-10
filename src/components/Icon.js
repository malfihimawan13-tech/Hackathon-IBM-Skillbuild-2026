import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

// Ikon garis sederhana (stroke), konsisten dengan mockup desain.
const P = (d) => ({ t: 'p', d });
const Ci = (cx, cy, r) => ({ t: 'c', cx, cy, r });
const Re = (x, y, w, h, rx) => ({ t: 'r', x, y, w, h, rx });

const ICONS = {
  home: [P('M3 10.5 12 3l9 7.5'), P('M5 9.5V20h14V9.5'), P('M10 20v-6h4v6')],
  target: [Ci(12, 12, 9), Ci(12, 12, 5), Ci(12, 12, 1.5)],
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
  flag: [P('M5 21V4'), P('M5 4h11l-2 4 2 4H5')],
  briefcase: [Re(3, 7, 18, 13, 2), P('M9 7V5h6v2'), P('M3 12h18')],
  store: [P('M4 10v10h16V10'), P('M3 10l2-6h14l2 6z'), P('M10 20v-5h4v5')],
  route: [Ci(6, 18, 2.2), Ci(18, 6, 2.2), P('M8 18h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7')],
};

export function iconForCategory(kat) {
  return { rumah: 'house', rumah_subsidi: 'house', mobil: 'car', motor: 'bike', menikah: 'ring', pendidikan: 'book', dana_darurat: 'umbrella' }[kat] || 'flag';
}

export default function Icon({ name, size = 22, color = '#14211F', strokeWidth = 1.9 }) {
  const parts = ICONS[name] || ICONS.flag;
  const common = { stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden importantForAccessibility="no">
      {parts.map((p, i) => {
        if (p.t === 'c') return <Circle key={i} cx={p.cx} cy={p.cy} r={p.r} {...common} />;
        if (p.t === 'r') return <Rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx={p.rx} {...common} />;
        return <Path key={i} d={p.d} {...common} />;
      })}
    </Svg>
  );
}
