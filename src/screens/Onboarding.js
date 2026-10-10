import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { useApp, sampleDrafts, EXPENSE_TEMPLATE } from '../state/AppContext';
import { Button, Card, ErrorBox, Field, IconButton, MoneyField, Pills, Screen, Segmented, T } from '../components/ui';
import Icon from '../components/Icon';
import { C } from '../theme';
import { rpShort } from '../utils/format';

const JENIS_KERJA = [
  { value: 'full_time', label: 'Full-time' }, { value: 'part_time', label: 'Part-time' },
  { value: 'freelance', label: 'Freelance' }, { value: 'usaha', label: 'Usaha' },
];
const JENIS_HUTANG = [
  { value: 'kendaraan', label: 'Kendaraan' }, { value: 'kpr', label: 'KPR' }, { value: 'kartu_kredit', label: 'Kartu kredit' },
  { value: 'paylater', label: 'Paylater' }, { value: 'pinjol', label: 'Pinjol' }, { value: 'lainnya', label: 'Lainnya' },
];
const PENDIDIKAN = ['SMA/SMK', 'D3', 'S1', 'S2', 'Lainnya'].map((x) => ({ value: x, label: x }));
const KUIS = [
  ['impulsif', 'Saya sering membeli barang yang tidak saya rencanakan sebelumnya.'],
  ['fomo', 'Saya merasa perlu mengikuti tren atau gaya hidup teman agar tidak ketinggalan.'],
  ['menghindar', 'Saya menghindari mengecek saldo atau tagihan karena merasa cemas.'],
  ['emosional', 'Belanja adalah cara saya meredakan stres atau memberi hadiah untuk diri sendiri.'],
  ['terlalu_hemat', 'Saya merasa bersalah setiap mengeluarkan uang, bahkan untuk kebutuhan.'],
  ['disiplin', 'Saya punya catatan atau anggaran bulanan yang saya patuhi.'],
];
const num = (v) => Number(String(v ?? '').replace(/[^0-9]/g, '')) || 0;

function Steps({ step }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }} accessibilityLabel={`Langkah ${step} dari 3`}>
      {[1, 2, 3].map((i) => <View key={i} style={{ flex: 1, height: 6, borderRadius: 99, backgroundColor: i <= step ? C.teal : C.line }} />)}
    </View>
  );
}

function RemoveBtn({ onPress, label }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={8}
      style={{ width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: C.ground }}>
      <Icon name="close" size={16} color={C.muted} />
    </Pressable>
  );
}

