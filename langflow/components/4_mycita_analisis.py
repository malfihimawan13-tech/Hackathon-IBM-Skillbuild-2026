"""
myCITA (My Career, Income, Target & Achievement) - Komponen Analisis
Tempel seluruh isi file ini ke Custom Component Langflow (tombol Code).
Versi 1.1.0
"""
import json
import math
import os
import re
import sqlite3
from datetime import date, datetime
from pathlib import Path

from langflow.custom import Component
from langflow.io import MessageTextInput, Output, StrInput
from langflow.schema.message import Message

# =====================================================================
# myCITA - utilitas bersama (bagian ini identik di semua komponen myCITA)
# =====================================================================
CITA_VERSI = "1.0.0"
DISCLAIMER = (
    "myCITA adalah alat edukasi dan perencanaan keuangan, bukan nasihat investasi "
    "atau rekomendasi produk keuangan tertentu. Semua angka adalah estimasi "
    "berdasarkan data yang kamu isi dan asumsi yang tercantum."
)


def mycita_db_path(custom: str = "") -> str:
    """Lokasi database myCITA. Default: ~/.mycita/mycita.db (bisa diganti lewat kolom Lokasi Database atau MYCITA_DB_PATH)."""
    env = os.environ.get("MYCITA_DB_PATH") or os.environ.get("MYCITA_DB_PATH")
    path = (custom or env or str(Path.home() / ".mycita" / "mycita.db")).strip()
    p = Path(path).expanduser()
    p.parent.mkdir(parents=True, exist_ok=True)
    lama = Path.home() / ".cita" / "cita.db"
    if not custom and not env and not p.exists() and lama.exists():
        import shutil
        shutil.copy2(lama, p)  # pindahkan otomatis data dari nama lama (mycita.db)
    return str(p)


def _mycita_conn(custom: str = ""):
    conn = sqlite3.connect(mycita_db_path(custom))
    conn.execute(
        "CREATE TABLE IF NOT EXISTS mycita_data ("
        "user_id TEXT NOT NULL, jenis TEXT NOT NULL, data TEXT NOT NULL, "
        "diperbarui TEXT NOT NULL, PRIMARY KEY (user_id, jenis))"
    )
    if conn.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='cita_data'").fetchone():
        conn.execute("INSERT OR IGNORE INTO mycita_data SELECT user_id, jenis, data, diperbarui FROM cita_data")
        conn.execute("DROP TABLE cita_data")
        conn.commit()
    return conn


def simpan_data(user_id: str, jenis: str, data, custom: str = "") -> None:
    conn = _mycita_conn(custom)
    try:
        conn.execute(
            "INSERT OR REPLACE INTO mycita_data (user_id, jenis, data, diperbarui) VALUES (?, ?, ?, ?)",
            (user_id, jenis, json.dumps(data, ensure_ascii=False), datetime.now().isoformat(timespec="seconds")),
        )
        conn.commit()
    finally:
        conn.close()


def baca_data(user_id: str, jenis: str, custom: str = ""):
    conn = _mycita_conn(custom)
    try:
        row = conn.execute(
            "SELECT data FROM mycita_data WHERE user_id = ? AND jenis = ?", (user_id, jenis)
        ).fetchone()
    finally:
        conn.close()
    return json.loads(row[0]) if row else None


def hapus_semua_data(user_id: str, custom: str = "") -> int:
    conn = _mycita_conn(custom)
    try:
        cur = conn.execute("DELETE FROM mycita_data WHERE user_id = ?", (user_id,))
        conn.commit()
        return cur.rowcount
    finally:
        conn.close()


def parse_input(teks) -> dict:
    if isinstance(teks, dict):
        return teks
    s = str(teks or "").strip()
    s = re.sub(r"```(?:json)?", "", s).strip()
    awal, akhir = s.find("{"), s.rfind("}")
    if awal == -1 or akhir == -1:
        raise ValueError('Input harus berupa JSON object, contoh: {"user_id": "budi", ...}')
    try:
        return json.loads(s[awal : akhir + 1])
    except json.JSONDecodeError as e:
        raise ValueError(f"Format JSON tidak valid: {e.msg} (posisi {e.pos})") from e


def norm_user_id(data: dict) -> str:
    uid = str(data.get("user_id") or "").strip().lower()
    uid = re.sub(r"\s+", "_", uid)
    if not uid:
        raise ValueError("Field 'user_id' wajib diisi agar data bisa disimpan dan dibaca kembali.")
    return uid


def angka(v, default: float = 0.0) -> float:
    """Terima 7000000, '7.000.000', 'Rp 7.000.000', '7 juta', '7,5jt', '500rb', '1,2 miliar'."""
    if v is None or v == "":
        return default
    if isinstance(v, bool):
        return default
    if isinstance(v, (int, float)):
        return float(v)
    s = str(v).lower().replace("rp", "").replace(" ", "").strip()
    pengali = 1.0
    for akhiran, nilai in (("miliar", 1e9), ("milyar", 1e9), ("juta", 1e6), ("jt", 1e6),
                           ("ribu", 1e3), ("rb", 1e3), ("k", 1e3)):
        if s.endswith(akhiran):
            s, pengali = s[: -len(akhiran)], nilai
            break
    if pengali != 1.0:
        s = s.replace(",", ".")
        if s.count(".") > 1:
            s = s.replace(".", "")
    else:
        s = s.replace(".", "").replace(",", ".")
    s = re.sub(r"[^0-9.\-]", "", s)
    try:
        return float(s) * pengali
    except ValueError:
        return default


def bulat(x) -> int:
    return int(round(x or 0))


def rp(x) -> str:
    n = bulat(x)
    tanda = "-" if n < 0 else ""
    return f"{tanda}Rp{abs(n):,}".replace(",", ".")


def hasil_message(komponen, payload: dict):
    teks = json.dumps(payload, ensure_ascii=False, indent=2)
    komponen.status = payload.get("pesan") or payload.get("status", "")
    return Message(text=teks)


def galat(pesan: str) -> dict:
    return {"status": "error", "pesan": pesan}
# =====================================================================

