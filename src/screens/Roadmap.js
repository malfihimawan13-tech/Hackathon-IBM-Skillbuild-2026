import React, { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import Svg, { Circle, Line, Path, Polygon, Polyline, Rect, Text as SvgText } from 'react-native-svg';
import { useApp } from '../state/AppContext';
import { DEMO } from '../api/demoData';
import { Button, T } from '../components/ui';
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

// Helper: konversi teks waktu ("5 tahun 6 bulan") ke jumlah bulan
function teksKeBulan(teks) {
  if (!teks) return null;
  const th = teks.match(/(\d+)\s*tahun/);
  const bl = teks.match(/(\d+)\s*bulan/);
  return (th ? parseInt(th[1], 10) * 12 : 0) + (bl ? parseInt(bl[1], 10) : 0);
}

// ── BUDI ROADMAP ──────────────────────────────────────────────────
function BudiRoadmap({ analysis }) {
  const app = useApp();
  const [loadingS, setLoadingS] = useState(false);
  const [errS, setErrS] = useState('');

  const dashboard = analysis?.dashboard || {};
  const pendapatan = dashboard.pendapatan;
  const sisa = dashboard.sisa;
  const tabungan = analysis?.dana_darurat?.dana_likuid_saat_ini;

  // Muat skenario saat pertama kali render jika belum ada
  const sk = app.skenario?.budi;
  useEffect(() => {
    if (!sk && app.loadSkenarioBudi) {
      setLoadingS(true);
      app.loadSkenarioBudi().catch((e) => setErrS(e.message)).finally(() => setLoadingS(false));
    }
  }, []); // eslint-disable-line

  // DS jalur_pendapatan tahapan (dari karier Langflow atau demo)
  const karierReko = app.karier?.hasil?.rekomendasi || [];
  const dsReko = karierReko.find((r) => r.id === 'data_scientist') || DEMO.budi?.karier?.rekomendasi?.find((r) => r.id === 'data_scientist');
  const dsTahapan = dsReko?.jalur_pendapatan?.tahapan || [];
  const entryMin = dsTahapan[0]?.rentang_min;
  const entryMax = dsTahapan[0]?.rentang_max;
  const midMin = dsTahapan[1]?.rentang_min;
  const midMax = dsTahapan[1]?.rentang_max;
  const seniorMin = dsTahapan[2]?.rentang_min;
  const seniorMax = dsTahapan[2]?.rentang_max;

  // Ambil jadwal dari DS simulasi_siap_pakai (nilai tengah per tahap dari Langflow)
  const dsJadwal = dsReko?.jadwal_pendapatan_untuk_simulasi || DEMO.budi?.karier?.rekomendasi?.find((r) => r.id === 'data_scientist')?.jadwal_pendapatan_untuk_simulasi || [];
  const entryStart = dsJadwal.find((j) => j.mulai_bulan === 4)?.mulai_bulan ?? 4;
  const midStart = dsJadwal.find((j) => j.penghasilan > 9000000 && j.mulai_bulan > 4)?.mulai_bulan ?? 28;
  const seniorStart = dsJadwal.find((j) => j.mulai_bulan >= 60)?.mulai_bulan ?? 64;

  // Income projection: mulai dari pendapatan Langflow, titik selanjutnya dari jalur_pendapatan (Langflow/demo)
  const basePendapatan = pendapatan ?? 7500000;
  const entryMid = entryMin && entryMax ? Math.round((entryMin + entryMax) / 2) : 9000000;
  const midMidVal = midMin && midMax ? Math.round((midMin + midMax) / 2) : 11750000;
  const seniorMidVal = seniorMin && seniorMax ? Math.round((seniorMin + seniorMax) / 2) : 27500000;
  const hasKarierData = dsTahapan.length > 0;

  const maxBln = 84;
  const yMax = 32; // jt
  const incomePoints = [
    { x: 0 / maxBln, y: basePendapatan / (yMax * 1e6) },
    { x: entryStart / maxBln, y: basePendapatan / (yMax * 1e6) },
    { x: midStart / maxBln, y: entryMid / (yMax * 1e6) },
    { x: seniorStart / maxBln, y: midMidVal / (yMax * 1e6) },
    { x: 1, y: seniorMidVal / (yMax * 1e6) },
  ];
  const yLabels = [
    { yn: 0, text: '0' }, { yn: 8 / yMax, text: '8' }, { yn: 16 / yMax, text: '16' },
    { yn: 24 / yMax, text: '24' }, { yn: 32 / yMax, text: '32' },
  ];
  const xLabels = [
    { xn: 0, text: 'Kini' }, { xn: 24 / maxBln, text: '2 th' }, { xn: 48 / maxBln, text: '4 th' },
    { xn: 72 / maxBln, text: '6 th' }, { xn: 1, text: '8 th' },
  ];

  // Timeline segments (tetap statis — dari roadmap_karier DS)
  const TL = 96;
  const segments = [
    { left: 0, width: (2 / TL) * 100, color: C.soft, border: '#B8C9C5' },
    { left: (2.5 / TL) * 100, width: (2 / TL) * 100, color: C.soft, border: '#B8C9C5' },
    { left: (5 / TL) * 100, width: (24 / TL) * 100, color: '#9FE1CB', border: '#0F6E56' },
    { left: (29.5 / TL) * 100, width: (37 / TL) * 100, color: '#9FE1CB', border: '#0F6E56' },
    { left: (67 / TL) * 100, width: (29 / TL) * 100, color: '#9FE1CB', border: '#0F6E56' },
  ];

  // Milestone mobil: dari skenario.budi.data_scientist (sesudah.target.Mobil)
  const mobileMonthDS = teksKeBulan(sk?.data_scientist?.sesudah?.target?.Mobil);
  const milestones = [
    { pct: (35 / TL) * 100 },
    ...(mobileMonthDS ? [{ pct: Math.min(mobileMonthDS / TL, 1) * 100 }] : [{ pct: (66 / TL) * 100 }]),
  ];
  const tlLabels = [
    { pct: 0, text: 'Kini' }, { pct: 25, text: '2 th' }, { pct: 50, text: '4 th' },
    { pct: 75, text: '6 th' }, { pct: 100, text: '8 th' },
  ];

  // Badge fase: pakai rentang dari jalur_pendapatan (bukan 14M - gaji)
  const badgeEntry = entryMin && entryMax
    ? `Rp${Math.round(entryMin / 1e6)}–${Math.round(entryMax / 1e6)} jt/bln`
    : 'Rp7–11 jt/bln';
  const badgeMid = midMin && midMax
    ? `Rp${Math.round(midMin / 1e6)}–${Math.round(midMax / 1e6)} jt/bln`
    : 'Rp8–19 jt/bln';
  const badgeSenior = seniorMin && seniorMax
    ? `Rp${Math.round(seniorMin / 1e6)}–${Math.round(seniorMax / 1e6)} jt/bln`
    : 'Rp20–35 jt/bln';

  const phases = [
    { range: 'Bln 0–2', active: false, title: 'Perdalam statistik & ML', sub: 'Tetap bekerja sambil belajar' },
    { range: 'Bln 2–4', active: false, title: 'Portofolio & melamar', sub: '2 proyek ML end-to-end' },
    { range: `Bln 4–${midStart}`, active: true, title: 'Junior Data Scientist', sub: 'Level awal', badge: badgeEntry },
    { range: `Bln ${midStart}–${seniorStart}`, active: true, title: 'Data Scientist (mid)', sub: 'Pengembangan skill lanjutan', badge: badgeMid },
    { range: `Bln ${seniorStart}+`, active: true, title: 'Senior Data Scientist', sub: `Target gaji Rp${Math.round(seniorMidVal / 1e6)} jt`, badge: badgeSenior },
  ];

  // Scenario bars: dari skenario.budi (Langflow) — fallback ke demo karier_simulasi
  const demoKS = DEMO.budi?.karier_simulasi || {};
  const getB = (key) => teksKeBulan(sk?.[key]?.sesudah?.target?.Mobil ?? demoKS[key]?.sesudah?.target?.Mobil);
  // baseline: sebelum simulasi (tanpa perubahan karir)
  const baselineMonths = teksKeBulan(sk?.dasar?.sesudah?.target?.Mobil ?? demoKS?.data_scientist?.sebelum?.target?.Mobil);
  const bDS = getB('data_scientist');
  const bDA = getB('data_analyst');
  const bKopi = getB('kopi_pesimis');
  const bDSKopiP = getB('data_scientist_kopi_pesimis');
  const bDSKopiM = getB('data_scientist_kopi_moderat');

  const deadline = 60; // 5 tahun tenggat Mobil
  const maxDisplay = 270;
  const scenarios = [
    { label: 'A · Tetap kerja sekarang', sub: 'gaji tetap', bulan: baselineMonths ?? 265, isPast: true },
    { label: 'B · Pindah ke Data Scientist', sub: 'mulai bln 4', bulan: bDS ?? 66, isPast: true },
    { label: 'C · Data Analyst', sub: 'mulai bln 6', bulan: bDA ?? 72, isPast: true },
    { label: 'D · Kopi keliling (pesimis)', sub: 'mulai bln 1', bulan: bKopi ?? 83, isPast: true },
    { label: 'E · Data Scientist + kopi pesimis', sub: 'gabungan', bulan: bDSKopiP ?? 49, isPast: false },
    { label: 'F · Data Scientist + kopi moderat', sub: 'gabungan', bulan: bDSKopiM ?? 40, isPast: false },
  ];

  return (
    <>
      <T size={13} color={C.muted}>Career switch ke Data Scientist sambil menyiapkan menikah dan mobil.</T>
      {pendapatan != null ? (
        <StatRow items={[
          { label: 'Gaji kini', value: rpShort(pendapatan) },
          { label: 'Sisa/bln', value: rpShort(sisa) },
          { label: 'Tabungan', value: rpShort(tabungan) },
        ]} />
      ) : null}
      <Card>
        <T size={15} w={800} style={{ marginBottom: 12 }}>Garis waktu</T>
        <TimelineBar segments={segments} milestones={milestones} deadline={(60 / TL) * 100} labels={tlLabels} />
      </Card>
      <Card>
        <T size={15} w={800} style={{ marginBottom: 12 }}>Fase</T>
        <PhaseList phases={phases} />
      </Card>
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <T size={15} w={800} style={{ flex: 1 }}>Proyeksi pendapatan per bulan</T>
          {!hasKarierData && <T size={11} color={C.muted}>Ilustrasi</T>}
        </View>
        <IncomeChart points={incomePoints} baseline={basePendapatan / (yMax * 1e6)} xLabels={xLabels} yLabels={yLabels} milestoneX={35 / maxBln} />
        {!hasKarierData && (
          <T size={11} color={C.muted} style={{ marginTop: 4 }}>Proyeksi ilustratif. Muat data karier untuk nilai dari Langflow.</T>
        )}
      </Card>
      <Card>
        <T size={15} w={800} style={{ marginBottom: 12 }}>Mobil Rp250 jt tercapai</T>
        {loadingS ? (
          <T size={13} color={C.muted}>Memuat skenario…</T>
        ) : (
          <View style={{ gap: 10 }}>
            {scenarios.map((s, i) => (
              <ScenarioBar key={i} label={s.label} sublabel={s.sub} bulan={s.bulan} maxBulan={maxDisplay} deadlinePct={deadline / maxDisplay} isPast={s.isPast} />
            ))}
          </View>
        )}
        {errS ? <T size={12} color={C.warn} style={{ marginTop: 6 }}>{errS}</T> : null}
      </Card>
      <TipBox>Rekomendasi: tetap bekerja selama 4 bulan persiapan, lalu pindah ke Data Scientist. Usaha kopi sampingan di akhir pekan mempercepat target; dengan skenario pesimis pun mobil tercapai sebelum tenggat 5 tahun.</TipBox>
    </>
  );
}

// ── AGUS ROADMAP ──────────────────────────────────────────────────
function AgusRoadmap({ analysis }) {
  const app = useApp();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const sk = app.skenario?.agus;

  const muatSkenario = async () => {
    setBusy(true); setErr('');
    try { await app.loadSkenarioAgus(); } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  useEffect(() => {
    if (!sk && app.loadSkenarioAgus) { muatSkenario(); }
  }, []); // eslint-disable-line

  const dashboard = analysis?.dashboard || {};
  const pendapatan = dashboard.pendapatan;
  const sisa = dashboard.sisa;
  const tabungan = analysis?.dana_darurat?.dana_likuid_saat_ini;

  // Tambahan dari skenario atau kalkulasi persona
  const bengkelTambahan = sk?.tambahan?.bengkel ?? 2200000;
  const kelontongTambahan = sk?.tambahan?.kelontong ?? 750000;

  // Bulan tercapai dari tiap skenario (opsi_a_menabung.waktu_tercapai_bulan)
  const getRumahBulan = (r) => (r?.target || []).find((t) => t.nama === 'Rumah')?.opsi_a_menabung?.waktu_tercapai_bulan ?? null;
  const bulanDasar = getRumahBulan(sk?.dasar) ?? getRumahBulan(analysis);
  const bulanBengkel = getRumahBulan(sk?.bengkel);
  const bulanKelontong = getRumahBulan(sk?.kelontong);
  const bulanGabungan = getRumahBulan(sk?.gabungan);
  const bulanRumahRealistis = getRumahBulan(sk?.rumah_realistis);
  const hargaRealistis = sk?.harga_realistis;
  const tenggat = (sk?.dasar?.target || analysis?.target || []).find((t) => t.nama === 'Rumah')?.tenggat_bulan ?? 84;
  const tenggat_tahun = sk?.tenggat_tahun ?? Math.round(tenggat / 12);

  // maxDisplay untuk grafik batang: dasar atau 300
  const maxDisplay = bulanDasar != null ? Math.max(bulanDasar, 300) : 300;
  const deadlinePct = tenggat / maxDisplay;

  // Proyeksi pendapatan keluarga: mulai dari dashboard.pendapatan, naik setelah bengkel & kelontong berkembang
  const baseIncome = pendapatan;
  const afterBengkel = baseIncome != null ? baseIncome + bengkelTambahan : null;
  const afterGabungan = baseIncome != null ? baseIncome + bengkelTambahan + kelontongTambahan : null;
  const maxBln = 84;
  const yMax = afterGabungan != null ? Math.ceil(afterGabungan / 1000000 / 5) * 5 + 5 : 25;
  const incomePoints = baseIncome != null ? [
    { x: 0, y: baseIncome / 1000000 / yMax },
    { x: 12 / maxBln, y: baseIncome / 1000000 / yMax },
    { x: 13 / maxBln, y: afterBengkel / 1000000 / yMax },
    { x: 1, y: afterGabungan / 1000000 / yMax },
  ] : [];
  const yStep = Math.ceil(yMax / 4);
  const yLabels = Array.from({ length: 5 }, (_, i) => ({ yn: (i * yStep) / yMax, text: String(i * yStep) }));
  const xLabels = [
    { xn: 0, text: 'Kini' }, { xn: 24 / maxBln, text: '2 th' }, { xn: 48 / maxBln, text: '4 th' },
    { xn: 72 / maxBln, text: '6 th' },
  ];

  // Timeline: Agus B+C scenario, 7 year house goal
  const TL = 84;
  const segments = [
    { left: 0, width: (12 / TL) * 100, color: C.soft, border: '#B8C9C5' },
    { left: (13 / TL) * 100, width: (71 / TL) * 100, color: '#9FE1CB', border: '#0F6E56' },
  ];
  const milestones = [
    { pct: (8 / TL) * 100 },
    { pct: (17 / TL) * 100 },
    { pct: 100 },
  ];
  const tlLabels = [
    { pct: 0, text: 'Kini' }, { pct: (28 / TL) * 100, text: '2 th' }, { pct: (57 / TL) * 100, text: '4 th' },
    { pct: (85 / TL) * 100, text: '6 th' }, { pct: 100, text: `${tenggat_tahun} th` },
  ];

  const bengkelLabel = `+${rpShort(bengkelTambahan)}`;
  const kelontongLabel = `+${rpShort(kelontongTambahan)}`;
  const hargaLabel = hargaRealistis != null ? `Budget ${rpShort(hargaRealistis)}` : 'realistis';

  const agusScenarios = [
    bulanDasar != null && { label: 'A · Kondisi sekarang', sub: 'Rp600 jt', bulan: bulanDasar, isPast: true },
    bulanBengkel != null && { label: 'B · Omzet bengkel +20%', sub: bengkelLabel, bulan: bulanBengkel, isPast: true },
    bulanKelontong != null && { label: 'C · Kelontong +25%', sub: kelontongLabel, bulan: bulanKelontong, isPast: true },
    bulanGabungan != null && { label: 'B + C · Keduanya berkembang', sub: 'gabungan', bulan: bulanGabungan, isPast: true },
    bulanRumahRealistis != null && { label: `${hargaLabel} + B + C`, sub: `tepat ${tenggat_tahun} tahun`, bulan: bulanRumahRealistis, isPast: false },
  ].filter(Boolean);

  const phases = [
    { range: 'Bln 0–12', active: false, title: 'Kembangkan bengkel', sub: 'Target omzet +20%', badge: bengkelLabel },
    { range: 'Bln 0–12', active: false, title: 'Kembangkan kelontong', sub: 'Target omzet +25%', badge: kelontongLabel },
    { range: 'Bln 12–…', active: true, title: 'Stabil & tabung untuk DP', sub: 'Penuhi dana darurat, lalu DP KPR' },
    { range: `Bln ~17`, active: true, title: 'Siap DP KPR', sub: hargaRealistis ? `Rumah ±${rpShort(hargaRealistis)}, DP 20%` : 'Rumah realistis, DP 20%' },
  ];

  return (
    <>
      <T size={13} color={C.muted}>Usaha keluarga menuju rumah sendiri.</T>
      <StatRow items={[
        { label: 'Pendapatan', value: pendapatan != null ? rpShort(pendapatan) : '–' },
        { label: 'Sisa/bln', value: sisa != null ? rpShort(sisa) : '–' },
        { label: 'Tabungan', value: tabungan != null ? rpShort(tabungan) : '–' },
      ]} />
      {busy && !sk && <T size={12} color={C.muted} style={{ textAlign: 'center' }}>Memuat skenario dari Langflow…</T>}
      {err ? <T size={12} color={C.warn}>{err}</T> : null}
      {!sk && !busy && (
        <Pressable onPress={muatSkenario} accessibilityRole="button" accessibilityLabel="Muat ulang skenario" style={{ alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 99, backgroundColor: C.soft }}>
          <T size={13} w={700} color={C.teal}>Muat ulang skenario</T>
        </Pressable>
      )}
      <Card>
        <T size={15} w={800} style={{ marginBottom: 12 }}>Garis waktu (skenario B + C)</T>
        <TimelineBar segments={segments} milestones={milestones} deadline={100} labels={tlLabels} />
      </Card>
      <Card>
        <T size={15} w={800} style={{ marginBottom: 12 }}>Fase</T>
        <PhaseList phases={phases} />
      </Card>
      {incomePoints.length > 0 && (
        <Card>
          <T size={15} w={800} style={{ marginBottom: 4 }}>Proyeksi pendapatan keluarga</T>
          <T size={11} color={C.muted} style={{ marginBottom: 10 }}>
            {`Baseline ${rpShort(baseIncome)} → +${rpShort(bengkelTambahan)} (bengkel) → +${rpShort(kelontongTambahan)} (kelontong). Ilustrasi: kenaikan diasumsikan di bulan ke-12.`}
          </T>
          <IncomeChart points={incomePoints} baseline={baseIncome / 1000000 / yMax} xLabels={xLabels} yLabels={yLabels} milestoneX={13 / maxBln} />
        </Card>
      )}
      {agusScenarios.length > 0 && (
        <Card>
          <T size={15} w={800} style={{ marginBottom: 12 }}>Rumah tercapai (target {tenggat_tahun} tahun)</T>
          <View style={{ gap: 10 }}>
            {agusScenarios.map((s, i) => (
              <ScenarioBar key={i} label={s.label} sublabel={s.sub} bulan={s.bulan} maxBulan={maxDisplay} deadlinePct={deadlinePct} isPast={s.isPast} />
            ))}
          </View>
        </Card>
      )}
      <TipBox>
        {hargaRealistis
          ? `Rekomendasi: kembangkan bengkel dan kelontong bersama, tetapkan budget rumah ±${rpShort(hargaRealistis)} agar tercapai ${tenggat_tahun} tahun.`
          : 'Kembangkan bengkel dan kelontong bersama untuk mempercepat target rumah.'}
      </TipBox>
    </>
  );
}

// ── DINI ROADMAP ──────────────────────────────────────────────────
function DiniRoadmap({ karier, analysis }) {
  const reko = karier?.hasil?.rekomendasi || [];

  // Pilih rekomendasi teratas untuk fase & proyeksi pendapatan
  const topReko = reko[0];
  const roadmapKarier = topReko?.roadmap_karier || [];
  const tahapanPendapatan = topReko?.jalur_pendapatan?.tahapan || [];

  // Susun fase dari roadmap_karier flow 5; tambah badge gaji dari pendapatan
  const phases = roadmapKarier.map((fase) => {
    const hasPendapatan = fase.pendapatan != null;
    const badge = hasPendapatan
      ? `${rpShort(fase.pendapatan.min)}–${rpShort(fase.pendapatan.max)}`
      : undefined;
    return {
      range: `Bln ${fase.mulai_bulan}${fase.selesai_bulan != null ? `–${fase.selesai_bulan}` : '+'}`,
      active: hasPendapatan,
      title: fase.fase,
      sub: (fase.fokus || []).join('; '),
      badge,
    };
  });

  // Proyeksi pendapatan dari jalur_pendapatan.tahapan flow 5
  // Gunakan nilai_tengah entry sebagai titik awal kerja (bulan ke-54 default)
  const entryTahap = tahapanPendapatan.find((t) => t.tahap === 'entry');
  const midTahap = tahapanPendapatan.find((t) => t.tahap === 'mid');
  const seniorTahap = tahapanPendapatan.find((t) => t.tahap === 'senior');
  const entryVal = entryTahap ? entryTahap.nilai_tengah / 1e6 : 7;
  const midVal = midTahap ? midTahap.nilai_tengah / 1e6 : 10;
  const seniorVal = seniorTahap ? seniorTahap.nilai_tengah / 1e6 : 21.5;
  // mulai kerja dari roadmap_karier: fase pertama yang punya pendapatan
  const faseKerja = roadmapKarier.find((f) => f.pendapatan != null);
  const mulaiKerjaBln = faseKerja?.mulai_bulan ?? 54;
  const faseMidBln = roadmapKarier.find((f, i) => i > roadmapKarier.indexOf(faseKerja) && f.pendapatan != null)?.mulai_bulan ?? (mulaiKerjaBln + 24);

  const maxBln = 130;
  const yMax = Math.ceil(Math.max(seniorVal, 30) / 10) * 10;
  const incomePoints = [
    { x: 0, y: 1.5 / yMax },
    { x: mulaiKerjaBln / maxBln, y: 1.5 / yMax },
    { x: (mulaiKerjaBln + 1) / maxBln, y: entryVal / yMax },
    { x: faseMidBln / maxBln, y: entryVal / yMax },
    { x: (faseMidBln + 1) / maxBln, y: midVal / yMax },
    { x: 1, y: seniorVal / yMax },
  ];
  const yLabels = [
    { yn: 0, text: '0' },
    { yn: (yMax * 0.25) / yMax, text: String(Math.round(yMax * 0.25)) },
    { yn: (yMax * 0.5) / yMax, text: String(Math.round(yMax * 0.5)) },
    { yn: (yMax * 0.75) / yMax, text: String(Math.round(yMax * 0.75)) },
    { yn: 1, text: String(yMax) },
  ];
  const xLabels = [
    { xn: 0, text: 'Kini' }, { xn: 24 / maxBln, text: '2 th' }, { xn: 48 / maxBln, text: '4 th' },
    { xn: 72 / maxBln, text: '6 th' }, { xn: 96 / maxBln, text: '8 th' }, { xn: 1, text: '11 th' },
  ];

  // Timeline segments: persiapan (grey), kuliah (grey), magang (grey), kerja (green)
  const TL = maxBln;
  const segments = [
    { left: 0, width: (4 / TL) * 100, color: C.soft, border: '#B8C9C5' },
    { left: (4.5 / TL) * 100, width: (18 / TL) * 100, color: C.soft, border: '#B8C9C5' },
    { left: (23 / TL) * 100, width: (18 / TL) * 100, color: C.soft, border: '#B8C9C5' },
    { left: (mulaiKerjaBln / TL) * 100, width: ((faseMidBln - mulaiKerjaBln) / TL) * 100, color: '#9FE1CB', border: '#0F6E56' },
    { left: (faseMidBln / TL) * 100, width: ((TL - faseMidBln) / TL) * 100, color: '#9FE1CB', border: '#0F6E56' },
  ];
  const milestones = [
    { pct: (4.5 / TL) * 100 },
    { pct: (mulaiKerjaBln / TL) * 100 },
  ];
  const tlLabels = [
    { pct: 0, text: 'Kini' }, { pct: (18 / TL) * 100, text: '2 th' }, { pct: (36 / TL) * 100, text: '4 th' },
    { pct: (54 / TL) * 100, text: '6 th' }, { pct: (72 / TL) * 100, text: '8 th' },
  ];

  // Pilihan karier: dari rekomendasi[] flow 5
  const karierOptions = reko.slice(0, 3).map((r) => {
    const entry = r.jalur_pendapatan?.tahapan?.find((t) => t.tahap === 'entry');
    const gaji = entry ? `${rpShort(entry.rentang_min)}–${rpShort(entry.rentang_max)}` : null;
    return { nama: r.profesi, skor: r.skor_kecocokan, gaji };
  });

  // Data keuangan dari flow 4
  const pendapatan = analysis?.dashboard?.pendapatan ?? null;
  const menabung = analysis?.alokasi_bulan_ini?.kapasitas_menabung ?? null;
  const tabungan = analysis?.dana_darurat?.dana_likuid_saat_ini ?? null;

  const topJurusan = (karier?.hasil?.rekomendasi_jurusan || []).slice(0, 2).map((j) => j.jurusan).join(' / ');

  return (
    <>
      <T size={13} color={C.muted}>Dari SMA ke kampus terbaik, lalu karier di bidang data dan teknologi.</T>
      <StatRow items={[
        { label: 'Uang saku', value: pendapatan != null ? rpShort(pendapatan) : '–' },
        { label: 'Menabung/bln', value: menabung != null ? rpShort(menabung) : '–' },
        { label: 'Tabungan', value: tabungan != null ? rpShort(tabungan) : '–' },
      ]} />
      <Card>
        <T size={15} w={800} style={{ marginBottom: 12 }}>Garis waktu</T>
        <TimelineBar segments={segments} milestones={milestones} deadline={null} labels={tlLabels} />
      </Card>
      {phases.length > 0 && (
        <Card>
          <T size={15} w={800} style={{ marginBottom: 12 }}>Fase ({topReko?.profesi || 'karier teratas'})</T>
          <PhaseList phases={phases} />
        </Card>
      )}
      <Card>
        <T size={15} w={800} style={{ marginBottom: 12 }}>Proyeksi pendapatan</T>
        <IncomeChart points={incomePoints} baseline={null} xLabels={xLabels} yLabels={yLabels} milestoneX={mulaiKerjaBln / maxBln} />
      </Card>
      {karierOptions.length > 0 && (
        <Card>
          <T size={15} w={800} style={{ marginBottom: 12 }}>Pilihan karier (mulai kerja bulan ke-{mulaiKerjaBln})</T>
          {karierOptions.map((k, i) => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: i > 0 ? 6 : 0 }}>
              <T size={13} color={C.muted}>{k.nama}</T>
              <T size={13} w={i === 0 ? 800 : 700} color={i === 0 ? C.teal : C.ink} style={{ textAlign: 'right' }}>
                {k.skor}{k.gaji ? ` · awal ${k.gaji}` : ''}
              </T>
            </View>
          ))}
        </Card>
      )}
      {karierOptions.length === 0 && (
        <Card>
          <T size={13} color={C.muted}>Data karier belum tersedia. Buka tab Karier untuk memuat data dari Langflow.</T>
        </Card>
      )}
      <TipBox>Rekomendasi: targetkan {topJurusan || 'S1 Sistem Informasi atau Teknik Informatika'} di ITB, UI, UGM, atau Unpad lewat SNBP/SNBT, dengan Telkom University sebagai cadangan di Bandung.</TipBox>
    </>
  );
}

// ── main screen ───────────────────────────────────────────────────
export default function Roadmap({ go }) {
  const app = useApp();
  const uid = app.activeUserId;

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
        <T size={20} w={800} style={{ flex: 1, letterSpacing: -0.2 }}>Roadmap</T>
        <Button
          label="Tujuan Saya"
          icon="flag"
          variant="secondary"
          onPress={() => go('tujuan')}
          style={{ minHeight: 44, paddingHorizontal: 14 }}
        />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8, paddingBottom: 100, gap: 14 }} showsVerticalScrollIndicator={false}>
        {uid === 'budi' && <BudiRoadmap analysis={app.analysis} />}
        {uid === 'agus' && <AgusRoadmap analysis={app.analysis} />}
        {uid === 'dini' && <DiniRoadmap karier={app.karier} analysis={app.analysis} />}
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
