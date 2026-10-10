import React, { useMemo } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import Svg, { Circle, Line, Path, Polygon, Polyline, Rect, Text as SvgText } from 'react-native-svg';
import { useApp } from '../state/AppContext';
import { DEMO } from '../api/demoData';
import { findPersona } from '../state/persona';
import { T } from '../components/ui';
import Icon from '../components/Icon';
import { C, R } from '../theme';
import { rpShort } from '../utils/format';

// ── shared helpers ────────────────────────────────────────────────
function Card({ children, style }) {
  return (
    <View style={[{ backgroundColor: C.white, borderRadius: R.xl, borderWidth: 1, borderColor: C.line, padding: 16 }, style]}>
      {children}
    </View>
  );
}

function Row({ label, value, bold, tealValue }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
      <T size={13} color={C.muted}>{label}</T>
      <T size={13} w={bold ? 800 : 700} color={tealValue ? C.teal : C.ink} style={{ textAlign: 'right', flexShrink: 1 }}>{value}</T>
    </View>
  );
}

function Pill({ text, color = C.teal, bg = C.soft }) {
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: bg }}>
      <T size={12} w={700} color={color}>{text}</T>
    </View>
  );
}

function TipBox({ children }) {
  return (
    <View style={{ borderRadius: 18, backgroundColor: C.goldSoft, borderWidth: 1, borderColor: '#F3DDB4', padding: 12, flexDirection: 'row', gap: 10 }}>
      <View style={{ marginTop: 2 }}>
        <Icon name="spark" size={20} color={C.warn} />
      </View>
      <T size={13} color={C.ink} style={{ flex: 1, lineHeight: 20 }}>{children}</T>
    </View>
  );
}

// Stat row: 3 mini-cards
function StatRow({ items }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {items.map((item, i) => (
        <View key={i} style={{ flex: 1, backgroundColor: C.white, borderRadius: 16, borderWidth: 1, borderColor: C.line, padding: 10, minWidth: 0 }}>
          <T size={11} color={C.muted}>{item.label}</T>
          <T size={16} w={800} style={{ marginTop: 2 }}>{item.value}</T>
        </View>
      ))}
    </View>
  );
}

// ── timeline bar chart (horizontal Gantt-style) ───────────────────
function TimelineBar({ segments, milestones, deadline, labels }) {
  // segments: [{pct, color, border}], milestones: [{pct}], deadline: pct (dashed vertical)
  // labels: [{pct, text}]
  const H = 15, TOTAL_H = 70;
  return (
    <View style={{ position: 'relative', height: TOTAL_H, marginHorizontal: 14, marginTop: 4 }}>
      {segments.map((s, i) => (
        <View key={i} style={{ position: 'absolute', left: `${s.left}%`, width: `${s.width}%`, top: 0, height: H, borderRadius: 4, backgroundColor: s.color, borderWidth: 1, borderColor: s.border }} />
      ))}
      {deadline != null && (
        <View style={{ position: 'absolute', left: `${deadline}%`, top: -4, width: 1.5, height: TOTAL_H - 10, borderLeftWidth: 1.5, borderLeftColor: '#D85A30', borderStyle: 'dashed' }} />
      )}
      {milestones.map((m, i) => (
        <View key={i} style={{ position: 'absolute', left: `${m.pct}%`, top: H + 9, width: 10, height: 10, backgroundColor: '#D85A30', transform: [{ rotate: '45deg' }], marginLeft: -5 }} />
      ))}
      {labels.map((l, i) => (
        <T key={i} size={10} color={C.muted} style={{ position: 'absolute', left: `${l.pct}%`, top: H + 26, transform: [{ translateX: -16 }], width: 32, textAlign: 'center' }}>{l.text}</T>
      ))}
    </View>
  );
}

