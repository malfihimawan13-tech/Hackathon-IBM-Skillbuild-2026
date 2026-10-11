import React, { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import Svg, { Line, Polyline, Rect, Text as SvgText } from 'react-native-svg';
import { useApp } from '../state/AppContext';
import { DEMO } from '../api/demoData';
import { findPersona } from '../state/persona';
import { Button, Card, ErrorBox, KV, Screen, ScreenHeader, T } from '../components/ui';
import { ImpactCard } from '../components/forms';
import Icon from '../components/Icon';
import { C } from '../theme';
import { rpShort } from '../utils/format';

const SKEN = [['pesimis', 'Pesimis'], ['moderat', 'Moderat'], ['optimis', 'Optimis']];

// ── shared helpers ────────────────────────────────────────────────
function Row({ label, value, teal }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
      <T size={13} color={C.muted}>{label}</T>
      <T size={13} w={teal ? 800 : 700} color={teal ? C.teal : C.ink} style={{ textAlign: 'right' }}>{value}</T>
    </View>
  );
}

function Pill({ text, color = C.teal, bg = C.soft }) {
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: bg, alignSelf: 'flex-start' }}>
      <T size={12} w={700} color={color}>{text}</T>
    </View>
  );
}

// ── Stacked bar chart (omzet 6 months, Agus) ──────────────────────
function BarChart6({ bengkel, kelontong }) {
  const W = 326, H = 190, PL = 34, PT = 12, PB = 24;
  const months = ['Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep'];
  // Simulate slight variation per month
  const varB = [0.97, 0.99, 1.03, 0.98, 1.01, 1.02];
  const varK = [0.96, 0.98, 1.05, 0.99, 0.97, 1.05];
  const maxVal = Math.max(...varB.map((v) => bengkel * v + kelontong * 1.1)) * 1.1;
  const yMax = Math.ceil(maxVal / 5000000) * 5; // round up to juta
  const yLabels = [0, Math.round(yMax * 0.25), Math.round(yMax * 0.5), Math.round(yMax * 0.75), yMax];
  const bW = 24, gap = (W - PL - 8 - months.length * bW) / months.length;
  const cx = (i) => PL + i * (bW + gap) + gap / 2 + bW / 2 + 12;
  const cy = (v) => PT + (1 - v / (yMax * 1000000)) * (H - PT - PB);
  const svgProps = Platform.OS !== 'web' ? { accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' } : {};

  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Omzet 6 bulan" {...svgProps}>
      {yLabels.map((v) => {
        const y = cy(v * 1000000);
        return (
          <React.Fragment key={v}>
            <Line x1={PL} y1={y} x2={W - 6} y2={y} stroke={C.line} strokeWidth={1} />
            <SvgText x={PL - 6} y={y + 4} fontSize={10} fill={C.muted} textAnchor="end">{v}</SvgText>
          </React.Fragment>
        );
      })}
      {months.map((m, i) => {
        const bVal = bengkel * varB[i];
        const kVal = kelontong * varK[i];
        const x = cx(i) - bW / 2;
        const yBase = cy(0);
        const hB = yBase - cy(bVal);
        const hK = yBase - cy(kVal);
        return (
          <React.Fragment key={m}>
            <Rect x={x} y={cy(bVal)} width={bW} height={hB} rx={0} fill={C.teal} />
            <Rect x={x} y={cy(bVal + kVal)} width={bW} height={hK} rx={4} fill={C.gold} />
            <SvgText x={x + bW / 2} y={H - 8} fontSize={10} fill={C.muted} textAnchor="middle">{m}</SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

// ── Agus usaha card (one business) ────────────────────────────────
function UsahaCard({ usaha, pctPendapatan, accentColor }) {
  const bersih = usaha.omzet - usaha.biaya;
  const marginPct = Math.round((bersih / usaha.omzet) * 100);
  const biayaFlex = usaha.biaya;
  const bersihFlex = bersih;
  return (
    <Card style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <T w={800} size={15} style={{ flex: 1 }}>{usaha.nama}</T>
        <Pill text={`${pctPendapatan}% pendapatan`} color={accentColor} bg={accentColor === C.teal ? C.soft : C.goldSoft} />
      </View>
      <Row label="Omzet rata-rata" value={rpShort(usaha.omzet)} />
      <Row label="Biaya operasional" value={rpShort(usaha.biaya)} />
      <Row label="Penghasilan bersih" value={rpShort(bersih)} teal />
      <Row label="Margin bersih" value={`${marginPct}%`} />
      {/* split bar */}
      <View style={{ flexDirection: 'row', height: 14, borderRadius: 999, overflow: 'hidden', gap: 3 }}>
        <View style={{ flex: biayaFlex, backgroundColor: '#B8C9C5' }} />
        <View style={{ flex: bersihFlex, backgroundColor: accentColor }} />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: '#B8C9C5' }} />
          <T size={11} color={C.muted}>Biaya</T>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: accentColor }} />
          <T size={11} color={C.muted}>Bersih</T>
        </View>
      </View>
    </Card>
  );
}

// ── AGUS USAHA SCREEN ─────────────────────────────────────────────
function AgusUsaha({ go }) {
  const app = useApp();
  const persona = findPersona(app.activeUserId);
  const bengkel = persona?.usaha?.[0];
  const kelontong = persona?.usaha?.[1];
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  if (!bengkel || !kelontong) return null;

  const bengkelBersih = bengkel.omzet - bengkel.biaya;
  const kelontongBersih = kelontong.omzet - kelontong.biaya;
  const totalBersih = bengkelBersih + kelontongBersih;
  const pctBengkel = Math.round((bengkelBersih / totalBersih) * 100);
  const pctKelontong = 100 - pctBengkel;

  // tambahan_laba_bulanan: laba_bersih × kenaikan_persen (dari persona, dikonfirmasi flow 4)
  const bengkelTambahan = Math.round(bengkelBersih * 0.2);   // 11jt × 20% = 2.2jt
  const kelontongTambahan = Math.round(kelontongBersih * 0.25); // 3jt × 25% = 750rb
  const gabunganTambahan = bengkelTambahan + kelontongTambahan;

  // Ambil sisa sebelum/sesudah dari skenario.agus (dimuat loadSkenarioAgus)
  // Setiap skenario menyimpan hasil analisis lengkap (bukan wrapper sebelum/sesudah)
  const sk = app.skenario?.agus;
  const sisaDasar = sk?.dasar?.dashboard?.sisa ?? app.analysis?.dashboard?.sisa;
  const sisaGabungan = sk?.gabungan?.dashboard?.sisa;

  const sisaSebelumTeks = sisaDasar != null ? rpShort(sisaDasar) : '–';
  const sisaSetelahTeks = sisaGabungan != null ? rpShort(sisaGabungan) : '–';

  const muatSkenario = async () => {
    setBusy(true); setErr('');
    try { await app.loadSkenarioAgus(); } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  useEffect(() => {
    if (!sk && app.loadSkenarioAgus) { muatSkenario(); }
  }, []); // eslint-disable-line

  const LANGKAH = [
    'Bengkel: paket servis berkala dan pengingat pelanggan tetap',
    'Bengkel: catat jenis servis paling laris untuk stok sparepart',
    'Kelontong: catat barang laris dan tambah stok di jam ramai',
    'Pisahkan rekening usaha dan rumah tangga',
  ];

  return (
    <Screen>
      <ScreenHeader title="Usaha keluarga" onBack={() => go('home')} />

      <T size={13} color={C.muted}>Dua sumber pendapatan: bengkel motor milik Agus dan usaha kelontong milik istri.</T>

      {/* Omzet chart */}
      <Card style={{ gap: 10 }}>
        <T w={800} size={15}>Omzet 6 bulan</T>
        <BarChart6 bengkel={bengkel.omzet} kelontong={kelontong.omzet} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: C.teal }} />
            <T size={11} color={C.muted}>Bengkel</T>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: C.gold }} />
            <T size={11} color={C.muted}>Kelontong</T>
          </View>
        </View>
      </Card>

      {/* Individual business cards */}
      <UsahaCard usaha={{ ...bengkel, nama: 'Bengkel motor (Agus)' }} pctPendapatan={pctBengkel} accentColor={C.teal} />
      <UsahaCard usaha={{ ...kelontong, nama: 'Kelontong (istri)' }} pctPendapatan={pctKelontong} accentColor={C.gold} />

      {/* Simulasi pengembangan */}
      <Card style={{ gap: 10 }}>
        <T w={800} size={15}>Simulasi pengembangan usaha</T>
        {busy && !sk && <T size={12} color={C.muted}>Memuat simulasi dari Langflow…</T>}
        <Row label="B · Omzet bengkel +20%" value={`+${rpShort(bengkelTambahan)}/bulan`} teal />
        <T size={11} color={C.muted} style={{ lineHeight: 16 }}>
          {`Tambahan laba bersih dari kenaikan omzet 20% dengan margin tetap ${Math.round((bengkelBersih / bengkel.omzet) * 100)}%.`}
        </T>
        <Row label="C · Omzet kelontong +25%" value={`+${rpShort(kelontongTambahan)}/bulan`} teal />
        <T size={11} color={C.muted} style={{ lineHeight: 16 }}>
          {`Tambahan laba bersih dari kenaikan omzet 25% dengan margin tetap ${Math.round((kelontongBersih / kelontong.omzet) * 100)}%.`}
        </T>
        <Row label="B + C · Gabungan" value={`+${rpShort(gabunganTambahan)}/bulan`} teal />
        <T size={11} color={C.muted} style={{ lineHeight: 16 }}>
          {`Sisa per bulan naik dari ${sisaSebelumTeks} menjadi ${sisaSetelahTeks}.`}
        </T>
        {err ? <T size={12} color={C.warn}>{err}</T> : null}
        {!sk && !busy && (
          <Button label="Muat ulang simulasi" icon="refresh" onPress={muatSkenario} />
        )}
      </Card>

      {/* Langkah awal */}
      <Card style={{ gap: 10 }}>
        <T w={800} size={15}>Ide langkah awal</T>
        {LANGKAH.map((l) => (
          <View key={l} style={{ flexDirection: 'row', gap: 8 }}>
            <Icon name="check" size={16} color={C.teal} />
            <T size={13} style={{ flex: 1, lineHeight: 20 }}>{l}</T>
          </View>
        ))}
        <T size={11} color={C.muted} style={{ lineHeight: 16 }}>Ide umum, sesuaikan dengan kondisi lokasi usaha.</T>
      </Card>

      <Button label="Lihat dampak ke rumah" icon="route" onPress={() => go('roadmap')} />
    </Screen>
  );
}

