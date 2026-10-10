import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Card, IconButton, T } from './ui';
import Icon from './Icon';
import { C, F, R } from '../theme';

// Pilihan ganda berbentuk pill
export function MultiPills({ options, values, onToggle }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map((o) => {
        const on = values.includes(o);
        return (
          <Pressable key={o} accessibilityRole="checkbox" accessibilityState={{ checked: on }} onPress={() => onToggle(o)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40, paddingHorizontal: 12, borderRadius: R.pill, borderWidth: 1, borderColor: on ? C.teal : C.line, backgroundColor: on ? C.soft : C.card }}>
            {on ? <Icon name="check" size={15} color={C.teal} /> : null}
            <T w={on ? 700 : 600} size={13} color={on ? C.teal : C.ink}>{o}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

export const toggleIn = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

// Input bebas yang menjadi chip (untuk skill / minat lain)
export function ChipInput({ label, values, onChange, placeholder }) {
  const [text, setText] = useState('');
  const add = () => {
    const parts = text.split(',').map((x) => x.trim()).filter(Boolean);
    if (parts.length) onChange([...values, ...parts.filter((p) => !values.includes(p))]);
    setText('');
  };
  return (
    <View style={{ gap: 8 }}>
      {label ? <T w={700} size={13}>{label}</T> : null}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput accessibilityLabel={label || placeholder} value={text} onChangeText={setText} onSubmitEditing={add} placeholder={placeholder}
          placeholderTextColor="#8A9693" returnKeyType="done"
          style={{ flex: 1, minHeight: 48, borderRadius: R.md, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, paddingHorizontal: 14, fontFamily: F.semibold, fontSize: 15, color: C.ink }} />
        <IconButton icon="plus" label={`Tambah ${label || ''}`} filled onPress={add} />
      </View>
      {values.length ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {values.map((v) => (
            <Pressable key={v} onPress={() => onChange(values.filter((x) => x !== v))} accessibilityRole="button" accessibilityLabel={`Hapus ${v}`}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: R.pill, backgroundColor: C.soft }}>
              <T w={600} size={13} color={C.teal}>{v}</T>
              <Icon name="close" size={13} color={C.teal} />
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

// Daftar pengalaman kerja: bidang + tahun
export function ExperienceList({ items, onChange }) {
  const up = (i, patch) => onChange(items.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const inputStyle = { minHeight: 48, borderRadius: R.md, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, paddingHorizontal: 12, fontFamily: F.semibold, fontSize: 14, color: C.ink };
  return (
    <View style={{ gap: 8 }}>
      <T w={700} size={13}>Pengalaman kerja</T>
      {items.map((e, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <TextInput accessibilityLabel={`Bidang pengalaman ${i + 1}`} value={e.bidang} onChangeText={(v) => up(i, { bidang: v })}
            placeholder="mis. gudang & logistik" placeholderTextColor="#8A9693" style={[inputStyle, { flex: 1 }]} />
          <TextInput accessibilityLabel={`Lama pengalaman ${i + 1} dalam tahun`} value={String(e.tahun ?? '')} onChangeText={(v) => up(i, { tahun: v.replace(/[^0-9.]/g, '') })}
            placeholder="thn" keyboardType="decimal-pad" placeholderTextColor="#8A9693" style={[inputStyle, { width: 64, textAlign: 'center' }]} />
          <Pressable onPress={() => onChange(items.filter((_, x) => x !== i))} accessibilityRole="button" accessibilityLabel={`Hapus pengalaman ${i + 1}`} hitSlop={8}
            style={{ width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: C.ground }}>
            <Icon name="close" size={16} color={C.muted} />
          </Pressable>
        </View>
      ))}
      <Pressable onPress={() => onChange([...items, { bidang: '', tahun: '' }])} accessibilityRole="button" style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6 }}>
        <Icon name="plus" size={16} color={C.teal} /><T w={700} size={13} color={C.teal}>Tambah pengalaman</T>
      </Pressable>
    </View>
  );
}

// Tabel perbandingan: kapan tujuan tercapai sebelum vs sesudah memakai jalur karier/usaha
export function ImpactCard({ perbandingan, title = 'Dampak ke tujuanmu' }) {
  if (!perbandingan) return null;
  const before = perbandingan.sebelum?.target || {};
  const after = perbandingan.sesudah?.target || {};
  const names = Object.keys(after);
  return (
    <Card tone="gold" style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon name="target" size={20} color={C.warn} />
        <T w={800} size={15} style={{ flex: 1 }}>{title}</T>
      </View>
      {names.length === 0 ? (
        <T size={13}>Belum ada tujuan finansial. Tambahkan tujuan di menu Cari Impian untuk melihat dampaknya.</T>
      ) : (
        <>
          <View style={{ flexDirection: 'row' }}>
            <T size={12} color={C.muted} style={{ flex: 1.2 }}>Tujuan</T>
            <T w={700} size={12} color={C.muted} style={{ flex: 1 }}>Sekarang</T>
            <T w={800} size={12} color={C.teal} style={{ flex: 1 }}>Dengan jalur ini</T>
          </View>
          {names.map((n) => (
            <View key={n} style={{ flexDirection: 'row' }}>
              <T w={600} size={13} style={{ flex: 1.2 }} numberOfLines={2}>{n}</T>
              <T size={13} style={{ flex: 1 }}>{before[n] || '-'}</T>
              <T w={800} size={13} color={C.teal} style={{ flex: 1 }}>{after[n]}</T>
            </View>
          ))}
        </>
      )}
      <T size={11} color={C.muted}>Dihitung oleh mesin simulasi myCITA memakai data keuanganmu. Estimasi edukatif, bukan jaminan.</T>
    </Card>
  );
}
