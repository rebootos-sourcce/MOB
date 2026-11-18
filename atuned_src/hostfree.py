"""The engine must not reach for its host. Comments, string literals and
regular expression literals are blanked before the check: a comment that names
localStorage is not a call to it, and the lexicon data legitimately contains
the word window.

    python3 hostfree.py FILE         the check BUILD-engine.sh runs on engine.js
    python3 hostfree.py --self-test  the check held to planted cases

HOW IT READS A FILE, AND WHY IT IS A SCANNER AND NOT A CHAIN OF SUBSTITUTIONS.
It used to be five regular expression substitutions in a row. Each was right
alone and the order was wrong: a string holding a slash and a star ate the real
code up to the next star and slash; a quote inside a regular expression opened
a string that ran on to the next quote and hid whatever sat between; a comment
trailing a line of code was kept and read as code; and a template literal was
replaced whole, so a `${window.x}` or `${fetch(u)}` inside one passed, which is
the one hole that mattered, since a template expression is code. It also
removed the newlines of every block comment, so the line it printed was never
the line in the file. This reads the file once, left to right, the way the
language does:

    comments            blanked, newlines kept
    '...' and "..."     the text blanked, the quotes kept
    `...`               the text blanked, and every ${ ... } inside it is
                        read as code again, nested templates included
    /regex/flags        blanked. A slash starts one only where an operand is
                        expected and only if it closes on the same line, so a
                        division, or a slash that is not a regex at all, can
                        hide at most the rest of its own line

Every newline is kept, so the line a hit reports is the line in the file.

THE LOUD WAY TO BE WRONG. Where the scanner cannot tell a division from a
regular expression it reads a division, which leaves the text between two
slashes as code. That can only add a hit, never hide one, and a person who
sees it renames or rewrites the line. A guard that fails by saying nothing is
the failure this file exists to prevent.

THE NAMES. `self` is deliberately not on the list: the engine uses it as an
ordinary variable name and it matched hundreds of lines that touch nothing.
"""
import re, sys

# The audio and speech globals are bare names, not properties of window, so
# `new AudioContext()` or `new webkitSpeechRecognition()` inside engine/ passed
# this check until they were named here. SpeechRecognition matters most: in
# Chrome it is a NETWORK service that ships the microphone to the browser
# vendor, which is the one thing this product promises never happens.
# The second group is every other way a page reaches out of itself or keeps
# something past itself: sockets, workers, caches, the beacon, the recorder.
BAD = (r'\b(document|window|navigator|localStorage|sessionStorage'
       r'|requestAnimationFrame|alert|fetch|XMLHttpRequest'
       r'|AudioContext|webkitAudioContext|speechSynthesis'
       r'|SpeechRecognition|webkitSpeechRecognition'
       r'|WebSocket|EventSource|indexedDB|globalThis|caches|Worker'
       r'|BroadcastChannel|Notification|sendBeacon|postMessage'
       r'|MediaRecorder|OffscreenCanvas|matchMedia|MutationObserver)\b'
       r'|new\s+Image\b')

# After one of these a slash begins a regular expression, not a division.
_REGEX_AFTER = set('(,=:[!&|?{};+-*%<>~^')
_KEYWORDS = {'return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete',
             'void', 'throw', 'case', 'do', 'else', 'yield', 'await'}
_WORD = re.compile(r'[A-Za-z0-9_$]+')


def _blank(text):
    """Spaces for everything but newlines, so line numbers survive."""
    return ''.join(c if c == '\n' else ' ' for c in text)