// ── Budi usaha: skenario bar ──────────────────────────────────────
function ScenarioBar({ label, bulan, maxBulan, deadlinePct, isPast }) {
  const w = Math.min(bulan / maxBulan, 1);
  const barColor = isPast ? '#F5C4B3' : C.soft;
  const textColor = isPast ? '#712B13' : C.teal;
  const label2 = bulan > maxBulan
    ? `${Math.floor(bulan / 12)} th ${bulan % 12 > 0 ? `${bulan % 12} bl` : ''}`.trim() + ' (melewati grafik)'
    : `${Math.floor(bulan / 12)} th${bulan % 12 > 0 ? ` ${bulan % 12} bl` : ''}`;
  return (
    <View style={{ gap: 4 }}>
      <T size={12} w={600}>{label}</T>
      <View style={{ height: 22, borderRadius: 6, backgroundColor: '#F4F6F5', position: 'relative', overflow: 'visible' }}>
        <View style={{ position: 'absolute', left: 0, top: 0, height: 22, width: `${w * 100}%`, borderRadius: 6, backgroundColor: barColor }} />
        {deadlinePct != null && (
          <View style={{ position: 'absolute', left: `${deadlinePct * 100}%`, top: -3, width: 1.5, height: 28, borderLeftWidth: 1.5, borderLeftColor: '#D85A30', borderStyle: 'dashed' }} />
        )}
        <T size={11} w={800} color={textColor} style={{ position: 'absolute', left: 8, top: 5 }}>{label2}</T>
      </View>
    </View>
  );
}

