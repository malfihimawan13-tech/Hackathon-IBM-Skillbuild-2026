import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Platform, Pressable, ScrollView, TextInput, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans/400Regular';
import { PlusJakartaSans_500Medium } from '@expo-google-fonts/plus-jakarta-sans/500Medium';
import { PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans/600SemiBold';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans/700Bold';
import { PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans/800ExtraBold';
import { AppProvider, DEMO_USER_IDS, useApp } from './src/state/AppContext';
import { AuthProvider, AuthGate, LogoutConfirm, useAuth } from './auth';
import { T } from './src/components/ui';
import Icon from './src/components/Icon';
import { C, TemaCtx, setTema } from './src/theme';
import { ShellCtx } from './src/components/ui';
import { SisiProfil } from './src/components/Sisi';
import { TopBar, PanelKiri, PanelKanan } from './src/components/Shell';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './src/screens/Home';
import Dashboard from './src/components/DashboardBaru';
import Keuangan from './src/screens/Keuangan';
import Tujuan from './src/screens/Tujuan';
import Cari from './src/screens/Cari';
import Chat from './src/screens/Chat';
import Profil from './src/screens/Profil';
import Onboarding from './src/screens/Onboarding';
import Karier from './src/screens/Karier';
import Usaha from './src/screens/Usaha';
import KarirBisnis from './src/components/KarirBisnisBaru';
import Roadmap from './src/screens/Roadmap';
import Pendidikan from './src/screens/Pendidikan';
import Komunitas from './src/screens/Komunitas';
import Dock from './src/components/Dock';
import { Avatar, ProfilCtx } from './src/components/Feed';
import { profilPengguna } from './src/components/Sisi';
import Sertifikasi from './src/screens/Sertifikasi';
import Koneksi from './src/screens/Koneksi';
import KoneksiBaru from './src/components/KoneksiBaru';
import KerjaBaru from './src/components/KerjaBaru';
import BisnisBaru from './src/components/BisnisBaru';
import BelajarBaru from './src/components/BelajarBaru';
import SertifBaru from './src/components/SertifBaru';
import KomunitasBaru from './src/components/KomunitasBaru';
import KompetisiBaru from './src/components/KompetisiBaru';
import EventHalaman from './src/components/EventBaru';
import ProfilAkun from './src/screens/ProfilAkun';
import Notifikasi, { ITEM as NOTIF } from './src/screens/Notifikasi';
import Bantuan, { FAQ } from './src/screens/Bantuan';
import Pengeluaran from './src/screens/Pengeluaran';
import Investasi from './src/components/InvestasiBaru';
import TambahKarir from './src/screens/TambahKarir';
import TambahBisnis from './src/screens/TambahBisnis';

const TABS = [
  { key: 'home', label: 'Beranda', icon: 'home' },
  { key: 'karirbisnis', label: 'Karir/Bisnis', icon: 'briefcase' },
  { key: 'roadmap', label: 'Roadmap', icon: 'route' },
  { key: 'keuangan', label: 'Keuangan', icon: 'chart' },
  { key: 'komunitas', label: 'Komunitas', icon: 'users' },
];

function tabAktif(active) {
  return ['cari', 'tujuan', 'pengeluaran'].includes(active)
    ? 'keuangan'
    : ['karier', 'usaha', 'tambahkarir', 'tambahbisnis'].includes(active)
    ? 'karirbisnis'
    : active;
}

const TINGGI_NAV = 60;

// Kotak kecil di bawah bar atas (seperti dropdown), menutup jika diketuk di luar.
function PanelNav({ panel, setPanel, go, uid, onLogout }) {
  const { width } = useWindowDimensions();
  if (!panel) return null;
  const p = profilPengguna(uid);
  const kanan = Math.max(12, (width - 1490) / 2 + 20);
  const baris = (ikon, teks, aksi) => (
    <Pressable key={teks} accessibilityRole="button" onPress={aksi} style={({ hovered }) => ({ flexDirection: 'row', gap: 12, alignItems: 'center', paddingHorizontal: 14, minHeight: 46, backgroundColor: hovered ? C.ground : 'transparent' })}>
      <Icon name={ikon} size={19} color={C.teal2} /><T w={700} size={13}>{teks}</T>
    </Pressable>
  );
  return (
    <>
      <Pressable accessibilityLabel="Tutup" onPress={() => setPanel(null)} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 50 }} />
      <View style={{ position: 'absolute', top: TINGGI_NAV + 2, right: kanan, width: 340, maxHeight: 460, zIndex: 60, backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.line, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 14 }}>
        {panel === 'notif' ? (
          <ScrollView>
            <T w={800} size={15} style={{ padding: 14, paddingBottom: 6 }}>Notifikasi</T>
            <T size={11} color={C.muted} style={{ paddingHorizontal: 14, paddingBottom: 6 }}>Contoh untuk demo</T>
            {NOTIF.map((n) => (
              <View key={n.t} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.line }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' }}><Icon name={n.i} size={18} color={C.teal2} /></View>
                <View style={{ flex: 1 }}><T w={700} size={12}>{n.t}</T><T size={11} color={C.muted}>{n.w} lalu</T></View>
              </View>
            ))}
          </ScrollView>
        ) : null}
        {panel === 'bantu' ? (
          <ScrollView>
            <T w={800} size={15} style={{ padding: 14, paddingBottom: 6 }}>Bantuan</T>
            {FAQ.map(([q, a]) => (
              <View key={q} style={{ paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.line, gap: 2 }}>
                <T w={800} size={12}>{q}</T><T size={12} color={C.muted}>{a}</T>
              </View>
            ))}
            <View style={{ padding: 14 }}><Pressable accessibilityRole="button" onPress={() => { setPanel(null); go('chat'); }} style={{ minHeight: 44, borderRadius: 12, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center' }}><T w={800} size={13} color={C.white}>Tanya Agen AI</T></Pressable></View>
          </ScrollView>
        ) : null}
        {panel === 'profil' ? (
          <View>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', padding: 14 }}>
              <Avatar nama={p.nama} warna={C.gold} size={46} />
              <View style={{ flex: 1 }}><T w={800} size={14}>{p.nama}</T><T size={12} color={C.muted}>{p.kerja}</T><T size={11} color={C.muted}>{p.lokasi}</T></View>
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: C.line }}>
              {baris('user', 'Lihat profil', () => { setPanel(null); go('profil'); })}
              {baris('refresh', 'Ganti pengguna / keluar', () => { setPanel(null); onLogout(); })}
            </View>
          </View>
        ) : null}
      </View>
    </>
  );
}

