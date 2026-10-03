#!/usr/bin/env bash
# Every candidate string on copy.html, through both voice gates.
#
# It reads the strings off the page, by class="cand", so the check cannot
# drift from what the owner is shown. His raw note is on the page too and is
# deliberately not a candidate: said as he said it, "journey" fails both gates,
# and the page says so.
#
# Run from the repo root:   proto/funnel-copy/check.sh
# Exits non zero if any candidate fails either gate.
set -u
cd "$(dirname "$0")/../.."
fail=0
while IFS= read -r line; do
  [ -z "$line" ] && continue
  v=$(python3 .claude/skills/atuned-voice/check.py --line "$line" | grep -E "hard failure")
  r=$(node marketing/refuse.js "$line")
  printf '%-18s %-26s %s\n' "$(echo "$v" | sed 's/^ *//')" "$r" "$line"
  case "$v" in *"no hard failures"*) ;; *) fail=1 ;; esac
  case "$r" in passes*) ;; *) fail=1 ;; esac
done < <(python3 - <<'PY'
import re, html
s = open('proto/funnel-copy/copy.html', encoding='utf-8').read()
for m in re.finditer(r'<p class="cand[^"]*">(.*?)</p>', s, re.S):
    print(html.unescape(re.sub(r'<[^>]+>', '', m.group(1))).strip())
PY
)
exit $fail
