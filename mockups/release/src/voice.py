"""Runs every line a person reads on these mockups through the house voice gate.
Run after shots.js:  python3 mockups/release/src/voice.py [path/to/check.py]
The lines are read off the pages during the shots (shots/measure.json), not typed
here, so a line that is on a page and not in this list cannot exist. Demo lines
(the status line that says "Demo:") are not product copy and are not on the pages
when the shots are taken. Prints each unique line with its verdict and exits 1 on
any hard failure."""
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
CHECK = sys.argv[1] if len(sys.argv) > 1 else '/home/user/MOB/.claude/skills/atuned-voice/check.py'
M = json.load(open(os.path.join(HERE, '..', 'shots', 'measure.json')))
seen = []
for k in sorted(M):
    for ln in M[k].get('lines', []):
        ln = ' '.join(ln.split())
        if ln and ln not in seen:
            seen.append(ln)
bad = 0
rows = []
for ln in seen:
    out = subprocess.run(['python3', CHECK, '--line', ln], capture_output=True, text=True,
                         cwd=os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(CHECK))))).stdout
    ok = 'no hard failures' in out
    if not ok:
        bad += 1
        fails = [l.strip() for l in out.splitlines() if l.strip().startswith('[')]
        rows.append(('FAIL', ln, '; '.join(fails)))
    else:
        rows.append(('pass', ln, ''))
for v, ln, why in rows:
    print(v, '|', ln, ('| ' + why) if why else '')
print(len(rows), 'lines,', len(rows) - bad, 'pass,', bad, 'fail')
sys.exit(1 if bad else 0)
