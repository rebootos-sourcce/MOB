#!/bin/sh
# proto/lean/lean.html, standalone. The engine is inlined rather than copied by
# hand, and the md5 of the engine it was built from is printed on the page, so a
# page that has drifted from the build says so instead of looking current.
#
# Run from the repo root or from anywhere. Needs engine.js, which
# atuned_src/BUILD-engine.sh writes.
set -e
cd "$(dirname "$0")/../.."
[ -f engine.js ] || { echo "engine.js is missing. run ./atuned_src/BUILD-engine.sh"; exit 1; }
node proto/lean/build.js
echo "proto/lean/lean.html  $(wc -c < proto/lean/lean.html) bytes"
