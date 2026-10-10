import React, { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import Svg, { Circle, Line, Path, Polyline, Text as SvgText } from 'react-native-svg';
import { useApp } from '../state/AppContext';
import { DEMO } from '../api/demoData';
import { findPersona } from '../state/persona';
import { Bar, Button, Card, Chip, ErrorBox, KV, Screen, ScreenHeader, T } from '../components/ui';
import { ImpactCard } from '../components/forms';
import Icon from '../components/Icon';
import { C, R } from '../theme';
import { rpShort } from '../utils/format';

const LEVEL_COLORS = { 'Mahir': C.teal, 'Menengah': '#1F6F66', 'Dasar': '#5DCAA5' };
const LEVEL_BARS = { 'Mahir': 3, 'Menengah': 2, 'Dasar': 1 };
const TAHAP = { entry: 'Level awal', mid: 'Menengah', senior: 'Senior' };

// ── shared helpers ────────────────────────────────────────────────
function Pill({ text, color = C.teal, bg = C.soft }) {
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: bg, alignSelf: 'flex-start' }}>
      <T size={12} w={700} color={color}>{text}</T>
    </View>
  );
}

function ChipRow({ items, tone }) {
  if (!items?.length) return <T size={13} color={C.muted}>-</T>;
  const bg = tone === 'warn' ? C.warnSoft : tone === 'muted' ? C.ground : C.soft;
  const color = tone === 'warn' ? C.warn : tone === 'muted' ? C.muted : C.teal;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {items.map((s) => (
        <View key={s} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: bg }}>
          <T size={12} w={700} color={color}>{s}</T>
        </View>
      ))}
    </View>
  );
}

function SkillBar({ skill }) {
  const bars = LEVEL_BARS[skill.level] || 1;
  const color = LEVEL_COLORS[skill.level] || C.teal;
  return (
    <View style={{ gap: 5 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <T size={13} w={600}>{skill.nama}</T>
        <T size={12} color={C.muted}>{skill.level}</T>
      </View>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={{ flex: 1, height: 8, borderRadius: 3, backgroundColor: i <= bars ? color : '#E3EFEC' }} />
        ))}
      </View>
    </View>
  );
}

// Income projection chart (reused from Roadmap pattern)
function IncomeChart({ tahapan, gajiSekarang }) {
  if (!tahapan?.length) return null;
  const maxVal = Math.max(gajiSekarang || 0, ...tahapan.map((t) => t.rentang_max || 0)) || 35000000;
  const W = 326, H = 170, PL = 34, PR = 8, PT = 12, PB = 24;
  const cx = (xn) => PL + xn * (W - PL - PR);
  const cy = (yn) => PT + (1 - yn) * (H - PT - PB);
  const svgProps = Platform.OS !== 'web' ? { accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' } : {};

  // Build step-points from tahapan
  const pts = [];
  const xSteps = tahapan.map((t, i) => {
    const yr = parseFloat((t.perkiraan_tahun_ke || '0').split('-')[0]) || i * 2;
    return yr / 8; // normalise over 8 years
  });
  pts.push({ xn: 0, yn: (gajiSekarang || 0) / maxVal });
  tahapan.forEach((t, i) => {
    const yn = (t.nilai_tengah || t.rentang_min || 0) / maxVal;
    const xn = Math.min(xSteps[i], 1);
    if (pts[pts.length - 1].xn < xn) pts.push({ xn, yn });
    pts.push({ xn: Math.min(xn + 0.01, 1), yn });
  });
  pts.push({ xn: 1, yn: pts[pts.length - 1].yn });

  const polyPts = pts.map((p) => `${cx(p.xn).toFixed(1)},${cy(p.yn).toFixed(1)}`).join(' ');
  const baselineY = cy((gajiSekarang || 0) / maxVal);

  const yMax = Math.ceil(maxVal / 5000000) * 5; // in juta
  const yLabels = [0, Math.round(yMax * 0.25), Math.round(yMax * 0.5), Math.round(yMax * 0.75), yMax];

  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Proyeksi pendapatan" {...svgProps}>
      {yLabels.map((v) => {
        const y = cy(v / yMax);
        return (
          <React.Fragment key={v}>
            <Line x1={PL} y1={y} x2={W - PR} y2={y} stroke={C.line} strokeWidth={1} />
            <SvgText x={PL - 6} y={y + 4} fontSize={10} fill={C.muted} textAnchor="end">{v}</SvgText>
          </React.Fragment>
        );
      })}
      {['Kini', '2 th', '4 th', '6 th', '8 th'].map((l, i) => (
        <SvgText key={l} x={cx(i / 4)} y={H - 8} fontSize={10} fill={C.muted} textAnchor="middle">{l}</SvgText>
      ))}
      <Polyline points={`${cx(0)},${baselineY} ${cx(1)},${baselineY}`} fill="none" stroke={C.line} strokeWidth={2.4} strokeDasharray="5 4" />
      <Polyline points={polyPts} fill="none" stroke={C.teal} strokeWidth={2.4} strokeLinejoin="round" />
      {pts.filter((_, i) => i % 2 === 0).map((p, i) => (
        <Circle key={i} cx={cx(p.xn)} cy={cy(p.yn)} r={3} fill={C.white} stroke={C.teal} strokeWidth={2} />
      ))}
    </Svg>
  );
}

