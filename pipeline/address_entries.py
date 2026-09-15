#!/usr/bin/env python3
"""
ADDRESS THE ENTRIES
Assigns an address to every corpus entry from CANON ONLY. Nothing invented.

Four canon sources, in priority order:
  1. OBSERVED   Lance narrated it during the release (canon addendum, 19)
  2. Axis       the nine emotional architectures, each with an address
  3. Family     anxiety / anger / shame families share their axis address
  4. Node       the 112-node master table

Usage: python3 pipeline/address_entries.py
"""
import re, html, json, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent

def mob():
    raw = (ROOT / "index.html").read_text(errors="ignore")
    raw = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", raw, flags=re.S | re.I)
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", raw)))

def build_lookup():
    t = mob()
    nodes = json.loads((ROOT / "pipeline/nodes.json").read_text())
    L, axes = {}, {}
    for m in re.finditer(r'Axis (\d{2}) ([A-Za-z ]+?) → ([A-Za-z ]+?) '
                         r'((?:[A-Z(]|Just )[^"]{3,150}?)(?:"([^"]*)"|Track pending)(.{0,500})', t):
        num, dys, coh, addr, track, tail = m.groups()
        addr = re.sub(r'·\s*ruled.*$', '', addr).strip(" ·")
        pm = re.search(r'Presents as ([^.]{5,220})\.', tail or "")
        presents = [w.strip() for w in pm.group(1).split(",")] if pm else []
        axes[int(num)] = {"dys": dys.strip(), "coh": coh.strip(), "address": addr}
        for w in [dys.strip()] + presents:
            w = w.strip().lower()
            if 2 < len(w) < 28:
                L.setdefault(w, {"address": addr, "src": f"Axis {int(num):02d}", "pole": coh.strip()})
    FAM = {"anxiety": "fear", "anger": "anger", "shame": "shame"}
    for m in re.finditer(r'The ([a-z]+) family[:\s]([^.]{10,240})\.', t):
        fam = m.group(1).lower()
        if fam in FAM and FAM[fam] in L:
            for w in re.split(r',|with its inward neighbour', m.group(2)):
                w = w.strip(" ,").lower()
                if 2 < len(w) < 28:
                    L.setdefault(w, {**L[FAM[fam]], "src": f"{fam} family"})
    for m in re.finditer(r'Cluster nodes[:\s]+([^.]{20,400})', t):
        for c in re.finditer(r'([A-Z][A-Za-z\- /]{2,28})\s*\(([^)]{3,80})\)', m.group(1)):
            L.setdefault(c.group(1).strip().lower(),
                         {"address": c.group(2).strip(), "src": "cluster node"})
    for n in nodes:
        L.setdefault(n["charge"].lower(),
                     {"address": n["nerve"], "src": f"node {n['n']}", "node": n["n"], "band": n["band"]})
    return L, axes

def main():
    L, axes = build_lookup()
    (ROOT / "pipeline/address_lookup.json").write_text(json.dumps(L, indent=1, sort_keys=True))
    e = json.loads((ROOT / "corpus/LETGO_ENTRY_INDEX.json").read_text())
    keys = sorted(L, key=len, reverse=True)
    hit = 0
    for x in e:
        blob = (x["entry"] + " " + x["text"][:900]).lower()
        x.pop("derived_address", None); x.pop("derived_from", None)
        if x.get("address"):
            x["address_tier"] = "OBSERVED"; hit += 1; continue
        for k in keys:
            if re.search(rf"\b{re.escape(k)}\b", blob):
                x["derived_address"] = L[k]; x["derived_from"] = k
                x["address_tier"] = "DERIVED"; hit += 1; break
        else:
            x["address_tier"] = "NONE"
    (ROOT / "corpus/LETGO_ENTRY_INDEX.json").write_text(json.dumps(e, indent=1))
    from collections import Counter
    c = Counter(x["address_tier"] for x in e)
    print(f"  canon terms carrying an address : {len(L)}")
    print(f"  axes parsed                     : {len(axes)} of 9")
    print(f"  entries addressed               : {hit} of {len(e)}  ({round(hit/len(e)*100)}%)")
    for k, v in c.most_common(): print(f"     {k:<10} {v}")

if __name__ == "__main__":
    main()
