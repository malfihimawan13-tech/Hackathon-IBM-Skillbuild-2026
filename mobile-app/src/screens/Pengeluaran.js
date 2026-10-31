import React, { useEffect, useState } from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';
import { useApp } from '../state/AppContext';
import { findPersona } from '../state/persona';
import { Bar, Button, Card, ErrorBox, MoneyField, Screen, ScreenHeader, T } from '../components/ui';
import Icon from '../components/Icon';
import { C } from '../theme';
import { digitsOnly, rp, rpShort } from '../utils/format';

// ─── Peta label ramah untuk kunci kategori ────────────────────────────────────
const LABEL_MAP = {
  makan: 'Makan & minum',
  'makan_minum': 'Makan & minum',
  kos: 'Kos / sewa',
  'kos_sewa': 'Kos / sewa',
  transportasi: 'Transportasi',
  internet: 'Internet & pulsa',
  'internet_pulsa': 'Internet & pulsa',
  listrik: 'Listrik',
  air: 'Air',
  'listrik_air': 'Listrik & air',
  kebutuhan_pribadi: 'Kebutuhan pribadi',
  hiburan: 'Hiburan',
  orang_tua: 'Kiriman orang tua',
  lainnya: 'Lainnya',
  pendidikan_anak: 'Pendidikan anak',
  kesehatan: 'Kesehatan',
  'kebutuhan_rumah': 'Kebutuhan rumah',
  pendidikan: 'Pendidikan & kursus',
  'pendidikan_kursus': 'Pendidikan & kursus',
};

// Coba cocokkan label ke nama ramah; fallback ke nilai asli
function labelFor(raw) {
  if (!raw) return raw;
  const key = String(raw)
    .toLowerCase()
    .replace(/&\s*.+/g, '')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  return LABEL_MAP[key] || raw;
}

// ─── Baris kategori (mode lihat) ──────────────────────────────────────────────
function CategoryRow({ item, total }) {
  const pct = total > 0 ? item.nominal / total : 0;
  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <T size={14} style={{ flex: 1 }}>{labelFor(item.label)}</T>
        <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
          <T w={700} size={14}>{rpShort(item.nominal)}</T>
          <T size={11} color={C.muted}>{Math.round(pct * 100)}%</T>
        </View>
      </View>
      <Bar ratio={pct} color={C.teal} height={6} />
    </View>
  );
}

