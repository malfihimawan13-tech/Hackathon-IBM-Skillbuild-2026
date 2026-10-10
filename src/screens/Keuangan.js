import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useApp } from '../state/AppContext';
import { Bar, Card, Chip, EmptyState, KV, Screen, ScreenHeader, Segmented, T } from '../components/ui';
import Icon from '../components/Icon';
import { C } from '../theme';
import { cleanStatus, pct, rp, rpShort } from '../utils/format';

function Ratio({ label, value, note, ok }) {
  return (
    <Card style={{ flex: 1, padding: 12, gap: 2 }}>
      <T size={11} color={C.muted}>{label}</T>
      <T w={800} size={18}>{value}</T>
      <T w={600} size={11} color={ok ? C.teal : C.warn}>{note}</T>
    </Card>
  );
}

function Kondisi({ a }) {
  const k = a.kesehatan_keuangan;
  const dd = a.dana_darurat;
  const bars = Object.entries(k.rincian_skor || {}).map(([label, v]) => {
    const m = Number((label.match(/maks (\d+)/) || [])[1]) || 1;
    return { label: label.replace(/\s*\(maks \d+\)/, '').replace(/_/g, ' '), v, m };
  });
  const ddRatio = dd.target_dipakai ? dd.dana_likuid_saat_ini / dd.target_dipakai : 1;
  return (
    <>
      <Card style={{ gap: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <View>
            <T size={13} color={C.muted}>Skor kesehatan</T>
            <T w={800} size={34} style={{ lineHeight: 40 }}>{k.skor}<T w={600} size={16} color={C.muted}> /100</T></T>
          </View>
          <Chip label={cleanStatus(k.status)} tone={k.skor >= 65 ? 'teal' : 'warn'} />
        </View>
        {bars.map((b) => (
          <View key={b.label} style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <T size={13} style={{ textTransform: 'capitalize' }}>{b.label}</T>
              <T w={700} size={13}>{String(b.v).replace('.', ',')} / {b.m}</T>
            </View>
            <Bar ratio={b.v / b.m} color={b.v / b.m >= 0.6 ? C.teal : C.gold} />
          </View>
        ))}
      </Card>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Ratio label="Saving rate" value={pct(k.saving_rate_persen)} note="ideal ≥ 20%" ok={k.saving_rate_persen >= 20} />
        <Ratio label="Rasio cicilan" value={pct(k.rasio_cicilan_persen)} note="aman ≤ 30%" ok={k.rasio_cicilan_persen <= 30} />
        <Ratio label="Keinginan" value={pct(k.rasio_keinginan_persen)} note="ideal ≤ 30%" ok={k.rasio_keinginan_persen <= 30} />
      </View>
      <Card style={{ gap: 10 }}>
        <T w={800} size={16}>Arus kas bulanan</T>
        <KV k="Penghasilan" v={rp(k.penghasilan)} />
        <KV k="Penghasilan konservatif" v={rp(k.penghasilan_konservatif)} />
        <KV k="Pengeluaran rutin" v={rp(k.pengeluaran_rutin)} />
        <KV k="Cicilan" v={rp(k.total_cicilan)} />
        <View style={{ height: 1, backgroundColor: C.line }} />
        <KV k="Sisa (disposable income)" v={rp(k.disposable_income)} strong />
      </Card>
      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Icon name="umbrella" size={22} color={C.teal} />
          <T w={800} size={16} style={{ flex: 1 }}>Dana darurat</T>
          <Chip label={`${String(dd.cukup_untuk_bulan).replace('.', ',')} bulan`} tone={dd.kekurangan > 0 ? 'warn' : 'teal'} />
        </View>
        <Bar ratio={ddRatio} color={ddRatio >= 1 ? C.teal : C.gold} height={10} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <T size={13}>{rpShort(dd.dana_likuid_saat_ini)} terkumpul</T>
          <T size={13} color={C.muted}>target {rpShort(dd.target_dipakai)}</T>
        </View>
        <T size={13} color={C.muted}>
          {dd.kekurangan > 0 ? `Perkiraan terpenuhi dalam ${dd.perkiraan_waktu_terpenuhi}. Target ideal ${rpShort(dd.target_ideal)}.` : 'Dana darurat minimum sudah terpenuhi.'}
        </T>
      </Card>
    </>
  );
}

function Atur({ a }) {
  const al = a.alokasi_bulan_ini || {};
  const total = al.kapasitas_menabung || 0;
  const fDd = total ? al.untuk_dana_darurat / total : 0;
  const psi = a.psikologi;
  return (
    <>
      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <T w={800} size={16}>Alokasi bulan ini</T><T w={800} size={16}>{rpShort(total)}</T>
        </View>
        {total > 0 ? (
          <View style={{ flexDirection: 'row', height: 14, borderRadius: 99, overflow: 'hidden', gap: 3 }}>
            {fDd > 0 ? <View style={{ flex: fDd, backgroundColor: C.gold }} /> : null}
            {1 - fDd > 0 ? <View style={{ flex: 1 - fDd, backgroundColor: C.teal }} /> : null}
          </View>
        ) : <T size={13} color={C.warn}>Belum ada sisa untuk ditabung bulan ini.</T>}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: C.gold }} /><T size={13}>Dana darurat {rpShort(al.untuk_dana_darurat)}</T></View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: C.teal }} /><T size={13}>Target {rpShort(al.untuk_target)}</T></View>
        </View>
        <T size={12} color={C.muted}>Alokasi berubah otomatis saat cicilan lunas atau dana darurat terpenuhi.</T>
      </Card>

      <Card style={{ gap: 12 }}>
        <T w={800} size={16}>Urutan pelunasan hutang</T>
        {(a.strategi_hutang || []).length === 0 ? <T size={13} color={C.muted}>Tidak ada hutang. Pertahankan!</T> : null}
        {(a.strategi_hutang || []).map((h) => (
          <View key={h.nama} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: h.berbunga_tinggi ? C.warnSoft : C.soft, alignItems: 'center', justifyContent: 'center' }}>
              <T w={800} size={14} color={h.berbunga_tinggi ? C.warn : C.teal}>{h.urutan}</T>
            </View>
            <View style={{ flex: 1 }}>
              <T w={700} size={14}>{h.nama}</T>
              <T size={12} color={C.muted}>{rpShort(h.cicilan_bulanan)}/bln, lunas {h.perkiraan_lunas}</T>
            </View>
            <Chip label={`${String(h.bunga_tahunan_persen).replace('.', ',')}%/thn`} tone={h.berbunga_tinggi ? 'warn' : 'teal'} />
          </View>
        ))}
        <T size={12} color={C.muted}>Diurutkan dari bunga tertinggi agar total bunga yang dibayar paling kecil.</T>
      </Card>

      <Card style={{ gap: 12 }}>
        <T w={800} size={16}>Saran CITA</T>
        {(a.rekomendasi_utama || []).map((r, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
            <Icon name="check" size={18} color={C.teal} />
            <T size={13} style={{ flex: 1, lineHeight: 20 }}>{r}</T>
          </View>
        ))}
      </Card>

      {psi ? (
        <Card tone="gold" style={{ flexDirection: 'row', gap: 12 }}>
          <Icon name="spark" size={20} color={C.warn} />
          <View style={{ flex: 1, gap: 2 }}>
            <T w={800} size={14}>Gaya uangmu: {psi.nama_tipe}</T>
            <T size={13} style={{ lineHeight: 20 }}>{psi.saran_kebiasaan}</T>
          </View>
        </Card>
      ) : null}
    </>
  );
}

