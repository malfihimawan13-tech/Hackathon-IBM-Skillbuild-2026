import sys, json, copy
sys.path.insert(0, ".")
exec(open("harness.py").read())
I = "../zipx/myCITA_Hackathon/langflow/contoh_input/"
J = lambda f: json.load(open(I + f, encoding="utf-8"))
F = "../final/"
cls = lambda mod, pref: [n for n in dir(mod) if n.startswith(pref)][0]
A = load("fa", F + "4_mycita_analisis_v1.6.0.py"); K = load("fk", F + "5_mycita_karier_v1.5.0.py"); U = load("fu", F + "6_mycita_usaha_v1.2.0.py")
m = {n: load("c" + n, COMP + f) for n, f in (("1", "1_mycita_profil.py"), ("2", "2_mycita_keuangan.py"), ("3", "3_mycita_target.py"))}
def callm(k, d):
    mod = m[k]; c = cls(mod, "MyCITA"); meth = [n for n in dir(getattr(mod, c)) if "_mycita" in n and callable(getattr(getattr(mod, c), n))][0]
    return run(mod, c, meth, json.dumps(d))
def ana(d): return run(A, cls(A, "MyCITA"), "analisis_keuangan_mycita", json.dumps(d))
for u in ("budi", "agus", "dini"):
    for k, p in (("1", "1_profil_"), ("2", "2_keuangan_")): callm(k, J(p + u + ".json"))
for u in ("budi", "agus"): callm("3", J("3_target_" + u + ".json"))
run(K, cls(K, "MyCITA"), [n for n in dir(getattr(K, cls(K, "MyCITA"))) if "karier" in n and callable(getattr(getattr(K, cls(K, "MyCITA")), n))][0], json.dumps(J("5_karier_budi.json")))
run(U, cls(U, "MyCITA"), [n for n in dir(getattr(U, cls(U, "MyCITA"))) if "usaha" in n and callable(getattr(getattr(U, cls(U, "MyCITA")), n))][0], json.dumps(J("6_usaha_budi.json")))
def waktu(r, nama):
    for t in r["target"]:
        if t["nama"].lower() == nama.lower(): return (t.get("opsi_a_menabung") or {}).get("waktu_tercapai") or "-"
    return "?"
def bln(r, nama):
    for t in r["target"]:
        if t["nama"].lower() == nama.lower(): return (t.get("opsi_a_menabung") or {}).get("waktu_tercapai_bulan")
out = {}
# ===== BUDI =====
base = ana({"user_id": "budi"})
rows = [("Dasar (tanpa perubahan)", base)]
print("BUDI dasar", waktu(base, "Menikah"), waktu(base, "Mobil"), base["dashboard"]["skor_kesehatan"], base["dashboard"]["sisa"])
tab = []
def add(grp, label, r, targets):
    tab.append((grp, label, [waktu(r, t) for t in targets], r["dashboard"]["skor_kesehatan"], r["dashboard"]["sisa"]))
add("Dasar", "Tanpa perubahan", base, ("Menikah", "Mobil"))
for pct in (-10, 10):
    add("Penghasilan", f"Penghasilan {pct:+d}%", ana({"user_id": "budi", "simulasi": {"perubahan_penghasilan": round(7500000 * pct / 100)}}), ("Menikah", "Mobil"))
for nk in (0, 3, 6, 10):
    add("Kenaikan harga mobil per tahun", f"{nk}%/tahun", ana({"user_id": "budi", "asumsi": {"kenaikan_harga_persen": {"mobil": nk}}}), ("Menikah", "Mobil"))
for ig in (0, 3.2, 6):
    add("Inflasi umum", f"{ig}%", ana({"user_id": "budi", "asumsi": {"inflasi_umum_persen": ig, "kenaikan_harga_persen": {"default": ig, "menikah": ig, "mobil": ig}}}), ("Menikah", "Mobil"))
for gaji_awal, lab in ((7000000, "batas bawah Rp7 jt"), (9000000, "nilai tengah Rp9 jt"), (11000000, "batas atas Rp11 jt")):
    jd = [{"mulai_bulan": 0, "penghasilan": 7500000}, {"mulai_bulan": 4, "penghasilan": gaji_awal}, {"mulai_bulan": 28, "penghasilan": 11750000}, {"mulai_bulan": 64, "penghasilan": 27500000}]
    add("Gaji awal Data Scientist", lab, ana({"user_id": "budi", "simulasi": {"jadwal_pendapatan": jd}}), ("Menikah", "Mobil"))
for sk in ("pesimis", "moderat", "optimis"):
    r = ana({"user_id": "budi", "simulasi": {"gabung": {"profesi": "Data Scientist", "usaha": "kopi keliling", "skenario": sk}}})
    pj = r.get("perbandingan_jalur") or {}
    g = pj.get("gabungan") or {}
    tg = g.get("target") or {}
    tab.append(("Skenario usaha kopi (gabung dengan karier)", sk, [tg.get("Menikah", "?"), tg.get("Mobil", "?")], g.get("skor"), g.get("sisa")))
out["budi"] = tab
for t in tab: print("BUDI", t)
# ===== AGUS =====
tab = []
base = ana({"user_id": "agus"})
add2 = lambda grp, label, r: tab.append((grp, label, [waktu(r, "Rumah")], r["dashboard"]["skor_kesehatan"], r["dashboard"]["sisa"]))
add2("Dasar", "Tanpa perubahan", base)
for pct in (0, 10, 20, 30):
    r = ana({"user_id": "agus", "simulasi": {"pengembangan_usaha": [{"nama": "bengkel", "kenaikan_persen": pct}]}})
    pb = r.get("perbandingan_usaha_berjalan") or {}
    row = (pb.get("skenario") or {}).get("semua_usaha") or {}
    tab.append(("Kenaikan laba usaha", f"+{pct}% (semua usaha digabung)", [(row.get("target") or {}).get("Rumah", "?")], row.get("skor"), row.get("sisa")))
for nk in (2, 4, 6, 8):
    add2("Kenaikan harga rumah per tahun", f"{nk}%/tahun", ana({"user_id": "agus", "asumsi": {"kenaikan_harga_persen": {"rumah": nk}}}))
for pct in (-10, 10):
    add2("Penghasilan", f"Penghasilan {pct:+d}%", ana({"user_id": "agus", "simulasi": {"perubahan_penghasilan": round(16200000 * pct / 100)}}))
for p in (0, 3, 5):
    add2("Imbal hasil tabungan", f"{p}%/tahun", ana({"user_id": "agus", "asumsi": {"imbal_hasil_tabungan_persen": p}}))
out["agus"] = tab
for t in tab: print("AGUS", t)
json.dump(out, open("../sens/hasil_sens.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1, default=str)