// ── income projection line chart ──────────────────────────────────
function IncomeChart({ points, baseline, xLabels, yLabels, milestoneX }) {
  // points: [{x, y}] normalised 0-1; baseline: y normalised
  const W = 326, H = 170, PL = 34, PR = 8, PT = 12, PB = 24;
  const cx = (xn) => PL + xn * (W - PL - PR);
  const cy = (yn) => PT + (1 - yn) * (H - PT - PB);
  const svgProps = Platform.OS !== 'web' ? { accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' } : {};
  const polyPts = points.map((p) => `${cx(p.x).toFixed(1)},${cy(p.y).toFixed(1)}`).join(' ');
  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Proyeksi pendapatan" {...svgProps}>
      {yLabels.map((lbl, i) => {
        const y = cy(lbl.yn);
        return (
          <React.Fragment key={i}>
            <Line x1={PL} y1={y} x2={W - PR} y2={y} stroke={C.line} strokeWidth={1} />
            <SvgText x={PL - 6} y={y + 4} fontSize={10} fill={C.muted} textAnchor="end">{lbl.text}</SvgText>
          </React.Fragment>
        );
      })}
      {xLabels.map((lbl, i) => (
        <SvgText key={i} x={cx(lbl.xn)} y={H - 8} fontSize={10} fill={C.muted} textAnchor="middle">{lbl.text}</SvgText>
      ))}
      {milestoneX != null && (
        <Line x1={cx(milestoneX)} y1={PT} x2={cx(milestoneX)} y2={H - PB} stroke="#D85A30" strokeWidth={1} strokeDasharray="3 3" />
      )}
      {baseline != null && (
        <Polyline points={`${cx(0)},${cy(baseline)} ${cx(1)},${cy(baseline)}`} fill="none" stroke={C.line} strokeWidth={2.4} strokeDasharray="5 4" />
      )}
      <Polyline points={polyPts} fill="none" stroke={C.teal} strokeWidth={2.4} strokeLinejoin="round" />
      {points.map((p, i) => (
        <Circle key={i} cx={cx(p.x)} cy={cy(p.y)} r={3} fill={C.white} stroke={C.teal} strokeWidth={2} />
      ))}
    </Svg>
  );
}

// ── scenario bar chart ────────────────────────────────────────────
function ScenarioBar({ label, sublabel, bulan, maxBulan, deadlinePct, isPast }) {
  const w = Math.min(bulan / maxBulan, 1);
  const barColor = isPast ? '#F5C4B3' : C.soft;
  const textColor = isPast ? '#712B13' : C.teal;
  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <T size={12} w={600}>{label}</T>
        <T size={12} color={C.muted}>{sublabel}</T>
      </View>
      <View style={{ height: 22, borderRadius: 6, backgroundColor: '#F4F6F5', position: 'relative', overflow: 'visible' }}>
        <View style={{ position: 'absolute', left: 0, top: 0, height: 22, width: `${w * 100}%`, borderRadius: 6, backgroundColor: barColor }} />
        {deadlinePct != null && (
          <View style={{ position: 'absolute', left: `${deadlinePct * 100}%`, top: -3, width: 1.5, height: 28, borderLeftWidth: 1.5, borderLeftColor: '#D85A30', borderStyle: 'dashed' }} />
        )}
        <T size={11} w={800} color={textColor} style={{ position: 'absolute', left: 8, top: 5 }}>
          {bulan > maxBulan ? label.includes('A') ? '22 th (melewati)' : `${Math.floor(bulan / 12)} th ${bulan % 12 > 0 ? `${bulan % 12} bl` : ''}` : `${Math.floor(bulan / 12)} th${bulan % 12 > 0 ? ` ${bulan % 12} bl` : ''}`}
        </T>
      </View>
    </View>
  );
}

// ── phase list ────────────────────────────────────────────────────
function PhaseList({ phases }) {
  return (
    <View style={{ gap: 10 }}>
      {phases.map((ph, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
          <T size={11} color={C.muted} style={{ width: 56, flexShrink: 0, paddingTop: 2 }}>{ph.range}</T>
          <View style={{ width: 10, height: 10, borderRadius: 5, marginTop: 4, flexShrink: 0, backgroundColor: ph.active ? C.teal : '#B8C9C5' }} />
          <View style={{ flex: 1, gap: 2 }}>
            <T size={13} w={700}>{ph.title}</T>
            <T size={11} color={C.muted}>{ph.sub}</T>
          </View>
          {ph.badge ? (
            <View style={{ alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: C.soft }}>
              <T size={12} w={700} color={C.teal}>{ph.badge}</T>
            </View>
          ) : null}
        </View>
      ))}
    </View>
  );
}

