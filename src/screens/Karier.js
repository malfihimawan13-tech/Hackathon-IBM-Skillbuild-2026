import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useApp } from '../state/AppContext';
import { DEMO } from '../api/demoData';
import { Bar, Button, Card, Chip, ErrorBox, Field, KV, Pills, Screen, ScreenHeader, T } from '../components/ui';
import { ChipInput, ExperienceList, ImpactCard, MultiPills, toggleIn } from '../components/forms';
import Icon from '../components/Icon';
import { C } from '../theme';
import { rpShort } from '../utils/format';

const MINAT = ['komputer', 'angka', 'analisis', 'data', 'membuat aplikasi', 'desain', 'kreatif', 'media sosial', 'pemasaran',
  'memimpin tim', 'logistik', 'perencanaan', 'otomotif', 'mesin', 'listrik'];
const PENDIDIKAN = ['SMA/SMK', 'D3', 'S1', 'S2'].map((x) => ({ value: x, label: x }));
const TAHAP = { entry: 'Level awal', mid: 'Menengah', senior: 'Senior' };

function SkillChips({ items, tone }) {
  if (!items?.length) return <T size={13} color={C.muted}>-</T>;
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{items.map((s) => <Chip key={s} label={s} tone={tone} />)}</View>;
}

function Detail({ h }) {
  const app = useApp();
  const [impact, setImpact] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const tahap = h.jalur_pendapatan?.tahapan || [];
  const maxVal = Math.max(1, ...tahap.map((t) => t.rentang_max || t.nilai_tengah || 0));
  const belajar = h.jalur_belajar || {};

  const lihatDampak = async () => {
    setBusy(true); setErr('');
    try { setImpact((await app.simulateRoadmap(h.simulasi_siap_pakai, ['karier', h.id])).perbandingan); } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  return (
    <View style={{ gap: 14 }}>
      <Card style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <T w={800} size={20}>{h.profesi}</T>
            <T size={13} color={C.muted}>{h.bidang}</T>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <T w={800} size={22} color={C.teal}>{h.skor_kecocokan}</T>
            <T size={11} color={C.muted}>kecocokan</T>
          </View>
        </View>
        <Bar ratio={h.skor_kecocokan / 100} />
        <T size={14} style={{ lineHeight: 21 }}>{h.deskripsi}</T>
        {h.alasan.map((a, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
            <Icon name={a.startsWith('Perhatian') ? 'alert' : 'check'} size={17} color={a.startsWith('Perhatian') ? C.warn : C.teal} />
            <T size={13} style={{ flex: 1, lineHeight: 19 }}>{a}</T>
          </View>
        ))}
      </Card>

      <Card style={{ gap: 10 }}>
        <T w={800} size={16}>Skill</T>
        <T w={700} size={13}>Sudah kamu miliki</T><SkillChips items={h.skill_sudah_dimiliki} />
        <T w={700} size={13}>Perlu dipelajari (wajib)</T><SkillChips items={h.skill_gap_wajib} tone="warn" />
        <T w={700} size={13}>Nilai tambah</T><SkillChips items={h.skill_gap_pendukung} tone="muted" />
        <T size={12} color={C.muted}>Perkiraan persiapan sebelum melamar: ±{h.perkiraan_persiapan_bulan} bulan (asumsi umum).</T>
      </Card>

      <Card style={{ gap: 12 }}>
        <T w={800} size={16}>Perkiraan pendapatan per tahap</T>
        {tahap.map((t) => (
          <View key={t.tahap} style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <T w={700} size={13}>{TAHAP[t.tahap]} · tahun ke-{t.perkiraan_tahun_ke}</T>
              <T w={800} size={13}>{rpShort(t.rentang_min)} – {rpShort(t.rentang_max)}</T>
            </View>
            <Bar ratio={(t.rentang_max || t.nilai_tengah) / maxVal} color={t.tahap === 'senior' ? C.teal : C.gold} />
            <T size={11} color={C.muted}>Sumber: {t.sumber.join('; ')}</T>
          </View>
        ))}
        {h.selisih_tahap_awal_vs_sekarang != null ? (
          <KV k="Selisih tahap awal vs gaji utama sekarang" v={`${h.selisih_tahap_awal_vs_sekarang >= 0 ? '+' : ''}${rpShort(h.selisih_tahap_awal_vs_sekarang)}`} strong />
        ) : null}
      </Card>

      <Card style={{ gap: 10 }}>
        <T w={800} size={16}>Jenjang karier</T>
        {h.jenjang_karier.map((j, i) => (
          <View key={j} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: i === 0 ? C.teal : C.soft, alignItems: 'center', justifyContent: 'center' }}>
              <T w={800} size={12} color={i === 0 ? C.white : C.teal}>{i + 1}</T>
            </View>
            <T size={14} style={{ flex: 1 }}>{j}</T>
          </View>
        ))}
        <T size={12} color={C.muted}>Pendidikan umum: {h.pendidikan_umum}</T>
      </Card>

      <Card style={{ gap: 10 }}>
        <T w={800} size={16}>Jalur belajar</T>
        {(belajar.jalur_utama || []).map((b) => (
          <View key={b.program} style={{ gap: 2 }}>
            <T w={700} size={14}>{b.program}</T>
            <T size={13}>{b.biaya_min == null ? b.satuan : b.biaya_min === b.biaya_max ? `${rpShort(b.biaya_min)} ${b.satuan}` : `${rpShort(b.biaya_min)} – ${rpShort(b.biaya_max)} ${b.satuan}`} · {b.durasi}</T>
            <T size={11} color={C.muted}>Sumber: {b.sumber}</T>
          </View>
        ))}
        {(belajar.opsional_jangka_panjang || []).map((b) => (
          <View key={b.program} style={{ gap: 2 }}>
            <T w={700} size={14}>{b.program} <T size={12} color={C.muted}>(opsional, jangka panjang)</T></T>
            <T size={13}>{rpShort(b.biaya_min)} {b.satuan} · {b.durasi}</T>
          </View>
        ))}
        {belajar.estimasi_biaya_jalur_utama?.max ? (
          <Card tone="gold" style={{ padding: 12 }}><KV k="Estimasi biaya jalur utama" v={`${rpShort(belajar.estimasi_biaya_jalur_utama.min)} – ${rpShort(belajar.estimasi_biaya_jalur_utama.max)}`} strong /></Card>
        ) : null}
        {(belajar.catatan || []).map((c, i) => <T key={i} size={12} color={C.muted}>{c}</T>)}
      </Card>

      <Button label="Lihat dampak ke tujuanku" icon="target" onPress={lihatDampak} loading={busy} />
      <ErrorBox message={err} />
      <ImpactCard perbandingan={impact} title={`Jika menempuh jalur ${h.profesi}`} />
    </View>
  );
}

