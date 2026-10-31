"""
myCITA (My Career, Income, Target & Achievement) - myCITA Komponen Pustaka Database (PDF)
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
from langflow.io import HandleInput, IntInput, MessageTextInput, Output, StrInput
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

# ---------------------------- myCITA PUSTAKA DATABASE (PDF) ----------------------------
# Membaca teks PDF Database Eksternal myCITA (dari komponen Read File) dan mencari bagian yang relevan
# dengan pertanyaan. Pencarian berbasis kata kunci: tanpa model AI, tanpa kuota API.
STOP_PUSTAKA = {"yang", "dan", "di", "ke", "dari", "untuk", "dengan", "atau", "apa", "berapa", "saja", "ada", "itu", "ini",
                "adalah", "dalam", "pada", "per", "the", "of", "a", "an", "is", "mana", "bagaimana", "gimana", "tolong",
                "cari", "data", "database", "mycita", "sumber", "info", "informasi", "saya", "aku", "kamu", "bisa", "berikan"}
SINONIM_PUSTAKA = {
    "gaji": ["gaji", "upah", "penghasilan", "salary"], "harga": ["harga", "otr", "biaya"], "ukt": ["ukt", "biaya kuliah", "bpp", "uang kuliah"],
    "modal": ["modal", "investasi awal"], "kampus": ["kampus", "universitas", "institut", "politeknik", "perguruan tinggi"],
    "motor": ["motor", "honda", "yamaha"], "mobil": ["mobil", "toyota", "daihatsu", "honda", "mitsubishi", "suzuki"],
    "jurusan": ["jurusan", "prodi", "program studi", "s1", "d3"], "umk": ["umk", "ump", "upah minimum"],
}


def _teks_dokumen(dok) -> str:
    if dok is None:
        return ""
    if isinstance(dok, list):
        return "\n\n".join(_teks_dokumen(x) for x in dok)
    for attr in ("text", "get_text"):
        v = getattr(dok, attr, None)
        if callable(v):
            try:
                v = v()
            except Exception:  # noqa: BLE001
                v = None
        if isinstance(v, str) and v.strip():
            return v
    data = getattr(dok, "data", None)
    if isinstance(data, dict):
        return str(data.get("text") or data.get("content") or json.dumps(data, ensure_ascii=False))
    to_md = getattr(dok, "to_markdown", None)  # DataFrame
    if callable(to_md):
        try:
            return to_md()
        except Exception:  # noqa: BLE001
            pass
    return str(dok)


def _jendela(teks: str, ukuran: int = 14, langkah: int = 7) -> list:
    """Potong teks per kelompok baris (tabel PDF sering terbaca satu sel per baris). Simpan nomor halaman."""
    baris, halaman, hal_saat_ini = [], [], None
    for l in teks.splitlines():
        l = l.strip()
        if not l:
            continue
        m = re.search(r"Halaman\s+(\d+)", l)
        if m:
            hal_saat_ini = int(m.group(1))
        baris.append(l); halaman.append(hal_saat_ini)
    out = []
    for i in range(0, max(1, len(baris) - ukuran + langkah), langkah):
        isi = baris[i:i + ukuran]
        if isi:
            luas = baris[max(0, i - 2): i + ukuran + 8]  # kutipan diperluas agar baris tabel tidak terpotong
            out.append({"mulai": i, "akhir": i + len(isi), "halaman": halaman[i] if halaman[i] is not None else None,
                        "teks": " | ".join(isi), "kutipan": " | ".join(luas)})
    return out


def _kata(teks: str) -> list:
    return [w for w in re.findall(r"[a-z0-9]+", teks.lower()) if w not in STOP_PUSTAKA and len(w) >= 2]


def cari_pustaka(teks: str, pertanyaan: str, jumlah: int = 5) -> dict:
    import math
    if not teks.strip():
        return {"status": "error", "pesan": "Dokumen PDF belum terbaca. Upload file myCITA_Database_Eksternal.pdf di komponen Read File, lalu jalankan lagi."}
    q = pertanyaan.lower()
    bobot = {w: 1.0 for w in _kata(q)}
    for daftar in SINONIM_PUSTAKA.values():
        if any(x in q for x in daftar):
            for w in _kata(" ".join(daftar)):
                bobot.setdefault(w, 0.3)
    if not bobot:
        return {"status": "error", "pesan": "Pertanyaan terlalu umum. Sebutkan kata kunci, misalnya 'gaji perawat', 'harga Toyota Agya', atau 'UKT Unpad'."}
    win = _jendela(teks)
    set_kata = [set(_kata(w["teks"])) for w in win]
    n = len(win)
    df = {}
    for sk in set_kata:
        for w in sk:
            df[w] = df.get(w, 0) + 1
    idf = {w: math.log((n + 1) / (df.get(w, 0) + 0.5)) for w in bobot}
    frasa = [w for w in re.findall(r"[a-z0-9]+", q) if w not in STOP_PUSTAKA]
    nilai = []
    for i, (w, sk) in enumerate(zip(win, set_kata)):
        cocok = [k for k in bobot if k in sk]
        if not any(bobot[k] == 1.0 for k in cocok):
            continue
        skor = sum(idf[k] * bobot[k] for k in cocok)
        low = w["teks"].lower()
        for x, y in zip(frasa, frasa[1:]):
            if f"{x} {y}" in low:
                skor += 2.0
        if (w["halaman"] or 0) <= 2:
            skor *= 0.4  # sampul, petunjuk, dan daftar isi
        nilai.append((skor, i))
    nilai.sort(key=lambda t: (-t[0], t[1]))
    dipilih = []
    for skor, i in nilai:
        if any(abs(win[i]["mulai"] - win[j]["mulai"]) < 10 for _, j in dipilih):
            continue  # hindari kutipan yang tumpang tindih
        dipilih.append((skor, i))
        if len(dipilih) >= max(1, jumlah):
            break
    top = [{"halaman_pdf": win[i]["halaman"], "skor_relevansi": round(skor, 2), "kutipan": win[i]["kutipan"]} for skor, i in dipilih]
    return {
        "status": "ok" if top else "tidak_ditemukan",
        "pertanyaan": pertanyaan,
        "hasil": top,
        "pesan": f"Ditemukan {len(top)} bagian relevan dari Database Eksternal myCITA (PDF)." if top else "Tidak ada bagian PDF yang cocok. Coba kata kunci lain.",
        "cara_memakai": "Kutipan berasal dari tabel PDF (sel dipisahkan '|'). Kutip angka dan sumber persis seperti tertulis. Jangan menghitung atau menambah angka di luar kutipan. Untuk perhitungan (waktu tercapai, cicilan, skor) gunakan flow analisis/karier/usaha.",
    }


class MyCITAPustaka(Component):
    display_name = "myCITA Pustaka Database"
    description = (
        "Mencari isi Database Eksternal myCITA (PDF) untuk pertanyaan referensi: daftar profesi dan gaji, skill, jurusan, "
        "perguruan tinggi dan UKT, harga kendaraan dan rumah, biaya hidup, inflasi, UMP/UMK, serta template usaha. "
        "Mengembalikan kutipan teks beserta sumber yang tertulis di PDF. Input: pertanyaan singkat berisi kata kunci. "
        "Tidak untuk perhitungan; gunakan flow analisis/karier/usaha untuk angka hasil simulasi."
    )
    icon = "book-open"
    name = "MyCITAPustaka"

    inputs = [
        HandleInput(name="dokumen", display_name="Dokumen PDF (dari Read File)", input_types=["Message", "Data", "DataFrame"],
                    info="Sambungkan output 'Raw Content' dari komponen Read File yang berisi myCITA_Database_Eksternal.pdf."),
        MessageTextInput(name="pertanyaan", display_name="Pertanyaan", tool_mode=True,
                         info="Contoh: 'gaji perawat', 'harga Toyota Agya', 'UKT Universitas Padjadjaran', 'modal warkop'."),
        IntInput(name="jumlah_hasil", display_name="Jumlah kutipan", value=5, advanced=True),
    ]
    outputs = [Output(display_name="Hasil", name="hasil", method="cari_database_mycita")]

    def cari_database_mycita(self) -> Message:
        try:
            teks = _teks_dokumen(self.dokumen)
            q = str(self.pertanyaan or "").strip()
            if q.startswith("{"):
                try:
                    q = str(json.loads(q).get("pertanyaan") or json.loads(q).get("query") or q)
                except Exception:  # noqa: BLE001
                    pass
            payload = cari_pustaka(teks, q, int(self.jumlah_hasil or 5))
        except Exception as e:  # noqa: BLE001
            payload = {"status": "error", "pesan": str(e)}
        return hasil_message(self, payload)