function BottomNav({ active, go }) {
  const insets = useSafeAreaInsets();
  const activeTab = tabAktif(active);
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.line, flexDirection: 'row', paddingHorizontal: 6, paddingTop: 6, paddingBottom: Math.max(insets.bottom, 8) }}
      accessibilityRole="tablist">
      {TABS.map((t) => {
        const on = t.key === activeTab;
        return (
          <Pressable key={t.key} onPress={() => go(t.key)} accessibilityRole="tab" accessibilityState={{ selected: on }} accessibilityLabel={t.label}
            style={{ flex: 1, alignItems: 'center', gap: 3, minHeight: 50, justifyContent: 'center' }}>
            <View style={{ paddingHorizontal: 14, paddingVertical: 4, borderRadius: 99, backgroundColor: on ? C.soft : 'transparent' }}>
              <Icon name={t.icon} size={22} color={on ? C.teal : C.muted} />
            </View>
            <T w={on ? 700 : 500} size={11} color={on ? C.teal : C.muted}>{t.label}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

let ROUTE_TERAKHIR = { name: 'home', params: null }; // supaya ganti tema tidak membuang halaman aktif

function Root() {
  const app = useApp();
  const { userId: authUserId, signOut: authSignOut } = useAuth();
  const [route, setRouteRaw] = useState(ROUTE_TERAKHIR);
  const setRoute = useCallback((r) => { ROUTE_TERAKHIR = r; setRouteRaw(r); }, []);
  const [onboarding, setOnboarding] = useState(false);
  const [panel, setPanel] = useState(null);
  const [dock, setDock] = useState({ ai: false, pesan: false });
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [kiriSembunyi, setKiriSembunyi] = useState(false);
  const [laci, setLaci] = useState(false);
  const { tema, ganti } = useContext(TemaCtx);
  const go = useCallback((name, params = null) => { if (name === 'pesan') { setDock({ ai: false, pesan: true, kepada: params?.kepada }); return; } if (name === 'chat') { setDock({ ai: true, pesan: false }); return; } setRoute({ name, params }); }, []);
  const { width } = useWindowDimensions();
  const lebar = width >= 900;

  // Sinkronisasi userId dari AuthProvider ke AppContext.
  // Tunggu app.ready (data tersimpan selesai dimuat), kalau tidak, akun lama (mis. Agus) menimpa akun yang baru masuk.
  const sudahSinkron = useRef(null);
  useEffect(() => {
    if (!app.ready || !authUserId) return;
    if (sudahSinkron.current === authUserId && app.activeUserId === authUserId) return;
    sudahSinkron.current = authUserId;
    app.loginAs(authUserId).then(() => setRoute({ name: 'home', params: null })).catch(() => {});
  }, [authUserId, app.ready, app.activeUserId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (onboarding) { setOnboarding(false); return true; }
      if (route.name !== 'home') { go('home'); return true; }
      return false;
    });
    return () => sub.remove();
  }, [route.name, onboarding, go]);

  if (!app.ready) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.ground }}><ActivityIndicator color={C.teal} /></View>;
  }

  if (onboarding) {
    return <Onboarding onDone={() => { setOnboarding(false); go('home'); }} onCancel={() => setOnboarding(false)} />;
  }

  // Untuk ketiga persona contoh, lewati onboarding karena data sudah ada
  const isDemoPersona = DEMO_USER_IDS.includes(app.activeUserId);
  const handleLogout = () => setLogoutVisible(true);
  const props = {
    go, params: route.params,
    openOnboarding: isDemoPersona ? undefined : () => setOnboarding(true),
    onLogout: handleLogout,
  };
  const screens = { home: Home, karirbisnis: KarirBisnis, karier: Karier, usaha: Usaha, roadmap: Roadmap, pendidikan: Pendidikan, keuangan: Keuangan, tujuan: Tujuan, cari: Cari, chat: Chat, komunitas: Komunitas, sertifikasi: Sertifikasi, koneksi: KoneksiBaru, kerja: KerjaBaru, bisnis: BisnisBaru, belajar: BelajarBaru, sertif: SertifBaru, komunitas2: KomunitasBaru, kompetisi: KompetisiBaru, eventhal: EventHalaman, mykoneksi: Koneksi, profilakun: ProfilAkun, notifikasi: Notifikasi, bantuan: Bantuan, dashboard: Dashboard, profil: Profil, pengeluaran: Pengeluaran, tambahkarir: TambahKarir, tambahbisnis: TambahBisnis, investasi: Investasi };
  const Screen = screens[route.name] || Home;
  const kiriMuat = width >= 1180;
  const menuKiri = <PanelKiri uid={app.activeUserId} go={go} halaman={route.name} onPilih={() => setLaci(false)} />;
  const shell = { kiri: kiriMuat && !kiriSembunyi ? menuKiri : null, kanan: <PanelKanan uid={app.activeUserId} go={go} halaman={route.name} /> };
  return (
    <View style={{ flex: 1, backgroundColor: C.ground }}>
      {lebar ? <TopBar go={go} uid={app.activeUserId} panel={panel} setPanel={setPanel} tema={tema} gantiTema={ganti}
        onMenu={() => { setPanel(null); if (kiriMuat) setKiriSembunyi((v) => !v); else setLaci((v) => !v); }} /> : null}
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, width: '100%' }}>
          <ProfilCtx.Provider value={(k) => go('profilakun', { key: k })}><ShellCtx.Provider value={lebar ? shell : null}>
            <Screen key={`${route.name}-${route.params?.tab || ''}-${route.params?.postId || ''}-${route.params?.key || ''}`} {...props} />
          </ShellCtx.Provider></ProfilCtx.Provider>
        </View>
      </View>
      {lebar && !kiriMuat && laci ? (
        <>
          <Pressable accessibilityLabel="Tutup menu" onPress={() => setLaci(false)} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 50, backgroundColor: 'rgba(0,0,0,0.25)' }} />
          <ScrollView style={{ position: 'absolute', top: TINGGI_NAV + 6, left: 12, width: 300, maxHeight: '85%', zIndex: 60 }}>{menuKiri}</ScrollView>
        </>
      ) : null}
      {lebar ? <PanelNav panel={panel} setPanel={setPanel} go={go} uid={app.activeUserId} onLogout={props.onLogout} /> : null}
      {!lebar ? <BottomNav active={route.name} go={go} /> : null}
      <Dock open={dock} setOpen={setDock} lebar={lebar} adaMenuBawah={!lebar} />
      <LogoutConfirm
        visible={logoutVisible}
        onCancel={() => setLogoutVisible(false)}
        onDone={() => { setLogoutVisible(false); setRoute({ name: 'home', params: null }); app.logout(); authSignOut(); }}
      />
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold,
  });
  useEffect(() => {
    // Web: halaman tidak boleh punya scroll bar sendiri; hanya area isi yang bergulir (cegah scroll bar ganda).
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const st = document.createElement('style');
      st.textContent = 'html,body{height:100%;margin:0;overflow:hidden} #root{height:100%;overflow:hidden} [data-cita="scroll"]{overflow-y:scroll !important} [data-cita="sisi"]{scrollbar-width:none} [data-cita="sisi"]::-webkit-scrollbar{display:none}';
      document.head.appendChild(st);
      return () => { try { document.head.removeChild(st); } catch (e) { /* abaikan */ } };
    }
    return undefined;
  }, []);
  const [tema, setTemaState] = useState('terang');
  useEffect(() => { (async () => { try { const t = await AsyncStorage.getItem('cita:tema'); if (t) setTemaState(t); } catch (e) { /* abaikan */ } })(); }, []);
  const ganti = useCallback((t) => { setTemaState(t); try { AsyncStorage.setItem('cita:tema', t); } catch (e) { /* abaikan */ } }, []);
  setTema(tema);
  if (!fontsLoaded) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F6F5' }}><ActivityIndicator color="#0F4C47" /></View>;
  }
  return (
    <TemaCtx.Provider value={{ tema, ganti }}>
      <SafeAreaProvider>
        <AuthProvider>
          <AuthGate>
            <AppProvider>
              <StatusBar style={tema === 'gelap' ? 'light' : 'dark'} />
              <Root key={tema} />
            </AppProvider>
          </AuthGate>
        </AuthProvider>
      </SafeAreaProvider>
    </TemaCtx.Provider>
  );
}
