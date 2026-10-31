"""
myCITA (My Career, Income, Target & Achievement) - Komponen Keuangan
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

# --------------------------- myCITA KEUANGAN ---------------------------
KATA_KEBUTUHAN = (
    "pokok", "makan", "dapur", "belanja_bulanan", "sembako", "listrik", "air", "pdam", "gas", "internet",
    "wifi", "pulsa", "kuota", "transport", "bensin", "bbm", "ojek", "parkir", "tol", "sewa", "kos",
    "kontrak", "pendidikan", "sekolah", "kuliah", "spp", "kesehatan", "obat", "bpjs", "asuransi",
    "anak", "susu", "popok", "orang_tua", "ortu", "iuran", "pajak", "zakat", "perpuluhan",
)
KATA_KEINGINAN = (
    "hiburan", "nongkrong", "kopi", "cafe", "jajan", "langganan", "streaming", "netflix", "spotify",
    "game", "hobi", "liburan", "jalan", "belanja_online", "shopping", "fashion", "baju", "skincare",
    "kosmetik", "gadget", "rokok", "self_reward", "makan_di_luar", "pesan_antar",
)
KATA_CICILAN = ("cicilan", "hutang", "utang", "angsuran", "kredit", "paylater", "pinjol")

BUNGA_DEFAULT_HUTANG = {  # % per tahun, dipakai hanya jika pengguna tidak mengisi bunga
    "kpr": 11.0,
    "kendaraan": 10.0,
    "kta": 14.0,
    "kartu_kredit": 21.0,
    "paylater": 30.0,
    "pinjol": 30.0,
    "keluarga": 0.0,
    "lainnya": 12.0,
}
HUTANG_BERBUNGA_TINGGI = ("kartu_kredit", "paylater", "pinjol")


def _kunci(s) -> str:
    return re.sub(r"[^a-z0-9]+", "_", str(s or "").lower()).strip("_")


def _klasifikasi(nama: str) -> str:
    k = _kunci(nama)
    if any(w in k for w in KATA_KEINGINAN):
        return "keinginan"
    if any(w in k for w in KATA_KEBUTUHAN):
        return "kebutuhan"
    return "lainnya"


def _norm_jenis_hutang(v) -> str:
    k = _kunci(v)
    if "kpr" in k or "rumah" in k or "kpa" in k:
        return "kpr"
    if any(w in k for w in ("motor", "mobil", "kendaraan", "leasing")):
        return "kendaraan"
    if "kartu" in k or "cc" == k or "credit_card" in k:
        return "kartu_kredit"
    if "paylater" in k or "pay_later" in k or "bnpl" in k:
        return "paylater"
    if "pinjol" in k or "pinjaman_online" in k or "p2p" in k:
        return "pinjol"
    if "kta" in k or "tanpa_agunan" in k:
        return "kta"
    if any(w in k for w in ("keluarga", "teman", "saudara", "ortu")):
        return "keluarga"
    return "lainnya"


def proses_keuangan(d: dict):
    peringatan = []
    raw = d.get("pengeluaran") or {}
    items = []
    if isinstance(raw, dict):
        items = [(k, v) for k, v in raw.items()]
    elif isinstance(raw, list):
        items = [((x.get("kategori") or x.get("nama")), x.get("nominal")) for x in raw if isinstance(x, dict)]

    hutang_raw = [h for h in (d.get("hutang") or []) if isinstance(h, dict)]
    pengeluaran, cicilan_dari_pengeluaran = [], 0
    for nama, nominal in items:
        n = angka(nominal)
        if n <= 0:
            continue
        if any(w in _kunci(nama) for w in KATA_CICILAN):
            if hutang_raw:
                peringatan.append(
                    f"Pos '{nama}' tidak dihitung di pengeluaran karena cicilan sudah dicatat di daftar hutang."
                )
            else:
                cicilan_dari_pengeluaran += n
            continue
        pengeluaran.append({"kategori": str(nama), "nominal": bulat(n), "jenis": _klasifikasi(nama)})

    hutang = []
    for i, h in enumerate(hutang_raw, start=1):
        jenis = _norm_jenis_hutang(h.get("jenis") or h.get("nama"))
        bunga_isi = h.get("bunga_tahunan")
        bunga = angka(bunga_isi, default=-1)
        bunga_asumsi = bunga < 0
        if bunga_asumsi:
            bunga = BUNGA_DEFAULT_HUTANG[jenis]
        hutang.append({
            "nama": h.get("nama") or f"Hutang {i}",
            "jenis": jenis,
            "sisa_pokok": bulat(angka(h.get("sisa_pokok"))),
            "cicilan_bulanan": bulat(angka(h.get("cicilan_bulanan"))),
            "bunga_tahunan_persen": round(bunga, 2),
            "bunga_adalah_asumsi": bunga_asumsi,
            "sisa_tenor_bulan": int(angka(h.get("sisa_tenor_bulan"))),
            "berbunga_tinggi": jenis in HUTANG_BERBUNGA_TINGGI or bunga >= 20,
        })
        if bunga_asumsi and jenis != "keluarga":
            peringatan.append(
                f"Bunga '{hutang[-1]['nama']}' belum diisi; myCITA memakai asumsi {bunga}%/tahun. Isi angka sebenarnya agar akurat."
            )
    if cicilan_dari_pengeluaran and not hutang:
        hutang.append({
            "nama": "Cicilan (tanpa rincian)", "jenis": "lainnya", "sisa_pokok": 0,
            "cicilan_bulanan": bulat(cicilan_dari_pengeluaran), "bunga_tahunan_persen": BUNGA_DEFAULT_HUTANG["lainnya"],
            "bunga_adalah_asumsi": True, "sisa_tenor_bulan": 0, "berbunga_tinggi": False,
        })
        peringatan.append("Cicilan dicatat tanpa rincian. Isi daftar 'hutang' agar myCITA bisa menyusun strategi pelunasan.")

    per_jenis = {"kebutuhan": 0, "keinginan": 0, "lainnya": 0}
    for p in pengeluaran:
        per_jenis[p["jenis"]] += p["nominal"]
    total_rutin = sum(per_jenis.values())
    total_cicilan = sum(h["cicilan_bulanan"] for h in hutang)

    keuangan = {
        "pengeluaran": sorted(pengeluaran, key=lambda x: -x["nominal"]),
        "pengeluaran_per_jenis": per_jenis,
        "total_pengeluaran_rutin": total_rutin,
        "hutang": hutang,
        "total_cicilan": total_cicilan,
        "total_sisa_hutang": sum(h["sisa_pokok"] for h in hutang),
        "total_pengeluaran": total_rutin + total_cicilan,
        "tabungan_saat_ini": bulat(angka(d.get("tabungan_saat_ini"))),
        "dana_darurat_saat_ini": bulat(angka(d.get("dana_darurat_saat_ini"))),
        "investasi_saat_ini": bulat(angka(d.get("investasi_saat_ini"))),
    }
    if total_rutin == 0:
        peringatan.append("Belum ada data pengeluaran.")
    return keuangan, peringatan


class MyCITAKeuangan(Component):
    display_name = "myCITA Keuangan"
    description = (
        "Menyimpan atau memperbarui data keuangan bulanan pengguna myCITA: daftar pengeluaran per kategori, "
        "daftar hutang/cicilan (KPR, kendaraan, kartu kredit, paylater, pinjol) beserta bunga dan sisa tenor, "
        "serta tabungan dan dana darurat saat ini. Input JSON dengan 'user_id'. Mengelompokkan pengeluaran "
        "menjadi kebutuhan/keinginan. Tidak memberi saran; gunakan analisis_keuangan_mycita untuk analisis."
    )
    icon = "wallet"
    name = "MyCITAKeuangan"

    inputs = [
        MessageTextInput(
            name="input_json",
            display_name="Data Keuangan (JSON)",
            info='JSON, contoh {"user_id": "budi", "pengeluaran": {"makan": 1500000}, "hutang": [...]}',
            tool_mode=True,
        ),
        StrInput(name="db_path", display_name="Lokasi Database", value="", advanced=True,
                 info="Kosongkan untuk memakai ~/.mycita/mycita.db. Harus sama di semua komponen myCITA."),
    ]
    outputs = [Output(display_name="Hasil", name="hasil", method="simpan_keuangan_mycita")]

    def simpan_keuangan_mycita(self) -> Message:
        try:
            data = parse_input(self.input_json)
            uid = norm_user_id(data)
            keuangan, peringatan = proses_keuangan(data)
            simpan_data(uid, "keuangan", keuangan, self.db_path)
            payload = {
                "status": "ok",
                "pesan": "Data keuangan tersimpan.",
                "user_id": uid,
                "ringkasan": {
                    "total_pengeluaran_rutin": keuangan["total_pengeluaran_rutin"],
                    "total_cicilan": keuangan["total_cicilan"],
                    "total_pengeluaran": keuangan["total_pengeluaran"],
                    "pengeluaran_per_jenis": keuangan["pengeluaran_per_jenis"],
                    "jumlah_hutang": len(keuangan["hutang"]),
                    "tabungan_saat_ini": keuangan["tabungan_saat_ini"],
                },
                "peringatan": peringatan,
                "langkah_berikutnya": "Isi target impian dengan simpan_target_mycita, lalu jalankan analisis_keuangan_mycita.",
            }
        except Exception as e:  # noqa: BLE001
            payload = galat(str(e))
        return hasil_message(self, payload)