// ─── Baris kategori (mode edit) ──────────────────────────────────────────────
function EditRow({ item, onChange, onDelete }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
      <View style={{ flex: 1 }}>
        <MoneyField
          label={labelFor(item.label)}
          value={String(item.nominal || '')}
          onChange={(v) => onChange({ ...item, nominal: Number(v) || 0 })}
        />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Hapus ${labelFor(item.label)}`}
        onPress={onDelete}
        style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}
      >
        <Icon name="trash" size={20} color={C.warn} />
      </Pressable>
    </View>
  );
}

// ─── Form tambah kategori baru ────────────────────────────────────────────────
function AddRowSimple({ items, onAdd }) {
  const [nama, setNama] = useState('');
  const [nominal, setNominal] = useState('');
  const [formErr, setFormErr] = useState('');

  const submit = () => {
    const n = nama.trim();
    const v = Number(digitsOnly(nominal)) || 0;
    if (!n) { setFormErr('Nama kategori tidak boleh kosong.'); return; }
    const dup = items.some((i) => labelFor(i.label).toLowerCase() === labelFor(n).toLowerCase());
    if (dup) { setFormErr(`Kategori "${n}" sudah ada.`); return; }
    if (v < 0) { setFormErr('Nominal harus ≥ 0.'); return; }
    setFormErr('');
    onAdd({ label: n, nominal: v });
    setNama(''); setNominal('');
  };

  return (
    <Card style={{ gap: 10 }}>
      <T w={700} size={14}>Tambah pengeluaran</T>
      {formErr ? <T size={12} color={C.warn}>{formErr}</T> : null}
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
        <View style={{ flex: 1, gap: 6 }}>
          <T w={700} size={13}>Nama</T>
          <TextInput
            accessibilityLabel="Nama kategori pengeluaran baru"
            value={nama}
            onChangeText={(t) => { setNama(t); setFormErr(''); }}
            placeholder="mis. BPJS"
            placeholderTextColor="#8A9693"
            style={{
              borderWidth: 1, borderColor: C.line, borderRadius: 10,
              paddingHorizontal: 12, paddingVertical: 10,
              fontFamily: 'PlusJakartaSans_400Regular', fontSize: 14, color: C.ink,
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <MoneyField label="Nominal" value={nominal} onChange={(v) => { setNominal(v); setFormErr(''); }} />
        </View>
      </View>
      <Button label="+ Tambah" onPress={submit} variant="ghost" />
    </Card>
  );
}

// ─── Kartu perubahan sebelum & sesudah ───────────────────────────────────────
function ChangeCard({ before, after }) {
  if (!before || !after) return null;
  const rows = [
    { label: 'Total pengeluaran', b: rp(before.dashboard?.pengeluaran), a: rp(after.dashboard?.pengeluaran) },
    { label: 'Sisa per bulan', b: rp(before.dashboard?.sisa), a: rp(after.dashboard?.sisa) },
    { label: 'Skor Kesehatan Finansial', b: `${before.dashboard?.skor_kesehatan}/100`, a: `${after.dashboard?.skor_kesehatan}/100` },
  ];
  return (
    <Card tone="teal" style={{ gap: 10 }}>
      <T w={800} size={14} color={C.white}>Perubahan setelah disimpan</T>
      {rows.map(({ label, b, a }) => (
        <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <T size={12} color="rgba(255,255,255,0.8)">{label}</T>
          <T size={13} color={C.white}>
            <T size={12} color="rgba(255,255,255,0.6)">{b} → </T>{a}
          </T>
        </View>
      ))}
    </Card>
  );
}

// ─── Layar utama ──────────────────────────────────────────────────────────────
export default function Pengeluaran({ go, params }) {
  const { analysis, live, userId, savePengeluaran, refreshAnalysis } = useApp();
  const persona = findPersona(userId);

  function buildItems() {
    return (persona?.keuangan?.pengeluaran || []).map((p) => ({
      label: p.label,
      nominal: Number(p.nominal) || 0,
    }));
  }

  const [editMode, setEditMode] = useState(false);
  const [items, setItems] = useState(buildItems);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [changeResult, setChangeResult] = useState(null);

  // Sync data ketika userId berubah atau setelah keluar mode edit
  useEffect(() => {
    if (!editMode) setItems(buildItems());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, editMode]);

  const totalFlow4 = analysis?.dashboard?.pengeluaran || 0;
  const totalItems = items.reduce((s, i) => s + (i.nominal || 0), 0);
  const sisaFlow4 = analysis?.dashboard?.sisa;
  const pendapatan = analysis?.dashboard?.pendapatan || 0;

  // Urut dari terbesar
  const sorted = [...items].sort((a, b) => b.nominal - a.nominal);

  const isDemo = !live;
  const isDemoPersona = ['budi', 'agus', 'dini'].includes(userId);

  const validate = (list) => {
    for (const it of list) {
      if (it.nominal < 0) return `Nominal "${labelFor(it.label)}" tidak boleh negatif.`;
    }
    const labels = list.map((i) => labelFor(i.label).toLowerCase());
    const dup = labels.find((l, i) => labels.indexOf(l) !== i);
    if (dup) return `Kategori "${dup}" dobel.`;
    return null;
  };

  const handleSave = async () => {
    const vErr = validate(items);
    if (vErr) { setErr(vErr); return; }
    setSaving(true); setErr('');
    try {
      const before = analysis;
      await savePengeluaran(userId, items);
      const after = await refreshAnalysis();
      setChangeResult({ before, after });
      setEditMode(false);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = () => {
    Alert.alert(
      'Kembalikan data contoh?',
      'Pengeluaran akan dikembalikan ke nilai asli dan dikirim ke Langflow.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, kembalikan',
          style: 'destructive',
          onPress: async () => {
            setSaving(true); setErr('');
            try {
              const original = (persona?.keuangan?.pengeluaran || []).map((p) => ({
                label: p.label,
                nominal: Number(p.nominal) || 0,
              }));
              const before = analysis;
              await savePengeluaran(userId, original);
              const after = await refreshAnalysis();
              setItems(original);
              setChangeResult({ before, after });
              setEditMode(false);
            } catch (e) {
              setErr(e.message);
            } finally {
              setSaving(false);
            }
          },
        },
      ],
    );
  };

  const handleCancel = () => {
    setItems(buildItems());
    setErr('');
    setEditMode(false);
  };

  const originScreen = params?.from || 'home';

  return (
    <Screen>
      <ScreenHeader
        title="Pengeluaran bulan ini"
        onBack={() => go(originScreen)}
        right={
          !editMode ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isDemo ? 'Ubah tidak tersedia di mode demo' : 'Ubah pengeluaran'}
              onPress={isDemo ? undefined : () => { setEditMode(true); setChangeResult(null); }}
              style={{
                paddingHorizontal: 12, paddingVertical: 8,
                minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center',
                opacity: isDemo ? 0.4 : 1,
              }}
            >
              <T w={700} size={14} color={C.teal}>Ubah</T>
            </Pressable>
          ) : null
        }
      />

      {/* Peringatan mode demo */}
      {isDemo && (
        <Card tone="gold" style={{ flexDirection: 'row', gap: 8, alignItems: 'center', padding: 10 }}>
          <Icon name="spark" size={16} color={C.warn} />
          <T size={12} style={{ flex: 1 }}>Matikan Mode demo untuk mengubah pengeluaran.</T>
        </Card>
      )}

      {/* Catatan khusus Agus */}
      {userId === 'agus' && (
        <Card style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
          <Icon name="alert" size={16} color={C.teal} />
          <T size={12} color={C.muted} style={{ flex: 1, lineHeight: 18 }}>
            Pengeluaran rumah tangga. Biaya operasional bengkel dan kelontong sudah dikurangkan dari pendapatan bersih.
          </T>
        </Card>
      )}

      {/* Ringkasan */}
      <Card style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, gap: 2, paddingRight: 12, borderRightWidth: 1, borderRightColor: C.line }}>
          <T size={12} color={C.muted}>Total pengeluaran</T>
          <T w={800} size={22}>{rpShort(totalFlow4 || totalItems)}</T>
          <T size={11} color={C.muted}>per bulan</T>
        </View>
        <View style={{ flex: 1, gap: 2, paddingLeft: 12 }}>
          <T size={12} color={C.muted}>Sisa per bulan</T>
          <T w={800} size={22} color={(sisaFlow4 ?? 0) >= 0 ? C.teal : C.warn}>
            {rpShort(sisaFlow4 ?? 0)}
          </T>
          {pendapatan > 0 && <T size={11} color={C.muted}>dari {rpShort(pendapatan)}</T>}
        </View>
      </Card>

      <ErrorBox message={err} />

      {changeResult ? <ChangeCard before={changeResult.before} after={changeResult.after} /> : null}

      {/* ── Mode lihat ─────────────────────────────────────────────────────── */}
      {!editMode && (
        <Card style={{ gap: 14 }}>
          <T w={800} size={16}>Semua kategori ({sorted.length})</T>
          {sorted.length === 0
            ? <T size={13} color={C.muted}>Belum ada data pengeluaran.</T>
            : sorted.map((item, i) => (
                <CategoryRow key={`${item.label}-${i}`} item={item} total={totalItems} />
              ))
          }
        </Card>
      )}

      {/* ── Mode edit ──────────────────────────────────────────────────────── */}
      {editMode && (
        <>
          <Card style={{ gap: 14 }}>
            <T w={800} size={16}>Ubah nominal</T>
            {items.map((item, i) => (
              <EditRow
                key={`edit-${item.label}-${i}`}
                item={item}
                onChange={(updated) => {
                  const next = [...items];
                  next[i] = updated;
                  setItems(next);
                }}
                onDelete={() => setItems(items.filter((_, j) => j !== i))}
              />
            ))}
          </Card>

          <AddRowSimple items={items} onAdd={(newItem) => setItems([...items, newItem])} />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Button label="Batal" variant="secondary" onPress={handleCancel} disabled={saving} />
            </View>
            <View style={{ flex: 1 }}>
              <Button label="Simpan" onPress={handleSave} loading={saving} />
            </View>
          </View>
        </>
      )}

      {/* Kembalikan data contoh */}
      {isDemoPersona && !isDemo && !editMode && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kembalikan data contoh"
          onPress={handleRestore}
          disabled={saving}
          style={{ alignSelf: 'center', paddingVertical: 12, paddingHorizontal: 20, opacity: saving ? 0.5 : 1 }}
        >
          <T w={600} size={13} color={C.muted}>Kembalikan data contoh ›</T>
        </Pressable>
      )}
    </Screen>
  );
}