# ---------------------------- myCITA TARGET ----------------------------
# Harga referensi dikumpulkan Oktober 2026. Perbarui berkala; pengguna selalu boleh mengisi harga sendiri.
REF_HARGA = [
    # Mobil (OTR Jakarta)
    {"nama": "Toyota Avanza", "kategori": "mobil", "kata": ["avanza"], "min": 244_200_000, "max": 282_100_000,
     "acuan": 259_200_000, "catatan": "Acuan varian 1.3 E CVT", "sumber": "oto.com (OTR Jakarta), 2026"},
    {"nama": "Mitsubishi Xpander", "kategori": "mobil", "kata": ["xpander"], "min": 274_500_000, "max": 348_000_000,
     "acuan": 283_500_000, "catatan": "Acuan varian GLS CVT", "sumber": "moladin.com (OTR Jakarta), Juli 2026"},
    {"nama": "Suzuki Ertiga", "kategori": "mobil", "kata": ["ertiga"], "min": 236_100_000, "max": 270_700_000,
     "acuan": 236_100_000, "catatan": "Acuan varian terendah", "sumber": "oto.com (OTR Jakarta), 2026"},
    {"nama": "Honda Brio", "kategori": "mobil", "kata": ["brio"], "min": 170_400_000, "max": 263_200_000,
     "acuan": 170_400_000, "catatan": "Acuan varian terendah", "sumber": "zigwheels.co.id (OTR Jakarta), 2026"},
    # Motor
    {"nama": "Honda BeAT", "kategori": "motor", "kata": ["beat"], "min": 18_980_000, "max": 20_380_000,
     "acuan": 18_980_000, "catatan": "Acuan varian terendah", "sumber": "zigwheels.co.id / oto.com, 2026"},
    {"nama": "Honda Vario 125", "kategori": "motor", "kata": ["vario"], "min": 24_810_000, "max": 26_799_000,
     "acuan": 24_810_000, "catatan": "Acuan Vario 125 CBS", "sumber": "Price list AHM OTR DKI (via bernas.id), 2026"},
    {"nama": "Honda Scoopy", "kategori": "motor", "kata": ["scoopy"], "min": 24_200_000, "max": 25_005_000,
     "acuan": 24_200_000, "catatan": "Acuan Scoopy Fashion", "sumber": "Wahana Honda Jabodetabek, Oktober 2026"},
    {"nama": "Yamaha NMAX", "kategori": "motor", "kata": ["nmax"], "min": 31_620_000, "max": 33_180_000,
     "acuan": 31_620_000, "catatan": "Acuan varian terendah", "sumber": "oto.com (OTR Jakarta), 2026"},
    # Rumah subsidi (batas harga jual maksimal FLPP)
    {"nama": "Rumah subsidi Jabodetabek", "kategori": "rumah_subsidi",
     "kata": ["subsidi jabodetabek", "subsidi jakarta", "subsidi bogor", "subsidi depok", "subsidi tangerang", "subsidi bekasi"],
     "min": 150_000_000, "max": 185_000_000, "acuan": 185_000_000,
     "catatan": "Batas harga maksimal rumah subsidi (FLPP), bunga KPR subsidi 5% tetap",
     "sumber": "Kompas.com (Kepmen batas harga rumah subsidi), 2026"},
    {"nama": "Rumah subsidi Jawa (luar Jabodetabek) & Sumatera", "kategori": "rumah_subsidi",
     "kata": ["subsidi jawa", "subsidi sumatera", "subsidi bandung", "subsidi semarang", "subsidi surabaya", "subsidi"],
     "min": 140_000_000, "max": 166_000_000, "acuan": 166_000_000,
     "catatan": "Batas harga maksimal rumah subsidi (FLPP), bunga KPR subsidi 5% tetap",
     "sumber": "Kompas.com (Kepmen batas harga rumah subsidi), 2026"},
    # Menikah
    {"nama": "Pernikahan intimate", "kategori": "menikah", "kata": ["intimate", "sederhana", "nikah", "menikah", "pernikahan", "wedding"],
     "min": 150_000_000, "max": 250_000_000, "acuan": 200_000_000,
     "catatan": "Sangat bergantung kota dan jumlah tamu", "sumber": "Popbela/IDN, perkiraan budget nikah 2026"},
    {"nama": "Pernikahan menengah", "kategori": "menikah", "kata": ["menengah", "mid size", "midsize"],
     "min": 300_000_000, "max": 500_000_000, "acuan": 400_000_000,
     "catatan": "Sangat bergantung kota dan jumlah tamu", "sumber": "Popbela/IDN, perkiraan budget nikah 2026"},
]

KATEGORI_KATA = [
    ("dana_darurat", ("darurat", "emergency")),
    ("rumah_subsidi", ("rumah subsidi", "subsidi")),
    ("rumah", ("rumah", "kpr", "apartemen", "hunian", "properti")),
    ("mobil", ("mobil", "avanza", "xpander", "brio", "ertiga", "innova", "car")),
    ("motor", ("motor", "beat", "vario", "nmax", "scoopy", "pcx", "aerox")),
    ("menikah", ("nikah", "wedding", "pernikahan", "lamaran")),
    ("pendidikan", ("kuliah", "sekolah", "pendidikan", "s2", "magister", "kursus", "sertifikasi")),
    ("ibadah", ("umroh", "umrah", "haji")),
    ("liburan", ("liburan", "travel", "jalan-jalan", "trip")),
    ("gadget", ("laptop", "iphone", "hp", "gadget", "kamera", "macbook")),
    ("usaha", ("usaha", "modal", "bisnis")),
]


def deteksi_kategori(teks: str) -> str:
    s = str(teks or "").lower()
    for kat, kata in KATEGORI_KATA:
        if any(k in s for k in kata):
            return kat
    return "lainnya"


def cari_harga(query: str, kategori: str = ""):
    q = str(query or "").lower()
    hasil = []
    for r in REF_HARGA:
        skor = max((len(k) for k in r["kata"] if k in q), default=0)
        if not skor and kategori and r["kategori"] == kategori and kategori in ("menikah",):
            skor = 1
        if skor:
            hasil.append((skor, r))
    hasil.sort(key=lambda x: -x[0])
    return [
        {k: r[k] for k in ("nama", "kategori", "min", "max", "acuan", "catatan", "sumber")}
        for _, r in hasil[:3]
    ]


def norm_target(t: dict, i: int = 1):
    nama = t.get("nama") or t.get("target") or f"Target {i}"
    kategori = t.get("kategori") or deteksi_kategori(nama)
    kategori = str(kategori).lower().replace(" ", "_")
    harga = angka(t.get("harga"))
    sumber_harga = "diisi pengguna" if harga > 0 else None
    referensi = None
    if harga <= 0 and kategori != "dana_darurat":
        cocok = cari_harga(nama, kategori)
        if cocok:
            referensi = cocok[0]
            harga = referensi["acuan"]
            sumber_harga = f"referensi: {referensi['sumber']}"
    bulan = int(angka(t.get("target_bulan")))
    if not bulan and t.get("target_tahun") not in (None, ""):
        bulan = int(round(angka(t.get("target_tahun")) * 12))
    metode = str(t.get("metode") or "auto").lower()
    if metode not in ("menabung", "kredit", "kombinasi", "auto"):
        metode = "auto"
    return {
        "nama": nama,
        "kategori": kategori,
        "harga": bulat(harga),
        "sumber_harga": sumber_harga or ("dihitung otomatis dari pengeluaran" if kategori == "dana_darurat" else None),
        "referensi_harga": referensi,
        "perlu_harga": harga <= 0 and kategori != "dana_darurat",
        "target_bulan": bulan or None,
        "metode": metode,
        "prioritas": int(angka(t.get("prioritas"), default=i)),
        "dp_persen": angka(t.get("dp_persen"), default=-1) if t.get("dp_persen") not in (None, "") else None,
        "bunga_kredit_persen": angka(t.get("bunga_kredit_persen")) if t.get("bunga_kredit_persen") not in (None, "") else None,
        "dana_terkumpul": bulat(angka(t.get("dana_terkumpul"))),
    }


