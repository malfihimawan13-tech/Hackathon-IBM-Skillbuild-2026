/**
 * TambahBisnis — Form eksplorasi usaha untuk pengguna yang belum punya data usaha.
 * Flow 6 hanya dipanggil saat tombol "Cari ide usaha" ditekan.
 * Hasil disimpan per user_id di AppContext.
 * Mode Demo: form bisa dibuka, tombol Cari nonaktif.
 * Untuk dini: waktu default "sampingan" dengan catatan kecil.
 */
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useApp } from '../state/AppContext';
import { findPersona } from '../state/persona';
import { Button, Card, ErrorBox, MoneyField, Screen, ScreenHeader, T } from '../components/ui';
import { ChipInput, ImpactCard, MultiPills, toggleIn } from '../components/forms';
import Icon from '../components/Icon';
import { C, R } from '../theme';
import { rpShort } from '../utils/format';

const MINAT_PRESETS = ['Kuliner', 'Teknologi', 'Desain', 'Fashion', 'Otomotif', 'Pendidikan', 'Kesehatan', 'Pertanian', 'Jasa', 'Keuangan'];
const SKILL_PRESETS = ['Memasak', 'Desain grafis', 'Fotografi', 'Servis motor/elektronik', 'Jahit', 'Menulis', 'Marketing', 'Akuntansi'];
const SKEN = [['pesimis', 'Pesimis'], ['moderat', 'Moderat'], ['optimis', 'Optimis']];

// Tampilkan detail satu usaha hasil rekomendasi
function UsahaResultCard({ h, onLihatDampak, loadingDampak }) {
  return (
    <View style={{ gap: 10 }}>
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
        {(h.alasan || []).map((a, i) => {
          const warn = a.startsWith('Perhatian') || a.includes('masih kurang');
          return (
            <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
              <Icon name={warn ? 'alert' : 'check'} size={16} color={warn ? C.warn : C.teal} />
              <T size={13} style={{ flex: 1, lineHeight: 19 }}>{a}</T>
            </View>
          );
        })}
        {h.modal_awal && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <T size={13} color={C.muted}>Modal awal</T>
            <T size={13} w={700}>{rpShort(h.modal_awal?.min ?? h.modal_awal)} – {rpShort(h.modal_awal?.max ?? h.modal_awal)}</T>
          </View>
        )}
        {h.model_pendapatan && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
            <T size={13} color={C.muted}>Model pendapatan</T>
            <T size={13} w={700} style={{ textAlign: 'right', flex: 1 }}>{h.model_pendapatan}</T>
          </View>
        )}
      </Card>

      {/* Tiga skenario */}
      {h.skenario && (
        <Card style={{ gap: 10 }}>
          <T w={800} size={15}>Tiga skenario</T>
          <View style={{ flexDirection: 'row' }}>
            <T size={12} color={C.muted} style={{ flex: 1.3 }} />
            {SKEN.map(([k, l]) => <T key={k} w={700} size={12} color={k === 'moderat' ? C.teal : C.muted} style={{ flex: 1 }}>{l}</T>)}
          </View>
          {[
            ['Laba/bulan', 'laba_bulanan_stabil', (x) => rpShort(x)],
            ['Laba thn pertama', 'laba_tahun_pertama', (x) => rpShort(x)],
            ['Balik modal', 'balik_modal', (x) => x],
          ].map(([label, key, f]) => (
            <View key={key} style={{ flexDirection: 'row' }}>
              <T size={13} color={C.muted} style={{ flex: 1.3, lineHeight: 18 }}>{label}</T>
              {SKEN.map(([k]) => {
                const val = h.skenario[k]?.[key];
                return <T key={k} w={k === 'moderat' ? 800 : 600} size={13} style={{ flex: 1 }}>{val != null ? f(val) : '–'}</T>;
              })}
            </View>
          ))}
          {h.risiko?.length ? (
            <>
              <T w={700} size={12} style={{ marginTop: 4 }}>Risiko</T>
              {h.risiko.slice(0, 3).map((r) => (
                <View key={r} style={{ flexDirection: 'row', gap: 8 }}>
                  <Icon name="alert" size={14} color={C.warn} />
                  <T size={12} color={C.muted} style={{ flex: 1, lineHeight: 17 }}>{r}</T>
                </View>
              ))}
            </>
          ) : null}
        </Card>
      )}

      <Button
        label="Lihat dampak ke tujuanku"
        icon="target"
        onPress={() => onLihatDampak(h)}
        loading={loadingDampak}
        style={{ minHeight: 44 }}
      />
    </View>
  );
}

