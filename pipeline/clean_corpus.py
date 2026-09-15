#!/usr/bin/env python3
"""
CLEAN THE CORPUS
Repairs the transcription corruption in the Let Go dictation.

The handshake records that the transcription was corrupted in roughly thirty
distinct ways. These are the ones measured in the actual files, with counts.
Every repair is a word the speech engine misheard, not an edit to Lance.

Usage: python3 pipeline/clean_corpus.py [--report]
"""
import re, json, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

# word-boundary repairs, measured from the files
REPAIRS = [
    (r"\bbleeding\b", "believing"),        # 150
    (r"\bproceeding\b", "perceiving"),     # 35
    (r"\bparking out\b", "blocking out"),
    (r"\bwalking out\b", "blocking out"),
    (r"\bI'?m going to go believ", "I'm letting go of believ"),
    (r"\bI want to go believ", "I'm letting go of believ"),
    (r"\bI'?m going to go bleeding\b", "I'm letting go of believing"),
    (r"\bletting Go\b", "letting go"),
    (r"\bLetting Go\b", "letting go"),
    (r"\bI;m\b", "I'm"), (r"\bI';m\b", "I'm"), (r"\bI;n\b", "I'm"),
    (r"\bi;m\b", "I'm"), (r"\bIm\b", "I'm"),
    (r"\bactive feeling\b", "acting feeling"),
    (r"\bsing voicing\b", "saying voicing"),
    (r"\band doing a\b", "and doing"),
    (r"\bal\s*$", ""),
]

def clean(t):
    for pat, rep in REPAIRS:
        t = re.sub(pat, rep, t, flags=re.I if pat.startswith(r"\bI'?m going") else 0)
    return re.sub(r"\s+", " ", t).strip()

def main():
    idx = ROOT / "corpus/LETGO_ENTRY_INDEX.json"
    e = json.loads(idx.read_text())
    before = sum(len(re.findall(r"\b(bleeding|proceeding|I;m)\b", x["text"])) for x in e)
    for x in e:
        x["text_raw"] = x.get("text_raw", x["text"])
        x["text"] = clean(x["text_raw"])
    after = sum(len(re.findall(r"\b(bleeding|proceeding|I;m)\b", x["text"])) for x in e)
    idx.write_text(json.dumps(e, indent=1))
    print(f"  corruption tokens: {before} -> {after}")
    print(f"  entries cleaned  : {len(e)}")
    if "--report" in sys.argv:
        for x in e[:3]:
            print("\n  BEFORE:", x["text_raw"][:150])
            print("  AFTER :", x["text"][:150])

if __name__ == "__main__":
    main()