def strip(src):
    """src with comments, string text and regular expressions blanked and
    template text blanked but its ${...} expressions kept as code."""
    out = []
    n = len(src)
    i = 0
    tpl = False        # inside the text of a template literal
    depth = []         # one brace count per ${ currently open
    last = ''          # last significant code character, '' at the start
    last2 = ''         # the one before it, to tell x++ / 2 from (+ /re/)
    word = ''          # the word that ended at last, when last is a word char
    while i < n:
        c = src[i]
        if tpl:
            if c == '\\':
                out.append(_blank(src[i:i + 2]))
                i += 2
            elif c == '`':
                out.append('`')
                tpl = False
                last, last2, word = '`', last, ''
                i += 1
            elif c == '$' and src[i + 1:i + 2] == '{':
                out.append('${')
                depth.append(1)
                tpl = False
                last, last2, word = '{', last, ''
                i += 2
            else:
                out.append(c if c == '\n' else ' ')
                i += 1
            continue
        if c in ' \t\r\n':
            out.append(c)
            i += 1
            continue
        if c == '/':
            nxt = src[i + 1:i + 2]
            if nxt == '/':
                j = src.find('\n', i)
                j = n if j < 0 else j
                out.append(_blank(src[i:j]))
                i = j
                continue
            if nxt == '*':
                j = src.find('*/', i + 2)
                j = n if j < 0 else j + 2
                out.append(_blank(src[i:j]))
                i = j
                continue
            operand_expected = (last == '' or last in _REGEX_AFTER
                                or (last == 'a' and word in _KEYWORDS))
            if last and last in '+-' and last2 == last:
                operand_expected = False      # x++ / 2, never a regex
            if operand_expected:
                j = i + 1
                in_class = False
                closed = False
                while j < n and src[j] != '\n':
                    d = src[j]
                    if d == '\\':
                        j += 2
                        continue
                    if d == '[':
                        in_class = True
                    elif d == ']':
                        in_class = False
                    elif d == '/' and not in_class:
                        closed = True
                        break
                    j += 1
                if closed:
                    k = j + 1
                    while k < n and (src[k].isalpha() or src[k] == '_'):
                        k += 1
                    out.append('/' + _blank(src[i + 1:j]) + '/' + _blank(src[j + 1:k]))
                    i = k
                    last, last2, word = '"', last, ''
                    continue
            out.append('/')
            last, last2, word = '/', last, ''
            i += 1
            continue
        if c in '\'"':
            j = i + 1
            while j < n and src[j] != c and src[j] != '\n':
                j += 2 if src[j] == '\\' else 1
            end = j + 1 if j < n and src[j] == c else j
            out.append(c + _blank(src[i + 1:j]) + (c if end > j else ''))
            i = end
            last, last2, word = '"', last, ''
            continue
        if c == '`':
            out.append('`')
            tpl = True
            i += 1
            continue
        m = _WORD.match(src, i)
        if m:
            out.append(m.group(0))
            word = m.group(0)
            last, last2 = 'a', last
            i = m.end()
            continue
        if depth:
            if c == '{':
                depth[-1] += 1
            elif c == '}':
                depth[-1] -= 1
                if depth[-1] == 0:
                    depth.pop()
                    out.append('}')
                    tpl = True
                    last, last2, word = '}', last, ''
                    i += 1
                    continue
        out.append(c)
        last, last2, word = c, last, ''
        i += 1
    return ''.join(out)


def scan(src):
    """[(line, token)] for every reach for the host in src, in file order."""
    s = strip(src)
    return [(s[:m.start()].count('\n') + 1, m.group(0)) for m in re.finditer(BAD, s)]


def check(path):
    hits = scan(open(path, encoding='utf-8').read())
    if hits:
        for ln, tok in hits[:20]:
            print('  line %d  %s' % (ln, tok))
        print('engine reaches for the host, %d hits' % len(hits))
        return 1
    print('engine is host free')
    return 0


