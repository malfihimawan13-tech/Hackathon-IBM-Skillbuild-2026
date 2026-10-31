"""
myCITA (My Career, Income, Target & Achievement) - Komponen Target
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


class MyCITATarget(Component):
    display_name = "myCITA Target"
    description = (
        "Mengelola target impian finansial pengguna myCITA (rumah, rumah subsidi, mobil, motor, menikah, pendidikan, "
        "dana darurat, ibadah, liburan, gadget). aksi='simpan' mengganti semua target, 'tambah' menambah/memperbarui "
        "satu target, 'hapus' menghapus target, 'cari_harga' mencari estimasi harga dari tabel referensi tanpa menyimpan. "
        "Input JSON dengan 'user_id' dan 'target' (nama, harga opsional, target_tahun, metode, prioritas)."
    )
    icon = "target"
    name = "MyCITATarget"

    inputs = [
        MessageTextInput(
            name="input_json",
            display_name="Data Target (JSON)",
            info='Contoh {"user_id": "budi", "aksi": "tambah", "target": {"nama": "Toyota Avanza", "target_tahun": 5}}',
            tool_mode=True,
        ),
        StrInput(name="db_path", display_name="Lokasi Database", value="", advanced=True,
                 info="Kosongkan untuk memakai ~/.mycita/mycita.db. Harus sama di semua komponen myCITA."),
    ]
    outputs = [Output(display_name="Hasil", name="hasil", method="kelola_target_mycita")]

    def kelola_target_mycita(self) -> Message:
        try:
            data = parse_input(self.input_json)
            if str(data.get("aksi") or "").lower() == "cari_harga":
                q = data.get("query") or data.get("nama") or (data.get("target") or {}).get("nama", "")
                hasil = cari_harga(q, deteksi_kategori(q))
                payload = {
                    "status": "ok" if hasil else "tidak_ditemukan",
                    "pesan": f"{len(hasil)} referensi harga ditemukan untuk '{q}'." if hasil
                    else f"Tidak ada referensi untuk '{q}'. Minta pengguna mengisi harga, atau cari harga terkini di web.",
                    "hasil": hasil,
                    "catatan": "Harga referensi adalah estimasi per Oktober 2026 dan dapat berbeda per kota dan dealer.",
                }
                return hasil_message(self, payload)
            uid = norm_user_id(data)
            lama = baca_data(uid, "target", self.db_path) or []
            daftar, peringatan, aksi = proses_target(data, lama)
            simpan_data(uid, "target", daftar, self.db_path)
            payload = {
                "status": "ok",
                "pesan": f"{len(daftar)} target tersimpan (aksi: {aksi}).",
                "user_id": uid,
                "target": [
                    {k: t[k] for k in ("nama", "kategori", "harga", "sumber_harga", "target_bulan", "metode", "prioritas")}
                    for t in daftar
                ],
                "peringatan": peringatan,
                "langkah_berikutnya": "Jalankan analisis_keuangan_mycita untuk melihat simulasi pencapaian.",
            }
        except Exception as e:  # noqa: BLE001
            payload = galat(str(e))
        return hasil_message(self, payload)
