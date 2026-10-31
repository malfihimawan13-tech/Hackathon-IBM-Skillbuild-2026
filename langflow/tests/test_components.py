import sys, types, json, importlib.util, os, tempfile
from pathlib import Path

# --- stub modul langflow agar komponen bisa diuji tanpa Langflow ---
sys.modules["langflow"] = types.ModuleType("langflow")
cust = types.ModuleType("langflow.custom")


class Component:
    def __init__(self, **kw):
        for k, v in kw.items():
            setattr(self, k, v)
        self.status = ""


cust.Component = Component
sys.modules["langflow.custom"] = cust
io = types.ModuleType("langflow.io")


class _In:
    def __init__(self, **kw):
        self.__dict__.update(kw)


io.MessageTextInput = io.Output = io.StrInput = _In
sys.modules["langflow.io"] = io
sys.modules["langflow.schema"] = types.ModuleType("langflow.schema")
msg = types.ModuleType("langflow.schema.message")


class Message:
    def __init__(self, text=""):
        self.text = text


msg.Message = Message
sys.modules["langflow.schema.message"] = msg


def load(fn):
    spec = importlib.util.spec_from_file_location(fn.replace(".py", ""), f"components/{fn}")
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


db = os.path.join(tempfile.mkdtemp(), "t.db")
P, K, T, A, H = (load(f) for f in ["1_mycita_profil.py", "2_mycita_keuangan.py", "3_mycita_target.py",
                                     "4_mycita_analisis.py", "8_mycita_hapus_data.py"])


METHOD={"MyCITAProfil":"simpan_profil_mycita","MyCITAKeuangan":"simpan_keuangan_mycita","MyCITATarget":"kelola_target_mycita","MyCITAAnalisis":"analisis_keuangan_mycita","MyCITAHapusData":"hapus_data_mycita"}

def run(mod, cls, inp):
    if inp.endswith(".json"):
        inp = Path(f"tests/fixtures/{inp}").read_text()
    return json.loads(getattr(mod, cls)(input_json=inp, db_path=db).__getattribute__(METHOD[cls])().text)


r = run(P, "MyCITAProfil", "1_profil_budi.json"); print("PROFIL", json.dumps(r, ensure_ascii=False)); assert r["status"] == "ok"
r = run(K, "MyCITAKeuangan", "2_keuangan_budi.json"); print("KEUANGAN", json.dumps(r, ensure_ascii=False)); assert r["status"] == "ok"
r = run(T, "MyCITATarget", "3_target_budi.json"); print("TARGET", json.dumps(r, ensure_ascii=False)); assert r["status"] == "ok"
r = run(T, "MyCITATarget", "6_cari_harga.json"); print("HARGA", json.dumps(r, ensure_ascii=False)[:500])
r = run(A, "MyCITAAnalisis", "4_analisis_budi.json"); assert r["status"] == "ok", r
Path("tests/out_analisis.json").write_text(json.dumps(r, ensure_ascii=False, indent=2))
r = run(A, "MyCITAAnalisis", "5_simulasi_what_if_budi.json"); assert r["status"] == "ok", r
Path("tests/out_simulasi.json").write_text(json.dumps(r, ensure_ascii=False, indent=2))
# what-if dengan target hipotetis via nama saja (harga dari referensi)
r = run(A, "MyCITAAnalisis", '{"user_id":"budi","simulasi":{"target":{"nama":"Honda Vario","target_tahun":1}}}')
print("WHATIF VARIO", r["ringkasan"])
r = run(A, "MyCITAAnalisis", '{"user_id":"budi","simulasi":{"target":{"nama":"Rumah subsidi Bogor","target_tahun":3}}}')
print("WHATIF RUMAH", r["ringkasan"])
r = run(T, "MyCITATarget", '{"user_id":"budi","aksi":"tambah","target":{"nama":"Rumah di BSD","target_tahun":10}}')
print("TARGET TANPA HARGA", r["peringatan"])
r = run(H, "MyCITAHapusData", '{"user_id":"budi"}'); print("HAPUS TANPA KONFIRMASI", r["status"])
r = run(H, "MyCITAHapusData", "7_hapus_budi.json"); print("HAPUS", r)
print("SETELAH HAPUS", run(A, "MyCITAAnalisis", '{"user_id":"budi"}')["status"])
print("ERR", run(A, "MyCITAAnalisis", "bukan json"))
print("ANGKA", [P.angka(x) for x in ["Rp 7.000.000", "7 juta", "7,5jt", "500rb", "1,2 miliar", 3000000, "2.500.000,50"]])
# kasus sisa negatif & menikah dengan anak
run(P, "MyCITAProfil", '{"user_id":"sari","nama":"Sari","status_pernikahan":"menikah","pekerjaan":[{"nama":"Guru","penghasilan":"4 juta"}],"pasangan":{"nama":"Andi","penghasilan":"3,5 juta"},"anak":[{"usia":2}]}')
run(K, "MyCITAKeuangan", '{"user_id":"sari","pengeluaran":{"makan":"4 juta","sewa kontrakan":"2jt","susu anak":"1,5jt","nongkrong":"800rb"},"hutang":[{"nama":"Pinjol A","jenis":"pinjol","sisa_pokok":"5jt","cicilan_bulanan":"1,2jt"}]}')
r = run(A, "MyCITAAnalisis", '{"user_id":"sari"}')
print("SARI", r["ringkasan"]); print("REK", json.dumps(r["rekomendasi_utama"], ensure_ascii=False, indent=1))
print("OK SEMUA TES")