// ── BUDI ROADMAP ──────────────────────────────────────────────────
function BudiRoadmap({ analysis }) {
  const dashboard = analysis?.dashboard || {};
  const pendapatan = dashboard.pendapatan || 9000000;
  const sisa = dashboard.sisa || 2650000;
  const tabungan = analysis?.dana_darurat?.dana_likuid_saat_ini || 10000000;

  // Budi income projection: baseline → data scientist
  // bulan 0: 9M, bulan 4: 9M, bulan 28: 14M (mid DS), bulan 66: 28M (senior DS)
  const maxBln = 84;
  const yMax = 32; // jt
  const incomePoints = [
    { x: 0 / maxBln, y: 9 / yMax },
    { x: 4 / maxBln, y: 9 / yMax },
    { x: 28 / maxBln, y: 14 / yMax },
    { x: 66 / maxBln, y: 28 / yMax },
    { x: 1, y: 28 / yMax },
  ];
  const yLabels = [
    { yn: 0, text: '0' }, { yn: 8 / yMax, text: '8' }, { yn: 16 / yMax, text: '16' },
    { yn: 24 / yMax, text: '24' }, { yn: 32 / yMax, text: '32' },
  ];
  const xLabels = [
    { xn: 0, text: 'Kini' }, { xn: 24 / maxBln, text: '2 th' }, { xn: 48 / maxBln, text: '4 th' },
    { xn: 72 / maxBln, text: '6 th' }, { xn: 1, text: '8 th' },
  ];

  // Timeline segments: Budi data-scientist scenario
  // 0-2 prep (grey), 2-4 portfolio (grey), 4-28 junior DS (green), 28-66 senior DS (green), 66+ principal (green)
  const TL = 96; // total months for timeline normalisation
  const segments = [
    { left: 0, width: (2 / TL) * 100, color: C.soft, border: '#B8C9C5' },
    { left: (2.5 / TL) * 100, width: (2 / TL) * 100, color: C.soft, border: '#B8C9C5' },
    { left: (5 / TL) * 100, width: (24 / TL) * 100, color: '#9FE1CB', border: '#0F6E56' },
    { left: (29.5 / TL) * 100, width: (37 / TL) * 100, color: '#9FE1CB', border: '#0F6E56' },
    { left: (67 / TL) * 100, width: (29 / TL) * 100, color: '#9FE1CB', border: '#0F6E56' },
  ];
  const milestones = [
    { pct: (35 / TL) * 100 },  // target menikah
    { pct: (66 / TL) * 100 },  // target mobil (with DS)
  ];
  const tlLabels = [
    { pct: 0, text: 'Kini' }, { pct: 25, text: '2 th' }, { pct: 50, text: '4 th' },
    { pct: 75, text: '6 th' }, { pct: 100, text: '8 th' },
  ];

  // Scenario bar data (target: Avanza ~Rp250 jt)
  const deadline = 60; // 5 tahun tenggat
  const maxDisplay = 270;
  const scenarios = [
    { label: 'A · Tetap kerja sekarang', sub: 'gaji tetap', bulan: 265, isPast: true },
    { label: 'B · Pindah ke Data Scientist', sub: 'mulai bln 4', bulan: 66, isPast: true },
    { label: 'C · Data Analyst', sub: 'mulai bln 6', bulan: 72, isPast: true },
    { label: 'D · Kopi keliling (pesimis)', sub: 'mulai bln 1', bulan: 83, isPast: true },
    { label: 'E · Data Scientist + kopi pesimis', sub: 'gabungan', bulan: 49, isPast: false },
    { label: 'F · Data Scientist + kopi moderat', sub: 'gabungan', bulan: 40, isPast: false },
  ];

  const phases = [
    { range: 'Bln 0–2', active: false, title: 'Perdalam statistik & ML', sub: 'Tetap bekerja sambil belajar' },
    { range: 'Bln 2–4', active: false, title: 'Portofolio & melamar', sub: '2 proyek ML end-to-end' },
    { range: 'Bln 4–28', active: true, title: 'Junior Data Scientist', sub: 'Level awal', badge: `+Rp${Math.round((14000000 - pendapatan) / 1000000)} jt/bln` },
    { range: 'Bln 28–66', active: true, title: 'Data Scientist (mid)', sub: 'Pengembangan skill lanjutan', badge: '+Rp5 jt/bln' },
    { range: 'Bln 66+', active: true, title: 'Senior Data Scientist', sub: 'Target gaji Rp28 jt', badge: '+Rp14 jt/bln' },
  ];

  return (
    <>
      <T size={13} color={C.muted}>Career switch ke Data Scientist sambil menyiapkan menikah dan mobil.</T>
      <StatRow items={[
        { label: 'Gaji kini', value: rpShort(pendapatan) },
        { label: 'Sisa/bln', value: rpShort(sisa) },
        { label: 'Tabungan', value: rpShort(tabungan) },
      ]} />
      <Card>
        <T size={15} w={800} style={{ marginBottom: 12 }}>Garis waktu</T>
        <TimelineBar segments={segments} milestones={milestones} deadline={(60 / TL) * 100} labels={tlLabels} />
      </Card>
      <Card>
        <T size={15} w={800} style={{ marginBottom: 12 }}>Fase</T>
        <PhaseList phases={phases} />
      </Card>
      <Card>
        <T size={15} w={800} style={{ marginBottom: 12 }}>Proyeksi pendapatan per bulan</T>
        <IncomeChart points={incomePoints} baseline={pendapatan / (yMax * 1e6)} xLabels={xLabels} yLabels={yLabels} milestoneX={35 / maxBln} />
      </Card>
      <Card>
        <T size={15} w={800} style={{ marginBottom: 12 }}>Mobil Rp250 jt tercapai</T>
        <View style={{ gap: 10 }}>
          {scenarios.map((s, i) => (
            <ScenarioBar key={i} label={s.label} sublabel={s.sub} bulan={s.bulan} maxBulan={maxDisplay} deadlinePct={deadline / maxDisplay} isPast={s.isPast} />
          ))}
        </View>
      </Card>
      <TipBox>Rekomendasi: tetap bekerja selama 4 bulan persiapan, lalu pindah ke Data Scientist. Usaha kopi sampingan di akhir pekan mempercepat target; dengan skenario pesimis pun mobil tercapai 4 th 1 bl, sebelum tenggat 5 tahun.</TipBox>
    </>
  );
}