// Helper: konversi teks Langflow ("5 tahun 6 bulan", "22 tahun 1 bulan", dll.) ke bulan
function teksKeBulan(teks) {
  if (!teks) return null;
  const th = teks.match(/(\d+)\s*tahun/);
  const bl = teks.match(/(\d+)\s*bulan/);
  return (th ? parseInt(th[1], 10) * 12 : 0) + (bl ? parseInt(bl[1], 10) : 0);
}

// ── Budi: batang skenario mobil (dari skenario.budi / demo karier_simulasi) ──
function BudiScenarioBarsCard() {
  const app = useApp();
  const sk = app.skenario?.budi;
  // Pakai data dari skenario.budi (Langflow) jika tersedia, fallback ke demo
  const demo = DEMO.budi?.karier_simulasi || {};
  const get = (key) => {
    const t = sk?.[key]?.sesudah?.target?.Mobil ?? demo[key]?.sesudah?.target?.Mobil;
    return teksKeBulan(t);
  };
  const baseline = teksKeBulan(sk?.dasar?.sesudah?.target?.Mobil ?? demo?.data_scientist?.sebelum?.target?.Mobil);
  const bDS = get('data_scientist');
  const bDA = get('data_analyst');
  const bKopi = get('kopi_pesimis');
  const bDSKopiP = get('data_scientist_kopi_pesimis');
  const maxDisplay = 270;
  const deadlinePct = 60 / maxDisplay;
  if (!bDS && !bDA) return null;
  return (
    <Card style={{ gap: 10 }}>
      <T w={800} size={15}>Dampak ke mobil Rp250 jt</T>
      <View style={{ gap: 10 }}>
        <ScenarioBar label="Tetap kerja sekarang" bulan={baseline ?? 265} maxBulan={maxDisplay} deadlinePct={deadlinePct} isPast />
        {bKopi != null && <ScenarioBar label="Usaha kopi saja (pesimis)" bulan={bKopi} maxBulan={maxDisplay} deadlinePct={deadlinePct} isPast />}
        {bDS != null && <ScenarioBar label="Data Scientist saja" bulan={bDS} maxBulan={maxDisplay} deadlinePct={deadlinePct} isPast />}
        {bDSKopiP != null && <ScenarioBar label="Data Scientist + kopi (pesimis)" bulan={bDSKopiP} maxBulan={maxDisplay} deadlinePct={deadlinePct} isPast={false} />}
      </View>
    </Card>
  );
}

