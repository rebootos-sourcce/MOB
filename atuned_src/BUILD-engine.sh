#!/bin/sh
# The engine alone: no DOM, no renderers. Requireable from node, and the
# same file drops into a browser as a plain script.
set -e
cd "$(dirname "$0")"
OUT="${1:-../engine.js}"
MODS=$(grep '^engine/' MANIFEST)
for f in $MODS; do node --check "$f" || exit 1; done
cat $MODS > "$OUT"
# The guard is checked before it is trusted: a build whose host free check is
# itself broken has not shown the engine is host free. Only the last line is
# printed when it passes, and the failing cases when it does not.
st=$(python3 hostfree.py --self-test) || { printf '%s\n' "$st" | grep -v '^  ok'; exit 1; }
printf 'hostfree self test: %s\n' "$(printf '%s\n' "$st" | tail -n 1)"
python3 hostfree.py "$OUT"

node -e "var e=require('$OUT');console.log('engine ok, %d exports',Object.keys(e).length)"