// ── AGUS ROADMAP ──────────────────────────────────────────────────
function AgusRoadmap({ analysis }) {
  const dashboard = analysis?.dashboard || {};
  const pendapatan = dashboard.pendapatan || 14000000;
  const sisa = dashboard.sisa || 5500000;
  const tabungan = analysis?.dana_darurat?.dana_likuid_saat_ini || 45000000;

  // Income projection: baseline 14M → bengkel+kelontong → 17M after month 12
  const maxBln = 84;
  const yMax = 20;
  const incomePoints = [
    { x: 0, y: 14 / yMax },
    { x: 12 / maxBln, y: 14 / yMax },
    { x: 13 / maxBln, y: 16.95 / yMax },
    { x: 1, y: 16.95 / yMax },
  ];
  const yLabels = [
    { yn: 0, text: '0' }, { yn: 5 / yMax, text: '5' }, { yn: 10 / yMax, text: '10' },
    { yn: 15 / yMax, text: '15' }, { yn: 1, text: '20' },
  ];
  const xLabels = [
    { xn: 0, text: 'Kini' }, { xn: 24 / maxBln, text: '2 th' }, { xn: 48 / maxBln, text: '4 th' },
    { xn: 72 / maxBln, text: '6 th' },
  ];

  // Timeline: Agus B+C scenario, 7 year house goal (84 bulan)
  const TL = 84;
  const segments = [
    { left: 0, width: (12 / TL) * 100, color: C.soft, border: '#B8C9C5' },   // dev bengkel
    { left: 0, width: (12 / TL) * 100, color: C.soft, border: '#B8C9C5' },   // dev kelontong (row 2, overlapping represented)
    { left: (13 / TL) * 100, width: (71 / TL) * 100, color: '#9FE1CB', border: '#0F6E56' }, // earning bengkel
  ];
  const milestones = [
    { pct: (8 / TL) * 100 },   // dana darurat terpenuhi
    { pct: (17 / TL) * 100 },  // KPR DP siap
    { pct: 100 },               // target rumah
  ];
  const tlLabels = [
    { pct: 0, text: 'Kini' }, { pct: (28 / TL) * 100, text: '2 th' }, { pct: (57 / TL) * 100, text: '4 th' },
    { pct: (85 / TL) * 100, text: '6 th' }, { pct: 100, text: '7 th' },
  ];

  // Scenarios
  const deadline = 84;
  const maxDisplay = 266;
  const agusScenarios = [
    { label: 'A · Kondisi sekarang', sub: 'Rp600 jt', bulan: 266, isPast: true },
    { label: 'B · Omzet bengkel +20%', sub: '+Rp2,2 jt', bulan: 120, isPast: true },
    { label: 'C · Kelontong +25%', sub: '+Rp750 rb', bulan: 176, isPast: true },
    { label: 'B + C · Keduanya berkembang', sub: 'gabungan', bulan: 104, isPast: true },
    { label: 'Budget Rp515 jt + B + C', sub: 'realistis', bulan: 84, isPast: false },
  ];

  const phases = [
    { range: 'Bln 0–12', active: false, title: 'Kembangkan bengkel', sub: 'Target omzet +20%', badge: '+Rp2,2 jt' },
    { range: 'Bln 0–12', active: false, title: 'Kembangkan kelontong', sub: 'Target omzet +25%', badge: '+Rp750 rb' },
    { range: 'Bln 12–…', active: true, title: 'Stabil & tabung untuk DP', sub: 'Penuhi dana darurat, lalu DP KPR' },
    { range: 'Bln ~17', active: true, title: 'Siap DP KPR', sub: 'Rumah ±Rp515 jt, DP 20%' },
  ];

  return (
    <>
      <T size={13} color={C.muted}>Usaha keluarga menuju rumah sendiri.</T>
      <StatRow items={[
        { label: 'Pendapatan', value: rpShort(pendapatan) },
        { label: 'Sisa/bln', value: rpShort(sisa) },
        { label: 'Tabungan', value: rpShort(tabungan) },
      ]} />
      <Card>
        <T size={15} w={800} style={{ marginBottom: 12 }}>Garis waktu (skenario B + C)</T>
        <TimelineBar segments={segments} milestones={milestones} deadline={100} labels={tlLabels} />
      </Card>
      <Card>
        <T size={15} w={800} style={{ marginBottom: 12 }}>Fase</T>
        <PhaseList phases={phases} />
      </Card>
      <Card>
        <T size={15} w={800} style={{ marginBottom: 12 }}>Proyeksi pendapatan keluarga</T>
        <IncomeChart points={incomePoints} baseline={14 / yMax} xLabels={xLabels} yLabels={yLabels} milestoneX={1} />
      </Card>
      <Card>
        <T size={15} w={800} style={{ marginBottom: 12 }}>Rumah tercapai (target 7 tahun)</T>
        <View style={{ gap: 10 }}>
          {agusScenarios.map((s, i) => (
            <ScenarioBar key={i} label={s.label} sublabel={s.sub} bulan={s.bulan} maxBulan={maxDisplay} deadlinePct={deadline / maxDisplay} isPast={s.isPast} />
          ))}
        </View>
      </Card>
      <TipBox>Rekomendasi: kembangkan bengkel dan kelontong bersama, tetapkan budget rumah ±Rp515 jt agar tercapai 7 tahun, dan KPR 15 tahun (cicilan ±Rp4,95 jt) tetap aman.</TipBox>
    </>
  );
}

