#!/usr/bin/env python3
"""
BUILD THE VOLUMES
Selects 9 pairs per volume from the addressed corpus and writes volume specs.

Charge text is Lance's, always. Install priority:
  1. Lance's own install, where the entry turns             (best)
  2. The axis install from the nine emotional architectures (canon)
  3. Flagged as PENDING                                     (never invented)
"""
import json, re, pathlib, sys
from collections import defaultdict
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from reframe import reframe

ROOT = pathlib.Path(__file__).resolve().parent.parent
E = json.loads((ROOT / "corpus/LETGO_ENTRY_INDEX.json").read_text())

VOLUMES = [
    ("ANXIETY", "Root",   "#6B1F1F", ["fear", "anxiety", "anxious", "worried", "nervous", "scared", "panic", "afraid"]),
    ("SHAME",   "Root",   "#A02E2E", ["shame", "ashamed", "embarrass", "humiliat", "guilt", "unworthy", "small"]),
    ("MONEY",   "Sacral", "#E06A0E", ["money", "finance", "broke", "scarcity", "poverty", "abundance", "invest"]),
    ("ANGER",   "Solar",  "#7A5406", ["anger", "angry", "rage", "resent", "hate", "pissed", "furious", "irritat"]),
    ("BURNOUT", "Solar",  "#8C7A45", ["exhaust", "burnout", "depleted", "tired", "drained", "overwhelm", "sick"]),
    ("DRIVE",   "Solar",  "#B0870C", ["procrast", "lazy", "stall", "avoid", "momentum", "complete", "finish", "commit"]),
    ("WORTH",   "Solar",  "#D2A410", ["worth", "value", "deserv", "confidence", "esteem", "enough", "prove"]),
    ("GRIEF",   "Heart",  "#1B6353", ["grief", "grieving", "loss", "mourn", "sad", "abandon", "heartbreak", "lonely"]),
    ("VOICE",   "Throat", "#12708F", ["voice", "speak", "truth", "silence", "express", "say", "heard", "deception"]),
    ("CONTROL", "Solar",  "#6E4A0A", ["control", "grip", "force", "rigid", "vigilan", "resist", "manage"]),
    ("DUTY",    "Crown",  "#4A4C5E", ["duty", "responsib", "obligat", "purpose", "word", "honor", "integrity", "commit"]),
]

AXIS_INSTALL = {
 "Fear":    ("Safety",     "I am safe in this body. I am grounded in this moment. The ground holds me. The threat has passed."),
 "Anger":   ("Calm",       "I have power available without force. I can see the options clearly. I move with discernment, not pressure."),
 "Shame":   ("Worth",      "I am worthy of taking up space. I am worthy of being seen. My worth is not earned through performance."),
 "Disgust": ("Acceptance", "What is here is what is here. I can be present with it without contracting. I can engage without rejection."),
 "Grief":   ("Renewal",    "I can move forward from here. What was, was. What is, is. My chest can expand fully."),
 "Apathy":  ("Joy",        "My will is active and available. My shoulders are open. My throat is clear. The point is here."),
 "Sad":     ("Happy",      "What I have is real. What is here now is enough to work with. Joy is available."),
}

def score(entry, keys):
    blob = (entry["entry"] + " " + entry["text"][:700]).lower()
    return sum(blob.count(k) for k in keys)

# Each volume sits on one axis. The replacement is the axis's coherent pole.
VOL_AXIS = {
 "ANXIETY":"Fear", "SHAME":"Shame", "MONEY":"Disgust", "ANGER":"Anger",
 "BURNOUT":"Apathy", "DRIVE":"Apathy", "WORTH":"Shame", "GRIEF":"Grief",
 "VOICE":"Apathy", "CONTROL":"Fear", "DUTY":"Sad",
}
VOL_STATE = {
 "ANXIETY":"Steadiness","SHAME":"Worth","MONEY":"Flow","ANGER":"Calm",
 "BURNOUT":"Restoration","DRIVE":"Momentum","WORTH":"Value","GRIEF":"Renewal",
 "VOICE":"Expression","CONTROL":"Trust","DUTY":"Devotion",
}

def install_for(x, volume=None):
    if x.get("install_text"):
        return x["install_text"], "LANCE"
    band = (x.get("derived_address") or {}).get("band") or "Root"
    r = reframe(x["text"], x["entry"], band, VOL_STATE.get(volume, "Steadiness"))
    if len(r.split()) >= 24:
        return r, "REFRAME"
    ax = VOL_AXIS.get(volume)
    if ax and ax in AXIS_INSTALL:
        return AXIS_INSTALL[ax][1], "AXIS"
    return "[INSTALL PENDING]", "PENDING"

