#!/usr/bin/env python3
"""
FIND
Search every piece of material in this project before asking Lance anything.

Usage:
  python3 pipeline/find.py "cluster family"
  python3 pipeline/find.py "coherent opposite" -c 300
  python3 pipeline/find.py --list
"""
import sys, re, pathlib, html

ROOT = pathlib.Path(__file__).resolve().parent.parent
SKIP = {".git", "__pycache__", "out", "node_modules"}
EXT = {".md", ".txt", ".html", ".py", ".json", ".patch", ".tsv", ".csv"}

def sources():
    for p in sorted(ROOT.rglob("*")):
        if not p.is_file() or p.suffix.lower() not in EXT: continue
        if any(s in p.parts for s in SKIP): continue
        if p.stat().st_size > 30_000_000: continue
        yield p

def text_of(p):
    t = p.read_text(encoding="utf-8", errors="ignore")
    if p.suffix.lower() == ".html":
        t = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", t, flags=re.S | re.I)
        t = html.unescape(re.sub(r"<[^>]+>", " ", t))
    return re.sub(r"[ \t]+", " ", t)

def main():
    argv = sys.argv[1:]
    ctx = 220
    if "-c" in argv:
        i = argv.index("-c")
        ctx = int(argv[i + 1])
        del argv[i:i + 2]          # drop the flag AND its value
    args = [a for a in argv if not a.startswith("-")]
    if "--list" in sys.argv:
        for p in sources():
            print(f"  {p.stat().st_size:>10,}  {p.relative_to(ROOT)}")
        return
    if not args:
        print(__doc__); return
    q = " ".join(args)
    pat = re.compile(q, re.I)
    total = 0
    for p in sources():
        t = text_of(p)
        hits = list(pat.finditer(t))
        if not hits: continue
        rel = p.relative_to(ROOT)
        print(f"\n### {rel}  ({len(hits)} hits)")
        for m in hits[:6]:
            s = re.sub(r"\s+", " ", t[max(0, m.start()-ctx//2): m.start()+ctx]).strip()
            print(f"    …{s}…")
        total += len(hits)
    print(f"\n{total} hits across the project." if total else "\nNOT FOUND anywhere in the project.")

if __name__ == "__main__":
    main()
