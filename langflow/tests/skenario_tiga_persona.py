"""Menjalankan file contoh_input bernomor sesuai urutan flow (1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 8) untuk ketiga persona,
lalu mencocokkan angka kunci dengan yang dipakai di pitch deck dan prototipe."""
import json, os, tempfile, importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
os.chdir(ROOT)
# stub Langflow agar komponen bisa diuji tanpa server (sama seperti tests/test_components.py)
exec((ROOT / "tests" / "test_components.py").read_text().split("def load(fn):")[0])
def load(fn):
    spec = importlib.util.spec_from_file_location(fn[:-3], ROOT / "components" / fn); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
P, K, T, A, KR, U, H = (load(f) for f in ["1_mycita_profil.py", "2_mycita_keuangan.py", "3_mycita_target.py", "4_mycita_analisis.py", "5_mycita_karier.py", "6_mycita_usaha.py", "8_mycita_hapus_data.py"])
DB = os.path.join(tempfile.mkdtemp(), "skenario.db")
FLOW = {1: (P, "MyCITAProfil", "simpan_profil_mycita"), 2: (K, "MyCITAKeuangan", "simpan_keuangan_mycita"), 3: (T, "MyCITATarget", "kelola_target_mycita"),
        4: (A, "MyCITAAnalisis", "analisis_keuangan_mycita"), 5: (KR, "MyCITAKarier", "eksplorasi_karier_mycita"),
        6: (U, "MyCITAUsaha", "eksplorasi_usaha_mycita"), 8: (H, "MyCITAHapusData", "hapus_data_mycita")}
def jalankan(nama_file):
    no = int(nama_file.split("_")[0]); mod, cls, meth = FLOW[no]
    teks = (ROOT / "contoh_input" / nama_file).read_text()
    return json.loads(getattr(getattr(mod, cls)(input_json=teks, db_path=DB), meth)().text)
def waktu(r): return {t["nama"]: t["opsi_a_menabung"]["waktu_tercapai"] for t in r["target"]}
def cek(label, nyata, harap):
    ok = nyata == harap; print(f"  {'OK ' if ok else 'BEDA'} {label}: {nyata}" + ("" if ok else f" (harapan {harap})")); return ok

semua = True
print("BUDI · career switch")
for f in ["1_profil_budi.json", "2_keuangan_budi.json", "3_target_budi.json"]: assert jalankan(f)["status"] == "ok", f
r = jalankan("4_analisis_budi.json"); semua &= cek("skor", r["dashboard"]["skor_kesehatan"], 100); semua &= cek("mobil (tetap kerja)", waktu(r)["Mobil"], "22 tahun 1 bulan")
k = jalankan("5_karier_budi.json"); semua &= cek("rekomendasi #1", (k["rekomendasi"][0]["profesi"], k["rekomendasi"][0]["skor_kecocokan"]), ("Data Scientist", 71))
ds = next(h for h in k["rekomendasi"] if h["id"] == "data_scientist")
(ROOT / "contoh_input" / "4_simulasi_jalur_data_scientist_budi.json").write_text(json.dumps({"user_id": "budi", "simulasi": ds["simulasi_siap_pakai"]}, ensure_ascii=False, indent=2) + "\n")
r = jalankan("4_simulasi_jalur_data_scientist_budi.json"); semua &= cek("mobil (jalur Data Scientist)", r["perbandingan"]["sesudah"]["target"]["Mobil"], "5 tahun 6 bulan")
u = jalankan("6_usaha_budi.json"); semua &= cek("usaha #1", (u["rekomendasi"][0]["usaha"], u["rekomendasi"][0]["skor_kecocokan"]), ("Kopi keliling", 80))
for f_, h_ in [("4_simulasi_usaha_kopi_budi.json", "4 tahun 8 bulan"), ("4_simulasi_data_scientist_plus_usaha_pesimis_budi.json", "4 tahun 1 bulan"), ("4_simulasi_data_scientist_plus_usaha_budi.json", "3 tahun 4 bulan")]:
    semua &= cek(f_[12:-10], jalankan(f_)["perbandingan"]["sesudah"]["target"]["Mobil"], h_)

print("AGUS · usaha keluarga + rumah")
for f in ["1_profil_agus.json", "2_keuangan_agus.json", "3_target_agus.json"]: assert jalankan(f)["status"] == "ok", f
r = jalankan("4_analisis_agus.json"); semua &= cek("skor", r["dashboard"]["skor_kesehatan"], 84); semua &= cek("A rumah", waktu(r)["Rumah"], "22 tahun 2 bulan")
for f, h in [("4_skenario_agus_B_bengkel.json", "10 tahun"), ("4_skenario_agus_C_kelontong.json", "14 tahun 8 bulan"),
             ("4_skenario_agus_D_gabungan.json", "8 tahun 8 bulan"), ("4_skenario_agus_E_rumah_515jt.json", "7 tahun")]:
    semua &= cek(f[11:-5], waktu(jalankan(f))["Rumah"], h)

print("DINI · career discovery")
for f in ["1_profil_dini.json", "2_keuangan_dini.json"]: assert jalankan(f)["status"] == "ok", f
r = jalankan("4_analisis_dini.json"); semua &= cek("skor", r["dashboard"]["skor_kesehatan"], 59); semua &= cek("sisa", r["dashboard"]["sisa"], 150000)
k = jalankan("5_karier_dini.json"); semua &= cek("karier", [(h["profesi"], h["skor_kecocokan"]) for h in k["rekomendasi"]], [("Data Analyst", 75), ("Software Engineer", 73), ("UI/UX Designer", 73)])
semua &= cek("jurusan", [(j["jurusan"], j["skor_kecocokan"]) for j in k["rekomendasi_jurusan"][:2]], [("S1 Sistem Informasi", 90), ("S1 Teknik Informatika / Ilmu Komputer", 89)])

print("RESET")
for f in ["8_hapus_budi.json", "8_hapus_agus.json", "8_hapus_dini.json"]: print(" ", jalankan(f)["pesan"])
print("SEMUA COCOK DENGAN DECK" if semua else "ADA ANGKA BERBEDA")
