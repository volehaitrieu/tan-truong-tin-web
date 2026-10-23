"""Trích DỮ LIỆU THỬ từ file Excel của chủ shop → scripts/du-lieu-thu.json (chỉ vài SP mỗi danh mục).
- KHO XHD: CHỈ đọc sheet DMHH (không đọc TON KHO). Giá DMHH tính bằng đồng.
- File quạt: sheet Import_SanPham. Giá tính bằng nghìn đồng → × 1.000. Bỏ dòng thiếu SKU.
Chạy: python -I scripts/trich-du-lieu-thu.py "<KHO XHD.xlsx>" "<Quạt.xlsx>"
Chỉ dùng thư viện chuẩn (đọc xlsx bằng zipfile + xml)."""
import json, re, sys, unicodedata, zipfile
import xml.etree.ElementTree as ET

PER_SUB = 4  # số SP lấy cho mỗi danh mục con
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
      "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}


def read_sheet(path, name):
    z = zipfile.ZipFile(path)
    shared = []
    if "xl/sharedStrings.xml" in z.namelist():
        for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall("m:si", NS):
            shared.append("".join(t.text or "" for t in si.iter("{%s}t" % NS["m"])))
    rels = {r.get("Id"): r.get("Target") for r in ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))}
    target = None
    for s in ET.fromstring(z.read("xl/workbook.xml")).find("m:sheets", NS):
        if s.get("name") == name:
            t = rels[s.get("{%s}id" % NS["r"])].lstrip("/")
            target = t if t.startswith("xl/") else "xl/" + t
    out = []
    for row in ET.fromstring(z.read(target)).iter("{%s}row" % NS["m"]):
        cells = {}
        for c in row.findall("m:c", NS):
            col = 0
            for ch in re.match(r"[A-Z]+", c.get("r")).group(0):
                col = col * 26 + ord(ch) - 64
            v = c.find("m:v", NS)
            if c.get("t") == "inlineStr":
                cells[col - 1] = "".join(x.text or "" for x in c.iter("{%s}t" % NS["m"]))
            elif v is not None:
                cells[col - 1] = shared[int(v.text)] if c.get("t") == "s" else v.text
        if cells:
            out.append([str(cells.get(i, "")).strip() for i in range(max(cells) + 1)])
    return out


def plain(s):
    s = unicodedata.normalize("NFD", s.lower()).replace("đ", "d")
    return re.sub(r"\s+", " ", "".join(ch for ch in s if unicodedata.category(ch) != "Mn"))


def to_sku(raw, used):
    s = re.sub(r"[^A-Z0-9-]+", "-", plain(raw).upper().replace(" ", "-")).strip("-")[:40] or "SP"
    base, n = s, 2
    while s in used:
        s = f"{base[:36]}-{n}"
        n += 1
    used.add(s)
    return s


def num(v):
    try:
        return int(round(float(str(v).replace(",", "."))))
    except ValueError:
        return 0


# Thứ tự quan trọng: luật cụ thể đứng trước. (từ khóa không dấu, danh mục con)
RULES = [
    (r"^(ong nhua|ong pvc|ong ppr|ong hdpe)", "ong-pvc"),
    (r"^(van |co (pvc|ren|nhua)|te (pvc|nhua)|noi (ren|pvc)|ba chac|kep ong)", "van-co-noi"),
    (r"^(bang tan|keo dan ong|keo pvc)", "bang-tan-keo"),
    (r"^cong tac", "cong-tac"),
    (r"^(o cam|o day)", "o-cam"),
    (r"^(cb |aptomat|cau dao|bo ngat mach)", "cb-aptomat"),
    (r"^(day dien|day don).*(2x|2 x| doi)", "day-doi"),
    (r"^(day dien|day don)", "day-don"),
    (r"^cap (dien|dong|dien luc)", "cap-dien"),
    (r"^(bong den|bong led)", "bong-led"),
    (r"^(den tuyp|bo den tuyp|tuyp led)", "den-tuyp"),
    (r"^(den op|den tran|den ban)", "den-op-tran"),
    (r"^(may khoan|pin may khoan|mui khoan)", "may-khoan"),
    (r"^(kem |kim |co le|mo let)", "kim-co-le"),
    (r"^(tua vit|tuoc no vit)", "tua-vit"),
    (r"^(bu ?long|oc vit|dinh |vit |tac ke)", "vit-bulong"),
    (r"^keo ", "keo-dan"),
    (r"^bang keo", "bang-keo"),
    (r"^(binh dun|am dun|am sieu toc)", "am-binh-dun"),
    (r"^(noi |chao |bep )", "do-bep"),
    (r"^(choi (?!than)|ban chai|cay lau|xo )", "ve-sinh"),
]
BRANDS = ["Bình Minh", "Tiền Phong", "Cadivi", "Panasonic", "Rạng Đông", "Điện Quang", "Hali", "Senko", "Asia", "Makita",
          "Bosch", "Tombo", "Miha", "Midea", "Sunhouse", "Toshiba", "Sharp", "Vinaka", "Tolsen", "Hinoki", "Saiko",
          "Kim Cương", "Sino", "Senka", "Zenlock", "Lion", "Bogo-Shin", "Rveda", "Tomika", "Ultra", "Vcmo", "Lifan", "Mitsubishi", "Kangaroo", "Minh Thuận", "Gofurther", "Philips", "Comet", "Lioa"]


