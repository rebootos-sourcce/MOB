#!/usr/bin/env python3
"""
CONTENT GATE
Every atomic unit passes these before a human sees it.
Ruled from HANDSHAKE.md voice rules and canon.

Usage:  python3 pipeline/gate.py units.json
        python3 pipeline/gate.py --text "some copy to check"
Exit 1 if any unit is REJECTED.
"""
import json, re, sys, pathlib

# Canon nerve names, parsed from the manuscript. An address not in here
# is an interpolated address, which is the one unforgivable defect.
NODES = json.loads((pathlib.Path(__file__).parent / "nodes.json").read_text())
NERVES = {n["nerve"].lower() for n in NODES}
CHARGES = {n["charge"].lower() for n in NODES}

# Band names and gross anatomy are legitimate in prose and are not node addresses.
BANDS_OK = {"solar plexus", "root", "sacral", "heart", "throat", "third eye",
            "crown", "brow", "cardiac plexus", "celiac plexus", "lumbar plexus",
            "pelvic plexus", "sacral plexus", "cervical plexus", "brachial plexus"}
ALLOWED_ADDR = NERVES | BANDS_OK

def _norm_addr(a):
    """Strip a leading article so 'The Vagus Nerve' matches 'Vagus Nerve'."""
    return re.sub(r"^(the|a|an)\s+", "", a.strip().lower())

# A unit carries a mechanism if it names body tissue or states a cause.
BODY_TERMS = ("nerve", "plexus", "ganglia", "cortex", "nucleus", "spine", "spinal",
              "breath", "breathing", "chest", "gut", "jaw", "throat", "shoulders",
              "body", "tissue", "muscle", "nervous system", "stress response",
              "vagus", "diaphragm", "pelvis", "hips", "brow", "heart rate",
              "cold", "tighten", "contract", "release", "charge", "node", "chakra")
CAUSAL_TERMS = ("because", "which is why", "so that", "the reason", "what happens",
                "the mechanism", "fires", "produces", "causes", "results in",
                "that is why", "which means", "comes from", "underneath")

BANNED_WORDS = ["apprehensive", "fearful", "panic-stricken", "sick of"]
SOFT_WELLNESS = ["holding space", "abundance", "manifest", "high vibration",
                 "divine feminine", "soul journey", "limitless potential"]

def check(unit):
    """Returns (verdict, [reasons]). REJECT halts. FLAG needs a human look."""
    text = unit.get("text", "")
    low = text.lower()
    rejects, flags = [], []

    # DASH GATE. Absolute. Has failed twice in this project already.
    if "—" in text or "&mdash;" in text or "&#8212;" in text:
        rejects.append("em dash present")

    # NODE COUNT GATE. Canon: 114, never 108.
    if re.search(r"\b108\b", text) and "node" in low:
        rejects.append("says 108 nodes, canon is 114")

    # ADDRESS GATE. Any nerve named must exist in the map.
    for m in re.finditer(r"\b((?:[A-Z][a-z]+[-\s]+)*[A-Z][a-z]+\s+(?:Plexus|Nerve|Ganglia|Cortex|Nucleus|Chain|Column|Axis|Branch|Branches|Roots))\b", text):
        if _norm_addr(m.group(1)) not in ALLOWED_ADDR:
            rejects.append(f"interpolated address: {m.group(1)}")

    # Node number must match its charge if both are given.
    nm = re.search(r"\bnode\s+(\d{1,3})\b", low)
    if nm:
        num = int(nm.group(1))
        if num > 114:
            rejects.append(f"node {num} out of range, map is 114")
        else:
            row = next((n for n in NODES if n["n"] == num), None)
            if row and row["charge"].lower() not in low:
                flags.append(f"node {num} is {row['charge']}, not named in text")

    # VOICE GATE.
    for w in BANNED_WORDS:
        if re.search(rf"\b{re.escape(w)}\b", low):
            rejects.append(f"banned word: {w}")
    for w in SOFT_WELLNESS:
        if w in low:
            flags.append(f"soft wellness language: {w}")

    sents = [s for s in re.split(r"[.!?]+", text) if s.strip()]
    if sents:
        longest = max(len(s.split()) for s in sents)
        if longest > 34:
            flags.append(f"longest sentence {longest} words, voice is short sentences")

    # SUBSTANCE GATE. Every post carries an address or a mechanism.
    has_addr = any(nv in low for nv in ALLOWED_ADDR) or bool(nm)
    has_mech = (any(k in low for k in BODY_TERMS)
                or any(k in low for k in CAUSAL_TERMS))
    if not (has_addr or has_mech):
        rejects.append("no address and no mechanism, this is inspiration")

    verdict = "REJECT" if rejects else ("FLAG" if flags else "PASS")
    return verdict, rejects + flags


def main():
    if len(sys.argv) > 2 and sys.argv[1] == "--text":
        v, r = check({"text": sys.argv[2]})
        print(v, "|", "; ".join(r) if r else "clean")
        return 0 if v != "REJECT" else 1

    units = json.loads(pathlib.Path(sys.argv[1]).read_text())
    counts = {"PASS": 0, "FLAG": 0, "REJECT": 0}
    for u in units:
        v, reasons = check(u)
        counts[v] += 1
        u["verdict"], u["gate_notes"] = v, reasons
        if v != "PASS":
            print(f"  {v:<7} [{u.get('type','?'):<11}] {u.get('title','')[:46]:<46} {'; '.join(reasons)}")
    pathlib.Path(sys.argv[1]).write_text(json.dumps(units, indent=1))
    total = sum(counts.values())
    print(f"\n  GATE: {counts['PASS']} pass, {counts['FLAG']} flag, {counts['REJECT']} reject, of {total}")
    return 1 if counts["REJECT"] else 0

if __name__ == "__main__":
    sys.exit(main())
