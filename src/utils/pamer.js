// Pemeriksa keterangan postingan Komunitas. Berjalan di perangkat (tanpa LLM), cepat dan hemat kuota.
// Tujuan: feed untuk merayakan proses dan pencapaian, bukan pamer nominal atau barang.

const UANG = /(rp\.?\s?\d|\d[\d.,]*\s?(juta|jt|miliar|milyar|triliun|ribu|rb)\b|\b\d{1,3}(\.\d{3}){1,}\b|\b\d+\s?(m|k)\b(?=\s|$|[.,!]))/gi;
const PAMER = /(flexing|flex\b|pamer|mewah|branded|limited edition|sultan|crazy rich|nggak ada lawan|auto kaya)/gi;
const BARANG = /(mobil\s+(baru|mewah)|rumah\s+(baru|mewah)|iphone|macbook|rolex|vespa|moge|pajero|fortuner|alphard|bmw|mercedes)/gi;

export function cekCaption(teks) {
  const t = String(teks || '');
  const temuan = [];
  if (t.match(UANG)) temuan.push({ kode: 'uang', pesan: 'Ada nominal uang. Feed myCITA tidak menampilkan angka gaji, harga, atau saldo.' });
  if (t.match(BARANG)) temuan.push({ kode: 'barang', pesan: 'Menyebut barang atau merek. Ceritakan prosesnya, bukan barangnya.' });
  if (t.match(PAMER)) temuan.push({ kode: 'pamer', pesan: 'Nada pamer terdeteksi. Coba fokus ke apa yang membantumu dan tips untuk orang lain.' });
  return { ok: temuan.length === 0, temuan };
}

// Saran penulisan ulang: buang bagian kalimat yang memuat nominal, barang, atau nada pamer.
// Hasilnya bisa kosong (untuk kolom opsional); pengguna tetap bisa mengedit sendiri.
export function sarankanVersiNetral(teks, cadangan = '') {
  const bagian = String(teks || '').split(/(?<=[.!?,;])\s+/);
  const bersih = bagian.filter((b) => cekCaption(b).ok).join(' ')
    .replace(/[,;]\s*$/, '').replace(/\s{2,}/g, ' ').trim();
  return bersih || cadangan;
}
