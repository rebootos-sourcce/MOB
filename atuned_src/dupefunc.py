"""Two modules can each define a function that works alone and still break the
build once concatenated: the second top-level declaration silently wins, so
which body actually runs is decided by MANIFEST order, not by anyone's intent.
Caught here, once, across every module, instead of once per instance of the
bug it causes downstream.

Comments and strings are stripped first, the same way hostfree.py does it, so
a function named inside a comment or a string is never mistaken for a real
declaration."""
import re,sys
def stripped(s):
    s=re.sub(r'/\*.*?\*/','',s,flags=re.S)
    s=re.sub(r'(?m)^\s*//.*$','',s)
    s=re.sub(r"'(?:\\.|[^'\\\n])*'",'""',s)
    s=re.sub(r'"(?:\\.|[^"\\\n])*"','""',s)
    s=re.sub(r'`(?:\\.|[^`\\])*`','""',s)
    return s
paths=[p for p in sys.argv[1:] if p.endswith('.js')]
seen={}
dupes=[]
count=0
for path in paths:
    s=stripped(open(path,encoding='utf-8').read())
    for m in re.finditer(r'(?m)^function\s+([A-Za-z_$][\w$]*)\s*\(',s):
        name=m.group(1); count+=1
        if name in seen:
            dupes.append((name,seen[name],path))
        else:
            seen[name]=path
if dupes:
    for name,first,second in dupes:
        if first==second:
            print('  %s declared twice in %s'%(name,first))
        else:
            print('  %s declared in both %s and %s'%(name,first,second))
    print('%d top-level function declared more than once'%len(dupes)); sys.exit(1)
print('%d top-level functions across %d modules, each declared once'%(count,len(paths)))
