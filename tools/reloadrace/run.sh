#!/bin/bash
# THE RELOAD RACE, REPRODUCED UNDER LOAD, 17 October.
#
# tools/reloadrace/run.sh N TAG [BUSY] [FILE]
#
# Cuts tests/functional.js down to its prelude, the six masks group (the
# stranger's overlay presses, kept across a reload) and the seat tone block
# (the tone switch, kept across a reload), every line of those as written,
# swaps tests/persist.js for persist-probe.js (the same answer, plus a timeline
# of what a second page sees) and adds init.js to every context (every store
# write and every long task, stamped). Then runs it N times against FILE
# (default source.html) with BUSY busy loops (default 4) pinning the cores,
# under the shared browser lock. Per run summary and every PROBE line go to
# $OUT/TAG.txt, each run's whole log to $OUT/TAG-runI.log, OUT defaulting to
# /tmp/reloadrace.
#
# It exists because "a flake" was the explanation on three heads in one day
# and the owner's rule is that a flake is not a cause.
H=$(cd "$(dirname "$0")" && pwd); R=$(cd "$H/../.." && pwd)
N=$1; T=$2; B=${3:-4}; F=$(readlink -f "${4:-$R/source.html}"); OUT=${OUT:-/tmp/reloadrace}
mkdir -p "$OUT"
python3 "$H/mkharness.py" "$R/tests/functional.js" "$OUT/harness-$T.js" "$R/tests" "$H/persist-probe.js" "$H/init.js" || exit 1
export NODE_PATH=${NODE_PATH:-/opt/node22/lib/node_modules}
cd "$R"
exec 9>/tmp/atuned-browser.lock; flock -w 3000 9 || exit 1
pids=""; for i in $(seq 1 "$B"); do node -e "for(;;){}" & pids="$pids $!"; done
trap "kill $pids 2>/dev/null" EXIT
: > "$OUT/$T.txt"
for i in $(seq 1 "$N"); do
  ATUNED_FILE="$F" timeout 900 node "$OUT/harness-$T.js" > "$OUT/$T-run$i.log" 2>&1
  echo "run $i exit $? $(grep -E '^=====' "$OUT/$T-run$i.log" | tail -1)" >> "$OUT/$T.txt"
  grep -E "FAIL|not ready|PROBE" "$OUT/$T-run$i.log" | cut -c1-600 >> "$OUT/$T.txt"
done
