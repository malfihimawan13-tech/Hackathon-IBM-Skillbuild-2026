import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from './Icon';
import { C, F, R } from '../theme';
import { thousands, digitsOnly } from '../utils/format';

const WEIGHT = { 400: F.regular, 500: F.medium, 600: F.semibold, 700: F.bold, 800: F.extrabold };

export function T({ w = 400, size = 15, color = C.ink, style, children, ...rest }) {
  return (
    <Text style={[{ fontFamily: WEIGHT[w], fontSize: size, color, lineHeight: Math.round(size * 1.42) }, style]} {...rest}>
      {children}
    </Text>
  );
}

export function Card({ style, children, tone }) {
  const bg = tone === 'gold' ? C.goldSoft : tone === 'teal' ? C.teal : tone === 'ink' ? C.ink : C.card;
  const border = tone === 'gold' ? C.goldLine : tone ? bg : C.line;
  return <View style={[s.card, { backgroundColor: bg, borderColor: border }, style]}>{children}</View>;
}

export function Chip({ label, tone = 'teal' }) {
  const map = { teal: [C.soft, C.teal], warn: [C.warnSoft, C.warn], gold: [C.gold, C.ink], muted: [C.ground, C.muted] };
  const [bg, fg] = map[tone] || map.teal;
  return (
    <View style={[s.chip, { backgroundColor: bg }]}>
      <T w={700} size={12} color={fg}>{label}</T>
    </View>
  );
}

export function Button({ label, onPress, icon, variant = 'primary', loading, disabled, style }) {
  const v = {
    primary: { bg: C.teal, fg: C.white, border: C.teal },
    secondary: { bg: C.card, fg: C.ink, border: C.line },
    ghost: { bg: 'transparent', fg: C.teal, border: C.teal },
    danger: { bg: C.warnSoft, fg: C.warn, border: C.warnSoft },
  }[variant];
  const off = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!off, busy: !!loading }}
      onPress={off ? undefined : onPress}
      style={({ pressed }) => [s.btn, { backgroundColor: v.bg, borderColor: v.border, opacity: off ? 0.55 : pressed ? 0.85 : 1 },
        variant === 'ghost' && { borderStyle: 'dashed', borderWidth: 1.5 }, style]}
    >
      {loading ? <ActivityIndicator color={v.fg} /> : (
        <>
          {icon ? <Icon name={icon} size={18} color={v.fg} /> : null}
          <T w={800} size={15} color={v.fg}>{label}</T>
        </>
      )}
    </Pressable>
  );
}

export function IconButton({ icon, onPress, label, filled }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
      style={({ pressed }) => [s.iconBtn, filled && { backgroundColor: C.teal, borderColor: C.teal }, pressed && { opacity: 0.8 }]}>
      <Icon name={icon} size={20} color={filled ? C.white : C.ink} />
    </Pressable>
  );
}