def proses_target(d: dict, target_lama: list):
    aksi = str(d.get("aksi") or "simpan").lower()
    raw = d.get("target")
    if isinstance(raw, dict):
        raw = [raw]
    raw = [x for x in (raw or []) if isinstance(x, dict)]
    peringatan = []

    if aksi == "hapus":
        nama_hapus = {str(x.get("nama") or "").lower() for x in raw} | {str(d.get("nama") or "").lower()}
        baru = [t for t in target_lama if t["nama"].lower() not in nama_hapus]
        return baru, peringatan, aksi
    baru_list = [norm_target(t, i) for i, t in enumerate(raw, start=1)]
    if aksi == "tambah":
        nama_baru = {t["nama"].lower() for t in baru_list}
        gabung = [t for t in target_lama if t["nama"].lower() not in nama_baru] + baru_list
    else:
        gabung = baru_list
    for t in baru_list:
        if t["perlu_harga"]:
            peringatan.append(f"Harga '{t['nama']}' belum diketahui dan tidak ada di tabel referensi. Mohon isi 'harga'.")
        if not t["target_bulan"]:
            peringatan.append(f"'{t['nama']}' belum punya tenggat; myCITA akan menghitung berapa lama waktu yang dibutuhkan.")
        if t["referensi_harga"]:
            r = t["referensi_harga"]
            peringatan.append(
                f"Harga '{t['nama']}' memakai referensi {r['nama']} {rp(r['acuan'])} (kisaran {rp(r['min'])}-{rp(r['max'])}). "
                "Isi 'harga' jika kamu sudah punya angka sendiri."
            )
    return gabung, peringatan, aksi



# --------------------------- myCITA ANALISIS ---------------------------
ASUMSI_DEFAULT = {
    "inflasi_umum_persen": 3.2,
    "kenaikan_harga_persen": {
        "rumah": 4.0, "rumah_subsidi": 3.0, "mobil": 3.0, "motor": 3.0, "menikah": 4.0,
        "pendidikan": 6.0, "default": 3.2,
    },
    "bunga_kredit_persen": {"rumah": 11.0, "rumah_subsidi": 5.0, "mobil": 10.0, "motor": 15.0},
    "dp_persen": {"rumah": 20.0, "rumah_subsidi": 1.0, "mobil": 20.0, "motor": 15.0},
    "tenor_tahun": {"rumah": [10, 15, 20], "rumah_subsidi": [10, 15, 20], "mobil": [3, 4, 5], "motor": [1, 2, 3]},
    "imbal_hasil_tabungan_persen": 0.0,
    "kenaikan_penghasilan_persen": 0.0,
    "pakai_penghasilan_konservatif": False,
    "batas_aman_cicilan_persen": 30.0,
    "porsi_dana_darurat_persen": 50.0,
}
SUMBER_ASUMSI = [
    "Inflasi umum 3,2%: inflasi tahunan Indonesia Agustus 2026 tercatat 3,19% (BPS via Databoks); sasaran BI 2,5±1%.",
    "Bunga KPR 11%: bunga floating KPR BCA 11% (Mandiri 13%, CIMB Niaga 13,5%), Kontan Agustus 2026.",
    "KPR subsidi 5% tetap dan batas harga rumah subsidi Rp166-185 juta: Kompas.com 2026.",
    "Kenaikan harga barang, bunga kredit kendaraan, DP, dan porsi alokasi adalah asumsi myCITA yang dapat diubah.",
    "Penghasilan dan pengeluaran dianggap tetap (konservatif); ubah 'kenaikan_penghasilan_persen' untuk skenario kenaikan gaji.",
]
KREDIT_LAYAK = ("rumah", "rumah_subsidi", "mobil", "motor")
TIDAK_DISARANKAN_KREDIT = ("menikah", "liburan", "gadget", "ibadah", "pendidikan", "dana_darurat")


def _gabung_asumsi(override: dict) -> dict:
    a = json.loads(json.dumps(ASUMSI_DEFAULT))
    for k, v in (override or {}).items():
        if isinstance(v, dict) and isinstance(a.get(k), dict):
            a[k].update(v)
        elif k in a:
            a[k] = v
    return a


def _kat_kredit(kat: str) -> str:
    return kat if kat in KREDIT_LAYAK else "mobil"


def cicilan_anuitas(pokok: float, bunga_tahunan: float, tenor_bulan: int) -> float:
    if pokok <= 0 or tenor_bulan <= 0:
        return 0.0
    i = bunga_tahunan / 100 / 12
    if i == 0:
        return pokok / tenor_bulan
    return pokok * i / (1 - (1 + i) ** -tenor_bulan)


def _teks_durasi(bulan) -> str:
    if bulan is None:
        return "lebih dari 50 tahun"
    if bulan <= 0:
        return "sudah tercapai"
    if bulan < 12:
        return f"{bulan} bulan"
    th, bl = divmod(bulan, 12)
    return f"{th} tahun" + (f" {bl} bulan" if bl else "")


def _bulan_lunas(h: dict):
    if h.get("sisa_tenor_bulan"):
        return int(h["sisa_tenor_bulan"])
    p, c = h.get("sisa_pokok", 0), h.get("cicilan_bulanan", 0)
    if p > 0 and c > 0:
        i = h.get("bunga_tahunan_persen", 0) / 100 / 12
        if i == 0:
            return math.ceil(p / c)
        if p * i < c:
            return math.ceil(-math.log(1 - p * i / c) / math.log(1 + i))
    return None  # dianggap berjalan terus


