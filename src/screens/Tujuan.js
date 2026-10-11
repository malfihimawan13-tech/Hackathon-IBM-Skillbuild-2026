import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { useApp } from '../state/AppContext';
import { Button, Card, Chip, EmptyState, ErrorBox, IconButton, KV, MoneyField, Screen, ScreenHeader, T } from '../components/ui';
import Icon, { iconForCategory } from '../components/Icon';
import { C } from '../theme';
import { rpShort } from '../utils/format';

const STATUS = {
  realistis: ['Realistis', 'teal'],
  realistis_dengan_kredit: ['Realistis dengan kredit', 'teal'],
  perlu_penyesuaian: ['Perlu penyesuaian', 'warn'],
  tanpa_tenggat: ['Tanpa tenggat', 'muted'],
  perlu_harga: ['Perlu harga', 'warn'],
};

function OptionCard({ title, children, ok, okText, badText }) {
  return (
    <Card style={{ gap: 8, padding: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <T w={800} size={15} style={{ flex: 1 }}>{title}</T>
        <Chip label={ok ? okText : badText} tone={ok ? 'teal' : 'warn'} />
      </View>
      {children}
    </Card>
  );
}

function Kredit({ b, label }) {
  if (!b) return null;
  const tenor = b.pilihan_tenor || [];
  // Jika tenor_aman_terpendek null, berarti semua opsi melebihi batas aman cicilan
  const safe = !!b.tenor_aman_terpendek;
  const best = safe
    ? tenor.find((o) => o.tenor_tahun === b.tenor_aman_terpendek) || tenor[tenor.length - 1]
    : tenor[tenor.length - 1]; // tampilkan tenor terpanjang sebagai contoh terbaik yang ada
  return (
    <OptionCard title={`${label} DP ${Math.round(b.dp_persen)}%`} ok={safe} okText="Aman" badText="Belum aman">
      <KV k={`DP ${rpShort(b.dp)} terkumpul dalam`} v={b.waktu_kumpulkan_dp} />
      {tenor.map((o) => (
        <KV key={o.tenor_tahun} k={`Cicilan ${o.tenor_tahun} tahun (${String(o.rasio_cicilan_setelah_kredit_persen).replace('.', ',')}% penghasilan)`}
          v={`${rpShort(o.cicilan_bulanan)}/bln`} strong={o === best} />
      ))}
      {best ? <T size={12} color={C.muted}>Total bunga tenor {best.tenor_tahun} tahun: {rpShort(best.total_bunga)} · bunga {String(b.bunga_tahunan_persen).replace('.', ',')}%/thn</T> : null}
      {!safe ? <T size={12} color={C.warn}>Semua pilihan tenor melebihi batas aman cicilan 30% penghasilan.</T> : null}
    </OptionCard>
  );
}

export default function Tujuan({ go }) {
  const app = useApp();
  const targets = app.analysis?.target || [];
  const [sel, setSel] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [inc, setInc] = useState('');
  const [hemat, setHemat] = useState('');
  const [sim, setSim] = useState(null);
  const [simBusy, setSimBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Muat data dari flow 4 saat membuka layar (mode live)
  useEffect(() => {
    if (app.live && !app.analysis) {
      setRefreshing(true);
      app.refreshAnalysis().catch((e) => setErr(e.message)).finally(() => setRefreshing(false));
    }
  }, []);

  useEffect(() => { if (sel >= targets.length) setSel(0); }, [targets.length, sel]);
  const t = targets[sel];

  const remove = () => {
    Alert.alert('Hapus tujuan?', `"${t.nama}" akan dihapus dari rencanamu.`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: async () => {
        setBusy(true); setErr('');
        try { await app.removeTarget(t.nama); } catch (e) { setErr(e.message); }
        setBusy(false);
      } },
    ]);
  };

  const runSim = async () => {
    setSimBusy(true); setErr(''); setSim(null);
    try {
      const simulasi = {};
      if (Number(inc)) simulasi.perubahan_penghasilan = Number(inc);
      if (Number(hemat)) simulasi.perubahan_keinginan = -Number(hemat);
      if (!Object.keys(simulasi).length) throw new Error('Isi tambahan penghasilan atau penghematan dulu.');
      setSim(await app.whatIf(simulasi));
    } catch (e) { setErr(e.message); }
    setSimBusy(false);
  };

  return (
    <Screen>
      <ScreenHeader title="Tujuan Saya" onBack={() => go('home')} right={<IconButton icon="plus" label="Tambah tujuan" filled onPress={() => go('cari')} />} />
      {refreshing ? (
        <EmptyState icon="target" title="Memuat data…" body="Mengambil data tujuan dari Langflow." />
      ) : !app.analysis ? (
        <EmptyState icon="target" title="Belum ada data" body="Isi data keuanganmu dulu dari beranda." action="Ke beranda" onAction={() => go('home')} />
      ) : targets.length === 0 ? (
        <EmptyState icon="target" title="Belum ada impian" body="Tambahkan rumah, kendaraan, menikah, atau tujuan lain untuk melihat berapa lama tercapai." action="Cari impian" onAction={() => go('cari')} />
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {targets.map((x, i) => {
              const on = i === sel;
              return (
                <Pressable key={x.nama} onPress={() => setSel(i)} accessibilityRole="tab" accessibilityState={{ selected: on }}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40, paddingHorizontal: 14, borderRadius: 99, backgroundColor: on ? C.ink : C.card, borderWidth: 1, borderColor: on ? C.ink : C.line }}>
                  <Icon name={iconForCategory(x.kategori)} size={18} color={on ? C.white : C.ink} />
                  <T w={on ? 700 : 600} size={13} color={on ? C.white : C.ink}>{x.nama}</T>
                </Pressable>
              );
            })}
          </ScrollView>

          <Card tone="teal" style={{ gap: 8, borderRadius: 22 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <T size={13} color="rgba(255,255,255,0.85)">Harga saat ini</T>
              <Chip label={(STATUS[t.status] || [t.status])[0]} tone="gold" />
            </View>
            <T w={800} size={28} color={C.white} style={{ lineHeight: 34 }}>{t.harga_saat_ini ? rpShort(t.harga_saat_ini) : 'Belum diisi'}</T>
            <T size={12} color="rgba(255,255,255,0.85)">
              {t.sumber_harga ? `Sumber harga: ${t.sumber_harga.replace(/^referensi:\s*/, '')}. ` : ''}{t.tenggat ? `Tenggat ${t.tenggat}. ` : ''}Harga naik ±{String(t.kenaikan_harga_per_tahun_persen).replace('.', ',')}%/tahun.
            </T>
          </Card>

          {t.status === 'perlu_harga' ? (
            <ErrorBox message="Harga tujuan ini belum diketahui. Hapus lalu tambahkan lagi dengan harga yang kamu ketahui." />
          ) : (
            <>
              <OptionCard title="Menabung" ok={t.opsi_a_menabung?.tercapai_sesuai_tenggat ?? !!t.opsi_a_menabung?.waktu_tercapai_bulan}
                okText="Tepat waktu" badText={t.tenggat_bulan ? 'Lewat tenggat' : 'Lama'}>
                <KV k="Tercapai dalam" v={t.opsi_a_menabung.waktu_tercapai} strong />
                {t.opsi_a_menabung.perkiraan_harga_saat_tercapai ? <KV k="Perkiraan harga saat itu" v={rpShort(t.opsi_a_menabung.perkiraan_harga_saat_tercapai)} /> : null}
                <KV k="Jika hanya fokus ke tujuan ini" v={t.opsi_a_menabung.jika_hanya_fokus_target_ini} />
              </OptionCard>
              <Kredit b={t.opsi_b_kredit} label="Kredit" />
              <Kredit b={t.opsi_c_kombinasi} label="Kombinasi" />
              {t.catatan_kredit ? <T size={12} color={C.muted}>{t.catatan_kredit}</T> : null}
              {t.catatan_subsidi ? <T size={12} color={C.muted}>{t.catatan_subsidi}</T> : null}
              {t.alternatif ? (
                <Card tone="gold" style={{ gap: 6 }}>
                  <T w={800} size={14}>Agar tercapai dalam {t.tenggat}</T>
                  {t.alternatif.tambahan_tabungan_per_bulan_agar_tepat_waktu ? <T size={13}>• Tambah tabungan atau penghasilan ±{rpShort(t.alternatif.tambahan_tabungan_per_bulan_agar_tepat_waktu)}/bulan</T> : null}
                  {t.alternatif.harga_maksimal_terjangkau_sesuai_tenggat ? <T size={13}>• Turunkan budget ke ±{rpShort(t.alternatif.harga_maksimal_terjangkau_sesuai_tenggat)}</T> : null}
                  <T size={13}>• Perpanjang tenggat menjadi {t.alternatif.perpanjang_tenggat_menjadi}</T>
                  {t.alternatif.catatan ? <T size={12} color={C.muted}>{t.alternatif.catatan}</T> : null}
                </Card>
              ) : null}
            </>
          )}
          <Button label="Hapus tujuan ini" icon="trash" variant="danger" onPress={remove} loading={busy} />

          <Card style={{ gap: 12, marginTop: 4 }}>
            <T w={800} size={16}>Bagaimana kalau…</T>
            <T size={13} color={C.muted}>Coba skenario tanpa mengubah data tersimpan.</T>
            <MoneyField label="Tambahan penghasilan per bulan" value={inc} onChange={setInc} />
            <MoneyField label="Hemat pengeluaran keinginan per bulan" value={hemat} onChange={setHemat} />
            <Button label="Hitung skenario" icon="refresh" onPress={runSim} loading={simBusy} />
            {sim?.perbandingan ? (
              <View style={{ gap: 8 }}>
                <View style={{ flexDirection: 'row' }}>
                  <T size={12} color={C.muted} style={{ flex: 1.3 }} />
                  <T w={700} size={12} color={C.muted} style={{ flex: 1 }}>Sebelum</T>
                  <T w={800} size={12} color={C.teal} style={{ flex: 1 }}>Sesudah</T>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <T size={13} color={C.muted} style={{ flex: 1.3 }}>Sisa/bulan</T>
                  <T w={700} size={13} style={{ flex: 1 }}>{rpShort(sim.perbandingan.sebelum.sisa)}</T>
                  <T w={800} size={13} color={C.teal} style={{ flex: 1 }}>{rpShort(sim.perbandingan.sesudah.sisa)}</T>
                </View>
                {Object.keys(sim.perbandingan.sesudah.target || {}).map((k) => (
                  <View key={k} style={{ flexDirection: 'row' }}>
                    <T size={13} color={C.muted} style={{ flex: 1.3 }} numberOfLines={2}>{k}</T>
                    <T w={700} size={13} style={{ flex: 1 }}>{sim.perbandingan.sebelum.target[k]}</T>
                    <T w={800} size={13} color={C.teal} style={{ flex: 1 }}>{sim.perbandingan.sesudah.target[k]}</T>
                  </View>
                ))}
                {!app.live ? <T size={11} color={C.muted}>Mode demo menampilkan contoh skenario gaji +Rp2 jt dan hemat Rp300 rb.</T> : null}
              </View>
            ) : null}
          </Card>
          <ErrorBox message={err} />
        </>
      )}
    </Screen>
  );
}
