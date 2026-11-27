#!/bin/sh
# SERVE THE REAL BUILD LOCALLY, OVER A REAL ORIGIN. Round of 29 October, his words: "I should
# be able to do all this local. I should not have to go to a pushed website. That's a problem."
#
# Opening source.html straight off disk sends the browser's origin as "null", and the voice
# server (reboot-os, atuned/server/src/index.js) has refused that origin since 16 October on
# purpose: a stranger's downloaded copy must not be able to spend the account's ElevenLabs
# budget, and nothing tells that copy apart from the owner's own. http://localhost is different:
# a stranger's browser never visits a local port on its own the way it opens a downloaded file,
# so the server now also accepts it (LOCAL_ORIGIN in reboot-os's index.js, 29 October). This
# script is the other half of that fix: it puts the build at an actual http://localhost address
# instead of file://, so the browser sends an origin the server will answer.
#
# Run from the repo root: ./tools/serve-local.sh [port]
# Then open http://localhost:<port>/source.html in a real browser. The voice, and anything
# else gated the same way, now works exactly as it does on atuned.world.
set -eu
PORT="${1:-8080}"
if [ ! -f source.html ]; then
  echo "run this from the repo root (no source.html here). Build first if you have not: ./atuned_src/BUILD-engine.sh && ./atuned_src/BUILD.sh" >&2
  exit 1
fi
echo "serving this repo at http://localhost:${PORT}/source.html"
echo "open that address in a real browser, not this terminal. Ctrl-C stops it."
exec python3 -m http.server "$PORT"
