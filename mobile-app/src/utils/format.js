// Format angka rupiah gaya Indonesia.
export function rp(n) {
  const v = Math.round(Number(n) || 0);
  const s = Math.abs(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${v < 0 ? '-' : ''}Rp${s}`;
}

// Ringkas: Rp9 jt / Rp259,2 jt / Rp1,2 M / Rp500 rb
export function rpShort(n) {
  const v = Number(n) || 0;
  const a = Math.abs(v);
  const sign = v < 0 ? '-' : '';
  const dec = (x, d) => x.toFixed(d).replace('.', ',').replace(/,0+$/, '').replace(/(,\d*?)0+$/, '$1');
  if (a >= 1e9) return `${sign}Rp${dec(a / 1e9, 2)} M`;
  if (a >= 1e6) return `${sign}Rp${dec(a / 1e6, a >= 1e7 ? 1 : 2)} jt`;
  if (a >= 1e3) return `${sign}Rp${Math.round(a / 1e3)} rb`;
  return `${sign}Rp${Math.round(a)}`;
}

export function pct(n) {
  return `${(Number(n) || 0).toFixed(1).replace('.', ',').replace(/,0$/, '')}%`;
}

export function digitsOnly(s) {
  return String(s ?? '').replace(/[^0-9]/g, '');
}

export function thousands(n) {
  const d = digitsOnly(n);
  return d ? d.replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';
}

// Hapus emoji status dari backend karena UI memakai warna sendiri.
export function cleanStatus(s) {
  return String(s || '').replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim();
}

// "12/05/1998" atau "12-05-1998" -> "1998-05-12"
export function toIsoDate(s) {
  const m = String(s || '').trim().match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/);
  if (!m) return '';
  return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

export function fromIsoDate(s) {
  const m = String(s || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
}