// ── Budi: full career detail card ────────────────────────────────
function DetailCard({ h, isTarget }) {
  const app = useApp();
  const [impact, setImpact] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const tahap = h.jalur_pendapatan?.tahapan || [];
  const belajar = h.jalur_belajar || {};
  const gajiSekarang = app.analysis?.dashboard?.pendapatan || 9000000;

  const lihatDampak = async () => {
    setBusy(true); setErr('');
    try { setImpact((await app.simulateRoadmap(h.simulasi_siap_pakai, ['karier', h.id])).perbandingan); }
    catch (e) { setErr(e.message); }
    setBusy(false);
  };

  return (
    <View style={{ gap: 14 }}>
      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <T w={800} size={18}>{h.profesi}</T>
              {isTarget && <Pill text="Target" />}
            </View>
            <T size={13} color={C.muted}>{h.bidang}</T>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <T w={800} size={26} color={C.teal}>{h.skor_kecocokan}</T>
            <T size={11} color={C.muted}>kecocokan</T>
          </View>
        </View>
        <View style={{ height: 8, borderRadius: 999, backgroundColor: C.soft, overflow: 'hidden' }}>
          <View style={{ width: `${h.skor_kecocokan}%`, height: 8, borderRadius: 999, backgroundColor: C.teal }} />
        </View>
        <View style={{ gap: 6 }}>
          {(h.alasan || []).map((a, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
              <Icon name={a.startsWith('Perhatian') || a.includes('kurang') ? 'alert' : 'check'} size={16} color={a.startsWith('Perhatian') ? C.warn : C.teal} />
              <T size={13} style={{ flex: 1, lineHeight: 19 }}>{a}</T>
            </View>
          ))}
        </View>
      </Card>

      <Card style={{ gap: 10 }}>
        <T w={800} size={15}>Skill gap</T>
        <T w={700} size={12}>Sudah dimiliki</T>
        <ChipRow items={h.skill_sudah_dimiliki} />
        <T w={700} size={12}>Perlu dipelajari (wajib)</T>
        <ChipRow items={h.skill_gap_wajib} tone="warn" />
        {h.skill_gap_pendukung?.length ? (
          <>
            <T w={700} size={12}>Nilai tambah</T>
            <ChipRow items={h.skill_gap_pendukung} tone="muted" />
          </>
        ) : null}
      </Card>

      <Card style={{ gap: 12 }}>
        <T w={800} size={15}>Perkiraan pendapatan</T>
        <IncomeChart tahapan={tahap} gajiSekarang={gajiSekarang} />
        {tahap.map((t) => (
          <View key={t.tahap} style={{ gap: 4 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <T w={700} size={13}>{TAHAP[t.tahap] || t.tahap} · th ke-{t.perkiraan_tahun_ke}</T>
              <T w={800} size={13}>{rpShort(t.rentang_min)} – {rpShort(t.rentang_max)}</T>
            </View>
            <T size={11} color={C.muted}>Sumber: {(t.sumber || []).join('; ')}</T>
          </View>
        ))}
      </Card>

      {h.jenjang_karier?.length ? (
        <Card style={{ gap: 10 }}>
          <T w={800} size={15}>Jenjang karier</T>
          {h.jenjang_karier.map((j, i) => (
            <View key={j} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: i === 0 ? C.teal : C.soft, alignItems: 'center', justifyContent: 'center' }}>
                <T w={800} size={12} color={i === 0 ? C.white : C.teal}>{i + 1}</T>
              </View>
              <T size={14} style={{ flex: 1 }}>{j}</T>
            </View>
          ))}
        </Card>
      ) : null}

      {(belajar.jalur_utama?.length || belajar.opsional_jangka_panjang?.length) ? (
        <Card style={{ gap: 10 }}>
          <T w={800} size={15}>Jalur belajar</T>
          {(belajar.jalur_utama || []).map((b) => (
            <View key={b.program} style={{ gap: 2 }}>
              <T w={700} size={14}>{b.program}</T>
              <T size={13}>{b.biaya_min == null ? b.satuan : b.biaya_min === b.biaya_max ? `${rpShort(b.biaya_min)} ${b.satuan}` : `${rpShort(b.biaya_min)} – ${rpShort(b.biaya_max)} ${b.satuan}`} · {b.durasi}</T>
              <T size={11} color={C.muted}>Sumber: {b.sumber}</T>
            </View>
          ))}
          {belajar.estimasi_biaya_jalur_utama?.max ? (
            <View style={{ backgroundColor: C.goldSoft, borderRadius: 14, padding: 12, marginTop: 4 }}>
              <KV k="Estimasi biaya jalur utama" v={`${rpShort(belajar.estimasi_biaya_jalur_utama.min)} – ${rpShort(belajar.estimasi_biaya_jalur_utama.max)}`} strong />
            </View>
          ) : null}
        </Card>
      ) : null}

      <Button label="Lihat dampak ke tujuanku" icon="target" onPress={lihatDampak} loading={busy} />
      <ErrorBox message={err} />
      <ImpactCard perbandingan={impact} title={`Jika menempuh jalur ${h.profesi}`} />
    </View>
  );
}

