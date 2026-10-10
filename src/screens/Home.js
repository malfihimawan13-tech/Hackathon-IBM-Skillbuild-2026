import React, { useState } from 'react';
import { Pressable, RefreshControl, View } from 'react-native';
import { useApp } from '../state/AppContext';
import { Card, Chip, EmptyState, ErrorBox, ScoreRing, Screen, T } from '../components/ui';
import Icon from '../components/Icon';
import { C } from '../theme';
import { cleanStatus, pct, rpShort } from '../utils/format';

function MenuTile({ title, sub, icon, onPress }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.85 : 1 }]}>
      <Card style={{ gap: 10, padding: 14 }}>
        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={21} color={C.teal} />
        </View>
        <View><T w={700} size={15}>{title}</T><T size={12} color={C.muted}>{sub}</T></View>
      </Card>
    </Pressable>
  );
}

function Stat({ label, value, tone }) {
  return (
    <Card tone={tone} style={{ flex: 1, padding: 12, gap: 2 }}>
      <T size={12} color={C.muted}>{label}</T>
      <T w={800} size={15} numberOfLines={1} adjustsFontSizeToFit>{value}</T>
    </Card>
  );
}

function Roadmap({ karier, usaha, go }) {
  const k = karier?.hasil?.rekomendasi?.[0];
  const u = usaha?.hasil?.rekomendasi?.[0];
  return (
    <Card style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon name="route" size={20} color={C.teal} />
        <T w={800} size={16} style={{ flex: 1 }}>Roadmap-mu</T>
      </View>
      <Pressable onPress={() => go('karier')} accessibilityRole="button" style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' }}><Icon name="briefcase" size={19} color={C.teal} /></View>
        <View style={{ flex: 1 }}>
          <T w={700} size={14}>{k ? k.profesi : 'Temukan arah kariermu'}</T>
          <T size={12} color={C.muted}>{k ? `Kecocokan ${k.skor_kecocokan} · perlu ${k.skill_gap_wajib.length} skill baru` : 'Cocokkan minat & skill dengan data profesi dan gaji'}</T>
        </View>
      </Pressable>
      <Pressable onPress={() => go('usaha')} accessibilityRole="button" style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: C.goldSoft, alignItems: 'center', justifyContent: 'center' }}><Icon name="store" size={19} color={C.warn} /></View>
        <View style={{ flex: 1 }}>
          <T w={700} size={14}>{u ? u.usaha : 'Jelajahi peluang usaha'}</T>
          <T size={12} color={C.muted}>{u ? `Balik modal ${u.skenario.moderat.balik_modal} (moderat)` : 'Simulasi modal, laba, dan balik modal'}</T>
        </View>
      </Pressable>
    </Card>
  );
}

