#!/bin/sh
# every proposed rewrite in DESIGN-tooltip-copy.md through the voice gate, one line at a time. run from the repo root.
while IFS= read -r L; do
 python3 .claude/skills/atuned-voice/check.py --line "$L" >/dev/null 2>&1 && r=pass || r=FAIL
 printf '%s  %s\n' "$r" "$L"
done < proto/tipcopy/lines.txt
