"""The engine must not reach for its host. Comments and string literals are
stripped before the check: a comment that names localStorage is not a call to
it, and the lexicon data legitimately contains the word window."""
import re,sys
s=open(sys.argv[1],encoding='utf-8').read()
s=re.sub(r'/\*.*?\*/','',s,flags=re.S)              # block comments
s=re.sub(r'(?m)^\s*//.*$','',s)                     # whole line comments
s=re.sub(r"'(?:\\.|[^'\\\n])*'",'""',s)             # single quoted
s=re.sub(r'"(?:\\.|[^"\\\n])*"','""',s)             # double quoted
s=re.sub(r'`(?:\\.|[^`\\])*`','""',s)               # template
BAD=(r'\b(document|window|navigator|localStorage|sessionStorage'
     r'|requestAnimationFrame|alert|fetch|XMLHttpRequest)\b|new\s+Image\b')
hits=[(s[:m.start()].count('\n')+1,m.group(0)) for m in re.finditer(BAD,s)]
if hits:
    for ln,tok in hits[:20]: print('  line %d  %s'%(ln,tok))
    print('engine reaches for the host, %d hits'%len(hits)); sys.exit(1)
print('engine is host free')
