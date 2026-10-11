/**
 * TambahKarir — Form eksplorasi karier untuk pengguna yang belum punya data karier.
 * Flow 5 hanya dipanggil saat tombol "Cari karier yang cocok" ditekan.
 * Hasil disimpan per user_id di AppContext.
 * Mode Demo: form bisa dibuka, tombol Cari nonaktif.
 */
import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useApp } from '../state/AppContext';
import { findPersona } from '../state/persona';
import { Button, Card, ErrorBox, Screen, ScreenHeader, T } from '../components/ui';
import { ChipInput, ExperienceList, ImpactCard, MultiPills, toggleIn } from '../components/forms';
import Icon from '../components/Icon';
import { C, F, R } from '../theme';
import { rpShort } from '../utils/format';

const LEVEL_OPTIONS = ['Dasar', 'Menengah', 'Mahir'];
const PENDIDIKAN_OPTIONS = ['SD', 'SMP', 'SMA/SMK', 'D3', 'S1', 'S2/S3'];
const MINAT_PRESETS = ['Teknologi', 'Bisnis', 'Desain', 'Pendidikan', 'Kesehatan', 'Hukum', 'Seni', 'Keuangan', 'Olahraga', 'Pertanian'];

// Input skill dengan level bawaan per skill
function SkillInput({ items, onChange }) {
  const [text, setText] = useState('');
  const [level, setLevel] = useState('Menengah');
  const inputStyle = { flex: 1, minHeight: 48, borderRadius: R.md, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, paddingHorizontal: 14, fontFamily: F.semibold, fontSize: 14, color: C.ink };

  const add = () => {
    const t = text.trim();
    if (!t) return;
    if (!items.find((i) => i.nama.toLowerCase() === t.toLowerCase())) {
      onChange([...items, { nama: t, level }]);
    }
    setText('');
  };

  return (
    <View style={{ gap: 8 }}>
      <T w={700} size={13}>Skill</T>
      <T size={12} color={C.muted}>Pilih level, ketik nama skill, lalu tekan Tambah atau Enter.</T>
      {/* Level selector */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {LEVEL_OPTIONS.map((l) => {
          const on = l === level;
          return (
            <Pressable key={l} onPress={() => setLevel(l)} accessibilityRole="radio" accessibilityState={{ checked: on }}
              style={{ flex: 1, paddingVertical: 8, borderRadius: R.pill, borderWidth: 1, borderColor: on ? C.teal : C.line, backgroundColor: on ? C.soft : C.card, alignItems: 'center' }}>
              <T w={on ? 700 : 600} size={13} color={on ? C.teal : C.ink}>{l}</T>
            </Pressable>
          );
        })}
      </View>
      {/* Text input */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput
          accessibilityLabel="Nama skill"
          value={text}
          onChangeText={setText}
          onSubmitEditing={add}
          placeholder="mis. servis motor, Canva, Excel"
          placeholderTextColor="#8A9693"
          returnKeyType="done"
          style={inputStyle}
        />
        <Pressable onPress={add} accessibilityRole="button" accessibilityLabel="Tambah skill"
          style={{ width: 48, height: 48, borderRadius: R.md, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="plus" size={20} color={C.white} />
        </Pressable>
      </View>
      {/* Chips skill yang sudah ditambah */}
      {items.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {items.map((s) => {
            const levelColor = s.level === 'Mahir' ? C.teal : s.level === 'Menengah' ? '#1F6F66' : '#5DCAA5';
            return (
              <Pressable key={s.nama} onPress={() => onChange(items.filter((x) => x.nama !== s.nama))}
                accessibilityRole="button" accessibilityLabel={`Hapus skill ${s.nama}`}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: R.pill, backgroundColor: C.soft }}>
                <T size={11} w={700} color={levelColor}>{s.level}</T>
                <T w={600} size={13} color={C.ink}>{s.nama}</T>
                <Icon name="close" size={13} color={C.muted} />
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

// Tampilkan hasil rekomendasi karier
function HasilKarier({ hasil, go, onUbahIsian, onLihatDampak, loadingDampak, perbandingan, dampakUntuk }) {
  const [sel, setSel] = useState(0);
  const reko = hasil?.rekomendasi || [];
  if (!reko.length) {
    return (
      <Card>
        <T size={13} color={C.muted}>Belum ada rekomendasi. Coba lagi dengan isian yang lebih lengkap.</T>
      </Card>
    );
  }

  const h = reko[sel];
  const tahap = h?.jalur_pendapatan?.tahapan || [];

  return (
    <View style={{ gap: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <T w={700} size={15} style={{ flex: 1 }}>Rekomendasi karier</T>
        <Pressable onPress={onUbahIsian} accessibilityRole="button" accessibilityLabel="Ubah isian">
          <T w={700} size={13} color={C.teal}>Ubah isian</T>
        </Pressable>
      </View>

      {/* Tab profesi */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {reko.slice(0, 3).map((r, i) => {
          const on = i === sel;
          return (
            <Pressable key={r.id || r.profesi} onPress={() => setSel(i)} accessibilityRole="tab" accessibilityState={{ selected: on }}
              style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14, backgroundColor: on ? C.ink : C.card, borderWidth: 1, borderColor: on ? C.ink : C.line }}>
              <T w={700} size={13} color={on ? C.white : C.ink}>{r.profesi}</T>
              <T size={11} color={on ? 'rgba(255,255,255,0.8)' : C.muted}>Kecocokan {r.skor_kecocokan}</T>
            </Pressable>
          );
        })}
      </View>

      {h && (
        <Card style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <T w={800} size={26} color={C.teal} style={{ lineHeight: 30 }}>{h.skor_kecocokan}</T>
            <T size={12} color={C.muted}>kecocokan minat & skill</T>
          </View>
          <View style={{ height: 8, borderRadius: 999, backgroundColor: C.soft, overflow: 'hidden' }}>
            <View style={{ width: `${h.skor_kecocokan}%`, height: 8, borderRadius: 999, backgroundColor: C.teal }} />
          </View>
          {h.deskripsi ? <T size={12} color={C.muted} style={{ lineHeight: 18 }}>{h.deskripsi}</T> : null}
          {(h.alasan || []).map((a, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
              <Icon name="check" size={16} color={C.teal} />
              <T size={13} style={{ flex: 1, lineHeight: 19 }}>{a}</T>
            </View>
          ))}
        </Card>
      )}

      {/* Skill gap */}
      {h && (h.skill_gap_wajib?.length > 0 || h.skill_sudah_dimiliki?.length > 0) ? (
        <Card style={{ gap: 10 }}>
          <T w={800} size={15}>Skill gap</T>
          {h.skill_sudah_dimiliki?.length > 0 && (
            <>
              <T w={700} size={12}>Sudah dimiliki</T>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {h.skill_sudah_dimiliki.map((s) => (
                  <View key={s} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: C.soft }}>
                    <T size={12} w={700} color={C.teal}>{s}</T>
                  </View>
                ))}
              </View>
            </>
          )}
          {h.skill_gap_wajib?.length > 0 && (
            <>
              <T w={700} size={12}>Perlu dipelajari</T>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {h.skill_gap_wajib.map((s) => (
                  <View key={s} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: C.warnSoft }}>
                    <T size={12} w={700} color={C.warn}>{s}</T>
                  </View>
                ))}
              </View>
            </>
          )}
        </Card>
      ) : null}

      {/* Gaji per jenjang */}
      {tahap.length > 0 && (
        <Card style={{ gap: 8 }}>
          <T w={800} size={15}>Gaji per jenjang</T>
          {tahap.map((t) => {
            const label = t.tahap === 'entry' ? `Junior ${h.profesi}` : t.tahap === 'mid' ? h.profesi : `Senior ${h.profesi}`;
            return (
              <View key={t.tahap} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                <T size={13} color={C.muted}>{label}</T>
                <T size={13} w={700} style={{ textAlign: 'right' }}>{rpShort(t.rentang_min)} – {rpShort(t.rentang_max)}</T>
              </View>
            );
          })}
          {tahap[0]?.sumber?.[0] ? <T size={11} color={C.muted}>Sumber: {tahap[0].sumber[0]}.</T> : null}
        </Card>
      )}

      <Button
        label="Lihat dampak ke tujuanku"
        icon="target"
        onPress={() => onLihatDampak(reko[sel])}
        loading={loadingDampak}
        style={{ minHeight: 44 }}
      />
      {perbandingan && (
        <ImpactCard perbandingan={perbandingan} title={`Jika menjadi ${dampakUntuk || reko[sel]?.profesi}`} />
      )}
      <Button label="Lihat roadmap" icon="route" variant="secondary" onPress={() => go('roadmap')} style={{ minHeight: 44 }} />
    </View>
  );
}

export default function TambahKarir({ go }) {
  const app = useApp();
  const uid = app.activeUserId;
  const persona = findPersona(uid);

  // Pre-fill pendidikan & kota dari persona; JANGAN pre-fill minat/skill/pengalaman
  const defaultPendidikan = persona?.profil?.pendidikan_terakhir || '';
  const defaultKota = persona?.kota || '';

  const existing = app.karier;
  const [showForm, setShowForm] = useState(!existing?.hasil);

  const [minat, setMinat] = useState([]);
  const [skill, setSkill] = useState([]); // [{nama, level}]
  const [pengalaman, setPengalaman] = useState([{ bidang: '', tahun: '' }]);
  const [pendidikan, setPendidikan] = useState(defaultPendidikan);
  const [kota, setKota] = useState(defaultKota);

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
      const pengalamanFilled = pengalaman.filter((p) => p.bidang.trim());
      const skillArr = skill.map((s) => `${s.nama} (${s.level})`);
      await app.exploreKarier({
        user_id: uid,
        minat: minat.length ? minat : [],
        skill: skillArr,
        pengalaman: pengalamanFilled.map((p) => `${p.bidang}${p.tahun ? ' ' + p.tahun + ' tahun' : ''}`.trim()),
        pendidikan_terakhir: pendidikan || undefined,
        kota: kota || undefined,
      });
      setShowForm(false);
      setPerbandingan(null);
    } catch (e) {
      setErr(e.message);
    }
    setBusy(false);
  };

  const handleLihatDampak = async (reko) => {
    setLoadingDampak(true); setErr('');
    try {
      const simulasi = reko?.simulasi_siap_pakai;
      if (!simulasi) throw new Error('Data simulasi untuk profesi ini belum tersedia.');
      const r = await app.simulateRoadmap(simulasi, ['karier', reko?.id]);
      setPerbandingan(r.perbandingan);
      setDampakUntuk(reko?.profesi || '');
    } catch (e) {
      setErr(e.message);
    }
    setLoadingDampak(false);
  };

  return (
    <Screen>
      <ScreenHeader title="Tambah karir" onBack={() => go('karirbisnis')} />

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
            <SkillInput items={skill} onChange={setSkill} />

            {/* Pengalaman */}
            <ExperienceList items={pengalaman} onChange={setPengalaman} />

            {/* Pendidikan */}
            <View style={{ gap: 8 }}>
              <T w={700} size={13}>Pendidikan terakhir</T>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {PENDIDIKAN_OPTIONS.map((p) => {
                  const on = pendidikan === p || pendidikan.startsWith(p.replace('/SMK', ''));
                  return (
                    <Pressable key={p} onPress={() => setPendidikan(p)} accessibilityRole="radio" accessibilityState={{ checked: on }}
                      style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: on ? C.teal : C.line, backgroundColor: on ? C.soft : C.card }}>
                      <T w={on ? 700 : 500} size={13} color={on ? C.teal : C.ink}>{p}</T>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Kota */}
            <ChipInput label="Kota" placeholder="mis. Bandung, Jakarta" values={kota ? [kota] : []} onChange={(arr) => setKota(arr[arr.length - 1] || '')} />
          </Card>

          {demoMode && (
            <Card>
              <T size={13} color={C.muted} style={{ lineHeight: 19 }}>
                Matikan Mode demo di tab Profil untuk mencari dengan Langflow.
              </T>
            </Card>
          )}

          <Button
            label="Cari karier yang cocok"
            icon="briefcase"
            onPress={handleCari}
            loading={busy}
            disabled={demoMode}
            style={{ minHeight: 44 }}
          />
          <ErrorBox message={err} />
        </View>
      )}

      {!showForm && app.karier?.hasil && (
        <HasilKarier
          hasil={app.karier.hasil}
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