export default function Karier({ go }) {
  const app = useApp();
  const prev = app.karier?.input;
  const [minat, setMinat] = useState(prev?.minat || []);
  const [skill, setSkill] = useState(prev?.skill || []);
  const [exp, setExp] = useState(prev?.pengalaman || [{ bidang: '', tahun: '' }]);
  const [pend, setPend] = useState(prev?.pendidikan_terakhir || app.profilDraft?.pendidikan || '');
  const [kota, setKota] = useState(prev?.kota || app.profilDraft?.kota || '');
  const [target, setTarget] = useState(prev?.target_profesi || '');
  const [editing, setEditing] = useState(!app.karier);
  const [sel, setSel] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const hasil = app.karier?.hasil;

  const contoh = () => {
    const d = DEMO.karier_input;
    setMinat(d.minat); setSkill(d.skill); setExp(d.pengalaman); setPend('S1'); setKota(d.kota); setTarget('');
  };
  const cari = async () => {
    if (!minat.length && !skill.length) { setErr('Pilih minimal satu minat atau isi satu skill.'); return; }
    setBusy(true); setErr('');
    try {
      await app.exploreKarier({
        minat, skill, kota, pendidikan_terakhir: pend, target_profesi: target || undefined,
        pengalaman: exp.filter((e) => e.bidang).map((e) => ({ bidang: e.bidang, tahun: Number(e.tahun) || 0 })),
      });
      setSel(0); setEditing(false);
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  return (
    <Screen>
      <ScreenHeader title="Karier" onBack={() => go('home')} />
      {editing || !hasil ? (
        <>
          <T size={14} color={C.muted}>Ceritakan minat dan pengalamanmu. myCITA mencocokkannya dengan data profesi, gaji, dan biaya belajar yang bersumber.</T>
          <Button label="Isi contoh (Budi)" icon="spark" variant="ghost" onPress={contoh} />
          <View style={{ gap: 8 }}><T w={700} size={13}>Apa yang kamu minati?</T><MultiPills options={MINAT} values={minat} onToggle={(v) => setMinat(toggleIn(minat, v))} /></View>
          <ChipInput label="Skill yang kamu punya" values={skill} onChange={setSkill} placeholder="mis. Excel, SAP, servis motor" />
          <ExperienceList items={exp} onChange={setExp} />
          <View style={{ gap: 6 }}><T w={700} size={13}>Pendidikan terakhir</T><Pills options={PENDIDIKAN} value={pend} onChange={setPend} /></View>
          <Field label="Kota tempat bekerja" value={kota} onChangeText={setKota} placeholder="mis. Kabupaten Bekasi" />
          <Field label="Profesi impian (opsional)" value={target} onChangeText={setTarget} placeholder="mis. Data Analyst" />
          <ErrorBox message={err} />
          <Button label="Cari jalur karier" icon="search" onPress={cari} loading={busy} />
          {hasil ? <Button label="Batal" variant="secondary" onPress={() => setEditing(false)} /> : null}
        </>
      ) : (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <T w={800} size={16} style={{ flex: 1 }}>Rekomendasi untukmu</T>
            <Pressable onPress={() => setEditing(true)} accessibilityRole="button"><T w={700} size={13} color={C.teal}>Ubah jawaban</T></Pressable>
          </View>
          {hasil.catatan_target ? <ErrorBox message={hasil.catatan_target} /> : null}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {hasil.rekomendasi.map((h, i) => {
              const on = i === sel;
              return (
                <Pressable key={h.id} onPress={() => setSel(i)} accessibilityRole="tab" accessibilityState={{ selected: on }}
                  style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, backgroundColor: on ? C.ink : C.card, borderWidth: 1, borderColor: on ? C.ink : C.line, minWidth: 130 }}>
                  <T w={700} size={13} color={on ? C.white : C.ink}>{h.profesi}</T>
                  <T size={12} color={on ? 'rgba(255,255,255,0.8)' : C.muted}>Kecocokan {h.skor_kecocokan}</T>
                </Pressable>
              );
            })}
          </ScrollView>
          <Detail key={hasil.rekomendasi[sel]?.id} h={hasil.rekomendasi[sel]} />
          {hasil.konteks_wilayah ? <T size={12} color={C.muted}>Batas bawah pendapatan di wilayahmu: {hasil.konteks_wilayah.jenis} {hasil.konteks_wilayah.wilayah} {rpShort(hasil.konteks_wilayah.nilai)}.</T> : null}
          <T size={11} color={C.muted} style={{ lineHeight: 16 }}>{(hasil.catatan_metode || []).join(' ')} {hasil.disclaimer || ''}</T>
        </>
      )}
    </Screen>
  );
}
