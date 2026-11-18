"""The engine must not reach for its host. Comments and string literals are
stripped before the check: a comment that names localStorage is not a call to
it, and the lexicon data legitimately contains the word window."""
import re,sys
s=open(sys.argv[1],encoding='utf-8').read()
s=re.sub(r'/\*.*?\*/','',s,flags=re.S)              # block comments
s=re.sub(r'(?m)^\s*//.*$','',s)                     # whole line comments
# Strings and templates are walked in one pass, not three regexes, because the
# template regex blanked a whole template including its ${} slots, so
# `${document.cookie}` was scanned as "" and passed. A slot is code, not text:
# the literal text of a template is dropped, every slot is kept and scanned,
# and slots nest (a template inside a slot inside a template). Three regexes
# in sequence also cannot agree on where a literal starts: the quote passes ran
# first and paired the apostrophes in `don't ${fetch()} isn't` as a string,
# which hid the slot again. Newlines in template text are kept so a hit still
# reports its true line. An unterminated template or slot is left visible
# rather than dropped: a mis-lex here must fail the build, never hide code.
def lit(s,i=0,slot=False):
    out=[];depth=0;n=len(s)
    while i<n:
        c=s[i]
        if c in '\'"':
            j=i+1
            while j<n and s[j]!=c and s[j]!='\n': j+=2 if s[j]=='\\' else 1
            if j<n and s[j]==c: out.append('""'); i=j+1; continue
        elif c=='`':
            j=i+1; keep=['""']
            while j<n and s[j]!='`':
                if s[j]=='\\': j+=2
                elif s.startswith('${',j):
                    code,j=lit(s,j+2,True); keep.append(' '+code+' ')
                else:
                    if s[j]=='\n': keep.append('\n')
                    j+=1
            if j>=n: out.append(s[i:]); return ''.join(out),n
            out.append(''.join(keep)); i=j+1; continue
        elif slot and c=='{': depth+=1
        elif slot and c=='}':
            if depth==0: return ''.join(out),i+1
            depth-=1
        out.append(c); i+=1
    return ''.join(out),n
s=lit(s)[0]
# The audio and speech globals are bare names, not properties of window, so
# `new AudioContext()` or `new webkitSpeechRecognition()` inside engine/ passed
# this check until they were named here. SpeechRecognition matters most: in
# Chrome it is a NETWORK service that ships the microphone to the browser
# vendor, which is the one thing this product promises never happens.
# The same gap held for the other bare network and storage globals: a
# WebSocket, an EventSource, indexedDB and a worker's importScripts each reach
# off the device or into the browser store with no window in front of them,
# and globalThis is window under another name, so globalThis['fet'+'ch']
# walked past every name on this list. `self` is that too, but the engine uses
# it as an ordinary identifier, so it cannot be named here. Neither is `send`:
# every host send goes through a name already listed (XMLHttpRequest,
# WebSocket, navigator.sendBeacon), and the outbox's sanctioned pattern is a
# send function the host binds in, which the bare word would refuse.
BAD=(r'\b(document|window|navigator|localStorage|sessionStorage'
     r'|requestAnimationFrame|alert|fetch|XMLHttpRequest'
     r'|AudioContext|webkitAudioContext|speechSynthesis'
     r'|SpeechRecognition|webkitSpeechRecognition'
     r'|WebSocket|EventSource|indexedDB|importScripts|globalThis)\b'
     r'|new\s+Image\b')
hits=[(s[:m.start()].count('\n')+1,m.group(0)) for m in re.finditer(BAD,s)]
if hits:
    for ln,tok in hits[:20]: print('  line %d  %s'%(ln,tok))
    print('engine reaches for the host, %d hits'%len(hits)); sys.exit(1)
print('engine is host free')
