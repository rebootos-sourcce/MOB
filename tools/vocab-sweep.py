#!/usr/bin/env python3
"""THE VOCABULARY SWEEP. Point, charge, whole, clarity and shadow.

The owner, 18 November, answering the need-you list on the status board:
"Change seat and chakra to just point. It's an assemblage point. You can call
it AP, or assemblage point for short, or point. We're going to use charge
instead of tension. And neither becoming or complete, we're going to use the
word whole. Instead of clear conduction against sabotage, just use clarity.
Grace against false light, just change that to grace. Oh, I see. Grace
against shadow. So use the word shadow."

A sweep by hand is done once, and several branches are building new screens
right now with the old words in them. So the sweep is this file: every
replacement the round classified, held as a rule, applied only inside the
strings a person reads or hears, and re-runnable on a merged tree.

WHAT IT TOUCHES AND WHAT IT DOES NOT. The Wisdom school rename (72a28def) set
the line: strings a person reads or hears change; identifiers, saved keys,
ids, css classes, file names and his own quoted words do not. So the file is
tokenised, never grepped. In a .js module only the contents of string and
template literals are looked at, never code and never a comment; in a shell
.html file only text between tags and the attributes a person reads (title,
aria-label, alt, placeholder, data-tip and its family), with its <script>
read as .js and its <style> skipped. Inside a literal a word that touches an
identifier character on either side (data-seat=, .seat, chr-seat, seatCol) is
code that happens to sit in a string, and is left.

    python3 tools/vocab-sweep.py            dry run: every change, and a count
    python3 tools/vocab-sweep.py --apply    write the changes
    python3 tools/vocab-sweep.py --list     every retired word still in a
                                            user facing string, ruled or not

It exits non zero when a retired word sits in a user facing string that no
rule covers and no exception names, which is a new string some branch wrote
with the old word in it. Give it a rule or an exception, with the reason.
It is idempotent: a second --apply changes nothing, because no rule's output
contains a retired word.
"""
import os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SRC = os.path.join(ROOT, 'atuned_src')

# ---------------------------------------------------------------- tokenising

KW_BEFORE_REGEX = {'return', 'typeof', 'case', 'do', 'else', 'in', 'of',
                   'new', 'delete', 'void', 'throw', 'instanceof', 'yield', 'await'}


def js_segments(src, base=0):
    """Yield (start, end) of the text inside every string and template literal
    in src, offsets into src plus base. Comments and regex literals are
    stepped over. A template's ${...} is read as code, recursively, so a
    literal inside it is found too, and the template's own text is yielded
    piece by piece around it."""
    i, n = 0, len(src)
    last = ''          # the last significant character or word, for regex vs divide
    out = []
    stack = []         # brace depth at each open ${ inside a template
    depth = 0
    in_tpl_resume = False

    def scan_template(i):
        # i is just past a backtick or a closing } of ${. Read text until `
        # or ${, yielding text pieces.
        start = i
        while i < n:
            c = src[i]
            if c == '\\':
                i += 2
                continue
            if c == '`':
                out.append((base + start, base + i))
                return i + 1, False
            if c == '$' and i + 1 < n and src[i + 1] == '{':
                out.append((base + start, base + i))
                return i + 2, True
            i += 1
        out.append((base + start, base + n))
        return n, False

    while i < n:
        c = src[i]
        if c in ' \t\r\n':
            i += 1
            continue
        if c == '/' and i + 1 < n and src[i + 1] == '/':
            j = src.find('\n', i)
            i = n if j < 0 else j
            continue
        if c == '/' and i + 1 < n and src[i + 1] == '*':
            j = src.find('*/', i + 2)
            i = n if j < 0 else j + 2
            continue
        if c in '\'"':
            j = i + 1
            while j < n and src[j] != c:
                if src[j] == '\\':
                    j += 1
                elif src[j] == '\n':
                    break
                j += 1
            out.append((base + i + 1, base + j))
            i = j + 1
            last = 'str'
            continue
        if c == '`':
            i, opened = scan_template(i + 1)
            if opened:
                stack.append(depth)
                depth += 1
                last = '('
            else:
                last = 'str'
            continue
        if c == '{':
            depth += 1
            last = c
            i += 1
            continue
        if c == '}':
            depth -= 1
            if stack and depth == stack[-1]:
                stack.pop()
                i, opened = scan_template(i + 1)
                if opened:
                    stack.append(depth)
                    depth += 1
                    last = '('
                else:
                    last = 'str'
                continue
            last = c
            i += 1
            continue
        if c == '/':
            if last in ('', 'str_op') or (len(last) == 1 and last in '(,=:[!&|?{};+-*%<>~^') or last in KW_BEFORE_REGEX:
                # a regex literal: step over it, classes included
                j = i + 1
                cls = False
                while j < n:
                    d = src[j]
                    if d == '\\':
                        j += 2
                        continue
                    if d == '[':
                        cls = True
                    elif d == ']':
                        cls = False
                    elif d == '/' and not cls:
                        break
                    elif d == '\n':
                        break
                    j += 1
                j += 1
                while j < n and src[j].isalpha():
                    j += 1
                i = j
                last = 'str'
                continue
            last = '/'
            i += 1
            continue
        m = re.match(r'[A-Za-z_$][\w$]*', src[i:i + 64])
        if m:
            w = m.group(0)
            last = w if w in KW_BEFORE_REGEX else 'id'
            i += len(w)
            continue
        if c.isdigit():
            m = re.match(r'[\w.]+', src[i:i + 64])
            i += len(m.group(0))
            last = 'id'
            continue
        last = c
        i += 1
    return out


