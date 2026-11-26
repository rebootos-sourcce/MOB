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

# THE QUIZ CARRIES THIS FILE, 21 November. funnel/dist/atuned-quiz.html inlines
# ../engine.js, so a new engine.js with the old quiz beside it is a committed
# product its source does not build, and gates-fast fails it. Rebuilt here when
# the engine went to its committed place, so this script run alone, or after
# BUILD.sh in either order, never leaves the quiz an engine behind. A build to
# any other path leaves the funnel alone. ATUNED_NO_FUNNEL=1 skips it.
if [ "$OUT" = "../engine.js" ] && [ -z "${ATUNED_NO_FUNNEL:-}" ]; then ../funnel/BUILD-single.sh; fi
