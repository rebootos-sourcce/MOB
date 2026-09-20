#!/bin/sh
# Atuned / SOURCE build.
#
# The build is a concatenation and THE ORDER IS LOAD BEARING. Data before
# engine, engine before renderers, renderers before ui. A var referenced
# before its declaration throws at parse, and each of those costs a turn.
# MANIFEST is the canonical order. Nothing else may decide it.
set -e
cd "$(dirname "$0")"
OUT="${1:-../source.html}"
MODS=$(grep -v '^[[:space:]]*$' MANIFEST)

# every module must parse before any of them are joined
for f in $MODS; do
  case "$f" in *.js)
    node --check "$f" || { echo "parse failed: $f" >&2; exit 1; } ;;
  esac
done

# EVERY MODULE SAYS IT FINISHED.
#
# A build came back from the owner reporting that the script never reached the
# end of its own start up, with nothing thrown, on a current Chrome. Nothing
# thrown and not finished is a very small set of causes and guessing between
# them had already cost two rounds, so the build now records how far it got.
#
# One line after each module. The guard reads the last one and names it, which
# turns "it stopped somewhere" into "it stopped after engine/schema.js".
#
# Injected here rather than written into the modules, because a checkpoint a
# person has to remember to add is a checkpoint that is missing from the one
# module that needed it.
: > "$OUT"
for f in $MODS; do
  cat "$f" >> "$OUT"
  case "$f" in *.js)
    printf '\ntry{window.__at&&window.__at(%s);}catch(e){}\n' "'$f'" >> "$OUT" ;;
  esac
done

# WHICH BUILD THIS IS, STAMPED INTO THE FILE ITSELF.
#
# Two builds went out with a fix in them and the same failure came back both
# times, and there was no way to tell from this side whether the file being
# opened was the file that was sent. A browser saves a second download of the
# same name as atuned(1).html and leaves the first where it was, so "I opened
# the file" can mean last week's. The stamp settles that in one glance, on the
# one screen every person sees every time.
#
# It is written after the concatenation, so the placeholder cannot survive
# into a shipped file, and the check below fails the build if it does.
STAMP="$(git -C .. rev-parse --short HEAD 2>/dev/null || echo nogit)"
STAMP="$STAMP $(date -u +%Y-%m-%d\ %H:%M)"
python3 - "$OUT" "$STAMP" <<'PY2'
import io,sys
p,stamp=sys.argv[1],sys.argv[2]
s=io.open(p,encoding='utf-8').read()
if 'BUILD_STAMP' not in s:
    print('the build stamp placeholder is gone from the shell'); sys.exit(1)
s=s.replace('BUILD_STAMP',stamp)
# THE LENGTH IS WRITTEN LAST, AT A FIXED WIDTH, so writing it cannot change it.
# Substituting a number of a different length than the placeholder moves the
# total, which is a fixed point problem nobody needs: the placeholder is nine
# characters and the number is written zero padded to nine.
if 'BUILD_LEN' not in s:
    print('the end of file marker is gone from the shell'); sys.exit(1)
# BYTES, NOT CHARACTERS. The file carries an umlaut and a middle dot among
# other things, so a character count and a byte count differ by 177 here, and
# the number a browser and a download can both check is the byte count.
s=s.replace('BUILD_LEN','%09d'%len(s.encode('utf-8')))
io.open(p,'w',encoding='utf-8').write(s)
PY2

# the shell must close every div it opens
python3 - "$OUT" <<'PY'
import re,sys
s=open(sys.argv[1],encoding='utf-8').read()
d=0
for m in re.finditer(r'<div\b|</div>',s): d+= 1 if m.group(0)=='<div' else -1
if d: print('div balance %d, not 0'%d); sys.exit(1)
if '—' in s: print('em dash found'); sys.exit(1)
print('built %s  %d bytes  div balance 0  no em dashes'%(sys.argv[1],len(s)))
PY

# THE FUNNEL INHERITS THE APP'S TOKENS, and does it here so it cannot drift.
# The web funnel is a separate artifact from source.html, and the two have to
# look like one product. A palette copied by hand into a second file is
# correct on the day it is copied and wrong afterwards, and the first person
# to notice is somebody clicking through from the page to the app who sees the
# greens disagree. Regenerated on every build from the block above.
python3 ../tools/tokens.py
