import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useApp } from '../state/AppContext';
import { Button, Card, ErrorBox, Field, MoneyField, Pills, Screen, ScreenHeader, T } from '../components/ui';
import Icon, { iconForCategory } from '../components/Icon';
import { C, F } from '../theme';
import { rpShort } from '../utils/format';

const QUICK = [
  { label: 'Rumah subsidi', q: 'rumah subsidi jabodetabek', icon: 'house' },
  { label: 'Mobil', q: 'toyota avanza', icon: 'car' },
  { label: 'Motor', q: 'honda vario', icon: 'bike' },
  { label: 'Menikah', q: 'menikah intimate', icon: 'ring' },
];
const YEARS = [1, 2, 3, 5, 7, 10].map((y) => ({ value: y, label: `${y} th` }));

export default function Cari({ go }) {
  const app = useApp();
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);
  const [pick, setPick] = useState(null);
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [tahun, setTahun] = useState(5);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState('');

  const search = async (query = q) => {
    if (!query.trim()) return;
    setBusy(true); setErr(''); setPick(null); setDone('');
    try { setResults(await app.searchPrice(query.trim())); } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  const choose = (r) => { setPick(r); setNama(r.nama); setHarga(String(r.acuan)); };
  const manual = () => { setPick({ manual: true }); setNama(q); setHarga(''); };

  const save = async () => {
    setSaving(true); setErr('');
    try {
      if (!nama.trim()) throw new Error('Isi nama tujuan.');
      if (!Number(harga)) throw new Error('Isi harga tujuan.');
      const prioritas = (app.analysis?.target?.length || 0) + 1;
      const target = { nama: nama.trim(), target_tahun: tahun, prioritas };
      // Harga acuan tidak diubah: biarkan backend mencatat sumber referensinya.
      const pakaiReferensi = !pick.manual && Number(harga) === Number(pick.acuan) && nama.trim() === pick.nama;
      if (!pakaiReferensi) target.harga = Number(harga);
      await app.addTarget(target);
      setDone(`${nama} ditambahkan ke tujuanmu.`);
      setPick(null); setResults(null); setQ('');
    } catch (e) { setErr(e.message); }
    setSaving(false);
  };

  return (
    <Screen>
      <ScreenHeader title="Cari Impian" onBack={() => go('home')} />
      <T w={700} size={14}>Apa yang ingin kamu capai?</T>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.card, borderWidth: 1.5, borderColor: C.teal, borderRadius: 16, paddingHorizontal: 14, minHeight: 52 }}>
        <Icon name="search" size={20} color={C.muted} />
        <TextInput accessibilityLabel="Cari impian" value={q} onChangeText={setQ} onSubmitEditing={() => search()} returnKeyType="search"
          placeholder="mis. Toyota Avanza, rumah subsidi" placeholderTextColor="#8A9693"
          style={{ flex: 1, fontFamily: F.semibold, fontSize: 15, color: C.ink }} />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {QUICK.map((x) => (
          <Pressable key={x.label} accessibilityRole="button" onPress={() => { setQ(x.q); search(x.q); }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40, paddingHorizontal: 12, borderRadius: 99, borderWidth: 1, borderColor: C.line, backgroundColor: C.card }}>
            <Icon name={x.icon} size={17} color={C.ink} /><T w={600} size={13}>{x.label}</T>
          </Pressable>
        ))}
      </View>
      <Button label="Cari harga" icon="search" onPress={() => search()} loading={busy} />
      {done ? (
        <Card tone="gold" style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <Icon name="check" size={20} color={C.teal} />
          <T size={14} style={{ flex: 1 }}>{done}</T>
          <Pressable onPress={() => go('tujuan')} accessibilityRole="button"><T w={800} size={14} color={C.teal}>Lihat</T></Pressable>
        </Card>
      ) : null}
      <ErrorBox message={err} />

      {results && !pick ? (
        <>
          {results.length === 0 ? (
            <Card style={{ gap: 8 }}>
              <T w={700} size={14}>Belum ada referensi harga untuk "{q}".</T>
              <T size={13} color={C.muted}>Kamu tetap bisa menambahkannya dengan harga yang kamu ketahui.</T>
            </Card>
          ) : results.map((r) => (
            <Pressable key={r.nama} onPress={() => choose(r)} accessibilityRole="button">
              <Card style={{ gap: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={iconForCategory(r.kategori)} size={24} color={C.teal} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <T w={800} size={16}>{r.nama}</T>
                    <T size={12} color={C.muted}>Kisaran {rpShort(r.min)} – {rpShort(r.max)}</T>
                  </View>
                  <T w={800} size={16}>{rpShort(r.acuan)}</T>
                </View>
                <T size={11} color={C.muted}>{r.catatan}. Sumber: {r.sumber}.</T>
              </Card>
            </Pressable>
          ))}
          <Button label="Tambah manual dengan harga sendiri" icon="edit" variant="secondary" onPress={manual} />
        </>
      ) : null}

      {pick ? (
        <Card style={{ gap: 12 }}>
          <T w={800} size={16}>Atur tujuan</T>
          <Field label="Nama tujuan" value={nama} onChangeText={setNama} />
          <MoneyField label="Harga" value={harga} onChange={setHarga}
            hint={pick.manual ? 'Isi perkiraan harga yang kamu incar.' : 'Harga acuan dari referensi. Ubah jika kamu punya angka sendiri.'} />
          <View style={{ gap: 6 }}><T w={700} size={13}>Ingin tercapai dalam</T><Pills options={YEARS} value={tahun} onChange={setTahun} /></View>
          <Button label="Tambah ke Tujuan" icon="plus" onPress={save} loading={saving} />
          <Button label="Batal" variant="secondary" onPress={() => setPick(null)} />
          {!app.live ? <T size={12} color={C.warn}>Mode demo: tujuan baru hanya bisa disimpan saat terhubung ke Langflow.</T> : null}
        </Card>
      ) : null}
      <T size={11} color={C.muted}>Harga referensi adalah estimasi per Oktober 2026 dan bisa berbeda per kota dan dealer.</T>
    </Screen>
  );
}
