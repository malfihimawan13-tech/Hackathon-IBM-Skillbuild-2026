#!/usr/bin/env python3
"""myCITA - Pemeriksa Fidelitas Narasi.
Memeriksa: apakah setiap angka di jawaban AI berasal dari keluaran alat (mesin Python)?
Pakai:  python3 cek_fidelitas.py keluaran_alat.json jawaban.txt
        (keluaran_alat.json = satu/lebih JSON hasil tool, digabung; jawaban.txt = teks jawaban AI)
Hasil: tiap angka -> COCOK (ada di keluaran), TURUNAN (selisih/jumlah dua angka keluaran), atau TIDAK DITEMUKAN.
"""
import json, re, sys, bisect

SATUAN = {"miliar": 1e9, "milyar": 1e9, "m": 1e9, "juta": 1e6, "jt": 1e6, "ribu": 1e3, "rb": 1e3, "": 1}

def _angka(s, ada_satuan):
    """Parse angka gaya Indonesia. Return (nilai, jumlah_desimal)."""
    s = s.strip(".,")
    if ada_satuan:
        if re.fullmatch(r"\d{1,3}(\.\d{3})+", s):            # 1.250 -> ribuan
            return float(s.replace(".", "")), 0
        if "," in s:
            a, b = s.split(",", 1); return float(a.replace(".", "") + "." + b), len(b)
        if "." in s:
            a, b = s.split(".", 1); return float(a + "." + b), len(b)
        return float(s), 0
    if re.fullmatch(r"\d{1,3}(\.\d{3})+", s): return float(s.replace(".", "")), 0
    if re.fullmatch(r"\d{1,3}(,\d{3})+", s): return float(s.replace(",", "")), 0
    if "," in s:
        a, b = s.split(",", 1); return float(a + "." + b), len(b)
    if "." in s:
        a, b = s.split(".", 1); return float(a + "." + b), len(b)
    return float(s), 0

def ekstrak(teks):
    """Return daftar (label, nilai, toleransi, tipe) dari sebuah teks. tipe: rp | bln | pct | lain"""
    out, t = [], teks
    def ambil(pat, fn, flags=re.I):
        nonlocal t
        for m in list(re.finditer(pat, t, flags)):
            r = fn(m)
            if r: out.append(r)
        t = re.sub(pat, " ", t, flags=flags)
    # rupiah / nominal dengan satuan
    def rp(m):
        sat = (m.group("sat") or "").lower()
        v, d = _angka(m.group("n"), bool(sat))
        mult = SATUAN.get(sat, 1)
        return (m.group(0).strip(), v * mult, 0.5 * 10 ** (-d) * mult if (sat or d) else 0.5, 'rp')
    ambil(r"(?:Rp\.?\s*)?(?P<n>\d[\d.,]*)\s*(?P<sat>miliar|milyar|juta|jt|ribu)\b", rp)
    ambil(r"Rp\.?\s*(?P<n>\d[\d.,]*)(?P<sat>)", rp)
    # durasi: X tahun Y bulan / X bulan  -> total bulan
    def dur(m):
        th = int(m.group("th") or 0); bl, d = _angka(m.group("bl") or "0", False)
        return (m.group(0).strip(), th * 12 + bl, 0.5 * 10 ** (-d), 'bln')
    ambil(r"(?:(?P<th>\d+)\s*tahun)?\s*(?:(?P<bl>\d+(?:[.,]\d+)?)\s*bulan)", dur)
    ambil(r"(?P<th>\d+)\s*tahun(?P<bl>)", dur)
    # persen
    def pc(m):
        v, d = _angka(m.group(1), False); return (m.group(0).strip(), v, 0.5 * 10 ** (-d), 'pct')
    ambil(r"(\d+(?:[.,]\d+)?)\s*%", pc)
    # penomoran daftar & tahun kalender dibuang
    t = re.sub(r"(?m)^\s*\d+[.)]\s", " ", t)
    t = re.sub(r"\b20[0-9]{2}\b", " ", t)
    for m in re.finditer(r"(?<![\w.])\d+(?:[.,]\d+)?(?![\w])", t):
        v, d = _angka(m.group(0), False)
        if v == int(v) and v <= 10 and d == 0: continue    # angka kecil: 'tiga', 'pilihan 2', dst
        out.append((m.group(0), v, 0.5 * 10 ** (-d), 'lain'))
    return out