def simulasi_arus_kas(ctx: dict, goals: list, a: dict, tambahan: float = 0.0, maks: int = 600):
    """Simulasi bulan per bulan: cicilan yang lunas membebaskan dana, dana darurat diisi dulu
    (porsi tertentu), lalu tiap target diberi setoran sesuai kebutuhan tenggatnya; sisa dana
    mempercepat target prioritas teratas. Harga target naik sesuai asumsi."""
    r = a["imbal_hasil_tabungan_persen"] / 100 / 12
    naik_inc = a.get("kenaikan_penghasilan_persen", 0) / 100
    porsi = a["porsi_dana_darurat_persen"] / 100
    dd_bal = min(ctx["dana_likuid"], ctx["dd_target"])
    sisa_awal = ctx["dana_likuid"] - dd_bal
    st = []
    for g in goals:
        bal = g.get("dana_terkumpul", 0)
        if sisa_awal > 0 and g["harga"] > 0:
            bal += sisa_awal
            sisa_awal = 0
        st.append({"bal": bal, "selesai": None, "jejak": [bal], "alok_awal": 0.0})
    dd_selesai = 0 if dd_bal >= ctx["dd_target"] else None
    alok_dd_awal = 0.0
    for i, g in enumerate(goals):
        if g["harga"] > 0 and st[i]["bal"] >= g["harga"]:
            st[i]["selesai"] = 0
    jadwal = ctx.get("jadwal") or []
    for m in range(1, maks + 1):
        if jadwal:
            utama = jadwal[0][1]
            for mulai, nilai in jadwal:
                if mulai <= m - 1:
                    utama = nilai
            inc = utama + ctx.get("penghasilan_lain", 0) + tambahan
        else:
            inc = ctx["penghasilan"] * (1 + naik_inc) ** ((m - 1) // 12) + tambahan
        ekstra = ctx.get("tambahan_jadwal") or []
        if ekstra:
            nilai_e = 0.0
            for mulai, nilai in ekstra:
                if mulai <= m - 1:
                    nilai_e = nilai
            inc += nilai_e
        cic = sum(c for c, akhir in ctx["hutang"] if akhir is None or m <= akhir)
        pool = max(0.0, inc - ctx["rutin"] - cic)
        aktif = [i for i, g in enumerate(goals) if g["harga"] > 0 and st[i]["selesai"] is None]
        if dd_bal < ctx["dd_target"]:
            a_dd = min(ctx["dd_target"] - dd_bal, pool * porsi if aktif else pool)
            dd_bal += a_dd
            pool -= a_dd
            if m == 1:
                alok_dd_awal = a_dd
            if dd_bal >= ctx["dd_target"] - 1 and dd_selesai is None:
                dd_selesai = m
        beri = {i: 0.0 for i in aktif}
        for i in aktif:
            g = goals[i]
            if g.get("target_bulan") and m <= g["target_bulan"]:
                sisa_bln = g["target_bulan"] - m + 1
                harga_tenggat = g["harga"] * (1 + g["naik"] / 100) ** (g["target_bulan"] / 12)
                butuh = max(0.0, (harga_tenggat - st[i]["bal"]) / sisa_bln)
                beri[i] = min(butuh, pool)
                pool -= beri[i]
        if aktif and pool > 0:
            beri[aktif[0]] += pool
            pool = 0.0
        for i in range(len(goals)):
            s_ = st[i]
            if i in beri:
                s_["bal"] = s_["bal"] * (1 + r) + beri[i]
                if m == 1:
                    s_["alok_awal"] = beri[i]
                harga_kini = goals[i]["harga"] * (1 + goals[i]["naik"] / 100) ** (m / 12)
                if s_["bal"] >= harga_kini:
                    s_["selesai"] = m
            s_["jejak"].append(s_["bal"])
        if dd_selesai is not None and all(st[i]["selesai"] is not None for i, g in enumerate(goals) if g["harga"] > 0):
            break
    return {"dd_selesai": dd_selesai, "alok_dd_awal": alok_dd_awal, "goals": st}


def _penghasilan_bulan(ctx, m):
    m = max(1, m)
    jadwal = ctx.get("jadwal") or []
    if jadwal:
        utama = jadwal[0][1]
        for mulai, nilai in jadwal:
            if mulai <= m - 1:
                utama = nilai
        inc = utama + ctx.get("penghasilan_lain", 0)
    else:
        inc = ctx["penghasilan"]
    nilai_e = 0.0
    for mulai, nilai in ctx.get("tambahan_jadwal") or []:
        if mulai <= m - 1:
            nilai_e = nilai
    return inc + nilai_e


def _cicilan_aktif(ctx, m):
    return sum(c for c, akhir in ctx["hutang"] if akhir is None or m <= akhir)


def _opsi_kredit(g, jejak, dp_persen, ctx, a):
    kk = _kat_kredit(g["kategori"])
    bunga = g.get("bunga_kredit_persen") or a["bunga_kredit_persen"][kk]
    dp_bulan = None
    for m, bal in enumerate(jejak):
        if bal >= g["harga"] * (1 + g["naik"] / 100) ** (m / 12) * dp_persen / 100:
            dp_bulan = m
            break
    if dp_bulan is None:
        return {"dp_persen": dp_persen, "waktu_kumpulkan_dp": "lebih dari 50 tahun",
                "waktu_kumpulkan_dp_bulan": None, "tenor_aman_terpendek": None, "pilihan_tenor": []}
    harga_beli = g["harga"] * (1 + g["naik"] / 100) ** (dp_bulan / 12)
    dp = harga_beli * dp_persen / 100
    pinjaman = harga_beli - dp
    cic_lama = _cicilan_aktif(ctx, max(dp_bulan, 1))
    inc_beli = _penghasilan_bulan(ctx, dp_bulan)
    bebas = inc_beli - ctx["rutin"] - cic_lama
    opsi = []
    for th in a["tenor_tahun"][kk]:
        c = cicilan_anuitas(pinjaman, bunga, th * 12)
        rasio = (cic_lama + c) / inc_beli if inc_beli else 9.99
        opsi.append({
            "tenor_tahun": th,
            "cicilan_bulanan": bulat(c),
            "total_bunga": bulat(c * th * 12 - pinjaman),
            "total_dibayar": bulat(c * th * 12 + dp),
            "rasio_cicilan_setelah_kredit_persen": round(rasio * 100, 1),
            "aman": rasio * 100 <= a["batas_aman_cicilan_persen"] and c <= bebas,
        })
    return {
        "dp_persen": dp_persen,
        "dp": bulat(dp),
        "waktu_kumpulkan_dp_bulan": dp_bulan,
        "waktu_kumpulkan_dp": _teks_durasi(dp_bulan),
        "perkiraan_harga_saat_beli": bulat(harga_beli),
        "pinjaman": bulat(pinjaman),
        "bunga_tahunan_persen": bunga,
        "cicilan_lama_saat_itu": bulat(cic_lama),
        "pilihan_tenor": opsi,
        "tenor_aman_terpendek": next((o["tenor_tahun"] for o in opsi if o["aman"]), None),
    }


def _cari_minimum(fungsi_ok, lo, hi, iterasi=28):
    if not fungsi_ok(hi):
        return None
    for _ in range(iterasi):
        mid = (lo + hi) / 2
        if fungsi_ok(mid):
            hi = mid
        else:
            lo = mid
    return hi


def _alternatif(idx, goals, ctx, a):
    g = goals[idx]
    n = g["target_bulan"]

    def ok_tambahan(x):
        s = simulasi_arus_kas(ctx, goals, a, tambahan=x, maks=n)
        return s["goals"][idx]["selesai"] is not None and s["goals"][idx]["selesai"] <= n

    def ok_harga(h):  # True jika harga h TIDAK tercapai (mencari batas atas yang tercapai)
        gs = [dict(x) for x in goals]
        gs[idx]["harga"] = h
        s = simulasi_arus_kas(ctx, gs, a, maks=n)
        sel = s["goals"][idx]["selesai"]
        return not (sel is not None and sel <= n)

    tambahan = _cari_minimum(ok_tambahan, 0.0, max(g["harga"], 1.0))
    batas = _cari_minimum(ok_harga, 0.0, g["harga"])
    return {
        "tambahan_tabungan_per_bulan_agar_tepat_waktu": bulat(tambahan) if tambahan is not None else None,
        "harga_maksimal_terjangkau_sesuai_tenggat": ((int(batas) // 1000000) * 1000000 if batas >= 10000000 else bulat(batas)) if batas is not None else bulat(g["harga"]),
    }


def hitung_analisis(profil: dict, keuangan: dict, targets: list, a: dict, sim: dict = None):
    sim = sim or {}
    penghasilan = profil["total_penghasilan"]
    konservatif = profil.get("total_penghasilan_konservatif", penghasilan)
    if sim.get("penghasilan_baru") not in (None, ""):
        selisih = angka(sim["penghasilan_baru"]) - penghasilan
        penghasilan, konservatif = penghasilan + selisih, konservatif + selisih
    d_inc = angka(sim.get("perubahan_penghasilan"))
    penghasilan, konservatif = penghasilan + d_inc, konservatif + d_inc
    if a.get("pakai_penghasilan_konservatif"):
        penghasilan = konservatif

    rutin = keuangan["total_pengeluaran_rutin"]
    if sim.get("pengeluaran_baru") not in (None, ""):
        rutin = angka(sim["pengeluaran_baru"]) - keuangan["total_cicilan"]
    rutin += angka(sim.get("perubahan_pengeluaran")) + angka(sim.get("perubahan_keinginan"))
    keinginan = keuangan["pengeluaran_per_jenis"].get("keinginan", 0) + angka(sim.get("perubahan_keinginan"))
    cicilan = keuangan["total_cicilan"]
    total_keluar = rutin + cicilan
    sisa = penghasilan - total_keluar
    kapasitas = max(0.0, sisa)

    saving_rate = sisa / penghasilan if penghasilan else 0
    rasio_cicilan = cicilan / penghasilan if penghasilan else 0
    rasio_keinginan = keinginan / penghasilan if penghasilan else 0

    tanggungan = profil.get("jumlah_tanggungan_total", 0)
    if profil.get("status_pernikahan") == "menikah" or tanggungan:
        dd_min_bln, dd_ideal_bln = 6, (12 if tanggungan else 9)
    else:
        dd_min_bln, dd_ideal_bln = 3, 6
    if profil.get("penghasilan_tidak_tetap"):
        dd_min_bln, dd_ideal_bln = dd_min_bln + 3, dd_ideal_bln + 3
    dana_likuid = keuangan.get("tabungan_saat_ini", 0) + keuangan.get("dana_darurat_saat_ini", 0)
    dd_min, dd_ideal = total_keluar * dd_min_bln, total_keluar * dd_ideal_bln
    bulan_tertutup = dana_likuid / total_keluar if total_keluar else 0

    # ---- Skor kesehatan 0-100 ----
    s_saving = 30 * min(1.0, max(0.0, saving_rate) / 0.20)
    if rasio_cicilan <= 0.10:
        s_cicilan = 25.0
    elif rasio_cicilan <= 0.30:
        s_cicilan = 25 - (rasio_cicilan - 0.10) / 0.20 * 10
    elif rasio_cicilan <= 0.50:
        s_cicilan = 15 - (rasio_cicilan - 0.30) / 0.20 * 15
    else:
        s_cicilan = 0.0
    s_dd = 25 * min(1.0, bulan_tertutup / dd_ideal_bln)
    s_keinginan = 10.0 if rasio_keinginan <= 0.30 else max(0.0, 10 - (rasio_keinginan - 0.30) / 0.20 * 10)
    hutang_tinggi = [h for h in keuangan["hutang"] if h["berbunga_tinggi"] and h["cicilan_bulanan"] > 0]
    s_hutang = 3.0 if hutang_tinggi else 10.0
    skor = bulat(s_saving + s_cicilan + s_dd + s_keinginan + s_hutang)
    if sisa < 0:
        skor = min(skor, 30)
    if skor >= 80:
        status, emoji = "Sangat sehat", "🟢"
    elif skor >= 65:
        status, emoji = "Cukup sehat", "🟢"
    elif skor >= 45:
        status, emoji = "Perlu perhatian", "🟡"
    else:
        status, emoji = "Rawan", "🔴"

    # ---- Simulasi arus kas & target ----
    ada_target_dd = any(t["kategori"] == "dana_darurat" for t in targets)
    dd_target = dd_ideal if ada_target_dd else dd_min
    goals = []
    for t in sorted([t for t in targets if t["kategori"] != "dana_darurat"],
                    key=lambda t: (t["prioritas"], t.get("target_bulan") or 9999)):
        g = dict(t)
        g["naik"] = a["kenaikan_harga_persen"].get(t["kategori"], a["kenaikan_harga_persen"]["default"])
        if t.get("perlu_harga"):
            g["harga"] = 0
        goals.append(g)
    ctx = {
        "penghasilan": penghasilan, "rutin": rutin, "dana_likuid": dana_likuid, "dd_target": dd_target,
        "hutang": [(h["cicilan_bulanan"], _bulan_lunas(h)) for h in keuangan["hutang"]],
    }
    ekstra_raw = sim.get("pendapatan_tambahan_jadwal") or []
    if ekstra_raw:
        ctx["tambahan_jadwal"] = sorted((int(angka(j.get("mulai_bulan"))), angka(j.get("nilai"))) for j in ekstra_raw if isinstance(j, dict))
    biaya_awal = angka(sim.get("biaya_awal"))
    if biaya_awal:
        ctx["dana_likuid"] = max(0.0, dana_likuid - biaya_awal)
    jadwal_raw = sim.get("jadwal_pendapatan") or []
    if jadwal_raw:
        jd = sorted((int(angka(j.get("mulai_bulan"))), angka(j.get("penghasilan"))) for j in jadwal_raw if isinstance(j, dict) and angka(j.get("penghasilan")) > 0)
        if jd:
            utama_kini = max((p.get("penghasilan", 0) for p in profil.get("pekerjaan") or []), default=0)
            if jd[0][0] > 0:
                jd.insert(0, (0, utama_kini))
            ctx["jadwal"] = jd
            ctx["penghasilan_lain"] = max(0.0, penghasilan - utama_kini)
    hasil_sim = simulasi_arus_kas(ctx, goals, a)
    hasil_target = []
    for i, g in enumerate(goals):
        s_ = hasil_sim["goals"][i]
        n = g.get("target_bulan")
        ht = {"nama": g["nama"], "kategori": g["kategori"], "prioritas": g["prioritas"],
              "harga_saat_ini": g["harga"], "sumber_harga": g.get("sumber_harga"),
              "kenaikan_harga_per_tahun_persen": g["naik"], "tenggat_bulan": n,
              "tenggat": _teks_durasi(n) if n else None,
              "setoran_bulan_pertama": bulat(s_["alok_awal"])}
        if g["harga"] <= 0:
            ht.update(status="perlu_harga", pesan="Harga target belum diketahui. Isi harga untuk melihat simulasi.")
            hasil_target.append(ht)
            continue
        sel = s_["selesai"]
        solo = simulasi_arus_kas(ctx, [g], a)["goals"][0]["selesai"]
        menabung = {
            "waktu_tercapai_bulan": sel,
            "waktu_tercapai": _teks_durasi(sel),
            "perkiraan_harga_saat_tercapai": bulat(g["harga"] * (1 + g["naik"] / 100) ** (sel / 12)) if sel is not None else None,
            "jika_hanya_fokus_target_ini": _teks_durasi(solo),
        }
        if n:
            menabung["harga_saat_tenggat"] = bulat(g["harga"] * (1 + g["naik"] / 100) ** (n / 12))
            menabung["tercapai_sesuai_tenggat"] = sel is not None and sel <= n
        ht["opsi_a_menabung"] = menabung
        if g["kategori"] in KREDIT_LAYAK:
            kk = _kat_kredit(g["kategori"])
            dp = g.get("dp_persen") if g.get("dp_persen") not in (None, -1) else a["dp_persen"][kk]
            ht["opsi_b_kredit"] = _opsi_kredit(g, s_["jejak"], dp, ctx, a)
            dp_k = min(max(dp + 15, 30), 60)
            ht["opsi_c_kombinasi"] = _opsi_kredit(g, s_["jejak"], dp_k, ctx, a)
            ht["opsi_c_kombinasi"]["keterangan"] = f"Menabung lebih lama untuk DP {dp_k:.0f}% agar pinjaman dan total bunga lebih kecil."
            if g["kategori"] == "rumah_subsidi":
                ht["catatan_subsidi"] = ("KPR subsidi (FLPP) punya syarat, antara lain belum memiliki rumah dan batas penghasilan "
                                         "(Jabodetabek: maks Rp12 juta untuk lajang, Rp14 juta untuk menikah). Cek syarat terbaru di bank penyalur.")
        elif g["kategori"] in TIDAK_DISARANKAN_KREDIT:
            ht["catatan_kredit"] = "Kredit/pinjaman tidak disarankan untuk tujuan konsumtif ini; prioritaskan menabung."
        tepat = menabung.get("tercapai_sesuai_tenggat")
        b = ht.get("opsi_b_kredit") or {}
        kredit_ok = b.get("tenor_aman_terpendek") is not None and b.get("waktu_kumpulkan_dp_bulan") is not None \
            and (not n or b["waktu_kumpulkan_dp_bulan"] <= n)
        if not n:
            ht["status"] = "tanpa_tenggat"
            ht["opsi_disarankan"] = "menabung" if sel is not None else ("kredit" if kredit_ok else "sesuaikan_rencana")
        elif tepat:
            ht["status"], ht["opsi_disarankan"] = "realistis", "menabung"
        elif kredit_ok:
            ht["status"], ht["opsi_disarankan"] = "realistis_dengan_kredit", "kredit"
        else:
            ht["status"], ht["opsi_disarankan"] = "perlu_penyesuaian", "sesuaikan_rencana"
        if n and not tepat:
            alt = _alternatif(i, goals, ctx, a)
            alt["perpanjang_tenggat_menjadi"] = _teks_durasi(sel)
            if alt["harga_maksimal_terjangkau_sesuai_tenggat"] < 0.1 * g["harga"]:
                alt["harga_maksimal_terjangkau_sesuai_tenggat"] = None
                alt["catatan"] = "Menurunkan budget saja tidak cukup karena dana sedang terpakai untuk target prioritas lebih tinggi."
            ht["alternatif"] = alt
        hasil_target.append(ht)

    alok_target_awal = sum(s_["alok_awal"] for s_ in hasil_sim["goals"])
    lunas = sorted([(h["nama"], _bulan_lunas(h), h["cicilan_bulanan"]) for h in keuangan["hutang"]
                    if _bulan_lunas(h)], key=lambda x: x[1])

    # ---- Strategi hutang (avalanche: bunga tertinggi dulu) ----
    urut_hutang = sorted([h for h in keuangan["hutang"] if h["sisa_pokok"] > 0 or h["cicilan_bulanan"] > 0],
                         key=lambda h: -h["bunga_tahunan_persen"])
    strategi_hutang = [
        {"urutan": i + 1, "nama": h["nama"], "jenis": h["jenis"], "bunga_tahunan_persen": h["bunga_tahunan_persen"],
         "sisa_pokok": h["sisa_pokok"], "cicilan_bulanan": h["cicilan_bulanan"],
         "perkiraan_lunas": _teks_durasi(_bulan_lunas(h)) if _bulan_lunas(h) else "tidak diketahui",
         "berbunga_tinggi": h["berbunga_tinggi"]}
        for i, h in enumerate(urut_hutang)
    ]

    # ---- Rekomendasi utama (berbasis aturan) ----
    rek = []
    if sisa < 0:
        rek.append(f"Pengeluaran melebihi penghasilan sebesar {rp(-sisa)}/bulan. Prioritas pertama: pangkas pengeluaran keinginan dan tunda target baru.")
    if hutang_tinggi:
        h0 = max(hutang_tinggi, key=lambda h: h["bunga_tahunan_persen"])
        rek.append(f"Lunasi '{h0['nama']}' ({h0['jenis'].replace('_', ' ')}, bunga ±{h0['bunga_tahunan_persen']:g}%/tahun) secepatnya, dan hindari menambah paylater/pinjol baru.")
    if rasio_cicilan * 100 > a["batas_aman_cicilan_persen"]:
        rek.append(f"Rasio cicilan {rasio_cicilan * 100:.0f}% melewati batas aman {a['batas_aman_cicilan_persen']:.0f}% dari penghasilan. Hindari kredit baru sampai rasio turun.")
    dd_kurang = max(0.0, dd_target - dana_likuid)
    if dd_kurang > 0:
        bln = dd_ideal_bln if ada_target_dd else dd_min_bln
        if hasil_sim["dd_selesai"]:
            rek.append(f"Bangun dana darurat {rp(dd_target)} ({bln}x pengeluaran bulanan) lebih dulu. Dengan menyisihkan sebagian kapasitas menabung, perkiraan terpenuhi dalam {_teks_durasi(hasil_sim['dd_selesai'])}.")
        else:
            rek.append(f"Dana darurat idealnya {rp(dd_target)} ({bln}x pengeluaran bulanan). Mulai isi setelah arus kas bulanan kembali positif.")
    if lunas and sisa >= 0:
        nama, bln, c = lunas[0]
        rek.append(f"'{nama}' diperkirakan lunas dalam {_teks_durasi(bln)}. Alihkan cicilan {rp(c)}/bulan itu langsung ke tabungan target agar tidak terpakai untuk konsumsi.")
    if 0 <= saving_rate < 0.20 and penghasilan:
        rek.append(f"Saving rate {saving_rate * 100:.0f}%. Untuk mencapai 20%, perlu menambah tabungan ±{rp(0.20 * penghasilan - sisa)}/bulan.")
    if rasio_keinginan > 0.30:
        top = next((p for p in keuangan["pengeluaran"] if p["jenis"] == "keinginan"), None)
        rek.append(f"Pengeluaran keinginan {rasio_keinginan * 100:.0f}% dari penghasilan (ideal ≤30%)" + (f"; pos terbesar: {top['kategori']} {rp(top['nominal'])}." if top else "."))
    for ht in hasil_target:
        if ht.get("status") == "perlu_penyesuaian" and ht.get("alternatif"):
            alt = ht["alternatif"]
            pil = [f"perpanjang tenggat menjadi {alt['perpanjang_tenggat_menjadi']}"]
            if alt["harga_maksimal_terjangkau_sesuai_tenggat"]:
                pil.append(f"turunkan budget ke ±{rp(alt['harga_maksimal_terjangkau_sesuai_tenggat'])}")
            if alt["tambahan_tabungan_per_bulan_agar_tepat_waktu"]:
                pil.append(f"tambah tabungan/penghasilan ±{rp(alt['tambahan_tabungan_per_bulan_agar_tepat_waktu'])}/bulan")
            rek.append(f"Target '{ht['nama']}' belum realistis dalam {ht['tenggat']}. Pilihan: " + ", atau ".join(pil) + ".")
            solo = ht["opsi_a_menabung"].get("jika_hanya_fokus_target_ini")
            solo_bln = simulasi_arus_kas(ctx, [g for g in goals if g["nama"] == ht["nama"]], a)["goals"][0]["selesai"]
            if solo_bln is not None and ht["tenggat_bulan"] and solo_bln <= ht["tenggat_bulan"] and ht["prioritas"] > min(x["prioritas"] for x in goals):
                rek.append(f"'{ht['nama']}' sebenarnya bisa tercapai dalam {solo} jika didahulukan. Target ini bentrok dengan target prioritas lebih tinggi, jadi pertimbangkan mengubah urutan prioritas.")
    if profil.get("penghasilan_tidak_tetap"):
        rek.append(f"Sebagian penghasilan tidak tetap. Di bulan sepi, pegang angka konservatif {rp(konservatif)}; kelebihan di bulan ramai langsung ditabung.")
    psi = profil.get("psikologi")
    if psi and psi.get("tipe") != "seimbang":
        rek.append(f"Profil kebiasaan: {psi['nama_tipe']}. {psi['saran_kebiasaan']}")
    if not rek:
        rek.append("Kondisi keuanganmu sehat. Pertahankan saving rate dan pertimbangkan mempercepat target prioritas.")

    return {
        "dashboard": {
            "nama": profil.get("nama"),
            "pendapatan": bulat(penghasilan),
            "pengeluaran": bulat(total_keluar),
            "sisa": bulat(sisa),
            "skor_kesehatan": skor,
            "status": f"{status} {emoji}",
            "saving_rate_persen": round(saving_rate * 100, 1),
        },
        "kesehatan_keuangan": {
            "penghasilan": bulat(penghasilan),
            "penghasilan_konservatif": bulat(konservatif),
            "pengeluaran_rutin": bulat(rutin),
            "pengeluaran_keinginan": bulat(keinginan),
            "total_cicilan": bulat(cicilan),
            "total_pengeluaran": bulat(total_keluar),
            "disposable_income": bulat(sisa),
            "kapasitas_menabung": bulat(kapasitas),
            "saving_rate_persen": round(saving_rate * 100, 1),
            "rasio_cicilan_persen": round(rasio_cicilan * 100, 1),
            "rasio_keinginan_persen": round(rasio_keinginan * 100, 1),
            "rincian_skor": {
                "saving_rate (maks 30)": round(s_saving, 1), "rasio_cicilan (maks 25)": round(s_cicilan, 1),
                "dana_darurat (maks 25)": round(s_dd, 1), "pengeluaran_keinginan (maks 10)": round(s_keinginan, 1),
                "hutang_berbunga_tinggi (maks 10)": s_hutang,
            },
            "skor": skor,
            "status": f"{status} {emoji}",
        },
        "dana_darurat": {
            "dana_likuid_saat_ini": bulat(dana_likuid),
            "cukup_untuk_bulan": round(bulan_tertutup, 1),
            "target_minimum": bulat(dd_min), "target_ideal": bulat(dd_ideal),
            "target_dipakai": bulat(dd_target),
            "kekurangan": bulat(dd_kurang),
            "perkiraan_waktu_terpenuhi": _teks_durasi(hasil_sim["dd_selesai"]) if hasil_sim["dd_selesai"] is not None else "belum dapat diisi",
        },
        "alokasi_bulan_ini": {
            "kapasitas_menabung": bulat(kapasitas),
            "untuk_dana_darurat": bulat(hasil_sim["alok_dd_awal"]),
            "untuk_target": bulat(alok_target_awal),
            "catatan": "Alokasi berubah otomatis: setelah dana darurat terpenuhi atau cicilan lunas, dananya dialihkan ke target.",
        },
        "strategi_hutang": strategi_hutang,
        "target": hasil_target,
        "rekomendasi_utama": rek[:8],
        "psikologi": psi,
    }


def _ringkas(h: dict) -> str:
    d = h["dashboard"]
    teks = (f"{d['nama']}: pendapatan {rp(d['pendapatan'])}, pengeluaran {rp(d['pengeluaran'])}, sisa {rp(d['sisa'])}. "
            f"Skor kesehatan {d['skor_kesehatan']}/100 ({d['status']}), saving rate {d['saving_rate_persen']}%.")
    for t in h["target"]:
        if t.get("status") == "perlu_harga":
            continue
        a = t["opsi_a_menabung"]
        teks += f" Target {t['nama']}: dengan menabung tercapai dalam {a['waktu_tercapai']}"
        b = t.get("opsi_b_kredit")
        if b and b.get("tenor_aman_terpendek"):
            o = next(x for x in b["pilihan_tenor"] if x["tenor_tahun"] == b["tenor_aman_terpendek"])
            teks += f"; via kredit DP {rp(b['dp'])} dan cicilan {rp(o['cicilan_bulanan'])}/bln ({o['tenor_tahun']} th)"
        teks += "."
    return teks


def jalankan_analisis(data: dict, db_path: str = ""):
    uid = norm_user_id(data)
    profil = baca_data(uid, "profil", db_path)
    keuangan = baca_data(uid, "keuangan", db_path)
    targets = baca_data(uid, "target", db_path) or []
    kurang = [n for n, v in (("profil", profil), ("keuangan", keuangan)) if not v]
    if kurang:
        return {
            "status": "data_belum_lengkap", "user_id": uid,
            "pesan": f"Data {', '.join(kurang)} untuk '{uid}' belum ada. Simpan dulu dengan "
                     + " dan ".join(f"simpan_{k}_mycita" for k in kurang) + ".",
        }
    sim = data.get("simulasi") or {}
    # Usaha yang sudah berjalan: kenaikan omzet X% dengan margin bersih tetap = laba bersih naik X%
    pengembangan = []
    for u in (sim.get("pengembangan_usaha") or []):
        if isinstance(u, dict) and angka(u.get("laba_bersih")) > 0:
            laba, pct = angka(u.get("laba_bersih")), angka(u.get("kenaikan_persen"))
            pengembangan.append({"nama": u.get("nama") or "usaha", "laba_bersih_sekarang": bulat(laba), "kenaikan_persen": pct,
                                 "tambahan_laba_bulanan": bulat(laba * pct / 100)})
    if pengembangan:
        sim = {**sim, "perubahan_penghasilan": angka(sim.get("perubahan_penghasilan")) + sum(x["tambahan_laba_bulanan"] for x in pengembangan)}
    a = _gabung_asumsi(data.get("asumsi") or sim.get("asumsi"))
    is_sim = bool(sim)
    targets_sim = targets
    if sim.get("target"):
        raw = sim["target"] if isinstance(sim["target"], list) else [sim["target"]]
        targets_sim = [norm_target(t, i) for i, t in enumerate(raw, start=1) if isinstance(t, dict)]

    hasil = hitung_analisis(profil, keuangan, targets_sim, a, sim)
    payload = {
        "status": "ok", "user_id": uid,
        "mode": "simulasi_what_if" if is_sim else "analisis",
        "pesan": "Simulasi what-if selesai (tidak mengubah data tersimpan)." if is_sim else "Analisis selesai dan tersimpan.",
        "ringkasan": _ringkas(hasil),
        **hasil,
    }
    if pengembangan:
        payload["pengembangan_usaha"] = pengembangan
        payload["catatan_pengembangan_usaha"] = "Asumsi: kenaikan omzet dengan margin bersih tetap, sehingga laba bersih naik dengan persentase yang sama."
    if is_sim:
        dasar = hitung_analisis(profil, keuangan, targets_sim, _gabung_asumsi(data.get("asumsi")), {})
        payload["perubahan_yang_disimulasikan"] = {k: v for k, v in sim.items() if k != "asumsi"}
        payload["perbandingan"] = {
            "sebelum": {"sisa": dasar["dashboard"]["sisa"], "skor": dasar["dashboard"]["skor_kesehatan"],
                        "target": {t["nama"]: (t.get("opsi_a_menabung") or {}).get("waktu_tercapai") for t in dasar["target"]}},
            "sesudah": {"sisa": hasil["dashboard"]["sisa"], "skor": hasil["dashboard"]["skor_kesehatan"],
                        "target": {t["nama"]: (t.get("opsi_a_menabung") or {}).get("waktu_tercapai") for t in hasil["target"]}},
        }
    else:
        simpan_data(uid, "analisis", payload, db_path)
    payload["asumsi"] = a
    payload["sumber_asumsi"] = SUMBER_ASUMSI
    payload["disclaimer"] = DISCLAIMER
    return payload


class MyCITAAnalisis(Component):
    display_name = "myCITA Analisis"
    description = (
        "Menganalisis kondisi keuangan pengguna myCITA dari data profil, keuangan, dan target yang sudah tersimpan: "
        "skor kesehatan keuangan 0-100, saving rate, rasio cicilan, dana darurat, strategi pelunasan hutang, dan "
        "simulasi tiap target (menabung, kredit dengan beberapa tenor, kombinasi) dengan memperhitungkan kenaikan harga. "
        "Input JSON {'user_id': ...}. Tambahkan 'simulasi' untuk what-if tanpa menyimpan, misalnya "
        "{'jadwal_pendapatan': [...]} dari eksplorasi_karier_mycita, atau simulasi_siap_pakai dari eksplorasi_usaha_mycita "
        "(pendapatan_tambahan_jadwal + biaya_awal), untuk melihat dampak jalur karier/usaha ke target finansial, "
        "{'perubahan_penghasilan': 2000000}, {'perubahan_pengeluaran': 500000}, "
        "{'pengembangan_usaha': [{'nama': 'bengkel', 'laba_bersih': 11000000, 'kenaikan_persen': 20}]} untuk usaha yang sudah berjalan, atau {'target': {'nama': 'Rumah', "
        "'harga': 400000000, 'target_tahun': 8}}. Semua angka dihitung pasti dengan rumus, bukan perkiraan AI."
    )
    icon = "chart-line"
    name = "MyCITAAnalisis"

    inputs = [
        MessageTextInput(
            name="input_json",
            display_name="Permintaan Analisis (JSON)",
            info='Contoh {"user_id": "budi"} atau {"user_id": "budi", "simulasi": {"perubahan_penghasilan": 2000000}}',
            tool_mode=True,
        ),
        StrInput(name="db_path", display_name="Lokasi Database", value="", advanced=True,
                 info="Kosongkan untuk memakai ~/.mycita/mycita.db. Harus sama di semua komponen myCITA."),
    ]
    outputs = [Output(display_name="Hasil", name="hasil", method="analisis_keuangan_mycita")]

    def analisis_keuangan_mycita(self) -> Message:
        try:
            payload = jalankan_analisis(parse_input(self.input_json), self.db_path)
        except Exception as e:  # noqa: BLE001
            payload = galat(str(e))
        return hasil_message(self, payload)