export default function Home({ go, openOnboarding }) {
  const { analysis, refreshAnalysis, live, settings, karier, usaha } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState('');

  const onRefresh = async () => {
    setRefreshing(true); setErr('');
    try { await refreshAnalysis(); } catch (e) { setErr(e.message); }
    setRefreshing(false);
  };

  const d = analysis?.dashboard;
  const dd = analysis?.dana_darurat;
  const targets = analysis?.target || [];
  const firstName = (d?.nama || '').split(' ')[0];

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.teal} />}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <T w={800} size={22} color={C.teal} style={{ letterSpacing: 0.4 }}>myCITA</T>
          <T size={12} color={C.muted}>Capai Impian, Tentukan Arah</T>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Buka profil" onPress={() => go('profil')}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center' }}>
          <T w={800} size={16}>{(firstName || 'M').charAt(0).toUpperCase()}</T>
        </Pressable>
      </View>

      {!live && (
        <Pressable onPress={() => go('profil')} accessibilityRole="button">
          <Card tone="gold" style={{ flexDirection: 'row', gap: 10, alignItems: 'center', padding: 12 }}>
            <Icon name="spark" size={18} color={C.warn} />
            <T size={13} style={{ flex: 1 }}>Mode demo aktif: memakai data contoh. Ketuk untuk menghubungkan ke Langflow.</T>
          </Card>
        </Pressable>
      )}

      {!analysis ? (
        <>
          <View style={{ gap: 4, marginTop: 6 }}>
            <T w={800} size={26}>Halo!</T>
            <T size={14} color={C.muted}>Mulai dengan mengisi kondisi keuanganmu. Hanya butuh sekitar 3 menit.</T>
          </View>
          <EmptyState icon="target" title="Wujudkan impianmu dengan angka yang jelas"
            body="myCITA membantumu menentukan arah karier atau usaha, lalu menghitung kapan impianmu tercapai."
            action="Isi data keuangan" onAction={openOnboarding} />
          <Roadmap karier={karier} usaha={usaha} go={go} />
          <ErrorBox message={err} />
        </>
      ) : (
        <>
          <View style={{ gap: 2 }}>
            <T w={800} size={26} style={{ letterSpacing: -0.4 }}>Halo, {firstName}</T>
            <T size={14} color={C.muted}>Kondisi finansialmu bulan ini</T>
          </View>
          <ErrorBox message={err} onRetry={onRefresh} />

          <Pressable accessibilityRole="button" accessibilityLabel={`Skor kesehatan ${d.skor_kesehatan} dari 100, ${cleanStatus(d.status)}`} onPress={() => go('keuangan')}>
            <Card tone="teal" style={{ flexDirection: 'row', alignItems: 'center', gap: 18, borderRadius: 24, padding: 18 }}>
              <ScoreRing score={d.skor_kesehatan} />
              <View style={{ flex: 1, gap: 4 }}>
                <T size={13} color="rgba(255,255,255,0.85)">Skor kesehatan keuangan</T>
                <T w={800} size={20} color={C.white}>{cleanStatus(d.status)}</T>
                <T size={13} color="rgba(255,255,255,0.9)">Saving rate {pct(d.saving_rate_persen)}{dd ? `, dana darurat ${String(dd.cukup_untuk_bulan).replace('.', ',')} bulan` : ''}</T>
              </View>
            </Card>
          </Pressable>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Stat label="Pendapatan" value={rpShort(d.pendapatan)} />
            <Stat label="Pengeluaran" value={rpShort(d.pengeluaran)} />
            <Stat label="Sisa" value={rpShort(d.sisa)} tone="gold" />
          </View>

          <Roadmap karier={karier} usaha={usaha} go={go} />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <MenuTile title="Tujuan Saya" sub={`${targets.length} impian aktif`} icon="target" onPress={() => go('tujuan')} />
            <MenuTile title="Kondisi Keuangan" sub="Skor & rasio" icon="chart" onPress={() => go('keuangan')} />
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <MenuTile title="Atur Keuangan" sub="Hutang & alokasi" icon="wallet" onPress={() => go('keuangan', { tab: 'atur' })} />
            <MenuTile title="Cari Impian" sub="Cek harga terkini" icon="search" onPress={() => go('cari')} />
          </View>

          <Pressable accessibilityRole="button" onPress={() => go('chat')}>
            <Card tone="ink" style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="chat" size={21} color={C.ink} />
              </View>
              <View style={{ flex: 1 }}>
                <T w={700} size={15} color={C.white}>Tanya myCITA</T>
                <T size={12} color="rgba(255,255,255,0.8)">Karier, usaha, atau rencana keuanganmu</T>
              </View>
            </Card>
          </Pressable>

          {analysis.rekomendasi_utama?.[0] ? (
            <Card style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon name="spark" size={18} color={C.teal} /><T w={800} size={15} style={{ flex: 1 }}>Saran utama</T><Chip label="Prioritas" />
              </View>
              <T size={14} style={{ lineHeight: 21 }}>{analysis.rekomendasi_utama[0]}</T>
            </Card>
          ) : null}
          <T size={11} color={C.muted} style={{ textAlign: 'center' }}>
            {live ? `Terhubung ke Langflow · user: ${settings.userId}` : 'Data contoh'} · tarik ke bawah untuk memperbarui
          </T>
        </>
      )}
    </Screen>
  );
}
