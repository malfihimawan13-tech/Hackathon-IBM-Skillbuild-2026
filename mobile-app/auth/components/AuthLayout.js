import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Image, Animated, Easing, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { colors, radius } from '../theme';
import { Logo } from './ui';

// Panel kiri: satu gambar, atau beberapa gambar yang bergantian otomatis (setiap `interval` ms) dengan
// perpindahan halus (cross-fade `durasi` ms) dan penanda titik.
function Panel({ source, w, h, interval = 4000, durasi = 1400 }) {
  const list = Array.isArray(source) ? source : [source];
  const n = list.length;
  const [cur, setCur] = useState(0);
  const curRef = useRef(0);
  // Setiap gambar punya nilai transparansi sendiri (gambar pertama terlihat, lainnya tersembunyi).
  const ops = useRef(list.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))).current;
  useEffect(() => {
    if (n < 2) return undefined;
    const t = setInterval(() => {
      const old = curRef.current;
      const next = (old + 1) % n;
      curRef.current = next;
      ops[next].setValue(0);
      setCur(next);
      Animated.timing(ops[next], { toValue: 1, duration: durasi, easing: Easing.inOut(Easing.cubic), useNativeDriver: Platform.OS !== 'web' })
        .start(() => { if (curRef.current === next) ops[old].setValue(0); });
    }, interval);
    return () => clearInterval(t);
  }, [n, interval, durasi]);
  return (
    <View style={{ width: w, height: h, overflow: 'hidden' }} accessibilityLabel="myCITA">
      {list.map((src, k) => (
        <Animated.Image key={k} source={src} resizeMode="stretch"
          style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, zIndex: k === cur ? 2 : 1, opacity: ops[k] }} />
      ))}
      {n > 1 ? (
        <View style={{ position: 'absolute', zIndex: 3, left: Math.round(w * 0.075), bottom: Math.round(h * 0.022), flexDirection: 'row' }}>
          {list.map((_, k) => <View key={k} style={[s.dot, k === cur && s.dotOn]} />)}
        </View>
      ) : null}
    </View>
  );
}

// Tata letak mengikuti desain: panel kiri berisi judul + ilustrasi di bagian bawah (kartu kutipan sudah
// menjadi bagian gambar), panel kanan berisi formulir. Di HP hanya formulir yang tampil.
// heroRatio = lebar/tinggi gambar; heroBg = warna latar panel agar menyatu dengan tepi gambar.
export default function AuthLayout({ panelImage, panelRatio, title, subtitle, bullets = [], heroImage, heroRatio, heroBg = '#eaf5f8', leftFlex = 1, maxFrac = 0.76, topRight, header, boxed, below, rightMax = 0.56, formMax = 600, children, footer }) {
  const { width, height } = useWindowDimensions();
  const wide = width >= 900;
  const box = { w: width * leftFlex / (leftFlex + 1), h: height - (header ? 60 : 0) };
  const maxH = box.h * maxFrac;
  const imgH = box.w ? Math.min(maxH, box.w / heroRatio) : 0;
  const imgW = imgH * heroRatio;
  const pw = panelImage ? Math.min(width * 0.5, (height - (header ? 60 : 0)) * panelRatio) : 0;
  const left = panelImage ? (
    <Image source={panelImage} resizeMode="stretch" style={{ width: pw, height: '100%' }} accessibilityLabel="myCITA" />
  ) : (
    <View style={{ flex: leftFlex, backgroundColor: heroBg, overflow: 'hidden' }}>
      {heroImage && imgH ? <Image source={heroImage} resizeMode="stretch" style={{ position: 'absolute', bottom: 0, left: Math.max(0, (box.w - imgW) / 2), width: imgW, height: imgH }} /> : null}
      <View style={s.heroText}>
        {!header ? <Logo /> : null}
        <Text style={[s.heroTitle, header && { marginTop: 0 }]}>{title}</Text>
        <Text style={s.heroSub}>{subtitle}</Text>
        {bullets.map((b) => <View key={b} style={s.bRow}><Text style={s.bDot}>✓</Text><Text style={s.bText}>{b}</Text></View>)}
      </View>
    </View>
  );
  if (boxed && wide && panelImage) {
    const H = Math.min(height - 32, 1040);
    const lw = H * panelRatio;
    const rw = Math.max(480, Math.min(width - 32 - lw, H * rightMax));
    return (
      <View style={s.stage}>
        <View style={[s.box, { width: lw + rw, height: H }]}>
          <Panel source={panelImage} w={lw} h={H} />
          <View style={{ width: rw, height: H }}>
            {topRight ? <View style={s.topRight}>{topRight}</View> : null}
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 28, paddingTop: 64 }} keyboardShouldPersistTaps="handled">
              <View style={s.card}>{children}</View>
              {below}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {wide && header ? header : null}
      <View style={{ flex: 1, flexDirection: wide ? 'row' : 'column' }}>
        {wide ? left : null}
        <View style={{ flex: 1 }}>
        {wide && topRight ? <View style={s.topRight}>{topRight}</View> : null}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={[s.formWrap, wide && { maxWidth: formMax, padding: formMax > 600 ? 24 : 40, paddingTop: formMax > 600 ? 24 : 72 }, !wide && { padding: 20 }]} keyboardShouldPersistTaps="handled">
          {!wide ? <View style={{ alignItems: 'center', marginBottom: 16 }}><Logo size={30} /></View> : null}
          <View style={s.card}>{children}</View>
          {below}
          {!wide || !topRight ? footer : null}
        </ScrollView>
        </View>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1.5, borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.35)', marginRight: 10 },
  dotOn: { backgroundColor: colors.green, borderColor: colors.green },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: '#d8eae3' },
  box: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 22, overflow: 'hidden', shadowColor: '#0a3d27', shadowOpacity: 0.15, shadowRadius: 30, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  heroText: { padding: 32 },
  heroTitle: { fontSize: 34, fontWeight: '800', color: colors.text, marginTop: 24, lineHeight: 40 },
  heroSub: { fontSize: 15, color: colors.text, marginTop: 10, marginBottom: 14, lineHeight: 24, maxWidth: 440 },
  bRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  bDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.greenSoft, color: colors.green, textAlign: 'center', lineHeight: 28, marginRight: 12, fontWeight: '800' },
  bText: { fontSize: 15, color: colors.text },
  topRight: { position: 'absolute', top: 24, right: 28, zIndex: 5 },
  formWrap: { flexGrow: 1, justifyContent: 'center', padding: 40, paddingTop: 72, maxWidth: 600, width: '100%', alignSelf: 'center' },
  card: { backgroundColor: '#fff', borderRadius: radius.lg, padding: 24, borderWidth: 1, borderColor: colors.border },
});
