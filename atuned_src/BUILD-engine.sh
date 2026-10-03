#!/bin/sh
# The engine alone: no DOM, no renderers. Requireable from node, and the
# same file drops into a browser as a plain script.
set -e
cd "$(dirname "$0")"
OUT="${1:-../engine.js}"
MODS=$(grep '^engine/' MANIFEST)
for f in $MODS; do node --check "$f" || exit 1; done
cat $MODS > "$OUT"
python3 hostfree.py "$OUT"

node -e "var e=require('$OUT');console.log('engine ok, %d exports',Object.keys(e).length)"