// ── DINI ROADMAP ──────────────────────────────────────────────────
function DiniRoadmap({ karier }) {
  const reko = karier?.hasil?.rekomendasi || [];

  // Dini: SMA → kuliah → kerja projection
  // bulan 0: uang saku 1.5M, bulan 54: mulai kerja ~7M entry DA, bulan 78: mid ~10M
  const maxBln = 110;
  const yMax = 30;
  const incomePoints = [
    { x: 0, y: 1.5 / yMax },
    { x: 54 / maxBln, y: 1.5 / yMax },
    { x: 55 / maxBln, y: 7 / yMax },
    { x: 78 / maxBln, y: 7 / yMax },
    { x: 79 / maxBln, y: 10 / yMax },
    { x: 1, y: 28 / yMax },
  ];
  const yLabels = [
    { yn: 0, text: '0' }, { yn: 8 / yMax, text: '8' }, { yn: 15 / yMax, text: '15' },
    { yn: 22 / yMax, text: '22' }, { yn: 1, text: '30' },
  ];
  const xLabels = [
    { xn: 0, text: 'Kini' }, { xn: 24 / maxBln, text: '2 th' }, { xn: 48 / maxBln, text: '4 th' },
    { xn: 72 / maxBln, text: '6 th' }, { xn: 96 / maxBln, text: '8 th' }, { xn: 1, text: '10 th' },
  ];

  // Timeline segments: SMA-persiapan (grey), kuliah (grey), magang (grey), kerja (green)
  const TL = 110;
  const segments = [
    { left: 0, width: (4 / TL) * 100, color: C.soft, border: '#B8C9C5' },        // persiapan SNBT
    { left: (4.5 / TL) * 100, width: (18 / TL) * 100, color: C.soft, border: '#B8C9C5' }, // kuliah 1-2
    { left: (23 / TL) * 100, width: (18 / TL) * 100, color: C.soft, border: '#B8C9C5' }, // kuliah 3-4 + magang
    { left: (41 / TL) * 100, width: (18 / TL) * 100, color: '#9FE1CB', border: '#0F6E56' }, // entry
    { left: (59 / TL) * 100, width: (41 / TL) * 100, color: '#9FE1CB', border: '#0F6E56' }, // mid+senior
  ];
  const milestones = [
    { pct: (4.5 / TL) * 100 },    // masuk kuliah
    { pct: (40.9 / TL) * 100 },   // mulai kerja
  ];
  const tlLabels = [
    { pct: 0, text: 'Kini' }, { pct: (18 / TL) * 100, text: '2 th' }, { pct: (36 / TL) * 100, text: '4 th' },
    { pct: (54 / TL) * 100, text: '6 th' }, { pct: (72 / TL) * 100, text: '8 th' },
  ];

  const phases = [
    { range: 'Bln 0–6', active: false, title: 'Persiapan masuk kuliah', sub: 'SNBP/SNBT: S1 Sistem Informasi atau Teknik Informatika' },
    { range: 'Bln 6–30', active: false, title: 'Kuliah tahun 1–2', sub: 'SQL, pemrograman, statistik, lomba' },
    { range: 'Bln 30–54', active: false, title: 'Kuliah tahun 3–4', sub: 'Magang + 2 portofolio' },
    { range: 'Bln 54+', active: true, title: 'Mulai bekerja', sub: 'Entry level di bidang data/tech', badge: 'Rp5–9 jt' },
    { range: 'Bln 78+', active: true, title: 'Naik level (mid)', sub: 'Spesialisasi & sertifikasi', badge: 'Rp10–14 jt' },
  ];

  // Career options from flow 5 or fallback
  const karierOptions = reko.length >= 3 ? [
    { nama: reko[0]?.profesi || 'Data Analyst', skor: reko[0]?.skor_kecocokan || 75, gaji: 'Rp5–9 jt' },
    { nama: reko[1]?.profesi || 'Software Engineer', skor: reko[1]?.skor_kecocokan || 73, gaji: 'Rp6–10 jt' },
    { nama: reko[2]?.profesi || 'UI/UX Designer', skor: reko[2]?.skor_kecocokan || 73, gaji: 'Rp5–8 jt' },
  ] : [
    { nama: 'Data Analyst', skor: 75, gaji: 'Rp5–9 jt' },
    { nama: 'Software Engineer', skor: 73, gaji: 'Rp6–10 jt' },
    { nama: 'UI/UX Designer', skor: 73, gaji: 'Rp5–8 jt' },
  ];

  return (
    <>
      <T size={13} color={C.muted}>Dari SMA ke kampus terbaik, lalu karier di bidang data dan teknologi.</T>
      <StatRow items={[
        { label: 'Uang saku', value: 'Rp1,5 jt' },
        { label: 'Menabung/bln', value: 'Rp150 rb' },
        { label: 'Tabungan', value: 'Rp2,5 jt' },
      ]} />
      <Card>
        <T size={15} w={800} style={{ marginBottom: 12 }}>Garis waktu</T>
        <TimelineBar segments={segments} milestones={milestones} deadline={null} labels={tlLabels} />
      </Card>
      <Card>
        <T size={15} w={800} style={{ marginBottom: 12 }}>Fase</T>
        <PhaseList phases={phases} />
      </Card>
      <Card>
        <T size={15} w={800} style={{ marginBottom: 12 }}>Proyeksi pendapatan</T>
        <IncomeChart points={incomePoints} baseline={null} xLabels={xLabels} yLabels={yLabels} milestoneX={54 / maxBln} />
      </Card>
      <Card>
        <T size={15} w={800} style={{ marginBottom: 12 }}>Pilihan karier (mulai kerja bulan ke-54)</T>
        {karierOptions.map((k, i) => (
          <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: i > 0 ? 6 : 0 }}>
            <T size={13} color={C.muted}>{k.nama}</T>
            <T size={13} w={i === 0 ? 800 : 700} color={i === 0 ? C.teal : C.ink} style={{ textAlign: 'right' }}>{k.skor} · awal {k.gaji}</T>
          </View>
        ))}
      </Card>
      <TipBox>Rekomendasi: targetkan S1 Sistem Informasi atau Teknik Informatika di ITB, UI, UGM, atau Unpad lewat SNBP/SNBT, dengan Telkom University sebagai cadangan di Bandung.</TipBox>
    </>
  );
}

