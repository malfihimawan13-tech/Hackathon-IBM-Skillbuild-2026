import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useApp } from '../state/AppContext';
import { DEMO } from '../api/demoData';
import { Bar, Button, Card, Chip, ErrorBox, KV, MoneyField, Screen, ScreenHeader, Segmented, T } from '../components/ui';
import { ChipInput, ExperienceList, ImpactCard, MultiPills, toggleIn } from '../components/forms';
import Icon from '../components/Icon';
import { C } from '../theme';
import { rpShort } from '../utils/format';

const MINAT = ['otomotif', 'motor', 'mesin', 'memperbaiki', 'jasa', 'pelayanan', 'laundry', 'mengelola karyawan', 'usaha kecil'];
const SKEN = [['pesimis', 'Pesimis'], ['moderat', 'Moderat'], ['optimis', 'Optimis']];

function Detail({ h }) {
  const app = useApp();
  const [impact, setImpact] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const m = h.modal_awal;

  const lihatDampak = async () => {
    setBusy(true); setErr('');
    try { setImpact((await app.simulateRoadmap(h.simulasi_siap_pakai, ['usaha', h.id])).perbandingan); } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  return (
    <View style={{ gap: 14 }}>
      <Card style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <T w={800} size={20}>{h.usaha}</T>
            <T size={13} color={C.muted}>{h.bidang} · mode {h.mode}</T>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <T w={800} size={22} color={C.teal}>{h.skor_kecocokan}</T>
            <T size={11} color={C.muted}>kecocokan</T>
          </View>
        </View>
        <Bar ratio={h.skor_kecocokan / 100} />
        {h.alasan.map((a, i) => {
          const warn = a.startsWith('Perhatian') || a.includes('masih kurang');
          return (
            <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
              <Icon name={warn ? 'alert' : 'check'} size={17} color={warn ? C.warn : C.teal} />
              <T size={13} style={{ flex: 1, lineHeight: 19 }}>{a}</T>
            </View>
          );
        })}
      </Card>

      <Card style={{ gap: 8 }}>
        <T w={800} size={16}>Modal & operasional</T>
        <KV k="Modal awal" v={`${rpShort(m.min)} – ${rpShort(m.max)}`} strong />
        <KV k="Dipakai dalam simulasi" v={rpShort(m.dipakai_simulasi)} />
        {m.kekurangan > 0 ? <KV k="Kekurangan modal" v={rpShort(m.kekurangan)} strong /> : null}
        <T size={13}>Operasional: {h.biaya_operasional_bulanan}</T>
        <T size={13}>Pendapatan: {h.model_pendapatan}</T>
      </Card>

      <Card style={{ gap: 10 }}>
        <T w={800} size={16}>Tiga skenario</T>
        <View style={{ flexDirection: 'row' }}>
          <T size={12} color={C.muted} style={{ flex: 1.3 }} />
          {SKEN.map(([k, l]) => <T key={k} w={700} size={12} color={k === 'moderat' ? C.teal : C.muted} style={{ flex: 1 }}>{l}</T>)}
        </View>
        {[['Laba/bulan (stabil)', 'laba_bulanan_stabil', rpShort], ['Laba tahun pertama', 'laba_tahun_pertama', rpShort], ['Balik modal', 'balik_modal', (x) => x]].map(([label, key, f]) => (
          <View key={key} style={{ flexDirection: 'row' }}>
            <T size={13} color={C.muted} style={{ flex: 1.3 }}>{label}</T>
            {SKEN.map(([k]) => <T key={k} w={k === 'moderat' ? 800 : 600} size={13} style={{ flex: 1 }}>{f(h.skenario[k][key])}</T>)}
          </View>
        ))}
        <T size={12} color={C.muted}>Masa rintisan: bulan pertama baru 30% dari kondisi stabil, stabil di bulan ke-6. Perkiraan balik modal menurut sumber: {h.balik_modal_menurut_sumber}.</T>
        <T size={11} color={C.muted}>Dasar angka: {h.dasar_angka}. Sumber: {h.sumber}.</T>
      </Card>

      <Card style={{ gap: 10 }}>
        <T w={800} size={16}>Skill & risiko</T>
        <T w={700} size={13}>Skill yang sudah ada</T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{h.skill_sudah_dimiliki.length ? h.skill_sudah_dimiliki.map((s) => <Chip key={s} label={s} />) : <T size={13} color={C.muted}>-</T>}</View>
        <T w={700} size={13}>Perlu dipelajari</T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{h.skill_gap.length ? h.skill_gap.map((s) => <Chip key={s} label={s} tone="warn" />) : <T size={13} color={C.muted}>-</T>}</View>
        <T w={700} size={13}>Risiko utama</T>
        {h.risiko.map((r) => <T key={r} size={13}>• {r}</T>)}
      </Card>

      <Card style={{ gap: 12 }}>
        <T w={800} size={16}>Roadmap 12 bulan pertama</T>
        {h.roadmap_usaha.map((f, i) => (
          <View key={f.fase} style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' }}>
              <T w={800} size={12} color={C.teal}>{i + 1}</T>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <T w={700} size={14}>{f.fase}</T>
              {f.langkah.map((l) => <T key={l} size={13} color={C.muted}>• {l}</T>)}
            </View>
          </View>
        ))}
      </Card>

      <Button label="Lihat dampak ke tujuanku" icon="target" onPress={lihatDampak} loading={busy} />
      <ErrorBox message={err} />
      <ImpactCard perbandingan={impact} title={`Jika membuka ${h.usaha.toLowerCase()} (skenario moderat)`} />
    </View>
  );
}

export default function Usaha({ go }) {
  const app = useApp();
  const prev = app.usaha?.input;
  const [minat, setMinat] = useState(prev?.minat || []);
  const [skill, setSkill] = useState(prev?.skill || []);
  const [exp, setExp] = useState(prev?.pengalaman || [{ bidang: '', tahun: '' }]);
  const [modal, setModal] = useState(prev?.modal_tersedia ? String(prev.modal_tersedia) : '');
  const [waktu, setWaktu] = useState(prev?.waktu || 'sampingan');
  const [editing, setEditing] = useState(!app.usaha);
  const [sel, setSel] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const hasil = app.usaha?.hasil;

  const contoh = () => {
    const d = DEMO.usaha_input;
    setMinat(d.minat.filter((x) => MINAT.includes(x))); setSkill(d.skill); setExp(d.pengalaman); setModal(String(d.modal_tersedia)); setWaktu(d.waktu);
  };
  const cari = async () => {
    if (!Number(modal)) { setErr('Isi modal yang kamu siapkan (boleh perkiraan).'); return; }
    setBusy(true); setErr('');
    try {
      await app.exploreUsaha({
        minat, skill, modal_tersedia: Number(modal), waktu,
        pengalaman: exp.filter((e) => e.bidang).map((e) => ({ bidang: e.bidang, tahun: Number(e.tahun) || 0 })),
      });
      setSel(0); setEditing(false);
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  return (
    <Screen>
      <ScreenHeader title="Usaha" onBack={() => go('home')} />
      {editing || !hasil ? (
        <>
          <T size={14} color={C.muted}>Ingin punya usaha sendiri? myCITA memetakan pilihan usaha sesuai modal, minat, dan skill-mu, lengkap dengan skenario untung-rugi yang jujur.</T>
          <Button label="Isi contoh (Budi)" icon="spark" variant="ghost" onPress={contoh} />
          <View style={{ gap: 8 }}><T w={700} size={13}>Bidang yang kamu minati</T><MultiPills options={MINAT} values={minat} onToggle={(v) => setMinat(toggleIn(minat, v))} /></View>
          <ChipInput label="Skill yang kamu punya" values={skill} onChange={setSkill} placeholder="mis. servis motor, pembukuan" />
          <ExperienceList items={exp} onChange={setExp} />
          <MoneyField label="Modal yang bisa kamu siapkan" value={modal} onChange={setModal} hint="Dihitung keluar dari tabungan dalam simulasi." />
          <View style={{ gap: 6 }}>
            <T w={700} size={13}>Dijalankan sebagai</T>
            <Segmented options={[{ value: 'sampingan', label: 'Usaha sampingan' }, { value: 'penuh', label: 'Pekerjaan utama' }]} value={waktu} onChange={setWaktu} />
          </View>
          <ErrorBox message={err} />
          <Button label="Cari pilihan usaha" icon="search" onPress={cari} loading={busy} />
          {hasil ? <Button label="Batal" variant="secondary" onPress={() => setEditing(false)} /> : null}
        </>
      ) : (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <T w={800} size={16} style={{ flex: 1 }}>Pilihan usaha untukmu</T>
            <Pressable onPress={() => setEditing(true)} accessibilityRole="button"><T w={700} size={13} color={C.teal}>Ubah jawaban</T></Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {hasil.rekomendasi.map((h, i) => {
              const on = i === sel;
              return (
                <Pressable key={h.id} onPress={() => setSel(i)} accessibilityRole="tab" accessibilityState={{ selected: on }}
                  style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, backgroundColor: on ? C.ink : C.card, borderWidth: 1, borderColor: on ? C.ink : C.line, maxWidth: 220 }}>
                  <T w={700} size={13} color={on ? C.white : C.ink} numberOfLines={1}>{h.usaha}</T>
                  <T size={12} color={on ? 'rgba(255,255,255,0.8)' : C.muted}>Kecocokan {h.skor_kecocokan}</T>
                </Pressable>
              );
            })}
          </ScrollView>
          <Detail key={hasil.rekomendasi[sel]?.id} h={hasil.rekomendasi[sel]} />
          <T size={11} color={C.muted} style={{ lineHeight: 16 }}>{hasil.catatan_database} {hasil.disclaimer || ''}</T>
        </>
      )}
    </Screen>
  );
}