def brand_of(name):
    p = plain(name)
    for b in BRANDS:
        if re.search(r"\b" + re.escape(plain(b)) + r"\b", p):
            return b
    return None


def main(kho, quat):
    used, out = set(), []
    # ---- DMHH (bỏ quạt vì đã có file quạt riêng) ----
    rows = read_sheet(kho, "DMHH")
    head = next(i for i, r in enumerate(rows) if r and r[0] == "STT")
    count, seen = {}, set()
    for r in rows[head + 1:]:
        if len(r) < 7:
            continue
        code, name, unit, price = r[3], r[4], r[5] or "Cái", num(r[6])
        if not name or not (1000 <= price <= 50_000_000) or plain(name) in seen:
            continue
        p = plain(name)
        sub = next((s for rx, s in RULES if re.search(rx, p)), None)
        if not sub or count.get(sub, 0) >= PER_SUB:
            continue
        count[sub] = count.get(sub, 0) + 1
        seen.add(p)
        out.append({"sku": to_sku(code or name, used), "name": name, "unit": unit[:1].upper() + unit[1:], "price": price,
                    "sub": sub, "brand": brand_of(name), "source": f"DMHH:{code}"})

    # ---- Quạt ----
    rows = read_sheet(quat, "Import_SanPham")
    h = {k: i for i, k in enumerate(rows[0])}
    sub_of = {"Quạt treo tường": "quat-treo-tuong", "Quạt đứng": "quat-dung", "Quạt lửng": "quat-lung", "Quạt sàn": "quat-san",
              "Quạt bàn": "quat-ban", "Quạt trần": "quat-tran", "Quạt hộp": "quat-hop", "Quạt hút / thông gió": "quat-hut"}
    g = lambda r, k: r[h[k]] if h.get(k) is not None and h[k] < len(r) else ""
    qcount = {}
    for r in rows[1:]:
        sku, cat = g(r, "SKU"), g(r, "Danh mục").replace("Quạt > ", "")
        sub = sub_of.get(cat)
        if not sku or not sub or qcount.get(sub, 0) >= 2 or num(g(r, "Giá bán")) <= 0:
            continue
        qcount[sub] = qcount.get(sub, 0) + 1
        attrs = {k: v for k, v in {
            "loai": cat, "sai_canh": g(r, "Sải cánh"), "so_canh": g(r, "Số cánh"), "cong_suat": g(r, "Công suất"),
            "luu_luong": g(r, "Lưu lượng gió"), "toc_do": g(r, "Tốc độ gió"), "dieu_khien": g(r, "Điều khiển"),
            "dien_ap": g(r, "Điện áp")}.items() if v}
        out.append({
            "sku": to_sku(sku, used), "name": g(r, "Tên sản phẩm"), "unit": (g(r, "Đơn vị") or "cái").capitalize(),
            "price": num(g(r, "Giá bán")) * 1000, "cost": num(g(r, "Giá nhập")) * 1000 or None,
            "min_qty": num(g(r, "Ngưỡng tối thiểu")), "sub": sub, "brand": g(r, "Thương hiệu") or brand_of(g(r, "Tên sản phẩm")),
            "spec": " · ".join(x for x in [g(r, "Sải cánh"), g(r, "Công suất"), g(r, "Điều khiển")] if x)[:120],
            "attributes": attrs, "warranty": g(r, "Bảo hành") or None, "origin": g(r, "Xuất xứ") or None, "source": "QUAT:" + sku,
        })
    json.dump(out, open("scripts/du-lieu-thu.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    by = {}
    for x in out:
        by[x["sub"]] = by.get(x["sub"], 0) + 1
    print(f"{len(out)} SP thử:", by)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
