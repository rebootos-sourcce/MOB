#!/bin/sh
# Atuned / SOURCE build.
#
# The build is a concatenation and THE ORDER IS LOAD BEARING. Data before
# engine, engine before renderers, renderers before ui. A var referenced
# before its declaration throws at parse, and each of those costs a turn.
# MANIFEST is the canonical order. Nothing else may decide it.
set -e
cd "$(dirname "$0")"
OUT="${1:-../source.html}"
MODS=$(grep -v '^[[:space:]]*$' MANIFEST)

# every module must parse before any of them are joined
for f in $MODS; do
  case "$f" in *.js)
    node --check "$f" || { echo "parse failed: $f" >&2; exit 1; } ;;
  esac
done

cat $MODS > "$OUT"

# the shell must close every div it opens
python3 - "$OUT" <<'PY'
import re,sys
s=open(sys.argv[1],encoding='utf-8').read()
d=0
for m in re.finditer(r'<div\b|</div>',s): d+= 1 if m.group(0)=='<div' else -1
if d: print('div balance %d, not 0'%d); sys.exit(1)
if '—' in s: print('em dash found'); sys.exit(1)
print('built %s  %d bytes  div balance 0  no em dashes'%(sys.argv[1],len(s)))
PY
