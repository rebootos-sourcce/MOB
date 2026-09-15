#!/usr/bin/env python3
"""
SCHEDULER
Turns gated units into a dated posting calendar per channel.
Cadence from GO_TO_MARKET/02_PIPELINE.md section 4.

Usage: python3 pipeline/schedule.py [weeks] > pipeline/calendar.md
"""
import json, sys, pathlib, datetime, itertools

WEEKS = int(sys.argv[1]) if len(sys.argv) > 1 else 12
HERE = pathlib.Path(__file__).parent
units = [u for u in json.loads((HERE / "units.json").read_text())
         if u.get("verdict") == "PASS"]

# channel -> (posts per week, preferred unit types in priority order)
CADENCE = {
 "linkedin":  (4, ["correction", "mechanism", "case", "evidence"]),
 "instagram": (5, ["address", "case", "correction"]),
 "tiktok":    (4, ["address"]),
 "threads":   (3, ["correction", "address", "mechanism"]),
 "substack":  (2, ["mechanism", "case", "correction", "evidence"]),
}
START = datetime.date.today() + datetime.timedelta(days=(7 - datetime.date.today().weekday()) % 7 or 7)

pools = {}
for ch, (_, types) in CADENCE.items():
    ordered = []
    for t in types:
        ordered += [u for u in units if u["type"] == t and ch in u.get("channels", [])]
    pools[ch] = itertools.cycle(ordered) if ordered else None

print(f"# POSTING CALENDAR\n**{WEEKS} weeks from {START.isoformat()}. "
      f"Generated from {len(units)} gated units.**\n")
print("Every unit has passed the content gate. Nothing here needs writing, "
      "only approval.\n\n---\n")

used = {ch: set() for ch in CADENCE}
for w in range(WEEKS):
    wk = START + datetime.timedelta(weeks=w)
    print(f"\n## Week {w+1} · {wk.isoformat()}\n")
    print("| Day | Channel | Type | Unit | Source |")
    print("|---|---|---|---|---|")
    for ch, (n, _) in CADENCE.items():
        if not pools[ch]: continue
        for i in range(n):
            u = next(pools[ch])
            day = (wk + datetime.timedelta(days=(i * 7) // max(n, 1))).strftime("%a")
            print(f"| {day} | {ch} | {u['type']} | {u['title']} | {u['source']} |")
            used[ch].add(u["title"])

print(f"\n---\n\n## Coverage\n")
print("| Channel | Posts/wk | Distinct units used |")
print("|---|---|---|")
for ch, (n, _) in CADENCE.items():
    print(f"| {ch} | {n} | {len(used[ch])} |")
total = sum(n for n, _ in CADENCE.values()) * WEEKS
print(f"\n**{total} posts scheduled across {WEEKS} weeks from {len(units)} units, "
      f"none of them newly written.**")
