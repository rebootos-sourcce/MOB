#!/bin/sh
# The engine alone: no DOM, no renderers. Requireable from node, and the
# same file drops into a browser as a plain script.
set -e
cd "$(dirname "$0")"
OUT="${1:-../engine.js}"
MODS=$(grep '^engine/' MANIFEST)
for f in $MODS; do node --check "$f" || exit 1; done
cat $MODS > "$OUT"

# THE GUARD IS CHECKED BEFORE IT IS TRUSTED. hostfree.py printed "engine is
# host free" over `${document.cookie}` and over a bare WebSocket, because it
# blanked template slots and did not carry the name, and nothing ever ran it
# against a case it should refuse. Every bad-*.js fixture must fail it and
# good.js, which names host words only in comments, strings and template
# text, must pass it, or the clean result below means nothing.
FX=../tests/fixtures/hostfree
for f in "$FX"/bad-*.js; do
  if python3 hostfree.py "$f" >/dev/null; then
    echo "hostfree.py passed a known violation: $f" >&2; exit 1
  fi
done
python3 hostfree.py "$FX/good.js" >/dev/null ||
  { echo "hostfree.py refused a clean fixture: $FX/good.js" >&2; exit 1; }

python3 hostfree.py "$OUT"

node -e "var e=require('$OUT');console.log('engine ok, %d exports',Object.keys(e).length)"
