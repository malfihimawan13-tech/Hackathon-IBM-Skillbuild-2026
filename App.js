import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, Pressable, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans/400Regular';
import { PlusJakartaSans_500Medium } from '@expo-google-fonts/plus-jakarta-sans/500Medium';
import { PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans/600SemiBold';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans/700Bold';
import { PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans/800ExtraBold';
import { AppProvider, DEMO_USER_IDS, useApp } from './src/state/AppContext';
import { T } from './src/components/ui';
import Icon from './src/components/Icon';
import { C } from './src/theme';
import Home from './src/screens/Home';
import Keuangan from './src/screens/Keuangan';
import Tujuan from './src/screens/Tujuan';
import Cari from './src/screens/Cari';
import Chat from './src/screens/Chat';
import Profil from './src/screens/Profil';
import Onboarding from './src/screens/Onboarding';
import Karier from './src/screens/Karier';
import Usaha from './src/screens/Usaha';
import KarirBisnis from './src/screens/KarirBisnis';
import Masuk from './src/screens/Masuk';
import Roadmap from './src/screens/Roadmap';
import Pendidikan from './src/screens/Pendidikan';
import Pengeluaran from './src/screens/Pengeluaran';

const TABS = [
  { key: 'home', label: 'Beranda', icon: 'home' },
  { key: 'karirbisnis', label: 'Karir/Bisnis', icon: 'briefcase' },
  { key: 'roadmap', label: 'Roadmap', icon: 'route' },
  { key: 'keuangan', label: 'Keuangan', icon: 'chart' },
  { key: 'chat', label: 'Tanya', icon: 'chat' },
];

function BottomNav({ active, go }) {
  const insets = useSafeAreaInsets();
  const activeTab = ['cari', 'tujuan', 'pengeluaran'].includes(active)
    ? 'keuangan'
    : ['karier', 'usaha'].includes(active)
    ? 'karirbisnis'
    : active;
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: C.white, borderTopWidth: 1, borderTopColor: C.line, flexDirection: 'row', paddingHorizontal: 6, paddingTop: 6, paddingBottom: Math.max(insets.bottom, 8) }}
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

function Root() {
  const app = useApp();
  const [route, setRoute] = useState({ name: 'home', params: null });
  const [onboarding, setOnboarding] = useState(false);
  const go = useCallback((name, params = null) => setRoute({ name, params }), []);

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

  // Tampilkan layar Masuk jika belum ada pengguna aktif
  if (!app.activeUserId) {
    return (
      <Masuk onLogin={async (uid) => {
        await app.loginAs(uid);
        setRoute({ name: 'home', params: null });
      }} />
    );
  }

  if (onboarding) {
    return <Onboarding onDone={() => { setOnboarding(false); go('home'); }} onCancel={() => setOnboarding(false)} />;
  }

  // Untuk ketiga persona contoh, lewati onboarding karena data sudah ada
  const isDemoPersona = DEMO_USER_IDS.includes(app.activeUserId);
  const props = {
    go, params: route.params,
    openOnboarding: isDemoPersona ? undefined : () => setOnboarding(true),
    onLogout: () => { setRoute({ name: 'home', params: null }); app.logout(); },
  };
  const screens = { home: Home, karirbisnis: KarirBisnis, karier: Karier, usaha: Usaha, roadmap: Roadmap, pendidikan: Pendidikan, keuangan: Keuangan, tujuan: Tujuan, cari: Cari, chat: Chat, profil: Profil, pengeluaran: Pengeluaran };
  const Screen = screens[route.name] || Home;
  return (
    <View style={{ flex: 1, backgroundColor: C.ground }}>
      <Screen key={`${route.name}-${route.params?.tab || ''}`} {...props} />
      {route.name !== 'chat' ? <BottomNav active={route.name} go={go} /> : null}
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold,
  });
  if (!fontsLoaded) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F6F5' }}><ActivityIndicator color="#0F4C47" /></View>;
  }
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <Root />
      </AppProvider>
    </SafeAreaProvider>
  );
}