// Tampilkan semua hasil rekomendasi usaha
function HasilBisnis({ hasil, go, onUbahIsian, onLihatDampak, loadingDampak, perbandingan, dampakUntuk }) {
  const [sel, setSel] = useState(0);
  const reko = hasil?.rekomendasi || [];

  if (!reko.length) {
    return (
      <Card>
        <T size={13} color={C.muted}>Belum ada rekomendasi. Coba lagi dengan isian yang lebih lengkap.</T>
      </Card>
    );
  }

  return (
    <View style={{ gap: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <T w={700} size={15} style={{ flex: 1 }}>Ide usaha untukmu</T>
        <Pressable onPress={onUbahIsian} accessibilityRole="button" accessibilityLabel="Ubah isian">
          <T w={700} size={13} color={C.teal}>Ubah isian</T>
        </Pressable>
      </View>

      {/* Tab usaha */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {reko.slice(0, 3).map((r, i) => {
          const on = i === sel;
          return (
            <Pressable key={r.id || r.usaha} onPress={() => setSel(i)} accessibilityRole="tab" accessibilityState={{ selected: on }}
              style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14, backgroundColor: on ? C.ink : C.card, borderWidth: 1, borderColor: on ? C.ink : C.line }}>
              <T w={700} size={13} color={on ? C.white : C.ink}>{r.usaha}</T>
              <T size={11} color={on ? 'rgba(255,255,255,0.8)' : C.muted}>Skor {r.skor_kecocokan}</T>
            </Pressable>
          );
        })}
      </View>

      {reko[sel] && (
        <UsahaResultCard
          h={reko[sel]}
          onLihatDampak={onLihatDampak}
          loadingDampak={loadingDampak}
        />
      )}

      {perbandingan && (
        <ImpactCard perbandingan={perbandingan} title={`Jika membuka ${dampakUntuk || reko[sel]?.usaha}`} />
      )}

      {hasil.disclaimer ? (
        <T size={11} color={C.muted} style={{ lineHeight: 16 }}>{hasil.disclaimer}</T>
      ) : null}

      <Button label="Lihat roadmap" icon="route" variant="secondary" onPress={() => go('roadmap')} style={{ minHeight: 44 }} />
    </View>
  );
}

export default function TambahBisnis({ go }) {
  const app = useApp();
  const uid = app.activeUserId;
  const persona = findPersona(uid);

  // Untuk dini: default waktu "sampingan"
  const isDini = uid === 'dini';
  const defaultWaktu = isDini ? 'sampingan' : 'sampingan';

  const existing = app.usaha;
  const [showForm, setShowForm] = useState(!existing?.hasil);

  // Form state — JANGAN pre-fill minat/skill dari persona
  const [minat, setMinat] = useState([]);
  const [skill, setSkill] = useState([]);
  const [modal, setModal] = useState('');
  const [waktu, setWaktu] = useState(defaultWaktu);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [loadingDampak, setLoadingDampak] = useState(false);
  const [perbandingan, setPerbandingan] = useState(null);
  const [dampakUntuk, setDampakUntuk] = useState('');

  const demoMode = !app.live;

  const handleCari = async () => {
    if (demoMode) return;
    setBusy(true); setErr('');
    try {
      await app.exploreUsaha({
        user_id: uid,
        minat: minat.length ? minat : [],
        skill: skill.length ? skill : [],
        modal_tersedia: Number(modal) || 0,
        waktu,
      });
      setShowForm(false);
      setPerbandingan(null);
    } catch (e) {
      setErr(e.message);
    }
    setBusy(false);
  };

  const handleLihatDampak = async (h) => {
    setLoadingDampak(true); setErr('');
    try {
      const simulasi = h?.simulasi_siap_pakai_per_skenario?.pesimis ?? h?.simulasi_siap_pakai;
      if (!simulasi) throw new Error('Data simulasi untuk usaha ini belum tersedia.');
      const r = await app.simulateRoadmap(simulasi, ['usaha', h?.id]);
      setPerbandingan(r.perbandingan);
      setDampakUntuk(h?.usaha || '');
    } catch (e) {
      setErr(e.message);
    }
    setLoadingDampak(false);
  };

  return (
    <Screen>
      <ScreenHeader title="Tambah bisnis" onBack={() => go('karirbisnis')} />

      {showForm && (
        <View style={{ gap: 14 }}>
          <Card style={{ gap: 16 }}>
            {/* Minat */}
            <View style={{ gap: 8 }}>
              <T w={700} size={13}>Minat</T>
              <T size={12} color={C.muted}>Pilih satu atau lebih, atau ketik sendiri.</T>
              <MultiPills options={MINAT_PRESETS} values={minat} onToggle={(v) => setMinat(toggleIn(minat, v))} />
              <ChipInput label="" placeholder="Tambah minat lain" values={minat} onChange={setMinat} />
            </View>

            {/* Skill */}
            <View style={{ gap: 8 }}>
              <T w={700} size={13}>Skill</T>
              <T size={12} color={C.muted}>Pilih dari daftar atau tambah sendiri.</T>
              <MultiPills options={SKILL_PRESETS} values={skill} onToggle={(v) => setSkill(toggleIn(skill, v))} />
              <ChipInput label="" placeholder="Tambah skill lain" values={skill} onChange={setSkill} />
            </View>

            {/* Modal */}
            <MoneyField
              label="Modal tersedia (Rp)"
              value={modal}
              onChange={setModal}
              placeholder="mis. 500000"
              hint="Modal yang siap dipakai untuk memulai usaha."
            />

            {/* Waktu */}
            <View style={{ gap: 8 }}>
              <T w={700} size={13}>Waktu yang tersedia</T>
              {isDini && (
                <T size={12} color={C.muted} style={{ lineHeight: 17 }}>
                  Cocok dijalankan sambil sekolah atau kuliah.
                </T>
              )}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {[['sampingan', 'Sampingan'], ['penuh', 'Penuh waktu']].map(([val, label]) => {
                  const on = waktu === val;
                  return (
                    <Pressable key={val} onPress={() => setWaktu(val)} accessibilityRole="radio" accessibilityState={{ checked: on }}
                      style={{ flex: 1, paddingVertical: 12, borderRadius: R.md, borderWidth: 1, borderColor: on ? C.teal : C.line, backgroundColor: on ? C.soft : C.card, alignItems: 'center' }}>
                      <T w={on ? 700 : 600} size={14} color={on ? C.teal : C.ink}>{label}</T>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </Card>

          {demoMode && (
            <Card>
              <T size={13} color={C.muted} style={{ lineHeight: 19 }}>
                Matikan Mode demo di tab Profil untuk mencari dengan Langflow.
              </T>
            </Card>
          )}

          <Button
            label="Cari ide usaha"
            icon="store"
            onPress={handleCari}
            loading={busy}
            disabled={demoMode}
            style={{ minHeight: 44 }}
          />
          <ErrorBox message={err} />
        </View>
      )}

      {!showForm && app.usaha?.hasil && (
        <HasilBisnis
          hasil={app.usaha.hasil}
          go={go}
          onUbahIsian={() => { setShowForm(true); setPerbandingan(null); }}
          onLihatDampak={handleLihatDampak}
          loadingDampak={loadingDampak}
          perbandingan={perbandingan}
          dampakUntuk={dampakUntuk}
        />
      )}
      {!showForm && err ? <ErrorBox message={err} /> : null}
    </Screen>
  );
}
