"""
myCITA (My Career, Income, Target & Achievement) - Komponen Profil
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

# ---------------------------- myCITA PROFIL ----------------------------
PSIKOLOGI_PERTANYAAN = {
    "impulsif": "Saya sering membeli barang yang tidak saya rencanakan sebelumnya.",
    "fomo": "Saya merasa perlu mengikuti tren atau gaya hidup teman agar tidak ketinggalan.",
    "menghindar": "Saya menghindari mengecek saldo atau tagihan karena merasa cemas.",
    "emosional": "Belanja adalah cara saya meredakan stres atau memberi hadiah untuk diri sendiri.",
    "terlalu_hemat": "Saya merasa bersalah setiap mengeluarkan uang, bahkan untuk kebutuhan.",
    "disiplin": "Saya punya catatan atau anggaran bulanan yang saya patuhi.",
}

PSIKOLOGI_TIPE = {
    "impulsif": ("Si Spontan", "Terapkan aturan tunggu 48 jam sebelum membeli barang non-kebutuhan, dan pisahkan rekening tabungan dari rekening belanja."),
    "fomo": ("Si Ikut Arus", "Tetapkan pos 'gaya hidup' yang jelas tiap bulan; di luar pos itu, ingatkan diri pada tujuan besarmu."),
    "menghindar": ("Si Penghindar", "Mulai dari kebiasaan kecil: cek saldo 5 menit tiap Minggu. Angka yang dilihat jauh lebih ringan daripada yang dibayangkan."),
    "emosional": ("Si Pereda Stres", "Kenali pemicunya dan siapkan alternatif tanpa biaya (jalan sore, olahraga, ngobrol). Sediakan budget self-reward kecil yang terencana."),
    "terlalu_hemat": ("Si Super Hemat", "Hemat itu baik, tetapi alokasikan dana untuk kesehatan dan kesejahteraan diri tanpa rasa bersalah, karena itu bagian dari rencana."),
    "seimbang": ("Si Seimbang", "Pertahankan kebiasaanmu dan fokuskan energi untuk mempercepat tujuan besar."),
}


def _norm_status(v) -> str:
    s = str(v or "").lower()
    if any(k in s for k in ("belum", "single", "lajang", "sendiri")):
        return "single"
    if any(k in s for k in ("menikah", "married", "kawin", "nikah")):
        return "menikah"
    if any(k in s for k in ("cerai", "duda", "janda")):
        return "cerai"
    return "single" if not s else "lainnya"


def _norm_jenis_kerja(v) -> str:
    s = str(v or "").lower().replace("-", " ").replace("_", " ")
    if "free" in s or "lepas" in s:
        return "freelance"
    if "part" in s or "paruh" in s:
        return "part_time"
    if "usaha" in s or "bisnis" in s or "wira" in s or "dagang" in s:
        return "usaha"
    if "full" in s or "tetap" in s or "penuh" in s or "kontrak" in s or not s:
        return "full_time"
    return "lainnya"


def _hitung_usia(d: dict):
    if d.get("usia") not in (None, ""):
        return int(angka(d.get("usia")))
    tl = str(d.get("tanggal_lahir") or "").strip()
    if tl:
        try:
            lahir = datetime.strptime(tl[:10], "%Y-%m-%d").date()
            hari_ini = date.today()
            return hari_ini.year - lahir.year - ((hari_ini.month, hari_ini.day) < (lahir.month, lahir.day))
        except ValueError:
            pass
    if d.get("tahun_lahir"):
        return date.today().year - int(angka(d.get("tahun_lahir")))
    return None


def _nilai_psikologi(jawaban: dict):
    if not isinstance(jawaban, dict) or not jawaban:
        return None
    skor = {}
    for k in PSIKOLOGI_PERTANYAAN:
        if k in jawaban:
            skor[k] = max(1, min(5, int(angka(jawaban[k], 3))))
    if not skor:
        return None
    negatif = {k: v for k, v in skor.items() if k != "disiplin"}
    dominan = max(negatif, key=negatif.get) if negatif else None
    kunci = dominan if dominan and negatif[dominan] >= 4 else "seimbang"
    nama_tipe, saran = PSIKOLOGI_TIPE[kunci]
    return {
        "skor": skor,
        "tipe": kunci,
        "nama_tipe": nama_tipe,
        "saran_kebiasaan": saran,
        "disiplin_anggaran": skor.get("disiplin", 3) >= 4,
        "skala": "1 = sangat tidak setuju, 5 = sangat setuju",
    }


def proses_profil(d: dict):
    peringatan = []
    status = _norm_status(d.get("status_pernikahan") or d.get("status"))

    pekerjaan = []
    for i, p in enumerate(d.get("pekerjaan") or [], start=1):
        if not isinstance(p, dict):
            continue
        jenis = _norm_jenis_kerja(p.get("jenis"))
        rata = angka(p.get("penghasilan"))
        minimum = angka(p.get("penghasilan_min"), default=-1)
        if minimum < 0:
            if jenis in ("freelance", "usaha", "part_time"):
                minimum = rata * 0.75
                peringatan.append(
                    f"Pekerjaan '{p.get('nama') or i}' berpenghasilan tidak tetap; myCITA memakai 75% dari rata-rata "
                    "sebagai angka konservatif. Isi 'penghasilan_min' agar lebih akurat."
                )
            else:
                minimum = rata
        pekerjaan.append({
            "nama": p.get("nama") or f"Pekerjaan {i}",
            "jenis": jenis,
            "lama_kerja_bulan": int(angka(p.get("lama_kerja_bulan"))),
            "penghasilan": bulat(rata),
            "penghasilan_konservatif": bulat(min(minimum, rata)),
        })
    if not pekerjaan:
        peringatan.append("Belum ada data pekerjaan/penghasilan.")

    tambahan = []
    for t in d.get("pendapatan_tambahan") or []:
        if isinstance(t, dict) and angka(t.get("nominal")) > 0:
            tambahan.append({"sumber": t.get("sumber") or "Tambahan", "nominal": bulat(angka(t.get("nominal")))})

    pasangan = None
    if status == "menikah":
        ps = d.get("pasangan") or {}
        if not isinstance(ps, dict):
            ps = {"penghasilan": ps}
        pasangan = {"nama": ps.get("nama"), "penghasilan": bulat(angka(ps.get("penghasilan")))}

    anak_raw = d.get("anak")
    anak = []
    if isinstance(anak_raw, list):
        for a in anak_raw:
            a = a if isinstance(a, dict) else {"usia": a}
            anak.append({"usia": int(angka(a.get("usia"))), "kebutuhan": a.get("kebutuhan")})
    jumlah_anak = len(anak) if anak else int(angka(d.get("jumlah_anak")))
    tanggungan_lain = int(angka(d.get("jumlah_tanggungan")))

    total_utama = sum(p["penghasilan"] for p in pekerjaan)
    total_tambahan = sum(t["nominal"] for t in tambahan)
    penghasilan_pasangan = pasangan["penghasilan"] if pasangan else 0
    total = total_utama + total_tambahan + penghasilan_pasangan
    total_konservatif = sum(p["penghasilan_konservatif"] for p in pekerjaan) + total_tambahan + penghasilan_pasangan

    profil = {
        "nama": d.get("nama") or "Pengguna",
        "jenis_kelamin": d.get("jenis_kelamin"),
        "usia": _hitung_usia(d),
        "kota": d.get("kota") or d.get("domisili"),
        "pendidikan_terakhir": d.get("pendidikan_terakhir") or d.get("pendidikan"),
        "status_pernikahan": status,
        "pekerjaan": pekerjaan,
        "pendapatan_tambahan": tambahan,
        "pasangan": pasangan,
        "anak": anak,
        "jumlah_anak": jumlah_anak,
        "jumlah_tanggungan_lain": tanggungan_lain,
        "jumlah_tanggungan_total": jumlah_anak + tanggungan_lain,
        "penghasilan_tidak_tetap": any(p["jenis"] in ("freelance", "usaha", "part_time") for p in pekerjaan),
        "total_penghasilan_utama": total_utama,
        "total_pendapatan_tambahan": total_tambahan,
        "penghasilan_pasangan": penghasilan_pasangan,
        "total_penghasilan": total,
        "total_penghasilan_konservatif": total_konservatif,
        "psikologi": _nilai_psikologi(d.get("psikologi")),
    }
    return profil, peringatan


class MyCITAProfil(Component):
    display_name = "myCITA Profil"
    description = (
        "Menyimpan atau memperbarui profil finansial pengguna myCITA: data diri, status pernikahan, "
        "pekerjaan (bisa lebih dari satu), pendapatan tambahan, pasangan, anak, tanggungan, dan kuis "
        "psikologi keuangan opsional. Input berupa JSON dengan 'user_id'. Menghitung total penghasilan "
        "dan penghasilan konservatif. Tidak memberi saran; gunakan analisis_keuangan_mycita untuk analisis."
    )
    icon = "user"
    name = "MyCITAProfil"

    inputs = [
        MessageTextInput(
            name="input_json",
            display_name="Data Profil (JSON)",
            info='JSON profil, minimal {"user_id": "budi", "nama": "Budi", "pekerjaan": [...]}',
            tool_mode=True,
        ),
        StrInput(
            name="db_path",
            display_name="Lokasi Database",
            info="Kosongkan untuk memakai ~/.mycita/mycita.db. Harus sama di semua komponen myCITA.",
            value="",
            advanced=True,
        ),
    ]
    outputs = [Output(display_name="Hasil", name="hasil", method="simpan_profil_mycita")]

    def simpan_profil_mycita(self) -> Message:
        try:
            data = parse_input(self.input_json)
            uid = norm_user_id(data)
            profil, peringatan = proses_profil(data)
            simpan_data(uid, "profil", profil, self.db_path)
            payload = {
                "status": "ok",
                "pesan": f"Profil {profil['nama']} tersimpan.",
                "user_id": uid,
                "ringkasan": {
                    "nama": profil["nama"],
                    "usia": profil["usia"],
                    "status_pernikahan": profil["status_pernikahan"],
                    "jumlah_pekerjaan": len(profil["pekerjaan"]),
                    "total_penghasilan": profil["total_penghasilan"],
                    "total_penghasilan_konservatif": profil["total_penghasilan_konservatif"],
                    "jumlah_tanggungan": profil["jumlah_tanggungan_total"],
                    "tipe_psikologi": (profil["psikologi"] or {}).get("nama_tipe"),
                },
                "peringatan": peringatan,
                "langkah_berikutnya": "Isi data pengeluaran dan hutang dengan simpan_keuangan_mycita.",
            }
        except Exception as e:  # noqa: BLE001
            payload = galat(str(e))
        return hasil_message(self, payload)
