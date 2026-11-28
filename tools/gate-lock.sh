#!/usr/bin/env bash
# Serializes heavy, browser-driven gates (functional.js, design.js, boot.js,
# monitor.js, or anything else that launches Chromium) across every build
# running on this shared machine at once.
#
# Root cause, found 28 November: every browser gate tonight was launched
# independently by whichever build wanted it next, with no shared
# coordination between them. Five to eight Chromium-driven test runs piled
# up on one 15GB box at the same time, the kernel OOM-killed them mid-run,
# and each kill cost a full wasted retry that produced nothing. Checking
# `uptime`/`ps aux | grep chrome` by hand before each attempt, the pattern
# every build used tonight, is a convention a build can forget or race
# another build against; a lock is not. This makes "wait your turn"
# automatic at the OS level instead of something every agent has to
# remember to do.
#
# Usage: tools/gate-lock.sh node tests/functional.js
#        tools/gate-lock.sh node tests/design.js
#        tools/gate-lock.sh node tools/monitor.js
#
# A second caller on this box blocks here, queued, until the first one
# finishes or GATE_LOCK_TIMEOUT (seconds, default 1800) runs out; on
# timeout this exits 1, measured, rather than hanging forever or running
# anyway. Proven 28 November: two overlapping callers, the second starting
# 0.3s into the first's 2s hold, measured a real 1.7s wait and a combined
# 2.2s wall time (serialized, not run together); a third caller with a 1s
# timeout against a 5s holder measured exit code 1, not a guess.
set -euo pipefail

LOCK_FILE="/tmp/mob-browser-gate.lock"
TIMEOUT_SECONDS="${GATE_LOCK_TIMEOUT:-1800}"

if [ "$#" -eq 0 ]; then
  echo "usage: $(basename "$0") <command> [args...]" >&2
  exit 1
fi

exec flock --timeout "$TIMEOUT_SECONDS" --verbose "$LOCK_FILE" "$@"