// ── main screen ───────────────────────────────────────────────────
export default function Roadmap({ go }) {
  const app = useApp();
  const uid = app.activeUserId || 'budi';
  const persona = findPersona(uid);

  return (
    <View style={{ flex: 1, backgroundColor: C.ground }}>
      {/* header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, paddingBottom: 8 }}>
        <Pressable
          onPress={() => go('home')}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke beranda"
          style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: C.white, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="back" size={20} color={C.ink} />
        </Pressable>
        <T size={20} w={800} style={{ flex: 1, letterSpacing: -0.2 }}>Roadmap {persona?.nama || uid}</T>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8, paddingBottom: 100, gap: 14 }} showsVerticalScrollIndicator={false}>
        {uid === 'budi' && <BudiRoadmap analysis={app.analysis} />}
        {uid === 'agus' && <AgusRoadmap analysis={app.analysis} />}
        {uid === 'dini' && <DiniRoadmap karier={app.karier} />}
        {!['budi', 'agus', 'dini'].includes(uid) && (
          <View style={{ padding: 24, alignItems: 'center', gap: 12 }}>
            <Icon name="route" size={32} color={C.muted} />
            <T size={15} w={700} color={C.muted} style={{ textAlign: 'center' }}>Roadmap tersedia setelah mengisi data karier atau usaha.</T>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
