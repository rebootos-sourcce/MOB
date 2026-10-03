#!/usr/bin/env python3
"""Extract the design tokens from the app and write them for the funnel.

THE FUNNEL AND THE APP MUST LOOK LIKE ONE PRODUCT, and the only way that
survives a month of changes is for there to be one source. A palette copied by
hand into a second file is a palette that is correct on the day it is copied
and wrong afterwards, and nobody notices until a person clicks through from the
page to the app and the greens do not match.

So this reads the :root block out of atuned_src/shell/head.html, which is the
app's own stylesheet and the thing the six lightings and every gate are
measured against, and writes it to funnel/tokens.css. The funnel imports that.
Editing funnel/tokens.css by hand is the mistake this exists to prevent, so it
is written with a header saying so and the build overwrites it.

Comments are carried across deliberately. The arguments for these values are in
them, and a token stripped of its argument is a number somebody will change.
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC  = ROOT / 'atuned_src' / 'shell' / 'head.html'
OUT  = ROOT / 'funnel' / 'tokens.css'

s = SRC.read_text()

# the first :root block. It is opened at the end of a comment line, so the
# search is for the brace and the match runs to the first line that is a
# closing brace in column zero, which is how this stylesheet is written.
i = s.index(':root{')
j = s.index('\n}', i) + 2
block = s[i:j]

# Every declaration, and only declarations.
#
# Two mistakes were made here and both were caught by checking the output
# against the running app rather than by reading this code. First a line
# anchored regex found 25 tokens, because this stylesheet packs related ones
# onto a single line on purpose, the seven seat colours among them. Then the
# unanchored version found 45, one of which was --law-accent, which is not a
# token at all: it is named inside a comment on line 80 explaining why it was
# removed. A tool that counts a mention as a declaration is a tool that lies.
#
# So comments are stripped before names are counted. They stay in the written
# file, because the arguments for these values live in them and a token
# stripped of its argument is a number somebody will change.
bare  = re.sub(r'/\*.*?\*/', '', block, flags=re.S)
names = sorted(set(re.findall(r'(--[a-z0-9-]+)\s*:', bare)))
if len(names) < 20:
    sys.exit('refusing to write: only %d tokens found, the block shape changed'
             % len(names))

hdr = (
 '/* GENERATED. Do not edit.\n'
 '   Written by tools/tokens.py from atuned_src/shell/head.html, which is the\n'
 "   app's own stylesheet. The funnel and the app have to look like one\n"
 '   product, and a palette copied by hand is correct on the day it is copied\n'
 '   and wrong afterwards. Change a value in head.html and run the tool.\n'
 '   %d tokens. */\n' % len(names))

OUT.write_text(hdr + block + '\n')
print('wrote %s, %d tokens' % (OUT.relative_to(ROOT), len(names)))
