// Mengemas hasil "npx expo export --platform web" menjadi SATU file HTML prototipe myCITA
// (panel penjelasan + bingkai HP berisi aplikasi asli). File bisa dibuka dengan klik dua kali, tanpa server/internet.
//
// Pakai (dari folder mobile-app):
//   npx expo export --platform web
//   node ..\prototipe-aplikasi\buat-prototipe.mjs
// Opsional, tambahkan tautan web hasil hosting:
//   node ..\prototipe-aplikasi\buat-prototipe.mjs --web https://mycita.netlify.app

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const dist = opt('--dist', join(process.cwd(), 'dist'));
const keluar = opt('--out', join(here, 'index.html'));
const apkUrl = opt('--apk', 'https://expo.dev/accounts/malfihimawan13-tech/projects/mycita/builds/6a652a90-c497-4d5b-bfa9-0646cb5bf2c1');
const webUrl = opt('--web', '');

if (!existsSync(join(dist, 'index.html'))) {
  console.error(`Folder ekspor tidak ditemukan: ${dist}\nJalankan dulu dari folder mobile-app:  npx expo export --platform web`);
  process.exit(1);
}

// 1) Ambil HTML aplikasi dan sisipkan bundle JS secara langsung
let app = readFileSync(join(dist, 'index.html'), 'utf8');
const MIME = { '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff': 'font/woff', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const dataUri = (p) => `data:${MIME[extname(p).toLowerCase()] || 'application/octet-stream'};base64,${readFileSync(p).toString('base64')}`;
let jumlahAset = 0;
app = app.replace(/<script src="([^"]+)"[^>]*><\/script>/g, (_, src) => {
  let js = readFileSync(join(dist, src.replace(/^\//, '')), 'utf8');
  // aset (font, gambar) yang dirujuk bundle → data URI agar tidak butuh server
  js = js.replace(/"(\/assets\/[^"]+)"/g, (m, p) => {
    const f = join(dist, p.replace(/^\//, ''));
    if (!existsSync(f)) return m;
    jumlahAset++;
    return JSON.stringify(dataUri(f));
  });
  js = js.split('</script').join('<\\/script').split('<!--').join('<\\!--');
  return `<script>${js}</script>`;
});
app = app.replace(/<link rel="icon"[^>]*>/, '');
if (/src="\/_expo|href="\/_expo/.test(app)) console.warn('Peringatan: masih ada rujukan /_expo yang belum disisipkan.');

// 2) Halaman pembungkus (mengikuti gaya prototipe-interaktif)
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const qrApk = existsSync(join(here, 'qr-apk.png')) ? dataUri(join(here, 'qr-apk.png')) : '';
const qrWeb = existsSync(join(here, 'qr-web.png')) ? dataUri(join(here, 'qr-web.png')) : '';
const kartuWeb = webUrl ? `<div class="qr">${qrWeb ? `<img src="${qrWeb}" alt="Kode QR versi web myCITA">` : ''}<div><b>Buka versi web di HP</b><span>Android dan iPhone, tanpa instal.</span><a href="${esc(webUrl)}" target="_blank" rel="noopener">${esc(webUrl)}</a></div></div>` : '';