# PLANTED CASES. Each is a small piece of source and what the guard must say
# about it. BAD ones must be caught, by name and on the right line; GOOD ones
# must pass. A case is written to fail a specific way of getting this wrong,
# and the way is named beside it, so a case that stops meaning anything is
# visible. Checked 17 November against the five substitution version this
# replaced: it missed every BAD case below marked MISSED BEFORE, or printed the
# wrong line for it, and it reported every GOOD case marked FALSE HIT BEFORE.
# The cases with no mark guard the scanner against its own likely mistakes, a
# division read as a regular expression above all; the old version passed them
# by having no idea what a regular expression was.
BAD_CASES = [
    # (name, source, [(line, token), ...])
    ('a window reference inside a template expression',
     'var s=`width ${window.innerWidth} px`;', [(1, 'window')]),                      # MISSED BEFORE
    ('a window reference after a nested template inside an expression',
     'var s=`a ${ `b` + window.x } d`;', [(1, 'window')]),                             # MISSED BEFORE
    ('a fetch inside a template expression inside a template expression',
     'var s=`a ${ `b ${fetch(u)} c` } d`;', [(1, 'fetch')]),
    ('a template expression after an apostrophe in the template text',
     "var s=`it's ${document.title} ok`;", [(1, 'document')]),                         # MISSED BEFORE
    ('a template expression holding braces of its own',
     'var s=`${ {a:1}.a + localStorage.length }`;', [(1, 'localStorage')]),            # MISSED BEFORE
    ('code between a string holding a slash star and one holding a star slash',
     "var a='/*'; window.x=1; var b='*/';", [(1, 'window')]),                          # MISSED BEFORE
    ('code after a regular expression that holds a quote',
     "var r=/'/; var t=fetch(u); var q='x';", [(1, 'fetch')]),                         # MISSED BEFORE
    ('a host name after a division, so the divisions are not a regex',
     'var a=b / c; window.y=1; var d=e / f;', [(1, 'window')]),
    ('a host name after a division by a bracket',
     'var a=b[0] / c; window.y=1; var d=e / f;', [(1, 'window')]),
    ('a host name after a division by a parenthesis',
     'var a=(b) / c; window.y=1; var d=e / f;', [(1, 'window')]),
    ('a host name after a division of a number',
     'var a=1 / 2; window.y=1; var d=e / f;', [(1, 'window')]),
    ('a host name after a postfix increment and a division',
     'i++ / 2; window.y=1; j-- / 3;', [(1, 'window')]),
    ('a host name after a slash that has no closing slash',
     'var a = / 2; window.y=1;', [(1, 'window')]),
    ('a host name on the next line after a slash that closes nowhere on its own line',
     'var a = / 2;\nwindow.y=1;\nvar d = e / f;', [(2, 'window')]),
    ('the real line after a multi line block comment',
     '/* one\n   two\n   three */\nvar t=navigator.language;', [(4, 'navigator')]),     # MISSED BEFORE (wrong line)
    ('the real line after a multi line template',
     'var s=`a\nb\nc`;\nrequestAnimationFrame(f);', [(4, 'requestAnimationFrame')]),  # MISSED BEFORE (wrong line)
    ('a host name after a comment that holds an apostrophe',
     "var a=1; // don't\nwindow.x=2;", [(2, 'window')]),
    ('a host name after a string with an escaped quote',
     "var a='it\\'s'; document.title='x';", [(1, 'document')]),
    ('new Image with extra space',
     'var i=new   Image();', [(1, 'new   Image')]),
    ('a socket', 'var w=new WebSocket(u);', [(1, 'WebSocket')]),                        # MISSED BEFORE
    ('a server sent event source', 'var e=new EventSource(u);', [(1, 'EventSource')]),  # MISSED BEFORE
    ('a database', 'indexedDB.open("x");', [(1, 'indexedDB')]),                        # MISSED BEFORE
    ('the global object', 'globalThis.x=1;', [(1, 'globalThis')]),                      # MISSED BEFORE
    ('a cache', 'caches.open("x");', [(1, 'caches')]),                                  # MISSED BEFORE
    ('a worker', 'var w=new Worker(u);', [(1, 'Worker')]),                              # MISSED BEFORE
    ('a broadcast channel', 'var b=new BroadcastChannel("x");', [(1, 'BroadcastChannel')]),  # MISSED BEFORE
    ('a notification', 'new Notification("x");', [(1, 'Notification')]),                # MISSED BEFORE
    ('a beacon', 'x.sendBeacon(u,d);', [(1, 'sendBeacon')]),                            # MISSED BEFORE
    ('a posted message', 'x.postMessage(d);', [(1, 'postMessage')]),                    # MISSED BEFORE
    ('a recorder', 'new MediaRecorder(s);', [(1, 'MediaRecorder')]),                    # MISSED BEFORE
    ('an offscreen canvas', 'new OffscreenCanvas(1,1);', [(1, 'OffscreenCanvas')]),     # MISSED BEFORE
    ('a media query', 'matchMedia("(x)");', [(1, 'matchMedia')]),                       # MISSED BEFORE
    ('a mutation observer', 'new MutationObserver(f);', [(1, 'MutationObserver')]),     # MISSED BEFORE
    ('speech recognition, the one that ships a microphone to a vendor',
     'var r=new webkitSpeechRecognition();', [(1, 'webkitSpeechRecognition')]),
    ('an audio context, a bare global', 'var a=new AudioContext();', [(1, 'AudioContext')]),
    ('storage', 'localStorage.setItem("a","b");', [(1, 'localStorage')]),
    ('two hits on two lines, in file order',
     'var a=window.x;\nvar b=fetch(u);', [(1, 'window'), (2, 'fetch')]),
]
GOOD_CASES = [
    # (name, source)
    ('host words inside single and double quoted strings',
     'var a="document and window"; var b=\'localStorage fetch\';'),
    ('host words inside a string with escaped quotes',
     "var a='it\\'s window'; var b=\"a \\\"document\\\" b\";"),
    ('host words in the plain text of a template',
     'var s=`the window is open, the document is shut`;'),
    ('host words in the plain text of a template, with an expression beside them',
     'var s=`the window is open ${a+b} and fetch is a word`;'),
    ('a string inside a template expression',
     "var s=`a ${'window'} b ${\"fetch\"} c`;"),
    ('host words in a whole line comment', '// uses window and fetch\nvar a=1;'),
    ('host words in a comment trailing code', 'var a=1; // reads window here\nvar b=2;'),   # FALSE HIT BEFORE
    ('host words in a multi line block comment',
     '/* the document\n   and the window\n   and fetch */\nvar a=1;'),
    ('a comment that holds a quote and a backtick',
     "// it's a `window`\nvar a=1;"),
    ('host words in a regular expression', 'var r=/window|document/g;'),                 # FALSE HIT BEFORE
    ('a regular expression with a slash in a character class', 'var r=/[/]window/;'),    # FALSE HIT BEFORE
    ('a regular expression with an escaped slash', 'var r=/a\\/window/i;'),              # FALSE HIT BEFORE
    ('a regular expression after return', 'function f(x){return /fetch/.test(x);}'),     # FALSE HIT BEFORE
    ('a regular expression after an open parenthesis', 'var a=s.replace(/window/g,"");'),  # FALSE HIT BEFORE
    ('a regular expression as an argument after a comma', 'f(a,/document/);'),           # FALSE HIT BEFORE
    ('names that only contain a host name',
     'var windowed=1, documentCount=2, prefetch=3, fetchAll=4, mywindow=5;'),
    ('self, which the engine uses as a variable', 'var self=this; self.x=1;'),
    ('a lexicon of words in an array', "var L=['window','door','fetch','document'];"),
    ('a division that is only a division', 'var a=b/c, d=(e+f)/g, h=i[0]/j, k=1/2;'),
    ('a template that spans lines, with a comment after it',
     'var s=`a\nwindow\nc`; // fetch\nvar t=1;'),                                         # FALSE HIT BEFORE
    ('an unterminated string stops at the line, and the next line is read',
     "var a='oops\nvar b=1;"),
]