export default function Onboarding({ onDone, onCancel }) {
  const app = useApp();
  const [step, setStep] = useState(1);
  const [uid, setUid] = useState(app.settings.userId || '');
  const [p, setP] = useState(app.profilDraft);
  const [k, setK] = useState(app.keuanganDraft);
  const [psi, setPsi] = useState(app.psikologi || {});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const upP = (patch) => setP((x) => ({ ...x, ...patch }));
  const upJob = (i, patch) => upP({ pekerjaan: p.pekerjaan.map((j, idx) => (idx === i ? { ...j, ...patch } : j)) });
  const upExp = (i, patch) => setK((x) => ({ ...x, pengeluaran: x.pengeluaran.map((e, idx) => (idx === i ? { ...e, ...patch } : e)) }));
  const upDebt = (i, patch) => setK((x) => ({ ...x, hutang: x.hutang.map((h, idx) => (idx === i ? { ...h, ...patch } : h)) }));

  const fillSample = () => {
    const d = sampleDrafts();
    setUid(d.userId); setP(d.profil); setK(d.keuangan); setPsi(d.psikologi);
  };

  const totalIncome = p.pekerjaan.reduce((a, j) => a + num(j.penghasilan), 0)
    + p.tambahan.reduce((a, t) => a + num(t.nominal), 0) + (p.status === 'menikah' ? num(p.pasanganPenghasilan) : 0);
  const totalExp = k.pengeluaran.reduce((a, e) => a + num(e.nominal), 0);
  const totalDebt = k.hutang.reduce((a, h) => a + num(h.cicilan), 0);

  const next1 = () => {
    if (!p.nama.trim()) return setErr('Isi nama panggilanmu dulu.');
    if (!uid.trim()) return setErr('Isi User ID. Pakai ID yang sama di Bob agar datanya tersambung.');
    if (!totalIncome) return setErr('Isi minimal satu penghasilan.');
    setErr(''); setStep(2);
  };
  const next2 = () => {
    if (!totalExp) return setErr('Isi minimal satu pengeluaran bulanan.');
    setErr(''); setStep(3);
  };
  const finish = async () => {
    setBusy(true); setErr('');
    try {
      const r = await app.submitOnboarding({ profil: p, keuangan: k, psi, uid: uid.trim() });
      if (r.warnings?.length) Alert.alert('Data tersimpan', r.warnings.slice(0, 3).join('\n\n'));
      onDone();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen key={step} bottomPad={40}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {step > 1 ? <IconButton icon="back" label="Langkah sebelumnya" onPress={() => { setErr(''); setStep(step - 1); }} />
            : onCancel ? <IconButton icon="close" label="Tutup" onPress={onCancel} /> : null}
          <View style={{ flex: 1 }}><Steps step={step} /></View>
        </View>

        {step === 1 && (
          <>
            <View style={{ gap: 4 }}>
              <T w={700} size={12} color={C.teal}>Langkah 1 dari 3</T>
              <T w={800} size={26} accessibilityRole="header">Kenalan dulu, yuk</T>
              <T size={14} color={C.muted}>Data ini dipakai untuk menghitung kondisi keuanganmu.</T>
            </View>
            <Button label="Isi dengan data contoh (Budi)" icon="spark" variant="ghost" onPress={fillSample} />
            <Field label="User ID" value={uid} onChangeText={setUid} placeholder="mis. budi" autoCapitalize="none"
              hint="Pakai ID yang sama saat bertanya ke Bob, supaya datanya tersambung." />
            <Field label="Nama panggilan" value={p.nama} onChangeText={(v) => upP({ nama: v })} placeholder="Budi" />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Field style={{ flex: 1 }} label="Tanggal lahir" value={p.tanggalLahir} onChangeText={(v) => upP({ tanggalLahir: v })} placeholder="DD/MM/YYYY" keyboardType="numbers-and-punctuation" />
              <Field style={{ flex: 1 }} label="Kota" value={p.kota} onChangeText={(v) => upP({ kota: v })} placeholder="Bogor" />
            </View>
            <View style={{ gap: 6 }}><T w={700} size={13}>Pendidikan terakhir</T><Pills options={PENDIDIKAN} value={p.pendidikan} onChange={(v) => upP({ pendidikan: v })} /></View>
            <View style={{ gap: 6 }}>
              <T w={700} size={13}>Status</T>
              <Segmented options={[{ value: 'single', label: 'Single' }, { value: 'menikah', label: 'Menikah' }]} value={p.status} onChange={(v) => upP({ status: v })} />
            </View>
            {p.status === 'menikah' && (
              <Card style={{ gap: 12 }}>
                <MoneyField label="Penghasilan pasangan per bulan" value={p.pasanganPenghasilan} onChange={(v) => upP({ pasanganPenghasilan: v })} />
                <Field label="Jumlah anak" value={p.jumlahAnak} onChangeText={(v) => upP({ jumlahAnak: v.replace(/\D/g, '') })} keyboardType="number-pad" placeholder="0" />
              </Card>
            )}
            <Field label="Tanggungan lain (orang tua, saudara)" value={p.tanggungan} onChangeText={(v) => upP({ tanggungan: v.replace(/\D/g, '') })} keyboardType="number-pad" placeholder="0" />

            <T w={800} size={16} style={{ marginTop: 4 }}>Pekerjaan & penghasilan</T>
            {p.pekerjaan.map((j, i) => (
              <Card key={i} style={{ gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <T w={800} size={14} style={{ flex: 1 }}>Pekerjaan {i + 1}</T>
                  {p.pekerjaan.length > 1 ? <RemoveBtn label={`Hapus pekerjaan ${i + 1}`} onPress={() => upP({ pekerjaan: p.pekerjaan.filter((_, x) => x !== i) })} /> : null}
                </View>
                <Field label="Nama pekerjaan" value={j.nama} onChangeText={(v) => upJob(i, { nama: v })} placeholder="Software Engineer" />
                <Pills options={JENIS_KERJA} value={j.jenis} onChange={(v) => upJob(i, { jenis: v })} />
                <MoneyField label="Penghasilan rata-rata per bulan" value={j.penghasilan} onChange={(v) => upJob(i, { penghasilan: v })} />
                {j.jenis !== 'full_time' && (
                  <MoneyField label="Penghasilan terendah per bulan" value={j.penghasilanMin} onChange={(v) => upJob(i, { penghasilanMin: v })}
                    hint="Dipakai sebagai angka aman di bulan sepi." />
                )}
                <Field label="Lama bekerja (bulan)" value={j.lamaBulan} onChangeText={(v) => upJob(i, { lamaBulan: v.replace(/\D/g, '') })} keyboardType="number-pad" placeholder="24" />
              </Card>
            ))}
            <Button label="Tambah pekerjaan" icon="plus" variant="ghost"
              onPress={() => upP({ pekerjaan: [...p.pekerjaan, { nama: '', jenis: 'freelance', penghasilan: '', penghasilanMin: '', lamaBulan: '' }] })} />
            {p.tambahan.map((t, i) => (
              <Card key={`t${i}`} style={{ gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <T w={800} size={14} style={{ flex: 1 }}>Pendapatan tambahan</T>
                  <RemoveBtn label="Hapus pendapatan tambahan" onPress={() => upP({ tambahan: p.tambahan.filter((_, x) => x !== i) })} />
                </View>
                <Field label="Sumber" value={t.sumber} onChangeText={(v) => upP({ tambahan: p.tambahan.map((y, x) => (x === i ? { ...y, sumber: v } : y)) })} placeholder="Jualan online" />
                <MoneyField label="Nominal per bulan" value={t.nominal} onChange={(v) => upP({ tambahan: p.tambahan.map((y, x) => (x === i ? { ...y, nominal: v } : y)) })} />
              </Card>
            ))}
            <Button label="Tambah pendapatan lain" icon="plus" variant="secondary" onPress={() => upP({ tambahan: [...p.tambahan, { sumber: '', nominal: '' }] })} />
            <Card tone="gold" style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <T w={700} size={14}>Total penghasilan</T><T w={800} size={14}>{rpShort(totalIncome)}/bln</T>
            </Card>
            <ErrorBox message={err} />
            <Button label="Lanjut: Pengeluaran" onPress={next1} />
          </>
        )}

        {step === 2 && (
          <>
            <View style={{ gap: 4 }}>
              <T w={700} size={12} color={C.teal}>Langkah 2 dari 3</T>
              <T w={800} size={26} accessibilityRole="header">Ke mana uangmu pergi?</T>
              <T size={14} color={C.muted}>Isi perkiraan per bulan. Kosongkan yang tidak ada.</T>
            </View>
            <Card style={{ gap: 12 }}>
              {k.pengeluaran.map((e, i) => (
                <View key={`${e.key}${i}`} style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
                  <MoneyField style={{ flex: 1 }} label={e.label} value={e.nominal} onChange={(v) => upExp(i, { nominal: v })} />
                  {!EXPENSE_TEMPLATE.find((x) => x.key === e.key) ? (
                    <RemoveBtn label={`Hapus ${e.label}`} onPress={() => setK((x) => ({ ...x, pengeluaran: x.pengeluaran.filter((_, idx) => idx !== i) }))} />
                  ) : null}
                </View>
              ))}
              <AddExpense onAdd={(label) => setK((x) => ({ ...x, pengeluaran: [...x.pengeluaran, { key: label.toLowerCase().replace(/\s+/g, '_'), label, nominal: '' }] }))} />
            </Card>

            <T w={800} size={16} style={{ marginTop: 4 }}>Hutang & cicilan</T>
            {k.hutang.length === 0 ? <T size={13} color={C.muted}>Tidak punya hutang? Bagus, lewati bagian ini.</T> : null}
            {k.hutang.map((h, i) => (
              <Card key={i} style={{ gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <T w={800} size={14} style={{ flex: 1 }}>Hutang {i + 1}</T>
                  <RemoveBtn label={`Hapus hutang ${i + 1}`} onPress={() => setK((x) => ({ ...x, hutang: x.hutang.filter((_, idx) => idx !== i) }))} />
                </View>
                <Field label="Nama" value={h.nama} onChangeText={(v) => upDebt(i, { nama: v })} placeholder="Cicilan motor" />
                <Pills options={JENIS_HUTANG} value={h.jenis} onChange={(v) => upDebt(i, { jenis: v })} />
                <MoneyField label="Cicilan per bulan" value={h.cicilan} onChange={(v) => upDebt(i, { cicilan: v })} />
                <MoneyField label="Sisa pokok hutang" value={h.sisaPokok} onChange={(v) => upDebt(i, { sisaPokok: v })} />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Field style={{ flex: 1 }} label="Bunga per tahun (%)" value={h.bunga} onChangeText={(v) => upDebt(i, { bunga: v.replace(/[^0-9.,]/g, '') })} keyboardType="decimal-pad" placeholder="opsional" />
                  <Field style={{ flex: 1 }} label="Sisa tenor (bulan)" value={h.tenor} onChangeText={(v) => upDebt(i, { tenor: v.replace(/\D/g, '') })} keyboardType="number-pad" placeholder="10" />
                </View>
              </Card>
            ))}
            <Button label="Tambah hutang / cicilan" icon="plus" variant="ghost"
              onPress={() => setK((x) => ({ ...x, hutang: [...x.hutang, { nama: '', jenis: 'kendaraan', cicilan: '', sisaPokok: '', bunga: '', tenor: '' }] }))} />
            <MoneyField label="Tabungan saat ini" value={k.tabungan} onChange={(v) => setK((x) => ({ ...x, tabungan: v }))} hint="Uang yang bisa dipakai kapan saja (tabungan, e-wallet)." />
            <Card tone="gold" style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><T w={700} size={14}>Pengeluaran rutin</T><T w={800} size={14}>{rpShort(totalExp)}</T></View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><T w={700} size={14}>Cicilan</T><T w={800} size={14}>{rpShort(totalDebt)}</T></View>
            </Card>
            <ErrorBox message={err} />
            <Button label="Lanjut: Gaya uangmu" onPress={next2} />
          </>
        )}

        {step === 3 && (
          <>
            <View style={{ gap: 4 }}>
              <T w={700} size={12} color={C.teal}>Langkah 3 dari 3, opsional</T>
              <T w={800} size={26} accessibilityRole="header">Kenali gaya uangmu</T>
              <T size={14} color={C.muted}>1 = sangat tidak setuju, 5 = sangat setuju. Tidak ada jawaban benar atau salah.</T>
            </View>
            {KUIS.map(([key, q], qi) => (
              <View key={key} style={{ gap: 8 }}>
                <T w={600} size={14}>{qi + 1}. {q}</T>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  {[1, 2, 3, 4, 5].map((v) => {
                    const on = psi[key] === v;
                    return (
                      <Pressable key={v} accessibilityRole="button" accessibilityLabel={`Pernyataan ${qi + 1}, nilai ${v}`} accessibilityState={{ selected: on }}
                        onPress={() => setPsi((x) => ({ ...x, [key]: v }))}
                        style={{ flex: 1, minHeight: 44, borderRadius: 12, borderWidth: 1, borderColor: on ? C.teal : C.line, backgroundColor: on ? C.teal : C.card, alignItems: 'center', justifyContent: 'center' }}>
                        <T w={700} size={14} color={on ? C.white : C.ink}>{v}</T>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
              <Icon name="shield" size={18} color={C.teal} />
              <T size={12} color={C.muted} style={{ flex: 1 }}>CITA tidak meminta alamat lengkap, KTP, nomor rekening, atau PIN. Datamu bisa dihapus kapan saja dari tab Profil.</T>
            </View>
            <ErrorBox message={err} />
            <Button label={app.live ? 'Simpan & analisis' : 'Lihat hasil (mode demo)'} onPress={finish} loading={busy} />
          </>
        )}
      </Screen>
    </KeyboardAvoidingView>
  );
}

function AddExpense({ onAdd }) {
  const [label, setLabel] = useState('');
  return (
    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
      <Field style={{ flex: 1 }} label="Kategori lain" value={label} onChangeText={setLabel} placeholder="mis. Kirim ke orang tua" />
      <IconButton icon="plus" label="Tambah kategori" filled onPress={() => { if (label.trim()) { onAdd(label.trim()); setLabel(''); } }} />
    </View>
  );
}