// ── Budi usaha: detail card ───────────────────────────────────────
function UsahaDetailCard({ h, go }) {
  const app = useApp();
  const [impact, setImpact] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const lihatDampak = async () => {
    setBusy(true); setErr('');
    try {
      const simulasi = h.simulasi_siap_pakai_per_skenario?.pesimis ?? h.simulasi_siap_pakai;
      setImpact((await app.simulateRoadmap(simulasi, ['usaha', h.id])).perbandingan);
    }
    catch (e) { setErr(e.message); }
    setBusy(false);
  };

  const m = h.modal_awal;
  return (
    <View style={{ gap: 14 }}>
      <Card style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <T w={800} size={18} style={{ flex: 1 }}>{h.usaha}</T>
          <View style={{ alignItems: 'flex-end' }}>
            <T w={800} size={26} color={C.teal}>{h.skor_kecocokan}</T>
            <T size={11} color={C.muted}>kecocokan</T>
          </View>
        </View>
        <View style={{ height: 8, borderRadius: 999, backgroundColor: C.soft, overflow: 'hidden' }}>
          <View style={{ width: `${h.skor_kecocokan}%`, height: 8, borderRadius: 999, backgroundColor: C.teal }} />
        </View>
        <View style={{ gap: 6 }}>
          {(h.alasan || []).map((a, i) => {
            const warn = a.startsWith('Perhatian') || a.includes('masih kurang');
            return (
              <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
                <Icon name={warn ? 'alert' : 'check'} size={16} color={warn ? C.warn : C.teal} />
                <T size={13} style={{ flex: 1, lineHeight: 19 }}>{a}</T>
              </View>
            );
          })}
        </View>
        <Row label="Model pendapatan" value={h.model_pendapatan} />
        <Row label="Biaya rutin" value={h.biaya_operasional_bulanan} />
        {h.skill_gap?.length ? (
          <>
            <T w={700} size={12}>Perlu dipelajari</T>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {h.skill_gap.map((s) => (
                <View key={s} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: C.warnSoft }}>
                  <T size={12} w={700} color={C.warn}>{s}</T>
                </View>
              ))}
            </View>
          </>
        ) : null}
      </Card>

      {/* Tiga skenario */}
      <Card style={{ gap: 10 }}>
        <T w={800} size={15}>Tiga skenario</T>
        <View style={{ flexDirection: 'row' }}>
          <T size={12} color={C.muted} style={{ flex: 1.3 }} />
          {SKEN.map(([k, l]) => <T key={k} w={700} size={12} color={k === 'moderat' ? C.teal : C.muted} style={{ flex: 1 }}>{l}</T>)}
        </View>
        {[
          ['Laba/bulan (stabil)', 'laba_bulanan_stabil', rpShort],
          ['Laba tahun pertama', 'laba_tahun_pertama', rpShort],
          ['Balik modal', 'balik_modal', (x) => x],
        ].map(([label, key, f]) => (
          <View key={key} style={{ flexDirection: 'row' }}>
            <T size={13} color={C.muted} style={{ flex: 1.3 }}>{label}</T>
            {SKEN.map(([k]) => <T key={k} w={k === 'moderat' ? 800 : 600} size={13} style={{ flex: 1 }}>{f(h.skenario[k][key])}</T>)}
          </View>
        ))}
        <T size={11} color={C.muted} style={{ lineHeight: 16 }}>
          Masa rintisan: bulan pertama 30% dari kondisi stabil, stabil di bulan ke-6.
          {h.id === 'kopi_keliling' ? ' Sumber: Medcom 2026 (data usaha penuh waktu). Sebagai usaha sampingan akhir pekan, pakai skenario pesimis sebagai acuan.' : ` Perkiraan balik modal menurut sumber: ${h.balik_modal_menurut_sumber}.`}
        </T>
        {h.dasar_angka ? <T size={11} color={C.muted} style={{ lineHeight: 16 }}>Dasar angka: {h.dasar_angka}</T> : null}
      </Card>

      {/* Dampak ke tujuan */}
      <Button label="Lihat dampak ke tujuanku" icon="target" onPress={lihatDampak} loading={busy} />
      <ErrorBox message={err} />
      <ImpactCard perbandingan={impact} title={`Jika membuka ${h.usaha.toLowerCase()} (skenario pesimis)`} />

      {/* Dampak ke mobil — scenario bars (data dari skenario.budi) */}
      <BudiScenarioBarsCard />

      {/* Risiko */}
      {h.risiko?.length ? (
        <Card style={{ gap: 8 }}>
          <T w={800} size={15}>Risiko</T>
          {h.risiko.map((r) => (
            <View key={r} style={{ flexDirection: 'row', gap: 8 }}>
              <Icon name="check" size={16} color={C.teal} />
              <T size={13} style={{ flex: 1, lineHeight: 20 }}>{r}</T>
            </View>
          ))}
        </Card>
      ) : null}

      {/* Roadmap */}
      {h.roadmap_usaha?.length ? (
        <Card style={{ gap: 12 }}>
          <T w={800} size={15}>Roadmap 12 bulan pertama</T>
          {h.roadmap_usaha.map((f, i) => {
            const range = f.fase.match(/Bulan ([^:]+)/)?.[1] || '';
            const title = f.fase.replace(/Bulan [^:]+: /, '');
            return (
              <View key={f.fase} style={{ flexDirection: 'row', gap: 10 }}>
                <T size={11} color={C.muted} style={{ width: 56, flexShrink: 0, paddingTop: 2 }}>Bln {range}</T>
                <View style={{ width: 10, height: 10, borderRadius: 5, marginTop: 4, flexShrink: 0, backgroundColor: i >= 2 ? C.teal : '#B8C9C5' }} />
                <View style={{ flex: 1, gap: 2 }}>
                  <T size={13} w={700}>{title}</T>
                  {f.langkah.map((l) => <T key={l} size={11} color={C.muted} style={{ lineHeight: 16 }}>{l}</T>)}
                </View>
              </View>
            );
          })}
        </Card>
      ) : null}

      <Button label="Lihat roadmap gabungan" icon="route" onPress={() => go('roadmap')} />
    </View>
  );
}