READ_ATTRS = r'(?:title|aria-label|aria-description|alt|placeholder|data-tip[\w-]*|data-hint|data-tooltip|value)'


def html_segments(src):
    """Text between tags, the attributes a person reads, and every literal in
    each <script>. <style> and <!-- --> are skipped."""
    out = []
    i, n = 0, len(src)
    text_start = 0
    while i < n:
        if src.startswith('<!--', i):
            out.append((text_start, i))
            j = src.find('-->', i)
            i = n if j < 0 else j + 3
            text_start = i
            continue
        if src[i] == '<' and i + 1 < n and (src[i + 1].isalpha() or src[i + 1] == '/'):
            out.append((text_start, i))
            j = src.find('>', i)
            if j < 0:
                break
            tag = src[i:j + 1]
            for m in re.finditer(r'\s' + READ_ATTRS + r'\s*=\s*("([^"]*)"|\'([^\']*)\')', tag):
                g = 2 if m.group(2) is not None else 3
                out.append((i + m.start(g), i + m.end(g)))
            name = re.match(r'</?([A-Za-z][\w-]*)', tag).group(1).lower()
            i = j + 1
            if name in ('script', 'style') and not tag.startswith('</'):
                close = src.lower().find('</' + name, i)
                close = n if close < 0 else close
                if name == 'script':
                    out.extend(js_segments(src[i:close], i))
                i = close
            text_start = i
            continue
        i += 1
    out.append((text_start, n))
    return [(a, b) for a, b in out if b > a]


def segments(path, src):
    return html_segments(src) if path.endswith('.html') else js_segments(src)


# ---------------------------------------------------------------- the words

# Becoming and Complete are not here: both are ordinary English ("complete
# the intake") and only retire where they name the Avatar's percent, which
# the rules below name by pattern. Sabotage is not retired at all, it is the
# Clarity pair's other end and keeps its name.
RETIRED = re.compile(r'\b(seats?|chakras?|tension|clear conduction|false light)\b', re.I)
# A match is code sitting in a string when it touches an identifier character
# or one of these on either side: data-seat=, .seat, chr-seat, seat_k, #seat.
CODE_LEFT = re.compile(r'[\w$.#\-\[]$')
CODE_RIGHT = re.compile(r"^([\w$\-=(\]]|:[^\s']|:$)")


def is_code(seg, a, b):
    left, right = seg[max(0, a - 1):a], seg[b:b + 2]
    if left and CODE_LEFT.search(left):
        return True
    if right and CODE_RIGHT.match(right):
        return True
    # inside a class, id or data attribute that is not one a person reads
    pre = seg[:a]
    q = re.search(r'\b(class|id|for|name|data-(?!tip|hint|tooltip)[\w-]+|href|src|style)\s*=\s*(["\']?)([^"\'>]*)$', pre)
    if q and (q.group(2) == '' or q.group(2) not in q.group(3)):
        return True
    # a whole literal that is one bare lower case word is a key ('seat'),
    # unless a rule below names it
    if seg == seg[a:b] and seg[a:b].islower():
        return True
    return False