def main():
    pool = [x for x in E if x["address_tier"] != "NONE" and len(x["text"].split()) >= 40]
    used, specs = set(), []
    for name, band, field, keys in VOLUMES:
        ranked = sorted(
            [x for x in pool if id(x) not in used],
            key=lambda x: (-score(x, keys), 0 if x.get("install_text") else 1, abs(len(x["text"].split()) - 110)))
        picks = [x for x in ranked if score(x, keys) > 0][:9]
        if len(picks) < 9:
            picks += [x for x in ranked if x not in picks][:9 - len(picks)]
        for p in picks: used.add(id(p))
        specs.append({"volume": name, "band": band, "field": field, "picks": picks})
    out = ROOT / "generator/volumes"
    out.mkdir(parents=True, exist_ok=True)
    report = []
    for s in specs:
        srcs = [install_for(p, s["volume"])[1] for p in s["picks"]]
        report.append((s["volume"], len(s["picks"]),
                       srcs.count("LANCE"), srcs.count("AXIS"), srcs.count("PENDING")))
    print(f"{'VOLUME':<10}{'PAIRS':>6}{'LANCE':>7}{'AXIS':>6}{'PENDING':>9}")
    for r in report:
        print(f"{r[0]:<10}{r[1]:>6}{r[2]:>7}{r[3]:>6}{r[4]:>9}")
    json.dump([{**{k: v for k, v in s.items() if k != "picks"},
                "picks": [{"entry": p["entry"], "words": len(p["text"].split()),
                           "tier": p["address_tier"]} for p in s["picks"]]} for s in specs],
              open(ROOT / "pipeline/selection.json", "w"), indent=1)
    return specs

if __name__ == "__main__":
    main()


# ----------------------------------------------------------------------
def write_specs(specs):
    """Emit generator-ready JSON, schema derived from build_volume.py."""
    nodes = json.loads((ROOT / "pipeline/nodes.json").read_text())
    bynerve = {n["nerve"].lower(): n for n in nodes}
    out = ROOT / "generator/volumes"; out.mkdir(parents=True, exist_ok=True)
    AUTHOR = ("Lance Powell is a somatic engineer. Thirty years a creative director in film "
              "and games, on Oscar, Emmy and Game of the Year winning teams. He co-authored "
              "peer-reviewed work in Endoscopy, Thieme.")
    EV = {"title": "The Evidence", "body": [
        "Powell L, Guzik P. Endoscopy, Thieme. DOI 10.1055/a-2013-1820.",
        "A co-authored peer-reviewed publication with a named physician.",
        "Three credentialed physicians have reviewed this work and recommended clinical trials."]}
    HOW = ["Recognise your awareness as the witness of the experience.",
           "Read without taking the words personally. They are mirrors, not judgments.",
           "When emotion rises, do not resist it. Resistance is the block.",
           "Observe the sensation without labelling it.",
           "Breathe with the energy.",
           "Turn the senses inward and feel what the body does as the emotion moves.",
           "Stay with it until the charge drops.",
           "Read the replacement aloud.",
           "Let the new state settle before you stand up."]
    written = []
    for s in specs:
        vol, state = s["volume"], VOL_STATE[s["volume"]]
        pairs = []
        for x in s["picks"]:
            d = x.get("derived_address") or {}
            addr = d.get("address") or x.get("address") or ""
            n = bynerve.get(str(addr).lower())
            foot = (f"node {n['n']} · {n['nerve']} · {n['plain']}" if n
                    else f"{addr} · {x['address_tier'].lower()}")
            itext, isrc = install_for(x, vol)
            pairs.append({
                "runhead": x["entry"].upper()[:26],
                "charge": x["entry"].strip().rstrip('.')[:30],
                "install": state,
                "charge_text": x.get("charge_text") or x["text"],
                "install_text": itext,
                "charge_impact": "[impact pending, four physical observations]",
                "install_impact": "[impact pending, four physical observations]",
                "foot": foot,
                "saboteur_line": "",
                "_source": f"LANCE DICTATION. address {x['address_tier']}. install {isrc}.",
            })
        spec = {
            "volume": vol, "year": 2026, "band": s["band"], "field": s["field"],
            "section": "The Nine Charges",
            "circuit_title": f"The {s['band']} Circuit",
            "energy_title": f"{s['band']} Energy",
            "energy": ["[ENERGY PAGE PENDING. Author dictation.]"],
            "affirmation": f"I am {state.lower()}.",
            "author": AUTHOR, "evidence": EV,
            "back_cover": "[BACK COVER PENDING. Author dictation.]",
            "front": {
                "preface": "[PREFACE PENDING. Author dictation.]",
                "circuit": "[CIRCUIT PAGE PENDING. Author dictation.]",
                "howto_intro": ("Letting go is the deliberate integration of what the body "
                                "learned and never unlearned. Read it slowly. Do not perform it."),
                "howto_steps": HOW},
            "pairs": pairs,
            "_built": "pipeline/build_volumes.py. Charges are the author's dictation.",
        }
        f = out / f"{vol.lower()}.json"
        f.write_text(json.dumps(spec, indent=1, ensure_ascii=False))
        written.append(f.name)
    return written


if __name__ == "__main__":
    import sys
    specs = main()
    if "--write" in sys.argv:
        w = write_specs(specs)
        print(f"\nwrote {len(w)} volume specs: {', '.join(w)}")