def kumpulkan_alat(obj):
    """Kumpulkan nilai angka keluaran alat, dikelompokkan per tipe."""
    T = {"rp": set(), "bln": set(), "pct": set(), "lain": set()}
    def jalan(x, kunci=""):
        if isinstance(x, bool) or x is None: return
        if isinstance(x, (int, float)):
            v = float(x); k = kunci.lower()
            if "bulan" in k or "bln" in k: T["bln"].add(v)
            elif "persen" in k or "rate" in k or "pct" in k: T["pct"].add(v)
            elif abs(v) >= 1000: T["rp"].add(v)
            T["lain"].add(v)
        elif isinstance(x, str):
            for _, v, _, tp in ekstrak(x): T[tp].add(float(v)); T["lain"].add(float(v))
        elif isinstance(x, dict):
            for k, v in x.items(): jalan(v, str(k))
        elif isinstance(x, list):
            for v in x: jalan(v, kunci)
    jalan(obj)
    return {k: sorted(v) for k, v in T.items()}

KATA_SELISIH = re.compile(r"lebih (cepat|lambat|lama|singkat|hemat|besar|kecil|banyak|sedikit)|selisih|hemat|menghemat|bertambah|berkurang|naik|turun|total|jumlah|bedanya|percepat", re.I)
def _konteks_selisih(jawaban, label):
    """Angka turunan hanya dibolehkan bila kalimatnya jelas menyebut selisih/total."""
    for baris in jawaban.splitlines():
        if label in baris and KATA_SELISIH.search(baris): return True
    return False

def periksa(alat_obj, jawaban):
    T = kumpulkan_alat(alat_obj)
    def ada(daftar, x, tol):
        i = bisect.bisect_left(daftar, x - tol - 1e-9)
        return i < len(daftar) and daftar[i] <= x + tol + 1e-9
    hasil = []
    for label, v, tol, tp in ekstrak(jawaban):
        if tp == "rp":   pool = [T["rp"]]
        elif tp == "bln": pool = [T["bln"]]
        elif tp == "pct": pool = [T["pct"], T["lain"]]
        else:            pool = [T["lain"]]
        if any(ada(p, v, tol) for p in pool): st = "COCOK"
        elif tp == "pct" and ada(T["lain"], v / 100, tol / 100): st = "COCOK"
        elif tp in ("rp", "bln") and _konteks_selisih(jawaban, label):
            P = T[tp]
            if any(ada(P, v - a, tol) or ada(P, a - v, tol) for a in P if a > 0): st = "TURUNAN (cek manual)"
            else: st = "TIDAK DITEMUKAN"
        else: st = "TIDAK DITEMUKAN"
        hasil.append((label, v, st))
    return hasil

def main():
    alat = []
    for p in sys.argv[1].split(","):
        txt = open(p, encoding="utf-8").read()
        try: alat.append(json.loads(txt))
        except Exception: alat.append(txt)
    jawaban = open(sys.argv[2], encoding="utf-8").read()
    h = periksa(alat, jawaban)
    for lab, v, st in h: print(f"{st:16s} {lab}")
    n = len(h); bad = [x for x in h if x[2] == "TIDAK DITEMUKAN"]
    print(f"\nTotal angka diperiksa: {n} | cocok: {sum(x[2]=='COCOK' for x in h)} | turunan: {sum(x[2].startswith('TURUNAN') for x in h)} | tidak ditemukan: {len(bad)}")
    sys.exit(1 if bad else 0)
if __name__ == "__main__": main()