export default function Keuangan({ go, params }) {
  const { analysis } = useApp();
  const [tab, setTab] = useState(params?.tab || 'kondisi');
  const [showAsumsi, setShowAsumsi] = useState(false);
  return (
    <Screen>
      <ScreenHeader title="Keuangan" onBack={() => go('home')} />
      {!analysis ? (
        <EmptyState icon="chart" title="Belum ada data" body="Isi data keuanganmu untuk melihat analisis." action="Ke beranda" onAction={() => go('home')} />
      ) : (
        <>
          <Segmented options={[{ value: 'kondisi', label: 'Kondisi' }, { value: 'atur', label: 'Atur' }]} value={tab} onChange={setTab} />
          {tab === 'kondisi' ? <Kondisi a={analysis} /> : <Atur a={analysis} />}
          <Pressable accessibilityRole="button" onPress={() => setShowAsumsi(!showAsumsi)}>
            <T w={700} size={13} color={C.teal}>{showAsumsi ? 'Sembunyikan asumsi & sumber' : 'Lihat asumsi & sumber data'}</T>
          </Pressable>
          {showAsumsi ? (
            <Card style={{ gap: 8 }}>
              {(analysis.sumber_asumsi || []).map((x, i) => <T key={i} size={12} color={C.muted} style={{ lineHeight: 18 }}>• {x}</T>)}
            </Card>
          ) : null}
          <T size={11} color={C.muted} style={{ lineHeight: 16 }}>{analysis.disclaimer}</T>
        </>
      )}
    </Screen>
  );
}