const html = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>myCITA · Prototipe aplikasi</title>
<style>
:root{--bg:#E9EEEC;--ink:#14211F;--muted:#55625F;--card:#FFFFFF;--line:#D5DEDB;--accent:#0F4C47;--gold:#F2A93B}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#0E1615;--ink:#E6EEEC;--muted:#A3B3AF;--card:#17221F;--line:#2A3835;--accent:#9FE1CB}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font-family:system-ui,-apple-system,'Segoe UI',sans-serif}
.wrap{max-width:1180px;margin:0 auto;padding:24px 20px 40px;display:grid;grid-template-columns:minmax(0,1fr) 430px;gap:32px;align-items:start}
.side h1{margin:0 0 6px;font-size:28px;letter-spacing:-.02em}
.side p{margin:0 0 18px;color:var(--muted);font-size:15px;line-height:1.5}
.persona{display:flex;flex-direction:column;gap:10px;margin-bottom:18px}
.pc{padding:14px 16px;border-radius:16px;border:1px solid var(--line);background:var(--card)}
.pc b{display:block;font-size:15px}.pc span{font-size:13px;color:var(--muted)}
.btn{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:10px 16px;border-radius:999px;border:1px solid var(--accent);background:var(--accent);color:var(--bg);font:inherit;font-weight:700;cursor:pointer}
h2{font-size:17px;margin:26px 0 10px}
.qr{display:flex;gap:14px;align-items:center;padding:14px;border-radius:16px;border:1px solid var(--line);background:var(--card);margin-bottom:10px}
.qr img{width:118px;height:auto;border-radius:10px;background:#fff;flex-shrink:0}
.qr b{display:block;font-size:15px}.qr span{display:block;font-size:13px;color:var(--muted);margin:2px 0 6px}
.qr a{font-size:12px;color:var(--accent);word-break:break-all}
.hint{margin-top:18px;font-size:13px;color:var(--muted);line-height:1.5}
.phone{width:410px;height:864px;border-radius:46px;background:#14211F;padding:10px;position:sticky;top:20px}
.screen{width:390px;height:844px;border-radius:36px;overflow:hidden;background:#F4F6F5}
.screen iframe{width:100%;height:100%;border:0;display:block}
@media (max-width:900px){.wrap{grid-template-columns:1fr;padding:12px}.phone{order:-1;width:100%;max-width:410px;height:auto;margin:0 auto;position:static;padding:6px;border-radius:30px}.screen{width:100%;height:auto;aspect-ratio:390/844;border-radius:26px}}
</style>
</head>
<body>
<div class="wrap">
<div class="side">
<h1>myCITA · Prototipe aplikasi</h1>
<p>Capai Impian, Tentukan Arah. Ini aplikasi mobile myCITA yang sesungguhnya (React Native, dibangun dengan IBM Bob). Pilih pengguna di layar Masuk, lalu jelajahi Beranda, Karir/Bisnis, Roadmap, Keuangan, dan Tanya myCITA.</p>
<div class="persona">
<div class="pc"><b>Budi, 29 · Tangerang</b><span>Career switch ke Data Scientist + usaha kopi sampingan · mobil 22 th → 4 th 1 bl</span></div>
<div class="pc"><b>Agus, 38 · Bekasi</b><span>Bengkel + kelontong istri · rumah Rp600 jt 22 th → 8 th 8 bl; Rp515 jt tepat 7 th</span></div>
<div class="pc"><b>Dini, 17 · Bandung</b><span>Pelajar SMA · S1 Sistem Informasi 90, kampus UI · UGM · ITB</span></div>
</div>
<button class="btn" type="button" onclick="muatUlang()" aria-label="Kembali ke layar masuk">↺ Kembali ke layar Masuk</button>
<h2>Coba di HP</h2>
<div class="qr">${qrApk ? `<img src="${qrApk}" alt="Kode QR unduh APK myCITA">` : ''}<div><b>Pasang APK Android</b><span>Pindai kode QR atau buka tautan di HP Android, lalu nyalakan Mode demo.</span><a href="${esc(apkUrl)}" target="_blank" rel="noopener">${esc(apkUrl)}</a></div></div>
${kartuWeb}
<p class="hint">Prototipe ini berjalan dalam Mode demo: semua angka adalah hasil perhitungan Langflow yang direkam, sehingga bisa dicoba tanpa server dan tanpa internet. Untuk mode Langflow langsung, jalankan flow di folder langflow/ lalu isi alamat dan API key di Profil → Pengaturan pengembang. Estimasi edukatif, bukan nasihat investasi.</p>
</div>
<div class="phone"><div class="screen"><iframe id="app" title="Aplikasi myCITA" srcdoc="${esc(app)}"></iframe></div></div>
</div>
<script>
function muatUlang(){var f=document.getElementById('app');try{f.contentWindow.localStorage.clear()}catch(e){}f.srcdoc=f.srcdoc;}
</script>
</body>
</html>`;

writeFileSync(keluar, html, 'utf8');
console.log(`Selesai: ${keluar}`);
console.log(`Ukuran: ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB · aset disisipkan: ${jumlahAset}`);