# ---------------------------------------------------------------- the rules
# Loaded from the table below. Each rule is (file glob or '*', pattern, repl,
# why). A pattern is a regex matched against the user facing text around the
# word; the first rule whose match covers the word's offset wins. KEEP rules
# have repl None: the word stays, for the reason given.

from fnmatch import fnmatch

RULES = []


def rule(files, pat, repl, why, force=False):
    """force: the word is display vocabulary held in a bare literal, which
    the code guard would otherwise skip as a key. Named per rule, never general."""
    RULES.append((files, re.compile(pat), repl, why, force))


def keep(files, pat, why):
    RULES.append((files, re.compile(pat), None, why, False))


exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'vocab-rules.py'), encoding='utf8').read())


def files():
    """Every module MANIFEST builds into the app, and the funnel's own
    sources, which are part of the site and are built into funnel/dist by
    funnel/BUILD-single.sh. Build products are never swept: they are rebuilt."""
    man = [l.strip() for l in open(os.path.join(SRC, 'MANIFEST'), encoding='utf8') if l.strip()]
    out = [os.path.join(SRC, f) for f in man]
    fun = os.path.join(ROOT, 'funnel')
    for f in sorted(os.listdir(fun)):
        if f.endswith('.html') or (f.endswith('.js') and not f.startswith('make-')):
            out.append(os.path.join(fun, f))
    return out


def plan(path, src):
    """Every rule match in a user facing segment, and every unruled retired
    word. Returns (edits, unruled, kept): edits are (start, end, new, why)."""
    rel = os.path.relpath(path, SRC) if path.startswith(SRC) else os.path.relpath(path, ROOT)
    edits, unruled, kept = [], [], []
    for a, b in segments(path, src):
        seg = src[a:b]
        taken = []
        for files_glob, pat, repl, why, force in RULES:
            if files_glob != '*' and not fnmatch(rel, files_glob):
                continue
            for m in pat.finditer(seg):
                s, e = m.span()
                if any(not (e <= t0 or s >= t1) for t0, t1 in taken):
                    continue
                # a rule never reaches into code that sits in a string
                if not force and any(is_code(seg, s + w.start(), s + w.end()) for w in RETIRED.finditer(m.group(0))):
                    continue
                taken.append((s, e))
                if repl is None:
                    kept.append((a + s, a + e, why))
                else:
                    new = repl(m) if callable(repl) else m.expand(repl)
                    if m.group(0)[:1].isupper() and new[:1].islower():
                        new = new[:1].upper() + new[1:]
                    if new != m.group(0):
                        edits.append((a + s, a + e, new, why))
        for m in RETIRED.finditer(seg):
            s, e = m.span()
            if any(t0 <= s and e <= t1 for t0, t1 in taken):
                continue
            if is_code(seg, s, e):
                continue
            unruled.append((a + s, a + e))
    return edits, unruled, kept


def line_of(src, off):
    return src.count('\n', 0, off) + 1


def ctx(src, a, b, w=60):
    return (src[max(0, a - w):a] + '[' + src[a:b] + ']' + src[b:b + w]).replace('\n', ' ')


def main():
    apply = '--apply' in sys.argv
    listing = '--list' in sys.argv
    n_edit = n_unruled = n_kept = 0
    for path in files():
        src = open(path, encoding='utf8').read()
        edits, unruled, kept = plan(path, src)
        rel = os.path.relpath(path, ROOT)
        for a, b, new, why in edits:
            n_edit += 1
            print('%s:%d  %r -> %r   (%s)' % (rel, line_of(src, a), src[a:b], new, why))
        for a, b in unruled:
            n_unruled += 1
            print('UNRULED %s:%d  %s' % (rel, line_of(src, a), ctx(src, a, b)))
        if listing:
            for a, b, why in kept:
                print('KEPT %s:%d  %s   (%s)' % (rel, line_of(src, a), ctx(src, a, b, 40), why))
        n_kept += len(kept)
        if apply and edits:
            out = []
            last = 0
            for a, b, new, why in sorted(edits):
                out.append(src[last:a])
                out.append(new)
                last = b
            out.append(src[last:])
            open(path, 'w', encoding='utf8').write(''.join(out))
    print('%s: %d changes, %d kept by a named exception, %d retired words with no rule'
          % ('applied' if apply else 'dry run', n_edit, n_kept, n_unruled))
    sys.exit(1 if n_unruled else 0)


if __name__ == '__main__':
    main()