// ── BUDI USAHA SCREEN ─────────────────────────────────────────────
function BudiUsaha({ go }) {
  const app = useApp();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [sel, setSel] = useState(0);

  const hasil = app.usaha?.hasil;
  const rekomendasi = hasil?.rekomendasi || [];

  useEffect(() => {
    if (!hasil) {
      setBusy(true);
      app.exploreUsahaKopi().catch((e) => setErr(e.message)).finally(() => setBusy(false));
    }
  }, []); // eslint-disable-line

  return (
    <Screen>
      <ScreenHeader title="Usaha sampingan" onBack={() => go('home')} />

      <T size={13} color={C.muted}>Minat kopi dan minuman, modal Rp3 jt, dijalankan sambil tetap bekerja.</T>

      {busy && !hasil ? (
        <View style={{ padding: 24, alignItems: 'center' }}>
          <T size={14} color={C.muted}>Memuat pilihan usaha…</T>
        </View>
      ) : rekomendasi.length > 0 ? (
        <>
          {/* Rekomendasi cards grid */}
          <Card style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <T w={800} size={15} style={{ flex: 1 }}>Rekomendasi usaha</T>
              <Pill text={`${rekomendasi.length} pilihan`} />
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {rekomendasi.map((h, i) => {
                const on = i === sel;
                return (
                  <Pressable key={h.id} onPress={() => setSel(i)} accessibilityRole="tab" accessibilityState={{ selected: on }}
                    style={{ flex: 1, borderRadius: 20, padding: 12, paddingHorizontal: 8, borderWidth: on ? 2 : 1, borderColor: on ? C.teal : C.line, alignItems: 'center', gap: 6 }}>
                    <T w={800} size={22} color={C.teal}>{h.skor_kecocokan}</T>
                    <T w={700} size={12} style={{ textAlign: 'center', lineHeight: 17 }}>{h.usaha}</T>
                    <T size={10} color={C.muted}>modal {rpShort(h.modal_awal.min)}–{rpShort(h.modal_awal.max)}</T>
                  </Pressable>
                );
              })}
            </View>
            <T size={11} color={C.muted} style={{ lineHeight: 16 }}>
              Kecocokan = modal (40) + minat (30) + skill & pengalaman (30).
              {rekomendasi.find((r) => r.modal_belum_cukup) ? ' Warkop butuh modal lebih besar; simpan dulu.' : ''}
            </T>
          </Card>

          {rekomendasi[sel] && <UsahaDetailCard key={rekomendasi[sel].id} h={rekomendasi[sel]} go={go} />}

          <T size={11} color={C.muted} style={{ lineHeight: 16 }}>{hasil.disclaimer || ''}</T>
        </>
      ) : null}

      <ErrorBox message={err} />
    </Screen>
  );
}

// ── DEFAULT EXPORT: persona router ───────────────────────────────
export default function Usaha({ go }) {
  const app = useApp();
  const uid = app.activeUserId;
  if (uid === 'agus') return <AgusUsaha go={go} />;
  return <BudiUsaha go={go} />;
}
