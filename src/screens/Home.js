import React, { useState } from 'react';
import { Platform, Pressable, RefreshControl, View } from 'react-native';
import Svg, { Circle, Polygon, Polyline, Line, Rect, Text as SvgText } from 'react-native-svg';
import { useApp } from '../state/AppContext';
import { Bar, Card, Chip, EmptyState, ErrorBox, ScoreRing, Screen, T } from '../components/ui';
import Icon from '../components/Icon';
import { C, R } from '../theme';
import { cleanStatus, pct, rpShort } from '../utils/format';
import { findPersona } from '../state/persona';

// ─── Shared helpers ──────────────────────────────────────────────────────────

function HeaderRow({ inisial, onProfile }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View style={{ gap: 2 }}>
        <T w={800} size={22} color={C.teal} style={{ letterSpacing: 0.4 }}>myCITA</T>
        <T size={12} color={C.muted}>Capai Impian, Tentukan Arah</T>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Buka profil" onPress={onProfile}
        style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center' }}>
        <T w={800} size={18}>{inisial}</T>
      </Pressable>
    </View>
  );
}

function ScoreCard({ d, dd, onPress }) {
  if (!d) return null;
  const savingRate = d.saving_rate_persen != null ? pct(d.saving_rate_persen) : '';
  const ddText = dd ? `, dana darurat ${String(dd.cukup_untuk_bulan).replace('.', ',')} bln` : '';
  const hutangText = (d.total_hutang === 0 || !d.total_hutang) ? 'tanpa hutang' : null;
  const sub2 = hutangText
    ? `${savingRate ? `Saving rate ${savingRate} · ` : ''}${hutangText}`
    : `${savingRate ? `Saving rate ${savingRate}` : ''}`;
  const sub3 = ddText ? `Dana darurat${ddText}` : null;
  return (
    <Pressable accessibilityRole="button"
      accessibilityLabel={`Skor kesehatan ${d.skor_kesehatan} dari 100, ${cleanStatus(d.status)}`}
      onPress={onPress}>
      <Card tone="teal" style={{ flexDirection: 'row', alignItems: 'center', gap: 16, borderRadius: 24, padding: 16 }}>
        <ScoreRing score={d.skor_kesehatan} />
        <View style={{ flex: 1, gap: 5 }}>
          <T size={12} color="rgba(255,255,255,0.85)">Skor kesehatan keuangan</T>
          <T w={800} size={19} color={C.white}>{cleanStatus(d.status)}</T>
          {sub2 ? <T size={12} color="rgba(255,255,255,0.9)" style={{ lineHeight: 17 }}>{sub2}</T> : null}
          {sub3 ? <T size={12} color="rgba(255,255,255,0.9)">{sub3}</T> : null}
        </View>
      </Card>
    </Pressable>
  );
}

function StatRow({ d }) {
  if (!d) return null;
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {[
        { label: 'Pendapatan', val: rpShort(d.pendapatan), tone: null },
        { label: 'Pengeluaran', val: rpShort(d.pengeluaran), tone: null },
        { label: 'Sisa', val: rpShort(d.sisa), tone: 'gold' },
      ].map((s) => (
        <View key={s.label} style={{
          flex: 1, backgroundColor: s.tone === 'gold' ? C.goldSoft : C.card,
          borderRadius: 16, borderWidth: 1, borderColor: C.line, padding: 10, gap: 2, minWidth: 0,
        }}>
          <T size={11} color={C.muted}>{s.label}</T>
          <T w={800} size={16} numberOfLines={1} adjustsFontSizeToFit>{s.val}</T>
          {s.tone === 'gold' && d.saving_rate_persen != null ? (
            <T w={700} size={11} color={C.teal}>{pct(d.saving_rate_persen)}</T>
          ) : null}
        </View>
      ))}
    </View>
  );
}

// ─── Grafik riwayat 6 bulan (data contoh) ─────────────────────────────────

const MONTHS_DEMO = ['Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep'];
const CHART_W = 310;
const CHART_H = 160;
const CHART_LEFT = 28;