// ── Budi: compare table ───────────────────────────────────────────
function BandingkanJalur({ rekomendasi, karier_simulasi }) {
  if (!rekomendasi?.length) return null;
  const sim = karier_simulasi || {};
  return (
    <Card style={{ gap: 10 }}>
      <T w={800} size={15}>Bandingkan jalur</T>
      {rekomendasi.map((r) => {
        const s = sim[r.id]?.sesudah;
        const targetAvanza = s?.target?.['Toyota Avanza'];
        const tahap0 = r.jalur_pendapatan?.tahapan?.[0];
        const gajiAwal = tahap0 ? tahap0.nilai_tengah : null;
        const gajiSekarang = 9000000;
        const selisih = gajiAwal != null ? gajiAwal - gajiSekarang : null;
        return (
          <View key={r.id} style={{ gap: 2 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
              <T size={13} color={C.muted}>{r.profesi}</T>
              <T size={13} w={700} color={C.teal} style={{ textAlign: 'right' }}>
                {selisih != null ? `awal ${selisih >= 0 ? '+' : ''}${rpShort(selisih)}` : ''}{targetAvanza ? ` · mobil ${targetAvanza}` : ''}
              </T>
            </View>
          </View>
        );
      })}
    </Card>
  );
}

// ── Budi: portfolio suggestions ───────────────────────────────────
const PORTOFOLIO_DS = [
  'Model prediksi end-to-end dengan scikit-learn',
  'Analisis eksploratif + uji statistik di notebook',
  'Model di-deploy sebagai web app (Streamlit)',
];

// ── BUDI KARIER SCREEN ────────────────────────────────────────────
function BudiKarier({ go }) {
  const app = useApp();
  const persona = findPersona('budi');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [sel, setSel] = useState(0);

  const hasil = app.karier?.hasil;
  const rekomendasi = hasil?.rekomendasi || [];
  // Put target (Data Scientist) first if present
  const sorted = [...rekomendasi].sort((a, b) => {
    if (a.id === 'data_scientist') return -1;
    if (b.id === 'data_scientist') return 1;
    return 0;
  });

  const load = async () => {
    setBusy(true); setErr('');
    try {
      await app.exploreKarier({
        user_id: 'budi',
        minat: ['angka', 'komputer', 'data', 'AI'],
        skill: persona?.skills?.map((s) => s.nama) || [],
        pendidikan_terakhir: 'S1',
        kota: 'Tangerang',
        target_profesi: 'Data Scientist',
        pengalaman: [{ bidang: 'IT software', tahun: 2 }],
      });
      setSel(0);
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  useEffect(() => {
    if (!hasil) load();
  }, []); // eslint-disable-line

  return (
    <Screen>
      <ScreenHeader title="Karier" onBack={() => go('home')} />

      {/* Skill level card */}
      <Card style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <T w={800} size={15} style={{ flex: 1 }}>Skill kamu</T>
          <Pill text="BNSP" />
        </View>
        {(persona?.skills || []).map((s) => <SkillBar key={s.nama} skill={s} />)}
      </Card>

      {busy && !hasil ? (
        <View style={{ padding: 24, alignItems: 'center' }}>
          <T size={14} color={C.muted}>Memuat rekomendasi…</T>
        </View>
      ) : (
        <>
          {/* Tab selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {sorted.map((h, i) => {
              const on = i === sel;
              return (
                <Pressable key={h.id} onPress={() => setSel(i)} accessibilityRole="tab" accessibilityState={{ selected: on }}
                  style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14, backgroundColor: on ? C.ink : C.white, borderWidth: 1, borderColor: on ? C.ink : C.line, flexShrink: 0 }}>
                  <T w={700} size={13} color={on ? C.white : C.ink}>{h.profesi}</T>
                  <T size={11} color={on ? 'rgba(255,255,255,0.8)' : C.muted}>Kecocokan {h.skor_kecocokan}</T>
                </Pressable>
              );
            })}
          </ScrollView>

          {sorted[sel] && (
            <DetailCard key={sorted[sel].id} h={sorted[sel]} isTarget={sorted[sel].id === 'data_scientist'} />
          )}

          <BandingkanJalur rekomendasi={sorted} karier_simulasi={DEMO.karier_simulasi} />

          {/* Portfolio suggestions */}
          <Card style={{ gap: 10 }}>
            <T w={800} size={15}>Portofolio yang disarankan</T>
            {PORTOFOLIO_DS.map((p) => (
              <View key={p} style={{ flexDirection: 'row', gap: 8 }}>
                <Icon name="check" size={16} color={C.teal} />
                <T size={13} style={{ flex: 1, lineHeight: 20 }}>{p}</T>
              </View>
            ))}
          </Card>

          <Button label="Lihat roadmap & dampak" icon="route" onPress={() => go('roadmap')} />
        </>
      )}

      <ErrorBox message={err} />
    </Screen>
  );
}

// ── DINI KARIER SCREEN ────────────────────────────────────────────
function DiniKarier({ go }) {
  const app = useApp();
  const hasil = app.karier?.hasil;
  const rekomendasi = hasil?.rekomendasi || [];
  const [sel, setSel] = useState(0);

  // Fallback data from DEMO
  const reko = rekomendasi.length ? rekomendasi : (DEMO.karier?.rekomendasi || []);

  // compare table data
  const compareData = [
    { profesi: 'Data Analyst', skor: 75, gaji: 'awal Rp5–9 jt', gap: 'SQL, visualisasi data, statistik' },
    { profesi: 'Software Engineer', skor: 73, gaji: 'awal Rp6–10 jt', gap: 'Git, basis data, dasar web/API' },
    { profesi: 'UI/UX Designer', skor: 73, gaji: 'awal Rp5–8 jt', gap: 'Figma, prototyping, riset pengguna' },
    { profesi: 'Data Scientist', skor: 70, gaji: 'awal Rp7–11 jt', gap: 'statistik, machine learning, SQL' },
  ];

  const selectedReko = reko[sel];
  const tahap = selectedReko?.jalur_pendapatan?.tahapan || [];

  const PORTO_DINI = [
    'Dashboard dari data publik (BPS/Kaggle)',
    'Analisis data sekolah atau lomba dengan Python',
    'Kembangkan website sederhanamu menjadi proyek GitHub',
  ];

  return (
    <Screen>
      <ScreenHeader title="Career discovery" onBack={() => go('home')} />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Pill text="Mode pelajar" />
        <T size={12} color={C.muted}>Peta pilihan karier setelah kuliah</T>
      </View>

      {/* Tab selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {reko.slice(0, 4).map((h, i) => {
          const on = i === sel;
          return (
            <Pressable key={h.id} onPress={() => setSel(i)} accessibilityRole="tab" accessibilityState={{ selected: on }}
              style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14, backgroundColor: on ? C.ink : C.white, borderWidth: 1, borderColor: on ? C.ink : C.line, flexShrink: 0 }}>
              <T w={700} size={13} color={on ? C.white : C.ink}>{h.profesi}</T>
              <T size={11} color={on ? 'rgba(255,255,255,0.8)' : C.muted}>Kecocokan {h.skor_kecocokan}</T>
            </Pressable>
          );
        })}
      </ScrollView>

      {selectedReko && (
        <Card style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <T w={800} size={26} color={C.teal}>{selectedReko.skor_kecocokan}</T>
            <T size={12} color={C.muted}>kecocokan minat & potensi</T>
          </View>
          <View style={{ height: 8, borderRadius: 999, backgroundColor: C.soft, overflow: 'hidden' }}>
            <View style={{ width: `${selectedReko.skor_kecocokan}%`, height: 8, borderRadius: 999, backgroundColor: C.teal }} />
          </View>
          {selectedReko.deskripsi ? <T size={11} color={C.muted} style={{ lineHeight: 17 }}>{selectedReko.deskripsi}</T> : null}
          <View style={{ gap: 6 }}>
            {(selectedReko.alasan || []).map((a, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
                <Icon name="check" size={16} color={C.teal} />
                <T size={13} style={{ flex: 1, lineHeight: 19 }}>{a}</T>
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* Skill gap */}
      {selectedReko && (
        <Card style={{ gap: 10 }}>
          <T w={800} size={15}>Skill gap</T>
          <T w={700} size={12}>Sudah dimiliki</T>
          <ChipRow items={selectedReko.skill_sudah_dimiliki} />
          <T w={700} size={12}>Dipelajari saat kuliah</T>
          <ChipRow items={selectedReko.skill_gap_wajib} tone="warn" />
        </Card>
      )}

      {/* Bandingkan pilihan */}
      <Card style={{ gap: 10 }}>
        <T w={800} size={15}>Bandingkan pilihan</T>
        {compareData.map((c) => (
          <View key={c.profesi} style={{ gap: 2 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
              <T size={13} color={C.muted}>{c.profesi}</T>
              <T size={13} w={700} color={C.teal} style={{ textAlign: 'right' }}>{c.skor} · {c.gaji}</T>
            </View>
            <T size={11} color={C.muted} style={{ lineHeight: 16 }}>Perlu: {c.gap}</T>
          </View>
        ))}
      </Card>

      {/* Jenjang & pendapatan selected */}
      {tahap.length > 0 && (
        <Card style={{ gap: 8 }}>
          <T w={800} size={15}>Jenjang & pendapatan ({selectedReko.profesi})</T>
          {tahap.map((t) => (
            <View key={t.tahap} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
              <T size={13} color={C.muted}>{t.tahap === 'entry' ? `Junior ${selectedReko.profesi}` : t.tahap === 'mid' ? selectedReko.profesi : `Senior ${selectedReko.profesi}`}</T>
              <T size={13} w={700} style={{ textAlign: 'right' }}>{rpShort(t.rentang_min)} – {rpShort(t.rentang_max)}</T>
            </View>
          ))}
          {tahap[0]?.sumber?.[0] ? <T size={11} color={C.muted}>Sumber: {tahap[0].sumber[0]}.</T> : null}
        </Card>
      )}

      {/* Portfolio */}
      <Card style={{ gap: 10 }}>
        <T w={800} size={15}>Portofolio pertama</T>
        {PORTO_DINI.map((p) => (
          <View key={p} style={{ flexDirection: 'row', gap: 8 }}>
            <Icon name="check" size={16} color={C.teal} />
            <T size={13} style={{ flex: 1, lineHeight: 20 }}>{p}</T>
          </View>
        ))}
      </Card>

      <Button label="Lihat jurusan & kampus" icon="briefcase" onPress={() => go('pendidikan')} />
    </Screen>
  );
}

// ── DEFAULT EXPORT: persona router ───────────────────────────────
export default function Karier({ go }) {
  const app = useApp();
  const uid = app.activeUserId || 'budi';
  if (uid === 'dini') return <DiniKarier go={go} />;
  return <BudiKarier go={go} />;
}
