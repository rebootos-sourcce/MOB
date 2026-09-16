#!/bin/sh
# The engine alone: no DOM, no renderers. Requireable from node, and the
# same file drops into a browser as a plain script.
set -e
cd "$(dirname "$0")"
OUT="${1:-../engine.js}"
MODS=$(grep '^engine/' MANIFEST)
for f in $MODS; do node --check "$f" || exit 1; done
cat $MODS > "$OUT"
# it must not reach for a document
if grep -nE '\b(document|window|navigator|requestAnimationFrame|new Image)\b' "$OUT"; then
  echo "engine touches the DOM, see above" >&2; exit 1
fi
node -e "var e=require('$OUT');console.log('engine ok, %d exports',Object.keys(e).length)"
