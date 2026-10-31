import React, { useState } from 'react';
import { View, Text, Image, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, radius } from '../theme';

export function Logo({ size = 26 }) {
  const h = size * 1.5;
  return <Image source={require('../assets/logo-mycita.png')} style={{ height: h, width: h * 862 / 262 }} resizeMode="contain" accessibilityLabel="myCITA" />;
}

export function Button({ title, onPress, kind = 'primary', loading, disabled, style }) {
  const bg = kind === 'primary' ? colors.green : kind === 'danger' ? colors.danger : '#fff';
  const fg = kind === 'outline' ? colors.green : '#fff';
  return (
    <Pressable onPress={onPress} disabled={disabled || loading} accessibilityRole="button"
      style={({ pressed }) => [s.btn, { backgroundColor: bg, borderColor: kind === 'outline' ? colors.green : bg, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 }, style]}>
      {loading ? <ActivityIndicator color={fg} /> : <Text style={[s.btnText, { color: fg }]}>{title}</Text>}
    </Pressable>
  );
}

export function Field({ label, icon, secure, error, ...rest }) {
  const [hide, setHide] = useState(!!secure);
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={s.label}>{label}</Text>
      <View style={[s.inputWrap, error && { borderColor: colors.danger }]}>
        <Text style={s.inputIcon}>{icon}</Text>
        <TextInput {...rest} secureTextEntry={hide} placeholderTextColor="#9AA7A0" style={s.input} autoCapitalize="none" />
        {secure ? <Pressable onPress={() => setHide(!hide)} accessibilityLabel="Tampilkan atau sembunyikan kata sandi"><Text style={s.inputIcon}>{hide ? '👁' : '🙈'}</Text></Pressable> : null}
      </View>
      {error ? <Text style={s.err}>{error}</Text> : null}
    </View>
  );
}

export function Divider({ text }) {
  return (
    <View style={s.divWrap}><View style={s.line} /><Text style={s.divText}>{text}</Text><View style={s.line} /></View>
  );
}

export function SocialButton({ kind, onPress, disabled }) {
  const label = kind === 'google' ? 'Google' : 'Microsoft';
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [s.social, { opacity: pressed ? 0.8 : 1 }]} accessibilityRole="button">
      {kind === 'google' ? <Text style={s.g}>G</Text> : (
        <View style={s.ms}>{['#F25022', '#7FBA00', '#00A4EF', '#FFB900'].map((c) => <View key={c} style={[s.msCell, { backgroundColor: c }]} />)}</View>
      )}
      <Text style={s.socialText}>{label}</Text>
    </Pressable>
  );
}

export function Stepper({ step }) {
  const names = ['Buat Akun', 'Konfirmasi', 'Selesai'];
  return (
    <View style={s.stepRow}>
      {names.map((n, i) => (
        <React.Fragment key={n}>
          <View style={{ alignItems: 'center' }}>
            <View style={[s.stepDot, i + 1 <= step ? { backgroundColor: colors.green } : { backgroundColor: '#E5ECE8' }]}>
              <Text style={{ color: i + 1 <= step ? '#fff' : colors.muted, fontWeight: '700' }}>{i + 1}</Text>
            </View>
            <Text style={{ marginTop: 6, fontSize: 12, color: i + 1 === step ? colors.green : colors.muted, fontWeight: i + 1 === step ? '700' : '400' }}>{n}</Text>
          </View>
          {i < names.length - 1 ? <View style={[s.stepLine, i + 1 < step && { backgroundColor: colors.green }]} /> : null}
        </React.Fragment>
      ))}
    </View>
  );
}

export function Notice({ tone = 'info', children }) {
  const bg = tone === 'error' ? '#FFF1F2' : colors.greenSoft; const fg = tone === 'error' ? colors.dangerDark : colors.greenDark;
  return <View style={{ backgroundColor: bg, padding: 12, borderRadius: radius.sm, marginBottom: 12 }}><Text style={{ color: fg, fontSize: 13 }}>{children}</Text></View>;
}

const s = StyleSheet.create({
  btn: { height: 50, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, paddingHorizontal: 16 },
  btnText: { fontSize: 16, fontWeight: '700' },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: 12, height: 50, backgroundColor: '#fff' },
  inputIcon: { fontSize: 16, color: colors.muted, marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: colors.text, outlineStyle: 'none' },
  err: { color: colors.danger, fontSize: 12, marginTop: 4 },
  divWrap: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  line: { flex: 1, height: 1, backgroundColor: colors.border }, divText: { marginHorizontal: 10, color: colors.muted, fontSize: 13 },
  social: { flex: 1, height: 64, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', marginHorizontal: 4 },
  socialText: { fontSize: 13, color: colors.text, marginTop: 4 },
  g: { fontSize: 22, fontWeight: '800', color: '#4285F4' },
  ms: { width: 20, height: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignContent: 'space-between' },
  msCell: { width: 9, height: 9 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 24 },
  stepDot: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  stepLine: { height: 2, width: 60, backgroundColor: '#E5ECE8', marginTop: 17, marginHorizontal: 8 },
});