def self_test():
    n = fails = 0

    def ok(cond, msg):
        nonlocal n, fails
        n += 1
        if not cond:
            fails += 1
        print(('  ok    ' if cond else '  FAIL  ') + msg)

    for name, src, want in BAD_CASES:
        got = scan(src)
        ok(got == want, 'caught: %s, got %s' % (name, got) if got == want
           else 'MISSED: %s, wanted %s, got %s' % (name, want, got))
    for name, src in GOOD_CASES:
        got = scan(src)
        ok(got == [], 'passes: %s' % name if got == []
           else 'FALSE HIT: %s, got %s' % (name, got))
    # the output must keep every newline, or the lines a hit reports drift
    sample = '/* a\nb */\nvar s=`x\ny ${z}\nw`;\n// c\nvar r=/a/;\n'
    ok(strip(sample).count('\n') == sample.count('\n'),
       'strip keeps every newline, so a reported line is the line in the file')
    ok(len(strip(sample)) == len(sample),
       'strip keeps every column, so a reported place is the place in the file')
    print('\n===== %d passed, %d failed =====' % (n - fails, fails))
    return 1 if fails else 0


if __name__ == '__main__':
    if len(sys.argv) == 2 and sys.argv[1] == '--self-test':
        sys.exit(self_test())
    if len(sys.argv) != 2:
        print('usage: hostfree.py FILE | hostfree.py --self-test')
        sys.exit(2)
    sys.exit(check(sys.argv[1]))