function BarChart6({ bars, label, note }) {
  // bars: array of { income, expense } or just { val }
  // Simple two-colour stacked bar (income teal, extra gold)
  const maxVal = Math.max(...bars.map((b) => b.income || b.val || 0)) * 1.1 || 1;
  const barW = 22;
  const gap = (CHART_W - CHART_LEFT - bars.length * barW) / (bars.length - 1 || 1);
  const h = (v) => ((v / maxVal) * (CHART_H - 20));
  const yBase = CHART_H - 16;
  const svgW = CHART_W;

  return (
    <Card style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <T w={800} size={15} style={{ flex: 1 }}>{label}</T>
        {note ? <Chip label={note} /> : null}
      </View>
      <Svg width={svgW} height={CHART_H} viewBox={`0 0 ${svgW} ${CHART_H}`}
        accessibilityLabel={`Grafik ${label}`}
        {...(Platform.OS !== 'web' ? { accessibilityElementsHidden: true } : { 'aria-hidden': true })}>
        {/* baseline */}
        <Line x1={CHART_LEFT} y1={yBase} x2={svgW} y2={yBase} stroke={C.line} strokeWidth="1" />
        {bars.map((b, i) => {
          const x = CHART_LEFT + i * (barW + gap);
          const income = b.income || b.val || 0;
          const extra = b.extra || 0;
          const totalH = h(income + extra);
          const incomeH = h(income);
          return (
            <React.Fragment key={i}>
              <Rect x={x} y={yBase - incomeH} width={barW} height={incomeH} rx="0" fill={C.teal} />
              {extra > 0 ? <Rect x={x} y={yBase - totalH} width={barW} height={h(extra)} rx="4" fill={C.gold} /> : null}
              <SvgText x={x + barW / 2} y={CHART_H - 2} fontSize="10" fill={C.muted} textAnchor="middle">{MONTHS_DEMO[i]}</SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
      <T size={11} color={C.muted} style={{ textAlign: 'center' }}>Contoh data · 6 bulan terakhir</T>
    </Card>
  );
}

// ─── Donat pengeluaran ─────────────────────────────────────────────────────

function DonutChart({ items, total }) {
  // items: [{label, nilai, color}] — sudah diurutkan dari terbesar
  const R_OUTER = 56; const SW = 20;
  const SIZE = (R_OUTER + SW) * 2 + 4;
  const circumference = 2 * Math.PI * R_OUTER;
  let offset = 0;
  const slices = items.map((it) => {
    const ratio = total > 0 ? it.nilai / total : 0;
    const dash = ratio * circumference;
    const s = { ...it, dash, offset };
    offset += dash;
    return s;
  });
  const cx = SIZE / 2; const cy = SIZE / 2;

  // Legenda: 5 teratas + baris "Lainnya" untuk sisanya
  const TOP = 5;
  const topSlices = slices.slice(0, TOP);
  const restSlices = slices.slice(TOP);
  const restTotal = restSlices.reduce((s, it) => s + it.nilai, 0);
  const restCount = restSlices.length;

  return (
    <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}
        accessibilityLabel="Komposisi pengeluaran"
        {...(Platform.OS !== 'web' ? { accessibilityElementsHidden: true } : { 'aria-hidden': true })}>
        <Circle cx={cx} cy={cy} r={R_OUTER} fill="none" stroke={C.soft} strokeWidth={SW} />
        {slices.map((s, i) => (
          <Circle key={i} cx={cx} cy={cy} r={R_OUTER} fill="none" stroke={s.color}
            strokeWidth={SW} strokeDasharray={`${s.dash} ${circumference}`}
            strokeDashoffset={-s.offset} transform={`rotate(-90 ${cx} ${cy})`} />
        ))}
        <SvgText x={cx} y={cy - 4} fontSize="14" fontWeight="800" fill={C.ink} textAnchor="middle">
          {rpShort(total)}
        </SvgText>
        <SvgText x={cx} y={cy + 12} fontSize="10" fill={C.muted} textAnchor="middle">per bulan</SvgText>
      </Svg>
      <View style={{ flex: 1, gap: 5 }}>
        {topSlices.map((s, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: s.color }} />
            <T size={11} color={C.muted} style={{ flex: 1 }} numberOfLines={1}>{s.label}</T>
            <T w={700} size={11}>{rpShort(s.nilai)}</T>
          </View>
        ))}
        {restCount > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: C.muted }} />
            <T size={11} color={C.muted} style={{ flex: 1 }}>Lainnya ({restCount} pos)</T>
            <T w={700} size={11}>{rpShort(restTotal)}</T>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Tabungan mini (line chart sample) ────────────────────────────────────

function SavingsChart({ currentAmount, monthlyAdd }) {
  const months = 6;
  const points = Array.from({ length: months }, (_, i) => currentAmount - (months - 1 - i) * monthlyAdd);
  const minV = Math.min(...points) * 0.9;
  const maxV = Math.max(...points) * 1.1 || 1;
  const W = CHART_W; const H = 100;
  const x = (i) => CHART_LEFT + (i * (W - CHART_LEFT - 4)) / (months - 1);
  const y = (v) => H - 14 - ((v - minV) / (maxV - minV)) * (H - 26);
  const ptStr = points.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const polyFill = `${CHART_LEFT},${H - 14} ${ptStr} ${x(months - 1)},${H - 14}`;

  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      accessibilityLabel="Pertumbuhan tabungan"
      {...(Platform.OS !== 'web' ? { accessibilityElementsHidden: true } : { 'aria-hidden': true })}>
      <Polygon points={polyFill} fill={C.soft} />
      <Polyline points={ptStr} fill="none" stroke={C.teal} strokeWidth="2.4" strokeLinejoin="round" />
      {points.map((v, i) => (
        <Circle key={i} cx={x(i)} cy={y(v)} r="3" fill={C.white} stroke={C.teal} strokeWidth="2" />
      ))}
      {MONTHS_DEMO.map((m, i) => (
        <SvgText key={i} x={x(i)} y={H - 2} fontSize="10" fill={C.muted} textAnchor="middle">{m}</SvgText>
      ))}
    </Svg>
  );
}

// ─── Kartu hutang + dana darurat ──────────────────────────────────────────

function DebtEmergencyRow({ analysis }) {
  const dd = analysis?.dana_darurat;
  const hutangTotal = analysis?.dashboard?.total_hutang ?? 0;
  // Pakai field asli dari flow 4: dana_likuid_saat_ini, target_dipakai, cukup_untuk_bulan
  const ddLikuid = dd?.dana_likuid_saat_ini ?? 0;
  const ddTarget = dd?.target_dipakai ?? 0;
  const ddBulan = dd?.cukup_untuk_bulan ?? 0;
  const ddPct = ddTarget > 0 ? Math.min(1, ddLikuid / ddTarget) : 0;

  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <Card style={{ flex: 1, gap: 6, padding: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="wallet" size={18} color={C.teal} />
          <T w={800} size={13}>Hutang</T>
        </View>
        <T w={800} size={18}>{hutangTotal === 0 ? 'Rp0' : rpShort(hutangTotal)}</T>
        <T size={11} color={C.muted} style={{ lineHeight: 16 }}>
          {hutangTotal === 0 ? 'Tidak ada cicilan' : `Total cicilan aktif`}
        </T>
      </Card>
      <Card style={{ flex: 1, gap: 6, padding: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="umbrella" size={18} color={C.gold} />
          <T w={800} size={13}>Dana darurat</T>
        </View>
        {dd ? (
          <>
            <T w={800} size={18}>{`${rpShort(ddLikuid)} / ${rpShort(ddTarget)}`}</T>
            <Bar ratio={ddPct} color={ddPct >= 1 ? C.teal : C.gold} height={8} />
            <T size={11} color={C.muted} style={{ lineHeight: 16 }}>
              {`${String(ddBulan).replace('.', ',')} bulan`}
            </T>
          </>
        ) : (
          <T w={800} size={18}>–</T>
        )}
      </Card>
    </View>
  );
}

// ─── Kartu tujuan ─────────────────────────────────────────────────────────

function TargetCards({ targets, go }) {
  if (!targets?.length) return null;
  return (
    <Card style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <T w={800} size={15} style={{ flex: 1 }}>Tujuan</T>
        <Pressable onPress={() => go('tujuan')} accessibilityRole="button">
          <T w={700} size={12} color={C.teal}>Detail</T>
        </Pressable>
      </View>
      {targets.slice(0, 3).map((t, i) => {
        const opsiA = t.opsi_a_menabung;
        // Pakai harga_saat_ini (field asli flow 4) dan waktu_tercapai dari opsi_a_menabung
        const harga = t.harga_saat_ini ?? t.harga_target ?? t.harga ?? 0;
        const statusLabel = opsiA?.waktu_tercapai || t.tenggat || '';
        // Progress: gunakan persen_tercapai jika ada, fallback ke 0
        const progress = opsiA?.persen_tercapai != null ? opsiA.persen_tercapai / 100 : 0;
        // Kesulitan: gunakan status dari flow 4 (realistis/perlu_penyesuaian)
        const isRealistis = (t.status || t.label_kesulitan || '').toLowerCase().startsWith('realistis');
        const tone = isRealistis ? 'teal' : 'gold';
        const toneLabel = isRealistis ? 'Realistis' : (t.label_kesulitan || 'Perlu perhatian');
        return (
          <View key={i} style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={t.ikon || 'flag'} size={18} color={C.teal} />
              </View>
              <View style={{ flex: 1 }}>
                <T w={700} size={14}>{t.nama}</T>
                <T size={11} color={C.muted}>{`${rpShort(harga)} · ${statusLabel}`}</T>
              </View>
              <Chip label={toneLabel} tone={tone} />
            </View>
            <Bar ratio={progress} color={tone === 'teal' ? C.teal : C.gold} height={8} />
          </View>
        );
      })}
    </Card>
  );
}

// ─── Kartu roadmap mini ───────────────────────────────────────────────────

function RoadmapCard({ uid, karier, usaha, go }) {
  // Ambil nama dari hasil flow 5/6 yang tersimpan
  const karierNama = karier?.hasil?.rekomendasi?.[0]?.profesi;
  const usahaNama = usaha?.hasil?.rekomendasi?.[0]?.usaha || usaha?.hasil?.rekomendasi?.[0]?.nama;

  // ── Budi: karier DS + kopi keliling ──────────────────────────────
  if (uid === 'budi') {
    return (
      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="route" size={20} color={C.teal} />
          <T w={800} size={15} style={{ flex: 1 }}>Roadmap-mu</T>
        </View>
        <Pressable onPress={() => go('karier')} accessibilityRole="button" accessibilityLabel="Buka layar Karier"
          style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="briefcase" size={19} color={C.teal} />
          </View>
          <View style={{ flex: 1 }}>
            <T w={700} size={14}>{karierNama || 'Data Scientist'}</T>
            <T size={12} color={C.muted}>Jalur karier baru yang kamu targetkan</T>
          </View>
        </Pressable>
        <Pressable onPress={() => go('usaha')} accessibilityRole="button" accessibilityLabel="Buka layar Usaha"
          style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: C.goldSoft, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="store" size={19} color={C.warn} />
          </View>
          <View style={{ flex: 1 }}>
            <T w={700} size={14}>{usahaNama || 'Kopi keliling sampingan'}</T>
            <T size={12} color={C.muted}>Usaha sampingan sedang dieksplorasi</T>
          </View>
        </Pressable>
      </Card>
    );
  }

  // ── Agus: usaha keluarga + roadmap rumah ─────────────────────────
  if (uid === 'agus') {
    return (
      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="route" size={20} color={C.teal} />
          <T w={800} size={15} style={{ flex: 1 }}>Roadmap-mu</T>
        </View>
        <Pressable onPress={() => go('usaha')} accessibilityRole="button" accessibilityLabel="Buka layar Usaha"
          style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: C.goldSoft, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="store" size={19} color={C.warn} />
          </View>
          <View style={{ flex: 1 }}>
            <T w={700} size={14}>Usaha keluarga: bengkel + kelontong</T>
            <T size={12} color={C.muted}>Dua usaha yang sudah berjalan</T>
          </View>
        </Pressable>
        <Pressable onPress={() => go('roadmap')} accessibilityRole="button" accessibilityLabel="Buka layar Roadmap"
          style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="home" size={19} color={C.teal} />
          </View>
          <View style={{ flex: 1 }}>
            <T w={700} size={14}>Roadmap rumah</T>
            <T size={12} color={C.muted}>Simulasi dan rencana beli rumah</T>
          </View>
        </Pressable>
      </Card>
    );
  }

  // ── Dini: jurusan + karier ────────────────────────────────────────
  if (uid === 'dini') {
    return (
      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="route" size={20} color={C.teal} />
          <T w={800} size={15} style={{ flex: 1 }}>Roadmap-mu</T>
        </View>
        <Pressable onPress={() => go('pendidikan')} accessibilityRole="button" accessibilityLabel="Buka layar Pendidikan"
          style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="target" size={19} color={C.teal} />
          </View>
          <View style={{ flex: 1 }}>
            <T w={700} size={14}>Jurusan &amp; kampus</T>
            <T size={12} color={C.muted}>Pilih jurusan yang paling cocok untukmu</T>
          </View>
        </Pressable>
        <Pressable onPress={() => go('karier')} accessibilityRole="button" accessibilityLabel="Buka layar Karier"
          style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: C.goldSoft, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="briefcase" size={19} color={C.warn} />
          </View>
          <View style={{ flex: 1 }}>
            <T w={700} size={14}>Pilihan karier</T>
            <T size={12} color={C.muted}>Profesi yang bisa kamu tuju setelah lulus</T>
          </View>
        </Pressable>
      </Card>
    );
  }

  // ── Pengguna baru / belum mengisi data ───────────────────────────
  return (
    <Card style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon name="route" size={20} color={C.teal} />
        <T w={800} size={15} style={{ flex: 1 }}>Roadmap-mu</T>
      </View>
      <Pressable onPress={() => go('karier')} accessibilityRole="button" accessibilityLabel="Buka layar Karier"
        style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="briefcase" size={19} color={C.teal} />
        </View>
        <View style={{ flex: 1 }}>
          <T w={700} size={14}>Temukan arah kariermu</T>
          <T size={12} color={C.muted}>Cocokkan minat &amp; skill dengan data profesi</T>
        </View>
      </Pressable>
      <Pressable onPress={() => go('usaha')} accessibilityRole="button" accessibilityLabel="Buka layar Usaha"
        style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: C.goldSoft, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="store" size={19} color={C.warn} />
        </View>
        <View style={{ flex: 1 }}>
          <T w={700} size={14}>Jelajahi peluang usaha</T>
          <T size={12} color={C.muted}>Simulasi modal, laba, dan balik modal</T>
        </View>
      </Pressable>
    </Card>
  );
}

// ─── Kartu usaha Agus ─────────────────────────────────────────────────────

function UsahaCards({ usahaList, go }) {
  if (!usahaList?.length) return null;
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {usahaList.map((u, i) => {
        const bersih = u.omzet - u.biaya;
        const margin = u.omzet > 0 ? Math.round((bersih / u.omzet) * 100) : 0;
        return (
          <Pressable key={i} accessibilityRole="button" accessibilityLabel={`Detail ${u.nama}`}
            onPress={() => go('usaha')}
            style={({ pressed }) => ({ flex: 1, opacity: pressed ? 0.85 : 1 })}>
            <Card style={{ gap: 6, padding: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Icon name={u.icon} size={18} color={u.iconColor} />
                <T w={800} size={13} style={{ flex: 1 }}>{u.nama}</T>
              </View>
              {[
                { label: 'Omzet', val: rpShort(u.omzet) },
                { label: 'Biaya', val: rpShort(u.biaya) },
                { label: 'Bersih', val: rpShort(bersih), bold: true },
              ].map((row) => (
                <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 6 }}>
                  <T size={12} color={C.muted}>{row.label}</T>
                  <T w={row.bold ? 800 : 700} size={12} color={row.bold ? C.teal : C.ink}>{row.val}</T>
                </View>
              ))}
              <Bar ratio={margin / 100} color={u.barColor} height={8} />
              <T size={11} color={C.muted}>{`Margin ${margin}%`}</T>
            </Card>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Skill bar Dini ───────────────────────────────────────────────────────

function SkillBar({ skor }) {
  // skor 1 = Dasar, 2 = Menengah, 3 = Mahir
  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={{ flex: 1, height: 8, borderRadius: 3, backgroundColor: i < skor ? (i < 2 ? '#0F4C47' : '#5DCAA5') : C.soft }} />
      ))}
    </View>
  );
}

// ─── Rekomendasi jurusan Dini ──────────────────────────────────────────────

// JurusanList pakai rekomendasi_jurusan[] dari flow 5 mode pelajar
// field: jurusan, skor_kecocokan, karier_terkait[]
function JurusanList({ rekomendasiJurusan, go }) {
  const list = rekomendasiJurusan?.slice(0, 3) || [];
  if (!list.length) return null;
  const maxSkor = 100;
  return (
    <Card style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <T w={800} size={15} style={{ flex: 1 }}>Rekomendasi jurusan</T>
        <Pressable onPress={() => go('pendidikan')} accessibilityRole="button">
          <T w={700} size={12} color={C.teal}>Kampus</T>
        </Pressable>
      </View>
      {list.map((r, i) => {
        const skor = r.skor_kecocokan ?? 0;
        const nama = r.jurusan ?? r.nama ?? '–';
        const karierTerkait = r.karier_terkait?.[0] || '';
        return (
          <View key={i} style={{ gap: 4 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
              <T w={i === 0 ? 800 : 600} size={13} style={{ flex: 1 }}>{nama}</T>
              <T w={800} size={14} color={i < 2 ? C.teal : C.muted}>{skor}</T>
            </View>
            <Bar ratio={skor / maxSkor} color={i < 2 ? C.teal : C.line} height={8} />
            {karierTerkait ? <T size={11} color={C.muted}>{`Karier: ${karierTerkait}`}</T> : null}
          </View>
        );
      })}
    </Card>
  );
}

// ─── Hero card Dini: jurusan terbaik ──────────────────────────────────────

// DiniHeroCard pakai rekomendasi_jurusan[] (bukan rekomendasi/profesi)
function DiniHeroCard({ rekomendasiJurusan }) {
  const top = rekomendasiJurusan?.[0];
  const second = rekomendasiJurusan?.[1];
  if (!top && !second) return null;
  return (
    <Card tone="teal" style={{ gap: 10, borderRadius: 24, padding: 16 }}>
      <T size={12} color="rgba(255,255,255,0.85)">Jurusan kuliah paling cocok untukmu</T>
      {top ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
          <T w={800} size={19} color={C.white} style={{ flex: 1 }}>{top.jurusan ?? '–'}</T>
          <T w={800} size={18} color={C.gold}>{top.skor_kecocokan ?? ''}</T>
        </View>
      ) : null}
      {second ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
          <T w={700} size={16} color={C.white} style={{ flex: 1 }}>{second.jurusan ?? '–'}</T>
          <T w={800} size={16} color={C.gold}>{second.skor_kecocokan ?? ''}</T>
        </View>
      ) : null}
      <T size={12} color="rgba(255,255,255,0.9)" style={{ lineHeight: 18 }}>
        Berdasarkan minat, skill, dan aktivitasmu.
      </T>
    </Card>
  );
}

// ─── Profil kemampuan Dini ────────────────────────────────────────────────

function SkillProfile({ skills, minat }) {
  return (
    <Card style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <T w={800} size={15} style={{ flex: 1 }}>Kemampuan</T>
        <Chip label={`${skills.length} skill`} />
      </View>
      {skills.map((s, i) => (
        <View key={i} style={{ gap: 5 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <T w={600} size={13}>{s.nama}</T>
            <T size={12} color={C.muted}>{s.level}</T>
          </View>
          <SkillBar skor={s.skor} />
        </View>
      ))}
      {minat?.length ? (
        <>
          <T w={800} size={13} style={{ marginTop: 4 }}>Minat</T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {minat.map((m) => (
              <View key={m} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: R.pill, backgroundColor: C.soft }}>
                <T w={700} size={12} color={C.teal}>{m}</T>
              </View>
            ))}
          </View>
        </>
      ) : null}
    </Card>
  );
}

// ─── Karier pilihan Dini ──────────────────────────────────────────────────

function KarierCards({ rekomendasi, go }) {
  const list = rekomendasi?.slice(0, 3) || [];
  if (!list.length) return null;
  return (
    <Card style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <T w={800} size={15} style={{ flex: 1 }}>Karier setelah lulus</T>
        <Pressable onPress={() => go('karier')} accessibilityRole="button">
          <T w={700} size={12} color={C.teal}>Detail</T>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {list.map((r, i) => {
          const skor = r.skor_kecocokan ?? r.skor ?? 0;
          const nama = r.profesi ?? '–';
          const gaji = r.jalur_pendapatan?.[0] || '';
          return (
            <View key={i} style={{
              flex: 1, borderRadius: R.xl, borderWidth: i === 0 ? 2 : 1,
              borderColor: i === 0 ? C.teal : C.line,
              backgroundColor: C.card, padding: 12, alignItems: 'center', gap: 6,
            }}>
              <T w={800} size={24} color={C.teal}>{skor}</T>
              <T w={700} size={12} style={{ textAlign: 'center', lineHeight: 16 }}>{nama}</T>
              {gaji ? (
                <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: R.pill, backgroundColor: C.soft }}>
                  <T w={700} size={11} color={C.teal}>{gaji}</T>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </Card>
  );
}

// ─── Saran utama ──────────────────────────────────────────────────────────

function TopReco({ text }) {
  if (!text) return null;
  return (
    <Card style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon name="spark" size={18} color={C.teal} />
        <T w={800} size={15} style={{ flex: 1 }}>Saran utama</T>
        <Chip label="Prioritas" />
      </View>
      <T size={14} style={{ lineHeight: 21 }}>{text}</T>
    </Card>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────

export default function Home({ go }) {
  const app = useApp();
  const { analysis, refreshAnalysis, live, settings, karier, usaha, userId } = app;
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState('');

  const persona = findPersona(userId);
  const inisial = persona?.inisial || (userId?.charAt(0)?.toUpperCase()) || 'M';
  const subJudul = persona?.subJudul || 'Kondisi finansialmu bulan ini';
  const isDini = userId === 'dini';

  const onRefresh = async () => {
    setRefreshing(true); setErr('');
    try { await refreshAnalysis(); } catch (e) { setErr(e.message); }
    setRefreshing(false);
  };

  const d = analysis?.dashboard;
  const dd = analysis?.dana_darurat;
  const targets = analysis?.target || [];
  const firstName = persona?.nama || (d?.nama || '').split(' ')[0] || userId || '';

  // Demo data untuk grafik 6-bulan (data contoh, diberi label)
  const barsIncome = isDini
    ? MONTHS_DEMO.map(() => ({ val: 1500000, income: 1500000 }))
    : MONTHS_DEMO.map((_, i) => ({
        income: (d?.pengeluaran) * (0.94 + i * 0.01),
        extra: (d?.pendapatan) - (d?.pengeluaran),
      }));

  // Pengeluaran breakdown untuk donat: pakai rincian pengeluaran dari persona, diurutkan dari terbesar
  const donutColors = ['#0F4C47', '#1F6F66', '#5DCAA5', '#F2A93B', '#E8C27A', '#D85A30', '#B8C9C5'];
  const personaPengeluaran = persona?.keuangan?.pengeluaran;
  const donutItemsRaw = personaPengeluaran && personaPengeluaran.length > 0
    ? personaPengeluaran.map((p) => ({ label: p.label, nilai: Number(p.nominal) || 0 }))
    : [];
  const donutItemsSorted = [...donutItemsRaw].sort((a, b) => b.nilai - a.nilai);
  const donutItems = donutItemsSorted.map((p, i) => ({ ...p, color: donutColors[i % donutColors.length] }));

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.teal} />}>
      <HeaderRow inisial={inisial} onProfile={() => go('profil')} />

      {!live && (
        <Pressable onPress={() => go('profil')} accessibilityRole="button">
          <Card tone="gold" style={{ flexDirection: 'row', gap: 10, alignItems: 'center', padding: 12 }}>
            <Icon name="spark" size={18} color={C.warn} />
            <T size={13} style={{ flex: 1 }}>Mode demo aktif: memakai data contoh. Ketuk untuk menghubungkan ke Langflow.</T>
          </Card>
        </Pressable>
      )}

      {/* Salam */}
      <View style={{ gap: 4 }}>
        <T w={800} size={26} style={{ letterSpacing: -0.4 }}>Halo, {firstName}</T>
        <T size={14} color={C.muted}>{subJudul}</T>
      </View>

      <ErrorBox message={err} onRetry={onRefresh} />

      {!analysis ? (
        <EmptyState icon="target" title="Data belum dimuat"
          body="Tarik ke bawah untuk memuat data dari Langflow, atau aktifkan Mode Demo di tab Profil."
          action="Perbarui" onAction={onRefresh} />
      ) : isDini ? (
        /* ── DINI: Career-discovery layout ─────────────────── */
        <>
          {/* Hero: jurusan terbaik — pakai rekomendasi_jurusan[] dari flow 5 mode pelajar */}
          <DiniHeroCard rekomendasiJurusan={karier?.hasil?.rekomendasi_jurusan} />

          {/* Kemampuan (dari persona.js) */}
          {persona?.skills ? <SkillProfile skills={persona.skills} minat={persona.minat} /> : null}

          {/* Daftar jurusan dari flow 5 mode pelajar */}
          <JurusanList rekomendasiJurusan={karier?.hasil?.rekomendasi_jurusan} go={go} />

          {/* Karier pilihan setelah lulus — tetap pakai rekomendasi[] (profesi) */}
          <KarierCards rekomendasi={karier?.hasil?.rekomendasi} go={go} />

          {/* Keuangan pelajar ringkas */}
          <BarChart6
            bars={barsIncome}
            label="Keuangan pelajar 6 bulan"
            note={d?.sisa != null ? `Menabung ${rpShort(d.sisa)}` : undefined}
          />

          {/* Hutang & dana darurat */}
          <DebtEmergencyRow analysis={analysis} />

          {/* Roadmap-mu */}
          <RoadmapCard uid={userId} karier={karier} usaha={usaha} go={go} />

          {/* Saran utama dari Langflow */}
          <TopReco text={analysis?.rekomendasi_utama?.[0]} />
        </>
      ) : (
        /* ── BUDI / AGUS: Financial layout ─────────────────── */
        <>
          {/* Skor kesehatan */}
          <ScoreCard d={d} dd={dd} onPress={() => go('keuangan')} />

          {/* Ringkasan pendapatan/pengeluaran/sisa */}
          <StatRow d={d} />

          {/* Usaha Agus */}
          {persona?.usaha ? <UsahaCards usahaList={persona.usaha} go={go} /> : null}

          {/* Arus kas 6 bulan (contoh data) */}
          <BarChart6
            bars={barsIncome}
            label="Arus kas 6 bulan"
            note={d?.sisa != null ? `Rata-rata sisa ${rpShort(d.sisa)}` : undefined}
          />

          {/* Donat pengeluaran — kartu bisa diketuk ke layar Pengeluaran */}
          {donutItems.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Lihat rincian pengeluaran bulan ini"
              onPress={() => go('pengeluaran', { from: 'home' })}
            >
              <Card style={{ gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <T w={800} size={15} style={{ flex: 1 }}>Pengeluaran rumah tangga bulan ini</T>
                  <Chip label={cleanStatus(d?.status_pengeluaran) || 'Sehat'} />
                </View>
                <DonutChart items={donutItems} total={d?.pengeluaran || 0} />
                <T size={12} color={C.teal} style={{ textAlign: 'right' }}>Lihat semua ›</T>
              </Card>
            </Pressable>
          ) : null}

          {/* Hutang & dana darurat */}
          <DebtEmergencyRow analysis={analysis} />

          {/* Tabungan + grafik contoh */}
          {dd?.tabungan_saat_ini != null || d?.tabungan != null ? (
            <Card style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <T w={800} size={15} style={{ flex: 1 }}>Tabungan</T>
                <Chip label={rpShort(dd?.tabungan_saat_ini || d?.tabungan || 0)} />
              </View>
              <SavingsChart
                currentAmount={dd?.tabungan_saat_ini || d?.tabungan || 0}
                monthlyAdd={d?.sisa || 0}
              />
              <T size={11} color={C.muted} style={{ textAlign: 'center' }}>Contoh data · proyeksi jika sisa ditabung rutin</T>
            </Card>
          ) : null}

          {/* Tujuan */}
          <TargetCards targets={targets} go={go} />

          {/* Roadmap mini — per-persona */}
          <RoadmapCard uid={userId} karier={karier} usaha={usaha} go={go} />

          {/* Saran utama */}
          <TopReco text={analysis?.rekomendasi_utama?.[0]} />
        </>
      )}

      <T size={11} color={C.muted} style={{ textAlign: 'center' }}>
        {live ? `Langflow · user: ${settings.userId || userId}` : 'Data contoh'} · tarik ke bawah untuk memperbarui
      </T>
    </Screen>
  );
}