export function Field({ label, value, onChangeText, placeholder, keyboardType, secure, hint, style, autoCapitalize, multiline }) {
  return (
    <View style={[{ gap: 6 }, style]}>
      {label ? <T w={700} size={13}>{label}</T> : null}
      <TextInput
        accessibilityLabel={label || placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8A9693"
        keyboardType={keyboardType}
        secureTextEntry={secure}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        style={[s.input, multiline && { minHeight: 80, paddingTop: 12, textAlignVertical: 'top' }]}
      />
      {hint ? <T size={12} color={C.muted}>{hint}</T> : null}
    </View>
  );
}

// Input rupiah: menyimpan angka mentah, menampilkan dengan titik ribuan.
export function MoneyField({ label, value, onChange, placeholder = '0', hint, style }) {
  return (
    <View style={[{ gap: 6 }, style]}>
      {label ? <T w={700} size={13}>{label}</T> : null}
      <View style={[s.input, { flexDirection: 'row', alignItems: 'center', gap: 6 }]}>
        <T w={600} size={15} color={C.muted}>Rp</T>
        <TextInput
          accessibilityLabel={label || 'Nominal rupiah'}
          value={thousands(value)}
          onChangeText={(t) => onChange(digitsOnly(t))}
          placeholder={placeholder}
          placeholderTextColor="#8A9693"
          keyboardType="number-pad"
          style={{ flex: 1, fontFamily: F.semibold, fontSize: 15, color: C.ink, paddingVertical: 0 }}
        />
      </View>
      {hint ? <T size={12} color={C.muted}>{hint}</T> : null}
    </View>
  );
}

export function Segmented({ options, value, onChange, style }) {
  return (
    <View style={[s.seg, style]} accessibilityRole="tablist">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable key={o.value} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => onChange(o.value)}
            style={[s.segItem, on && { backgroundColor: C.teal }]}>
            <T w={on ? 700 : 600} size={14} color={on ? C.white : C.ink}>{o.label}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Pills({ options, value, onChange, icons }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable key={o.value} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => onChange(o.value)}
            style={[s.pill, on && { backgroundColor: C.soft, borderColor: C.teal }]}>
            {icons?.[o.value] ? <Icon name={icons[o.value]} size={17} color={on ? C.teal : C.ink} /> : null}
            <T w={on ? 700 : 600} size={13} color={on ? C.teal : C.ink}>{o.label}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

export function ScoreRing({ score = 0, size = 104 }) {
  const r = 44; const c = 2 * Math.PI * r; const p = Math.max(0, Math.min(100, score)) / 100;
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 104 104">
        <Circle cx="52" cy="52" r={r} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="10" />
        <Circle cx="52" cy="52" r={r} fill="none" stroke={C.gold} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${c * p} ${c}`} transform="rotate(-90 52 52)" />
      </Svg>
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
        <T w={800} size={30} color={C.white} style={{ lineHeight: 34 }}>{score}</T>
        <T size={11} color="rgba(255,255,255,0.85)">dari 100</T>
      </View>
    </View>
  );
}

export function Bar({ ratio = 0, color = C.teal, height = 8 }) {
  const w = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
  return (
    <View style={{ height, borderRadius: R.pill, backgroundColor: C.soft, overflow: 'hidden' }}>
      <View style={{ width: w, height, borderRadius: R.pill, backgroundColor: color }} />
    </View>
  );
}

export function Screen({ children, scroll = true, refreshControl, contentStyle, bottomPad = 110 }) {
  const insets = useSafeAreaInsets();
  if (!scroll) return <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: C.ground }}>{children}</View>;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.ground }} refreshControl={refreshControl} keyboardShouldPersistTaps="handled"
      contentContainerStyle={[{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: bottomPad + insets.bottom, gap: 14 }, contentStyle]}>
      {children}
    </ScrollView>
  );
}

export function ScreenHeader({ title, onBack, right }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      {onBack ? <IconButton icon="back" label="Kembali" onPress={onBack} /> : null}
      <T w={800} size={22} style={{ flex: 1, letterSpacing: -0.2 }} accessibilityRole="header">{title}</T>
      {right}
    </View>
  );
}

export function ErrorBox({ message, onRetry }) {
  if (!message) return null;
  return (
    <Card tone="gold" style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
      <Icon name="alert" size={20} color={C.warn} />
      <View style={{ flex: 1, gap: 8 }}>
        <T size={13} style={{ lineHeight: 19 }}>{message}</T>
        {onRetry ? <Pressable onPress={onRetry} accessibilityRole="button"><T w={700} size={13} color={C.teal}>Coba lagi</T></Pressable> : null}
      </View>
    </Card>
  );
}

export function EmptyState({ icon = 'spark', title, body, action, onAction }) {
  return (
    <Card style={{ alignItems: 'center', gap: 10, paddingVertical: 28 }}>
      <View style={s.emptyIcon}><Icon name={icon} size={26} color={C.teal} /></View>
      <T w={800} size={17} style={{ textAlign: 'center' }}>{title}</T>
      {body ? <T size={14} color={C.muted} style={{ textAlign: 'center' }}>{body}</T> : null}
      {action ? <Button label={action} onPress={onAction} style={{ alignSelf: 'stretch', marginTop: 6 }} /> : null}
    </Card>
  );
}

export function KV({ k, v, strong }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
      <T size={13} color={C.muted} style={{ flex: 1 }}>{k}</T>
      <T w={strong ? 800 : 700} size={13} style={{ textAlign: 'right' }}>{v}</T>
    </View>
  );
}

// Teks dengan dukungan sederhana **tebal**, _miring_, dan butir "- ".
export function RichText({ text, color = C.ink, size = 14 }) {
  const lines = String(text || '').split('\n');
  const renderInline = (line, key) => {
    const parts = line.split(/(\*\*[^*]+\*\*|_[^_]+_)/g).filter(Boolean);
    return (
      <T key={key} size={size} color={color} style={{ lineHeight: Math.round(size * 1.55) }}>
        {parts.map((p, i) => {
          if (p.startsWith('**') && p.endsWith('**')) return <T key={i} w={800} size={size} color={color}>{p.slice(2, -2)}</T>;
          if (p.startsWith('_') && p.endsWith('_') && p.length > 2) return <T key={i} size={12} color={C.muted} style={{ fontStyle: 'italic' }}>{p.slice(1, -1)}</T>;
          return p;
        })}
      </T>
    );
  };
  return (
    <View style={{ gap: 4 }}>
      {lines.map((ln, i) => {
        const clean = ln.replace(/^#+\s*/, '');
        if (!clean.trim()) return <View key={i} style={{ height: 4 }} />;
        const bullet = clean.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
        if (bullet) {
          return (
            <View key={i} style={{ flexDirection: 'row', gap: 8, paddingLeft: 2 }}>
              <T size={size} color={C.teal} w={800}>•</T>
              <View style={{ flex: 1 }}>{renderInline(bullet[1], `b${i}`)}</View>
            </View>
          );
        }
        return renderInline(clean, i);
      })}
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: R.lg, padding: 16, gap: 10 },
  chip: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: R.pill },
  btn: { minHeight: 52, borderRadius: 16, borderWidth: 1, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  iconBtn: { width: 44, height: 44, borderRadius: 14, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center' },
  input: { minHeight: 48, borderRadius: R.md, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, paddingHorizontal: 14, fontFamily: F.semibold, fontSize: 15, color: C.ink },
  seg: { flexDirection: 'row', gap: 6, padding: 4, borderRadius: R.md, backgroundColor: C.card, borderWidth: 1, borderColor: C.line },
  segItem: { flex: 1, minHeight: 44, borderRadius: R.sm, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40, paddingHorizontal: 12, borderRadius: R.pill, borderWidth: 1, borderColor: C.line, backgroundColor: C.card },
  emptyIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' },
});
