// Foto contoh (dari desain dan wallpaper myCITA) untuk akun contoh. Akun perusahaan/channel tetap memakai inisial.
const A = {
  budi: require('../assets/beranda/av_budi.jpg'), dewi: require('../assets/beranda/av_dewi.jpg'),
  rafi: require('../assets/beranda/av_rafi.jpg'), salsa: require('../assets/beranda/av_salsa.jpg'), rina: require('../assets/beranda/av_rina.jpg'), dini: require('../assets/beranda/av_dini.jpg'),
  m1: require('../assets/beranda/f_m1.jpg'), m2: require('../assets/beranda/f_m2.jpg'), m3: require('../assets/beranda/f_m3.jpg'), m4: require('../assets/beranda/f_m4.jpg'),
  f1: require('../assets/beranda/f_f1.jpg'), f2: require('../assets/beranda/f_f2.jpg'), f3: require('../assets/beranda/f_f3.jpg'),
};
export const FOTO = {
  'Andi Pratama': require('../assets/beranda/kb_a1.jpg'), 'Rina Oktaviani': require('../assets/beranda/kb_a2.jpg'),
  'Dewi Kartika': require('../assets/beranda/kn_dewi.jpg'), 'Rafi Ahmad': require('../assets/beranda/kn_rafi.jpg'),
  'Salsa Rahma': require('../assets/beranda/kn_salsa.jpg'), 'Ahmad Fauzan': require('../assets/beranda/kn_fauzan.jpg'),
  'Nadia Putri': require('../assets/beranda/kn_nadia.jpg'), 'Rendi Setiawan': require('../assets/beranda/kn_rendi.jpg'),
  'Monica Sari': require('../assets/beranda/kn_monica.jpg'), 'Hendra Wijaya': require('../assets/beranda/kn_hendra.jpg'),
  'Budi Hadianto': A.budi, 'Agus Setiawan': A.m2, 'Dini Maharani': A.dini,
  'Dewi K.': A.dewi, 'Rafi A.': A.rafi, 'Salsa R.': A.salsa, 'Rina Mahardika': A.rina,
  'Nadia P.': A.f2, 'Bima S.': A.m4, 'Tari W.': A.f3, 'Maya S.': A.rina,
  'Dr. Hendra W.': A.m3, 'Ratna D.': A.salsa, 'Sulaiman R.': A.m1, 'Rudi H.': A.m4,
};
const COWOK = ['Andi', 'Bayu', 'Dimas', 'Fajar', 'Indra', 'Joko', 'Oki', 'Toni', 'Umar', 'Wawan', 'Zaki'];
const CEWEK = ['Citra', 'Eka', 'Gita', 'Hana', 'Kiki', 'Lina', 'Maya', 'Nanda', 'Putri', 'Rina', 'Sari', 'Vina', 'Yuni'];
const POOL_C = [A.budi, A.rafi, A.m1, A.m2, A.m3, A.m4];
const POOL_W = [A.dewi, A.salsa, A.rina, A.f1, A.f2, A.f3];
const hash = (t) => { let h = 0; for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0; return h; };
// Akun contoh buatan (Andi M., Citra K., dst.) mendapat foto menurut nama depan; channel/perusahaan tidak.
export function fotoUntuk(nama) {
  if (!nama) return undefined;
  if (FOTO[nama]) return FOTO[nama];
  const depan = String(nama).split(' ')[0];
  if (COWOK.includes(depan)) return POOL_C[hash(nama) % POOL_C.length];
  if (CEWEK.includes(depan)) return POOL_W[hash(nama) % POOL_W.length];
  return undefined;
}
export const HERO = {
  budi: require('../assets/beranda/hero_bg.jpg'),
  agus: require('../assets/beranda/hero_agus.jpg'),
  dini: require('../assets/beranda/hero_dini.jpg'),
};
export const FOTO_REKO = {
  belajar: require('../assets/beranda/foto_kursus.jpg'),
  belajarUmum: require('../assets/beranda/foto_belajar.jpg'),
  jurusan: require('../assets/beranda/foto_jurusan.jpg'),
  mentor: require('../assets/beranda/foto_komunitas.jpg'),
  sertifikasi: require('../assets/beranda/foto_kursus.jpg'),
  karier: require('../assets/beranda/foto_lowongan.jpg'),
  komunitas: require('../assets/beranda/foto_komunitas.jpg'),
};
export const LOGO_LOWONGAN = [
  require('../assets/beranda/lw_1.jpg'), require('../assets/beranda/lw_2.jpg'), require('../assets/beranda/lw_3.jpg'),
];
